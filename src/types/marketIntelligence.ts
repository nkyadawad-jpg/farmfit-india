/**
 * FARMFIT MANDI MARKET INTELLIGENCE — DATA TYPES & INTERFACES (v1)
 * 
 * Complies strictly with:
 * - AGMARKNET (Directorate of Marketing & Inspection, MoA&FW, GoI)
 * - Open Government Data Platform India (data.gov.in)
 * - Commission for Agricultural Costs and Prices (CACP)
 */

export type MarketDataStatus = 
  | 'OFFICIAL DATA'
  | 'LATEST AVAILABLE OFFICIAL DATA'
  | 'HISTORICAL DATA'
  | 'PARTIAL DATA'
  | 'DATA UNAVAILABLE'
  | 'OFFICIAL DATA CURRENTLY UNAVAILABLE';

export type MarketDataQuality = 
  | 'HIGH'
  | 'MEDIUM'
  | 'LOW'
  | 'INSUFFICIENT DATA';

export type PriceTrendDirection = 
  | 'RISING'
  | 'FALLING'
  | 'STABLE'
  | 'INSUFFICIENT DATA';

export type ArrivalTrendDirection = 
  | 'INCREASING'
  | 'DECREASING'
  | 'STABLE'
  | 'INSUFFICIENT DATA';

export type MarketFreshnessStatus = 
  | 'LATEST OFFICIAL DATA'
  | 'RECENT OFFICIAL DATA'
  | 'STALE OFFICIAL DATA'
  | 'HISTORICAL OFFICIAL DATA'
  | 'UNAVAILABLE'
  | 'OFFICIAL DATA CURRENTLY UNAVAILABLE'
  | 'LATEST AGMARKNET'
  | 'RECENT AGMARKNET'
  | 'OLDER AGMARKNET'
  | 'STALE — VERIFY BEFORE SELLING'
  | 'NO RECORD AVAILABLE';

export type CoordinateQuality = 
  | 'VERIFIED'
  | 'APPROXIMATE'
  | 'UNAVAILABLE';

export type DistanceType = 
  | 'ESTIMATED STRAIGHT-LINE DISTANCE'
  | 'Estimated straight-line distance'
  | 'Road distance'
  | 'AIR/STRAIGHT-LINE DISTANCE';

/**
 * Master APMC Market Location Registry
 * Strictly adheres to verified government records and transparent coordinate provenance.
 */
export interface APMCMarketMaster {
  marketId: string;
  marketName: string;
  state: string;
  district: string;
  latitude: number | null;
  longitude: number | null;
  marketCode: string;
  officialMarketName: string;
  sourceName: string;
  sourceUrl: string;
  coordinateSource: string;
  coordinateQuality: CoordinateQuality;
  lastVerified: string;
  apmcType?: 'Principal APMC Yard' | 'Sub-Yard' | 'Private Mandi / e-NAM' | 'Terminal Market';
  majorCommodities?: string[];
}

export type TransportVehicleType = 
  | 'Tractor-Trolley (3-5 Tonnes)'
  | 'Mini-Truck / Pick-up (1.5-2.5 Tonnes)'
  | 'Medium Truck (6-9 Tonnes)'
  | 'Heavy Commercial (10-16 Tonnes)'
  | 'Bullock Cart / Local Utility';

export interface TransportCostInputs {
  distanceKm: number | null;
  commodity: string;
  quantityQtl: number;
  vehicleType?: TransportVehicleType | string;
  transportUnit?: '₹/tonne/km' | '₹/Qtl/km';
  transportRatePerTonnePerKm?: number | null; // e.g. ₹32 / tonne / km
  transportRatePerKmPerQtl?: number | null;   // e.g. ₹3.2 / Qtl / km
  fixedFreightPerTrip?: number | null;
  loadingCostPerQtl?: number | null;
  unloadingCostPerQtl?: number | null;
  otherCostsPerQtl?: number | null;
  packagingCostPerQtl?: number | null;
  isValidated: boolean;
}

export interface TransportCostResult {
  isCalculated: boolean;
  freightPerQtl: number | null;
  loadingPerQtl: number | null;
  unloadingPerQtl: number | null;
  otherCostsPerQtl?: number | null;
  packagingPerQtl: number | null;
  totalTransportPerQtl: number | null;
  totalTransportCostTotal: number | null;
  notice: string;
  methodologyNote?: string;
}

export interface NetRealizationResult {
  isCalculated: boolean;
  modalPricePerQtl: number | null;
  modalPricePerKg?: number | null;
  totalDeductionsPerQtl: number | null;
  netRealizationPerQtl: number | null;
  netRealizationPerKg?: number | null;
  expectedQuantityQtl: number;
  grossTotalRealization: number | null;
  estimatedTotalNetRealization: number | null;
  notice: string;
  status: 'CALCULATED' | 'NET REALIZATION NOT AVAILABLE';
  rankingBasis?: string;
}

export type MspDataStatus = 
  | 'OFFICIAL — NOTIFIED'
  | 'OFFICIAL — RECOMMENDED'
  | 'HISTORICAL'
  | 'MSP DATA UNAVAILABLE';

/**
 * Standard Mandi Price & Arrival Record (conforms to AGMARKNET Daily APMC schema)
 */
export interface MandiPriceRecord {
  recordId: string;
  date: string; // ISO format: YYYY-MM-DD
  state: string;
  district: string;
  market: string;
  mandiName?: string;
  marketCode?: string;
  commodity: string;
  commodityCode?: string;
  cropId: string; // Links to FARMFIT CropMaster
  variety: string; // e.g. "Yellow", "Desi", "Hybrid", "Sharbati", "Medium Staple"
  grade: string; // e.g. "FAQ" (Fair Average Quality), "Grade A", "Medium", "Fine"
  
  // Prices in Rupees per Unit (Standard: ₹/Quintal = 100 kg)
  minPrice: number | null;
  maxPrice: number | null;
  modalPrice: number | null; // Primary reported market price
  modalPricePerQuintal?: number | null;
  priceDate?: string;
  priceUnit: '₹/Quintal' | '₹/Kg' | '₹/Bale' | string;
  
  // Arrivals in physical volume
  arrivalQuantity: number | null;
  dailyArrivalsTonnes?: number | null;
  arrivalUnit: 'Tonnes' | 'Quintals' | 'Bales' | 'Bags' | string;
  
  // Geographic coordinates of the physical APMC yard
  latitude?: number;
  longitude?: number;
  
  // Provenance & Source Metadata
  sourceName: string; // e.g. "AGMARKNET — Directorate of Marketing & Inspection, GoI"
  sourceUrl: string; // "https://agmarknet.gov.in/"
  datasetName: string; // "Daily APMC Wholesale Market Rates & Arrivals"
  retrievedAt: string; // Timestamp of ingestion
  dataPeriod: string; // e.g. "Daily Mandi Bulletins"
  
  // Freshness & Quality
  dataStatus: MarketDataStatus;
  dataQuality: MarketDataQuality;
}

/**
 * Historical Market Observation Point for time-series charts & moving averages
 */
export interface MarketTimeSeriesPoint {
  date: string; // YYYY-MM-DD
  market: string;
  state: string;
  district: string;
  commodity: string;
  cropId: string;
  minPrice: number | null;
  maxPrice: number | null;
  modalPrice: number | null;
  arrivalQuantity: number | null;
  
  // Moving averages (computed when sufficient observations exist)
  ma7Price?: number | null;
  ma14Price?: number | null;
  ma30Price?: number | null;
  ma90Price?: number | null;
  
  ma7Arrival?: number | null;
  ma14Arrival?: number | null;
  ma30Arrival?: number | null;
}

/**
 * Price Trend & Moving Average Statistics
 */
export interface PriceTrendAnalysis {
  commodity: string;
  cropId: string;
  market: string;
  state: string;
  district: string;
  
  // Current values
  latestDate: string | null;
  latestModalPrice: number | null;
  latestMinPrice: number | null;
  latestMaxPrice: number | null;
  
  // Moving Averages (INR / Qtl)
  avg7DayPrice: number | null;
  avg14DayPrice: number | null;
  avg30DayPrice: number | null;
  avg90DayPrice: number | null;
  
  // Change percentages
  priceChange7DayPercent: number | null;
  priceChange30DayPercent: number | null;
  priceChange90DayPercent: number | null;
  
  // Statistical Distribution
  historicalAverage: number | null;
  historicalMin: number | null;
  historicalMax: number | null;
  volatilityScore: number | null; // Std dev or Coeff of variation
  momentumScore: number | null;
  
  // Trend Classification
  priceTrend: PriceTrendDirection;
  trendObservationCount: number;
  isSufficientObservations: boolean;
  derivedLabel: 'FARMFIT DERIVED INDICATOR' | 'FARMFIT DERIVED ANALYTICS';
  officialObservationsLabel?: 'OFFICIAL OBSERVATIONS';
}

/**
 * Arrival Trend & Volume Statistics
 */
export interface ArrivalTrendAnalysis {
  commodity: string;
  cropId: string;
  market: string;
  state: string;
  district: string;
  
  latestDate: string | null;
  latestArrivalQuantity: number | null;
  arrivalUnit: string;
  
  // Moving Averages
  avg7DayArrivals: number | null;
  avg14DayArrivals: number | null;
  avg30DayArrivals: number | null;
  
  arrivalChange7DayPercent: number | null;
  arrivalChange30DayPercent: number | null;
  
  arrivalTrend: ArrivalTrendDirection;
  observationCount: number;
  isSufficientObservations: boolean;
  derivedLabel: 'FARMFIT DERIVED INDICATOR';
}

/**
 * Market Pressure Indicator (Price + Arrival Interaction)
 * Explicitly labeled: "Historical/current market relationship — not a future price prediction."
 */
export interface MarketPressureIndicator {
  commodity: string;
  market: string;
  priceTrend: PriceTrendDirection;
  arrivalTrend: ArrivalTrendDirection;
  pressureState: 
    | 'SUPPLY PRESSURE (High Arrivals + Softening Price)'
    | 'TIGHTENING MARKET (Low Arrivals + Firming Price)'
    | 'STRONG DEMAND RESILIENCE (High Arrivals + Rising Price)'
    | 'SUBDUED BUYER DEMAND (Low Arrivals + Falling Price)'
    | 'BALANCED ABSORPTION (Stable Arrivals + Stable Price)'
    | 'INSUFFICIENT OBSERVATIONS';
  explanation: string;
  isPredictive: false;
  disclaimer: 'Historical/current market relationship — not a future price prediction.';
}

/**
 * Nearby APMC Market Comparison Record
 */
export interface MarketComparisonRecord {
  marketId: string;
  market: string;
  marketCode?: string;
  state: string;
  district: string;
  commodity: string;
  cropId: string;
  variety: string;
  grade: string;
  
  modalPrice: number | null;
  modalPricePerKg?: number | null;
  minPrice: number | null;
  maxPrice: number | null;
  priceUnit: string;
  
  arrivalQuantity: number | null;
  arrivalUnit: string;
  
  priceDate: string;
  freshnessStatus?: MarketFreshnessStatus;
  freshnessLabel?: string;
  daysOld?: number;
  isStale?: boolean;
  
  // Distance Metrics
  distance: number | null; // in km
  distanceType: DistanceType;
  
  // Coordinate Provenance
  coordinateQuality?: CoordinateQuality;
  coordinateSource?: string;
  searchRadiusKm?: number;

  // Expected Yield & Quantity
  expectedYieldQtl?: number;

  // Transport & Freight (strict validated inputs only)
  transportCostPerQtl?: number | null;
  estimatedFreightPerQtl?: number | null;
  loadingCostPerQtl?: number | null;
  unloadingCostPerQtl?: number | null;
  otherCostsPerQtl?: number | null;
  estimatedHamaliAndCess?: number | null;
  transportCostNotice?: string;

  // Net Realization Value (NRV)
  nrvPerQtl?: number | null;
  nrvPerKg?: number | null;
  estimatedNetRealization?: number | null;
  estimatedTotalNrv?: number | null;
  netRealizationNotice?: string;
  
  source: string;
  sourceUrl?: string;
  datasetName?: string;
  retrievedAt?: string;
  dataQuality: MarketDataQuality;
  dataStatus: MarketDataStatus;
  
  isSameDistrict: boolean;
  isNearby: boolean;
  isBestMarket?: boolean;
  rankNumber?: number;
  rankingBasis?: string;
  compositeScore?: number; // Balanced ranking taking price, distance, and freshness into account
}

/**
 * Official MSP Record from CACP / MoA&FW Gazette
 */
export interface MSPRecord {
  recordId: string;
  cropId: string;
  crop: string;
  commodity: string;
  variety?: string;
  marketingSeason: 'Kharif' | 'Rabi' | 'Commercial' | 'All';
  MSP: number | null; // ₹ per Quintal
  unit: string; // '₹/Quintal'
  effectiveYear: string; // e.g. "2024-25", "2023-24"
  costA2FLBenchmark?: number | null; // CACP projected A2+FL cost
  costC2Benchmark?: number | null; // CACP comprehensive C2 cost
  returnOverA2FLPercent?: number | null; // Statutory guaranteed margin (typically >= 50%)
  
  sourceName: string; // "CACP / Ministry of Agriculture & Farmers Welfare, GoI"
  sourceUrl: string; // "https://cacp.dacnet.nic.in"
  publicationDate: string;
  dataStatus: MspDataStatus;
}

/**
 * Comparison of Mandi Modal Price vs Official MSP
 */
export interface MspComparisonResult {
  cropId: string;
  commodity: string;
  modalPrice: number | null;
  msp: number | null;
  marketingYear: string;
  
  priceDifference: number | null; // modalPrice - msp (₹/Qtl)
  percentageDifference: number | null; // (priceDifference / msp) * 100
  isAboveMsp: boolean | null;
  status: 'ABOVE MSP' | 'AT MSP' | 'BELOW MSP' | 'MSP DATA UNAVAILABLE' | 'PRICE DATA UNAVAILABLE';
  note: string;
}

/**
 * Market Data Source Registry Entry
 */
export interface MarketDataSourceRegistryItem {
  sourceId: string;
  sourceName: string;
  organization: string;
  officialUrl: string;
  dataset: string;
  coverage: string;
  frequency: string;
  lastRetrieved: string;
  status: 'ACTIVE' | 'ARCHIVED' | 'PERIODIC';
  notes: string;
}

/**
 * Mandi Location Filter Parameters
 */
export interface MandiLocationFilter {
  latitude?: number | null;
  longitude?: number | null;
  state?: string;
  district?: string;
  marketName?: string;
  radiusKm?: number;
}

/**
 * Mandi Filter Parameters
 */
export interface MandiFilterParams {
  cropId?: string;
  commodity?: string;
  state?: string;
  district?: string;
  market?: string;
  latitude?: number | null;
  longitude?: number | null;
  radiusKm?: number;
  fromDate?: string;
  toDate?: string;
  maxDistanceKm?: number;
}

/**
 * Market Price Spread Summary
 * Measures spatial and regional price dispersion for opportunity and risk identification.
 */
export interface MarketPriceSpreadSummary {
  cropId: string;
  commodity: string;
  eligibleMarketsCount: number;
  highestModalPrice: number | null;
  lowestModalPrice: number | null;
  averageModalPrice: number | null;
  medianModalPrice: number | null;
  priceSpread: number | null; // highestModalPrice - lowestModalPrice (₹/Qtl)
  percentageSpread: number | null; // (priceSpread / lowestModalPrice) * 100
  highestPriceMarket: {
    marketName: string;
    state: string;
    district: string;
    modalPrice: number;
    distanceKm: number | null;
    priceDate: string;
  } | null;
  lowestPriceMarket: {
    marketName: string;
    state: string;
    district: string;
    modalPrice: number;
    distanceKm: number | null;
    priceDate: string;
  } | null;
  opportunityAssessment: 'HIGH SPREAD OPPORTUNITY' | 'MODERATE SPREAD' | 'TIGHT PRICE INTEGRATION' | 'INSUFFICIENT MARKETS';
  notice: string;
  derivedLabel: 'FARMFIT DERIVED ANALYTICS';
}

/**
 * Data Quality & Record Audit Result
 */
export interface MarketRecordQualityAuditResult {
  totalProcessed: number;
  acceptedCount: number;
  rejectedCount: number;
  duplicateCount: number;
  rejectedRecords: {
    recordId?: string;
    market?: string;
    commodity?: string;
    rejectReason: string;
    rawRecord: any;
  }[];
  qualityScore: number; // 0-100%
  timestamp: string;
}

/**
 * Official Source Health Status
 */
export interface OfficialSourceHealthStatus {
  sourceId: string;
  sourceName: string;
  organization: string;
  officialUrl: string;
  dataset: string;
  lastSuccessfulRetrieval: string;
  latestObservationDate: string | null;
  activeRecordCount: number;
  status: 'VERIFIED' | 'RECENT' | 'STALE' | 'UNAVAILABLE' | 'ERROR';
  notes: string;
}

/**
 * Commodity Market Coverage Matrix Item
 */
export interface CommodityCoverageMatrixItem {
  cropCommodityId: string;
  displayName: string;
  officialCommodityName: string;
  commodityGroup: string;
  category: string;
  activeMarketsCount: number;
  totalObservationsCount: number;
  statesWithObservations: string[];
  districtsWithObservations: string[];
  marketsWithObservations: string[];
  latestObservationDate: string | null;
  nationalModalPrice: number | null;
  nationalMinPrice: number | null;
  nationalMaxPrice: number | null;
  coverageTier: 'HIGH COVERAGE' | 'MEDIUM COVERAGE' | 'LOW COVERAGE' | 'OFFICIAL DATA CURRENTLY UNAVAILABLE';
  freshnessStatus: MarketFreshnessStatus;
}

