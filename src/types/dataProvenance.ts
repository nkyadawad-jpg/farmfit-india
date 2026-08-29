/**
 * FARMFIT DATA PROVENANCE & AUDITABILITY FRAMEWORK
 * Guarantees zero fabrication, transparent citations, and verifiable calculation trails.
 */

export interface TraceableDataProvenance {
  /** Authority / Ministry / Agency responsible */
  sourceName: string;
  /** Direct official URL / gazette notification / API endpoint */
  sourceUrl: string;
  /** Official publication date or gazette date */
  publicationDate: string;
  /** Exact ISO timestamp when data was indexed or queried */
  retrievalTimestamp: string;
  /** Geographic jurisdiction of validity */
  geographicScope: string;
  /** Canonical commodity identifier */
  cropCommodityId?: string;
  /** Specific unique bulletin or record identifier */
  recordId?: string;
  /** Explicit methodology description or mathematical formula */
  calculationMethod?: string;
  /** Documented assumptions if estimates are involved */
  assumptionsUsed?: string[];
  /** Empirical confidence index (0 - 100) */
  confidenceIndex: number;
}
