import {
  CalculationEnginePayload,
  CalculationEngineResult,
  CropDefinition,
  CropEvaluation,
  MandiPriceRecord,
  ProfitabilityScenario,
  FertilizerPlan,
  SupplyDemandBalance,
  DataMetadata,
  FarmLocation,
  CropMasterRecord,
  SoilOrder,
  ThreeTierRecommendationVerdict
} from '../types';
import { 
  MASTER_CROPS, 
  APMC_MANDI_RECORDS, 
  SUPPLY_DEMAND_BALANCES, 
  CACP_METADATA_2024_25,
  AGMARKNET_METADATA
} from '../data/officialData';
import { COMPLETE_INDIA_CROP_MASTER, getCropById } from '../data/cropMasterIndex';
import { evaluateCropSuitability } from './cropSuitabilityEngine';
import { safeNumber, safeDivide, safeRound, safeArray, safeString } from '../utils/safeArithmetic';

/**
 * Converts a CropMasterRecord to standard CropDefinition for the calculation engine
 */
function convertMasterRecordToCropDefinition(record: CropMasterRecord): CropDefinition {
  const cleanCategory = record.category === 'Millets (Shree Anna)' ? 'Millets (Shree Anna)' :
    record.category === 'Cereals' ? 'Cereals' :
    record.category === 'Pulses' ? 'Pulses' :
    record.category === 'Oilseeds' ? 'Oilseeds' :
    record.category === 'Fibre Crops' || record.category === 'Sugar & Commercial Crops' ? 'Commercial & Fibres' :
    'Vegetables & Spices';

  const defaultSoil: SoilOrder[] = [
    'Alluvial Soil (Entisols / Inceptisols)',
    'Black Cotton Soil (Vertisols)'
  ];

  const msp24 = record.government?.mspPrice2024_25?.value || 0;
  const msp23 = record.government?.mspPrice2023_24?.value || 0;
  const a2fl = record.government?.cacpCostA2FL?.value || 2900;
  const c2 = record.government?.cacpCostC2?.value || 3800;

  const seedReqVal = typeof record.agronomy?.seedRequirement?.value === 'number' 
    ? record.agronomy.seedRequirement.value 
    : 20;

  return {
    id: record.cropId,
    name: record.cropName,
    hindiName: record.localNames?.hi || record.cropName,
    botanicalName: record.scientificName || '',
    category: cleanCategory,
    season: record.season,
    durationDays: record.typicalDurationDays || (record.durationRangeDays ? Math.round((record.durationRangeDays.min + record.durationRangeDays.max) / 2) : 100),
    sowingWindow: record.plantingWindow || 'Standard Sowing Season',
    harvestWindow: record.harvestWindow || 'Standard Harvest Season',
    waterRequirementMm: record.waterRequirements?.waterRequirementMm || 500,
    optimalSoil: (record.soilRequirements?.soilTypes || defaultSoil) as SoilOrder[],
    optimalPhMin: record.soilRequirements?.pHRange?.min || 6.0,
    optimalPhMax: record.soilRequirements?.pHRange?.max || 8.0,
    tempMinC: record.climateRequirements?.temperature?.optimalMinC || record.climateRequirements?.temperature?.minC || 18,
    tempMaxC: record.climateRequirements?.temperature?.optimalMaxC || record.climateRequirements?.temperature?.maxC || 34,
    seedRateKgPerAcre: seedReqVal,
    avgYieldQuintalPerAcre: record.production?.yieldRange?.benchmarkAvg || 12,
    yieldRangeQuintalPerAcre: {
      min: record.production?.yieldRange?.min || 8,
      max: record.production?.yieldRange?.max || 20
    },
    cacpCostPerQuintalA2: Math.round(a2fl * 0.72),
    cacpCostPerQuintalA2FL: a2fl,
    cacpCostPerQuintalC2: c2,
    mspNotified: Boolean(record.government?.MSPApplicable),
    mspPrice2024_25: msp24,
    mspPrice2023_24: msp23,
    mspCostA2FLBenchmark: a2fl,
    pmfbyInsurancePremiumRatePercent: (record.category === 'Sugar & Commercial Crops' || record.category === 'Vegetables' || record.category === 'Fruits' || record.category === 'Spices & Condiments') ? 5.0 : 2.0,
    riskFactors: {
      droughtSensitivity: record.riskFactors?.droughtSensitivity || 'Medium',
      waterloggingSensitivity: record.riskFactors?.waterloggingSensitivity || 'Medium',
      priceVolatilityRisk: record.riskFactors?.priceVolatilityRisk || 'Medium',
      pestDiseaseRisk: record.riskFactors?.pestDiseaseRisk || 'Medium',
      storagePerishability: (record.category === 'Vegetables' || record.category === 'Fruits') ? 'High (Perishable)' : 'Low (Grain/Pulse)'
    },
    metadata: CACP_METADATA_2024_25
  };
}

/**
 * Calculates customized fertilizer dosage based on crop requirements and Soil Health Card
 */
function calculateFertilizerPlan(crop: CropDefinition, soilPh: number = 7.0, nitrogenStatus: string = 'Medium', phosphorusStatus: string = 'Medium', potassiumStatus: string = 'Medium'): FertilizerPlan {
  // Baseline ICAR / State Agriculture University Package of Practices
  let ureaBags = 2.0;
  let dapBags = 1.0;
  let mopBags = 0.8;
  let zincKg = 5.0;

  const category = crop?.category || 'Cereals';

  if (category === 'Cereals') {
    ureaBags = 2.8;
    dapBags = 1.2;
    mopBags = 0.8;
  } else if (category === 'Pulses') {
    // Legumes fix atmospheric nitrogen -> lower urea, higher phosphorus
    ureaBags = 0.8;
    dapBags = 1.5;
    mopBags = 0.6;
  } else if (category === 'Oilseeds') {
    ureaBags = 1.5;
    dapBags = 1.2;
    mopBags = 1.0;
    zincKg = 8.0; // Sulphur & Zinc critical for oil content
  } else if (category === 'Commercial & Fibres') {
    if (crop?.id === 'sugarcane') {
      ureaBags = 6.0;
      dapBags = 2.5;
      mopBags = 2.0;
    } else {
      // Cotton
      ureaBags = 3.2;
      dapBags = 1.5;
      mopBags = 1.2;
    }
  } else if (category === 'Vegetables & Spices') {
    ureaBags = 3.0;
    dapBags = 2.0;
    mopBags = 1.5;
  }

  // Adjust for Soil Health Card status
  const nStat = String(nitrogenStatus || 'Medium');
  const pStat = String(phosphorusStatus || 'Medium');
  const kStat = String(potassiumStatus || 'Medium');

  if (nStat.includes('Low')) ureaBags *= 1.25;
  if (nStat.includes('High')) ureaBags *= 0.75;
  if (pStat.includes('Low')) dapBags *= 1.25;
  if (pStat.includes('High')) dapBags *= 0.8;
  if (kStat.includes('Low')) mopBags *= 1.25;
  if (kStat.includes('High')) mopBags *= 0.8;

  // Rounding
  ureaBags = safeRound(ureaBags, 1, 2.0);
  dapBags = safeRound(dapBags, 1, 1.0);
  mopBags = safeRound(mopBags, 1, 0.8);

  // Subsidized retail prices (Govt. of India notified ceiling rates: Urea ~ Rs 266.50/45kg bag, DAP ~ Rs 1350/50kg bag, MOP ~ Rs 1650/50kg bag)
  const fertilizerCost = Math.round(
    (ureaBags * 266.5) + (dapBags * 1350) + (mopBags * 1650) + (zincKg * 60)
  );

  return {
    ureaBagsPerAcre: ureaBags,
    dapBagsPerAcre: dapBags,
    mopBagsPerAcre: mopBags,
    sspBagsPerAcre: safeRound(dapBags * 2.5, 1, 2.5),
    zincSulphateKgPerAcre: zincKg,
    organicCompostTonnesPerAcre: 2.0,
    totalFertilizerCostPerAcre: fertilizerCost,
    subsidizedRateNote: "Costs calculated using official subsidized MRPs (Urea Rs 266.50/45kg, DAP Rs 1,350/50kg under NBS subsidy).",
    schedule: [
      {
        stage: "Basal Application (At Sowing / Seedbed Preparation)",
        dayRange: "Day 0",
        application: `Full dose of DAP (${dapBags} bags) + Full dose of MOP (${mopBags} bags) + 25% Urea (${(ureaBags * 0.25).toFixed(1)} bags) + Zinc Sulphate (${zincKg} kg) mixed with 2 tonnes Well-Decomposed Farmyard Manure (FYM).`,
        nutrientsSupplied: "N-P-K (Basal) + Zinc + Organic Matter",
        precautions: "Do not mix Urea directly with DAP in high moisture. Incorporate 5-7 cm below seed depth."
      },
      {
        stage: "First Top-Dressing (Active Vegetative / Tillering Stage)",
        dayRange: "Day 25 - 35",
        application: `50% Neem-Coated Urea (${(ureaBags * 0.5).toFixed(1)} bags/acre).`,
        nutrientsSupplied: "Nitrogen (N) for rapid biomass & tillering",
        precautions: "Apply under optimum soil moisture (after irrigation or light rain). Avoid broadcasting before heavy rainfall."
      },
      {
        stage: "Second Top-Dressing (Flowering / Pre-Panicle Initiation)",
        dayRange: "Day 50 - 65",
        application: `Remaining 25% Neem-Coated Urea (${(ureaBags * 0.25).toFixed(1)} bags/acre). For oilseeds/pulses, consider 19:19:19 or 0:52:34 water-soluble foliar spray at 1%.`,
        nutrientsSupplied: "Nitrogen (N) + Micronutrients",
        precautions: "Apply during morning or late afternoon to prevent foliar scorching."
      }
    ],
    metadata: {
      status: 'LATEST_AVAILABLE',
      source: 'ICAR-Indian Institute of Soil Science & State Agriculture University Package of Practices',
      date: 'NBS Fertilizer Norms 2024-25',
      disclaimer: 'Actual dosage should be customized based on an official laboratory Soil Health Card test report.'
    }
  };
}

/**
 * Finds best APMC Mandi for a given crop and farm location
 */
function findBestMandi(crop: CropDefinition, userDistrict: string = 'Local District', userState: string = 'State'): MandiPriceRecord {
  const cropId = crop?.id || 'crop';
  const cropName = crop?.name || 'Crop';
  const uDist = userDistrict || 'Local District';
  const uState = userState || 'State';

  // Filter for matching crop in official records
  const mandisForCrop = (APMC_MANDI_RECORDS || []).filter(m => m && m.cropId === cropId);

  if (mandisForCrop.length > 0) {
    // If there's a mandi in the same district or state, prefer it; otherwise pick the highest modal price
    const localMandi = mandisForCrop.find(m => 
      (m.district && m.district.toLowerCase() === uDist.toLowerCase()) || 
      (m.state && m.state.toLowerCase() === uState.toLowerCase())
    );
    if (localMandi) return localMandi;

    // Return the one with highest modal price
    return mandisForCrop.reduce((prev, curr) => ((curr.modalPricePerQuintal || 0) > (prev.modalPricePerQuintal || 0) ? curr : prev), mandisForCrop[0]);
  }

  // If no official APMC market record exists for this crop, do NOT fabricate data
  return {
    mandiId: `mandi_${cropId}_official_unavailable`,
    mandiName: `${uDist} APMC`,
    district: uDist,
    state: uState,
    cropId: cropId,
    cropName: cropName,
    distanceKm: null,
    minPricePerQuintal: null,
    maxPricePerQuintal: null,
    modalPricePerQuintal: crop?.mspPrice2024_25 || null,
    dailyArrivalsTonnes: null,
    arrivalTrend: "Stable",
    freightCostPerKmPerQuintal: null,
    hamaliChargesPerQuintal: null,
    mandiCessPercent: 1.5,
    netRealizationPerQuintal: null,
    date: "Official Data Awaiting Daily Bulletin",
    source: "AGMARKNET — Directorate of Marketing & Inspection, MoA&FW",
    dataset: "Daily APMC Wholesale Market Rates & Arrivals Bulletin",
    dataStatus: "DATA UNAVAILABLE",
    metadata: AGMARKNET_METADATA
  };
}

/**
 * Executes the complete FARMFIT 16-variable multi-criteria agricultural decision calculation
 */
export function runFarmfitEngine(payload: CalculationEnginePayload): CalculationEngineResult {
  const farmerProfile = payload.farmerProfile || (payload as any).profile || {
    name: 'Farmer',
    mobileNumber: '',
    experienceYears: 10,
    farmerType: 'Small (1 - 2 Ha / 2.5 - 5 Acres)' as const,
    riskAppetite: 'Moderate (Balanced Cash & Food Crops)' as const,
    workingCapitalBudget: 150000,
    hasKisanCreditCard: true,
    kccLimitRupees: 200000,
    kccOutstandingRupees: 0,
    pmKisanRegistered: true,
    storageFacilityAvailable: false,
    farmMachineryOwned: ['Tractor (Basic)']
  };

  const location: FarmLocation = payload.location || payload.farmLocation || {
    state: 'Maharashtra',
    district: 'Nagpur',
    agroClimaticZoneId: 7,
    agroClimaticZoneName: 'Eastern Plateau and Hills',
    normalAnnualRainfallMm: 1100,
    altitudeMeters: 310,
    metadata: {
      status: 'LATEST_AVAILABLE',
      source: 'ICAR / Planning Commission 15 Agro-Climatic Zones',
      date: '2024'
    }
  };

  const rawLand = payload.landAndIrrigation || (payload as any).land || {};
  const landAndIrrigation = {
    totalLandAcres: safeNumber(rawLand.totalLandAcres, 5),
    plannedLandAllocationAcres: safeNumber(rawLand.plannedLandAllocationAcres, 3),
    landTenureType: rawLand.landTenureType || ('Owner Cultivated' as const),
    soilTopography: rawLand.soilTopography || ('Flat Plain (< 2% slope)' as const),
    drainageCapacity: rawLand.drainageCapacity || ('Moderate (Well drained)' as const),
    primaryWaterSource: rawLand.primaryWaterSource || ('Open Dug Well / Borewell' as const),
    irrigationMethod: rawLand.irrigationMethod || ('Drip Irrigation' as const),
    irrigatedAreaAcres: safeNumber(rawLand.irrigatedAreaAcres, 4),
    rainfedAreaAcres: safeNumber(rawLand.rainfedAreaAcres, 1),
    dailyWaterAvailabilityHours: safeNumber(rawLand.dailyWaterAvailabilityHours, 6),
    waterSourceSalinity: rawLand.waterSourceSalinity || ('Good Quality (Freshwater)' as const),
    waterAvailabilityMonths: safeArray(rawLand.waterAvailabilityMonths).length > 0 ? rawLand.waterAvailabilityMonths : ['June', 'July', 'August', 'September', 'October', 'November'],
    waterReliabilityScore: safeNumber(rawLand.waterReliabilityScore, 8),
    hasDrip: Boolean(rawLand.hasDrip),
    hasSprinkler: Boolean(rawLand.hasSprinkler),
    electricityAvailabilityHours: safeNumber(rawLand.electricityAvailabilityHours, 8),
    storagePondCapacityLakhLitres: safeNumber(rawLand.storagePondCapacityLakhLitres, 0)
  };

  const rawSoil = (payload.soil || (payload as any).soilIntelligence || {}) as any;
  const soil = {
    soilOrder: rawSoil.soilOrder || ('Vertisols (Deep Black Cotton Soils)' as const),
    soilTextureClass: rawSoil.soilTextureClass || rawSoil.texture || ('Clay Loam' as const),
    soilDepth: rawSoil.soilDepth || ('Deep (> 50 cm)' as const),
    ph: safeNumber(rawSoil.ph, 7.4),
    ecDsm: safeNumber(rawSoil.ecDsm || rawSoil.electricalConductivityDsM, 0.45),
    organicCarbonPercent: safeNumber(rawSoil.organicCarbonPercent, 0.65),
    availableNitrogenKgPerHa: rawSoil.availableNitrogenKgPerHa || ('Medium (280 - 560 kg/ha)' as const),
    availablePhosphorusKgPerHa: rawSoil.availablePhosphorusKgPerHa || ('Medium (10 - 25 kg/ha)' as const),
    availablePotassiumKgPerHa: rawSoil.availablePotassiumKgPerHa || ('High (> 280 kg/ha)' as const),
    availableSulphurPpm: rawSoil.availableSulphurPpm || ('Sufficient (> 10 ppm)' as const),
    zincPpm: safeNumber(rawSoil.zincPpm, 0.8),
    ironPpm: safeNumber(rawSoil.ironPpm, 5.0),
    hasSoilHealthCard: Boolean(rawSoil.hasSoilHealthCard),
    soilHealthCardDate: rawSoil.soilHealthCardDate || '2024-03-15',
    soilBiologicalActivity: rawSoil.soilBiologicalActivity || ('Moderate' as const),
    erosionRisk: rawSoil.erosionRisk || ('Low' as const),
    metadata: rawSoil.metadata || {
      status: 'LATEST_AVAILABLE',
      source: 'Soil Health Card Scheme / ICAR-NBSS&LUP',
      date: 'March 2024'
    }
  };

  const targetSeason = payload.targetSeason || 'Kharif';

  const weights = {
    soilWeight: 0.25,
    waterWeight: 0.20,
    climateWeight: 0.15,
    profitabilityWeight: 0.25,
    marketMspWeight: 0.15
  };

  // Build universal crop candidate list from MASTER_CROPS and COMPLETE_INDIA_CROP_MASTER
  let cropsToEvaluate: CropDefinition[] = [];

  if (payload.preferredCropIds && payload.preferredCropIds.length > 0) {
    // Farmer selected specific crops
    const resolvedList: CropDefinition[] = [];
    for (const cropId of payload.preferredCropIds) {
      const fromMaster = MASTER_CROPS.find(c => c.id.toLowerCase() === cropId.toLowerCase());
      if (fromMaster) {
        resolvedList.push(fromMaster);
      } else {
        const fromComplete = getCropById(cropId) || COMPLETE_INDIA_CROP_MASTER.find(c => c.cropId.toLowerCase() === cropId.toLowerCase());
        if (fromComplete) {
          resolvedList.push(convertMasterRecordToCropDefinition(fromComplete));
        }
      }
    }
    cropsToEvaluate = resolvedList.length > 0 ? resolvedList : MASTER_CROPS;
  } else {
    // All-Crop Decision Mode / Fresh Profile: Evaluate all eligible crops across the complete universe
    const allKnownDefinitions: CropDefinition[] = [
      ...MASTER_CROPS,
      ...COMPLETE_INDIA_CROP_MASTER
        .filter(c => !MASTER_CROPS.some(mc => mc.id.toLowerCase() === c.cropId.toLowerCase()))
        .map(convertMasterRecordToCropDefinition)
    ];

    const eligible = allKnownDefinitions.filter(crop => {
      if (!crop) return false;
      if (targetSeason === 'Annual / Commercial') return true;
      if (crop.season === 'Annual / Commercial' || crop.season === 'Multiple seasons' || crop.season === 'Perennial') return true;
      return crop.season === targetSeason;
    });

    cropsToEvaluate = eligible.length > 0 ? eligible : allKnownDefinitions.slice(0, 15);
  }

  const evaluations: CropEvaluation[] = cropsToEvaluate.map(crop => {
    const keyStrengths: string[] = [];
    const keyRiskWarnings: string[] = [];
    let avoidReason: string | undefined = undefined;

    // Synthesize or lookup CropMasterRecord
    const existingMaster = getCropById(crop.id) || COMPLETE_INDIA_CROP_MASTER.find(c => c.cropId.toLowerCase() === crop.id.toLowerCase());
    const masterRecord: any = existingMaster || {
      cropId: crop.id,
      cropName: crop.name,
      hindiName: crop.hindiName,
      scientificName: crop.botanicalName,
      category: crop.category === 'Millets (Shree Anna)' ? 'Millets (Shree Anna)' :
        crop.category === 'Cereals' ? 'Cereals' :
        crop.category === 'Pulses' ? 'Pulses' :
        crop.category === 'Oilseeds' ? 'Oilseeds' :
        crop.category === 'Commercial & Fibres' ? 'Commercial & Fibres' : 'Vegetables & Spices',
      season: crop.season,
      typicalDurationDays: crop.durationDays,
      plantingWindow: crop.sowingWindow,
      harvestWindow: crop.harvestWindow,
      waterRequirements: {
        waterRequirementMm: crop.waterRequirementMm || 500,
        criticalGrowthStages: ['Vegetative', 'Flowering', 'Grain Filling'],
        droughtSensitivity: crop.riskFactors?.droughtSensitivity || 'Medium',
        waterloggingSensitivity: crop.riskFactors?.waterloggingSensitivity || 'Medium'
      },
      soilRequirements: {
        soilTypes: safeArray(crop.optimalSoil),
        pHRange: {
          min: crop.optimalPhMin || 6.0,
          max: crop.optimalPhMax || 8.0,
          optimalMin: crop.optimalPhMin || 6.5,
          optimalMax: crop.optimalPhMax || 7.5
        },
        drainage: 'Well Drained',
        soilDepth: 'Medium to Deep (> 45 cm)'
      },
      agronomicCharacteristics: {
        optimalTemperatureCelsius: { min: 18, max: 32 }
      },
      geographic: {
        majorProducingStates: ['All India']
      }
    };

    // Run Advanced Suitability & Feasibility Engine
    const suitabilityResult = evaluateCropSuitability(masterRecord, {
      location,
      land: landAndIrrigation as any,
      soil: soil as any,
      targetSeason
    });

    const agronomicScore = suitabilityResult.factorScores?.soilScore || 70;
    const waterScore = suitabilityResult.factorScores?.waterScore || 70;
    const climateScore = suitabilityResult.factorScores?.climateScore || 80;

    // Aggregate Strengths & Warnings
    if (suitabilityResult.positiveFactors && suitabilityResult.positiveFactors.length > 0) {
      keyStrengths.push(...suitabilityResult.positiveFactors);
    }
    if (suitabilityResult.limitingFactors && suitabilityResult.limitingFactors.length > 0) {
      keyRiskWarnings.push(...suitabilityResult.limitingFactors);
    }

    // 4. Market Routing & Price Benchmarking
    const bestMandi = findBestMandi(crop, location.district || 'Local', location.state || 'State');
    
    // Expected Price: use highest of modal price or MSP for MSP-notified crops
    const mspNotified = Boolean(crop.mspNotified);
    const mspPrice = safeNumber(crop.mspPrice2024_25, 2500);
    const modalPrice = safeNumber(bestMandi?.modalPricePerQuintal, 2400);

    const expectedBasePrice = mspNotified 
      ? Math.max(modalPrice, mspPrice)
      : modalPrice;

    // Base Economic Yield & Production Costs
    const baseYield = safeNumber(crop.avgYieldQuintalPerAcre, 10);
    const grossRevenueBase = Math.round(baseYield * expectedBasePrice);
    const costA2FL = safeNumber(crop.cacpCostPerQuintalA2FL, 1800);
    const costC2 = safeNumber(crop.cacpCostPerQuintalC2, 2400);

    // Incorporate additional management cost from conditional plan (e.g. supplemental pumping, liming, gypsum)
    const additionalManagementCostPerAcre = suitabilityResult.conditionalManagementPlan?.totalAdditionalManagementCostPerAcre || 0;
    const totalCostA2FL = Math.round(baseYield * costA2FL) + additionalManagementCostPerAcre;
    const totalCostC2 = Math.round(baseYield * costC2) + additionalManagementCostPerAcre;

    const netProfitA2FL = grossRevenueBase - totalCostA2FL;
    const netProfitC2 = grossRevenueBase - totalCostC2;
    const roiA2FL = totalCostA2FL > 0 ? Math.round((netProfitA2FL / totalCostA2FL) * 100) : 0;
    const roiC2 = totalCostC2 > 0 ? Math.round((netProfitC2 / totalCostC2) * 100) : 0;

    const baseScenario: ProfitabilityScenario = {
      yieldQuintalsPerAcre: baseYield,
      expectedPricePerQuintal: expectedBasePrice,
      grossRevenuePerAcre: grossRevenueBase,
      totalCostA2FLPerAcre: totalCostA2FL,
      totalCostC2PerAcre: totalCostC2,
      netProfitA2FLPerAcre: netProfitA2FL,
      netProfitC2PerAcre: netProfitC2,
      roiA2FLPercent: roiA2FL,
      roiC2Percent: roiC2,
      costOfProductionPerQuintalA2FL: baseYield > 0 ? Math.round(totalCostA2FL / baseYield) : costA2FL,
      costOfProductionPerQuintalC2: baseYield > 0 ? Math.round(totalCostC2 / baseYield) : costC2
    };

    // Worst Case (25% yield drop, lowest mandi realization / MSP floor)
    const worstYield = Math.max(1, safeRound(baseYield * 0.75, 1, 1));
    const minMandiPrice = safeNumber(bestMandi?.minPricePerQuintal, Math.round(modalPrice * 0.9));
    const worstPrice = mspNotified ? mspPrice : minMandiPrice;
    const grossRevenueWorst = Math.round(worstYield * worstPrice);
    const totalCostWorstA2FL = Math.round(totalCostA2FL * 0.92);
    const totalCostWorstC2 = Math.round(totalCostC2 * 0.95);
    const netProfitWorstA2FL = grossRevenueWorst - totalCostWorstA2FL;
    const netProfitWorstC2 = grossRevenueWorst - totalCostWorstC2;

    const worstScenario: ProfitabilityScenario = {
      yieldQuintalsPerAcre: worstYield,
      expectedPricePerQuintal: worstPrice,
      grossRevenuePerAcre: grossRevenueWorst,
      totalCostA2FLPerAcre: totalCostWorstA2FL,
      totalCostC2PerAcre: totalCostWorstC2,
      netProfitA2FLPerAcre: netProfitWorstA2FL,
      netProfitC2PerAcre: netProfitWorstC2,
      roiA2FLPercent: totalCostWorstA2FL > 0 ? Math.round((netProfitWorstA2FL / totalCostWorstA2FL) * 100) : 0,
      roiC2Percent: totalCostWorstC2 > 0 ? Math.round((netProfitWorstC2 / totalCostWorstC2) * 100) : 0,
      costOfProductionPerQuintalA2FL: worstYield > 0 ? Math.round(totalCostWorstA2FL / worstYield) : costA2FL,
      costOfProductionPerQuintalC2: worstYield > 0 ? Math.round(totalCostWorstC2 / worstYield) : costC2
    };

    // Best Case (20% yield gain, peak mandi realization)
    const bestYield = Math.max(1, safeRound(baseYield * 1.22, 1, 1));
    const maxMandiPrice = safeNumber(bestMandi?.maxPricePerQuintal, Math.round(modalPrice * 1.1));
    const bestPrice = Math.round(maxMandiPrice * 1.02);
    const grossRevenueBest = Math.round(bestYield * bestPrice);
    const totalCostBestA2FL = Math.round(totalCostA2FL * 1.08);
    const totalCostBestC2 = Math.round(totalCostC2 * 1.08);
    const netProfitBestA2FL = grossRevenueBest - totalCostBestA2FL;
    const netProfitBestC2 = grossRevenueBest - totalCostBestC2;

    const bestScenario: ProfitabilityScenario = {
      yieldQuintalsPerAcre: bestYield,
      expectedPricePerQuintal: bestPrice,
      grossRevenuePerAcre: grossRevenueBest,
      totalCostA2FLPerAcre: totalCostBestA2FL,
      totalCostC2PerAcre: totalCostBestC2,
      netProfitA2FLPerAcre: netProfitBestA2FL,
      netProfitC2PerAcre: netProfitBestC2,
      roiA2FLPercent: totalCostBestA2FL > 0 ? Math.round((netProfitBestA2FL / totalCostBestA2FL) * 100) : 0,
      roiC2Percent: totalCostBestC2 > 0 ? Math.round((netProfitBestC2 / totalCostBestC2) * 100) : 0,
      costOfProductionPerQuintalA2FL: bestYield > 0 ? Math.round(totalCostBestA2FL / bestYield) : costA2FL,
      costOfProductionPerQuintalC2: bestYield > 0 ? Math.round(totalCostBestC2 / bestYield) : costC2
    };

    // Break-even yield
    const breakEvenYield = expectedBasePrice > 0 ? safeRound(totalCostA2FL / expectedBasePrice, 1, 0) : 0;
    const marginOfSafetyMsp = (mspNotified && mspPrice > 0)
      ? safeRound(((expectedBasePrice - mspPrice) / mspPrice) * 100, 0, 0)
      : 0;

    // 5. Profitability & Working Capital Score (0 - 100)
    let profitabilityScore = 50;
    if (roiA2FL >= 80) profitabilityScore = 95;
    else if (roiA2FL >= 50) profitabilityScore = 85;
    else if (roiA2FL >= 30) profitabilityScore = 70;
    else if (roiA2FL >= 10) profitabilityScore = 55;
    else profitabilityScore = 30;

    // Check farmer working capital budget constraint
    const allocatedAcres = safeNumber(landAndIrrigation.plannedLandAllocationAcres, 1);
    const totalCapitalRequired = totalCostA2FL * allocatedAcres;
    const rawBudget = farmerProfile.workingCapitalBudget;
    const farmerBudget = typeof rawBudget === 'number' && !isNaN(rawBudget) && isFinite(rawBudget) ? rawBudget : 0;
    
    if (farmerBudget > 0 && totalCapitalRequired > farmerBudget) {
      profitabilityScore = Math.max(0, profitabilityScore - 20);
      keyRiskWarnings.push(`Working capital requirement (₹${totalCapitalRequired.toLocaleString('en-IN')}) exceeds farmer budget (₹${farmerBudget.toLocaleString('en-IN')}).`);
    } else if (farmerBudget > 0) {
      keyStrengths.push(`Working capital requirement (₹${totalCapitalRequired.toLocaleString('en-IN')}) is within the allocated budget (₹${farmerBudget.toLocaleString('en-IN')}).`);
    }

    // 6. Market & MSP Safety Score (0 - 100)
    let marketSafetyScore = 60;
    if (mspNotified) {
      marketSafetyScore += 25;
      keyStrengths.push(`Notified MSP safety net (₹${mspPrice}/quintal) ensures downside price protection.`);
    }
    const priceVol = crop.riskFactors?.priceVolatilityRisk || 'Medium';
    if (priceVol === 'Low') marketSafetyScore += 10;
    if (priceVol === 'High') {
      marketSafetyScore -= 15;
      keyRiskWarnings.push("Subject to high seasonal wholesale price volatility and supply gluts.");
    }

    // Check Supply-Demand status
    const supplyDemand = (SUPPLY_DEMAND_BALANCES || []).find(s => s && s.cropId === crop.id) || {
      cropId: crop.id,
      cropName: crop.name,
      season: "2024-25 Season",
      nationalAreaMillionHa: 8.5,
      domesticProductionLakhTonnes: 90.0,
      domesticConsumptionLakhTonnes: 85.0,
      endingStocksLakhTonnes: 12.0,
      importVolumeLakhTonnes: 1.0,
      exportVolumeLakhTonnes: 2.0,
      marketBalance: "Balanced" as const,
      supplyDemandRatio: 1.04,
      importDutyPolicy: "Standard trade policy applicable.",
      exportPolicyStatus: "Open General Licence (OGL).",
      metadata: CACP_METADATA_2024_25
    };

    const marketBalanceStr = String(supplyDemand.marketBalance || '');
    if (marketBalanceStr.includes('Deficit')) {
      marketSafetyScore += 10;
      keyStrengths.push("National supply-demand deficit supports strong farmgate prices.");
    } else if (marketBalanceStr.includes('Surplus')) {
      marketSafetyScore -= 15;
      keyRiskWarnings.push("National surplus inventory may exert downward pressure on spot market prices.");
    }

    marketSafetyScore = Math.max(10, Math.min(100, marketSafetyScore));

    // 7. Composite Risk Score (0 - 100, where 0 is safest)
    let compositeRiskScore = 30;
    const isRainfed = String(landAndIrrigation.primaryWaterSource || '').includes('Rainfed');
    const drainageStr = String(landAndIrrigation.drainageCapacity || '');
    const rf = crop.riskFactors || {
      droughtSensitivity: 'Medium',
      waterloggingSensitivity: 'Medium',
      priceVolatilityRisk: 'Medium',
      pestDiseaseRisk: 'Medium',
      storagePerishability: 'Medium'
    };
    if (rf.droughtSensitivity === 'High' && isRainfed) compositeRiskScore += 20;
    if (rf.waterloggingSensitivity === 'High' && drainageStr.includes('Poor')) compositeRiskScore += 15;
    if (rf.priceVolatilityRisk === 'High') compositeRiskScore += 15;
    if (rf.pestDiseaseRisk === 'High') compositeRiskScore += 10;
    if (String(rf.storagePerishability || '').includes('High')) compositeRiskScore += 10;
    if (mspNotified) compositeRiskScore -= 15;
    compositeRiskScore = Math.max(5, Math.min(95, compositeRiskScore));

    // 8. Overall Suitability Score (0 - 100)
    let overallSuitabilityScore = Math.round(
      (agronomicScore * weights.soilWeight) +
      (waterScore * weights.waterWeight) +
      (climateScore * weights.climateWeight) +
      (profitabilityScore * weights.profitabilityWeight) +
      (marketSafetyScore * weights.marketMspWeight)
    );

    // 9. Determine 3-Tier Recommendation Verdict & Hard Avoid Reason
    let recommendationVerdict: ThreeTierRecommendationVerdict = suitabilityResult.recommendationVerdict || 'RECOMMENDED';
    let hardConstraintReason: string | undefined = suitabilityResult.hardConstraintReason;

    // If hard constraint or severe economic infeasibility
    if (recommendationVerdict === 'AVOID') {
      overallSuitabilityScore = Math.min(overallSuitabilityScore, 42);
      avoidReason = hardConstraintReason || "Fundamental agro-climatic or rooting depth constraint cannot be mitigated.";
    } else if (recommendationVerdict === 'DATA_INSUFFICIENT') {
      avoidReason = "Insufficient farm baseline parameters to evaluate suitability.";
    } else if (roiA2FL < -10) {
      recommendationVerdict = 'AVOID';
      avoidReason = "Negative projected operating margin under baseline CACP cost structure.";
      overallSuitabilityScore = Math.min(overallSuitabilityScore, 40);
    }

    const isRecommended = recommendationVerdict === 'RECOMMENDED' || recommendationVerdict === 'CONDITIONALLY_RECOMMENDED';

    // Confidence Score based on soil test availability and data freshness
    const confidenceScore = soil.hasSoilHealthCard ? 92 : 78;

    // Generate fertilizer plan
    const soilPh = safeNumber(soil.ph, 7.0);
    const fertilizerPlan = calculateFertilizerPlan(
      crop, 
      soilPh, 
      soil.availableNitrogenKgPerHa, 
      soil.availablePhosphorusKgPerHa, 
      soil.availablePotassiumKgPerHa
    );

    return {
      crop,
      overallSuitabilityScore,
      agronomicSoilScore: agronomicScore,
      waterSuitabilityScore: waterScore,
      climateZoneScore: climateScore,
      profitabilityScore,
      marketSafetyScore,
      compositeRiskScore,
      confidenceScore,
      isRecommended,
      recommendationVerdict,
      ranking: 0, // Assigned after sorting
      avoidReason,
      hardConstraintReason,
      constraints: suitabilityResult.constraints,
      waterFeasibility: suitabilityResult.waterFeasibility,
      conditionalManagementPlan: suitabilityResult.conditionalManagementPlan,
      worstScenario,
      baseScenario,
      bestScenario,
      breakEvenYieldQuintals: breakEvenYield,
      marginOfSafetyOverMspPercent: marginOfSafetyMsp,
      bestMandi,
      supplyDemand,
      fertilizerPlan,
      keyStrengths,
      keyRiskWarnings,
      metadata: CACP_METADATA_2024_25
    };
  });

  // Sort by overall suitability score descending
  evaluations.sort((a, b) => b.overallSuitabilityScore - a.overallSuitabilityScore);
  evaluations.forEach((evalItem, index) => {
    evalItem.ranking = index + 1;
  });

  const recommendedCrops = evaluations.filter(e => e.recommendationVerdict === 'RECOMMENDED');
  const conditionallyRecommendedCrops = evaluations.filter(e => e.recommendationVerdict === 'CONDITIONALLY_RECOMMENDED');
  const cropsToAvoid = evaluations.filter(e => e.recommendationVerdict === 'AVOID');
  const dataInsufficientCrops = evaluations.filter(e => e.recommendationVerdict === 'DATA_INSUFFICIENT');
  
  const viableCrops = [...recommendedCrops, ...conditionallyRecommendedCrops];
  const topAlternativeCrops = viableCrops.slice(1, 4);

  // Farm total calculations based on top viable crop
  const topCrop = viableCrops[0] || evaluations[0];
  const allocatedLand = safeNumber(landAndIrrigation.plannedLandAllocationAcres, 1);
  const totalFarmRevenueBase = topCrop?.baseScenario ? topCrop.baseScenario.grossRevenuePerAcre * allocatedLand : 0;
  const totalFarmCostA2FL = topCrop?.baseScenario ? topCrop.baseScenario.totalCostA2FLPerAcre * allocatedLand : 0;
  const totalFarmNetProfitBase = topCrop?.baseScenario ? topCrop.baseScenario.netProfitA2FLPerAcre * allocatedLand : 0;

  const normalizedPayload: CalculationEnginePayload = {
    ...payload,
    farmerProfile,
    location,
    farmLocation: location,
    landAndIrrigation: landAndIrrigation as any,
    soil: soil as any,
    soilIntelligence: soil as any
  };

  return {
    calculationId: `FF-${Date.now().toString().slice(-6)}`,
    timestamp: new Date().toISOString(),
    payload: normalizedPayload,
    evaluations,
    recommendedCrops,
    conditionallyRecommendedCrops,
    cropsToAvoid,
    dataInsufficientCrops,
    topAlternativeCrops,
    totalFarmRevenueBaseEstimate: totalFarmRevenueBase,
    totalFarmCostA2FLEstimate: totalFarmCostA2FL,
    totalFarmNetProfitBaseEstimate: totalFarmNetProfitBase,
    engineWeights: weights,
    metadata: {
      status: 'MODEL_ESTIMATE',
      source: 'FARMFIT Decision Engine v2.5 (3-Tier Constraint Management + CACP Cost Standard)',
      date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      disclaimer: 'Engine calculations synthesize official CACP cultivation cost standards, Agmarknet modal prices, and ICAR agro-climatic rules.'
    }
  };
}

export const runFarmfitCalculationEngine = runFarmfitEngine;

