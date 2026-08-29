import { CropMasterRecord, CropCategory, CropSeason } from '../types';
import { CROP_MASTER_DATABASE, OFFICIAL_CROP_SOURCES } from './cropMasterCatalog';
import { HORTICULTURE_CROPS } from './cropMasterHorticulture';
import { COMMERCIAL_AND_FODDER_CROPS } from './cropMasterCommercial';

export const COMPLETE_INDIA_CROP_MASTER: CropMasterRecord[] = [
  ...CROP_MASTER_DATABASE,
  ...HORTICULTURE_CROPS,
  ...COMMERCIAL_AND_FODDER_CROPS
];

/**
 * CANONICAL FARMFIT ALL-INDIA CROP & COMMODITY MASTER
 * Single source of truth for all agricultural commodities across agronomy,
 * market intelligence, logistics, and decision support.
 */
export const FARMFIT_CROP_COMMODITY_MASTER = COMPLETE_INDIA_CROP_MASTER;

export { OFFICIAL_CROP_SOURCES };

export interface OfficialCommodityMapping {
  cropCommodityId: string;
  officialCommodityName: string;
  displayName: string;
  hindiName: string;
  commodityGroup: string;
  category: CropCategory;
  aliases: string[];
}

export const OFFICIAL_COMMODITY_MAPPINGS: Record<string, OfficialCommodityMapping> = {
  // Cereals & Millets
  bajra: {
    cropCommodityId: 'bajra',
    officialCommodityName: 'Bajra(Pearl Millet/Cumbu)',
    displayName: 'Bajra / Pearl Millet',
    hindiName: 'बाजरा',
    commodityGroup: 'Cereals',
    category: 'Millets (Shree Anna)',
    aliases: ['bajra', 'pearl millet', 'cumbu', 'sajje', 'kambu']
  },
  wheat: {
    cropCommodityId: 'wheat',
    officialCommodityName: 'Wheat',
    displayName: 'Wheat',
    hindiName: 'गेहूं',
    commodityGroup: 'Cereals',
    category: 'Cereals',
    aliases: ['wheat', 'gehu', 'gothumai', 'godhi', 'kanak']
  },
  paddy: {
    cropCommodityId: 'paddy',
    officialCommodityName: 'Paddy(Dhan)(Common)',
    displayName: 'Paddy / Rice',
    hindiName: 'धान / चावल',
    commodityGroup: 'Cereals',
    category: 'Cereals',
    aliases: ['paddy', 'rice', 'dhan', 'chawal', 'nellu', 'akki']
  },
  maize: {
    cropCommodityId: 'maize',
    officialCommodityName: 'Maize',
    displayName: 'Maize / Corn',
    hindiName: 'मक्का',
    commodityGroup: 'Cereals',
    category: 'Cereals',
    aliases: ['maize', 'corn', 'makka', 'musukina jola', 'makki']
  },
  jowar: {
    cropCommodityId: 'jowar',
    officialCommodityName: 'Jowar(Sorghum)',
    displayName: 'Jowar / Sorghum',
    hindiName: 'ज्वार',
    commodityGroup: 'Cereals',
    category: 'Millets (Shree Anna)',
    aliases: ['jowar', 'sorghum', 'jola', 'cholam', 'jonnalu']
  },
  ragi: {
    cropCommodityId: 'ragi',
    officialCommodityName: 'Ragi (Finger Millet)',
    displayName: 'Ragi / Finger Millet',
    hindiName: 'रागी / मडुआ',
    commodityGroup: 'Cereals',
    category: 'Millets (Shree Anna)',
    aliases: ['ragi', 'finger millet', 'nachani', 'kezhvaragu']
  },
  barley: {
    cropCommodityId: 'barley',
    officialCommodityName: 'Barley (Jau)',
    displayName: 'Barley',
    hindiName: 'जौ',
    commodityGroup: 'Cereals',
    category: 'Cereals',
    aliases: ['barley', 'jau']
  },

  // Oilseeds
  soybean: {
    cropCommodityId: 'soybean',
    officialCommodityName: 'Soyabean',
    displayName: 'Soybean',
    hindiName: 'सोयाबीन',
    commodityGroup: 'Oilseeds',
    category: 'Oilseeds',
    aliases: ['soybean', 'soyabean', 'soya']
  },
  mustard: {
    cropCommodityId: 'mustard',
    officialCommodityName: 'Mustard',
    displayName: 'Mustard / Rapeseed',
    hindiName: 'सरसों / राई',
    commodityGroup: 'Oilseeds',
    category: 'Oilseeds',
    aliases: ['mustard', 'mustard_rapeseed', 'sarson', 'rai', 'kadugu', 'sasive']
  },
  mustard_rapeseed: {
    cropCommodityId: 'mustard_rapeseed',
    officialCommodityName: 'Mustard',
    displayName: 'Mustard / Rapeseed',
    hindiName: 'सरसों / तोरिया',
    commodityGroup: 'Oilseeds',
    category: 'Oilseeds',
    aliases: ['mustard', 'mustard_rapeseed', 'sarson', 'toria']
  },
  groundnut: {
    cropCommodityId: 'groundnut',
    officialCommodityName: 'Groundnut',
    displayName: 'Groundnut / Peanut',
    hindiName: 'मूंगफली',
    commodityGroup: 'Oilseeds',
    category: 'Oilseeds',
    aliases: ['groundnut', 'peanut', 'mungfali', 'kadale kayi', 'verkkadalai']
  },
  sunflower: {
    cropCommodityId: 'sunflower',
    officialCommodityName: 'Sunflower',
    displayName: 'Sunflower',
    hindiName: 'सूरजमुखी',
    commodityGroup: 'Oilseeds',
    category: 'Oilseeds',
    aliases: ['sunflower', 'surajmukhi', 'suryakanthi']
  },
  sesame: {
    cropCommodityId: 'sesame',
    officialCommodityName: 'Sesamum(Sesame,Gingelly,Til)',
    displayName: 'Sesame / Til',
    hindiName: 'तिल',
    commodityGroup: 'Oilseeds',
    category: 'Oilseeds',
    aliases: ['sesame', 'til', 'gingelly', 'ellu', 'nuvvulu']
  },

  // Pulses
  gram: {
    cropCommodityId: 'gram',
    officialCommodityName: 'Gram Raw(Chana)',
    displayName: 'Gram / Chana / Chickpea',
    hindiName: 'चना / छोला',
    commodityGroup: 'Pulses',
    category: 'Pulses',
    aliases: ['gram', 'chana', 'chickpea', 'kadale', 'kondakadalai', 'senagalu']
  },
  chickpea: {
    cropCommodityId: 'chickpea',
    officialCommodityName: 'Gram Raw(Chana)',
    displayName: 'Chickpea / Gram',
    hindiName: 'चना',
    commodityGroup: 'Pulses',
    category: 'Pulses',
    aliases: ['chickpea', 'gram', 'chana']
  },
  pigeonpea_tur: {
    cropCommodityId: 'pigeonpea_tur',
    officialCommodityName: 'Arhar (Tur/Red Gram)(Whole)',
    displayName: 'Pigeonpea / Arhar / Tur',
    hindiName: 'अरहर / तुअर',
    commodityGroup: 'Pulses',
    category: 'Pulses',
    aliases: ['pigeonpea_tur', 'tur', 'arhar', 'red gram', 'togari', 'tuvaram paruppu']
  },
  greengram_moong: {
    cropCommodityId: 'greengram_moong',
    officialCommodityName: 'Moong(Green Gram)(Whole)',
    displayName: 'Green Gram / Moong',
    hindiName: 'मूंग',
    commodityGroup: 'Pulses',
    category: 'Pulses',
    aliases: ['greengram_moong', 'moong', 'green gram', 'hesaru', 'pasipayiru']
  },
  blackgram_urad: {
    cropCommodityId: 'blackgram_urad',
    officialCommodityName: 'Urad (Black Gram)(Whole)',
    displayName: 'Black Gram / Urad',
    hindiName: 'उड़द',
    commodityGroup: 'Pulses',
    category: 'Pulses',
    aliases: ['blackgram_urad', 'urad', 'black gram', 'uddu', 'ulunthu']
  },
  lentil_masur: {
    cropCommodityId: 'lentil_masur',
    officialCommodityName: 'Masur(Lentil)(Whole)',
    displayName: 'Lentil / Masur',
    hindiName: 'मसूर',
    commodityGroup: 'Pulses',
    category: 'Pulses',
    aliases: ['lentil_masur', 'masur', 'lentil']
  },

  // Vegetables
  onion: {
    cropCommodityId: 'onion',
    officialCommodityName: 'Onion',
    displayName: 'Onion',
    hindiName: 'प्याज',
    commodityGroup: 'Vegetables',
    category: 'Vegetables',
    aliases: ['onion', 'pyaz', 'kanda', 'eerulli', 'vengayam', 'ullipayalu']
  },
  tomato: {
    cropCommodityId: 'tomato',
    officialCommodityName: 'Tomato',
    displayName: 'Tomato',
    hindiName: 'टमाटर',
    commodityGroup: 'Vegetables',
    category: 'Vegetables',
    aliases: ['tomato', 'tamatar', 'takkali', 'tamata']
  },
  potato: {
    cropCommodityId: 'potato',
    officialCommodityName: 'Potato',
    displayName: 'Potato',
    hindiName: 'आलू',
    commodityGroup: 'Vegetables',
    category: 'Vegetables',
    aliases: ['potato', 'aloo', 'batata', 'aaloogadde', 'urulaikizhangu']
  },
  cauliflower: {
    cropCommodityId: 'cauliflower',
    officialCommodityName: 'Cauliflower',
    displayName: 'Cauliflower',
    hindiName: 'फूलगोभी',
    commodityGroup: 'Vegetables',
    category: 'Vegetables',
    aliases: ['cauliflower', 'phool gobhi', 'gobhi', 'huvukosu']
  },
  cabbage: {
    cropCommodityId: 'cabbage',
    officialCommodityName: 'Cabbage',
    displayName: 'Cabbage',
    hindiName: 'पत्तागोभी / बंदगोभी',
    commodityGroup: 'Vegetables',
    category: 'Vegetables',
    aliases: ['cabbage', 'patta gobhi', 'band gobhi', 'yelekosu']
  },
  brinjal: {
    cropCommodityId: 'brinjal',
    officialCommodityName: 'Brinjal',
    displayName: 'Brinjal / Eggplant',
    hindiName: 'बैंगन',
    commodityGroup: 'Vegetables',
    category: 'Vegetables',
    aliases: ['brinjal', 'eggplant', 'baingan', 'badanekayi', 'kathirikai', 'vankaya']
  },
  okra: {
    cropCommodityId: 'okra',
    officialCommodityName: 'Bhindi(Ladies Finger)',
    displayName: 'Okra / Bhindi',
    hindiName: 'भिंडी',
    commodityGroup: 'Vegetables',
    category: 'Vegetables',
    aliases: ['okra', 'bhindi', 'ladies finger', 'bende kayi', 'vendakkai', 'bhendi']
  },
  green_chilli: {
    cropCommodityId: 'green_chilli',
    officialCommodityName: 'Green Chilli',
    displayName: 'Green Chilli',
    hindiName: 'हरी मिर्च',
    commodityGroup: 'Vegetables',
    category: 'Vegetables',
    aliases: ['green_chilli', 'chilli', 'mirchi', 'hasi menasinakayi', 'pachai milagai']
  },
  chilli: {
    cropCommodityId: 'chilli',
    officialCommodityName: 'Green Chilli',
    displayName: 'Chilli / Mirch',
    hindiName: 'मिर्च',
    commodityGroup: 'Vegetables',
    category: 'Vegetables',
    aliases: ['chilli', 'green_chilli', 'mirch', 'mirchi']
  },
  garlic: {
    cropCommodityId: 'garlic',
    officialCommodityName: 'Garlic',
    displayName: 'Garlic',
    hindiName: 'लहसुन',
    commodityGroup: 'Vegetables',
    category: 'Vegetables',
    aliases: ['garlic', 'lahsun', 'bellulli', 'poondu', 'vellulli']
  },
  ginger: {
    cropCommodityId: 'ginger',
    officialCommodityName: 'Ginger(Green)',
    displayName: 'Ginger',
    hindiName: 'अदरक',
    commodityGroup: 'Vegetables',
    category: 'Vegetables',
    aliases: ['ginger', 'adrak', 'shunti', 'inji', 'allam']
  },
  turmeric: {
    cropCommodityId: 'turmeric',
    officialCommodityName: 'Turmeric',
    displayName: 'Turmeric / Haldi',
    hindiName: 'हल्दी',
    commodityGroup: 'Spices',
    category: 'Spices & Condiments',
    aliases: ['turmeric', 'haldi', 'arashina', 'manjal', 'pasupu']
  },
  coriander: {
    cropCommodityId: 'coriander',
    officialCommodityName: 'Coriander(Leaves)',
    displayName: 'Coriander / Dhaniya',
    hindiName: 'धनिया',
    commodityGroup: 'Spices',
    category: 'Spices & Condiments',
    aliases: ['coriander', 'dhaniya', 'kothambari', 'kothamalli', 'kothimeera']
  },
  cumin: {
    cropCommodityId: 'cumin',
    officialCommodityName: 'Cumin Seed(Jeera)',
    displayName: 'Cumin / Jeera',
    hindiName: 'जीरा',
    commodityGroup: 'Spices',
    category: 'Spices & Condiments',
    aliases: ['cumin', 'jeera', 'seeragam', 'jeelakarra']
  },
  cucumber: {
    cropCommodityId: 'cucumber',
    officialCommodityName: 'Cucumber(Kheera)',
    displayName: 'Cucumber',
    hindiName: 'खीरा / ककड़ी',
    commodityGroup: 'Vegetables',
    category: 'Vegetables',
    aliases: ['cucumber', 'kheera', 'southekayi', 'vellarikkai']
  },
  carrot: {
    cropCommodityId: 'carrot',
    officialCommodityName: 'Carrot',
    displayName: 'Carrot',
    hindiName: 'गाजर',
    commodityGroup: 'Vegetables',
    category: 'Vegetables',
    aliases: ['carrot', 'gajar']
  },
  radish: {
    cropCommodityId: 'radish',
    officialCommodityName: 'Raddish',
    displayName: 'Radish',
    hindiName: 'मूली',
    commodityGroup: 'Vegetables',
    category: 'Vegetables',
    aliases: ['radish', 'mooli', 'moolangi']
  },
  green_peas: {
    cropCommodityId: 'green_peas',
    officialCommodityName: 'Peas Wet',
    displayName: 'Green Peas / Matar',
    hindiName: 'हरी मटर',
    commodityGroup: 'Vegetables',
    category: 'Vegetables',
    aliases: ['green_peas', 'matar', 'peas', 'batani']
  },
  capsicum: {
    cropCommodityId: 'capsicum',
    officialCommodityName: 'Capsicum',
    displayName: 'Capsicum / Shimla Mirch',
    hindiName: 'शिमला मिर्च',
    commodityGroup: 'Vegetables',
    category: 'Vegetables',
    aliases: ['capsicum', 'shimla mirch', 'bell pepper']
  },
  bottle_gourd: {
    cropCommodityId: 'bottle_gourd',
    officialCommodityName: 'Bottle Gourd',
    displayName: 'Bottle Gourd / Lauki',
    hindiName: 'लौकी / घिया',
    commodityGroup: 'Vegetables',
    category: 'Vegetables',
    aliases: ['bottle_gourd', 'lauki', 'ghiya', 'sorekayi', 'sorakkai', 'sorakaya']
  },
  bitter_gourd: {
    cropCommodityId: 'bitter_gourd',
    officialCommodityName: 'Bitter Gourd',
    displayName: 'Bitter Gourd / Karela',
    hindiName: 'करेला',
    commodityGroup: 'Vegetables',
    category: 'Vegetables',
    aliases: ['bitter_gourd', 'karela', 'hagalakayi', 'pavakkai', 'kakarakaya']
  },
  spinach: {
    cropCommodityId: 'spinach',
    officialCommodityName: 'Spinach',
    displayName: 'Spinach / Palak',
    hindiName: 'पालक',
    commodityGroup: 'Vegetables',
    category: 'Vegetables',
    aliases: ['spinach', 'palak', 'palak soppu', 'pasalai']
  },

  // Fruits
  banana: {
    cropCommodityId: 'banana',
    officialCommodityName: 'Banana',
    displayName: 'Banana',
    hindiName: 'केला',
    commodityGroup: 'Fruits',
    category: 'Fruits',
    aliases: ['banana', 'kela', 'bale hannu', 'vazhaipazham', 'arati pandu']
  },
  mango: {
    cropCommodityId: 'mango',
    officialCommodityName: 'Mango',
    displayName: 'Mango',
    hindiName: 'आम',
    commodityGroup: 'Fruits',
    category: 'Fruits',
    aliases: ['mango', 'aam', 'mavinahannu', 'mambazham', 'mamidi pandu']
  },
  pomegranate: {
    cropCommodityId: 'pomegranate',
    officialCommodityName: 'Pomegranate',
    displayName: 'Pomegranate / Anar',
    hindiName: 'अनार',
    commodityGroup: 'Fruits',
    category: 'Fruits',
    aliases: ['pomegranate', 'anar', 'dalimbe', 'madhulampazham', 'danimma']
  },
  papaya: {
    cropCommodityId: 'papaya',
    officialCommodityName: 'Papaya',
    displayName: 'Papaya',
    hindiName: 'पपीता',
    commodityGroup: 'Fruits',
    category: 'Fruits',
    aliases: ['papaya', 'papita', 'parangi hannu', 'pappali']
  },
  guava: {
    cropCommodityId: 'guava',
    officialCommodityName: 'Guava',
    displayName: 'Guava / Amrood',
    hindiName: 'अमरूद',
    commodityGroup: 'Fruits',
    category: 'Fruits',
    aliases: ['guava', 'amrood', 'seebe hannu', 'koyyapazham', 'jama pandu']
  },
  apple: {
    cropCommodityId: 'apple',
    officialCommodityName: 'Apple',
    displayName: 'Apple / Seb',
    hindiName: 'सेब',
    commodityGroup: 'Fruits',
    category: 'Fruits',
    aliases: ['apple', 'seb', 'sebu']
  },

  // Commercial & Fibre
  cotton: {
    cropCommodityId: 'cotton',
    officialCommodityName: 'Cotton',
    displayName: 'Cotton (Kapas)',
    hindiName: 'कपास',
    commodityGroup: 'Fibre Crops',
    category: 'Fibre Crops',
    aliases: ['cotton', 'cotton_medium_long', 'cotton_long', 'kapas', 'hatti', 'paruthi', 'patti', 'narma']
  },
  cotton_medium_long: {
    cropCommodityId: 'cotton_medium_long',
    officialCommodityName: 'Cotton',
    displayName: 'Cotton (Medium/Long Staple)',
    hindiName: 'कपास (मध्यम/लंबा रेशा)',
    commodityGroup: 'Fibre Crops',
    category: 'Fibre Crops',
    aliases: ['cotton', 'cotton_medium_long', 'kapas', 'bt cotton']
  },
  cotton_long: {
    cropCommodityId: 'cotton_long',
    officialCommodityName: 'Cotton',
    displayName: 'Cotton (Extra Long Staple)',
    hindiName: 'कपास (लंबा रेशा)',
    commodityGroup: 'Fibre Crops',
    category: 'Fibre Crops',
    aliases: ['cotton', 'cotton_long', 'suvin', 'dch32']
  },
  sugarcane: {
    cropCommodityId: 'sugarcane',
    officialCommodityName: 'Sugarcane',
    displayName: 'Sugarcane',
    hindiName: 'गन्ना',
    commodityGroup: 'Sugar & Commercial Crops',
    category: 'Sugar & Commercial Crops',
    aliases: ['sugarcane', 'ganna', 'kabbu', 'karumbu', 'cheruku']
  },
  jute: {
    cropCommodityId: 'jute',
    officialCommodityName: 'Jute',
    displayName: 'Jute / Patson',
    hindiName: 'जूट / पटसन',
    commodityGroup: 'Fibre Crops',
    category: 'Fibre Crops',
    aliases: ['jute', 'patson', 'san']
  }
};

export function getCanonicalCropById(cropId: string): CropMasterRecord | undefined {
  if (!cropId) return undefined;
  const cleanId = cropId.toLowerCase().trim();
  
  // Exact match
  const exact = COMPLETE_INDIA_CROP_MASTER.find(c => c.cropId.toLowerCase() === cleanId);
  if (exact) return exact;

  // Alias match via mapping table
  const mapped = OFFICIAL_COMMODITY_MAPPINGS[cleanId];
  if (mapped) {
    const fromMapped = COMPLETE_INDIA_CROP_MASTER.find(c => c.cropId.toLowerCase() === mapped.cropCommodityId.toLowerCase());
    if (fromMapped) return fromMapped;
  }

  // Soft match
  return COMPLETE_INDIA_CROP_MASTER.find(c => 
    c.cropId.toLowerCase().includes(cleanId) || 
    c.cropName.toLowerCase().includes(cleanId) ||
    cleanId.includes(c.cropId.toLowerCase())
  );
}

export function getCanonicalCropList(): CropMasterRecord[] {
  return COMPLETE_INDIA_CROP_MASTER;
}

export function getOfficialCommodityMapping(cropId: string): OfficialCommodityMapping | undefined {
  if (!cropId) return undefined;
  const clean = cropId.toLowerCase().trim();
  if (OFFICIAL_COMMODITY_MAPPINGS[clean]) {
    return OFFICIAL_COMMODITY_MAPPINGS[clean];
  }
  const crop = getCanonicalCropById(clean);
  if (crop) {
    return {
      cropCommodityId: crop.cropId,
      officialCommodityName: crop.cropName.split('(')[0].trim(),
      displayName: crop.cropName,
      hindiName: crop.localNames?.hi || crop.cropName,
      commodityGroup: crop.category,
      category: crop.category,
      aliases: [crop.cropId, crop.cropName.toLowerCase()]
    };
  }
  return undefined;
}

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
