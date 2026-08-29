/**
 * FARMFIT VERIFIED MARKET TREND & BUSINESS ANALYTICS ENGINE — TYPE DEFINITIONS
 * 
 * Strict Evidence Gates, Multi-Window Statistical Rigor, and Zero Fabrication.
 */

import { CoordinateQuality, MarketFreshnessStatus, MandiPriceRecord, MarketTimeSeriesPoint } from './marketIntelligence';
import { ModelConfidenceTier, DataFreshnessTier } from './confidenceFramework';

export type TrendDirection = 'RISING' | 'FALLING' | 'STABLE' | 'MIXED' | 'INSUFFICIENT DATA';
export type TrendStrength = 'STRONG' | 'MODERATE' | 'WEAK' | 'INSUFFICIENT DATA';
export type PriceMomentumTier = 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL' | 'INSUFFICIENT DATA';
export type VolatilityCategory = 'LOW' | 'MODERATE' | 'HIGH' | 'INSUFFICIENT DATA';
export type BusinessDecisionReadiness = 'READY FOR DECISION' | 'LIMITED EVIDENCE' | 'MONITOR' | 'INSUFFICIENT DATA';

export type PriceEvidenceStatus = 'PRICE VERIFIED' | 'PRICE STALE' | 'PRICE UNAVAILABLE';
export type TrendEvidenceStatus = 'TREND VERIFIED' | 'TREND INSUFFICIENT';
export type VolatilityEvidenceStatus = 'VOLATILITY VERIFIED' | 'VOLATILITY INSUFFICIENT';
export type SeasonalityEvidenceStatus = 'SEASONALITY VERIFIED (MULTI-YEAR)' | 'SEASONALITY INSUFFICIENT DATA' | 'ONE-YEAR OBSERVED PATTERN';
export type ArrivalEvidenceStatus = 'ARRIVAL VERIFIED' | 'ARRIVAL UNAVAILABLE' | 'ARRIVAL INSUFFICIENT';

export type MarketRelationshipType = 
  | 'PRICE UP + ARRIVALS DOWN'
  | 'PRICE DOWN + ARRIVALS UP'
  | 'PRICE UP + ARRIVALS UP'
  | 'PRICE DOWN + ARRIVALS DOWN'
  | 'BALANCED ABSORPTION'
  | 'INSUFFICIENT OBSERVATIONS';

export type MarketRankingMode = 
  | 'HIGHEST_GROSS_PRICE' 
  | 'HIGHEST_NRV' 
  | 'LOWEST_B2B_LANDED' 
  | 'RISK_ADJUSTED' 
  | 'CLOSEST_VERIFIED' 
  | 'MOST_STABLE';

export interface TrendWindowStats {
  windowDays: number;
  windowLabel: string;
  minObservationsRequired: number;
  observationCount: number;
  coveragePeriodDays: number;
  isSufficient: boolean;
  insufficientReason: string | null;
  
  latestPrice: number | null;
  firstPrice: number | null;
  absoluteChange: number | null;
  percentageChange: number | null;
  average: number | null;
  median: number | null;
  min: number | null;
  max: number | null;
  stdDev: number | null;
  coefficientOfVariation: number | null;
  
  trendDirection: TrendDirection;
  trendStrength: TrendStrength;
  methodology: string;
}

export interface MovingAverageAnalytics {
  ma7Day: number | null;
  ma30Day: number | null;
  ma90Day: number | null;
  
  priceVs7dMaPercent: number | null;
  priceVs30dMaPercent: number | null;
  priceVs90dMaPercent: number | null;
  
  priceVs7dMaStatus: 'ABOVE_MA' | 'BELOW_MA' | 'AT_MA' | 'INSUFFICIENT DATA';
  priceVs30dMaStatus: 'ABOVE_MA' | 'BELOW_MA' | 'AT_MA' | 'INSUFFICIENT DATA';
  priceVs90dMaStatus: 'ABOVE_MA' | 'BELOW_MA' | 'AT_MA' | 'INSUFFICIENT DATA';
}

export interface PriceMomentumMetrics {
  shortTermMomentum: PriceMomentumTier;
  mediumTermMomentum: PriceMomentumTier;
  longTermMomentum: PriceMomentumTier;
  shortTermChangePercent: number | null;
  mediumTermChangePercent: number | null;
  longTermChangePercent: number | null;
  summaryExplanation: string;
}

export interface PriceVolatilityMetrics {
  volatilityScore: number | null; // CV in percent
  volatilityCategory: VolatilityCategory;
  standardDeviation: number | null;
  meanPrice: number | null;
  annualizedVolatilityPercent: number | null;
  isSufficient: boolean;
  observationCount: number;
  explanation: string;
}

export interface ArrivalAnalytics {
  hasArrivalData: boolean;
  latestArrivalQty: number | null;
  arrivalUnit: string;
  arrivalObservationCount: number;
  arrivalChange7DPercent: number | null;
  arrivalChange30DPercent: number | null;
  arrivalChange90DPercent: number | null;
  arrivalTrendDirection: 'SURGING' | 'INCREASING' | 'STEADY' | 'DECLINING' | 'GLUT' | 'UNAVAILABLE';
  
  marketRelationship: MarketRelationshipType;
  relationshipExplanation: string;
  isNonCausalLabel: string;
}

export interface PriceDispersionMetrics {
  commodity: string;
  cropId: string;
  radiusKm: number;
  marketCount: number;
  highestModalPrice: number | null;
  highestPriceMarket: string | null;
  lowestModalPrice: number | null;
  lowestPriceMarket: string | null;
  medianModalPrice: number | null;
  averageModalPrice: number | null;
  priceSpread: number | null;
  spreadPercentage: number | null;
  dispersionSummary: string;
}

export interface MonthlySeasonalityPoint {
  month: string;
  monthIndex: number;
  averageModalPrice: number | null;
  minPrice: number | null;
  maxPrice: number | null;
  averageArrivalTonnes: number | null;
  seasonalIndex: number | null;
  observationCount: number;
}

export interface SeasonalityMetrics {
  status: SeasonalityEvidenceStatus;
  isMultiYear: boolean;
  yearsCovered: number;
  monthlyProfile: MonthlySeasonalityPoint[];
  peakArrivalMonth: string | null;
  leanArrivalMonth: string | null;
  peakPriceMonth: string | null;
  troughPriceMonth: string | null;
  seasonalVolatilityPercent: number | null;
  methodologyNote: string;
}

export interface MarketStabilityMetrics {
  stabilityScore: number; // 0 to 100
  stabilityTier: 'HIGH_STABILITY' | 'MODERATE_STABILITY' | 'LOW_STABILITY' | 'INSUFFICIENT_DATA';
  volatilityDeduction: number;
  observationContinuityScore: number;
  arrivalConsistencyScore: number;
  summaryExplanation: string;
}

export interface DataQualityMetrics {
  priceDataQualityScore: number; // 0-100
  trendDataQualityScore: number; // 0-100
  arrivalDataQualityScore: number; // 0-100
  historicalDepthDays: number;
  historicalObservationCount: number;
  freshnessScore: number; // 0-100
  overallEvidenceScore: number; // 0-100
  overallQualityTier: 'EXCELLENT' | 'GOOD' | 'MODERATE' | 'LIMITED' | 'POOR';
  evidenceDeficits: string[];
}

export interface EvidenceSufficiencyMetrics {
  priceEvidence: PriceEvidenceStatus;
  trendEvidence: TrendEvidenceStatus;
  volatilityEvidence: VolatilityEvidenceStatus;
  seasonalityEvidence: SeasonalityEvidenceStatus;
  arrivalEvidence: ArrivalEvidenceStatus;
  businessReadiness: BusinessDecisionReadiness;
  compositeEvidenceTag: string;
  readinessExplanation: string;
}

export interface MultiMarketScorecardItem {
  marketId: string;
  market: string;
  district: string;
  state: string;
  distanceKm: number | null;
  coordinateQuality: CoordinateQuality;
  
  modalPrice: number | null;
  minPrice: number | null;
  maxPrice: number | null;
  priceUnit: string;
  priceDate: string | null;
  freshnessStatus: MarketFreshnessStatus;
  daysOld: number;
  
  trend7D: string;
  trend30D: string;
  trend90D: string;
  volatilityCategory: VolatilityCategory;
  volatilityPercent: number | null;
  
  arrivalQty: number | null;
  arrivalUnit: string;
  arrivalTrend: string;
  
  freightPerQtl: number | null;
  handlingPerQtl: number | null;
  netRealizationPerQtl: number | null; // For Farmers & FPOs
  estimatedLandedCostPerQtl: number | null; // For B2B Buyers
  
  supplyEvidence: string;
  marketStabilityScore: number;
  riskScore: number;
  confidenceTier: ModelConfidenceTier;
  farmerAction: string;
  fpoAction: string;
  b2bAction: string;
  
  rankingScore: number;
  rankingMode: MarketRankingMode;
  rankingFormulaExplanation: string;
}

export interface VerifiedMarketAnalytics {
  commodity: string;
  cropId: string;
  targetMarket: string;
  district: string;
  state: string;
  radiusKm: number;
  
  // 1. Latest Official Observation
  latestPrice: number | null;
  latestMinPrice: number | null;
  latestMaxPrice: number | null;
  priceUnit: string;
  priceDate: string | null;
  retrievedAt: string | null;
  officialSource: string;
  sourceRecordId?: string;
  isVerifiedOfficial: boolean;
  
  // 2. Trend Windows (7D, 14D, 30D, 60D, 90D, 180D, 365D)
  windows: {
    d7: TrendWindowStats;
    d14: TrendWindowStats;
    d30: TrendWindowStats;
    d60: TrendWindowStats;
    d90: TrendWindowStats;
    d180: TrendWindowStats;
    d365: TrendWindowStats;
  };
  
  // 3. Moving Averages
  movingAverages: MovingAverageAnalytics;
  
  // 4. Momentum
  momentum: PriceMomentumMetrics;
  
  // 5. Volatility
  volatility: PriceVolatilityMetrics;
  
  // 6. Arrivals & Relationship
  arrivals: ArrivalAnalytics;
  
  // 7. Price Dispersion across 200 km APMCs
  dispersion: PriceDispersionMetrics;
  
  // 8. Seasonality
  seasonality: SeasonalityMetrics;
  
  // 9. Stability & Quality
  stability: MarketStabilityMetrics;
  dataQuality: DataQualityMetrics;
  
  // 10. Evidence Sufficiency Gates
  evidenceSufficiency: EvidenceSufficiencyMetrics;
  
  // 11. Multi-Market Scorecards across all 6 ranking modes
  scorecards: {
    activeMode: MarketRankingMode;
    rankedMarkets: MultiMarketScorecardItem[];
  };
  
  // 12. Stakeholder-Specific Calibrated Decision Signals
  farmerRecommendation: {
    action: 'SELL NOW' | 'HOLD' | 'MONITOR' | 'INSUFFICIENT EVIDENCE';
    confidence: ModelConfidenceTier;
    actionReason: string;
    targetMarket: string;
    netRealizationPerQtl: number | null;
  };
  
  fpoRecommendation: {
    action: 'AGGREGATE' | 'HOLD' | 'SELL' | 'WAIT' | 'DIVERSIFY' | 'MONITOR';
    confidence: ModelConfidenceTier;
    actionReason: string;
    aggregateStrategy: string;
  };
  
  b2bRecommendation: {
    action: 'BUY NOW' | 'SCALE SOURCING' | 'WAIT / MONITOR' | 'DIVERSIFY MANDIS' | 'TIMING SIGNAL UNAVAILABLE';
    confidence: ModelConfidenceTier;
    actionReason: string;
    procurementTimingSignal: string;
    bestLandedCostMarket: string | null;
    estimatedLandedCostPerQtl: number | null;
  };
  
  governmentAlert: {
    alertLevel: 'NORMAL' | 'WATCH' | 'WARNING' | 'ALERT';
    pricePressure: string;
    dispersionExposure: string;
    volatilityWarning: string;
    arrivalTrendNotice: string;
    policyActionNotice: string;
  };
  
  // Raw Historical Observations for Source Audit
  rawObservations: MarketTimeSeriesPoint[];
  
  // Universal Evidence & Provenance Labels
  derivedAnalyticsLabel: 'FARMFIT DERIVED ANALYTICS';
  officialObservationsLabel: 'OFFICIAL MARKET OBSERVATIONS';
}
