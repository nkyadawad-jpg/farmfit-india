import React, { useState, useEffect, useCallback } from 'react';
import { 
  CloudSun, 
  CloudRain, 
  Wind, 
  Thermometer, 
  AlertTriangle, 
  Compass, 
  ShieldCheck, 
  RefreshCw, 
  Droplets, 
  Sun, 
  Cloud, 
  CloudFog, 
  CloudDrizzle, 
  CloudLightning, 
  Snowflake, 
  ExternalLink, 
  Info, 
  CheckCircle2, 
  MapPin, 
  Calendar, 
  ChevronDown, 
  ChevronUp, 
  Clock, 
  ShieldAlert, 
  Radio, 
  Gauge, 
  ArrowRight,
  Database,
  ArrowUpRight
} from 'lucide-react';
import { FarmLocation, LandAndIrrigation, SoilIntelligence, CalculationEngineResult, Language } from '../types';
import { WeatherData, DailyForecastDay } from '../types/weather';
import { weatherService } from '../services/weather/weatherService';
import { DataStatusBadge } from '../components/DataStatusBadge';

interface WeatherViewProps {
  location?: FarmLocation;
  land?: LandAndIrrigation;
  soil?: SoilIntelligence;
  result?: CalculationEngineResult | null;
  language: Language;
  onNavigateToLocation?: () => void;
  onNavigateToCrops?: () => void;
  onNavigateToEngine?: () => void;
}

export const WeatherView: React.FC<WeatherViewProps> = ({
  location: directLocation,
  land: directLand,
  soil: directSoil,
  result,
  language,
  onNavigateToLocation,
  onNavigateToCrops,
  onNavigateToEngine
}) => {
  // Resolve farm parameters defensively
  const location: FarmLocation = directLocation || result?.payload?.location || (result?.payload as any)?.farmLocation || {
    state: '',
    district: '',
    taluka: '',
    village: '',
    formattedAddress: '',
    latitude: null,
    longitude: null,
    locationSource: 'NOT_SPECIFIED',
    metadata: {
      status: 'OFFICIAL DATA',
      source: 'Agromet Station (Pending Location)',
      date: '2024-25',
      disclaimer: 'Location baseline'
    }
  };

  const latitude = location.latitude;
  const longitude = location.longitude;

  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorInfo, setErrorInfo] = useState<{ message: string; details?: string } | null>(null);
  const [expandedDayIndex, setExpandedDayIndex] = useState<number | null>(0); // First day open by default

  const fetchWeather = useCallback(async (forceRefresh: boolean = false) => {
    if (typeof latitude !== 'number' || typeof longitude !== 'number' || isNaN(latitude) || isNaN(longitude)) {
      setErrorInfo({
        message: 'Weather cannot be retrieved because farm coordinates are unavailable.',
        details: 'Please specify your exact farm coordinates or select a recognized district in the Farm Location module.'
      });
      setWeatherData(null);
      return;
    }

    setIsLoading(true);
    setErrorInfo(null);

    try {
      const data = await weatherService.fetchWeather(latitude, longitude, forceRefresh);
      setWeatherData(data);
    } catch (err: any) {
      console.error('Weather fetch error:', err);
      setErrorInfo({
        message: err.message || 'Weather service temporarily unavailable. Please try again later.',
        details: err.quality?.errorMessage || 'Unable to connect to Open-Meteo numerical weather service.'
      });
    } finally {
      setIsLoading(false);
    }
  }, [latitude, longitude]);

  useEffect(() => {
    fetchWeather(false);
  }, [fetchWeather]);

  const toggleDayExpansion = (idx: number) => {
    setExpandedDayIndex(prev => prev === idx ? null : idx);
  };

  // Icon selector helper
  const renderWeatherIcon = (iconName: string, className: string = 'w-6 h-6') => {
    switch (iconName) {
      case 'Sun':
        return <Sun className={`${className} text-amber-500`} />;
      case 'CloudSun':
        return <CloudSun className={`${className} text-amber-500`} />;
      case 'Cloud':
        return <Cloud className={`${className} text-slate-400`} />;
      case 'CloudFog':
        return <CloudFog className={`${className} text-slate-400`} />;
      case 'CloudDrizzle':
        return <CloudDrizzle className={`${className} text-blue-400`} />;
      case 'CloudRain':
        return <CloudRain className={`${className} text-blue-500`} />;
      case 'CloudLightning':
        return <CloudLightning className={`${className} text-amber-600`} />;
      case 'Snowflake':
        return <Snowflake className={`${className} text-cyan-400`} />;
      default:
        return <CloudSun className={`${className} text-amber-500`} />;
    }
  };

  const hasValidCoordinates = typeof latitude === 'number' && typeof longitude === 'number' && !isNaN(latitude) && !isNaN(longitude);

  return (
    <div className="space-y-6 pb-20">
      {/* Top Header Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300 font-bold text-xs border border-blue-200 dark:border-blue-800 flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
                <span>REAL WEATHER INTELLIGENCE ENGINE v1</span>
              </span>

              {weatherData && (
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-black text-[10px] tracking-wider uppercase border border-emerald-300 dark:border-emerald-800 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                  <span>LIVE WEATHER DATA</span>
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <span>{language === 'en' ? 'Weather & Agro-Meteorology' : 'मौसम एवं कृषि मौसम विज्ञान'}</span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-3xl">
              High-resolution numerical weather forecasts, 10-day rainfall projections, temperature swings, and automated crop stress indicators for <strong>{location.village ? `${location.village}, ` : ''}{location.district}, {location.state}</strong>.
            </p>

            {/* Farm Location Coordinates Baseline */}
            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-slate-700 dark:text-slate-300">
              <div className="inline-flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                <span>
                  {hasValidCoordinates 
                    ? `Lat: ${latitude.toFixed(4)}°, Lon: ${longitude.toFixed(4)}°` 
                    : 'Coordinates: Missing'}
                </span>
              </div>

              {weatherData && (
                <div className="inline-flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
                  <Clock className="w-3.5 h-3.5 text-blue-600" />
                  <span>Timezone: <strong>{weatherData.coordinates.timezone}</strong></span>
                </div>
              )}

              {weatherData && (
                <div className="inline-flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
                  <Database className="w-3.5 h-3.5 text-slate-500" />
                  <span>Source: <strong>{weatherData.source.name}</strong></span>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            {weatherData && (
              <div className="text-right text-[11px] text-slate-700 dark:text-slate-300 hidden md:block">
                <span>Last updated:</span>
                <strong className="block text-slate-900 dark:text-white">{weatherData.retrievedAtFormatted}</strong>
              </div>
            )}

            <button
              onClick={() => fetchWeather(true)}
              disabled={isLoading || !hasValidCoordinates}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs ${
                isLoading
                  ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white active:scale-95'
              }`}
              id="btn-refresh-weather"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span>{isLoading ? 'Fetching Data...' : 'REFRESH WEATHER'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* State 1: Missing Coordinates Error */}
      {!hasValidCoordinates && (
        <div className="p-8 rounded-3xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300 flex items-center justify-center mx-auto">
            <MapPin className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Weather cannot be retrieved because farm coordinates are unavailable.
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md mx-auto">
              FARMFIT requires precise geographic coordinates to query high-resolution numerical weather models. Please set your farm location in Step 2.
            </p>
          </div>
          {onNavigateToLocation && (
            <button
              onClick={onNavigateToLocation}
              className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-xs transition-all inline-flex items-center gap-2 cursor-pointer"
            >
              <span>Go to Farm Location Module</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      )}

      {/* State 2: Weather API Error / Network Failure */}
      {hasValidCoordinates && errorInfo && !weatherData && (
        <div className="p-8 rounded-3xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-rose-800 dark:text-rose-300">
              WEATHER DATA UNAVAILABLE
            </span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {errorInfo.message}
            </h3>
            {errorInfo.details && (
              <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md mx-auto">
                {errorInfo.details}
              </p>
            )}
          </div>
          <button
            onClick={() => fetchWeather(true)}
            className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs transition-all inline-flex items-center gap-2 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Retry Weather</span>
          </button>
        </div>
      )}

      {/* State 3: Live Weather Intelligence Display */}
      {weatherData && (
        <>
          {/* Top 3 Core Metrics Summary Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 1. CURRENT WEATHER CARD */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Sun className="w-4 h-4 text-amber-500" />
                    <span>Current Farm Conditions</span>
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold">
                    {weatherData.current.isDay ? 'Daytime' : 'Night'}
                  </span>
                </div>

                <div className="flex items-center justify-between my-4">
                  <div>
                    <div className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
                      {Math.round(weatherData.current.temperatureC)}°<span className="text-xl font-bold text-slate-400">C</span>
                    </div>
                    <p className="text-xs text-slate-700 dark:text-slate-300 mt-1">
                      Feels like: <strong>{Math.round(weatherData.current.apparentTemperatureC)}°C</strong>
                    </p>
                  </div>

                  <div className="text-right flex flex-col items-end">
                    <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-100 dark:border-amber-900/40 flex items-center justify-center">
                      {renderWeatherIcon(weatherData.current.iconName, 'w-8 h-8')}
                    </div>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-1">
                      {language === 'en' ? weatherData.current.weatherConditionEn : weatherData.current.weatherConditionHi}
                    </span>
                  </div>
                </div>
              </div>

              {/* Current Parameters Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
                  <span className="text-[10px] uppercase font-bold text-slate-700 dark:text-slate-300 block">
                    <Droplets className="inline w-3 h-3 text-blue-500 mr-1" />
                    Relative Humidity
                  </span>
                  <strong className="text-sm text-slate-900 dark:text-white">
                    {weatherData.current.relativeHumidityPercent}%
                  </strong>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
                  <span className="text-[10px] uppercase font-bold text-slate-700 dark:text-slate-300 block">
                    <CloudRain className="inline w-3 h-3 text-blue-500 mr-1" />
                    Current Rain
                  </span>
                  <strong className="text-sm text-slate-900 dark:text-white">
                    {weatherData.current.rainMm} mm
                  </strong>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
                  <span className="text-[10px] uppercase font-bold text-slate-700 dark:text-slate-300 block">
                    <Wind className="inline w-3 h-3 text-teal-500 mr-1" />
                    Wind Velocity
                  </span>
                  <strong className="text-sm text-slate-900 dark:text-white">
                    {weatherData.current.windSpeedKmH} km/h ({weatherData.current.windDirectionCompass})
                  </strong>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
                  <span className="text-[10px] uppercase font-bold text-slate-700 dark:text-slate-300 block">
                    <Cloud className="inline w-3 h-3 text-slate-500 mr-1" />
                    Cloud Cover
                  </span>
                  <strong className="text-sm text-slate-900 dark:text-white">
                    {weatherData.current.cloudCoverPercent}%
                  </strong>
                </div>
              </div>
            </div>

            {/* 2. RAINFALL INTELLIGENCE CARD */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <CloudRain className="w-4 h-4 text-blue-600" />
                    <span>Rainfall Intelligence</span>
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 font-bold">
                    10-Day Horizon
                  </span>
                </div>

                <div className="my-3">
                  <div className="text-xs text-slate-700 dark:text-slate-300 uppercase font-semibold">
                    Total Forecast Cumulative Rainfall
                  </div>
                  <div className="text-3xl sm:text-4xl font-black text-blue-600 dark:text-blue-400 mt-0.5">
                    {weatherData.rainfall.expectedForecastPeriodMm} <span className="text-lg font-bold text-slate-400">mm</span>
                  </div>
                  <p className="text-[11px] text-slate-700 dark:text-slate-300 mt-1">
                    Normal IMD District Baseline: <strong>{location.normalAnnualRainfallMm || 950} mm / year</strong>
                  </p>
                </div>
              </div>

              {/* Rainfall Timeline Breakdown */}
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700">
                  <span className="text-slate-700 dark:text-slate-300 font-medium">Next 24 Hours Expected:</span>
                  <strong className="text-slate-900 dark:text-white font-bold">{weatherData.rainfall.expected24HoursMm} mm</strong>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700">
                  <span className="text-slate-700 dark:text-slate-300 font-medium">Next 3 Days Expected:</span>
                  <strong className="text-slate-900 dark:text-white font-bold">{weatherData.rainfall.expected3DaysMm} mm</strong>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700">
                  <span className="text-slate-700 dark:text-slate-300 font-medium">Next 7 Days Expected:</span>
                  <strong className="text-slate-900 dark:text-white font-bold">{weatherData.rainfall.expected7DaysMm} mm</strong>
                </div>
              </div>

              <p className="text-[10px] text-slate-700 dark:text-slate-300 italic pt-1">
                Quantitative forecast in millimetres. Agronomic evaluation against crop growth stages will be connected in future data phases.
              </p>
            </div>

            {/* 3. TEMPERATURE INTELLIGENCE & CLIMATE CARD */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Thermometer className="w-4 h-4 text-rose-500" />
                    <span>Temperature Intelligence</span>
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 font-bold">
                    Range: {weatherData.temperature.forecastTemperatureRangeC}°C
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 my-4">
                  <div className="p-3 rounded-2xl bg-rose-50/60 dark:bg-rose-950/40 border border-rose-100 dark:border-rose-900/50">
                    <span className="text-[10px] font-bold uppercase text-rose-800 dark:text-rose-300 block">
                      Forecast Minimum
                    </span>
                    <span className="text-2xl font-black text-rose-700 dark:text-rose-300">
                      {weatherData.temperature.forecastMinimumC}°C
                    </span>
                    <span className="text-[10px] text-slate-700 dark:text-slate-300 block mt-0.5">Over 10 days</span>
                  </div>

                  <div className="p-3 rounded-2xl bg-amber-50/60 dark:bg-amber-950/40 border border-amber-100 dark:border-amber-900/50">
                    <span className="text-[10px] font-bold uppercase text-amber-800 dark:text-amber-300 block">
                      Forecast Maximum
                    </span>
                    <span className="text-2xl font-black text-amber-700 dark:text-amber-300">
                      {weatherData.temperature.forecastMaximumC}°C
                    </span>
                    <span className="text-[10px] text-slate-700 dark:text-slate-300 block mt-0.5">Peak temperature</span>
                  </div>
                </div>
              </div>

              {/* Agro-Climatic Zone Context */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-900 dark:text-white">
                    Zone {location.agroClimaticZoneId}: {location.agroClimaticZoneName}
                  </span>
                </div>
                <p className="text-[11px] text-slate-700 dark:text-slate-300">
                  Monsoon regime: South-West Monsoon (Jun–Sep) &bull; Climatological Classification: Semi-Arid / Sub-Humid
                </p>
              </div>

              <div className="pt-2 flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-300">
                <span className="font-semibold">Weather Layer Active</span>
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
              </div>
            </div>
          </div>

          {/* EXTREME WEATHER ALERTS & OPERATIONAL FLAGS */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                  <span>FARMFIT Automated Weather Indicators</span>
                </h3>
                <p className="text-xs text-slate-700 dark:text-slate-300 mt-0.5">
                  Preliminary automated alert thresholds evaluated against 10-day numerical forecast parameters.
                </p>
              </div>

              <span className="text-[10px] uppercase font-mono px-2.5 py-1 rounded-md bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300 border border-amber-200 dark:border-amber-800 self-start sm:self-auto font-bold">
                FARMFIT WEATHER ALERT — preliminary automated indicator
              </span>
            </div>

            {weatherData.alerts.length === 0 ? (
              <div className="p-5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 flex items-center gap-3 text-xs text-emerald-900 dark:text-emerald-200">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <strong className="font-bold block">Normal Weather Conditions Across 10-Day Horizon</strong>
                  <span>No severe rainfall (&gt;50mm), heat stress (&gt;40°C), or high wind gusts (&gt;40km/h) currently triggered by numerical models.</span>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {weatherData.alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`p-4 rounded-2xl border space-y-2 ${
                      alert.severity === 'critical'
                        ? 'bg-rose-50/80 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800'
                        : 'bg-amber-50/80 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-black uppercase tracking-wider flex items-center gap-1.5 ${
                        alert.severity === 'critical' ? 'text-rose-700 dark:text-rose-300' : 'text-amber-700 dark:text-amber-300'
                      }`}>
                        <ShieldAlert className="w-4 h-4" />
                        <span>{language === 'en' ? alert.title : alert.titleHi}</span>
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                        {alert.metricValue} {alert.unit}
                      </span>
                    </div>

                    <p className="text-xs text-slate-800 dark:text-slate-200 font-medium">
                      {language === 'en' ? alert.description : alert.descriptionHi}
                    </p>

                    <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 text-[11px] text-slate-600 dark:text-slate-400">
                      <strong>Agronomic Advisory:</strong> {language === 'en' ? alert.advisoryNote : alert.advisoryNoteHi}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 10-DAY DAILY FORECAST & HOURLY DRILLDOWN */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-emerald-600" />
                  <span>10-Day Agricultural Weather Forecast</span>
                </h3>
                <p className="text-xs text-slate-700 dark:text-slate-300 mt-0.5">
                  Click any day card to expand the 24-hour hourly sequence (Temperature, Rain, Probability, Humidity & Wind).
                </p>
              </div>

              <span className="text-xs text-slate-700 dark:text-slate-300">
                10 Days Synoptic Outlook
              </span>
            </div>

            {/* Daily Forecast List with Expandable Hourly Accordion */}
            <div className="space-y-3">
              {weatherData.daily.map((dayItem, idx) => {
                const isExpanded = expandedDayIndex === idx;

                return (
                  <div
                    key={dayItem.dateIso}
                    className={`rounded-2xl border transition-all ${
                      isExpanded
                        ? 'border-emerald-500 bg-slate-50/50 dark:bg-slate-800/40 shadow-xs'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
                    }`}
                  >
                    {/* Day Summary Header */}
                    <div
                      onClick={() => toggleDayExpansion(idx)}
                      className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer select-none"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                          {renderWeatherIcon(dayItem.iconName, 'w-6 h-6')}
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-slate-900 dark:text-white">
                              {language === 'en' ? dayItem.dayOfWeek : dayItem.dayOfWeekHi}
                            </span>
                            <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                              ({dayItem.formattedDate})
                            </span>
                          </div>
                          <span className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                            {language === 'en' ? dayItem.weatherConditionEn : dayItem.weatherConditionHi}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-5">
                        {/* Temperature High / Low */}
                        <div className="text-right text-xs">
                          <span className="font-extrabold text-slate-900 dark:text-white text-sm">
                            {Math.round(dayItem.maxTemperatureC)}°C
                          </span>
                          <span className="text-slate-600 dark:text-slate-300 ml-1">
                            / {Math.round(dayItem.minTemperatureC)}°C
                          </span>
                        </div>

                        {/* Rain & Probability */}
                        <div className="text-right text-xs min-w-[70px]">
                          <div className="font-bold text-blue-600 dark:text-blue-400 flex items-center justify-end gap-1">
                            <CloudRain className="w-3.5 h-3.5" />
                            <span>{dayItem.precipitationSumMm} mm</span>
                          </div>
                          <span className="text-[10px] text-slate-600 dark:text-slate-300">
                            {dayItem.precipitationProbabilityMaxPercent}% prob
                          </span>
                        </div>

                        {/* Wind */}
                        <div className="text-right text-xs hidden md:block min-w-[65px]">
                          <div className="text-slate-700 dark:text-slate-300 flex items-center justify-end gap-1">
                            <Wind className="w-3.5 h-3.5 text-teal-600" />
                            <span>{dayItem.windSpeedMaxKmH} km/h</span>
                          </div>
                        </div>

                        {/* Toggle Button */}
                        <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center">
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </div>
                      </div>
                    </div>

                    {/* Expanded Hourly Breakdown Panel */}
                    {isExpanded && dayItem.hourly.length > 0 && (
                      <div className="px-4 pb-4 pt-2 border-t border-slate-200 dark:border-slate-700">
                        <div className="mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Hourly Breakdown for {dayItem.formattedDate} ({dayItem.dayOfWeek})</span>
                        </div>

                        <div className="overflow-x-auto">
                          <div className="flex gap-2 min-w-max pb-2">
                            {dayItem.hourly.map((h, hIdx) => (
                              <div
                                key={hIdx}
                                className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center text-xs space-y-1.5 min-w-[90px] shrink-0"
                              >
                                <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block">
                                  {h.formattedHour}
                                </span>
                                <div className="text-sm font-black text-slate-900 dark:text-white">
                                  {Math.round(h.temperatureC)}°C
                                </div>
                                <div className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold flex items-center justify-center gap-0.5">
                                  <CloudRain className="w-3 h-3" />
                                  <span>{h.rainMm} mm</span>
                                </div>
                                <div className="text-[10px] text-slate-600 dark:text-slate-300">
                                  {h.precipitationProbabilityPercent}% rain
                                </div>
                                <div className="text-[10px] text-slate-600 dark:text-slate-300">
                                  {h.relativeHumidityPercent}% RH
                                </div>
                                <div className="text-[10px] text-teal-700 dark:text-teal-300 font-medium">
                                  {h.windSpeedKmH} km/h
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* DATA QUALITY & OFFICIAL ATTRIBUTION */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Data Quality Metrics */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Gauge className="w-4 h-4 text-emerald-600" />
                <span>Weather Data Quality & Integrity</span>
              </h4>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800">
                  <span className="text-slate-700 dark:text-slate-300">Data Freshness:</span>
                  <strong className="text-emerald-800 dark:text-emerald-300 font-bold">{weatherData.quality.dataFreshness}</strong>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800">
                  <span className="text-slate-700 dark:text-slate-300">Coordinate Validity:</span>
                  <strong className="text-emerald-800 dark:text-emerald-300 font-bold">{weatherData.quality.coordinateValidity}</strong>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800">
                  <span className="text-slate-700 dark:text-slate-300">API Status:</span>
                  <strong className="text-emerald-800 dark:text-emerald-300 font-bold">{weatherData.quality.apiStatus} ({weatherData.quality.responseLatencyMs} ms latency)</strong>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800">
                  <span className="text-slate-700 dark:text-slate-300">Missing Variables:</span>
                  <strong className="text-slate-900 dark:text-white">
                    {weatherData.quality.missingVariables.length === 0 ? 'None (Full Variable Feed)' : weatherData.quality.missingVariables.join(', ')}
                  </strong>
                </div>
              </div>
            </div>

            {/* Official Source Attribution */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <ExternalLink className="w-4 h-4 text-blue-600" />
                <span>DATA SOURCE & ATTRIBUTION</span>
              </h4>

              <div className="p-3.5 rounded-2xl bg-blue-50/60 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <strong className="font-bold text-blue-950 dark:text-blue-200">{weatherData.source.name}</strong>
                  <a
                    href={weatherData.source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-700 hover:text-blue-800 dark:text-blue-300 font-bold inline-flex items-center gap-1 hover:underline"
                  >
                    <span>open-meteo.com</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>

                <p className="text-[11px] text-slate-700 dark:text-slate-300">
                  {weatherData.source.attributionText} &bull; Model Suite: <em>{weatherData.source.model}</em>
                </p>

                <p className="text-[10px] text-slate-700 dark:text-slate-300 italic pt-1 border-t border-blue-200/60 dark:border-blue-800/60">
                  &ldquo;{weatherData.source.disclaimer}&rdquo;
                </p>
              </div>
            </div>
          </div>

          {/* HISTORICAL WEATHER ANALYTICS & EXTENSIBILITY ROADMAP */}
          <div className="bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 space-y-3">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Database className="w-4 h-4 text-emerald-600" />
              <span>Historical Weather Analytics & Official Providers Foundation</span>
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              <strong>Future Data Phase:</strong> Historical weather analytics will be enabled in the next data phase to calculate rainfall normals, anomalies, drought/flood indicators, and seasonal crop window patterns. The architecture is engineered to integrate India Meteorological Department (IMD) and Krishi Vigyan Kendra agromet advisories.
            </p>
          </div>

          {/* Bottom Workflow Navigation CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-emerald-800 to-emerald-950 text-white shadow-md">
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-[10px] uppercase tracking-wider font-bold text-emerald-300">
                Step 6 of 7 Completed
              </span>
              <h3 className="text-lg font-bold text-white">
                Weather Intelligence Feed Synchronized
              </h3>
              <p className="text-xs text-emerald-200 max-w-xl">
                Numerical rainfall, temperature, and storm risk metrics are loaded for your farm coordinates. Proceed to calculate customized crop profitability and market rankings.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              {onNavigateToCrops && (
                <button
                  onClick={onNavigateToCrops}
                  className="px-4 py-2.5 rounded-xl border border-white/20 hover:bg-white/10 text-white text-xs font-bold transition-all cursor-pointer"
                >
                  Back to Crops
                </button>
              )}

              {onNavigateToEngine && (
                <button
                  onClick={onNavigateToEngine}
                  className="px-6 py-2.5 rounded-xl bg-white hover:bg-emerald-50 text-emerald-950 text-xs font-black shadow-lg transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>Proceed to Crop Scan</span>
                  <ArrowRight className="w-4 h-4 text-emerald-700" />
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
