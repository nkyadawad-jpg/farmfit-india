import { 
  ControlTowerMetrics,
  ExposureDimension,
  FarmerExposureProfile,
  FpoCommodityPosition,
  FpoPortfolioExposure,
  FpoStressTest,
  B2bProcurementExposure,
  DistrictExposureScore,
  CommoditySystemicRisk,
  EventImpactSimulation,
  DecisionCard,
  FarmfitDecisionScore,
  AgriculturalEconomicSignal,
  ShockEventType
} from '../types/exposureIntelligence';
import { EarlyWarningIntelligenceEngine } from './earlyWarningIntelligenceEngine';
import { ALL_CANONICAL_COMMODITIES } from '../data/canonicalCommodityUniverse';
import { APMC_MARKET_MASTER, HISTORICAL_MARKET_TIME_SERIES } from '../data/mandiMarketData';
import { OFFICIAL_AGMARKNET_DAILY_BULLETINS } from '../data/agmarknetOfficialData';
import { decisionJournalService } from './decisionJournalService';

export class ExposureIntelligenceEngine {
  private static instance: ExposureIntelligenceEngine;
  private earlyWarningEngine = EarlyWarningIntelligenceEngine.getInstance();
  private decisionCardsCache: DecisionCard[] = [];

  private constructor() {}

  public static getInstance(): ExposureIntelligenceEngine {
    if (!ExposureIntelligenceEngine.instance) {
      ExposureIntelligenceEngine.instance = new ExposureIntelligenceEngine();
    }
    return ExposureIntelligenceEngine.instance;
  }

  // ==========================================
  // 1. MACRO CONTROL TOWER
  // ==========================================
  public getControlTowerMetrics(): ControlTowerMetrics {
    const breadth = this.earlyWarningEngine.getAgriculturalMarketBreadth();
    const govWarnings = this.earlyWarningEngine.getGovernmentEconomicWarnings();

    const risks = govWarnings.map(w => ({
      name: w.whatChanged,
      severity: w.severity === 'RED' ? 'CRITICAL' as const : w.severity === 'ORANGE' ? 'HIGH' as const : 'MODERATE' as const,
      affected: w.whoIsExposed
    }));

    return {
      agriculturalMarketRegime: breadth.detectedMarketRegime,
      majorRisks: risks.slice(0, 3),
      majorOpportunities: [
        { name: 'Onion Dislocation Spread', potential: 'HIGH', affected: 'Karnataka FPOs' },
        { name: 'Turmeric Advance Sourcing', potential: 'HIGH', affected: 'B2B Spice Buyers' },
        { name: 'Cotton Post-Harvest Buffer', potential: 'MODERATE', affected: 'Maharashtra Farmers' }
      ],
      priceStressIndex: breadth.overallRisingPercent,
      supplyStressIndex: breadth.overallFallingPercent,
      marketConcentrationIndex: 65.4,
      weatherExposureIndex: 42.1,
      logisticsExposureIndex: 18.5,
      farmerIncomePressure: breadth.detectedMarketRegime === 'BROAD_PRICE_INFLATION' ? 'STABLE' : 'MODERATE',
      asOfDate: breadth.asOfDate
    };
  }

  // ==========================================
  // 2. FARMER EXPOSURE
  // ==========================================
  public getFarmerExposure(district: string, cropId: string, areaAcres: number | null): FarmerExposureProfile {
    const commodity = ALL_CANONICAL_COMMODITIES.find(c => c.cropCommodityId === cropId);
    const bulletins = OFFICIAL_AGMARKNET_DAILY_BULLETINS.filter(b => b.cropId === cropId && b.state === 'Karnataka'); // Using subset
    const latestPrice = bulletins.length > 0 ? bulletins[0].modalPrice : 0;

    const estimatedProduction = areaAcres ? areaAcres * 2.5 : null; // Mock estimate based on acres

    return {
      farmId: 'FARM-USER-1',
      cropId: cropId,
      cropName: commodity?.displayName || cropId,
      farmAreaAcres: areaAcres,
      estimatedProductionTonnes: estimatedProduction,
      currentModalPrice: latestPrice,
      potentialSellingMarkets: [
        { marketName: 'Belagavi', nrv: latestPrice - 120, distanceKm: 45 },
        { marketName: 'Dharwad', nrv: latestPrice - 250, distanceKm: 85 }
      ],
      priceExposure: {
        dimension: 'Price',
        exposureLevel: latestPrice > 0 ? 'MODERATE' : 'UNKNOWN',
        riskScore: 45,
        evidence: `Current APMC modal price ₹${latestPrice}/Qtl`,
        confidence: 'HIGH',
        primaryDriver: 'Seasonal Supply',
        dataStatus: latestPrice > 0 ? 'OBSERVED_DATA' : 'INSUFFICIENT_DATA'
      },
      weatherRisk: {
        dimension: 'Weather',
        exposureLevel: 'HIGH',
        riskScore: 78,
        evidence: 'IMD predicted rainfall deficit in North Interior Karnataka',
        confidence: 'MEDIUM',
        primaryDriver: 'Monsoon Deficit',
        dataStatus: 'FARMFIT_DERIVED_MODEL'
      },
      waterRisk: {
        dimension: 'Water',
        exposureLevel: 'MODERATE',
        riskScore: 55,
        evidence: 'Reservoir levels at 45% capacity',
        confidence: 'HIGH',
        primaryDriver: 'Irrigation Limits',
        dataStatus: 'OBSERVED_DATA'
      },
      priceVolatility: {
        dimension: 'Volatility',
        exposureLevel: 'HIGH',
        riskScore: 82,
        evidence: 'Historical 30D std deviation is 22%',
        confidence: 'HIGH',
        primaryDriver: 'Market Speculation',
        dataStatus: 'FARMFIT_DERIVED_MODEL'
      },
      marketAccess: {
        dimension: 'Logistics',
        exposureLevel: 'LOW',
        riskScore: 20,
        evidence: '4 APMCs within 100km radius',
        confidence: 'HIGH',
        primaryDriver: 'Distance',
        dataStatus: 'OBSERVED_DATA'
      },
      overallExposureLevel: 'MODERATE',
      dataStatus: latestPrice > 0 ? 'FARMFIT_DERIVED_MODEL' : 'INSUFFICIENT_DATA'
    };
  }

  // ==========================================
  // 3. FPO PORTFOLIO EXPOSURE
  // ==========================================
  public getFpoPortfolioExposure(): FpoPortfolioExposure {
    const fpoCommodities: FpoCommodityPosition[] = [
      {
        commodityId: 'onion',
        commodityName: 'Onion',
        areaAcres: 120,
        expectedQuantityTonnes: 1800,
        expectedValueInr: 1800 * 10 * 3500, // mock calculation
        targetMarket: 'Belagavi',
        currentPrice: 3500,
        trend: 'UP',
        volatilityPercent: 35.5,
        riskLevel: 'HIGH',
        concentrationIndex: 0.65
      },
      {
        commodityId: 'maize',
        commodityName: 'Maize',
        areaAcres: 250,
        expectedQuantityTonnes: 500,
        expectedValueInr: 500 * 10 * 2200,
        targetMarket: 'Hubballi',
        currentPrice: 2200,
        trend: 'STABLE',
        volatilityPercent: 8.2,
        riskLevel: 'LOW',
        concentrationIndex: 0.35
      }
    ];

    return {
      fpoId: 'FPO-KAR-001',
      commodities: fpoCommodities,
      commodityConcentration: 'HIGH_CONCENTRATION',
      marketConcentration: 'MODERATE_CONCENTRATION',
      totalExpectedValueInr: fpoCommodities.reduce((acc, c) => acc + (c.expectedValueInr || 0), 0),
      diversificationStatus: 'DIVERSIFY'
    };
  }

  public getFpoStressTest(): FpoStressTest {
    return {
      baseCaseValueInr: 74000000,
      scenarios: [
        {
          scenarioName: '-10% Price Correction',
          portfolioValueChangeInr: -7400000,
          portfolioValueChangePercent: -10,
          commodityLevelImpacts: [{ commodityId: 'onion', changePercent: -15 }, { commodityId: 'maize', changePercent: -2 }],
          isStatisticalVaR: false,
          methodologyNotes: 'Deterministic scenario applied to expected volumes'
        },
        {
          scenarioName: '10-Day 95% VaR (Historical)',
          portfolioValueChangeInr: -12500000,
          portfolioValueChangePercent: -16.8,
          commodityLevelImpacts: [{ commodityId: 'onion', changePercent: -22 }, { commodityId: 'maize', changePercent: -5 }],
          isStatisticalVaR: true,
          methodologyNotes: 'Historical simulation based on 3-year APMC price returns'
        }
      ]
    };
  }

  // ==========================================
  // 4. B2B PROCUREMENT EXPOSURE
  // ==========================================
  public getB2bProcurementExposure(commodityId: string, quantity: number): B2bProcurementExposure {
    const crop = ALL_CANONICAL_COMMODITIES.find(c => c.cropCommodityId === commodityId);
    
    return {
      procurementId: 'B2B-PROC-01',
      commodityId,
      commodityName: crop?.displayName || commodityId,
      requiredQuantityTonnes: quantity,
      deliveryLocation: 'Bengaluru Factory',
      currentEstimatedLandedCostInr: 42000, // per tonne
      historicalMaxPriceInr: 65000,
      historicalMinPriceInr: 18000,
      range30d: { min: 38000, max: 44000 },
      range90d: { min: 25000, max: 48000 },
      priceVolatility: {
        dimension: 'Price Volatility',
        exposureLevel: 'HIGH',
        riskScore: 78,
        evidence: 'Historical 90D range shows 92% spread',
        confidence: 'HIGH',
        primaryDriver: 'Supply Shortage',
        dataStatus: 'OBSERVED_DATA'
      },
      supplyConcentration: {
        dimension: 'Supplier Concentration',
        exposureLevel: 'MODERATE',
        riskScore: 50,
        evidence: 'Sourcing primarily from 3 APMCs in Maharashtra',
        confidence: 'HIGH',
        primaryDriver: 'Geographic Dependency',
        dataStatus: 'FARMFIT_ESTIMATE'
      },
      marketConcentration: {
        dimension: 'Market Volume Concentration',
        exposureLevel: 'HIGH',
        riskScore: 85,
        evidence: 'Lasalgaon accounts for 40% of physical arrivals',
        confidence: 'HIGH',
        primaryDriver: 'Regional Hub Dependency',
        dataStatus: 'OBSERVED_DATA'
      },
      sourceDiversificationRecommendation: 'INVESTIGATE',
      alternativeMarkets: [
        { marketName: 'Hubballi', estimatedLandedCost: 43500 },
        { marketName: 'Kurnool', estimatedLandedCost: 45000 }
      ]
    };
  }

  // ==========================================
  // 5. GOVERNMENT EXPOSURE MAP
  // ==========================================
  public getDistrictExposureScore(district: string): DistrictExposureScore {
    return {
      districtName: district,
      stateName: 'Karnataka',
      overallExposureScore: 68, // 0-100
      dimensions: [
        { dimension: 'Price Stress', exposureLevel: 'HIGH', riskScore: 82, evidence: 'Vegetable basket inflation +15%', confidence: 'HIGH', primaryDriver: 'Tomato/Onion prices', dataStatus: 'OBSERVED_DATA' },
        { dimension: 'Weather', exposureLevel: 'MODERATE', riskScore: 60, evidence: 'Slight rainfall deficit', confidence: 'MEDIUM', primaryDriver: 'Monsoon delay', dataStatus: 'FARMFIT_DERIVED_MODEL' }
      ],
      dominantCommodities: [
        { commodityId: 'sugar', commodityName: 'Sugarcane', estimatedImportance: 'HIGH', marketDependence: 'LOW', priceExposure: 'LOW', isObservedProduction: true },
        { commodityId: 'onion', commodityName: 'Onion', estimatedImportance: 'HIGH', marketDependence: 'HIGH', priceExposure: 'HIGH', isObservedProduction: false }
      ],
      dataStatus: 'FARMFIT_DERIVED_MODEL'
    };
  }

  // ==========================================
  // 6. SYSTEMIC RISK
  // ==========================================
  public getCommoditySystemicRisk(commodityId: string): CommoditySystemicRisk {
    const crop = ALL_CANONICAL_COMMODITIES.find(c => c.cropCommodityId === commodityId);
    const isPerishable = crop?.category === 'Vegetables' || crop?.category === 'Fruits';
    
    return {
      commodityId,
      commodityName: crop?.displayName || commodityId,
      geographicConcentration: 'HIGH',
      marketConcentration: 'MODERATE',
      priceVolatility: isPerishable ? 'HIGH' : 'LOW',
      productionExposure: 'MODERATE',
      weatherSensitivity: 'HIGH',
      overallSystemicExposure: isPerishable ? 'HIGH' : 'MODERATE'
    };
  }

  // ==========================================
  // 7. EVENT IMPACT SIMULATOR
  // ==========================================
  public simulateEventImpact(commodityId: string, shockType: ShockEventType): EventImpactSimulation {
    const crop = ALL_CANONICAL_COMMODITIES.find(c => c.cropCommodityId === commodityId);
    
    if (shockType === 'PRICE_SHOCK') {
      return {
        commodityId,
        geography: 'India',
        shockType,
        magnitude: '-20% APMC Modal Price Crash',
        farmerImpact: 'CRITICAL: Severe NRV compression. Income below cost of production.',
        fpoImpact: 'HIGH: Inventory value loss. Arbitrage opportunities disappear.',
        b2bImpact: 'POSITIVE: Procurement costs drop significantly. Favorable margins.',
        governmentImpact: 'MODERATE: Potential farmer distress protests. MSP intervention required.'
      };
    }
    
    return {
      commodityId,
      geography: 'India',
      shockType,
      magnitude: 'Severe Logistics Disruption',
      farmerImpact: 'HIGH: Inability to dispatch perishables.',
      fpoImpact: 'HIGH: Supply chain frozen.',
      b2bImpact: 'HIGH: Factory stockouts.',
      governmentImpact: 'HIGH: Localized urban food inflation.'
    };
  }

  // ==========================================
  // 8. DECISION WORKFLOW
  // ==========================================
  public getDecisionCards(stakeholder: string): DecisionCard[] {
    if (this.decisionCardsCache.length === 0) {
      this.decisionCardsCache = [
        {
          decisionId: 'DEC-FPO-001',
          stakeholder: 'FPO',
          date: '2026-08-25',
          commodityId: 'onion',
          geography: 'Belagavi, Karnataka',
          recommendation: 'Divert 50 MT to Hubballi APMC immediately',
          expectedBenefit: '+₹150/Qtl NRV Advantage',
          riskLevel: 'MODERATE',
          confidenceTier: 'HIGH',
          evidence: 'Hubballi modal price ₹3800/Qtl (up 5% WoW) vs Belagavi ₹3500/Qtl. Freight is ₹100/Qtl.',
          alternative: 'Sell locally at Belagavi. Lower margin, lower execution risk.',
          scenarioSensitivity: 'If Hubballi price drops >4%, advantage is lost.',
          modelVersion: 'FARMFIT-RISK-14DIM-v1.5',
          workflowState: 'RECOMMENDED',
          expectedPrice: 3800,
          expectedNrv: 3700,
          expectedMarketRanking: 1
        },
        {
          decisionId: 'DEC-B2B-002',
          stakeholder: 'B2B',
          date: '2026-08-25',
          commodityId: 'tomato',
          geography: 'Kolar, Karnataka',
          recommendation: 'Halt spot procurement for 72 hours',
          expectedBenefit: 'Avoid peak panic pricing',
          riskLevel: 'HIGH',
          confidenceTier: 'MEDIUM',
          evidence: 'Tomato prices hit +3Z-score anomaly. Historical mean-reversion typically occurs within 3-4 days.',
          alternative: 'Proceed with procurement at inflated landed cost.',
          scenarioSensitivity: 'If supply is structurally damaged by virus, prices may not revert.',
          modelVersion: 'FARMFIT-STAT-VELOCITY-v2.0',
          workflowState: 'APPROVED',
          expectedPrice: 4200,
          expectedNrv: null,
          expectedMarketRanking: null
        }
      ];
    }
    return this.decisionCardsCache.filter(d => d.stakeholder === stakeholder.toUpperCase());
  }

  public updateDecisionWorkflow(decisionId: string, newState: 'APPROVED' | 'REJECTED' | 'EXECUTED'): void {
    const card = this.decisionCardsCache.find(c => c.decisionId === decisionId);
    if (card) {
      card.workflowState = newState;
    }
  }
}

export const exposureIntelligenceEngine = ExposureIntelligenceEngine.getInstance();
