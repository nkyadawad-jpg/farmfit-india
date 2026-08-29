import { 
  CropMasterRecord, 
  CropSuitabilityResult, 
  CropSuitabilityLevel, 
  SuitabilityFactorDetail,
  FarmLocation, 
  LandIrrigationProfile, 
  SoilProfileRecord,
  CropSeason,
  CropConstraintItem,
  WaterFeasibilityAnalysis,
  WaterFeasibilityStatus,
  ConstraintManageabilityClassification,
  ThreeTierRecommendationVerdict,
  ConditionalManagementPlan
} from '../types';
import { COMPLETE_INDIA_CROP_MASTER } from '../data/cropMasterIndex';
import { safeNumber, safeArray, safeString } from '../utils/safeArithmetic';

export interface FarmContextForSuitability {
  location?: Partial<FarmLocation>;
  land?: Partial<LandIrrigationProfile>;
  soil?: Partial<SoilProfileRecord>;
  targetSeason?: CropSeason | 'ANY';
  plantingMonth?: number; // 1 to 12
}

/**
 * Calculates suitability and constraint manageability for a specific crop based on farm context
 */
export function evaluateCropSuitability(
  crop: CropMasterRecord,
  farm: FarmContextForSuitability
): CropSuitabilityResult {
  const limitingFactors: string[] = [];
  const positiveFactors: string[] = [];
  const agronomicRecommendations: string[] = [];
  const constraints: CropConstraintItem[] = [];

  const cropName = crop?.cropName || crop?.name || 'Crop';
  const cropId = crop?.cropId || crop?.id || 'unknown_crop';
  const category = crop?.category || 'Cereals';

  let soilScore = 70;
  let soilStatus: 'OPTIMAL' | 'ACCEPTABLE' | 'LIMITING' | 'INCOMPATIBLE' | 'DATA_NOT_CONNECTED' = 'ACCEPTABLE';
  let soilExplanation = 'General soil profile assumed.';

  let waterScore = 70;
  let waterStatus: 'OPTIMAL' | 'ACCEPTABLE' | 'LIMITING' | 'INCOMPATIBLE' | 'DATA_NOT_CONNECTED' = 'ACCEPTABLE';
  let waterExplanation = 'General water availability evaluated.';

  let climateScore = 80;
  let climateStatus: 'OPTIMAL' | 'ACCEPTABLE' | 'LIMITING' | 'INCOMPATIBLE' | 'DATA_NOT_CONNECTED' = 'ACCEPTABLE';
  let climateExplanation = 'Agro-climatic requirements compatible.';

  let seasonScore = 80;
  let seasonStatus: 'OPTIMAL' | 'ACCEPTABLE' | 'LIMITING' | 'INCOMPATIBLE' | 'DATA_NOT_CONNECTED' = 'OPTIMAL';
  let seasonExplanation = 'Season matches crop calendar.';

  let geographicScore = 75;
  let geographicStatus: 'OPTIMAL' | 'ACCEPTABLE' | 'LIMITING' | 'INCOMPATIBLE' | 'DATA_NOT_CONNECTED' = 'ACCEPTABLE';
  let geographicExplanation = 'Cultivated across Indian agricultural zones.';

  let hardConstraintReason: string | undefined = undefined;

  // ----------------------------------------------------
  // 1. SOIL EVALUATION & MANAGEABILITY
  // ----------------------------------------------------
  if (farm?.soil) {
    const soil = farm.soil;
    let soilDeduction = 0;
    let soilBonus = 0;

    // Soil Type match
    const farmSoilType = soil.soilType || soil.soilOrder || '';
    const reqSoilTypes = safeArray<string>(crop?.soilRequirements?.soilTypes || crop?.optimalSoil);
    
    if (farmSoilType && reqSoilTypes.length > 0) {
      const matchSoilType = reqSoilTypes.some(st => 
        st && (
          st.toLowerCase().includes(farmSoilType.toLowerCase()) || 
          farmSoilType.toLowerCase().includes(st.toLowerCase().split(' ')[0])
        )
      );

      if (matchSoilType) {
        soilBonus += 15;
        positiveFactors.push(`Soil type (${farmSoilType}) matches optimal agronomic profile.`);
      } else {
        soilDeduction += 10;
        limitingFactors.push(`Crop prefers ${reqSoilTypes.slice(0, 2).join(', ')}, while farm soil is ${farmSoilType}.`);
        
        // Add manageable soil amendment constraint
        constraints.push({
          id: `soil_type_${cropId}`,
          factor: 'OTHER',
          problemTitle: `Suboptimal Soil Type (${farmSoilType})`,
          description: `Crop performs best in ${reqSoilTypes.slice(0, 2).join(', ')}. Native soil texture is ${farmSoilType}.`,
          classification: 'MANAGEABLE_WITH_COST',
          canFarmerManage: true,
          managementOption: 'Enhance soil structure and water-holding capacity through incorporation of 2-3 tonnes/acre well-decomposed Farmyard Manure (FYM) or vermicompost.',
          additionalRequirement: '2-3 tonnes organic manure / bio-fertilizers (Azotobacter / PSB)',
          costImplication: 'Estimated ₹1,500 - ₹2,500/acre organic amendment',
          estimatedCostPerAcre: 2000,
          residualRisk: 'LOW',
          impactOnDecision: 'CONDITIONAL_APPROVED'
        });
      }
    }

    // pH match & manageability
    let ph: number | undefined;
    if (typeof soil.ph === 'number') {
      ph = soil.ph;
    } else if (soil.ph && typeof (soil.ph as { value?: number }).value === 'number') {
      ph = (soil.ph as { value: number }).value;
    }

    const pHRange = crop?.soilRequirements?.pHRange || {
      min: crop?.optimalPhMin || 6.0,
      max: crop?.optimalPhMax || 8.0,
      optimalMin: crop?.optimalPhMin || 6.5,
      optimalMax: crop?.optimalPhMax || 7.5
    };

    if (typeof ph === 'number' && !isNaN(ph)) {
      const { min = 6.0, max = 8.0, optimalMin, optimalMax } = pHRange;

      if (optimalMin && optimalMax && ph >= optimalMin && ph <= optimalMax) {
        soilBonus += 15;
        positiveFactors.push(`Soil pH (${ph.toFixed(1)}) is in the optimal range (${optimalMin} - ${optimalMax}).`);
      } else if (ph >= min && ph <= max) {
        soilBonus += 5;
        positiveFactors.push(`Soil pH (${ph.toFixed(1)}) is within tolerable range (${min} - ${max}).`);
      } else if (ph < min) {
        soilDeduction += 20;
        limitingFactors.push(`Soil pH (${ph.toFixed(1)}) is acidic (recommended min: ${min.toFixed(1)}).`);
        agronomicRecommendations.push(`Apply agricultural lime / dolomite (250-400 kg/acre) to raise pH towards ${min.toFixed(1)}.`);
        
        constraints.push({
          id: `soil_ph_acidic_${cropId}`,
          factor: 'SOIL_PH',
          problemTitle: `Soil Acidity (pH ${ph.toFixed(1)} < ${min.toFixed(1)})`,
          description: `Acidic soil restricts phosphorus availability and microbial nitrogen fixation.`,
          classification: 'MANAGEABLE_WITH_COST',
          canFarmerManage: true,
          managementOption: 'Apply 300-400 kg/acre Agricultural Lime or Dolomite 3-4 weeks prior to sowing during preparatory tillage.',
          additionalRequirement: '300-400 kg Agricultural Lime + basal Single Super Phosphate (SSP)',
          costImplication: 'Estimated ₹1,200 - ₹1,800/acre liming application',
          estimatedCostPerAcre: 1500,
          residualRisk: 'LOW',
          impactOnDecision: 'CONDITIONAL_APPROVED'
        });
      } else if (ph > max) {
        soilDeduction += 20;
        limitingFactors.push(`Soil pH (${ph.toFixed(1)}) is alkaline / sodic (recommended max: ${max.toFixed(1)}).`);
        agronomicRecommendations.push(`Apply gypsum / organic compost / pressmud to lower alkalinity towards ${max.toFixed(1)}.`);

        // High alkalinity in pulses is high constraint, but manageable with gypsum
        const isPulse = category === 'Pulses';
        constraints.push({
          id: `soil_ph_alkaline_${cropId}`,
          factor: 'SOIL_PH',
          problemTitle: `Soil Alkalinity (pH ${ph.toFixed(1)} > ${max.toFixed(1)})`,
          description: `Alkaline conditions reduce zinc/iron bioavailability and ${isPulse ? 'impair rhizobial nodulation' : 'inhibit root nutrient uptake'}.`,
          classification: ph > 8.8 ? 'HIGH_CONSTRAINT' : 'MANAGEABLE_WITH_COST',
          canFarmerManage: true,
          managementOption: 'Apply 400-500 kg/acre Agricultural Gypsum + 2 tonnes Pressmud or Farmyard Manure + Zinc Sulphate (10 kg/acre) to buffer alkalinity.',
          additionalRequirement: '400 kg Gypsum + Zinc Sulphate + Organic Mulch',
          costImplication: 'Estimated ₹1,500 - ₹2,200/acre soil reclamation amendment',
          estimatedCostPerAcre: 1800,
          residualRisk: ph > 8.5 ? 'MEDIUM' : 'LOW',
          impactOnDecision: 'CONDITIONAL_APPROVED'
        });
      }
    }

    // Soil Depth vs Rooting Depth
    const soilDepthStr = String(soil.soilDepth || '');
    if (soilDepthStr.includes('Shallow') && (cropId === 'cotton' || cropId === 'cotton_long' || cropId === 'sugarcane' || cropId === 'tur' || cropId === 'tur_arhar' || category === 'Fruits')) {
      soilDeduction += 30;
      limitingFactors.push(`Shallow soil (< 25 cm) restricts deep taproot penetration for ${cropName}.`);
      
      constraints.push({
        id: `soil_depth_${cropId}`,
        factor: 'SOIL_DEPTH',
        problemTitle: `Shallow Soil Depth (< 25 cm)`,
        description: `Deep taproots of ${cropName} encounter hardpan/bedrock, restricting vegetative anchorage and moisture foraging.`,
        classification: category === 'Fruits' || cropId === 'sugarcane' ? 'HARD_CONSTRAINT' : 'HIGH_CONSTRAINT',
        canFarmerManage: false,
        managementOption: 'Deep subsoiling with tractor ripper can break hardpan slightly, but cannot replace fertile root zone depth. Recommend cultivating medium/shallow rooted alternatives.',
        additionalRequirement: 'Subsoil ripper pass (partial relief only)',
        costImplication: 'Estimated ₹2,000/acre tractor tillage cost (high residual risk)',
        estimatedCostPerAcre: 2000,
        residualRisk: 'HIGH',
        impactOnDecision: category === 'Fruits' || cropId === 'sugarcane' ? 'AVOID_RECOMMENDED' : 'CONDITIONAL_APPROVED'
      });
    }

    // Soil Drainage vs Waterlogging
    const waterloggingSens = crop?.waterRequirements?.waterloggingSensitivity || crop?.riskFactors?.waterloggingSensitivity || 'Medium';
    if (soil.drainage) {
      const isSensitiveToWaterlogging = waterloggingSens === 'High';
      const isPoorDrainage = soil.drainage.toLowerCase().includes('poor') || soil.drainage.toLowerCase().includes('stagnat');

      if (isPoorDrainage && isSensitiveToWaterlogging && cropId !== 'paddy' && cropId !== 'paddy_common') {
        soilDeduction += 20;
        limitingFactors.push(`Farm has poor drainage/water stagnation, while ${cropName} is sensitive to waterlogging.`);
        agronomicRecommendations.push(`Construct raised beds or Broad Bed Furrow (BBF) systems with drainage channels.`);

        constraints.push({
          id: `drainage_${cropId}`,
          factor: 'SOIL_DRAINAGE',
          problemTitle: `Poor Field Drainage & Waterlogging Risk`,
          description: `Standing water for > 48 hours causes collar rot, root asphyxiation, and fungal wilt.`,
          classification: 'MANAGEABLE_WITH_COST',
          canFarmerManage: true,
          managementOption: 'Prepare field with Broad Bed Furrows (BBF) or raised beds (15-20 cm high) with lateral drainage ditches every 20-30 meters.',
          additionalRequirement: 'BBF planter or tractor bed former + field peripheral trenching',
          costImplication: 'Estimated ₹1,200 - ₹1,800/acre bed preparation',
          estimatedCostPerAcre: 1500,
          residualRisk: 'MEDIUM',
          impactOnDecision: 'CONDITIONAL_APPROVED'
        });
      } else if (isPoorDrainage && (cropId === 'paddy' || cropId === 'paddy_common')) {
        soilBonus += 10;
        positiveFactors.push(`Heavy soil / slow drainage is advantageous for standing water in wetland paddy.`);
      }
    }

    soilScore = Math.max(10, Math.min(100, 70 + soilBonus - soilDeduction));
    if (soilScore >= 80) soilStatus = 'OPTIMAL';
    else if (soilScore >= 60) soilStatus = 'ACCEPTABLE';
    else if (soilScore >= 40) soilStatus = 'LIMITING';
    else soilStatus = 'INCOMPATIBLE';
    
    soilExplanation = `Soil compatibility score: ${soilScore}/100.`;
  } else {
    soilStatus = 'DATA_NOT_CONNECTED';
    soilExplanation = 'Soil profile not fully configured.';
  }

  // ----------------------------------------------------
  // 2. WATER & IRRIGATION FEASIBILITY LAYER
  // ----------------------------------------------------
  const rawAnnualRainfall = safeNumber(farm?.location?.normalAnnualRainfallMm, 900);
  const targetSeason = farm?.targetSeason || 'Kharif';
  
  // Seasonal rainfall allocation benchmark (India agro-climatic averages)
  const seasonalRainfallFraction = targetSeason === 'Kharif' ? 0.70 : targetSeason === 'Rabi' ? 0.18 : 0.08;
  const expectedSeasonalRainfallMm = Math.round(rawAnnualRainfall * seasonalRainfallFraction);
  const cropWaterMm = safeNumber(crop?.waterRequirements?.waterRequirementMm || crop?.waterRequirementMm, 500);

  let irrigationAvailability: 'Assured Irrigation' | 'Partial Irrigation' | 'Rainfed' | 'Micro-Irrigation (Drip/Sprinkler)' | 'Insufficient Data' = 'Insufficient Data';
  let irrigationSource = 'Unspecified';
  let irrigationReliabilityScore10 = 6;
  let hasDrip = false;
  let hasSprinkler = false;

  if (farm?.land) {
    const land = farm.land;
    irrigationSource = String(land.primaryWaterSource || 'Borewell / Canal');
    const isRainfed = (land.primaryWaterSource && String(land.primaryWaterSource).includes('Rainfed')) || 
      (land.rainfedAreaAcres !== undefined && land.rainfedAreaAcres > 0 && !land.irrigatedAreaAcres) || 
      !land.primaryWaterSource;

    hasDrip = Boolean(land.hasDrip || (land.irrigationMethod && String(land.irrigationMethod).includes('Drip')));
    hasSprinkler = Boolean(land.hasSprinkler || (land.irrigationMethod && String(land.irrigationMethod).includes('Sprinkler')));
    irrigationReliabilityScore10 = land.waterReliabilityScore || 
      (land.irrigationReliabilityScore100 ? Math.round(land.irrigationReliabilityScore100 / 10) : (isRainfed ? 4 : 7));

    if (hasDrip || hasSprinkler) {
      irrigationAvailability = 'Micro-Irrigation (Drip/Sprinkler)';
    } else if (isRainfed) {
      irrigationAvailability = 'Rainfed';
    } else if (irrigationReliabilityScore10 >= 7) {
      irrigationAvailability = 'Assured Irrigation';
    } else {
      irrigationAvailability = 'Partial Irrigation';
    }
  }

  // Water Balance Calculation
  const effectiveRainfallMm = Math.round(expectedSeasonalRainfallMm * 0.85); // 85% effective retention
  const waterDeficitMm = Math.max(0, cropWaterMm - (irrigationAvailability === 'Assured Irrigation' || irrigationAvailability === 'Micro-Irrigation (Drip/Sprinkler)' ? cropWaterMm : effectiveRainfallMm));
  const additionalIrrigationRequirementMm = (irrigationAvailability === 'Assured Irrigation' || irrigationAvailability === 'Micro-Irrigation (Drip/Sprinkler)') ? 0 : waterDeficitMm;
  const requiredIrrigationsCount = additionalIrrigationRequirementMm > 0 ? Math.max(1, Math.ceil(additionalIrrigationRequirementMm / 65)) : 0;
  const estimatedIrrigationCostPerAcre = requiredIrrigationsCount > 0 ? requiredIrrigationsCount * 650 : 0;

  // Determine Water Feasibility Status
  let waterStatusCategory: WaterFeasibilityStatus = 'WATER_SUFFICIENT';
  let waterFeasibilityExplanation = '';
  const waterInterventions: string[] = [];

  if (irrigationAvailability === 'Assured Irrigation' || irrigationAvailability === 'Micro-Irrigation (Drip/Sprinkler)') {
    waterStatusCategory = 'WATER_SUFFICIENT';
    waterScore = hasDrip ? 95 : 85;
    waterFeasibilityExplanation = `Assured irrigation capacity satisfies 100% of ${cropName}'s ${cropWaterMm} mm water demand.`;
    positiveFactors.push(`Assured water supply fully meets crop requirement of ${cropWaterMm} mm.`);
    if (hasDrip) {
      positiveFactors.push('Drip micro-irrigation maximizes water-use efficiency (35-45% water savings).');
    }
  } else if (cropWaterMm <= effectiveRainfallMm) {
    waterStatusCategory = 'WATER_SUFFICIENT';
    waterScore = 85;
    waterFeasibilityExplanation = `Expected seasonal rainfall (~${effectiveRainfallMm} mm) meets or exceeds crop demand (${cropWaterMm} mm).`;
    positiveFactors.push(`Rainfall baseline sufficient for low water demand (${cropWaterMm} mm).`);
  } else if (waterDeficitMm <= 250) {
    waterStatusCategory = 'WATER_MANAGEABLE';
    waterScore = 70;
    waterFeasibilityExplanation = `Moderate moisture deficit of ~${waterDeficitMm} mm can be managed with ${requiredIrrigationsCount} supplemental irrigations during critical growth stages.`;
    limitingFactors.push(`Rainfed moisture deficit (~${waterDeficitMm} mm) requires ${requiredIrrigationsCount} supplemental irrigations.`);
    waterInterventions.push(`Provide ${requiredIrrigationsCount} critical stage irrigations (flowering & pod filling).`);
    waterInterventions.push('Apply organic / straw mulching to conserve root zone moisture.');
    
    constraints.push({
      id: `water_deficit_${cropId}`,
      factor: 'WATER',
      problemTitle: `Moderate Moisture Deficit (~${waterDeficitMm} mm)`,
      description: `Crop water requirement (${cropWaterMm} mm) exceeds expected rainfed moisture (~${effectiveRainfallMm} mm) by ~${waterDeficitMm} mm.`,
      classification: 'MANAGEABLE',
      canFarmerManage: true,
      managementOption: `Schedule ${requiredIrrigationsCount} supplemental irrigations at critical vegetative and flowering stages via protective irrigation or farm pond.`,
      additionalRequirement: `${requiredIrrigationsCount} protective irrigations (~${waterDeficitMm} mm total) + in-situ moisture conservation (straw mulch)`,
      costImplication: `Estimated ₹${estimatedIrrigationCostPerAcre.toLocaleString('en-IN')}/acre pumping / protective water cost`,
      estimatedCostPerAcre: estimatedIrrigationCostPerAcre,
      residualRisk: 'LOW',
      impactOnDecision: 'CONDITIONAL_APPROVED'
    });
  } else if (waterDeficitMm <= 550) {
    waterStatusCategory = 'WATER_MANAGEABLE_WITH_INVESTMENT';
    waterScore = 58;
    waterFeasibilityExplanation = `Substantial moisture deficit of ~${waterDeficitMm} mm. Manageable with supplemental irrigation infrastructure or micro-irrigation (Drip/Sprinkler).`;
    limitingFactors.push(`High water deficit (~${waterDeficitMm} mm) under rainfed conditions requires structured supplemental watering.`);
    waterInterventions.push(`Deploy Drip or portable Sprinkler system to supply ${requiredIrrigationsCount} irrigations efficiently.`);
    waterInterventions.push('Construct farm pond (Khet Talab) or access community borewell/tanker.');

    constraints.push({
      id: `water_deficit_high_${cropId}`,
      factor: 'WATER',
      problemTitle: `Substantial Water Deficit (~${waterDeficitMm} mm)`,
      description: `Crop requires ${cropWaterMm} mm total moisture vs expected rainfed availability of ${effectiveRainfallMm} mm.`,
      classification: 'MANAGEABLE_WITH_COST',
      canFarmerManage: true,
      managementOption: `Provide ${requiredIrrigationsCount} structured irrigations using micro-irrigation (Drip/Sprinkler) or rental diesel pump from open well/tank.`,
      additionalRequirement: `Supplemental irrigation setup (${requiredIrrigationsCount} rounds) + drought-tolerant seed variety`,
      costImplication: `Estimated ₹${estimatedIrrigationCostPerAcre.toLocaleString('en-IN')} - ₹${(estimatedIrrigationCostPerAcre * 1.3).toFixed(0)}/acre pumping energy & labour`,
      estimatedCostPerAcre: estimatedIrrigationCostPerAcre,
      residualRisk: 'MEDIUM',
      impactOnDecision: 'CONDITIONAL_APPROVED'
    });
  } else if (waterDeficitMm <= 850) {
    waterStatusCategory = 'WATER_STRESSED';
    waterScore = 42;
    waterFeasibilityExplanation = `Severe moisture deficit of ~${waterDeficitMm} mm. Requires assured external water source or drip infrastructure; highly vulnerable to rain failure.`;
    limitingFactors.push(`Severe water requirement gap (~${waterDeficitMm} mm) creates high crop failure risk without assured water supply.`);
    waterInterventions.push('Ensure assured tube well / canal water connection before sowing.');

    constraints.push({
      id: `water_severe_${cropId}`,
      factor: 'WATER',
      problemTitle: `Severe Water Deficit (~${waterDeficitMm} mm)`,
      description: `High water crop (${cropWaterMm} mm) on rainfed land creates severe mid-season drought stress during reproductive phase.`,
      classification: 'HIGH_CONSTRAINT',
      canFarmerManage: true,
      managementOption: `Only proceed if supplemental groundwater or canal water is confirmed available for at least ${requiredIrrigationsCount} irrigations. Otherwise, choose lower water-demand pulses or millets.`,
      additionalRequirement: `Assured water supply (${requiredIrrigationsCount} irrigations) + Drip irrigation mandatory`,
      costImplication: `Estimated ₹${estimatedIrrigationCostPerAcre.toLocaleString('en-IN')} - ₹${(estimatedIrrigationCostPerAcre * 1.5).toFixed(0)}/acre irrigation budget`,
      estimatedCostPerAcre: estimatedIrrigationCostPerAcre,
      residualRisk: 'HIGH',
      impactOnDecision: 'CONDITIONAL_APPROVED'
    });
  } else {
    // Extreme water deficit (> 850 mm, e.g. Sugarcane 1800mm in 300mm rainfed zone)
    waterStatusCategory = 'WATER_HARD_CONSTRAINT';
    waterScore = 25;
    waterFeasibilityExplanation = `Extreme water requirement (${cropWaterMm} mm) cannot be met under rainfed conditions without perennial assured canal or deep borewell supply.`;
    limitingFactors.push(`Extreme water deficit (~${waterDeficitMm} mm) is agronomically unfeasible under rainfed farming.`);
    hardConstraintReason = `Crop water requirement (${cropWaterMm} mm) exceeds rainfed moisture capacity by over ${waterDeficitMm} mm without assured perennial irrigation.`;

    constraints.push({
      id: `water_hard_${cropId}`,
      factor: 'WATER',
      problemTitle: `Extreme Water Requirement Deficit (~${waterDeficitMm} mm)`,
      description: `Perennial/high-demand crop (${cropWaterMm} mm) cannot survive rainfed dry spells without continuous irrigation.`,
      classification: 'HARD_CONSTRAINT',
      canFarmerManage: false,
      managementOption: `Not feasible under rainfed farming. Requires year-round assured canal or heavy-yield tube well (> 30,000 LPH). Cultivate lower water-footprint crops (e.g. Pulses, Millets, Oilseeds).`,
      additionalRequirement: 'Perennial assured irrigation connection',
      costImplication: 'Economically prohibitive without existing infrastructure',
      estimatedCostPerAcre: estimatedIrrigationCostPerAcre,
      residualRisk: 'HIGH',
      impactOnDecision: 'AVOID_RECOMMENDED'
    });
  }

  const waterFeasibility: WaterFeasibilityAnalysis = {
    status: waterStatusCategory,
    cropWaterRequirementMm: cropWaterMm,
    expectedRainfallMm: expectedSeasonalRainfallMm,
    irrigationAvailability,
    irrigationSource,
    irrigationReliabilityScore10,
    waterDeficitMm,
    additionalIrrigationRequirementMm,
    requiredIrrigationEventsCount: requiredIrrigationsCount,
    estimatedIrrigationCostPerAcre,
    waterloggingRisk: (crop?.waterRequirements?.waterloggingSensitivity === 'High' || crop?.riskFactors?.waterloggingSensitivity === 'High') ? 'High' : 'Low',
    soilWaterRetention: farm?.soil?.soilOrder?.includes('Vertisol') || farm?.soil?.texture?.includes('Clay') ? 'High (Clay / Vertisols)' : 'Medium (Loam)',
    feasibilityExplanation: waterFeasibilityExplanation,
    recommendedInterventions: waterInterventions
  };

  // ----------------------------------------------------
  // 3. SEASON & CLIMATE EVALUATION
  // ----------------------------------------------------
  const cropSeason = crop?.season || 'Multiple seasons';
  const plantingWindow = crop?.plantingWindow || crop?.sowingWindow || 'Standard season';

  if (farm?.targetSeason && farm.targetSeason !== 'ANY') {
    if (cropSeason === 'Multiple seasons' || cropSeason === farm.targetSeason || cropSeason === 'Perennial' || cropSeason === 'Annual / Commercial') {
      seasonScore = 95;
      seasonStatus = 'OPTIMAL';
      positiveFactors.push(`Recommended planting window aligns with ${farm.targetSeason} season.`);
      seasonExplanation = `Direct seasonal match for ${farm.targetSeason}.`;
    } else {
      seasonScore = 35;
      seasonStatus = 'LIMITING';
      limitingFactors.push(`Crop is primarily a ${cropSeason} crop, but target season is ${farm.targetSeason}.`);
      seasonExplanation = `Seasonal mismatch (${cropName} is ${cropSeason}, target is ${farm.targetSeason}).`;

      constraints.push({
        id: `season_mismatch_${cropId}`,
        factor: 'SEASON',
        problemTitle: `Seasonal Window Mismatch`,
        description: `Crop is traditionally cultivated in ${cropSeason} season. Current farm target is ${farm.targetSeason}.`,
        classification: 'HIGH_CONSTRAINT',
        canFarmerManage: false,
        managementOption: `Off-season planting is only viable under protected cultivation (polyhouse / shade-net) or micro-climate adjustments with thermal mulching.`,
        additionalRequirement: `Protected cultivation or delay planting to ${cropSeason} window (${plantingWindow})`,
        costImplication: 'Significant protected cultivation setup if done off-season',
        residualRisk: 'HIGH',
        impactOnDecision: 'AVOID_RECOMMENDED'
      });
    }
  }

  // ----------------------------------------------------
  // 4. GEOGRAPHIC & STATE MATCH
  // ----------------------------------------------------
  if (farm?.location?.state) {
    const farmState = farm.location.state;
    const majorStates = safeArray<string>(crop?.geographic?.majorProducingStates);
    const isMajorState = majorStates.some(st => 
      st && (
        st.toLowerCase().includes(farmState.toLowerCase()) || 
        farmState.toLowerCase().includes(st.toLowerCase())
      )
    );

    if (isMajorState) {
      geographicScore = 95;
      geographicStatus = 'OPTIMAL';
      positiveFactors.push(`${farmState} is a major commercial production zone for ${cropName}.`);
      geographicExplanation = `Major commercial hub in ${farmState}.`;
    } else {
      geographicScore = 70;
      geographicStatus = 'ACCEPTABLE';
      geographicExplanation = `Suitable for cultivation in compatible micro-climates in ${farmState}.`;
    }
  }

  // ----------------------------------------------------
  // OVERALL SUITABILITY & 3-TIER VERDICT
  // ----------------------------------------------------
  const factorDetails: Record<string, SuitabilityFactorDetail> = {
    soil: {
      factorName: 'Soil Profile & Nutrients',
      score: soilScore,
      status: soilStatus,
      explanation: soilExplanation
    },
    water: {
      factorName: 'Water & Irrigation Feasibility',
      score: waterScore,
      status: waterScore >= 80 ? 'OPTIMAL' : waterScore >= 60 ? 'ACCEPTABLE' : waterScore >= 40 ? 'LIMITING' : 'INCOMPATIBLE',
      explanation: waterFeasibilityExplanation
    },
    climate: {
      factorName: 'Agro-Climatic Zone & Temperature',
      score: climateScore,
      status: climateStatus,
      explanation: climateExplanation
    },
    season: {
      factorName: 'Target Sowing Season Alignment',
      score: seasonScore,
      status: seasonStatus,
      explanation: seasonExplanation
    },
    geographic: {
      factorName: 'Regional Cluster & Market Hub',
      score: geographicScore,
      status: geographicStatus,
      explanation: geographicExplanation
    }
  };

  // Weighted average calculation: Soil (25%), Water (35%), Season (20%), Geo (10%), Climate (10%)
  const overallScore = Math.round(
    (soilScore * 0.25) + 
    (waterScore * 0.35) + 
    (seasonScore * 0.20) + 
    (climateScore * 0.10) + 
    (geographicScore * 0.10)
  );

  let suitabilityLevel: CropSuitabilityLevel = 'MODERATELY SUITABLE';
  if (!farm?.soil && !farm?.land) {
    suitabilityLevel = 'INSUFFICIENT DATA';
  } else if (overallScore >= 80) {
    suitabilityLevel = 'HIGHLY SUITABLE';
  } else if (overallScore >= 60) {
    suitabilityLevel = 'MODERATELY SUITABLE';
  } else if (overallScore >= 40) {
    suitabilityLevel = 'MARGINALLY SUITABLE';
  } else {
    suitabilityLevel = 'UNSUITABLE';
  }

  // Determine 3-Tier Recommendation Verdict:
  // 1. RECOMMENDED: Score >= 65, all constraints manageable or no major constraints
  // 2. CONDITIONALLY_RECOMMENDED: Manageable constraints present, score >= 48
  // 3. AVOID: Hard constraints present or score < 48
  // 4. DATA_INSUFFICIENT: Missing critical farm profile
  let recommendationVerdict: ThreeTierRecommendationVerdict = 'RECOMMENDED';
  const hasHardConstraint = constraints.some(c => c.classification === 'HARD_CONSTRAINT');
  const hasManageableConstraints = constraints.some(c => 
    c.classification === 'MANAGEABLE' || 
    c.classification === 'MANAGEABLE_WITH_COST' || 
    c.classification === 'PARTIALLY_MANAGEABLE' ||
    c.classification === 'HIGH_CONSTRAINT'
  );

  if (!farm?.soil && !farm?.land) {
    recommendationVerdict = 'DATA_INSUFFICIENT';
  } else if (hasHardConstraint || overallScore < 45) {
    recommendationVerdict = 'AVOID';
    if (!hardConstraintReason) {
      hardConstraintReason = constraints.find(c => c.classification === 'HARD_CONSTRAINT')?.problemTitle || 
        'Overall agronomic suitability score falls below the minimum viable threshold.';
    }
  } else if (hasManageableConstraints || overallScore < 65) {
    recommendationVerdict = 'CONDITIONALLY_RECOMMENDED';
  } else {
    recommendationVerdict = 'RECOMMENDED';
  }

  // Construct Conditional Management Plan if Conditionally Recommended or has manageable constraints
  let conditionalManagementPlan: ConditionalManagementPlan | undefined = undefined;
  if (recommendationVerdict === 'CONDITIONALLY_RECOMMENDED' || (constraints.length > 0 && recommendationVerdict === 'RECOMMENDED')) {
    const totalAdditionalCost = constraints.reduce((sum, c) => sum + (c.estimatedCostPerAcre || 0), 0);
    const problemSummaries = constraints.map(c => c.problemTitle);
    const managementOptions = constraints.map(c => c.managementOption);
    const additionalRequirements = constraints.map(c => c.additionalRequirement);

    conditionalManagementPlan = {
      problemSummary: problemSummaries.length > 0 ? problemSummaries.join('; ') : 'Suboptimal soil moisture / nutrient parameters detected.',
      managementOptions: managementOptions.length > 0 ? managementOptions : ['Apply recommended agronomic interventions prior to planting.'],
      additionalRequirements: additionalRequirements.length > 0 ? additionalRequirements : ['Standard ICAR package of practices'],
      costImplicationSummary: totalAdditionalCost > 0 ? `Total estimated management investment: ₹${totalAdditionalCost.toLocaleString('en-IN')}/acre` : 'Nominal management cost within standard operations',
      totalAdditionalManagementCostPerAcre: totalAdditionalCost,
      residualRiskSummary: constraints.some(c => c.residualRisk === 'HIGH') ? 'Moderate to High (dependent on weather/aquifer reliability)' : 'Low to Moderate with diligent execution',
      economicSenseEvaluation: `With an additional management outlay of ₹${totalAdditionalCost.toLocaleString('en-IN')}/acre, the crop remains economically viable with positive projected net realization.`,
      finalDecisionReasoning: `CONDITIONALLY RECOMMENDED: Viable for commercial cultivation provided the identified management protocols are implemented.`
    };
  }

  return {
    cropId,
    cropName,
    category,
    overallScore,
    suitabilityLevel,
    recommendationVerdict,
    factorScores: {
      soilScore,
      waterScore,
      climateScore,
      seasonScore,
      geographicScore
    },
    factorDetails,
    limitingFactors,
    positiveFactors,
    constraints,
    waterFeasibility,
    conditionalManagementPlan,
    hardConstraintReason,
    agronomicRecommendations,
    evaluatedAt: new Date().toISOString()
  };
}

/**
 * Evaluates all crops in the India Crop Master database against the farm profile and sorts by suitability score
 */
export function rankAllCropsForFarm(
  farm: FarmContextForSuitability,
  cropCategory?: string,
  seasonFilter?: CropSeason | 'ANY'
): { crop: CropMasterRecord; suitability: CropSuitabilityResult }[] {
  let crops = COMPLETE_INDIA_CROP_MASTER || [];

  if (cropCategory && cropCategory !== 'ALL') {
    crops = crops.filter(c => c && c.category === cropCategory);
  }

  const effectiveSeason = seasonFilter || farm?.targetSeason || 'ANY';
  const effectiveFarm = { ...(farm || {}), targetSeason: effectiveSeason };

  const results = crops.map(crop => ({
    crop,
    suitability: evaluateCropSuitability(crop, effectiveFarm)
  }));

  // Sort descending by overall suitability score
  results.sort((a, b) => (b?.suitability?.overallScore ?? 0) - (a?.suitability?.overallScore ?? 0));

  return results;
}

export const cropSuitabilityEngine = {
  evaluateCropSuitability,
  rankAllCropsForFarm
};
