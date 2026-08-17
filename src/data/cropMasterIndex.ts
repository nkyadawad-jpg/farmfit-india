import { CropMasterRecord, CropCategory, CropSeason } from '../types';
import { CROP_MASTER_DATABASE, OFFICIAL_CROP_SOURCES } from './cropMasterCatalog';
import { HORTICULTURE_CROPS } from './cropMasterHorticulture';
import { COMMERCIAL_AND_FODDER_CROPS } from './cropMasterCommercial';

export const COMPLETE_INDIA_CROP_MASTER: CropMasterRecord[] = [
  ...CROP_MASTER_DATABASE,
  ...HORTICULTURE_CROPS,
  ...COMMERCIAL_AND_FODDER_CROPS
];

export { OFFICIAL_CROP_SOURCES };

export const ALL_CROP_CATEGORIES: CropCategory[] = [
  'Cereals',
  'Pulses',
  'Oilseeds',
  'Millets (Shree Anna)',
  'Vegetables',
  'Fruits',
  'Spices & Condiments',
  'Fibre Crops',
  'Sugar & Commercial Crops',
  'Fodder Crops',
  'Plantation & Other Crops'
];

export const ALL_CROP_SEASONS: CropSeason[] = [
  'Kharif',
  'Rabi',
  'Zaid',
  'Annual / Commercial',
  'Perennial',
  'Multiple seasons'
];

export function getCropById(cropId: string): CropMasterRecord | undefined {
  return COMPLETE_INDIA_CROP_MASTER.find(c => c.cropId === cropId);
}

export function searchCrops(
  query: string, 
  category?: CropCategory | 'ALL',
  season?: CropSeason | 'ALL',
  mspOnly?: boolean
): CropMasterRecord[] {
  const cleanQuery = query.toLowerCase().trim();

  return COMPLETE_INDIA_CROP_MASTER.filter(crop => {
    // Category filter
    if (category && category !== 'ALL' && crop.category !== category) {
      return false;
    }

    // Season filter
    if (season && season !== 'ALL') {
      if (crop.season !== season && crop.season !== 'Multiple seasons') {
        return false;
      }
    }

    // MSP filter
    if (mspOnly && !crop.government?.MSPApplicable) {
      return false;
    }

    // Text search in English name, scientific name, hindi name, regional names, category
    if (cleanQuery) {
      const matchName = crop.cropName.toLowerCase().includes(cleanQuery);
      const matchSci = crop.scientificName.toLowerCase().includes(cleanQuery);
      const matchCat = crop.category.toLowerCase().includes(cleanQuery);
      const matchSub = crop.subcategory.toLowerCase().includes(cleanQuery);
      
      const localNamesStr = Object.values(crop.localNames || {}).join(' ').toLowerCase();
      const matchLocal = localNamesStr.includes(cleanQuery);

      const matchState = crop.geographic?.majorProducingStates?.some(s => s.toLowerCase().includes(cleanQuery));

      return matchName || matchSci || matchCat || matchSub || matchLocal || matchState;
    }

    return true;
  });
}
