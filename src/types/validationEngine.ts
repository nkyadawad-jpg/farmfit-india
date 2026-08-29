/**
 * FARMFIT DECISION VALIDATION & BACKTESTING ENGINE — TYPE DEFINITIONS
 * 
 * Strict Principle:
 * - Distinguishes PREDICTION at T0 from OBSERVED OUTCOME at T+N.
 * - Enforces zero future data leakage (no look-ahead bias).
 * - All metrics ground in official AGMARKNET / CACP observations with sample size (N).
 */

import { ModelConfidenceTier } from './confidenceFramework';
import { RiskLevel } from './riskEngine';

export type StakeholderType = 'FARMER' | 'FPO' | 'B2B' | 'GOVERNMENT';

export type DecisionType =
  // Farmer
  | 'FARMER_CROP_SELECTION'       // "What should I grow?"
  | 'FARMER_MARKET_ROUTING'       // "Where should I sell?"
  // FPO
  | 'FPO_PORTFOLIO_PLAN'          // "What should our members produce?"
  | 'FPO_MARKET_OFFTAKE'          // "Which market should we target?"
  // B2B
  | 'B2B_SOURCING_MARKET'         // "Where should we procure?"
  | 'B2B_PROCUREMENT_TIMING'      // "When should we procure?"
  // Government
  | 'GOVERNMENT_PRICE_STABILIZATION' // "Which commodity/district shows elevated economic risk?"
  | 'GOVERNMENT_SUPPLY_ALERT';

export type PriceDirection = 'UP' | 'DOWN' | 'STABLE' | 'INSUFFICIENT_DATA';

export type ValidationOutcomeStatus =
  | 'DIRECTIONALLY_CORRECT'
  | 'DIRECTIONALLY_INCORRECT'
  | 'STABLE_AS_PREDICTED'
  | 'INCONCLUSIVE_DATA'
  | 'UNAVAILABLE';

export type RiskValidationStatus =
  | 'VALIDATED'
  | 'PARTIALLY_VALIDATED'
  | 'NOT_VALIDATABLE_WITH_AVAILABLE_DATA';

export type FailureCategory =
  | 'INSUFFICIENT_DATA'
  | 'UNEXPECTED_PRICE_SHOCK'
  | 'WEATHER_SHOCK'
  | 'ARRIVAL_SURGE_GLUT'
  | 'POLICY_CHANGE_EXPORT_BAN'
  | 'TRADE_IMPORT_DUTY_EVENT'
  | 'LOGISTICS_FUEL_DISRUPTION'
  | 'MODEL_WEIGHT_MISCALIBRATION'
  | 'COMMODITY_GRADE_DIVERGENCE'
  | 'MARKET_DATA_REPORTING_DELAY';

export type MarketRegimeType =
  | 'NORMAL_MARKET'
  | 'HIGH_VOLATILITY'
  | 'PRICE_SHOCK'
  | 'SUPPLY_SHOCK'
  | 'DEMAND_SHOCK'
  | 'WEATHER_SHOCK'
  | 'POLICY_SHOCK';

export type ModelDriftStatus = 'NORMAL' | 'WATCH' | 'SIGNIFICANT_DRIFT';

export interface ModelVersioningInfo {
  modelVersion: string;
  dataVersion: string;
  commodityMasterVersion: string;
  riskEngineVersion: string;
  trendEngineVersion: string;
}

export interface CandidateMarketSnapshot {
  marketName: string;
  marketCode?: string;
  district: string;
  state: string;
  distanceKm: number;
  asOfModalPrice: number;
  asOfEstimatedNrv: number | null;
  asOfRank: number;
}

/**
 * Historical Horizon Outcome Record (T+7, T+14, T+30, T+60, T+90)
 */
export interface HorizonOutcome {
  horizonDays: number;
  targetDate: string;
  hasOfficialData: boolean;
  observationCount: number;
  observedModalPrice: number | null;
  observedMinPrice: number | null;
  observedMaxPrice: number | null;
  actualPriceChangeInr: number | null;
  actualPriceChangePercent: number | null;
  actualPriceDirection: PriceDirection;
  predictedDirectionMatch: ValidationOutcomeStatus;
  
  // Market ranking evaluation at horizon
  recommendedMarketRankAtHorizon: number | null;
  recommendedMarketStillSuperior: boolean | null;
  nrvAdvantageInrPerQtl: number | null;
  isLogisticsDataAvailable: boolean;
  logisticsUnavailableNotice?: string;
}

/**
 * Persistent Decision Journal Entry
 * Captured at T0 with exact point-in-time state
 */
export interface DecisionJournalEntry {
  decisionId: string;
  decisionTimestamp: string; // T0 (YYYY-MM-DD)
  stakeholder: StakeholderType;
  decisionType: DecisionType;
  
  // Geographic Scope
  state: string;
  district: string;
  locationDetails?: string;
  
  // Commodity Scope
  commodityId: string;
  commodityName: string;
  commodityCategory: string;
  
  // Decision Details at T0
  selectedMarket: string;
  candidateMarkets: CandidateMarketSnapshot[];
  recommendationTitle: string;
  recommendationSummary: string;
  recommendationScore: number; // 0 - 100
  confidenceTier: ModelConfidenceTier;
  confidenceScorePercent: number; // e.g. 78%
  riskScore: number; // 0 - 100
  riskLevel: RiskLevel;
  
  // Point-in-Time Evidence at T0
  priceEvidence: {
    asOfModalPrice: number;
    asOfMinPrice: number;
    asOfMaxPrice: number;
    asOfObservationsCount: number;
    latestBulletinDate: string;
  };
  trendEvidence: {
    asOf7dTrend: PriceDirection;
    asOf30dTrend: PriceDirection;
    asOf90dTrend: PriceDirection;
    predictedDirectionNext30d: PriceDirection;
  };
  nrvEvidence: {
    isCalculable: boolean;
    asOfEstimatedNrv: number | null;
    freightRatePerTonneKm: number;
    estimatedDistanceKm: number;
    handlingChargesPerQtl: number;
    statusNotice: string;
  };
  
  // Risk dimensions predicted at T0
  riskDimensionsPredicted: {
    priceVolatilityRisk: RiskLevel;
    weatherClimateRisk: RiskLevel;
    supplyArrivalRisk: RiskLevel;
    marketAccessRisk: RiskLevel;
    policyTradeRisk: RiskLevel;
  };

  // Scenario Assumptions
  scenarioInputs: {
    plannedAcres?: number;
    expectedYieldQuintals?: number;
    procurementQuantityTonnes?: number;
    targetBuyerOrDeliveryHub?: string;
  };

  // Model provenance
  modelVersions: ModelVersioningInfo;
  sourceEvidenceRegistry: string[];
  originalExplanationText: string;

  // Actual Subsequent Market Outcomes (Evaluated purely against T > T0)
  outcomes: {
    tPlus7: HorizonOutcome;
    tPlus14: HorizonOutcome;
    tPlus30: HorizonOutcome;
    tPlus60: HorizonOutcome;
    tPlus90: HorizonOutcome;
  };

  // Final Backtest Verdict
  overallValidationVerdict: {
    status: 'VALIDATED_SUCCESSFUL' | 'PARTIALLY_SUCCESSFUL' | 'INCORRECT_PREDICTION' | 'INSUFFICIENT_EVIDENCE';
    directionAccuracy30d: ValidationOutcomeStatus;
    marketRankPreserved30d: boolean | null;
    confidenceCalibrationMatch: boolean;
    failureClassification?: {
      category: FailureCategory;
      observedRootCause: string;
      farmfitHypothesis: string;
    };
  };
}

/**
 * Confidence Calibration Bin (for empirical calibration curve)
 */
export interface ConfidenceCalibrationBin {
  binLabel: string; // e.g. "70% - 79%" or "HIGH"
  minConfidence: number;
  maxConfidence: number;
  sampleSize: number; // N
  successCount: number;
  observedSuccessRatePercent: number | null; // e.g. 76.5%
  isSufficientSample: boolean; // N >= 3
  meanPredictedConfidencePercent: number;
  calibrationErrorPercent: number | null; // |predicted - observed|
}

/**
 * Model Performance Scorecard by Dimension
 */
export interface CommodityPerformanceMetric {
  commodityId: string;
  commodityName: string;
  commodityCategory: string;
  decisionCount: number; // N
  accuracy30dPercent: number | null;
  accuracy90dPercent: number | null;
  meanPriceVariancePercent: number | null;
  rankingPreservationRatePercent: number | null;
  confidenceCalibrationQuality: 'WELL_CALIBRATED' | 'OVERCONFIDENT' | 'UNDERCONFIDENT' | 'INSUFFICIENT_DATA';
  dataSufficiencyStatus: 'ROBUST_SAMPLE' | 'LIMITED_SAMPLE' | 'SPARSE_DATA';
}

export interface RegionalPerformanceMetric {
  state: string;
  district: string;
  decisionCount: number; // N
  accuracy30dPercent: number | null;
  rankingPreservationRatePercent: number | null;
  meanPriceVariancePercent: number | null;
  dataCoverageStatus: 'HIGH_COVERAGE' | 'MODERATE_COVERAGE' | 'LIMITED_COVERAGE';
}

export interface GovernmentAlertValidationMetric {
  totalAlertsIssued: number; // N
  validatedEarlyWarnings: number;
  falsePositivesCount: number;
  missedShocksCount: number;
  earlyWarningHitRatePercent: number | null;
  falseAlarmRatePercent: number | null;
  validationConfidenceTier: ModelConfidenceTier;
  sufficientEvidence: boolean;
}

export interface ExecutiveDecisionScorecard {
  totalDecisionsValidated: number;
  overallDecisionAccuracyPercent: number | null;
  overallSampleCount: number;
  
  priceDirectionAccuracy7d: { rate: number | null; sampleSize: number };
  priceDirectionAccuracy30d: { rate: number | null; sampleSize: number };
  priceDirectionAccuracy90d: { rate: number | null; sampleSize: number };
  
  marketRankingAccuracy: { rate: number | null; sampleSize: number };
  nrvAdvantageCaptureRate: { rate: number | null; sampleSize: number };
  
  fpoCollectiveStrategyAccuracy: { rate: number | null; sampleSize: number };
  b2bProcurementTimingAccuracy: { rate: number | null; sampleSize: number };
  governmentAlertHitRate: { rate: number | null; sampleSize: number };

  brierScoreCalibration: number | null; // Lower is better (0 = perfect)
  modelDriftStatus: ModelDriftStatus;
  currentDetectedRegime: MarketRegimeType;
  
  lookAheadAuditStatus: 'NO LOOK-AHEAD VIOLATION DETECTED' | 'LOOK-AHEAD RISK DETECTED';
  lookAheadAuditDetails: string;
  
  dateCoverageRange: {
    earliestDecisionDate: string;
    latestOutcomeDate: string;
  };
}
