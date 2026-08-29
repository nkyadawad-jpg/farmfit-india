/**
 * FARMFIT ALL-INDIA OFFICIAL AGMARKNET PRICE & ARRIVAL PIPELINE
 * 
 * Complies with Directorate of Marketing & Inspection (DMI), Ministry of Agriculture & Farmers Welfare, GoI
 * Official Schema mapping:
 * - State/UT
 * - District
 * - Market
 * - Commodity Group
 * - Commodity
 * - Variety
 * - Grade
 * - Min Price
 * - Max Price
 * - Modal Price
 * - Price Unit
 * - Price Date
 * - Arrival Quantity & Unit
 */

export interface OfficialAgmarknetRecord {
  state: string;
  district: string;
  market: string;
  marketCode?: string;
  commodityGroup: string;
  commodity: string;
  variety: string;
  grade: string;
  minPrice: number | null;
  maxPrice: number | null;
  modalPrice: number | null;
  priceUnit: string;
  arrivalQuantity: number | null;
  arrivalUnit: string;
  priceDate: string; // ISO format: YYYY-MM-DD
  latitude?: number | null;
  longitude?: number | null;
  source: string;
  sourceUrl: string;
  retrievedAt: string;
}

export type MandiSourceStatus = 'OFFICIAL SOURCE CONNECTED' | 'OFFICIAL DATA TEMPORARILY UNAVAILABLE' | 'DEMO MODE ACTIVE';

export interface CommodityGroupSummary {
  groupName: string;
  commodities: {
    commodityName: string;
    varieties: string[];
    recordCount: number;
    latestPriceDate: string;
  }[];
}
