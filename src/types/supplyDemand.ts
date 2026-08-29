/**
 * FARMFIT Agricultural Supply, Production & Consumption Data Models
 * Aligned with Directorate of Economics & Statistics (DES), MoSPI, APEDA, and CACP
 * Strictly preserves transparent status: OFFICIAL — FINAL, OFFICIAL — ADVANCE, OFFICIAL — HISTORICAL, DERIVED, PARTIAL DATA, DATA UNAVAILABLE
 */

export type TransparentDataQualityStatus = 
  | 'OFFICIAL — FINAL'
  | 'OFFICIAL — ADVANCE'
  | 'OFFICIAL — HISTORICAL'
  | 'DERIVED'
  | 'PARTIAL DATA'
  | 'DATA UNAVAILABLE';

export type ProductionDataStatus = 
  | 'OFFICIAL'
  | 'ADVANCE_ESTIMATE'
  | 'FINAL_ESTIMATE'
  | 'HISTORICAL'
  | 'DERIVED'
  | 'PARTIAL DATA'
  | 'DATA_UNAVAILABLE'
  | 'OFFICIAL — FINAL'
  | 'OFFICIAL — ADVANCE'
  | 'OFFICIAL — HISTORICAL';

export type DataConfidenceLevel = 
  | 'HIGH'
  | 'MEDIUM'
  | 'LOW'
  | 'INSUFFICIENT DATA'
  | 'PARTIAL DATA'
  | 'DATA UNAVAILABLE';

export interface AgriculturalProductionRecord {
  recordId: string;
  cropId: string;
  cropName: string;
  category?: string;
  state: string; // 'All India' | State Name
  district: string; // 'ALL' | District Name
  season: 'Kharif' | 'Rabi' | 'Zaid' | 'Whole Year' | 'Total' | 'Annual / Commercial' | 'Annual';
  year: string; // e.g. '2023-24', '2022-23', '2021-22', '2020-21', '2019-20'
  area: number | null; // in lakh hectares or hectares
  areaUnit: 'Lakh Hectares' | 'Thousand Hectares' | 'Hectares';
  production: number | null; // in lakh tonnes or metric tonnes
  productionUnit: 'Lakh Metric Tonnes' | 'Thousand Metric Tonnes' | 'Metric Tonnes' | 'Lakh Bales (170kg)';
  yield: number | null; // in kg/hectare or tonnes/hectare
  yieldUnit: 'kg/Hectare' | 'Tonnes/Hectare' | 'kg/Acre';
  sourceName: string;
  sourceUrl: string;
  datasetName: string;
  publicationDate: string;
  retrievalDate: string;
  dataStatus: ProductionDataStatus;
  dataQuality?: TransparentDataQualityStatus;
  notes?: string;
}

export interface DomesticConsumptionRecord {
  recordId: string;
  cropId: string;
  cropName?: string;
  commodity: string;
  geography: string; // 'All India' | State Name
  year: string;
  quantity: number | null;
  unit: string; // 'kg/capita/month' | 'Lakh Metric Tonnes' | 'Million Tonnes'
  monthlyPerCapitaKgRural?: number | null;
  monthlyPerCapitaKgUrban?: number | null;
  annualizedHouseholdDemandLakhTonnes?: number | null;
  coverage?: string;
  populationCoverage?: string;
  sourceName: string;
  sourceUrl: string;
  datasetName: string;
  publicationDate?: string;
  methodology: string;
  retrievalDate: string;
  dataStatus?: string;
  confidence?: DataConfidenceLevel;
  dataQuality?: TransparentDataQualityStatus;
}

export type DemandType = 
  | 'HOUSEHOLD_CONSUMPTION'
  | 'PROCESSING'
  | 'INDUSTRIAL'
  | 'FEED'
  | 'SEED'
  | 'EXPORT'
  | 'OTHER';

export interface DemandRecord {
  demandId?: string;
  recordId?: string;
  cropId: string;
  commodityName?: string;
  geography: string;
  year: string;
  demandType: DemandType;
  quantity: number | null;
  unit: string;
  source: string;
  sourceUrl?: string;
  sourceDate: string;
  methodology: string;
  dataStatus?: string;
  confidence?: DataConfidenceLevel;
  dataQuality?: TransparentDataQualityStatus;
  isModelEstimate?: boolean;
  notes?: string;
}

export interface SupplyBalanceRecord {
  recordId?: string;
  cropId: string;
  cropName?: string;
  geography: string;
  year: string;
  period?: string; // e.g. '2023-24'
  production: number | null;
  imports: number | null;
  exports: number | null;
  openingStocks: number | null;
  closingStocks: number | null;
  domesticConsumption: number | null;
  otherUses: number | null; // seed, feed, processing, waste allowance
  estimatedAvailability: number | null; // production + imports + openingStocks
  estimatedBalance: number | null; // estimatedAvailability - (domesticConsumption + otherUses + exports + closingStocks)
  isComplete: boolean;
  missingComponents: string[];
  statusMessage: 'COMPLETE_SUPPLY_BALANCE' | 'SUPPLY_BALANCE_INCOMPLETE';
  indicativeSurplusDeficitNote?: string;
  sourceName: string;
  sourceUrl: string;
  retrievalDate: string;
  dataQuality?: TransparentDataQualityStatus;
}

export type SupplyBalance = SupplyBalanceRecord;

export type TradeType = 'IMPORT' | 'EXPORT';

export interface AgriculturalTradeRecord {
  tradeId: string;
  cropId: string;
  commodity?: string;
  commodityName: string;
  hsCode?: string;
  tradeType: TradeType;
  country: string; // 'All Countries' | Country Name
  year: string;
  month?: string;
  quantity: number | null;
  quantityUnit: 'Lakh Metric Tonnes' | 'Thousand MT' | 'Metric Tonnes' | 'Lakh Bales';
  value: number | null;
  currency: 'INR Crores' | 'USD Millions';
  source: string;
  sourceUrl?: string;
  sourceDate?: string;
  retrievalDate: string;
  tariffOrPolicyStatus?: string;
  dataQuality?: TransparentDataQualityStatus;
}

export interface TradeImpactIndicator {
  cropId: string;
  cropName: string;
  year: string;
  exportDependencePercent: number | null;
  importDependencePercent: number | null;
  tradeExposureLevel: 'High Export Orientation' | 'Moderate Export' | 'High Import Reliance' | 'Self-Sufficient / Domestic Focus' | 'Data Insufficient';
  label: 'FARMFIT DERIVED INDICATOR';
  explanatoryNote: string;
  methodology: string;
  dataQuality: TransparentDataQualityStatus;
}

export type CropSpecializationCategory = 'Major Crop' | 'Secondary Crop' | 'Emerging Crop' | 'Minor / Sparse';

export interface CropSpecializationRecord {
  cropId: string;
  cropName: string;
  state: string;
  district?: string;
  productionVolume: number | null;
  productionUnit: string;
  productionShareOfStatePercent: number | null;
  areaShareOfStatePercent: number | null;
  nationalProductionSharePercent: number | null;
  classification: CropSpecializationCategory;
  derivedLabel: 'FARMFIT DERIVED INDICATOR';
  isTopRanked: boolean;
  stateRank: number;
  dataQuality: TransparentDataQualityStatus;
}

export interface StateProductionShare {
  state: string;
  production: number;
  productionUnit: string;
  area: number;
  areaUnit: string;
  yield: number;
  yieldUnit: string;
  sharePercent: number;
  isRanked: number;
  dataQuality?: TransparentDataQualityStatus;
}

export interface DistrictProductionShare {
  district: string;
  state: string;
  production: number;
  productionUnit: string;
  area: number;
  areaUnit: string;
  yield: number;
  yieldUnit: string;
  shareOfStatePercent: number;
  isRanked: number;
  dataQuality?: TransparentDataQualityStatus;
}

export interface TrendPoint {
  year: string;
  area: number | null;
  production: number | null;
  yield: number | null;
  dataStatus: ProductionDataStatus;
  dataQuality?: TransparentDataQualityStatus;
}

export interface ProductionTrendAnalysis {
  cropId: string;
  cropName: string;
  geography: string;
  points: TrendPoint[];
  hasFiveYearTrend: boolean;
  hasTenYearTrend: boolean;
  fiveYearProductionGrowthPercent: number | null;
  fiveYearProductionCagrPercent: number | null;
  fiveYearAreaGrowthPercent: number | null;
  fiveYearYieldGrowthPercent: number | null;
  tenYearProductionGrowthPercent: number | null;
  tenYearProductionCagrPercent: number | null;
  tenYearAreaGrowthPercent: number | null;
  tenYearYieldGrowthPercent: number | null;
  cagrStatisticallyAppropriate: boolean;
  insufficientDataReason?: string;
  dataQuality: TransparentDataQualityStatus;
}

export interface ExpectedHarvestWindow {
  cropId: string;
  cropName: string;
  plantingDate: string;
  durationDays: number;
  harvestWindowStart: string; // Formatted date e.g. "15 Oct 2024"
  harvestWindowEnd: string;   // Formatted date e.g. "30 Oct 2024"
  harvestMonth: string;       // e.g. "October - November"
  harvestSeason: string;      // Kharif / Rabi / Zaid
  status: 'ESTABLISHED_KEY' | 'DATA_UNAVAILABLE';
  methodology: string;
}

export interface AgriculturalDataSourceRegistryItem {
  sourceId: string;
  sourceName: string;
  organization: string;
  officialUrl: string;
  datasetName: string;
  coverage: string;
  frequency: string;
  lastRetrieved: string;
  status: 'OFFICIAL_ACTIVE' | 'CONNECTED_BASELINE' | 'SCHEDULED_INTEGRATION';
  methodology?: string;
  license?: string;
  notes: string;
}
