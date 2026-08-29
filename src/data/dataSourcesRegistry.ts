import { DataMetadata } from '../types';

export interface OpenDataSourceEntry {
  id: string;
  name: string;
  hindiName: string;
  agency: string;
  department: string;
  ministry: string;
  coverage: string;
  datasetType: 'Live API Feed' | 'Official Gazette / Notification' | 'Advance Statistical Estimate' | 'Periodic Survey';
  status: 'CONNECTED_BASELINE' | 'LIVE_CONNECTOR_READY' | 'SCHEDULED_AUTOMATION';
  updateCadence: string;
  license: string;
  portalUrl: string;
  apiDocsUrl?: string;
  verifiedFields: string[];
  lastVerificationDate: string;
  disclaimer: string;
}

export const OPEN_DATA_REGISTRY: OpenDataSourceEntry[] = [
  {
    id: "cacp_price_policy",
    name: "Commission for Agricultural Costs & Prices (CACP) Price Policy",
    hindiName: "कृषि लागत एवं मूल्य आयोग (CACP)",
    agency: "CACP Secretariat",
    department: "Department of Agriculture & Farmers Welfare",
    ministry: "Ministry of Agriculture & Farmers Welfare, Govt. of India",
    coverage: "All 23 Mandated MSP Crops, Cost of Cultivation (A2, A2+FL, C2), Inter-crop Price Parity",
    datasetType: "Official Gazette / Notification",
    status: "CONNECTED_BASELINE",
    updateCadence: "Bi-annual (Kharif and Rabi Price Policy Reports)",
    license: "Government Open Data License - India (GODL)",
    portalUrl: "https://cacp.dacnet.nic.in/",
    apiDocsUrl: "https://data.gov.in/",
    verifiedFields: [
      "Notified MSP per Quintal (2024-25)",
      "Projected Cost of Production A2+FL",
      "Comprehensive Cost C2",
      "Historical MSP Trend (2018-2024)"
    ],
    lastVerificationDate: "19 June 2024 (CCEA Kharif Notification)",
    disclaimer: "MSP rates are statutory benchmarks. Actual market realizations depend on active procurement center presence and quality FAQ standards."
  },
  {
    id: "agmarknet_dmi",
    name: "Agmarknet APMC Wholesale Market Price & Arrivals Portal",
    hindiName: "एगमार्कनेट कृषि उपज मंडी पोर्टल",
    agency: "Directorate of Marketing & Inspection (DMI)",
    department: "Department of Agriculture & Farmers Welfare",
    ministry: "Ministry of Agriculture & Farmers Welfare, Govt. of India",
    coverage: "3,240+ Regulated APMC Wholesale Mandis, 300+ Agricultural & Horticultural Commodities",
    datasetType: "Live API Feed",
    status: "LIVE_CONNECTOR_READY",
    updateCadence: "Daily on market trading sessions (e-NAM integration)",
    license: "National Data Sharing and Accessibility Policy (NDSAP)",
    portalUrl: "https://agmarknet.gov.in/",
    apiDocsUrl: "https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070",
    verifiedFields: [
      "Min / Max / Modal Price (Rs/Quintal)",
      "Daily Commodity Arrivals (Metric Tonnes)",
      "Mandi Distance & Logistics Benchmarks",
      "Arrivals Seasonality Trend"
    ],
    lastVerificationDate: "Current Marketing Session",
    disclaimer: "Wholesale modal prices reflect fair average quality (FAQ) arrivals traded in APMC yards before transport deductions."
  },
  {
    id: "imd_agromet_pune",
    name: "IMD Agro-meteorological Advisory Services (AAS)",
    hindiName: "भारत मौसम विज्ञान विभाग (IMD) - कृषि मौसम प्रभाग",
    agency: "Agrimet Division, Pune",
    department: "India Meteorological Department",
    ministry: "Ministry of Earth Sciences, Govt. of India",
    coverage: "District & Block Level 5-7 Day Weather Forecasts, Monsoon Monitoring, Agromet Advisories",
    datasetType: "Live API Feed",
    status: "LIVE_CONNECTOR_READY",
    updateCadence: "Daily forecasts / Bi-weekly bulletins (Tuesdays & Fridays)",
    license: "Open Data IMD",
    portalUrl: "https://mausam.imd.gov.in/",
    apiDocsUrl: "https://internal.imd.gov.in/",
    verifiedFields: [
      "Rainfall Actual vs Normal Deviation (%)",
      "7-Day Temperature (Min/Max °C)",
      "Monsoon Onset & Withdrawal Dates",
      "Crop Specific Agro-Advisories"
    ],
    lastVerificationDate: "Current Agricultural Season",
    disclaimer: "Rainfall forecasts are probabilistic model outputs; localized micro-climate variations may occur."
  },
  {
    id: "soil_health_card",
    name: "National Soil Health Card Portal (SHC)",
    hindiName: "मृदा स्वास्थ्य कार्ड पोर्टल",
    agency: "Natural Resource Management Division",
    department: "Department of Agriculture & Farmers Welfare",
    ministry: "Ministry of Agriculture & Farmers Welfare, Govt. of India",
    coverage: "District & Taluka Level Soil Nutrient Baseline (N, P, K, pH, OC, Zn, Fe, Cu, Mn, B, S)",
    datasetType: "Periodic Survey",
    status: "CONNECTED_BASELINE",
    updateCadence: "Cycle-wise soil testing grid updates",
    license: "GODL-India",
    portalUrl: "https://soilhealth.dac.gov.in/",
    verifiedFields: [
      "Soil Order Classification (Vertisols, Inceptisols, Alfisols, etc.)",
      "Critical Nutrient Deficiency Limits",
      "Standard NPK Recommendation Dosage (ICAR/SAU)",
      "Organic Carbon & Soil pH Benchmarks"
    ],
    lastVerificationDate: "Cycle-II National Baseline",
    disclaimer: "Soil fertility classes are regional agronomic guidelines; field testing of farmer's specific parcel provides highest precision."
  },
  {
    id: "des_advance_estimates",
    name: "Directorate of Economics & Statistics (DES) Agricultural Statistics",
    hindiName: "अर्थशास्त्र एवं सांख्यिकी निदेशालय (DES)",
    agency: "Agricultural Statistics Division",
    department: "Department of Agriculture & Farmers Welfare",
    ministry: "Ministry of Agriculture & Farmers Welfare, Govt. of India",
    coverage: "All-India Crop Area, Production, Yield (APY), Final and Advance Estimates",
    datasetType: "Advance Statistical Estimate",
    status: "CONNECTED_BASELINE",
    updateCadence: "Quarterly Advance Estimates (1st, 2nd, 3rd, 4th & Final)",
    license: "GODL-India",
    portalUrl: "https://desagri.gov.in/",
    verifiedFields: [
      "National Sown Area (Million Hectares)",
      "Total Production (Lakh Metric Tonnes)",
      "National Buffer Stock Position",
      "Supply-Demand Balance Sheet"
    ],
    lastVerificationDate: "3rd Advance Estimates 2023-24 / 2024-25",
    disclaimer: "Advance estimates are subject to revision as final state crop-cutting experiment (CCE) results are consolidated."
  },
  {
    id: "apeda_trade_dgcis",
    name: "Agricultural and Processed Food Products Export Development Authority (APEDA) & DGCIS",
    hindiName: "एपीडा एवं वाणिज्यिक जानकारी महानिदेशालय (DGCIS)",
    agency: "Trade Statistics Division",
    department: "Department of Commerce",
    ministry: "Ministry of Commerce & Industry, Govt. of India",
    coverage: "Export / Import volumes, Minimum Export Price (MEP) orders, Tariff quotas",
    datasetType: "Official Gazette / Notification",
    status: "CONNECTED_BASELINE",
    updateCadence: "Monthly Trade Statistics",
    license: "GODL-India",
    portalUrl: "https://apeda.gov.in/",
    verifiedFields: [
      "Agri Export Volumes & Major Destinations",
      "Export Ban / Duty Status (Rice, Onion, Wheat, Sugar)",
      "Edible Oil & Pulse Import Duty Tariffs"
    ],
    lastVerificationDate: "Current Financial Year",
    disclaimer: "Trade policy notifications (MEP/Tariff adjustments) are regulated by DGFT orders."
  },
  {
    id: "mospi_hces_survey",
    name: "Ministry of Statistics and Programme Implementation (MoSPI) - HCES",
    hindiName: "सांख्यिकी और कार्यक्रम कार्यान्वयन मंत्रालय (MoSPI)",
    agency: "National Statistical Office (NSO)",
    department: "Survey Operations & Social Statistics Division",
    ministry: "Ministry of Statistics and Programme Implementation, Govt. of India",
    coverage: "National & State Monthly Household Consumption Expenditure (HCES: 2022-23 / 2023-24)",
    datasetType: "Periodic Survey",
    status: "CONNECTED_BASELINE",
    updateCadence: "Periodic Comprehensive Survey Rounds",
    license: "GODL-India",
    portalUrl: "https://www.mospi.gov.in/",
    verifiedFields: [
      "Per Capita Monthly Household Quantity (kg/capita/month)",
      "Rural vs Urban Consumption Disaggregation",
      "Food Group Share in Household Expenditure",
      "Annualized Household Consumption Demand Indicators"
    ],
    lastVerificationDate: "HCES 2022-24 Comprehensive Round",
    disclaimer: "Household consumption indicators represent surveyed household intake and do not include institutional, hotel/restaurant food-service, seed, feed, or industrial crushing volumes."
  }
];

