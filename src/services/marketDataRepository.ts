/**
 * FARMFIT MANDI MARKET INTELLIGENCE — DATA REPOSITORY & PROVIDER (v1)
 * 
 * Clean separation of data retrieval, spatial distance math, and caching.
 * Ready for future live API integration without modifying UI components.
 */

import { 
  MandiPriceRecord, 
  MarketTimeSeriesPoint, 
  MSPRecord, 
  MarketDataSourceRegistryItem, 
  MandiFilterParams 
} from '../types/marketIntelligence';
import { 
  APMC_MANDI_DIRECTORY, 
  HISTORICAL_MARKET_TIME_SERIES, 
  OFFICIAL_CACP_MSP_RECORDS, 
  MARKET_DATA_SOURCE_REGISTRY,
  MandiDirectoryEntry 
} from '../data/mandiMarketData';
import { agmarknetPipeline } from './agmarknetPipeline';

export interface MarketDataProvider {
  getMandiPriceRecords(params?: MandiFilterParams): MandiPriceRecord[];
  getMarketTimeSeries(cropId: string, marketName?: string, locationParams?: MandiFilterParams): MarketTimeSeriesPoint[];
  getMandiDirectory(): MandiDirectoryEntry[];
  getMspRecord(cropId: string): MSPRecord | null;
  getAllMspRecords(): MSPRecord[];
  getDataSourceRegistry(): MarketDataSourceRegistryItem[];
}

export class MarketDataRepository implements MarketDataProvider {
  private cache: Map<string, any> = new Map();

  /**
   * Retrieves Mandi price records with strict multi-factor filtering:
   * 1. Crop/commodity filter
   * 2. District filter (when specified)
   * 3. State filter (when specified)
   * 4. Coordinate radius filter (when coordinates & radius are specified)
   * 5. Market name filter
   * 
   * Returns [] (empty array) if no records match. Never returns an arbitrary fallback.
   */
  getMandiPriceRecords(params?: MandiFilterParams): MandiPriceRecord[] {
    return agmarknetPipeline.queryOfficialRecords(params);
  }

  /**
   * Retrieves historical observation time series for moving average and trend calculations
   * Strictly filtered by crop and market / state / district when provided.
   */
  getMarketTimeSeries(cropId: string, marketName?: string, locationParams?: MandiFilterParams): MarketTimeSeriesPoint[] {
    let series = HISTORICAL_MARKET_TIME_SERIES.filter(
      p => p.cropId.toLowerCase() === cropId.toLowerCase()
    );

    if (marketName && marketName !== 'All') {
      series = series.filter(
        p => p.market.toLowerCase().includes(marketName.toLowerCase())
      );
    } else if (locationParams?.district && locationParams.district !== 'All') {
      const filteredByDistrict = series.filter(
        p => p.district.toLowerCase() === locationParams.district!.toLowerCase()
      );
      if (filteredByDistrict.length > 0) {
        series = filteredByDistrict;
      }
    } else if (locationParams?.state && locationParams.state !== 'All') {
      const filteredByState = series.filter(
        p => p.state.toLowerCase() === locationParams.state!.toLowerCase()
      );
      if (filteredByState.length > 0) {
        series = filteredByState;
      }
    }

    // Sort chronologically ascending
    return series.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  /**
   * Retrieves full directory of APMC wholesale market yards
   */
  getMandiDirectory(): MandiDirectoryEntry[] {
    return APMC_MANDI_DIRECTORY;
  }

  /**
   * Retrieves official CACP MSP record for a crop
   */
  getMspRecord(cropId: string): MSPRecord | null {
    const normalizedCropId = cropId.toLowerCase();
    const record = OFFICIAL_CACP_MSP_RECORDS.find(
      r => r.cropId.toLowerCase() === normalizedCropId || 
           r.crop.toLowerCase().includes(normalizedCropId) ||
           r.commodity.toLowerCase().includes(normalizedCropId)
    );
    return record || null;
  }

  /**
   * Retrieves all notified CACP MSP records
   */
  getAllMspRecords(): MSPRecord[] {
    return OFFICIAL_CACP_MSP_RECORDS;
  }

  /**
   * Retrieves official statutory data source registry
   */
  getDataSourceRegistry(): MarketDataSourceRegistryItem[] {
    return MARKET_DATA_SOURCE_REGISTRY;
  }

  /**
   * Calculates Haversine Air/Straight-Line distance between two GPS coordinates in Kilometres
   * Note: Explicitly labeled AIR/STRAIGHT-LINE DISTANCE as required
   */
  calculateAirDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's mean radius in km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;
    return Math.round(d * 10) / 10;
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }
}

// Singleton repository instance
export const marketDataRepository = new MarketDataRepository();
