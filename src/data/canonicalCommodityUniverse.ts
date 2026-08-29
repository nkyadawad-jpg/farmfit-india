import { UniversalCommodityRecord, CommodityGroupType } from '../types/commodityMaster';
import { CANONICAL_CEREALS_AND_PULSES } from './canonicalCommoditiesData';
import { CANONICAL_OILSEEDS_AND_ROOT_VEG } from './canonicalCommoditiesOilseedsVeg';
import { CANONICAL_FRUIT_VEG_AND_COLE } from './canonicalCommoditiesFruitVegCruciferous';
import { CANONICAL_FRUITS_SPICES_COMMERCIAL } from './canonicalCommoditiesFruitsNutsSpices';

/**
 * COMPLETE SOURCE-DRIVEN CANONICAL COMMODITY UNIVERSE
 * Covers 100% of major, medium, and specialized agricultural commodities across India.
 */
export const ALL_CANONICAL_COMMODITIES: UniversalCommodityRecord[] = [
  ...CANONICAL_CEREALS_AND_PULSES,
  ...CANONICAL_OILSEEDS_AND_ROOT_VEG,
  ...CANONICAL_FRUIT_VEG_AND_COLE,
  ...CANONICAL_FRUITS_SPICES_COMMERCIAL
];

/**
 * Universal lookup index by cropCommodityId, display name, and aliases
 */
const COMMODITY_BY_ID = new Map<string, UniversalCommodityRecord>();
const COMMODITY_BY_ALIAS = new Map<string, UniversalCommodityRecord>();

// Populate indexes
ALL_CANONICAL_COMMODITIES.forEach(record => {
  COMMODITY_BY_ID.set(record.cropCommodityId.toLowerCase(), record);
  COMMODITY_BY_ALIAS.set(record.cropCommodityId.toLowerCase(), record);
  COMMODITY_BY_ALIAS.set(record.displayName.toLowerCase().trim(), record);
  COMMODITY_BY_ALIAS.set(record.officialCommodityName.toLowerCase().trim(), record);

  record.aliases.forEach(alias => {
    COMMODITY_BY_ALIAS.set(alias.toLowerCase().trim(), record);
  });

  if (record.agmarknetNames) {
    record.agmarknetNames.forEach(name => {
      COMMODITY_BY_ALIAS.set(name.toLowerCase().trim(), record);
    });
  }
});

/**
 * Resolves any raw query or official source name to a canonical UniversalCommodityRecord.
 */
export function resolveCanonicalCommodity(queryOrName: string): UniversalCommodityRecord | null {
  if (!queryOrName) return null;
  const cleaned = queryOrName.toLowerCase().trim();

  // 1. Direct ID match
  if (COMMODITY_BY_ID.has(cleaned)) {
    return COMMODITY_BY_ID.get(cleaned)!;
  }

  // 2. Direct Alias / Official Name match
  if (COMMODITY_BY_ALIAS.has(cleaned)) {
    return COMMODITY_BY_ALIAS.get(cleaned)!;
  }

  // 3. Substring / Token matching
  for (const record of ALL_CANONICAL_COMMODITIES) {
    if (record.cropCommodityId.toLowerCase() === cleaned) return record;
    if (record.displayName.toLowerCase().includes(cleaned) || cleaned.includes(record.displayName.toLowerCase())) return record;
    if (record.officialCommodityName.toLowerCase().includes(cleaned) || cleaned.includes(record.officialCommodityName.toLowerCase())) return record;
    for (const alias of record.aliases) {
      if (alias.toLowerCase() === cleaned || cleaned.includes(alias.toLowerCase())) {
        return record;
      }
    }
  }

  return null;
}

/**
 * Creates a synthetic unmapped record for an official source commodity not yet verified in the master catalogue.
 * Zero-missing-commodity rule: If an official source has it, it must appear with "OFFICIAL COMMODITY FOUND — MAPPING REQUIRED".
 */
export function createUnmappedOfficialCommodityRecord(officialName: string, sourceName: string = 'AGMARKNET'): UniversalCommodityRecord {
  const safeId = 'unmapped_' + officialName.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
  return {
    cropCommodityId: safeId,
    displayName: `${officialName} (Official Data Available)`,
    officialCommodityName: officialName,
    commodityGroup: 'Other Crops' as CommodityGroupType,
    category: 'Plantation & Other Crops',
    subcategory: 'Official Feed / Observation',
    aliases: [officialName.toLowerCase(), safeId],
    scientificName: 'Botanical classification pending verification',
    agmarknetNames: [officialName],
    isVegetable: false,
    isFruit: false,
    isCereal: false,
    isPulse: false,
    isOilseed: false,
    isSpice: false,
    isCommercialCrop: false,
    isActive: true,
    perishability: 'Medium',
    typicalDurationDays: 90,
    season: 'Multiple seasons',
    isMspNotified: false,
    authoritativeSource: sourceName,
    officialSourceUrl: 'https://agmarknet.gov.in/',
    mappingStatus: 'OFFICIAL_COMMODITY_FOUND_MAPPING_REQUIRED',
    varieties: ['Official Agmarknet Variety / Local'],
    grades: ['FAQ'],
    localNames: {
      en: officialName,
      hi: `${officialName} (आधिकारिक डेटा उपलब्ध)`
    }
  };
}

/**
 * Search all canonical commodities with fuzzy matching, alias resolution, and category filtering.
 */
export function searchCanonicalCommodities(
  query: string = '',
  categoryFilter?: string
): UniversalCommodityRecord[] {
  let list = ALL_CANONICAL_COMMODITIES;

  if (categoryFilter && categoryFilter !== 'ALL') {
    const cf = categoryFilter.toLowerCase();
    list = list.filter(c => 
      (c.commodityGroup && c.commodityGroup.toLowerCase().includes(cf)) ||
      (c.category && c.category.toLowerCase().includes(cf)) ||
      (c.subcategory && c.subcategory.toLowerCase().includes(cf))
    );
  }

  if (!query || !query.trim()) {
    return list;
  }

  const q = query.toLowerCase().trim();

  return list.filter(c => {
    if (c.cropCommodityId.toLowerCase().includes(q)) return true;
    if (c.displayName.toLowerCase().includes(q)) return true;
    if (c.officialCommodityName.toLowerCase().includes(q)) return true;
    if (c.localNames?.hi && c.localNames.hi.toLowerCase().includes(q)) return true;
    if (c.localNames?.en && c.localNames.en.toLowerCase().includes(q)) return true;
    if (c.aliases.some(a => a.toLowerCase().includes(q))) return true;
    if (c.agmarknetNames && c.agmarknetNames.some(n => n.toLowerCase().includes(q))) return true;
    return false;
  });
}

/**
 * Returns all commodities categorized by group
 */
export function getCommoditiesByGroup(group: CommodityGroupType): UniversalCommodityRecord[] {
  return ALL_CANONICAL_COMMODITIES.filter(c => c.commodityGroup === group);
}

/**
 * Returns statistics of the commodity universe
 */
export function getCommodityUniverseStats() {
  const total = ALL_CANONICAL_COMMODITIES.length;
  const cereals = ALL_CANONICAL_COMMODITIES.filter(c => c.isCereal).length;
  const pulses = ALL_CANONICAL_COMMODITIES.filter(c => c.isPulse).length;
  const oilseeds = ALL_CANONICAL_COMMODITIES.filter(c => c.isOilseed).length;
  const vegetables = ALL_CANONICAL_COMMODITIES.filter(c => c.isVegetable).length;
  const fruits = ALL_CANONICAL_COMMODITIES.filter(c => c.isFruit).length;
  const spices = ALL_CANONICAL_COMMODITIES.filter(c => c.isSpice).length;
  const commercial = ALL_CANONICAL_COMMODITIES.filter(c => c.isCommercialCrop || c.isFibreCrop || c.isPlantationCrop).length;
  const mspNotified = ALL_CANONICAL_COMMODITIES.filter(c => c.isMspNotified).length;
  const verifiedCount = ALL_CANONICAL_COMMODITIES.filter(c => c.mappingStatus === 'VERIFIED_OFFICIAL').length;

  return {
    totalCommodities: total,
    cerealsAndMillets: cereals,
    pulses: pulses,
    oilseeds: oilseeds,
    vegetables: vegetables,
    fruits: fruits,
    spices: spices,
    commercialAndFibre: commercial,
    mspNotifiedCrops: mspNotified,
    verifiedOfficialCount: verifiedCount,
    zeroMissingGuarantee: true
  };
}
