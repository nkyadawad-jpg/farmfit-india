import { DataAvailabilityStatus, ExposureDimension, FarmfitDecisionScore, ShockEventType } from './exposureIntelligence';
import { AgriculturalMarketRegimeType } from './earlyWarningIntelligence';

export interface SupplyChainSignal {
  signalType: 'PRICE' | 'SUPPLY' | 'DEMAND' | 'LOGISTICS' | 'RISK' | 'OPPORTUNITY';
  status: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL' | 'STRESSED' | 'INSUFFICIENT_DATA';
  value: string;
  trend: 'UP' | 'DOWN' | 'STABLE' | 'VOLATILE';
  date: string;
  source: string;
  dataStatus: DataAvailabilityStatus;
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface SupplyChainCommandCenterMetrics {
  hierarchyLevel: 'INDIA' | 'STATE' | 'DISTRICT' | 'COMMODITY' | 'MARKET';
  locationName: string;
  signals: SupplyChainSignal[];
}

export interface CommodityFlowGeography {
  commodityId: string;
  commodityName: string;
  productionRegions: Array<{ region: string; volume: number | null; isObserved: boolean }>;
  marketClusters: Array<{ clusterName: string; apmcCount: number; dominantTrend: string }>;
}

export interface RoutingMarketOption {
  marketName: string;
  district: string;
  state: string;
  distanceKm: number;
  latestModalPrice: number;
  trend7D: string;
  trend30D: string;
  trend90D: string;
  volatilityPercent: number;
  latestArrivalsTonnes: number | null;
  freightCostInr: number | null;
  handlingCostInr: number | null;
  nrvInr: number | null;
  freshnessDate: string;
  observationCount: number;
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface FarmToMarketRouting {
  farmerLocation: string;
  commodityId: string;
  searchRadiusKm: number;
  qualifyingMarkets: RoutingMarketOption[];
}

export interface FpoCommodityPortfolioItem {
  commodityId: string;
  commodityName: string;
  areaAcres: number | null;
  expectedQuantityTonnes: number | null;
  harvestPeriod: string;
  latestPriceInr: number;
  trend: string;
  volatilityPercent: number;
  marketCount: number;
  estimatedNrvInr: number | null;
  riskLevel: 'HIGH' | 'MODERATE' | 'LOW';
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface FpoPortfolioIntelligence {
  fpoId: string;
  commodities: FpoCommodityPortfolioItem[];
  revenueExposure: number | null;
  commodityConcentrationIndex: number | null;
  marketConcentrationIndex: number | null;
  geographicConcentrationIndex: number | null;
  diversificationRecommendation: 'DIVERSIFY' | 'MAINTAIN' | 'MONITOR' | 'INSUFFICIENT_DATA';
  diversificationReasons: string[];
}

export interface B2bProcurementOption {
  region: string;
  apmcCount: number;
  observedPriceInr: number;
  priceTrend: string;
  volatilityPercent: number;
  distanceKm: number;
  estimatedFreightInr: number | null;
  estimatedHandlingInr: number | null;
  estimatedLandedCostInr: number | null;
  marketConcentration: 'HIGH' | 'MODERATE' | 'LOW';
  supplyEvidence: string;
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  recommendationType: 'PRIMARY' | 'SECONDARY' | 'BACKUP' | 'INSUFFICIENT_DATA';
}

export interface ProcurementScenario {
  scenarioName: string;
  currentCostInr: number;
  scenarioCostInr: number;
  incrementalCostInr: number;
  riskChange: 'INCREASE' | 'DECREASE' | 'NEUTRAL';
}

export interface MarketBalanceSignal {
  commodityId: string;
  marketName: string;
  observedRelationship: 'PRICE_UP_ARRIVALS_DOWN' | 'PRICE_DOWN_ARRIVALS_UP' | 'PRICE_UP_ARRIVALS_UP' | 'PRICE_DOWN_ARRIVALS_DOWN' | 'NO_CLEAR_RELATIONSHIP';
  arrivalTrend: 'SURGE' | 'DECLINE' | 'NORMAL_RANGE' | 'INSUFFICIENT_DATA';
}

export interface RegionalPriceDivergence {
  commodityId: string;
  regionType: 'TALUKA' | 'DISTRICT' | 'STATE' | 'INDIA';
  regionName: string;
  highestModalInr: number;
  lowestModalInr: number;
  medianModalInr: number;
  spreadInr: number;
  spreadPercent: number;
  trend7D: string;
  trend30D: string;
}

export interface MarketOpportunity {
  commodityId: string;
  marketName: string;
  status: 'STRONG_OPPORTUNITY' | 'POTENTIAL_OPPORTUNITY' | 'MONITOR' | 'INSUFFICIENT_DATA';
  evidence: string;
  riskLevel: 'HIGH' | 'MODERATE' | 'LOW';
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface MarketStressEvent {
  commodityId: string;
  marketName: string;
  district: string;
  state: string;
  signalType: 'PRICE_COLLAPSE' | 'PRICE_SPIKE' | 'ARRIVAL_SURGE' | 'ARRIVAL_COLLAPSE' | 'EXTREME_VOLATILITY' | 'REGIONAL_DIVERGENCE';
  magnitude: string;
  date: string;
  historicalComparison: string;
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface IndiaAgriculturalBackbone {
  level: 'INDIA' | 'STATE' | 'DISTRICT' | 'COMMODITY' | 'MARKET';
  name: string;
  majorCommodities: string[];
  marketImportance: 'HIGH' | 'MODERATE' | 'LOW';
  priceExposure: 'HIGH' | 'MODERATE' | 'LOW';
  riskExposure: 'HIGH' | 'MODERATE' | 'LOW';
  marketConcentration: 'HIGH' | 'MODERATE' | 'LOW';
  overallTrend: string;
}

export interface CrossStakeholderImpact {
  eventDescription: string;
  farmerImpact: string;
  fpoImpact: string;
  b2bImpact: string;
  governmentImpact: string;
}

export interface EventPropagation {
  directImpact: string;
  secondaryExposure: string;
  stakeholderImpact: string;
  alternativeMarkets: string[];
  mitigationOptions: string[];
}
