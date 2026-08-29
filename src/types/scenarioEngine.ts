import { ConfidenceMetrics } from './confidenceFramework';

/**
 * FARMFIT SCENARIO ENGINE & WHAT-IF ANALYSIS MODEL
 * Simulates micro & macro exogenous shocks propagating through agricultural supply chains.
 */

export type ScenarioShockType =
  | 'Rainfall Deficit (-20%)'
  | 'Rainfall Excess (+20%)'
  | 'Market Price Collapse (-15%)'
  | 'Market Price Surge (+15%)'
  | 'Diesel Logistics Inflation (+20%)'
  | 'Fertilizer & Chemical Inflation (+20%)'
  | 'Export Ban / Quantitative Restriction'
  | 'Import Tariff Cut / Influx'
  | 'Regional Production Shortfall'
  | 'Consumer Demand Spike';

export interface ExogenousShockInput {
  shockType?: ScenarioShockType;
  description?: string;
  rainfallDeviationPercent?: number;
  monsoonRainfallDeviationPercent?: number;
  modalPriceDeviationPercent?: number;
  dieselRateDeviationPercent?: number;
  fuelDieselPriceHikePercent?: number;
  fertilizerCostDeviationPercent?: number;
  tradePolicyShift?: 'RESTRICTIVE_EXPORT' | 'LIBERAL_IMPORT' | 'TARIFF_HIKE' | 'NONE';
  exportDutyOrTariffChangePercent?: number;
  productionShockPercent?: number;
  demandShockPercent?: number;
  mandiArrivalSurgePercent?: number;
}

export interface ScenarioPropagationImpact {
  shock: ExogenousShockInput;
  cropCommodityId: string;
  /** Production and yield adjustment factor */
  yieldImpactPercent: number;
  /** Market price impact factor */
  priceImpactPercent: number;
  /** Cost of cultivation impact */
  cultivationCostImpactPercent: number;
  /** Logistics freight impact */
  freightCostImpactPercent: number;
  /** Farmer net realization change */
  farmerNetIncomeChangePercent: number;
  /** FPO aggregation value at risk (in INR) */
  fpoValueAtRiskPercent: number;
  /** Corporate procurement cost exposure change */
  corporateProcurementExposurePercent: number;
  /** Broader macro-economic inflation contribution */
  foodInflationContributionScore: number;
  /** Confidence in simulation output */
  confidence: ConfidenceMetrics;
  /** Policy recommendations for mitigation */
  recommendedInterventions: string[];
}
