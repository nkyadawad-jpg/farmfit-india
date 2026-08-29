/**
 * FARMFIT AGRICULTURAL ECONOMIC INDEX & MACRO INDICATORS
 * Comprehensive economic health index tracking farm gate margins, supply shocks, and food inflation.
 */

export interface EconomicIndicatorDimension {
  dimensionName: string;
  score: number; // 0 to 100
  weight: number; // 0 to 1.0
  trendDirection: 'EXPANDING' | 'STABLE' | 'CONTRACTING' | 'HIGH_VOLATILITY';
  keyObservation: string;
  sourceAuthority: string;
}

export interface FarmfitEconomicIndex {
  periodMonthYear: string;
  compositeIndexScore: number; // 0 - 100
  overallEconomicState: 'ROBUST_EXPANSION' | 'MODERATE_STABILITY' | 'MILD_STRESS' | 'ACUTE_FARM_DISTRESS';
  dimensions: {
    cropProductionIndex: EconomicIndicatorDimension;
    marketPriceRealizationIndex: EconomicIndicatorDimension;
    foodInflationPressureIndex: EconomicIndicatorDimension;
    inputCostInflationIndex: EconomicIndicatorDimension;
    supplyBalanceIndex: EconomicIndicatorDimension;
    demandStrengthIndex: EconomicIndicatorDimension;
    tradeBalanceIndex: EconomicIndicatorDimension;
    weatherShockIndex: EconomicIndicatorDimension;
    logisticsFrictionIndex: EconomicIndicatorDimension;
    farmerIncomeExposureIndex: EconomicIndicatorDimension;
  };
  keyNationalTakeaway: string;
  calculatedOn: string;
}
