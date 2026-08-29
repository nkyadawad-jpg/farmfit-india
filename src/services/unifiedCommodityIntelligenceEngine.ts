/**
 * FARMFIT UNIFIED COMMODITY × MARKET × PRICE INTELLIGENCE ENGINE
 * 
 * Implements:
 * 1. Single canonical data model: LOCATION -> COMMODITY -> MARKET -> PRICE -> NRV -> DECISION
 * 2. Complete commodity universe indexing (with aliases, Hindi names, scientific names, varieties, grades)
 * 3. Source-Driven Zero-Missing-Commodity architecture with transparent provenance
 * 4. Market x Commodity Matrix bidirectional lookup
 * 5. Full Stakeholder Intelligence: Farmer, FPO, B2B Procurement, Government Early Warning
 */

import { 
  MandiPriceRecord, 
  PriceTrendAnalysis, 
  MarketComparisonRecord,
  TransportCostInputs
} from '../types/marketIntelligence';
import { 
  CanonicalCommodityHierarchy, 
  CanonicalLocationHierarchy, 
  MarketCommodityMatrixCell,
  UniversalStakeholderIntelligence 
} from '../types/unifiedIntelligence';
import { 
  ALL_CANONICAL_COMMODITIES,
  resolveCanonicalCommodity,
  createUnmappedOfficialCommodityRecord
} from '../data/canonicalCommodityUniverse';
import { 
  COMPLETE_INDIA_CROP_MASTER, 
  OFFICIAL_COMMODITY_MAPPINGS,
  getCanonicalCropById
} from '../data/cropMasterIndex';
import { 
  OFFICIAL_AGMARKNET_DAILY_BULLETINS, 
  ALL_INDIA_APMC_COORDINATES 
} from '../data/agmarknetOfficialData';
import { APMC_MARKET_MASTER, OFFICIAL_CACP_MSP_RECORDS } from '../data/mandiMarketData';
import { canonicalLocationService } from './canonicalLocationService';
import { nearbyMandiService } from './nearbyMandiService';
import { marketDataService } from './marketDataService';
import { marketDataRepository } from './marketDataRepository';

export class UnifiedCommodityIntelligenceEngine {
  private static instance: UnifiedCommodityIntelligenceEngine;
  private commodityCatalogCache: CanonicalCommodityHierarchy[] | null = null;

  private constructor() {}

  public static getInstance(): UnifiedCommodityIntelligenceEngine {
    if (!UnifiedCommodityIntelligenceEngine.instance) {
      UnifiedCommodityIntelligenceEngine.instance = new UnifiedCommodityIntelligenceEngine();
    }
    return UnifiedCommodityIntelligenceEngine.instance;
  }

  /**
   * 1. Get the comprehensive India-wide commodity catalog with real observed market counts and prices.
   * Zero-missing-commodity principle: Seeds all canonical commodities and dynamically integrates
   * any observed commodity from official daily bulletins.
   */
  public getCommodityUniverse(): CanonicalCommodityHierarchy[] {
    if (this.commodityCatalogCache) {
      return this.commodityCatalogCache;
    }

    const bulletins = OFFICIAL_AGMARKNET_DAILY_BULLETINS;
    const commoditiesMap = new Map<string, CanonicalCommodityHierarchy>();

    // Step A: Seed from ALL_CANONICAL_COMMODITIES (The Authoritative Universe)
    ALL_CANONICAL_COMMODITIES.forEach(crop => {
      const mspRec = OFFICIAL_CACP_MSP_RECORDS.find(
        m => m.cropId.toLowerCase() === crop.cropCommodityId.toLowerCase() ||
             m.crop.toLowerCase().includes(crop.displayName.toLowerCase()) ||
             crop.displayName.toLowerCase().includes(m.crop.toLowerCase())
      );

      const aliases = new Set<string>([
        crop.cropCommodityId.toLowerCase(),
        crop.displayName.toLowerCase(),
        crop.officialCommodityName.toLowerCase(),
        ...(crop.aliases || [])
      ]);

      if (crop.localNames) {
        Object.values(crop.localNames).forEach(val => {
          if (val) aliases.add(val.toLowerCase());
        });
      }

      commoditiesMap.set(crop.cropCommodityId.toLowerCase(), {
        cropCommodityId: crop.cropCommodityId,
        officialCommodityName: crop.officialCommodityName,
        displayName: crop.displayName,
        hindiName: crop.localNames?.hi,
        commodityGroup: crop.commodityGroup,
        category: crop.category,
        subcategory: crop.subcategory,
        scientificName: crop.scientificName,
        perishability: crop.perishability,
        mappingStatus: crop.mappingStatus,
        marketDataStatus: 'OFFICIAL_MARKET_DATA_UNAVAILABLE',
        authoritativeSource: crop.authoritativeSource,
        officialSourceUrl: crop.officialSourceUrl,
        aliases: Array.from(aliases),
        varieties: [...crop.varieties],
        grades: [...crop.grades],
        mspNotified: Boolean(crop.isMspNotified || mspRec),
        activeMarketCount: 0,
        totalObservationsCount: 0,
        nationalModalPrice: null,
        nationalMinPrice: null,
        nationalMaxPrice: null,
        localNames: crop.localNames
      });
    });

    // Step B: Seed any additional crops from COMPLETE_INDIA_CROP_MASTER if not already present
    COMPLETE_INDIA_CROP_MASTER.forEach(crop => {
      const existing = commoditiesMap.get(crop.cropId.toLowerCase());
      if (!existing) {
        const mapping = OFFICIAL_COMMODITY_MAPPINGS[crop.cropId.toLowerCase()] || 
                        OFFICIAL_COMMODITY_MAPPINGS[crop.cropName.toLowerCase()];
        
        const mspRec = OFFICIAL_CACP_MSP_RECORDS.find(
          m => m.cropId.toLowerCase() === crop.cropId.toLowerCase() ||
               m.crop.toLowerCase().includes(crop.cropName.toLowerCase()) ||
               crop.cropName.toLowerCase().includes(m.crop.toLowerCase())
        );

        const aliases = new Set<string>([
          crop.cropId.toLowerCase(),
          crop.cropName.toLowerCase(),
          ...(mapping?.aliases || [])
        ]);

        if (crop.localNames) {
          Object.values(crop.localNames).forEach(val => {
            if (val) aliases.add(val.toLowerCase());
          });
        }

        commoditiesMap.set(crop.cropId.toLowerCase(), {
          cropCommodityId: crop.cropId,
          officialCommodityName: mapping?.officialCommodityName || crop.cropName,
          displayName: crop.cropName,
          hindiName: crop.localNames?.hi || mapping?.hindiName,
          commodityGroup: crop.category,
          category: crop.category,
          subcategory: (mapping as any)?.subcategory || 'General Crop',
          scientificName: crop.scientificName,
          perishability: crop.category === 'Vegetables' ? 'High' : (crop.category === 'Fruits' ? 'Medium' : 'Low'),
          mappingStatus: 'VERIFIED_OFFICIAL',
          marketDataStatus: 'OFFICIAL_MARKET_DATA_UNAVAILABLE',
          authoritativeSource: 'DAC&FW / DMI AGMARKNET',
          officialSourceUrl: 'https://agmarknet.gov.in/',
          aliases: Array.from(aliases),
          varieties: [],
          grades: [],
          mspNotified: Boolean(crop.government?.MSPApplicable || mspRec),
          activeMarketCount: 0,
          totalObservationsCount: 0,
          nationalModalPrice: null,
          nationalMinPrice: null,
          nationalMaxPrice: null,
          localNames: crop.localNames
        });
      }
    });

    // Step C: Discover and aggregate observed data from AGMARKNET daily bulletins
    bulletins.forEach(b => {
      const cropIdKey = b.cropId.toLowerCase();
      let item = commoditiesMap.get(cropIdKey);

      if (!item) {
        // Try resolving through canonical universe lookup
        const resolved = resolveCanonicalCommodity(b.commodity) || resolveCanonicalCommodity(b.cropId);
        if (resolved) {
          item = commoditiesMap.get(resolved.cropCommodityId.toLowerCase());
        }
      }

      if (!item) {
        // Find by legacy mapping
        const foundMapping = Object.values(OFFICIAL_COMMODITY_MAPPINGS).find(
          m => m.officialCommodityName.toLowerCase() === b.commodity.toLowerCase() ||
               m.displayName.toLowerCase() === b.commodity.toLowerCase()
        );
        if (foundMapping) {
          item = commoditiesMap.get(foundMapping.cropCommodityId.toLowerCase());
        }
      }

      if (!item) {
        // Create entry for newly discovered official commodity (Zero-Missing-Commodity principle)
        const unmapped = createUnmappedOfficialCommodityRecord(b.commodity, b.source || 'AGMARKNET');
        item = {
          cropCommodityId: unmapped.cropCommodityId,
          officialCommodityName: unmapped.officialCommodityName,
          displayName: unmapped.displayName,
          hindiName: undefined,
          commodityGroup: b.commodityGroup || unmapped.commodityGroup,
          category: b.commodityGroup || unmapped.category,
          subcategory: unmapped.subcategory,
          scientificName: unmapped.scientificName,
          perishability: unmapped.perishability,
          mappingStatus: 'OFFICIAL_COMMODITY_FOUND_MAPPING_REQUIRED',
          marketDataStatus: 'MARKET_PRICE_AVAILABLE',
          authoritativeSource: unmapped.authoritativeSource,
          aliases: [b.cropId.toLowerCase(), b.commodity.toLowerCase(), ...unmapped.aliases],
          varieties: [],
          grades: [],
          mspNotified: false,
          activeMarketCount: 0,
          totalObservationsCount: 0,
          nationalModalPrice: null,
          nationalMinPrice: null,
          nationalMaxPrice: null,
          localNames: unmapped.localNames
        };
        commoditiesMap.set(unmapped.cropCommodityId.toLowerCase(), item);
      }

      // Track varieties & grades
      if (b.variety && !item.varieties.includes(b.variety)) {
        item.varieties.push(b.variety);
      }
      if (b.grade && !item.grades.includes(b.grade)) {
        item.grades.push(b.grade);
      }

      item.totalObservationsCount += 1;
    });

    // Step D: Compute aggregated prices & active market counts
    const catalog = Array.from(commoditiesMap.values()).map(comm => {
      const commBulletins = bulletins.filter(b => 
        b.cropId.toLowerCase() === comm.cropCommodityId.toLowerCase() ||
        comm.aliases.includes(b.commodity.toLowerCase()) ||
        b.commodity.toLowerCase() === comm.officialCommodityName.toLowerCase() ||
        b.commodity.toLowerCase() === comm.displayName.toLowerCase()
      );

      const uniqueMarkets = new Set(commBulletins.map(b => b.market));
      const prices = commBulletins.map(b => b.modalPrice).filter((p): p is number => p !== null && p > 0);
      const minPrices = commBulletins.map(b => b.minPrice).filter((p): p is number => p !== null && p > 0);
      const maxPrices = commBulletins.map(b => b.maxPrice).filter((p): p is number => p !== null && p > 0);

      const avgModal = prices.length > 0 ? Math.round(prices.reduce((a, b) => a + b, 0) / prices.length) : null;
      const minP = minPrices.length > 0 ? Math.min(...minPrices) : null;
      const maxP = maxPrices.length > 0 ? Math.max(...maxPrices) : null;

      const hasMarketData = uniqueMarkets.size > 0 && avgModal !== null;

      return {
        ...comm,
        activeMarketCount: uniqueMarkets.size,
        nationalModalPrice: avgModal,
        nationalMinPrice: minP,
        nationalMaxPrice: maxP,
        marketDataStatus: hasMarketData ? ('MARKET_PRICE_AVAILABLE' as const) : comm.marketDataStatus
      };
    });

    this.commodityCatalogCache = catalog.sort((a, b) => {
      // Prioritize commodities with observed market records
      if (b.activeMarketCount !== a.activeMarketCount) {
        return b.activeMarketCount - a.activeMarketCount;
      }
      return a.displayName.localeCompare(b.displayName);
    });

    return this.commodityCatalogCache;
  }

  /**
   * 2. Search commodities by English name, Hindi name, scientific name, or alias
   */
  public searchCommodities(query: string, categoryFilter: string = 'ALL'): CanonicalCommodityHierarchy[] {
    const universe = this.getCommodityUniverse();
    const cleanQuery = query.toLowerCase().trim();

    return universe.filter(c => {
      if (categoryFilter !== 'ALL' && c.category !== categoryFilter && c.commodityGroup !== categoryFilter) {
        return false;
      }

      if (!cleanQuery) return true;

      const matchId = c.cropCommodityId.toLowerCase().includes(cleanQuery);
      const matchName = c.displayName.toLowerCase().includes(cleanQuery);
      const matchOff = c.officialCommodityName.toLowerCase().includes(cleanQuery);
      const matchHindi = c.hindiName ? c.hindiName.toLowerCase().includes(cleanQuery) : false;
      const matchSci = c.scientificName ? c.scientificName.toLowerCase().includes(cleanQuery) : false;
      const matchAlias = c.aliases.some(a => a.includes(cleanQuery));

      return matchId || matchName || matchOff || matchHindi || matchSci || matchAlias;
    });
  }

  /**
   * Resolves a single commodity hierarchy by ID or search term.
   */
  public getCanonicalCommodity(cropQuery: string): CanonicalCommodityHierarchy | null {
    if (!cropQuery) return null;
    const universe = this.getCommodityUniverse();
    const cleanQuery = cropQuery.toLowerCase().trim();

    // 1. Direct ID match
    const byId = universe.find(c => c.cropCommodityId.toLowerCase() === cleanQuery);
    if (byId) return byId;

    // 2. Canonical universe resolver
    const resolved = resolveCanonicalCommodity(cleanQuery);
    if (resolved) {
      const matched = universe.find(c => c.cropCommodityId.toLowerCase() === resolved.cropCommodityId.toLowerCase());
      if (matched) return matched;
    }

    // 3. Substring match on name/aliases
    const byName = universe.find(c => 
      c.displayName.toLowerCase() === cleanQuery ||
      c.officialCommodityName.toLowerCase() === cleanQuery ||
      c.aliases.includes(cleanQuery)
    );
    if (byName) return byName;

    return null;
  }

  /**
   * 3. Market x Commodity Matrix: Bidirectional Lookup
   * - By Commodity: Which APMCs trade this commodity?
   * - By Market: What commodities are traded in this APMC?
   */
  public getMarketCommodityMatrix(params: {
    cropId?: string;
    marketName?: string;
    state?: string;
    district?: string;
  }): MarketCommodityMatrixCell[] {
    const bulletins = OFFICIAL_AGMARKNET_DAILY_BULLETINS;

    return bulletins
      .filter(b => {
        if (params.cropId && params.cropId !== 'All') {
          const qCrop = params.cropId.toLowerCase();
          const canonical = this.getCanonicalCommodity(qCrop);
          const aliases = canonical ? canonical.aliases : [qCrop];
          const matchCrop = b.cropId.toLowerCase() === qCrop || 
                            b.commodity.toLowerCase().includes(qCrop) ||
                            aliases.includes(b.commodity.toLowerCase());
          if (!matchCrop) return false;
        }

        if (params.state && params.state !== 'All') {
          if (!canonicalLocationService.areStatesEqual(b.state, params.state)) {
            return false;
          }
        }

        if (params.district && params.district !== 'All') {
          if (!canonicalLocationService.areDistrictsEqual(b.district, params.district, b.state)) {
            return false;
          }
        }

        if (params.marketName && params.marketName !== 'All') {
          const qM = params.marketName.toLowerCase();
          if (!b.market.toLowerCase().includes(qM)) {
            return false;
          }
        }

        return true;
      })
      .map(b => {
        const canonical = canonicalLocationService.resolveCanonicalMarket(b.market, b.state, b.district);
        const marketKey = b.market.toLowerCase().replace(' apmc', '').replace(' mandi', '').trim();
        const coords = ALL_INDIA_APMC_COORDINATES[marketKey] ||
          (canonical ? { lat: canonical.latitude, lon: canonical.longitude } : null) ||
          { lat: 0, lon: 0 };

        return {
          marketId: b.marketCode || canonical?.marketCode || `mkt_${b.market.toLowerCase().replace(/\s+/g, '_')}`,
          marketName: canonical?.marketName || b.market,
          district: canonicalLocationService.canonicalizeDistrict(b.district, b.state) || b.district,
          state: canonicalLocationService.canonicalizeState(b.state) || b.state,
          latitude: coords.lat,
          longitude: coords.lon,
          cropId: b.cropId,
          commodity: b.commodity,
          variety: b.variety,
          grade: b.grade,
          latestPriceDate: b.priceDate,
          modalPrice: b.modalPrice,
          minPrice: b.minPrice,
          maxPrice: b.maxPrice,
          arrivalQuantity: b.arrivalQuantity,
          arrivalUnit: b.arrivalUnit,
          source: b.source,
          dataStatus: 'OFFICIAL DATA'
        };
      });
  }

  /**
   * 4. Multi-Stakeholder Intelligence Synthesis
   * Computes tailored guidance for Farmers, FPOs, B2B Buyers, and Government.
   */
  public generateUniversalIntelligence(params: {
    cropId: string;
    farmerLatitude: number | null;
    farmerLongitude: number | null;
    state?: string;
    district?: string;
    expectedYieldQtl?: number;
    transportInputs?: Partial<TransportCostInputs>;
  }): UniversalStakeholderIntelligence {
    const cleanCropId = params.cropId.toLowerCase();
    const universe = this.getCommodityUniverse();
    const commodity = this.getCanonicalCommodity(cleanCropId) || universe.find(c => c.cropCommodityId.toLowerCase() === cleanCropId) || {
      cropCommodityId: cleanCropId,
      officialCommodityName: cleanCropId,
      displayName: cleanCropId.charAt(0).toUpperCase() + cleanCropId.slice(1),
      commodityGroup: 'Commodity',
      category: 'Commodity',
      subcategory: 'General',
      perishability: 'Medium' as const,
      mappingStatus: 'VERIFIED_OFFICIAL' as const,
      marketDataStatus: 'OFFICIAL_MARKET_DATA_UNAVAILABLE' as const,
      authoritativeSource: 'DAC&FW / DMI AGMARKNET',
      aliases: [cleanCropId],
      varieties: ['FAQ'],
      grades: ['FAQ'],
      mspNotified: false,
      activeMarketCount: 0,
      totalObservationsCount: 0,
      nationalModalPrice: null,
      nationalMinPrice: null,
      nationalMaxPrice: null
    };

    const location: CanonicalLocationHierarchy = {
      state: params.state || 'All India',
      district: params.district || 'Regional',
      latitude: params.farmerLatitude,
      longitude: params.farmerLongitude,
      apmcCount: 0
    };

    // Calculate Price Trend & History
    const priceTrend: PriceTrendAnalysis = marketDataService.calculatePriceTrend(
      commodity.cropCommodityId, 
      undefined, 
      {
        state: params.state,
        district: params.district,
        latitude: params.farmerLatitude,
        longitude: params.farmerLongitude
      }
    );

    // Calculate Net Realizable Value & Nearby Mandi Rankings
    const nearbyResult = nearbyMandiService.findNearbyMarkets({
      cropId: commodity.cropCommodityId,
      farmLatitude: params.farmerLatitude,
      farmLongitude: params.farmerLongitude,
      state: params.state,
      district: params.district,
      expectedYieldQtl: params.expectedYieldQtl || 10,
      transportInputs: params.transportInputs
    });

    const bestMarket = nearbyResult.bestMarket;
    const localMarket = nearbyResult.markets[0];
    const currentPrice = bestMarket ? (bestMarket.modalPrice || 0) : (priceTrend.latestModalPrice || 0);

    // MSP Safeguard calculation
    const mspRec = OFFICIAL_CACP_MSP_RECORDS.find(
      m => m.cropId.toLowerCase() === commodity.cropCommodityId.toLowerCase() ||
           m.crop.toLowerCase().includes(commodity.displayName.toLowerCase())
    );
    const mspPrice = mspRec ? mspRec.MSP : null;
    const isBelowMsp = mspPrice !== null && currentPrice > 0 && currentPrice < mspPrice;
    const deltaFromMsp = mspPrice !== null && currentPrice > 0 ? (currentPrice - mspPrice) : null;

    // --- 1. FARMER DECISION ---
    let recommendedAction: 'SELL_IMMEDIATELY' | 'HOLD_FOR_HIGHER_PRICE' | 'DIVERT_TO_NEARBY_MANDI' | 'EXPLORE_MSP_PROCUREMENT' = 'SELL_IMMEDIATELY';
    let actionSummary = '';
    const priceAdvantage = bestMarket && localMarket ? Math.max(0, (bestMarket.nrvPerQtl || bestMarket.modalPrice || 0) - (localMarket.nrvPerQtl || localMarket.modalPrice || 0)) : 0;

    if (isBelowMsp && commodity.mspNotified) {
      recommendedAction = 'EXPLORE_MSP_PROCUREMENT';
      actionSummary = `Market price (₹${currentPrice}/Qtl) is ₹${Math.abs(deltaFromMsp || 0)} below the official MSP of ₹${mspPrice}/Qtl. Consider registering with PACS / NAFED / FCI procurement center.`;
    } else if (priceAdvantage > 150 && bestMarket && localMarket && bestMarket.market !== localMarket.market) {
      recommendedAction = 'DIVERT_TO_NEARBY_MANDI';
      actionSummary = `Diverting to ${bestMarket.market} yields ₹${priceAdvantage}/Qtl higher net revenue after accounting for transport costs.`;
    } else if (priceTrend.priceTrend === 'RISING' && priceTrend.isSufficientObservations && commodity.perishability !== 'High') {
      recommendedAction = 'HOLD_FOR_HIGHER_PRICE';
      actionSummary = `Prices are trending upwards (+${priceTrend.priceChange7DayPercent}% in 7 days). For storable produce, short-term holding is viable.`;
    } else {
      recommendedAction = 'SELL_IMMEDIATELY';
      actionSummary = commodity.perishability === 'High' 
        ? `Perishable commodity: Immediate liquidation at ${bestMarket ? bestMarket.market : 'nearest mandi'} recommended to prevent quality loss.`
        : `Stable market conditions. Liquidate at ${bestMarket ? bestMarket.market : 'local APMC'} at prevailing rate ₹${currentPrice}/Qtl.`;
    }

    const farmerDecision = {
      recommendedAction,
      actionSummary,
      optimalMarket: bestMarket ? {
        marketName: bestMarket.market,
        district: bestMarket.district,
        distanceKm: bestMarket.distance,
        modalPrice: bestMarket.modalPrice,
        estimatedNrvPerQtl: bestMarket.nrvPerQtl || bestMarket.modalPrice,
        priceAdvantageVsLocal: priceAdvantage
      } : null,
      mspSafeguard: {
        mspPrice,
        isBelowMsp,
        deltaFromMsp
      },
      riskLevel: (isBelowMsp ? 'HIGH' : (priceTrend.priceTrend === 'FALLING' ? 'MEDIUM' : 'LOW')) as 'LOW' | 'MEDIUM' | 'HIGH'
    };

    // --- 2. FPO COLLECTIVE MARKETING DECISION ---
    const fpoDecision = {
      aggregationRecommendation: bestMarket 
        ? `Aggregate farmer lots in ${params.district || 'district'} to negotiate direct institutional sale or dispatch 100+ Qtl truckloads to ${bestMarket.market}.`
        : 'Form cluster-level collection centers.',
      collectiveVolumeThresholdQtl: 100,
      bulkTransportSavingsPerQtl: 22,
      targetDestinationMandi: bestMarket ? `${bestMarket.market} (${bestMarket.district})` : 'Primary Terminal Yard',
      workingCapitalRequirement: Math.round((params.expectedYieldQtl || 100) * (currentPrice || 2500) * 0.8)
    };

    // --- 3. B2B PROCUREMENT DECISION ---
    const b2bDecision = {
      sourcingRecommendation: bestMarket 
        ? `Primary sourcing cluster: ${bestMarket.district}. Competitive modal rate observed at ₹${bestMarket.modalPrice}/Qtl with active arrival liquidity.`
        : 'Direct APMC gateway procurement advised.',
      lowestLandedCostMarket: bestMarket ? bestMarket.market : 'Regional Terminal Yard',
      estimatedLandedCostPerQtl: bestMarket && bestMarket.modalPrice ? (bestMarket.modalPrice + 85) : (currentPrice + 90),
      supplyLiquidityScore: bestMarket && (bestMarket.arrivalQuantity || 0) > 300 ? 88 : 65,
      arbitrageSpreadPercent: priceAdvantage > 0 && currentPrice > 0 ? Math.round((priceAdvantage / currentPrice) * 1000) / 10 : 0
    };

    // --- 4. GOVERNMENT EARLY WARNING DECISION ---
    let priceWarningStatus: 'NORMAL' | 'PRICE_CRASH_ALERT' | 'INFLATION_ALERT' | 'MSP_DEFICIT_ZONE' = 'NORMAL';
    let procurementInterventionNeeded = false;
    let policyActionRecommendation = 'Market prices within normal seasonal trading band. Routine surveillance.';

    if (isBelowMsp) {
      priceWarningStatus = 'MSP_DEFICIT_ZONE';
      procurementInterventionNeeded = true;
      policyActionRecommendation = `Active price distress: Market trades below MSP of ₹${mspPrice}/Qtl. Notify NAFED/FCI procurement centers and open state Price Support Scheme (PSS) counters.`;
    } else if (priceTrend.priceTrend === 'FALLING' && (priceTrend.priceChange7DayPercent || 0) < -8) {
      priceWarningStatus = 'PRICE_CRASH_ALERT';
      procurementInterventionNeeded = true;
      policyActionRecommendation = `Sharp downward price velocity (-${Math.abs(priceTrend.priceChange7DayPercent || 0)}%). Monitor arrival gluts and prepare market intervention fund.`;
    } else if (priceTrend.priceTrend === 'RISING' && (priceTrend.priceChange7DayPercent || 0) > 15) {
      priceWarningStatus = 'INFLATION_ALERT';
      procurementInterventionNeeded = false;
      policyActionRecommendation = `Rapid price surge detected (+${priceTrend.priceChange7DayPercent}%). Assess stock availability, cold storage releases, and consumer price buffer.`;
    }

    const governmentDecision = {
      priceWarningStatus,
      procurementInterventionNeeded,
      arrivalTrendStatus: (nearbyResult.markets[0]?.arrivalQuantity || 0) > 1000 ? 'HEAVY_SUPPLY' as const : 'NORMAL_SUPPLY' as const,
      policyActionRecommendation
    };

    return {
      commodity,
      location,
      priceTrend,
      farmerDecision,
      fpoDecision,
      b2bDecision,
      governmentDecision
    };
  }
}

export const unifiedCommodityIntelligenceEngine = UnifiedCommodityIntelligenceEngine.getInstance();
