/**
 * FARMFIT HISTORICAL BACKTESTING & MODEL VALIDATION TYPES
 * 
 * Defines the schema for simulating historical agricultural recommendations
 * without future data leakage, tracking observed outcomes vs predictions.
 */

import { ModelConfidenceTier } from './confidenceFramework';
import { RiskLevel } from './riskEngine';

export interface HistoricalBacktestPoint {
  date: string;
  observedModalPrice: number;
  observedMinPrice: number;
  observedMaxPrice: number;
  marketName: string;
  district: string;
  state: string;
}

export interface BacktestSimulationRequest {
  cropId: string;
  state: string;
  district: string;
  historicalAsOfDate: string; // Evaluation cutoff (e.g. "2024-04-01")
  forecastHorizonDays: number; // e.g. 30, 60, 90 days
  plannedAcres?: number;
  transportRatePerTonneKm?: number;
}

export interface BacktestSimulationResult {
  backtestId: string;
  cropId: string;
  cropDisplayName: string;
  state: string;
  district: string;
  historicalAsOfDate: string;
  outcomeEvaluationDate: string;
  horizonDays: number;
  
  // Point-in-Time Data (Available strictly on or before cutoff date)
  pointInTimeData: {
    historicalObservationsCount: number;
    asOfModalPrice: number | null;
    asOfPriceTrend: 'RISING' | 'FALLING' | 'STABLE' | 'INSUFFICIENT DATA';
    asOfRecommendation: 'STRONG PRODUCE & SELL' | 'MODERATE OPPORTUNITY' | 'PROCEED WITH CAUTION' | 'NOT RECOMMENDED';
    asOfSuitabilityScore: number;
    asOfRiskLevel: RiskLevel;
    asOfBestMarket: string | null;
    asOfEstimatedNrv: number | null;
    confidenceTier: ModelConfidenceTier;
    methodologyNote: string;
  };

  // Actual Subsequent Market Outcome (Observed after cutoff date)
  actualOutcome: {
    hasSubsequentData: boolean;
    subsequentObservationsCount: number;
    subsequentModalPrice: number | null;
    subsequentPriceDirection: 'UP' | 'DOWN' | 'FLAT' | 'UNAVAILABLE';
    actualPriceChangePercent: number | null;
    actualBestMarket: string | null;
    actualNetRealizationObserved: number | null;
  };

  // Validation Metrics
  validationScore: {
    directionAccuracy: 'CORRECT DIRECTION' | 'OPPOSITE DIRECTION' | 'INCONCLUSIVE';
    priceRangeAccuracyPercent: number | null; // how close predicted range was
    recommendationQuality: 'HIGHLY PROFITABLE' | 'VALUE PRESERVING' | 'SUB-OPTIMAL' | 'UNVERIFIED';
    nrvDifferenceInrPerQtl: number | null;
    dataCoverageStatus: 'ROBUST HISTORICAL SAMPLE' | 'MODERATE SAMPLE' | 'LIMITED HISTORICAL DEPTH';
    confidence: ModelConfidenceTier;
  };

  dataProvenance: 'HISTORICAL OFFICIAL OBSERVATIONS STRICTLY PARTITIONED (NO FUTURE DATA LEAKAGE)';
}

export interface AggregateBacktestPerformance {
  totalSimulationsRun: number;
  robustSampleCount: number;
  directionalAccuracyRate: number; // Percentage 0-100
  meanAbsolutePriceVariancePercent: number;
  recommendationSuccessRate: number; // Percentage of successful recommendations
  evaluatedCommodities: string[];
  evaluatedStates: string[];
  backtestDateRange: {
    earliestDate: string;
    latestDate: string;
  };
  provenanceNotice: string;
}
