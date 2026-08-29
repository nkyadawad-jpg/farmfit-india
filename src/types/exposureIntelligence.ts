/**
 * FARMFIT AGRICULTURAL EXPOSURE & DECISION CONTROL TOWER
 * 
 * Comprehensive Type Definitions for:
 * 1. Control Tower & Macro Indicators
 * 2. Farmer Exposure
 * 3. FPO Portfolio Risk & Value at Risk
 * 4. B2B Procurement Exposure & Scenario Analysis
 * 5. Government Agricultural Exposure Map
 * 6. Commodity Systemic Risk
 * 7. Event Impact Simulator
 * 8. Decision Approval Workflow & Outcome Tracking
 */

import { StakeholderType } from './validationEngine';
import { AgriculturalMarketRegimeType } from './earlyWarningIntelligence';

// ==========================================
// 1. MACRO CONTROL TOWER
// ==========================================

export interface ControlTowerMetrics {
  agriculturalMarketRegime: AgriculturalMarketRegimeType;
  majorRisks: Array<{ name: string; severity: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW'; affected: string }>;
  majorOpportunities: Array<{ name: string; potential: 'HIGH' | 'MODERATE' | 'LOW'; affected: string }>;
  priceStressIndex: number;
  supplyStressIndex: number;
  marketConcentrationIndex: number;
  weatherExposureIndex: number;
  logisticsExposureIndex: number;
  farmerIncomePressure: 'HIGH' | 'MODERATE' | 'LOW' | 'STABLE';
  asOfDate: string;
}

// ==========================================
// 2. EXPOSURE ENGINE CORE
// ==========================================

export type DataAvailabilityStatus = 
  | 'OBSERVED_DATA'
  | 'FARMFIT_DERIVED_MODEL'
  | 'FARMFIT_ESTIMATE'
  | 'INSUFFICIENT_DATA';

export interface ExposureDimension {
  dimension: string; // e.g., 'Price', 'Weather', 'Supply'
  exposureLevel: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW' | 'UNKNOWN';
  riskScore: number | null; // 0-100
  evidence: string;
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  primaryDriver: string;
  dataStatus: DataAvailabilityStatus;
}

// ==========================================
// 3. FARMER EXPOSURE
// ==========================================

export interface FarmerExposureProfile {
  farmId: string;
  cropId: string;
  cropName: string;
  farmAreaAcres: number | null;
  estimatedProductionTonnes: number | null;
  currentModalPrice: number;
  potentialSellingMarkets: Array<{ marketName: string; nrv: number; distanceKm: number }>;
  priceExposure: ExposureDimension;
  weatherRisk: ExposureDimension;
  waterRisk: ExposureDimension;
  priceVolatility: ExposureDimension;
  marketAccess: ExposureDimension;
  overallExposureLevel: 'HIGH' | 'MODERATE' | 'LOW';
  dataStatus: DataAvailabilityStatus;
}

// ==========================================
// 4. FPO PORTFOLIO EXPOSURE & VaR
// ==========================================

export interface FpoCommodityPosition {
  commodityId: string;
  commodityName: string;
  areaAcres: number | null;
  expectedQuantityTonnes: number | null;
  expectedValueInr: number | null;
  targetMarket: string;
  currentPrice: number;
  trend: 'UP' | 'DOWN' | 'STABLE';
  volatilityPercent: number | null;
  riskLevel: 'HIGH' | 'MODERATE' | 'LOW';
  concentrationIndex: number | null; // e.g., HHI
}

export interface FpoPortfolioExposure {
  fpoId: string;
  commodities: FpoCommodityPosition[];
  commodityConcentration: 'LOW_CONCENTRATION' | 'MODERATE_CONCENTRATION' | 'HIGH_CONCENTRATION';
  marketConcentration: 'LOW_CONCENTRATION' | 'MODERATE_CONCENTRATION' | 'HIGH_CONCENTRATION';
  totalExpectedValueInr: number | null;
  diversificationStatus: 'MAINTAIN' | 'DIVERSIFY' | 'INVESTIGATE' | 'INSUFFICIENT_DATA';
}

export interface ScenarioImpact {
  scenarioName: string;
  portfolioValueChangeInr: number | null;
  portfolioValueChangePercent: number;
  commodityLevelImpacts: Array<{ commodityId: string; changePercent: number }>;
  isStatisticalVaR: boolean;
  methodologyNotes: string;
}

export interface FpoStressTest {
  baseCaseValueInr: number | null;
  scenarios: ScenarioImpact[];
}

// ==========================================
// 5. B2B PROCUREMENT EXPOSURE
// ==========================================

export interface B2bProcurementExposure {
  procurementId: string;
  commodityId: string;
  commodityName: string;
  requiredQuantityTonnes: number;
  deliveryLocation: string;
  currentEstimatedLandedCostInr: number;
  historicalMaxPriceInr: number | null;
  historicalMinPriceInr: number | null;
  range30d: { min: number; max: number } | null;
  range90d: { min: number; max: number } | null;
  priceVolatility: ExposureDimension;
  supplyConcentration: ExposureDimension;
  marketConcentration: ExposureDimension;
  sourceDiversificationRecommendation: 'MAINTAIN' | 'DIVERSIFY' | 'INVESTIGATE' | 'INSUFFICIENT_DATA';
  alternativeMarkets: Array<{ marketName: string; estimatedLandedCost: number }>;
}

// ==========================================
// 6. GOVERNMENT EXPOSURE MAP
// ==========================================

export interface DistrictCommodityDependency {
  commodityId: string;
  commodityName: string;
  estimatedImportance: 'HIGH' | 'MODERATE' | 'LOW' | 'UNKNOWN';
  marketDependence: 'HIGH' | 'MODERATE' | 'LOW';
  priceExposure: 'HIGH' | 'MODERATE' | 'LOW';
  isObservedProduction: boolean; // True if real production data, false if using market arrivals as proxy
}

export interface DistrictExposureScore {
  districtName: string;
  stateName: string;
  overallExposureScore: number | null;
  dimensions: ExposureDimension[];
  dominantCommodities: DistrictCommodityDependency[];
  dataStatus: DataAvailabilityStatus;
}

// ==========================================
// 7. COMMODITY SYSTEMIC RISK
// ==========================================

export interface CommoditySystemicRisk {
  commodityId: string;
  commodityName: string;
  geographicConcentration: 'HIGH' | 'MODERATE' | 'LOW';
  marketConcentration: 'HIGH' | 'MODERATE' | 'LOW';
  priceVolatility: 'HIGH' | 'MODERATE' | 'LOW';
  productionExposure: 'HIGH' | 'MODERATE' | 'LOW' | 'UNKNOWN';
  weatherSensitivity: 'HIGH' | 'MODERATE' | 'LOW';
  overallSystemicExposure: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW' | 'INSUFFICIENT_DATA';
}

// ==========================================
// 8. EVENT IMPACT SIMULATOR
// ==========================================

export type ShockEventType = 'PRICE_SHOCK' | 'WEATHER_SHOCK' | 'LOGISTICS_SHOCK' | 'TRADE_SHOCK' | 'INPUT_COST_SHOCK' | 'POLICY_SHOCK';

export interface EventImpactSimulation {
  commodityId: string;
  geography: string;
  shockType: ShockEventType;
  magnitude: string; // e.g., "+20%", "Severe Drought"
  farmerImpact: string;
  fpoImpact: string;
  b2bImpact: string;
  governmentImpact: string;
}

// ==========================================
// 9. DECISION CONTROL & OUTCOME TRACKING
// ==========================================

export type DecisionWorkflowState = 'DRAFT' | 'RECOMMENDED' | 'REVIEW' | 'APPROVED' | 'EXECUTED' | 'OUTCOME_RECORDED' | 'VALIDATED' | 'REJECTED';

export interface DecisionCard {
  decisionId: string;
  stakeholder: StakeholderType;
  date: string;
  commodityId: string;
  geography: string;
  recommendation: string;
  expectedBenefit: string;
  riskLevel: 'HIGH' | 'MODERATE' | 'LOW';
  confidenceTier: 'HIGH' | 'MEDIUM' | 'LOW';
  evidence: string;
  alternative: string;
  scenarioSensitivity: string;
  modelVersion: string;
  workflowState: DecisionWorkflowState;
  
  // Expected values
  expectedPrice: number | null;
  expectedNrv: number | null;
  expectedMarketRanking: number | null;

  // Realized values (User reported)
  actualQuantity?: number;
  actualSalePrice?: number;
  actualMarket?: string;
  actualLogisticsCost?: number;
  actualOutcome?: string;

  // Validation
  realizedVsExpected?: 'BETTER_THAN_EXPECTED' | 'AS_EXPECTED' | 'WORSE_THAN_EXPECTED' | 'NOT_VALIDATED';
}

export interface FarmfitDecisionScore {
  score: number; // 0-100
  evidenceQuality: number;
  dataFreshness: number;
  historicalValidation: number;
  riskAdjusted: number;
  confidenceGatePassed: boolean;
}

// ==========================================
// 10. ECONOMIC WATERFALL & SIGNAL
// ==========================================

export interface EconomicWaterfallStep {
  label: string;
  value: number;
  type: 'ADD' | 'SUBTRACT' | 'TOTAL';
  isEstimated: boolean;
}

export type EconomicSignalStatus = 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE' | 'STRESSED' | 'INSUFFICIENT_DATA';

export interface AgriculturalEconomicSignal {
  geography: string;
  commodityId: string;
  status: EconomicSignalStatus;
  topDrivers: string[];
}
