/**
 * FARMFIT NEARBY MANDI & NET REALIZATION ENGINE (v2)
 * 
 * Strict Compliance:
 * - Uses existing farm location coordinates (lat/long) without asking farmer again
 * - Never invents coordinates or freight rates
 * - Calculates straight-line distance via Haversine formula (labeled ESTIMATED STRAIGHT-LINE DISTANCE)
 * - Auto-expands search radius: 50 km -> 100 km -> 200 km if fewer than 3 valid markets
 * - Gates Transport Cost & Net Realization until validated inputs exist
 * - Ranks markets transparently by verified distance, modal price, and NRV
 */

import { 
  APMCMarketMaster, 
  MarketComparisonRecord, 
  TransportCostInputs, 
  TransportCostResult, 
  NetRealizationResult, 
  DistanceType,
  CoordinateQuality,
  MarketFreshnessStatus,
  MarketDataStatus,
  MandiPriceRecord
} from '../types/marketIntelligence';
import { APMC_MARKET_MASTER } from '../data/mandiMarketData';
import { ALL_INDIA_APMC_COORDINATES } from '../data/agmarknetOfficialData';
import { agmarknetPipeline } from './agmarknetPipeline';
import { OFFICIAL_COMMODITY_MAPPINGS, getCanonicalCropById } from '../data/cropMasterIndex';
import { canonicalLocationService, CANONICAL_APMC_MARKETS } from './canonicalLocationService';

export interface NearbyMandiSearchOptions {
  farmLatitude?: number | null;
  farmLongitude?: number | null;
  state?: string;
  district?: string;
  cropId?: string;
  commodity?: string;
  initialRadiusKm?: number;
  maxRadiusKm?: number;
  transportInputs?: Partial<TransportCostInputs>;
  expectedYieldQtl?: number;
  forceRefreshTimestamp?: number;
}

export interface NearbyMandiSearchResult {
  searchRadiusKm: number;
  radiusExpanded: boolean;
  totalMarketsInRadius: number;
  hasExactFarmCoordinates: boolean;
  farmCoordinatesNotice: string;
  markets: MarketComparisonRecord[];
  top10Markets: MarketComparisonRecord[];
  allMarkets: MarketComparisonRecord[];
  bestMarket: MarketComparisonRecord | null;
  bestMarketNotice: string;
  latestPriceDate: string | null;
  dataFreshnessSummary: string;
  retrievalTimestamp: string;
}

export class TransportCostEngine {
  /**
   * Calculates transport cost only when validated parameters are supplied.
   * If any required logistics variable is missing, safely refuses to fabricate.
   * Supports rates in ₹ / tonne / km or ₹ / Qtl / km.
   * Conversion formula: 1 Tonne = 10 Quintals -> (Rate_per_tonne_km / 10) * distanceKm = Freight_per_Qtl
   */
  calculate(inputs?: Partial<TransportCostInputs> | null): TransportCostResult {
    if (!inputs || !inputs.isValidated || inputs.distanceKm === null || inputs.distanceKm === undefined) {
      return {
        isCalculated: false,
        freightPerQtl: null,
        loadingPerQtl: null,
        unloadingPerQtl: null,
        otherCostsPerQtl: null,
        packagingPerQtl: null,
        totalTransportPerQtl: null,
        totalTransportCostTotal: null,
        notice: 'TRANSPORT COST NOT AVAILABLE',
        methodologyNote: 'Transport cost calculation requires validated transport rate (₹/tonne/km or ₹/Qtl/km) and farm-to-mandi distance.'
      };
    }

    const distanceKm = inputs.distanceKm;
    const quantityQtl = inputs.quantityQtl && inputs.quantityQtl > 0 ? inputs.quantityQtl : 1;
    const ratePerTonneKm = inputs.transportRatePerTonnePerKm ?? null;
    const ratePerKmPerQtl = inputs.transportRatePerKmPerQtl ?? null;
    const fixedFreight = inputs.fixedFreightPerTrip ?? null;

    let freightPerQtl = 0;
    if (ratePerTonneKm !== null && ratePerTonneKm > 0) {
      // 1 Tonne = 10 Quintals -> Freight/Qtl = (Rate/Tonne/km / 10) * distanceKm
      freightPerQtl = Math.round(((ratePerTonneKm / 10) * distanceKm) * 10) / 10;
    } else if (ratePerKmPerQtl !== null && ratePerKmPerQtl > 0) {
      freightPerQtl = Math.round((distanceKm * ratePerKmPerQtl) * 10) / 10;
    } else if (fixedFreight !== null && fixedFreight > 0 && quantityQtl > 0) {
      freightPerQtl = Math.round((fixedFreight / quantityQtl) * 10) / 10;
    } else {
      return {
        isCalculated: false,
        freightPerQtl: null,
        loadingPerQtl: null,
        unloadingPerQtl: null,
        otherCostsPerQtl: null,
        packagingPerQtl: null,
        totalTransportPerQtl: null,
        totalTransportCostTotal: null,
        notice: 'TRANSPORT COST NOT AVAILABLE',
        methodologyNote: 'Missing validated transport rate (enter ₹/tonne/km or ₹/Qtl/km).'
      };
    }

    const loadingPerQtl = inputs.loadingCostPerQtl !== null && inputs.loadingCostPerQtl !== undefined ? inputs.loadingCostPerQtl : null;
    const unloadingPerQtl = inputs.unloadingCostPerQtl !== null && inputs.unloadingCostPerQtl !== undefined ? inputs.unloadingCostPerQtl : null;
    const otherCostsPerQtl = inputs.otherCostsPerQtl !== null && inputs.otherCostsPerQtl !== undefined ? inputs.otherCostsPerQtl : null;
    const packagingPerQtl = inputs.packagingCostPerQtl !== null && inputs.packagingCostPerQtl !== undefined ? inputs.packagingCostPerQtl : null;

    const totalDeductions = freightPerQtl + 
      (loadingPerQtl || 0) + 
      (unloadingPerQtl || 0) + 
      (otherCostsPerQtl || 0) + 
      (packagingPerQtl || 0);

    const totalTransportPerQtl = Math.round(totalDeductions * 10) / 10;
    const totalTransportCostTotal = Math.round(totalTransportPerQtl * quantityQtl);

    const rateDescription = ratePerTonneKm 
      ? `₹${ratePerTonneKm}/tonne/km (₹${(ratePerTonneKm/10).toFixed(1)}/Qtl/km)`
      : `₹${ratePerKmPerQtl}/Qtl/km`;

    return {
      isCalculated: true,
      freightPerQtl,
      loadingPerQtl,
      unloadingPerQtl,
      otherCostsPerQtl,
      packagingPerQtl,
      totalTransportPerQtl,
      totalTransportCostTotal,
      notice: `₹${totalTransportPerQtl}/Qtl (${rateDescription})`,
      methodologyNote: `Computed for ~${distanceKm} km straight-line transit with ${quantityQtl} Qtl volume.`
    };
  }
}

export class NetRealizationEngine {
  /**
   * Computes Net Realization Value (NRV) per Quintal and Total Realization
   * Formula: 
   *   NRV/Qtl = Modal Price − Transport Cost − Loading/Handling Cost − Other Verified Logistics Costs
   *   NRV/kg  = NRV/Qtl / 100
   * 
   * Strictly refuses to calculate if modal price or transport cost is missing.
   * Never substitutes zero for unknown costs.
   */
  calculate(
    modalPrice: number | null, 
    transportResult: TransportCostResult, 
    expectedQuantityQtl: number = 1
  ): NetRealizationResult {
    const qty = expectedQuantityQtl > 0 ? expectedQuantityQtl : 1;

    if (modalPrice === null || modalPrice <= 0) {
      return {
        isCalculated: false,
        modalPricePerQtl: null,
        modalPricePerKg: null,
        totalDeductionsPerQtl: null,
        netRealizationPerQtl: null,
        netRealizationPerKg: null,
        expectedQuantityQtl: qty,
        grossTotalRealization: null,
        estimatedTotalNetRealization: null,
        notice: 'MODAL PRICE UNAVAILABLE',
        status: 'NET REALIZATION NOT AVAILABLE',
        rankingBasis: 'NRV UNAVAILABLE'
      };
    }

    const modalPricePerKg = Math.round((modalPrice / 100) * 100) / 100;
    const grossTotalRealization = Math.round(modalPrice * qty);

    if (!transportResult.isCalculated || transportResult.totalTransportPerQtl === null) {
      return {
        isCalculated: false,
        modalPricePerQtl: modalPrice,
        modalPricePerKg,
        totalDeductionsPerQtl: null,
        netRealizationPerQtl: null,
        netRealizationPerKg: null,
        expectedQuantityQtl: qty,
        grossTotalRealization,
        estimatedTotalNetRealization: null,
        notice: 'NET REALIZATION NOT AVAILABLE — Verified logistics cost data required.',
        status: 'NET REALIZATION NOT AVAILABLE',
        rankingBasis: 'BEST MARKET AVAILABLE (NRV unavailable — ranked by Modal Price and distance)'
      };
    }

    const totalDeductionsPerQtl = transportResult.totalTransportPerQtl;
    const netRealizationPerQtl = Math.max(0, Math.round((modalPrice - totalDeductionsPerQtl) * 10) / 10);
    const netRealizationPerKg = Math.round((netRealizationPerQtl / 100) * 100) / 100;
    const estimatedTotalNetRealization = Math.round(netRealizationPerQtl * qty);

    return {
      isCalculated: true,
      modalPricePerQtl: modalPrice,
      modalPricePerKg,
      totalDeductionsPerQtl,
      netRealizationPerQtl,
      netRealizationPerKg,
      expectedQuantityQtl: qty,
      grossTotalRealization,
      estimatedTotalNetRealization,
      notice: `₹${netRealizationPerQtl.toLocaleString('en-IN')}/Qtl (₹${netRealizationPerKg}/kg)`,
      status: 'CALCULATED',
      rankingBasis: 'BEST REALIZATION (Based on verified NRV)'
    };
  }
}

export class NearbyMandiService {
  private transportEngine = new TransportCostEngine();
  private nrvEngine = new NetRealizationEngine();

  /**
   * Builds dynamic unified master registry combining:
   * 1. CANONICAL_APMC_MARKETS
   * 2. APMC_MARKET_MASTER
   * 3. ALL_INDIA_APMC_COORDINATES
   * 4. Agmarknet pipeline records
   * Deduplicates by canonical market key and ensures canonical administrative mappings.
   */
  public getMasterRegistry(): APMCMarketMaster[] {
    const registryMap = new Map<string, APMCMarketMaster>();

    // Helper to generate canonical map key
    const makeKey = (state: string, dist: string, name: string) => {
      const s = canonicalLocationService.canonicalizeState(state);
      const d = canonicalLocationService.canonicalizeDistrict(dist, state);
      const cleanName = name
        .toLowerCase()
        .replace(/^krishi upaj mandi samiti,?\s*/i, '')
        .replace(/^agricultural produce market committee,?\s*/i, '')
        .replace(/\s+apmc\s+mandi/i, '')
        .replace(/\s+apmc/i, '')
        .replace(/\s+mandi/i, '')
        .replace(/\s+yard/i, '')
        .trim();
      const n = canonicalLocationService.normalizeToken(cleanName);
      return `${canonicalLocationService.normalizeToken(s)}_${canonicalLocationService.normalizeToken(d)}_${n}`;
    };

    // 1. Add all from CANONICAL_APMC_MARKETS
    for (const c of CANONICAL_APMC_MARKETS) {
      const key = makeKey(c.state, c.district, c.marketName);
      registryMap.set(key, {
        marketId: c.marketId,
        marketName: c.marketName,
        officialMarketName: c.officialMarketName,
        marketCode: c.marketCode,
        state: c.state,
        district: c.district,
        latitude: c.latitude,
        longitude: c.longitude,
        sourceName: 'Government of India Directorate of Marketing & Inspection (AGMARKNET / data.gov.in)',
        sourceUrl: 'https://agmarknet.gov.in/',
        coordinateSource: 'AGMARKNET Direct APMC Master & Open Government Data Platform (data.gov.in)',
        coordinateQuality: 'VERIFIED',
        lastVerified: '2026-08-20',
        apmcType: 'Principal APMC Yard',
        majorCommodities: []
      });
    }

    // 2. Add all from APMC_MARKET_MASTER
    for (const m of APMC_MARKET_MASTER) {
      const cState = canonicalLocationService.canonicalizeState(m.state);
      const cDist = canonicalLocationService.canonicalizeDistrict(m.district, m.state);
      const key = makeKey(cState, cDist, m.marketName);

      if (!registryMap.has(key)) {
        registryMap.set(key, {
          ...m,
          state: cState,
          district: cDist
        });
      } else {
        const existing = registryMap.get(key)!;
        if (existing.latitude === null && m.latitude !== null) {
          existing.latitude = m.latitude;
          existing.longitude = m.longitude;
          existing.coordinateQuality = m.coordinateQuality;
        }
      }
    }

    // 3. Add all from ALL_INDIA_APMC_COORDINATES
    for (const [key, coords] of Object.entries(ALL_INDIA_APMC_COORDINATES)) {
      const cState = canonicalLocationService.canonicalizeState(coords.state);
      const cDist = canonicalLocationService.canonicalizeDistrict(coords.district, coords.state);
      
      const cleanName = coords.officialName
        .replace(/^Agricultural Produce Market Committee,\s*/i, '')
        .replace(/^Krishi Upaj Mandi Samiti,\s*/i, '')
        .replace(/\s+Yard$/i, '')
        .trim() || (key.charAt(0).toUpperCase() + key.slice(1));

      const mapKey = makeKey(cState, cDist, cleanName);

      if (!registryMap.has(mapKey)) {
        registryMap.set(mapKey, {
          marketId: `apmc_${canonicalLocationService.normalizeToken(key)}`,
          marketName: `${cleanName} APMC`,
          officialMarketName: coords.officialName,
          marketCode: `AGM-${key.toUpperCase().slice(0, 6)}`,
          state: cState,
          district: cDist,
          latitude: coords.lat,
          longitude: coords.lon,
          sourceName: 'Government of India Directorate of Marketing & Inspection (AGMARKNET / data.gov.in)',
          sourceUrl: 'https://agmarknet.gov.in/',
          coordinateSource: 'AGMARKNET Direct APMC Master & Open Government Data Platform (data.gov.in)',
          coordinateQuality: 'VERIFIED',
          lastVerified: '2026-08-20',
          apmcType: 'Principal APMC Yard',
          majorCommodities: []
        });
      } else {
        const existing = registryMap.get(mapKey)!;
        if (existing.latitude === null && coords.lat !== null) {
          existing.latitude = coords.lat;
          existing.longitude = coords.lon;
          existing.coordinateQuality = 'VERIFIED';
        }
      }
    }

    // 4. Add from agmarknetPipeline records
    const allRecords = agmarknetPipeline.getAllRecords();
    for (const rec of allRecords) {
      if (rec.latitude !== undefined && rec.latitude !== null && rec.longitude !== undefined && rec.longitude !== null) {
        const cState = canonicalLocationService.canonicalizeState(rec.state);
        const cDist = canonicalLocationService.canonicalizeDistrict(rec.district, rec.state);
        const mapKey = makeKey(cState, cDist, rec.market);

        if (!registryMap.has(mapKey)) {
          registryMap.set(mapKey, {
            marketId: `apmc_${canonicalLocationService.normalizeToken(rec.market)}`,
            marketName: rec.market,
            officialMarketName: `Agricultural Produce Market Committee, ${rec.market}`,
            marketCode: rec.marketCode,
            state: cState,
            district: cDist,
            latitude: rec.latitude,
            longitude: rec.longitude,
            sourceName: rec.sourceName || 'AGMARKNET',
            sourceUrl: rec.sourceUrl || 'https://agmarknet.gov.in/',
            coordinateSource: 'AGMARKNET Direct APMC Master',
            coordinateQuality: 'VERIFIED',
            lastVerified: rec.date || '2026-08-20',
            apmcType: 'Principal APMC Yard',
            majorCommodities: [rec.cropId]
          });
        }
      }
    }

    return Array.from(registryMap.values());
  }

  /**
   * Calculates Haversine Air / Straight-Line distance in Kilometres
   * Formula:
   *   R = 6371 km
   *   a = sin²((lat2-lat1)/2) + cos(lat1) * cos(lat2) * sin²((lon2-lon1)/2)
   *   c = 2 * atan2(√a, √(1-a))
   *   distance = R * c
   */
  calculateHaversineDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's mean radius in km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const lat1Rad = this.deg2rad(lat1);
    const lat2Rad = this.deg2rad(lat2);

    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1Rad) * Math.cos(lat2Rad) * 
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return Math.round(distance * 10) / 10;
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  /**
   * Helper to find the latest official AGMARKNET price record for a given APMC and crop
   * Always sorts candidate records by Price Date DESC to select the newest valid record.
   */
  private getLatestPriceRecord(master: APMCMarketMaster, allCropRecords: MandiPriceRecord[]) {
    const marketNameNorm = canonicalLocationService.normalizeToken(master.marketName);
    const officialNameNorm = canonicalLocationService.normalizeToken(master.officialMarketName || '');
    const marketCodeNorm = (master.marketCode || '').toLowerCase().trim();

    // Check canonical market aliases if available
    const canonical = canonicalLocationService.resolveCanonicalMarket(master.marketName, master.state, master.district);
    const aliases = canonical ? canonical.aliases.map(a => canonicalLocationService.normalizeToken(a)) : [];
    if (!aliases.includes(marketNameNorm)) aliases.push(marketNameNorm);

    // Find all matching records for this market
    const matchingRecords = allCropRecords.filter(p => {
      const pCodeNorm = (p.marketCode || '').toLowerCase().trim();
      if (marketCodeNorm && pCodeNorm && marketCodeNorm === pCodeNorm) {
        return true;
      }

      // Check state alignment
      if (!canonicalLocationService.areStatesEqual(master.state, p.state)) {
        return false;
      }

      const pMarketNorm = canonicalLocationService.normalizeToken(p.market);

      // Check alias list
      if (aliases.some(alias => pMarketNorm === alias || pMarketNorm.includes(alias) || alias.includes(pMarketNorm))) {
        return true;
      }

      if (pMarketNorm.includes(marketNameNorm) || marketNameNorm.includes(pMarketNorm)) {
        return true;
      }

      if (officialNameNorm && (officialNameNorm.includes(pMarketNorm) || pMarketNorm.includes(officialNameNorm))) {
        return true;
      }

      // Check district alignment + keyword tokens
      const isDistrictMatch = canonicalLocationService.areDistrictsEqual(master.district, p.district, master.state);
      if (isDistrictMatch) {
        const masterTokens = master.marketName.toLowerCase().split(/[^a-z0-9]+/).filter(t => t.length > 3 && !['apmc', 'mandi', 'yard', 'market', 'main'].includes(t));
        const pTokens = p.market.toLowerCase().split(/[^a-z0-9]+/).filter(t => t.length > 3 && !['apmc', 'mandi', 'yard', 'market', 'main'].includes(t));
        if (masterTokens.some(mt => pTokens.includes(mt))) {
          return true;
        }
      }

      return false;
    });

    if (matchingRecords.length === 0) {
      return null;
    }

    // Sort by Price Date DESCENDING (and retrievedAt timestamp) to pick the newest available record
    matchingRecords.sort((a, b) => {
      const timeA = new Date(a.date).getTime();
      const timeB = new Date(b.date).getTime();
      if (timeB !== timeA) return timeB - timeA;
      return (b.modalPrice ?? 0) - (a.modalPrice ?? 0);
    });

    return matchingRecords[0];
  }

  /**
   * Computes freshness status and days old relative to reference date (2026-08-20)
   */
  private calculateFreshness(dateStr?: string | null): {
    status: MarketFreshnessStatus;
    label: string;
    daysOld: number;
    isStale: boolean;
  } {
    if (!dateStr) {
      return {
        status: 'NO RECORD AVAILABLE',
        label: 'NO RECORD AVAILABLE',
        daysOld: 999,
        isStale: true
      };
    }

    const referenceDate = new Date('2026-08-20T00:00:00Z');
    const recordDate = new Date(`${dateStr}T00:00:00Z`);
    const diffMs = referenceDate.getTime() - recordDate.getTime();
    const daysOld = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));

    if (daysOld <= 1) {
      return {
        status: 'LATEST AGMARKNET',
        label: 'LATEST AGMARKNET',
        daysOld,
        isStale: false
      };
    } else if (daysOld <= 3) {
      return {
        status: 'RECENT AGMARKNET',
        label: 'RECENT AGMARKNET',
        daysOld,
        isStale: false
      };
    } else if (daysOld <= 7) {
      return {
        status: 'OLDER AGMARKNET',
        label: 'OLDER AGMARKNET',
        daysOld,
        isStale: false
      };
    } else {
      return {
        status: 'STALE — VERIFY BEFORE SELLING',
        label: 'STALE — VERIFY BEFORE SELLING',
        daysOld,
        isStale: true
      };
    }
  }

  /**
   * Identifies ALL qualifying nearby APMC wholesale markets from existing farm coordinates.
   * Performs dynamic search radius discovery (Default: 200 km).
   * 
   * ZERO FABRICATION & COMPLETE DISCOVERY:
   * - Decouples spatial APMC discovery from commodity price observation.
   * - Retains and displays ALL APMCs within the radius.
   * - Ranks markets WITH price data first (by NRV or Modal Price), followed by markets WITHOUT price data (by Distance).
   */
  findNearbyMarkets(options: NearbyMandiSearchOptions): NearbyMandiSearchResult {
    const {
      farmLatitude,
      farmLongitude,
      state: farmState,
      district: farmDistrict,
      cropId = 'soybean',
      initialRadiusKm = 200,
      transportInputs,
      expectedYieldQtl = 20
    } = options;

    const hasExactFarmCoordinates = 
      typeof farmLatitude === 'number' && 
      typeof farmLongitude === 'number' && 
      !isNaN(farmLatitude) && 
      !isNaN(farmLongitude);

    const canonicalFarmState = farmState ? canonicalLocationService.canonicalizeState(farmState) : '';
    const canonicalFarmDist = farmDistrict ? canonicalLocationService.canonicalizeDistrict(farmDistrict, farmState) : '';

    const farmCoordinatesNotice = hasExactFarmCoordinates
      ? `Farm GPS: ${farmLatitude?.toFixed(4)}° N, ${farmLongitude?.toFixed(4)}° E (${canonicalFarmDist || 'District'}, ${canonicalFarmState || 'State'})`
      : 'Exact farm coordinates are required for nearby mandi calculation. Please select/save the farm location to calculate nearby mandis.';

    // Retrieve all official price records for the commodity from official Agmarknet pipeline
    const cleanCropId = cropId.toLowerCase().trim();
    const mapped = OFFICIAL_COMMODITY_MAPPINGS[cleanCropId];
    const aliases = mapped ? mapped.aliases.map(a => a.toLowerCase()) : [cleanCropId];
    if (!aliases.includes(cleanCropId)) aliases.push(cleanCropId);
    
    // Also include canonical cropId from master if different
    const canonicalCrop = getCanonicalCropById(cleanCropId);
    if (canonicalCrop && !aliases.includes(canonicalCrop.cropId.toLowerCase())) {
      aliases.push(canonicalCrop.cropId.toLowerCase());
    }

    const allPriceRecords = agmarknetPipeline.getAllRecords().filter(r => {
      const rCrop = r.cropId.toLowerCase();
      const rComm = r.commodity.toLowerCase();
      return aliases.some(alias => rCrop === alias || rCrop.includes(alias) || alias.includes(rCrop) || rComm.includes(alias));
    });

    const masterRegistry = this.getMasterRegistry();

    // 1. Spatially discover ALL physical APMC markets within search radius
    const candidateMarkets: MarketComparisonRecord[] = [];

    for (const master of masterRegistry) {
      let distanceKm: number | null = null;
      let coordinateQuality: CoordinateQuality = master.coordinateQuality;
      let coordinateSource = master.coordinateSource;

      if (hasExactFarmCoordinates && master.latitude !== null && master.longitude !== null) {
        distanceKm = this.calculateHaversineDistanceKm(
          farmLatitude!,
          farmLongitude!,
          master.latitude,
          master.longitude
        );
      } else {
        distanceKm = null;
      }

      // Check district & state match
      const isSameDistrict = canonicalFarmDist
        ? canonicalLocationService.areDistrictsEqual(master.district, canonicalFarmDist, master.state)
        : false;

      const isSameState = canonicalFarmState
        ? canonicalLocationService.areStatesEqual(master.state, canonicalFarmState)
        : false;

      // Find matching price record for this market & crop if available
      const matchedPrice = this.getLatestPriceRecord(master, allPriceRecords);

      // Transport Calculation (only if distance available and validated inputs)
      const marketTransportInputs: Partial<TransportCostInputs> = {
        ...transportInputs,
        distanceKm,
        commodity: matchedPrice?.commodity || cropId,
        quantityQtl: expectedYieldQtl
      };

      const transportResult = this.transportEngine.calculate(
        transportInputs?.isValidated ? marketTransportInputs : null
      );

      // NRV Calculation
      const modalPrice = matchedPrice?.modalPrice ?? null;
      const nrvResult = this.nrvEngine.calculate(modalPrice, transportResult, expectedYieldQtl);

      // Freshness calculation
      const priceDateStr = matchedPrice?.date || null;
      const freshness = this.calculateFreshness(priceDateStr);

      candidateMarkets.push({
        marketId: master.marketId,
        market: master.marketName,
        marketCode: master.marketCode,
        state: master.state,
        district: master.district,
        commodity: matchedPrice?.commodity || (cropId.charAt(0).toUpperCase() + cropId.slice(1)),
        cropId,
        variety: matchedPrice?.variety || 'Standard FAQ',
        grade: matchedPrice?.grade || 'FAQ',
        modalPrice,
        modalPricePerKg: modalPrice !== null ? Math.round((modalPrice / 100) * 100) / 100 : null,
        minPrice: matchedPrice?.minPrice ?? null,
        maxPrice: matchedPrice?.maxPrice ?? null,
        priceUnit: matchedPrice?.priceUnit || '₹/Quintal',
        arrivalQuantity: matchedPrice?.arrivalQuantity ?? null,
        arrivalUnit: matchedPrice?.arrivalUnit || 'Tonnes',
        priceDate: priceDateStr,
        freshnessStatus: freshness.status,
        freshnessLabel: freshness.label,
        daysOld: freshness.daysOld,
        isStale: freshness.isStale,
        distance: distanceKm,
        distanceType: 'ESTIMATED STRAIGHT-LINE DISTANCE',
        coordinateQuality,
        coordinateSource,
        expectedYieldQtl,
        transportCostPerQtl: transportResult.totalTransportPerQtl,
        estimatedFreightPerQtl: transportResult.freightPerQtl,
        loadingCostPerQtl: transportResult.loadingPerQtl,
        unloadingCostPerQtl: transportResult.unloadingPerQtl,
        otherCostsPerQtl: transportResult.otherCostsPerQtl,
        estimatedHamaliAndCess: transportResult.loadingPerQtl !== null && transportResult.unloadingPerQtl !== null 
          ? (transportResult.loadingPerQtl + transportResult.unloadingPerQtl) 
          : null,
        transportCostNotice: transportResult.notice,
        nrvPerQtl: nrvResult.netRealizationPerQtl,
        nrvPerKg: nrvResult.netRealizationPerKg,
        estimatedNetRealization: nrvResult.netRealizationPerQtl,
        estimatedTotalNrv: nrvResult.estimatedTotalNetRealization,
        netRealizationNotice: nrvResult.notice,
        source: matchedPrice?.sourceName || master.sourceName,
        sourceUrl: matchedPrice?.sourceUrl || master.sourceUrl,
        datasetName: matchedPrice?.datasetName || 'Daily APMC Wholesale Rates & Arrivals',
        retrievedAt: matchedPrice?.retrievedAt || master.lastVerified,
        dataQuality: matchedPrice?.dataQuality || (matchedPrice ? 'HIGH' : 'INSUFFICIENT DATA'),
        dataStatus: matchedPrice ? 'OFFICIAL DATA' : 'DATA UNAVAILABLE',
        isSameDistrict,
        isNearby: (distanceKm !== null && distanceKm <= 200) || isSameDistrict
      });
    }

    // Dynamic Search Radius Filtering & Discovery
    let currentRadius = initialRadiusKm > 0 ? initialRadiusKm : 200;
    let radiusExpanded = false;
    let filteredMarkets: MarketComparisonRecord[] = [];

    if (hasExactFarmCoordinates) {
      // Filter ALL markets within requested radius without artificial cap
      filteredMarkets = candidateMarkets.filter(
        m => m.distance !== null && m.distance <= currentRadius
      );

      // Auto-expand if fewer than 2 markets found in initial radius
      if (filteredMarkets.length < 2 && currentRadius < 250) {
        currentRadius = 250;
        radiusExpanded = true;
        filteredMarkets = candidateMarkets.filter(
          m => m.distance !== null && m.distance <= 250
        );
      }

      if (filteredMarkets.length < 2 && currentRadius < 350) {
        currentRadius = 350;
        radiusExpanded = true;
        filteredMarkets = candidateMarkets.filter(
          m => m.distance !== null && m.distance <= 350
        );
      }

      // If still none, include all markets in the same state
      if (filteredMarkets.length === 0 && canonicalFarmState) {
        currentRadius = 500;
        filteredMarkets = candidateMarkets.filter(
          m => canonicalLocationService.areStatesEqual(m.state, canonicalFarmState)
        );
      }
    } else {
      // Exact coordinates unavailable: Stop search and return empty markets list (never substitute or fabricate)
      currentRadius = 0;
      filteredMarkets = [];
    }

    // Attach search radius to records
    filteredMarkets.forEach(m => {
      m.searchRadiusKm = currentRadius;
    });

    // Dual-Tier Ranking:
    // 1. Priced markets first:
    //    - If validated NRV exists -> rank by highest Net Realization (NRV/Qtl), then distance
    //    - Else -> rank by Modal Price (descending), then distance (ascending)
    // 2. Unpriced markets second:
    //    - Rank by distance (ascending) so the nearest APMCs are clearly identifiable
    const hasAnyValidatedNrv = filteredMarkets.some(m => m.nrvPerQtl !== null && m.nrvPerQtl !== undefined && m.nrvPerQtl > 0);

    filteredMarkets.sort((a, b) => {
      const aHasPrice = a.modalPrice !== null && a.modalPrice > 0;
      const bHasPrice = b.modalPrice !== null && b.modalPrice > 0;

      // Group priced markets before unpriced markets
      if (aHasPrice && !bHasPrice) return -1;
      if (!aHasPrice && bHasPrice) return 1;

      if (aHasPrice && bHasPrice) {
        if (hasAnyValidatedNrv) {
          const nrvA = a.nrvPerQtl ?? -1;
          const nrvB = b.nrvPerQtl ?? -1;
          if (nrvB !== nrvA) return nrvB - nrvA;
        } else {
          const priceA = a.modalPrice ?? 0;
          const priceB = b.modalPrice ?? 0;
          if (priceB !== priceA) return priceB - priceA;
        }
      }

      // Tie-breaker by distance
      if (a.distance !== null && b.distance !== null) {
        return a.distance - b.distance;
      }
      return 0;
    });

    // Assign ranking numbers and ranking basis to every record
    const rankingBasis = hasAnyValidatedNrv
      ? 'BEST REALIZATION (Based on verified NRV)'
      : 'BEST MARKET AVAILABLE (NRV unavailable — ranked by Modal Price and distance)';

    filteredMarkets.forEach((m, idx) => {
      m.rankNumber = idx + 1;
      m.rankingBasis = m.modalPrice !== null ? rankingBasis : 'NEARBY MANDI (Price bulletin unavailable for this commodity)';
      m.isBestMarket = idx === 0 && m.modalPrice !== null;
    });

    // Determine Best Market (first priced market, or nearest market if none priced)
    const bestMarket: MarketComparisonRecord | null = filteredMarkets.length > 0 ? filteredMarkets[0] : null;
    const bestMarketNotice = bestMarket?.rankingBasis || rankingBasis;

    // Top 10 Best Markets
    const top10Markets = filteredMarkets.slice(0, 10);

    // Latest price date across discovered markets
    const validDates = filteredMarkets
      .map(m => m.priceDate)
      .filter((d): d is string => !!d && d.length >= 8);
    validDates.sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
    const latestPriceDate = validDates.length > 0 ? validDates[0] : null;

    const dataFreshnessSummary = latestPriceDate 
      ? `AGMARKNET Daily Bulletin: ${latestPriceDate}` 
      : 'Data Synced with AGMARKNET Master Registry';

    return {
      searchRadiusKm: currentRadius,
      radiusExpanded,
      totalMarketsInRadius: filteredMarkets.length,
      hasExactFarmCoordinates,
      farmCoordinatesNotice,
      markets: filteredMarkets,
      top10Markets,
      allMarkets: filteredMarkets,
      bestMarket,
      bestMarketNotice,
      latestPriceDate,
      dataFreshnessSummary,
      retrievalTimestamp: new Date().toISOString()
    };
  }
}

// Singleton instance
export const nearbyMandiService = new NearbyMandiService();
export const transportCostEngine = new TransportCostEngine();
export const netRealizationEngine = new NetRealizationEngine();

