import { OFFICIAL_AGMARKNET_DAILY_BULLETINS, AgmarknetRawBulletinRecord } from '../data/agmarknetOfficialData';
import { ALL_CANONICAL_COMMODITIES } from '../data/canonicalCommodityUniverse';
import { PriceTrendDirection } from '../types/marketIntelligence';

export class FarmfitIntelligenceCore {
  private static instance: FarmfitIntelligenceCore;

  private constructor() {}

  public static getInstance(): FarmfitIntelligenceCore {
    if (!FarmfitIntelligenceCore.instance) {
      FarmfitIntelligenceCore.instance = new FarmfitIntelligenceCore();
    }
    return FarmfitIntelligenceCore.instance;
  }

  // --- MARKET TREND ENGINE ---
  public getCommodityMarketTrend(cropId: string, state?: string, district?: string) {
    let bulletins = OFFICIAL_AGMARKNET_DAILY_BULLETINS.filter(b => b.cropId === cropId);
    
    if (state) bulletins = bulletins.filter(b => b.state === state);
    if (district) bulletins = bulletins.filter(b => b.district === district);

    if (bulletins.length === 0) {
      return { trend: 'STABLE' as PriceTrendDirection, percentChange: 0, latestPrice: 0 };
    }

    // Sort by date descending
    bulletins.sort((a, b) => new Date(b.priceDate).getTime() - new Date(a.priceDate).getTime());
    
    const latestPrice = bulletins[0].modalPrice || 0;
    
    // In a real scenario with time-series, we'd compare to 7 or 30 days ago.
    // For AGMARKNET dummy/daily feed, we'll simulate a stable calculation.
    let historicalPrice = latestPrice;
    if (bulletins.length > 5) {
        historicalPrice = bulletins[5].modalPrice || latestPrice;
    }

    const percentChange = historicalPrice > 0 ? ((latestPrice - historicalPrice) / historicalPrice) * 100 : 0;
    
    let trend: PriceTrendDirection = 'STABLE';
    if (percentChange > 2) trend = 'RISING';
    if (percentChange < -2) trend = 'FALLING';

    return {
      trend,
      percentChange,
      latestPrice
    };
  }

  // --- LOGISTICS & NRV ENGINE ---
  public calculateNetRealizableValue(modalPrice: number, distanceKm: number, volumeQuintals: number = 10) {
    // Standard transport cost: ₹2.5 per Quintal per KM
    const TRANSPORT_COST_PER_Q_KM = 2.5;
    const transportCostPerQuintal = distanceKm * TRANSPORT_COST_PER_Q_KM;
    const nrv = modalPrice - transportCostPerQuintal;

    return {
      modalPrice,
      distanceKm,
      transportCostPerQuintal,
      totalTransportCost: transportCostPerQuintal * volumeQuintals,
      netRealizableValue: nrv > 0 ? nrv : 0
    };
  }

  // --- RISK ENGINE ---
  public assessCommodityRisk(cropId: string, state?: string, district?: string) {
    const trendData = this.getCommodityMarketTrend(cropId, state, district);
    
    let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'LOW';
    let riskScore = 20;

    if (trendData.trend === 'FALLING' && trendData.percentChange < -10) {
      riskLevel = 'HIGH';
      riskScore = 80;
    } else if (trendData.trend === 'FALLING') {
      riskLevel = 'MEDIUM';
      riskScore = 50;
    } else if (trendData.trend === 'RISING' && trendData.percentChange > 20) {
      // High price volatility is also a risk for procurement
      riskLevel = 'MEDIUM';
      riskScore = 60;
    }

    return {
      riskLevel,
      riskScore,
      primaryDriver: trendData.trend === 'FALLING' ? 'Price Depression' : 'Price Volatility'
    };
  }
}

export const farmfitIntelligenceCore = FarmfitIntelligenceCore.getInstance();
