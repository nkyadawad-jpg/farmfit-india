/**
 * FARMFIT Weather Intelligence Architecture Types
 * Scalable abstractions for Real Weather Data Providers (Open-Meteo, IMD, etc.)
 */

export type WeatherProviderId = 'open-meteo' | 'imd' | 'custom';

export type WeatherSeverity = 'info' | 'advisory' | 'warning' | 'critical';

export type WeatherAlertType = 
  | 'heavy_rainfall'
  | 'high_precipitation_prob'
  | 'extreme_high_temperature'
  | 'extreme_low_temperature'
  | 'strong_wind'
  | 'thunderstorm_risk';

export interface WeatherSource {
  providerId: WeatherProviderId;
  name: string;
  url: string;
  license: string;
  attributionText: string;
  model: string;
  disclaimer: string;
}

export interface WeatherDataQuality {
  sourceAvailable: boolean;
  dataFreshness: 'LIVE' | 'RECENT_CACHE' | 'STALE' | 'UNAVAILABLE';
  coordinateValidity: 'VALID' | 'MISSING' | 'INVALID';
  missingVariables: string[];
  apiStatus: 'OK' | 'RATE_LIMITED' | 'NETWORK_ERROR' | 'INVALID_RESPONSE' | 'NO_COORDINATES';
  errorMessage?: string;
  responseLatencyMs?: number;
}

export interface CurrentWeather {
  temperatureC: number;
  apparentTemperatureC: number;
  relativeHumidityPercent: number;
  precipitationMm: number;
  rainMm: number;
  windSpeedKmH: number;
  windDirectionDegrees: number;
  windDirectionCompass: string;
  cloudCoverPercent: number;
  weatherCode: number;
  weatherConditionEn: string;
  weatherConditionHi: string;
  isDay: boolean;
  iconName: string;
}

export interface HourlyWeatherPoint {
  timeIso: string;
  formattedHour: string;
  temperatureC: number;
  rainMm: number;
  precipitationProbabilityPercent: number;
  relativeHumidityPercent: number;
  windSpeedKmH: number;
  weatherCode: number;
  weatherCondition: string;
}

export interface DailyForecastDay {
  dateIso: string;
  formattedDate: string;
  dayOfWeek: string;
  dayOfWeekHi: string;
  minTemperatureC: number;
  maxTemperatureC: number;
  precipitationSumMm: number;
  rainSumMm: number;
  precipitationProbabilityMaxPercent: number;
  windSpeedMaxKmH: number;
  weatherCode: number;
  weatherConditionEn: string;
  weatherConditionHi: string;
  iconName: string;
  hourly: HourlyWeatherPoint[];
}

export interface RainfallIntelligence {
  expected24HoursMm: number;
  expected3DaysMm: number;
  expected7DaysMm: number;
  expectedForecastPeriodMm: number;
  forecastDaysCount: number;
  unit: 'mm';
  note: string;
}

export interface TemperatureIntelligence {
  currentTemperatureC: number;
  forecastMinimumC: number;
  forecastMaximumC: number;
  forecastTemperatureRangeC: number;
  unit: '°C';
}

export interface WeatherAlert {
  id: string;
  alertType: WeatherAlertType;
  severity: WeatherSeverity;
  title: string;
  titleHi: string;
  description: string;
  descriptionHi: string;
  metricValue: number;
  thresholdValue: number;
  unit: string;
  advisoryNote: string;
  advisoryNoteHi: string;
}

export interface WeatherAlertThresholds {
  heavyRain24hMm: number;        // e.g. >= 50 mm
  highPrecipProbPct: number;      // e.g. >= 80 %
  extremeHighTempC: number;       // e.g. >= 40 °C
  extremeLowTempC: number;        // e.g. <= 5 °C
  strongWindKmH: number;          // e.g. >= 40 km/h
}

export const DEFAULT_WEATHER_ALERT_THRESHOLDS: WeatherAlertThresholds = {
  heavyRain24hMm: 50,
  highPrecipProbPct: 80,
  extremeHighTempC: 40,
  extremeLowTempC: 6,
  strongWindKmH: 40
};

export interface WeatherCoordinates {
  latitude: number;
  longitude: number;
  elevationMeters?: number;
  timezone: string;
  timezoneAbbreviation?: string;
}

export interface WeatherData {
  coordinates: WeatherCoordinates;
  retrievedAt: string; // ISO String
  retrievedAtFormatted: string;
  forecastGeneratedAt?: string;
  isLive: boolean;
  current: CurrentWeather;
  daily: DailyForecastDay[];
  hourly: HourlyWeatherPoint[];
  rainfall: RainfallIntelligence;
  temperature: TemperatureIntelligence;
  alerts: WeatherAlert[];
  source: WeatherSource;
  quality: WeatherDataQuality;
}

/**
 * Foundation interface for future comparison of Crop Requirements vs Weather Forecast
 */
export interface CropWeatherCompatibilityEvaluation {
  cropId: string;
  cropName: string;
  temperatureSuitabilityScore: number; // 0 - 100
  rainfallSuitabilityScore: number;    // 0 - 100
  humiditySuitabilityScore: number;    // 0 - 100
  extremeWeatherRiskLevel: 'Low' | 'Moderate' | 'High';
  expectedPlantingCondition: 'Favourable' | 'Moderate' | 'Unfavourable';
  expectedHarvestCondition: 'Favourable' | 'Moderate' | 'Unfavourable';
  notes: string[];
}

/**
 * Foundation interface for future Historical Weather Analytics
 */
export interface HistoricalWeatherAnalyticsFoundation {
  status: 'PENDING_NEXT_PHASE';
  sourceName: string;
  rainfallNormalMm?: number;
  rainfallAnomalyPercent?: number;
  temperatureAnomalyC?: number;
  droughtIndicatorIndex?: number;
  floodRiskIndex?: number;
  seasonalPatternsAvailable: boolean;
  message: string;
}
