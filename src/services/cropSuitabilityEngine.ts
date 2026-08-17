import { 
  CropMasterRecord, 
  CropSuitabilityResult, 
  CropSuitabilityLevel, 
  SuitabilityFactorDetail,
  FarmLocation, 
  LandIrrigationProfile, 
  SoilProfileRecord,
  CropSeason
} from '../types';
import { COMPLETE_INDIA_CROP_MASTER } from '../data/cropMasterIndex';

export interface FarmContextForSuitability {
  location?: Partial<FarmLocation>;
  land?: Partial<LandIrrigationProfile>;
  soil?: Partial<SoilProfileRecord>;
  targetSeason?: CropSeason | 'ANY';
  plantingMonth?: number; // 1 to 12
}

/**
 * Calculates suitability for a specific crop based on farm context
 */
export function evaluateCropSuitability(
  crop: CropMasterRecord,
  farm: FarmContextForSuitability
): CropSuitabilityResult {
  const limitingFactors: string[] = [];
  const positiveFactors: string[] = [];
  const agronomicRecommendations: string[] = [];

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

  // ----------------------------------------------------
  // 1. SOIL EVALUATION
  // ----------------------------------------------------
  if (farm.soil) {
    const soil = farm.soil;
    let soilDeduction = 0;
    let soilBonus = 0;

    // Soil Type match
    const farmSoilType = soil.soilType || soil.soilOrder || '';
    if (farmSoilType) {
      const matchSoilType = crop.soilRequirements.soilTypes.some(st => 
        st.toLowerCase().includes(farmSoilType.toLowerCase()) || 
        farmSoilType.toLowerCase().includes(st.toLowerCase().split(' ')[0])
      );

      if (matchSoilType) {
        soilBonus += 15;
        positiveFactors.push(`Soil type (${farmSoilType}) is highly suitable for ${crop.cropName}.`);
      } else {
        soilDeduction += 15;
        limitingFactors.push(`Crop typically prefers: ${crop.soilRequirements.soilTypes.slice(0, 2).join(', ')}, but farm soil is ${farmSoilType}.`);
      }
    }

    // pH match
    let ph: number | undefined;
    if (typeof soil.ph === 'number') {
      ph = soil.ph;
    } else if (soil.ph && typeof (soil.ph as { value?: number }).value === 'number') {
      ph = (soil.ph as { value: number }).value;
    }

    if (typeof ph === 'number' && !isNaN(ph)) {
      const { min, max, optimalMin, optimalMax } = crop.soilRequirements.pHRange;

      if (optimalMin && optimalMax && ph >= optimalMin && ph <= optimalMax) {
        soilBonus += 15;
        positiveFactors.push(`Soil pH (${ph}) is in the optimal range (${optimalMin} - ${optimalMax}).`);
      } else if (ph >= min && ph <= max) {
        soilBonus += 5;
        positiveFactors.push(`Soil pH (${ph}) is within tolerable range (${min} - ${max}).`);
      } else if (ph < min) {
        soilDeduction += 25;
        limitingFactors.push(`Soil pH (${ph}) is more acidic than recommended minimum (${min}).`);
        agronomicRecommendations.push(`Apply agricultural lime / dolomite to raise soil pH towards ${min.toFixed(1)}.`);
      } else if (ph > max) {
        soilDeduction += 25;
        limitingFactors.push(`Soil pH (${ph}) is more alkaline than recommended maximum (${max}).`);
        agronomicRecommendations.push(`Apply gypsum / organic compost / pressmud to lower soil alkalinity towards ${max.toFixed(1)}.`);
      }
    }

    // Soil Drainage match
    if (soil.drainage && crop.soilRequirements.drainage) {
      const isSensitiveToWaterlogging = crop.waterRequirements.waterloggingSensitivity === 'High';
      const isPoorDrainage = soil.drainage.toLowerCase().includes('poor') || soil.drainage.toLowerCase().includes('stagnat');

      if (isPoorDrainage && isSensitiveToWaterlogging) {
        soilDeduction += 20;
        limitingFactors.push(`Farm has poor drainage/water stagnation, while ${crop.cropName} is highly sensitive to waterlogging.`);
        agronomicRecommendations.push(`Construct raised beds or Broad Bed Furrow (BBF) systems with drainage channels.`);
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
  // 2. WATER & IRRIGATION EVALUATION
  // ----------------------------------------------------
  if (farm.land) {
    const land = farm.land;
    let waterDeduction = 0;
    let waterBonus = 0;

    const isRainfed = (land.primaryWaterSource && String(land.primaryWaterSource).includes('Rainfed')) || (land.rainfedAreaAcres !== undefined && land.rainfedAreaAcres > 0 && !land.irrigatedAreaAcres) || !land.primaryWaterSource;
    const hasDrip = land.hasDrip || (land.irrigationMethod && String(land.irrigationMethod).includes('Drip'));
    const hasSprinkler = land.hasSprinkler || (land.irrigationMethod && String(land.irrigationMethod).includes('Sprinkler'));
    const waterReliability = land.waterReliabilityScore || (land.irrigationReliabilityScore100 ? Math.round(land.irrigationReliabilityScore100 / 10) : 5);

    // High water requirement crop on rainfed land
    if (crop.waterRequirements.waterRequirementLevel === 'High (> 800 mm)') {
      if (isRainfed) {
        waterDeduction += 35;
        limitingFactors.push(`High water crop (~${crop.waterRequirements.waterRequirementMm}mm required) selected on Rainfed land without assured irrigation.`);
        agronomicRecommendations.push(`Ensure assured irrigation or consider lower water-demand pulses/millets.`);
      } else if (waterReliability < 5) {
        waterDeduction += 20;
        limitingFactors.push(`Water source reliability (${waterReliability}/10) is low for high water-demand crop.`);
      } else {
        waterBonus += 20;
        positiveFactors.push(`Assured irrigation available for high water requirement crop.`);
      }
    } else if (crop.waterRequirements.waterRequirementLevel === 'Low (< 400 mm)') {
      if (isRainfed) {
        waterBonus += 15;
        positiveFactors.push(`Crop is highly drought-hardy and ideal for rainfed farming.`);
      } else {
        waterBonus += 10;
        positiveFactors.push(`Crop has low water footprint (~${crop.waterRequirements.waterRequirementMm}mm).`);
      }
    }

    if (hasDrip) {
      waterBonus += 10;
      positiveFactors.push(`Farm equipped with Drip Irrigation, ensuring precision water and nutrient delivery.`);
    }

    waterScore = Math.max(10, Math.min(100, 65 + waterBonus - waterDeduction));
    if (waterScore >= 80) waterStatus = 'OPTIMAL';
    else if (waterScore >= 60) waterStatus = 'ACCEPTABLE';
    else if (waterScore >= 40) waterStatus = 'LIMITING';
    else waterStatus = 'INCOMPATIBLE';

    waterExplanation = `Water & irrigation match score: ${waterScore}/100.`;
  } else {
    waterStatus = 'DATA_NOT_CONNECTED';
    waterExplanation = 'Land & irrigation profile not configured.';
  }

  // ----------------------------------------------------
  // 3. SEASON EVALUATION
  // ----------------------------------------------------
  if (farm.targetSeason && farm.targetSeason !== 'ANY') {
    if (crop.season === 'Multiple seasons' || crop.season === farm.targetSeason || crop.season === 'Perennial' || crop.season === 'Annual / Commercial') {
      seasonScore = 95;
      seasonStatus = 'OPTIMAL';
      positiveFactors.push(`Crop is recommended for ${farm.targetSeason} season.`);
      seasonExplanation = `Direct seasonal match for ${farm.targetSeason}.`;
    } else {
      seasonScore = 30;
      seasonStatus = 'LIMITING';
      limitingFactors.push(`Crop is primarily a ${crop.season} crop, but target season is set to ${farm.targetSeason}.`);
      agronomicRecommendations.push(`Align planting with recommended window: ${crop.plantingWindow}.`);
      seasonExplanation = `Season mismatch (Crop is ${crop.season}, farm target is ${farm.targetSeason}).`;
    }
  }

  // ----------------------------------------------------
  // 4. GEOGRAPHIC & STATE MATCH
  // ----------------------------------------------------
  if (farm.location?.state) {
    const farmState = farm.location.state;
    const isMajorState = crop.geographic.majorProducingStates.some(st => 
      st.toLowerCase().includes(farmState.toLowerCase()) || 
      farmState.toLowerCase().includes(st.toLowerCase())
    );

    if (isMajorState) {
      geographicScore = 95;
      geographicStatus = 'OPTIMAL';
      positiveFactors.push(`${farmState} is an established major commercial production hub for ${crop.cropName}.`);
      geographicExplanation = `Major commercial hub in ${farmState}.`;
    } else {
      geographicScore = 70;
      geographicStatus = 'ACCEPTABLE';
      geographicExplanation = `Can be grown in suitable micro-climates in ${farmState}.`;
    }
  }

  // ----------------------------------------------------
  // OVERALL SUITABILITY CALCULATION
  // ----------------------------------------------------
  const factorDetails: Record<string, SuitabilityFactorDetail> = {
    soil: {
      factorName: 'Soil Profile Compatibility',
      score: soilScore,
      status: soilStatus,
      explanation: soilExplanation
    },
    water: {
      factorName: 'Irrigation & Water Matching',
      score: waterScore,
      status: waterStatus,
      explanation: waterExplanation
    },
    climate: {
      factorName: 'Agro-Climatic Zone & Elevation',
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
      factorName: 'State & Regional Cluster Alignment',
      score: geographicScore,
      status: geographicStatus,
      explanation: geographicExplanation
    }
  };

  // Weighted average: Soil (30%), Water (30%), Season (20%), Geo (10%), Climate (10%)
  const overallScore = Math.round(
    (soilScore * 0.30) + 
    (waterScore * 0.30) + 
    (seasonScore * 0.20) + 
    (climateScore * 0.10) + 
    (geographicScore * 0.10)
  );

  let suitabilityLevel: CropSuitabilityLevel = 'MODERATELY SUITABLE';
  if (!farm.soil && !farm.land) {
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

  if (agronomicRecommendations.length === 0) {
    if (crop.agronomy.fertilizerRequirements.note) {
      agronomicRecommendations.push(crop.agronomy.fertilizerRequirements.note);
    }
  }

  return {
    cropId: crop.cropId,
    cropName: crop.cropName,
    category: crop.category,
    overallScore,
    suitabilityLevel,
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
  let crops = COMPLETE_INDIA_CROP_MASTER;

  if (cropCategory && cropCategory !== 'ALL') {
    crops = crops.filter(c => c.category === cropCategory);
  }

  const effectiveSeason = seasonFilter || farm.targetSeason || 'ANY';
  const effectiveFarm = { ...farm, targetSeason: effectiveSeason };

  const results = crops.map(crop => ({
    crop,
    suitability: evaluateCropSuitability(crop, effectiveFarm)
  }));

  // Sort descending by overall suitability score
  results.sort((a, b) => b.suitability.overallScore - a.suitability.overallScore);

  return results;
}
