/**
 * FARMFIT AGRICULTURAL EARLY WARNING + OPPORTUNITY INTELLIGENCE SYSTEM
 * 
 * Comprehensive Type Definitions for:
 * 1. Data Control Center & Source Freshness
 * 2. Statistical Price & Arrival Anomaly Engines
 * 3. Market Spread & Seasonality Engines
 * 4. Multi-Stakeholder Opportunity Detectors (Farmer, FPO, B2B, Government)
 * 5. Alert Engine (Priority, Deduplication, Lifecycle, Provenance)
 * 6. Agricultural Market Breadth & Regime Engine
 * 7. Opportunity vs Risk Matrix
 * 8. Stakeholder Action Centers ("What Should I Do Now?")
 * 9. Self-Monitoring Model Health & Degradation Protection
 */

import { StakeholderType } from './validationEngine';
import { MandiPriceRecord } from './marketIntelligence';

// ==========================================
// 1. DATA CONTROL CENTER & SOURCE FRESHNESS
// ==========================================

export type DataSourceOperationalStatus = 
  | 'LIVE / CURRENT'
  | 'RECENT'
  | 'STALE'
  | 'UNAVAILABLE'
  | 'ERROR';

export interface DataControlCenterSourceItem {
  sourceId: string;
  sourceName: string;
  officialAgency: string;
  status: DataSourceOperationalStatus;
  lastSuccessfulRetrieval: string;
  latestObservationDate: string;
  dataAgeDays: number;
  coverageScope: string;
  recordCount: number | null;
  freshnessLabel: string;
  errorStatus: string | null;
  lastValidationTimestamp: string;
  nextRefreshEligibility: string;
  eTagOrVersion: string;
  apiEndpointUrl: string;
  requiresCredentials: boolean;
  notes: string;
}

export interface DataControlCenterSummary {
  totalSourcesConfigured: number;
  liveCurrentCount: number;
  recentCount: number;
  staleCount: number;
  unavailableCount: number;
  errorCount: number;
  overallFreshnessScorePercent: number;
  latestGlobalObservationDate: string;
  totalOfficialRecordsIndexed: number;
}

// ==========================================
// 2. STATISTICAL PRICE & ARRIVAL ANOMALIES
// ==========================================

export type PriceAnomalyType = 
  | 'UNUSUAL_PRICE_INCREASE'
  | 'UNUSUAL_PRICE_DECLINE'
  | 'VOLATILITY_SPIKE'
  | 'PRICE_BREAKOUT'
  | 'PRICE_BREAKDOWN'
  | 'REGIONAL_PRICE_DIVERGENCE'
  | 'NORMAL_STABLE';

export interface PriceAnomalySignal {
  signalId: string;
  commodityId: string;
  commodityName: string;
  commodityCategory: string;
  marketId: string;
  marketName: string;
  state: string;
  district: string;
  currentModalPrice: number;
  observationDate: string;
  baseline7d: number | null;
  baseline30d: number | null;
  baseline90d: number | null;
  historicalVolatilityPercent: number | null;
  currentDeviationPercent: number;
  priceVelocityPercentPerDay: number;
  priceAcceleration: number; // Rate of change of velocity
  zScore: number | null;
  pValueStatisticalSignificance: number | null;
  anomalyType: PriceAnomalyType;
  anomalySeverity: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW';
  confidenceTier: 'HIGH' | 'MODERATE' | 'LOW' | 'INSUFFICIENT_DATA';
  evidenceSummary: string;
}

export type ArrivalAnomalyType = 
  | 'ARRIVAL_SURGE'
  | 'ARRIVAL_COLLAPSE'
  | 'UNUSUAL_ARRIVAL_PRESSURE'
  | 'NORMAL_ARRIVALS'
  | 'ARRIVAL_SIGNAL_UNAVAILABLE';

export interface ArrivalAnomalySignal {
  signalId: string;
  commodityId: string;
  commodityName: string;
  marketId: string;
  marketName: string;
  state: string;
  district: string;
  currentArrivalQuantity: number | null;
  arrivalUnit: string;
  observationDate: string;
  arrivals7dAvg: number | null;
  arrivals30dAvg: number | null;
  arrivals90dAvg: number | null;
  historicalArrivalBaseline: number | null;
  arrivalDeviationPercent: number | null;
  priceArrivalRelationship: 'ELASTIC_INVERSE' | 'INELASTIC' | 'SUPPLY_SHOCK' | 'INSUFFICIENT_CORRELATION';
  anomalyType: ArrivalAnomalyType;
  evidenceSummary: string;
  hasOfficialArrivalData: boolean;
}

// ==========================================
// 3. MARKET SPREAD & SEASONALITY ENGINES
// ==========================================

export type MarketSpreadTier = 'HIGH_PRICE_SPREAD' | 'NORMAL_SPREAD' | 'LOW_SPREAD';

export interface MarketSpreadComparison {
  commodityId: string;
  commodityName: string;
  variety: string;
  grade: string;
  observationDate: string;
  marketsComparedCount: number;
  highestModal: { marketName: string; state: string; district: string; price: number };
  lowestModal: { marketName: string; state: string; district: string; price: number };
  medianModal: number;
  absolutePriceSpreadInrPerQtl: number;
  percentageSpread: number;
  spreadTier: MarketSpreadTier;
  regionalPremiumMarket: string;
  regionalDiscountMarket: string;
  comparableTimeWindowHours: number;
  dataQualityNotes: string;
}

export type SeasonalityStatus = 
  | 'ABOVE_SEASONAL_NORMAL'
  | 'BELOW_SEASONAL_NORMAL'
  | 'WITHIN_SEASONAL_RANGE'
  | 'INSUFFICIENT_HISTORICAL_OBSERVATIONS';

export interface SeasonalityAnalysis {
  commodityId: string;
  commodityName: string;
  observationDate: string;
  currentModalPrice: number;
  seasonalBaselineModalPrice: number | null;
  currentDeviationFromSeasonalPercent: number | null;
  historicalPercentileRank: number | null; // 0 - 100
  historicalYearsSampled: number;
  seasonalityStatus: SeasonalityStatus;
  expectedSeasonalDirectionNext30d: 'SEASONAL_PEAK' | 'SEASONAL_HARVEST_TROUGH' | 'STABLE_OFFSEASON' | 'UNKNOWN';
}

// ==========================================
// 4. MULTI-STAKEHOLDER OPPORTUNITY DETECTORS
// ==========================================

export interface FarmerOpportunityItem {
  opportunityId: string;
  commodityId: string;
  commodityName: string;
  variety: string;
  bestMarketName: string;
  bestMarketDistrict: string;
  bestMarketState: string;
  distanceKm: number;
  latestOfficialModalPrice: number;
  observationDate: string;
  trend30dDirection: 'UP' | 'DOWN' | 'STABLE';
  trendConfidenceStatus: 'VALIDATED_TREND' | 'LIMITED_TREND' | 'INSUFFICIENT_DATA';
  estimatedNrvInrPerQtl: number;
  transportCostInrPerQtl: number;
  nrvAdvantageOverLocalInrPerQtl: number;
  riskRating: 'LOW' | 'MEDIUM' | 'HIGH';
  confidenceTier: 'HIGH' | 'MEDIUM' | 'LOW';
  evidenceText: string;
  actionableRecommendation: string;
  whyThisOpportunity: string;
  isShortTermSpikeWarning: boolean;
}

export interface FpoMarketOpportunityItem {
  opportunityId: string;
  commodityId: string;
  commodityName: string;
  recommendedAggregationRegion: string;
  primaryTargetMarket: string;
  primaryMarketModalPrice: number;
  alternativeMarkets: Array<{ marketName: string; modalPrice: number; distanceKm: number; netAdvantageInrPerQtl: number }>;
  trend30dDirection: 'UP' | 'DOWN' | 'STABLE';
  historicalVolatilityPercent: number;
  estimatedCollectiveNrvInrPerQtl: number;
  bulkLogisticsSavingInrPerQtl: number;
  riskRating: 'LOW' | 'MEDIUM' | 'HIGH';
  confidenceTier: 'HIGH' | 'MEDIUM' | 'LOW';
  evidenceText: string;
  recommendedFpoAction: 'AGGREGATE_AND_DISPATCH' | 'STAGGERED_HOLDING' | 'LOCAL_PROCESSING' | 'DIVERSIFY_CHANNELS';
  diversificationBenefit: string;
}

export interface B2bProcurementOpportunityItem {
  opportunityId: string;
  commodityId: string;
  commodityName: string;
  sourceMarketName: string;
  sourceDistrict: string;
  sourceState: string;
  modalPrice: number;
  estimatedLandedCostInrPerQtl: number;
  priceStabilityScorePercent: number; // Higher is more stable
  volumeLiquidityScorePercent: number;
  supplierConcentrationRisk: 'LOW' | 'MODERATE' | 'HIGH';
  logisticsFeasibility: 'EXCELLENT' | 'GOOD' | 'CONSTRAINED';
  historicalObservationsCount: number;
  observationDate: string;
  rankings: {
    lowestLandedCostRank: number;
    bestPriceStabilityRank: number;
    bestDiversificationRank: number;
    bestRiskAdjustedProcurementRank: number;
  };
  overallB2bRecommendation: 'BUY_NOW' | 'MONITOR_CLOSELY' | 'DIVERSIFY_SOURCING' | 'WAIT_FOR_EVIDENCE' | 'NO_DECISION';
  evidenceText: string;
}

// ==========================================
// 5. GOVERNMENT ECONOMIC EARLY WARNING
// ==========================================

export type GovernmentEarlyWarningSeverity = 'GREEN' | 'YELLOW' | 'ORANGE' | 'RED';

export interface GovernmentEconomicWarningItem {
  warningId: string;
  severity: GovernmentEarlyWarningSeverity;
  warningCategory: 
    | 'COMMODITY_PRICE_STRESS'
    | 'DISTRICT_FOOD_INFLATION'
    | 'REGIONAL_SUPPLY_DEFICIT'
    | 'ARRIVAL_SHOCK_GLUT'
    | 'MARKET_CONCENTRATION_RISK'
    | 'WEATHER_CLIMATE_EXPOSURE'
    | 'INPUT_COST_MARGIN_PRESSURE'
    | 'TRADE_POLICY_EXPOSURE';
  whatChanged: string;
  whereGeography: { state: string; district: string; marketsInvolved: string[] };
  whenDateDetected: string;
  evidenceFacts: string[];
  officialSource: string;
  magnitudeMetrics: {
    priceDeviationPercent?: number;
    arrivalChangePercent?: number;
    affectedEstimatedVolumeQtl?: number;
  };
  whoIsExposed: string;
  whyItMatters: string;
  whatToMonitorPolicyChecklist: string[];
  observedFacts: string[];
  farmfitInterpretation: string;
  confidenceScorePercent: number;
}

// ==========================================
// 6. ALERT ENGINE (Priority, Lifecycle, Deduplication)
// ==========================================

export type AlertPriorityTier = 'INFORMATION' | 'WATCH' | 'ACTION' | 'CRITICAL';
export type AlertLifecycleStatus = 
  | 'DETECTED'
  | 'VALIDATED'
  | 'NOTIFIED'
  | 'ACTION_TAKEN'
  | 'OUTCOME_OBSERVED'
  | 'RESOLVED'
  | 'FALSE_POSITIVE';

export interface SystemEarlyWarningAlert {
  alertId: string;
  eventSignature: string; // Hash of commodity + geography + anomalyType to deduplicate
  firstDetectedTimestamp: string;
  lastUpdatedTimestamp: string;
  status: AlertLifecycleStatus;
  priorityTier: AlertPriorityTier;
  targetStakeholder: StakeholderType | 'ALL';
  commodityId: string;
  commodityName: string;
  geography: { state: string; district: string; marketName?: string };
  headline: string;
  detailedMessage: string;
  provenance: {
    officialSource: string;
    observationDate: string;
    retrievalDate: string;
    calculationFormula: string;
    statisticalRule: string;
    confidenceScorePercent: number;
    supportingBulletinsCount: number;
  };
  whyDidFarmfitAlertMe: string;
  recommendedAction: string;
  linkedDecisionJournalId?: string;
  outcomeTrackingEligible: boolean;
}

// ==========================================
// 7. BREADTH & MARKET REGIME ENGINE
// ==========================================

export type AgriculturalMarketRegimeType = 
  | 'NORMAL'
  | 'BROAD_PRICE_INFLATION'
  | 'BROAD_PRICE_DEFLATION'
  | 'HIGH_VOLATILITY'
  | 'SUPPLY_STRESS'
  | 'REGIONAL_DIVERGENCE'
  | 'MIXED'
  | 'INSUFFICIENT_DATA';

export interface CategoryBreadthMetrics {
  categoryName: string;
  totalValidCommodities: number;
  risingCount: number;
  fallingCount: number;
  stableCount: number;
  abnormalCount: number;
  risingPercent: number;
  fallingPercent: number;
  stablePercent: number;
}

export interface AgriculturalMarketBreadthSummary {
  overallValidCommoditiesCount: number;
  overallRisingCount: number;
  overallFallingCount: number;
  overallStableCount: number;
  overallAbnormalCount: number;
  overallRisingPercent: number;
  overallFallingPercent: number;
  overallStablePercent: number;
  breadthByCategory: Record<string, CategoryBreadthMetrics>;
  detectedMarketRegime: AgriculturalMarketRegimeType;
  regimeMathematicalJustification: string;
  asOfDate: string;
}

// ==========================================
// 8. OPPORTUNITY VS RISK MATRIX
// ==========================================

export type OpportunityRiskQuadrant = 
  | 'HIGH_OPP_LOW_RISK'
  | 'HIGH_OPP_HIGH_RISK'
  | 'LOW_OPP_LOW_RISK'
  | 'LOW_OPP_HIGH_RISK';

export interface OpportunityRiskMatrixItem {
  id: string;
  name: string;
  type: 'COMMODITY' | 'MARKET' | 'DISTRICT' | 'FPO_PORTFOLIO' | 'B2B_CHANNEL';
  opportunityScore: number; // 0 - 100
  riskScore: number; // 0 - 100
  quadrant: OpportunityRiskQuadrant;
  keyCommodityOrMarket: string;
  location: string;
  modalPrice: number;
  trend: string;
  confidence: string;
  primaryDriver: string;
}

// ==========================================
// 9. STAKEHOLDER ACTION CENTERS
// ==========================================

export interface ActionCenterRecommendation {
  id: string;
  stakeholder: StakeholderType;
  title: string;
  actionSummary: string;
  reason: string;
  officialEvidence: string;
  confidenceTier: 'HIGH' | 'MEDIUM' | 'LOW';
  observationDate: string;
  category: 'TOP_OPPORTUNITY' | 'MARKET_TO_WATCH' | 'PRICE_WARNING' | 'WEATHER_RISK' | 'SELLING_ACTION' | 'CROP_MONITOR';
}

// ==========================================
// 10. MODEL HEALTH & DEGRADATION PROTECTION
// ==========================================

export type ModelDegradationTier = 'NORMAL' | 'MODEL_DRIFT' | 'SIGNIFICANT_DEGRADATION';

export interface FarmfitModelHealthMetrics {
  predictionAccuracyPercent: number;
  confidenceCalibrationBrierScore: number;
  recent30dAccuracyPercent: number;
  historicalAccuracyPercent: number;
  falsePositiveRatePercent: number;
  falseNegativeRatePercent: number;
  dataFreshnessScorePercent: number;
  dataCoveragePercent: number;
  modelDriftStatus: 'NORMAL' | 'DRIFT_DETECTED' | 'HIGH_DRIFT';
  alertQualityScorePercent: number;
  degradationProtectionStatus: ModelDegradationTier;
  confidenceRestrictionPolicy: string;
  totalDecisionsAudited: number;
  asOfTimestamp: string;
}

// ==========================================
// 11. UNIVERSAL SEARCH RESULT RECORD
// ==========================================

export interface UniversalSearchResultItem {
  id: string;
  title: string;
  subtitle: string;
  categoryType: 'COMMODITY' | 'MARKET' | 'DISTRICT' | 'STATE';
  modalPrice?: number;
  priceDate?: string;
  trend30d?: string;
  spreadTier?: string;
  riskRating?: string;
  dataStatus: 'OFFICIAL_PRICE_AVAILABLE' | 'OFFICIAL_PRICE_UNAVAILABLE' | 'INSUFFICIENT_TREND_DATA';
  farmerOpportunityCount: number;
  fpoOpportunityCount: number;
  b2bOpportunityCount: number;
  governmentAlertCount: number;
}
