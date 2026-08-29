/**
 * WMO Weather Interpretation Codes (WW) Mapper
 * Translates standard meteorological codes into farmer-friendly English and Hindi terms
 */

export interface WmoCodeInfo {
  code: number;
  conditionEn: string;
  conditionHi: string;
  iconName: 'Sun' | 'CloudSun' | 'Cloud' | 'CloudFog' | 'CloudDrizzle' | 'CloudRain' | 'CloudLightning' | 'Snowflake';
  category: 'clear' | 'cloudy' | 'fog' | 'rain' | 'thunderstorm' | 'snow';
  isSevere: boolean;
}

export const WMO_CODE_MAP: Record<number, WmoCodeInfo> = {
  0: {
    code: 0,
    conditionEn: 'Clear Sky',
    conditionHi: 'साफ आसमान',
    iconName: 'Sun',
    category: 'clear',
    isSevere: false
  },
  1: {
    code: 1,
    conditionEn: 'Mainly Clear',
    conditionHi: 'मुख्यतः साफ',
    iconName: 'CloudSun',
    category: 'clear',
    isSevere: false
  },
  2: {
    code: 2,
    conditionEn: 'Partly Cloudy',
    conditionHi: 'आंशिक बादल',
    iconName: 'CloudSun',
    category: 'cloudy',
    isSevere: false
  },
  3: {
    code: 3,
    conditionEn: 'Overcast',
    conditionHi: 'घने बादल',
    iconName: 'Cloud',
    category: 'cloudy',
    isSevere: false
  },
  45: {
    code: 45,
    conditionEn: 'Foggy',
    conditionHi: 'कोहरा',
    iconName: 'CloudFog',
    category: 'fog',
    isSevere: false
  },
  48: {
    code: 48,
    conditionEn: 'Depositing Rime Fog',
    conditionHi: 'जमा हुआ कोहरा',
    iconName: 'CloudFog',
    category: 'fog',
    isSevere: false
  },
  51: {
    code: 51,
    conditionEn: 'Light Drizzle',
    conditionHi: 'हल्की बूंदाबांदी',
    iconName: 'CloudDrizzle',
    category: 'rain',
    isSevere: false
  },
  53: {
    code: 53,
    conditionEn: 'Moderate Drizzle',
    conditionHi: 'मध्यम बूंदाबांदी',
    iconName: 'CloudDrizzle',
    category: 'rain',
    isSevere: false
  },
  55: {
    code: 55,
    conditionEn: 'Dense Drizzle',
    conditionHi: 'सघन बूंदाबांदी',
    iconName: 'CloudDrizzle',
    category: 'rain',
    isSevere: false
  },
  56: {
    code: 56,
    conditionEn: 'Light Freezing Drizzle',
    conditionHi: 'ठंडी बूंदाबांदी',
    iconName: 'CloudDrizzle',
    category: 'rain',
    isSevere: false
  },
  57: {
    code: 57,
    conditionEn: 'Dense Freezing Drizzle',
    conditionHi: 'सघन ठंडी बूंदाबांदी',
    iconName: 'CloudDrizzle',
    category: 'rain',
    isSevere: false
  },
  61: {
    code: 61,
    conditionEn: 'Slight Rain',
    conditionHi: 'हल्की बारिश',
    iconName: 'CloudRain',
    category: 'rain',
    isSevere: false
  },
  63: {
    code: 63,
    conditionEn: 'Moderate Rain',
    conditionHi: 'मध्यम बारिश',
    iconName: 'CloudRain',
    category: 'rain',
    isSevere: false
  },
  65: {
    code: 65,
    conditionEn: 'Heavy Rain',
    conditionHi: 'भारी बारिश',
    iconName: 'CloudRain',
    category: 'rain',
    isSevere: true
  },
  66: {
    code: 66,
    conditionEn: 'Freezing Rain (Light)',
    conditionHi: 'ठंडी बारिश',
    iconName: 'CloudRain',
    category: 'rain',
    isSevere: false
  },
  67: {
    code: 67,
    conditionEn: 'Freezing Rain (Heavy)',
    conditionHi: 'भारी ठंडी बारिश',
    iconName: 'CloudRain',
    category: 'rain',
    isSevere: true
  },
  71: {
    code: 71,
    conditionEn: 'Slight Snow Fall',
    conditionHi: 'हल्की बर्फबारी',
    iconName: 'Snowflake',
    category: 'snow',
    isSevere: false
  },
  73: {
    code: 73,
    conditionEn: 'Moderate Snow Fall',
    conditionHi: 'मध्यम बर्फबारी',
    iconName: 'Snowflake',
    category: 'snow',
    isSevere: false
  },
  75: {
    code: 75,
    conditionEn: 'Heavy Snow Fall',
    conditionHi: 'भारी बर्फबारी',
    iconName: 'Snowflake',
    category: 'snow',
    isSevere: true
  },
  77: {
    code: 77,
    conditionEn: 'Snow Grains',
    conditionHi: 'बर्फ के दाने',
    iconName: 'Snowflake',
    category: 'snow',
    isSevere: false
  },
  80: {
    code: 80,
    conditionEn: 'Slight Rain Showers',
    conditionHi: 'हल्की फुहारें',
    iconName: 'CloudRain',
    category: 'rain',
    isSevere: false
  },
  81: {
    code: 81,
    conditionEn: 'Moderate Rain Showers',
    conditionHi: 'मध्यम फुहारें',
    iconName: 'CloudRain',
    category: 'rain',
    isSevere: false
  },
  82: {
    code: 82,
    conditionEn: 'Violent Rain Showers',
    conditionHi: 'तेज मूसलाधार फुहारें',
    iconName: 'CloudRain',
    category: 'rain',
    isSevere: true
  },
  85: {
    code: 85,
    conditionEn: 'Slight Snow Showers',
    conditionHi: 'हल्की बर्फीली फुहारें',
    iconName: 'Snowflake',
    category: 'snow',
    isSevere: false
  },
  86: {
    code: 86,
    conditionEn: 'Heavy Snow Showers',
    conditionHi: 'भारी बर्फीली फुहारें',
    iconName: 'Snowflake',
    category: 'snow',
    isSevere: true
  },
  95: {
    code: 95,
    conditionEn: 'Thunderstorm',
    conditionHi: 'गरज के साथ तूफान',
    iconName: 'CloudLightning',
    category: 'thunderstorm',
    isSevere: true
  },
  96: {
    code: 96,
    conditionEn: 'Thunderstorm with Slight Hail',
    conditionHi: 'ओलावृष्टि के साथ आंधी',
    iconName: 'CloudLightning',
    category: 'thunderstorm',
    isSevere: true
  },
  99: {
    code: 99,
    conditionEn: 'Thunderstorm with Heavy Hail',
    conditionHi: 'भारी ओलावृष्टि के साथ तूफान',
    iconName: 'CloudLightning',
    category: 'thunderstorm',
    isSevere: true
  }
};

export function getWmoCodeInfo(code: number): WmoCodeInfo {
  if (code in WMO_CODE_MAP) {
    return WMO_CODE_MAP[code];
  }
  return {
    code,
    conditionEn: 'Fair Weather',
    conditionHi: 'सामान्य मौसम',
    iconName: 'CloudSun',
    category: 'clear',
    isSevere: false
  };
}

export function degreesToCompass(degrees: number): string {
  const directions = [
    'N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE',
    'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'
  ];
  const index = Math.round(((degrees % 360) / 22.5)) % 16;
  return directions[index] || 'N';
}
