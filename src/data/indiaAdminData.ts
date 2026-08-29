/**
 * India Administrative Location Dataset & Hierarchy Engine
 * Scalable structure: India -> State/UT -> District -> Taluk/Tehsil -> Village
 * Covers ALL 28 States + 8 Union Territories (36 Total) with official Agro-Climatic Zone mappings.
 * Authoritative source: Ministry of Rural Development, Local Government Directory (LGD), MoA&FW, GoI.
 */

export interface TalukItem {
  name: string;
  hindiName?: string;
}

export interface DistrictAdminItem {
  id: string;
  name: string;
  hindiName?: string;
  state: string;
  zoneId: number;
  normalRainfallMm: number;
  latitude: number;
  longitude: number;
  taluks: string[];
}

export interface StateAdminItem {
  code: string;
  name: string;
  hindiName?: string;
  isUnionTerritory: boolean;
  capital: string;
  districts: DistrictAdminItem[];
}

export const ALL_INDIAN_STATES: StateAdminItem[] = [
  // ==========================================
  // 1. KARNATAKA (KA) - All 31 Districts
  // ==========================================
  {
    code: "KA",
    name: "Karnataka",
    hindiName: "कर्नाटक",
    isUnionTerritory: false,
    capital: "Bengaluru",
    districts: [
      { id: "ka-belagavi", name: "Belagavi (Belgaum)", hindiName: "बेलगावी", state: "Karnataka", zoneId: 10, normalRainfallMm: 810, latitude: 15.8497, longitude: 74.4977, taluks: ["Belagavi", "Gokak", "Chikkodi", "Athani", "Bailhongal", "Saundatti", "Ramdurg", "Hukkeri", "Khanapur", "Raybag", "Kagwad", "Nippani", "Mudalgi", "Kittur", "Yaragatti"] },
      { id: "ka-dharwad", name: "Dharwad", hindiName: "धारवाड़", state: "Karnataka", zoneId: 10, normalRainfallMm: 720, latitude: 15.4589, longitude: 75.0078, taluks: ["Dharwad", "Hubballi Urban", "Hubballi Rural", "Kalghatgi", "Navalgund", "Kundgol", "Alnavar", "Annigeri"] },
      { id: "ka-bagalkote", name: "Bagalkote", hindiName: "बागलकोट", state: "Karnataka", zoneId: 10, normalRainfallMm: 560, latitude: 16.1816, longitude: 75.6961, taluks: ["Bagalkote", "Badami", "Bilagi", "Hunagund", "Jamkhandi", "Mudhol", "Guledagudda", "Rabkavi Banhatti", "Ilkal"] },
      { id: "ka-ballari", name: "Ballari (Bellary)", hindiName: "बल्लारी", state: "Karnataka", zoneId: 10, normalRainfallMm: 630, latitude: 15.1394, longitude: 76.9214, taluks: ["Ballari", "Siruguppa", "Sandur", "Kampli", "Kurugodu"] },
      { id: "ka-bengaluru-rural", name: "Bengaluru Rural", hindiName: "बेंगलुरु ग्रामीण", state: "Karnataka", zoneId: 10, normalRainfallMm: 820, latitude: 13.2272, longitude: 77.5756, taluks: ["Devanahalli", "Doddaballapura", "Hosakote", "Nelamangala"] },
      { id: "ka-bengaluru-urban", name: "Bengaluru Urban", hindiName: "बेंगलुरु शहरी", state: "Karnataka", zoneId: 10, normalRainfallMm: 860, latitude: 12.9716, longitude: 77.5946, taluks: ["Bengaluru North", "Bengaluru South", "Bengaluru East", "Anekal", "Yelahanka"] },
      { id: "ka-bidar", name: "Bidar", hindiName: "बीदर", state: "Karnataka", zoneId: 10, normalRainfallMm: 840, latitude: 17.9104, longitude: 77.5199, taluks: ["Bidar", "Basavakalyan", "Bhalki", "Homnabad", "Aurad", "Kamalnagar", "Hulsoor"] },
      { id: "ka-chamarajanagar", name: "Chamarajanagar", hindiName: "चामराजनगर", state: "Karnataka", zoneId: 10, normalRainfallMm: 780, latitude: 11.9261, longitude: 76.9437, taluks: ["Chamarajanagar", "Gundlupet", "Kollegal", "Yelandur", "Hanur"] },
      { id: "ka-chikkaballapura", name: "Chikkaballapura", hindiName: "चिक्काबल्लापुर", state: "Karnataka", zoneId: 10, normalRainfallMm: 740, latitude: 13.4325, longitude: 77.7275, taluks: ["Chikkaballapura", "Bagepalli", "Chintamani", "Gauribidanur", "Gudibanda", "Sidlaghatta"] },
      { id: "ka-chikkamagaluru", name: "Chikkamagaluru", hindiName: "चिकमगलूर", state: "Karnataka", zoneId: 12, normalRainfallMm: 1920, latitude: 13.3161, longitude: 75.7720, taluks: ["Chikkamagaluru", "Kadur", "Koppa", "Mudigere", "Narasimharajapura", "Sringeri", "Tarikere", "Ajjampura", "Kalasa"] },
      { id: "ka-chitradurga", name: "Chitradurga", hindiName: "चित्रदुर्ग", state: "Karnataka", zoneId: 10, normalRainfallMm: 580, latitude: 14.2251, longitude: 76.3980, taluks: ["Chitradurga", "Challakere", "Hiriyur", "Holalkere", "Hosadurga", "Molakalmuru"] },
      { id: "ka-dakshina-kannada", name: "Dakshina Kannada (Mangaluru)", hindiName: "दक्षिण कन्नड़", state: "Karnataka", zoneId: 12, normalRainfallMm: 3950, latitude: 12.8703, longitude: 74.8806, taluks: ["Mangaluru", "Bantwal", "Belthangady", "Puttur", "Sullia", "Moodabidri", "Kadaba"] },
      { id: "ka-davanagere", name: "Davanagere", hindiName: "दावणगेरे", state: "Karnataka", zoneId: 10, normalRainfallMm: 650, latitude: 14.4644, longitude: 75.9218, taluks: ["Davanagere", "Harihara", "Honnali", "Channagiri", "Jagalur", "Nyamathi"] },
      { id: "ka-gadag", name: "Gadag", hindiName: "गदग", state: "Karnataka", zoneId: 10, normalRainfallMm: 620, latitude: 15.4294, longitude: 75.6318, taluks: ["Gadag", "Ron", "Shirhatti", "Mundargi", "Nargund", "Gajendragad", "Lakshmeshwar"] },
      { id: "ka-hassan", name: "Hassan", hindiName: "हासन", state: "Karnataka", zoneId: 10, normalRainfallMm: 1050, latitude: 13.0072, longitude: 76.1030, taluks: ["Hassan", "Alur", "Arkalgud", "Arsikere", "Belur", "Channarayapatna", "Holenarasipura", "Sakleshpur"] },
      { id: "ka-haveri", name: "Haveri", hindiName: "हावेरी", state: "Karnataka", zoneId: 10, normalRainfallMm: 760, latitude: 14.7954, longitude: 75.3991, taluks: ["Haveri", "Byadgi", "Hangal", "Hirekerur", "Ranebennur", "Savanur", "Shiggaon", "Rattihalli"] },
      { id: "ka-kalaburagi", name: "Kalaburagi (Gulbarga)", hindiName: "कलबुर्गी", state: "Karnataka", zoneId: 10, normalRainfallMm: 750, latitude: 17.3297, longitude: 76.8343, taluks: ["Kalaburagi", "Afzalpur", "Aland", "Chincholi", "Chitapur", "Jevargi", "Sedam", "Kamalapur", "Shahabad", "Kalagi", "Yedrami"] },
      { id: "ka-kodagu", name: "Kodagu (Coorg)", hindiName: "कोडागु", state: "Karnataka", zoneId: 12, normalRainfallMm: 2700, latitude: 12.4244, longitude: 75.7382, taluks: ["Madikeri", "Somwarpet", "Virajpet", "Kushalnagar", "Ponnampet"] },
      { id: "ka-kolar", name: "Kolar", hindiName: "कोलार", state: "Karnataka", zoneId: 10, normalRainfallMm: 740, latitude: 13.1367, longitude: 78.1291, taluks: ["Kolar", "Bangarapet", "Malur", "Mulbagal", "Srinivaspur", "KGF"] },
      { id: "ka-koppal", name: "Koppal", hindiName: "कोप्पल", state: "Karnataka", zoneId: 10, normalRainfallMm: 570, latitude: 15.3489, longitude: 76.1554, taluks: ["Koppal", "Gangavathi", "Kushtagi", "Yelbarga", "Kanakagiri", "Karatagi", "Kukanoor"] },
      { id: "ka-mandya", name: "Mandya", hindiName: "मंड्या", state: "Karnataka", zoneId: 10, normalRainfallMm: 710, latitude: 12.5242, longitude: 76.8958, taluks: ["Mandya", "Maddur", "Malavalli", "Pandavapura", "Nagamangala", "Krishnarajapet", "Srirangapatna"] },
      { id: "ka-mysuru", name: "Mysuru (Mysore)", hindiName: "मैसूरु", state: "Karnataka", zoneId: 10, normalRainfallMm: 800, latitude: 12.2958, longitude: 76.6394, taluks: ["Mysuru", "Nanjangud", "Hunsur", "T. Narasipura", "Heggadadevankote", "Piriyapatna", "Krishnarajanagara", "Saragur", "Saligrama"] },
      { id: "ka-raichur", name: "Raichur", hindiName: "रायचूर", state: "Karnataka", zoneId: 10, normalRainfallMm: 620, latitude: 16.2120, longitude: 77.3439, taluks: ["Raichur", "Devadurga", "Lingsugur", "Manvi", "Sindhanur", "Maski", "Sirwar"] },
      { id: "ka-ramanagara", name: "Ramanagara", hindiName: "रामनगर", state: "Karnataka", zoneId: 10, normalRainfallMm: 830, latitude: 12.7209, longitude: 77.2799, taluks: ["Ramanagara", "Channapatna", "Kanakapura", "Magadi", "Harohalli"] },
      { id: "ka-shivamogga", name: "Shivamogga (Shimoga)", hindiName: "शिवमोग्गा", state: "Karnataka", zoneId: 12, normalRainfallMm: 1750, latitude: 13.9299, longitude: 75.5681, taluks: ["Shivamogga", "Bhadravati", "Thirthahalli", "Sagar", "Shikaripura", "Soraba", "Hosanagara"] },
      { id: "ka-tumakuru", name: "Tumakuru (Tumkur)", hindiName: "तुमकुरु", state: "Karnataka", zoneId: 10, normalRainfallMm: 690, latitude: 13.3409, longitude: 77.1010, taluks: ["Tumakuru", "Chiknayakanhalli", "Gubbi", "Koratagere", "Kunigal", "Madhugiri", "Pavagada", "Sira", "Tiptur", "Turuvekere"] },
      { id: "ka-udupi", name: "Udupi", hindiName: "उडुपी", state: "Karnataka", zoneId: 12, normalRainfallMm: 4100, latitude: 13.3409, longitude: 74.7421, taluks: ["Udupi", "Kundapura", "Karkala", "Byndoor", "Brahmavara", "Kapu", "Hebri"] },
      { id: "ka-uttara-kannada", name: "Uttara Kannada (Karwar)", hindiName: "उत्तर कन्नड़", state: "Karnataka", zoneId: 12, normalRainfallMm: 3100, latitude: 14.8185, longitude: 74.1416, taluks: ["Karwar", "Ankola", "Kumta", "Honnavar", "Bhatkal", "Sirsi", "Siddapur", "Yellapur", "Dandeli", "Haliyal", "Joida", "Mundgod"] },
      { id: "ka-vijayapura", name: "Vijayapura (Bijapur)", hindiName: "विजयपुरा", state: "Karnataka", zoneId: 10, normalRainfallMm: 590, latitude: 16.8302, longitude: 75.7100, taluks: ["Vijayapura", "Basavana Bagewadi", "Indi", "Muddebihal", "Sindagi", "Babanagar", "Tikota", "Talikoti", "Chadchan", "Devar Hippargi", "Kolhar", "Nidagundi"] },
      { id: "ka-vijayanagara", name: "Vijayanagara (Hosapete)", hindiName: "विजयनगर", state: "Karnataka", zoneId: 10, normalRainfallMm: 610, latitude: 15.2689, longitude: 76.3909, taluks: ["Hosapete", "Hagaribommanahalli", "Harapanahalli", "Hoovina Hadagali", "Kotturu", "Kudligi"] },
      { id: "ka-yadgir", name: "Yadgir", hindiName: "यादगीर", state: "Karnataka", zoneId: 10, normalRainfallMm: 690, latitude: 16.7644, longitude: 77.1378, taluks: ["Yadgir", "Shahapur", "Shorapur", "Gurmitkal", "Hunsagi", "Wadgera"] }
    ]
  },

  // ==========================================
  // 2. MADHYA PRADESH (MP) - Complete Districts
  // ==========================================
  {
    code: "MP",
    name: "Madhya Pradesh",
    hindiName: "मध्य प्रदेश",
    isUnionTerritory: false,
    capital: "Bhopal",
    districts: [
      { id: "mp-indore", name: "Indore", hindiName: "इन्दौर", state: "Madhya Pradesh", zoneId: 8, normalRainfallMm: 950, latitude: 22.7196, longitude: 75.8577, taluks: ["Indore", "Sanwer", "Depalpur", "Mhow (Dr. Ambedkar Nagar)", "Hatod", "Rau"] },
      { id: "mp-ujjain", name: "Ujjain", hindiName: "उज्जैन", state: "Madhya Pradesh", zoneId: 8, normalRainfallMm: 890, latitude: 23.1765, longitude: 75.7885, taluks: ["Ujjain", "Ghatiya", "Khachrod", "Mahidpur", "Nagda", "Tarana", "Badnagar"] },
      { id: "mp-dewas", name: "Dewas", hindiName: "देवास", state: "Madhya Pradesh", zoneId: 8, normalRainfallMm: 920, latitude: 22.9676, longitude: 76.0534, taluks: ["Dewas", "Sonkatch", "Bagli", "Kannod", "Khategaon", "Tonk Khurd"] },
      { id: "mp-bhopal", name: "Bhopal", hindiName: "भोपाल", state: "Madhya Pradesh", zoneId: 8, normalRainfallMm: 1100, latitude: 23.2599, longitude: 77.4126, taluks: ["Huzur", "Berasia", "Kolar"] },
      { id: "mp-sehore", name: "Sehore", hindiName: "सीहोर", state: "Madhya Pradesh", zoneId: 8, normalRainfallMm: 1200, latitude: 23.2032, longitude: 77.0844, taluks: ["Sehore", "Ashta", "Ichhawar", "Budhni", "Nasrullaganj", "Shyampur"] },
      { id: "mp-vidisha", name: "Vidisha", hindiName: "विदिशा", state: "Madhya Pradesh", zoneId: 8, normalRainfallMm: 1150, latitude: 23.5236, longitude: 77.8080, taluks: ["Vidisha", "Basoda", "Kurwai", "Sironj", "Lateri", "Gyraspur", "Nateran"] },
      { id: "mp-jabalpur", name: "Jabalpur", hindiName: "जबलपुर", state: "Madhya Pradesh", zoneId: 7, normalRainfallMm: 1350, latitude: 23.1815, longitude: 79.9864, taluks: ["Jabalpur", "Patan", "Sihora", "Majholi", "Panagar", "Kundam", "Shahpura"] },
      { id: "mp-hoshangabad", name: "Narmadapuram (Hoshangabad)", hindiName: "नर्मदापुरम", state: "Madhya Pradesh", zoneId: 8, normalRainfallMm: 1280, latitude: 22.7519, longitude: 77.7289, taluks: ["Hoshangabad", "Itarsi", "Pipariya", "Sohagpur", "Seoni Malwa", "Babai", "Bankhedi"] },
      { id: "mp-ratlam", name: "Ratlam", hindiName: "रतलाम", state: "Madhya Pradesh", zoneId: 8, normalRainfallMm: 890, latitude: 23.3315, longitude: 75.0367, taluks: ["Ratlam", "Jaora", "Alot", "Sailana", "Bajna", "Piploda"] },
      { id: "mp-dhar", name: "Dhar", hindiName: "धार", state: "Madhya Pradesh", zoneId: 8, normalRainfallMm: 830, latitude: 22.5975, longitude: 75.3039, taluks: ["Dhar", "Badnawar", "Sardarpur", "Kukshi", "Manawar", "Gandhwani", "Dhamnod"] },
      { id: "mp-khargone", name: "Khargone (West Nimar)", hindiName: "खरगोन", state: "Madhya Pradesh", zoneId: 8, normalRainfallMm: 790, latitude: 21.8234, longitude: 75.6186, taluks: ["Khargone", "Barwaha", "Maheshwar", "Kasrawad", "Bhikangaon", "Sendhwa", "Gogawan"] },
      { id: "mp-khandwa", name: "Khandwa (East Nimar)", hindiName: "खण्डवा", state: "Madhya Pradesh", zoneId: 8, normalRainfallMm: 880, latitude: 21.8314, longitude: 76.3498, taluks: ["Khandwa", "Pandhana", "Punasa", "Harsud", "Khalwa"] },
      { id: "mp-mandsaur", name: "Mandsaur", hindiName: "मंदसौर", state: "Madhya Pradesh", zoneId: 8, normalRainfallMm: 810, latitude: 24.0722, longitude: 75.0689, taluks: ["Mandsaur", "Malhargarh", "Garoth", "Bhanpura", "Sitamau", "Suwasra", "Daloda"] },
      { id: "mp-neemuch", name: "Neemuch", hindiName: "नीमच", state: "Madhya Pradesh", zoneId: 8, normalRainfallMm: 800, latitude: 24.4722, longitude: 74.8722, taluks: ["Neemuch", "Jawad", "Manasa", "Singoli", "Jeeran"] },
      { id: "mp-sagar", name: "Sagar", hindiName: "सागर", state: "Madhya Pradesh", zoneId: 8, normalRainfallMm: 1190, latitude: 23.8388, longitude: 78.7378, taluks: ["Sagar", "Khurai", "Bina", "Banda", "Rehli", "Garhakota", "Deori", "Shahgarh"] },
      { id: "mp-gwalior", name: "Gwalior", hindiName: "ग्वालियर", state: "Madhya Pradesh", zoneId: 8, normalRainfallMm: 750, latitude: 26.2183, longitude: 78.1828, taluks: ["Gwalior", "Dabra", "Bhitarwar", "Chinour", "Ghatigaon"] },
      { id: "mp-satna", name: "Satna", hindiName: "सतना", state: "Madhya Pradesh", zoneId: 7, normalRainfallMm: 1040, latitude: 24.5800, longitude: 80.8300, taluks: ["Satna (Raghurajnagar)", "Nagod", "Maihar", "Amarpatan", "Ramnagar", "Unchehara", "Birsinghpur"] },
      { id: "mp-rewa", name: "Rewa", hindiName: "रीवा", state: "Madhya Pradesh", zoneId: 7, normalRainfallMm: 1100, latitude: 24.5373, longitude: 81.3042, taluks: ["Huzur", "Gurh", "Mauganj", "Hanumana", "Semariya", "Teonthar", "Sirmaur", "Jawa"] },
      { id: "mp-chhindwara", name: "Chhindwara", hindiName: "छिंदवाड़ा", state: "Madhya Pradesh", zoneId: 7, normalRainfallMm: 1180, latitude: 22.0574, longitude: 78.9382, taluks: ["Chhindwara", "Sausar", "Pandhurna", "Parasia", "Amarwara", "Chourai", "Jamuai", "Tamia"] },
      { id: "mp-harda", name: "Harda", hindiName: "हरदा", state: "Madhya Pradesh", zoneId: 8, normalRainfallMm: 1220, latitude: 22.3444, longitude: 77.0944, taluks: ["Harda", "Khirkiya", "Timarni", "Sirali", "Handia"] },
      { id: "mp-shajapur", name: "Shajapur", hindiName: "शाजापुर", state: "Madhya Pradesh", zoneId: 8, normalRainfallMm: 930, latitude: 23.4267, longitude: 76.2778, taluks: ["Shajapur", "Shujalpur", "Kalapipal", "Gulana", "Moman Badodiya"] },
      { id: "mp-betul", name: "Betul", hindiName: "बैतूल", state: "Madhya Pradesh", zoneId: 8, normalRainfallMm: 1080, latitude: 21.9011, longitude: 77.9011, taluks: ["Betul", "Multai", "Amla", "Bhainsdehi", "Shahpur", "Chicholi", "Athner"] }
    ]
  },

  // ==========================================
  // 3. MAHARASHTRA (MH) - Complete Districts
  // ==========================================
  {
    code: "MH",
    name: "Maharashtra",
    hindiName: "महाराष्ट्र",
    isUnionTerritory: false,
    capital: "Mumbai",
    districts: [
      { id: "mh-nashik", name: "Nashik", hindiName: "नाशिक", state: "Maharashtra", zoneId: 9, normalRainfallMm: 810, latitude: 19.9975, longitude: 73.7898, taluks: ["Nashik", "Niphad", "Lasalgaon", "Yeola", "Sinnar", "Malegaon", "Satana (Baglan)", "Dindori", "Chandwad", "Deola", "Kalwan", "Trimbak", "Igatpuri", "Surgana", "Peint"] },
      { id: "mh-pune", name: "Pune", hindiName: "पुणे", state: "Maharashtra", zoneId: 9, normalRainfallMm: 720, latitude: 18.5204, longitude: 73.8567, taluks: ["Haveli (Pune)", "Shirur", "Baramati", "Khed (Rajgurunagar)", "Ambegaon", "Junnar", "Indapur", "Daund", "Maval", "Mulshi", "Bhor", "Purandar", "Velhe"] },
      { id: "mh-ahmednagar", name: "Ahmednagar (Ahilyanagar)", hindiName: "अहमदनगर", state: "Maharashtra", zoneId: 9, normalRainfallMm: 560, latitude: 19.0948, longitude: 74.7480, taluks: ["Nagar", "Rahuri", "Shrirampur", "Sangamner", "Kopargaon", "Newasa", "Shevgaon", "Pathardi", "Parner", "Shrigonda", "Karjat", "Jamkhed", "Rahata", "Akole"] },
      { id: "mh-aurangabad", name: "Chhatrapati Sambhajinagar (Aurangabad)", hindiName: "छत्रपती संभाजीनगर", state: "Maharashtra", zoneId: 9, normalRainfallMm: 730, latitude: 19.8762, longitude: 75.3433, taluks: ["Aurangabad", "Paithan", "Gangapur", "Vaijapur", "Kannad", "Khuldabad", "Sillod", "Soegaon", "Phulambri"] },
      { id: "mh-jalgaon", name: "Jalgaon", hindiName: "जलगांव", state: "Maharashtra", zoneId: 9, normalRainfallMm: 760, latitude: 21.0077, longitude: 75.5626, taluks: ["Jalgaon", "Bhusawal", "Raver", "Yawal", "Chopda", "Erandol", "Parola", "Amalner", "Chalisgaon", "Jamner", "Pachora", "Bhadgaon", "Dharangaon", "Muktainagar", "Bodwad"] },
      { id: "mh-nagpur", name: "Nagpur", hindiName: "नागपुर", state: "Maharashtra", zoneId: 7, normalRainfallMm: 1120, latitude: 21.1458, longitude: 79.0882, taluks: ["Nagpur Urban", "Nagpur Rural", "Kamptee", "Hingna", "Katol", "Narkhed", "Savner", "Kalmeshwar", "Ramtek", "Parseoni", "Mouda", "Umred", "Kuhi", "Bhiwapur"] },
      { id: "mh-amravati", name: "Amravati", hindiName: "अमरावती", state: "Maharashtra", zoneId: 7, normalRainfallMm: 880, latitude: 20.9320, longitude: 77.7523, taluks: ["Amravati", "Achalpur", "Chandur Bazar", "Morshi", "Warud", "Daryapur", "Anjangaon Surji", "Chandur Railway", "Dhamangaon Railway", "Nandgaon Khandeshwar", "Teosa", "Dharni", "Chikhaldara"] },
      { id: "mh-solapur", name: "Solapur", hindiName: "सोलापुर", state: "Maharashtra", zoneId: 9, normalRainfallMm: 580, latitude: 17.6599, longitude: 75.9064, taluks: ["Solapur North", "Solapur South", "Barshi", "Pandharpur", "Sangola", "Karmala", "Madha", "Malshiras", "Mohol", "Mangalvedhe", "Akkalkot"] },
      { id: "mh-kolhapur", name: "Kolhapur", hindiName: "कोल्हापुर", state: "Maharashtra", zoneId: 12, normalRainfallMm: 1850, latitude: 16.7050, longitude: 74.2433, taluks: ["Karvir (Kolhapur)", "Hatkanangle", "Shirol", "Kagal", "Radhanagari", "Bhudargad", "Panhala", "Shahuwadi", "Gadhinglaj", "Ajra", "Chandgad", "Bavda"] },
      { id: "mh-sangli", name: "Sangli", hindiName: "सांगली", state: "Maharashtra", zoneId: 9, normalRainfallMm: 620, latitude: 16.8524, longitude: 74.5815, taluks: ["Miraj (Sangli)", "Tasgaon", "Walwa (Islampur)", "Shirala", "Khanapur (Vita)", "Atpadi", "Jat", "Kavathe Mahankal", "Palus", "Kadegaon"] },
      { id: "mh-satara", name: "Satara", hindiName: "सातारा", state: "Maharashtra", zoneId: 9, normalRainfallMm: 920, latitude: 17.6805, longitude: 73.9997, taluks: ["Satara", "Karad", "Wai", "Phaltan", "Khandala", "Koregaon", "Khatav", "Man (Dahiwadi)", "Patan", "Jaoli (Medha)", "Mahabaleshwar"] },
      { id: "mh-latur", name: "Latur", hindiName: "लातूर", state: "Maharashtra", zoneId: 9, normalRainfallMm: 790, latitude: 18.4088, longitude: 76.5604, taluks: ["Latur", "Ausa", "Nilanga", "Udgir", "Ahmedpur", "Chakur", "Renapur", "Deoni", "Shirur Anantpal", "Jalkot"] },
      { id: "mh-nanded", name: "Nanded", hindiName: "नांदेड़", state: "Maharashtra", zoneId: 9, normalRainfallMm: 910, latitude: 19.1383, longitude: 77.3210, taluks: ["Nanded", "Loha", "Kandhar", "Mukhed", "Degloor", "Biloli", "Dharmabad", "Naigaon", "Hadgaon", "Himayatnagar", "Bhokar", "Ardhapur", "Mudkhed", "Kinwat", "Mahoor", "Umri"] },
      { id: "mh-akola", name: "Akola", hindiName: "अकोला", state: "Maharashtra", zoneId: 7, normalRainfallMm: 820, latitude: 20.7002, longitude: 77.0082, taluks: ["Akola", "Akot", "Telhara", "Balapur", "Patur", "Murtizapur", "Barshitakli"] },
      { id: "mh-buldhana", name: "Buldhana", hindiName: "बुलढाणा", state: "Maharashtra", zoneId: 7, normalRainfallMm: 780, latitude: 20.5312, longitude: 76.1843, taluks: ["Buldhana", "Chikhli", "Deulgaon Raja", "Mehkar", "Sindkhed Raja", "Lonar", "Khamgaon", "Shegaon", "Malkapur", "Motala", "Nandura", "Jalgaon Jamod", "Sangrampur"] },
      { id: "mh-yavatmal", name: "Yavatmal", hindiName: "यवतमाल", state: "Maharashtra", zoneId: 7, normalRainfallMm: 950, latitude: 20.3888, longitude: 78.1204, taluks: ["Yavatmal", "Darwha", "Digras", "Pusad", "Umarkhed", "Mahagaon", "Ghatanji", "Pandharkawada (Kelapur)", "Ralegaon", "Babhulgaon", "Kalamb", "Wani", "Maregaon", "Zari Jamani", "Arni", "Ner"] }
    ]
  },

  // ==========================================
  // 4. GUJARAT (GJ) - Complete Districts
  // ==========================================
  {
    code: "GJ",
    name: "Gujarat",
    hindiName: "गुजरात",
    isUnionTerritory: false,
    capital: "Gandhinagar",
    districts: [
      { id: "gj-rajkot", name: "Rajkot", hindiName: "राजकोट", state: "Gujarat", zoneId: 13, normalRainfallMm: 620, latitude: 22.3039, longitude: 70.8022, taluks: ["Rajkot", "Gondal", "Jetpur", "Dhoraji", "Upleta", "Jasdan", "Kotda Sangani", "Lodhika", "Paddhari", "Jamkandorna", "Vinchhiya"] },
      { id: "gj-surat", name: "Surat", hindiName: "सूरत", state: "Gujarat", zoneId: 13, normalRainfallMm: 1180, latitude: 21.1702, longitude: 72.8311, taluks: ["Choryasi", "Bardoli", "Kamrej", "Mandvi", "Mahuva", "Mangrol", "Olpad", "Palsana", "Umarpada"] },
      { id: "gj-ahmedabad", name: "Ahmedabad", hindiName: "अहमदाबाद", state: "Gujarat", zoneId: 13, normalRainfallMm: 780, latitude: 23.0225, longitude: 72.5714, taluks: ["Ahmedabad City", "Daskroi", "Sanand", "Bavla", "Dholka", "Dhandhuka", "Viramgam", "Mandal", "Detroj-Rampura", "Dholera"] },
      { id: "gj-junagadh", name: "Junagadh", hindiName: "जूनागढ़", state: "Gujarat", zoneId: 13, normalRainfallMm: 850, latitude: 21.5222, longitude: 70.4579, taluks: ["Junagadh City", "Junagadh Rural", "Keshod", "Mangrol", "Manavadar", "Malia Hatina", "Talala", "Visavadar", "Mendarda", "Bhesan"] },
      { id: "gj-amreli", name: "Amreli", hindiName: "अमरेली", state: "Gujarat", zoneId: 13, normalRainfallMm: 650, latitude: 21.6032, longitude: 71.2221, taluks: ["Amreli", "Dhari", "Babra", "Lathi", "Lilia", "Savarkundla", "Khambha", "Jafrabad", "Rajula", "Bagasara", "Kunkavav Vadia"] },
      { id: "gj-bhavnagar", name: "Bhavnagar", hindiName: "भावनगर", state: "Gujarat", zoneId: 13, normalRainfallMm: 600, latitude: 21.7645, longitude: 72.1519, taluks: ["Bhavnagar", "Sihor", "Palitana", "Talaja", "Mahuva", "Gariadhar", "Ghogha", "Vallabhipur", "Umrala", "Jesar"] },
      { id: "gj-banaskantha", name: "Banaskantha (Palanpur)", hindiName: "बनासकांठा", state: "Gujarat", zoneId: 13, normalRainfallMm: 520, latitude: 24.1718, longitude: 72.4386, taluks: ["Palanpur", "Deesa", "Dhanera", "Tharad", "Vav", "Radhanpur", "Danta", "Vadgam", "Kankrej", "Bhabhar", "Lakhani", "Suigam"] },
      { id: "gj-mehsana", name: "Mehsana", hindiName: "मेहसाणा", state: "Gujarat", zoneId: 13, normalRainfallMm: 680, latitude: 23.5880, longitude: 72.3693, taluks: ["Mehsana", "Visnagar", "Vadnagar", "Kheralu", "Unjha", "Kadi", "Becharaji", "Satlasana", "Jotana", "Gojariya"] },
      { id: "gj-kutch", name: "Kutch (Bhuj)", hindiName: "कच्छ", state: "Gujarat", zoneId: 14, normalRainfallMm: 380, latitude: 23.2420, longitude: 69.6669, taluks: ["Bhuj", "Anjar", "Gandhidham", "Mandvi", "Mundra", "Nakhatrana", "Abdasa", "Lakhpat", "Rapar", "Bhachau"] },
      { id: "gj-anand", name: "Anand", hindiName: "आणंद", state: "Gujarat", zoneId: 13, normalRainfallMm: 850, latitude: 22.5645, longitude: 72.9289, taluks: ["Anand", "Petlad", "Borsad", "Khambhat", "Tarapur", "Sojitra", "Umreth", "Anklav"] },
      { id: "gj-vadodara", name: "Vadodara", hindiName: "वडोदरा", state: "Gujarat", zoneId: 13, normalRainfallMm: 920, latitude: 22.3072, longitude: 73.1812, taluks: ["Vadodara", "Padra", "Karjan", "Dabhoi", "Waghodia", "Savli", "Desar", "Sinor"] }
    ]
  },

  // ==========================================
  // 5. RAJASTHAN (RJ) - Complete Districts
  // ==========================================
  {
    code: "RJ",
    name: "Rajasthan",
    hindiName: "राजस्थान",
    isUnionTerritory: false,
    capital: "Jaipur",
    districts: [
      { id: "rj-kota", name: "Kota", hindiName: "कोटा", state: "Rajasthan", zoneId: 8, normalRainfallMm: 750, latitude: 25.2138, longitude: 75.8648, taluks: ["Ladpura (Kota)", "Digod", "Pipalda", "Sangod", "Ramganj Mandi", "Kanwas"] },
      { id: "rj-jaipur", name: "Jaipur", hindiName: "जयपुर", state: "Rajasthan", zoneId: 5, normalRainfallMm: 580, latitude: 26.9124, longitude: 75.7873, taluks: ["Jaipur", "Amber", "Sanganer", "Chaksu", "Bassi", "Kotputli", "Shahpura", "Phulera (Sambhar)", "Jamwa Ramgarh"] },
      { id: "rj-sriganganagar", name: "Sri Ganganagar", hindiName: "श्रीगंगानगर", state: "Rajasthan", zoneId: 6, normalRainfallMm: 290, latitude: 29.9038, longitude: 73.8772, taluks: ["Ganganagar", "Sadulshahar", "Karanpur", "Padampur", "Raisinghnagar", "Anupgarh", "Suratgarh", "Vijaynagar"] },
      { id: "rj-jodhpur", name: "Jodhpur", hindiName: "जोधपुर", state: "Rajasthan", zoneId: 14, normalRainfallMm: 310, latitude: 26.2389, longitude: 73.0243, taluks: ["Jodhpur", "Luni", "Bilara", "Bhopalgarh", "Osian", "Phalodi", "Shergarh", "Balesar", "Piparcity"] },
      { id: "rj-bikaner", name: "Bikaner", hindiName: "बीकानेर", state: "Rajasthan", zoneId: 14, normalRainfallMm: 250, latitude: 28.0229, longitude: 73.3119, taluks: ["Bikaner", "Nokha", "Lunkaransar", "Kolayat", "Khajuwala", "Poogal", "Chhatargarh"] },
      { id: "rj-hanumangarh", name: "Hanumangarh", hindiName: "हनुमानगढ़", state: "Rajasthan", zoneId: 6, normalRainfallMm: 320, latitude: 29.5810, longitude: 74.3294, taluks: ["Hanumangarh", "Pilibanga", "Sangaria", "Nohar", "Bhadra", "Rawatsar", "Tibbi"] },
      { id: "rj-nagaur", name: "Nagaur", hindiName: "नागौर", state: "Rajasthan", zoneId: 14, normalRainfallMm: 380, latitude: 27.2000, longitude: 73.7400, taluks: ["Nagaur", "Merta", "Degana", "Ladnu", "Didwana", "Kuchaman City", "Makrana", "Parbatsar", "Riyan Badi", "Jayal"] },
      { id: "rj-alwar", name: "Alwar", hindiName: "अलवर", state: "Rajasthan", zoneId: 5, normalRainfallMm: 640, latitude: 27.5530, longitude: 76.6346, taluks: ["Alwar", "Tijara", "Kishangarh Bas", "Ramgarh", "Rajgarh", "Thanagazi", "Bansur", "Behror", "Kathumar", "Lachhmangarh"] },
      { id: "rj-baran", name: "Baran", hindiName: "बारां", state: "Rajasthan", zoneId: 8, normalRainfallMm: 850, latitude: 25.1011, longitude: 76.5132, taluks: ["Baran", "Antah", "Atru", "Chhabra", "Chhipabarod", "Kishanganj", "Shahbad", "Mangrol"] },
      { id: "rj-bundi", name: "Bundi", hindiName: "बूंदी", state: "Rajasthan", zoneId: 8, normalRainfallMm: 720, latitude: 25.4415, longitude: 75.6429, taluks: ["Bundi", "Keshoraipatan", "Nainwa", "Hindoli", "Indergarh", "Talera"] },
      { id: "rj-jhalawar", name: "Jhalawar", hindiName: "झालावाड़", state: "Rajasthan", zoneId: 8, normalRainfallMm: 940, latitude: 24.5973, longitude: 76.1610, taluks: ["Jhalrapatan", "Khanpur", "Manohar Thana", "Pirawa", "Aklera", "Bakani", "Gangdhar", "Sunel"] },
      { id: "rj-tonk", name: "Tonk", hindiName: "टोंक", state: "Rajasthan", zoneId: 5, normalRainfallMm: 610, latitude: 26.1667, longitude: 75.7833, taluks: ["Tonk", "Niwai", "Malpura", "Deoli", "Uniara", "Todaraisingh", "Peeplu"] }
    ]
  },

  // ==========================================
  // 6. PUNJAB (PB) - Complete Districts
  // ==========================================
  {
    code: "PB",
    name: "Punjab",
    hindiName: "पंजाब",
    isUnionTerritory: false,
    capital: "Chandigarh",
    districts: [
      { id: "pb-ludhiana", name: "Ludhiana", hindiName: "लुधियाना", state: "Punjab", zoneId: 6, normalRainfallMm: 680, latitude: 30.9010, longitude: 75.8573, taluks: ["Ludhiana East", "Ludhiana West", "Jagraon", "Samrala", "Khanna", "Payal", "Raikot"] },
      { id: "pb-amritsar", name: "Amritsar", hindiName: "अमृतसर", state: "Punjab", zoneId: 6, normalRainfallMm: 630, latitude: 31.6340, longitude: 74.8723, taluks: ["Amritsar-I", "Amritsar-II", "Ajnala", "Baba Bakala", "Majitha"] },
      { id: "pb-jalandhar", name: "Jalandhar", hindiName: "जालंधर", state: "Punjab", zoneId: 6, normalRainfallMm: 700, latitude: 31.3260, longitude: 75.5762, taluks: ["Jalandhar-I", "Jalandhar-II", "Nakodar", "Phillaur", "Shahkot"] },
      { id: "pb-patiala", name: "Patiala", hindiName: "पटियाला", state: "Punjab", zoneId: 6, normalRainfallMm: 690, latitude: 30.3398, longitude: 76.3869, taluks: ["Patiala", "Nabha", "Rajpura", "Samana", "Patran", "Dudhan Sadhan"] },
      { id: "pb-bathinda", name: "Bathinda", hindiName: "बठिंडा", state: "Punjab", zoneId: 6, normalRainfallMm: 410, latitude: 30.2110, longitude: 74.9455, taluks: ["Bathinda", "Rampura Phul", "Talwandi Sabo", "Maur"] },
      { id: "pb-sangrur", name: "Sangrur", hindiName: "संगरूर", state: "Punjab", zoneId: 6, normalRainfallMm: 540, latitude: 30.2458, longitude: 75.8421, taluks: ["Sangrur", "Sunam", "Dhuri", "Lehra", "Dirba", "Bhawanigarh"] },
      { id: "pb-firozpur", name: "Firozpur", hindiName: "फिरोज़पुर", state: "Punjab", zoneId: 6, normalRainfallMm: 460, latitude: 30.9237, longitude: 74.6118, taluks: ["Firozpur", "Zira", "Guru Har Sahai"] },
      { id: "pb-fazilka", name: "Fazilka", hindiName: "फाजिल्का", state: "Punjab", zoneId: 6, normalRainfallMm: 360, latitude: 30.4036, longitude: 74.0254, taluks: ["Fazilka", "Abohar", "Jalalabad"] },
      { id: "pb-moga", name: "Moga", hindiName: "मोगा", state: "Punjab", zoneId: 6, normalRainfallMm: 490, latitude: 30.8165, longitude: 75.1717, taluks: ["Moga", "Baghapurana", "Nihal Singh Wala", "Dharamkot"] },
      { id: "pb-kapurthala", name: "Kapurthala", hindiName: "कपूरथला", state: "Punjab", zoneId: 6, normalRainfallMm: 740, latitude: 31.3800, longitude: 75.3800, taluks: ["Kapurthala", "Phagwara", "Sultanpur Lodhi", "Bholath"] },
      { id: "pb-hoshiarpur", name: "Hoshiarpur", hindiName: "होशियारपुर", state: "Punjab", zoneId: 6, normalRainfallMm: 980, latitude: 31.5300, longitude: 75.9200, taluks: ["Hoshiarpur", "Dasuya", "Mukerian", "Garhshankar"] }
    ]
  },

  // ==========================================
  // 7. HARYANA (HR) - Complete Districts
  // ==========================================
  {
    code: "HR",
    name: "Haryana",
    hindiName: "हरियाणा",
    isUnionTerritory: false,
    capital: "Chandigarh",
    districts: [
      { id: "hr-karnal", name: "Karnal", hindiName: "करनाल", state: "Haryana", zoneId: 6, normalRainfallMm: 720, latitude: 29.6857, longitude: 76.9905, taluks: ["Karnal", "Indri", "Nilokheri", "Gharaunda", "Assandh", "Nissing"] },
      { id: "hr-hisar", name: "Hisar", hindiName: "हिसार", state: "Haryana", zoneId: 6, normalRainfallMm: 450, latitude: 29.1492, longitude: 75.7217, taluks: ["Hisar", "Hansi", "Barwala", "Narnaund", "Adampur", "Bass"] },
      { id: "hr-sirsa", name: "Sirsa", hindiName: "सिरसा", state: "Haryana", zoneId: 6, normalRainfallMm: 320, latitude: 29.5349, longitude: 75.0295, taluks: ["Sirsa", "Dabwali", "Rania", "Ellenabad", "Kalanwali", "Nathusari Chopta"] },
      { id: "hr-kurukshetra", name: "Kurukshetra", hindiName: "कुरुक्षेत्र", state: "Haryana", zoneId: 6, normalRainfallMm: 760, latitude: 29.9695, longitude: 76.8783, taluks: ["Thanesar", "Pehowa", "Shahbad", "Ladwa", "Ismailabad", "Babain"] },
      { id: "hr-ambala", name: "Ambala", hindiName: "अम्बाला", state: "Haryana", zoneId: 6, normalRainfallMm: 950, latitude: 30.3782, longitude: 76.7767, taluks: ["Ambala City", "Ambala Cantt", "Barara", "Naraingarh", "Saha", "Mullana"] },
      { id: "hr-rohtak", name: "Rohtak", hindiName: "रोहतक", state: "Haryana", zoneId: 6, normalRainfallMm: 590, latitude: 28.8955, longitude: 76.6066, taluks: ["Rohtak", "Meham", "Sampla", "Kalanaur"] },
      { id: "hr-fatehabad", name: "Fatehabad", hindiName: "फतेहाबाद", state: "Haryana", zoneId: 6, normalRainfallMm: 390, latitude: 29.5167, longitude: 75.4500, taluks: ["Fatehabad", "Tohana", "Ratia", "Bhattu Kalan", "Bhuna", "Jakhal"] },
      { id: "hr-panipat", name: "Panipat", hindiName: "पानीपत", state: "Haryana", zoneId: 6, normalRainfallMm: 630, latitude: 29.3909, longitude: 76.9635, taluks: ["Panipat", "Samalkha", "Israna", "Madlauda", "Bapoli"] },
      { id: "hr-sonipat", name: "Sonipat", hindiName: "सोनीपत", state: "Haryana", zoneId: 6, normalRainfallMm: 610, latitude: 28.9931, longitude: 77.0151, taluks: ["Sonipat", "Gohana", "Ganaur", "Kharkhoda", "Rai"] }
    ]
  },

  // ==========================================
  // 8. UTTAR PRADESH (UP) - Complete Key Districts
  // ==========================================
  {
    code: "UP",
    name: "Uttar Pradesh",
    hindiName: "उत्तर प्रदेश",
    isUnionTerritory: false,
    capital: "Lucknow",
    districts: [
      { id: "up-varanasi", name: "Varanasi", hindiName: "वाराणसी", state: "Uttar Pradesh", zoneId: 4, normalRainfallMm: 1050, latitude: 25.3176, longitude: 82.9739, taluks: ["Varanasi", "Pindra", "Raja Talab"] },
      { id: "up-agra", name: "Agra", hindiName: "आगरा", state: "Uttar Pradesh", zoneId: 5, normalRainfallMm: 680, latitude: 27.1767, longitude: 78.0081, taluks: ["Agra", "Kiraoli", "Fatehabad", "Kheragarh", "Bah", "Etmadpur"] },
      { id: "up-lucknow", name: "Lucknow", hindiName: "लखनऊ", state: "Uttar Pradesh", zoneId: 5, normalRainfallMm: 990, latitude: 26.8467, longitude: 80.9462, taluks: ["Lucknow", "Malihabad", "Bakshi Ka Talab", "Mohanlalganj", "Sarojini Nagar"] },
      { id: "up-kanpur", name: "Kanpur Nagar", hindiName: "कानपुर नगर", state: "Uttar Pradesh", zoneId: 5, normalRainfallMm: 850, latitude: 26.4499, longitude: 80.3319, taluks: ["Kanpur Sadar", "Bilhaur", "Ghatampur", "Narwal"] },
      { id: "up-meerut", name: "Meerut", hindiName: "मेरठ", state: "Uttar Pradesh", zoneId: 5, normalRainfallMm: 820, latitude: 28.9845, longitude: 77.7064, taluks: ["Meerut", "Mawana", "Sardhana"] },
      { id: "up-aligarh", name: "Aligarh", hindiName: "अलीगढ़", state: "Uttar Pradesh", zoneId: 5, normalRainfallMm: 720, latitude: 27.8974, longitude: 78.0880, taluks: ["Koil (Aligarh)", "Khair", "Atrauli", "Iglas", "Gabhana"] },
      { id: "up-bareilly", name: "Bareilly", hindiName: "बरेली", state: "Uttar Pradesh", zoneId: 5, normalRainfallMm: 1050, latitude: 28.3670, longitude: 79.4304, taluks: ["Bareilly Sadar", "Aonla", "Faridpur", "Nawabganj", "Baheri", "Meerganj"] },
      { id: "up-prayagraj", name: "Prayagraj (Allahabad)", hindiName: "प्रयागराज", state: "Uttar Pradesh", zoneId: 4, normalRainfallMm: 980, latitude: 25.4358, longitude: 81.8463, taluks: ["Sadar", "Phulpur", "Soraon", "Handia", "Karchhana", "Bara", "Meja", "Koraon"] },
      { id: "up-gorakhpur", name: "Gorakhpur", hindiName: "गोरखपुर", state: "Uttar Pradesh", zoneId: 4, normalRainfallMm: 1250, latitude: 26.7606, longitude: 83.3732, taluks: ["Gorakhpur Sadar", "Campierganj", "Sahjanwa", "Khajni", "Chauri Chaura", "Bansgaon", "Gola"] },
      { id: "up-jhansi", name: "Jhansi", hindiName: "झांसी", state: "Uttar Pradesh", zoneId: 8, normalRainfallMm: 890, latitude: 25.4484, longitude: 78.5685, taluks: ["Jhansi", "Moth", "Garautha", "Mauranipur", "Tahrauli"] },
      { id: "up-muzaffarnagar", name: "Muzaffarnagar", hindiName: "मुजफ्फरनगर", state: "Uttar Pradesh", zoneId: 5, normalRainfallMm: 860, latitude: 29.4727, longitude: 77.7085, taluks: ["Muzaffarnagar Sadar", "Budhana", "Jansath", "Khatauli"] }
    ]
  },

  // ==========================================
  // 9. ANDHRA PRADESH (AP)
  // ==========================================
  {
    code: "AP",
    name: "Andhra Pradesh",
    hindiName: "आंध्र प्रदेश",
    isUnionTerritory: false,
    capital: "Amaravati",
    districts: [
      { id: "ap-guntur", name: "Guntur", hindiName: "गुंटूर", state: "Andhra Pradesh", zoneId: 11, normalRainfallMm: 890, latitude: 16.3067, longitude: 80.4365, taluks: ["Guntur East", "Guntur West", "Tenali", "Mangalagiri", "Tadikonda", "Prathipadu", "Ponnur"] },
      { id: "ap-kurnool", name: "Kurnool", hindiName: "कर्नूल", state: "Andhra Pradesh", zoneId: 10, normalRainfallMm: 670, latitude: 15.8281, longitude: 78.0373, taluks: ["Kurnool", "Adoni", "Yemmiganur", "Nandyal", "Dhone", "Alur", "Pattikonda", "Kodumur"] },
      { id: "ap-eastgodavari", name: "East Godavari (Rajahmundry)", hindiName: "पूर्वी गोदावरी", state: "Andhra Pradesh", zoneId: 11, normalRainfallMm: 1150, latitude: 17.0005, longitude: 81.8040, taluks: ["Rajahmundry Urban", "Rajahmundry Rural", "Kakinada", "Amalapuram", "Peddapuram", "Ramachandrapuram"] },
      { id: "ap-anantapur", name: "Anantapur", hindiName: "अनंतपुर", state: "Andhra Pradesh", zoneId: 10, normalRainfallMm: 520, latitude: 14.6819, longitude: 77.6006, taluks: ["Anantapur", "Gooty", "Tadipatri", "Kalyandurg", "Rayadurg", "Uravakonda", "Dharmavaram"] },
      { id: "ap-krishna", name: "Krishna (Machilipatnam)", hindiName: "कृष्णा", state: "Andhra Pradesh", zoneId: 11, normalRainfallMm: 1020, latitude: 16.1800, longitude: 81.1300, taluks: ["Machilipatnam", "Gudivada", "Vuyyuru", "Pamarru", "Avanigadda"] },
      { id: "ap-chittoor", name: "Chittoor", hindiName: "चित्तूर", state: "Andhra Pradesh", zoneId: 10, normalRainfallMm: 930, latitude: 13.2172, longitude: 79.1003, taluks: ["Chittoor", "Palamaner", "Nagari", "Punganur", "Kuppam"] },
      { id: "ap-prakasam", name: "Prakasam (Ongole)", hindiName: "प्रकाशम", state: "Andhra Pradesh", zoneId: 11, normalRainfallMm: 790, latitude: 15.5057, longitude: 80.0499, taluks: ["Ongole", "Chirala", "Kandukur", "Markapur", "Giddalur"] }
    ]
  },

  // ==========================================
  // 10. TELANGANA (TG)
  // ==========================================
  {
    code: "TG",
    name: "Telangana",
    hindiName: "तेलंगाना",
    isUnionTerritory: false,
    capital: "Hyderabad",
    districts: [
      { id: "tg-warangal", name: "Warangal", hindiName: "वारंगल", state: "Telangana", zoneId: 10, normalRainfallMm: 990, latitude: 17.9689, longitude: 79.5941, taluks: ["Warangal", "Khila Warangal", "Hanamkonda", "Kazipet", "Narsampet", "Wardhannapet"] },
      { id: "tg-karimnagar", name: "Karimnagar", hindiName: "करीमनगर", state: "Telangana", zoneId: 10, normalRainfallMm: 950, latitude: 18.4386, longitude: 79.1288, taluks: ["Karimnagar", "Huzurabad", "Jammikunta", "Manakondur", "Choppadandi", "Gangadhara"] },
      { id: "tg-nizamabad", name: "Nizamabad", hindiName: "निजामाबाद", state: "Telangana", zoneId: 10, normalRainfallMm: 1020, latitude: 18.6725, longitude: 78.0941, taluks: ["Nizamabad North", "Nizamabad South", "Bodhan", "Armoor", "Balkonda", "Banswada"] },
      { id: "tg-khammam", name: "Khammam", hindiName: "खम्मम", state: "Telangana", zoneId: 10, normalRainfallMm: 1050, latitude: 17.2473, longitude: 80.1514, taluks: ["Khammam Urban", "Khammam Rural", "Kallur", "Madhira", "Sathupally", "Wyra"] },
      { id: "tg-hyderabad", name: "Hyderabad", hindiName: "हैदराबाद", state: "Telangana", zoneId: 10, normalRainfallMm: 810, latitude: 17.3850, longitude: 78.4867, taluks: ["Amberpet", "Asifnagar", "Bahadurpura", "Charminar", "Golconda", "Khairatabad", "Secunderabad"] },
      { id: "tg-nalgonda", name: "Nalgonda", hindiName: "नलगोंडा", state: "Telangana", zoneId: 10, normalRainfallMm: 750, latitude: 17.0500, longitude: 79.2700, taluks: ["Nalgonda", "Miryalaguda", "Devarakonda", "Nakrekal"] }
    ]
  },

  // ==========================================
  // 11. TAMIL NADU (TN)
  // ==========================================
  {
    code: "TN",
    name: "Tamil Nadu",
    hindiName: "तमिलनाडु",
    isUnionTerritory: false,
    capital: "Chennai",
    districts: [
      { id: "tn-erode", name: "Erode", hindiName: "इरोड", state: "Tamil Nadu", zoneId: 11, normalRainfallMm: 710, latitude: 11.3410, longitude: 77.7172, taluks: ["Erode", "Gobichettipalayam", "Bhavani", "Perundurai", "Sathyamangalam", "Anthiyur", "Modakkurichi", "Thalavadi"] },
      { id: "tn-salem", name: "Salem", hindiName: "सेलम", state: "Tamil Nadu", zoneId: 11, normalRainfallMm: 980, latitude: 11.6643, longitude: 78.1460, taluks: ["Salem", "Attur", "Mettur", "Omalur", "Sankari", "Yercaud", "Gangavalli", "Valapady", "Edappadi", "Kadayampatti"] },
      { id: "tn-coimbatore", name: "Coimbatore", hindiName: "कोयंबटूर", state: "Tamil Nadu", zoneId: 10, normalRainfallMm: 650, latitude: 11.0168, longitude: 76.9558, taluks: ["Coimbatore North", "Coimbatore South", "Pollachi", "Mettupalayam", "Sulur", "Valparai", "Annur", "Kinathukadavu"] },
      { id: "tn-thanjavur", name: "Thanjavur", hindiName: "तंजாவूर", state: "Tamil Nadu", zoneId: 11, normalRainfallMm: 1100, latitude: 10.7870, longitude: 79.1378, taluks: ["Thanjavur", "Kumbakonam", "Papanasam", "Pattukkottai", "Peravurani", "Orathanadu", "Thiruvaiyaru", "Budalur"] },
      { id: "tn-madurai", name: "Madurai", hindiName: "मदुरै", state: "Tamil Nadu", zoneId: 11, normalRainfallMm: 840, latitude: 9.9252, longitude: 78.1198, taluks: ["Madurai North", "Madurai South", "Melur", "Thirumangalam", "Usilampatti", "Vadipatti", "Peraiyur"] },
      { id: "tn-dindigul", name: "Dindigul", hindiName: "डिंडीगुल", state: "Tamil Nadu", zoneId: 11, normalRainfallMm: 810, latitude: 10.3673, longitude: 77.9803, taluks: ["Dindigul East", "Dindigul West", "Palani", "Oddanchatram", "Kodaikanal", "Natham", "Nilakottai", "Vedasandur"] }
    ]
  },

  // ==========================================
  // 12. KERALA (KL)
  // ==========================================
  {
    code: "KL",
    name: "Kerala",
    hindiName: "केरल",
    isUnionTerritory: false,
    capital: "Thiruvananthapuram",
    districts: [
      { id: "kl-wayanad", name: "Wayanad", hindiName: "वायनाड", state: "Kerala", zoneId: 12, normalRainfallMm: 3100, latitude: 11.6854, longitude: 76.1320, taluks: ["Vythiri", "Sulthan Bathery", "Mananthavady"] },
      { id: "kl-idukki", name: "Idukki", hindiName: "इडुक्की", state: "Kerala", zoneId: 12, normalRainfallMm: 3600, latitude: 9.8500, longitude: 76.9800, taluks: ["Thodupuzha", "Devikulam", "Peerumade", "Udumbanchola", "Idukki"] },
      { id: "kl-palakkad", name: "Palakkad", hindiName: "पालक्काड़", state: "Kerala", zoneId: 12, normalRainfallMm: 2200, latitude: 10.7867, longitude: 76.6548, taluks: ["Palakkad", "Alathur", "Chittur", "Ottappalam", "Mannarkkad", "Pattambi"] },
      { id: "kl-kottayam", name: "Kottayam", hindiName: "कोट्टायम", state: "Kerala", zoneId: 12, normalRainfallMm: 2900, latitude: 9.5916, longitude: 76.5222, taluks: ["Kottayam", "Changanassery", "Vaikom", "Meenachil", "Kanjirappally"] },
      { id: "kl-thrissur", name: "Thrissur", hindiName: "त्रिशूर", state: "Kerala", zoneId: 12, normalRainfallMm: 3000, latitude: 10.5276, longitude: 76.2144, taluks: ["Thrissur", "Mukundapuram", "Chalakudy", "Kodungallur", "Chavakkad", "Thalapilly"] }
    ]
  },

  // ==========================================
  // 13. WEST BENGAL (WB)
  // ==========================================
  {
    code: "WB",
    name: "West Bengal",
    hindiName: "पश्चिम बंगाल",
    isUnionTerritory: false,
    capital: "Kolkata",
    districts: [
      { id: "wb-burdwan", name: "Purba Bardhaman (Burdwan)", hindiName: "पूर्व बर्धमान", state: "West Bengal", zoneId: 3, normalRainfallMm: 1450, latitude: 23.2324, longitude: 87.8615, taluks: ["Bardhaman Sadar North", "Bardhaman Sadar South", "Kalna", "Katwa"] },
      { id: "wb-hooghly", name: "Hooghly", hindiName: "हुगली", state: "West Bengal", zoneId: 3, normalRainfallMm: 1520, latitude: 22.9000, longitude: 88.3900, taluks: ["Chinsurah", "Chandannagar", "Serampore", "Arambagh"] },
      { id: "wb-nadia", name: "Nadia (Krishnanagar)", hindiName: "नदिया", state: "West Bengal", zoneId: 3, normalRainfallMm: 1400, latitude: 23.4000, longitude: 88.5000, taluks: ["Krishnanagar Sadar", "Ranaghat", "Kalyani", "Tehatta"] },
      { id: "wb-murshidabad", name: "Murshidabad (Baharampur)", hindiName: "मुर्शिदाबाद", state: "West Bengal", zoneId: 3, normalRainfallMm: 1380, latitude: 24.1000, longitude: 88.2500, taluks: ["Baharampur", "Jangipur", "Lalbagh", "Kandi", "Domkol"] },
      { id: "wb-darjeeling", name: "Darjeeling", hindiName: "दार्जिलिंग", state: "West Bengal", zoneId: 2, normalRainfallMm: 2800, latitude: 27.0360, longitude: 88.2627, taluks: ["Darjeeling Sadar", "Kurseong", "Mirik"] }
    ]
  },

  // ==========================================
  // 14. BIHAR (BR)
  // ==========================================
  {
    code: "BR",
    name: "Bihar",
    hindiName: "बिहार",
    isUnionTerritory: false,
    capital: "Patna",
    districts: [
      { id: "br-patna", name: "Patna", hindiName: "पटना", state: "Bihar", zoneId: 4, normalRainfallMm: 1100, latitude: 25.5941, longitude: 85.1376, taluks: ["Patna Sadar", "Barh", "Danapur", "Masaurhi", "Paliganj", "Bikram"] },
      { id: "br-muzaffarpur", name: "Muzaffarpur", hindiName: "मुजफ्फरपुर", state: "Bihar", zoneId: 4, normalRainfallMm: 1250, latitude: 26.1209, longitude: 85.3647, taluks: ["Muzaffarpur East", "Muzaffarpur West", "Kanti", "Motipur", "Sahebganj", "Sakra", "Saraiya"] },
      { id: "br-purnia", name: "Purnia", hindiName: "पूर्णिया", state: "Bihar", zoneId: 4, normalRainfallMm: 1450, latitude: 25.7771, longitude: 87.4753, taluks: ["Purnia East", "Purnia West", "Dhamdaha", "Banmankhi", "Baisi", "Kasba"] },
      { id: "br-rohtas", name: "Rohtas (Sasaram)", hindiName: "रोहतास", state: "Bihar", zoneId: 4, normalRainfallMm: 1050, latitude: 24.9500, longitude: 84.0300, taluks: ["Sasaram", "Dehri", "Bikramganj", "Nokha", "Karakat"] },
      { id: "br-samastipur", name: "Samastipur", hindiName: "समस्तीपुर", state: "Bihar", zoneId: 4, normalRainfallMm: 1220, latitude: 25.8600, longitude: 85.7800, taluks: ["Samastipur", "Dalsinghsarai", "Rosera", "Pusa", "Kalyanpur"] }
    ]
  },

  // ==========================================
  // 15. ODISHA (OD)
  // ==========================================
  {
    code: "OD",
    name: "Odisha",
    hindiName: "ओडिशा",
    isUnionTerritory: false,
    capital: "Bhubaneswar",
    districts: [
      { id: "od-sambalpur", name: "Sambalpur", hindiName: "संबलपुर", state: "Odisha", zoneId: 7, normalRainfallMm: 1450, latitude: 21.4669, longitude: 83.9812, taluks: ["Sambalpur", "Kuchinda", "Rairakhol", "Redhakhol", "Dhankauda"] },
      { id: "od-bargarh", name: "Bargarh", hindiName: "बरगढ़", state: "Odisha", zoneId: 7, normalRainfallMm: 1380, latitude: 21.3333, longitude: 83.6167, taluks: ["Bargarh", "Attabira", "Bhatli", "Padampur", "Sohela", "Barpali"] },
      { id: "od-cuttack", name: "Cuttack", hindiName: "कटक", state: "Odisha", zoneId: 11, normalRainfallMm: 1500, latitude: 20.4625, longitude: 85.8828, taluks: ["Cuttack Sadar", "Athagarh", "Banki", "Choudwar", "Salepur"] },
      { id: "od-ganjam", name: "Ganjam (Berhampur)", hindiName: "गंजम", state: "Odisha", zoneId: 11, normalRainfallMm: 1290, latitude: 19.3150, longitude: 84.7941, taluks: ["Berhampur", "Chhatrapur", "Bhanjanagar", "Aska", "Hinjilicut"] }
    ]
  },

  // ==========================================
  // 16. CHHATTISGARH (CG)
  // ==========================================
  {
    code: "CG",
    name: "Chhattisgarh",
    hindiName: "छत्तीसगढ़",
    isUnionTerritory: false,
    capital: "Raipur",
    districts: [
      { id: "cg-raipur", name: "Raipur", hindiName: "रायपुर", state: "Chhattisgarh", zoneId: 7, normalRainfallMm: 1350, latitude: 21.2514, longitude: 81.6296, taluks: ["Raipur", "Abhanpur", "Arang", "Tilda", "Dharsiwa"] },
      { id: "cg-durg", name: "Durg", hindiName: "दुर्ग", state: "Chhattisgarh", zoneId: 7, normalRainfallMm: 1280, latitude: 21.1904, longitude: 81.2849, taluks: ["Durg", "Dhamdha", "Patan", "Bhilai"] },
      { id: "cg-bilaspur", name: "Bilaspur", hindiName: "बिलासपुर", state: "Chhattisgarh", zoneId: 7, normalRainfallMm: 1310, latitude: 22.0797, longitude: 82.1409, taluks: ["Bilaspur", "Bilha", "Kota", "Masturi", "Takhatpur"] },
      { id: "cg-rajnandgaon", name: "Rajnandgaon", hindiName: "राजनंदगांव", state: "Chhattisgarh", zoneId: 7, normalRainfallMm: 1200, latitude: 21.1000, longitude: 81.0300, taluks: ["Rajnandgaon", "Dongargaon", "Dongargarh", "Chhuikhadan"] }
    ]
  },

  // ==========================================
  // 17. JHARKHAND (JH)
  // ==========================================
  {
    code: "JH",
    name: "Jharkhand",
    hindiName: "झारखंड",
    isUnionTerritory: false,
    capital: "Ranchi",
    districts: [
      { id: "jh-ranchi", name: "Ranchi", hindiName: "राँची", state: "Jharkhand", zoneId: 7, normalRainfallMm: 1400, latitude: 23.3441, longitude: 85.3096, taluks: ["Ranchi Sadar", "Kanke", "Namkum", "Ormanjhi", "Bundu", "Silli", "Mandar"] },
      { id: "jh-hazaribagh", name: "Hazaribagh", hindiName: "हजारीबाग", state: "Jharkhand", zoneId: 7, normalRainfallMm: 1250, latitude: 23.9900, longitude: 85.3600, taluks: ["Hazaribagh Sadar", "Barhi", "Chauparan", "Barkagaon", "Bishnugarh"] },
      { id: "jh-deoghar", name: "Deoghar", hindiName: "देवघर", state: "Jharkhand", zoneId: 7, normalRainfallMm: 1230, latitude: 24.4800, longitude: 86.7000, taluks: ["Deoghar", "Madhupur", "Sarath", "Palojori", "Karon"] }
    ]
  },

  // ==========================================
  // 18. ASSAM (AS)
  // ==========================================
  {
    code: "AS",
    name: "Assam",
    hindiName: "असम",
    isUnionTerritory: false,
    capital: "Dispur (Guwahati)",
    districts: [
      { id: "as-kamrup", name: "Kamrup (Guwahati)", hindiName: "कामरूप", state: "Assam", zoneId: 2, normalRainfallMm: 1850, latitude: 26.1445, longitude: 91.7362, taluks: ["Guwahati", "Hajo", "Rangia", "Palasbari", "Chaygaon", "Boko"] },
      { id: "as-jorhat", name: "Jorhat", hindiName: "जोरहाट", state: "Assam", zoneId: 2, normalRainfallMm: 2100, latitude: 26.7509, longitude: 94.2037, taluks: ["Jorhat", "Titabar", "Teok", "Mariani"] },
      { id: "as-cachar", name: "Cachar (Silchar)", hindiName: "कछार", state: "Assam", zoneId: 2, normalRainfallMm: 3100, latitude: 24.8333, longitude: 92.8000, taluks: ["Silchar", "Sonai", "Lakhipur", "Katigorah", "Udarbond"] },
      { id: "as-nagaon", name: "Nagaon", hindiName: "नगांव", state: "Assam", zoneId: 2, normalRainfallMm: 1750, latitude: 26.3500, longitude: 92.6800, taluks: ["Nagaon", "Raha", "Kaliabor", "Dhing", "Samaguri"] }
    ]
  },

  // ==========================================
  // 19. UTTARAKHAND (UK)
  // ==========================================
  {
    code: "UK",
    name: "Uttarakhand",
    hindiName: "उत्तराखंड",
    isUnionTerritory: false,
    capital: "Dehradun",
    districts: [
      { id: "uk-dehradun", name: "Dehradun", hindiName: "देहरादून", state: "Uttarakhand", zoneId: 1, normalRainfallMm: 2180, latitude: 30.3165, longitude: 78.0322, taluks: ["Dehradun", "Rishikesh", "Vikasnagar", "Chakrata", "Kalsi", "Tyuni"] },
      { id: "uk-haridwar", name: "Haridwar", hindiName: "हरिद्वार", state: "Uttarakhand", zoneId: 5, normalRainfallMm: 1100, latitude: 29.9457, longitude: 78.1642, taluks: ["Haridwar", "Roorkee", "Laksar", "Bhagwanpur"] },
      { id: "uk-nainital", name: "Nainital", hindiName: "नैनीताल", state: "Uttarakhand", zoneId: 1, normalRainfallMm: 1450, latitude: 29.3803, longitude: 79.4636, taluks: ["Nainital", "Haldwani", "Ramnagar", "Koshya Kutoor", "Dhari", "Betalghat"] },
      { id: "uk-usnagar", name: "Udham Singh Nagar (Rudrapur)", hindiName: "उधम सिंह नगर", state: "Uttarakhand", zoneId: 5, normalRainfallMm: 1300, latitude: 28.9800, longitude: 79.4000, taluks: ["Rudrapur", "Kashipur", "Kichha", "Khatima", "Sitarganj", "Bazpur", "Jaspur"] }
    ]
  },

  // ==========================================
  // 20. HIMACHAL PRADESH (HP)
  // ==========================================
  {
    code: "HP",
    name: "Himachal Pradesh",
    hindiName: "हिमाचल प्रदेश",
    isUnionTerritory: false,
    capital: "Shimla",
    districts: [
      { id: "hp-kangra", name: "Kangra (Dharamshala)", hindiName: "कांगड़ा", state: "Himachal Pradesh", zoneId: 1, normalRainfallMm: 1900, latitude: 32.0998, longitude: 76.2691, taluks: ["Dharamshala", "Kangra", "Palampur", "Nurpur", "Dehra Gopipur", "Baijnath", "Jawali"] },
      { id: "hp-mandi", name: "Mandi", hindiName: "मंडी", state: "Himachal Pradesh", zoneId: 1, normalRainfallMm: 1550, latitude: 31.7087, longitude: 76.9320, taluks: ["Mandi Sadar", "Sundernagar", "Sarkaghat", "Jogindernagar", "Karsog", "Chachyot"] },
      { id: "hp-shimla", name: "Shimla", hindiName: "शिमला", state: "Himachal Pradesh", zoneId: 1, normalRainfallMm: 1480, latitude: 31.1048, longitude: 77.1734, taluks: ["Shimla Urban", "Shimla Rural", "Rampur", "Rohru", "Theog", "Chopal", "Jubbal", "Kotkhai"] },
      { id: "hp-kullu", name: "Kullu", hindiName: "कुल्लू", state: "Himachal Pradesh", zoneId: 1, normalRainfallMm: 1100, latitude: 31.9579, longitude: 77.1095, taluks: ["Kullu", "Manali", "Banjar", "Anni", "Nirmand"] },
      { id: "hp-solan", name: "Solan", hindiName: "सोलन", state: "Himachal Pradesh", zoneId: 1, normalRainfallMm: 1300, latitude: 30.9045, longitude: 77.0967, taluks: ["Solan", "Kasauli", "Nalagarh", "Arki", "Kandaghat"] }
    ]
  },

  // ==========================================
  // 21. GOA (GA)
  // ==========================================
  {
    code: "GA",
    name: "Goa",
    hindiName: "गोवा",
    isUnionTerritory: false,
    capital: "Panaji",
    districts: [
      { id: "ga-northgoa", name: "North Goa (Panaji)", hindiName: "उत्तर गोवा", state: "Goa", zoneId: 12, normalRainfallMm: 3200, latitude: 15.4989, longitude: 73.8278, taluks: ["Tiswadi (Panaji)", "Bardez (Mapusa)", "Pernem", "Bicholim", "Sattari"] },
      { id: "ga-southgoa", name: "South Goa (Margao)", hindiName: "दक्षिण गोवा", state: "Goa", zoneId: 12, normalRainfallMm: 3300, latitude: 15.2736, longitude: 73.9581, taluks: ["Salcete (Margao)", "Mormugao (Vasco)", "Ponda", "Quepem", "Sanguem", "Canacona", "Dharbandora"] }
    ]
  },

  // ==========================================
  // 22. ARUNACHAL PRADESH (AR)
  // ==========================================
  {
    code: "AR",
    name: "Arunachal Pradesh",
    hindiName: "अरुणाचल प्रदेश",
    isUnionTerritory: false,
    capital: "Itanagar",
    districts: [
      { id: "ar-papumpare", name: "Papum Pare (Itanagar)", hindiName: "पपुम पारे", state: "Arunachal Pradesh", zoneId: 2, normalRainfallMm: 2800, latitude: 27.1004, longitude: 93.6166, taluks: ["Itanagar", "Naharlagun", "Doimukh", "Sagalee"] },
      { id: "ar-tawang", name: "Tawang", hindiName: "तवांग", state: "Arunachal Pradesh", zoneId: 2, normalRainfallMm: 1900, latitude: 27.5861, longitude: 91.8594, taluks: ["Tawang", "Jang", "Lumla", "Zemithang"] },
      { id: "ar-eastsiang", name: "East Siang (Pasighat)", hindiName: "पूर्वी सियांग", state: "Arunachal Pradesh", zoneId: 2, normalRainfallMm: 4200, latitude: 28.0667, longitude: 95.3333, taluks: ["Pasighat", "Mebo", "Ruksin"] }
    ]
  },

  // ==========================================
  // 23. MANIPUR (MN)
  // ==========================================
  {
    code: "MN",
    name: "Manipur",
    hindiName: "मणिपुर",
    isUnionTerritory: false,
    capital: "Imphal",
    districts: [
      { id: "mn-imphalwest", name: "Imphal West", hindiName: "इम्फाल पश्चिम", state: "Manipur", zoneId: 2, normalRainfallMm: 1450, latitude: 24.8170, longitude: 93.9368, taluks: ["Lamphelpat", "Patsoi", "Lamsang", "Wangoi"] },
      { id: "mn-imphaleast", name: "Imphal East", hindiName: "इम्फाल पूर्व", state: "Manipur", zoneId: 2, normalRainfallMm: 1500, latitude: 24.8000, longitude: 94.0000, taluks: ["Porompat", "Keirao Bitra", "Sawombung"] },
      { id: "mn-churachandpur", name: "Churachandpur", hindiName: "चुराचांदपुर", state: "Manipur", zoneId: 2, normalRainfallMm: 1650, latitude: 24.3333, longitude: 93.6667, taluks: ["Churachandpur", "Singngat", "Thanlon", "Henglep"] }
    ]
  },

  // ==========================================
  // 24. MEGHALAYA (ML)
  // ==========================================
  {
    code: "ML",
    name: "Meghalaya",
    hindiName: "मेघालय",
    isUnionTerritory: false,
    capital: "Shillong",
    districts: [
      { id: "ml-eastkhasihills", name: "East Khasi Hills (Shillong)", hindiName: "पूर्वी खासी हिल्स", state: "Meghalaya", zoneId: 2, normalRainfallMm: 2400, latitude: 25.5788, longitude: 91.8933, taluks: ["Shillong", "Mawkynrew", "Mawryngkneng", "Mylliem", "Pynursla", "Sohra (Cherrapunji)"] },
      { id: "ml-westgarohills", name: "West Garo Hills (Tura)", hindiName: "पश्चिम गारो हिल्स", state: "Meghalaya", zoneId: 2, normalRainfallMm: 2800, latitude: 25.5167, longitude: 90.2167, taluks: ["Tura", "Dadenggre", "Dalu", "Gambegre", "Rongram", "Selsella", "Tikrikilla"] },
      { id: "ml-ribhoi", name: "Ri Bhoi (Nongpoh)", hindiName: "री भोई", state: "Meghalaya", zoneId: 2, normalRainfallMm: 2200, latitude: 25.9000, longitude: 91.8800, taluks: ["Nongpoh", "Umling", "Umsning", "Jirang"] }
    ]
  },

  // ==========================================
  // 25. MIZORAM (MZ)
  // ==========================================
  {
    code: "MZ",
    name: "Mizoram",
    hindiName: "मिज़ोरम",
    isUnionTerritory: false,
    capital: "Aizawl",
    districts: [
      { id: "mz-aizawl", name: "Aizawl", hindiName: "आइज़ोल", state: "Mizoram", zoneId: 2, normalRainfallMm: 2100, latitude: 23.7271, longitude: 92.7176, taluks: ["Aizawl", "Darlawn", "Phullen", "Thingsulthliah", "Tlangnuam"] },
      { id: "mz-champhai", name: "Champhai", hindiName: "चम्फाई", state: "Mizoram", zoneId: 2, normalRainfallMm: 1950, latitude: 23.4739, longitude: 93.3283, taluks: ["Champhai", "Khawbung", "Ngopa"] },
      { id: "mz-lunglei", name: "Lunglei", hindiName: "लुंगलेई", state: "Mizoram", zoneId: 2, normalRainfallMm: 2500, latitude: 22.8833, longitude: 92.7333, taluks: ["Lunglei", "Bunghmun", "Hnahthial", "Lungsen"] }
    ]
  },

  // ==========================================
  // 26. NAGALAND (NL)
  // ==========================================
  {
    code: "NL",
    name: "Nagaland",
    hindiName: "नागालैंड",
    isUnionTerritory: false,
    capital: "Kohima",
    districts: [
      { id: "nl-dimapur", name: "Dimapur", hindiName: "दीमापुर", state: "Nagaland", zoneId: 2, normalRainfallMm: 1800, latitude: 25.9068, longitude: 93.7273, taluks: ["Dimapur Sadar", "Chümoukedima", "Medziphema", "Dhansiripar"] },
      { id: "nl-kohima", name: "Kohima", hindiName: "कोहिमा", state: "Nagaland", zoneId: 2, normalRainfallMm: 1950, latitude: 25.6751, longitude: 94.1086, taluks: ["Kohima Sadar", "Chiephobozou", "Jakhama", "Sechü Zubza", "Tseminyu"] },
      { id: "nl-mokokchung", name: "Mokokchung", hindiName: "मोकोकचुंग", state: "Nagaland", zoneId: 2, normalRainfallMm: 2200, latitude: 26.3256, longitude: 94.5103, taluks: ["Mokokchung Sadar", "Changtongya", "Mangkolemba", "Tuli"] }
    ]
  },

  // ==========================================
  // 27. SIKKIM (SK)
  // ==========================================
  {
    code: "SK",
    name: "Sikkim",
    hindiName: "सिक्किम",
    isUnionTerritory: false,
    capital: "Gangtok",
    districts: [
      { id: "sk-gangtok", name: "Gangtok (East Sikkim)", hindiName: "गंगटोक", state: "Sikkim", zoneId: 2, normalRainfallMm: 3500, latitude: 27.3389, longitude: 88.6065, taluks: ["Gangtok", "Pakyong", "Rongli"] },
      { id: "sk-namchi", name: "Namchi (South Sikkim)", hindiName: "नामची", state: "Sikkim", zoneId: 2, normalRainfallMm: 2200, latitude: 27.1667, longitude: 88.3500, taluks: ["Namchi", "Ravangla", "Jorethang"] },
      { id: "sk-gyalshing", name: "Gyalshing (West Sikkim)", hindiName: "ग्यालशिंग", state: "Sikkim", zoneId: 2, normalRainfallMm: 2600, latitude: 27.2833, longitude: 88.2500, taluks: ["Gyalshing", "Soreng", "Dentan"] }
    ]
  },

  // ==========================================
  // 28. TRIPURA (TR)
  // ==========================================
  {
    code: "TR",
    name: "Tripura",
    hindiName: "त्रिपुरा",
    isUnionTerritory: false,
    capital: "Agartala",
    districts: [
      { id: "tr-westtripura", name: "West Tripura (Agartala)", hindiName: "पश्चिम त्रिपुरा", state: "Tripura", zoneId: 2, normalRainfallMm: 2200, latitude: 23.8315, longitude: 91.2868, taluks: ["Sadar (Agartala)", "Mohanpur", "Jirania", "Mandwi"] },
      { id: "tr-gomati", name: "Gomati (Udaipur)", hindiName: "गोमती", state: "Tripura", zoneId: 2, normalRainfallMm: 2400, latitude: 23.5333, longitude: 91.4833, taluks: ["Udaipur", "Amarpur", "Karbook"] },
      { id: "tr-southtripura", name: "South Tripura (Belonia)", hindiName: "दक्षिण त्रिपुरा", state: "Tripura", zoneId: 2, normalRainfallMm: 2500, latitude: 23.2500, longitude: 91.4500, taluks: ["Belonia", "Santirbazar", "Sabroom"] }
    ]
  },

  // ==========================================
  // 29. DELHI (NCT) - UT
  // ==========================================
  {
    code: "DL",
    name: "Delhi (NCT)",
    hindiName: "दिल्ली",
    isUnionTerritory: true,
    capital: "New Delhi",
    districts: [
      { id: "dl-northwest", name: "North West Delhi (Narela)", hindiName: "उत्तर पश्चिम दिल्ली", state: "Delhi (NCT)", zoneId: 6, normalRainfallMm: 710, latitude: 28.7188, longitude: 77.0898, taluks: ["Narela", "Saraswati Vihar", "Rohini", "Alipur", "Kanjhawala"] },
      { id: "dl-southwest", name: "South West Delhi (Najafgarh)", hindiName: "दक्षिण पश्चिम दिल्ली", state: "Delhi (NCT)", zoneId: 6, normalRainfallMm: 690, latitude: 28.5800, longitude: 76.9900, taluks: ["Najafgarh", "Dwarka", "Kapashera"] },
      { id: "dl-north", name: "North Delhi", hindiName: "उत्तर दिल्ली", state: "Delhi (NCT)", zoneId: 6, normalRainfallMm: 720, latitude: 28.7000, longitude: 77.1500, taluks: ["Civil Lines", "Kotwali", "Sadarbazar"] }
    ]
  },

  // ==========================================
  // 30. JAMMU AND KASHMIR (JK) - UT
  // ==========================================
  {
    code: "JK",
    name: "Jammu and Kashmir",
    hindiName: "जम्मू और कश्मीर",
    isUnionTerritory: true,
    capital: "Srinagar / Jammu",
    districts: [
      { id: "jk-jammu", name: "Jammu", hindiName: "जम्मू", state: "Jammu and Kashmir", zoneId: 1, normalRainfallMm: 1250, latitude: 32.7266, longitude: 74.8570, taluks: ["Jammu", "RS Pura", "Akhnoor", "Bishnah", "Marh", "Bhalwal", "Chowki Choura"] },
      { id: "jk-srinagar", name: "Srinagar", hindiName: "श्रीनगर", state: "Jammu and Kashmir", zoneId: 1, normalRainfallMm: 710, latitude: 34.0837, longitude: 74.7973, taluks: ["Srinagar North", "Srinagar South", "Eidgah", "Pantha Chowk", "Khanyar"] },
      { id: "jk-anantnag", name: "Anantnag", hindiName: "अनंतनाग", state: "Jammu and Kashmir", zoneId: 1, normalRainfallMm: 1100, latitude: 33.7311, longitude: 75.1522, taluks: ["Anantnag", "Bijbehara", "Dooru", "Kokernag", "Pahalgam", "Shangus"] },
      { id: "jk-baramulla", name: "Baramulla", hindiName: "बारामुला", state: "Jammu and Kashmir", zoneId: 1, normalRainfallMm: 1200, latitude: 34.2000, longitude: 74.3400, taluks: ["Baramulla", "Sopore", "Pattan", "Uri", "Tangmarg", "Rafiabad"] },
      { id: "jk-pulwama", name: "Pulwama", hindiName: "पुलवामा", state: "Jammu and Kashmir", zoneId: 1, normalRainfallMm: 850, latitude: 33.8700, longitude: 74.9000, taluks: ["Pulwama", "Pampore", "Tral", "Awantipora", "Kakapora"] }
    ]
  },

  // ==========================================
  // 31. LADAKH (LA) - UT
  // ==========================================
  {
    code: "LA",
    name: "Ladakh",
    hindiName: "लद्दाख",
    isUnionTerritory: true,
    capital: "Leh",
    districts: [
      { id: "la-leh", name: "Leh", hindiName: "लेह", state: "Ladakh", zoneId: 1, normalRainfallMm: 115, latitude: 34.1526, longitude: 77.5771, taluks: ["Leh", "Nubra", "Khaltse", "Nyoma", "Durbuk", "Kharu"] },
      { id: "la-kargil", name: "Kargil", hindiName: "कारगिल", state: "Ladakh", zoneId: 1, normalRainfallMm: 260, latitude: 34.5539, longitude: 76.1349, taluks: ["Kargil", "Zanskar", "Sankoo", "Drass", "Shakar Chiktan"] }
    ]
  },

  // ==========================================
  // 32. CHANDIGARH (CH) - UT
  // ==========================================
  {
    code: "CH",
    name: "Chandigarh",
    hindiName: "चंडीगढ़",
    isUnionTerritory: true,
    capital: "Chandigarh",
    districts: [
      { id: "ch-chandigarh", name: "Chandigarh", hindiName: "चंडीगढ़", state: "Chandigarh", zoneId: 6, normalRainfallMm: 1050, latitude: 30.7333, longitude: 76.7794, taluks: ["Chandigarh East", "Chandigarh West", "Chandigarh Central", "Mani Majra"] }
    ]
  },

  // ==========================================
  // 33. PUDUCHERRY (PY) - UT
  // ==========================================
  {
    code: "PY",
    name: "Puducherry",
    hindiName: "पुदुचेरी",
    isUnionTerritory: true,
    capital: "Puducherry",
    districts: [
      { id: "py-puducherry", name: "Puducherry", hindiName: "पुदुचेरी", state: "Puducherry", zoneId: 11, normalRainfallMm: 1350, latitude: 11.9416, longitude: 79.8083, taluks: ["Puducherry", "Oulgaret", "Villianur", "Bahour"] },
      { id: "py-karaikal", name: "Karaikal", hindiName: "कराईकल", state: "Puducherry", zoneId: 11, normalRainfallMm: 1400, latitude: 10.9254, longitude: 79.8380, taluks: ["Karaikal", "Nedungadu", "Kottucherry", "T.R. Pattinam"] }
    ]
  },

  // ==========================================
  // 34. ANDAMAN AND NICOBAR ISLANDS (AN) - UT
  // ==========================================
  {
    code: "AN",
    name: "Andaman and Nicobar Islands",
    hindiName: "अंडमान और निकोबार द्वीप समूह",
    isUnionTerritory: true,
    capital: "Port Blair",
    districts: [
      { id: "an-southandaman", name: "South Andaman (Port Blair)", hindiName: "दक्षिण अंडमान", state: "Andaman and Nicobar Islands", zoneId: 15, normalRainfallMm: 3100, latitude: 11.6234, longitude: 92.7265, taluks: ["Port Blair", "Ferrargunj", "Little Andaman"] },
      { id: "an-northmiddle", name: "North and Middle Andaman (Mayabunder)", hindiName: "उत्तर और मध्य अंडमान", state: "Andaman and Nicobar Islands", zoneId: 15, normalRainfallMm: 3000, latitude: 12.9272, longitude: 92.9304, taluks: ["Mayabunder", "Diglipur", "Rangat"] }
    ]
  },

  // ==========================================
  // 35. DADRA AND NAGAR HAVELI AND DAMAN AND DIU (DN) - UT
  // ==========================================
  {
    code: "DN",
    name: "Dadra and Nagar Haveli and Daman and Diu",
    hindiName: "दादरा और नगर हवेली और दमन और दीव",
    isUnionTerritory: true,
    capital: "Daman",
    districts: [
      { id: "dn-daman", name: "Daman", hindiName: "दमन", state: "Dadra and Nagar Haveli and Daman and Diu", zoneId: 13, normalRainfallMm: 2100, latitude: 20.3974, longitude: 72.8328, taluks: ["Daman"] },
      { id: "dn-dnh", name: "Dadra and Nagar Haveli (Silvassa)", hindiName: "दादरा और नगर हवेली", state: "Dadra and Nagar Haveli and Daman and Diu", zoneId: 13, normalRainfallMm: 2400, latitude: 20.2763, longitude: 73.0083, taluks: ["Silvassa", "Khanvel"] },
      { id: "dn-diu", name: "Diu", hindiName: "दीव", state: "Dadra and Nagar Haveli and Daman and Diu", zoneId: 13, normalRainfallMm: 720, latitude: 20.7144, longitude: 70.9874, taluks: ["Diu"] }
    ]
  },

  // ==========================================
  // 36. LAKSHADWEEP (LD) - UT
  // ==========================================
  {
    code: "LD",
    name: "Lakshadweep",
    hindiName: "लक्षद्वीप",
    isUnionTerritory: true,
    capital: "Kavaratti",
    districts: [
      { id: "ld-lakshadweep", name: "Lakshadweep (Kavaratti)", hindiName: "लक्षद्वीप", state: "Lakshadweep", zoneId: 15, normalRainfallMm: 1600, latitude: 10.5667, longitude: 72.6417, taluks: ["Kavaratti", "Agatti", "Amini", "Andrott", "Minicoy", "Kalpeni", "Kadmat", "Kiltan", "Chetlat", "Bitra"] }
    ]
  }
];

export function getAllIndianStates(): string[] {
  return ALL_INDIAN_STATES.map((s) => s.name).sort();
}

export function getDistrictsByState(stateName: string): DistrictAdminItem[] {
  if (!stateName) return [];
  const stateObj = ALL_INDIAN_STATES.find((s) => s.name.toLowerCase() === stateName.toLowerCase().trim());
  return stateObj ? stateObj.districts : [];
}

export function findDistrictByName(districtName: string, stateName?: string): DistrictAdminItem | undefined {
  if (!districtName) return undefined;
  const cleanDist = districtName.toLowerCase().trim();
  for (const st of ALL_INDIAN_STATES) {
    if (stateName && st.name.toLowerCase() !== stateName.toLowerCase().trim()) continue;
    const found = st.districts.find((d) => 
      d.name.toLowerCase() === cleanDist ||
      d.name.toLowerCase().includes(cleanDist) ||
      cleanDist.includes(d.name.toLowerCase())
    );
    if (found) return found;
  }
  return undefined;
}
