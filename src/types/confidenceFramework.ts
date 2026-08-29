/**
 * FARMFIT UNIFIED CONFIDENCE FRAMEWORK
 * Quantitative metrics measuring the credibility, freshness, and empirical depth of intelligence outputs.
 */

export type DataFreshnessTier = 
  | 'LIVE_OFFICIAL_DATA'      // Fetched from live official API within < 24 hours
  | 'LATEST_OFFICIAL_DATA'    // Latest published government bulletin
  | 'RECENT_OFFICIAL_DATA'    // Published within the current agricultural season
  | 'HISTORICAL_OFFICIAL_DATA'// Previous seasons benchmark data
  | 'MODEL_ESTIMATE'          // Calibrated algorithmic projection
  | 'DATA_UNAVAILABLE';       // No verified official record exists

export type ModelConfidenceTier = 
  | 'VERY_HIGH' 
  | 'HIGH' 
  | 'MEDIUM' 
  | 'LOW' 
  | 'INSUFFICIENT_DATA';

export interface ConfidenceMetrics {
  /** Composite confidence score (0 to 100) */
  confidenceScore: number;
  /** Qualitative confidence tier */
  confidenceTier: ModelConfidenceTier;
  /** Data freshness classification */
  dataFreshness: DataFreshnessTier;
  /** Completeness of input parameters (0 to 100%) */
  dataCoveragePercent: number;
  /** Depth of historical official observations in days */
  historicalDepthDays: number;
  /** Critical identified uncertainties or missing datasets */
  keyUncertainties: string[];
  /** Underlying assumptions */
  methodologyAssumptions: string[];
  /** Audit provenance notes */
  provenanceNotes?: string[];
}
