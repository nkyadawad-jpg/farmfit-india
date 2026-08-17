/**
 * FARMFIT Soil Intelligence Engine & Provenance Architecture
 * Aligned with Government of India (ICAR-NBSS&LUP, MoA&FW Soil Health Card Portal, DAC&FW)
 * 
 * Strict Provenance Protocol:
 * 1. OFFICIAL DATA
 * 2. SOIL TEST
 * 3. FARMER ENTERED
 * 4. MODEL ESTIMATE
 * 5. DATA UNAVAILABLE
 */

import { SoilOrder, FarmLocation } from '../types';

export type SoilDataStatus = 
  | 'OFFICIAL DATA'
  | 'SOIL TEST'
  | 'FARMER ENTERED'
  | 'MODEL ESTIMATE'
  | 'DATA UNAVAILABLE';

export interface SoilDataSource {
  sourceName: string;
  sourceUrl?: string;
  datasetName: string;
  dateRetrieved: string;
  geographicCoverage: string;
  parameter: string;
  value: any;
  unit?: string;
  confidence: number; // 0 - 100
  dataStatus: SoilDataStatus;
}

export interface SoilParamRecord<T> {
  value: T;
  unit?: string;
  status: SoilDataStatus;
  sourceNote: string;
  confidenceScore: number; // 0 - 100
  isLaboratoryVerified?: boolean;
}

export interface LaboratorySoilTestRecord {
  hasLabReport: boolean;
  testDate?: string;
  laboratoryName?: string;
  reportReference?: string;
  uploadedFileName?: string;
  uploadedFileSize?: string;
  
  // Chemical / Physical Parameters
  ph?: number;
  electricalConductivity?: number; // dS/m
  ecUnit?: 'dS/m' | 'mS/cm';
  organicCarbonPercent?: number; // %
  
  // Available Macronutrients
  availableNitrogen?: number; // kg/ha
  nitrogenUnit?: 'kg/ha' | 'ppm' | 'kg/acre';
  nitrogenRating?: 'Low' | 'Medium' | 'High';
  
  availablePhosphorus?: number; // kg/ha P or P2O5
  phosphorusUnit?: 'kg/ha' | 'ppm' | 'kg/acre';
  phosphorusRating?: 'Low' | 'Medium' | 'High';
  
  availablePotassium?: number; // kg/ha K or K2O
  potassiumUnit?: 'kg/ha' | 'ppm' | 'kg/acre';
  potassiumRating?: 'Low' | 'Medium' | 'High';

  // Micronutrients
  zincPpm?: number;
  ironPpm?: number;
  manganesePpm?: number;
  copperPpm?: number;
  boronPpm?: number;
  sulphurPpm?: number;
}

export interface MappedSoilDataRecord {
  isSourceConnected: boolean;
  statusMessage: string;
  sourceName: string;
  datasetName?: string;
  dateRetrieved?: string;
  mappedSoilType?: SoilOrder;
  mappedTexture?: string;
  mappedDepth?: string;
  mappedDrainage?: string;
  mappedPh?: number;
  mappedOrganicCarbon?: number;
  mappedNitrogenCategory?: 'Low' | 'Medium' | 'High';
  mappedPhosphorusCategory?: 'Low' | 'Medium' | 'High';
  mappedPotassiumCategory?: 'Low' | 'Medium' | 'High';
  gridResolutionKm?: number;
}

export interface SoilHealthIndicators {
  phStatus: {
    classification: 'Strongly Acidic' | 'Moderately Acidic' | 'Slightly Acidic' | 'Neutral / Optimal' | 'Moderately Alkaline' | 'Strongly Alkaline' | 'Cannot classify — additional data required';
    severity: 'optimal' | 'warning' | 'critical' | 'insufficient';
    description: string;
    targetRange: string;
  };
  organicCarbonStatus: {
    classification: 'Low' | 'Moderate' | 'Adequate' | 'High' | 'Cannot classify — additional data required';
    severity: 'optimal' | 'warning' | 'critical' | 'insufficient';
    description: string;
    benchmarkNote: string;
  };
  nitrogenStatus: {
    classification: 'Low' | 'Medium' | 'High' | 'Cannot classify — additional data required';
    severity: 'optimal' | 'warning' | 'critical' | 'insufficient';
    description: string;
    standardRange: string;
  };
  phosphorusStatus: {
    classification: 'Low' | 'Medium' | 'High' | 'Cannot classify — additional data required';
    severity: 'optimal' | 'warning' | 'critical' | 'insufficient';
    description: string;
    standardRange: string;
  };
  potassiumStatus: {
    classification: 'Low' | 'Medium' | 'High' | 'Cannot classify — additional data required';
    severity: 'optimal' | 'warning' | 'critical' | 'insufficient';
    description: string;
    standardRange: string;
  };
  salinityEcStatus: {
    classification: 'Normal (Non-Saline)' | 'Critical / Slight Salinity' | 'Saline' | 'Strongly Saline' | 'Cannot classify — additional data required';
    severity: 'optimal' | 'warning' | 'critical' | 'insufficient';
    description: string;
    standardRange: string;
  };
}

export interface SoilConditionWarning {
  id: string;
  title: string;
  nature: 'Confirmed laboratory result' | 'Potential concern (Farmer / Regional Observation)';
  severity: 'high' | 'medium' | 'low';
  description: string;
  impactOnCrops: string;
}

export interface SoilImprovementAdvisory {
  category: 'Lime application' | 'Gypsum application' | 'Organic matter enhancement' | 'Green manuring' | 'Micronutrient correction';
  applicable: boolean;
  status: 'Recommended' | 'Not Required' | 'Requires Lab Verification First';
  title: string;
  methodologyNote: string;
  dosageGuidelines: string;
  warningNote: string;
}

export type SoilCropSuitabilityRating = 
  | 'Highly Suitable'
  | 'Suitable'
  | 'Moderately Suitable'
  | 'Marginal'
  | 'Unsuitable'
  | 'Insufficient Data';

export interface SoilCropComparisonResult {
  cropId: string;
  cropName: string;
  suitability: SoilCropSuitabilityRating;
  reasons: string[];
  limitations: string[];
}

export interface SoilConfidenceScoreResult {
  score: number; // 0 - 100
  rating: 'High' | 'Moderate' | 'Low' | 'Very Low';
  summary: string;
  explanation: string;
  breakdown: Array<{
    dimension: string;
    points: number;
    maxPoints: number;
    description: string;
  }>;
}

// ------------------------------------------------------------------
// AUTHORITATIVE DATA SOURCES CATALOG (Govt of India / ICAR Standards)
// ------------------------------------------------------------------
export const AUTHORITATIVE_SOIL_SOURCES: SoilDataSource[] = [
  {
    sourceName: 'ICAR - National Bureau of Soil Survey and Land Use Planning (NBSS&LUP)',
    sourceUrl: 'https://nbsslup.icar.gov.in',
    datasetName: 'Soil Resource Mapping of India (1:250,000 & 1:50,000 scale)',
    dateRetrieved: '2024-04-01',
    geographicCoverage: 'All-India Agro-Ecological Sub-Regions (AESRs)',
    parameter: 'Soil Order, Texture, Depth, Landscape Drainage',
    value: 'Regional Base Mapping',
    confidence: 85,
    dataStatus: 'OFFICIAL DATA'
  },
  {
    sourceName: 'Ministry of Agriculture & Farmers Welfare (MoA&FW) - DAC&FW',
    sourceUrl: 'https://soilhealth.dac.gov.in',
    datasetName: 'National Soil Health Card Portal (Cycle-I & Cycle-II)',
    dateRetrieved: '2024-06-15',
    geographicCoverage: 'Village/Grid Level Soil Nutrient Baselines (12 Parameters)',
    parameter: 'N, P, K, S, Zn, Fe, Cu, Mn, B, pH, EC, OC',
    value: 'Grid-level Reference',
    confidence: 90,
    dataStatus: 'OFFICIAL DATA'
  },
  {
    sourceName: 'Open Government Data Platform India (Data.gov.in)',
    sourceUrl: 'https://data.gov.in',
    datasetName: 'District-wise Soil Fertility Status of India',
    dateRetrieved: '2024-01-10',
    geographicCoverage: 'District Level Administrative Aggregations',
    parameter: 'NPK Nutrient Index (Low/Medium/High)',
    value: 'District Baselines',
    confidence: 75,
    dataStatus: 'OFFICIAL DATA'
  }
];

// ------------------------------------------------------------------
// LOCATION BASED SOIL LOOKUP (Strictly No Invention)
// ------------------------------------------------------------------
export function lookupLocationSoilData(
  latitude?: number,
  longitude?: number,
  state?: string,
  district?: string
): MappedSoilDataRecord {
  // If no coordinates or authoritative live GIS connector not active
  if (!latitude || !longitude) {
    return {
      isSourceConnected: false,
      statusMessage: 'Mapped soil data source not connected. Please specify GPS coordinates or enter field test.',
      sourceName: 'ICAR-NBSS&LUP Regional Database'
    };
  }

  // Authoritative API integration stub: In production, connects via authenticated WMS/REST API to MoA&FW Soil API.
  // In development/standalone mode, we strictly report that regional mapped data source is not yet live-streamed.
  return {
    isSourceConnected: false,
    statusMessage: 'Mapped soil data source not connected. (Awaiting live connection to MoA&FW / ICAR spatial database for latitude ' + latitude.toFixed(4) + ', longitude ' + longitude.toFixed(4) + ').',
    sourceName: 'ICAR-NBSS&LUP & Soil Health Card Portal'
  };
}

// ------------------------------------------------------------------
// SCIENTIFIC SOIL HEALTH INDICATOR CLASSIFICATION
// Based on ICAR & Ministry of Agriculture Soil Health Card Standards
// ------------------------------------------------------------------
export function evaluateSoilHealthIndicators(
  ph?: number,
  ec?: number,
  oc?: number,
  nKgHa?: number,
  nRating?: string,
  pKgHa?: number,
  pRating?: string,
  kKgHa?: number,
  kRating?: string
): SoilHealthIndicators {
  // 1. pH Evaluation
  let phStatus: SoilHealthIndicators['phStatus'] = {
    classification: 'Cannot classify — additional data required',
    severity: 'insufficient',
    description: 'No pH value provided.',
    targetRange: '6.5 - 7.8 (Optimal for most Indian field crops)'
  };

  if (ph !== undefined && !isNaN(ph) && ph > 0) {
    if (ph < 5.5) {
      phStatus = {
        classification: 'Strongly Acidic',
        severity: 'critical',
        description: 'Severe acidity (< 5.5) limits Phosphorus availability and induces Aluminium/Manganese toxicity.',
        targetRange: '6.5 - 7.8'
      };
    } else if (ph < 6.5) {
      phStatus = {
        classification: 'Moderately Acidic',
        severity: 'warning',
        description: 'Slightly below optimal. Common in laterite & high-rainfall red soils.',
        targetRange: '6.5 - 7.8'
      };
    } else if (ph <= 7.8) {
      phStatus = {
        classification: 'Neutral / Optimal',
        severity: 'optimal',
        description: 'Ideal pH range. Maximizes nutrient availability and beneficial microbial activity.',
        targetRange: '6.5 - 7.8'
      };
    } else if (ph <= 8.5) {
      phStatus = {
        classification: 'Moderately Alkaline',
        severity: 'warning',
        description: 'Alkaline condition. May fix Phosphorus and induce Zinc/Iron chlorosis.',
        targetRange: '6.5 - 7.8'
      };
    } else {
      phStatus = {
        classification: 'Strongly Alkaline',
        severity: 'critical',
        description: 'Severe alkalinity / sodicity (pH > 8.5). High exchangeable sodium restricts water infiltration and root respiration.',
        targetRange: '6.5 - 7.8'
      };
    }
  }

  // 2. Organic Carbon Evaluation (ICAR Benchmark: <0.5% Low, 0.5-0.75% Medium, >0.75% High)
  let ocStatus: SoilHealthIndicators['organicCarbonStatus'] = {
    classification: 'Cannot classify — additional data required',
    severity: 'insufficient',
    description: 'No Organic Carbon test value available.',
    benchmarkNote: 'ICAR Standard: <0.50% Low, 0.50-0.75% Medium, >0.75% Adequate'
  };

  if (oc !== undefined && !isNaN(oc) && oc >= 0) {
    if (oc < 0.5) {
      ocStatus = {
        classification: 'Low',
        severity: 'critical',
        description: 'Low organic matter (<0.50%). Restricted soil microbial biomass, poor moisture retention, and low CEC.',
        benchmarkNote: 'ICAR Standard: <0.50% Low'
      };
    } else if (oc <= 0.75) {
      ocStatus = {
        classification: 'Moderate',
        severity: 'warning',
        description: 'Moderate organic carbon (0.50% - 0.75%). Regular addition of FYM or green manure advised.',
        benchmarkNote: 'ICAR Standard: 0.50% - 0.75% Medium'
      };
    } else {
      ocStatus = {
        classification: 'Adequate',
        severity: 'optimal',
        description: 'Good organic carbon level (>0.75%). Supports robust soil biology and resilient nutrient cycling.',
        benchmarkNote: 'ICAR Standard: >0.75% High'
      };
    }
  }

  // 3. Available Nitrogen (kg/ha) (ICAR: <280 Low, 280-560 Medium, >560 High)
  let nStatus: SoilHealthIndicators['nitrogenStatus'] = {
    classification: 'Cannot classify — additional data required',
    severity: 'insufficient',
    description: 'No Nitrogen test data provided.',
    standardRange: 'Low: <280 kg/ha | Medium: 280-560 kg/ha | High: >560 kg/ha'
  };

  if (nRating === 'Low' || (nKgHa !== undefined && nKgHa < 280)) {
    nStatus = {
      classification: 'Low',
      severity: 'warning',
      description: 'Deficient in readily mineralizable Nitrogen (< 280 kg/ha). Requires split Urea/DAP basal & top-dress.',
      standardRange: '< 280 kg/ha'
    };
  } else if (nRating === 'Medium' || (nKgHa !== undefined && nKgHa <= 560)) {
    nStatus = {
      classification: 'Medium',
      severity: 'optimal',
      description: 'Medium Nitrogen status (280 - 560 kg/ha). Standard recommended dose of fertilizer (RDF) applies.',
      standardRange: '280 - 560 kg/ha'
    };
  } else if (nRating === 'High' || (nKgHa !== undefined && nKgHa > 560)) {
    nStatus = {
      classification: 'High',
      severity: 'optimal',
      description: 'High Nitrogen content (> 560 kg/ha). Nitrogen fertilizer dosage can be safely curtailed by 20-25%.',
      standardRange: '> 560 kg/ha'
    };
  }

  // 4. Available Phosphorus (kg/ha) (ICAR: <10 Low, 10-25 Medium, >25 High)
  let pStatus: SoilHealthIndicators['phosphorusStatus'] = {
    classification: 'Cannot classify — additional data required',
    severity: 'insufficient',
    description: 'No Phosphorus test data provided.',
    standardRange: 'Low: <10 kg/ha | Medium: 10-25 kg/ha | High: >25 kg/ha'
  };

  if (pRating === 'Low' || (pKgHa !== undefined && pKgHa < 10)) {
    pStatus = {
      classification: 'Low',
      severity: 'warning',
      description: 'Low Phosphorus (< 10 kg/ha). Essential to provide water-soluble Phosphate (DAP/SSP) at root zone.',
      standardRange: '< 10 kg/ha'
    };
  } else if (pRating === 'Medium' || (pKgHa !== undefined && pKgHa <= 25)) {
    pStatus = {
      classification: 'Medium',
      severity: 'optimal',
      description: 'Moderate Phosphorus reserve (10 - 25 kg/ha). Standard basal application recommended.',
      standardRange: '10 - 25 kg/ha'
    };
  } else if (pRating === 'High' || (pKgHa !== undefined && pKgHa > 25)) {
    pStatus = {
      classification: 'High',
      severity: 'optimal',
      description: 'High Phosphorus level (> 25 kg/ha). DAP/SSP application can be moderately reduced.',
      standardRange: '> 25 kg/ha'
    };
  }

  // 5. Available Potassium (kg/ha) (ICAR: <108 Low, 108-280 Medium, >280 High)
  let kStatus: SoilHealthIndicators['potassiumStatus'] = {
    classification: 'Cannot classify — additional data required',
    severity: 'insufficient',
    description: 'No Potassium test data provided.',
    standardRange: 'Low: <108 kg/ha | Medium: 108-280 kg/ha | High: >280 kg/ha'
  };

  if (kRating === 'Low' || (kKgHa !== undefined && kKgHa < 108)) {
    kStatus = {
      classification: 'Low',
      severity: 'warning',
      description: 'Low Potassium (< 108 kg/ha). MOP (Muriate of Potash) application required for disease resistance and grain filling.',
      standardRange: '< 108 kg/ha'
    };
  } else if (kRating === 'Medium' || (kKgHa !== undefined && kKgHa <= 280)) {
    kStatus = {
      classification: 'Medium',
      severity: 'optimal',
      description: 'Adequate Potassium level (108 - 280 kg/ha).',
      standardRange: '108 - 280 kg/ha'
    };
  } else if (kRating === 'High' || (kKgHa !== undefined && kKgHa > 280)) {
    kStatus = {
      classification: 'High',
      severity: 'optimal',
      description: 'High native Potassium (> 280 kg/ha). Common in vertisols / black soils.',
      standardRange: '> 280 kg/ha'
    };
  }

  // 6. Electrical Conductivity (EC dS/m) (ICAR: <1.0 Normal, 1.0-2.0 Critical, >2.0 Saline)
  let ecStatus: SoilHealthIndicators['salinityEcStatus'] = {
    classification: 'Cannot classify — additional data required',
    severity: 'insufficient',
    description: 'No Electrical Conductivity value available.',
    standardRange: '< 1.0 dS/m (Normal)'
  };

  if (ec !== undefined && !isNaN(ec) && ec >= 0) {
    if (ec < 1.0) {
      ecStatus = {
        classification: 'Normal (Non-Saline)',
        severity: 'optimal',
        description: 'Safe salt concentration (< 1.0 dS/m). No osmotic restriction on crop water uptake.',
        standardRange: '< 1.0 dS/m'
      };
    } else if (ec <= 2.0) {
      ecStatus = {
        classification: 'Critical / Slight Salinity',
        severity: 'warning',
        description: 'Moderate soluble salt accumulation (1.0 - 2.0 dS/m). Sensitive pulses/vegetables may suffer germination delay.',
        standardRange: '1.0 - 2.0 dS/m'
      };
    } else {
      ecStatus = {
        classification: 'Saline',
        severity: 'critical',
        description: 'Saline soil (EC > 2.0 dS/m). Requires leaching with good quality water and drainage provision.',
        standardRange: '> 2.0 dS/m'
      };
    }
  }

  return {
    phStatus,
    organicCarbonStatus: ocStatus,
    nitrogenStatus: nStatus,
    phosphorusStatus: pStatus,
    potassiumStatus: kStatus,
    salinityEcStatus: ecStatus
  };
}

// ------------------------------------------------------------------
// SOIL CONDITION WARNING GENERATOR
// Explicitly distinguishes Confirmed Lab Result vs Potential Concern
// ------------------------------------------------------------------
export function generateSoilWarnings(
  indicators: SoilHealthIndicators,
  isLabVerified: boolean,
  drainage?: string,
  micronutrients?: { zincPpm?: number; boronPpm?: number }
): SoilConditionWarning[] {
  const warnings: SoilConditionWarning[] = [];
  const nature = isLabVerified ? 'Confirmed laboratory result' : 'Potential concern (Farmer / Regional Observation)';

  // Acidic Soil
  if (indicators.phStatus.classification === 'Strongly Acidic') {
    warnings.push({
      id: 'warn-acidic',
      title: 'Strong Soil Acidity (pH < 5.5)',
      nature,
      severity: 'high',
      description: 'Soil pH is strongly acidic, which precipitates soluble phosphate and may release toxic aluminium ions.',
      impactOnCrops: 'Restricts root elongation in pulses, maize, and oilseeds; lime conditioning recommended.'
    });
  }

  // Alkaline / Sodic Soil
  if (indicators.phStatus.classification === 'Strongly Alkaline') {
    warnings.push({
      id: 'warn-alkaline',
      title: 'High Soil Alkalinity / Sodic Tendency (pH > 8.5)',
      nature,
      severity: 'high',
      description: 'High soil pH impairs micronutrient (Zinc, Iron) availability and causes clay dispersion.',
      impactOnCrops: 'Severe rhizobial failure in pulses; poor aeration; gypsum soil amendment required.'
    });
  }

  // Salinity
  if (indicators.salinityEcStatus.classification === 'Saline' || indicators.salinityEcStatus.classification === 'Strongly Saline') {
    warnings.push({
      id: 'warn-saline',
      title: 'Elevated Electrical Conductivity / Salinity Risk (EC > 2.0 dS/m)',
      nature,
      severity: 'high',
      description: 'High concentration of soluble salts creates high osmotic pressure.',
      impactOnCrops: 'Limits water absorption; causes leaf tip burning in salt-sensitive crops like gram and soybean.'
    });
  }

  // Low Organic Carbon
  if (indicators.organicCarbonStatus.classification === 'Low') {
    warnings.push({
      id: 'warn-low-oc',
      title: 'Depleted Organic Carbon (< 0.50%)',
      nature,
      severity: 'medium',
      description: 'Low microbial food substrate and poor aggregate stability in the topsoil.',
      impactOnCrops: 'Low fertilizer recovery efficiency; frequent moisture stress between irrigation cycles.'
    });
  }

  // Poor Drainage
  if (drainage && drainage.toLowerCase().includes('poor')) {
    warnings.push({
      id: 'warn-drainage',
      title: 'Poor Field Drainage / High Water Stagnation Risk',
      nature: 'Potential concern (Farmer / Regional Observation)',
      severity: 'high',
      description: 'Field has low percolation and is prone to temporary waterlogging during heavy downpours.',
      impactOnCrops: 'Extreme collar rot and wilt vulnerability in pulses (Pigeonpea/Chickpea) and cotton.'
    });
  }

  // Zinc Deficiency
  if (micronutrients && micronutrients.zincPpm !== undefined && micronutrients.zincPpm < 0.6) {
    warnings.push({
      id: 'warn-zinc',
      title: 'Zinc Deficiency (Available Zn < 0.6 ppm)',
      nature,
      severity: 'medium',
      description: 'Zinc level falls below the critical 0.6 ppm agronomic threshold.',
      impactOnCrops: 'Causes Khaira disease in paddy and white bud in maize; basal zinc sulphate needed.'
    });
  }

  return warnings;
}

// ------------------------------------------------------------------
// SOIL IMPROVEMENT FOUNDATION (Advisory Guidelines)
// Strict rule: No arbitrary quantities without required soil test & SAU guidelines
// ------------------------------------------------------------------
export function generateSoilImprovementAdvisories(
  indicators: SoilHealthIndicators,
  isLabVerified: boolean
): SoilImprovementAdvisory[] {
  const advisories: SoilImprovementAdvisory[] = [];

  // 1. Lime Recommendation
  const isAcidic = indicators.phStatus.classification === 'Strongly Acidic';
  advisories.push({
    category: 'Lime application',
    applicable: isAcidic,
    status: isAcidic 
      ? (isLabVerified ? 'Recommended' : 'Requires Lab Verification First')
      : 'Not Required',
    title: 'Agricultural Lime / Dolomite Amendment',
    methodologyNote: 'Lime requirement is determined by buffer pH test (Shoemaker-McLean-Pratt method) or exchangeable aluminium content per SAU package of practices.',
    dosageGuidelines: isAcidic && isLabVerified
      ? 'Apply finely ground agricultural limestone (CaCO3) 3-4 weeks prior to sowing, thoroughly disc-ploughed into top 15 cm soil.'
      : 'Dosage cannot be calculated without laboratory buffer pH / exchangeable acidity test.',
    warningNote: 'Do not over-lime sandy soils to prevent micronutrient lock-up.'
  });

  // 2. Gypsum Recommendation
  const isAlkaline = indicators.phStatus.classification === 'Strongly Alkaline';
  advisories.push({
    category: 'Gypsum application',
    applicable: isAlkaline,
    status: isAlkaline
      ? (isLabVerified ? 'Recommended' : 'Requires Lab Verification First')
      : 'Not Required',
    title: 'Agricultural Gypsum (CaSO4·2H2O) Sodic Reclamation',
    methodologyNote: 'Gypsum requirement calculated based on Exchangeable Sodium Percentage (ESP) & Cation Exchange Capacity (CEC).',
    dosageGuidelines: isAlkaline && isLabVerified
      ? 'Broadcast agricultural grade mineral gypsum followed by shallow mixing and ponding with clean irrigation water for sodium leaching.'
      : 'Quantitative gypsum requirement requires laboratory ESP / CEC laboratory determination.',
    warningNote: 'Adequate subsurface drainage is mandatory for gypsum reclamation to leach displaced sodium ions.'
  });

  // 3. Organic Matter Improvement
  const isLowOc = indicators.organicCarbonStatus.classification === 'Low' || indicators.organicCarbonStatus.classification === 'Moderate';
  advisories.push({
    category: 'Organic matter enhancement',
    applicable: isLowOc,
    status: 'Recommended',
    title: 'Farmyard Manure (FYM) & Well-Decomposed Compost',
    methodologyNote: 'ICAR standard organic carbon enhancement protocol for tropical and sub-tropical agro-ecosystems.',
    dosageGuidelines: 'Incorporate 2 to 3 tonnes of well-rotted FYM or 1 tonne of enriched vermicompost per acre during summer land preparation.',
    warningNote: 'Ensure manure is fully decomposed to prevent termite and root grub attraction.'
  });

  // 4. Green Manuring
  advisories.push({
    category: 'Green manuring',
    applicable: true,
    status: 'Recommended',
    title: 'In-Situ Green Manuring (Dhaincha / Sunnhemp)',
    methodologyNote: 'Leguminous green manuring fixes 40-60 kg atmospheric Nitrogen per hectare and generates 15-20 tonnes green biomass.',
    dosageGuidelines: 'Sow Sesbania aculeata (Dhaincha) or Crotalaria juncea (Sunnhemp) with early pre-monsoon showers and incorporate at 45-50 days (before flowering).',
    warningNote: 'Allow 10-14 days after incorporation for biomass decomposition before sowing the main crop.'
  });

  // 5. Micronutrient Correction
  advisories.push({
    category: 'Micronutrient correction',
    applicable: true,
    status: isLabVerified ? 'Recommended' : 'Requires Lab Verification First',
    title: 'Targeted Micronutrient Supplementation (Zn, B, Fe, S)',
    methodologyNote: 'Based on Soil Health Card critical threshold values (DTPA extractable Zn <0.6 ppm, Hot water soluble B <0.5 ppm).',
    dosageGuidelines: 'For Zinc deficient soils, apply 10 kg Zinc Sulphate Heptahydrate (21% Zn) or 6 kg Monohydrate (33% Zn) per acre basally once in 2-3 crop cycles.',
    warningNote: 'Never mix Zinc Sulphate directly with phosphatic fertilizers (DAP/SSP) to avoid insoluble Zinc Phosphate precipitation.'
  });

  return advisories;
}

// ------------------------------------------------------------------
// SOIL DATA CONFIDENCE ENGINE (0 - 100)
// Transparent, honest scoring based on evidence
// ------------------------------------------------------------------
export function calculateSoilDataConfidence(
  hasLabTest: boolean,
  labRecord?: LaboratorySoilTestRecord,
  isMappedConnected: boolean = false,
  hasFarmerEntry: boolean = true
): SoilConfidenceScoreResult {
  let score = 0;
  const breakdown: SoilConfidenceScoreResult['breakdown'] = [];

  // 1. Lab Test Verification (0 - 40 pts)
  if (hasLabTest && labRecord) {
    let labPts = 30;
    if (labRecord.laboratoryName && labRecord.testDate) labPts += 10;
    score += labPts;
    breakdown.push({
      dimension: 'Laboratory Soil Test Report',
      points: labPts,
      maxPoints: 40,
      description: 'Certified laboratory soil test provided with testing date and lab verification.'
    });
  } else {
    breakdown.push({
      dimension: 'Laboratory Soil Test Report',
      points: 0,
      maxPoints: 40,
      description: 'No laboratory soil test report uploaded. Reliance on estimation.'
    });
  }

  // 2. Nutrient Completeness (0 - 30 pts)
  let nutrientPts = 0;
  if (labRecord?.ph !== undefined || hasFarmerEntry) nutrientPts += 8; // pH
  if (labRecord?.organicCarbonPercent !== undefined) nutrientPts += 7; // OC
  if (labRecord?.availableNitrogen !== undefined || labRecord?.nitrogenRating) nutrientPts += 5; // N
  if (labRecord?.availablePhosphorus !== undefined || labRecord?.phosphorusRating) nutrientPts += 5; // P
  if (labRecord?.availablePotassium !== undefined || labRecord?.potassiumRating) nutrientPts += 5; // K
  nutrientPts = Math.min(30, nutrientPts);
  score += nutrientPts;
  breakdown.push({
    dimension: 'Nutrient & Chemical Completeness',
    points: nutrientPts,
    maxPoints: 30,
    description: `Core chemical parameters recorded: pH, OC, and N-P-K nutrient status.`
  });

  // 3. Micronutrient Profile (0 - 15 pts)
  let microPts = 0;
  if (labRecord?.zincPpm !== undefined) microPts += 5;
  if (labRecord?.boronPpm !== undefined) microPts += 5;
  if (labRecord?.ironPpm !== undefined || labRecord?.sulphurPpm !== undefined) microPts += 5;
  score += microPts;
  breakdown.push({
    dimension: 'Micronutrient Specificity (Zn, B, Fe, S)',
    points: microPts,
    maxPoints: 15,
    description: microPts > 0 ? 'Specific micronutrient test values provided.' : 'No micronutrient test data available.'
  });

  // 4. Geospatial & Mapped Dataset Linkage (0 - 15 pts)
  let geoPts = 5; // GPS key established
  if (isMappedConnected) geoPts += 10;
  score += geoPts;
  breakdown.push({
    dimension: 'Geospatial Resolution & Mapped Baseline',
    points: geoPts,
    maxPoints: 15,
    description: isMappedConnected 
      ? 'Connected to ICAR-NBSS&LUP official spatial soil layer.'
      : 'Geographic coordinate key linked; mapped layer pending live API sync.'
  });

  const finalScore = Math.min(100, Math.max(10, score));

  let rating: SoilConfidenceScoreResult['rating'] = 'Low';
  let summary = '';
  let explanation = '';

  if (finalScore >= 80) {
    rating = 'High';
    summary = 'High Confidence — Certified Laboratory Soil Test';
    explanation = 'Based on certified laboratory test report with comprehensive chemical, macronutrient, and micronutrient calibration.';
  } else if (finalScore >= 55) {
    rating = 'Moderate';
    summary = 'Moderate Confidence — Partial Soil Test or Mapped Data';
    explanation = 'Key parameters are available, but additional micronutrient assays or recent laboratory re-testing is advised.';
  } else {
    rating = 'Low';
    summary = 'Low Confidence — Field Estimation Only';
    explanation = 'Based primarily on visual farmer estimates and regional approximations. Field-level laboratory soil test strongly recommended.';
  }

  return {
    score: finalScore,
    rating,
    summary,
    explanation,
    breakdown
  };
}

// ------------------------------------------------------------------
// SOIL SUITABILITY EVALUATION FOUNDATION FOR CROP ENGINE
// ------------------------------------------------------------------
export function evaluateSoilCropSuitability(
  cropId: string,
  cropName: string,
  optimalSoils: SoilOrder[],
  optimalPhMin: number,
  optimalPhMax: number,
  soilOrder: SoilOrder,
  ph: number,
  depth: string,
  drainage: string
): SoilCropComparisonResult {
  const reasons: string[] = [];
  const limitations: string[] = [];

  let suitability: SoilCropSuitabilityRating = 'Suitable';

  // 1. Soil Order Match
  const isSoilOrderMatch = optimalSoils.some(s => s === soilOrder || soilOrder.includes(s.split(' ')[0]));
  if (isSoilOrderMatch) {
    reasons.push(`Optimal soil type match: ${soilOrder} is highly suited for ${cropName}.`);
  } else {
    limitations.push(`Soil order (${soilOrder}) is suboptimal compared to ideal types (${optimalSoils.join(', ')}).`);
  }

  // 2. pH Match
  if (ph >= optimalPhMin && ph <= optimalPhMax) {
    reasons.push(`Soil pH (${ph}) falls within ideal range (${optimalPhMin} - ${optimalPhMax}).`);
  } else if (ph < optimalPhMin - 0.5 || ph > optimalPhMax + 0.5) {
    limitations.push(`Soil pH (${ph}) deviates significantly from optimal (${optimalPhMin} - ${optimalPhMax}).`);
    suitability = 'Marginal';
  } else {
    limitations.push(`Soil pH (${ph}) is slightly outside optimal window (${optimalPhMin} - ${optimalPhMax}).`);
  }

  // 3. Depth Match
  if (depth === 'Shallow (< 25 cm)' && (cropId === 'cotton_long' || cropId === 'sugarcane' || cropId === 'pigeonpea_tur')) {
    limitations.push(`Shallow soil (< 25 cm) restricts deep taproot expansion for ${cropName}.`);
    suitability = 'Unsuitable';
  }

  // 4. Drainage Match
  if (drainage.toLowerCase().includes('poor') && (cropId === 'soybean' || cropId === 'maize' || cropId === 'pigeonpea_tur')) {
    limitations.push(`Poor field drainage increases risk of collar rot and seedling mortality in ${cropName}.`);
    if (suitability !== 'Unsuitable') suitability = 'Marginal';
  }

  if (limitations.length === 0 && isSoilOrderMatch) {
    suitability = 'Highly Suitable';
  } else if (limitations.length >= 3) {
    suitability = 'Marginal';
  }

  return {
    cropId,
    cropName,
    suitability,
    reasons,
    limitations
  };
}
