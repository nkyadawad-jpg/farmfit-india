/**
 * FARMFIT STAKEHOLDER DECISION CENTER DATA MODELS
 * Unified types for Farmer, FPO, B2B Procurement, and Government Decision Engines.
 */

import { CropSeason, CropCategory, FarmLocation, RiskDimensionType } from '../types';
import { UniversalCommodityRecord } from './commodityMaster';
import { ModelConfidenceTier, DataFreshnessTier } from './confidenceFramework';
import { TraceableDataProvenance } from './dataProvenance';
import { RiskLevel } from './riskEngine';
import { ExogenousShockInput } from './scenarioEngine';
import { 
  PrimaryDecisionStatus, 
  ManageableRiskAnalysisItem, 
  EconomicWaterfall, 
  FarmfitActionPlan, 
  DecisionChangeTrigger,
  LinkedEarlyWarning
} from './decisionAssessment';

export type StakeholderRole = 'FARMER' | 'FPO' | 'B2B' | 'GOVERNMENT';

export type EvidenceClassification = 
  | 'OFFICIAL_OBSERVED_DATA'
  | 'FARMFIT_DERIVED_INTELLIGENCE'
  | 'FARMFIT_MODEL_ESTIMATE'
  | 'FARMFIT_SCENARIO_SIMULATION';

export interface DecisionEvidenceItem {
  id: string;
  classification: EvidenceClassification;
  label: string;
  source: string;
  sourceUrl?: string;
  date: string;
  observationCount?: number;
  calculationFormula?: string;
  confidence: ModelConfidenceTier;
  notes?: string;
}

export interface UniversalDecisionCardProps {
  decisionTitle: string;
  decisionSubtitle?: string;
  commodityName?: string;
  cropCommodityId?: string;
  whyExplanation: string;
  opportunityValue: string;
  opportunityDetail?: string;
  riskLevel: RiskLevel;
  riskScore?: number;
  riskSummary: string;
  confidenceTier: ModelConfidenceTier;
  confidenceExplanation: string;
  dataDate: string;
  dataSourceName: string;
  evidenceItems: DecisionEvidenceItem[];
  actionLabel?: string;
  onAction?: () => void;
  badgeTag?: string;
  evidenceSufficiencyTag?: string;
  isTrendSufficient?: boolean;
  // Phase 6 extensions
  primaryDecisionStatus?: PrimaryDecisionStatus;
  manageableRisks?: ManageableRiskAnalysisItem[];
  economicWaterfall?: EconomicWaterfall;
  actionPlan?: FarmfitActionPlan;
  decisionChangeTriggers?: DecisionChangeTrigger[];
  linkedEarlyWarnings?: LinkedEarlyWarning[];
}

// ==========================================
// 1. FPO DECISION MODELS
// ==========================================

export interface FpoSetupProfile {
  fpoId: string;
  fpoName: string;
  state: string;
  district: string;
  taluka?: string;
  villages?: string[];
  numberOfFarmers: number;
  totalCultivableAreaAcres: number;
  irrigatedAreaAcres: number;
  rainfedAreaAcres: number;
  targetSeason: CropSeason;
  targetMarketRadiusKm: number;
  storageCapacityMetricTonnes: number;
  hasColdStorage: boolean;
  hasExistingBuyerContracts: boolean;
  contractedQuantityMetricTonnes?: number;
  isQuickStart: boolean;
}

export type FpoPortfolioBucket = 
  | 'CORE_CROPS' 
  | 'OPPORTUNITY_CROPS' 
  | 'DIVERSIFICATION_CROPS' 
  | 'HIGH_RISK_HIGH_REWARD';

export interface FpoCropPlanItem {
  cropCommodityId: string;
  cropName: string;
  category: CropCategory;
  portfolioBucket: FpoPortfolioBucket;
  portfolioBucketLabel: string;
  portfolioRationale: string;
  
  // Acreage Allocation (Planning Estimate)
  recommendedAcreagePercent: number;
  recommendedAcreageAcres: number;
  acreageAssumptionsLabel: 'FARMFIT PLANNING ESTIMATE';
  acreageAssumptionsExplanation: string;
  
  // Production
  expectedYieldQuintalPerAcre: number;
  expectedProductionTonnes: number;
  
  // Harvest & Market Windows
  expectedSowingPeriod: string;
  expectedProductionPeriod: string;
  potentialMarketWindow: string;
  priceRiskPeriod: string;
  arrivalGlutRiskLevel: RiskLevel;
  arrivalGlutExplanation: string;
  
  // Financials & NRV
  latestObservedModalPriceInrQtl: number | null;
  priceDate: string | null;
  priceTrend: 'RISING' | 'STABLE' | 'FALLING' | 'INSUFFICIENT_DATA';
  estimatedCostOfCultivationInrPerAcre: number;
  expectedGrossRevenueInrLakhs: number;
  expectedNetRealizationInrLakhs: number;
  expectedNrvInrPerQtl: number;
  
  // Markets
  bestApmcName: string;
  bestApmcDistanceKm: number;
  bestApmcPrice: number;
  secondApmcName?: string;
  secondApmcDistanceKm?: number;
  secondApmcPrice?: number;
  alternativeMarketName?: string;
  alternativeMarketDistanceKm?: number;
  alternativeMarketPrice?: number;
  
  // Selling Strategies
  recommendedSellingStrategy: 'LOCAL_APMC' | 'REGIONAL_BULK' | 'DISTANT_TERMINAL' | 'DIRECT_BUYER_CONTRACT';
  sellingStrategyExplanation: string;
  
  // Risk & Confidence
  riskScore: number;
  riskLevel: RiskLevel;
  confidenceTier: ModelConfidenceTier;
  confidenceWhy: string;
  recommendationReason: string;
  
  // Evidence
  evidenceItems: DecisionEvidenceItem[];
}

export interface FpoRiskExposureSummary {
  weatherRiskScore: number;
  productionRiskScore: number;
  priceRiskScore: number;
  demandRiskScore: number;
  supplyRiskScore: number;
  waterRiskScore: number;
  inputCostRiskScore: number;
  logisticsRiskScore: number;
  tradeRiskScore: number;
  policyRiskScore: number;
  climateRiskScore: number;
  incomeRiskScore: number;
  top5Risks: { title: string; score: number; level: RiskLevel; driver: string }[];
  mitigationActions: { actionTitle: string; timeframe: string; impact: string }[];
}

export interface FpoScenarioSimulationResult {
  shockApplied: string;
  simulatedProductionTonnes: number;
  productionDeltaPercent: number;
  simulatedGrossValueInrCrores: number;
  grossValueDeltaPercent: number;
  simulatedNrvInrQtl: number;
  nrvDeltaPercent: number;
  simulatedNetTurnoverInrCrores: number;
  revenueExposureInrLakhs: number;
  simulatedRiskScore: number;
  simulatedOpportunityScore: number;
  simulationLabel: 'FARMFIT SCENARIO SIMULATION';
  keyImpactNotes: string[];
}

export interface FpoDecisionPlanResult {
  fpoProfile: FpoSetupProfile;
  evaluatedDate: string;
  totalAggregatedAcreage: number;
  cropPlan: FpoCropPlanItem[];
  portfolioBreakdown: {
    coreCropsAcreagePercent: number;
    opportunityCropsAcreagePercent: number;
    diversificationCropsAcreagePercent: number;
    highRiskHighRewardAcreagePercent: number;
    diversificationBenefitScore: number;
    portfolioRationale: string;
  };
  aggregateExpectedProductionTonnes: number;
  aggregateGrossRevenueInrCrores: number;
  aggregateNetRealizationInrCrores: number;
  riskSummary: FpoRiskExposureSummary;
  scenarioSimulations: FpoScenarioSimulationResult[];
  nextActionPlan: {
    stepNumber: number;
    actionTitle: string;
    actionDescription: string;
    targetTimeframe: string;
    expectedBenefit: string;
  }[];
}

// ==========================================
// 2. B2B PROCUREMENT MODELS
// ==========================================

export interface B2BProcurementInput {
  requirementId: string;
  commodityId: string;
  commodityName: string;
  requiredQuantityMetricTonnes: number;
  quantityUnit: 'Metric Tonnes' | 'Quintals' | 'Bags';
  qualityGrade: 'FAQ (Fair Average Quality)' | 'Grade A High Purity' | 'Processing Grade' | 'Export Quality';
  varietyPreference?: string;
  procurementStartDate: string;
  procurementEndDate: string;
  deliveryHubName: string;
  deliveryHubState: string;
  deliveryHubLatitude: number;
  deliveryHubLongitude: number;
  maxTargetPriceInrPerQtl?: number;
  preferredSourcingRadiusKm: number;
  hasStorageFacility: boolean;
  sourcingMode: 'ALL_CHANNELS' | 'FPO_ONLY' | 'APMC_ONLY' | 'DIRECT_FARMGATE' | 'MULTI_REGION';
}

export interface B2BSourcingOpportunityItem {
  rank: number;
  state: string;
  district: string;
  marketName: string;
  cropCommodityId: string;
  commodityDisplayName: string;
  latestModalPriceInrQtl: number;
  priceDate: string;
  priceTrend7D: 'RISING' | 'STABLE' | 'FALLING';
  priceTrend30D: 'RISING' | 'STABLE' | 'FALLING';
  priceTrend90D: 'RISING' | 'STABLE' | 'FALLING';
  distanceToHubKm: number;
  estimatedFreightInrPerQtl: number;
  landedCostInrPerQtl: number;
  targetPriceVarianceInrPerQtl: number | null; // (Landed - Target)
  
  // Supply Evidence
  supplyEvidenceLabel: string;
  isSupplyVerified: boolean;
  supplyVerificationTag: 'OFFICIAL OBSERVED APMC ARRIVALS' | 'SUPPLY QUANTITY NOT VERIFIED';
  estimatedDistrictProductionTonnes?: number;
  dailyApmcArrivalTonnes?: number;
  potentialFpoPresence: boolean;
  fpoClusterName?: string;
  
  // Risk & Confidence
  procurementRiskScore: number; // 0 (Lowest risk) - 100 (Highest)
  procurementRiskLevel: RiskLevel;
  confidenceTier: ModelConfidenceTier;
  confidenceWhy: string;
  evidenceItems: DecisionEvidenceItem[];
}

export interface B2BMultiSourcingAllocation {
  recommendedSourcingSplit: {
    regionName: string;
    state: string;
    allocatedQuantityMetricTonnes: number;
    allocatedPercent: number;
    avgLandedCostInrPerQtl: number;
    primaryApmcs: string[];
    riskScore: number;
    rationale: string;
  }[];
  concentrationRiskScore: number; // 0 - 100
  diversificationAdvantage: string;
}

export interface B2BPriceIntelligence {
  latestOfficialPriceInrQtl: number;
  priceDate: string;
  freshnessStatus: DataFreshnessTier;
  priceRangeMinInrQtl: number;
  priceRangeMaxInrQtl: number;
  historical7DayTrendPercent: number;
  historical30DayTrendPercent: number;
  historical90DayTrendPercent: number;
  volatilityIndex: number;
  priceSignal: 'RISING' | 'STABLE' | 'FALLING' | 'INSUFFICIENT DATA';
  priceSignalLabel: 'FARMFIT DERIVED INTELLIGENCE';
  signalReasoning: string;
}

export interface B2BProcurementRiskScoreBreakdown {
  compositeRiskScore: number; // 0 - 100
  riskLevel: RiskLevel;
  priceRisk: number;
  supplyRisk: number;
  weatherRisk: number;
  logisticsRisk: number;
  qualityRisk: number;
  tradeRisk: number;
  policyRisk: number;
  concentrationRisk: number;
  methodologyNotes: string;
}

export interface B2BScenarioSimulationResult {
  shockApplied: string;
  landedCostInrPerQtl: number;
  landedCostDeltaPercent: number;
  totalProcurementCostInrCrores: number;
  costVarianceInrLakhs: number;
  supplyAvailabilityScore: number;
  alternativeSourcingRecommendation: string;
  simulatedRiskScore: number;
  simulationLabel: 'FARMFIT SCENARIO SIMULATION';
}

export interface B2BProcurementDecisionResult {
  procurementInput: B2BProcurementInput;
  evaluatedDate: string;
  sourcingOpportunities: B2BSourcingOpportunityItem[];
  multiSourcingAllocation: B2BMultiSourcingAllocation;
  priceIntelligence: B2BPriceIntelligence;
  riskBreakdown: B2BProcurementRiskScoreBreakdown;
  scenarioSimulations: B2BScenarioSimulationResult[];
  nextActionPlan: {
    stepNumber: number;
    actionTitle: string;
    actionDescription: string;
    urgency: 'IMMEDIATE' | 'NEXT_7_DAYS' | 'PRE_HARVEST';
  }[];
}

// ==========================================
// 3. GOVERNMENT & INSTITUTIONAL MODELS
// ==========================================

export interface GovernmentNationalOverview {
  reportingDate: string;
  totalMandisMonitored: number;
  totalCommoditiesTracked: number;
  totalStatesCovered: number;
  totalDistrictsCovered: number;
  nationalAgriculturalPricePressureIndex: {
    score: number;
    status: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE';
    commoditiesUnderInflationaryPressure: string[];
    commoditiesUnderDeflationaryPressure: string[];
  };
  supplyRiskScore: number;
  weatherRiskScore: number;
  productionExposureScore: number;
  inputCostPressureScore: number;
  logisticsPressureScore: number;
  tradeExposureScore: number;
  farmerIncomeExposureScore: number;
  compositeAgriculturalHealthScore: number;
  dataCoverageNotice: string;
}

export interface AgriculturalHotspotItem {
  id: string;
  state: string;
  district: string;
  commodityId: string;
  commodityName: string;
  stressDimension: 'PRICE_STRESS' | 'SUPPLY_STRESS' | 'WEATHER_STRESS' | 'FARMER_INCOME_STRESS' | 'COMMODITY_RISK';
  stressScore: number; // 0 - 100
  stressLevel: RiskLevel;
  reportedModalPriceInrQtl?: number;
  priceVarianceFromMspPercent?: number;
  rainfallDeviationPercent?: number;
  primaryStressDriver: string;
  dataCoverageStatus: 'VERIFIED_DAILY_APMC' | 'DISTRICT_ESTIMATE' | 'LIMITED_OBSERVATION';
  observationCount: number;
}

export interface GovernmentScenarioSimulationResult {
  shockApplied: string;
  affectedCommodities: string[];
  affectedStates: string[];
  projectedPriceImpactPercent: number;
  projectedSupplyImpactPercent: number;
  projectedFarmerGrossIncomeImpactInrCrores: number;
  projectedConsumerInflationImpactPercent: number;
  recommendedPolicyPreparedness: string;
  simulationLabel: 'FARMFIT SCENARIO SIMULATION';
}

export interface GovernmentDecisionResult {
  nationalOverview: GovernmentNationalOverview;
  hotspots: AgriculturalHotspotItem[];
  earlyWarnings: {
    alertId: string;
    alertType: string;
    severity: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'ADVISORY';
    headline: string;
    commodityName: string;
    geography: string;
    driver: string;
    evidence: string;
    dateTriggered: string;
    confidenceScore: number;
    potentialImpact: string;
    recommendedAttention: string;
  }[];
  scenarioSimulations: GovernmentScenarioSimulationResult[];
  nextActionPlan: {
    stepNumber: number;
    actionTitle: string;
    actionDescription: string;
    department: string;
    timeline: string;
  }[];
}
