import { CropCategory, CropSeason, SoilOrder } from '../types';

export type PerishabilityTier = 'High' | 'Medium' | 'Low';
export type CommodityMappingStatus = 'VERIFIED_OFFICIAL' | 'PARTIALLY_MAPPED' | 'OFFICIAL_COMMODITY_FOUND_MAPPING_REQUIRED';
export type CommodityMarketDataStatus = 'MARKET_PRICE_AVAILABLE' | 'OFFICIAL_MARKET_DATA_UNAVAILABLE' | 'AGRONOMIC_PLANNING_ONLY';
export type CommodityGroupType = string;

/**
 * UNIVERSAL CANONICAL COMMODITY RECORD
 * Single authoritative source of truth for all agricultural commodities across:
 * Agronomy, Market Intelligence, Price Forecasting, Logistics, Risk, and Policy.
 */
export interface UniversalCommodityRecord {
  /** Stable unique canonical identifier (e.g. 'bajra', 'onion', 'tomato', 'soybean', 'wheat', 'carrot') */
  cropCommodityId: string;
  
  /** Standard display name (e.g. 'Bajra / Pearl Millet', 'Onion', 'Tomato', 'Carrot') */
  displayName: string;
  
  /** Official Government of India / AGMARKNET commodity name */
  officialCommodityName: string;
  
  /** Broad commodity group (e.g. 'Cereals', 'Vegetables', 'Pulses', 'Oilseeds', 'Spices', 'Fruits', 'Commercial Crops', 'Fibre Crops', 'Plantation Crops', 'Nuts & Dry Fruits', 'Fodder') */
  commodityGroup: string;
  
  /** Canonical crop category */
  category: CropCategory;

  /** Granular subcategory (e.g. 'Root Vegetable', 'Cole Crop', 'Leafy Vegetable', 'Fruit Vegetable', 'Bulb Vegetable', 'Millets', 'Minor Millets', 'Tree Spice', 'Seed Spice', 'Stone Fruit', 'Citrus Fruit') */
  subcategory?: string;
  
  /** Multilingual and colloquial aliases for robust search & resolution */
  aliases: string[];
  
  /** Botanical / Scientific binomial nomenclature */
  scientificName: string;
  
  /** Official AGMARKNET nomenclature variants */
  agmarknetNames: string[];
  
  /** First-class taxonomic classifications */
  isVegetable: boolean;
  isFruit: boolean;
  isCereal: boolean;
  isPulse: boolean;
  isOilseed: boolean;
  isSpice: boolean;
  isCommercialCrop: boolean;
  isPlantationCrop?: boolean;
  isFibreCrop?: boolean;
  isNutOrDryFruit?: boolean;
  isFodderCrop?: boolean;
  
  /** Active status in current operational master */
  isActive: boolean;

  /** Perishability classification for logistics, radius and price risk */
  perishability: PerishabilityTier;

  /** Standard duration in days from sowing to harvest */
  typicalDurationDays?: number;

  /** Primary agricultural season */
  season?: CropSeason;

  /** Minimum Support Price (MSP) notification status under CACP */
  isMspNotified?: boolean;

  /** Statutory Fair and Remunerative Price (FRP) or State Advised Price (SAP) for Sugarcane */
  isFrpOrSapApplicable?: boolean;

  /** Authoritative Government Source Organization */
  authoritativeSource: string;

  /** Official source portal reference */
  officialSourceUrl: string;

  /** Canonical Mapping Status */
  mappingStatus: CommodityMappingStatus;

  /** Known standard commercial varieties in APMC yards */
  varieties?: string[];

  /** Standard FAQ / commercial grades */
  grades?: string[];

  /** Multilingual local names */
  localNames?: {
    hi?: string;
    en?: string;
    mr?: string;
    kn?: string;
    te?: string;
    ta?: string;
    gu?: string;
    pa?: string;
    bn?: string;
    ml?: string;
    or?: string;
    as?: string;
    ur?: string;
    [lang: string]: string | undefined;
  };
}

export interface OfficialCommodityMapping {
  cropCommodityId: string;
  officialCommodityName: string;
  displayName: string;
  hindiName: string;
  commodityGroup: string;
  category: CropCategory;
  subcategory?: string;
  perishability?: PerishabilityTier;
  aliases: string[];
  agmarknetNames?: string[];
  authoritativeSource?: string;
  officialSourceUrl?: string;
  mappingStatus?: CommodityMappingStatus;
  varieties?: string[];
  grades?: string[];
}
