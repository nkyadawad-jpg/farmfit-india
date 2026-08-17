import { 
  AgroClimaticZoneId, 
  CropDefinition, 
  MspNotifiedCropRecord, 
  MandiPriceRecord, 
  SupplyDemandBalance, 
  DistrictWeatherSummary,
  SoilOrder,
  DataMetadata
} from '../types';

export interface AgroClimaticZoneInfo {
  id: number;
  name: string;
  hindiName: string;
  statesCovered: string[];
  characteristicRainfallMm: number;
  majorSoilTypes: SoilOrder[];
  primaryCrops: string[];
  climateType: string;
}

export const AGRO_CLIMATIC_ZONES: AgroClimaticZoneInfo[] = [
  {
    id: 1,
    name: "Western Himalayan Region",
    hindiName: "पश्चिमी हिमालयी क्षेत्र",
    statesCovered: ["Jammu and Kashmir", "Himachal Pradesh", "Uttarakhand"],
    characteristicRainfallMm: 1650,
    majorSoilTypes: ["Red & Yellow Soil (Alfisols / Ultisols)", "Alluvial Soil (Entisols / Inceptisols)"],
    primaryCrops: ["Maize", "Wheat", "Barley", "Apple", "Potato", "Saffron"],
    climateType: "Sub-tropical to temperate, high elevation"
  },
  {
    id: 2,
    name: "Eastern Himalayan Region",
    hindiName: "पूर्वी हिमालयी क्षेत्र",
    statesCovered: ["Assam", "Sikkim", "Arunachal Pradesh", "Meghalaya", "Nagaland", "Manipur", "Tripura", "Mizoram"],
    characteristicRainfallMm: 2840,
    majorSoilTypes: ["Red & Yellow Soil (Alfisols / Ultisols)", "Laterite Soil (Oxisols)", "Alluvial Soil (Entisols / Inceptisols)"],
    primaryCrops: ["Paddy", "Maize", "Tea", "Jute", "Pineapple", "Ginger"],
    climateType: "Per-humid to humid, heavy monsoon"
  },
  {
    id: 3,
    name: "Lower Gangetic Plains Region",
    hindiName: "निचला गंगा मैदानी क्षेत्र",
    statesCovered: ["West Bengal"],
    characteristicRainfallMm: 1600,
    majorSoilTypes: ["Alluvial Soil (Entisols / Inceptisols)", "Saline / Alkaline Soil"],
    primaryCrops: ["Paddy", "Jute", "Potato", "Mustard", "Sesamum", "Vegetables"],
    climateType: "Moist sub-humid to humid"
  },
  {
    id: 4,
    name: "Middle Gangetic Plains Region",
    hindiName: "मध्य गंगा मैदानी क्षेत्र",
    statesCovered: ["Bihar", "Uttar Pradesh (Eastern)"],
    characteristicRainfallMm: 1250,
    majorSoilTypes: ["Alluvial Soil (Entisols / Inceptisols)"],
    primaryCrops: ["Paddy", "Wheat", "Maize", "Sugarcane", "Gram/Chana", "Lentil/Masur"],
    climateType: "Sub-humid continental"
  },
  {
    id: 5,
    name: "Upper Gangetic Plains Region",
    hindiName: "ऊपरी गंगा मैदानी क्षेत्र",
    statesCovered: ["Uttar Pradesh (Central & Western)"],
    characteristicRainfallMm: 980,
    majorSoilTypes: ["Alluvial Soil (Entisols / Inceptisols)"],
    primaryCrops: ["Wheat", "Sugarcane", "Paddy", "Mustard", "Potato", "Maize"],
    climateType: "Sub-humid to semi-arid"
  },
  {
    id: 6,
    name: "Trans-Gangetic Plains Region",
    hindiName: "ट्रांस-गंगा मैदानी क्षेत्र",
    statesCovered: ["Punjab", "Haryana", "Delhi", "Rajasthan (Ganganagar)"],
    characteristicRainfallMm: 650,
    majorSoilTypes: ["Alluvial Soil (Entisols / Inceptisols)", "Arid / Desert Soil (Aridisols)"],
    primaryCrops: ["Wheat", "Paddy", "Cotton", "Mustard", "Sugarcane", "Gram/Chana"],
    climateType: "Semi-arid with extensive canal & tube well irrigation"
  },
  {
    id: 7,
    name: "Eastern Plateau and Hills Region",
    hindiName: "पूर्वी पठार एवं पर्वतीय क्षेत्र",
    statesCovered: ["Jharkhand", "Odisha", "Chhattisgarh", "Maharashtra (Eastern Vidarbha)", "West Bengal (Purulia)"],
    characteristicRainfallMm: 1370,
    majorSoilTypes: ["Red & Yellow Soil (Alfisols / Ultisols)", "Laterite Soil (Oxisols)"],
    primaryCrops: ["Paddy", "Tur/Arhar", "Groundnut", "Nigerseed", "Maize", "Millets"],
    climateType: "Sub-humid with undulating topography"
  },
  {
    id: 8,
    name: "Central Plateau and Hills Region",
    hindiName: "मध्य पठार एवं पर्वतीय क्षेत्र",
    statesCovered: ["Madhya Pradesh", "Rajasthan (South-Eastern)", "Uttar Pradesh (Bundelkhand)"],
    characteristicRainfallMm: 950,
    majorSoilTypes: ["Black Cotton Soil (Vertisols)", "Red & Yellow Soil (Alfisols / Ultisols)", "Alluvial Soil (Entisols / Inceptisols)"],
    primaryCrops: ["Soybean", "Gram/Chana", "Wheat", "Mustard", "Tur/Arhar", "Urad", "Cotton"],
    climateType: "Semi-arid sub-tropical"
  },
  {
    id: 9,
    name: "Western Plateau and Hills Region",
    hindiName: "पश्चिमी पठार एवं पर्वतीय क्षेत्र",
    statesCovered: ["Maharashtra (Marathwada & Western)", "Madhya Pradesh (South-Western)"],
    characteristicRainfallMm: 720,
    majorSoilTypes: ["Black Cotton Soil (Vertisols)"],
    primaryCrops: ["Cotton", "Soybean", "Jowar", "Tur/Arhar", "Sugarcane", "Gram/Chana", "Onion"],
    climateType: "Semi-arid, rain-shadow prone"
  },
  {
    id: 10,
    name: "Southern Plateau and Hills Region",
    hindiName: "दक्षिणी पठार एवं पर्वतीय क्षेत्र",
    statesCovered: ["Andhra Pradesh (Rayalaseema)", "Telangana", "Karnataka", "Tamil Nadu (Inland)"],
    characteristicRainfallMm: 760,
    majorSoilTypes: ["Red & Yellow Soil (Alfisols / Ultisols)", "Black Cotton Soil (Vertisols)"],
    primaryCrops: ["Groundnut", "Cotton", "Maize", "Tur/Arhar", "Ragi", "Sunflower", "Chillies"],
    climateType: "Semi-arid tropical"
  },
  {
    id: 11,
    name: "East Coast Plains and Hills Region",
    hindiName: "पूर्वी तटीय मैदान एवं पर्वतीय क्षेत्र",
    statesCovered: ["Odisha (Coastal)", "Andhra Pradesh (Coastal)", "Tamil Nadu (Coastal)", "Puducherry"],
    characteristicRainfallMm: 1300,
    majorSoilTypes: ["Alluvial Soil (Entisols / Inceptisols)", "Saline / Alkaline Soil", "Red & Yellow Soil (Alfisols / Ultisols)"],
    primaryCrops: ["Paddy", "Groundnut", "Sugarcane", "Black Gram/Urad", "Coconut", "Cotton"],
    climateType: "Humid to sub-humid tropical"
  },
  {
    id: 12,
    name: "West Coast Plains and Ghats Region",
    hindiName: "पश्चिमी तटीय मैदान एवं घाट क्षेत्र",
    statesCovered: ["Kerala", "Goa", "Karnataka (Coastal)", "Maharashtra (Konkan)", "Tamil Nadu (Nilgiris)"],
    characteristicRainfallMm: 3100,
    majorSoilTypes: ["Laterite Soil (Oxisols)", "Red & Yellow Soil (Alfisols / Ultisols)", "Alluvial Soil (Entisols / Inceptisols)"],
    primaryCrops: ["Paddy", "Coconut", "Rubber", "Black Pepper", "Arecanut", "Cardamom", "Cashew"],
    climateType: "Per-humid tropical monsoon"
  },
  {
    id: 13,
    name: "Gujarat Plains and Hills Region",
    hindiName: "गुजरात मैदानी एवं पर्वतीय क्षेत्र",
    statesCovered: ["Gujarat"],
    characteristicRainfallMm: 820,
    majorSoilTypes: ["Black Cotton Soil (Vertisols)", "Alluvial Soil (Entisols / Inceptisols)", "Saline / Alkaline Soil"],
    primaryCrops: ["Cotton", "Groundnut", "Castor", "Wheat", "Bajra", "Cumin", "Sesamum"],
    climateType: "Arid to semi-arid tropical"
  },
  {
    id: 14,
    name: "Western Dry Region",
    hindiName: "पश्चिमी शुष्क क्षेत्र",
    statesCovered: ["Rajasthan (Western Thar Desert)"],
    characteristicRainfallMm: 320,
    majorSoilTypes: ["Arid / Desert Soil (Aridisols)", "Saline / Alkaline Soil"],
    primaryCrops: ["Bajra", "Guar", "Moong", "Moth Bean", "Mustard", "Cumin", "Isabgol"],
    climateType: "Arid desert, frequent drought"
  },
  {
    id: 15,
    name: "The Islands Region",
    hindiName: "द्वीप समूह क्षेत्र",
    statesCovered: ["Andaman and Nicobar Islands", "Lakshadweep"],
    characteristicRainfallMm: 3000,
    majorSoilTypes: ["Red & Yellow Soil (Alfisols / Ultisols)", "Alluvial Soil (Entisols / Inceptisols)"],
    primaryCrops: ["Paddy", "Coconut", "Arecanut", "Spices", "Oil Palm"],
    climateType: "Equatorial humid marine"
  }
];

export interface DistrictCatalogItem {
  district: string;
  state: string;
  zoneId: number;
  normalRainfallMm: number;
  primarySoil: SoilOrder;
  soilDepth: 'Shallow (< 25 cm)' | 'Medium (25 - 50 cm)' | 'Deep (> 50 cm)';
  defaultPh: number;
  latitude: number;
  longitude: number;
}

export const INDIAN_STATES: string[] = [
  "Madhya Pradesh",
  "Maharashtra",
  "Punjab",
  "Haryana",
  "Uttar Pradesh",
  "Gujarat",
  "Rajasthan",
  "Karnataka",
  "Telangana",
  "Andhra Pradesh",
  "Tamil Nadu",
  "Bihar",
  "West Bengal",
  "Odisha",
  "Chhattisgarh"
];

export const INDIAN_DISTRICTS: DistrictCatalogItem[] = [
  // Madhya Pradesh
  { district: "Indore", state: "Madhya Pradesh", zoneId: 8, normalRainfallMm: 950, primarySoil: "Black Cotton Soil (Vertisols)", soilDepth: "Deep (> 50 cm)", defaultPh: 7.6, latitude: 22.7196, longitude: 75.8577 },
  { district: "Ujjain", state: "Madhya Pradesh", zoneId: 8, normalRainfallMm: 890, primarySoil: "Black Cotton Soil (Vertisols)", soilDepth: "Deep (> 50 cm)", defaultPh: 7.7, latitude: 23.1765, longitude: 75.7885 },
  { district: "Dewas", state: "Madhya Pradesh", zoneId: 8, normalRainfallMm: 920, primarySoil: "Black Cotton Soil (Vertisols)", soilDepth: "Deep (> 50 cm)", defaultPh: 7.5, latitude: 22.9676, longitude: 76.0534 },
  { district: "Bhopal", state: "Madhya Pradesh", zoneId: 8, normalRainfallMm: 1100, primarySoil: "Black Cotton Soil (Vertisols)", soilDepth: "Medium (25 - 50 cm)", defaultPh: 7.4, latitude: 23.2599, longitude: 77.4126 },
  { district: "Sehore", state: "Madhya Pradesh", zoneId: 8, normalRainfallMm: 1200, primarySoil: "Black Cotton Soil (Vertisols)", soilDepth: "Deep (> 50 cm)", defaultPh: 7.5, latitude: 23.2032, longitude: 77.0844 },
  { district: "Vidisha", state: "Madhya Pradesh", zoneId: 8, normalRainfallMm: 1150, primarySoil: "Black Cotton Soil (Vertisols)", soilDepth: "Deep (> 50 cm)", defaultPh: 7.8, latitude: 23.5236, longitude: 77.8080 },
  { district: "Jabalpur", state: "Madhya Pradesh", zoneId: 7, normalRainfallMm: 1350, primarySoil: "Black Cotton Soil (Vertisols)", soilDepth: "Deep (> 50 cm)", defaultPh: 7.2, latitude: 23.1815, longitude: 79.9864 },
  { district: "Hoshangabad (Narmadapuram)", state: "Madhya Pradesh", zoneId: 8, normalRainfallMm: 1280, primarySoil: "Alluvial Soil (Entisols / Inceptisols)", soilDepth: "Deep (> 50 cm)", defaultPh: 7.3, latitude: 22.7519, longitude: 77.7289 },

  // Maharashtra
  { district: "Nashik", state: "Maharashtra", zoneId: 9, normalRainfallMm: 710, primarySoil: "Black Cotton Soil (Vertisols)", soilDepth: "Medium (25 - 50 cm)", defaultPh: 7.4, latitude: 19.9975, longitude: 73.7898 },
  { district: "Pune", state: "Maharashtra", zoneId: 9, normalRainfallMm: 680, primarySoil: "Black Cotton Soil (Vertisols)", soilDepth: "Medium (25 - 50 cm)", defaultPh: 7.5, latitude: 18.5204, longitude: 73.8567 },
  { district: "Ahmednagar", state: "Maharashtra", zoneId: 9, normalRainfallMm: 560, primarySoil: "Black Cotton Soil (Vertisols)", soilDepth: "Medium (25 - 50 cm)", defaultPh: 7.8, latitude: 19.0948, longitude: 74.7480 },
  { district: "Nagpur", state: "Maharashtra", zoneId: 7, normalRainfallMm: 1100, primarySoil: "Black Cotton Soil (Vertisols)", soilDepth: "Deep (> 50 cm)", defaultPh: 7.2, latitude: 21.1458, longitude: 79.0882 },
  { district: "Amravati", state: "Maharashtra", zoneId: 9, normalRainfallMm: 850, primarySoil: "Black Cotton Soil (Vertisols)", soilDepth: "Deep (> 50 cm)", defaultPh: 7.6, latitude: 20.9320, longitude: 77.7523 },
  { district: "Yavatmal", state: "Maharashtra", zoneId: 9, normalRainfallMm: 920, primarySoil: "Black Cotton Soil (Vertisols)", soilDepth: "Deep (> 50 cm)", defaultPh: 7.5, latitude: 20.3888, longitude: 78.1204 },
  { district: "Solapur", state: "Maharashtra", zoneId: 9, normalRainfallMm: 550, primarySoil: "Black Cotton Soil (Vertisols)", soilDepth: "Medium (25 - 50 cm)", defaultPh: 7.9, latitude: 17.6599, longitude: 75.9064 },
  { district: "Kolhapur", state: "Maharashtra", zoneId: 12, normalRainfallMm: 1150, primarySoil: "Laterite Soil (Oxisols)", soilDepth: "Deep (> 50 cm)", defaultPh: 6.8, latitude: 16.7050, longitude: 74.2433 },
  { district: "Aurangabad (Chhatrapati Sambhajinagar)", state: "Maharashtra", zoneId: 9, normalRainfallMm: 650, primarySoil: "Black Cotton Soil (Vertisols)", soilDepth: "Medium (25 - 50 cm)", defaultPh: 7.7, latitude: 19.8762, longitude: 75.3433 },

  // Punjab
  { district: "Ludhiana", state: "Punjab", zoneId: 6, normalRainfallMm: 680, primarySoil: "Alluvial Soil (Entisols / Inceptisols)", soilDepth: "Deep (> 50 cm)", defaultPh: 7.5, latitude: 30.9010, longitude: 75.8573 },
  { district: "Patiala", state: "Punjab", zoneId: 6, normalRainfallMm: 650, primarySoil: "Alluvial Soil (Entisols / Inceptisols)", soilDepth: "Deep (> 50 cm)", defaultPh: 7.4, latitude: 30.3398, longitude: 76.3869 },
  { district: "Bathinda", state: "Punjab", zoneId: 6, normalRainfallMm: 410, primarySoil: "Alluvial Soil (Entisols / Inceptisols)", soilDepth: "Deep (> 50 cm)", defaultPh: 7.9, latitude: 30.2110, longitude: 74.9455 },
  { district: "Amritsar", state: "Punjab", zoneId: 6, normalRainfallMm: 630, primarySoil: "Alluvial Soil (Entisols / Inceptisols)", soilDepth: "Deep (> 50 cm)", defaultPh: 7.6, latitude: 31.6340, longitude: 74.8723 },
  { district: "Jalandhar", state: "Punjab", zoneId: 6, normalRainfallMm: 700, primarySoil: "Alluvial Soil (Entisols / Inceptisols)", soilDepth: "Deep (> 50 cm)", defaultPh: 7.3, latitude: 31.3260, longitude: 75.5762 },

  // Haryana
  { district: "Karnal", state: "Haryana", zoneId: 6, normalRainfallMm: 700, primarySoil: "Alluvial Soil (Entisols / Inceptisols)", soilDepth: "Deep (> 50 cm)", defaultPh: 7.4, latitude: 29.6857, longitude: 76.9905 },
  { district: "Hisar", state: "Haryana", zoneId: 6, normalRainfallMm: 460, primarySoil: "Alluvial Soil (Entisols / Inceptisols)", soilDepth: "Deep (> 50 cm)", defaultPh: 7.8, latitude: 29.1492, longitude: 75.7217 },
  { district: "Sirsa", state: "Haryana", zoneId: 6, normalRainfallMm: 380, primarySoil: "Arid / Desert Soil (Aridisols)", soilDepth: "Deep (> 50 cm)", defaultPh: 8.0, latitude: 29.5349, longitude: 75.0295 },
  { district: "Kurukshetra", state: "Haryana", zoneId: 6, normalRainfallMm: 720, primarySoil: "Alluvial Soil (Entisols / Inceptisols)", soilDepth: "Deep (> 50 cm)", defaultPh: 7.3, latitude: 29.9695, longitude: 76.8783 },

  // Uttar Pradesh
  { district: "Varanasi", state: "Uttar Pradesh", zoneId: 4, normalRainfallMm: 1050, primarySoil: "Alluvial Soil (Entisols / Inceptisols)", soilDepth: "Deep (> 50 cm)", defaultPh: 7.2, latitude: 25.3176, longitude: 82.9739 },
  { district: "Agra", state: "Uttar Pradesh", zoneId: 5, normalRainfallMm: 680, primarySoil: "Alluvial Soil (Entisols / Inceptisols)", soilDepth: "Deep (> 50 cm)", defaultPh: 7.6, latitude: 27.1767, longitude: 78.0081 },
  { district: "Meerut", state: "Uttar Pradesh", zoneId: 5, normalRainfallMm: 850, primarySoil: "Alluvial Soil (Entisols / Inceptisols)", soilDepth: "Deep (> 50 cm)", defaultPh: 7.3, latitude: 28.9845, longitude: 77.7064 },
  { district: "Gorakhpur", state: "Uttar Pradesh", zoneId: 4, normalRainfallMm: 1240, primarySoil: "Alluvial Soil (Entisols / Inceptisols)", soilDepth: "Deep (> 50 cm)", defaultPh: 7.1, latitude: 26.7606, longitude: 83.3732 },
  { district: "Prayagraj (Allahabad)", state: "Uttar Pradesh", zoneId: 4, normalRainfallMm: 980, primarySoil: "Alluvial Soil (Entisols / Inceptisols)", soilDepth: "Deep (> 50 cm)", defaultPh: 7.4, latitude: 25.4358, longitude: 81.8463 },
  { district: "Aligarh", state: "Uttar Pradesh", zoneId: 5, normalRainfallMm: 720, primarySoil: "Alluvial Soil (Entisols / Inceptisols)", soilDepth: "Deep (> 50 cm)", defaultPh: 7.7, latitude: 27.8974, longitude: 78.0880 },
  { district: "Jhansi", state: "Uttar Pradesh", zoneId: 8, normalRainfallMm: 850, primarySoil: "Red & Yellow Soil (Alfisols / Ultisols)", soilDepth: "Medium (25 - 50 cm)", defaultPh: 7.2, latitude: 25.4484, longitude: 78.5685 },

  // Gujarat
  { district: "Rajkot", state: "Gujarat", zoneId: 13, normalRainfallMm: 620, primarySoil: "Black Cotton Soil (Vertisols)", soilDepth: "Medium (25 - 50 cm)", defaultPh: 7.8, latitude: 22.3039, longitude: 70.8022 },
  { district: "Surat", state: "Gujarat", zoneId: 13, normalRainfallMm: 1180, primarySoil: "Black Cotton Soil (Vertisols)", soilDepth: "Deep (> 50 cm)", defaultPh: 7.4, latitude: 21.1702, longitude: 72.8311 },
  { district: "Amreli", state: "Gujarat", zoneId: 13, normalRainfallMm: 580, primarySoil: "Black Cotton Soil (Vertisols)", soilDepth: "Medium (25 - 50 cm)", defaultPh: 7.9, latitude: 21.6032, longitude: 71.2221 },
  { district: "Banaskantha", state: "Gujarat", zoneId: 13, normalRainfallMm: 510, primarySoil: "Arid / Desert Soil (Aridisols)", soilDepth: "Medium (25 - 50 cm)", defaultPh: 8.1, latitude: 24.1724, longitude: 72.4346 },
  { district: "Junagadh", state: "Gujarat", zoneId: 13, normalRainfallMm: 840, primarySoil: "Black Cotton Soil (Vertisols)", soilDepth: "Medium (25 - 50 cm)", defaultPh: 7.7, latitude: 21.5222, longitude: 70.4579 },

  // Rajasthan
  { district: "Kota", state: "Rajasthan", zoneId: 8, normalRainfallMm: 750, primarySoil: "Black Cotton Soil (Vertisols)", soilDepth: "Deep (> 50 cm)", defaultPh: 7.6, latitude: 25.2138, longitude: 75.8648 },
  { district: "Jaipur", state: "Rajasthan", zoneId: 5, normalRainfallMm: 580, primarySoil: "Alluvial Soil (Entisols / Inceptisols)", soilDepth: "Medium (25 - 50 cm)", defaultPh: 7.8, latitude: 26.9124, longitude: 75.7873 },
  { district: "Sri Ganganagar", state: "Rajasthan", zoneId: 6, normalRainfallMm: 290, primarySoil: "Alluvial Soil (Entisols / Inceptisols)", soilDepth: "Deep (> 50 cm)", defaultPh: 8.1, latitude: 29.9038, longitude: 73.8772 },
  { district: "Jodhpur", state: "Rajasthan", zoneId: 14, normalRainfallMm: 310, primarySoil: "Arid / Desert Soil (Aridisols)", soilDepth: "Shallow (< 25 cm)", defaultPh: 8.2, latitude: 26.2389, longitude: 73.0243 },
  { district: "Bikaner", state: "Rajasthan", zoneId: 14, normalRainfallMm: 250, primarySoil: "Arid / Desert Soil (Aridisols)", soilDepth: "Shallow (< 25 cm)", defaultPh: 8.3, latitude: 28.0229, longitude: 73.3119 },

  // Karnataka
  { district: "Dharwad", state: "Karnataka", zoneId: 10, normalRainfallMm: 720, primarySoil: "Black Cotton Soil (Vertisols)", soilDepth: "Deep (> 50 cm)", defaultPh: 7.5, latitude: 15.4589, longitude: 75.0078 },
  { district: "Belagavi (Belgaum)", state: "Karnataka", zoneId: 10, normalRainfallMm: 810, primarySoil: "Black Cotton Soil (Vertisols)", soilDepth: "Deep (> 50 cm)", defaultPh: 7.3, latitude: 15.8497, longitude: 74.4977 },
  { district: "Shivamogga (Shimoga)", state: "Karnataka", zoneId: 12, normalRainfallMm: 1750, primarySoil: "Red & Yellow Soil (Alfisols / Ultisols)", soilDepth: "Deep (> 50 cm)", defaultPh: 6.5, latitude: 13.9299, longitude: 75.5681 },
  { district: "Kalaburagi (Gulbarga)", state: "Karnataka", zoneId: 10, normalRainfallMm: 750, primarySoil: "Black Cotton Soil (Vertisols)", soilDepth: "Deep (> 50 cm)", defaultPh: 7.8, latitude: 17.3297, longitude: 76.8343 },
  { district: "Ballari (Bellary)", state: "Karnataka", zoneId: 10, normalRainfallMm: 590, primarySoil: "Red & Yellow Soil (Alfisols / Ultisols)", soilDepth: "Medium (25 - 50 cm)", defaultPh: 7.9, latitude: 15.1394, longitude: 76.9214 },

  // Andhra Pradesh & Telangana
  { district: "Guntur", state: "Andhra Pradesh", zoneId: 11, normalRainfallMm: 890, primarySoil: "Black Cotton Soil (Vertisols)", soilDepth: "Deep (> 50 cm)", defaultPh: 7.6, latitude: 16.3067, longitude: 80.4365 },
  { district: "Kurnool", state: "Andhra Pradesh", zoneId: 10, normalRainfallMm: 670, primarySoil: "Red & Yellow Soil (Alfisols / Ultisols)", soilDepth: "Medium (25 - 50 cm)", defaultPh: 7.8, latitude: 15.8281, longitude: 78.0373 },
  { district: "Warangal", state: "Telangana", zoneId: 10, normalRainfallMm: 980, primarySoil: "Red & Yellow Soil (Alfisols / Ultisols)", soilDepth: "Medium (25 - 50 cm)", defaultPh: 7.2, latitude: 17.9689, longitude: 79.5941 },
  { district: "Nizamabad", state: "Telangana", zoneId: 10, normalRainfallMm: 1020, primarySoil: "Black Cotton Soil (Vertisols)", soilDepth: "Deep (> 50 cm)", defaultPh: 7.4, latitude: 18.6725, longitude: 78.0941 },

  // Bihar & West Bengal
  { district: "Patna", state: "Bihar", zoneId: 4, normalRainfallMm: 1090, primarySoil: "Alluvial Soil (Entisols / Inceptisols)", soilDepth: "Deep (> 50 cm)", defaultPh: 7.3, latitude: 25.5941, longitude: 85.1376 },
  { district: "Muzaffarpur", state: "Bihar", zoneId: 4, normalRainfallMm: 1180, primarySoil: "Alluvial Soil (Entisols / Inceptisols)", soilDepth: "Deep (> 50 cm)", defaultPh: 7.2, latitude: 26.1209, longitude: 85.3647 },
  { district: "Burdwan (Purba Bardhaman)", state: "West Bengal", zoneId: 3, normalRainfallMm: 1450, primarySoil: "Alluvial Soil (Entisols / Inceptisols)", soilDepth: "Deep (> 50 cm)", defaultPh: 6.7, latitude: 23.2324, longitude: 87.8615 },
  { district: "Hooghly", state: "West Bengal", zoneId: 3, normalRainfallMm: 1520, primarySoil: "Alluvial Soil (Entisols / Inceptisols)", soilDepth: "Deep (> 50 cm)", defaultPh: 6.8, latitude: 22.9030, longitude: 88.3888 }
];

export const CACP_METADATA_2024_25: DataMetadata = {
  status: 'LATEST_AVAILABLE',
  source: 'Commission for Agricultural Costs and Prices (CACP), Ministry of Agriculture & Farmers Welfare, GoI',
  sourceUrl: 'https://cacp.dacnet.nic.in/',
  date: 'Notification for Kharif/Rabi Marketing Season 2024-25',
  disclaimer: 'Official MSP and projected A2+FL cost benchmarks fixed by the Cabinet Committee on Economic Affairs (CCEA), Govt. of India.'
};

export const AGMARKNET_METADATA: DataMetadata = {
  status: 'LATEST_AVAILABLE',
  source: 'Directorate of Marketing & Inspection (DMI) / Agmarknet Portal',
  sourceUrl: 'https://agmarknet.gov.in/',
  date: 'Daily Market Trading & Arrivals Session',
  disclaimer: 'Modal prices reflect registered regulated APMC mandi wholesale transactions.'
};

export const IMD_METADATA: DataMetadata = {
  status: 'LATEST_AVAILABLE',
  source: 'India Meteorological Department (IMD) - Agrimet Division',
  sourceUrl: 'https://mausam.imd.gov.in/',
  date: 'National Agromet Advisory Bulletin (Current Monsoon Monitoring)',
  disclaimer: 'Seasonal rainfall normals and 7-day numerical weather prediction models.'
};

export const DES_METADATA: DataMetadata = {
  status: 'LATEST_AVAILABLE',
  source: 'Directorate of Economics and Statistics (DES), Ministry of Agriculture & Farmers Welfare',
  sourceUrl: 'https://desagri.gov.in/',
  date: '3rd Advance Estimates of Production of Major Crops 2023-24 / 2024-25',
  disclaimer: 'National crop balance sheets, domestic production, and buffer stock estimates.'
};

export const SUPPLY_DEMAND_METADATA = DES_METADATA;

export const SOIL_METADATA: DataMetadata = {
  status: 'LATEST_AVAILABLE',
  source: 'National Bureau of Soil Survey and Land Use Planning (ICAR-NBSS&LUP) & Soil Health Card Portal',
  sourceUrl: 'https://soilhealth.dac.gov.in/',
  date: 'Soil Resource Mapping & SHC Database',
  disclaimer: 'Soil classifications and nutrient benchmarks referenced from ICAR-NBSS&LUP benchmark soil series.'
};

export const DEFAULT_ENGINE_WEIGHTS = {
  soilWeight: 0.25,
  waterWeight: 0.25,
  climateWeight: 0.15,
  profitabilityWeight: 0.20,
  marketMspWeight: 0.15
};

// Official 23 MSP Notified Crops (CCEA / CACP 2024-25 Gazette)
export const OFFICIAL_MSP_RECORDS: MspNotifiedCropRecord[] = [
  {
    id: "paddy_common",
    name: "Paddy (Common)",
    hindiName: "धान (सामान्य)",
    season: "Kharif",
    variety: "Common Grade",
    msp2024_25: 2300,
    msp2023_24: 2183,
    absoluteIncrease: 117,
    percentageIncrease: 5.36,
    cacpProjectedCostA2FL: 1533,
    returnOverCostA2FLPercent: 50.0,
    procuringAgencies: ["Food Corporation of India (FCI)", "State Civil Supplies Corporations"],
    procurementPeriod: "October to March",
    notificationNumber: "CCEA/Kharif/2024-25",
    dateOfNotification: "19-June-2024",
    metadata: CACP_METADATA_2024_25
  },
  {
    id: "paddy_grade_a",
    name: "Paddy (Grade A)",
    hindiName: "धान (ग्रेड-ए)",
    season: "Kharif",
    variety: "Grade 'A'",
    msp2024_25: 2320,
    msp2023_24: 2203,
    absoluteIncrease: 117,
    percentageIncrease: 5.31,
    cacpProjectedCostA2FL: 1533,
    returnOverCostA2FLPercent: 51.3,
    procuringAgencies: ["Food Corporation of India (FCI)", "State Agencies"],
    procurementPeriod: "October to March",
    notificationNumber: "CCEA/Kharif/2024-25",
    dateOfNotification: "19-June-2024",
    metadata: CACP_METADATA_2024_25
  },
  {
    id: "jowar_hybrid",
    name: "Jowar (Hybrid)",
    hindiName: "ज्वार (हाइब्रिड)",
    season: "Kharif",
    variety: "Hybrid",
    msp2024_25: 3371,
    msp2023_24: 3180,
    absoluteIncrease: 191,
    percentageIncrease: 6.01,
    cacpProjectedCostA2FL: 2247,
    returnOverCostA2FLPercent: 50.0,
    procuringAgencies: ["State Procurement Agencies / NAFED"],
    procurementPeriod: "November to February",
    notificationNumber: "CCEA/Kharif/2024-25",
    dateOfNotification: "19-June-2024",
    metadata: CACP_METADATA_2024_25
  },
  {
    id: "jowar_maldandi",
    name: "Jowar (Maldandi)",
    hindiName: "ज्वार (मालदंडी)",
    season: "Kharif",
    variety: "Maldandi (Local Premium)",
    msp2024_25: 3421,
    msp2023_24: 3225,
    absoluteIncrease: 196,
    percentageIncrease: 6.08,
    cacpProjectedCostA2FL: 2247,
    returnOverCostA2FLPercent: 52.2,
    procuringAgencies: ["State Procurement Agencies"],
    procurementPeriod: "November to February",
    notificationNumber: "CCEA/Kharif/2024-25",
    dateOfNotification: "19-June-2024",
    metadata: CACP_METADATA_2024_25
  },
  {
    id: "bajra",
    name: "Bajra (Pearl Millet)",
    hindiName: "बाजरा",
    season: "Kharif",
    variety: "FAQ",
    msp2024_25: 2625,
    msp2023_24: 2500,
    absoluteIncrease: 125,
    percentageIncrease: 5.0,
    cacpProjectedCostA2FL: 1500,
    returnOverCostA2FLPercent: 75.0,
    procuringAgencies: ["NAFED", "FCI", "State Agencies"],
    procurementPeriod: "October to January",
    notificationNumber: "CCEA/Kharif/2024-25",
    dateOfNotification: "19-June-2024",
    metadata: CACP_METADATA_2024_25
  },
  {
    id: "ragi",
    name: "Ragi (Finger Millet)",
    hindiName: "रागी / मड़ुआ",
    season: "Kharif",
    variety: "FAQ",
    msp2024_25: 4290,
    msp2023_24: 3846,
    absoluteIncrease: 444,
    percentageIncrease: 11.54,
    cacpProjectedCostA2FL: 2860,
    returnOverCostA2FLPercent: 50.0,
    procuringAgencies: ["State Civil Supplies Corporations (Karnataka/Odisha/AP)"],
    procurementPeriod: "November to March",
    notificationNumber: "CCEA/Kharif/2024-25",
    dateOfNotification: "19-June-2024",
    metadata: CACP_METADATA_2024_25
  },
  {
    id: "maize",
    name: "Maize (Corn)",
    hindiName: "मक्का",
    season: "Kharif",
    variety: "FAQ",
    msp2024_25: 2225,
    msp2023_24: 2090,
    absoluteIncrease: 135,
    percentageIncrease: 6.46,
    cacpProjectedCostA2FL: 1483,
    returnOverCostA2FLPercent: 50.0,
    procuringAgencies: ["NAFED", "NCCF", "State Agencies"],
    procurementPeriod: "October to February",
    notificationNumber: "CCEA/Kharif/2024-25",
    dateOfNotification: "19-June-2024",
    metadata: CACP_METADATA_2024_25
  },
  {
    id: "tur_arhar",
    name: "Tur / Arhar (Pigeon Pea)",
    hindiName: "तुअर / अरहर",
    season: "Kharif",
    variety: "FAQ",
    msp2024_25: 7550,
    msp2023_24: 7000,
    absoluteIncrease: 550,
    percentageIncrease: 7.86,
    cacpProjectedCostA2FL: 4791,
    returnOverCostA2FLPercent: 57.6,
    procuringAgencies: ["NAFED", "NCCF (Buffer Stock Procurement via e-Samridhi)"],
    procurementPeriod: "December to April",
    notificationNumber: "CCEA/Kharif/2024-25",
    dateOfNotification: "19-June-2024",
    metadata: CACP_METADATA_2024_25
  },
  {
    id: "moong",
    name: "Moong (Green Gram)",
    hindiName: "मूंग",
    season: "Kharif",
    variety: "FAQ",
    msp2024_25: 8682,
    msp2023_24: 8558,
    absoluteIncrease: 124,
    percentageIncrease: 1.45,
    cacpProjectedCostA2FL: 5788,
    returnOverCostA2FLPercent: 50.0,
    procuringAgencies: ["NAFED", "NCCF"],
    procurementPeriod: "October to December",
    notificationNumber: "CCEA/Kharif/2024-25",
    dateOfNotification: "19-June-2024",
    metadata: CACP_METADATA_2024_25
  },
  {
    id: "urad",
    name: "Urad (Black Gram)",
    hindiName: "उड़द",
    season: "Kharif",
    variety: "FAQ",
    msp2024_25: 7400,
    msp2023_24: 6950,
    absoluteIncrease: 450,
    percentageIncrease: 6.47,
    cacpProjectedCostA2FL: 4933,
    returnOverCostA2FLPercent: 50.0,
    procuringAgencies: ["NAFED", "NCCF (e-Samridhi Portal)"],
    procurementPeriod: "October to January",
    notificationNumber: "CCEA/Kharif/2024-25",
    dateOfNotification: "19-June-2024",
    metadata: CACP_METADATA_2024_25
  },
  {
    id: "groundnut",
    name: "Groundnut (in shell)",
    hindiName: "मूंगफली",
    season: "Kharif",
    variety: "Pods FAQ",
    msp2024_25: 6783,
    msp2023_24: 6377,
    absoluteIncrease: 406,
    percentageIncrease: 6.37,
    cacpProjectedCostA2FL: 4522,
    returnOverCostA2FLPercent: 50.0,
    procuringAgencies: ["NAFED", "State Oilseed Federations"],
    procurementPeriod: "November to February",
    notificationNumber: "CCEA/Kharif/2024-25",
    dateOfNotification: "19-June-2024",
    metadata: CACP_METADATA_2024_25
  },
  {
    id: "sunflower_seed",
    name: "Sunflower Seed",
    hindiName: "सूरजमुखी बीज",
    season: "Kharif",
    variety: "FAQ",
    msp2024_25: 7280,
    msp2023_24: 6760,
    absoluteIncrease: 520,
    percentageIncrease: 7.69,
    cacpProjectedCostA2FL: 4853,
    returnOverCostA2FLPercent: 50.0,
    procuringAgencies: ["NAFED"],
    procurementPeriod: "October to January",
    notificationNumber: "CCEA/Kharif/2024-25",
    dateOfNotification: "19-June-2024",
    metadata: CACP_METADATA_2024_25
  },
  {
    id: "soybean",
    name: "Soybean (Yellow)",
    hindiName: "सोयाबीन (पीला)",
    season: "Kharif",
    variety: "Yellow FAQ",
    msp2024_25: 4892,
    msp2023_24: 4600,
    absoluteIncrease: 292,
    percentageIncrease: 6.35,
    cacpProjectedCostA2FL: 3261,
    returnOverCostA2FLPercent: 50.0,
    procuringAgencies: ["NAFED", "State Cooperative Marketing Federations"],
    procurementPeriod: "October to January",
    notificationNumber: "CCEA/Kharif/2024-25",
    dateOfNotification: "19-June-2024",
    metadata: CACP_METADATA_2024_25
  },
  {
    id: "sesamum",
    name: "Sesamum (Til)",
    hindiName: "तिल",
    season: "Kharif",
    variety: "FAQ",
    msp2024_25: 9267,
    msp2023_24: 8635,
    absoluteIncrease: 632,
    percentageIncrease: 7.32,
    cacpProjectedCostA2FL: 6178,
    returnOverCostA2FLPercent: 50.0,
    procuringAgencies: ["NAFED", "TRIFED"],
    procurementPeriod: "November to February",
    notificationNumber: "CCEA/Kharif/2024-25",
    dateOfNotification: "19-June-2024",
    metadata: CACP_METADATA_2024_25
  },
  {
    id: "nigerseed",
    name: "Nigerseed (Ramtil)",
    hindiName: "रामतिल",
    season: "Kharif",
    variety: "FAQ",
    msp2024_25: 8717,
    msp2023_24: 7734,
    absoluteIncrease: 983,
    percentageIncrease: 12.71,
    cacpProjectedCostA2FL: 5811,
    returnOverCostA2FLPercent: 50.0,
    procuringAgencies: ["TRIFED", "NAFED"],
    procurementPeriod: "December to February",
    notificationNumber: "CCEA/Kharif/2024-25",
    dateOfNotification: "19-June-2024",
    metadata: CACP_METADATA_2024_25
  },
  {
    id: "cotton_medium",
    name: "Cotton (Medium Staple)",
    hindiName: "कपास (मध्यम रेशा)",
    season: "Kharif",
    variety: "Medium Staple (24.5 - 25.5 mm)",
    msp2024_25: 7121,
    msp2023_24: 6620,
    absoluteIncrease: 501,
    percentageIncrease: 7.57,
    cacpProjectedCostA2FL: 4747,
    returnOverCostA2FLPercent: 50.0,
    procuringAgencies: ["Cotton Corporation of India (CCI)", "Maharashtra State Cotton Growers Federation"],
    procurementPeriod: "October to March",
    notificationNumber: "CCEA/Kharif/2024-25",
    dateOfNotification: "19-June-2024",
    metadata: CACP_METADATA_2024_25
  },
  {
    id: "cotton_long",
    name: "Cotton (Long Staple)",
    hindiName: "कपास (लंबा रेशा)",
    season: "Kharif",
    variety: "Long Staple (29.5 - 30.5 mm)",
    msp2024_25: 7521,
    msp2023_24: 7020,
    absoluteIncrease: 501,
    percentageIncrease: 7.14,
    cacpProjectedCostA2FL: 4747,
    returnOverCostA2FLPercent: 58.4,
    procuringAgencies: ["Cotton Corporation of India (CCI)"],
    procurementPeriod: "October to March",
    notificationNumber: "CCEA/Kharif/2024-25",
    dateOfNotification: "19-June-2024",
    metadata: CACP_METADATA_2024_25
  },
  {
    id: "wheat",
    name: "Wheat",
    hindiName: "गेहूं",
    season: "Rabi",
    variety: "FAQ",
    msp2024_25: 2425,
    msp2023_24: 2275,
    absoluteIncrease: 150,
    percentageIncrease: 6.59,
    cacpProjectedCostA2FL: 1192,
    returnOverCostA2FLPercent: 103.4,
    procuringAgencies: ["Food Corporation of India (FCI)", "State Agencies"],
    procurementPeriod: "April to June",
    notificationNumber: "CCEA/Rabi/2024-25",
    dateOfNotification: "18-October-2023 (Rabi 2024-25)",
    metadata: CACP_METADATA_2024_25
  },
  {
    id: "barley",
    name: "Barley (Jau)",
    hindiName: "जौ",
    season: "Rabi",
    variety: "FAQ",
    msp2024_25: 1850,
    msp2023_24: 1735,
    absoluteIncrease: 115,
    percentageIncrease: 6.63,
    cacpProjectedCostA2FL: 1158,
    returnOverCostA2FLPercent: 59.8,
    procuringAgencies: ["FCI", "State Agencies"],
    procurementPeriod: "April to May",
    notificationNumber: "CCEA/Rabi/2024-25",
    dateOfNotification: "18-October-2023",
    metadata: CACP_METADATA_2024_25
  },
  {
    id: "gram_chana",
    name: "Gram / Chana (Chickpea)",
    hindiName: "चना",
    season: "Rabi",
    variety: "FAQ",
    msp2024_25: 5440,
    msp2023_24: 5335,
    absoluteIncrease: 105,
    percentageIncrease: 1.97,
    cacpProjectedCostA2FL: 3400,
    returnOverCostA2FLPercent: 60.0,
    procuringAgencies: ["NAFED", "NCCF"],
    procurementPeriod: "March to June",
    notificationNumber: "CCEA/Rabi/2024-25",
    dateOfNotification: "18-October-2023",
    metadata: CACP_METADATA_2024_25
  },
  {
    id: "lentil_masur",
    name: "Lentil / Masur",
    hindiName: "मसूर",
    season: "Rabi",
    variety: "FAQ",
    msp2024_25: 6425,
    msp2023_24: 6000,
    absoluteIncrease: 425,
    percentageIncrease: 7.08,
    cacpProjectedCostA2FL: 3402,
    returnOverCostA2FLPercent: 88.9,
    procuringAgencies: ["NAFED", "NCCF (e-Samridhi 100% Procurement)"],
    procurementPeriod: "March to June",
    notificationNumber: "CCEA/Rabi/2024-25",
    dateOfNotification: "18-October-2023",
    metadata: CACP_METADATA_2024_25
  },
  {
    id: "mustard_rapeseed",
    name: "Rapeseed & Mustard",
    hindiName: "सरसों / राई",
    season: "Rabi",
    variety: "FAQ",
    msp2024_25: 5650,
    msp2023_24: 5450,
    absoluteIncrease: 200,
    percentageIncrease: 3.67,
    cacpProjectedCostA2FL: 2855,
    returnOverCostA2FLPercent: 97.9,
    procuringAgencies: ["NAFED", "HAFED"],
    procurementPeriod: "March to May",
    notificationNumber: "CCEA/Rabi/2024-25",
    dateOfNotification: "18-October-2023",
    metadata: CACP_METADATA_2024_25
  },
  {
    id: "safflower",
    name: "Safflower (Kardi)",
    hindiName: "कुसुम / करड़ी",
    season: "Rabi",
    variety: "FAQ",
    msp2024_25: 5800,
    msp2023_24: 5650,
    absoluteIncrease: 150,
    percentageIncrease: 2.65,
    cacpProjectedCostA2FL: 3807,
    returnOverCostA2FLPercent: 52.4,
    procuringAgencies: ["NAFED"],
    procurementPeriod: "March to May",
    notificationNumber: "CCEA/Rabi/2024-25",
    dateOfNotification: "18-October-2023",
    metadata: CACP_METADATA_2024_25
  }
];

// Comprehensive Master Crop Catalog with CACP Costs (A2, A2+FL, C2) and Agronomic Parameters
export const MASTER_CROPS: CropDefinition[] = [
  {
    id: "soybean",
    name: "Soybean (Yellow)",
    hindiName: "सोयाबीन",
    botanicalName: "Glycine max",
    category: "Oilseeds",
    season: "Kharif",
    durationDays: 95,
    sowingWindow: "15 June - 05 July (With onset of South-West Monsoon)",
    harvestWindow: "25 September - 20 October",
    waterRequirementMm: 450,
    optimalSoil: ["Black Cotton Soil (Vertisols)", "Alluvial Soil (Entisols / Inceptisols)"],
    optimalPhMin: 6.2,
    optimalPhMax: 7.8,
    tempMinC: 18,
    tempMaxC: 34,
    seedRateKgPerAcre: 30,
    avgYieldQuintalPerAcre: 8.5,
    yieldRangeQuintalPerAcre: { min: 5.5, max: 12.0 },
    cacpCostPerQuintalA2: 2450,
    cacpCostPerQuintalA2FL: 3261,
    cacpCostPerQuintalC2: 4420,
    mspNotified: true,
    mspPrice2024_25: 4892,
    mspPrice2023_24: 4600,
    mspCostA2FLBenchmark: 3261,
    pmfbyInsurancePremiumRatePercent: 2.0,
    riskFactors: {
      droughtSensitivity: "High",
      waterloggingSensitivity: "High",
      priceVolatilityRisk: "Medium",
      pestDiseaseRisk: "Medium",
      storagePerishability: "Low (Grain/Pulse)"
    },
    metadata: CACP_METADATA_2024_25
  },
  {
    id: "cotton_long",
    name: "Bt Cotton (Long Staple)",
    hindiName: "कपास (बीटी)",
    botanicalName: "Gossypium hirsutum",
    category: "Commercial & Fibres",
    season: "Kharif",
    durationDays: 160,
    sowingWindow: "01 June - 25 June",
    harvestWindow: "01 November - 15 January (Multi-picking)",
    waterRequirementMm: 700,
    optimalSoil: ["Black Cotton Soil (Vertisols)", "Alluvial Soil (Entisols / Inceptisols)"],
    optimalPhMin: 6.5,
    optimalPhMax: 8.2,
    tempMinC: 20,
    tempMaxC: 38,
    seedRateKgPerAcre: 1.8, // packets (Bt hybrid)
    avgYieldQuintalPerAcre: 9.0, // Seed cotton (Kapas)
    yieldRangeQuintalPerAcre: { min: 6.0, max: 14.5 },
    cacpCostPerQuintalA2: 3620,
    cacpCostPerQuintalA2FL: 4747,
    cacpCostPerQuintalC2: 6380,
    mspNotified: true,
    mspPrice2024_25: 7521,
    mspPrice2023_24: 7020,
    mspCostA2FLBenchmark: 4747,
    pmfbyInsurancePremiumRatePercent: 2.0,
    riskFactors: {
      droughtSensitivity: "Medium",
      waterloggingSensitivity: "High",
      priceVolatilityRisk: "High",
      pestDiseaseRisk: "High", // Pink bollworm
      storagePerishability: "Low (Grain/Pulse)"
    },
    metadata: CACP_METADATA_2024_25
  },
  {
    id: "paddy_common",
    name: "Paddy / Rice (Common)",
    hindiName: "धान",
    botanicalName: "Oryza sativa",
    category: "Cereals",
    season: "Kharif",
    durationDays: 125,
    sowingWindow: "15 June - 15 July (Transplanting)",
    harvestWindow: "15 October - 20 November",
    waterRequirementMm: 1200,
    optimalSoil: ["Alluvial Soil (Entisols / Inceptisols)", "Red & Yellow Soil (Alfisols / Ultisols)", "Black Cotton Soil (Vertisols)"],
    optimalPhMin: 5.5,
    optimalPhMax: 7.5,
    tempMinC: 20,
    tempMaxC: 36,
    seedRateKgPerAcre: 15,
    avgYieldQuintalPerAcre: 20.0,
    yieldRangeQuintalPerAcre: { min: 14.0, max: 28.0 },
    cacpCostPerQuintalA2: 1120,
    cacpCostPerQuintalA2FL: 1533,
    cacpCostPerQuintalC2: 2150,
    mspNotified: true,
    mspPrice2024_25: 2300,
    mspPrice2023_24: 2183,
    mspCostA2FLBenchmark: 1533,
    pmfbyInsurancePremiumRatePercent: 2.0,
    riskFactors: {
      droughtSensitivity: "High",
      waterloggingSensitivity: "Low",
      priceVolatilityRisk: "Low",
      pestDiseaseRisk: "Medium",
      storagePerishability: "Low (Grain/Pulse)"
    },
    metadata: CACP_METADATA_2024_25
  },
  {
    id: "tur_arhar",
    name: "Tur / Arhar (Pigeonpea)",
    hindiName: "तुअर / अरहर",
    botanicalName: "Cajanus cajan",
    category: "Pulses",
    season: "Kharif",
    durationDays: 165,
    sowingWindow: "15 June - 10 July",
    harvestWindow: "15 December - 25 January",
    waterRequirementMm: 450,
    optimalSoil: ["Black Cotton Soil (Vertisols)", "Red & Yellow Soil (Alfisols / Ultisols)", "Alluvial Soil (Entisols / Inceptisols)"],
    optimalPhMin: 6.5,
    optimalPhMax: 8.0,
    tempMinC: 18,
    tempMaxC: 35,
    seedRateKgPerAcre: 5.0,
    avgYieldQuintalPerAcre: 6.5,
    yieldRangeQuintalPerAcre: { min: 4.0, max: 10.5 },
    cacpCostPerQuintalA2: 3550,
    cacpCostPerQuintalA2FL: 4791,
    cacpCostPerQuintalC2: 6650,
    mspNotified: true,
    mspPrice2024_25: 7550,
    mspPrice2023_24: 7000,
    mspCostA2FLBenchmark: 4791,
    pmfbyInsurancePremiumRatePercent: 2.0,
    riskFactors: {
      droughtSensitivity: "Low",
      waterloggingSensitivity: "High",
      priceVolatilityRisk: "Medium",
      pestDiseaseRisk: "High", // Pod borer
      storagePerishability: "Low (Grain/Pulse)"
    },
    metadata: CACP_METADATA_2024_25
  },
  {
    id: "groundnut",
    name: "Groundnut (Kharif)",
    hindiName: "मूंगफली",
    botanicalName: "Arachis hypogaea",
    category: "Oilseeds",
    season: "Kharif",
    durationDays: 110,
    sowingWindow: "20 June - 15 July",
    harvestWindow: "15 October - 15 November",
    waterRequirementMm: 500,
    optimalSoil: ["Red & Yellow Soil (Alfisols / Ultisols)", "Alluvial Soil (Entisols / Inceptisols)", "Arid / Desert Soil (Aridisols)"],
    optimalPhMin: 6.0,
    optimalPhMax: 7.8,
    tempMinC: 22,
    tempMaxC: 35,
    seedRateKgPerAcre: 45,
    avgYieldQuintalPerAcre: 9.5,
    yieldRangeQuintalPerAcre: { min: 6.5, max: 14.0 },
    cacpCostPerQuintalA2: 3450,
    cacpCostPerQuintalA2FL: 4522,
    cacpCostPerQuintalC2: 6150,
    mspNotified: true,
    mspPrice2024_25: 6783,
    mspPrice2023_24: 6377,
    mspCostA2FLBenchmark: 4522,
    pmfbyInsurancePremiumRatePercent: 2.0,
    riskFactors: {
      droughtSensitivity: "Medium",
      waterloggingSensitivity: "High",
      priceVolatilityRisk: "Medium",
      pestDiseaseRisk: "Medium", // Tikka disease
      storagePerishability: "Low (Grain/Pulse)"
    },
    metadata: CACP_METADATA_2024_25
  },
  {
    id: "maize",
    name: "Maize (Kharif / Rabi)",
    hindiName: "मक्का",
    botanicalName: "Zea mays",
    category: "Cereals",
    season: "Kharif",
    durationDays: 100,
    sowingWindow: "15 June - 10 July",
    harvestWindow: "25 September - 25 October",
    waterRequirementMm: 550,
    optimalSoil: ["Alluvial Soil (Entisols / Inceptisols)", "Red & Yellow Soil (Alfisols / Ultisols)", "Black Cotton Soil (Vertisols)"],
    optimalPhMin: 6.0,
    optimalPhMax: 7.5,
    tempMinC: 18,
    tempMaxC: 36,
    seedRateKgPerAcre: 8.0,
    avgYieldQuintalPerAcre: 18.0,
    yieldRangeQuintalPerAcre: { min: 12.0, max: 26.0 },
    cacpCostPerQuintalA2: 1100,
    cacpCostPerQuintalA2FL: 1483,
    cacpCostPerQuintalC2: 2020,
    mspNotified: true,
    mspPrice2024_25: 2225,
    mspPrice2023_24: 2090,
    mspCostA2FLBenchmark: 1483,
    pmfbyInsurancePremiumRatePercent: 2.0,
    riskFactors: {
      droughtSensitivity: "Medium",
      waterloggingSensitivity: "High",
      priceVolatilityRisk: "Medium",
      pestDiseaseRisk: "High", // Fall Armyworm
      storagePerishability: "Low (Grain/Pulse)"
    },
    metadata: CACP_METADATA_2024_25
  },
  {
    id: "bajra",
    name: "Bajra (Pearl Millet)",
    hindiName: "बाजरा",
    botanicalName: "Pennisetum glaucum",
    category: "Millets (Shree Anna)",
    season: "Kharif",
    durationDays: 85,
    sowingWindow: "25 June - 20 July",
    harvestWindow: "15 September - 15 October",
    waterRequirementMm: 300,
    optimalSoil: ["Arid / Desert Soil (Aridisols)", "Alluvial Soil (Entisols / Inceptisols)", "Red & Yellow Soil (Alfisols / Ultisols)"],
    optimalPhMin: 6.5,
    optimalPhMax: 8.5,
    tempMinC: 22,
    tempMaxC: 40,
    seedRateKgPerAcre: 2.0,
    avgYieldQuintalPerAcre: 11.0,
    yieldRangeQuintalPerAcre: { min: 7.0, max: 16.0 },
    cacpCostPerQuintalA2: 1050,
    cacpCostPerQuintalA2FL: 1500,
    cacpCostPerQuintalC2: 2100,
    mspNotified: true,
    mspPrice2024_25: 2625,
    mspPrice2023_24: 2500,
    mspCostA2FLBenchmark: 1500,
    pmfbyInsurancePremiumRatePercent: 2.0,
    riskFactors: {
      droughtSensitivity: "Low",
      waterloggingSensitivity: "High",
      priceVolatilityRisk: "Low",
      pestDiseaseRisk: "Low",
      storagePerishability: "Low (Grain/Pulse)"
    },
    metadata: CACP_METADATA_2024_25
  },
  {
    id: "moong",
    name: "Green Gram (Moong)",
    hindiName: "मूंग",
    botanicalName: "Vigna radiata",
    category: "Pulses",
    season: "Kharif",
    durationDays: 65,
    sowingWindow: "20 June - 10 July",
    harvestWindow: "25 August - 20 September",
    waterRequirementMm: 320,
    optimalSoil: ["Alluvial Soil (Entisols / Inceptisols)", "Black Cotton Soil (Vertisols)", "Red & Yellow Soil (Alfisols / Ultisols)"],
    optimalPhMin: 6.5,
    optimalPhMax: 7.8,
    tempMinC: 22,
    tempMaxC: 38,
    seedRateKgPerAcre: 8.0,
    avgYieldQuintalPerAcre: 4.5,
    yieldRangeQuintalPerAcre: { min: 3.0, max: 7.0 },
    cacpCostPerQuintalA2: 4200,
    cacpCostPerQuintalA2FL: 5788,
    cacpCostPerQuintalC2: 7850,
    mspNotified: true,
    mspPrice2024_25: 8682,
    mspPrice2023_24: 8558,
    mspCostA2FLBenchmark: 5788,
    pmfbyInsurancePremiumRatePercent: 2.0,
    riskFactors: {
      droughtSensitivity: "Low",
      waterloggingSensitivity: "High",
      priceVolatilityRisk: "Medium",
      pestDiseaseRisk: "High", // Yellow mosaic virus
      storagePerishability: "Low (Grain/Pulse)"
    },
    metadata: CACP_METADATA_2024_25
  },
  {
    id: "wheat",
    name: "Wheat",
    hindiName: "गेहूं",
    botanicalName: "Triticum aestivum",
    category: "Cereals",
    season: "Rabi",
    durationDays: 120,
    sowingWindow: "01 November - 25 November",
    harvestWindow: "15 March - 20 April",
    waterRequirementMm: 450,
    optimalSoil: ["Alluvial Soil (Entisols / Inceptisols)", "Black Cotton Soil (Vertisols)"],
    optimalPhMin: 6.0,
    optimalPhMax: 8.0,
    tempMinC: 10,
    tempMaxC: 28,
    seedRateKgPerAcre: 40,
    avgYieldQuintalPerAcre: 19.5,
    yieldRangeQuintalPerAcre: { min: 14.0, max: 26.0 },
    cacpCostPerQuintalA2: 880,
    cacpCostPerQuintalA2FL: 1192,
    cacpCostPerQuintalC2: 1720,
    mspNotified: true,
    mspPrice2024_25: 2425,
    mspPrice2023_24: 2275,
    mspCostA2FLBenchmark: 1192,
    pmfbyInsurancePremiumRatePercent: 1.5,
    riskFactors: {
      droughtSensitivity: "Medium",
      waterloggingSensitivity: "Medium",
      priceVolatilityRisk: "Low",
      pestDiseaseRisk: "Low", // Rust
      storagePerishability: "Low (Grain/Pulse)"
    },
    metadata: CACP_METADATA_2024_25
  },
  {
    id: "gram_chana",
    name: "Gram / Chana (Desi Chickpea)",
    hindiName: "चना",
    botanicalName: "Cicer arietinum",
    category: "Pulses",
    season: "Rabi",
    durationDays: 110,
    sowingWindow: "15 October - 15 November",
    harvestWindow: "25 February - 30 March",
    waterRequirementMm: 280,
    optimalSoil: ["Black Cotton Soil (Vertisols)", "Alluvial Soil (Entisols / Inceptisols)", "Red & Yellow Soil (Alfisols / Ultisols)"],
    optimalPhMin: 6.2,
    optimalPhMax: 8.2,
    tempMinC: 10,
    tempMaxC: 30,
    seedRateKgPerAcre: 30,
    avgYieldQuintalPerAcre: 7.5,
    yieldRangeQuintalPerAcre: { min: 5.0, max: 12.0 },
    cacpCostPerQuintalA2: 2480,
    cacpCostPerQuintalA2FL: 3400,
    cacpCostPerQuintalC2: 4850,
    mspNotified: true,
    mspPrice2024_25: 5440,
    mspPrice2023_24: 5335,
    mspCostA2FLBenchmark: 3400,
    pmfbyInsurancePremiumRatePercent: 1.5,
    riskFactors: {
      droughtSensitivity: "Low",
      waterloggingSensitivity: "High",
      priceVolatilityRisk: "Medium",
      pestDiseaseRisk: "Medium", // Pod borer
      storagePerishability: "Low (Grain/Pulse)"
    },
    metadata: CACP_METADATA_2024_25
  },
  {
    id: "mustard_rapeseed",
    name: "Rapeseed & Mustard",
    hindiName: "सरसों / राई",
    botanicalName: "Brassica juncea",
    category: "Oilseeds",
    season: "Rabi",
    durationDays: 115,
    sowingWindow: "01 October - 25 October",
    harvestWindow: "15 February - 15 March",
    waterRequirementMm: 300,
    optimalSoil: ["Alluvial Soil (Entisols / Inceptisols)", "Arid / Desert Soil (Aridisols)", "Black Cotton Soil (Vertisols)"],
    optimalPhMin: 6.0,
    optimalPhMax: 7.8,
    tempMinC: 10,
    tempMaxC: 28,
    seedRateKgPerAcre: 1.8,
    avgYieldQuintalPerAcre: 8.0,
    yieldRangeQuintalPerAcre: { min: 5.5, max: 12.5 },
    cacpCostPerQuintalA2: 2100,
    cacpCostPerQuintalA2FL: 2855,
    cacpCostPerQuintalC2: 4120,
    mspNotified: true,
    mspPrice2024_25: 5650,
    mspPrice2023_24: 5450,
    mspCostA2FLBenchmark: 2855,
    pmfbyInsurancePremiumRatePercent: 1.5,
    riskFactors: {
      droughtSensitivity: "Low",
      waterloggingSensitivity: "Medium",
      priceVolatilityRisk: "Medium",
      pestDiseaseRisk: "Medium", // Aphids
      storagePerishability: "Low (Grain/Pulse)"
    },
    metadata: CACP_METADATA_2024_25
  },
  {
    id: "onion",
    name: "Onion (Kharif / Late Kharif / Rabi)",
    hindiName: "प्याज",
    botanicalName: "Allium cepa",
    category: "Vegetables & Spices",
    season: "Kharif",
    durationDays: 110,
    sowingWindow: "15 June - 15 July (Nursery)",
    harvestWindow: "15 October - 15 November",
    waterRequirementMm: 600,
    optimalSoil: ["Alluvial Soil (Entisols / Inceptisols)", "Red & Yellow Soil (Alfisols / Ultisols)", "Black Cotton Soil (Vertisols)"],
    optimalPhMin: 6.0,
    optimalPhMax: 7.5,
    tempMinC: 15,
    tempMaxC: 32,
    seedRateKgPerAcre: 4.0,
    avgYieldQuintalPerAcre: 90.0,
    yieldRangeQuintalPerAcre: { min: 50.0, max: 140.0 },
    cacpCostPerQuintalA2: 950,
    cacpCostPerQuintalA2FL: 1350,
    cacpCostPerQuintalC2: 1850,
    mspNotified: false, // Horticultural crop, no formal MSP, procured selectively by NAFED/NCCF under PSF
    mspPrice2024_25: 0,
    mspPrice2023_24: 0,
    mspCostA2FLBenchmark: 1350,
    pmfbyInsurancePremiumRatePercent: 5.0,
    riskFactors: {
      droughtSensitivity: "High",
      waterloggingSensitivity: "High",
      priceVolatilityRisk: "High", // Severe price swings
      pestDiseaseRisk: "High", // Thrips & purple blotch
      storagePerishability: "High (Perishable)"
    },
    metadata: AGMARKNET_METADATA
  },
  {
    id: "sugarcane",
    name: "Sugarcane (Annual)",
    hindiName: "गन्ना",
    botanicalName: "Saccharum officinarum",
    category: "Commercial & Fibres",
    season: "Annual / Commercial",
    durationDays: 360,
    sowingWindow: "15 October - 15 November (Autumn) / 15 February - 15 March (Spring)",
    harvestWindow: "December - April",
    waterRequirementMm: 1800,
    optimalSoil: ["Alluvial Soil (Entisols / Inceptisols)", "Black Cotton Soil (Vertisols)", "Red & Yellow Soil (Alfisols / Ultisols)"],
    optimalPhMin: 6.5,
    optimalPhMax: 8.0,
    tempMinC: 15,
    tempMaxC: 38,
    seedRateKgPerAcre: 3000, // 3-bud setts (30-35 quintals)
    avgYieldQuintalPerAcre: 350.0,
    yieldRangeQuintalPerAcre: { min: 250.0, max: 500.0 },
    cacpCostPerQuintalA2: 165,
    cacpCostPerQuintalA2FL: 235,
    cacpCostPerQuintalC2: 320,
    mspNotified: true, // FRP (Fair and Remunerative Price)
    mspPrice2024_25: 340, // per quintal FRP for 2024-25 at 10.25% sugar recovery
    mspPrice2023_24: 315,
    mspCostA2FLBenchmark: 235,
    pmfbyInsurancePremiumRatePercent: 5.0,
    riskFactors: {
      droughtSensitivity: "High",
      waterloggingSensitivity: "Medium",
      priceVolatilityRisk: "Low", // Mill statutory payment
      pestDiseaseRisk: "Medium", // Red rot, Pyrilla
      storagePerishability: "Medium"
    },
    metadata: CACP_METADATA_2024_25
  }
];

// APMC Mandis Directory across states with benchmark modal price feeds
export const APMC_MANDI_RECORDS: MandiPriceRecord[] = [
  // Indore APMC (MP)
  {
    mandiId: "mp_indore_01",
    mandiName: "Indore (Laxmibai Nagar Mandi)",
    district: "Indore",
    state: "Madhya Pradesh",
    cropId: "soybean",
    cropName: "Soybean (Yellow)",
    distanceKm: 18,
    minPricePerQuintal: 4400,
    maxPricePerQuintal: 4950,
    modalPricePerQuintal: 4720,
    dailyArrivalsTonnes: 1420,
    arrivalTrend: "Increasing",
    freightCostPerKmPerQuintal: 1.1,
    hamaliChargesPerQuintal: 28,
    mandiCessPercent: 1.5,
    netRealizationPerQuintal: 4601.2,
    date: "Current Agmarknet Session",
    metadata: AGMARKNET_METADATA
  },
  {
    mandiId: "mp_indore_02",
    mandiName: "Indore (Laxmibai Nagar Mandi)",
    district: "Indore",
    state: "Madhya Pradesh",
    cropId: "wheat",
    cropName: "Wheat (Lokwan / Sharbati)",
    distanceKm: 18,
    minPricePerQuintal: 2550,
    maxPricePerQuintal: 3100,
    modalPricePerQuintal: 2780,
    dailyArrivalsTonnes: 850,
    arrivalTrend: "Stable",
    freightCostPerKmPerQuintal: 1.1,
    hamaliChargesPerQuintal: 28,
    mandiCessPercent: 1.5,
    netRealizationPerQuintal: 2690.5,
    date: "Current Agmarknet Session",
    metadata: AGMARKNET_METADATA
  },
  {
    mandiId: "mp_dewas_01",
    mandiName: "Dewas APMC",
    district: "Dewas",
    state: "Madhya Pradesh",
    cropId: "soybean",
    cropName: "Soybean (Yellow)",
    distanceKm: 42,
    minPricePerQuintal: 4380,
    maxPricePerQuintal: 4850,
    modalPricePerQuintal: 4680,
    dailyArrivalsTonnes: 620,
    arrivalTrend: "Stable",
    freightCostPerKmPerQuintal: 1.05,
    hamaliChargesPerQuintal: 25,
    mandiCessPercent: 1.5,
    netRealizationPerQuintal: 4540.7,
    date: "Current Agmarknet Session",
    metadata: AGMARKNET_METADATA
  },
  {
    mandiId: "mp_ujjain_01",
    mandiName: "Ujjain APMC",
    district: "Ujjain",
    state: "Madhya Pradesh",
    cropId: "gram_chana",
    cropName: "Gram / Chana",
    distanceKm: 58,
    minPricePerQuintal: 5600,
    maxPricePerQuintal: 6200,
    modalPricePerQuintal: 5950,
    dailyArrivalsTonnes: 430,
    arrivalTrend: "Stable",
    freightCostPerKmPerQuintal: 1.0,
    hamaliChargesPerQuintal: 26,
    mandiCessPercent: 1.5,
    netRealizationPerQuintal: 5776.75,
    date: "Current Agmarknet Session",
    metadata: AGMARKNET_METADATA
  },

  // Maharashtra Mandis
  {
    mandiId: "mh_lasalgaon_01",
    mandiName: "Lasalgaon APMC (Asia's Largest Onion Market)",
    district: "Nashik",
    state: "Maharashtra",
    cropId: "onion",
    cropName: "Onion (Summer/Rabi)",
    distanceKm: 34,
    minPricePerQuintal: 1800,
    maxPricePerQuintal: 2950,
    modalPricePerQuintal: 2450,
    dailyArrivalsTonnes: 3800,
    arrivalTrend: "Increasing",
    freightCostPerKmPerQuintal: 1.2,
    hamaliChargesPerQuintal: 35,
    mandiCessPercent: 1.0,
    netRealizationPerQuintal: 2349.7,
    date: "Current Agmarknet Session",
    metadata: AGMARKNET_METADATA
  },
  {
    mandiId: "mh_pune_01",
    mandiName: "Pune (Gultekdi APMC)",
    district: "Pune",
    state: "Maharashtra",
    cropId: "onion",
    cropName: "Onion",
    distanceKm: 22,
    minPricePerQuintal: 2100,
    maxPricePerQuintal: 3100,
    modalPricePerQuintal: 2650,
    dailyArrivalsTonnes: 1200,
    arrivalTrend: "Stable",
    freightCostPerKmPerQuintal: 1.25,
    hamaliChargesPerQuintal: 32,
    mandiCessPercent: 1.0,
    netRealizationPerQuintal: 2563.8,
    date: "Current Agmarknet Session",
    metadata: AGMARKNET_METADATA
  },
  {
    mandiId: "mh_akola_01",
    mandiName: "Akola APMC",
    district: "Akola",
    state: "Maharashtra",
    cropId: "cotton_long",
    cropName: "Bt Cotton (Medium/Long)",
    distanceKm: 25,
    minPricePerQuintal: 7100,
    maxPricePerQuintal: 7800,
    modalPricePerQuintal: 7480,
    dailyArrivalsTonnes: 1100,
    arrivalTrend: "Stable",
    freightCostPerKmPerQuintal: 1.1,
    hamaliChargesPerQuintal: 30,
    mandiCessPercent: 1.0,
    netRealizationPerQuintal: 7347.7,
    date: "Current Agmarknet Session",
    metadata: AGMARKNET_METADATA
  },
  {
    mandiId: "mh_latur_01",
    mandiName: "Latur APMC (Pulses & Oilseeds Hub)",
    district: "Latur",
    state: "Maharashtra",
    cropId: "tur_arhar",
    cropName: "Tur / Arhar",
    distanceKm: 48,
    minPricePerQuintal: 9800,
    maxPricePerQuintal: 11400,
    modalPricePerQuintal: 10600,
    dailyArrivalsTonnes: 850,
    arrivalTrend: "Increasing",
    freightCostPerKmPerQuintal: 1.1,
    hamaliChargesPerQuintal: 30,
    mandiCessPercent: 1.0,
    netRealizationPerQuintal: 10411.2,
    date: "Current Agmarknet Session",
    metadata: AGMARKNET_METADATA
  },

  // Punjab Mandis
  {
    mandiId: "pb_khanna_01",
    mandiName: "Khanna APMC (Asia's Largest Grain Market)",
    district: "Ludhiana",
    state: "Punjab",
    cropId: "wheat",
    cropName: "Wheat",
    distanceKm: 45,
    minPricePerQuintal: 2425,
    maxPricePerQuintal: 2550,
    modalPricePerQuintal: 2475,
    dailyArrivalsTonnes: 4500,
    arrivalTrend: "Stable",
    freightCostPerKmPerQuintal: 0.9,
    hamaliChargesPerQuintal: 22,
    mandiCessPercent: 3.0, // Punjab RDF/MDF
    netRealizationPerQuintal: 2338.25,
    date: "Current Agmarknet Session",
    metadata: AGMARKNET_METADATA
  },
  {
    mandiId: "pb_khanna_02",
    mandiName: "Khanna APMC",
    district: "Ludhiana",
    state: "Punjab",
    cropId: "paddy_common",
    cropName: "Paddy (PR-126/Common)",
    distanceKm: 45,
    minPricePerQuintal: 2300,
    maxPricePerQuintal: 2380,
    modalPricePerQuintal: 2320,
    dailyArrivalsTonnes: 5200,
    arrivalTrend: "Increasing",
    freightCostPerKmPerQuintal: 0.9,
    hamaliChargesPerQuintal: 22,
    mandiCessPercent: 3.0,
    netRealizationPerQuintal: 2188.4,
    date: "Current Agmarknet Session",
    metadata: AGMARKNET_METADATA
  },

  // Gujarat Mandis
  {
    mandiId: "gj_rajkot_01",
    mandiName: "Rajkot APMC (Bedi Mandi)",
    district: "Rajkot",
    state: "Gujarat",
    cropId: "groundnut",
    cropName: "Groundnut (Pods)",
    distanceKm: 15,
    minPricePerQuintal: 6200,
    maxPricePerQuintal: 7200,
    modalPricePerQuintal: 6850,
    dailyArrivalsTonnes: 1800,
    arrivalTrend: "Increasing",
    freightCostPerKmPerQuintal: 1.1,
    hamaliChargesPerQuintal: 28,
    mandiCessPercent: 1.0,
    netRealizationPerQuintal: 6736.5,
    date: "Current Agmarknet Session",
    metadata: AGMARKNET_METADATA
  },
  {
    mandiId: "gj_rajkot_02",
    mandiName: "Rajkot APMC",
    district: "Rajkot",
    state: "Gujarat",
    cropId: "cotton_long",
    cropName: "Cotton (Shankar-6)",
    distanceKm: 15,
    minPricePerQuintal: 7200,
    maxPricePerQuintal: 7750,
    modalPricePerQuintal: 7550,
    dailyArrivalsTonnes: 2100,
    arrivalTrend: "Stable",
    freightCostPerKmPerQuintal: 1.1,
    hamaliChargesPerQuintal: 28,
    mandiCessPercent: 1.0,
    netRealizationPerQuintal: 7429.5,
    date: "Current Agmarknet Session",
    metadata: AGMARKNET_METADATA
  }
];

export const APMC_MANDI_BENCHMARKS = APMC_MANDI_RECORDS;

// National Supply & Demand Balance Sheet (DES MoA&FW 3rd Advance Estimates)
export const SUPPLY_DEMAND_BALANCES: SupplyDemandBalance[] = [
  {
    cropId: "soybean",
    cropName: "Soybean",
    season: "2024-25 Season",
    nationalAreaMillionHa: 12.8,
    domesticProductionLakhTonnes: 130.5,
    domesticConsumptionLakhTonnes: 118.0,
    endingStocksLakhTonnes: 24.2,
    importVolumeLakhTonnes: 4.5,
    exportVolumeLakhTonnes: 16.5, // De-oiled cake (DOC) meal export
    marketBalance: "Balanced",
    supplyDemandRatio: 1.08,
    importDutyPolicy: "Crude Soybean Oil import duty maintained at zero/basic concessional tariff to control retail inflation.",
    exportPolicyStatus: "Soybean Meal (DOC) exports freely allowed under Open General Licence (OGL).",
    metadata: DES_METADATA
  },
  {
    cropId: "tur_arhar",
    cropName: "Tur / Arhar (Pigeon Pea)",
    season: "2024-25 Season",
    nationalAreaMillionHa: 4.4,
    domesticProductionLakhTonnes: 34.0,
    domesticConsumptionLakhTonnes: 44.5,
    endingStocksLakhTonnes: 3.8,
    importVolumeLakhTonnes: 12.5, // Imports from Mozambique, Myanmar, Tanzania
    exportVolumeLakhTonnes: 0.1,
    marketBalance: "Deficit (Bullish Price Outlook)",
    supplyDemandRatio: 0.81,
    importDutyPolicy: "Duty-free imports of Tur/Arhar extended up to 31 March 2025 to bolster domestic buffer availability.",
    exportPolicyStatus: "Export prohibited except bilateral humanitarian grants.",
    metadata: DES_METADATA
  },
  {
    cropId: "cotton_long",
    cropName: "Cotton (Raw Kapas & Lint)",
    season: "2024-25 Season",
    nationalAreaMillionHa: 12.4,
    domesticProductionLakhTonnes: 54.0, // approx 320 lakh bales
    domesticConsumptionLakhTonnes: 52.5,
    endingStocksLakhTonnes: 7.2,
    importVolumeLakhTonnes: 2.8,
    exportVolumeLakhTonnes: 4.5,
    marketBalance: "Balanced",
    supplyDemandRatio: 1.03,
    importDutyPolicy: "Standard 11% import duty on raw cotton.",
    exportPolicyStatus: "Exports permitted freely without minimum export price (MEP).",
    metadata: DES_METADATA
  },
  {
    cropId: "paddy_common",
    cropName: "Rice / Paddy",
    season: "2024-25 Season",
    nationalAreaMillionHa: 47.5,
    domesticProductionLakhTonnes: 1367.0,
    domesticConsumptionLakhTonnes: 1120.0,
    endingStocksLakhTonnes: 350.0, // Substantial FCI buffer stock
    importVolumeLakhTonnes: 0.0,
    exportVolumeLakhTonnes: 165.0, // Basmati & Non-basmati parboiled
    marketBalance: "Surplus / Oversupply (Bearish Price Risk)",
    supplyDemandRatio: 1.22,
    importDutyPolicy: "80% tariff protection on rice imports.",
    exportPolicyStatus: "Non-basmati white rice export duties relaxed; Minimum Export Price (MEP) rationalized on Basmati rice.",
    metadata: DES_METADATA
  },
  {
    cropId: "wheat",
    cropName: "Wheat",
    season: "2024-25 Season",
    nationalAreaMillionHa: 31.8,
    domesticProductionLakhTonnes: 1129.2,
    domesticConsumptionLakhTonnes: 1060.0,
    endingStocksLakhTonnes: 75.0,
    importVolumeLakhTonnes: 0.0,
    exportVolumeLakhTonnes: 0.0,
    marketBalance: "Balanced",
    supplyDemandRatio: 1.05,
    importDutyPolicy: "44% basic customs duty on wheat imports.",
    exportPolicyStatus: "Wheat exports remain prohibited to prioritize domestic OMSS (Open Market Sale Scheme) flour stability.",
    metadata: DES_METADATA
  },
  {
    cropId: "mustard_rapeseed",
    cropName: "Mustard Seed",
    season: "2024-25 Season",
    nationalAreaMillionHa: 10.0,
    domesticProductionLakhTonnes: 131.6,
    domesticConsumptionLakhTonnes: 125.0,
    endingStocksLakhTonnes: 18.0,
    importVolumeLakhTonnes: 0.0,
    exportVolumeLakhTonnes: 12.0, // Rapeseed meal export
    marketBalance: "Balanced",
    supplyDemandRatio: 1.06,
    importDutyPolicy: "Government balancing edible oil import duties to safeguard domestic mustard realization above MSP.",
    exportPolicyStatus: "Mustard meal export allowed without restriction.",
    metadata: DES_METADATA
  },
  {
    cropId: "onion",
    cropName: "Onion",
    season: "2024-25 Season",
    nationalAreaMillionHa: 1.9,
    domesticProductionLakhTonnes: 242.0,
    domesticConsumptionLakhTonnes: 215.0,
    endingStocksLakhTonnes: 10.0, // High post-harvest storage losses (20-30%)
    importVolumeLakhTonnes: 0.0,
    exportVolumeLakhTonnes: 17.0,
    marketBalance: "Balanced",
    supplyDemandRatio: 1.08,
    importDutyPolicy: "Zero import duty provision when domestic prices breach ceiling.",
    exportPolicyStatus: "40% export duty / Minimum Export Price (MEP) periodically adjusted by DGFT based on wholesale retail inflation.",
    metadata: DES_METADATA
  }
];

// District Weather Model Simulator based on IMD Agro-meteorological Climatology
export function getDistrictWeather(districtName: string, stateName: string): DistrictWeatherSummary {
  const districtObj = INDIAN_DISTRICTS.find(d => d.district.toLowerCase() === districtName.toLowerCase()) || {
    district: districtName,
    state: stateName,
    zoneId: 8,
    normalRainfallMm: 950,
    primarySoil: "Black Cotton Soil (Vertisols)" as SoilOrder,
    soilDepth: "Deep (> 50 cm)" as const,
    defaultPh: 7.5,
    latitude: 22.7,
    longitude: 75.8
  };

  const normalRainfall = districtObj.normalRainfallMm;
  // Estimated season cumulative rainfall
  const cumulativeRainfall = Math.round(normalRainfall * 0.72);
  const deviation = Math.round(((cumulativeRainfall - (normalRainfall * 0.70)) / (normalRainfall * 0.70)) * 100);

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const today = new Date();

  const forecast7Days = Array.from({ length: 7 }).map((_, idx) => {
    const d = new Date();
    d.setDate(today.getDate() + idx);
    const dayStr = days[d.getDay()];
    const dateStr = d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
    const isRain = idx === 1 || idx === 4;
    return {
      date: dateStr,
      dayName: idx === 0 ? "Today" : idx === 1 ? "Tomorrow" : dayStr,
      tempMinC: 22 + (idx % 3),
      tempMaxC: 31 + ((idx * 2) % 4),
      rainfallMm: isRain ? (12 + (idx * 5)) : 0,
      humidityPercent: isRain ? 84 : 68,
      windSpeedKmh: 14 + (idx % 6),
      condition: isRain ? "Moderate Monsoon Showers" : "Partly Cloudy with Sunshine",
      icon: isRain ? "CloudRain" : "SunMedium",
      agroAdvisory: isRain 
        ? "Postpone foliar pesticide / weedicide spraying. Ensure field drainage channels are clear." 
        : "Favourable window for inter-culture operations, weed hoeing and top-dressing of nitrogen."
    };
  });

  return {
    district: districtObj.district,
    state: districtObj.state,
    currentTempC: 29.4,
    humidityPercent: 74,
    cumulativeRainfallSeasonMm: cumulativeRainfall,
    normalRainfallSeasonMm: Math.round(normalRainfall * 0.70),
    rainfallDeviationPercent: deviation,
    rainfallStatus: deviation >= -19 && deviation <= 19 ? "Normal (±19%)" : deviation > 19 ? "Excess (> +19%)" : "Deficient (-20% to -59%)",
    monsoonOnsetActual: "12 June (On time)",
    monsoonOnsetNormal: "10-15 June",
    forecast7Days,
    imdAgrometAlerts: [
      `IMD Agromet Advisory for ${districtObj.district}: Rainfall received so far is within the normal agro-climatic corridor.`,
      "Farmers are advised to monitor fields for sucking pests (whitefly/jassids) during cloudy intervals.",
      "Soil moisture profile is adequate for active vegetative growth."
    ],
    metadata: IMD_METADATA
  };
}
