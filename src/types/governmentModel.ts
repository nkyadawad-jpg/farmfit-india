/**
 * FARMFIT GOVERNMENT & INSTITUTIONAL DECISION INTELLIGENCE MODEL
 * Supports state departments of agriculture, CACP, NITI Aayog, and disaster relief planners.
 */

export interface DistrictCropProductionEstimate {
  cropCommodityId: string;
  cropName: string;
  season: string;
  sownAreaHectares: number;
  expectedYieldKgPerHa: number;
  estimatedProductionMetricTonnes: number;
  deviationFrom5YearAveragePercent: number;
  mspProcurementTargetMetricTonnes?: number;
  estimatedPriceDeficiencyExposureInrCrores?: number;
}

export interface GovernmentInstitutionalDistrictProfile {
  state: string;
  district: string;
  reportingYear: string;
  agriculturalGrossDistrictProductInrCrores: number;
  smallAndMarginalFarmerPercent: number;
  totalCroppedAreaHectares: number;
  irrigationCoveragePercent: number;
  districtProductionEstimates: DistrictCropProductionEstimate[];
  droughtVulnerabilityIndex: number; // 0 - 100
  marketPriceDistressAlerts: string[];
  recommendedPolicyInterventions: string[];
}
