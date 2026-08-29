/**
 * FARMFIT INDIA AGRICULTURAL INTELLIGENCE & ECONOMIC EXPOSURE ENGINE — DATA MODELS
 * 
 * Unified actuarial exposure hierarchy connecting:
 * FARM -> VILLAGE -> TALUKA -> DISTRICT -> STATE -> INDIA
 * and
 * COMMODITY -> MARKET -> DISTRICT -> STATE -> INDIA
 * 
 * Multi-stakeholder core supporting:
 * FARMERS | FPOs | B2B CORPORATES | GOVERNMENT / INSTITUTIONS | INVESTMENT / RISK ANALYSTS
 */

import { CropCategory, CropMasterRecord } from '../types';
import { UniversalCommodityRecord } from './commodityMaster';
import { ModelConfidenceTier, DataFreshnessTier } from './confidenceFramework';
import { TraceableDataProvenance } from './dataProvenance';
import { PriceTrendDirection } from './marketIntelligence';
import { RiskLevel } from './riskEngine';
import { ExogenousShockInput, ScenarioPropagationImpact } from './scenarioEngine';

// ==========================================
// 1. GEOGRAPHIC & ENTITY HIERARCHY SCOPES
// ==========================================

export type GeographicLevel = 'FARM' | 'VILLAGE' | 'TALUKA' | 'DISTRICT' | 'STATE' | 'INDIA';
export type StakeholderEntityType = 'INDIVIDUAL_FARMER' | 'FPO' | 'CORPORATE_B2B' | 'GOVERNMENT_INSTITUTION' | 'MACRO_POLICY';

export interface GeographicScope {
  level: GeographicLevel;
  name: string;
  state?: string;
  district?: string;
  taluka?: string;
  village?: string;
  latitude?: number | null;
  longitude?: number | null;
  agroClimaticZoneId?: number | null;
  agroClimaticZoneName?: string;
  totalGeographicAreaHa?: number | null;
  netSownAreaHa?: number | null;
  grossCroppedAreaHa?: number | null;
}

// ==========================================
// 2. EXPOSURE COMPONENT SPECIFICATIONS
// ==========================================

export type ExposureDataStatus = 
  | 'OFFICIAL_DATA' 
  | 'OBSERVED_MARKET_EVIDENCE' 
  | 'FARMFIT_DERIVED_MODEL' 
  | 'FARMFIT_SCENARIO' 
  | 'PARTIAL_DATA_COVERAGE' 
  | 'DATA_NOT_AVAILABLE';

export interface BaseExposureItem<T> {
  value: T;
  numericScore: number; // 0 (Low Exposure/Risk) to 100 (Extreme Exposure/Distress)
  status: ExposureDataStatus;
  statusLabel: string;
  primaryDrivers: string[];
  dataFreshnessDate?: string | null;
  dataSourceName: string;
  notes?: string;
}

// 2.1 Production Exposure
export interface ProductionExposureData {
  annualProductionTonnes: number | null;
  kharifProductionTonnes: number | null;
  rabiProductionTonnes: number | null;
  totalAcreageHa: number | null;
  averageYieldKgHa: number | null;
  yieldVariabilityCoefficient: number | null; // 0 to 1
  stateProductionSharePercent: number | null;
  nationalProductionSharePercent: number | null;
  majorVarieties: string[];
}
export type ProductionExposureItem = BaseExposureItem<ProductionExposureData>;

// 2.2 Price Exposure & Price Pressure
export type PricePressureSignal = 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE' | 'INSUFFICIENT_DATA';

export interface PriceExposureData {
  currentModalPrice: number | null;
  minPrice: number | null;
  maxPrice: number | null;
  priceUnit: string;
  priceDate: string | null;
  priceTrend: PriceTrendDirection;
  priceChange7DayPercent: number | null;
  priceChange30DayPercent: number | null;
  priceVolatilityIndex: number | null; // 0 to 100
  mspPrice: number | null;
  mspSpreadPercent: number | null; // (Modal - MSP) / MSP * 100
  marketPricePressure: PricePressureSignal;
  marketPricePressureLabel: string; // e.g. "FARMFIT DERIVED INDICATOR: POSITIVE (+4.2% vs 30D Avg)"
  activeApmcCount: number;
}
export type PriceExposureItem = BaseExposureItem<PriceExposureData>;

// 2.3 Supply Exposure
export type SupplyPressureSignal = 
  | 'ACUTE_SHORTAGE' 
  | 'MILD_DEFICIT' 
  | 'BALANCED_SUPPLY' 
  | 'MARKET_GLUT' 
  | 'SUPPLY_SIGNAL_UNAVAILABLE';

export interface SupplyExposureData {
  dailyArrivalsTonnes: number | null;
  arrivalTrend: 'INCREASING' | 'STEADY' | 'DECLINING' | 'INSUFFICIENT_DATA';
  supplyBalanceMetricTonnes: number | null;
  bufferStockCoverageMonths: number | null;
  supplyDisruptionRisk: number; // 0 - 100
  supplySignal: SupplyPressureSignal;
  supplySignalLabel: string;
}
export type SupplyExposureItem = BaseExposureItem<SupplyExposureData>;

// 2.4 Demand Exposure
export type DemandPressureSignal = 
  | 'STRONG_DEMAND' 
  | 'STEADY_ABSORPTION' 
  | 'SLUGGISH_DEMAND' 
  | 'COLLAPSED_DEMAND' 
  | 'DEMAND_SIGNAL_UNAVAILABLE';

export interface DemandExposureData {
  monthlyPerCapitaKg: number | null;
  procurementSharePercent: number | null;
  exportDemandSharePercent: number | null;
  processingDemandSharePercent: number | null;
  demandSignal: DemandPressureSignal;
  demandSignalLabel: string;
}
export type DemandExposureItem = BaseExposureItem<DemandExposureData>;

// 2.5 Weather Exposure
export interface WeatherExposureData {
  rainfallDeficitSurplusPercent: number | null;
  temperatureDeviationCelsius: number | null;
  heatwaveRiskScore: number; // 0 - 100
  unseasonalRainRiskScore: number; // 0 - 100
  drySpellDays: number | null;
  weatherRiskScore: number; // 0 - 100
}
export type WeatherExposureItem = BaseExposureItem<WeatherExposureData>;

// 2.6 Water Exposure
export interface WaterExposureData {
  irrigationCoveragePercent: number | null;
  primaryIrrigationSource: string;
  groundwaterExploitationStage: 'SAFE' | 'SEMI_CRITICAL' | 'CRITICAL' | 'OVER_EXPLOITED' | 'UNKNOWN';
  reservoirStoragePercent: number | null;
  waterStressScore: number; // 0 - 100
}
export type WaterExposureItem = BaseExposureItem<WaterExposureData>;

// 2.7 Logistics Exposure
export interface LogisticsExposureData {
  nearestApmcDistanceKm: number | null;
  freightCostPerTonneKm: number | null;
  coldStorageAvailableMetricTonnes: number | null;
  perishabilityTransitLossRiskPercent: number | null;
  roadConnectivityRating: 'EXCELLENT' | 'ADEQUATE' | 'DEFICIENT' | 'REMOTE';
  logisticsFrictionScore: number; // 0 - 100
}
export type LogisticsExposureItem = BaseExposureItem<LogisticsExposureData>;

// 2.8 Input Cost Exposure
export interface InputCostExposureData {
  fertilizerCostIndex: number | null; // 100 = Base
  dieselFreightIndex: number | null;
  certifiedSeedCostIndex: number | null;
  laborWagesPerDayInr: number | null;
  costOfCultivationA2FLInrPerQtl: number | null;
  costOfCultivationC2InrPerQtl: number | null;
  inputCostInflationPressureScore: number; // 0 - 100
}
export type InputCostExposureItem = BaseExposureItem<InputCostExposureData>;

// 2.9 Trade Exposure
export interface TradeExposureData {
  annualExportsMetricTonnes: number | null;
  annualImportsMetricTonnes: number | null;
  netTradeBalanceTonnes: number | null;
  importDependencyRatioPercent: number | null;
  exportIntensityPercent: number | null;
  globalPriceSpreadPercent: number | null;
  tradeShockVulnerabilityScore: number; // 0 - 100
}
export type TradeExposureItem = BaseExposureItem<TradeExposureData>;

// 2.10 Policy Exposure
export interface PolicyExposureData {
  isMspCovered: boolean;
  mspProcurementActiveInDistrict: boolean;
  exportDutyQuotaStatus: 'OPEN' | 'DUTY_APPLIED' | 'RESTRICTED' | 'PROHIBITED' | 'NOT_APPLICABLE';
  stockHoldingLimitActive: boolean;
  fertilizerSubsidyCoverage: boolean;
  pmFbyInsuranceNotified: boolean;
  policyInterventionVulnerabilityScore: number; // 0 - 100
}
export type PolicyExposureItem = BaseExposureItem<PolicyExposureData>;

// 2.11 Climate Exposure
export interface ClimateExposureData {
  agroClimaticZoneVulnerability: 'LOW' | 'MEDIUM' | 'HIGH' | 'EXTREME';
  soilDegradationIndex: number | null; // 0 - 100
  longTermAridityTrend: 'STABLE' | 'DRYING' | 'WETTING' | 'ERRATIC';
  climateRiskScore: number; // 0 - 100
}
export type ClimateExposureItem = BaseExposureItem<ClimateExposureData>;

// 2.12 Farmer Income Exposure
export interface IncomeExposureData {
  estimatedGrossRevenuePerAcreInr: number | null;
  estimatedNetProfitPerAcreInr: number | null;
  netRealizationMarginPercent: number | null;
  incomeStressRiskLevel: RiskLevel;
  distressSaleVulnerability: boolean;
  incomeExposureScore: number; // 0 - 100
  statusNotice: string;
}
export type IncomeExposureItem = BaseExposureItem<IncomeExposureData>;

// 2.13 Market Exposure
export interface MarketExposureData {
  apmcCountIn200km: number;
  marketConcentrationHhi: number | null; // Herfindahl–Hirschman Index
  nearestMarketName: string | null;
  nearestMarketDistanceKm: number | null;
  priceDiscoveryEfficiency: 'HIGH' | 'MODERATE' | 'LOW' | 'THIN_TRADING';
  marketAccessibilityScore: number; // 0 - 100
}
export type MarketExposureItem = BaseExposureItem<MarketExposureData>;

// 2.14 Overall Risk
export interface OverallRiskExposure {
  compositeRiskScore: number; // 0 to 100
  riskLevel: RiskLevel;
  primaryVulnerabilities: string[];
  resilienceStrengths: string[];
  keyRiskDrivers: {
    dimension: string;
    score: number;
    weight: number;
    contribution: number;
  }[];
}

// ==========================================
// 3. COMPLETE AGRICULTURAL EXPOSURE ASSESSMENT
// ==========================================

export interface AgriculturalExposureAssessment {
  assessmentId: string;
  commodity: UniversalCommodityRecord | CropMasterRecord;
  cropCommodityId: string;
  displayName: string;
  category: CropCategory;
  geography: GeographicScope;
  stakeholderScope: StakeholderEntityType;
  
  // 13-Dimensional Exposure Suite
  productionExposure: ProductionExposureItem;
  priceExposure: PriceExposureItem;
  supplyExposure: SupplyExposureItem;
  demandExposure: DemandExposureItem;
  weatherExposure: WeatherExposureItem;
  waterExposure: WaterExposureItem;
  logisticsExposure: LogisticsExposureItem;
  inputCostExposure: InputCostExposureItem;
  tradeExposure: TradeExposureItem;
  policyExposure: PolicyExposureItem;
  climateExposure: ClimateExposureItem;
  incomeExposure: IncomeExposureItem;
  marketExposure: MarketExposureItem;
  
  // Aggregate Risk & Reliability
  overallRisk: OverallRiskExposure;
  confidence: {
    confidenceScore: number; // 0 to 100
    confidenceTier: ModelConfidenceTier;
    dataCoveragePercent: number;
    historicalDepthDays: number;
    uncertaintyFactors: string[];
  };
  dataFreshness: {
    tier: DataFreshnessTier;
    latestDate: string | null;
    totalObservations: number;
  };
  provenance: TraceableDataProvenance[];
  calculationDate: string; // ISO string
  derivedLabel: 'FARMFIT DERIVED INTELLIGENCE' | 'OFFICIAL DATA' | 'OBSERVED EVIDENCE';
}

// ==========================================
// 4. DISTRICT AGRICULTURAL PROFILE
// ==========================================

export interface DistrictMajorCommoditySummary {
  cropCommodityId: string;
  cropName: string;
  category: CropCategory;
  sownAreaHa: number | null;
  productionTonnes: number | null;
  avgYieldKgHa: number | null;
  latestModalPriceInrQtl: number | null;
  priceDate: string | null;
  priceTrend: PriceTrendDirection;
  pricePressure: PricePressureSignal;
  marketCount: number;
  riskScore: number; // 0 - 100
  riskLevel: RiskLevel;
  dataStatus: ExposureDataStatus;
}

export interface DistrictAgriculturalProfile {
  districtId: string;
  districtName: string;
  stateName: string;
  agroZoneId: number;
  agroZoneName: string;
  normalAnnualRainfallMm: number;
  netSownAreaHa: number | null;
  grossCroppedAreaHa: number | null;
  croppingIntensityPercent: number | null;
  irrigationCoveragePercent: number | null;
  smallMarginalFarmerSharePercent: number | null;
  apmcMandiCount: number;
  primaryAPMCs: {
    marketName: string;
    locationTaluka?: string;
    latitude: number;
    longitude: number;
    activeCommodityCount: number;
    latestTradeDate: string | null;
  }[];
  majorCommodities: DistrictMajorCommoditySummary[];
  majorCereals: DistrictMajorCommoditySummary[];
  majorPulses: DistrictMajorCommoditySummary[];
  majorOilseeds: DistrictMajorCommoditySummary[];
  majorVegetables: DistrictMajorCommoditySummary[];
  majorFruits: DistrictMajorCommoditySummary[];
  majorCommercialCrops: DistrictMajorCommoditySummary[];
  
  // District Level Aggregate Exposures
  aggregatePriceVolatilityIndex: number;
  aggregateWeatherRiskScore: number;
  aggregateWaterStressScore: number;
  aggregateLogisticsFrictionScore: number;
  aggregateInputCostStressScore: number;
  aggregateFarmerIncomeExposureScore: number;
  overallDistrictVulnerabilityScore: number; // 0 - 100
  overallDistrictRiskLevel: RiskLevel;
  
  // Quality & Provenance
  dataCoverage: 'FULL_DISTRICT_COVERAGE' | 'PARTIAL_DISTRICT_COVERAGE' | 'SPARSE_OBSERVATIONS';
  totalObservationsRecorded: number;
  latestDataDate: string | null;
  provenanceList: TraceableDataProvenance[];
  calculatedAt: string;
}

// ==========================================
// 5. STATE AGRICULTURAL PROFILE
// ==========================================

export interface StateAgriculturalProfile {
  stateCode: string;
  stateName: string;
  capital: string;
  totalDistrictsCount: number;
  districtsWithDataCount: number;
  grossStateAgriculturalValueInrCrores: number | null;
  stateGrossCroppedAreaHa: number | null;
  stateIrrigationCoveragePercent: number | null;
  totalRegisteredAPMCs: number;
  
  topProducingDistricts: {
    districtName: string;
    dominantCrops: string[];
    riskScore: number;
  }[];
  
  stateMajorCrops: DistrictMajorCommoditySummary[];
  stateMajorVegetables: DistrictMajorCommoditySummary[];
  stateMajorFruits: DistrictMajorCommoditySummary[];
  
  stateProductionExposureScore: number;
  stateSupplyExposureScore: number;
  stateDemandExposureScore: number;
  stateWeatherRiskScore: number;
  stateWaterRiskScore: number;
  stateLogisticsRiskScore: number;
  stateTradeExposureScore: number;
  statePolicyExposureScore: number;
  stateFarmerIncomeExposureScore: number;
  compositeStateRiskScore: number;
  stateRiskLevel: RiskLevel;
  
  aggregationMethodology: string;
  dataCoveragePercent: number;
  latestRecordDate: string | null;
  provenance: TraceableDataProvenance[];
  calculatedAt: string;
}

// ==========================================
// 6. INDIA AGRICULTURAL INTELLIGENCE (NATIONAL AGGREGATION)
// ==========================================

export interface IndiaAgriculturalIntelligence {
  scopeTitle: 'INDIA — AVAILABLE DATA COVERAGE';
  reportingPeriod: string;
  evaluatedCommodityCount: number;
  statesCoveredCount: number;
  districtsCoveredCount: number;
  apmcMarketsCoveredCount: number;
  totalVerifiedDailyBulletins: number;
  
  // National Macro Pressures (FARMFIT Derived Indicators)
  commodityPricePressureIndex: {
    overallSignal: PricePressureSignal;
    score: number; // 0 - 100
    risingCommoditiesCount: number;
    stableCommoditiesCount: number;
    fallingCommoditiesCount: number;
    insufficientDataCount: number;
    label: string;
  };
  supplyPressureIndex: {
    overallSignal: SupplyPressureSignal;
    score: number;
    shortageCommodities: string[];
    glutCommodities: string[];
    balancedCommodities: string[];
    label: string;
  };
  demandPressureIndex: {
    overallSignal: DemandPressureSignal;
    score: number;
    strongDemandCommodities: string[];
    sluggishDemandCommodities: string[];
    label: string;
  };
  foodInflationPressureIndex: {
    score: number;
    vegetableInflationRisk: 'HIGH' | 'MODERATE' | 'LOW';
    pulseInflationRisk: 'HIGH' | 'MODERATE' | 'LOW';
    edibleOilInflationRisk: 'HIGH' | 'MODERATE' | 'LOW';
    label: string;
  };
  weatherShockExposureIndex: {
    score: number;
    monsoonDeficitRegionsCount: number;
    heatwaveAffectedDistrictsCount: number;
    label: string;
  };
  inputCostPressureIndex: {
    score: number;
    dieselCostInflationPercent: number;
    fertilizerCostIndex: number;
    label: string;
  };
  logisticsPressureIndex: {
    score: number;
    interStateFreightIndex: number;
    coldChainDeficitScore: number;
    label: string;
  };
  farmerIncomeExposureIndex: {
    score: number;
    distressPocketsCount: number;
    mspSupportEffectivenessPercent: number;
    label: string;
  };
  
  // National Backbone Indicator
  agriculturalBackboneScore: number; // 0 to 100
  backboneHealthLevel: 'RESILIENT' | 'MODERATE' | 'VULNERABLE' | 'CRITICAL_STRESS';
  
  dataCoverageNotice: string;
  latestObservationDate: string | null;
  provenance: TraceableDataProvenance[];
  calculatedAt: string;
}

// ==========================================
// 7. COMMODITY NATIONAL PROFILE
// ==========================================

export interface CommodityIntelligenceProfile {
  cropCommodityId: string;
  displayName: string;
  officialCommodityName: string;
  hindiName: string;
  commodityGroup: string;
  category: CropCategory;
  
  // Production Geography (DES APY)
  nationalAnnualProductionMetricTonnes: number | null;
  nationalAcreageHectares: number | null;
  majorProducingStates: {
    stateName: string;
    productionSharePercent: number;
    annualProductionTonnes: number | null;
    dominantDistricts: string[];
  }[];
  
  // Market Coverage & Spot Prices (AGMARKNET)
  currentMarketCoverage: {
    activeApmcCount: number;
    districtsCoveredCount: number;
    statesCoveredCount: number;
    latestObservedModalPrice: number | null;
    modalPriceUnit: string;
    latestPriceDate: string | null;
    priceRange: { min: number; max: number; avg: number } | null;
    priceTrend: PriceTrendDirection;
    pricePressure: PricePressureSignal;
    priceVolatilityIndex: number; // 0 - 100
  };
  
  // Government / Policy Parameters
  mspBenchmark2024_25: number | null;
  mspSpreadPercent: number | null;
  isMspMandated: boolean;
  pmFbyInsuranceApplicable: boolean;
  
  // Supply & Demand Indicators
  supplyIndicator: SupplyPressureSignal;
  demandIndicator: DemandPressureSignal;
  tradeExposure: {
    annualExportTonnes: number | null;
    annualImportTonnes: number | null;
    tradeExposureScore: number;
  };
  
  // Actuarial Risk Profile
  compositeCommodityRiskScore: number; // 0 - 100
  riskLevel: RiskLevel;
  topRiskFactors: string[];
  
  // Quality & Reliability
  confidenceTier: ModelConfidenceTier;
  confidenceScore: number;
  dataFreshnessTier: DataFreshnessTier;
  provenance: TraceableDataProvenance[];
  calculatedAt: string;
}

// ==========================================
// 8. MULTI-STAKEHOLDER EXPOSURE MODELS
// ==========================================

// 8.1 Farmer Income Exposure
export interface FarmerIncomeExposure {
  calculationStatus: 'CALCULATED' | 'INSUFFICIENT_DATA';
  farmerType: string;
  totalAcreageAcres: number | null;
  cropAllocations: {
    cropCommodityId: string;
    cropName: string;
    acres: number;
    expectedYieldQtl: number | null;
    expectedModalPriceInrQtl: number | null;
    estimatedCostOfCultivationInr: number | null;
    estimatedGrossRevenueInr: number | null;
    estimatedNetIncomeInr: number | null;
    nrvNetRealizationInrQtl: number | null;
    priceVolatilityRisk: RiskLevel;
  }[];
  totalExpectedGrossRevenueInr: number | null;
  totalEstimatedInputCostInr: number | null;
  totalEstimatedNetIncomeInr: number | null;
  incomeVolatilityRiskScore: number; // 0 - 100
  distressRiskLevel: RiskLevel;
  keyMitigations: string[];
  dataFreshnessDate: string | null;
}

// 8.2 FPO Collective Exposure
export interface FPOExposureAssessment {
  fpoId: string;
  fpoName: string;
  headquartersDistrict: string;
  state: string;
  memberFarmerCount: number;
  coveredVillagesCount: number;
  totalAggregatedAcres: number;
  cropPortfolios: {
    cropCommodityId: string;
    cropName: string;
    acreage: number;
    expectedProductionMetricTonnes: number;
    contractedCorporateQuantityTonnes: number;
    openMarketExposureTonnes: number;
    averageMandiModalPriceInrQtl: number | null;
    projectedTotalTurnoverInrCrores: number | null;
    priceDownsideRiskInrLakhs: number | null;
  }[];
  totalStorageCapacityTonnes: number;
  availableStoragePercent: number;
  fpoPriceRiskExposureScore: number; // 0 - 100
  fpoLogisticsRiskScore: number;
  fpoDefaultOrShortageRiskScore: number;
  overallFpoHealthScore: number;
  calculatedAt: string;
}

// 8.3 Corporate B2B Procurement Exposure
export interface CorporateB2BExposureAssessment {
  corporateId: string;
  companyName: string;
  industrySector: string;
  activeRequirements: {
    requirementId: string;
    cropCommodityId: string;
    commodityName: string;
    targetQuantityMetricTonnes: number;
    procurementState: string;
    targetPriceInrQtl: number;
    currentMarketModalPriceInrQtl: number | null;
    priceVariancePercent: number | null; // (Market - Target) / Target * 100
    availableRegionalSupplyTonnes: number | null;
    supplyCoverageRatio: number | null; // Regional Supply / Target Qty
    procurementRiskLevel: RiskLevel;
    primarySupplyBottlenecks: string[];
  }[];
  aggregateProcurementValueInrCrores: number;
  aggregateSupplyShortageExposureScore: number; // 0 - 100
  aggregatePriceSpikeExposureScore: number;
  compositeCorporateRiskScore: number;
  calculatedAt: string;
}

// 8.4 Government / Institutional Policy Intelligence
export interface GovernmentIntelligenceProfile {
  targetGeography: GeographicScope;
  reportingCycle: string;
  districtsAtHighPriceStressCount: number;
  districtsWithMonsoonDeficitCount: number;
  commoditiesFacingShortages: string[];
  commoditiesFacingMarketGlut: string[];
  mspProcurementDeficitWarnings: {
    cropName: string;
    districtName: string;
    currentPrice: number;
    mspPrice: number;
    deficiencyPerQtl: number;
  }[];
  recommendedInterventions: {
    tier: 'EMERGENCY' | 'MEDIUM_TERM' | 'STRUCTURAL';
    sector: 'MSP Procurement' | 'Buffer Stock Release' | 'Export/Import Duty' | 'FPO Aggregation';
    description: string;
    targetedGeography: string;
  }[];
  calculatedAt: string;
}

// ==========================================
// 9. EARLY WARNING & ECONOMIC INDEX ENGINES
// ==========================================

export type EarlyWarningType = 
  | 'PRICE_SHOCK' 
  | 'SUPPLY_SHORTAGE' 
  | 'SUPPLY_GLUT' 
  | 'WEATHER_SHOCK' 
  | 'INPUT_COST_SHOCK' 
  | 'LOGISTICS_SHOCK' 
  | 'TRADE_SHOCK' 
  | 'POLICY_SHOCK' 
  | 'FARMER_INCOME_STRESS';

export type EarlyWarningSeverity = 'CRITICAL' | 'HIGH' | 'MODERATE' | 'ADVISORY';

export interface AgriculturalEarlyWarningAlert {
  alertId: string;
  alertType: EarlyWarningType;
  severity: EarlyWarningSeverity;
  headline: string;
  commodityName: string;
  cropCommodityId: string;
  geography: string; // e.g. "Nashik, Maharashtra" or "Northern Karnataka"
  driver: string;
  evidence: string;
  dateTriggered: string;
  confidenceScore: number;
  affectedPopulationOrMetric: string;
  recommendedImmediateAction: string;
  dataSource: string;
}

// 9.2 Agricultural Economic Index Dimension
export interface EconomicIndexComponent {
  componentId: string;
  name: string;
  weight: number; // 0.0 to 1.0 (Sum = 1.0)
  score: number; // 0 to 100
  trend: 'EXPANDING' | 'STABLE' | 'STRESSED' | 'VOLATILE';
  dataSource: string;
  updateFrequency: string;
  coverageDescription: string;
  methodologyNotes: string;
  confidenceTier: ModelConfidenceTier;
}

export interface AgriculturalEconomicIndexFramework {
  frameworkName: 'FARMFIT AGRICULTURAL ECONOMIC INDEX';
  frameworkStatus: 'ARCHITECTURAL_BETA_FRAMEWORK';
  compositeIndexScore: number | null; // Nullable if data coverage incomplete
  compositeState: 'ROBUST_EXPANSION' | 'MODERATE_STABILITY' | 'MILD_STRESS' | 'ACUTE_FARM_DISTRESS';
  components: {
    production: EconomicIndexComponent;
    prices: EconomicIndexComponent;
    supply: EconomicIndexComponent;
    demand: EconomicIndexComponent;
    farmerIncome: EconomicIndexComponent;
    inputCosts: EconomicIndexComponent;
    weather: EconomicIndexComponent;
    water: EconomicIndexComponent;
    logistics: EconomicIndexComponent;
    trade: EconomicIndexComponent;
    policy: EconomicIndexComponent;
    climate: EconomicIndexComponent;
  };
  reproducibilityStandard: string;
  latestCalculationDate: string;
  provenanceSummary: TraceableDataProvenance[];
}

// 9.3 Agricultural Backbone Framework
export interface AgriculturalBackbonePillar {
  pillarName: string;
  score: number; // 0 to 100
  stabilityLevel: 'ROBUST' | 'ADEQUATE' | 'FRAGILE' | 'DISTRESSED';
  keyObservation: string;
  sourceAuthority: string;
}

export interface AgriculturalBackboneFramework {
  frameworkName: 'FARMFIT AGRICULTURAL BACKBONE INDICATOR';
  frameworkLabel: 'FARMFIT DERIVED ARCHITECTURE';
  overallHealthScore: number;
  healthTier: 'RESILIENT' | 'MODERATE' | 'VULNERABLE' | 'CRITICAL_STRESS';
  pillars: {
    productionStrength: AgriculturalBackbonePillar;
    marketStrength: AgriculturalBackbonePillar;
    farmerRealization: AgriculturalBackbonePillar;
    supplyStability: AgriculturalBackbonePillar;
    demandStrength: AgriculturalBackbonePillar;
    weatherStability: AgriculturalBackbonePillar;
    inputCostPressure: AgriculturalBackbonePillar;
    logisticsStability: AgriculturalBackbonePillar;
    tradeEnvironment: AgriculturalBackbonePillar;
  };
  takeawayMessage: string;
  disclaimer: string;
  calculatedAt: string;
}

// 9.4 Cross-Entity Shock Propagation
export interface CrossEntityShockPropagation {
  shockId: string;
  shockInput: ExogenousShockInput;
  propagationPath: {
    step: number;
    layer: 'PHYSICAL_WEATHER_INPUT' | 'AGRONOMIC_YIELD' | 'APMC_WHOLESALE_MARKET' | 'FARMER_NRV' | 'FPO_AGGREGATION' | 'CORPORATE_PROCUREMENT' | 'REGIONAL_ECONOMIC_GDP';
    impactDescription: string;
    magnitudePercent: number;
    affectedEntity: string;
  }[];
  modelNotice: 'FARMFIT SCENARIO (MODELLED SIMULATION — NOT AN OFFICIAL FORECAST)';
  calculatedAt: string;
}
