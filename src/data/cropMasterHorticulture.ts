import { CropMasterRecord } from '../types';
import { OFFICIAL_CROP_SOURCES } from './cropMasterCatalog';

export const HORTICULTURE_CROPS: CropMasterRecord[] = [
  // ==========================================
  // 4. VEGETABLES
  // ==========================================
  {
    cropId: "potato",
    cropName: "Potato (Aloo)",
    scientificName: "Solanum tuberosum",
    localNames: {
      en: "Potato",
      hi: "आलू",
      kn: "ಆಲೂಗಡ್ಡೆ (Aaloogadde)",
      mr: "बटाटा (Batata)",
      te: "బంగాళాదుంప (Bangaladumpa)",
      ta: "உருளைக்கிழங்கு (Urulaikizhangu)",
      bn: "আলু (Aloo)",
      gu: "બટાટા (Batata)",
      pa: "ਆਲੂ (Aloo)",
      ml: "ഉരുളക്കിഴങ്ങ് (Urulakkizhangu)",
      or: "ଆଳୁ (Aalu)",
      as: "আলু (Alu)",
      ur: "آلو"
    },
    category: "Vegetables",
    subcategory: "Tuber Vegetable (Rabi)",
    season: "Rabi",
    plantingWindow: "15 October - 10 November (Plains) / March - April (Hills)",
    harvestWindow: "15 January - 28 February (Plains)",
    typicalDurationDays: 90,
    durationRangeDays: { min: 75, max: 110 },
    soilRequirements: {
      soilTypes: ["Alluvial Soil (Entisols / Inceptisols)", "Red & Yellow Soil (Alfisols / Ultisols)"],
      texture: ["Sandy Loam", "Silty Loam"],
      pHRange: { min: 5.2, max: 7.2, optimalMin: 5.5, optimalMax: 6.5 },
      drainage: ["Good (No waterlogging)"],
      soilDepth: ["Medium (25 - 50 cm)", "Deep (> 50 cm)"]
    },
    climateRequirements: {
      temperature: { minC: 10, maxC: 28, optimalMinC: 15, optimalMaxC: 22 },
      rainfall: { minMm: 250, maxMm: 500, optimalMm: 350 },
      humidity: "Moderate; high night temperatures (>21°C) retard tuberization",
      sunlight: "Sunny days with cool night temperatures",
      altitudeMeters: { min: 50, max: 3000 }
    },
    waterRequirements: {
      waterRequirementMm: 450,
      waterRequirementLevel: "Medium (400 - 800 mm)",
      irrigationRequirement: "Light and frequent irrigations (5-7 rounds); stop irrigation 10 days before dehaulming",
      criticalIrrigationStages: ["Stolon Formation", "Tuber Initiation", "Tuber Bulking"],
      droughtTolerance: "Low",
      waterloggingSensitivity: "High"
    },
    agronomy: {
      seedRequirement: { value: 10, unit: "Quintal/Acre (Seed Tubers 35-45g)", source: "ICAR-CPRI", sourceDate: "2024", dataStatus: "OFFICIAL DATA" },
      plantingMethod: "Ridge and furrow planting after treating seed tubers with Mencozeb",
      spacing: "60 cm x 20 cm",
      fertilizerRequirements: {
        rdfKgPerHa: "150:80:100 NPK kg/ha + 25 tonnes FYM/ha",
        majorNutrients: "High potassium requirement for tuber size and starch content",
        micronutrients: "Zinc 25 kg/ha ZnSO4",
        note: "Earthing up at 30-35 DAS prevents greening of tubers by sunlight"
      },
      majorNutrients: "N: 60 kg/acre, P2O5: 32 kg/acre, K2O: 40 kg/acre",
      micronutrients: "Potash (K) & Zinc (Zn)"
    },
    production: {
      yieldRange: { min: 80.0, max: 160.0, benchmarkAvg: 110.0, unit: "Quintal/Acre", source: "NHB Database", sourceDate: "2024", dataStatus: "OFFICIAL DATA" },
      unit: "Quintal/Acre"
    },
    geographic: {
      majorProducingStates: ["Uttar Pradesh", "West Bengal", "Bihar", "Gujarat", "Punjab", "Madhya Pradesh", "Karnataka"],
      majorProducingDistricts: ["Agra", "Farrukhabad", "Hooghly", "Burdwan", "Deesa (Banaskantha)", "Jalandhar"],
      suitableAgroClimaticZones: [1, 3, 4, 5, 6, 8, 13]
    },
    market: {
      perishability: "Medium (Semi-perishable: 1-4 months / Cold storage: 6-9 months at 2-4°C)",
      storageRequirement: "Cold storage with CIPC sprout suppressant treatment for table and processing potatoes",
      processingPotential: "Potato Chips, French Fries, Potato Flakes, Starch",
      majorConsumptionRegions: ["Pan-India staple vegetable"]
    },
    trade: {
      exportImportance: "Moderate",
      importDependence: "Self-Sufficient"
    },
    government: {
      MSPApplicable: false,
      mspPrice2024_25: { value: null, unit: "INR/Quintal", source: "Horticulture (No Central MSP)", sourceDate: "2024", dataStatus: "DATA NOT CONNECTED" },
      governmentSchemeLinks: ["MIDH (Mission for Integrated Development of Horticulture)", "Operation Greens (TOP Scheme - TOP to TOTAL)", "PMKSY (Cold Chain Subsidies)"]
    },
    dataConfidenceScore: 95,
    dataConfidenceLevel: "High",
    sources: [OFFICIAL_CROP_SOURCES.NHB_HORTICULTURE, OFFICIAL_CROP_SOURCES.ICAR_POPR]
  },
  {
    cropId: "onion",
    cropName: "Onion (Pyaaz)",
    scientificName: "Allium cepa",
    localNames: {
      en: "Onion",
      hi: "प्याज / कांदा",
      kn: "ಈರುಳ್ಳಿ (Eerulli)",
      mr: "कांदा (Kanda)",
      te: "ఉల్లిపాయ (Ullipaya)",
      ta: "வெங்காயம் (Vengayam)",
      bn: "পেঁয়াজ (Penyaj)",
      gu: "ડુંગળી / કાંદા (Dungli / Kanda)",
      pa: "ਗੰਢਾ / ਪਿਆਜ਼ (Gandha / Pyaz)",
      ml: "സവാള / ഉള്ളി (Savala / Ulli)",
      or: "ପିଆଜ (Piaja)",
      as: "পিয়াঁজ (Piyaz)",
      ur: "پیاز"
    },
    category: "Vegetables",
    subcategory: "Bulb Vegetable (Kharif, Late Kharif & Rabi)",
    season: "Multiple seasons",
    plantingWindow: "July - Aug (Kharif) / Oct - Nov (Late Kharif) / Dec - Jan (Rabi)",
    harvestWindow: "Oct - Nov (Kharif) / Jan - Feb (Late Kharif) / April - May (Rabi)",
    typicalDurationDays: 120,
    durationRangeDays: { min: 105, max: 135 },
    soilRequirements: {
      soilTypes: ["Alluvial Soil (Entisols / Inceptisols)", "Red & Yellow Soil (Alfisols / Ultisols)", "Black Cotton Soil (Vertisols)"],
      texture: ["Sandy Loam", "Clay Loam"],
      pHRange: { min: 6.0, max: 7.8, optimalMin: 6.5, optimalMax: 7.2 },
      drainage: ["Good (No waterlogging)"],
      soilDepth: ["Medium (25 - 50 cm)"]
    },
    climateRequirements: {
      temperature: { minC: 12, maxC: 34, optimalMinC: 16, optimalMaxC: 28 },
      rainfall: { minMm: 350, maxMm: 650, optimalMm: 450 },
      humidity: "Moderate humidity; dry clear sunny weather during bulb curing",
      sunlight: "Intermediate day-length responsive",
      altitudeMeters: { min: 0, max: 1800 }
    },
    waterRequirements: {
      waterRequirementMm: 400,
      waterRequirementLevel: "Medium (400 - 800 mm)",
      irrigationRequirement: "Shallow fibrous root system needs frequent light irrigations; micro-sprinkler or drip recommended",
      criticalIrrigationStages: ["Establishment", "Bulb Initiation", "Bulb Development"],
      droughtTolerance: "Low",
      waterloggingSensitivity: "High"
    },
    agronomy: {
      seedRequirement: { value: 3.5, unit: "kg/acre (Nursery Raised Seedlings)", source: "ICAR-DOGR", sourceDate: "2024", dataStatus: "OFFICIAL DATA" },
      plantingMethod: "Transplanting 6-7 week old seedlings on raised beds",
      spacing: "15 cm x 10 cm",
      fertilizerRequirements: {
        rdfKgPerHa: "100:50:50 NPK kg/ha + Sulphur 30 kg/ha",
        majorNutrients: "Sulphur is crucial for allyl propyl disulphide pungency and bulb storage quality",
        micronutrients: "Zinc 15 kg/ha ZnSO4 and Borax 10 kg/ha",
        note: "Withhold irrigation 15 days before harvest and perform field curing with foliage"
      },
      majorNutrients: "N: 40 kg/acre, P2O5: 20 kg/acre, K2O: 20 kg/acre + Sulphur 12 kg/acre",
      micronutrients: "Sulphur, Zinc & Boron"
    },
    production: {
      yieldRange: { min: 70.0, max: 140.0, benchmarkAvg: 95.0, unit: "Quintal/Acre (Rabi)", source: "NHB Database", sourceDate: "2024", dataStatus: "OFFICIAL DATA" },
      unit: "Quintal/Acre"
    },
    geographic: {
      majorProducingStates: ["Maharashtra (40% share)", "Madhya Pradesh", "Karnataka", "Gujarat", "Rajasthan", "Bihar", "Andhra Pradesh"],
      majorProducingDistricts: ["Nashik", "Ahmednagar", "Pune", "Solapur", "Khandwa", "Bhavnagar", "Gadag"],
      suitableAgroClimaticZones: [6, 8, 9, 10, 11, 13]
    },
    market: {
      perishability: "Medium (Rabi onion stores 4-6 months in ventilated kanda chawl structures; Kharif onion is highly perishable: 3-4 weeks)",
      storageRequirement: "Traditional low-cost naturally ventilated onion storage structures (Kanda Chawl) with 65-70% RH",
      processingPotential: "Dehydrated Onion Flakes, Powder, Onion Paste, Pickles",
      majorConsumptionRegions: ["Pan-India primary vegetable; major export to Middle East & SE Asia"]
    },
    trade: {
      exportImportance: "High",
      importDependence: "Self-Sufficient"
    },
    government: {
      MSPApplicable: false,
      mspPrice2024_25: { value: null, unit: "INR/Quintal", source: "Price Stabilization Fund (PSF) Buffer Procurement via NAFED/NCCF", sourceDate: "2024", dataStatus: "DATA NOT CONNECTED" },
      governmentSchemeLinks: ["Operation Greens (TOP Scheme)", "PSF Buffer Stocking Scheme", "MIDH On-Farm Storage Subsidies"]
    },
    dataConfidenceScore: 96,
    dataConfidenceLevel: "High",
    sources: [OFFICIAL_CROP_SOURCES.NHB_HORTICULTURE, OFFICIAL_CROP_SOURCES.ICAR_POPR]
  },
  {
    cropId: "tomato",
    cropName: "Tomato (Tamatar)",
    scientificName: "Solanum lycopersicum",
    localNames: {
      en: "Tomato",
      hi: "टमाटर",
      kn: "ಟೊಮೇಟೊ (Tomato)",
      mr: "टोमॅटो (Tomato)",
      te: "టమోటా (Tomato)",
      ta: "தக்காளி (Thakkali)",
      bn: "টমেটো (Tomato)",
      gu: "ટામેટા (Tameta)",
      pa: "ਟਮਾਟਰ (Tamatar)",
      ml: "തക്കാളി (Thakkali)",
      or: "ବିଲାତି ବାଇଗଣ (Bilati Baigana)",
      as: "বিলতী বেগেনা (Biloti Begena)",
      ur: "ٹماٹر"
    },
    category: "Vegetables",
    subcategory: "Solanaceous Fruit Vegetable",
    season: "Multiple seasons",
    plantingWindow: "June - July (Kharif) / Oct - Nov (Rabi) / Jan - Feb (Summer)",
    harvestWindow: "Aug - Oct (Kharif) / Dec - Feb (Rabi) / March - May (Summer)",
    typicalDurationDays: 130,
    durationRangeDays: { min: 110, max: 150 },
    soilRequirements: {
      soilTypes: ["Red & Yellow Soil (Alfisols / Ultisols)", "Alluvial Soil (Entisols / Inceptisols)", "Black Cotton Soil (Vertisols)"],
      texture: ["Sandy Loam", "Clay Loam"],
      pHRange: { min: 6.0, max: 7.5, optimalMin: 6.2, optimalMax: 7.0 },
      drainage: ["Good (No waterlogging)"],
      soilDepth: ["Medium (25 - 50 cm)", "Deep (> 50 cm)"]
    },
    climateRequirements: {
      temperature: { minC: 14, maxC: 35, optimalMinC: 18, optimalMaxC: 28 },
      rainfall: { minMm: 400, maxMm: 750, optimalMm: 500 },
      humidity: "Moderate; extreme heat (>36°C) causes blossom drop and poor fruit set",
      sunlight: "Abundant sunshine",
      altitudeMeters: { min: 0, max: 2000 }
    },
    waterRequirements: {
      waterRequirementMm: 500,
      waterRequirementLevel: "Medium (400 - 800 mm)",
      irrigationRequirement: "Drip irrigation with fertigation gives 40% higher yield and reduces fruit cracking",
      criticalIrrigationStages: ["Transplanting", "Flowering", "Fruit Set", "Fruit Enlargement"],
      droughtTolerance: "Low",
      waterloggingSensitivity: "High"
    },
    agronomy: {
      seedRequirement: { value: 60, unit: "grams/acre (Indeterminate F1 Hybrid)", source: "ICAR-IIHR", sourceDate: "2024", dataStatus: "OFFICIAL DATA" },
      plantingMethod: "Transplanting 25-day pro-tray seedlings on raised beds with silver-black mulch & staking",
      spacing: "90 cm x 45 cm or 120 cm x 60 cm (Staked)",
      fertilizerRequirements: {
        rdfKgPerHa: "180:120:150 NPK kg/ha via fertigation",
        majorNutrients: "High calcium requirement to prevent Blossom End Rot (BER)",
        micronutrients: "Boron 1 kg/ha and Zinc 15 kg/ha",
        note: "Staking with trellising wire/bamboo doubles marketable yield and prevents soil-borne rot"
      },
      majorNutrients: "N: 72 kg/acre, P2O5: 48 kg/acre, K2O: 60 kg/acre + Calcium Nitrate",
      micronutrients: "Calcium, Boron & Zinc"
    },
    production: {
      yieldRange: { min: 120.0, max: 280.0, benchmarkAvg: 180.0, unit: "Quintal/Acre (Staked Hybrid)", source: "NHB Database", sourceDate: "2024", dataStatus: "OFFICIAL DATA" },
      unit: "Quintal/Acre"
    },
    geographic: {
      majorProducingStates: ["Andhra Pradesh", "Madhya Pradesh", "Karnataka", "Gujarat", "Odisha", "West Bengal", "Maharashtra", "Tamil Nadu"],
      majorProducingDistricts: ["Chittoor (Madanapalle)", "Kolar", "Nashik", "Satara", "Dharmapuri", "Jabalpur"],
      suitableAgroClimaticZones: [4, 7, 8, 9, 10, 11, 12]
    },
    market: {
      perishability: "High (Perishable: 5-10 days at ambient / 2-3 weeks at 12°C)",
      storageRequirement: "Ripening cold room at 12-15°C with 85-90% RH (avoid chilling below 10°C)",
      processingPotential: "Tomato Puree, Paste, Ketchup, Sauce, Canned Diced Tomatoes",
      majorConsumptionRegions: ["Pan-India daily staple"]
    },
    trade: {
      exportImportance: "Moderate",
      importDependence: "Self-Sufficient"
    },
    government: {
      MSPApplicable: false,
      mspPrice2024_25: { value: null, unit: "INR/Quintal", source: "Operation Greens / Market Driven", sourceDate: "2024", dataStatus: "DATA NOT CONNECTED" },
      governmentSchemeLinks: ["Operation Greens (TOP Scheme)", "MIDH Polyhouse / Drip Mulch Subsidies"]
    },
    dataConfidenceScore: 95,
    dataConfidenceLevel: "High",
    sources: [OFFICIAL_CROP_SOURCES.NHB_HORTICULTURE, OFFICIAL_CROP_SOURCES.ICAR_POPR]
  },
  {
    cropId: "chilli_dry",
    cropName: "Chilli (Dry & Green)",
    scientificName: "Capsicum annuum",
    localNames: {
      en: "Chilli / Red Pepper",
      hi: "मिर्च / लाल मिर्च",
      kn: "ಮೆಣಸಿನಕಾಯಿ (Menasinakaayi)",
      mr: "मिरची (Mirchi)",
      te: "మిరపకాయ (Mirapakaya)",
      ta: "மிளகாய் (Milagai)",
      bn: "লঙ্কা / মরিচ (Lonka / Morich)",
      gu: "મરચાં (Marcha)",
      pa: "ਮਿਰਚ (Mirch)",
      ml: "മുളക് (Mulaku)",
      or: "ଲଙ୍କା (Lanka)",
      as: "জ্বলাকীয়া (Jolokia)",
      ur: "مرچ"
    },
    category: "Spices & Condiments",
    subcategory: "Major Commercial Spice",
    season: "Multiple seasons",
    plantingWindow: "July - August (Kharif) / October - November (Rabi)",
    harvestWindow: "November - March (Multiple pickings)",
    typicalDurationDays: 160,
    durationRangeDays: { min: 140, max: 180 },
    soilRequirements: {
      soilTypes: ["Black Cotton Soil (Vertisols)", "Red & Yellow Soil (Alfisols / Ultisols)", "Alluvial Soil (Entisols / Inceptisols)"],
      texture: ["Clay Loam", "Sandy Loam"],
      pHRange: { min: 6.0, max: 8.0, optimalMin: 6.5, optimalMax: 7.5 },
      drainage: ["Good (No waterlogging)"],
      soilDepth: ["Medium (25 - 50 cm)", "Deep (> 50 cm)"]
    },
    climateRequirements: {
      temperature: { minC: 15, maxC: 38, optimalMinC: 22, optimalMaxC: 32 },
      rainfall: { minMm: 500, maxMm: 850, optimalMm: 650 },
      humidity: "Moderate humidity; dry clear sunlight for sun drying pods",
      sunlight: "Abundant sunshine",
      altitudeMeters: { min: 0, max: 1500 }
    },
    waterRequirements: {
      waterRequirementMm: 550,
      waterRequirementLevel: "Medium (400 - 800 mm)",
      irrigationRequirement: "Cannot tolerate water stagnation (causes wilt/damping off); drip irrigation highly advantageous",
      criticalIrrigationStages: ["Flowering", "Fruit Formation", "Fruit Maturity"],
      droughtTolerance: "Moderate",
      waterloggingSensitivity: "High"
    },
    agronomy: {
      seedRequirement: { value: 150, unit: "grams/acre (Hybrid) / 1 kg (OPV)", source: "Spices Board / ICAR-IIHR", sourceDate: "2024", dataStatus: "OFFICIAL DATA" },
      plantingMethod: "Transplanting 35-day seedlings on raised beds with drip lateral",
      spacing: "90 cm x 45 cm",
      fertilizerRequirements: {
        rdfKgPerHa: "150:75:75 NPK kg/ha + Neem Cake 500 kg/ha",
        majorNutrients: "High potassium enhances deep red colour (ASTA value) and capsaicin content",
        micronutrients: "Zinc, Boron & Calcium for preventing blossom end rot",
        note: "Guntur Sannam, Byadagi, Teja are world-renowned Indian commercial varieties"
      },
      majorNutrients: "N: 60 kg/acre, P2O5: 30 kg/acre, K2O: 30 kg/acre",
      micronutrients: "Potassium, Zinc & Boron"
    },
    production: {
      yieldRange: { min: 8.0, max: 20.0, benchmarkAvg: 14.0, unit: "Quintal/Acre (Dry Pods)", source: "Spices Board", sourceDate: "2024", dataStatus: "OFFICIAL DATA" },
      unit: "Quintal/Acre"
    },
    geographic: {
      majorProducingStates: ["Andhra Pradesh (Guntur)", "Telangana (Warangal/Khammam)", "Karnataka (Byadagi)", "Madhya Pradesh", "Gujarat"],
      majorProducingDistricts: ["Guntur", "Prakasam", "Khammam", "Warangal", "Haveri", "Dharwad", "Khargone (Bedian Mandi)"],
      suitableAgroClimaticZones: [7, 8, 9, 10, 11]
    },
    market: {
      perishability: "Low (Dry pods: 6-12 months / Cold storage for red color retention at 4-8°C)",
      storageRequirement: "Cold storage with 65% RH prevents darkening of dry red chillies",
      processingPotential: "Chilli Powder, Oleoresin extraction (Capsaicin / Paprika colour), Crushed Chilli flakes, Sauces",
      majorConsumptionRegions: ["Pan-India spice; India is world's #1 chilli producer, exporter and consumer"]
    },
    trade: {
      exportImportance: "High",
      importDependence: "Self-Sufficient"
    },
    government: {
      MSPApplicable: false,
      mspPrice2024_25: { value: null, unit: "INR/Quintal", source: "Commercial Commodity Market / Spices Board", sourceDate: "2024", dataStatus: "DATA NOT CONNECTED" },
      governmentSchemeLinks: ["Spices Board Export Promotion & Processing Subsidy Scheme", "MIDH"]
    },
    dataConfidenceScore: 97,
    dataConfidenceLevel: "High",
    sources: [OFFICIAL_CROP_SOURCES.SPICES_BOARD, OFFICIAL_CROP_SOURCES.ICAR_POPR]
  },
  {
    cropId: "turmeric",
    cropName: "Turmeric (Haldi)",
    scientificName: "Curcuma longa",
    localNames: {
      en: "Turmeric",
      hi: "हल्दी",
      kn: "ಅರಿಶಿನ (Arishina)",
      mr: "हळद (Halad)",
      te: "పసుపు (Pasupu)",
      ta: "மஞ்சள் (Manjal)",
      bn: "হলুদ (Holud)",
      gu: "હળદર (Haldar)",
      pa: "ਹਲਦੀ (Haldi)",
      ml: "മഞ്ഞൾ (Manjal)",
      or: "ହଳଦୀ (Haladi)",
      as: "হালধি (Halodhi)",
      ur: "ہلدی"
    },
    category: "Spices & Condiments",
    subcategory: "Rhizomatous Commercial Spice",
    season: "Kharif",
    plantingWindow: "15 May - 15 June (Pre-monsoon planting)",
    harvestWindow: "January - March",
    typicalDurationDays: 240,
    durationRangeDays: { min: 210, max: 270 },
    soilRequirements: {
      soilTypes: ["Red & Yellow Soil (Alfisols / Ultisols)", "Alluvial Soil (Entisols / Inceptisols)", "Black Cotton Soil (Vertisols)"],
      texture: ["Sandy Loam", "Clay Loam"],
      pHRange: { min: 5.5, max: 7.5, optimalMin: 6.0, optimalMax: 7.0 },
      drainage: ["Good (No waterlogging)"],
      soilDepth: ["Deep (> 50 cm)"]
    },
    climateRequirements: {
      temperature: { minC: 18, maxC: 38, optimalMinC: 24, optimalMaxC: 32 },
      rainfall: { minMm: 1200, maxMm: 2200, optimalMm: 1500 },
      humidity: "Warm and humid climate",
      sunlight: "Partial shade tolerant (often intercropped in coconut/arecanut orchards)",
      altitudeMeters: { min: 0, max: 1500 }
    },
    waterRequirements: {
      waterRequirementMm: 1200,
      waterRequirementLevel: "High (> 800 mm)",
      irrigationRequirement: "Requires 15-20 light irrigations in non-rainy periods; broad bed furrow with drip & green mulch recommended",
      criticalIrrigationStages: ["Sprouting", "Tillering", "Rhizome Initiation", "Rhizome Bulking"],
      droughtTolerance: "Low",
      waterloggingSensitivity: "High"
    },
    agronomy: {
      seedRequirement: { value: 8.0, unit: "Quintal/Acre (Mother or Finger Rhizomes)", source: "ICAR-IISR", sourceDate: "2024", dataStatus: "OFFICIAL DATA" },
      plantingMethod: "Broad Bed Furrow (BBF) raised beds with organic leaf mulching",
      spacing: "45 cm x 20 cm",
      fertilizerRequirements: {
        rdfKgPerHa: "120:60:120 NPK kg/ha + 25 tonnes FYM/ha + Neem Cake 500 kg/ha",
        majorNutrients: "High potassium and organic matter for curcumin biosynthesis (>3.5-5%)",
        micronutrients: "Zinc 25 kg/ha ZnSO4 and Borax 10 kg/ha",
        note: "Lakadong (Meghalaya), Salem, Nizamabad, Erode, Waigaon are famous cultivars"
      },
      majorNutrients: "N: 48 kg/acre, P2O5: 24 kg/acre, K2O: 48 kg/acre",
      micronutrients: "Potash (K), Zinc & Boron"
    },
    production: {
      yieldRange: { min: 20.0, max: 35.0, benchmarkAvg: 26.0, unit: "Quintal/Acre (Cured Dry Rhizomes)", source: "Spices Board", sourceDate: "2024", dataStatus: "OFFICIAL DATA" },
      unit: "Quintal/Acre"
    },
    geographic: {
      majorProducingStates: ["Telangana (Nizamabad)", "Maharashtra (Sangli/Hingoli)", "Tamil Nadu (Erode)", "Andhra Pradesh", "Odisha (Kandhamal)", "Meghalaya (Jaintia Hills)"],
      majorProducingDistricts: ["Nizamabad", "Sangli", "Hingoli", "Erode", "Duggirala (Guntur)", "Kandhamal"],
      suitableAgroClimaticZones: [2, 7, 8, 9, 10, 11, 12]
    },
    market: {
      perishability: "Low (Polished dry cured rhizomes store 1-2 years)",
      storageRequirement: "Boiled, sun-dried, and polished rhizomes stored in moisture-free godowns",
      processingPotential: "Turmeric Powder, Curcumin Extract (Pharmaceutical grade), Essential Oil, Cosmetic oleoresins",
      majorConsumptionRegions: ["Pan-India staple dietary spice, global ayurvedic/curcumin export markets"]
    },
    trade: {
      exportImportance: "High",
      importDependence: "Self-Sufficient"
    },
    government: {
      MSPApplicable: false,
      mspPrice2024_25: { value: null, unit: "INR/Quintal", source: "National Turmeric Board (Announced 2023)", sourceDate: "2024", dataStatus: "DATA NOT CONNECTED" },
      governmentSchemeLinks: ["National Turmeric Board Development Programs", "Spices Board Assistance", "MIDH"]
    },
    dataConfidenceScore: 97,
    dataConfidenceLevel: "High",
    sources: [OFFICIAL_CROP_SOURCES.SPICES_BOARD, OFFICIAL_CROP_SOURCES.ICAR_POPR]
  },
  {
    cropId: "mango",
    cropName: "Mango (Aam)",
    scientificName: "Mangifera indica",
    localNames: {
      en: "Mango",
      hi: "आम",
      kn: "ಮಾವಿನಹಣ್ಣು (Mavinahannu)",
      mr: "आंबा (Aamba)",
      te: "మామిడి (Mamidi)",
      ta: "மாம்பழம் (Mampazham)",
      bn: "আম (Aam)",
      gu: "કેરી (Keri)",
      pa: "ਅੰਬ (Amb)",
      ml: "മാങ്ങ (Manga)",
      or: "ଆମ୍ବ (Amba)",
      as: "আম (Aam)",
      ur: "آم"
    },
    category: "Fruits",
    subcategory: "Perennial King of Fruits",
    season: "Perennial",
    plantingWindow: "July - August (Monsoon Planting)",
    harvestWindow: "April - July (Annual Fruiting)",
    typicalDurationDays: 365,
    durationRangeDays: { min: 365, max: 365 },
    soilRequirements: {
      soilTypes: ["Alluvial Soil (Entisols / Inceptisols)", "Red & Yellow Soil (Alfisols / Ultisols)", "Laterite Soil (Oxisols)"],
      texture: ["Sandy Loam", "Clay Loam", "Gravelly Loam"],
      pHRange: { min: 5.5, max: 7.8, optimalMin: 6.0, optimalMax: 7.2 },
      drainage: ["Good (No waterlogging)"],
      soilDepth: ["Deep (> 50 cm)"]
    },
    climateRequirements: {
      temperature: { minC: 15, maxC: 42, optimalMinC: 24, optimalMaxC: 34 },
      rainfall: { minMm: 750, maxMm: 2000, optimalMm: 1000 },
      humidity: "Dry period before flowering triggers floral bud differentiation; rain during flowering causes anthracnose blossom blight",
      sunlight: "Full bright sunlight",
      altitudeMeters: { min: 0, max: 1200 }
    },
    waterRequirements: {
      waterRequirementMm: 900,
      waterRequirementLevel: "High (> 800 mm)",
      irrigationRequirement: "Mature bearing trees: withhold water 2-3 months before flowering, then irrigate during fruit enlargement",
      criticalIrrigationStages: ["Fruit Setting (Pea stage)", "Fruit Enlargement (Marble stage)"],
      droughtTolerance: "High",
      waterloggingSensitivity: "High"
    },
    agronomy: {
      seedRequirement: { value: 70, unit: "Grafted Plants/Acre (High Density Planting: 5m x 5m)", source: "ICAR-CISH / IIHR", sourceDate: "2024", dataStatus: "OFFICIAL DATA" },
      plantingMethod: "Epicotyl / Softwood grafted saplings in 1m x 1m x 1m pits filled with FYM, SSP and neem cake",
      spacing: "10m x 10m (Traditional: 40 trees/acre) or 5m x 5m (HDP: 160 trees/acre)",
      fertilizerRequirements: {
        rdfKgPerHa: "1000:500:1000 g NPK/tree/year for mature bearing orchard (10+ years)",
        majorNutrients: "High potassium for fruit sweetness (Brix) and shelf life",
        micronutrients: "Foliar spray of Borax (0.2%) and Zinc Sulphate (0.5%) at panicle emergence",
        note: "Alphonso, Kesar, Dasheri, Banganapalli, Totapuri, Langra, Amrapali are leading commercial varieties"
      },
      majorNutrients: "NPK per tree scaled with tree age + Paclobutrazol growth regulator for regular bearing",
      micronutrients: "Boron (B), Zinc (Zn) & Iron (Fe)"
    },
    production: {
      yieldRange: { min: 40.0, max: 100.0, benchmarkAvg: 65.0, unit: "Quintal/Acre (Mature Orchard)", source: "NHB Database", sourceDate: "2024", dataStatus: "OFFICIAL DATA" },
      unit: "Quintal/Acre"
    },
    geographic: {
      majorProducingStates: ["Uttar Pradesh", "Andhra Pradesh", "Karnataka", "Bihar", "Gujarat", "Maharashtra (Konkan)", "Tamil Nadu"],
      majorProducingDistricts: ["Ratnagiri (Alphonso)", "Junagadh (Kesar)", "Malihabad (Dasheri)", "Chittoor (Totapuri)", "Kolar"],
      suitableAgroClimaticZones: [2, 3, 4, 5, 8, 10, 11, 12]
    },
    market: {
      perishability: "High (Fresh table fruit: 7-14 days at room temperature / 3-4 weeks at 13°C cold chain)",
      storageRequirement: "Cold storage at 12-13°C with 85-90% RH; Hot Water Treatment (HWT) or Vapour Heat Treatment (VHT) for export quarantine",
      processingPotential: "Mango Pulp (Totapuri/Alphonso aseptic packing for global juice industry), Aam Papad, Pickles, RTS beverages",
      majorConsumptionRegions: ["Pan-India #1 fruit, huge fresh and pulp export to UAE, UK, USA, Europe"]
    },
    trade: {
      exportImportance: "High",
      importDependence: "Self-Sufficient"
    },
    government: {
      MSPApplicable: false,
      mspPrice2024_25: { value: null, unit: "INR/Quintal", source: "Commercial Horticulture / APEDA", sourceDate: "2024", dataStatus: "DATA NOT CONNECTED" },
      governmentSchemeLinks: ["MIDH Orchard Establishment Subsidy", "APEDA Fresh Fruit Export Assistance", "PMKSY Drip Subsidies"]
    },
    dataConfidenceScore: 97,
    dataConfidenceLevel: "High",
    sources: [OFFICIAL_CROP_SOURCES.NHB_HORTICULTURE, OFFICIAL_CROP_SOURCES.ICAR_POPR]
  },
  {
    cropId: "banana",
    cropName: "Banana (Kela)",
    scientificName: "Musa acuminata / paradisiaca",
    localNames: {
      en: "Banana",
      hi: "केला",
      kn: "ಬಾಳೆಹಣ್ಣು (Baale Hannu)",
      mr: "केळी (Keli)",
      te: "అరటిపండు (Aratipandu)",
      ta: "வாழைப்பழம் (Vazhaipazham)",
      bn: "কলা (Kôla)",
      gu: "કેળાં (Kela)",
      pa: "ਕੇਲਾ (Kela)",
      ml: "വാഴപ്പഴം (Vazhappazham)",
      or: "କଦଳୀ (Kadali)",
      as: "কল (Kol)",
      ur: "کیلا"
    },
    category: "Fruits",
    subcategory: "High-Yielding Commercial Fruit",
    season: "Annual / Commercial",
    plantingWindow: "June - July or September - October or February - March",
    harvestWindow: "10-12 months after planting",
    typicalDurationDays: 330,
    durationRangeDays: { min: 300, max: 360 },
    soilRequirements: {
      soilTypes: ["Alluvial Soil (Entisols / Inceptisols)", "Black Cotton Soil (Vertisols)", "Red & Yellow Soil (Alfisols / Ultisols)"],
      texture: ["Clay Loam", "Silty Loam", "Sandy Loam"],
      pHRange: { min: 6.0, max: 7.8, optimalMin: 6.5, optimalMax: 7.5 },
      drainage: ["Good (No waterlogging)"],
      soilDepth: ["Deep (> 50 cm)"]
    },
    climateRequirements: {
      temperature: { minC: 15, maxC: 38, optimalMinC: 22, optimalMaxC: 32 },
      rainfall: { minMm: 1200, maxMm: 2500, optimalMm: 1800 },
      humidity: "High relative humidity (75-85%)",
      sunlight: "Warm humid tropical climate without severe frost or hot desiccating winds",
      altitudeMeters: { min: 0, max: 1200 }
    },
    waterRequirements: {
      waterRequirementMm: 1500,
      waterRequirementLevel: "High (> 800 mm)",
      irrigationRequirement: "Heavy water feeder; drip irrigation with fertigation (15-20 litres/plant/day) saves 45% water and maximizes bunch weight",
      criticalIrrigationStages: ["Shooting / Inflorescence Emergence", "Bunch Development"],
      droughtTolerance: "Low",
      waterloggingSensitivity: "High"
    },
    agronomy: {
      seedRequirement: { value: 1200, unit: "Tissue Culture Plants/Acre (Grand Naine)", source: "ICAR-NRCB", sourceDate: "2024", dataStatus: "OFFICIAL DATA" },
      plantingMethod: "Tissue culture saplings planted on raised beds or flat land with paired row drip",
      spacing: "1.8m x 1.5m (1450 plants/ha or ~1200 plants/acre)",
      fertilizerRequirements: {
        rdfKgPerHa: "200:50:300 g NPK/plant via scheduled weekly fertigation",
        majorNutrients: "Enormous potassium requirement for fruit filling, finger size and bunch weight (>25-35 kg/bunch)",
        micronutrients: "Zinc, Boron & Magnesium sulphate foliar sprays",
        note: "Bunch bagging with non-woven polypropylene covers protects fingers from thrips and sun scorch"
      },
      majorNutrients: "N: 240 kg/acre, P2O5: 60 kg/acre, K2O: 360 kg/acre via drip",
      micronutrients: "Potash (K), Magnesium & Zinc"
    },
    production: {
      yieldRange: { min: 250.0, max: 450.0, benchmarkAvg: 320.0, unit: "Quintal/Acre (25-35 kg bunch avg)", source: "NHB Database", sourceDate: "2024", dataStatus: "OFFICIAL DATA" },
      unit: "Quintal/Acre"
    },
    geographic: {
      majorProducingStates: ["Andhra Pradesh (Kadapa/Anantapur)", "Maharashtra (Jalgaon)", "Gujarat", "Tamil Nadu (Theni)", "Karnataka", "Uttar Pradesh", "Bihar"],
      majorProducingDistricts: ["Jalgaon (Banana City)", "Kadapa", "Anantapur", "Theni", "Tiruchirappalli", "Narmada", "Barabanki"],
      suitableAgroClimaticZones: [2, 4, 7, 8, 9, 10, 11, 12, 13]
    },
    market: {
      perishability: "High (Climacteric fruit: green bananas store 3-4 weeks at 13.5°C; ripe bananas 3-5 days)",
      storageRequirement: "Ripening chambers with ethylene gas (100 ppm) at 16-18°C temperature control",
      processingPotential: "Banana Chips, Banana Puree, Baby food, Flour, Pseudostem fibre textile, Bio-fertilizer from sap",
      majorConsumptionRegions: ["Pan-India top-consumed fruit year-round; expanding export to Middle East"]
    },
    trade: {
      exportImportance: "High",
      importDependence: "Self-Sufficient"
    },
    government: {
      MSPApplicable: false,
      mspPrice2024_25: { value: null, unit: "INR/Quintal", source: "Commercial Horticulture / APEDA", sourceDate: "2024", dataStatus: "DATA NOT CONNECTED" },
      governmentSchemeLinks: ["MIDH Tissue Culture Plant Subsidies", "PMKSY Drip Irrigation Subsidies", "APEDA Export Infrastructure"]
    },
    dataConfidenceScore: 98,
    dataConfidenceLevel: "High",
    sources: [OFFICIAL_CROP_SOURCES.NHB_HORTICULTURE, OFFICIAL_CROP_SOURCES.ICAR_POPR]
  },
  // ==========================================
  // CARROT (GAJAR)
  // ==========================================
  {
    cropId: "carrot",
    cropName: "Carrot (Gajar)",
    displayName: "Carrot",
    officialCommodityName: "Carrot",
    commodityGroup: "Vegetables",
    aliases: ["carrot", "gajar", "gajjari", "mangalkosu"],
    isVegetable: true,
    scientificName: "Daucus carota subsp. sativus",
    localNames: {
      en: "Carrot",
      hi: "गाजर",
      kn: "ಕ್ಯಾರೆಟ್ / ಗಜ್ಜರಿ (Carrot / Gajjari)",
      mr: "गाजर (Gaajar)",
      te: "క్యారెట్ (Carrot)",
      ta: "கேரட் (Carrot)",
      bn: "গাজর (Gajor)",
      gu: "ગાજર (Gajar)",
      pa: "ਗਾਜਰ (Gajar)",
      ml: "കാരറ്റ് (Carrot)",
      or: "ଗାଜର (Gajara)",
      as: "গাজৰ (Gazor)",
      ur: "گاجر"
    },
    category: "Vegetables",
    subcategory: "Root Vegetable",
    season: "Rabi",
    plantingWindow: "August - November (Plains) / March - July (Hills/Nilgiris)",
    harvestWindow: "November - March (Plains) / June - October (Hills)",
    typicalDurationDays: 85,
    durationRangeDays: { min: 75, max: 100 },
    soilRequirements: {
      soilTypes: ["Alluvial Soil (Entisols / Inceptisols)", "Red & Yellow Soil (Alfisols / Ultisols)"],
      texture: ["Deep Sandy Loam", "Loose Silty Loam without stones/clods"],
      pHRange: { min: 5.8, max: 7.2, optimalMin: 6.0, optimalMax: 6.8 },
      drainage: ["Excellent (Free drainage essential to avoid root rot and forking)"],
      soilDepth: ["Deep (> 40 cm)"]
    },
    climateRequirements: {
      temperature: { minC: 10, maxC: 26, optimalMinC: 15, optimalMaxC: 20 },
      rainfall: { minMm: 400, maxMm: 700, optimalMm: 500 },
      humidity: "Moderate; high humidity increases leaf blight incidence",
      sunlight: "Full sun; deep root color synthesis occurs optimally at 15-20°C",
      altitudeMeters: { min: 100, max: 2600 }
    },
    waterRequirements: {
      waterRequirementMm: 400,
      waterRequirementLevel: "Medium (400 - 800 mm)",
      irrigationRequirement: "Regular light irrigation (every 6-8 days) to keep soil moist; avoid sudden heavy watering which causes root splitting",
      criticalIrrigationStages: ["Germination & Emergence", "Root Enlargement / Tuber Growth"],
      droughtTolerance: "Low",
      waterloggingSensitivity: "High"
    },
    agronomy: {
      seedRequirement: { value: 3.5, unit: "Kg/Acre (European/Asiatic varieties)", source: "ICAR-IARI", sourceDate: "2024", dataStatus: "OFFICIAL DATA" },
      plantingMethod: "Direct seeding on raised ridges/beds (spaced 30-45 cm apart)",
      spacing: "30 cm x 8-10 cm",
      fertilizerRequirements: {
        rdfKgPerHa: "100:50:80 NPK kg/ha + 20-25 tonnes FYM",
        majorNutrients: "Moderate Nitrogen with high Potash for uniform root development and beta-carotene synthesis",
        micronutrients: "Boron (0.1% spray) to prevent core rot and cavity spots",
        note: "Avoid fresh un-decomposed manure which causes root forking and secondary root proliferation"
      },
      majorNutrients: "N: 40 kg/acre, P2O5: 20 kg/acre, K2O: 32 kg/acre",
      micronutrients: "Boron, Zinc"
    },
    production: {
      yieldRange: { min: 100.0, max: 180.0, benchmarkAvg: 130.0, unit: "Quintal/Acre", source: "NHB Database", sourceDate: "2024", dataStatus: "OFFICIAL DATA" },
      unit: "Quintal/Acre"
    },
    geographic: {
      majorProducingStates: ["Karnataka (Kolar, Belagavi, Nilgiri border)", "Punjab", "Haryana", "Uttar Pradesh", "Tamil Nadu (Nilgiris/Ooty)", "Maharashtra", "Madhya Pradesh"],
      majorProducingDistricts: ["Kolar", "Belagavi", "Nilgiris (Ooty Carrot)", "Hoshiarpur", "Sonipat", "Pune", "Nashik", "Indore"],
      suitableAgroClimaticZones: [1, 2, 3, 5, 6, 9, 10, 12, 14]
    },
    market: {
      perishability: "High (Fresh roots 4-7 days ambient; 2-4 months in cold storage at 0-1°C, 95% RH)",
      storageRequirement: "Hydrocooling and cold storage at 0°C with 95-98% relative humidity",
      processingPotential: "Carrot Juice, Puree, Shredded dehydrated carrot, Canned carrot, Gajar Halwa RTE packs",
      majorConsumptionRegions: ["High pan-India consumption; major wholesale terminals in Bengaluru, Mumbai, Delhi NCR, Pune, Kolkata"]
    },
    trade: {
      exportImportance: "Moderate",
      importDependence: "Self-Sufficient"
    },
    government: {
      MSPApplicable: false,
      mspPrice2024_25: { value: null, unit: "INR/Quintal", source: "Commercial Vegetable / MIDH", sourceDate: "2024", dataStatus: "DATA NOT CONNECTED" },
      governmentSchemeLinks: ["MIDH Horticulture Mission", "PMKSY Drip & Micro-Irrigation", "Operation Greens Long-Term Infrastructure"]
    },
    dataConfidenceScore: 96,
    dataConfidenceLevel: "High",
    sources: [OFFICIAL_CROP_SOURCES.NHB_HORTICULTURE, OFFICIAL_CROP_SOURCES.ICAR_POPR]
  },
  // ==========================================
  // CABBAGE (PATTAGOBHI)
  // ==========================================
  {
    cropId: "cabbage",
    cropName: "Cabbage (Pattagobhi)",
    displayName: "Cabbage",
    officialCommodityName: "Cabbage",
    commodityGroup: "Vegetables",
    aliases: ["cabbage", "patta gobhi", "band gobhi", "yelekosu", "muttaikose"],
    isVegetable: true,
    scientificName: "Brassica oleracea var. capitata",
    localNames: {
      en: "Cabbage",
      hi: "पत्तागोभी / बंदगोभी",
      kn: "ಎಲೆಕೋಸು (Yelekosu)",
      mr: "कोबी (Kobi)",
      te: "క్యాబేజీ (Cabbage)",
      ta: "முட்டைக்கோஸ் (Muttaikose)",
      bn: "বাঁಧাকপি (Badhakopi)",
      gu: "કોબીજ (Kobij)",
      pa: "ਬੰਦਗੋਭੀ (Bandgobhi)",
      ml: "കാബേജ് (Cabbage)",
      or: "ବନ୍ଧାକୋବି (Bandhakobi)",
      as: "বন্ধাকবি (Bandhakobi)",
      ur: "بند گوبھی"
    },
    category: "Vegetables",
    subcategory: "Cole Crop",
    season: "Rabi",
    plantingWindow: "September - November (Plains) / Year-round (Plateaus & Hills)",
    harvestWindow: "December - March",
    typicalDurationDays: 80,
    durationRangeDays: { min: 70, max: 95 },
    soilRequirements: {
      soilTypes: ["Alluvial Soil (Entisols / Inceptisols)", "Black Cotton Soil (Vertisols)"],
      texture: ["Well-drained Loam"],
      pHRange: { min: 6.0, max: 7.5, optimalMin: 6.2, optimalMax: 6.8 },
      drainage: ["Good (No waterlogging)"],
      soilDepth: ["Medium (25 - 50 cm)"]
    },
    climateRequirements: {
      temperature: { minC: 8, maxC: 28, optimalMinC: 15, optimalMaxC: 20 },
      rainfall: { minMm: 450, maxMm: 800, optimalMm: 550 },
      humidity: "Moderate to high",
      sunlight: "Sunny cool weather favoring solid head formation",
      altitudeMeters: { min: 50, max: 2400 }
    },
    waterRequirements: {
      waterRequirementMm: 450,
      waterRequirementLevel: "Medium (400 - 800 mm)",
      irrigationRequirement: "Frequent light irrigations; continuous moisture prevents head bursting",
      criticalIrrigationStages: ["Head Formation", "Head Enlargement"],
      droughtTolerance: "Low",
      waterloggingSensitivity: "High"
    },
    agronomy: {
      seedRequirement: { value: 150, unit: "Grams/Acre (Hybrid seeds)", source: "ICAR-IIHR", sourceDate: "2024", dataStatus: "OFFICIAL DATA" },
      plantingMethod: "Transplanting 25-day nursery seedlings onto ridges or raised beds",
      spacing: "45 cm x 45 cm",
      fertilizerRequirements: {
        rdfKgPerHa: "120:60:60 NPK kg/ha",
        majorNutrients: "High Nitrogen & Potash for solid head density",
        micronutrients: "Molybdenum and Boron to prevent whiptail and hollow stem",
        note: "Apply well-decomposed FYM @ 10-15 tonnes/acre during field preparation"
      },
      majorNutrients: "N: 48 kg/acre, P2O5: 24 kg/acre, K2O: 24 kg/acre",
      micronutrients: "Boron, Molybdenum"
    },
    production: {
      yieldRange: { min: 120.0, max: 220.0, benchmarkAvg: 160.0, unit: "Quintal/Acre", source: "NHB Database", sourceDate: "2024", dataStatus: "OFFICIAL DATA" },
      unit: "Quintal/Acre"
    },
    geographic: {
      majorProducingStates: ["West Bengal", "Odisha", "Gujarat", "Karnataka (Belagavi, Kolar)", "Maharashtra (Pune, Nashik)", "Madhya Pradesh", "Bihar"],
      majorProducingDistricts: ["Belagavi", "Kolar", "Pune", "Nashik", "Indore", "Hooghly"],
      suitableAgroClimaticZones: [2, 3, 5, 7, 9, 10, 12, 14]
    },
    market: {
      perishability: "Moderate (1-2 weeks ambient; 4-6 weeks at 0-2°C, 95% RH)",
      storageRequirement: "Cold storage with high relative humidity",
      processingPotential: "Sauerkraut, Dehydrated cabbage shreds, RTE salads",
      majorConsumptionRegions: ["Pan-India staple"]
    },
    trade: {
      exportImportance: "Low",
      importDependence: "Self-Sufficient"
    },
    government: {
      MSPApplicable: false,
      mspPrice2024_25: { value: null, unit: "INR/Quintal", source: "Commercial Vegetable", sourceDate: "2024", dataStatus: "DATA NOT CONNECTED" },
      governmentSchemeLinks: ["MIDH Mission for Integrated Development of Horticulture"]
    },
    dataConfidenceScore: 95,
    dataConfidenceLevel: "High",
    sources: [OFFICIAL_CROP_SOURCES.NHB_HORTICULTURE]
  },
  // ==========================================
  // CAULIFLOWER (PHOOL GOBHI)
  // ==========================================
  {
    cropId: "cauliflower",
    cropName: "Cauliflower (Phool Gobhi)",
    displayName: "Cauliflower",
    officialCommodityName: "Cauliflower",
    commodityGroup: "Vegetables",
    aliases: ["cauliflower", "phool gobhi", "gobhi", "huvukosu", "kaaliflavar"],
    isVegetable: true,
    scientificName: "Brassica oleracea var. botrytis",
    localNames: {
      en: "Cauliflower",
      hi: "फूलगोभी",
      kn: "ಹೂಕೋಸು (Huvukosu)",
      mr: "फ्लॉवर (Flower)",
      te: "క్యాలీఫ్లవర్ (Cauliflower)",
      ta: "காலிஃபிளவர் (Cauliflower)",
      bn: "ফুলকপি (Phulkopi)",
      gu: "ફૂલેવર (Fulewar)",
      pa: "ਫੁੱਲਗੋਭੀ (Phullgobhi)",
      ml: "കോളിഫ്ലവർ (Cauliflower)",
      or: "ଫୁଲକୋବି (Phulakobi)",
      as: "ফুলকবি (Phulkobi)",
      ur: "پھول گوبھی"
    },
    category: "Vegetables",
    subcategory: "Cole Crop",
    season: "Rabi",
    plantingWindow: "July - November (depending on early/mid/late cultivar)",
    harvestWindow: "October - February",
    typicalDurationDays: 80,
    durationRangeDays: { min: 65, max: 95 },
    soilRequirements: {
      soilTypes: ["Alluvial Soil (Entisols / Inceptisols)", "Red & Yellow Soil (Alfisols / Ultisols)"],
      texture: ["Rich Sandy Loam"],
      pHRange: { min: 5.5, max: 7.2, optimalMin: 6.0, optimalMax: 6.8 },
      drainage: ["Good (No waterlogging)"],
      soilDepth: ["Medium (25 - 50 cm)"]
    },
    climateRequirements: {
      temperature: { minC: 10, maxC: 28, optimalMinC: 15, optimalMaxC: 20 },
      rainfall: { minMm: 400, maxMm: 750, optimalMm: 500 },
      humidity: "Moderate",
      sunlight: "Curd development requires cool weather and protection from direct harsh sun (blanching)",
      altitudeMeters: { min: 50, max: 2200 }
    },
    waterRequirements: {
      waterRequirementMm: 450,
      waterRequirementLevel: "Medium (400 - 800 mm)",
      irrigationRequirement: "Regular light irrigations every 5-7 days; water stress causes buttoning and loose curds",
      criticalIrrigationStages: ["Curd Initiation", "Curd Development"],
      droughtTolerance: "Low",
      waterloggingSensitivity: "High"
    },
    agronomy: {
      seedRequirement: { value: 120, unit: "Grams/Acre (Hybrid)", source: "ICAR-IARI", sourceDate: "2024", dataStatus: "OFFICIAL DATA" },
      plantingMethod: "Transplanting 30-day seedlings",
      spacing: "45 cm x 45 cm or 60 cm x 45 cm",
      fertilizerRequirements: {
        rdfKgPerHa: "120:60:60 NPK kg/ha",
        majorNutrients: "Balanced NPK",
        micronutrients: "Boron (10-15 kg/ha borax) to prevent brown rot / browning, Molybdenum to prevent whiptail",
        note: "Incorporate organic matter before transplanting to ensure steady moisture"
      },
      majorNutrients: "N: 48 kg/acre, P2O5: 24 kg/acre, K2O: 24 kg/acre",
      micronutrients: "Boron, Molybdenum"
    },
    production: {
      yieldRange: { min: 100.0, max: 180.0, benchmarkAvg: 140.0, unit: "Quintal/Acre", source: "NHB Database", sourceDate: "2024", dataStatus: "OFFICIAL DATA" },
      unit: "Quintal/Acre"
    },
    geographic: {
      majorProducingStates: ["Bihar", "West Bengal", "Madhya Pradesh", "Karnataka (Belagavi, Kolar)", "Maharashtra (Pune, Nashik)", "Punjab", "Haryana"],
      majorProducingDistricts: ["Belagavi", "Kolar", "Pune", "Nashik", "Indore", "Patna", "Jalandhar"],
      suitableAgroClimaticZones: [2, 3, 4, 5, 6, 9, 10, 12, 14]
    },
    market: {
      perishability: "High (Curds yellow and rot in 3-5 days ambient; 2-3 weeks at 0°C, 95% RH)",
      storageRequirement: "Immediate cold chain storage",
      processingPotential: "Frozen florets, Dehydrated florets, Pickling",
      majorConsumptionRegions: ["Pan-India major vegetable"]
    },
    trade: {
      exportImportance: "Low",
      importDependence: "Self-Sufficient"
    },
    government: {
      MSPApplicable: false,
      mspPrice2024_25: { value: null, unit: "INR/Quintal", source: "Commercial Vegetable", sourceDate: "2024", dataStatus: "DATA NOT CONNECTED" },
      governmentSchemeLinks: ["MIDH Horticulture Mission"]
    },
    dataConfidenceScore: 95,
    dataConfidenceLevel: "High",
    sources: [OFFICIAL_CROP_SOURCES.NHB_HORTICULTURE]
  }
];

