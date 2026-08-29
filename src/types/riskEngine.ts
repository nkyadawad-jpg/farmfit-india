/**
 * FARMFIT AGRICULTURAL RISK FOUNDATION
 * Actuarial, agronomic, and market risk intelligence model.
 */

export type RiskDimensionType =
  | 'Weather Risk'
  | 'Production Risk'
  | 'Price Risk'
  | 'Demand Risk'
  | 'Supply Risk'
  | 'Input Cost Risk'
  | 'Water Risk'
  | 'Logistics Risk'
  | 'Trade Risk'
  | 'Policy Risk'
  | 'Climate Risk'
  | 'Geopolitical Risk';

export type RiskLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL' | 'DATA_UNAVAILABLE';

export interface RiskDimensionAssessment {
  dimension: RiskDimensionType;
  /** Risk score normalized between 0 (Lowest risk / safest) to 100 (Extreme catastrophic risk) */
  riskScore: number;
  riskLevel: RiskLevel;
  /** Explanatory key risk drivers */
  drivers: string[];
  /** Model confidence score (0 to 100) based on data depth */
  confidence: number;
  /** Primary government or empirical data sources */
  dataSources: string[];
  /** ISO Date of calculation */
  calculationDate: string;
  /** Specific agronomical or hedging mitigation steps */
  mitigationStrategies: string[];
}

export interface AgriculturalRiskProfile {
  cropCommodityId: string;
  displayName: string;
  state: string;
  district: string;
  overallCompositeRiskScore: number; // 0 - 100
  overallRiskLevel: RiskLevel;
  dimensions: Record<RiskDimensionType, RiskDimensionAssessment>;
  topRiskFactors: string[];
  keyStrengths: string[];
  confidenceScore: number;
  assessedAt: string;
  provenanceSource: string;
}
