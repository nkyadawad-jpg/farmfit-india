import { 
  CropSeason, 
  FarmLocation, 
  LandIrrigationProfile, 
  SoilProfileRecord, 
  FarmerProfile, 
  CropCategory,
  ThreeTierRecommendationVerdict,
  CropConstraintItem,
  WaterFeasibilityAnalysis,
  ConditionalManagementPlan,
  ConstraintManageabilityClassification
} from '../types';
import { UniversalCommodityRecord } from './commodityMaster';
import { CropSuitabilityResult } from '../types';
import { 
  MarketComparisonRecord, 
  NetRealizationResult, 
  PriceTrendAnalysis,
  PriceTrendDirection,
  MarketFreshnessStatus
} from './marketIntelligence';
import { AgriculturalRiskProfile, RiskLevel } from './riskEngine';
import { ExogenousShockInput, ScenarioPropagationImpact } from './scenarioEngine';
import { ConfidenceMetrics, ModelConfidenceTier } from './confidenceFramework';
import { TraceableDataProvenance } from './dataProvenance';

/**
 * FARMFIT UNIFIED DECISION MODEL (v1)
 * Single authoritative decision assessment object answering:
 * "Given this farmer's actual farm, location, soil, water, climate, season and current official market conditions, 
 * which crop has the strongest risk-adjusted economic opportunity, and where should it be sold?"
 */

export type PrimaryDecisionStatus = 
  | 'RECOMMENDED'
  | 'RECOMMENDED WITH MANAGEMENT'
  | 'CONSIDER'
  | 'HIGH RISK — MONITOR'
  | 'NOT RECOMMENDED'
  | 'INSUFFICIENT DATA';

export interface ManageableRiskAnalysisItem {
  riskId: string;
  riskFactor: string;
  category: 'WATER' | 'WEATHER' | 'PRICE' | 'SOIL' | 'LOGISTICS' | 'CAPITAL' | 'PEST_DISEASE';
  cause: string;
  evidence: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  canFarmerManage: 'YES' | 'PARTLY' | 'NO';
  managementClassification: 'MANAGEABLE' | 'MANAGEABLE_WITH_COST' | 'PARTIALLY_MANAGEABLE' | 'STRUCTURAL_CONSTRAINT' | 'UNMANAGEABLE';
  managementOption: string;
  actionableSteps: string[];
  estimatedCostPerAcre: number;
  costExplanation: string;
  riskBeforeManagement: number; // 0 - 100 score
  riskAfterManagement: number; // 0 - 100 score (residual)
  residualRiskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  economicImpact: string;
  decisionImpact: PrimaryDecisionStatus;
  mitigationNotice: string;
}

export interface EconomicWaterfall {
  grossRevenuePerAcre: { value: number; provenance: 'OFFICIAL DATA' | 'FARMFIT DERIVED' | 'MODEL ESTIMATE' };
  baseProductionCostPerAcre: { value: number; provenance: 'OFFICIAL DATA' | 'FARMFIT DERIVED' | 'MODEL ESTIMATE' };
  additionalRiskMitigationCostPerAcre: { value: number; provenance: 'FARMFIT DERIVED' | 'MODEL ESTIMATE' };
  logisticsHandlingCostPerAcre: { value: number; provenance: 'OFFICIAL DATA' | 'FARMFIT DERIVED' | 'MODEL ESTIMATE' };
  expectedEconomicRealizationPerAcre: { value: number; provenance: 'FARMFIT DERIVED' };
  expectedTotalEconomicRealization: { value: number; provenance: 'FARMFIT DERIVED' };
  riskAdjustedRealizationPerAcre: { value: number; provenance: 'MODEL ESTIMATE' };
  riskAdjustedTotalRealization: { value: number; provenance: 'MODEL ESTIMATE' };
  disclaimer: string;
}

export interface CropComparisonRow {
  cropId: string;
  cropName: string;
  category: string;
  rank: number;
  decisionStatus: PrimaryDecisionStatus;
  agronomicSuitabilityScore: number;
  waterRequirementMm: number;
  waterFeasibility: string;
  expectedYieldQuintalsPerAcre: number;
  latestPricePerQtl: number | null;
  priceTrend: PriceTrendDirection;
  priceVolatility: string;
  nearestMarketName: string;
  nearestMarketDistanceKm: number;
  estimatedNrvPerQtl: number | null;
  riskScore: number;
  riskLevel: RiskLevel;
  manageability: string;
  expectedRealizationPerAcre: number | null;
  riskAdjustedScore: number;
  confidenceTier: ModelConfidenceTier;
  confidenceScore: number;
  whyRankedHere: string;
}

export interface WhyNotAlternativeReason {
  cropId: string;
  cropName: string;
  rank: number;
  decisionStatus: PrimaryDecisionStatus;
  whyNotFirst: string;
  differentiatingFactors: {
    factor: string;
    firstPlaceCropAdvantage: string;
    thisCropDeficit: string;
  }[];
}

export interface DecisionChangeTrigger {
  id: string;
  triggerName: string;
  parameter: string;
  currentValue: string | number;
  thresholdValue: string | number;
  condition: string;
  sourceEvidence: string;
  decisionImpactIfTriggered: PrimaryDecisionStatus;
  explanation: string;
}

export interface FarmfitActionPlanMilestone {
  title: string;
  timeframe: string;
  actions: string[];
  criticalChecks: string[];
}

export interface FarmfitActionPlan {
  now: FarmfitActionPlanMilestone;
  next: FarmfitActionPlanMilestone;
  beforePlanting: FarmfitActionPlanMilestone;
  duringCrop: FarmfitActionPlanMilestone;
  beforeHarvest: FarmfitActionPlanMilestone;
  sellingWindow: FarmfitActionPlanMilestone;
}

export interface MonitoringSignalItem {
  signal: string;
  category: 'PRICE' | 'ARRIVALS' | 'WEATHER' | 'WATER' | 'INPUTS' | 'FREIGHT' | 'POLICY' | 'SPREAD';
  currentValue: string;
  previousValue: string;
  direction: 'RISING' | 'FALLING' | 'STABLE' | 'ANOMALOUS';
  alertThreshold: string;
  potentialDecisionImpact: string;
  urgency: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface LinkedEarlyWarning {
  alertId: string;
  title: string;
  severity: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'INFO';
  affectedCrop: string;
  mechanismOfImpact: string;
  isManageable: boolean;
  managementRecommendation: string;
  decisionImpact: string;
  doesRecommendationChange: boolean;
  revisedStatus?: PrimaryDecisionStatus;
}

export interface ExplainableConfidenceFactors {
  marketObservationCount: number;
  historicalDepthDays: number;
  locationCompleteness: boolean;
  commodityMappingStatus: string;
  weatherDataAvailable: boolean;
  priceFreshnessDays: number;
  trendReliabilityScore: number;
  backtestValidationEvidence: string;
  tier: ModelConfidenceTier;
  tierScore: number;
  checklist: { factor: string; status: 'MET' | 'PARTIAL' | 'DEFICIT'; note: string }[];
}

export interface VerifiedPriceEvidence {
  latestModalPrice: number | null;
  minPrice: number | null;
  maxPrice: number | null;
  priceUnit: string;
  priceDate: string | null;
  marketName: string | null;
  marketDistrict: string | null;
  marketState: string | null;
  variety: string | null;
  grade: string | null;
  sourceName: string;
  sourceUrl: string;
  isVerifiedOfficial: boolean;
  recordStatus: 'OFFICIAL DATA' | 'HISTORICAL DATA' | 'OFFICIAL DATA TEMPORARILY UNAVAILABLE';
}

export interface ExpectedPriceEngineResult {
  status: 'AVAILABLE' | 'FORECAST_NOT_AVAILABLE';
  bearCase: { price: number; assumptions: string[] };
  baseCase: { price: number; assumptions: string[] };
  bullCase: { price: number; assumptions: string[] };
  historicalEvidenceSummary: string;
  currentMarketEvidence: string;
  forwardSignal: string;
  confidence: ModelConfidenceTier;
  confidenceScore: number;
  mainDrivers: string[];
  invalidationConditions: string[];
}

export interface CostComponentItem {
  category: 'Seed' | 'Fertilizer' | 'Pesticide' | 'Labour' | 'Irrigation' | 'Machinery' | 'Harvesting' | 'Post-Harvest' | 'Transport' | 'Market Charges' | 'Other';
  costPerAcre: number;
  provenance: 'OFFICIAL DATA' | 'USER INPUT' | 'FARMFIT DERIVED' | 'ESTIMATE' | 'UNAVAILABLE';
  benchmarkReference: string;
}

export interface FarmProfitabilityOutcome {
  expectedYieldQuintalsPerAcre: number;
  expectedTotalProductionQuintals: number;
  itemizedCosts: CostComponentItem[];
  totalCostPerAcre: number;
  totalFarmCost: number;
  bearCase: {
    pricePerQtl: number;
    grossRevenuePerAcre: number;
    netRealizationPerAcre: number;
    totalGrossRevenue: number;
    totalNetRealization: number;
    roiPercent: number;
  };
  baseCase: {
    pricePerQtl: number;
    grossRevenuePerAcre: number;
    netRealizationPerAcre: number;
    totalGrossRevenue: number;
    totalNetRealization: number;
    roiPercent: number;
  };
  bullCase: {
    pricePerQtl: number;
    grossRevenuePerAcre: number;
    netRealizationPerAcre: number;
    totalGrossRevenue: number;
    totalNetRealization: number;
    roiPercent: number;
  };
  capitalRequirement: number;
  workingCapitalBudget: number | 'UNLIMITED';
  capitalSufficiencyStatus: 'WITHIN_BUDGET' | 'BUDGET_EXCEEDED' | 'UNLIMITED';
  capitalEfficiency: number;
}

export interface ProductionTimingIntelligence {
  verdict: 'FAVOURABLE' | 'NEUTRAL' | 'CAUTION' | 'NOT_RECOMMENDED';
  sowingWindow: string;
  harvestWindow: string;
  durationDays: number;
  seasonalAlignment: string;
  arrivalPatternExpectation: string;
  timingRationale: string;
}

export interface SellingTimingIntelligence {
  action: 'SELL NOW' | 'HOLD / MONITOR' | 'WAIT FOR BETTER MARKET' | 'CAUTION' | 'INSUFFICIENT EVIDENCE';
  priceMomentum: string;
  sevenDayTrend: string;
  thirtyDayTrend: string;
  arrivalPressure: 'HIGH_GLUT' | 'NORMAL' | 'LEAN_SUPPLY' | 'UNKNOWN';
  liquidityCondition: string;
  recommendationDetail: string;
}

export interface WaterAndWeatherConditioning {
  waterRequirementMm: number;
  farmWaterCapacityMm: number;
  waterSufficiencyIndex: number;
  waterRiskPenalty: number;
  weatherSupportSummary: string;
  rainfallAnomalyContext: string;
  temperatureSuitability: string;
}

export interface AlternativeMarketItem {
  marketName: string;
  state: string;
  district: string;
  modalPrice: number;
  distanceKm: number;
  estimatedFreightPerQtl: number;
  netRealizationPerQtl: number;
  liquidity: string;
  trend: PriceTrendDirection;
  confidence: ModelConfidenceTier;
  isBest: boolean;
}

export interface WhyNotReason {
  cropId: string;
  cropName: string;
  rank: number;
  primaryDeficit: string;
  reasons: string[];
}

export interface DecisionDrivers {
  positiveDrivers: string[];
  limitingDrivers: string[];
  marketDrivers: string[];
  riskDrivers: string[];
}

export interface DecisionRecommendation {
  rank: number;
  verdict: 'HIGHLY RECOMMENDED' | 'RECOMMENDED' | 'CONDITIONALLY RECOMMENDED' | 'VIABLE WITH HEDGING' | 'HIGH RISK / MARGINAL' | 'AVOID / HARD CONSTRAINT' | 'NOT RECOMMENDED' | 'INSUFFICIENT DATA';
  primaryDecisionStatus: PrimaryDecisionStatus;
  threeTierVerdict?: ThreeTierRecommendationVerdict;
  hardConstraintReason?: string | null;
  constraints?: CropConstraintItem[];
  waterFeasibility?: WaterFeasibilityAnalysis;
  conditionalManagementPlan?: ConditionalManagementPlan | null;
  summaryHeadline: string;
  topBenefit: string;
  topRisk: string;
  canTopRiskBeManaged: 'YES' | 'PARTLY' | 'NO';
  keyManagementAction: string;
  whyThisCrop: string[];
  whyThisMarket: string[];
  whatAreTheRisks: string[];
  whatCouldChangeTheDecision: string[];
  howConfidentIsFarmfit: string;
  top3Reasons: string[];
  whyFarmfitMadeThisDecision: string[];
}

export interface MarketOpportunitySummary {
  bestMarket: MarketComparisonRecord | null;
  top10Markets: MarketComparisonRecord[];
  allMarkets: MarketComparisonRecord[];
  totalMarketsIn200km: number;
  hasOfficialPrices: boolean;
  latestOfficialRecordDate: string | null;
  modalPriceRange: {
    min: number;
    max: number;
    average: number;
  } | null;
  searchRadiusKm: number;
}

export interface FarmDecisionAssessment {
  decisionId: string;
  generatedAt: string;
  
  // Farm Context
  farm: {
    farmerProfile?: Partial<FarmerProfile>;
    farmLocation: FarmLocation;
    landProfile?: Partial<LandIrrigationProfile>;
    soilProfile?: Partial<SoilProfileRecord>;
    targetSeason: CropSeason;
    plannedAcres: number;
  };
  location: FarmLocation;
  
  // Commodity Master Record
  crop: UniversalCommodityRecord;
  cropCommodityId: string;
  displayName: string;
  category: CropCategory;
  season: CropSeason;

  // Farm Suitability
  suitability: CropSuitabilityResult;
  farmSuitabilityScore: number; // 0 to 100
  isFarmDataComplete: boolean;

  // Primary Decision Status
  primaryDecisionStatus: PrimaryDecisionStatus;

  // Manageable Risk & Action Plan Framework (Phase 6)
  manageableRisks: ManageableRiskAnalysisItem[];
  economicWaterfall: EconomicWaterfall;
  decisionChangeTriggers: DecisionChangeTrigger[];
  actionPlan: FarmfitActionPlan;
  monitoringSignals: MonitoringSignalItem[];
  linkedEarlyWarnings: LinkedEarlyWarning[];
  explainableConfidence: ExplainableConfidenceFactors;

  // Market & Price Evidence
  marketOpportunity: MarketOpportunitySummary;
  priceEvidence: VerifiedPriceEvidence;
  historicalTrend: PriceTrendAnalysis;
  
  // Logistics & NRV
  nrv: NetRealizationResult;
  
  // 12-Dimensional Risk Profile
  riskAssessment: AgriculturalRiskProfile;
  
  // Forward Decision Layer additions
  expectedPrice: ExpectedPriceEngineResult;
  profitability: FarmProfitabilityOutcome;
  productionTiming: ProductionTimingIntelligence;
  sellingTiming: SellingTimingIntelligence;
  waterAndWeather: WaterAndWeatherConditioning;
  alternativeMarkets: AlternativeMarketItem[];
  whyNotReasons?: WhyNotReason[];
  whyNotAlternatives?: WhyNotAlternativeReason[];
  comparisonMatrix?: CropComparisonRow[];

  // What-If Scenario Impact (defaulted to active or base scenario)
  scenarioAssessment: {
    activeShock: ExogenousShockInput;
    impact: ScenarioPropagationImpact;
  };

  // Quantitative Composite Scores (Labeled FARMFIT DERIVED INTELLIGENCE)
  opportunityScore: number; // 0 to 100
  riskAdjustedScore: number; // 0 to 100
  riskLevel: RiskLevel;

  // Confidence & Provenance
  confidence: ConfidenceMetrics;
  dataFreshness: MarketFreshnessStatus;
  provenance: TraceableDataProvenance[];

  // Qualitative Analysis & Actionable Explanations
  drivers: DecisionDrivers;
  warnings: string[];
  recommendation: DecisionRecommendation;

  // Static badge labeling requirement
  derivedLabel: 'FARMFIT DERIVED INTELLIGENCE';
}

/**
 * Multi-Crop Comparison & Ranking Item
 */
export interface CropOpportunityRankItem {
  rank: number;
  cropId: string;
  cropName: string;
  category: CropCategory;
  primaryDecisionStatus: PrimaryDecisionStatus;
  recommendationVerdict: ThreeTierRecommendationVerdict;
  threeTierVerdict?: ThreeTierRecommendationVerdict;
  hardConstraintReason?: string | null;
  opportunityScore: number;
  riskAdjustedScore: number;
  riskLevel: RiskLevel;
  farmSuitabilityScore: number;
  farmSuitabilityLevel: string;
  waterRequirementMm: number;
  waterFeasibility?: WaterFeasibilityAnalysis;
  constraints?: CropConstraintItem[];
  conditionalPlan?: ConditionalManagementPlan;
  conditionalManagementPlan?: ConditionalManagementPlan | null;
  manageableRisks?: ManageableRiskAnalysisItem[];
  economicWaterfall?: EconomicWaterfall;
  actionPlan?: FarmfitActionPlan;
  decisionChangeTriggers?: DecisionChangeTrigger[];
  linkedEarlyWarnings?: LinkedEarlyWarning[];
  expectedYieldPerAcre: number;
  latestModalPrice: number | null;
  priceDate: string | null;
  priceTrend: PriceTrendDirection;
  sevenDayTrendPercent?: number;
  thirtyDayTrendPercent?: number;
  ninetyDayTrendPercent?: number;
  priceVolatility: string;
  arrivalTrend: string;
  marketLiquidity: string;
  bestMandiName: string | null;
  bestMandiDistanceKm: number | null;
  estimatedLogisticsPerQtl: number | null;
  estimatedGrossRevenuePerAcre: number | null;
  estimatedCultivationCostPerAcre: number | null;
  nrvPerQtl: number | null;
  nrvStatus: string;
  expectedNetRealizationPerAcre: number | null;
  capitalRequirementTotal: number | null;
  capitalSufficiency: 'WITHIN_BUDGET' | 'BUDGET_EXCEEDED' | 'UNLIMITED';
  confidenceTier: ModelConfidenceTier;
  confidenceScore: number;
  dataSufficiency: string;
  top3Reasons: string[];
  warnings: string[];
  assessment: FarmDecisionAssessment;
}
