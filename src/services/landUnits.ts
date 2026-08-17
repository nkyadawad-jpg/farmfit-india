/**
 * FARMFIT Land & Irrigation Engine Models and Unit Standardizers
 * Comprehensive Indian Land Units, Multi-Plot Architecture, Irrigation Scoring & Water Risk
 */

export type LandUnit =
  | 'Acre'
  | 'Hectare'
  | 'Guntha/Gunta'
  | 'Cent'
  | 'Bigha'
  | 'Kanal'
  | 'Marla'
  | 'Square metre'
  | 'Square feet'
  | 'Custom/local unit';

export interface LandUnitConversionRule {
  unit: LandUnit;
  labelEn: string;
  labelHi: string;
  sqMetersPerUnit: number;
  acresPerUnit: number;
  hectaresPerUnit: number;
  regionNote: string;
}

// Precise conversion factors against standard metric and imperial units
export const LAND_UNIT_CONVERSIONS: Record<LandUnit, LandUnitConversionRule> = {
  'Acre': {
    unit: 'Acre',
    labelEn: 'Acre (एकड़)',
    labelHi: 'एकड़ (Acre)',
    sqMetersPerUnit: 4046.8564,
    acresPerUnit: 1.0,
    hectaresPerUnit: 0.40468564,
    regionNote: 'Standard all-India unit (1 Acre = 4,046.86 m² = 0.4047 Ha)'
  },
  'Hectare': {
    unit: 'Hectare',
    labelEn: 'Hectare (हेक्टेयर)',
    labelHi: 'हेक्टेयर (Hectare)',
    sqMetersPerUnit: 10000,
    acresPerUnit: 2.47105381,
    hectaresPerUnit: 1.0,
    regionNote: 'Metric standard (10,000 m² = 2.471 Acres)'
  },
  'Guntha/Gunta': {
    unit: 'Guntha/Gunta',
    labelEn: 'Guntha / Gunta (गुंठा)',
    labelHi: 'गुंठा (Guntha)',
    sqMetersPerUnit: 101.1714,
    acresPerUnit: 0.025, // 1 Acre = 40 Gunthas
    hectaresPerUnit: 0.01011714,
    regionNote: 'Maharashtra, Karnataka, Gujarat, Telangana (1 Acre = 40 Gunthas)'
  },
  'Cent': {
    unit: 'Cent',
    labelEn: 'Cent (सेंट)',
    labelHi: 'सेंट (Cent)',
    sqMetersPerUnit: 40.4686,
    acresPerUnit: 0.01, // 1 Acre = 100 Cents
    hectaresPerUnit: 0.00404686,
    regionNote: 'Tamil Nadu, Kerala, Andhra Pradesh, Karnataka (1 Acre = 100 Cents)'
  },
  'Bigha': {
    unit: 'Bigha',
    labelEn: 'Bigha (बीघा - Standard ~0.625 Acre)',
    labelHi: 'बीघा (Bigha)',
    sqMetersPerUnit: 2529.285,
    acresPerUnit: 0.625,
    hectaresPerUnit: 0.2529285,
    regionNote: 'Standard Pucca Bigha (MP, UP, Rajasthan, Bihar ~0.625 Acre)'
  },
  'Kanal': {
    unit: 'Kanal',
    labelEn: 'Kanal (कनाल)',
    labelHi: 'कनाल (Kanal)',
    sqMetersPerUnit: 505.857,
    acresPerUnit: 0.125, // 1 Acre = 8 Kanals
    hectaresPerUnit: 0.0505857,
    regionNote: 'Punjab, Haryana, Himachal Pradesh, J&K (1 Acre = 8 Kanals)'
  },
  'Marla': {
    unit: 'Marla',
    labelEn: 'Marla (मरला)',
    labelHi: 'मरला (Marla)',
    sqMetersPerUnit: 25.2928,
    acresPerUnit: 0.00625, // 1 Kanal = 20 Marlas, 1 Acre = 160 Marlas
    hectaresPerUnit: 0.00252928,
    regionNote: 'Punjab, Haryana, Himachal Pradesh (1 Kanal = 20 Marlas)'
  },
  'Square metre': {
    unit: 'Square metre',
    labelEn: 'Square Metre (वर्ग मीटर)',
    labelHi: 'वर्ग मीटर (Square Metre)',
    sqMetersPerUnit: 1.0,
    acresPerUnit: 0.000247105,
    hectaresPerUnit: 0.0001,
    regionNote: 'SI Base Metric Unit (m²)'
  },
  'Square feet': {
    unit: 'Square feet',
    labelEn: 'Square Feet (वर्ग फुट)',
    labelHi: 'वर्ग फुट (Square Feet)',
    sqMetersPerUnit: 0.092903,
    acresPerUnit: 0.0000229568, // 1 Acre = 43,560 sq ft
    hectaresPerUnit: 0.0000092903,
    regionNote: '1 Acre = 43,560 sq.ft'
  },
  'Custom/local unit': {
    unit: 'Custom/local unit',
    labelEn: 'Custom / Local Unit (स्थानीय इकाई)',
    labelHi: 'कस्टम / स्थानीय इकाई',
    sqMetersPerUnit: 4046.8564,
    acresPerUnit: 1.0,
    hectaresPerUnit: 0.40468564,
    regionNote: 'User defined local conversion factor'
  }
};

export interface NormalizedLandArea {
  originalValue: number;
  originalUnit: LandUnit;
  customUnitName?: string;
  customUnitToAcresRatio?: number;
  normalizedAcres: number;
  normalizedHectares: number;
  normalizedSquareMetres: number;
}

export function formatLandDisplay(areaAcres: number): string {
  const acres = isNaN(areaAcres) ? 0 : areaAcres;
  const ha = (acres * 0.40468564).toFixed(2);
  return `${acres.toFixed(2)} Acres (${ha} Ha)`;
}

export function normalizeLandArea(
  value: number,
  unit: LandUnit,
  customUnitName?: string,
  customUnitToAcresRatio?: number
): NormalizedLandArea {
  const safeVal = isNaN(value) || value < 0 ? 0 : value;

  if (unit === 'Custom/local unit' && customUnitToAcresRatio && customUnitToAcresRatio > 0) {
    const acres = safeVal * customUnitToAcresRatio;
    const hectares = acres * 0.40468564;
    const sqMeters = acres * 4046.8564;
    return {
      originalValue: safeVal,
      originalUnit: unit,
      customUnitName: customUnitName || 'Local Unit',
      customUnitToAcresRatio,
      normalizedAcres: Number(acres.toFixed(4)),
      normalizedHectares: Number(hectares.toFixed(4)),
      normalizedSquareMetres: Number(sqMeters.toFixed(2))
    };
  }

  const rule = LAND_UNIT_CONVERSIONS[unit] || LAND_UNIT_CONVERSIONS['Acre'];
  const acres = safeVal * rule.acresPerUnit;
  const hectares = safeVal * rule.hectaresPerUnit;
  const sqMeters = safeVal * rule.sqMetersPerUnit;

  return {
    originalValue: safeVal,
    originalUnit: unit,
    normalizedAcres: Number(acres.toFixed(4)),
    normalizedHectares: Number(hectares.toFixed(4)),
    normalizedSquareMetres: Number(sqMeters.toFixed(2))
  };
}

// -------------------------------------------------------------
// MULTI-PLOT DATA ARCHITECTURE (Prepared for modular expansion)
// -------------------------------------------------------------
export interface FarmPlot {
  id: string;
  name: string; // e.g. "Plot 1 (North Field)", "Plot 2"
  areaDisplay: number;
  areaUnit: LandUnit;
  normalizedAcres: number;
  isIrrigated: boolean;
  irrigationSource?: string;
  soilType?: string;
  currentCrop?: string;
  proposedCrop?: string;
  notes?: string;
}

// -------------------------------------------------------------
// IRRIGATION SOURCES
// -------------------------------------------------------------
export type IrrigationSourceType =
  | 'Borewell'
  | 'Open well'
  | 'Canal'
  | 'River'
  | 'Farm pond'
  | 'Reservoir'
  | 'Drip irrigation'
  | 'Sprinkler'
  | 'Rainwater harvesting'
  | 'Community irrigation'
  | 'Other'
  | 'Rainfed only';

export const ALL_IRRIGATION_SOURCES: Array<{
  id: IrrigationSourceType;
  label: string;
  category: 'groundwater' | 'surface' | 'harvesting' | 'micro' | 'rainfed';
  description: string;
}> = [
  { id: 'Borewell', label: 'Borewell', category: 'groundwater', description: 'Deep tube well with electric/solar pump' },
  { id: 'Open well', label: 'Open well', category: 'groundwater', description: 'Dug well with surface/submersible pump' },
  { id: 'Canal', label: 'Canal', category: 'surface', description: 'Government or cooperative canal command area' },
  { id: 'River', label: 'River', category: 'surface', description: 'River lift irrigation or perennial stream' },
  { id: 'Farm pond', label: 'Farm pond', category: 'harvesting', description: 'On-farm lined/unlined water harvesting pond' },
  { id: 'Reservoir', label: 'Reservoir', category: 'surface', description: 'Check dam, lake, or public reservoir' },
  { id: 'Drip irrigation', label: 'Drip irrigation', category: 'micro', description: 'Precision micro-irrigation network' },
  { id: 'Sprinkler', label: 'Sprinkler', category: 'micro', description: 'Overhead sprinkler irrigation set' },
  { id: 'Rainwater harvesting', label: 'Rainwater harvesting', category: 'harvesting', description: 'Trench, bund, or rooftop catchment system' },
  { id: 'Community irrigation', label: 'Community irrigation', category: 'surface', description: 'Shared village/panchayat irrigation scheme' },
  { id: 'Other', label: 'Other', category: 'surface', description: 'Other localized water delivery system' },
  { id: 'Rainfed only', label: 'Rainfed only', category: 'rainfed', description: 'No assured irrigation; 100% dependent on monsoon' }
];

export type QualitativeRating = 'Very Low' | 'Low' | 'Moderate' | 'High' | 'Very High';

// -------------------------------------------------------------
// CENTRAL CONFIGURABLE SCORING WEIGHTS
// -------------------------------------------------------------
export interface IrrigationReliabilityWeights {
  assuredIrrigationLandRatioWeight: number; // 0.25
  waterSourceQualityWeight: number;         // 0.20
  monthsAvailabilityWeight: number;         // 0.25
  seasonalCoverageWeight: number;           // 0.15
  farmerReportedReliabilityWeight: number;  // 0.15
}

export const CENTRAL_IRRIGATION_WEIGHTS: IrrigationReliabilityWeights = {
  assuredIrrigationLandRatioWeight: 0.25,
  waterSourceQualityWeight: 0.20,
  monthsAvailabilityWeight: 0.25,
  seasonalCoverageWeight: 0.15,
  farmerReportedReliabilityWeight: 0.15
};

export interface IrrigationAssessmentInput {
  totalFarmArea: number;
  cultivatedArea: number;
  fallowArea: number;
  proposedCropArea: number;
  irrigatedArea: number;
  rainfedArea: number;
  bothIrrigationAndRainfedArea?: boolean;
  selectedSources: IrrigationSourceType[];
  monthsReliableWater: number; // 0 - 12
  monthsWaterShortage: number; // 0 - 12
  sourceReliability: QualitativeRating;
  typicalFrequency: 'Daily' | 'Alternate Days' | 'Weekly' | 'Fortnightly' | 'Critical Stages Only' | 'As per Canal Roster';
  availableInSummer: boolean;
  availableInMonsoon: boolean;
  availableInWinter: boolean;
}

export interface IrrigationAssessmentOutput {
  irrigatedPercentage: number;
  rainfedPercentage: number;
  irrigationReliabilityScore: number; // 0 - 100
  rainfallDependencyPercent: number; // 0 - 100
  irrigationDependencyPercent: number; // 0 - 100
  waterAvailabilityRisk: 'Low' | 'Moderate' | 'High' | 'Very High';
  waterRiskReasoning: string;
  scoringBreakdown: Array<{
    factor: string;
    weightPercent: number;
    score: number;
    contribution: number;
    description: string;
  }>;
}

/**
 * Calculates FARMFIT Irrigation Reliability Score & Water Risk
 * Fully deterministic, uses configurable weights in one module
 */
export function calculateIrrigationAssessment(
  input: IrrigationAssessmentInput,
  weights: IrrigationReliabilityWeights = CENTRAL_IRRIGATION_WEIGHTS
): IrrigationAssessmentOutput {
  const total = Math.max(0.0001, input.totalFarmArea);
  const irrigated = Math.max(0, input.irrigatedArea);
  const rainfed = Math.max(0, input.rainfedArea);

  // Irrigated % & Rainfed %
  const rawIrrigatedPct = (irrigated / total) * 100;
  const rawRainfedPct = (rainfed / total) * 100;

  const irrigatedPercentage = Number(Math.min(100, rawIrrigatedPct).toFixed(1));
  const rainfedPercentage = Number(Math.min(100, rawRainfedPct).toFixed(1));

  const isPureRainfed = input.selectedSources.includes('Rainfed only') || (input.selectedSources.length === 0 && irrigated === 0);

  // 1. Assured Land Ratio Score (0 - 100)
  const landRatioScore = isPureRainfed ? 0 : Math.min(100, Math.max(0, irrigatedPercentage));

  // 2. Water Sources Quality Score (0 - 100)
  let sourceQualityScore = 0;
  if (isPureRainfed) {
    sourceQualityScore = 10;
  } else {
    let sourceScoreSum = 0;
    let sourceCount = 0;
    const sources = input.selectedSources.filter(s => s !== 'Rainfed only');

    if (sources.includes('Canal')) { sourceScoreSum += 85; sourceCount++; }
    if (sources.includes('Borewell')) { sourceScoreSum += 80; sourceCount++; }
    if (sources.includes('River')) { sourceScoreSum += 75; sourceCount++; }
    if (sources.includes('Reservoir')) { sourceScoreSum += 75; sourceCount++; }
    if (sources.includes('Open well')) { sourceScoreSum += 65; sourceCount++; }
    if (sources.includes('Farm pond')) { sourceScoreSum += 60; sourceCount++; }
    if (sources.includes('Rainwater harvesting')) { sourceScoreSum += 55; sourceCount++; }
    if (sources.includes('Community irrigation')) { sourceScoreSum += 70; sourceCount++; }
    if (sources.includes('Other')) { sourceScoreSum += 50; sourceCount++; }

    // Delivery technology efficiency boost
    let techBoost = 0;
    if (sources.includes('Drip irrigation')) techBoost += 15;
    if (sources.includes('Sprinkler')) techBoost += 10;

    const baseSourceScore = sourceCount > 0 ? (sourceScoreSum / sourceCount) : 40;
    // Multi-source resilience bonus (having both canal/borewell or well/pond)
    const multiSourceBonus = sourceCount >= 2 ? 10 : 0;

    sourceQualityScore = Math.min(100, Math.max(10, baseSourceScore + techBoost + multiSourceBonus));
  }

  // 3. Months of Availability Score (0 - 100)
  const monthsScore = isPureRainfed
    ? Math.min(100, (Math.max(1, input.monthsReliableWater) / 12) * 40)
    : Math.min(100, (Math.max(0, input.monthsReliableWater) / 12) * 100);

  // 4. Seasonal Coverage Score (0 - 100)
  let seasonCount = 0;
  if (input.availableInMonsoon) seasonCount++;
  if (input.availableInWinter) seasonCount++;
  if (input.availableInSummer) seasonCount++;
  const seasonalScore = (seasonCount / 3) * 100;

  // 5. Farmer-Reported Reliability Score (0 - 100)
  let reliabilityScoreValue = 50;
  switch (input.sourceReliability) {
    case 'Very High': reliabilityScoreValue = 100; break;
    case 'High': reliabilityScoreValue = 80; break;
    case 'Moderate': reliabilityScoreValue = 55; break;
    case 'Low': reliabilityScoreValue = 30; break;
    case 'Very Low': reliabilityScoreValue = 10; break;
  }

  // Calculate Weighted FARMFIT Irrigation Reliability Score
  const c1 = landRatioScore * weights.assuredIrrigationLandRatioWeight;
  const c2 = sourceQualityScore * weights.waterSourceQualityWeight;
  const c3 = monthsScore * weights.monthsAvailabilityWeight;
  const c4 = seasonalScore * weights.seasonalCoverageWeight;
  const c5 = reliabilityScoreValue * weights.farmerReportedReliabilityWeight;

  let rawCalculated = c1 + c2 + c3 + c4 + c5;

  // Shortage penalty if reported shortage months > 4
  const shortagePenalty = Math.max(0, (input.monthsWaterShortage - 2) * 3);
  const finalScore = Math.max(0, Math.min(100, Math.round(rawCalculated - shortagePenalty)));

  // Rainfall Dependency % and Irrigation Dependency %
  // Transparent inverse relation based on actual entered data
  let rainfallDep = 0;
  if (isPureRainfed || irrigatedPercentage === 0) {
    rainfallDep = 100;
  } else if (irrigatedPercentage >= 100 && input.monthsReliableWater >= 10 && input.availableInSummer) {
    rainfallDep = Math.max(5, Math.round(100 - finalScore));
  } else {
    // Blends rainfed area share with water availability score
    const areaWeight = (rainfedPercentage / 100) * 60;
    const reliabilityInverse = ((100 - finalScore) / 100) * 40;
    rainfallDep = Math.min(100, Math.max(0, Math.round(areaWeight + reliabilityInverse)));
  }

  const irrigationDep = Number((100 - rainfallDep).toFixed(0));

  // Water Availability Risk (Low / Moderate / High / Very High)
  let waterAvailabilityRisk: 'Low' | 'Moderate' | 'High' | 'Very High' = 'Moderate';
  let waterRiskReasoning = '';

  if (finalScore >= 75 && rainfallDep <= 30 && input.availableInSummer) {
    waterAvailabilityRisk = 'Low';
    waterRiskReasoning = 'High perennial water availability with active multi-season irrigation infrastructure.';
  } else if (finalScore >= 50 && rainfallDep <= 60) {
    waterAvailabilityRisk = 'Moderate';
    waterRiskReasoning = 'Adequate water for Kharif and Rabi seasons; potential stress during peak summer months.';
  } else if (finalScore >= 25 || rainfallDep <= 85) {
    waterAvailabilityRisk = 'High';
    waterRiskReasoning = 'Significant seasonal water shortage or high dependence on timely monsoon rainfall.';
  } else {
    waterAvailabilityRisk = 'Very High';
    waterRiskReasoning = 'Purely rainfed or severely depleted water infrastructure with elevated crop-failure risk during dry spells.';
  }

  const scoringBreakdown = [
    {
      factor: 'Land with Assured Irrigation',
      weightPercent: Math.round(weights.assuredIrrigationLandRatioWeight * 100),
      score: Math.round(landRatioScore),
      contribution: Number(c1.toFixed(1)),
      description: `${irrigatedPercentage}% of farm area declared with irrigation access.`
    },
    {
      factor: 'Water Sources Quality & Micro-irrigation',
      weightPercent: Math.round(weights.waterSourceQualityWeight * 100),
      score: Math.round(sourceQualityScore),
      contribution: Number(c2.toFixed(1)),
      description: `${input.selectedSources.length > 0 ? input.selectedSources.join(', ') : 'None'}.`
    },
    {
      factor: 'Reliable Water Duration',
      weightPercent: Math.round(weights.monthsAvailabilityWeight * 100),
      score: Math.round(monthsScore),
      contribution: Number(c3.toFixed(1)),
      description: `${input.monthsReliableWater} months reliable water per year.`
    },
    {
      factor: 'Seasonal Coverage (Monsoon, Winter, Summer)',
      weightPercent: Math.round(weights.seasonalCoverageWeight * 100),
      score: Math.round(seasonalScore),
      contribution: Number(c4.toFixed(1)),
      description: `Available in ${seasonCount} of 3 major cropping seasons.`
    },
    {
      factor: 'Farmer-Reported Reliability',
      weightPercent: Math.round(weights.farmerReportedReliabilityWeight * 100),
      score: Math.round(reliabilityScoreValue),
      contribution: Number(c5.toFixed(1)),
      description: `Farmer rating: ${input.sourceReliability}.`
    }
  ];

  return {
    irrigatedPercentage,
    rainfedPercentage,
    irrigationReliabilityScore: finalScore,
    rainfallDependencyPercent: rainfallDep,
    irrigationDependencyPercent: irrigationDep,
    waterAvailabilityRisk,
    waterRiskReasoning,
    scoringBreakdown
  };
}
