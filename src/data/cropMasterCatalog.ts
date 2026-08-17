import { CropMasterRecord, CropDataSource } from '../types';

export const OFFICIAL_CROP_SOURCES: Record<string, CropDataSource> = {
  CACP_2024_25: {
    sourceName: "Commission for Agricultural Costs and Prices (CACP)",
    sourceType: "CACP",
    datasetName: "Price Policy for Kharif & Rabi Crops 2024-25 Season",
    url: "https://cacp.dacnet.nic.in",
    publicationDate: "June 2024",
    retrievalDate: "2024-07-01",
    geographicCoverage: "All India (State-wise Mandated C2 & A2+FL Costs)",
    parameter: "MSP & Cost Benchmarks",
    unit: "INR per Quintal",
    license: "Government of India Open Access",
    dataStatus: "OFFICIAL DATA"
  },
  ICAR_POPR: {
    sourceName: "Indian Council of Agricultural Research (ICAR)",
    sourceType: "ICAR",
    datasetName: "Package of Practices for Crops of India (Agro-climatic Zones)",
    url: "https://icar.org.in",
    publicationDate: "2023",
    retrievalDate: "2024-06-15",
    geographicCoverage: "15 Agro-Climatic Zones of India",
    parameter: "Agronomy, Soil, Temperature & Water Requirements",
    unit: "mm / pH / Celsius / Days",
    license: "ICAR Academic & Extension License",
    dataStatus: "OFFICIAL DATA"
  },
  NHB_HORTICULTURE: {
    sourceName: "National Horticulture Board (NHB) & MIDH",
    sourceType: "National Horticulture Board",
    datasetName: "Indian Horticulture Database 2023-24",
    url: "https://nhb.gov.in",
    publicationDate: "2024",
    retrievalDate: "2024-06-20",
    geographicCoverage: "Major Horticulture Clusters of India",
    parameter: "Horticulture Agronomy & Post-Harvest Storage",
    unit: "Quintal per Acre / Days",
    license: "MoA&FW Public Domain",
    dataStatus: "OFFICIAL DATA"
  },
  SPICES_BOARD: {
    sourceName: "Spices Board of India (Ministry of Commerce & Industry)",
    sourceType: "Commodity Board",
    datasetName: "Major Indian Spices Agronomic & Trade Guidelines",
    url: "https://indianspices.com",
    publicationDate: "2024",
    retrievalDate: "2024-06-25",
    geographicCoverage: "Spice Growing Agro-Ecological Sub-Regions",
    parameter: "Spice Agronomy & Quality Standards",
    unit: "Kg / Quintal per Acre",
    license: "Official Commodity Board Release",
    dataStatus: "OFFICIAL DATA"
  }
};

export const CROP_MASTER_DATABASE: CropMasterRecord[] = [
  // ==========================================
  // 1. CEREALS
  // ==========================================
  {
    cropId: "paddy_common",
    cropName: "Paddy / Rice (Common)",
    scientificName: "Oryza sativa",
    localNames: {
      en: "Rice / Paddy",
      hi: "धान / चावल",
      kn: "ಭತ್ತ / ಅಕ್ಕಿ (Bhatta / Akki)",
      mr: "भात / तांदूळ (Bhaat / Taandool)",
      te: "వరి / బియ్యం (Vari / Biyyam)",
      ta: "நெல் / அரிசி (Nel / Arisi)",
      bn: "ধান / চাল (Dhan / Chaal)",
      gu: "ડાંગર / ચોખા (Dangar / Chokha)",
      pa: "ਝੋਨਾ / ਚੌਲ (Jhona / Chawal)",
      ml: "നെല്ല് / അരി (Nellu / Ari)",
      or: "ଧାନ / ଚାଉଳ (Dhana / Chaula)",
      as: "ধান / চাউল (Dhan / Saul)",
      ur: "دھان / چاول"
    },
    category: "Cereals",
    subcategory: "Major Cereal Grain",
    season: "Kharif",
    plantingWindow: "15 June - 15 July (Transplanting)",
    harvestWindow: "15 October - 20 November",
    typicalDurationDays: 125,
    durationRangeDays: { min: 110, max: 145 },
    soilRequirements: {
      soilTypes: ["Alluvial Soil (Entisols / Inceptisols)", "Red & Yellow Soil (Alfisols / Ultisols)", "Black Cotton Soil (Vertisols)"],
      texture: ["Clay Loam", "Silty Loam", "Heavy Clay"],
      pHRange: { min: 5.0, max: 8.0, optimalMin: 5.5, optimalMax: 7.2 },
      drainage: ["Poor (Prone to water stagnation)", "Moderate"],
      soilDepth: ["Medium (25 - 50 cm)", "Deep (> 50 cm)"]
    },
    climateRequirements: {
      temperature: { minC: 18, maxC: 38, optimalMinC: 22, optimalMaxC: 34 },
      rainfall: { minMm: 900, maxMm: 2500, optimalMm: 1200 },
      humidity: "70% - 85% during vegetative & reproductive stages",
      sunlight: "Abundant sunshine during grain filling (6-8 hours daily)",
      altitudeMeters: { min: 0, max: 1800 }
    },
    waterRequirements: {
      waterRequirementMm: 1200,
      waterRequirementLevel: "High (> 800 mm)",
      irrigationRequirement: "Submerged or saturated condition (2-5 cm standing water until 10 days before harvest)",
      criticalIrrigationStages: ["Transplanting", "Tillering", "Panicle Initiation", "Flowering", "Milking"],
      droughtTolerance: "Low",
      waterloggingSensitivity: "Low"
    },
    agronomy: {
      seedRequirement: { value: 15, unit: "kg/acre (Transplanted) / 25 kg (DSR)", source: "ICAR-NRRI", sourceDate: "2024", dataStatus: "OFFICIAL DATA" },
      plantingMethod: "Transplanting 2-3 seedlings per hill or Direct Seeded Rice (DSR)",
      spacing: "20 cm x 15 cm",
      fertilizerRequirements: {
        rdfKgPerHa: "100:50:50 NPK kg/ha",
        majorNutrients: "Split Nitrogen in 3 doses: basal, tillering, panicle initiation",
        micronutrients: "Zinc Sulphate 25 kg/ha basal in Zn deficient soils",
        note: "Avoid excessive urea in endemic blast areas"
      },
      majorNutrients: "N: 40-50 kg/acre, P2O5: 20-25 kg/acre, K2O: 20-25 kg/acre",
      micronutrients: "Zinc (Zn) critical for preventing Khaira disease"
    },
    production: {
      yieldRange: { min: 14.0, max: 28.0, benchmarkAvg: 20.0, unit: "Quintal/Acre", source: "DES MoA&FW", sourceDate: "2024", dataStatus: "OFFICIAL DATA" },
      unit: "Quintal/Acre"
    },
    geographic: {
      majorProducingStates: ["West Bengal", "Uttar Pradesh", "Punjab", "Odisha", "Andhra Pradesh", "Telangana", "Chhattisgarh", "Bihar"],
      majorProducingDistricts: ["Burdwan", "Karnal", "Ludhiana", "Krishna", "Godavari", "Sambalpur"],
      suitableAgroClimaticZones: [2, 3, 4, 5, 6, 7, 10, 11, 12, 13]
    },
    market: {
      perishability: "Low (Durable grain/seed: 6-12+ months)",
      storageRequirement: "Dry ventilated godown with paddy moisture <= 14% to prevent discolouration and milling breakage",
      processingPotential: "Milling (Raw / Parboiled), Rice Bran Oil, Flattened Rice (Poha), Husk for biomass energy",
      majorConsumptionRegions: ["Pan-India staple (Eastern, Southern & Coastal zones dominate)"]
    },
    trade: {
      exportImportance: "High",
      importDependence: "Self-Sufficient"
    },
    government: {
      MSPApplicable: true,
      mspPrice2024_25: { value: 2300, unit: "INR/Quintal", source: "CACP Kharif 2024-25", sourceDate: "19-June-2024", dataStatus: "OFFICIAL DATA" },
      mspPrice2023_24: { value: 2183, unit: "INR/Quintal", source: "CACP Kharif 2023-24", sourceDate: "June 2023", dataStatus: "OFFICIAL DATA" },
      cacpCostA2FL: { value: 1533, unit: "INR/Quintal", source: "CACP Kharif 2024-25", sourceDate: "June 2024", dataStatus: "OFFICIAL DATA" },
      cacpCostC2: { value: 2150, unit: "INR/Quintal", source: "CACP Kharif 2024-25", sourceDate: "June 2024", dataStatus: "OFFICIAL DATA" },
      governmentSchemeLinks: ["PMFBY (2% Premium)", "NFSM (National Food Security Mission - Rice)", "FCI Procurement System"]
    },
    dataConfidenceScore: 98,
    dataConfidenceLevel: "High",
    sources: [OFFICIAL_CROP_SOURCES.CACP_2024_25, OFFICIAL_CROP_SOURCES.ICAR_POPR]
  },
  {
    cropId: "wheat",
    cropName: "Wheat",
    scientificName: "Triticum aestivum",
    localNames: {
      en: "Wheat",
      hi: "गेहूं",
      kn: "ಗೋಧಿ (Godhi)",
      mr: "गहू (Gahu)",
      te: "గోధుమలు (Godhumalu)",
      ta: "கோதுமை (Godhumai)",
      bn: "গম (Gôm)",
      gu: "ઘઉં (Ghau)",
      pa: "ਕਣਕ (Kanak)",
      ml: "ഗോതമ്പ് (Gothambu)",
      or: "ଗହମ (Gahama)",
      as: "ঘেঁহু (Ghehu)",
      ur: "گندم"
    },
    category: "Cereals",
    subcategory: "Major Winter Cereal",
    season: "Rabi",
    plantingWindow: "01 November - 25 November",
    harvestWindow: "15 March - 20 April",
    typicalDurationDays: 120,
    durationRangeDays: { min: 105, max: 135 },
    soilRequirements: {
      soilTypes: ["Alluvial Soil (Entisols / Inceptisols)", "Black Cotton Soil (Vertisols)"],
      texture: ["Clay Loam", "Sandy Loam", "Silty Loam"],
      pHRange: { min: 6.0, max: 8.2, optimalMin: 6.5, optimalMax: 7.8 },
      drainage: ["Good (No waterlogging)", "Moderate"],
      soilDepth: ["Medium (25 - 50 cm)", "Deep (> 50 cm)"]
    },
    climateRequirements: {
      temperature: { minC: 8, maxC: 30, optimalMinC: 12, optimalMaxC: 25 },
      rainfall: { minMm: 300, maxMm: 600, optimalMm: 450 },
      humidity: "Cool and moist weather during early vegetative; warm and dry during ripening",
      sunlight: "Bright sunny days without sudden terminal heat spikes",
      altitudeMeters: { min: 50, max: 2800 }
    },
    waterRequirements: {
      waterRequirementMm: 450,
      waterRequirementLevel: "Medium (400 - 800 mm)",
      irrigationRequirement: "4 to 6 critical irrigations depending on winter rain",
      criticalIrrigationStages: ["Crown Root Initiation (CRI: 21 DAS)", "Tillering", "Late Jointing", "Flowering", "Milking", "Dough Stage"],
      droughtTolerance: "Moderate",
      waterloggingSensitivity: "High"
    },
    agronomy: {
      seedRequirement: { value: 40, unit: "kg/acre (Line Sowing)", source: "ICAR-IIWBR", sourceDate: "2024", dataStatus: "OFFICIAL DATA" },
      plantingMethod: "Zero-till seed drill, happy seeder, or conventional line sowing",
      spacing: "20-22.5 cm row spacing",
      fertilizerRequirements: {
        rdfKgPerHa: "120:60:40 NPK kg/ha",
        majorNutrients: "1/2 N + full P & K at sowing; 1/2 N top dressed in 2 equal splits with 1st and 2nd irrigations",
        micronutrients: "Zinc Sulphate 25 kg/ha if soil is deficient",
        note: "Avoid terminal heat stress through timely sowing before 15 November"
      },
      majorNutrients: "N: 48 kg/acre, P2O5: 24 kg/acre, K2O: 16 kg/acre",
      micronutrients: "Zinc & Manganese"
    },
    production: {
      yieldRange: { min: 14.0, max: 26.0, benchmarkAvg: 19.5, unit: "Quintal/Acre", source: "DES MoA&FW", sourceDate: "2024", dataStatus: "OFFICIAL DATA" },
      unit: "Quintal/Acre"
    },
    geographic: {
      majorProducingStates: ["Uttar Pradesh", "Madhya Pradesh", "Punjab", "Haryana", "Rajasthan", "Bihar", "Gujarat"],
      majorProducingDistricts: ["Ludhiana", "Karnal", "Hoshangabad", "Indore", "Meerut", "Ganganagar"],
      suitableAgroClimaticZones: [1, 4, 5, 6, 8, 9, 13]
    },
    market: {
      perishability: "Low (Durable grain/seed: 6-12+ months)",
      storageRequirement: "Clean dry warehouse with grain moisture <= 12% to prevent khapra beetle infestation",
      processingPotential: "Atta, Maida, Suji / Rawa, Bakery products, Pasta, Feed",
      majorConsumptionRegions: ["Pan-India staple (Northern, Central and Western belt)"]
    },
    trade: {
      exportImportance: "Moderate",
      importDependence: "Self-Sufficient"
    },
    government: {
      MSPApplicable: true,
      mspPrice2024_25: { value: 2425, unit: "INR/Quintal", source: "CACP Rabi 2024-25", sourceDate: "18-October-2023", dataStatus: "OFFICIAL DATA" },
      mspPrice2023_24: { value: 2275, unit: "INR/Quintal", source: "CACP Rabi 2023-24", sourceDate: "October 2022", dataStatus: "OFFICIAL DATA" },
      cacpCostA2FL: { value: 1192, unit: "INR/Quintal", source: "CACP Rabi 2024-25", sourceDate: "October 2023", dataStatus: "OFFICIAL DATA" },
      cacpCostC2: { value: 1720, unit: "INR/Quintal", source: "CACP Rabi 2024-25", sourceDate: "October 2023", dataStatus: "OFFICIAL DATA" },
      governmentSchemeLinks: ["PMFBY (1.5% Premium)", "NFSM-Wheat", "FCI Central Pool Procurement"]
    },
    dataConfidenceScore: 98,
    dataConfidenceLevel: "High",
    sources: [OFFICIAL_CROP_SOURCES.CACP_2024_25, OFFICIAL_CROP_SOURCES.ICAR_POPR]
  },
  {
    cropId: "maize",
    cropName: "Maize (Corn)",
    scientificName: "Zea mays",
    localNames: {
      en: "Maize / Corn",
      hi: "मक्का / भुट्टा",
      kn: "ಮೆಕ್ಕೆಜೋಳ (Mekke Jola)",
      mr: "मका (Maka)",
      te: "మొక్కజొన్న (Mokka Jonna)",
      ta: "மக்காச்சோளம் (Makka Cholam)",
      bn: "ভুট্টা (Bhutta)",
      gu: "મકાઈ (Makai)",
      pa: "ਮੱਕੀ (Makki)",
      ml: "മക്കച്ചോളം (Makkacholam)",
      or: "ମକା (Maka)",
      as: "মাকৈ (Makoi)",
      ur: "مکئی"
    },
    category: "Cereals",
    subcategory: "Coarse Grain / Industrial Starch",
    season: "Multiple seasons",
    plantingWindow: "15 June - 10 July (Kharif) / 15 October - 15 November (Rabi)",
    harvestWindow: "25 September - 25 October (Kharif) / March - April (Rabi)",
    typicalDurationDays: 100,
    durationRangeDays: { min: 85, max: 120 },
    soilRequirements: {
      soilTypes: ["Alluvial Soil (Entisols / Inceptisols)", "Red & Yellow Soil (Alfisols / Ultisols)", "Black Cotton Soil (Vertisols)"],
      texture: ["Sandy Loam", "Clay Loam", "Silty Loam"],
      pHRange: { min: 5.8, max: 7.8, optimalMin: 6.2, optimalMax: 7.4 },
      drainage: ["Good (No waterlogging)"],
      soilDepth: ["Medium (25 - 50 cm)", "Deep (> 50 cm)"]
    },
    climateRequirements: {
      temperature: { minC: 15, maxC: 38, optimalMinC: 21, optimalMaxC: 32 },
      rainfall: { minMm: 450, maxMm: 800, optimalMm: 550 },
      humidity: "Moderate humidity (55% - 75%)",
      sunlight: "Full sun, high solar radiation for C4 photosynthesis",
      altitudeMeters: { min: 0, max: 2500 }
    },
    waterRequirements: {
      waterRequirementMm: 550,
      waterRequirementLevel: "Medium (400 - 800 mm)",
      irrigationRequirement: "Sensitive to drought at flowering and highly intolerant to water stagnation",
      criticalIrrigationStages: ["Tasseling", "Silking", "Grain Filling"],
      droughtTolerance: "Moderate",
      waterloggingSensitivity: "High"
    },
    agronomy: {
      seedRequirement: { value: 8, unit: "kg/acre (Single cross hybrid)", source: "ICAR-IIMR", sourceDate: "2024", dataStatus: "OFFICIAL DATA" },
      plantingMethod: "Ridge and furrow planting or flat bed seed drill",
      spacing: "60 cm x 20 cm",
      fertilizerRequirements: {
        rdfKgPerHa: "120:60:40 NPK kg/ha",
        majorNutrients: "Split N: 1/3 basal, 1/3 knee-high, 1/3 tasseling",
        micronutrients: "Zinc 25 kg/ha ZnSO4 prevents white bud disease",
        note: "Scout actively for Fall Armyworm (FAW) egg masses"
      },
      majorNutrients: "N: 48 kg/acre, P2O5: 24 kg/acre, K2O: 16 kg/acre",
      micronutrients: "Zinc (Zn)"
    },
    production: {
      yieldRange: { min: 12.0, max: 28.0, benchmarkAvg: 18.0, unit: "Quintal/Acre", source: "DES MoA&FW", sourceDate: "2024", dataStatus: "OFFICIAL DATA" },
      unit: "Quintal/Acre"
    },
    geographic: {
      majorProducingStates: ["Karnataka", "Madhya Pradesh", "Maharashtra", "Bihar", "Telangana", "Andhra Pradesh", "Rajasthan"],
      majorProducingDistricts: ["Davanagere", "Chhindwara", "Nanded", "Purnia", "Khammam"],
      suitableAgroClimaticZones: [1, 4, 5, 7, 8, 9, 10, 11]
    },
    market: {
      perishability: "Low (Durable grain/seed: 6-12+ months)",
      storageRequirement: "Moisture <= 12% in dry aerated storage",
      processingPotential: "Poultry feed (60% share), Starch industry, Ethanol, Popcorn, Sweet corn",
      majorConsumptionRegions: ["Feed manufacturing hubs (South & West India), Starch mills"]
    },
    trade: {
      exportImportance: "Moderate",
      importDependence: "Self-Sufficient"
    },
    government: {
      MSPApplicable: true,
      mspPrice2024_25: { value: 2225, unit: "INR/Quintal", source: "CACP Kharif 2024-25", sourceDate: "19-June-2024", dataStatus: "OFFICIAL DATA" },
      mspPrice2023_24: { value: 2090, unit: "INR/Quintal", source: "CACP Kharif 2023-24", sourceDate: "June 2023", dataStatus: "OFFICIAL DATA" },
      cacpCostA2FL: { value: 1483, unit: "INR/Quintal", source: "CACP Kharif 2024-25", sourceDate: "June 2024", dataStatus: "OFFICIAL DATA" },
      cacpCostC2: { value: 2020, unit: "INR/Quintal", source: "CACP Kharif 2024-25", sourceDate: "June 2024", dataStatus: "OFFICIAL DATA" },
      governmentSchemeLinks: ["PMFBY (2% Premium)", "National Maize Mission (Ethanol blending incentive)"]
    },
    dataConfidenceScore: 96,
    dataConfidenceLevel: "High",
    sources: [OFFICIAL_CROP_SOURCES.CACP_2024_25, OFFICIAL_CROP_SOURCES.ICAR_POPR]
  },
  {
    cropId: "barley",
    cropName: "Barley (Jau)",
    scientificName: "Hordeum vulgare",
    localNames: {
      en: "Barley",
      hi: "जौ",
      kn: "ಬಾರ್ಲಿ (Barley)",
      mr: "सातू / जव (Saatu / Jav)",
      te: "బార్లీ (Barley)",
      ta: "பார்லி (Barley)",
      bn: "যব (Job)",
      gu: "જવ (Jav)",
      pa: "ਜੌਂ (Jau)",
      ml: "ബാർലി (Barley)",
      or: "ଯବ (Jaba)",
      as: "যৱ (Jôb)",
      ur: "جو"
    },
    category: "Cereals",
    subcategory: "Winter Cereal / Malt Grain",
    season: "Rabi",
    plantingWindow: "01 November - 20 November",
    harvestWindow: "15 March - 10 April",
    typicalDurationDays: 115,
    durationRangeDays: { min: 100, max: 130 },
    soilRequirements: {
      soilTypes: ["Alluvial Soil (Entisols / Inceptisols)", "Saline / Alkaline Soil", "Arid / Desert Soil (Aridisols)"],
      texture: ["Sandy Loam", "Clay Loam"],
      pHRange: { min: 6.5, max: 8.5, optimalMin: 7.0, optimalMax: 8.2 },
      drainage: ["Good (No waterlogging)"],
      soilDepth: ["Medium (25 - 50 cm)", "Deep (> 50 cm)"]
    },
    climateRequirements: {
      temperature: { minC: 6, maxC: 30, optimalMinC: 12, optimalMaxC: 22 },
      rainfall: { minMm: 250, maxMm: 500, optimalMm: 350 },
      humidity: "Low to moderate humidity; dry maturity",
      sunlight: "Abundant winter sunshine",
      altitudeMeters: { min: 100, max: 3500 }
    },
    waterRequirements: {
      waterRequirementMm: 320,
      waterRequirementLevel: "Low (< 400 mm)",
      irrigationRequirement: "Requires 2-3 irrigations; highly salt and drought tolerant compared to wheat",
      criticalIrrigationStages: ["Crown Root Initiation", "Tillering", "Heading"],
      droughtTolerance: "High",
      waterloggingSensitivity: "High"
    },
    agronomy: {
      seedRequirement: { value: 35, unit: "kg/acre (Irrigated) / 45 kg (Rainfed)", source: "ICAR-IIWBR", sourceDate: "2024", dataStatus: "OFFICIAL DATA" },
      plantingMethod: "Line sowing with seed drill",
      spacing: "22.5 cm row spacing",
      fertilizerRequirements: {
        rdfKgPerHa: "60:30:20 NPK kg/ha",
        majorNutrients: "For malting quality, limit late nitrogen application to maintain low grain protein (<11.5%)",
        micronutrients: "Zinc as needed",
        note: "Excellent crop for semi-arid and salinity-affected soils"
      },
      majorNutrients: "N: 25 kg/acre, P2O5: 12 kg/acre, K2O: 8 kg/acre",
      micronutrients: "Zinc (Zn)"
    },
    production: {
      yieldRange: { min: 12.0, max: 22.0, benchmarkAvg: 16.5, unit: "Quintal/Acre", source: "DES MoA&FW", sourceDate: "2024", dataStatus: "OFFICIAL DATA" },
      unit: "Quintal/Acre"
    },
    geographic: {
      majorProducingStates: ["Rajasthan", "Uttar Pradesh", "Haryana", "Madhya Pradesh", "Punjab", "Bihar"],
      majorProducingDistricts: ["Jaipur", "Sikar", "Alwar", "Hisar", "Agra"],
      suitableAgroClimaticZones: [5, 6, 8, 13, 14]
    },
    market: {
      perishability: "Low (Durable grain/seed: 6-12+ months)",
      storageRequirement: "Moisture <= 11% in insect-proof storage",
      processingPotential: "Malt for brewing/beverages, Sattu, Animal feed, Health foods",
      majorConsumptionRegions: ["Northern brewing clusters, health food markets"]
    },
    trade: {
      exportImportance: "Low",
      importDependence: "Self-Sufficient"
    },
    government: {
      MSPApplicable: true,
      mspPrice2024_25: { value: 1850, unit: "INR/Quintal", source: "CACP Rabi 2024-25", sourceDate: "18-October-2023", dataStatus: "OFFICIAL DATA" },
      mspPrice2023_24: { value: 1735, unit: "INR/Quintal", source: "CACP Rabi 2023-24", sourceDate: "October 2022", dataStatus: "OFFICIAL DATA" },
      cacpCostA2FL: { value: 1158, unit: "INR/Quintal", source: "CACP Rabi 2024-25", sourceDate: "October 2023", dataStatus: "OFFICIAL DATA" },
      cacpCostC2: { value: 1650, unit: "INR/Quintal", source: "CACP Rabi 2024-25", sourceDate: "October 2023", dataStatus: "OFFICIAL DATA" },
      governmentSchemeLinks: ["PMFBY (1.5% Premium)", "NFSM-Coarse Cereals"]
    },
    dataConfidenceScore: 94,
    dataConfidenceLevel: "High",
    sources: [OFFICIAL_CROP_SOURCES.CACP_2024_25, OFFICIAL_CROP_SOURCES.ICAR_POPR]
  },
  {
    cropId: "sorghum_jowar",
    cropName: "Sorghum / Jowar",
    scientificName: "Sorghum bicolor",
    localNames: {
      en: "Sorghum / Jowar",
      hi: "ज्वार",
      kn: "ಜೋಳ (Jola)",
      mr: "ज्वारी (Jwari)",
      te: "జొన్నలు (Jonnalu)",
      ta: "சோளம் (Cholam)",
      bn: "জোয়ার (Jowar)",
      gu: "જુવાર (Juwar)",
      pa: "ਜਵਾਰ (Jawar)",
      ml: "ചോളം (Cholam)",
      or: "ଜୁଆର (Juara)",
      as: "জোৱাৰ (Jowar)",
      ur: "جوار"
    },
    category: "Millets (Shree Anna)",
    subcategory: "Major Millet / Nutri-Cereal",
    season: "Multiple seasons",
    plantingWindow: "15 June - 05 July (Kharif) / 15 September - 15 October (Rabi Maldandi)",
    harvestWindow: "October - November (Kharif) / February - March (Rabi)",
    typicalDurationDays: 110,
    durationRangeDays: { min: 95, max: 125 },
    soilRequirements: {
      soilTypes: ["Black Cotton Soil (Vertisols)", "Alluvial Soil (Entisols / Inceptisols)", "Red & Yellow Soil (Alfisols / Ultisols)"],
      texture: ["Clay Loam", "Sandy Loam", "Heavy Clay"],
      pHRange: { min: 6.0, max: 8.5, optimalMin: 6.5, optimalMax: 8.0 },
      drainage: ["Good (No waterlogging)", "Moderate"],
      soilDepth: ["Medium (25 - 50 cm)", "Deep (> 50 cm)"]
    },
    climateRequirements: {
      temperature: { minC: 16, maxC: 40, optimalMinC: 25, optimalMaxC: 35 },
      rainfall: { minMm: 350, maxMm: 700, optimalMm: 450 },
      humidity: "Low to moderate humidity",
      sunlight: "Warm days with high sun exposure",
      altitudeMeters: { min: 0, max: 1200 }
    },
    waterRequirements: {
      waterRequirementMm: 380,
      waterRequirementLevel: "Low (< 400 mm)",
      irrigationRequirement: "Extremely drought hardy with deep root penetration and waxy leaf cuticle",
      criticalIrrigationStages: ["Booting Stage", "Flowering / Grain Formation"],
      droughtTolerance: "High",
      waterloggingSensitivity: "High"
    },
    agronomy: {
      seedRequirement: { value: 3.5, unit: "kg/acre", source: "ICAR-IIMR", sourceDate: "2024", dataStatus: "OFFICIAL DATA" },
      plantingMethod: "Line sowing with seed drill",
      spacing: "45 cm x 15 cm",
      fertilizerRequirements: {
        rdfKgPerHa: "80:40:40 NPK kg/ha",
        majorNutrients: "Split N: 50% basal + 50% at 30-35 DAS",
        micronutrients: "Zinc as needed",
        note: "Rabi Maldandi commands premium quality price for table bhakri"
      },
      majorNutrients: "N: 32 kg/acre, P2O5: 16 kg/acre, K2O: 16 kg/acre",
      micronutrients: "Zinc (Zn)"
    },
    production: {
      yieldRange: { min: 7.0, max: 18.0, benchmarkAvg: 11.5, unit: "Quintal/Acre", source: "DES MoA&FW", sourceDate: "2024", dataStatus: "OFFICIAL DATA" },
      unit: "Quintal/Acre"
    },
    geographic: {
      majorProducingStates: ["Maharashtra", "Karnataka", "Rajasthan", "Madhya Pradesh", "Andhra Pradesh", "Telangana", "Tamil Nadu"],
      majorProducingDistricts: ["Solapur", "Ahmednagar", "Vijayapura", "Gulbarga", "Nanded"],
      suitableAgroClimaticZones: [8, 9, 10, 11, 14]
    },
    market: {
      perishability: "Low (Durable grain/seed: 6-12+ months)",
      storageRequirement: "Moisture <= 11% in dry storage",
      processingPotential: "Flour (Bhakri / Roti), Multigrain flakes, Nutri-cereal snacks, Fodder (Kadbi)",
      majorConsumptionRegions: ["Deccan plateau, urban health-food markets across India"]
    },
    trade: {
      exportImportance: "Low",
      importDependence: "Self-Sufficient"
    },
    government: {
      MSPApplicable: true,
      mspPrice2024_25: { value: 3371, unit: "INR/Quintal (Hybrid) / 3421 (Maldandi)", source: "CACP Kharif 2024-25", sourceDate: "19-June-2024", dataStatus: "OFFICIAL DATA" },
      mspPrice2023_24: { value: 3180, unit: "INR/Quintal", source: "CACP Kharif 2023-24", sourceDate: "June 2023", dataStatus: "OFFICIAL DATA" },
      cacpCostA2FL: { value: 2247, unit: "INR/Quintal", source: "CACP Kharif 2024-25", sourceDate: "June 2024", dataStatus: "OFFICIAL DATA" },
      cacpCostC2: { value: 3150, unit: "INR/Quintal", source: "CACP Kharif 2024-25", sourceDate: "June 2024", dataStatus: "OFFICIAL DATA" },
      governmentSchemeLinks: ["PMFBY (2% Premium)", "Shree Anna Promotion Scheme (National Year of Millets)"]
    },
    dataConfidenceScore: 96,
    dataConfidenceLevel: "High",
    sources: [OFFICIAL_CROP_SOURCES.CACP_2024_25, OFFICIAL_CROP_SOURCES.ICAR_POPR]
  },
  {
    cropId: "pearl_millet_bajra",
    cropName: "Pearl Millet / Bajra",
    scientificName: "Pennisetum glaucum",
    localNames: {
      en: "Pearl Millet / Bajra",
      hi: "बाजरा",
      kn: "ಸಜ್ಜೆ (Sajje)",
      mr: "बाजरी (Bajri)",
      te: "సజ్జలు (Sajjalu)",
      ta: "கம்map (Kambu)",
      bn: "বাজরা (Bajra)",
      gu: "બાજરી (Bajri)",
      pa: "ਬਾਜਰਾ (Bajra)",
      ml: "കമ്പം (Kambu)",
      or: "ବାଜରା (Bajara)",
      as: "বাজ্ৰা (Bajra)",
      ur: "باجرہ"
    },
    category: "Millets (Shree Anna)",
    subcategory: "Major Nutri-Cereal",
    season: "Kharif",
    plantingWindow: "25 June - 20 July",
    harvestWindow: "15 September - 15 October",
    typicalDurationDays: 85,
    durationRangeDays: { min: 75, max: 95 },
    soilRequirements: {
      soilTypes: ["Arid / Desert Soil (Aridisols)", "Alluvial Soil (Entisols / Inceptisols)", "Red & Yellow Soil (Alfisols / Ultisols)"],
      texture: ["Sandy Loam", "Sandy", "Clay Loam"],
      pHRange: { min: 6.5, max: 8.8, optimalMin: 7.0, optimalMax: 8.5 },
      drainage: ["Good (No waterlogging)"],
      soilDepth: ["Shallow (< 25 cm)", "Medium (25 - 50 cm)", "Deep (> 50 cm)"]
    },
    climateRequirements: {
      temperature: { minC: 20, maxC: 45, optimalMinC: 28, optimalMaxC: 38 },
      rainfall: { minMm: 250, maxMm: 550, optimalMm: 350 },
      humidity: "Dry semi-arid to arid climate",
      sunlight: "High sunshine intensity",
      altitudeMeters: { min: 0, max: 1000 }
    },
    waterRequirements: {
      waterRequirementMm: 300,
      waterRequirementLevel: "Low (< 400 mm)",
      irrigationRequirement: "Thrives in rainfed arid regions; requires 1 supplemental irrigation during prolonged dry spells",
      criticalIrrigationStages: ["Booting Stage", "Grain Filling"],
      droughtTolerance: "High",
      waterloggingSensitivity: "High"
    },
    agronomy: {
      seedRequirement: { value: 1.8, unit: "kg/acre (Hybrid)", source: "ICAR-IIMR", sourceDate: "2024", dataStatus: "OFFICIAL DATA" },
      plantingMethod: "Line sowing with seed drill",
      spacing: "45 cm x 12 cm",
      fertilizerRequirements: {
        rdfKgPerHa: "60:30:20 NPK kg/ha",
        majorNutrients: "1/2 N + full P/K basal; 1/2 N top dressed at 25-30 DAS",
        micronutrients: "Iron and Zinc biofortified varieties available",
        note: "Extremely fast-maturing crop"
      },
      majorNutrients: "N: 24 kg/acre, P2O5: 12 kg/acre, K2O: 8 kg/acre",
      micronutrients: "Zinc & Iron"
    },
    production: {
      yieldRange: { min: 7.0, max: 16.0, benchmarkAvg: 11.0, unit: "Quintal/Acre", source: "DES MoA&FW", sourceDate: "2024", dataStatus: "OFFICIAL DATA" },
      unit: "Quintal/Acre"
    },
    geographic: {
      majorProducingStates: ["Rajasthan", "Uttar Pradesh", "Gujarat", "Haryana", "Maharashtra", "Madhya Pradesh", "Karnataka"],
      majorProducingDistricts: ["Barmer", "Nagaur", "Jaipur", "Bhavnagar", "Hisar", "Banaskantha"],
      suitableAgroClimaticZones: [6, 8, 9, 13, 14]
    },
    market: {
      perishability: "Low (Durable grain/seed: 6-12+ months)",
      storageRequirement: "Moisture <= 11% in dry storage",
      processingPotential: "Flour (Rotla / Roti), Biofortified porridge, Cattle & Poultry feed, Stover fodder",
      majorConsumptionRegions: ["North-Western India, Shree Anna consumer base"]
    },
    trade: {
      exportImportance: "Low",
      importDependence: "Self-Sufficient"
    },
    government: {
      MSPApplicable: true,
      mspPrice2024_25: { value: 2625, unit: "INR/Quintal", source: "CACP Kharif 2024-25", sourceDate: "19-June-2024", dataStatus: "OFFICIAL DATA" },
      mspPrice2023_24: { value: 2500, unit: "INR/Quintal", source: "CACP Kharif 2023-24", sourceDate: "June 2023", dataStatus: "OFFICIAL DATA" },
      cacpCostA2FL: { value: 1500, unit: "INR/Quintal", source: "CACP Kharif 2024-25", sourceDate: "June 2024", dataStatus: "OFFICIAL DATA" },
      cacpCostC2: { value: 2100, unit: "INR/Quintal", source: "CACP Kharif 2024-25", sourceDate: "June 2024", dataStatus: "OFFICIAL DATA" },
      governmentSchemeLinks: ["PMFBY (2% Premium)", "Shree Anna Mission (75% return over A2+FL cost)"]
    },
    dataConfidenceScore: 96,
    dataConfidenceLevel: "High",
    sources: [OFFICIAL_CROP_SOURCES.CACP_2024_25, OFFICIAL_CROP_SOURCES.ICAR_POPR]
  },
  {
    cropId: "finger_millet_ragi",
    cropName: "Finger Millet / Ragi",
    scientificName: "Eleusine coracana",
    localNames: {
      en: "Finger Millet / Ragi",
      hi: "रागी / मड़ुआ",
      kn: "ರಾಗಿ (Ragi)",
      mr: "नाचणी (Nachani)",
      te: "రాగులు / తైదలు (Ragulu / Taidalu)",
      ta: "கேழ்வரகு / ராகி (Kezhvaragu / Ragi)",
      bn: "মারুয়া (Marua)",
      gu: "નાગલી / રાગી (Nagli / Ragi)",
      pa: "ਮੰਡਲ (Mandal)",
      ml: "പഞ്ഞപ്പുല്ല് / കൂവരക് (Panjappullu / Koovaraku)",
      or: "ମାଣ୍ଡିଆ (Mandia)",
      as: "মৰুৱা (Maruwa)",
      ur: "راگی"
    },
    category: "Millets (Shree Anna)",
    subcategory: "Calcium-Rich Nutri-Cereal",
    season: "Kharif",
    plantingWindow: "15 June - 15 July",
    harvestWindow: "October - November",
    typicalDurationDays: 110,
    durationRangeDays: { min: 95, max: 125 },
    soilRequirements: {
      soilTypes: ["Red & Yellow Soil (Alfisols / Ultisols)", "Laterite Soil (Oxisols)", "Alluvial Soil (Entisols / Inceptisols)"],
      texture: ["Sandy Loam", "Clay Loam"],
      pHRange: { min: 5.0, max: 7.8, optimalMin: 5.5, optimalMax: 7.0 },
      drainage: ["Good (No waterlogging)"],
      soilDepth: ["Shallow (< 25 cm)", "Medium (25 - 50 cm)"]
    },
    climateRequirements: {
      temperature: { minC: 18, maxC: 36, optimalMinC: 24, optimalMaxC: 32 },
      rainfall: { minMm: 500, maxMm: 1000, optimalMm: 700 },
      humidity: "Moderate humidity",
      sunlight: "Sunny weather with intermittent rains",
      altitudeMeters: { min: 0, max: 2200 }
    },
    waterRequirements: {
      waterRequirementMm: 400,
      waterRequirementLevel: "Medium (400 - 800 mm)",
      irrigationRequirement: "Mostly rainfed; 1-2 protective irrigations improve head filling",
      criticalIrrigationStages: ["Tillering", "Earhead Emergence", "Grain Filling"],
      droughtTolerance: "High",
      waterloggingSensitivity: "Moderate"
    },
    agronomy: {
      seedRequirement: { value: 2.0, unit: "kg/acre (Transplanted) / 4 kg (Direct Drilled)", source: "ICAR-IIMR", sourceDate: "2024", dataStatus: "OFFICIAL DATA" },
      plantingMethod: "Transplanting (Gulegudda system) or line sowing",
      spacing: "30 cm x 10 cm",
      fertilizerRequirements: {
        rdfKgPerHa: "60:30:30 NPK kg/ha",
        majorNutrients: "High organic manure responsiveness (5 tonnes FYM/ha)",
        micronutrients: "Zinc as needed",
        note: "Highest calcium content among all cereals (344 mg / 100g)"
      },
      majorNutrients: "N: 24 kg/acre, P2O5: 12 kg/acre, K2O: 12 kg/acre",
      micronutrients: "Zinc (Zn)"
    },
    production: {
      yieldRange: { min: 8.0, max: 18.0, benchmarkAvg: 12.0, unit: "Quintal/Acre", source: "DES MoA&FW", sourceDate: "2024", dataStatus: "OFFICIAL DATA" },
      unit: "Quintal/Acre"
    },
    geographic: {
      majorProducingStates: ["Karnataka", "Tamil Nadu", "Odisha", "Uttarakhand", "Maharashtra", "Andhra Pradesh", "Jharkhand"],
      majorProducingDistricts: ["Tumakuru", "Hassan", "Mandya", "Koraput", "Dharmapuri"],
      suitableAgroClimaticZones: [1, 7, 10, 11, 12]
    },
    market: {
      perishability: "Low (Durable grain/seed: 6-12+ months)",
      storageRequirement: "Highly insect-resistant seed coat; stores safely for 2-5 years without chemical fumigation",
      processingPotential: "Ragi Mudde, Malt, Porridge, Weaning foods, Bakery flour, Biscuits",
      majorConsumptionRegions: ["South India, Odisha tribal belts, urban superfood markets"]
    },
    trade: {
      exportImportance: "Moderate",
      importDependence: "Self-Sufficient"
    },
    government: {
      MSPApplicable: true,
      mspPrice2024_25: { value: 4290, unit: "INR/Quintal", source: "CACP Kharif 2024-25", sourceDate: "19-June-2024", dataStatus: "OFFICIAL DATA" },
      mspPrice2023_24: { value: 3846, unit: "INR/Quintal", source: "CACP Kharif 2023-24", sourceDate: "June 2023", dataStatus: "OFFICIAL DATA" },
      cacpCostA2FL: { value: 2860, unit: "INR/Quintal", source: "CACP Kharif 2024-25", sourceDate: "June 2024", dataStatus: "OFFICIAL DATA" },
      cacpCostC2: { value: 3950, unit: "INR/Quintal", source: "CACP Kharif 2024-25", sourceDate: "June 2024", dataStatus: "OFFICIAL DATA" },
      governmentSchemeLinks: ["PMFBY (2% Premium)", "Odisha Millets Mission", "Karnataka Raitha Siri Scheme"]
    },
    dataConfidenceScore: 97,
    dataConfidenceLevel: "High",
    sources: [OFFICIAL_CROP_SOURCES.CACP_2024_25, OFFICIAL_CROP_SOURCES.ICAR_POPR]
  },
  {
    cropId: "oats",
    cropName: "Oats",
    scientificName: "Avena sativa",
    localNames: {
      en: "Oats",
      hi: "जई",
      kn: "ಓಟ್ಸ್ (Oats)",
      mr: "ओट्स / जई (Oats)",
      te: "ఓట్స్ (Oats)",
      ta: "ஓட்ஸ் (Oats)",
      bn: "ওটস / জই (Oats)",
      gu: "ઓટ્સ / જઈ (Oats)",
      pa: "ਜਈ (Jai)",
      ml: "ഓട്സ് (Oats)",
      or: "ଓଟ୍ସ (Oats)",
      as: "ওটছ (Oats)",
      ur: "جئی"
    },
    category: "Cereals",
    subcategory: "Winter Cereal / Health Grain & Fodder",
    season: "Rabi",
    plantingWindow: "15 October - 15 November",
    harvestWindow: "March - April",
    typicalDurationDays: 120,
    durationRangeDays: { min: 105, max: 135 },
    soilRequirements: {
      soilTypes: ["Alluvial Soil (Entisols / Inceptisols)", "Red & Yellow Soil (Alfisols / Ultisols)"],
      texture: ["Sandy Loam", "Clay Loam"],
      pHRange: { min: 5.5, max: 7.5, optimalMin: 6.0, optimalMax: 7.0 },
      drainage: ["Good (No waterlogging)"],
      soilDepth: ["Medium (25 - 50 cm)", "Deep (> 50 cm)"]
    },
    climateRequirements: {
      temperature: { minC: 8, maxC: 28, optimalMinC: 14, optimalMaxC: 22 },
      rainfall: { minMm: 300, maxMm: 600, optimalMm: 400 },
      humidity: "Cool and moist during early growth; warm dry maturity",
      sunlight: "Abundant winter daylight",
      altitudeMeters: { min: 100, max: 3000 }
    },
    waterRequirements: {
      waterRequirementMm: 350,
      waterRequirementLevel: "Low (< 400 mm)",
      irrigationRequirement: "3-4 irrigations for grain; 4-5 if multi-cut fodder",
      criticalIrrigationStages: ["Tillering", "Booting", "Grain Filling"],
      droughtTolerance: "Moderate",
      waterloggingSensitivity: "High"
    },
    agronomy: {
      seedRequirement: { value: 30, unit: "kg/acre (Grain) / 40 kg (Fodder)", source: "ICAR-IGFRI", sourceDate: "2024", dataStatus: "OFFICIAL DATA" },
      plantingMethod: "Line sowing with seed drill",
      spacing: "22.5 cm row spacing",
      fertilizerRequirements: {
        rdfKgPerHa: "80:40:30 NPK kg/ha",
        majorNutrients: "High beta-glucan soluble fibre profile",
        micronutrients: "Zinc as needed",
        note: "Dual purpose crop (can yield 1 green fodder cut + grain harvest)"
      },
      majorNutrients: "N: 32 kg/acre, P2O5: 16 kg/acre, K2O: 12 kg/acre",
      micronutrients: "Zinc (Zn)"
    },
    production: {
      yieldRange: { min: 10.0, max: 18.0, benchmarkAvg: 14.0, unit: "Quintal/Acre (Grain)", source: "ICAR-IGFRI", sourceDate: "2024", dataStatus: "OFFICIAL DATA" },
      unit: "Quintal/Acre"
    },
    geographic: {
      majorProducingStates: ["Punjab", "Haryana", "Uttar Pradesh", "Madhya Pradesh", "Rajasthan", "Himachal Pradesh"],
      majorProducingDistricts: ["Ludhiana", "Meerut", "Karnal", "Gwalior"],
      suitableAgroClimaticZones: [1, 5, 6, 8]
    },
    market: {
      perishability: "Low (Durable grain/seed: 6-12+ months)",
      storageRequirement: "Moisture <= 11% in dry storage",
      processingPotential: "Rolled oats, Breakfast flakes, Oat milk, Dietary fibre products, Livestock feed",
      majorConsumptionRegions: ["Urban FMCG wellness markets, dairy cattle belts"]
    },
    trade: {
      exportImportance: "Low",
      importDependence: "Moderate Import"
    },
    government: {
      MSPApplicable: false,
      mspPrice2024_25: { value: null, unit: "INR/Quintal", source: "CACP (Not Under Central MSP Mandate)", sourceDate: "2024", dataStatus: "DATA NOT CONNECTED" },
      governmentSchemeLinks: ["National Livestock Mission (NLM - Fodder)", "MIDH"]
    },
    dataConfidenceScore: 91,
    dataConfidenceLevel: "High",
    sources: [OFFICIAL_CROP_SOURCES.ICAR_POPR]
  },
  {
    cropId: "foxtail_millet",
    cropName: "Foxtail Millet (Kangni)",
    scientificName: "Setaria italica",
    localNames: {
      en: "Foxtail Millet",
      hi: "कंगनी / काकुन",
      kn: "ನವಣೆ (Navane)",
      mr: "राळा (Rala)",
      te: "కొర్రలు (Korralu)",
      ta: "தினை (Thinai)",
      bn: "কাওন (Kaon)",
      gu: "કાંગ (Kang)",
      pa: "ਕੰਗਣੀ (Kangni)",
      ml: "തിന (Thina)",
      or: "କାଙ୍ଗୁ (Kangu)",
      as: "কাওন (Kaon)",
      ur: "کنگنی"
    },
    category: "Millets (Shree Anna)",
    subcategory: "Minor Nutri-Cereal",
    season: "Kharif",
    plantingWindow: "15 June - 15 July",
    harvestWindow: "September - October",
    typicalDurationDays: 80,
    durationRangeDays: { min: 70, max: 90 },
    soilRequirements: {
      soilTypes: ["Red & Yellow Soil (Alfisols / Ultisols)", "Black Cotton Soil (Vertisols)", "Alluvial Soil (Entisols / Inceptisols)"],
      texture: ["Sandy Loam", "Clay Loam"],
      pHRange: { min: 5.5, max: 8.0, optimalMin: 6.0, optimalMax: 7.5 },
      drainage: ["Good (No waterlogging)"],
      soilDepth: ["Shallow (< 25 cm)", "Medium (25 - 50 cm)"]
    },
    climateRequirements: {
      temperature: { minC: 18, maxC: 38, optimalMinC: 24, optimalMaxC: 34 },
      rainfall: { minMm: 300, maxMm: 600, optimalMm: 400 },
      humidity: "Dry semi-arid",
      sunlight: "Abundant sunlight",
      altitudeMeters: { min: 0, max: 2000 }
    },
    waterRequirements: {
      waterRequirementMm: 280,
      waterRequirementLevel: "Low (< 400 mm)",
      irrigationRequirement: "Extremely low water footprint; emergency catch crop in drought conditions",
      criticalIrrigationStages: ["Flowering"],
      droughtTolerance: "High",
      waterloggingSensitivity: "High"
    },
    agronomy: {
      seedRequirement: { value: 3.0, unit: "kg/acre", source: "ICAR-IIMR", sourceDate: "2024", dataStatus: "OFFICIAL DATA" },
      plantingMethod: "Line sowing",
      spacing: "30 cm x 10 cm",
      fertilizerRequirements: {
        rdfKgPerHa: "40:20:20 NPK kg/ha",
        majorNutrients: "Low chemical input requirement",
        micronutrients: "Zinc as needed",
        note: "Excellent short-duration contingency crop"
      },
      majorNutrients: "N: 16 kg/acre, P2O5: 8 kg/acre, K2O: 8 kg/acre",
      micronutrients: "Zinc (Zn)"
    },
    production: {
      yieldRange: { min: 5.0, max: 12.0, benchmarkAvg: 8.0, unit: "Quintal/Acre", source: "ICAR-IIMR", sourceDate: "2024", dataStatus: "OFFICIAL DATA" },
      unit: "Quintal/Acre"
    },
    geographic: {
      majorProducingStates: ["Andhra Pradesh", "Karnataka", "Telangana", "Tamil Nadu", "Maharashtra", "Madhya Pradesh", "Rajasthan"],
      majorProducingDistricts: ["Kurnool", "Anantapur", "Bellary", "Mahbubnagar"],
      suitableAgroClimaticZones: [7, 8, 9, 10, 11]
    },
    market: {
      perishability: "Low (Durable grain/seed: 6-12+ months)",
      storageRequirement: "Stores well in traditional airtight granaries",
      processingPotential: "Dehulled rice substitute, diabetic-friendly porridge, snacks",
      majorConsumptionRegions: ["Southern India, Shree Anna wellness consumer base"]
    },
    trade: {
      exportImportance: "Moderate",
      importDependence: "Self-Sufficient"
    },
    government: {
      MSPApplicable: false,
      mspPrice2024_25: { value: null, unit: "INR/Quintal", source: "State Millets Missions (Decentralized Procurement)", sourceDate: "2024", dataStatus: "DATA NOT CONNECTED" },
      governmentSchemeLinks: ["National Mission on Shree Anna", "PM Poshan Scheme inclusion"]
    },
    dataConfidenceScore: 92,
    dataConfidenceLevel: "High",
    sources: [OFFICIAL_CROP_SOURCES.ICAR_POPR]
  },

  // ==========================================
  // 2. PULSES
  // ==========================================
  {
    cropId: "gram_chana",
    cropName: "Chickpea / Gram (Desi Chana)",
    scientificName: "Cicer arietinum",
    localNames: {
      en: "Chickpea / Bengal Gram / Chana",
      hi: "चना / देशी चना",
      kn: "ಕಡಲೆ (Kadale)",
      mr: "हरभरा / चना (Harbara / Chana)",
      te: "శనగలు (Senagalu)",
      ta: "கொண்டைக்கடலை (Kothu Kadalai)",
      bn: "ছোলা (Chhola)",
      gu: "ચણા (Chana)",
      pa: "ਛੋਲੇ (Chhole)",
      ml: "കടല (Kadala)",
      or: "ବୁଟ (Buta)",
      as: "বুট মাহ (But Mah)",
      ur: "چنا"
    },
    category: "Pulses",
    subcategory: "Major Rabi Pulse (Legume)",
    season: "Rabi",
    plantingWindow: "15 October - 15 November",
    harvestWindow: "25 February - 30 March",
    typicalDurationDays: 110,
    durationRangeDays: { min: 95, max: 125 },
    soilRequirements: {
      soilTypes: ["Black Cotton Soil (Vertisols)", "Alluvial Soil (Entisols / Inceptisols)", "Red & Yellow Soil (Alfisols / Ultisols)"],
      texture: ["Clay Loam", "Sandy Loam", "Silty Loam"],
      pHRange: { min: 6.0, max: 8.5, optimalMin: 6.5, optimalMax: 8.0 },
      drainage: ["Good (No waterlogging)"],
      soilDepth: ["Medium (25 - 50 cm)", "Deep (> 50 cm)"]
    },
    climateRequirements: {
      temperature: { minC: 8, maxC: 32, optimalMinC: 15, optimalMaxC: 28 },
      rainfall: { minMm: 250, maxMm: 500, optimalMm: 350 },
      humidity: "Cool and dry climate; frost and cloudy weather during flowering cause flower drop",
      sunlight: "Bright sunny winter days",
      altitudeMeters: { min: 50, max: 2000 }
    },
    waterRequirements: {
      waterRequirementMm: 280,
      waterRequirementLevel: "Low (< 400 mm)",
      irrigationRequirement: "Grown primarily on residual soil moisture; 1-2 light irrigations increase yield by 35%",
      criticalIrrigationStages: ["Pre-flowering (Branching)", "Pod Development"],
      droughtTolerance: "High",
      waterloggingSensitivity: "High"
    },
    agronomy: {
      seedRequirement: { value: 30, unit: "kg/acre (Desi) / 45 kg (Kabuli)", source: "ICAR-IIPR", sourceDate: "2024", dataStatus: "OFFICIAL DATA" },
      plantingMethod: "Line sowing with seed drill",
      spacing: "30 cm x 10 cm",
      fertilizerRequirements: {
        rdfKgPerHa: "20:40:20 NPK kg/ha + Rhizobium & PSB seed treatment",
        majorNutrients: "Legume atmospheric nitrogen fixation (reduces urea need)",
        micronutrients: "Sulphur 20 kg/ha and Zinc 15 kg/ha ZnSO4",
        note: "Nipping apical shoots at 30-40 DAS promotes branching and pod density"
      },
      majorNutrients: "N: 8 kg/acre, P2O5: 16 kg/acre, K2O: 8 kg/acre",
      micronutrients: "Sulphur & Zinc"
    },
    production: {
      yieldRange: { min: 5.0, max: 12.0, benchmarkAvg: 7.5, unit: "Quintal/Acre", source: "DES MoA&FW", sourceDate: "2024", dataStatus: "OFFICIAL DATA" },
      unit: "Quintal/Acre"
    },
    geographic: {
      majorProducingStates: ["Madhya Pradesh", "Maharashtra", "Rajasthan", "Gujarat", "Uttar Pradesh", "Karnataka", "Andhra Pradesh"],
      majorProducingDistricts: ["Ujjain", "Vidisha", "Latur", "Bikaner", "Akola", "Kalaburagi"],
      suitableAgroClimaticZones: [4, 5, 6, 8, 9, 10, 13, 14]
    },
    market: {
      perishability: "Low (Durable grain/seed: 6-12+ months)",
      storageRequirement: "Moisture <= 10% with neem oil treatment or hermetic bags to prevent bruchid pulse beetle",
      processingPotential: "Chana Dal, Besan (Gram Flour), Roasted Chana, Sattu, Sprouts, Snacks",
      majorConsumptionRegions: ["Pan-India staple pulse; primary ingredient in Indian culinary snacks"]
    },
    trade: {
      exportImportance: "Moderate",
      importDependence: "Self-Sufficient"
    },
    government: {
      MSPApplicable: true,
      mspPrice2024_25: { value: 5440, unit: "INR/Quintal", source: "CACP Rabi 2024-25", sourceDate: "18-October-2023", dataStatus: "OFFICIAL DATA" },
      mspPrice2023_24: { value: 5335, unit: "INR/Quintal", source: "CACP Rabi 2023-24", sourceDate: "October 2022", dataStatus: "OFFICIAL DATA" },
      cacpCostA2FL: { value: 3400, unit: "INR/Quintal", source: "CACP Rabi 2024-25", sourceDate: "October 2023", dataStatus: "OFFICIAL DATA" },
      cacpCostC2: { value: 4850, unit: "INR/Quintal", source: "CACP Rabi 2024-25", sourceDate: "October 2023", dataStatus: "OFFICIAL DATA" },
      governmentSchemeLinks: ["PMFBY (1.5% Premium)", "NAFED / NCCF Procurement under PSF", "NFSM-Pulses"]
    },
    dataConfidenceScore: 98,
    dataConfidenceLevel: "High",
    sources: [OFFICIAL_CROP_SOURCES.CACP_2024_25, OFFICIAL_CROP_SOURCES.ICAR_POPR]
  },
  {
    cropId: "tur_arhar",
    cropName: "Pigeonpea / Arhar / Tur",
    scientificName: "Cajanus cajan",
    localNames: {
      en: "Pigeonpea / Red Gram / Tur",
      hi: "तुअर / अरहर",
      kn: "ತೊಗರಿ (Togari)",
      mr: "तूर (Tur)",
      te: "కందులు (Kandulu)",
      ta: "துவரம்பருப்பு (Thuvaram Paruppu)",
      bn: "অড়হর (Arhar)",
      gu: "તુવેર (Tuver)",
      pa: "ਅਰਹਰ (Arhar)",
      ml: "തുവര (Thuvara)",
      or: "ହରଡ଼ (Harada)",
      as: "অৰহৰ (Arhar)",
      ur: "ارہر / تور"
    },
    category: "Pulses",
    subcategory: "Major Kharif Long-Duration Pulse",
    season: "Kharif",
    plantingWindow: "15 June - 10 July",
    harvestWindow: "15 December - 25 January",
    typicalDurationDays: 165,
    durationRangeDays: { min: 140, max: 190 },
    soilRequirements: {
      soilTypes: ["Black Cotton Soil (Vertisols)", "Red & Yellow Soil (Alfisols / Ultisols)", "Alluvial Soil (Entisols / Inceptisols)"],
      texture: ["Clay Loam", "Sandy Loam"],
      pHRange: { min: 6.0, max: 8.2, optimalMin: 6.5, optimalMax: 7.8 },
      drainage: ["Good (No waterlogging)"],
      soilDepth: ["Deep (> 50 cm)"]
    },
    climateRequirements: {
      temperature: { minC: 16, maxC: 38, optimalMinC: 22, optimalMaxC: 34 },
      rainfall: { minMm: 500, maxMm: 900, optimalMm: 650 },
      humidity: "Moderate humidity during vegetative; clear dry winter during pod maturation",
      sunlight: "Abundant sunshine",
      altitudeMeters: { min: 0, max: 1500 }
    },
    waterRequirements: {
      waterRequirementMm: 450,
      waterRequirementLevel: "Medium (400 - 800 mm)",
      irrigationRequirement: "Deep taproot extracts subsoil water; sensitive to water stagnation during heavy monsoon",
      criticalIrrigationStages: ["Branching", "Flowering", "Pod Development"],
      droughtTolerance: "High",
      waterloggingSensitivity: "High"
    },
    agronomy: {
      seedRequirement: { value: 5.0, unit: "kg/acre (Sole crop) / 2.5 kg (Intercropped with Soybean/Cotton)", source: "ICAR-IIPR", sourceDate: "2024", dataStatus: "OFFICIAL DATA" },
      plantingMethod: "Ridge and furrow or broad bed furrow (BBF) line sowing",
      spacing: "90 cm x 20 cm (Sole) or 60 cm x 15 cm",
      fertilizerRequirements: {
        rdfKgPerHa: "25:50:25 NPK kg/ha + Rhizobium seed inoculation",
        majorNutrients: "High phosphorus requirement for nodulation and pod setting",
        micronutrients: "Sulphur 20 kg/ha and Zinc 15 kg/ha",
        note: "Helicoverpa pod borer and Sterility Mosaic Disease require integrated pest management (IPM)"
      },
      majorNutrients: "N: 10 kg/acre, P2O5: 20 kg/acre, K2O: 10 kg/acre",
      micronutrients: "Sulphur & Zinc"
    },
    production: {
      yieldRange: { min: 4.0, max: 10.5, benchmarkAvg: 6.5, unit: "Quintal/Acre", source: "DES MoA&FW", sourceDate: "2024", dataStatus: "OFFICIAL DATA" },
      unit: "Quintal/Acre"
    },
    geographic: {
      majorProducingStates: ["Maharashtra", "Madhya Pradesh", "Karnataka", "Gujarat", "Uttar Pradesh", "Telangana", "Andhra Pradesh"],
      majorProducingDistricts: ["Kalaburagi", "Latur", "Nanded", "Amravati", "Narsinghpur", "Bharuch"],
      suitableAgroClimaticZones: [4, 5, 7, 8, 9, 10, 11]
    },
    market: {
      perishability: "Low (Durable grain/seed: 6-12+ months)",
      storageRequirement: "Moisture <= 10% in clean godowns",
      processingPotential: "Tur Dal (Oiled / Water polished), Green tender pods as vegetable",
      majorConsumptionRegions: ["Pan-India staple dal (highest consumed pulse across India)"]
    },
    trade: {
      exportImportance: "Low",
      importDependence: "High (Net Importer)"
    },
    government: {
      MSPApplicable: true,
      mspPrice2024_25: { value: 7550, unit: "INR/Quintal", source: "CACP Kharif 2024-25", sourceDate: "19-June-2024", dataStatus: "OFFICIAL DATA" },
      mspPrice2023_24: { value: 7000, unit: "INR/Quintal", source: "CACP Kharif 2023-24", sourceDate: "June 2023", dataStatus: "OFFICIAL DATA" },
      cacpCostA2FL: { value: 4791, unit: "INR/Quintal", source: "CACP Kharif 2024-25", sourceDate: "June 2024", dataStatus: "OFFICIAL DATA" },
      cacpCostC2: { value: 6650, unit: "INR/Quintal", source: "CACP Kharif 2024-25", sourceDate: "June 2024", dataStatus: "OFFICIAL DATA" },
      governmentSchemeLinks: ["PMFBY (2% Premium)", "e-Samridhi NAFED Portal 100% Procurement Guarantee", "NFSM-Special Pulse Drive"]
    },
    dataConfidenceScore: 98,
    dataConfidenceLevel: "High",
    sources: [OFFICIAL_CROP_SOURCES.CACP_2024_25, OFFICIAL_CROP_SOURCES.ICAR_POPR]
  },
  {
    cropId: "moong",
    cropName: "Green Gram / Moong",
    scientificName: "Vigna radiata",
    localNames: {
      en: "Green Gram / Moong",
      hi: "मूंग",
      kn: "ಹೆಸರುಕಾಳು (Hesaru Kaalu)",
      mr: "मूग (Moog)",
      te: "పెసలు (Pesalu)",
      ta: "பாசிப்பயறு (Pasi Payaru)",
      bn: "মুগ (Mug)",
      gu: "મગ (Mag)",
      pa: "ਮੂੰਗੀ (Moongi)",
      ml: "ചെറുപയർ (Cherupayar)",
      or: "ମୁଗ (Muga)",
      as: "মগু মাহ (Mogu Mah)",
      ur: "مونگ"
    },
    category: "Pulses",
    subcategory: "Short-Duration Catch Legume",
    season: "Multiple seasons",
    plantingWindow: "20 June - 10 July (Kharif) / 15 March - 15 April (Zaid/Summer)",
    harvestWindow: "25 August - 20 September (Kharif) / May - June (Zaid)",
    typicalDurationDays: 65,
    durationRangeDays: { min: 60, max: 75 },
    soilRequirements: {
      soilTypes: ["Alluvial Soil (Entisols / Inceptisols)", "Black Cotton Soil (Vertisols)", "Red & Yellow Soil (Alfisols / Ultisols)"],
      texture: ["Sandy Loam", "Clay Loam"],
      pHRange: { min: 6.2, max: 8.0, optimalMin: 6.5, optimalMax: 7.5 },
      drainage: ["Good (No waterlogging)"],
      soilDepth: ["Medium (25 - 50 cm)", "Deep (> 50 cm)"]
    },
    climateRequirements: {
      temperature: { minC: 20, maxC: 40, optimalMinC: 25, optimalMaxC: 35 },
      rainfall: { minMm: 300, maxMm: 600, optimalMm: 400 },
      humidity: "Moderate humidity",
      sunlight: "Bright warm sunshine",
      altitudeMeters: { min: 0, max: 1800 }
    },
    waterRequirements: {
      waterRequirementMm: 320,
      waterRequirementLevel: "Low (< 400 mm)",
      irrigationRequirement: "Kharif crop mostly rainfed; Zaid crop requires 3-4 light irrigations",
      criticalIrrigationStages: ["Branching", "Flowering / Pod Setting"],
      droughtTolerance: "High",
      waterloggingSensitivity: "High"
    },
    agronomy: {
      seedRequirement: { value: 8.0, unit: "kg/acre (Kharif) / 10 kg (Zaid/Summer)", source: "ICAR-IIPR", sourceDate: "2024", dataStatus: "OFFICIAL DATA" },
      plantingMethod: "Line sowing with seed drill",
      spacing: "30 cm x 10 cm",
      fertilizerRequirements: {
        rdfKgPerHa: "20:40:20 NPK kg/ha + Rhizobium inoculation",
        majorNutrients: "Enriches soil organic nitrogen for succeeding crop",
        micronutrients: "Sulphur 20 kg/ha",
        note: "Yellow Mosaic Virus (YMV) resistant varieties (e.g., Shikha, Virat) recommended"
      },
      majorNutrients: "N: 8 kg/acre, P2O5: 16 kg/acre, K2O: 8 kg/acre",
      micronutrients: "Sulphur (S)"
    },
    production: {
      yieldRange: { min: 3.0, max: 7.0, benchmarkAvg: 4.5, unit: "Quintal/Acre", source: "DES MoA&FW", sourceDate: "2024", dataStatus: "OFFICIAL DATA" },
      unit: "Quintal/Acre"
    },
    geographic: {
      majorProducingStates: ["Rajasthan", "Madhya Pradesh", "Maharashtra", "Karnataka", "Gujarat", "Bihar", "Andhra Pradesh"],
      majorProducingDistricts: ["Nagaur", "Jaipur", "Harda", "Sehore", "Jalna", "Gadag"],
      suitableAgroClimaticZones: [4, 5, 6, 8, 9, 10, 13, 14]
    },
    market: {
      perishability: "Low (Durable grain/seed: 6-12+ months)",
      storageRequirement: "Moisture <= 10% in dry storage",
      processingPotential: "Moong Dal (Washed / Chilka), Moong Mogar, Sprouts, Namkeen / Papad",
      majorConsumptionRegions: ["Pan-India staple (highly valued for convalescent & daily nutrition)"]
    },
    trade: {
      exportImportance: "Low",
      importDependence: "Moderate Import"
    },
    government: {
      MSPApplicable: true,
      mspPrice2024_25: { value: 8682, unit: "INR/Quintal", source: "CACP Kharif 2024-25", sourceDate: "19-June-2024", dataStatus: "OFFICIAL DATA" },
      mspPrice2023_24: { value: 8558, unit: "INR/Quintal", source: "CACP Kharif 2023-24", sourceDate: "June 2023", dataStatus: "OFFICIAL DATA" },
      cacpCostA2FL: { value: 5788, unit: "INR/Quintal", source: "CACP Kharif 2024-25", sourceDate: "June 2024", dataStatus: "OFFICIAL DATA" },
      cacpCostC2: { value: 7850, unit: "INR/Quintal", source: "CACP Kharif 2024-25", sourceDate: "June 2024", dataStatus: "OFFICIAL DATA" },
      governmentSchemeLinks: ["PMFBY (2% Premium)", "NAFED 100% Procurement Guarantee", "NFSM-Summer Pulses"]
    },
    dataConfidenceScore: 98,
    dataConfidenceLevel: "High",
    sources: [OFFICIAL_CROP_SOURCES.CACP_2024_25, OFFICIAL_CROP_SOURCES.ICAR_POPR]
  },
  {
    cropId: "urad_black_gram",
    cropName: "Black Gram / Urad",
    scientificName: "Vigna mungo",
    localNames: {
      en: "Black Gram / Urad",
      hi: "उड़द",
      kn: "ಉದ್ದಿನಕಾಳು (Uddina Kaalu)",
      mr: "उडीद (Udid)",
      te: "మినుములు (Minumulu)",
      ta: "உளுந்து (Ulundhu)",
      bn: "মাষকলাই (Mashkalai)",
      gu: "અડદ (Adad)",
      pa: "ਮਾਂਹ (Maash / Urad)",
      ml: "ഉഴുന്ന് (Uzhunnu)",
      or: "ବିରି (Biri)",
      as: "মাটি মাহ (Mati Mah)",
      ur: "ماش / اڑد"
    },
    category: "Pulses",
    subcategory: "Kharif & Rabi Pulse",
    season: "Multiple seasons",
    plantingWindow: "25 June - 15 July (Kharif) / October - November (Rabi Rice Fallows)",
    harvestWindow: "September - October (Kharif) / January - February (Rabi)",
    typicalDurationDays: 75,
    durationRangeDays: { min: 65, max: 85 },
    soilRequirements: {
      soilTypes: ["Black Cotton Soil (Vertisols)", "Alluvial Soil (Entisols / Inceptisols)", "Red & Yellow Soil (Alfisols / Ultisols)"],
      texture: ["Clay Loam", "Sandy Loam"],
      pHRange: { min: 6.2, max: 8.0, optimalMin: 6.5, optimalMax: 7.5 },
      drainage: ["Good (No waterlogging)"],
      soilDepth: ["Medium (25 - 50 cm)", "Deep (> 50 cm)"]
    },
    climateRequirements: {
      temperature: { minC: 22, maxC: 38, optimalMinC: 25, optimalMaxC: 34 },
      rainfall: { minMm: 400, maxMm: 800, optimalMm: 500 },
      humidity: "Warm humid climate",
      sunlight: "Full sun",
      altitudeMeters: { min: 0, max: 1500 }
    },
    waterRequirements: {
      waterRequirementMm: 350,
      waterRequirementLevel: "Low (< 400 mm)",
      irrigationRequirement: "Kharif mostly rainfed; in coastal rice fallows grown on residual moisture without irrigation",
      criticalIrrigationStages: ["Flowering", "Pod Filling"],
      droughtTolerance: "Moderate",
      waterloggingSensitivity: "High"
    },
    agronomy: {
      seedRequirement: { value: 8.0, unit: "kg/acre (Line Sown) / 10-12 kg (Rice Fallow Broadcast)", source: "ICAR-IIPR", sourceDate: "2024", dataStatus: "OFFICIAL DATA" },
      plantingMethod: "Line sowing or relay sowing in standing paddy crop (Paira/Utera cropping)",
      spacing: "30 cm x 10 cm",
      fertilizerRequirements: {
        rdfKgPerHa: "20:40:20 NPK kg/ha + Rhizobium inoculation",
        majorNutrients: "High phosphorus responsiveness for nodulation",
        micronutrients: "Sulphur 20 kg/ha",
        note: "Crucial ingredient for traditional fermentation batters (Idli/Dosa/Vada/Dal Makhani)"
      },
      majorNutrients: "N: 8 kg/acre, P2O5: 16 kg/acre, K2O: 8 kg/acre",
      micronutrients: "Sulphur (S)"
    },
    production: {
      yieldRange: { min: 3.0, max: 7.5, benchmarkAvg: 4.5, unit: "Quintal/Acre", source: "DES MoA&FW", sourceDate: "2024", dataStatus: "OFFICIAL DATA" },
      unit: "Quintal/Acre"
    },
    geographic: {
      majorProducingStates: ["Madhya Pradesh", "Uttar Pradesh", "Andhra Pradesh", "Maharashtra", "Tamil Nadu", "Gujarat", "Rajasthan"],
      majorProducingDistricts: ["Chhindwara", "Lalitpur", "Guntur", "Krishna", "Jalgaon"],
      suitableAgroClimaticZones: [3, 4, 5, 7, 8, 9, 10, 11]
    },
    market: {
      perishability: "Low (Durable grain/seed: 6-12+ months)",
      storageRequirement: "Moisture <= 10% in dry storage",
      processingPotential: "Urad Dal (Split / Whole White / Washed), Papad, Batter industry, Dal Makhani",
      majorConsumptionRegions: ["Pan-India (huge consumption in South Indian breakfast food industry)"]
    },
    trade: {
      exportImportance: "Low",
      importDependence: "High (Net Importer)"
    },
    government: {
      MSPApplicable: true,
      mspPrice2024_25: { value: 7400, unit: "INR/Quintal", source: "CACP Kharif 2024-25", sourceDate: "19-June-2024", dataStatus: "OFFICIAL DATA" },
      mspPrice2023_24: { value: 6950, unit: "INR/Quintal", source: "CACP Kharif 2023-24", sourceDate: "June 2023", dataStatus: "OFFICIAL DATA" },
      cacpCostA2FL: { value: 4683, unit: "INR/Quintal", source: "CACP Kharif 2024-25", sourceDate: "June 2024", dataStatus: "OFFICIAL DATA" },
      cacpCostC2: { value: 6450, unit: "INR/Quintal", source: "CACP Kharif 2024-25", sourceDate: "June 2024", dataStatus: "OFFICIAL DATA" },
      governmentSchemeLinks: ["PMFBY (2% Premium)", "NAFED 100% Procurement Guarantee Portal"]
    },
    dataConfidenceScore: 98,
    dataConfidenceLevel: "High",
    sources: [OFFICIAL_CROP_SOURCES.CACP_2024_25, OFFICIAL_CROP_SOURCES.ICAR_POPR]
  },
  {
    cropId: "lentil_masoor",
    cropName: "Lentil / Masur",
    scientificName: "Lens culinaris",
    localNames: {
      en: "Lentil / Masoor",
      hi: "मसूर",
      kn: "ತೊಗರಿ ಮಸೂರ್ (Masoor)",
      mr: "मसूर (Masoor)",
      te: "ఎర్ర కందులు (Erra Kandulu)",
      ta: "மசூர் பருப்பு (Masoor Paruppu)",
      bn: "মসুর ডাল (Mosur Dal)",
      gu: "મસૂર (Masoor)",
      pa: "ਮਸਰ (Masar)",
      ml: "മസൂർ പരിപ്പ് (Masoor)",
      or: "ମସୁର (Masura)",
      as: "মচুৰ মাহ (Mosur Mah)",
      ur: "مسور"
    },
    category: "Pulses",
    subcategory: "Rabi Cool-Season Legume",
    season: "Rabi",
    plantingWindow: "20 October - 15 November",
    harvestWindow: "March - April",
    typicalDurationDays: 110,
    durationRangeDays: { min: 95, max: 125 },
    soilRequirements: {
      soilTypes: ["Alluvial Soil (Entisols / Inceptisols)", "Black Cotton Soil (Vertisols)"],
      texture: ["Clay Loam", "Silty Loam", "Sandy Loam"],
      pHRange: { min: 6.0, max: 8.0, optimalMin: 6.5, optimalMax: 7.5 },
      drainage: ["Good (No waterlogging)"],
      soilDepth: ["Medium (25 - 50 cm)", "Deep (> 50 cm)"]
    },
    climateRequirements: {
      temperature: { minC: 6, maxC: 28, optimalMinC: 14, optimalMaxC: 22 },
      rainfall: { minMm: 250, maxMm: 500, optimalMm: 350 },
      humidity: "Cool winter growth with dry warm harvesting period",
      sunlight: "Sunny winter days",
      altitudeMeters: { min: 50, max: 3000 }
    },
    waterRequirements: {
      waterRequirementMm: 260,
      waterRequirementLevel: "Low (< 400 mm)",
      irrigationRequirement: "Extremely drought tolerant; 1 irrigation at pod formation gives significant yield jump",
      criticalIrrigationStages: ["Pod Formation"],
      droughtTolerance: "High",
      waterloggingSensitivity: "High"
    },
    agronomy: {
      seedRequirement: { value: 15, unit: "kg/acre (Small seeded) / 20 kg (Bold seeded)", source: "ICAR-IIPR", sourceDate: "2024", dataStatus: "OFFICIAL DATA" },
      plantingMethod: "Line sowing or Paira / Utera cropping in Eastern rice fallows",
      spacing: "25 cm x 5 cm",
      fertilizerRequirements: {
        rdfKgPerHa: "20:40:20 NPK kg/ha + Rhizobium inoculation",
        majorNutrients: "High phosphorus responsiveness",
        micronutrients: "Zinc and Molybdenum in acidic soils",
        note: "Fastest cooking pulse with highest protein digestibility"
      },
      majorNutrients: "N: 8 kg/acre, P2O5: 16 kg/acre, K2O: 8 kg/acre",
      micronutrients: "Zinc (Zn)"
    },
    production: {
      yieldRange: { min: 4.0, max: 9.5, benchmarkAvg: 6.5, unit: "Quintal/Acre", source: "DES MoA&FW", sourceDate: "2024", dataStatus: "OFFICIAL DATA" },
      unit: "Quintal/Acre"
    },
    geographic: {
      majorProducingStates: ["Madhya Pradesh", "Uttar Pradesh", "West Bengal", "Bihar", "Rajasthan", "Jharkhand"],
      majorProducingDistricts: ["Sagar", "Damoh", "Lalitpur", "Bahraich", "Murshidabad", "Patna"],
      suitableAgroClimaticZones: [3, 4, 5, 8]
    },
    market: {
      perishability: "Low (Durable grain/seed: 6-12+ months)",
      storageRequirement: "Moisture <= 10% in dry storage",
      processingPotential: "Red Split Lentil (Masoor Dal), Whole Brown Masoor, Soups",
      majorConsumptionRegions: ["Eastern India, Northern India, global export markets"]
    },
    trade: {
      exportImportance: "Moderate",
      importDependence: "Moderate Import"
    },
    government: {
      MSPApplicable: true,
      mspPrice2024_25: { value: 6425, unit: "INR/Quintal", source: "CACP Rabi 2024-25", sourceDate: "18-October-2023", dataStatus: "OFFICIAL DATA" },
      mspPrice2023_24: { value: 6000, unit: "INR/Quintal", source: "CACP Rabi 2023-24", sourceDate: "October 2022", dataStatus: "OFFICIAL DATA" },
      cacpCostA2FL: { value: 3402, unit: "INR/Quintal", source: "CACP Rabi 2024-25", sourceDate: "October 2023", dataStatus: "OFFICIAL DATA" },
      cacpCostC2: { value: 4780, unit: "INR/Quintal", source: "CACP Rabi 2024-25", sourceDate: "October 2023", dataStatus: "OFFICIAL DATA" },
      governmentSchemeLinks: ["PMFBY (1.5% Premium)", "e-Samridhi 100% Assured NAFED/NCCF Procurement Drive"]
    },
    dataConfidenceScore: 98,
    dataConfidenceLevel: "High",
    sources: [OFFICIAL_CROP_SOURCES.CACP_2024_25, OFFICIAL_CROP_SOURCES.ICAR_POPR]
  },

  // ==========================================
  // 3. OILSEEDS
  // ==========================================
  {
    cropId: "soybean",
    cropName: "Soybean (Yellow)",
    scientificName: "Glycine max",
    localNames: {
      en: "Soybean",
      hi: "सोयाबीन",
      kn: "ಸೋಯಾಬೀನ್ (Soyabean)",
      mr: "सोयाबीन (Soyabean)",
      te: "సోయాబీన్ (Soyabean)",
      ta: "சோயாபீன் (Soyabean)",
      bn: "সয়াবিন (Soyabean)",
      gu: "સોયાબીન (Soyabean)",
      pa: "ਸੋਇਆਬੀਨ (Soyabean)",
      ml: "സോയാബീൻ (Soyabean)",
      or: "ସୋୟାବିନ (Soyabean)",
      as: "চয়াবিন (Soyabean)",
      ur: "سویا بین"
    },
    category: "Oilseeds",
    subcategory: "Major Kharif Oilseed & Meal",
    season: "Kharif",
    plantingWindow: "15 June - 05 July (With onset of South-West Monsoon)",
    harvestWindow: "25 September - 20 October",
    typicalDurationDays: 95,
    durationRangeDays: { min: 85, max: 105 },
    soilRequirements: {
      soilTypes: ["Black Cotton Soil (Vertisols)", "Alluvial Soil (Entisols / Inceptisols)"],
      texture: ["Clay Loam", "Silty Loam"],
      pHRange: { min: 6.0, max: 7.8, optimalMin: 6.5, optimalMax: 7.5 },
      drainage: ["Good (No waterlogging)"],
      soilDepth: ["Medium (25 - 50 cm)", "Deep (> 50 cm)"]
    },
    climateRequirements: {
      temperature: { minC: 18, maxC: 36, optimalMinC: 24, optimalMaxC: 32 },
      rainfall: { minMm: 600, maxMm: 1000, optimalMm: 750 },
      humidity: "Warm and moist during vegetative growth",
      sunlight: "Abundant sunshine during pod filling",
      altitudeMeters: { min: 0, max: 1200 }
    },
    waterRequirements: {
      waterRequirementMm: 450,
      waterRequirementLevel: "Medium (400 - 800 mm)",
      irrigationRequirement: "Extremely sensitive to both dry spells at pod filling and waterlogging in early stages",
      criticalIrrigationStages: ["Flowering", "Pod Filling (R5-R6 stage)"],
      droughtTolerance: "Moderate",
      waterloggingSensitivity: "High"
    },
    agronomy: {
      seedRequirement: { value: 30, unit: "kg/acre (Broad Bed Furrow)", source: "ICAR-IISR", sourceDate: "2024", dataStatus: "OFFICIAL DATA" },
      plantingMethod: "Broad Bed Furrow (BBF) or Ridge & Furrow seed drill",
      spacing: "45 cm x 10 cm",
      fertilizerRequirements: {
        rdfKgPerHa: "20:60:40 NPK kg/ha + Bradyrhizobium japonicum inoculation",
        majorNutrients: "High phosphorus and potash requirement",
        micronutrients: "Sulphur 25 kg/ha (brings oil content to >20%) and Zinc 15 kg/ha",
        note: "Avoid deep sowing (> 3-4 cm) to prevent poor germination emergence"
      },
      majorNutrients: "N: 8 kg/acre, P2O5: 24 kg/acre, K2O: 16 kg/acre",
      micronutrients: "Sulphur (S) & Zinc (Zn)"
    },
    production: {
      yieldRange: { min: 5.5, max: 12.0, benchmarkAvg: 8.5, unit: "Quintal/Acre", source: "DES MoA&FW", sourceDate: "2024", dataStatus: "OFFICIAL DATA" },
      unit: "Quintal/Acre"
    },
    geographic: {
      majorProducingStates: ["Madhya Pradesh", "Maharashtra", "Rajasthan", "Karnataka", "Telangana", "Gujarat"],
      majorProducingDistricts: ["Indore", "Ujjain", "Dewas", "Latur", "Nanded", "Kota", "Jhalawar"],
      suitableAgroClimaticZones: [8, 9, 10, 13]
    },
    market: {
      perishability: "Low (Durable grain/seed: 6-12+ months)",
      storageRequirement: "Moisture <= 10% in dry ventilated godown to prevent rancidity and loss of seed viability",
      processingPotential: "Soybean Refined Oil (18-20%), De-oiled Cake (DOC / Soya Meal 48% protein for export), Tofu, Soya Chunks",
      majorConsumptionRegions: ["Central & Western solvent extraction plants, global poultry feed export"]
    },
    trade: {
      exportImportance: "High",
      importDependence: "Self-Sufficient"
    },
    government: {
      MSPApplicable: true,
      mspPrice2024_25: { value: 4892, unit: "INR/Quintal", source: "CACP Kharif 2024-25", sourceDate: "19-June-2024", dataStatus: "OFFICIAL DATA" },
      mspPrice2023_24: { value: 4600, unit: "INR/Quintal", source: "CACP Kharif 2023-24", sourceDate: "June 2023", dataStatus: "OFFICIAL DATA" },
      cacpCostA2FL: { value: 3261, unit: "INR/Quintal", source: "CACP Kharif 2024-25", sourceDate: "June 2024", dataStatus: "OFFICIAL DATA" },
      cacpCostC2: { value: 4420, unit: "INR/Quintal", source: "CACP Kharif 2024-25", sourceDate: "June 2024", dataStatus: "OFFICIAL DATA" },
      governmentSchemeLinks: ["PMFBY (2% Premium)", "National Mission on Edible Oils - Oilseeds (NMEO-OS)"]
    },
    dataConfidenceScore: 98,
    dataConfidenceLevel: "High",
    sources: [OFFICIAL_CROP_SOURCES.CACP_2024_25, OFFICIAL_CROP_SOURCES.ICAR_POPR]
  },
  {
    cropId: "mustard_rapeseed",
    cropName: "Rapeseed & Mustard (Sarson / Raya)",
    scientificName: "Brassica juncea",
    localNames: {
      en: "Mustard / Rapeseed",
      hi: "सरसों / राई",
      kn: "ಸಾಸಿವೆ (Sasive)",
      mr: "मोहरी / सरसो (Mohari)",
      te: "ఆవాలు (Avalu)",
      ta: "கடுகு (Kadugu)",
      bn: "সরিষা (Shorisha)",
      gu: "રાઈ / સરસવ (Rai / Sarsav)",
      pa: "ਸਰ੍ਹੋਂ / ਰਾਇਆ (Sarson / Raya)",
      ml: "കടുക് (Kaduku)",
      or: "ସୋରିଷ (Sorisa)",
      as: "সৰিয়হ (Sorihoh)",
      ur: "سرسوں / رائی"
    },
    category: "Oilseeds",
    subcategory: "Major Rabi Oilseed",
    season: "Rabi",
    plantingWindow: "01 October - 25 October",
    harvestWindow: "15 February - 15 March",
    typicalDurationDays: 115,
    durationRangeDays: { min: 105, max: 130 },
    soilRequirements: {
      soilTypes: ["Alluvial Soil (Entisols / Inceptisols)", "Arid / Desert Soil (Aridisols)", "Black Cotton Soil (Vertisols)"],
      texture: ["Sandy Loam", "Clay Loam"],
      pHRange: { min: 6.0, max: 8.2, optimalMin: 6.5, optimalMax: 7.8 },
      drainage: ["Good (No waterlogging)"],
      soilDepth: ["Medium (25 - 50 cm)", "Deep (> 50 cm)"]
    },
    climateRequirements: {
      temperature: { minC: 8, maxC: 30, optimalMinC: 12, optimalMaxC: 25 },
      rainfall: { minMm: 250, maxMm: 450, optimalMm: 300 },
      humidity: "Dry clear weather during flowering and pod development",
      sunlight: "Abundant sunshine",
      altitudeMeters: { min: 50, max: 1800 }
    },
    waterRequirements: {
      waterRequirementMm: 300,
      waterRequirementLevel: "Low (< 400 mm)",
      irrigationRequirement: "Requires only 2-3 irrigations; high water use efficiency",
      criticalIrrigationStages: ["Rosette / Pre-flowering (30-35 DAS)", "Siliquae (Pod) Filling (60-65 DAS)"],
      droughtTolerance: "High",
      waterloggingSensitivity: "High"
    },
    agronomy: {
      seedRequirement: { value: 1.8, unit: "kg/acre", source: "ICAR-DRMR", sourceDate: "2024", dataStatus: "OFFICIAL DATA" },
      plantingMethod: "Line sowing with seed drill",
      spacing: "45 cm x 15 cm",
      fertilizerRequirements: {
        rdfKgPerHa: "80:40:40 NPK kg/ha + Sulphur 30 kg/ha",
        majorNutrients: "Sulphur is vital for glucosinolate oil biosynthesis (oil content 38-42%)",
        micronutrients: "Boron 1 kg/ha and Zinc 15 kg/ha",
        note: "Timely sowing before 20 October avoids mustard aphid peak infestation"
      },
      majorNutrients: "N: 32 kg/acre, P2O5: 16 kg/acre, K2O: 16 kg/acre",
      micronutrients: "Sulphur (S) & Boron (B)"
    },
    production: {
      yieldRange: { min: 5.5, max: 12.5, benchmarkAvg: 8.0, unit: "Quintal/Acre", source: "DES MoA&FW", sourceDate: "2024", dataStatus: "OFFICIAL DATA" },
      unit: "Quintal/Acre"
    },
    geographic: {
      majorProducingStates: ["Rajasthan", "Madhya Pradesh", "Haryana", "Uttar Pradesh", "West Bengal", "Gujarat", "Assam"],
      majorProducingDistricts: ["Bharatpur", "Alwar", "Ganganagar", "Morena", "Bhind", "Hisar", "Agra"],
      suitableAgroClimaticZones: [3, 4, 5, 6, 8, 13, 14]
    },
    market: {
      perishability: "Low (Durable grain/seed: 6-12+ months)",
      storageRequirement: "Moisture <= 8% to preserve oil quality",
      processingPotential: "Kachi Ghani Mustard Oil (Cold pressed), Mustard Cake (DOC Cattle Feed), Condiment paste",
      majorConsumptionRegions: ["Northern, Eastern and North-Eastern India (staple cooking oil)"]
    },
    trade: {
      exportImportance: "Moderate",
      importDependence: "Self-Sufficient"
    },
    government: {
      MSPApplicable: true,
      mspPrice2024_25: { value: 5650, unit: "INR/Quintal", source: "CACP Rabi 2024-25", sourceDate: "18-October-2023", dataStatus: "OFFICIAL DATA" },
      mspPrice2023_24: { value: 5450, unit: "INR/Quintal", source: "CACP Rabi 2023-24", sourceDate: "October 2022", dataStatus: "OFFICIAL DATA" },
      cacpCostA2FL: { value: 2855, unit: "INR/Quintal", source: "CACP Rabi 2024-25", sourceDate: "October 2023", dataStatus: "OFFICIAL DATA" },
      cacpCostC2: { value: 4120, unit: "INR/Quintal", source: "CACP Rabi 2024-25", sourceDate: "October 2023", dataStatus: "OFFICIAL DATA" },
      governmentSchemeLinks: ["PMFBY (1.5% Premium)", "NAFED / HAFED Price Support Scheme", "NMEO-Oilseeds"]
    },
    dataConfidenceScore: 98,
    dataConfidenceLevel: "High",
    sources: [OFFICIAL_CROP_SOURCES.CACP_2024_25, OFFICIAL_CROP_SOURCES.ICAR_POPR]
  },
  {
    cropId: "groundnut",
    cropName: "Groundnut / Peanut",
    scientificName: "Arachis hypogaea",
    localNames: {
      en: "Groundnut / Peanut",
      hi: "मूंगफली",
      kn: "ಕಡಲೆಕಾಯಿ (Kadale Kaayi)",
      mr: "भुईमूग (Bhuimug)",
      te: "వేరుశనగ (Verusanaga)",
      ta: "வேர்க்கடலை / மணிலா (Verkadalai)",
      bn: "চীনাবাদাম (Chinabadam)",
      gu: "મગફળી (Magfali)",
      pa: "ਮੂੰਗਫਲੀ (Moongfali)",
      ml: "നിലക്കടല (Nilakkadala)",
      or: "ଚିନାବାଦାମ (Chinabadama)",
      as: "বাদাম (Badam)",
      ur: "مونگ پھلی"
    },
    category: "Oilseeds",
    subcategory: "Kharif & Rabi / Summer Oilseed",
    season: "Multiple seasons",
    plantingWindow: "20 June - 15 July (Kharif) / 15 November - 15 December (Rabi) / Jan - Feb (Summer)",
    harvestWindow: "15 October - 15 November (Kharif) / March - April (Rabi)",
    typicalDurationDays: 110,
    durationRangeDays: { min: 100, max: 125 },
    soilRequirements: {
      soilTypes: ["Red & Yellow Soil (Alfisols / Ultisols)", "Alluvial Soil (Entisols / Inceptisols)", "Arid / Desert Soil (Aridisols)"],
      texture: ["Sandy Loam", "Sandy"],
      pHRange: { min: 5.8, max: 7.8, optimalMin: 6.0, optimalMax: 7.2 },
      drainage: ["Good (No waterlogging)"],
      soilDepth: ["Medium (25 - 50 cm)", "Deep (> 50 cm)"]
    },
    climateRequirements: {
      temperature: { minC: 20, maxC: 38, optimalMinC: 25, optimalMaxC: 34 },
      rainfall: { minMm: 500, maxMm: 800, optimalMm: 600 },
      humidity: "Warm weather with moderate rainfall during pegging",
      sunlight: "Abundant sunshine",
      altitudeMeters: { min: 0, max: 1100 }
    },
    waterRequirements: {
      waterRequirementMm: 500,
      waterRequirementLevel: "Medium (400 - 800 mm)",
      irrigationRequirement: "Critical moisture required during peg penetration and pod development; avoids hard setting soil",
      criticalIrrigationStages: ["Flowering", "Pegging Stage (35-45 DAS)", "Pod Development (60-70 DAS)"],
      droughtTolerance: "Moderate",
      waterloggingSensitivity: "High"
    },
    agronomy: {
      seedRequirement: { value: 45, unit: "kg/acre (Kernels)", source: "ICAR-DGR", sourceDate: "2024", dataStatus: "OFFICIAL DATA" },
      plantingMethod: "Ridge & furrow or flat bed line sowing",
      spacing: "30 cm x 10 cm",
      fertilizerRequirements: {
        rdfKgPerHa: "20:40:40 NPK kg/ha + Gypsum 400 kg/ha at pegging",
        majorNutrients: "Calcium in Gypsum is mandatory for preventing hollow pod (pops)",
        micronutrients: "Sulphur 20 kg/ha, Boron 1 kg/ha, Zinc 15 kg/ha",
        note: "Loose friable sandy loam soil essential for easy peg entry and clean harvesting"
      },
      majorNutrients: "N: 8 kg/acre, P2O5: 16 kg/acre, K2O: 16 kg/acre + Gypsum 160 kg/acre",
      micronutrients: "Calcium, Sulphur, Boron & Zinc"
    },
    production: {
      yieldRange: { min: 6.5, max: 14.0, benchmarkAvg: 9.5, unit: "Quintal/Acre (In-pod)", source: "DES MoA&FW", sourceDate: "2024", dataStatus: "OFFICIAL DATA" },
      unit: "Quintal/Acre"
    },
    geographic: {
      majorProducingStates: ["Gujarat", "Rajasthan", "Tamil Nadu", "Andhra Pradesh", "Karnataka", "Madhya Pradesh", "Maharashtra"],
      majorProducingDistricts: ["Rajkot", "Junagadh", "Amreli", "Bikaner", "Anantapur", "Villupuram"],
      suitableAgroClimaticZones: [7, 8, 9, 10, 11, 13, 14]
    },
    market: {
      perishability: "Low (Durable grain/seed: 6-12+ months)",
      storageRequirement: "Moisture <= 8% to prevent Aspergillus flavus (aflatoxin contamination)",
      processingPotential: "Groundnut Oil (48-50% oil content), HPS Groundnut (Table export grade), Peanut butter, Chikki / Confectionery",
      majorConsumptionRegions: ["Western and Southern India, global table peanut export markets"]
    },
    trade: {
      exportImportance: "High",
      importDependence: "Self-Sufficient"
    },
    government: {
      MSPApplicable: true,
      mspPrice2024_25: { value: 6783, unit: "INR/Quintal", source: "CACP Kharif 2024-25", sourceDate: "19-June-2024", dataStatus: "OFFICIAL DATA" },
      mspPrice2023_24: { value: 6377, unit: "INR/Quintal", source: "CACP Kharif 2023-24", sourceDate: "June 2023", dataStatus: "OFFICIAL DATA" },
      cacpCostA2FL: { value: 4522, unit: "INR/Quintal", source: "CACP Kharif 2024-25", sourceDate: "June 2024", dataStatus: "OFFICIAL DATA" },
      cacpCostC2: { value: 6150, unit: "INR/Quintal", source: "CACP Kharif 2024-25", sourceDate: "June 2024", dataStatus: "OFFICIAL DATA" },
      governmentSchemeLinks: ["PMFBY (2% Premium)", "NAFED PSS Procurement", "NMEO-Oilseeds"]
    },
    dataConfidenceScore: 98,
    dataConfidenceLevel: "High",
    sources: [OFFICIAL_CROP_SOURCES.CACP_2024_25, OFFICIAL_CROP_SOURCES.ICAR_POPR]
  },
  {
    cropId: "sunflower",
    cropName: "Sunflower",
    scientificName: "Helianthus annuus",
    localNames: {
      en: "Sunflower",
      hi: "सूरजमुखी",
      kn: "ಸೂರ್ಯಕಾಂತಿ (Suryakanthi)",
      mr: "सूर्यफूल (Suryaphool)",
      te: "పొద్దుతిరుగుడు (Podduthirugudu)",
      ta: "சூரியகாந்தி (Suriyakanthi)",
      bn: "সূর্যমুখী (Suryamukhi)",
      gu: "સૂર્યમુખી (Suryamukhi)",
      pa: "ਸੂਰਜਮੁਖੀ (Surajmukhi)",
      ml: "സൂര്യകാന്തി (Suryakanthi)",
      or: "ସୂର୍ଯ୍ୟମୁଖୀ (Suryamukhi)",
      as: "সূৰ্যমুখী (Suryamukhi)",
      ur: "سورج مکھی"
    },
    category: "Oilseeds",
    subcategory: "Photo-Insensitive Edible Oilseed",
    season: "Multiple seasons",
    plantingWindow: "July - August (Kharif) / November - December (Rabi) / January - February (Summer)",
    harvestWindow: "October - November (Kharif) / February - March (Rabi) / April - May (Summer)",
    typicalDurationDays: 90,
    durationRangeDays: { min: 80, max: 100 },
    soilRequirements: {
      soilTypes: ["Black Cotton Soil (Vertisols)", "Alluvial Soil (Entisols / Inceptisols)", "Red & Yellow Soil (Alfisols / Ultisols)"],
      texture: ["Clay Loam", "Sandy Loam"],
      pHRange: { min: 6.5, max: 8.5, optimalMin: 6.8, optimalMax: 8.0 },
      drainage: ["Good (No waterlogging)"],
      soilDepth: ["Medium (25 - 50 cm)", "Deep (> 50 cm)"]
    },
    climateRequirements: {
      temperature: { minC: 15, maxC: 38, optimalMinC: 22, optimalMaxC: 32 },
      rainfall: { minMm: 400, maxMm: 700, optimalMm: 500 },
      humidity: "Moderate humidity",
      sunlight: "Abundant bright sunshine",
      altitudeMeters: { min: 0, max: 1500 }
    },
    waterRequirements: {
      waterRequirementMm: 450,
      waterRequirementLevel: "Medium (400 - 800 mm)",
      irrigationRequirement: "4-5 irrigations in Rabi/Summer; moisture stress at seed setting drastically reduces oil content",
      criticalIrrigationStages: ["Bud Initiation (Button stage)", "Flowering", "Seed Filling"],
      droughtTolerance: "High",
      waterloggingSensitivity: "High"
    },
    agronomy: {
      seedRequirement: { value: 2.5, unit: "kg/acre (Hybrid)", source: "ICAR-IIOR", sourceDate: "2024", dataStatus: "OFFICIAL DATA" },
      plantingMethod: "Ridge and furrow line sowing",
      spacing: "60 cm x 30 cm",
      fertilizerRequirements: {
        rdfKgPerHa: "60:60:30 NPK kg/ha + Borax 10 kg/ha",
        majorNutrients: "Boron spray (0.2% Borax at ray floret opening) ensures complete seed filling",
        micronutrients: "Sulphur 20 kg/ha and Boron",
        note: "Maintain honeybee hives (2-3 boxes/acre) for optimal cross-pollination"
      },
      majorNutrients: "N: 24 kg/acre, P2O5: 24 kg/acre, K2O: 12 kg/acre",
      micronutrients: "Boron (B) & Sulphur (S)"
    },
    production: {
      yieldRange: { min: 5.0, max: 11.0, benchmarkAvg: 7.5, unit: "Quintal/Acre", source: "DES MoA&FW", sourceDate: "2024", dataStatus: "OFFICIAL DATA" },
      unit: "Quintal/Acre"
    },
    geographic: {
      majorProducingStates: ["Karnataka", "Maharashtra", "Andhra Pradesh", "Telangana", "Haryana", "Punjab"],
      majorProducingDistricts: ["Bijapur", "Bagalkot", "Latur", "Osmanabad", "Kurnool"],
      suitableAgroClimaticZones: [6, 9, 10, 11]
    },
    market: {
      perishability: "Low (Durable grain/seed: 6-12+ months)",
      storageRequirement: "Moisture <= 9% in dry godowns",
      processingPotential: "Premium Heart-Healthy Edible Oil (high PUFA / linoleic acid), Sunflower Meal, Birdseed",
      majorConsumptionRegions: ["South India, urban premium refined oil markets"]
    },
    trade: {
      exportImportance: "Low",
      importDependence: "High (Net Importer)"
    },
    government: {
      MSPApplicable: true,
      mspPrice2024_25: { value: 7280, unit: "INR/Quintal", source: "CACP Kharif 2024-25", sourceDate: "19-June-2024", dataStatus: "OFFICIAL DATA" },
      mspPrice2023_24: { value: 6760, unit: "INR/Quintal", source: "CACP Kharif 2023-24", sourceDate: "June 2023", dataStatus: "OFFICIAL DATA" },
      cacpCostA2FL: { value: 4853, unit: "INR/Quintal", source: "CACP Kharif 2024-25", sourceDate: "June 2024", dataStatus: "OFFICIAL DATA" },
      cacpCostC2: { value: 6600, unit: "INR/Quintal", source: "CACP Kharif 2024-25", sourceDate: "June 2024", dataStatus: "OFFICIAL DATA" },
      governmentSchemeLinks: ["PMFBY (2% Premium)", "NMEO-Oilseeds Special Assistance"]
    },
    dataConfidenceScore: 97,
    dataConfidenceLevel: "High",
    sources: [OFFICIAL_CROP_SOURCES.CACP_2024_25, OFFICIAL_CROP_SOURCES.ICAR_POPR]
  },
  {
    cropId: "sesame_til",
    cropName: "Sesame / Til",
    scientificName: "Sesamum indicum",
    localNames: {
      en: "Sesame / Gingelly / Til",
      hi: "तिल",
      kn: "ಎಳ್ಳು (Ellu)",
      mr: "तीळ (Teel)",
      te: "నువ్వులు (Nuvvulu)",
      ta: "எள் (Ellu)",
      bn: "তিল (Til)",
      gu: "તલ (Tal)",
      pa: "ਤਿਲ (Til)",
      ml: "എള്ള് (Ellu)",
      or: "ରାଶି (Rasi)",
      as: "তিল (Til)",
      ur: "تل"
    },
    category: "Oilseeds",
    subcategory: "Ancient High-Value Oilseed",
    season: "Multiple seasons",
    plantingWindow: "July (Kharif) / January - February (Summer)",
    harvestWindow: "October (Kharif) / April - May (Summer)",
    typicalDurationDays: 85,
    durationRangeDays: { min: 75, max: 95 },
    soilRequirements: {
      soilTypes: ["Alluvial Soil (Entisols / Inceptisols)", "Red & Yellow Soil (Alfisols / Ultisols)", "Black Cotton Soil (Vertisols)"],
      texture: ["Sandy Loam", "Clay Loam"],
      pHRange: { min: 5.5, max: 8.0, optimalMin: 6.2, optimalMax: 7.5 },
      drainage: ["Good (No waterlogging)"],
      soilDepth: ["Medium (25 - 50 cm)"]
    },
    climateRequirements: {
      temperature: { minC: 22, maxC: 40, optimalMinC: 25, optimalMaxC: 35 },
      rainfall: { minMm: 350, maxMm: 600, optimalMm: 450 },
      humidity: "Warm dry season for ripening",
      sunlight: "Abundant sunshine",
      altitudeMeters: { min: 0, max: 1200 }
    },
    waterRequirements: {
      waterRequirementMm: 300,
      waterRequirementLevel: "Low (< 400 mm)",
      irrigationRequirement: "Extremely drought tolerant; 1-2 irrigations in summer",
      criticalIrrigationStages: ["Flowering", "Capsule Formation"],
      droughtTolerance: "High",
      waterloggingSensitivity: "High"
    },
    agronomy: {
      seedRequirement: { value: 1.5, unit: "kg/acre", source: "ICAR-IIOR", sourceDate: "2024", dataStatus: "OFFICIAL DATA" },
      plantingMethod: "Line sowing mixed with fine sand",
      spacing: "30 cm x 10 cm",
      fertilizerRequirements: {
        rdfKgPerHa: "30:20:20 NPK kg/ha + Sulphur 20 kg/ha",
        majorNutrients: "High quality oil containing natural antioxidant sesamol",
        micronutrients: "Zinc as needed",
        note: "White sesame commands high export premium"
      },
      majorNutrients: "N: 12 kg/acre, P2O5: 8 kg/acre, K2O: 8 kg/acre",
      micronutrients: "Sulphur (S)"
    },
    production: {
      yieldRange: { min: 2.5, max: 5.5, benchmarkAvg: 3.5, unit: "Quintal/Acre", source: "DES MoA&FW", sourceDate: "2024", dataStatus: "OFFICIAL DATA" },
      unit: "Quintal/Acre"
    },
    geographic: {
      majorProducingStates: ["Gujarat", "West Bengal", "Rajasthan", "Madhya Pradesh", "Uttar Pradesh", "Tamil Nadu", "Odisha"],
      majorProducingDistricts: ["Amreli", "Bhavnagar", "Murshidabad", "Chhatarpur"],
      suitableAgroClimaticZones: [3, 4, 5, 8, 10, 11, 13, 14]
    },
    market: {
      perishability: "Low (Durable grain/seed: 6-12+ months)",
      storageRequirement: "Moisture <= 7% in dry storage",
      processingPotential: "Sesame Oil (Gingelly oil), Tahini / Halva, Bakery topping, Confectionery (Gajak/Revdi), Exports",
      majorConsumptionRegions: ["South India (Gingelly cooking oil), Western export processing clusters"]
    },
    trade: {
      exportImportance: "High",
      importDependence: "Self-Sufficient"
    },
    government: {
      MSPApplicable: true,
      mspPrice2024_25: { value: 9267, unit: "INR/Quintal", source: "CACP Kharif 2024-25", sourceDate: "19-June-2024", dataStatus: "OFFICIAL DATA" },
      mspPrice2023_24: { value: 8635, unit: "INR/Quintal", source: "CACP Kharif 2023-24", sourceDate: "June 2023", dataStatus: "OFFICIAL DATA" },
      cacpCostA2FL: { value: 6178, unit: "INR/Quintal", source: "CACP Kharif 2024-25", sourceDate: "June 2024", dataStatus: "OFFICIAL DATA" },
      cacpCostC2: { value: 8400, unit: "INR/Quintal", source: "CACP Kharif 2024-25", sourceDate: "June 2024", dataStatus: "OFFICIAL DATA" },
      governmentSchemeLinks: ["PMFBY (2% Premium)", "APEDA Export Promotion Scheme"]
    },
    dataConfidenceScore: 97,
    dataConfidenceLevel: "High",
    sources: [OFFICIAL_CROP_SOURCES.CACP_2024_25, OFFICIAL_CROP_SOURCES.ICAR_POPR]
  },
  {
    cropId: "castor",
    cropName: "Castor",
    scientificName: "Ricinus communis",
    localNames: {
      en: "Castor",
      hi: "अरंडी",
      kn: "ಔಡಲ (Oudala)",
      mr: "एरंडी (Erandi)",
      te: "ఆముదము (Aamudamu)",
      ta: "ஆமணக்கு (Amanakku)",
      bn: "রেড়ি (Reri)",
      gu: "દિવેલા / એરંડા (Divela / Eranda)",
      pa: "ਅਰੰਡੀ (Arandi)",
      ml: "ആവണക്ക് (Aavanakku)",
      or: "ଜଡ଼ା (Jada)",
      as: "এৰা (Era)",
      ur: "ارنڈ"
    },
    category: "Oilseeds",
    subcategory: "Industrial Non-Edible Oilseed",
    season: "Kharif",
    plantingWindow: "15 July - 15 August",
    harvestWindow: "December - March (Multiple picking spikes)",
    typicalDurationDays: 160,
    durationRangeDays: { min: 140, max: 180 },
    soilRequirements: {
      soilTypes: ["Alluvial Soil (Entisols / Inceptisols)", "Red & Yellow Soil (Alfisols / Ultisols)", "Arid / Desert Soil (Aridisols)", "Black Cotton Soil (Vertisols)"],
      texture: ["Sandy Loam", "Clay Loam"],
      pHRange: { min: 6.0, max: 8.2, optimalMin: 6.5, optimalMax: 7.8 },
      drainage: ["Good (No waterlogging)"],
      soilDepth: ["Deep (> 50 cm)"]
    },
    climateRequirements: {
      temperature: { minC: 18, maxC: 40, optimalMinC: 25, optimalMaxC: 36 },
      rainfall: { minMm: 400, maxMm: 750, optimalMm: 550 },
      humidity: "Dry warm weather",
      sunlight: "Abundant sunshine",
      altitudeMeters: { min: 0, max: 1200 }
    },
    waterRequirements: {
      waterRequirementMm: 450,
      waterRequirementLevel: "Medium (400 - 800 mm)",
      irrigationRequirement: "Deep rooted drought hardy; drip irrigation with fertigation in Gujarat yields world record outputs",
      criticalIrrigationStages: ["Primary Spike Emergence", "Secondary Spike Development"],
      droughtTolerance: "High",
      waterloggingSensitivity: "High"
    },
    agronomy: {
      seedRequirement: { value: 2.0, unit: "kg/acre (Hybrid)", source: "ICAR-IIOR", sourceDate: "2024", dataStatus: "OFFICIAL DATA" },
      plantingMethod: "Line sowing / paired row with drip lateral",
      spacing: "120 cm x 60 cm (Irrigated Hybrid)",
      fertilizerRequirements: {
        rdfKgPerHa: "80:40:40 NPK kg/ha",
        majorNutrients: "Split N application after each spike harvest",
        micronutrients: "Sulphur 20 kg/ha",
        note: "India produces >85% of global castor oil export supply"
      },
      majorNutrients: "N: 32 kg/acre, P2O5: 16 kg/acre, K2O: 16 kg/acre",
      micronutrients: "Sulphur (S)"
    },
    production: {
      yieldRange: { min: 8.0, max: 20.0, benchmarkAvg: 12.5, unit: "Quintal/Acre", source: "DES MoA&FW", sourceDate: "2024", dataStatus: "OFFICIAL DATA" },
      unit: "Quintal/Acre"
    },
    geographic: {
      majorProducingStates: ["Gujarat (80%+ share)", "Rajasthan", "Andhra Pradesh", "Telangana", "Karnataka"],
      majorProducingDistricts: ["Banaskantha", "Patan", "Mehsana", "Sabarkantha", "Jalore"],
      suitableAgroClimaticZones: [10, 13, 14]
    },
    market: {
      perishability: "Low (Durable grain/seed: 6-12+ months)",
      storageRequirement: "Moisture <= 8% in dry storage",
      processingPotential: "Castor Oil (Ricinoleic acid derivative for aviation lubricants, cosmetics, polymers, paints, pharmaceuticals)",
      majorConsumptionRegions: ["Global chemical exports (China, Europe, USA) via Kandla/Mundra ports"]
    },
    trade: {
      exportImportance: "High",
      importDependence: "Self-Sufficient"
    },
    government: {
      MSPApplicable: false,
      mspPrice2024_25: { value: null, unit: "INR/Quintal", source: "Market Driven / SEA of India", sourceDate: "2024", dataStatus: "DATA NOT CONNECTED" },
      governmentSchemeLinks: ["PMFBY", "National Mission on Oilseeds"]
    },
    dataConfidenceScore: 96,
    dataConfidenceLevel: "High",
    sources: [OFFICIAL_CROP_SOURCES.ICAR_POPR]
  }
];
