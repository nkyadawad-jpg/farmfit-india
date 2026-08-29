/**
 * FARMFIT FARMER PRODUCER ORGANIZATION (FPO) DATA MODEL
 * Architectural foundation for cooperative aggregation, collective bargaining, and bulk logistics.
 */

export interface FpoCropAcreage {
  cropCommodityId: string;
  cropName: string;
  totalSownAcres: number;
  participatingFarmerCount: number;
  expectedYieldQuintalsPerAcre: number;
  totalExpectedProductionMetricTonnes: number;
  harvestWindowStart: string;
  harvestWindowEnd: string;
}

export interface FpoStorageFacility {
  facilityType: 'Paved Warehouse' | 'Cold Storage' | 'Hermetic Silo' | 'Grading & Sorting Shed';
  capacityMetricTonnes: number;
  availableCapacityMetricTonnes: number;
  locationVillage: string;
  isWdradacAccredited: boolean;
}

export interface FpoCorporateContract {
  contractId: string;
  corporateBuyerName: string;
  cropCommodityId: string;
  contractedQuantityMetricTonnes: number;
  agreedPricePerQuintal: number;
  deliveryDeadline: string;
  status: 'ACTIVE' | 'FULFILLED' | 'IN_NEGOTIATION';
}

export interface FpoEntity {
  fpoId: string;
  fpoName: string;
  registrationNumber: string;
  state: string;
  district: string;
  headquartersTaluka: string;
  memberFarmersCount: number;
  coveredVillages: string[];
  totalLandAcres: number;
  cropAcreages: FpoCropAcreage[];
  storageFacilities: FpoStorageFacility[];
  aggregationCapacityPerDayTonnes: number;
  primaryMarketAccessAPMCs: string[];
  corporateBuyerContracts: FpoCorporateContract[];
  lastAuditedDate: string;
}
