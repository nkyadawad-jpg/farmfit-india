/**
 * FARMFIT Centralized Weather Service
 * Manages weather providers, client-side caching, rate-limit protection, and unified error dispatch
 */

import {
  WeatherData,
  WeatherDataQuality,
  WeatherAlertThresholds,
  DEFAULT_WEATHER_ALERT_THRESHOLDS
} from '../../types/weather';
import { IWeatherProvider, OpenMeteoWeatherProvider } from './weatherProvider';

interface CachedEntry {
  key: string;
  data: WeatherData;
  timestamp: number; // ms
}

export class WeatherService {
  private static instance: WeatherService;
  private providers: Map<string, IWeatherProvider> = new Map();
  private activeProviderId: string = 'open-meteo';
  private memoryCache: Map<string, CachedEntry> = new Map();
  private cacheTtlMs: number = 15 * 60 * 1000; // 15 minutes TTL

  private constructor() {
    // Register default Open-Meteo provider
    const openMeteo = new OpenMeteoWeatherProvider();
    this.registerProvider(openMeteo);
  }

  public static getInstance(): WeatherService {
    if (!WeatherService.instance) {
      WeatherService.instance = new WeatherService();
    }
    return WeatherService.instance;
  }

  /**
   * Register a new weather provider (e.g. Open-Meteo, IMD, etc.)
   */
  public registerProvider(provider: IWeatherProvider): void {
    this.providers.set(provider.id, provider);
  }

  /**
   * Set the active provider
   */
  public setActiveProvider(providerId: string): void {
    if (!this.providers.has(providerId)) {
      throw new Error(`Weather provider '${providerId}' is not registered.`);
    }
    this.activeProviderId = providerId;
  }

  public getActiveProvider(): IWeatherProvider {
    const provider = this.providers.get(this.activeProviderId);
    if (!provider) {
      const fallback = new OpenMeteoWeatherProvider();
      this.registerProvider(fallback);
      return fallback;
    }
    return provider;
  }

  public getActiveProviderName(): string {
    return this.getActiveProvider().name;
  }

  /**
   * Create cache key from rounded coordinates
   */
  private makeCacheKey(lat: number, lon: number): string {
    return `${lat.toFixed(4)},${lon.toFixed(4)}`;
  }

  /**
   * Check if client cache has fresh data for coordinates
   */
  public getCachedWeather(latitude?: number, longitude?: number): WeatherData | null {
    if (typeof latitude !== 'number' || typeof longitude !== 'number' || isNaN(latitude) || isNaN(longitude)) {
      return null;
    }

    const key = this.makeCacheKey(latitude, longitude);
    const entry = this.memoryCache.get(key);

    if (entry) {
      const age = Date.now() - entry.timestamp;
      if (age < this.cacheTtlMs) {
        return {
          ...entry.data,
          quality: {
            ...entry.data.quality,
            dataFreshness: 'RECENT_CACHE'
          }
        };
      }
    }

    // Try sessionStorage fallback
    try {
      if (typeof window !== 'undefined' && window.sessionStorage) {
        const stored = window.sessionStorage.getItem(`farmfit_weather_${key}`);
        if (stored) {
          const parsed: CachedEntry = JSON.parse(stored);
          const age = Date.now() - parsed.timestamp;
          if (age < this.cacheTtlMs) {
            this.memoryCache.set(key, parsed);
            return {
              ...parsed.data,
              quality: {
                ...parsed.data.quality,
                dataFreshness: 'RECENT_CACHE'
              }
            };
          }
        }
      }
    } catch {
      // Ignore storage errors
    }

    return null;
  }

  /**
   * Fetch weather with caching, validation and error handling
   */
  public async fetchWeather(
    latitude?: number,
    longitude?: number,
    forceRefresh: boolean = false,
    thresholds: WeatherAlertThresholds = DEFAULT_WEATHER_ALERT_THRESHOLDS
  ): Promise<WeatherData> {
    // 1. Validate coordinates
    if (
      typeof latitude !== 'number' || 
      typeof longitude !== 'number' || 
      isNaN(latitude) || 
      isNaN(longitude)
    ) {
      const errorQuality: WeatherDataQuality = {
        sourceAvailable: false,
        dataFreshness: 'UNAVAILABLE',
        coordinateValidity: 'MISSING',
        missingVariables: ['latitude', 'longitude'],
        apiStatus: 'NO_COORDINATES',
        errorMessage: 'Weather cannot be retrieved because farm coordinates are unavailable.'
      };

      throw {
        isFarmfitWeatherError: true,
        quality: errorQuality,
        message: 'Weather cannot be retrieved because farm coordinates are unavailable.'
      };
    }

    if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
      const errorQuality: WeatherDataQuality = {
        sourceAvailable: false,
        dataFreshness: 'UNAVAILABLE',
        coordinateValidity: 'INVALID',
        missingVariables: [],
        apiStatus: 'NO_COORDINATES',
        errorMessage: `Coordinates out of bounds: lat ${latitude}, lon ${longitude}`
      };

      throw {
        isFarmfitWeatherError: true,
        quality: errorQuality,
        message: 'Invalid coordinate range for farm location.'
      };
    }

    const cacheKey = this.makeCacheKey(latitude, longitude);

    // 2. Check cache if not forcing refresh
    if (!forceRefresh) {
      const cached = this.getCachedWeather(latitude, longitude);
      if (cached) {
        return cached;
      }
    }

    // 3. Request fresh forecast from active provider
    const provider = this.getActiveProvider();
    try {
      const freshData = await provider.fetchForecast(latitude, longitude, thresholds);
      
      // Store in memory cache
      const entry: CachedEntry = {
        key: cacheKey,
        data: freshData,
        timestamp: Date.now()
      };
      this.memoryCache.set(cacheKey, entry);

      // Persist in session storage
      try {
        if (typeof window !== 'undefined' && window.sessionStorage) {
          window.sessionStorage.setItem(`farmfit_weather_${cacheKey}`, JSON.stringify(entry));
        }
      } catch {
        // Ignore storage quotas
      }

      return freshData;
    } catch (err: any) {
      let apiStatus: WeatherDataQuality['apiStatus'] = 'NETWORK_ERROR';
      let userMsg = 'Weather service temporarily unavailable. Please try again later.';

      if (err.message?.includes('rate limit') || err.message?.includes('429')) {
        apiStatus = 'RATE_LIMITED';
        userMsg = 'Weather API rate limit exceeded. Please wait a moment and try again.';
      } else if (err.message?.includes('timed out') || err.message?.includes('AbortError')) {
        apiStatus = 'NETWORK_ERROR';
        userMsg = 'Weather request timed out. Please verify your internet connection.';
      } else if (err.message?.includes('Malformed')) {
        apiStatus = 'INVALID_RESPONSE';
        userMsg = 'Weather service returned an unexpected data structure.';
      }

      const quality: WeatherDataQuality = {
        sourceAvailable: false,
        dataFreshness: 'UNAVAILABLE',
        coordinateValidity: 'VALID',
        missingVariables: [],
        apiStatus,
        errorMessage: err.message || userMsg
      };

      throw {
        isFarmfitWeatherError: true,
        quality,
        message: userMsg,
        originalError: err
      };
    }
  }

  /**
   * Clear all cached weather entries
   */
  public clearCache(): void {
    this.memoryCache.clear();
    try {
      if (typeof window !== 'undefined' && window.sessionStorage) {
        const keysToRemove: string[] = [];
        for (let i = 0; i < window.sessionStorage.length; i++) {
          const k = window.sessionStorage.key(i);
          if (k && k.startsWith('farmfit_weather_')) {
            keysToRemove.push(k);
          }
        }
        keysToRemove.forEach(k => window.sessionStorage.removeItem(k));
      }
    } catch {
      // Ignore
    }
  }
}

export const weatherService = WeatherService.getInstance();
