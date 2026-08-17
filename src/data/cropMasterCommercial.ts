import { CropMasterRecord } from '../types';
import { OFFICIAL_CROP_SOURCES } from './cropMasterCatalog';

export const COMMERCIAL_AND_FODDER_CROPS: CropMasterRecord[] = [
  // ==========================================
  // 5. FIBRE CROPS
  // ==========================================
  {
    cropId: "cotton_medium_long",
    cropName: "Cotton (Kapas - Medium/Long Staple)",
    scientificName: "Gossypium hirsutum",
    localNames: {
      en: "Cotton / White Gold",
      hi: "कपास / रुई",
      kn: "ಹತ್ತಿ (Hatti)",
      mr: "कापूस (Kapoos)",
      te: "పత్తి (Patti)",
      ta: "பருத்தி (Paruthi)",
      bn: "তুলা (Tula)",
      gu: "કપાસ (Kapas)",
      pa: "ਕਪਾਹ / ਨਰਮਾ (Kapaah / Narma)",
      ml: "പരുത്തി (Paruthi)",
      or: "କପା (Kapa)",
      as: "কপাহ (Kopah)",
      ur: "کپاس"
    },
    category: "Fibre Crops",
    subcategory: "Major Commercial Fibre & Seed Oil",
    season: "Kharif",
    plantingWindow: "15 April - 15 May (North India) / 15 June - 10 July (Central & South India)",
    harvestWindow: "October - February (Multiple pickings)",
    typicalDurationDays: 165,
    durationRangeDays: { min: 145, max: 185 },
    soilRequirements: {
      soilTypes: ["Black Cotton Soil (Vertisols)", "Alluvial Soil (Entisols / Inceptisols)", "Red & Yellow Soil (Alfisols / Ultisols)"],
      texture: ["Clay Loam", "Heavy Clay", "Sandy Loam"],
      pHRange: { min: 6.0, max: 8.5, optimalMin: 6.5, optimalMax: 8.2 },
      drainage: ["Good (No waterlogging)"],
      soilDepth: ["Deep (> 50 cm)"]
    },
    climateRequirements: {
      temperature: { minC: 18, maxC: 42, optimalMinC: 24, optimalMaxC: 36 },
      rainfall: { minMm: 500, maxMm: 900, optimalMm: 700 },
      humidity: "Moderate humidity during vegetative; clear sunny dry weather during boll opening and picking",
      sunlight: "Abundant sunshine (>200 frost-free days)",
      altitudeMeters: { min: 0, max: 1000 }
    },
    waterRequirements: {
      waterRequirementMm: 700,
      waterRequirementLevel: "Medium (400 - 800 mm)",
      irrigationRequirement: "Deep taproot; requires 4-6 irrigations in North zone; Central zone mostly rainfed Vertisol",
      criticalIrrigationStages: ["Square (Bud) Formation", "Flowering", "Boll Development"],
      droughtTolerance: "High",
      waterloggingSensitivity: "High"
    },
    agronomy: {
      seedRequirement: { value: 1.8, unit: "kg/acre (Bt Cotton Hybrid - 450g packets x 2 packets/acre + refuge)", source: "ICAR-CICR", sourceDate: "2024", dataStatus: "OFFICIAL DATA" },
      plantingMethod: "Ridge & furrow or paired row with drip lateral",
      spacing: "90 cm x 60 cm (Central/South) or 67.5 cm x 45 cm (North High Density)",
      fertilizerRequirements: {
        rdfKgPerHa: "120:60:60 NPK kg/ha + Magnesium Sulphate 25 kg/ha",
        majorNutrients: "High potassium and magnesium prevents leaf reddening (Lalya)",
        micronutrients: "Zinc 25 kg/ha ZnSO4 and Boron foliar spray (0.15% Borax at flowering)",
        note: "Scouting for Pink Bollworm (PBW) with pheromone traps (5 traps/acre) mandatory"
      },
      majorNutrients: "N: 48 kg/acre, P2O5: 24 kg/acre, K2O: 24 kg/acre + MgSO4",
      micronutrients: "Magnesium (Mg), Boron (B) & Zinc (Zn)"
    },
    production: {
      yieldRange: { min: 6.0, max: 15.0, benchmarkAvg: 9.5, unit: "Quintal/Acre (Seed Cotton / Kapas)", source: "DES MoA&FW", sourceDate: "2024", dataStatus: "OFFICIAL DATA" },
      unit: "Quintal/Acre"
    },
    geographic: {
      majorProducingStates: ["Gujarat (Leading producer)", "Maharashtra (Largest acreage)", "Telangana", "Rajasthan", "Madhya Pradesh", "Haryana", "Karnataka", "Punjab"],
      majorProducingDistricts: ["Rajkot", "Surendranagar", "Yavatmal", "Amravati", "Warangal", "Adilabad", "Sirsa", "Bathinda"],
      suitableAgroClimaticZones: [6, 8, 9, 10, 13, 14]
    },
    market: {
      perishability: "Low (Baled raw cotton stores 1-3 years in moisture-free ginning warehouses)",
      storageRequirement: "Moisture <= 8.5% in bales to prevent staple strength degradation and discoloration",
      processingPotential: "Ginning & Spinning (Cotton Lint 34-36% ginning outturn), Cottonseed Oil (18-20% edible oil), Cottonseed De-oiled Cake (cattle feed)",
      majorConsumptionRegions: ["Textile spinning mills (Coimbatore, Surat, Ludhiana, Ahmedabad, Bhilwara)"]
    },
    trade: {
      exportImportance: "High",
      importDependence: "Self-Sufficient"
    },
    government: {
      MSPApplicable: true,
      mspPrice2024_25: { value: 7521, unit: "INR/Quintal (Long Staple) / 7121 (Medium Staple)", source: "CACP Kharif 2024-25", sourceDate: "19-June-2024", dataStatus: "OFFICIAL DATA" },
      mspPrice2023_24: { value: 7020, unit: "INR/Quintal (Long Staple) / 6620 (Medium)", source: "CACP Kharif 2023-24", sourceDate: "June 2023", dataStatus: "OFFICIAL DATA" },
      cacpCostA2FL: { value: 4747, unit: "INR/Quintal", source: "CACP Kharif 2024-25", sourceDate: "June 2024", dataStatus: "OFFICIAL DATA" },
      cacpCostC2: { value: 6550, unit: "INR/Quintal", source: "CACP Kharif 2024-25", sourceDate: "June 2024", dataStatus: "OFFICIAL DATA" },
      governmentSchemeLinks: ["PMFBY (2% Premium)", "Cotton Corporation of India (CCI) MSP Procurement Operations", "National Technical Textiles Mission"]
    },
    dataConfidenceScore: 98,
    dataConfidenceLevel: "High",
    sources: [OFFICIAL_CROP_SOURCES.CACP_2024_25, OFFICIAL_CROP_SOURCES.ICAR_POPR]
  },
  {
    cropId: "jute",
    cropName: "Raw Jute (Golden Fibre)",
    scientificName: "Corchorus olitorius / capsularis",
    localNames: {
      en: "Jute / Golden Fibre",
      hi: "जूट / पटसन",
      kn: "ಸೆಣಬು (Senabu)",
      mr: "ताग (Taag)",
      te: "జనపనార (Janapanara)",
      ta: "சணல் (Sanal)",
      bn: "পাট (Paat)",
      gu: "શણ (Shan)",
      pa: "ਸਣ (San)",
      ml: "ചണം (Chanam)",
      or: "ଝୋଟ (Jhota)",
      as: "মৰাপাট (Morapaat)",
      ur: "پٹ سن"
    },
    category: "Fibre Crops",
    subcategory: "Bast Fibre Eco-Friendly Crop",
    season: "Zaid",
    plantingWindow: "15 March - 15 April (Pre-monsoon sowing)",
    harvestWindow: "July - August (At 50% flowering for optimal fibre quality)",
    typicalDurationDays: 120,
    durationRangeDays: { min: 110, max: 135 },
    soilRequirements: {
      soilTypes: ["Alluvial Soil (Entisols / Inceptisols)"],
      texture: ["Clay Loam", "Silty Loam", "Sandy Loam"],
      pHRange: { min: 5.5, max: 7.5, optimalMin: 6.0, optimalMax: 7.0 },
      drainage: ["Moderate", "Poor (Prone to water stagnation)"],
      soilDepth: ["Medium (25 - 50 cm)", "Deep (> 50 cm)"]
    },
    climateRequirements: {
      temperature: { minC: 22, maxC: 38, optimalMinC: 26, optimalMaxC: 35 },
      rainfall: { minMm: 1200, maxMm: 2200, optimalMm: 1600 },
      humidity: "High relative humidity (75-90%)",
      sunlight: "Warm humid deltaic conditions with plentiful clean slow-moving water for microbial retting",
      altitudeMeters: { min: 0, max: 500 }
    },
    waterRequirements: {
      waterRequirementMm: 1000,
      waterRequirementLevel: "High (> 800 mm)",
      irrigationRequirement: "Pre-monsoon crop needs 1-2 initial irrigations; later stages flooded by monsoon; abundant clean water needed for retting",
      criticalIrrigationStages: ["Germination", "Early Vegetative Growth"],
      droughtTolerance: "Low",
      waterloggingSensitivity: "Low"
    },
    agronomy: {
      seedRequirement: { value: 2.5, unit: "kg/acre (Line Sowing with seed drill)", source: "ICAR-CRIJAF", sourceDate: "2024", dataStatus: "OFFICIAL DATA" },
      plantingMethod: "Line sowing with CRIJAF seed drill",
      spacing: "20 cm x 7 cm",
      fertilizerRequirements: {
        rdfKgPerHa: "60:30:30 NPK kg/ha",
        majorNutrients: "Nitrogen drives rapid vegetative stem elongation (3-4 metres height)",
        micronutrients: "Zinc as needed",
        note: "Improved microbial retting consortia (CRIJAF Sona) reduces retting time from 20 to 12 days and enhances fibre grade by 2 levels"
      },
      majorNutrients: "N: 24 kg/acre, P2O5: 12 kg/acre, K2O: 12 kg/acre",
      micronutrients: "Zinc (Zn)"
    },
    production: {
      yieldRange: { min: 10.0, max: 18.0, benchmarkAvg: 13.5, unit: "Quintal/Acre (Dry Baled Fibre)", source: "DES MoA&FW", sourceDate: "2024", dataStatus: "OFFICIAL DATA" },
      unit: "Quintal/Acre"
    },
    geographic: {
      majorProducingStates: ["West Bengal (80%+ share)", "Bihar", "Assam", "Odisha", "Meghalaya", "Andhra Pradesh"],
      majorProducingDistricts: ["Nadia", "Murshidabad", "North 24 Parganas", "Hooghly", "Purnia", "Katihar", "Nagaon"],
      suitableAgroClimaticZones: [2, 3, 4]
    },
    market: {
      perishability: "Low (Dry baled jute fibre stores 1-2 years in dry warehouses)",
      storageRequirement: "Moisture <= 14% to prevent mildew and fibre rot",
      processingPotential: "Gunny Bags (Burlap packaging mandated by Jute Packaging Materials Act 1987), Geo-textiles, Jute Twine, Shopping bags, Handicrafts",
      majorConsumptionRegions: ["Kolkata Jute Mills belt along Hooghly river; food grain packaging for FCI"]
    },
    trade: {
      exportImportance: "High",
      importDependence: "Self-Sufficient"
    },
    government: {
      MSPApplicable: true,
      mspPrice2024_25: { value: 5335, unit: "INR/Quintal (TDN-3 grade)", source: "CACP Jute 2024-25", sourceDate: "07-March-2024", dataStatus: "OFFICIAL DATA" },
      mspPrice2023_24: { value: 5050, unit: "INR/Quintal", source: "CACP Jute 2023-24", sourceDate: "March 2023", dataStatus: "OFFICIAL DATA" },
      cacpCostA2FL: { value: 3122, unit: "INR/Quintal", source: "CACP Jute 2024-25", sourceDate: "March 2024", dataStatus: "OFFICIAL DATA" },
      cacpCostC2: { value: 4350, unit: "INR/Quintal", source: "CACP Jute 2024-25", sourceDate: "March 2024", dataStatus: "OFFICIAL DATA" },
      governmentSchemeLinks: ["Jute Corporation of India (JCI) MSP Operations", "Jute-ICARE Program (Improved Cultivation and Advanced Retting Exercise)", "JPMA Act Packaging Mandate"]
    },
    dataConfidenceScore: 98,
    dataConfidenceLevel: "High",
    sources: [OFFICIAL_CROP_SOURCES.CACP_2024_25, OFFICIAL_CROP_SOURCES.ICAR_POPR]
  },

  // ==========================================
  // 6. SUGAR & COMMERCIAL CROPS
  // ==========================================
  {
    cropId: "sugarcane",
    cropName: "Sugarcane (Ganna)",
    scientificName: "Saccharum officinarum",
    localNames: {
      en: "Sugarcane",
      hi: "गन्ना / ईख",
      kn: "ಕಬ್ಬು (Kabbu)",
      mr: "ऊस (Oos)",
      te: "చెరకు (Cheraku)",
      ta: "கரும்பு (Karumbu)",
      bn: "আখ (Aakh)",
      gu: "શેરડી (Sherdi)",
      pa: "ਗੰਨਾ (Ganna)",
      ml: "കരിമ്പ് (Karimbu)",
      or: "ଆଖୁ (Aakhu)",
      as: "কুঁহিয়াৰ (Kuhiyar)",
      ur: "گنا"
    },
    category: "Sugar & Commercial Crops",
    subcategory: "Major Heavy Commercial Cash Crop",
    season: "Annual / Commercial",
    plantingWindow: "Oct - Nov (Autumn / Adsali in South) or Feb - March (Spring in North)",
    harvestWindow: "10-12 months (Spring) / 14-16 months (Adsali / Pre-seasonal)",
    typicalDurationDays: 360,
    durationRangeDays: { min: 330, max: 450 },
    soilRequirements: {
      soilTypes: ["Alluvial Soil (Entisols / Inceptisols)", "Black Cotton Soil (Vertisols)", "Red & Yellow Soil (Alfisols / Ultisols)"],
      texture: ["Clay Loam", "Silty Loam", "Sandy Loam"],
      pHRange: { min: 6.0, max: 8.2, optimalMin: 6.5, optimalMax: 7.8 },
      drainage: ["Good (No waterlogging)"],
      soilDepth: ["Deep (> 50 cm)"]
    },
    climateRequirements: {
      temperature: { minC: 18, maxC: 40, optimalMinC: 24, optimalMaxC: 36 },
      rainfall: { minMm: 1000, maxMm: 2200, optimalMm: 1500 },
      humidity: "High humidity during grand growth; cool dry sunny winter for sucrose accumulation",
      sunlight: "Intense solar radiation for C4 photosynthesis",
      altitudeMeters: { min: 0, max: 1000 }
    },
    waterRequirements: {
      waterRequirementMm: 1800,
      waterRequirementLevel: "High (> 800 mm)",
      irrigationRequirement: "Heavy irrigation feeder; drip irrigation with trash mulching saves 45-50% water and increases cane yield by 30%",
      criticalIrrigationStages: ["Formative Stage (60-130 DAS)", "Grand Growth Stage (130-250 DAS)"],
      droughtTolerance: "Low",
      waterloggingSensitivity: "Moderate"
    },
    agronomy: {
      seedRequirement: { value: 30, unit: "Quintal/Acre (3-bud setts) or 4,000 Single Bud Settlings (STP Method)", source: "ICAR-SBI / IISR", sourceDate: "2024", dataStatus: "OFFICIAL DATA" },
      plantingMethod: "Trench planting or Ring pit method or Paired row drip system",
      spacing: "120 cm - 150 cm row spacing (Wide row mechanization)",
      fertilizerRequirements: {
        rdfKgPerHa: "250:100:120 NPK kg/ha + Gluconacetobacter diazotrophicus biofertilizer",
        majorNutrients: "Split N in 3-4 doses before earthing up at 120 DAS; high potassium for sugar recovery percentage (>10-12%)",
        micronutrients: "Zinc 25 kg/ha ZnSO4 and Ferrous Sulphate in alkaline soils",
        note: "Co 0238 (Wonder variety of North), Co 86032, Co 11015, Co 15023 are key commercial varieties"
      },
      majorNutrients: "N: 100 kg/acre, P2O5: 40 kg/acre, K2O: 48 kg/acre",
      micronutrients: "Potash (K), Zinc (Zn) & Iron (Fe)"
    },
    production: {
      yieldRange: { min: 300.0, max: 600.0, benchmarkAvg: 380.0, unit: "Quintal/Acre (38-40 tonnes/acre)", source: "DES MoA&FW", sourceDate: "2024", dataStatus: "OFFICIAL DATA" },
      unit: "Quintal/Acre"
    },
    geographic: {
      majorProducingStates: ["Uttar Pradesh (Largest area & production)", "Maharashtra (Highest sugar recovery mills)", "Karnataka", "Tamil Nadu", "Gujarat", "Bihar", "Haryana", "Punjab"],
      majorProducingDistricts: ["Muzaffarnagar", "Meerut", "Kolhapur", "Sangli", "Belagavi", "Mandya", "Surat"],
      suitableAgroClimaticZones: [4, 5, 6, 8, 9, 10, 11, 13]
    },
    market: {
      perishability: "High after harvest (Sugar inversion occurs rapidly if not crushed within 24-48 hours of cutting)",
      storageRequirement: "Immediate transport to registered sugar mill gate within 24 hours of cutting",
      processingPotential: "Refined White Sugar, Jaggery (Gur / Khandsari), Ethanol (Fuel blending 20% EBP mandate), Bagasse (Cogeneration power), Pressmud (Bio-fertilizer)",
      majorConsumptionRegions: ["Direct crushing at ~530 cooperative and private sugar mills across India"]
    },
    trade: {
      exportImportance: "High",
      importDependence: "Self-Sufficient"
    },
    government: {
      MSPApplicable: true,
      mspPrice2024_25: { value: 340, unit: "INR/Quintal (FRP - Fair and Remunerative Price at 10.25% basic recovery)", source: "CCEA Mandate for Sugar Season 2024-25", sourceDate: "21-February-2024", dataStatus: "OFFICIAL DATA" },
      mspPrice2023_24: { value: 315, unit: "INR/Quintal (FRP for 2023-24)", source: "CCEA 2023", sourceDate: "June 2023", dataStatus: "OFFICIAL DATA" },
      cacpCostA2FL: { value: 165, unit: "INR/Quintal", source: "CACP Sugarcane Report", sourceDate: "2024", dataStatus: "OFFICIAL DATA" },
      cacpCostC2: { value: 245, unit: "INR/Quintal", source: "CACP Sugarcane Report", sourceDate: "2024", dataStatus: "OFFICIAL DATA" },
      governmentSchemeLinks: ["FRP / SAP Statutory Mill Payment Guarantee", "Ethanol Blended Petrol (EBP) Incentive Scheme", "Sugar Development Fund (SDF)"]
    },
    dataConfidenceScore: 99,
    dataConfidenceLevel: "High",
    sources: [OFFICIAL_CROP_SOURCES.CACP_2024_25, OFFICIAL_CROP_SOURCES.ICAR_POPR]
  },

  // ==========================================
  // 7. FODDER CROPS
  // ==========================================
  {
    cropId: "berseem",
    cropName: "Berseem (Egyptian Clover)",
    scientificName: "Trifolium alexandrinum",
    localNames: {
      en: "Berseem / Egyptian Clover",
      hi: "बरसीम / चारा",
      kn: "ಬರ್ಸೀಮ್ (Berseem)",
      mr: "बरसीम चारा (Berseem)",
      te: "బర్సీమ్ (Berseem)",
      ta: "பெர்சீம் தீவனம் (Berseem)",
      bn: "বারসিম (Barsim)",
      gu: "બરસીમ (Barsim)",
      pa: "ਬਰਸੀਮ (Barseem / Chhaata)",
      ml: "ബർസീം (Berseem)",
      or: "ବରସିମ (Barsim)",
      as: "বাৰচিম (Barsim)",
      ur: "برسیم"
    },
    category: "Fodder Crops",
    subcategory: "King of Winter Leguminous Fodder",
    season: "Rabi",
    plantingWindow: "01 October - 25 October",
    harvestWindow: "November - May (5 to 6 cuttings)",
    typicalDurationDays: 180,
    durationRangeDays: { min: 150, max: 210 },
    soilRequirements: {
      soilTypes: ["Alluvial Soil (Entisols / Inceptisols)", "Black Cotton Soil (Vertisols)"],
      texture: ["Clay Loam", "Silty Loam"],
      pHRange: { min: 6.5, max: 8.5, optimalMin: 7.0, optimalMax: 8.0 },
      drainage: ["Good (No waterlogging)"],
      soilDepth: ["Medium (25 - 50 cm)", "Deep (> 50 cm)"]
    },
    climateRequirements: {
      temperature: { minC: 8, maxC: 30, optimalMinC: 15, optimalMaxC: 25 },
      rainfall: { minMm: 300, maxMm: 600, optimalMm: 400 },
      humidity: "Cool and moist winter climate",
      sunlight: "Abundant winter daylight",
      altitudeMeters: { min: 50, max: 2000 }
    },
    waterRequirements: {
      waterRequirementMm: 700,
      waterRequirementLevel: "Medium (400 - 800 mm)",
      irrigationRequirement: "Requires frequent light irrigations (10-12 rounds) immediately after every cutting",
      criticalIrrigationStages: ["Establishment", "After Each Cut (Every 25-30 days)"],
      droughtTolerance: "Low",
      waterloggingSensitivity: "High"
    },
    agronomy: {
      seedRequirement: { value: 10, unit: "kg/acre + Rhizobium trifolii culture", source: "ICAR-IGFRI", sourceDate: "2024", dataStatus: "OFFICIAL DATA" },
      plantingMethod: "Broadcasting in standing water or shallow line sowing (often mixed with 1 kg Mustard for first cut bulk)",
      spacing: "Broadcasting or 20 cm line spacing",
      fertilizerRequirements: {
        rdfKgPerHa: "20:80:40 NPK kg/ha",
        majorNutrients: "High phosphorus requirement for vigorous multi-cut regrowth and root nodule nitrogen fixation",
        micronutrients: "Zinc as needed",
        note: "Produces 20-22% crude protein and 70% digestible dry matter (boosts dairy cow milk yield by 15-20%)"
      },
      majorNutrients: "N: 8 kg/acre, P2O5: 32 kg/acre, K2O: 16 kg/acre",
      micronutrients: "Phosphorus (P) & Calcium (Ca)"
    },
    production: {
      yieldRange: { min: 250.0, max: 450.0, benchmarkAvg: 320.0, unit: "Quintal/Acre (Green Fodder across 5-6 cuts)", source: "ICAR-IGFRI", sourceDate: "2024", dataStatus: "OFFICIAL DATA" },
      unit: "Quintal/Acre"
    },
    geographic: {
      majorProducingStates: ["Punjab", "Haryana", "Uttar Pradesh", "Rajasthan", "Madhya Pradesh", "Bihar", "Gujarat"],
      majorProducingDistricts: ["Ludhiana", "Karnal", "Meerut", "Alwar", "Amritsar", "Hisar"],
      suitableAgroClimaticZones: [1, 5, 6, 8, 13, 14]
    },
    market: {
      perishability: "High (Cut green fodder must be fed within 24 hours or converted to silage / hay)",
      storageRequirement: "On-farm daily green feeding to dairy animals or silo bags for lactic fermentation silage",
      processingPotential: "Silage, Hay making, Dairy cattle milk production booster",
      majorConsumptionRegions: ["Intensive dairy belts of North and Western India"]
    },
    trade: {
      exportImportance: "Low",
      importDependence: "Self-Sufficient"
    },
    government: {
      MSPApplicable: false,
      mspPrice2024_25: { value: null, unit: "INR/Quintal", source: "Fodder (Not Under Central MSP)", sourceDate: "2024", dataStatus: "DATA NOT CONNECTED" },
      governmentSchemeLinks: ["National Livestock Mission (NLM - Sub-Mission on Feed & Fodder Development)", "Rashtriya Gokul Mission"]
    },
    dataConfidenceScore: 95,
    dataConfidenceLevel: "High",
    sources: [OFFICIAL_CROP_SOURCES.ICAR_POPR]
  }
];
