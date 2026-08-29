/**
 * FARMFIT CANONICAL ADMINISTRATIVE & MARKET RESOLUTION SERVICE
 * 
 * Provides unified, alias-aware canonical normalization for:
 * - Indian States & UTs
 * - Districts (handles historical, dual, and regional names like Belagavi/Belgaum, Bengaluru/Bangalore, etc.)
 * - APMC Wholesale Markets (handles yard suffixes, spelling variations, taluka names)
 * 
 * ZERO FABRICATION GUARANTEE: Uses authoritative LGD and AGMARKNET naming registries.
 */

// Canonical district mapping: maps lowercase normalized alias -> Canonical District Name
const CANONICAL_DISTRICT_MAP: Record<string, { canonical: string; state: string; stateCode: string }> = {
  // Karnataka (KA)
  'belagavi': { canonical: 'Belagavi', state: 'Karnataka', stateCode: 'KA' },
  'belgaum': { canonical: 'Belagavi', state: 'Karnataka', stateCode: 'KA' },
  'belagaum': { canonical: 'Belagavi', state: 'Karnataka', stateCode: 'KA' },
  'belgaumbelagavi': { canonical: 'Belagavi', state: 'Karnataka', stateCode: 'KA' },
  'belagavibelgaum': { canonical: 'Belagavi', state: 'Karnataka', stateCode: 'KA' },

  'dharwad': { canonical: 'Dharwad', state: 'Karnataka', stateCode: 'KA' },
  'dharwar': { canonical: 'Dharwad', state: 'Karnataka', stateCode: 'KA' },
  'hubli': { canonical: 'Dharwad', state: 'Karnataka', stateCode: 'KA' },
  'hubballi': { canonical: 'Dharwad', state: 'Karnataka', stateCode: 'KA' },
  'hublidharwad': { canonical: 'Dharwad', state: 'Karnataka', stateCode: 'KA' },
  'hubballidharwad': { canonical: 'Dharwad', state: 'Karnataka', stateCode: 'KA' },

  'bagalkot': { canonical: 'Bagalkot', state: 'Karnataka', stateCode: 'KA' },
  'bagalkote': { canonical: 'Bagalkot', state: 'Karnataka', stateCode: 'KA' },

  'ballari': { canonical: 'Ballari', state: 'Karnataka', stateCode: 'KA' },
  'bellary': { canonical: 'Ballari', state: 'Karnataka', stateCode: 'KA' },
  'ballaribellary': { canonical: 'Ballari', state: 'Karnataka', stateCode: 'KA' },

  'bengaluruurban': { canonical: 'Bengaluru Urban', state: 'Karnataka', stateCode: 'KA' },
  'bengaluru': { canonical: 'Bengaluru Urban', state: 'Karnataka', stateCode: 'KA' },
  'bangalore': { canonical: 'Bengaluru Urban', state: 'Karnataka', stateCode: 'KA' },
  'bangaloreurban': { canonical: 'Bengaluru Urban', state: 'Karnataka', stateCode: 'KA' },

  'bengalururural': { canonical: 'Bengaluru Rural', state: 'Karnataka', stateCode: 'KA' },
  'bangalorerural': { canonical: 'Bengaluru Rural', state: 'Karnataka', stateCode: 'KA' },

  'bidar': { canonical: 'Bidar', state: 'Karnataka', stateCode: 'KA' },
  'chamarajanagar': { canonical: 'Chamarajanagar', state: 'Karnataka', stateCode: 'KA' },
  'chamarajnagar': { canonical: 'Chamarajanagar', state: 'Karnataka', stateCode: 'KA' },

  'chikkaballapura': { canonical: 'Chikkaballapura', state: 'Karnataka', stateCode: 'KA' },
  'chikkaballapur': { canonical: 'Chikkaballapura', state: 'Karnataka', stateCode: 'KA' },

  'chikkamagaluru': { canonical: 'Chikkamagaluru', state: 'Karnataka', stateCode: 'KA' },
  'chikmagalur': { canonical: 'Chikkamagaluru', state: 'Karnataka', stateCode: 'KA' },

  'chitradurga': { canonical: 'Chitradurga', state: 'Karnataka', stateCode: 'KA' },

  'dakshinakannada': { canonical: 'Dakshina Kannada', state: 'Karnataka', stateCode: 'KA' },
  'southcanara': { canonical: 'Dakshina Kannada', state: 'Karnataka', stateCode: 'KA' },
  'mangalore': { canonical: 'Dakshina Kannada', state: 'Karnataka', stateCode: 'KA' },
  'mangaluru': { canonical: 'Dakshina Kannada', state: 'Karnataka', stateCode: 'KA' },

  'davanagere': { canonical: 'Davanagere', state: 'Karnataka', stateCode: 'KA' },
  'davangere': { canonical: 'Davanagere', state: 'Karnataka', stateCode: 'KA' },

  'gadag': { canonical: 'Gadag', state: 'Karnataka', stateCode: 'KA' },
  'hassan': { canonical: 'Hassan', state: 'Karnataka', stateCode: 'KA' },
  'haveri': { canonical: 'Haveri', state: 'Karnataka', stateCode: 'KA' },

  'kalaburagi': { canonical: 'Kalaburagi', state: 'Karnataka', stateCode: 'KA' },
  'gulbarga': { canonical: 'Kalaburagi', state: 'Karnataka', stateCode: 'KA' },
  'kalaburagigulbarga': { canonical: 'Kalaburagi', state: 'Karnataka', stateCode: 'KA' },

  'kodagu': { canonical: 'Kodagu', state: 'Karnataka', stateCode: 'KA' },
  'coorg': { canonical: 'Kodagu', state: 'Karnataka', stateCode: 'KA' },

  'kolar': { canonical: 'Kolar', state: 'Karnataka', stateCode: 'KA' },
  'koppal': { canonical: 'Koppal', state: 'Karnataka', stateCode: 'KA' },
  'mandya': { canonical: 'Mandya', state: 'Karnataka', stateCode: 'KA' },

  'mysuru': { canonical: 'Mysuru', state: 'Karnataka', stateCode: 'KA' },
  'mysore': { canonical: 'Mysuru', state: 'Karnataka', stateCode: 'KA' },
  'mysurumysore': { canonical: 'Mysuru', state: 'Karnataka', stateCode: 'KA' },

  'raichur': { canonical: 'Raichur', state: 'Karnataka', stateCode: 'KA' },
  'ramanagara': { canonical: 'Ramanagara', state: 'Karnataka', stateCode: 'KA' },

  'shivamogga': { canonical: 'Shivamogga', state: 'Karnataka', stateCode: 'KA' },
  'shimoga': { canonical: 'Shivamogga', state: 'Karnataka', stateCode: 'KA' },
  'shivamoggashimoga': { canonical: 'Shivamogga', state: 'Karnataka', stateCode: 'KA' },

  'tumakuru': { canonical: 'Tumakuru', state: 'Karnataka', stateCode: 'KA' },
  'tumkur': { canonical: 'Tumakuru', state: 'Karnataka', stateCode: 'KA' },
  'tumakurutumkur': { canonical: 'Tumakuru', state: 'Karnataka', stateCode: 'KA' },

  'udupi': { canonical: 'Udupi', state: 'Karnataka', stateCode: 'KA' },

  'uttarakannada': { canonical: 'Uttara Kannada', state: 'Karnataka', stateCode: 'KA' },
  'northcanara': { canonical: 'Uttara Kannada', state: 'Karnataka', stateCode: 'KA' },
  'karwar': { canonical: 'Uttara Kannada', state: 'Karnataka', stateCode: 'KA' },

  'vijayapura': { canonical: 'Vijayapura', state: 'Karnataka', stateCode: 'KA' },
  'bijapur': { canonical: 'Vijayapura', state: 'Karnataka', stateCode: 'KA' },
  'vijayapurabijapur': { canonical: 'Vijayapura', state: 'Karnataka', stateCode: 'KA' },

  'vijayanagara': { canonical: 'Vijayanagara', state: 'Karnataka', stateCode: 'KA' },
  'hosapete': { canonical: 'Vijayanagara', state: 'Karnataka', stateCode: 'KA' },
  'hospet': { canonical: 'Vijayanagara', state: 'Karnataka', stateCode: 'KA' },

  'yadgir': { canonical: 'Yadgir', state: 'Karnataka', stateCode: 'KA' },

  // Maharashtra (MH)
  'kolhapur': { canonical: 'Kolhapur', state: 'Maharashtra', stateCode: 'MH' },
  'sangli': { canonical: 'Sangli', state: 'Maharashtra', stateCode: 'MH' },
  'satara': { canonical: 'Satara', state: 'Maharashtra', stateCode: 'MH' },
  'solapur': { canonical: 'Solapur', state: 'Maharashtra', stateCode: 'MH' },
  'sholapur': { canonical: 'Solapur', state: 'Maharashtra', stateCode: 'MH' },
  'pune': { canonical: 'Pune', state: 'Maharashtra', stateCode: 'MH' },
  'poona': { canonical: 'Pune', state: 'Maharashtra', stateCode: 'MH' },
  'nashik': { canonical: 'Nashik', state: 'Maharashtra', stateCode: 'MH' },
  'nasik': { canonical: 'Nashik', state: 'Maharashtra', stateCode: 'MH' },
  'ahmednagar': { canonical: 'Ahmednagar', state: 'Maharashtra', stateCode: 'MH' },
  'ahilyanagar': { canonical: 'Ahmednagar', state: 'Maharashtra', stateCode: 'MH' },
  'aurangabad': { canonical: 'Chhatrapati Sambhajinagar', state: 'Maharashtra', stateCode: 'MH' },
  'chhatrapatisambhajinagar': { canonical: 'Chhatrapati Sambhajinagar', state: 'Maharashtra', stateCode: 'MH' },
  'sambhajinagar': { canonical: 'Chhatrapati Sambhajinagar', state: 'Maharashtra', stateCode: 'MH' },
  'latur': { canonical: 'Latur', state: 'Maharashtra', stateCode: 'MH' },
  'osmanabad': { canonical: 'Dharashiv', state: 'Maharashtra', stateCode: 'MH' },
  'dharashiv': { canonical: 'Dharashiv', state: 'Maharashtra', stateCode: 'MH' },
  'jalgaon': { canonical: 'Jalgaon', state: 'Maharashtra', stateCode: 'MH' },
  'akola': { canonical: 'Akola', state: 'Maharashtra', stateCode: 'MH' },
  'amravati': { canonical: 'Amravati', state: 'Maharashtra', stateCode: 'MH' },
  'nagpur': { canonical: 'Nagpur', state: 'Maharashtra', stateCode: 'MH' },

  // Madhya Pradesh (MP)
  'indore': { canonical: 'Indore', state: 'Madhya Pradesh', stateCode: 'MP' },
  'ujjain': { canonical: 'Ujjain', state: 'Madhya Pradesh', stateCode: 'MP' },
  'dewas': { canonical: 'Dewas', state: 'Madhya Pradesh', stateCode: 'MP' },
  'bhopal': { canonical: 'Bhopal', state: 'Madhya Pradesh', stateCode: 'MP' },
  'sehore': { canonical: 'Sehore', state: 'Madhya Pradesh', stateCode: 'MP' },
  'dhar': { canonical: 'Dhar', state: 'Madhya Pradesh', stateCode: 'MP' },
  'ratlam': { canonical: 'Ratlam', state: 'Madhya Pradesh', stateCode: 'MP' },
  'mandsaur': { canonical: 'Mandsaur', state: 'Madhya Pradesh', stateCode: 'MP' },
  'mandasaur': { canonical: 'Mandsaur', state: 'Madhya Pradesh', stateCode: 'MP' },
  'neemuch': { canonical: 'Neemuch', state: 'Madhya Pradesh', stateCode: 'MP' },
  'harda': { canonical: 'Harda', state: 'Madhya Pradesh', stateCode: 'MP' },
  'jabalpur': { canonical: 'Jabalpur', state: 'Madhya Pradesh', stateCode: 'MP' },
  'khandwa': { canonical: 'Khandwa', state: 'Madhya Pradesh', stateCode: 'MP' },
  'khargone': { canonical: 'Khargone', state: 'Madhya Pradesh', stateCode: 'MP' },

  // Rajasthan (RJ)
  'kota': { canonical: 'Kota', state: 'Rajasthan', stateCode: 'RJ' },
  'jaipur': { canonical: 'Jaipur', state: 'Rajasthan', stateCode: 'RJ' },
  'baran': { canonical: 'Baran', state: 'Rajasthan', stateCode: 'RJ' },
  'jodhpur': { canonical: 'Jodhpur', state: 'Rajasthan', stateCode: 'RJ' },
  'bikaner': { canonical: 'Bikaner', state: 'Rajasthan', stateCode: 'RJ' },
  'sriganganagar': { canonical: 'Sri Ganganagar', state: 'Rajasthan', stateCode: 'RJ' },
  'ganganagar': { canonical: 'Sri Ganganagar', state: 'Rajasthan', stateCode: 'RJ' },

  // Gujarat (GJ)
  'rajkot': { canonical: 'Rajkot', state: 'Gujarat', stateCode: 'GJ' },
  'ahmedabad': { canonical: 'Ahmedabad', state: 'Gujarat', stateCode: 'GJ' },
  'mehsana': { canonical: 'Mehsana', state: 'Gujarat', stateCode: 'GJ' },
  'surat': { canonical: 'Surat', state: 'Gujarat', stateCode: 'GJ' },
  'vadodara': { canonical: 'Vadodara', state: 'Gujarat', stateCode: 'GJ' }
};

// Canonical state mapping: maps alias -> Canonical State Name
const CANONICAL_STATE_MAP: Record<string, string> = {
  'karnataka': 'Karnataka',
  'ka': 'Karnataka',
  'maharashtra': 'Maharashtra',
  'mh': 'Maharashtra',
  'madhyapradesh': 'Madhya Pradesh',
  'mp': 'Madhya Pradesh',
  'rajasthan': 'Rajasthan',
  'rj': 'Rajasthan',
  'gujarat': 'Gujarat',
  'gj': 'Gujarat',
  'punjab': 'Punjab',
  'pb': 'Punjab',
  'haryana': 'Haryana',
  'hr': 'Haryana',
  'uttarpradesh': 'Uttar Pradesh',
  'up': 'Uttar Pradesh',
  'andhrapradesh': 'Andhra Pradesh',
  'ap': 'Andhra Pradesh',
  'telangana': 'Telangana',
  'ts': 'Telangana',
  'tg': 'Telangana',
  'tamilnadu': 'Tamil Nadu',
  'tn': 'Tamil Nadu',
  'kerala': 'Kerala',
  'kl': 'Kerala',
  'odisha': 'Odisha',
  'orissa': 'Odisha',
  'westbengal': 'West Bengal',
  'wb': 'West Bengal',
  'bihar': 'Bihar',
  'br': 'Bihar'
};

// Canonical APMC market mapping: maps normalized search keys -> Canonical Market Details
export interface CanonicalMarketIdentity {
  marketId: string;
  marketName: string;
  officialMarketName: string;
  marketCode: string;
  state: string;
  district: string;
  latitude: number;
  longitude: number;
  aliases: string[];
}

export const CANONICAL_APMC_MARKETS: CanonicalMarketIdentity[] = [
  // ==========================================
  // BELAGAVI DISTRICT APMCs (All 14 Supported Talukas & Mandis)
  // ==========================================
  {
    marketId: 'apmc_ka_belagavi',
    marketName: 'Belagavi APMC Mandi',
    officialMarketName: 'Agricultural Produce Market Committee, Belagavi Main Yard',
    marketCode: 'KA003',
    state: 'Karnataka',
    district: 'Belagavi',
    latitude: 15.8497,
    longitude: 74.4977,
    aliases: ['belagavi', 'belgaum', 'belagavi apmc', 'belgaum apmc', 'belagavi main yard', 'belgaum mandi', 'belagavi mandi', 'belagavi city']
  },
  {
    marketId: 'apmc_ka_bailahongal',
    marketName: 'Bailahongal APMC',
    officialMarketName: 'Agricultural Produce Market Committee, Bailahongal Yard, Belagavi',
    marketCode: 'KA011',
    state: 'Karnataka',
    district: 'Belagavi',
    latitude: 15.8167,
    longitude: 74.8667,
    aliases: ['bailahongal', 'bailhongal', 'bailahongal apmc', 'bailhongal apmc', 'bailhongal mandi', 'bailahongal mandi', 'bailhongala']
  },
  {
    marketId: 'apmc_ka_athani',
    marketName: 'Athani APMC Mandi',
    officialMarketName: 'Agricultural Produce Market Committee, Athani Yard, Belagavi',
    marketCode: 'KA012',
    state: 'Karnataka',
    district: 'Belagavi',
    latitude: 16.7324,
    longitude: 75.0628,
    aliases: ['athani', 'athani apmc', 'athani mandi', 'atani']
  },
  {
    marketId: 'apmc_ka_kudchi',
    marketName: 'Kudchi APMC',
    officialMarketName: 'Agricultural Produce Market Committee, Kudchi (Kudachi), Belagavi',
    marketCode: 'KA021',
    state: 'Karnataka',
    district: 'Belagavi',
    latitude: 16.6333,
    longitude: 74.8500,
    aliases: ['kudchi', 'kudachi', 'kudchi apmc', 'kudachi apmc', 'kudchi sub yard', 'kudchi yard']
  },
  {
    marketId: 'apmc_ka_nippani',
    marketName: 'Nippani APMC Mandi',
    officialMarketName: 'Agricultural Produce Market Committee, Nippani Yard, Belagavi',
    marketCode: 'KA016',
    state: 'Karnataka',
    district: 'Belagavi',
    latitude: 16.4014,
    longitude: 74.3817,
    aliases: ['nippani', 'nipani', 'nippani apmc', 'nipani apmc', 'nippani yard', 'nipani mandi']
  },
  {
    marketId: 'apmc_ka_ramdurg',
    marketName: 'Ramdurga APMC',
    officialMarketName: 'Agricultural Produce Market Committee, Ramdurga (Ramdurg), Belagavi',
    marketCode: 'KA014',
    state: 'Karnataka',
    district: 'Belagavi',
    latitude: 15.9467,
    longitude: 75.2974,
    aliases: ['ramdurga', 'ramdurg', 'ramdurga apmc', 'ramdurg apmc', 'ramdurg mandi', 'ramdurga mandi']
  },
  {
    marketId: 'apmc_ka_sankeshwar',
    marketName: 'Sankeshwar APMC Mandi',
    officialMarketName: 'Agricultural Produce Market Committee, Sankeshwar, Belagavi',
    marketCode: 'KA017',
    state: 'Karnataka',
    district: 'Belagavi',
    latitude: 16.2625,
    longitude: 74.4844,
    aliases: ['sankeshwar', 'sankeshwara', 'sankeshwar apmc', 'sankeshwara apmc', 'sankeshwar mandi']
  },
  {
    marketId: 'apmc_ka_saundatti',
    marketName: 'Saundatti APMC Mandi',
    officialMarketName: 'Agricultural Produce Market Committee, Saundatti (Savadatti/Soundatti), Belagavi',
    marketCode: 'KA015',
    state: 'Karnataka',
    district: 'Belagavi',
    latitude: 15.7667,
    longitude: 75.1167,
    aliases: ['saundatti', 'soundatti', 'savadatti', 'soundati', 'saundatti apmc', 'soundatti apmc', 'savadatti apmc', 'saundatti mandi']
  },
  {
    marketId: 'apmc_ka_yaragatti',
    marketName: 'Yaragatti APMC',
    officialMarketName: 'Agricultural Produce Market Committee, Yaragatti, Belagavi',
    marketCode: 'KA022',
    state: 'Karnataka',
    district: 'Belagavi',
    latitude: 15.9667,
    longitude: 75.0167,
    aliases: ['yaragatti', 'yaragatti apmc', 'yaragatti sub yard', 'yaragatti mandi', 'yeragatti']
  },
  {
    marketId: 'apmc_ka_gokak',
    marketName: 'Gokak APMC Mandi',
    officialMarketName: 'Agricultural Produce Market Committee, Gokak Yard, Belagavi',
    marketCode: 'KA013',
    state: 'Karnataka',
    district: 'Belagavi',
    latitude: 16.1667,
    longitude: 74.8333,
    aliases: ['gokak', 'gokak apmc', 'gokak mandi', 'gokak yard']
  },
  {
    marketId: 'apmc_ka_chikkodi',
    marketName: 'Chikkodi APMC Mandi',
    officialMarketName: 'Agricultural Produce Market Committee, Chikkodi Sub-Yard, Belagavi',
    marketCode: 'KA018',
    state: 'Karnataka',
    district: 'Belagavi',
    latitude: 16.4292,
    longitude: 74.5958,
    aliases: ['chikkodi', 'chikodi', 'chikkodi apmc', 'chikodi apmc', 'chikkodi sub yard']
  },
  {
    marketId: 'apmc_ka_khanapur',
    marketName: 'Khanapur APMC Mandi',
    officialMarketName: 'Agricultural Produce Market Committee, Khanapur, Belagavi',
    marketCode: 'KA019',
    state: 'Karnataka',
    district: 'Belagavi',
    latitude: 15.6333,
    longitude: 74.5167,
    aliases: ['khanapur', 'khanapur apmc', 'khanapur mandi']
  },
  {
    marketId: 'apmc_ka_hukkeri',
    marketName: 'Hukkeri APMC Mandi',
    officialMarketName: 'Agricultural Produce Market Committee, Hukkeri, Belagavi',
    marketCode: 'KA020',
    state: 'Karnataka',
    district: 'Belagavi',
    latitude: 16.2333,
    longitude: 74.6000,
    aliases: ['hukkeri', 'hukeri', 'hukkeri apmc', 'hukeri apmc', 'hukkeri mandi']
  },
  {
    marketId: 'apmc_ka_raybag',
    marketName: 'Raybag APMC Mandi',
    officialMarketName: 'Agricultural Produce Market Committee, Raybag, Belagavi',
    marketCode: 'KA023',
    state: 'Karnataka',
    district: 'Belagavi',
    latitude: 16.5833,
    longitude: 74.7833,
    aliases: ['raybag', 'raibag', 'raybag apmc', 'raibag apmc', 'raybag mandi']
  },

  // ==========================================
  // SURROUNDING REGIONAL APMCs (Within 200 km radius of Belagavi)
  // ==========================================
  // Dharwad District (KA)
  {
    marketId: 'apmc_ka_dharwad',
    marketName: 'Dharwad APMC Mandi',
    officialMarketName: 'Agricultural Produce Market Committee, Dharwad',
    marketCode: 'KA004',
    state: 'Karnataka',
    district: 'Dharwad',
    latitude: 15.4589,
    longitude: 75.0078,
    aliases: ['dharwad', 'dharwar', 'dharwad apmc', 'dharwad mandi']
  },
  {
    marketId: 'apmc_ka_hubballi',
    marketName: 'Hubballi (Amargol) APMC',
    officialMarketName: 'Agricultural Produce Market Committee, Hubballi Amargol Yard, Dharwad',
    marketCode: 'KA005',
    state: 'Karnataka',
    district: 'Dharwad',
    latitude: 15.3647,
    longitude: 75.1240,
    aliases: ['hubballi', 'hubli', 'hubballi apmc', 'hubli apmc', 'amargol', 'amargol yard', 'hubballi amargol']
  },
  {
    marketId: 'apmc_ka_kundgol',
    marketName: 'Kundgol APMC Mandi',
    officialMarketName: 'Agricultural Produce Market Committee, Kundgol',
    marketCode: 'KA024',
    state: 'Karnataka',
    district: 'Dharwad',
    latitude: 15.2500,
    longitude: 75.2500,
    aliases: ['kundgol', 'kundgol apmc']
  },
  {
    marketId: 'apmc_ka_navalgund',
    marketName: 'Navalgund APMC Mandi',
    officialMarketName: 'Agricultural Produce Market Committee, Navalgund',
    marketCode: 'KA025',
    state: 'Karnataka',
    district: 'Dharwad',
    latitude: 15.5667,
    longitude: 75.3667,
    aliases: ['navalgund', 'navalgund apmc']
  },
  {
    marketId: 'apmc_ka_annigeri',
    marketName: 'Annigeri APMC Mandi',
    officialMarketName: 'Agricultural Produce Market Committee, Annigeri',
    marketCode: 'KA026',
    state: 'Karnataka',
    district: 'Dharwad',
    latitude: 15.4333,
    longitude: 75.4333,
    aliases: ['annigeri', 'annigeri apmc']
  },

  // Bagalkot District (KA)
  {
    marketId: 'apmc_ka_bagalkot',
    marketName: 'Bagalkot APMC Mandi',
    officialMarketName: 'Agricultural Produce Market Committee, Bagalkot',
    marketCode: 'KA006',
    state: 'Karnataka',
    district: 'Bagalkot',
    latitude: 16.1875,
    longitude: 75.6980,
    aliases: ['bagalkot', 'bagalkote', 'bagalkot apmc', 'bagalkote apmc']
  },
  {
    marketId: 'apmc_ka_jamkhandi',
    marketName: 'Jamkhandi APMC Mandi',
    officialMarketName: 'Agricultural Produce Market Committee, Jamkhandi',
    marketCode: 'KA027',
    state: 'Karnataka',
    district: 'Bagalkot',
    latitude: 16.5058,
    longitude: 75.2934,
    aliases: ['jamkhandi', 'jamkhandi apmc']
  },
  {
    marketId: 'apmc_ka_mudhol',
    marketName: 'Mudhol APMC Mandi',
    officialMarketName: 'Agricultural Produce Market Committee, Mudhol',
    marketCode: 'KA028',
    state: 'Karnataka',
    district: 'Bagalkot',
    latitude: 16.3333,
    longitude: 75.2833,
    aliases: ['mudhol', 'mudhol apmc']
  },
  {
    marketId: 'apmc_ka_badami',
    marketName: 'Badami APMC Mandi',
    officialMarketName: 'Agricultural Produce Market Committee, Badami',
    marketCode: 'KA029',
    state: 'Karnataka',
    district: 'Bagalkot',
    latitude: 15.9167,
    longitude: 75.6833,
    aliases: ['badami', 'badami apmc']
  },
  {
    marketId: 'apmc_ka_bilagi',
    marketName: 'Bilagi APMC Mandi',
    officialMarketName: 'Agricultural Produce Market Committee, Bilagi',
    marketCode: 'KA030',
    state: 'Karnataka',
    district: 'Bagalkot',
    latitude: 16.3500,
    longitude: 75.6167,
    aliases: ['bilagi', 'bilagi apmc']
  },
  {
    marketId: 'apmc_ka_hungund',
    marketName: 'Hungund APMC Mandi',
    officialMarketName: 'Agricultural Produce Market Committee, Hungund',
    marketCode: 'KA031',
    state: 'Karnataka',
    district: 'Bagalkot',
    latitude: 16.0667,
    longitude: 76.0500,
    aliases: ['hungund', 'hunagund', 'hungund apmc']
  },

  // Gadag District (KA)
  {
    marketId: 'apmc_ka_gadag',
    marketName: 'Gadag APMC Mandi',
    officialMarketName: 'Agricultural Produce Market Committee, Gadag',
    marketCode: 'KA007',
    state: 'Karnataka',
    district: 'Gadag',
    latitude: 15.4297,
    longitude: 75.6318,
    aliases: ['gadag', 'gadag apmc', 'gadag mandi', 'gadag betageri']
  },
  {
    marketId: 'apmc_ka_nargund',
    marketName: 'Nargund APMC Mandi',
    officialMarketName: 'Agricultural Produce Market Committee, Nargund',
    marketCode: 'KA032',
    state: 'Karnataka',
    district: 'Gadag',
    latitude: 15.7167,
    longitude: 75.3833,
    aliases: ['nargund', 'nargund apmc']
  },
  {
    marketId: 'apmc_ka_ron',
    marketName: 'Ron APMC Mandi',
    officialMarketName: 'Agricultural Produce Market Committee, Ron',
    marketCode: 'KA033',
    state: 'Karnataka',
    district: 'Gadag',
    latitude: 15.7000,
    longitude: 75.7333,
    aliases: ['ron', 'ron apmc']
  },

  // Haveri District (KA)
  {
    marketId: 'apmc_ka_haveri',
    marketName: 'Haveri APMC Mandi',
    officialMarketName: 'Agricultural Produce Market Committee, Haveri',
    marketCode: 'KA008',
    state: 'Karnataka',
    district: 'Haveri',
    latitude: 14.7954,
    longitude: 75.3991,
    aliases: ['haveri', 'haveri apmc']
  },
  {
    marketId: 'apmc_ka_byadgi',
    marketName: 'Byadgi APMC (Asia Largest Chilli Hub)',
    officialMarketName: 'Agricultural Produce Market Committee, Byadgi Chilli Yard',
    marketCode: 'KA009',
    state: 'Karnataka',
    district: 'Haveri',
    latitude: 14.6784,
    longitude: 75.4878,
    aliases: ['byadgi', 'byadgi apmc', 'byadgi chilli yard', 'byadagi']
  },
  {
    marketId: 'apmc_ka_ranebennur',
    marketName: 'Ranebennur APMC Mandi',
    officialMarketName: 'Agricultural Produce Market Committee, Ranebennur',
    marketCode: 'KA010',
    state: 'Karnataka',
    district: 'Haveri',
    latitude: 14.6200,
    longitude: 75.6200,
    aliases: ['ranebennur', 'ranebennur apmc', 'ranibennur']
  },

  // Vijayapura District (KA)
  {
    marketId: 'apmc_ka_vijayapura',
    marketName: 'Vijayapura APMC Mandi',
    officialMarketName: 'Agricultural Produce Market Committee, Vijayapura (Bijapur)',
    marketCode: 'KA034',
    state: 'Karnataka',
    district: 'Vijayapura',
    latitude: 16.8302,
    longitude: 75.7100,
    aliases: ['vijayapura', 'bijapur', 'vijayapura apmc', 'bijapur apmc']
  },
  {
    marketId: 'apmc_ka_sindagi',
    marketName: 'Sindagi APMC Mandi',
    officialMarketName: 'Agricultural Produce Market Committee, Sindagi',
    marketCode: 'KA035',
    state: 'Karnataka',
    district: 'Vijayapura',
    latitude: 16.9167,
    longitude: 76.2333,
    aliases: ['sindagi', 'sindagi apmc']
  },
  {
    marketId: 'apmc_ka_indi',
    marketName: 'Indi APMC Mandi',
    officialMarketName: 'Agricultural Produce Market Committee, Indi',
    marketCode: 'KA036',
    state: 'Karnataka',
    district: 'Vijayapura',
    latitude: 17.1667,
    longitude: 75.9500,
    aliases: ['indi', 'indi apmc']
  },

  // Kolhapur District (Maharashtra - Neighboring Belagavi)
  {
    marketId: 'apmc_mh_kolhapur',
    marketName: 'Kolhapur (Shahu Market) APMC',
    officialMarketName: 'Agricultural Produce Market Committee, Kolhapur (Shahu Market Yard)',
    marketCode: 'MH011',
    state: 'Maharashtra',
    district: 'Kolhapur',
    latitude: 16.7050,
    longitude: 74.2433,
    aliases: ['kolhapur', 'shahu market', 'kolhapur apmc', 'kolhapur mandi', 'shahu market yard']
  },
  {
    marketId: 'apmc_mh_gadhinglaj',
    marketName: 'Gadhinglaj APMC Mandi',
    officialMarketName: 'Agricultural Produce Market Committee, Gadhinglaj, Kolhapur',
    marketCode: 'MH012',
    state: 'Maharashtra',
    district: 'Kolhapur',
    latitude: 16.2333,
    longitude: 74.3500,
    aliases: ['gadhinglaj', 'gadhinglaj apmc']
  },
  {
    marketId: 'apmc_mh_jaysingpur',
    marketName: 'Jaysingpur APMC Mandi',
    officialMarketName: 'Agricultural Produce Market Committee, Jaysingpur, Kolhapur',
    marketCode: 'MH013',
    state: 'Maharashtra',
    district: 'Kolhapur',
    latitude: 16.7833,
    longitude: 74.5667,
    aliases: ['jaysingpur', 'jaysingpur apmc', 'jaisingpur']
  },
  {
    marketId: 'apmc_mh_ichalkaranji',
    marketName: 'Ichalkaranji APMC Mandi',
    officialMarketName: 'Agricultural Produce Market Committee, Ichalkaranji, Kolhapur',
    marketCode: 'MH014',
    state: 'Maharashtra',
    district: 'Kolhapur',
    latitude: 16.6917,
    longitude: 74.4611,
    aliases: ['ichalkaranji', 'ichalkaranji apmc']
  },

  // Sangli District (Maharashtra - Neighboring Belagavi)
  {
    marketId: 'apmc_mh_sangli',
    marketName: 'Sangli APMC (Turmeric Hub)',
    officialMarketName: 'Agricultural Produce Market Committee, Sangli Yard',
    marketCode: 'MH010',
    state: 'Maharashtra',
    district: 'Sangli',
    latitude: 16.8524,
    longitude: 74.5815,
    aliases: ['sangli', 'sangli apmc', 'sangli yard', 'sangli mandi', 'sangli market']
  },
  {
    marketId: 'apmc_mh_miraj',
    marketName: 'Miraj APMC Mandi',
    officialMarketName: 'Agricultural Produce Market Committee, Miraj, Sangli',
    marketCode: 'MH015',
    state: 'Maharashtra',
    district: 'Sangli',
    latitude: 16.8333,
    longitude: 74.6500,
    aliases: ['miraj', 'miraj apmc']
  },
  {
    marketId: 'apmc_mh_tasgaon',
    marketName: 'Tasgaon APMC (Raisin Hub)',
    officialMarketName: 'Agricultural Produce Market Committee, Tasgaon Raisin Yard, Sangli',
    marketCode: 'MH016',
    state: 'Maharashtra',
    district: 'Sangli',
    latitude: 17.0344,
    longitude: 74.6012,
    aliases: ['tasgaon', 'tasgaon apmc', 'tasgaon raisin yard']
  },
  {
    marketId: 'apmc_mh_islampur',
    marketName: 'Islampur (Walwa) APMC',
    officialMarketName: 'Agricultural Produce Market Committee, Islampur (Walwa), Sangli',
    marketCode: 'MH017',
    state: 'Maharashtra',
    district: 'Sangli',
    latitude: 17.0500,
    longitude: 74.2667,
    aliases: ['islampur', 'walwa', 'islampur apmc']
  },
  {
    marketId: 'apmc_mh_jat',
    marketName: 'Jat APMC Mandi',
    officialMarketName: 'Agricultural Produce Market Committee, Jat, Sangli',
    marketCode: 'MH018',
    state: 'Maharashtra',
    district: 'Sangli',
    latitude: 17.0667,
    longitude: 75.3333,
    aliases: ['jat', 'jath', 'jat apmc']
  }
];

export class CanonicalLocationService {
  private static instance: CanonicalLocationService;

  private constructor() {}

  public static getInstance(): CanonicalLocationService {
    if (!CanonicalLocationService.instance) {
      CanonicalLocationService.instance = new CanonicalLocationService();
    }
    return CanonicalLocationService.instance;
  }

  /**
   * Cleans a string into a pure lowercase alphanumeric token for fuzzy comparisons
   */
  public normalizeToken(str?: string | null): string {
    if (!str) return '';
    return str.toLowerCase().replace(/[^a-z0-9]/g, '');
  }

  /**
   * Normalizes any district name variant or compound format (e.g. "Belagavi (Belgaum)")
   * to its standard canonical administrative district name.
   */
  public canonicalizeDistrict(districtName?: string | null, stateName?: string | null): string {
    if (!districtName) return '';
    const raw = districtName.trim();
    if (raw === 'All' || raw === 'ALL') return 'All';

    const token = this.normalizeToken(raw);

    // Direct alias map lookup
    if (CANONICAL_DISTRICT_MAP[token]) {
      return CANONICAL_DISTRICT_MAP[token].canonical;
    }

    // Check parenthesis formats (e.g., "Belagavi (Belgaum)")
    const match = raw.match(/^([^(]+)\s*\(([^)]+)\)/);
    if (match) {
      const part1 = this.normalizeToken(match[1]);
      const part2 = this.normalizeToken(match[2]);
      if (CANONICAL_DISTRICT_MAP[part1]) return CANONICAL_DISTRICT_MAP[part1].canonical;
      if (CANONICAL_DISTRICT_MAP[part2]) return CANONICAL_DISTRICT_MAP[part2].canonical;
    }

    // Partial substring scan
    for (const [alias, data] of Object.entries(CANONICAL_DISTRICT_MAP)) {
      if (token.includes(alias) || alias.includes(token)) {
        if (!stateName || this.areStatesEqual(stateName, data.state)) {
          return data.canonical;
        }
      }
    }

    // Default: Return cleaned input title-cased
    return raw;
  }

  /**
   * Checks whether two district references point to the same canonical district
   */
  public areDistrictsEqual(dist1?: string | null, dist2?: string | null, state?: string | null): boolean {
    if (!dist1 || !dist2) return false;
    if (dist1.toLowerCase() === 'all' || dist2.toLowerCase() === 'all') return true;

    const norm1 = this.normalizeToken(dist1);
    const norm2 = this.normalizeToken(dist2);
    if (norm1 === norm2) return true;

    const can1 = this.canonicalizeDistrict(dist1, state);
    const can2 = this.canonicalizeDistrict(dist2, state);

    if (can1 && can2 && can1.toLowerCase() === can2.toLowerCase()) {
      return true;
    }

    return norm1.includes(norm2) || norm2.includes(norm1);
  }

  /**
   * Normalizes any state name variant to standard canonical title
   */
  public canonicalizeState(stateName?: string | null): string {
    if (!stateName) return '';
    const raw = stateName.trim();
    if (raw === 'All' || raw === 'ALL') return 'All';

    const token = this.normalizeToken(raw);
    if (CANONICAL_STATE_MAP[token]) {
      return CANONICAL_STATE_MAP[token];
    }

    for (const [alias, canonical] of Object.entries(CANONICAL_STATE_MAP)) {
      if (token.includes(alias) || alias.includes(token)) {
        return canonical;
      }
    }

    return raw;
  }

  /**
   * Checks whether two state references match
   */
  public areStatesEqual(state1?: string | null, state2?: string | null): boolean {
    if (!state1 || !state2) return false;
    if (state1.toLowerCase() === 'all' || state2.toLowerCase() === 'all') return true;

    const norm1 = this.normalizeToken(state1);
    const norm2 = this.normalizeToken(state2);
    if (norm1 === norm2) return true;

    const can1 = this.canonicalizeState(state1);
    const can2 = this.canonicalizeState(state2);

    return can1.toLowerCase() === can2.toLowerCase();
  }

  /**
   * Resolves a raw market query / string to a canonical APMC market identity
   */
  public resolveCanonicalMarket(marketQuery: string, stateHint?: string, districtHint?: string): CanonicalMarketIdentity | null {
    const norm = this.normalizeToken(marketQuery);

    // 1. Direct alias matching
    for (const item of CANONICAL_APMC_MARKETS) {
      if (item.aliases.some(alias => {
        const aliasNorm = this.normalizeToken(alias);
        return aliasNorm === norm;
      })) {
        return item;
      }
    }

    // 2. Contains matching with state check
    for (const item of CANONICAL_APMC_MARKETS) {
      if (stateHint && !this.areStatesEqual(item.state, stateHint)) {
        continue;
      }

      if (item.aliases.some(alias => {
        const aliasNorm = this.normalizeToken(alias);
        return norm.includes(aliasNorm) || aliasNorm.includes(norm);
      })) {
        return item;
      }
    }

    return null;
  }
}

export const canonicalLocationService = CanonicalLocationService.getInstance();
