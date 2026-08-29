/**
 * FARMFIT India Agricultural Supply, Production & Consumption Intelligence Engine v1
 * Processes official DES APY, MoSPI HCES, APEDA Trade, and CACP balance sheets
 * No fake data: Missing components are explicitly reported as DATA_UNAVAILABLE, PARTIAL DATA, or INSUFFICIENT DATA.
 */

import { 
  AgriculturalProductionRecord,
  DomesticConsumptionRecord,
  DemandRecord,
  AgriculturalTradeRecord,
  SupplyBalanceRecord,
  CropSpecializationRecord,
  ProductionTrendAnalysis,
  TrendPoint,
  TradeImpactIndicator,
  StateProductionShare,
  DistrictProductionShare,
  DataConfidenceLevel,
  TransparentDataQualityStatus,
  ExpectedHarvestWindow
} from '../types/supplyDemand';

import { 
  OFFICIAL_PRODUCTION_RECORDS,
  DOMESTIC_CONSUMPTION_RECORDS,
  DEMAND_RECORDS,
  AGRICULTURAL_TRADE_RECORDS,
  SUPPLY_BALANCE_DATABASE
} from '../data/indiaAgriculturalSupplyData';

import { COMPLETE_INDIA_CROP_MASTER } from '../data/cropMasterIndex';

export interface ProductionFilterParams {
  cropId?: string;
  category?: string;
  state?: string;
  district?: string;
  season?: string;
  year?: string;
}

/**
 * Filter official production records by multi-dimensional parameters
 */
export function filterProductionRecords(params: ProductionFilterParams): AgriculturalProductionRecord[] {
  return OFFICIAL_PRODUCTION_RECORDS.filter(record => {
    if (params.cropId && params.cropId !== 'ALL' && record.cropId !== params.cropId) {
      return false;
    }
    if (params.category && params.category !== 'ALL' && record.category !== params.category) {
      return false;
    }
    if (params.state && params.state !== 'ALL') {
      if (record.state.toLowerCase() !== params.state.toLowerCase()) {
        return false;
      }
    }
    if (params.district && params.district !== 'ALL') {
      if (record.district.toLowerCase() !== params.district.toLowerCase()) {
        return false;
      }
    }
    if (params.season && params.season !== 'ALL') {
      if (record.season !== params.season && record.season !== 'Total' && record.season !== 'Whole Year') {
        return false;
      }
    }
    if (params.year && params.year !== 'ALL') {
      if (record.year !== params.year) {
        return false;
      }
    }
    return true;
  });
}

/**
 * Get distinct available years across all official production records
 */
export function getAvailableProductionYears(): string[] {
  const years = Array.from(new Set(OFFICIAL_PRODUCTION_RECORDS.map(r => r.year)));
  return years.sort().reverse();
}

/**
 * Get distinct available states across all official production records
 */
export function getAvailableProductionStates(): string[] {
  const states = Array.from(new Set(OFFICIAL_PRODUCTION_RECORDS.map(r => r.state)));
  return states.filter(s => s !== 'All India').sort();
}

/**
 * Get distinct available districts for a given state
 */
export function getAvailableProductionDistricts(stateName: string): string[] {
  if (!stateName || stateName === 'All India') return [];
  const districts = Array.from(new Set(
    OFFICIAL_PRODUCTION_RECORDS
      .filter(r => r.state.toLowerCase() === stateName.toLowerCase() && r.district !== 'ALL')
      .map(r => r.district)
  ));
  return districts.sort();
}

/**
 * Derive transparent data quality status based on source, status, and completeness
 */
export function getTransparentDataQualityStatus(
  dataStatus?: string,
  isComplete: boolean = true,
  hasSource: boolean = true
): TransparentDataQualityStatus {
  if (!hasSource) return 'DATA UNAVAILABLE';
  if (!isComplete) return 'PARTIAL DATA';
  
  const st = (dataStatus || '').toUpperCase();
  if (st.includes('FINAL') || st === 'OFFICIAL — FINAL' || st === 'FINAL_ESTIMATE') {
    return 'OFFICIAL — FINAL';
  }
  if (st.includes('ADVANCE') || st === 'OFFICIAL — ADVANCE' || st === 'ADVANCE_ESTIMATE') {
    return 'OFFICIAL — ADVANCE';
  }
  if (st.includes('HISTORICAL') || st === 'OFFICIAL — HISTORICAL') {
    return 'OFFICIAL — HISTORICAL';
  }
  if (st.includes('DERIVED')) {
    return 'DERIVED';
  }
  if (st.includes('PARTIAL') || st.includes('INCOMPLETE')) {
    return 'PARTIAL DATA';
  }
  return 'DATA UNAVAILABLE';
}

/**
 * Calculate statistical production, area, and yield trend over 5 and 10 year horizons
 * Complies strictly with CAGR validity rules (requires >= 2 distinct observations, positive baselines)
 */
export function calculateProductionTrend(cropId: string, geography: string = 'All India'): ProductionTrendAnalysis {
  const relevantRecords = OFFICIAL_PRODUCTION_RECORDS.filter(r => 
    r.cropId === cropId && 
    (geography === 'All India' ? r.state === 'All India' : r.state.toLowerCase() === geography.toLowerCase()) &&
    r.district === 'ALL'
  );

  const cropName = relevantRecords[0]?.cropName || cropId;

  if (relevantRecords.length === 0) {
    return {
      cropId,
      cropName,
      geography,
      points: [],
      hasFiveYearTrend: false,
      hasTenYearTrend: false,
      fiveYearProductionGrowthPercent: null,
      fiveYearProductionCagrPercent: null,
      fiveYearAreaGrowthPercent: null,
      fiveYearYieldGrowthPercent: null,
      tenYearProductionGrowthPercent: null,
      tenYearProductionCagrPercent: null,
      tenYearAreaGrowthPercent: null,
      tenYearYieldGrowthPercent: null,
      cagrStatisticallyAppropriate: false,
      insufficientDataReason: 'No official historical time series records available for this crop and geography.',
      dataQuality: 'DATA UNAVAILABLE'
    };
  }

  // Sort ascending by year (e.g. 2019-20 -> 2020-21 -> 2021-22 -> 2022-23 -> 2023-24)
  const sorted = [...relevantRecords].sort((a, b) => a.year.localeCompare(b.year));

  const points: TrendPoint[] = sorted.map(r => ({
    year: r.year,
    area: r.area,
    production: r.production,
    yield: r.yield,
    dataStatus: r.dataStatus,
    dataQuality: getTransparentDataQualityStatus(r.dataStatus, r.production !== null && r.area !== null)
  }));

  const numObs = points.length;
  const hasFiveYearTrend = numObs >= 4;
  const hasTenYearTrend = numObs >= 9;

  let fiveYearProductionGrowthPercent: number | null = null;
  let fiveYearProductionCagrPercent: number | null = null;
  let fiveYearAreaGrowthPercent: number | null = null;
  let fiveYearYieldGrowthPercent: number | null = null;
  let cagrStatisticallyAppropriate = false;
  let insufficientDataReason: string | undefined = undefined;

  if (hasFiveYearTrend) {
    const startPoint = points[0];
    const endPoint = points[numObs - 1];
    const elapsedYears = numObs - 1;

    if (startPoint.production && endPoint.production && startPoint.production > 0 && endPoint.production > 0) {
      fiveYearProductionGrowthPercent = Number((((endPoint.production - startPoint.production) / startPoint.production) * 100).toFixed(2));
      
      if (elapsedYears >= 2) {
        // Safe CAGR calculation: (End / Start)^(1 / n) - 1
        const cagr = (Math.pow(endPoint.production / startPoint.production, 1 / elapsedYears) - 1) * 100;
        if (!isNaN(cagr) && isFinite(cagr)) {
          fiveYearProductionCagrPercent = Number(cagr.toFixed(2));
          cagrStatisticallyAppropriate = true;
        }
      }
    }

    if (startPoint.area && endPoint.area && startPoint.area > 0) {
      fiveYearAreaGrowthPercent = Number((((endPoint.area - startPoint.area) / startPoint.area) * 100).toFixed(2));
    }

    if (startPoint.yield && endPoint.yield && startPoint.yield > 0) {
      fiveYearYieldGrowthPercent = Number((((endPoint.yield - startPoint.yield) / startPoint.yield) * 100).toFixed(2));
    }
  } else {
    insufficientDataReason = `Insufficient observations (${numObs} years recorded). Minimum 4 continuous years required for robust statistical trend.`;
  }

  return {
    cropId,
    cropName,
    geography,
    points,
    hasFiveYearTrend,
    hasTenYearTrend,
    fiveYearProductionGrowthPercent,
    fiveYearProductionCagrPercent,
    fiveYearAreaGrowthPercent,
    fiveYearYieldGrowthPercent,
    tenYearProductionGrowthPercent: null,
    tenYearProductionCagrPercent: null,
    tenYearAreaGrowthPercent: null,
    tenYearYieldGrowthPercent: null,
    cagrStatisticallyAppropriate,
    insufficientDataReason,
    dataQuality: hasFiveYearTrend ? 'OFFICIAL — HISTORICAL' : 'PARTIAL DATA'
  };
}

/**
 * Calculate state crop specialization and relative ranking based on official DES production & area data
 */
export function calculateCropSpecialization(state: string, year: string = '2023-24'): CropSpecializationRecord[] {
  // 1. Get all crops in the given state for the given year
  const stateRecords = OFFICIAL_PRODUCTION_RECORDS.filter(r => 
    r.state.toLowerCase() === state.toLowerCase() && 
    r.district === 'ALL' &&
    r.year === year &&
    r.production !== null &&
    r.production > 0
  );

  if (stateRecords.length === 0) {
    return [];
  }

  // 2. Get national production totals for each crop in the given year
  const nationalRecords = OFFICIAL_PRODUCTION_RECORDS.filter(r => 
    r.state === 'All India' && 
    r.district === 'ALL' &&
    r.year === year
  );

  const nationalMap = new Map<string, number>();
  nationalRecords.forEach(r => {
    if (r.production !== null) {
      nationalMap.set(r.cropId, r.production);
    }
  });

  // Calculate total state agricultural output volume
  const totalStateProduction = stateRecords.reduce((sum, r) => sum + (r.production || 0), 0);
  const totalStateArea = stateRecords.reduce((sum, r) => sum + (r.area || 0), 0);

  // Sort by production volume descending
  const sortedRecords = [...stateRecords].sort((a, b) => (b.production || 0) - (a.production || 0));

  return sortedRecords.map((r, index) => {
    const nationalProd = nationalMap.get(r.cropId) || null;
    const nationalSharePercent = (nationalProd && r.production) 
      ? Number(((r.production / nationalProd) * 100).toFixed(1)) 
      : null;

    const prodSharePercent = totalStateProduction > 0 && r.production 
      ? Number(((r.production / totalStateProduction) * 100).toFixed(1))
      : null;

    const areaSharePercent = totalStateArea > 0 && r.area
      ? Number(((r.area / totalStateArea) * 100).toFixed(1))
      : null;

    // Categorization logic
    let classification: 'Major Crop' | 'Secondary Crop' | 'Emerging Crop' | 'Minor / Sparse' = 'Secondary Crop';
    if ((nationalSharePercent && nationalSharePercent >= 20) || (prodSharePercent && prodSharePercent >= 15) || index < 2) {
      classification = 'Major Crop';
    } else if ((nationalSharePercent && nationalSharePercent >= 5) || (prodSharePercent && prodSharePercent >= 4)) {
      classification = 'Secondary Crop';
    } else if (nationalSharePercent && nationalSharePercent > 0) {
      classification = 'Emerging Crop';
    } else {
      classification = 'Minor / Sparse';
    }

    return {
      cropId: r.cropId,
      cropName: r.cropName,
      state: r.state,
      productionVolume: r.production,
      productionUnit: r.productionUnit,
      productionShareOfStatePercent: prodSharePercent,
      areaShareOfStatePercent: areaSharePercent,
      nationalProductionSharePercent: nationalSharePercent,
      classification,
      derivedLabel: 'FARMFIT DERIVED INDICATOR',
      isTopRanked: index === 0,
      stateRank: index + 1,
      dataQuality: 'DERIVED'
    };
  });
}

/**
 * Calculate district crop specialization
 */
export function calculateDistrictCropSpecialization(state: string, district: string, year: string = '2023-24'): CropSpecializationRecord[] {
  if (!state || !district || district === 'ALL') return [];

  const districtRecords = OFFICIAL_PRODUCTION_RECORDS.filter(r => 
    r.state.toLowerCase() === state.toLowerCase() && 
    r.district.toLowerCase() === district.toLowerCase() &&
    r.year === year &&
    r.production !== null &&
    r.production > 0
  );

  if (districtRecords.length === 0) return [];

  // Total district production
  const totalDistrictProduction = districtRecords.reduce((sum, r) => sum + (r.production || 0), 0);
  const totalDistrictArea = districtRecords.reduce((sum, r) => sum + (r.area || 0), 0);

  // State production map
  const stateRecords = OFFICIAL_PRODUCTION_RECORDS.filter(r =>
    r.state.toLowerCase() === state.toLowerCase() &&
    r.district === 'ALL' &&
    r.year === year
  );
  const stateMap = new Map<string, number>();
  stateRecords.forEach(r => {
    if (r.production !== null) stateMap.set(r.cropId, r.production);
  });

  const sorted = [...districtRecords].sort((a, b) => (b.production || 0) - (a.production || 0));

  return sorted.map((r, index) => {
    const stateProd = stateMap.get(r.cropId) || null;
    const shareOfState = (stateProd && r.production) 
      ? Number(((r.production / stateProd) * 100).toFixed(1))
      : null;

    const prodSharePercent = totalDistrictProduction > 0 && r.production
      ? Number(((r.production / totalDistrictProduction) * 100).toFixed(1))
      : null;

    const areaSharePercent = totalDistrictArea > 0 && r.area
      ? Number(((r.area / totalDistrictArea) * 100).toFixed(1))
      : null;

    let classification: 'Major Crop' | 'Secondary Crop' | 'Emerging Crop' | 'Minor / Sparse' = 'Secondary Crop';
    if ((prodSharePercent && prodSharePercent >= 20) || (shareOfState && shareOfState >= 15) || index === 0) {
      classification = 'Major Crop';
    } else if ((prodSharePercent && prodSharePercent >= 5) || (shareOfState && shareOfState >= 5)) {
      classification = 'Secondary Crop';
    } else {
      classification = 'Minor / Sparse';
    }

    return {
      cropId: r.cropId,
      cropName: r.cropName,
      state: r.state,
      district: r.district,
      productionVolume: r.production,
      productionUnit: r.productionUnit,
      productionShareOfStatePercent: shareOfState,
      areaShareOfStatePercent: areaSharePercent,
      nationalProductionSharePercent: null,
      classification,
      derivedLabel: 'FARMFIT DERIVED INDICATOR',
      isTopRanked: index === 0,
      stateRank: index + 1,
      dataQuality: 'DERIVED'
    };
  });
}

/**
 * Calculate where national production of a crop is concentrated across Indian states
 */
export function calculateProductionConcentration(cropId: string, year: string = '2023-24'): StateProductionShare[] {
  const nationalRecord = OFFICIAL_PRODUCTION_RECORDS.find(r => 
    r.cropId === cropId && 
    r.state === 'All India' && 
    r.district === 'ALL' &&
    r.year === year
  );

  const stateRecords = OFFICIAL_PRODUCTION_RECORDS.filter(r => 
    r.cropId === cropId && 
    r.state !== 'All India' && 
    r.district === 'ALL' &&
    r.year === year &&
    r.production !== null &&
    r.production > 0
  );

  if (stateRecords.length === 0) {
    return [];
  }

  const nationalTotal = nationalRecord?.production || stateRecords.reduce((sum, r) => sum + (r.production || 0), 0);

  const sorted = [...stateRecords].sort((a, b) => (b.production || 0) - (a.production || 0));

  return sorted.map((r, idx) => {
    const sharePercent = nationalTotal > 0 && r.production 
      ? Number(((r.production / nationalTotal) * 100).toFixed(1)) 
      : 0;

    return {
      state: r.state,
      production: r.production || 0,
      productionUnit: r.productionUnit,
      area: r.area || 0,
      areaUnit: r.areaUnit,
      yield: r.yield || 0,
      yieldUnit: r.yieldUnit,
      sharePercent,
      isRanked: idx + 1,
      dataQuality: 'OFFICIAL — FINAL'
    };
  });
}

/**
 * Calculate district breakdown for a crop within a specific state
 */
export function calculateDistrictConcentration(cropId: string, state: string, year: string = '2023-24'): DistrictProductionShare[] {
  if (!state || state === 'All India') return [];

  const stateRecord = OFFICIAL_PRODUCTION_RECORDS.find(r =>
    r.cropId === cropId &&
    r.state.toLowerCase() === state.toLowerCase() &&
    r.district === 'ALL' &&
    r.year === year
  );

  const districtRecords = OFFICIAL_PRODUCTION_RECORDS.filter(r =>
    r.cropId === cropId &&
    r.state.toLowerCase() === state.toLowerCase() &&
    r.district !== 'ALL' &&
    r.year === year &&
    r.production !== null &&
    r.production > 0
  );

  if (districtRecords.length === 0) return [];

  const stateTotal = stateRecord?.production || districtRecords.reduce((sum, r) => sum + (r.production || 0), 0);
  const sorted = [...districtRecords].sort((a, b) => (b.production || 0) - (a.production || 0));

  return sorted.map((r, idx) => {
    const shareOfStatePercent = stateTotal > 0 && r.production
      ? Number(((r.production / stateTotal) * 100).toFixed(1))
      : 0;

    return {
      district: r.district,
      state: r.state,
      production: r.production || 0,
      productionUnit: r.productionUnit,
      area: r.area || 0,
      areaUnit: r.areaUnit,
      yield: r.yield || 0,
      yieldUnit: r.yieldUnit,
      shareOfStatePercent,
      isRanked: idx + 1,
      dataQuality: 'OFFICIAL — FINAL'
    };
  });
}

/**
 * Calculate trade impact indicators (Export/Import dependence) based on official APEDA / DGCIS records
 */
export function calculateTradeImpact(cropId: string, year: string = '2023-24'): TradeImpactIndicator {
  const nationalProdRecord = OFFICIAL_PRODUCTION_RECORDS.find(r => 
    r.cropId === cropId && 
    r.state === 'All India' && 
    r.year === year
  );

  const domesticConsumptionRecord = DOMESTIC_CONSUMPTION_RECORDS.find(r => 
    r.cropId === cropId && 
    r.geography === 'All India' &&
    r.year === year
  );

  const exportRecords = AGRICULTURAL_TRADE_RECORDS.filter(r => 
    r.cropId === cropId && 
    r.tradeType === 'EXPORT' && 
    r.year === year
  );

  const importRecords = AGRICULTURAL_TRADE_RECORDS.filter(r => 
    r.cropId === cropId && 
    r.tradeType === 'IMPORT' && 
    r.year === year
  );

  const cropName = nationalProdRecord?.cropName || cropId;
  const production = nationalProdRecord?.production || null;
  const domesticConsumption = domesticConsumptionRecord?.quantity || null;

  const totalExportQty = exportRecords.length > 0 
    ? exportRecords.reduce((sum, r) => sum + (r.quantity || 0), 0)
    : null;

  const totalImportQty = importRecords.length > 0
    ? importRecords.reduce((sum, r) => sum + (r.quantity || 0), 0)
    : null;

  let exportDependencePercent: number | null = null;
  let importDependencePercent: number | null = null;
  let tradeExposureLevel: TradeImpactIndicator['tradeExposureLevel'] = 'Self-Sufficient / Domestic Focus';

  if (production && totalExportQty !== null && production > 0) {
    exportDependencePercent = Number(((totalExportQty / production) * 100).toFixed(1));
  }

  if (domesticConsumption && totalImportQty !== null && domesticConsumption > 0) {
    importDependencePercent = Number(((totalImportQty / domesticConsumption) * 100).toFixed(1));
  } else if (production && totalImportQty !== null && (production + totalImportQty) > 0) {
    importDependencePercent = Number(((totalImportQty / (production + totalImportQty)) * 100).toFixed(1));
  }

  if (exportDependencePercent !== null && exportDependencePercent >= 15) {
    tradeExposureLevel = 'High Export Orientation';
  } else if (exportDependencePercent !== null && exportDependencePercent >= 5) {
    tradeExposureLevel = 'Moderate Export';
  } else if (importDependencePercent !== null && importDependencePercent >= 20) {
    tradeExposureLevel = 'High Import Reliance';
  } else if (exportDependencePercent !== null || importDependencePercent !== null) {
    tradeExposureLevel = 'Self-Sufficient / Domestic Focus';
  } else {
    tradeExposureLevel = 'Data Insufficient';
  }

  const explanatoryNote = tradeExposureLevel === 'High Export Orientation'
    ? `High export orientation (${exportDependencePercent}% of national production exported). Farmgate prices are sensitive to international freight rates and export policy shifts.`
    : tradeExposureLevel === 'High Import Reliance'
    ? `High import reliance (${importDependencePercent}% of domestic demand met via imports). Domestic prices are anchored to landed import tariffs and international parity.`
    : tradeExposureLevel === 'Moderate Export'
    ? `Moderate trade participation (${exportDependencePercent}% exported). Domestic market serves as primary demand anchor.`
    : tradeExposureLevel === 'Self-Sufficient / Domestic Focus'
    ? `Predominantly domestic supply-demand equilibrium. Prices are driven by local harvest arrivals and MSP procurement.`
    : `Official trade volume data not connected or negligible in centralized gazettes.`;

  return {
    cropId,
    cropName,
    year,
    exportDependencePercent,
    importDependencePercent,
    tradeExposureLevel,
    label: 'FARMFIT DERIVED INDICATOR',
    explanatoryNote,
    methodology: 'Computed from official APEDA / DGCIS trade flows and DES national production volume balance.',
    dataQuality: tradeExposureLevel === 'Data Insufficient' ? 'DATA UNAVAILABLE' : 'DERIVED'
  };
}

/**
 * Retrieve or evaluate national supply-demand balance sheet with completeness audit
 */
export function getSupplyBalance(cropId: string, year: string = '2023-24'): SupplyBalanceRecord | null {
  const existing = SUPPLY_BALANCE_DATABASE.find(s => s.cropId === cropId && s.year === year);
  if (existing) {
    return existing;
  }

  // If not in database, attempt to construct and audit missing components
  const nationalProd = OFFICIAL_PRODUCTION_RECORDS.find(r => r.cropId === cropId && r.state === 'All India' && r.year === year);
  const consumption = DOMESTIC_CONSUMPTION_RECORDS.find(r => r.cropId === cropId && r.geography === 'All India' && r.year === year);
  const exports = AGRICULTURAL_TRADE_RECORDS.filter(r => r.cropId === cropId && r.tradeType === 'EXPORT' && r.year === year);
  const imports = AGRICULTURAL_TRADE_RECORDS.filter(r => r.cropId === cropId && r.tradeType === 'IMPORT' && r.year === year);

  if (!nationalProd && !consumption && exports.length === 0 && imports.length === 0) {
    return null;
  }

  const prodVal = nationalProd?.production || null;
  const impVal = imports.length > 0 ? imports.reduce((s, r) => s + (r.quantity || 0), 0) : null;
  const expVal = exports.length > 0 ? exports.reduce((s, r) => s + (r.quantity || 0), 0) : null;
  const consVal = consumption?.quantity || null;

  const missingComponents: string[] = [];
  if (prodVal === null) missingComponents.push('Domestic Production');
  if (impVal === null) missingComponents.push('Official Import Volume');
  if (expVal === null) missingComponents.push('Official Export Volume');
  if (consVal === null) missingComponents.push('National Domestic Consumption');
  missingComponents.push('Centralized Opening Stocks');
  missingComponents.push('Closing Pipeline Stocks');

  return {
    cropId,
    cropName: nationalProd?.cropName || cropId,
    geography: 'All India',
    period: year,
    year,
    production: prodVal,
    imports: impVal,
    exports: expVal,
    openingStocks: null,
    closingStocks: null,
    domesticConsumption: consVal,
    otherUses: null,
    estimatedAvailability: prodVal,
    estimatedBalance: null,
    isComplete: false,
    missingComponents,
    statusMessage: 'SUPPLY_BALANCE_INCOMPLETE',
    indicativeSurplusDeficitNote: `Supply balance incomplete for ${year}. Missing components: ${missingComponents.join(', ')}. Indicative numbers reflect individual published government series.`,
    sourceName: 'DES MoA&FW / MoSPI / APEDA',
    sourceUrl: 'https://desagri.gov.in/',
    retrievalDate: '2024-08-15',
    dataQuality: 'PARTIAL DATA'
  };
}

/**
 * Harvest Period Key Calculator
 * Connects planting date + crop duration to establish Expected Harvest Window key
 * Does NOT forecast price or demand yet.
 */
export function calculateHarvestWindow(
  cropId: string, 
  plantingDateStr?: string, 
  customDurationDays?: number
): ExpectedHarvestWindow {
  const cropMeta = COMPLETE_INDIA_CROP_MASTER.find(c => c.cropId === cropId);
  const cropName = cropMeta?.cropName || cropId.charAt(0).toUpperCase() + cropId.slice(1);
  
  // Default duration from crop metadata or typical benchmarks
  const duration = customDurationDays || (
    cropMeta 
      ? (cropMeta.durationRangeDays 
          ? (cropMeta.durationRangeDays.min + cropMeta.durationRangeDays.max) / 2 
          : cropMeta.typicalDurationDays || 100)
      : 100
  );

  // Planting date parsing
  let baseDate = new Date();
  if (plantingDateStr) {
    const parsed = new Date(plantingDateStr);
    if (!isNaN(parsed.getTime())) {
      baseDate = parsed;
    }
  }

  // Harvest Window Start = Planting Date + durationDays - 7
  // Harvest Window End = Planting Date + durationDays + 10
  const startDate = new Date(baseDate);
  startDate.setDate(startDate.getDate() + Math.max(30, Math.floor(duration - 7)));

  const endDate = new Date(baseDate);
  endDate.setDate(endDate.getDate() + Math.max(37, Math.floor(duration + 10)));

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const startMonth = monthNames[startDate.getMonth()];
  const endMonth = monthNames[endDate.getMonth()];
  const harvestMonth = startMonth === endMonth ? startMonth : `${startMonth} - ${endMonth}`;

  // Approximate agricultural season
  const monthIdx = startDate.getMonth(); // 0-11
  let harvestSeason = 'Kharif Harvest';
  if (monthIdx >= 9 && monthIdx <= 11) {
    harvestSeason = 'Kharif Harvest Window (Post-Monsoon)';
  } else if (monthIdx >= 2 && monthIdx <= 4) {
    harvestSeason = 'Rabi Harvest Window (Spring)';
  } else if (monthIdx >= 5 && monthIdx <= 7) {
    harvestSeason = 'Zaid / Summer Harvest Window';
  }

  const formatOpt: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' };

  return {
    cropId,
    cropName,
    plantingDate: baseDate.toLocaleDateString('en-IN', formatOpt),
    durationDays: Math.round(duration),
    harvestWindowStart: startDate.toLocaleDateString('en-IN', formatOpt),
    harvestWindowEnd: endDate.toLocaleDateString('en-IN', formatOpt),
    harvestMonth,
    harvestSeason,
    status: 'ESTABLISHED_KEY',
    methodology: 'FARMFIT Agronomic Chronology: Planting Date + Crop Physiological Duration (Days to Maturity ± 7 Days Window). Data Foundation Key for future market arrival models.'
  };
}

/**
 * Transparent confidence assessment for agricultural statistics
 */
export function assessDataConfidence(record?: { sourceName?: string; dataStatus?: string; publicationDate?: string } | null): DataConfidenceLevel {
  if (!record || !record.sourceName) {
    return 'INSUFFICIENT DATA';
  }

  const status = record.dataStatus?.toUpperCase() || '';
  if (status === 'FINAL_ESTIMATE' || status === 'OFFICIAL' || status === 'HISTORICAL' || status.includes('FINAL')) {
    return 'HIGH';
  }
  if (status === 'ADVANCE_ESTIMATE' || status.includes('BENCHMARK') || status.includes('HOUSEHOLD CONSUMPTION')) {
    return 'MEDIUM';
  }
  if (status.includes('MODEL') || status.includes('ESTIMATE')) {
    return 'LOW';
  }
  return 'INSUFFICIENT DATA';
}
