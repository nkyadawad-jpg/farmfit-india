/**
 * FARMFIT CORPORATE AGRIBUSINESS & B2B PROCUREMENT MODEL
 * Architectural foundation for institutional buyers, food processors, and supply chain originators.
 */

export interface B2BProcurementRequirement {
  requirementId: string;
  corporateId: string;
  cropCommodityId: string;
  commodityDisplayName: string;
  targetQuantityMetricTonnes: number;
  qualityGrade: 'FAQ' | 'Grade A' | 'Export Quality' | 'Processing Grade';
  maxMoisturePercent: number;
  deliveryWindowStart: string;
  deliveryWindowEnd: string;
  destinationProcessingHub: string;
  hubLatitude: number;
  hubLongitude: number;
  targetPricePerQuintal: number;
  maxAcceptableFreightPerQuintal: number;
  supplyRiskScore: number; // 0 (Secure) - 100 (Severe shortage risk)
  procurementStatus: 'OPEN' | 'PARTIALLY_SOURCED' | 'FULFILLED' | 'CLOSED';
}

export interface B2BCorporateProfile {
  corporateId: string;
  companyName: string;
  industrySector: 'Food Processing' | 'Edible Oil Refining' | 'Grain Milling' | 'Textile & Ginning' | 'Export' | 'Retail Aggregation';
  headquartersCity: string;
  operatingStates: string[];
  activeProcurementRequirements: B2BProcurementRequirement[];
  preferredPartnerFpoIds: string[];
}
