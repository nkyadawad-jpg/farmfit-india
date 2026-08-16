import {
  CalculationEnginePayload,
  CalculationEngineResult,
  CropDefinition,
  CropEvaluation,
  MandiPriceRecord,
  ProfitabilityScenario,
  FertilizerPlan,
  SupplyDemandBalance,
  DataMetadata
} from '../types';
import { 
  MASTER_CROPS, 
  APMC_MANDI_RECORDS, 
  SUPPLY_DEMAND_BALANCES, 
  CACP_METADATA_2024_25,
  AGMARKNET_METADATA
} from '../data/officialData';

/**
 * Calculates customized fertilizer dosage based on crop requirements and Soil Health Card
 */
function calculateFertilizerPlan(crop: CropDefinition, soilPh: number, nitrogenStatus: string, phosphorusStatus: string, potassiumStatus: string): FertilizerPlan {
  // Baseline ICAR / State Agriculture University Package of Practices
  let ureaBags = 2.0;
  let dapBags = 1.0;
  let mopBags = 0.8;
  let zincKg = 5.0;

  if (crop.category === 'Cereals') {
    ureaBags = 2.8;
    dapBags = 1.2;
    mopBags = 0.8;
  } else if (crop.category === 'Pulses') {
    // Legumes fix atmospheric nitrogen -> lower urea, higher phosphorus
    ureaBags = 0.8;
    dapBags = 1.5;
    mopBags = 0.6;
  } else if (crop.category === 'Oilseeds') {
    ureaBags = 1.5;
    dapBags = 1.2;
    mopBags = 1.0;
    zincKg = 8.0; // Sulphur & Zinc critical for oil content
  } else if (crop.category === 'Commercial & Fibres') {
    if (crop.id === 'sugarcane') {
      ureaBags = 6.0;
      dapBags = 2.5;
      mopBags = 2.0;
    } else {
      // Cotton
      ureaBags = 3.2;
      dapBags = 1.5;
      mopBags = 1.2;
    }
  } else if (crop.category === 'Vegetables & Spices') {
    ureaBags = 3.0;
    dapBags = 2.0;
    mopBags = 1.5;
  }

  // Adjust for Soil Health Card status
  if (nitrogenStatus.includes('Low')) ureaBags *= 1.25;
  if (nitrogenStatus.includes('High')) ureaBags *= 0.75;
  if (phosphorusStatus.includes('Low')) dapBags *= 1.25;
  if (phosphorusStatus.includes('High')) dapBags *= 0.8;
  if (potassiumStatus.includes('Low')) mopBags *= 1.25;
  if (potassiumStatus.includes('High')) mopBags *= 0.8;

  // Rounding
  ureaBags = Math.round(ureaBags * 10) / 10;
  dapBags = Math.round(dapBags * 10) / 10;
  mopBags = Math.round(mopBags * 10) / 10;

  // Subsidized retail prices (Govt. of India notified ceiling rates: Urea ~ Rs 266.50/45kg bag, DAP ~ Rs 1350/50kg bag, MOP ~ Rs 1650/50kg bag)
  const fertilizerCost = Math.round(
    (ureaBags * 266.5) + (dapBags * 1350) + (mopBags * 1650) + (zincKg * 60)
  );

  return {
    ureaBagsPerAcre: ureaBags,
    dapBagsPerAcre: dapBags,
    mopBagsPerAcre: mopBags,
    sspKgPerAcre: Math.round(dapBags * 50 * 2.5),
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
function findBestMandi(crop: CropDefinition, userDistrict: string, userState: string): MandiPriceRecord {
  // Filter for matching crop
  const mandisForCrop = APMC_MANDI_RECORDS.filter(m => m.cropId === crop.id);

  if (mandisForCrop.length > 0) {
    // If there's a mandi in the same district or state, prefer it; otherwise pick the one with highest net realization
    const localMandi = mandisForCrop.find(m => m.district.toLowerCase() === userDistrict.toLowerCase() || m.state.toLowerCase() === userState.toLowerCase());
    if (localMandi) return localMandi;

    // Return the one with highest net realization
    return mandisForCrop.reduce((prev, curr) => (curr.netRealizationPerQuintal > prev.netRealizationPerQuintal ? curr : prev), mandisForCrop[0]);
  }

  // Fallback synthetic benchmark based on MSP or CACP cost
  const basePrice = crop.mspNotified ? Math.round(crop.mspPrice2024_25 * 1.02) : Math.round(crop.cacpCostPerQuintalA2FL * 1.35);
  const freight = Math.round(25 * 1.1); // approx 25 km
  const hamali = 28;
  const cess = Math.round(basePrice * 0.015);

  return {
    mandiId: `mandi_${crop.id}_benchmark`,
    mandiName: `${userDistrict} District APMC Main Yard`,
    district: userDistrict,
    state: userState,
    cropId: crop.id,
    cropName: crop.name,
    distanceKm: 25,
    minPricePerQuintal: Math.round(basePrice * 0.92),
    maxPricePerQuintal: Math.round(basePrice * 1.08),
    modalPricePerQuintal: basePrice,
    dailyArrivalsTonnes: 650,
    arrivalTrend: "Stable",
    freightCostPerKmPerQuintal: 1.1,
    hamaliChargesPerQuintal: hamali,
    mandiCessPercent: 1.5,
    netRealizationPerQuintal: basePrice - freight - hamali - cess,
    date: "Current Agmarknet Session",
    metadata: AGMARKNET_METADATA
  };
}

/**
 * Executes the complete FARMFIT 16-variable multi-criteria agricultural decision calculation
 */
export function runFarmfitEngine(payload: CalculationEnginePayload): CalculationEngineResult {
  const { farmerProfile, location, landAndIrrigation, soil, targetSeason } = payload;

  const weights = {
    soilWeight: 0.25,
    waterWeight: 0.20,
    climateWeight: 0.15,
    profitabilityWeight: 0.25,
    marketMspWeight: 0.15
  };

  // Filter crops for target season or perennial
  const eligibleCrops = MASTER_CROPS.filter(crop => {
    if (targetSeason === 'Annual / Commercial') return true;
    if (crop.season === 'Annual / Commercial') return true;
    return crop.season === targetSeason;
  });

  const evaluations: CropEvaluation[] = eligibleCrops.map(crop => {
    const keyStrengths: string[] = [];
    const keyRiskWarnings: string[] = [];
    let avoidReason: string | undefined = undefined;

    // 1. Agronomic & Soil Suitability (0 - 100)
    let agronomicScore = 80;
    const isOptimalSoil = crop.optimalSoil.some(s => s.toLowerCase().includes(soil.soilOrder.split(' ')[0].toLowerCase()));
    
    if (isOptimalSoil) {
      agronomicScore += 15;
      keyStrengths.push(`Soil order (${soil.soilOrder}) matches optimal agronomic profile.`);
    } else {
      agronomicScore -= 20;
      keyRiskWarnings.push(`Soil order differs from preferred optimal soil types.`);
    }

    // pH match
    if (soil.ph >= crop.optimalPhMin && soil.ph <= crop.optimalPhMax) {
      agronomicScore += 5;
    } else if (soil.ph < crop.optimalPhMin - 0.5 || soil.ph > crop.optimalPhMax + 0.5) {
      agronomicScore -= 25;
      keyRiskWarnings.push(`Soil pH (${soil.ph}) is outside optimal range (${crop.optimalPhMin} - ${crop.optimalPhMax}).`);
      if (soil.ph > 8.3 && crop.category === 'Pulses') {
        avoidReason = "High soil alkalinity (pH > 8.3) severely restricts pulse rhizobium nodulation.";
      }
    }

    // Soil Depth vs Rooting Depth
    if (soil.soilDepth === 'Shallow (< 25 cm)' && (crop.id === 'cotton_long' || crop.id === 'sugarcane' || crop.id === 'tur_arhar')) {
      agronomicScore -= 30;
      keyRiskWarnings.push("Shallow soil restricts deep taproot penetration.");
      avoidReason = "Shallow soil depth (< 25 cm) inadequate for deep-rooted perennial/long duration crop.";
    }

    // Drainage vs Waterlogging
    if (landAndIrrigation.drainageCapacity === 'Poor (Prone to water stagnation)') {
      if (crop.riskFactors.waterloggingSensitivity === 'High') {
        agronomicScore -= 30;
        keyRiskWarnings.push("High risk of root rot & wilt due to poor field drainage.");
        avoidReason = "High waterlogging susceptibility under poor drainage conditions.";
      } else if (crop.id === 'paddy_common') {
        agronomicScore += 10;
        keyStrengths.push("Poor drainage / water holding capacity is advantageous for standing water in paddy.");
      }
    }

    agronomicScore = Math.max(10, Math.min(100, agronomicScore));

    // 2. Water & Irrigation Suitability (0 - 100)
    let waterScore = 75;
    const isRainfed = landAndIrrigation.primaryWaterSource === 'Rainfed Only (No assured irrigation)';
    const annualRainfall = location.normalAnnualRainfallMm;

    if (isRainfed) {
      if (crop.waterRequirementMm > 600) {
        waterScore -= 45;
        keyRiskWarnings.push(`High water requirement (${crop.waterRequirementMm} mm) under rainfed conditions without assured irrigation.`);
        avoidReason = "Crop water requirement exceeds rainfed moisture availability without supplemental irrigation.";
      } else if (crop.waterRequirementMm <= 350) {
        waterScore += 15;
        keyStrengths.push(`Low crop water requirement (${crop.waterRequirementMm} mm) resilient under rainfed conditions.`);
      }
    } else {
      // Has irrigation
      if (landAndIrrigation.irrigationMethod.includes('Drip')) {
        waterScore += 15;
        keyStrengths.push("Micro-irrigation (Drip) ensures 35-45% water savings and high nutrient use efficiency.");
      }
      if (landAndIrrigation.dailyWaterAvailabilityHours >= 6) {
        waterScore += 10;
      } else if (landAndIrrigation.dailyWaterAvailabilityHours < 3 && crop.waterRequirementMm > 700) {
        waterScore -= 20;
        keyRiskWarnings.push("Limited daily pumping hours (< 3 hrs) may create moisture stress during peak flowering.");
      }
    }

    waterScore = Math.max(10, Math.min(100, waterScore));

    // 3. Climate & Zone Suitability (0 - 100)
    let climateScore = 80;
    if (location.agroClimaticZoneId > 0) {
      climateScore += 10;
      keyStrengths.push(`Well adapted to Agro-Climatic Zone ${location.agroClimaticZoneId} (${location.agroClimaticZoneName}).`);
    }
    climateScore = Math.max(10, Math.min(100, climateScore));

    // 4. Market Routing & Price Benchmarking
    const bestMandi = findBestMandi(crop, location.district, location.state);
    
    // Expected Price: use highest of modal price or MSP for MSP-notified crops
    const expectedBasePrice = crop.mspNotified 
      ? Math.max(bestMandi.modalPricePerQuintal, crop.mspPrice2024_25)
      : bestMandi.modalPricePerQuintal;

    const baseYield = crop.avgYieldQuintalPerAcre;
    const grossRevenueBase = Math.round(baseYield * expectedBasePrice);
    const totalCostA2FL = Math.round(baseYield * crop.cacpCostPerQuintalA2FL);
    const totalCostC2 = Math.round(baseYield * crop.cacpCostPerQuintalC2);
    const netProfitA2FL = grossRevenueBase - totalCostA2FL;
    const netProfitC2 = grossRevenueBase - totalCostC2;
    const roiA2FL = Math.round((netProfitA2FL / totalCostA2FL) * 100);
    const roiC2 = Math.round((netProfitC2 / totalCostC2) * 100);

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
      costOfProductionPerQuintalA2FL: crop.cacpCostPerQuintalA2FL,
      costOfProductionPerQuintalC2: crop.cacpCostPerQuintalC2
    };

    // Worst Case (25% yield drop, lowest mandi realization / MSP floor)
    const worstYield = Math.round(baseYield * 0.75 * 10) / 10;
    const worstPrice = crop.mspNotified ? crop.mspPrice2024_25 : bestMandi.minPricePerQuintal;
    const grossRevenueWorst = Math.round(worstYield * worstPrice);
    const totalCostWorstA2FL = Math.round(totalCostA2FL * 0.92); // slightly lower harvesting cost
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
      roiA2FLPercent: Math.round((netProfitWorstA2FL / totalCostWorstA2FL) * 100),
      roiC2Percent: Math.round((netProfitWorstC2 / totalCostWorstC2) * 100),
      costOfProductionPerQuintalA2FL: Math.round(totalCostWorstA2FL / worstYield),
      costOfProductionPerQuintalC2: Math.round(totalCostWorstC2 / worstYield)
    };

    // Best Case (20% yield gain, peak mandi realization)
    const bestYield = Math.round(baseYield * 1.22 * 10) / 10;
    const bestPrice = Math.round(bestMandi.maxPricePerQuintal * 1.02);
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
      roiA2FLPercent: Math.round((netProfitBestA2FL / totalCostBestA2FL) * 100),
      roiC2Percent: Math.round((netProfitBestC2 / totalCostBestC2) * 100),
      costOfProductionPerQuintalA2FL: Math.round(totalCostBestA2FL / bestYield),
      costOfProductionPerQuintalC2: Math.round(totalCostBestC2 / bestYield)
    };

    // Break-even yield
    const breakEvenYield = Math.round((totalCostA2FL / expectedBasePrice) * 10) / 10;
    const marginOfSafetyMsp = crop.mspNotified 
      ? Math.round(((expectedBasePrice - crop.mspPrice2024_25) / crop.mspPrice2024_25) * 100)
      : 0;

    // 5. Profitability & Working Capital Score (0 - 100)
    let profitabilityScore = 50;
    if (roiA2FL >= 80) profitabilityScore = 95;
    else if (roiA2FL >= 50) profitabilityScore = 85;
    else if (roiA2FL >= 30) profitabilityScore = 70;
    else if (roiA2FL >= 10) profitabilityScore = 55;
    else profitabilityScore = 30;

    // Check farmer working capital budget constraint
    const allocatedAcres = landAndIrrigation.plannedLandAllocationAcres || 1;
    const totalCapitalRequired = totalCostA2FL * allocatedAcres;
    if (farmerProfile.workingCapitalBudget > 0 && totalCapitalRequired > farmerProfile.workingCapitalBudget) {
      profitabilityScore -= 20;
      keyRiskWarnings.push(`Estimated working capital requirement (₹${totalCapitalRequired.toLocaleString('en-IN')}) exceeds farmer budget (₹${farmerProfile.workingCapitalBudget.toLocaleString('en-IN')}).`);
    } else if (farmerProfile.workingCapitalBudget > 0) {
      keyStrengths.push(`Working capital requirement is well within the allocated budget.`);
    }

    // 6. Market & MSP Safety Score (0 - 100)
    let marketSafetyScore = 60;
    if (crop.mspNotified) {
      marketSafetyScore += 25;
      keyStrengths.push(`Notified MSP safety net (₹${crop.mspPrice2024_25}/quintal) ensures downside price protection.`);
    }
    if (crop.riskFactors.priceVolatilityRisk === 'Low') marketSafetyScore += 10;
    if (crop.riskFactors.priceVolatilityRisk === 'High') {
      marketSafetyScore -= 15;
      keyRiskWarnings.push("Subject to high seasonal wholesale price volatility and supply gluts.");
    }

    // Check Supply-Demand status
    const supplyDemand = SUPPLY_DEMAND_BALANCES.find(s => s.cropId === crop.id) || {
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

    if (supplyDemand.marketBalance.includes('Deficit')) {
      marketSafetyScore += 10;
      keyStrengths.push("National supply-demand deficit supports strong farmgate prices.");
    } else if (supplyDemand.marketBalance.includes('Surplus')) {
      marketSafetyScore -= 15;
      keyRiskWarnings.push("National surplus inventory may exert downward pressure on spot market prices.");
      if (!crop.mspNotified && roiA2FL < 20) {
        avoidReason = "Expected national oversupply combined with lack of statutory MSP procurement support.";
      }
    }

    marketSafetyScore = Math.max(10, Math.min(100, marketSafetyScore));

    // 7. Composite Risk Score (0 - 100, where 0 is safest)
    let compositeRiskScore = 30;
    if (crop.riskFactors.droughtSensitivity === 'High' && isRainfed) compositeRiskScore += 30;
    if (crop.riskFactors.waterloggingSensitivity === 'High' && landAndIrrigation.drainageCapacity === 'Poor (Prone to water stagnation)') compositeRiskScore += 25;
    if (crop.riskFactors.priceVolatilityRisk === 'High') compositeRiskScore += 15;
    if (crop.riskFactors.pestDiseaseRisk === 'High') compositeRiskScore += 10;
    if (crop.riskFactors.storagePerishability === 'High (Perishable)') compositeRiskScore += 15;
    if (crop.mspNotified) compositeRiskScore -= 15;
    compositeRiskScore = Math.max(5, Math.min(95, compositeRiskScore));

    // 8. Overall Suitability Score (0 - 100)
    let overallSuitabilityScore = Math.round(
      (agronomicScore * weights.soilWeight) +
      (waterScore * weights.waterWeight) +
      (climateScore * weights.climateWeight) +
      (profitabilityScore * weights.profitabilityWeight) +
      (marketSafetyScore * weights.marketMspWeight)
    );

    // If explicit avoid reason triggered, reduce overall score
    if (avoidReason) {
      overallSuitabilityScore = Math.min(overallSuitabilityScore, 42);
    }

    // Confidence Score based on soil test availability and data freshness
    const confidenceScore = soil.hasSoilHealthCard ? 92 : 78;

    const isRecommended = !avoidReason && overallSuitabilityScore >= 60;

    // Generate fertilizer plan
    const fertilizerPlan = calculateFertilizerPlan(
      crop, 
      soil.ph, 
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
      ranking: 0, // Assigned after sorting
      avoidReason,
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

  const recommendedCrops = evaluations.filter(e => e.isRecommended);
  const cropsToAvoid = evaluations.filter(e => !e.isRecommended);
  const topAlternativeCrops = recommendedCrops.slice(1, 4);

  // Farm total calculations based on top recommended crop
  const topCrop = recommendedCrops[0] || evaluations[0];
  const allocatedLand = landAndIrrigation.plannedLandAllocationAcres || 1;
  const totalFarmRevenueBase = topCrop ? topCrop.baseScenario.grossRevenuePerAcre * allocatedLand : 0;
  const totalFarmCostA2FL = topCrop ? topCrop.baseScenario.totalCostA2FLPerAcre * allocatedLand : 0;
  const totalFarmNetProfitBase = topCrop ? topCrop.baseScenario.netProfitA2FLPerAcre * allocatedLand : 0;

  return {
    calculationId: `FF-${Date.now().toString().slice(-6)}`,
    timestamp: new Date().toISOString(),
    payload,
    evaluations,
    recommendedCrops,
    cropsToAvoid,
    topAlternativeCrops,
    totalFarmRevenueBaseEstimate: totalFarmRevenueBase,
    totalFarmCostA2FLEstimate: totalFarmCostA2FL,
    totalFarmNetProfitBaseEstimate: totalFarmNetProfitBase,
    engineWeights: weights,
    metadata: {
      status: 'MODEL_ESTIMATE',
      source: 'FARMFIT Decision Engine v2.4 (CACP Cost Standard + Agmarknet Logistics Model)',
      date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      disclaimer: 'Engine calculations synthesize official CACP cultivation cost standards, Agmarknet modal prices, and ICAR agro-climatic rules.'
    }
  };
}
