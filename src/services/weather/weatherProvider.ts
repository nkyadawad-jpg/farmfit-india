/**
 * FARMFIT Weather Providers
 * Extensible provider architecture featuring Open-Meteo (free/open numerical model)
 */

import {
  WeatherData,
  WeatherSource,
  WeatherDataQuality,
  CurrentWeather,
  DailyForecastDay,
  HourlyWeatherPoint,
  RainfallIntelligence,
  TemperatureIntelligence,
  WeatherAlert,
  DEFAULT_WEATHER_ALERT_THRESHOLDS,
  WeatherAlertThresholds
} from '../../types/weather';
import { getWmoCodeInfo, degreesToCompass } from './weatherCodeUtils';

export interface IWeatherProvider {
  id: string;
  name: string;
  source: WeatherSource;
  fetchForecast(latitude: number, longitude: number, alertThresholds?: WeatherAlertThresholds): Promise<WeatherData>;
}

export class OpenMeteoWeatherProvider implements IWeatherProvider {
  public id = 'open-meteo';
  public name = 'Open-Meteo Weather API';
  
  public source: WeatherSource = {
    providerId: 'open-meteo',
    name: 'Open-Meteo Numerical Weather Models',
    url: 'https://open-meteo.com/',
    license: 'Non-Commercial Open Data License (CC BY 4.0)',
    attributionText: 'Weather data provided by Open-Meteo.com under CC BY 4.0',
    model: 'DWD ICON-Seamless / ECMWF IFS / NCEP GFS Ensemble',
    disclaimer: 'Weather data is derived from numerical weather models and should not be treated as an official government warning.'
  };

  /**
   * Fetches real 10-day weather forecast from Open-Meteo free public endpoint
   */
  public async fetchForecast(
    latitude: number, 
    longitude: number,
    thresholds: WeatherAlertThresholds = DEFAULT_WEATHER_ALERT_THRESHOLDS
  ): Promise<WeatherData> {
    const startTime = performance.now();

    if (
      typeof latitude !== 'number' || 
      typeof longitude !== 'number' || 
      isNaN(latitude) || 
      isNaN(longitude) || 
      latitude < -90 || 
      latitude > 90 || 
      longitude < -180 || 
      longitude > 180
    ) {
      throw new Error(`Invalid geographic coordinates: latitude=${latitude}, longitude=${longitude}`);
    }

    const endpointUrl = new URL('https://api.open-meteo.com/v1/forecast');
    endpointUrl.searchParams.set('latitude', latitude.toString());
    endpointUrl.searchParams.set('longitude', longitude.toString());
    endpointUrl.searchParams.set('current', [
      'temperature_2m',
      'apparent_temperature',
      'relative_humidity_2m',
      'precipitation',
      'rain',
      'weather_code',
      'cloud_cover',
      'wind_speed_10m',
      'wind_direction_10m',
      'is_day'
    ].join(','));
    endpointUrl.searchParams.set('hourly', [
      'temperature_2m',
      'relative_humidity_2m',
      'precipitation',
      'precipitation_probability',
      'rain',
      'weather_code',
      'wind_speed_10m'
    ].join(','));
    endpointUrl.searchParams.set('daily', [
      'weather_code',
      'temperature_2m_max',
      'temperature_2m_min',
      'precipitation_sum',
      'rain_sum',
      'precipitation_probability_max',
      'wind_speed_10m_max'
    ].join(','));
    endpointUrl.searchParams.set('timezone', 'auto');
    endpointUrl.searchParams.set('forecast_days', '10');

    // Fetch with 10-second timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    let rawData: any;
    try {
      const response = await fetch(endpointUrl.toString(), {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error('Weather service rate limit exceeded. Please try again shortly.');
        }
        throw new Error(`Weather service returned HTTP error ${response.status}: ${response.statusText}`);
      }

      rawData = await response.json();
    } catch (err: any) {
      if (err.name === 'AbortError') {
        throw new Error('Weather request timed out after 10 seconds. Please check your connection.');
      }
      throw err;
    } finally {
      clearTimeout(timeoutId);
    }

    const latencyMs = Math.round(performance.now() - startTime);

    if (!rawData || typeof rawData !== 'object') {
      throw new Error('Malformed JSON received from weather service.');
    }

    return this.transformApiResponse(rawData, latitude, longitude, latencyMs, thresholds);
  }

  private transformApiResponse(
    data: any, 
    lat: number, 
    lon: number, 
    latencyMs: number,
    thresholds: WeatherAlertThresholds
  ): WeatherData {
    const currentRaw = data.current || {};
    const hourlyRaw = data.hourly || {};
    const dailyRaw = data.daily || {};

    const missingVariables: string[] = [];
    if (!currentRaw.temperature_2m && currentRaw.temperature_2m !== 0) missingVariables.push('current.temperature_2m');
    if (!dailyRaw.time || !Array.isArray(dailyRaw.time)) missingVariables.push('daily.time');

    // 1. Current Weather
    const currentCode = Number(currentRaw.weather_code ?? 0);
    const codeInfo = getWmoCodeInfo(currentCode);
    const windDir = Number(currentRaw.wind_direction_10m ?? 0);

    const current: CurrentWeather = {
      temperatureC: Number(currentRaw.temperature_2m ?? 28),
      apparentTemperatureC: Number(currentRaw.apparent_temperature ?? currentRaw.temperature_2m ?? 28),
      relativeHumidityPercent: Number(currentRaw.relative_humidity_2m ?? 50),
      precipitationMm: Number(currentRaw.precipitation ?? 0),
      rainMm: Number(currentRaw.rain ?? 0),
      windSpeedKmH: Number(currentRaw.wind_speed_10m ?? 10),
      windDirectionDegrees: windDir,
      windDirectionCompass: degreesToCompass(windDir),
      cloudCoverPercent: Number(currentRaw.cloud_cover ?? 20),
      weatherCode: currentCode,
      weatherConditionEn: codeInfo.conditionEn,
      weatherConditionHi: codeInfo.conditionHi,
      isDay: Boolean(currentRaw.is_day ?? 1),
      iconName: codeInfo.iconName
    };

    // 2. Daily Forecast (10 Days)
    const dailyTimes: string[] = dailyRaw.time || [];
    const daily: DailyForecastDay[] = [];
    const hourlyTimes: string[] = hourlyRaw.time || [];

    const dayNamesEn = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayNamesHi = ['रविवार', 'सोमवार', 'मंगलवार', 'बुधवार', 'गुरुवार', 'शुक्रवार', 'शनिवार'];

    for (let i = 0; i < dailyTimes.length; i++) {
      const dateStr = dailyTimes[i];
      const d = new Date(dateStr);
      const dayOfWeekIdx = isNaN(d.getDay()) ? 0 : d.getDay();
      const code = Number(dailyRaw.weather_code?.[i] ?? 0);
      const dayCodeInfo = getWmoCodeInfo(code);

      // Extract hourly points for this specific day
      const dayHourly: HourlyWeatherPoint[] = [];
      for (let h = 0; h < hourlyTimes.length; h++) {
        if (hourlyTimes[h]?.startsWith(dateStr)) {
          const hTime = hourlyTimes[h];
          const hDate = new Date(hTime);
          const hCode = Number(hourlyRaw.weather_code?.[h] ?? 0);
          const hCodeInfo = getWmoCodeInfo(hCode);

          dayHourly.push({
            timeIso: hTime,
            formattedHour: isNaN(hDate.getHours()) 
              ? `${h % 24}:00` 
              : hDate.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }),
            temperatureC: Number(hourlyRaw.temperature_2m?.[h] ?? 0),
            rainMm: Number(hourlyRaw.rain?.[h] ?? 0),
            precipitationProbabilityPercent: Number(hourlyRaw.precipitation_probability?.[h] ?? 0),
            relativeHumidityPercent: Number(hourlyRaw.relative_humidity_2m?.[h] ?? 0),
            windSpeedKmH: Number(hourlyRaw.wind_speed_10m?.[h] ?? 0),
            weatherCode: hCode,
            weatherCondition: hCodeInfo.conditionEn
          });
        }
      }

      daily.push({
        dateIso: dateStr,
        formattedDate: isNaN(d.getTime()) 
          ? dateStr 
          : d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
        dayOfWeek: i === 0 ? 'Today' : (i === 1 ? 'Tomorrow' : dayNamesEn[dayOfWeekIdx]),
        dayOfWeekHi: i === 0 ? 'आज' : (i === 1 ? 'कल' : dayNamesHi[dayOfWeekIdx]),
        minTemperatureC: Number(dailyRaw.temperature_2m_min?.[i] ?? 0),
        maxTemperatureC: Number(dailyRaw.temperature_2m_max?.[i] ?? 0),
        precipitationSumMm: Number(dailyRaw.precipitation_sum?.[i] ?? 0),
        rainSumMm: Number(dailyRaw.rain_sum?.[i] ?? 0),
        precipitationProbabilityMaxPercent: Number(dailyRaw.precipitation_probability_max?.[i] ?? 0),
        windSpeedMaxKmH: Number(dailyRaw.wind_speed_10m_max?.[i] ?? 0),
        weatherCode: code,
        weatherConditionEn: dayCodeInfo.conditionEn,
        weatherConditionHi: dayCodeInfo.conditionHi,
        iconName: dayCodeInfo.iconName,
        hourly: dayHourly
      });
    }

    // 3. Flatten Hourly for direct query (first 24-48 hours)
    const hourly: HourlyWeatherPoint[] = [];
    for (let h = 0; h < Math.min(hourlyTimes.length, 72); h++) {
      const hTime = hourlyTimes[h];
      const hDate = new Date(hTime);
      const hCode = Number(hourlyRaw.weather_code?.[h] ?? 0);
      const hCodeInfo = getWmoCodeInfo(hCode);

      hourly.push({
        timeIso: hTime,
        formattedHour: isNaN(hDate.getHours()) 
          ? `${h % 24}:00` 
          : `${hDate.toLocaleDateString('en-IN', { weekday: 'short' })} ${hDate.toLocaleTimeString('en-IN', { hour: 'numeric', hour12: true })}`,
        temperatureC: Number(hourlyRaw.temperature_2m?.[h] ?? 0),
        rainMm: Number(hourlyRaw.rain?.[h] ?? 0),
        precipitationProbabilityPercent: Number(hourlyRaw.precipitation_probability?.[h] ?? 0),
        relativeHumidityPercent: Number(hourlyRaw.relative_humidity_2m?.[h] ?? 0),
        windSpeedKmH: Number(hourlyRaw.wind_speed_10m?.[h] ?? 0),
        weatherCode: hCode,
        weatherCondition: hCodeInfo.conditionEn
      });
    }

    // 4. Rainfall Intelligence Calculations
    const precips = daily.map(d => d.precipitationSumMm);
    const exp24h = precips[0] ?? 0;
    const exp3d = precips.slice(0, 3).reduce((a, b) => a + b, 0);
    const exp7d = precips.slice(0, 7).reduce((a, b) => a + b, 0);
    const expTotal = precips.reduce((a, b) => a + b, 0);

    const rainfall: RainfallIntelligence = {
      expected24HoursMm: Number(exp24h.toFixed(1)),
      expected3DaysMm: Number(exp3d.toFixed(1)),
      expected7DaysMm: Number(exp7d.toFixed(1)),
      expectedForecastPeriodMm: Number(expTotal.toFixed(1)),
      forecastDaysCount: daily.length,
      unit: 'mm',
      note: 'Cumulative rainfall predicted by numerical models. Does not constitute an official flood/drought warning.'
    };

    // 5. Temperature Intelligence Calculations
    const mins = daily.map(d => d.minTemperatureC);
    const maxs = daily.map(d => d.maxTemperatureC);
    const globalMin = mins.length > 0 ? Math.min(...mins) : current.temperatureC;
    const globalMax = maxs.length > 0 ? Math.max(...maxs) : current.temperatureC;

    const temperature: TemperatureIntelligence = {
      currentTemperatureC: current.temperatureC,
      forecastMinimumC: Number(globalMin.toFixed(1)),
      forecastMaximumC: Number(globalMax.toFixed(1)),
      forecastTemperatureRangeC: Number((globalMax - globalMin).toFixed(1)),
      unit: '°C'
    };

    // 6. Centralized Automated Alerts Evaluation
    const alerts: WeatherAlert[] = [];

    // Check Heavy Rainfall in next 24-72 hours
    const maxDayRain = Math.max(...precips, 0);
    if (maxDayRain >= thresholds.heavyRain24hMm) {
      alerts.push({
        id: `alert-rain-${Date.now()}`,
        alertType: 'heavy_rainfall',
        severity: maxDayRain >= 100 ? 'critical' : 'warning',
        title: 'Heavy Rainfall Indicator',
        titleHi: 'भारी बारिश का पूर्वानुमान',
        description: `Model forecasts up to ${maxDayRain.toFixed(1)} mm of rainfall in a 24-hour window during the forecast period.`,
        descriptionHi: `पूर्वानुमान अवधि में 24 घंटे में ${maxDayRain.toFixed(1)} मिमी तक बारिश की संभावना है।`,
        metricValue: maxDayRain,
        thresholdValue: thresholds.heavyRain24hMm,
        unit: 'mm/24h',
        advisoryNote: 'Ensure proper drainage in standing crops and delay fertilizer/spray applications during peak precipitation.',
        advisoryNoteHi: 'खेतों में जल निकासी सुनिश्चित करें और तेज बारिश के दौरान खाद/छिड़काव टालें।'
      });
    }

    // Check High Precipitation Probability
    const maxProb = Math.max(...daily.map(d => d.precipitationProbabilityMaxPercent), 0);
    if (maxProb >= thresholds.highPrecipProbPct && maxDayRain < thresholds.heavyRain24hMm) {
      alerts.push({
        id: `alert-prob-${Date.now()}`,
        alertType: 'high_precipitation_prob',
        severity: 'advisory',
        title: 'High Precipitation Probability',
        titleHi: 'वर्षा की उच्च संभावना',
        description: `Precipitation likelihood reaches ${maxProb}% during the upcoming days.`,
        descriptionHi: `आगामी दिनों में बारिश की संभावना ${maxProb}% तक पहुंच रही है।`,
        metricValue: maxProb,
        thresholdValue: thresholds.highPrecipProbPct,
        unit: '%',
        advisoryNote: 'Plan intercultural operations, harvesting, and grain drying according to precipitation timings.',
        advisoryNoteHi: 'कटाई व निराई-गुड़ाई के कार्य वर्षा की संभावना को ध्यान में रखकर करें।'
      });
    }

    // Check Extreme High Temperature
    if (globalMax >= thresholds.extremeHighTempC) {
      alerts.push({
        id: `alert-heat-${Date.now()}`,
        alertType: 'extreme_high_temperature',
        severity: globalMax >= 44 ? 'critical' : 'warning',
        title: 'Elevated Temperature Stress Indicator',
        titleHi: 'अत्यधिक तापमान तनाव चेतावनी',
        description: `Forecast maximum temperature reaches ${globalMax.toFixed(1)} °C.`,
        descriptionHi: `अधिकतम तापमान ${globalMax.toFixed(1)} °C तक पहुंचने का अनुमान है।`,
        metricValue: globalMax,
        thresholdValue: thresholds.extremeHighTempC,
        unit: '°C',
        advisoryNote: 'High heat increases evapotranspiration. Maintain soil moisture with light evening irrigation if feasible.',
        advisoryNoteHi: 'अधिक तापमान से वाष्पीकरण बढ़ता है। शाम के समय हल्की सिंचाई करें।'
      });
    }

    // Check Strong Wind
    const maxWind = Math.max(...daily.map(d => d.windSpeedMaxKmH), current.windSpeedKmH);
    if (maxWind >= thresholds.strongWindKmH) {
      alerts.push({
        id: `alert-wind-${Date.now()}`,
        alertType: 'strong_wind',
        severity: maxWind >= 60 ? 'critical' : 'advisory',
        title: 'Strong Wind / Gust Advisory',
        titleHi: 'तेज हवा / आंधी का पूर्वानुमान',
        description: `Wind gusts up to ${maxWind.toFixed(1)} km/h are indicated in the forecast.`,
        descriptionHi: `हवा की गति ${maxWind.toFixed(1)} किमी/घंटा तक हो सकती है।`,
        metricValue: maxWind,
        thresholdValue: thresholds.strongWindKmH,
        unit: 'km/h',
        advisoryNote: 'Provide staking for tall crops (banana, sugarcane, papaya) and avoid spraying chemicals in high winds.',
        advisoryNoteHi: 'लंबी फसलों को सहारा दें और तेज हवा में कीटनाशक छिड़काव से बचें।'
      });
    }

    // Check Thunderstorm
    const hasThunderstorm = daily.some(d => d.weatherCode >= 95) || current.weatherCode >= 95;
    if (hasThunderstorm) {
      alerts.push({
        id: `alert-storm-${Date.now()}`,
        alertType: 'thunderstorm_risk',
        severity: 'warning',
        title: 'Convective Storm / Thunderstorm Activity',
        titleHi: 'गरज-चमक के साथ आंधी-तूफान',
        description: 'Atmospheric instability suggests potential convective thunderstorms with localized squalls.',
        descriptionHi: 'मौसम में गरज-चमक व तेज हवाओं के साथ तूफान की संभावना है।',
        metricValue: 95,
        thresholdValue: 95,
        unit: 'WMO Code',
        advisoryNote: 'Avoid staying in open fields or near tall isolated trees during lightning activity.',
        advisoryNoteHi: 'बिजली चमकने के समय खुले खेतों या अकेले पेड़ों के नीचे न रुकें।'
      });
    }

    // 7. Data Quality Metrics
    const quality: WeatherDataQuality = {
      sourceAvailable: true,
      dataFreshness: 'LIVE',
      coordinateValidity: 'VALID',
      missingVariables,
      apiStatus: 'OK',
      responseLatencyMs: latencyMs
    };

    const retrievedDate = new Date();
    const retrievedAtFormatted = retrievedDate.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });

    return {
      coordinates: {
        latitude: lat,
        longitude: lon,
        elevationMeters: data.elevation ? Number(data.elevation) : undefined,
        timezone: data.timezone || 'Asia/Kolkata',
        timezoneAbbreviation: data.timezone_abbreviation || 'IST'
      },
      retrievedAt: retrievedDate.toISOString(),
      retrievedAtFormatted,
      forecastGeneratedAt: data.current?.time || retrievedDate.toISOString(),
      isLive: true,
      current,
      daily,
      hourly,
      rainfall,
      temperature,
      alerts,
      source: this.source,
      quality
    };
  }
}
