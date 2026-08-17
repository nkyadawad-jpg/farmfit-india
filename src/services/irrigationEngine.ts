/**
 * FARMFIT Irrigation Engine & Water Reliability Model
 * 
 * Computes:
 * 1. Irrigation Reliability Score (0 to 100)
 * 2. Rainfall Dependency Percentage (%)
 * 3. Irrigated Land Percentage (%)
 * 4. Rainfed Land Percentage (%)
 * 
 * Formula uses transparent, configurable agronomic weights based on:
 * - Assured water availability duration (months per year)
 * - Ratio of irrigated land vs total farm area
 * - Intrinsic reliability of primary and secondary water sources (Canal / Borewell / Open Well / Pond / River)
 * - Water delivery technology efficiency (Drip 90%+, Sprinkler 75%, Flood/Furrow 50%)
 * - Farmer-reported source reliability rating (High / Moderate / Low)
 * - Seasonal hydrological stress penalties (Summer depletion, Kharif only, Electricity roster)
 */

export interface IrrigationParameters {
  totalLandAcres: number;
  irrigatedAreaAcres: number;
  rainfedAreaAcres: number;
  hasBorewell: boolean;
  hasOpenWell: boolean;
  hasCanal: boolean;
  hasRiverLift: boolean;
  hasFarmPond: boolean;
  hasDrip: boolean;
  hasSprinkler: boolean;
  hasFloodOther: boolean;
  monthsWaterAvailable: number; // 1 to 12
  irrigationFrequency: 'Daily' | 'Alternate Days' | 'Weekly' | 'Fortnightly' | 'Critical Stages Only' | 'As per Canal Roster';
  sourceReliability: 'High (Perennial / Assured)' | 'Moderate (Seasonal Dip)' | 'Low (Unpredictable / Depleted in Summer)';
  seasonalLimitations: 'None' | 'Summer Scarcity (March-June)' | 'Winter & Summer Dip' | 'Kharif Only Available' | 'Frequent Power Roster Cuts' | 'Salinity Ingress';
}

export interface IrrigationEngineWeights {
  durationWeight: number; // e.g. 0.30
  areaRatioWeight: number; // e.g. 0.25
  sourceQualityWeight: number; // e.g. 0.20
  deliveryTechWeight: number; // e.g. 0.15
  reliabilitySelfRatingWeight: number; // e.g. 0.10
}

export const DEFAULT_IRRIGATION_WEIGHTS: IrrigationEngineWeights = {
  durationWeight: 0.30,
  areaRatioWeight: 0.25,
  sourceQualityWeight: 0.20,
  deliveryTechWeight: 0.15,
  reliabilitySelfRatingWeight: 0.10
};

export interface IrrigationBreakdownComponent {
  componentName: string;
  weightPercent: number;
  rawScore: number; // 0 to 100
  weightedContribution: number; // rawScore * weight
  explanation: string;
}

export interface IrrigationAnalysisResult {
  reliabilityScore: number; // 0 to 100
  rainfallDependencyPercent: number; // 0 to 100%
  irrigatedLandPercent: number; // 0 to 100%
  rainfedLandPercent: number; // 0 to 100%
  waterSecurityCategory: 'High Security' | 'Moderate Security' | 'Vulnerable / Rain-Dependent' | 'Critical Stress';
  breakdown: IrrigationBreakdownComponent[];
  seasonalPenaltyApplied: number;
  recommendations: string[];
}

export function calculateIrrigationReliability(
  params: IrrigationParameters,
  weights: IrrigationEngineWeights = DEFAULT_IRRIGATION_WEIGHTS
): IrrigationAnalysisResult {
  const totalArea = Math.max(0.01, params.totalLandAcres);
  const irrigatedArea = Math.min(totalArea, Math.max(0, params.irrigatedAreaAcres));
  const rainfedArea = Math.max(0, totalArea - irrigatedArea);

  const irrigatedLandPercent = Number(((irrigatedArea / totalArea) * 100).toFixed(1));
  const rainfedLandPercent = Number((100 - irrigatedLandPercent).toFixed(1));

  // 1. Duration Score (0 to 100): Months water is available (12 months = 100, 6 months = 50)
  const durationMonths = Math.min(12, Math.max(1, params.monthsWaterAvailable));
  const durationScore = (durationMonths / 12) * 100;

  // 2. Area Ratio Score (0 to 100): Percentage of land irrigated
  const areaRatioScore = irrigatedLandPercent;

  // 3. Source Quality Score (0 to 100)
  let sourceScore = 0;
  let sourceCount = 0;
  if (params.hasCanal) { sourceScore += 85; sourceCount++; }
  if (params.hasBorewell) { sourceScore += 80; sourceCount++; }
  if (params.hasRiverLift) { sourceScore += 75; sourceCount++; }
  if (params.hasOpenWell) { sourceScore += 65; sourceCount++; }
  if (params.hasFarmPond) { sourceScore += 60; sourceCount++; }
  
  // If multiple complementary sources (e.g. Borewell + Canal or Open Well + Farm Pond), award resilience bonus
  let baseSourceQuality = sourceCount > 0 ? (sourceScore / sourceCount) : 10;
  if (sourceCount >= 2) {
    baseSourceQuality = Math.min(100, baseSourceQuality + 15); // multi-source buffer
  }
  if (!params.hasCanal && !params.hasBorewell && !params.hasOpenWell && !params.hasRiverLift && !params.hasFarmPond) {
    baseSourceQuality = 15; // pure rainfed baseline
  }

  // 4. Delivery Method Tech Efficiency Score (0 to 100)
  let techScore = 40; // baseline flood
  if (params.hasDrip && params.hasSprinkler) {
    techScore = 95;
  } else if (params.hasDrip) {
    techScore = 90;
  } else if (params.hasSprinkler) {
    techScore = 75;
  } else if (params.hasFloodOther) {
    techScore = 45;
  }

  // 5. Reliability Self-Rating Score
  let selfRatingScore = 70;
  if (params.sourceReliability === 'High (Perennial / Assured)') selfRatingScore = 100;
  if (params.sourceReliability === 'Moderate (Seasonal Dip)') selfRatingScore = 60;
  if (params.sourceReliability === 'Low (Unpredictable / Depleted in Summer)') selfRatingScore = 25;

  // Weighted Base Calculation
  const c1 = durationScore * weights.durationWeight;
  const c2 = areaRatioScore * weights.areaRatioWeight;
  const c3 = baseSourceQuality * weights.sourceQualityWeight;
  const c4 = techScore * weights.deliveryTechWeight;
  const c5 = selfRatingScore * weights.reliabilitySelfRatingWeight;

  let rawCalculated = c1 + c2 + c3 + c4 + c5;

  // Seasonal Limitation Deductions
  let penalty = 0;
  if (params.seasonalLimitations === 'Summer Scarcity (March-June)') penalty = 8;
  else if (params.seasonalLimitations === 'Winter & Summer Dip') penalty = 15;
  else if (params.seasonalLimitations === 'Kharif Only Available') penalty = 25;
  else if (params.seasonalLimitations === 'Frequent Power Roster Cuts') penalty = 10;
  else if (params.seasonalLimitations === 'Salinity Ingress') penalty = 12;

  const finalScore = Math.max(5, Math.min(100, Math.round(rawCalculated - penalty)));

  // Rainfall dependency is inverse to irrigation reliability and rainfed land proportion
  const rainfallDependency = Math.max(0, Math.min(100, Math.round(
    (rainfedLandPercent * 0.6) + ((100 - finalScore) * 0.4)
  )));

  let category: IrrigationAnalysisResult['waterSecurityCategory'] = 'High Security';
  if (finalScore < 30) category = 'Critical Stress';
  else if (finalScore < 55) category = 'Vulnerable / Rain-Dependent';
  else if (finalScore < 75) category = 'Moderate Security';

  const breakdown: IrrigationBreakdownComponent[] = [
    {
      componentName: "Water Availability Duration",
      weightPercent: Math.round(weights.durationWeight * 100),
      rawScore: Math.round(durationScore),
      weightedContribution: Number(c1.toFixed(1)),
      explanation: `${durationMonths} months of dependable farm water per agricultural year.`
    },
    {
      componentName: "Irrigated Land Ratio",
      weightPercent: Math.round(weights.areaRatioWeight * 100),
      rawScore: Math.round(areaRatioScore),
      weightedContribution: Number(c2.toFixed(1)),
      explanation: `${irrigatedLandPercent}% of farm land equipped with active water infrastructure.`
    },
    {
      componentName: "Source Diversity & Quality",
      weightPercent: Math.round(weights.sourceQualityWeight * 100),
      rawScore: Math.round(baseSourceQuality),
      weightedContribution: Number(c3.toFixed(1)),
      explanation: `${sourceCount > 0 ? sourceCount : 0} active water sources configured with hydrological buffer.`
    },
    {
      componentName: "Delivery Tech Efficiency",
      weightPercent: Math.round(weights.deliveryTechWeight * 100),
      rawScore: Math.round(techScore),
      weightedContribution: Number(c4.toFixed(1)),
      explanation: params.hasDrip ? "Micro-irrigation (Drip) achieves 90%+ water-use efficiency." : params.hasSprinkler ? "Sprinkler system provides 75% efficiency." : "Conventional surface / flood distribution."
    },
    {
      componentName: "Source Stability Rating",
      weightPercent: Math.round(weights.reliabilitySelfRatingWeight * 100),
      rawScore: Math.round(selfRatingScore),
      weightedContribution: Number(c5.toFixed(1)),
      explanation: `Farmer observed reliability level: ${params.sourceReliability}.`
    }
  ];

  const recommendations: string[] = [];
  if (!params.hasDrip && irrigatedArea > 0) {
    recommendations.push("Consider PMKSY (Pradhan Mantri Krishi Sinchayee Yojana) subsidized drip irrigation to increase water efficiency by 40-50%.");
  }
  if (durationMonths < 8) {
    recommendations.push("Rainwater harvesting farm pond or check dam recommended to buffer winter/Rabi crop critical stages.");
  }
  if (rainfedLandPercent > 50) {
    recommendations.push("High rainfall dependency detected; prioritize drought-hardy crops (Millets, Pulses, Mustard) or ensure PMFBY crop insurance.");
  }

  return {
    reliabilityScore: finalScore,
    rainfallDependencyPercent: rainfallDependency,
    irrigatedLandPercent,
    rainfedLandPercent,
    waterSecurityCategory: category,
    breakdown,
    seasonalPenaltyApplied: penalty,
    recommendations
  };
}
