import { APMCMarketMaster, MandiPriceRecord, PriceTrendAnalysis } from '../types/marketIntelligence';
import { PerishabilityTier, CommodityMappingStatus, CommodityMarketDataStatus } from './commodityMaster';

/**
 * 1. Location Hierarchy Node
 */
export interface CanonicalLocationHierarchy {
  state: string;
  stateCode?: string;
  district: string;
  districtCode?: string;
  taluka?: string;
  village?: string;
  latitude: number | null;
  longitude: number | null;
  apmcCount: number;
}

/**
 * 2. Canonical Commodity Hierarchy
 */
export interface CanonicalCommodityHierarchy {
  cropCommodityId: string;
  officialCommodityName: string;
  displayName: string;
  hindiName?: string;
  commodityGroup: string;
  category: string;
  subcategory?: string;
  scientificName?: string;
  perishability: PerishabilityTier;
  mappingStatus: CommodityMappingStatus;
  marketDataStatus: CommodityMarketDataStatus;
  authoritativeSource: string;
  officialSourceUrl?: string;
  aliases: string[];
  varieties: string[];
  grades: string[];
  mspNotified: boolean;
  activeMarketCount: number;
  totalObservationsCount: number;
  nationalModalPrice?: number | null;
  nationalMinPrice?: number | null;
  nationalMaxPrice?: number | null;
  localNames?: Record<string, string | undefined>;
}

/**
 * 3. Market x Commodity Matrix Cell
 */
export interface MarketCommodityMatrixCell {
  marketId: string;
  marketName: string;
  district: string;
  state: string;
  latitude: number;
  longitude: number;
  cropId: string;
  commodity: string;
  variety: string;
  grade: string;
  latestPriceDate: string;
  modalPrice: number;
  minPrice: number;
  maxPrice: number;
  arrivalQuantity: number;
  arrivalUnit: string;
  source: string;
  dataStatus: 'OFFICIAL DATA' | 'FARMFIT DERIVED ANALYSIS' | 'FARMFIT SCENARIO';
}

/**
 * 4. Multi-Stakeholder Intelligence Output
 */
export interface UniversalStakeholderIntelligence {
  commodity: CanonicalCommodityHierarchy;
  location: CanonicalLocationHierarchy;
  priceTrend: PriceTrendAnalysis;
  
  farmerDecision: {
    recommendedAction: 'SELL_IMMEDIATELY' | 'HOLD_FOR_HIGHER_PRICE' | 'DIVERT_TO_NEARBY_MANDI' | 'EXPLORE_MSP_PROCUREMENT';
    actionSummary: string;
    optimalMarket: {
      marketName: string;
      district: string;
      distanceKm: number | null;
      modalPrice: number;
      estimatedNrvPerQtl: number;
      priceAdvantageVsLocal: number;
    } | null;
    mspSafeguard: {
      mspPrice: number | null;
      isBelowMsp: boolean;
      deltaFromMsp: number | null;
    };
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  };

  fpoDecision: {
    aggregationRecommendation: string;
    collectiveVolumeThresholdQtl: number;
    bulkTransportSavingsPerQtl: number;
    targetDestinationMandi: string;
    workingCapitalRequirement: number;
  };

  b2bDecision: {
    sourcingRecommendation: string;
    lowestLandedCostMarket: string;
    estimatedLandedCostPerQtl: number;
    supplyLiquidityScore: number; // 0-100
    arbitrageSpreadPercent: number;
  };

  governmentDecision: {
    priceWarningStatus: 'NORMAL' | 'PRICE_CRASH_ALERT' | 'INFLATION_ALERT' | 'MSP_DEFICIT_ZONE';
    procurementInterventionNeeded: boolean;
    arrivalTrendStatus: 'HEAVY_SUPPLY' | 'NORMAL_SUPPLY' | 'SUPPLY_SHORTAGE';
    policyActionRecommendation: string;
  };
}
