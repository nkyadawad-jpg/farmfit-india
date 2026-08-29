import { 
  CropMasterRecord, 
  CropCategory, 
  CropSeason,
  FarmLocation,
  LandIrrigationProfile,
  SoilProfileRecord
} from '../types';
import { 
  COMPLETE_INDIA_CROP_MASTER, 
  getCropById, 
  ALL_CROP_CATEGORIES 
} from '../data/cropMasterIndex';
import { OFFICIAL_AGMARKNET_DAILY_BULLETINS } from '../data/agmarknetOfficialData';
import { evaluateCropSuitability, FarmContextForSuitability } from './cropSuitabilityEngine';
import { safeNumber, safeArray, safeString } from '../utils/safeArithmetic';

export type SelectorCategoryTab = 
  | 'ALL'
  | 'CEREALS'
  | 'PULSES'
  | 'OILSEEDS'
  | 'VEGETABLES'
  | 'FRUITS'
  | 'SPICES'
  | 'COMMERCIAL CROPS'
  | 'FIBRE'
  | 'PLANTATION'
  | 'NUTS & DRY FRUITS'
  | 'OTHER';

export interface CropMarketAvailabilityInfo {
  status: 'AVAILABLE' | 'NOT_CURRENTLY_AVAILABLE';
  statusText: string;
  hasOfficialBulletinPrice: boolean;
  latestPriceDate?: string;
  latestModalPrice?: number;
  marketCount: number;
  availableVarieties: string[];
  availableGrades: string[];
  sourceName: string;
  sourceUrl: string;
}

export interface EnrichedCropSelectorItem {
  crop: CropMasterRecord;
  marketInfo: CropMarketAvailabilityInfo;
  suitabilityScore?: number;
  suitabilityLevel?: string;
  suitabilityReasons?: string[];
  limitingReasons?: string[];
  isRecommended?: boolean;
}

export interface CategoryCountsSummary {
  totalOptions: number;
  vegetables: number;
  fruits: number;
  spices: number;
  cereals: number;
  pulses: number;
  oilseeds: number;
  commercialCrops: number;
  fibre: number;
  plantation: number;
  nutsAndDryFruits: number;
  other: number;
}

/**
 * Normalizes category name to the standard selector category tabs
 */
export function normalizeToSelectorTab(category: string, subcategory: string = ''): SelectorCategoryTab {
  const cat = (category || '').toLowerCase();
  const sub = (subcategory || '').toLowerCase();
  
  if (cat.includes('fibre') || cat.includes('fiber') || sub.includes('fibre') || sub.includes('fiber')) return 'FIBRE';
  if (cat.includes('plantation') || sub.includes('plantation') || sub.includes('beverage') || sub.includes('latex')) return 'PLANTATION';
  if (cat.includes('nut') || cat.includes('dry fruit') || sub.includes('nut') || sub.includes('dry fruit')) return 'NUTS & DRY FRUITS';
  if (cat.includes('cereal') || cat.includes('millet')) return 'CEREALS';
  if (cat.includes('pulse')) return 'PULSES';
  if (cat.includes('oilseed')) return 'OILSEEDS';
  if (cat.includes('vegetable')) return 'VEGETABLES';
  if (cat.includes('fruit')) return 'FRUITS';
  if (cat.includes('spice') || cat.includes('condiment')) return 'SPICES';
  if (cat.includes('commercial') || cat.includes('sugar') || cat.includes('fodder')) return 'COMMERCIAL CROPS';
  return 'OTHER';
}

/**
 * Service to manage the All India Crop & Commodity Selector
 */
export class CropMasterSelectorService {
  private officialBulletinsMap: Map<string, typeof OFFICIAL_AGMARKNET_DAILY_BULLETINS> = new Map();

  constructor() {
    this.indexOfficialBulletins();
  }

  private indexOfficialBulletins() {
    this.officialBulletinsMap.clear();
    for (const record of OFFICIAL_AGMARKNET_DAILY_BULLETINS) {
      const cropId = (record.cropId || '').toLowerCase().trim();
      const commodity = (record.commodity || '').toLowerCase().trim();
      
      if (cropId) {
        const existing = this.officialBulletinsMap.get(cropId) || [];
        existing.push(record);
        this.officialBulletinsMap.set(cropId, existing);
      }
      if (commodity && commodity !== cropId) {
        const existing = this.officialBulletinsMap.get(commodity) || [];
        existing.push(record);
        this.officialBulletinsMap.set(commodity, existing);
      }
    }
  }

  /**
   * Retrieves accurate dynamic counts of all available crops/commodities by category
   */
  public getCategoryCounts(): CategoryCountsSummary {
    let cereals = 0;
    let pulses = 0;
    let oilseeds = 0;
    let vegetables = 0;
    let fruits = 0;
    let spices = 0;
    let commercialCrops = 0;
    let fibre = 0;
    let plantation = 0;
    let nutsAndDryFruits = 0;
    let other = 0;

    for (const crop of COMPLETE_INDIA_CROP_MASTER) {
      const tab = normalizeToSelectorTab(crop.category, crop.subcategory);
      switch (tab) {
        case 'CEREALS': cereals++; break;
        case 'PULSES': pulses++; break;
        case 'OILSEEDS': oilseeds++; break;
        case 'VEGETABLES': vegetables++; break;
        case 'FRUITS': fruits++; break;
        case 'SPICES': spices++; break;
        case 'COMMERCIAL CROPS': commercialCrops++; break;
        case 'FIBRE': fibre++; break;
        case 'PLANTATION': plantation++; break;
        case 'NUTS & DRY FRUITS': nutsAndDryFruits++; break;
        default: other++; break;
      }
    }

    return {
      totalOptions: COMPLETE_INDIA_CROP_MASTER.length,
      vegetables,
      fruits,
      spices,
      cereals,
      pulses,
      oilseeds,
      commercialCrops,
      fibre,
      plantation,
      nutsAndDryFruits,
      other
    };
  }

  /**
   * Evaluates official market data availability for a specific crop ID
   */
  public getMarketAvailability(cropId: string, officialCommodityName?: string): CropMarketAvailabilityInfo {
    const cleanId = (cropId || '').toLowerCase().trim();
    const cleanCommodity = (officialCommodityName || '').toLowerCase().trim();

    let records = this.officialBulletinsMap.get(cleanId) || [];
    if (records.length === 0 && cleanCommodity) {
      records = this.officialBulletinsMap.get(cleanCommodity) || [];
    }

    // Fallback fuzzy search if exact key not in map
    if (records.length === 0) {
      records = OFFICIAL_AGMARKNET_DAILY_BULLETINS.filter(r => 
        (r.cropId && r.cropId.toLowerCase() === cleanId) ||
        (r.commodity && r.commodity.toLowerCase().includes(cleanId)) ||
        (cleanCommodity && r.commodity && r.commodity.toLowerCase().includes(cleanCommodity))
      );
    }

    if (records.length > 0) {
      const varieties = Array.from(new Set(records.map(r => r.variety).filter(Boolean)));
      const grades = Array.from(new Set(records.map(r => r.grade).filter(Boolean)));
      
      // Find highest modal price and latest date
      const sortedByDate = [...records].sort((a, b) => (b.priceDate || '').localeCompare(a.priceDate || ''));
      const latest = sortedByDate[0];

      return {
        status: 'AVAILABLE',
        statusText: 'Official Market Data: AVAILABLE',
        hasOfficialBulletinPrice: true,
        latestPriceDate: latest?.priceDate || '2026-08-20',
        latestModalPrice: latest?.modalPrice,
        marketCount: records.length,
        availableVarieties: varieties.length > 0 ? varieties : ['FAQ', 'Local', 'Hybrid'],
        availableGrades: grades.length > 0 ? grades : ['FAQ'],
        sourceName: latest?.source || 'Directorate of Marketing & Inspection (AGMARKNET / data.gov.in)',
        sourceUrl: latest?.sourceUrl || 'https://agmarknet.gov.in/'
      };
    }

    return {
      status: 'NOT_CURRENTLY_AVAILABLE',
      statusText: 'Official Market Data: NOT CURRENTLY AVAILABLE',
      hasOfficialBulletinPrice: false,
      marketCount: 0,
      availableVarieties: ['Standard / Local', 'Hybrid'],
      availableGrades: ['FAQ'],
      sourceName: 'FARMFIT Agronomic Crop Master / ICAR Package of Practices',
      sourceUrl: 'https://icar.org.in/'
    };
  }

  /**
   * Comprehensive search & filter across all Indian crops, vegetables, fruits, spices, and commodities
   */
  public searchCrops(options: {
    query?: string;
    categoryTab?: SelectorCategoryTab;
    season?: CropSeason | 'ALL';
    mspOnly?: boolean;
    farmContext?: FarmContextForSuitability;
  }): EnrichedCropSelectorItem[] {
    const { 
      query = '', 
      categoryTab = 'ALL', 
      season = 'ALL', 
      mspOnly = false,
      farmContext 
    } = options;

    const cleanQuery = query.toLowerCase().trim();

    const filtered = COMPLETE_INDIA_CROP_MASTER.filter(crop => {
      // Category Tab Filter
      if (categoryTab !== 'ALL') {
        const cropTab = normalizeToSelectorTab(crop.category, crop.subcategory);
        if (cropTab !== categoryTab) return false;
      }

      // Season Filter
      if (season !== 'ALL') {
        if (crop.season !== season && crop.season !== 'Multiple seasons' && crop.season !== 'Annual / Commercial' && crop.season !== 'Perennial') {
          return false;
        }
      }

      // MSP Filter
      if (mspOnly && !crop.government?.MSPApplicable) {
        return false;
      }

      // Text Query Search
      if (cleanQuery) {
        const nameMatch = crop.cropName.toLowerCase().includes(cleanQuery);
        const sciMatch = (crop.scientificName || '').toLowerCase().includes(cleanQuery);
        const catMatch = (crop.category || '').toLowerCase().includes(cleanQuery);
        const subMatch = (crop.subcategory || '').toLowerCase().includes(cleanQuery);
        const idMatch = (crop.cropId || '').toLowerCase().includes(cleanQuery);
        
        // Check regional & local names
        const localNames = Object.values(crop.localNames || {}).join(' ').toLowerCase();
        const localMatch = localNames.includes(cleanQuery);

        return nameMatch || sciMatch || catMatch || subMatch || idMatch || localMatch;
      }

      return true;
    });

    // Enrich with market availability and optional farm suitability
    return filtered.map(crop => {
      const marketInfo = this.getMarketAvailability(crop.cropId, crop.cropName);
      
      let suitabilityScore: number | undefined;
      let suitabilityLevel: string | undefined;
      let suitabilityReasons: string[] = [];
      let limitingReasons: string[] = [];
      let isRecommended = true;

      if (farmContext) {
        const suitability = evaluateCropSuitability(crop, farmContext);
        suitabilityScore = suitability.overallScore;
        suitabilityLevel = suitability.suitabilityLevel;
        suitabilityReasons = suitability.positiveFactors || [];
        limitingReasons = suitability.limitingFactors || [];
        isRecommended = suitability.overallScore >= 60;
      }

      return {
        crop,
        marketInfo,
        suitabilityScore,
        suitabilityLevel,
        suitabilityReasons,
        limitingReasons,
        isRecommended
      };
    });
  }

  /**
   * Finds the best crops for the farmer's specific farm constraints (All-Crop Decision Mode)
   */
  public findBestCropsForFarm(farmContext: FarmContextForSuitability): {
    recommendedCrops: EnrichedCropSelectorItem[];
    ineligibleCrops: EnrichedCropSelectorItem[];
    allEvaluated: EnrichedCropSelectorItem[];
  } {
    const evaluated = COMPLETE_INDIA_CROP_MASTER.map(crop => {
      const marketInfo = this.getMarketAvailability(crop.cropId, crop.cropName);
      const suitability = evaluateCropSuitability(crop, farmContext);
      
      return {
        crop,
        marketInfo,
        suitabilityScore: suitability.overallScore,
        suitabilityLevel: suitability.suitabilityLevel,
        suitabilityReasons: suitability.positiveFactors || [],
        limitingReasons: suitability.limitingFactors || [],
        isRecommended: suitability.overallScore >= 60
      };
    });

    // Sort by suitability score descending, then by market price availability
    evaluated.sort((a, b) => {
      const scoreDiff = (b.suitabilityScore || 0) - (a.suitabilityScore || 0);
      if (scoreDiff !== 0) return scoreDiff;
      if (b.marketInfo.hasOfficialBulletinPrice && !a.marketInfo.hasOfficialBulletinPrice) return 1;
      if (!b.marketInfo.hasOfficialBulletinPrice && a.marketInfo.hasOfficialBulletinPrice) return -1;
      return a.crop.cropName.localeCompare(b.crop.cropName);
    });

    const recommendedCrops = evaluated.filter(item => (item.suitabilityScore || 0) >= 60);
    const ineligibleCrops = evaluated.filter(item => (item.suitabilityScore || 0) < 60);

    return {
      recommendedCrops,
      ineligibleCrops,
      allEvaluated: evaluated
    };
  }
}

export const cropMasterSelectorService = new CropMasterSelectorService();
