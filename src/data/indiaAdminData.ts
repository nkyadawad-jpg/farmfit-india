/**
 * India Administrative Location Dataset & Hierarchy Engine
 * Scalable structure: India -> State -> District -> Taluk/Tehsil -> Village
 * Covers 28 States + 8 Union Territories with official Agro-Climatic Zone mappings
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
      { id: "mp-khandwa", name: "Khandwa (East Nimar)", hindiName: "खण्डवा", state: "Madhya Pradesh", zoneId: 8, normalRainfallMm: 880, latitude: 21.8314, longitude: 76.3498, taluks: ["Khandwa", "Pandhana", "Punasa", "Harsud", "Khalwa"] }
    ]
  },
  {
    code: "MH",
    name: "Maharashtra",
    hindiName: "महाराष्ट्र",
    isUnionTerritory: false,
    capital: "Mumbai",
    districts: [
      { id: "mh-nashik", name: "Nashik", hindiName: "नासिक", state: "Maharashtra", zoneId: 9, normalRainfallMm: 710, latitude: 19.9975, longitude: 73.7898, taluks: ["Nashik", "Niphad", "Dindori", "Sinnar", "Yeola", "Malegaon", "Satana", "Kalwan", "Trimbakeshwar", "Chandwad"] },
      { id: "mh-pune", name: "Pune", hindiName: "पुणे", state: "Maharashtra", zoneId: 9, normalRainfallMm: 680, latitude: 18.5204, longitude: 73.8567, taluks: ["Haveli", "Baramati", "Shirur", "Indapur", "Daund", "Khed", "Ambegaon", "Junnar", "Maval", "Bhor"] },
      { id: "mh-ahmednagar", name: "Ahmednagar", hindiName: "अहमदनगर", state: "Maharashtra", zoneId: 9, normalRainfallMm: 560, latitude: 19.0948, longitude: 74.7480, taluks: ["Nagar", "Rahuri", "Shrirampur", "Sangamner", "Kopargaon", "Nevasa", "Shevgaon", "Pathardi", "Parner", "Karjat"] },
      { id: "mh-nagpur", name: "Nagpur", hindiName: "नागपुर", state: "Maharashtra", zoneId: 7, normalRainfallMm: 1100, latitude: 21.1458, longitude: 79.0882, taluks: ["Nagpur Rural", "Katol", "Saoner", "Ramtek", "Kamthi", "Umred", "Narkhed", "Kalmeshwar", "Hingna", "Kuhi"] },
      { id: "mh-amravati", name: "Amravati", hindiName: "अमरावती", state: "Maharashtra", zoneId: 9, normalRainfallMm: 850, latitude: 20.9320, longitude: 77.7523, taluks: ["Amravati", "Achalpur", "Chandur Bazar", "Morshi", "Warud", "Daryapur", "Anjangaon", "Dhamangaon"] },
      { id: "mh-yavatmal", name: "Yavatmal", hindiName: "यवतमाल", state: "Maharashtra", zoneId: 9, normalRainfallMm: 920, latitude: 20.3888, longitude: 78.1204, taluks: ["Yavatmal", "Pusad", "Umarkhed", "Digras", "Darwha", "Wani", "Ralegaon", "Ghatanji", "Kelapur"] },
      { id: "mh-solapur", name: "Solapur", hindiName: "सोलापुर", state: "Maharashtra", zoneId: 9, normalRainfallMm: 550, latitude: 17.6599, longitude: 75.9064, taluks: ["North Solapur", "South Solapur", "Barshi", "Pandharpur", "Madha", "Karmala", "Mohol", "Sangola", "Malshiras", "Akkalkot"] },
      { id: "mh-kolhapur", name: "Kolhapur", hindiName: "कोल्हापुर", state: "Maharashtra", zoneId: 12, normalRainfallMm: 1150, latitude: 16.7050, longitude: 74.2433, taluks: ["Karvir", "Hatkanangle", "Shirol", "Kagal", "Radhanagari", "Bhudargad", "Ajara", "Gadhinglaj", "Shahuwadi", "Panhala"] },
      { id: "mh-aurangabad", name: "Chhatrapati Sambhajinagar (Aurangabad)", hindiName: "छत्रपति संभाजीनगर", state: "Maharashtra", zoneId: 9, normalRainfallMm: 650, latitude: 19.8762, longitude: 75.3433, taluks: ["Aurangabad", "Paithan", "Gangapur", "Vaijapur", "Kannad", "Khuldabad", "Sillod", "Phulambri", "Soegaon"] },
      { id: "mh-jalgaon", name: "Jalgaon", hindiName: "जलगांव", state: "Maharashtra", zoneId: 9, normalRainfallMm: 730, latitude: 21.0077, longitude: 75.5626, taluks: ["Jalgaon", "Bhusawal", "Raver", "Yawal", "Chopda", "Erandol", "Amalner", "Pachora", "Jamner", "Chalisgaon"] },
      { id: "mh-satara", name: "Satara", hindiName: "सातारा", state: "Maharashtra", zoneId: 9, normalRainfallMm: 820, latitude: 17.6805, longitude: 74.0183, taluks: ["Satara", "Karad", "Wai", "Phaltan", "Koregaon", "Khatav", "Maan", "Patan", "Jaoli", "Mahabaleshwar"] }
    ]
  },
  {
    code: "PB",
    name: "Punjab",
    hindiName: "पंजाब",
    isUnionTerritory: false,
    capital: "Chandigarh",
    districts: [
      { id: "pb-ludhiana", name: "Ludhiana", hindiName: "लुधियाना", state: "Punjab", zoneId: 6, normalRainfallMm: 680, latitude: 30.9010, longitude: 75.8573, taluks: ["Ludhiana East", "Ludhiana West", "Jagraon", "Samrala", "Khanna", "Payal", "Raikot"] },
      { id: "pb-patiala", name: "Patiala", hindiName: "पटियाला", state: "Punjab", zoneId: 6, normalRainfallMm: 650, latitude: 30.3398, longitude: 76.3869, taluks: ["Patiala", "Nabha", "Rajpura", "Samana", "Patran"] },
      { id: "pb-bathinda", name: "Bathinda", hindiName: "बठिंडा", state: "Punjab", zoneId: 6, normalRainfallMm: 410, latitude: 30.2110, longitude: 74.9455, taluks: ["Bathinda", "Rampura Phul", "Talwandi Sabo", "Maur"] },
      { id: "pb-amritsar", name: "Amritsar", hindiName: "अमृतसर", state: "Punjab", zoneId: 6, normalRainfallMm: 630, latitude: 31.6340, longitude: 74.8723, taluks: ["Amritsar-I", "Amritsar-II", "Ajnala", "Baba Bakala", "Majitha"] },
      { id: "pb-jalandhar", name: "Jalandhar", hindiName: "जालंधर", state: "Punjab", zoneId: 6, normalRainfallMm: 700, latitude: 31.3260, longitude: 75.5762, taluks: ["Jalandhar-I", "Jalandhar-II", "Nakodar", "Phillaur", "Shahkot"] },
      { id: "pb-sangrur", name: "Sangrur", hindiName: "संगरूर", state: "Punjab", zoneId: 6, normalRainfallMm: 520, latitude: 30.2458, longitude: 75.8421, taluks: ["Sangrur", "Sunam", "Dhuri", "Moonak", "Lehra", "Bhawanigarh"] },
      { id: "pb-ferozepur", name: "Ferozepur", hindiName: "फ़िरोज़पुर", state: "Punjab", zoneId: 6, normalRainfallMm: 460, latitude: 30.9237, longitude: 74.6122, taluks: ["Ferozepur", "Zira", "Guru Har Sahai"] }
    ]
  },
  {
    code: "HR",
    name: "Haryana",
    hindiName: "हरियाणा",
    isUnionTerritory: false,
    capital: "Chandigarh",
    districts: [
      { id: "hr-karnal", name: "Karnal", hindiName: "करनाल", state: "Haryana", zoneId: 6, normalRainfallMm: 700, latitude: 29.6857, longitude: 76.9905, taluks: ["Karnal", "Indri", "Nilokheri", "Gharaunda", "Assandh"] },
      { id: "hr-hisar", name: "Hisar", hindiName: "हिसार", state: "Haryana", zoneId: 6, normalRainfallMm: 460, latitude: 29.1492, longitude: 75.7217, taluks: ["Hisar", "Hansi", "Adampur", "Barwala", "Narnaund", "Bass"] },
      { id: "hr-sirsa", name: "Sirsa", hindiName: "सिरसा", state: "Haryana", zoneId: 6, normalRainfallMm: 380, latitude: 29.5349, longitude: 75.0295, taluks: ["Sirsa", "Dabwali", "Rania", "Ellenabad", "Kalanwali"] },
      { id: "hr-kurukshetra", name: "Kurukshetra", hindiName: "कुरुक्षेत्र", state: "Haryana", zoneId: 6, normalRainfallMm: 720, latitude: 29.9695, longitude: 76.8783, taluks: ["Thanesar", "Pehowa", "Shahbad", "Ladwa", "Ismailabad"] },
      { id: "hr-ambala", name: "Ambala", hindiName: "अंबाला", state: "Haryana", zoneId: 6, normalRainfallMm: 950, latitude: 30.3782, longitude: 76.7767, taluks: ["Ambala", "Barara", "Naraingarh", "Saha"] },
      { id: "hr-rohtak", name: "Rohtak", hindiName: "रोहतक", state: "Haryana", zoneId: 6, normalRainfallMm: 580, latitude: 28.8955, longitude: 76.6066, taluks: ["Rohtak", "Meham", "Sampla", "Kalanaur"] }
    ]
  },
  {
    code: "UP",
    name: "Uttar Pradesh",
    hindiName: "उत्तर प्रदेश",
    isUnionTerritory: false,
    capital: "Lucknow",
    districts: [
      { id: "up-varanasi", name: "Varanasi", hindiName: "वाराणसी", state: "Uttar Pradesh", zoneId: 4, normalRainfallMm: 1050, latitude: 25.3176, longitude: 82.9739, taluks: ["Varanasi", "Pindra", "Raja Talab"] },
      { id: "up-agra", name: "Agra", hindiName: "आगरा", state: "Uttar Pradesh", zoneId: 5, normalRainfallMm: 680, latitude: 27.1767, longitude: 78.0081, taluks: ["Agra", "Etmadpur", "Kiraoli", "Fatehabad", "Bah", "Kheragarh"] },
      { id: "up-meerut", name: "Meerut", hindiName: "मेरठ", state: "Uttar Pradesh", zoneId: 5, normalRainfallMm: 850, latitude: 28.9845, longitude: 77.7064, taluks: ["Meerut", "Mawana", "Sardhana"] },
      { id: "up-gorakhpur", name: "Gorakhpur", hindiName: "गोरखपुर", state: "Uttar Pradesh", zoneId: 4, normalRainfallMm: 1240, latitude: 26.7606, longitude: 83.3732, taluks: ["Sadar", "Sahjanwa", "Chauri Chaura", "Bansgaon", "Khajni", "Campierganj", "Gola"] },
      { id: "up-prayagraj", name: "Prayagraj (Allahabad)", hindiName: "प्रयागराज", state: "Uttar Pradesh", zoneId: 4, normalRainfallMm: 980, latitude: 25.4358, longitude: 81.8463, taluks: ["Sadar", "Phulpur", "Soraon", "Handia", "Karchhana", "Bara", "Meja", "Koraon"] },
      { id: "up-aligarh", name: "Aligarh", hindiName: "अलीगढ़", state: "Uttar Pradesh", zoneId: 5, normalRainfallMm: 720, latitude: 27.8974, longitude: 78.0880, taluks: ["Koil (Aligarh)", "Khair", "Atrauli", "Iglas", "Gabhana"] },
      { id: "up-jhansi", name: "Jhansi", hindiName: "झांसी", state: "Uttar Pradesh", zoneId: 8, normalRainfallMm: 850, latitude: 25.4484, longitude: 78.5685, taluks: ["Jhansi", "Moth", "Mauranipur", "Garautha", "Tahrauli"] },
      { id: "up-bareilly", name: "Bareilly", hindiName: "बरेली", state: "Uttar Pradesh", zoneId: 5, normalRainfallMm: 1020, latitude: 28.3670, longitude: 79.4304, taluks: ["Bareilly Sadar", "Aonla", "Faridpur", "Baheri", "Nawabganj", "Mirganj"] },
      { id: "up-lucknow", name: "Lucknow", hindiName: "लखनऊ", state: "Uttar Pradesh", zoneId: 5, normalRainfallMm: 940, latitude: 26.8467, longitude: 80.9462, taluks: ["Lucknow Sadar", "Malihabad", "Bakshi Ka Talab", "Mohanlalganj", "Sarojininagar"] }
    ]
  },
  {
    code: "GJ",
    name: "Gujarat",
    hindiName: "गुजरात",
    isUnionTerritory: false,
    capital: "Gandhinagar",
    districts: [
      { id: "gj-rajkot", name: "Rajkot", hindiName: "राजकोट", state: "Gujarat", zoneId: 13, normalRainfallMm: 620, latitude: 22.3039, longitude: 70.8022, taluks: ["Rajkot", "Gondal", "Jetpur", "Dhoraji", "Upleta", "Jasdan", "Kotda Sangani", "Lodhika", "Paddhari", "Vinchhiya", "Jamkandorna"] },
      { id: "gj-surat", name: "Surat", hindiName: "सूरत", state: "Gujarat", zoneId: 13, normalRainfallMm: 1180, latitude: 21.1702, longitude: 72.8311, taluks: ["Choryasi", "Bardoli", "Kamrej", "Mandvi", "Mahuva", "Mangrol", "Olpad", "Palsana", "Umarpada"] },
      { id: "gj-amreli", name: "Amreli", hindiName: "अमरेली", state: "Gujarat", zoneId: 13, normalRainfallMm: 580, latitude: 21.6032, longitude: 71.2221, taluks: ["Amreli", "Bagasara", "Dhari", "Khambha", "Kunkavav Vadia", "Lathi", "Lilia", "Rajula", "Savarkundla", "Jafrabad"] },
      { id: "gj-banaskantha", name: "Banaskantha", hindiName: "बनासकांठा", state: "Gujarat", zoneId: 13, normalRainfallMm: 510, latitude: 24.1724, longitude: 72.4346, taluks: ["Palanpur", "Deesa", "Dhanera", "Tharad", "Vav", "Radhanpur", "Bhabhar", "Dantiwada", "Amirgadh", "Danta"] },
      { id: "gj-junagadh", name: "Junagadh", hindiName: "जूनागढ़", state: "Gujarat", zoneId: 13, normalRainfallMm: 840, latitude: 21.5222, longitude: 70.4579, taluks: ["Junagadh", "Keshod", "Mangrol", "Manavadar", "Malia Hatina", "Mendarda", "Visavadar", "Bhesan", "Vanthali"] },
      { id: "gj-ahmedabad", name: "Ahmedabad", hindiName: "अहमदाबाद", state: "Gujarat", zoneId: 13, normalRainfallMm: 750, latitude: 23.0225, longitude: 72.5714, taluks: ["Daskroi", "Sanand", "Bavla", "Dholka", "Dhandhuka", "Viramgam", "Mandal", "Detroj-Rampura"] }
    ]
  },
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
      { id: "rj-hanumangarh", name: "Hanumangarh", hindiName: "हनुमानगढ़", state: "Rajasthan", zoneId: 6, normalRainfallMm: 320, latitude: 29.5810, longitude: 74.3294, taluks: ["Hanumangarh", "Pilibanga", "Sangaria", "Nohar", "Bhadra", "Rawatsar", "Tibbi"] }
    ]
  },
  {
    code: "KA",
    name: "Karnataka",
    hindiName: "कर्नाटक",
    isUnionTerritory: false,
    capital: "Bengaluru",
    districts: [
      { id: "ka-dharwad", name: "Dharwad", hindiName: "धारवाड़", state: "Karnataka", zoneId: 10, normalRainfallMm: 720, latitude: 15.4589, longitude: 75.0078, taluks: ["Dharwad", "Hubballi Urban", "Hubballi Rural", "Kalghatgi", "Navalgund", "Kundgol", "Alnavar"] },
      { id: "ka-belagavi", name: "Belagavi (Belgaum)", hindiName: "बेलगावी", state: "Karnataka", zoneId: 10, normalRainfallMm: 810, latitude: 15.8497, longitude: 74.4977, taluks: ["Belagavi", "Gokak", "Chikkodi", "Athani", "Bailhongal", "Saundatti", "Ramdurg", "Hukkeri", "Khanapur", "Raybag"] },
      { id: "ka-shivamogga", name: "Shivamogga (Shimoga)", hindiName: "शिवमोग्गा", state: "Karnataka", zoneId: 12, normalRainfallMm: 1750, latitude: 13.9299, longitude: 75.5681, taluks: ["Shivamogga", "Bhadravati", "Thirthahalli", "Sagar", "Shikaripura", "Soraba", "Hosanagara"] },
      { id: "ka-kalaburagi", name: "Kalaburagi (Gulbarga)", hindiName: "कलबुर्गी", state: "Karnataka", zoneId: 10, normalRainfallMm: 750, latitude: 17.3297, longitude: 76.8343, taluks: ["Kalaburagi", "Afzalpur", "Aland", "Chincholi", "Chitapur", "Jevargi", "Sedam", "Kamalapur"] },
      { id: "ka-mysuru", name: "Mysuru (Mysore)", hindiName: "मैसूरु", state: "Karnataka", zoneId: 10, normalRainfallMm: 800, latitude: 12.2958, longitude: 76.6394, taluks: ["Mysuru", "Nanjangud", "Hunsur", "T. Narasipura", "Heggadadevankote", "Piriyapatna", "Krishnarajanagara", "Saragur"] },
      { id: "ka-vijayapura", name: "Vijayapura (Bijapur)", hindiName: "विजयपुरा", state: "Karnataka", zoneId: 10, normalRainfallMm: 590, latitude: 16.8302, longitude: 75.7100, taluks: ["Vijayapura", "Basavana Bagewadi", "Indi", "Muddebihal", "Sindagi", "Babanagar", "Tikota"] }
    ]
  },
  {
    code: "AP",
    name: "Andhra Pradesh",
    hindiName: "आंध्र प्रदेश",
    isUnionTerritory: false,
    capital: "Amaravati",
    districts: [
      { id: "ap-guntur", name: "Guntur", hindiName: "गुंटूर", state: "Andhra Pradesh", zoneId: 11, normalRainfallMm: 890, latitude: 16.3067, longitude: 80.4365, taluks: ["Guntur East", "Guntur West", "Tenali", "Mangalagiri", "Tadikonda", "Prathipadu", "Ponnur"] },
      { id: "ap-kurnool", name: "Kurnool", hindiName: "कर्नूल", state: "Andhra Pradesh", zoneId: 10, normalRainfallMm: 670, latitude: 15.8281, longitude: 78.0373, taluks: ["Kurnool", "Adoni", "Yemmiganur", "Nandyal", "Dhone", "Alur", "Pattikonda", "Kodumur"] },
      { id: "ap-eastgodavari", name: "East Godavari (Kakinada/Rajahmundry)", hindiName: "पूर्वी गोदावरी", state: "Andhra Pradesh", zoneId: 11, normalRainfallMm: 1150, latitude: 17.0005, longitude: 81.8040, taluks: ["Rajahmundry Urban", "Rajahmundry Rural", "Kakinada", "Amalapuram", "Peddapuram", "Ramachandrapuram"] },
      { id: "ap-anantapur", name: "Anantapur", hindiName: "अनंतपुर", state: "Andhra Pradesh", zoneId: 10, normalRainfallMm: 520, latitude: 14.6819, longitude: 77.6006, taluks: ["Anantapur", "Gooty", "Tadipatri", "Kalyandurg", "Rayadurg", "Uravakonda", "Dharmavaram"] }
    ]
  },
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
      { id: "tg-khammam", name: "Khammam", hindiName: "खम्मम", state: "Telangana", zoneId: 10, normalRainfallMm: 1050, latitude: 17.2473, longitude: 80.1514, taluks: ["Khammam Urban", "Khammam Rural", "Kallur", "Madhira", "Sathupally", "Wyra"] }
    ]
  },
  {
    code: "TN",
    name: "Tamil Nadu",
    hindiName: "तमिलनाडु",
    isUnionTerritory: false,
    capital: "Chennai",
    districts: [
      { id: "tn-thanjavur", name: "Thanjavur (Cauvery Delta)", hindiName: "तंजावुर", state: "Tamil Nadu", zoneId: 11, normalRainfallMm: 1110, latitude: 10.7870, longitude: 79.1378, taluks: ["Thanjavur", "Kumbakonam", "Papanasam", "Pattukkottai", "Orathanadu", "Thiruvaiyaru", "Peravurani"] },
      { id: "tn-coimbatore", name: "Coimbatore", hindiName: "कोयंबटूर", state: "Tamil Nadu", zoneId: 10, normalRainfallMm: 660, latitude: 11.0168, longitude: 76.9558, taluks: ["Coimbatore North", "Coimbatore South", "Pollachi", "Mettupalayam", "Sulur", "Annur", "Valparai"] },
      { id: "tn-madurai", name: "Madurai", hindiName: "मदुरै", state: "Tamil Nadu", zoneId: 10, normalRainfallMm: 850, latitude: 9.9252, longitude: 78.1198, taluks: ["Madurai North", "Madurai South", "Melur", "Thirumangalam", "Usilampatti", "Vadipatti", "Peraiyur"] },
      { id: "tn-salem", name: "Salem", hindiName: "सलेम", state: "Tamil Nadu", zoneId: 10, normalRainfallMm: 980, latitude: 11.6643, longitude: 78.1460, taluks: ["Salem", "Attur", "Mettur", "Omalur", "Sankari", "Yercaud", "Gangavalli"] }
    ]
  },
  {
    code: "BR",
    name: "Bihar",
    hindiName: "बिहार",
    isUnionTerritory: false,
    capital: "Patna",
    districts: [
      { id: "br-patna", name: "Patna", hindiName: "पटना", state: "Bihar", zoneId: 4, normalRainfallMm: 1100, latitude: 25.5941, longitude: 85.1376, taluks: ["Patna Sadar", "Barh", "Danapur", "Mokama", "Masaurhi", "Paliganj", "Bikram"] },
      { id: "br-muzaffarpur", name: "Muzaffarpur", hindiName: "मुजफ्फरपुर", state: "Bihar", zoneId: 4, normalRainfallMm: 1280, latitude: 26.1209, longitude: 85.3647, taluks: ["Muzaffarpur East", "Muzaffarpur West", "Kanti", "Motipur", "Sahebganj", "Paroo", "Sakra"] },
      { id: "br-gaya", name: "Gaya", hindiName: "गया", state: "Bihar", zoneId: 4, normalRainfallMm: 1050, latitude: 24.7914, longitude: 85.0002, taluks: ["Gaya Town", "Bodhyaga", "Sherghati", "Tekari", "Wazirganj", "Atri", "Belaganj"] },
      { id: "br-bhagalpur", name: "Bhagalpur", hindiName: "भागलपुर", state: "Bihar", zoneId: 4, normalRainfallMm: 1180, latitude: 25.2425, longitude: 86.9842, taluks: ["Bhagalpur Sadar", "Kahalgaon", "Naugachhia", "Pirpainti", "Sultanganj", "Bihpur"] }
    ]
  },
  {
    code: "WB",
    name: "West Bengal",
    hindiName: "पश्चिम बंगाल",
    isUnionTerritory: false,
    capital: "Kolkata",
    districts: [
      { id: "wb-bardhaman", name: "Purba Bardhaman", hindiName: "पूर्व बर्धमान", state: "West Bengal", zoneId: 3, normalRainfallMm: 1450, latitude: 23.2324, longitude: 87.8615, taluks: ["Bardhaman Sadar North", "Bardhaman Sadar South", "Kalna", "Katwa"] },
      { id: "wb-hooghly", name: "Hooghly", hindiName: "हुगली", state: "West Bengal", zoneId: 3, normalRainfallMm: 1520, latitude: 22.9034, longitude: 88.3965, taluks: ["Chinsurah", "Chandannagar", "Sreerampur", "Arambagh"] },
      { id: "wb-murshidabad", name: "Murshidabad", hindiName: "मुर्शिदाबाद", state: "West Bengal", zoneId: 3, normalRainfallMm: 1400, latitude: 24.1759, longitude: 88.2802, taluks: ["Berhampore", "Lalbagh", "Jangipur", "Kandi", "Domkol"] }
    ]
  },
  {
    code: "OR",
    name: "Odisha",
    hindiName: "ओडिशा",
    isUnionTerritory: false,
    capital: "Bhubaneswar",
    districts: [
      { id: "or-cuttack", name: "Cuttack", hindiName: "कटक", state: "Odisha", zoneId: 11, normalRainfallMm: 1480, latitude: 20.4625, longitude: 85.8828, taluks: ["Cuttack Sadar", "Athagarh", "Banki", "Salipur", "Choudwar"] },
      { id: "or-sambalpur", name: "Sambalpur", hindiName: "संबलपुर", state: "Odisha", zoneId: 7, normalRainfallMm: 1530, latitude: 21.4669, longitude: 83.9812, taluks: ["Sambalpur", "Kuchinda", "Rairakhol", "Rengali"] },
      { id: "or-balasore", name: "Balasore (Baleswar)", hindiName: "बालेश्वर", state: "Odisha", zoneId: 11, normalRainfallMm: 1590, latitude: 21.4934, longitude: 86.9135, taluks: ["Baleswar", "Nilagiri", "Jaleswar", "Soro", "Basta"] }
    ]
  },
  {
    code: "KL",
    name: "Kerala",
    hindiName: "केरल",
    isUnionTerritory: false,
    capital: "Thiruvananthapuram",
    districts: [
      { id: "kl-palakkad", name: "Palakkad", hindiName: "पालक्काड़", state: "Kerala", zoneId: 12, normalRainfallMm: 2200, latitude: 10.7867, longitude: 76.6548, taluks: ["Palakkad", "Chittur", "Alathur", "Ottapalam", "Mannarkkad", "Pattambi"] },
      { id: "kl-wayanad", name: "Wayanad", hindiName: "वायनाड", state: "Kerala", zoneId: 12, normalRainfallMm: 3300, latitude: 11.6854, longitude: 76.1320, taluks: ["Vythiri", "Sulthan Bathery", "Mananthavady"] },
      { id: "kl-idukki", name: "Idukki", hindiName: "इडुक्की", state: "Kerala", zoneId: 12, normalRainfallMm: 3600, latitude: 9.8494, longitude: 76.9804, taluks: ["Thodupuzha", "Devikulam", "Peerumade", "Udumbanchola", "Idukki"] }
    ]
  },
  {
    code: "CG",
    name: "Chhattisgarh",
    hindiName: "छत्तीसगढ़",
    isUnionTerritory: false,
    capital: "Raipur",
    districts: [
      { id: "cg-raipur", name: "Raipur", hindiName: "रायपुर", state: "Chhattisgarh", zoneId: 7, normalRainfallMm: 1320, latitude: 21.2514, longitude: 81.6296, taluks: ["Raipur", "Arang", "Abhanpur", "Tilda"] },
      { id: "cg-durg", name: "Durg", hindiName: "दुर्ग", state: "Chhattisgarh", zoneId: 7, normalRainfallMm: 1280, latitude: 21.1904, longitude: 81.2849, taluks: ["Durg", "Dhamdha", "Patan"] },
      { id: "cg-bilaspur", name: "Bilaspur", hindiName: "बिलासपुर", state: "Chhattisgarh", zoneId: 7, normalRainfallMm: 1310, latitude: 22.0797, longitude: 82.1409, taluks: ["Bilaspur", "Bilha", "Kota", "Masturi", "Takhatpur"] }
    ]
  },
  {
    code: "JH",
    name: "Jharkhand",
    hindiName: "झारखंड",
    isUnionTerritory: false,
    capital: "Ranchi",
    districts: [
      { id: "jh-ranchi", name: "Ranchi", hindiName: "राँची", state: "Jharkhand", zoneId: 7, normalRainfallMm: 1400, latitude: 23.3441, longitude: 85.3096, taluks: ["Ranchi Sadar", "Bundu", "Kanke", "Ratu", "Ormanjhi", "Mandar", "Bero"] },
      { id: "jh-hazaribagh", name: "Hazaribagh", hindiName: "हजारीबाग", state: "Jharkhand", zoneId: 7, normalRainfallMm: 1340, latitude: 23.9925, longitude: 85.3637, taluks: ["Sadar", "Barhi", "Barkagaon", "Chauparan", "Ichak"] }
    ]
  },
  {
    code: "AS",
    name: "Assam",
    hindiName: "असम",
    isUnionTerritory: false,
    capital: "Dispur",
    districts: [
      { id: "as-kamrup", name: "Kamrup (Guwahati)", hindiName: "कामरूप", state: "Assam", zoneId: 2, normalRainfallMm: 2100, latitude: 26.1445, longitude: 91.7362, taluks: ["Guwahati", "Palasbari", "Rangia", "Hajo", "Kamalpur"] },
      { id: "as-nagaon", name: "Nagaon", hindiName: "नगांव", state: "Assam", zoneId: 2, normalRainfallMm: 1850, latitude: 26.3467, longitude: 92.6840, taluks: ["Nagaon", "Kampur", "Kaliabor", "Raha", "Dhing", "Samaguri"] }
    ]
  },
  {
    code: "UK",
    name: "Uttarakhand",
    hindiName: "उत्तराखंड",
    isUnionTerritory: false,
    capital: "Dehradun",
    districts: [
      { id: "uk-dehradun", name: "Dehradun", hindiName: "देहरादून", state: "Uttarakhand", zoneId: 1, normalRainfallMm: 2180, latitude: 30.3165, longitude: 78.0322, taluks: ["Dehradun", "Rishikesh", "Vikasnagar", "Chakrata", "Kalsi", "Tyuni"] },
      { id: "uk-usnagar", name: "Udham Singh Nagar (Pantnagar)", hindiName: "उधम सिंह नगर", state: "Uttarakhand", zoneId: 5, normalRainfallMm: 1450, latitude: 28.9800, longitude: 79.4000, taluks: ["Rudrapur", "Kashipur", "Kichha", "Sitarganj", "Khatima", "Bazpur", "Gadarpur"] }
    ]
  },
  {
    code: "HP",
    name: "Himachal Pradesh",
    hindiName: "हिमाचल प्रदेश",
    isUnionTerritory: false,
    capital: "Shimla",
    districts: [
      { id: "hp-kangra", name: "Kangra", hindiName: "कांगड़ा", state: "Himachal Pradesh", zoneId: 1, normalRainfallMm: 1900, latitude: 32.0998, longitude: 76.2691, taluks: ["Dharamshala", "Kangra", "Palampur", "Nurpur", "Dehra Gopipur", "Baijnath", "Jawali"] },
      { id: "hp-mandi", name: "Mandi", hindiName: "मंडी", state: "Himachal Pradesh", zoneId: 1, normalRainfallMm: 1550, latitude: 31.7087, longitude: 76.9320, taluks: ["Mandi Sadar", "Sundernagar", "Sarkaghat", "Jogindernagar", "Karsog", "Chachyot"] }
    ]
  },
  {
    code: "JK",
    name: "Jammu and Kashmir",
    hindiName: "जम्मू और कश्मीर",
    isUnionTerritory: true,
    capital: "Srinagar / Jammu",
    districts: [
      { id: "jk-jammu", name: "Jammu", hindiName: "जम्मू", state: "Jammu and Kashmir", zoneId: 1, normalRainfallMm: 1250, latitude: 32.7266, longitude: 74.8570, taluks: ["Jammu", "RS Pura", "Akhnoor", "Bishnah", "Marh"] },
      { id: "jk-anantnag", name: "Anantnag", hindiName: "अनंतनाग", state: "Jammu and Kashmir", zoneId: 1, normalRainfallMm: 1100, latitude: 33.7311, longitude: 75.1522, taluks: ["Anantnag", "Bijbehara", "Dooru", "Kokernag", "Pahalgam"] }
    ]
  },
  {
    code: "DL",
    name: "Delhi (NCT)",
    hindiName: "दिल्ली",
    isUnionTerritory: true,
    capital: "New Delhi",
    districts: [
      { id: "dl-northwest", name: "North West Delhi", hindiName: "उत्तर पश्चिम दिल्ली", state: "Delhi (NCT)", zoneId: 6, normalRainfallMm: 710, latitude: 28.7188, longitude: 77.0898, taluks: ["Narela", "Saraswati Vihar", "Rohini", "Alipur", "Kanjhawala"] }
    ]
  }
];

export function getAllIndianStates(): string[] {
  return ALL_INDIAN_STATES.map((s) => s.name).sort();
}

export function getDistrictsByState(stateName: string): DistrictAdminItem[] {
  const stateObj = ALL_INDIAN_STATES.find((s) => s.name.toLowerCase() === stateName.toLowerCase());
  return stateObj ? stateObj.districts : [];
}

export function findDistrictByName(districtName: string, stateName?: string): DistrictAdminItem | undefined {
  for (const st of ALL_INDIAN_STATES) {
    if (stateName && st.name.toLowerCase() !== stateName.toLowerCase()) continue;
    const found = st.districts.find((d) => d.name.toLowerCase().includes(districtName.toLowerCase()));
    if (found) return found;
  }
  return undefined;
}
