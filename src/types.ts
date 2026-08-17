/**
 * FARMFIT Data Types & Domain Interfaces
 * Aligned with Government of India (MoA&FW, CACP, Agmarknet, IMD) Agricultural Frameworks
 */

export type DataStatus = 
  | 'LIVE'
  | 'LATEST_AVAILABLE'
  | 'HISTORICAL'
  | 'MODEL_ESTIMATE'
  | 'FORECAST'
  | 'INSUFFICIENT_DATA';

export interface DataMetadata {
  status: DataStatus;
  source: string;
  sourceUrl?: string;
  date: string;
  disclaimer?: string;
}

export type AgroClimaticZoneId = number;

export type Language = 'en' | 'hi';

export type LandholdingCategory = 'Marginal (< 2.5 Acres)' | 'Small (2.5 - 5 Acres)' | 'Semi-Medium (5 - 10 Acres)' | 'Medium (10 - 25 Acres)' | 'Large (> 25 Acres)';

export interface FarmerProfile {
  name: string;
  mobile?: string;
  farmerType: LandholdingCategory;
  experienceYears: number;
  riskTolerance: 'Conservative' | 'Moderate' | 'Aggressive';
  primaryGoal: 'Max Profit' | 'Guaranteed Minimum Return (MSP focus)' | 'Low Water Risk' | 'Low Working Capital';
  workingCapitalBudget: number; // in INR
}

export type LocationSourceType = 'DEVICE_GPS' | 'MANUAL_COORDINATES' | 'GOOGLE_MAPS_LINK' | 'MAP_PIN' | 'CATALOG_DEFAULT';

export type DataProvenance = 'Farmer entered' | 'Soil test (Lab)' | 'Mapped dataset' | 'Model derived' | 'Data unavailable';

export interface ProvenanceValue<T> {
  value: T;
  provenance: DataProvenance;
  unit?: string;
  sourceNote?: string;
}

export interface FarmLocation {
  state: string;
  district: string;
  taluka?: string;
  village?: string;
  latitude?: number;
  longitude?: number;
  altitudeMeters?: number | null;
  altitudeStatus?: 'OBTAINED' | 'UNAVAILABLE' | 'FETCHING';
  altitudeSourceName?: string;
  locationSource?: LocationSourceType;
  formattedAddress?: string;
  agroClimaticZoneId: number;
  agroClimaticZoneName: string;
  normalAnnualRainfallMm: number;
  metadata: DataMetadata;
}

export type SoilOrder = 
  | 'Alluvial Soil (Entisols / Inceptisols)'
  | 'Black Cotton Soil (Vertisols)'
  | 'Red & Yellow Soil (Alfisols / Ultisols)'
  | 'Laterite Soil (Oxisols)'
  | 'Arid / Desert Soil (Aridisols)'
  | 'Saline / Alkaline Soil'
  | 'Peaty / Organic Soil';

export interface SoilIntelligence {
  soilOrder: SoilOrder;
  soilDepth: 'Shallow (< 25 cm)' | 'Medium (25 - 50 cm)' | 'Deep (> 50 cm)';
  texture: 'Sandy Loam' | 'Clay Loam' | 'Heavy Clay' | 'Silty Loam' | 'Sandy';
  hasSoilHealthCard: boolean;
  shcNumber?: string;
  testDate?: string;
  laboratoryName?: string;
  reportReference?: string;
  uploadedFileName?: string;
  ph: number; // 6.5 - 7.5 is neutral
  organicCarbonPercent: number; // <0.5 Low, 0.5-0.75 Medium, >0.75 High
  availableNitrogenKgPerHa: 'Low (< 280)' | 'Medium (280 - 560)' | 'High (> 560)';
  nitrogenNumericKgHa?: number;
  availablePhosphorusKgPerHa: 'Low (< 10)' | 'Medium (10 - 25)' | 'High (> 25)';
  phosphorusNumericKgHa?: number;
  availablePotassiumKgPerHa: 'Low (< 108)' | 'Medium (108 - 280)' | 'High (> 280)';
  potassiumNumericKgHa?: number;
  zincStatus: 'Deficient (< 0.6 ppm)' | 'Sufficient (>= 0.6 ppm)' | 'Unknown';
  zincPpm?: number;
  ironPpm?: number;
  manganesePpm?: number;
  copperPpm?: number;
  boronStatus: 'Deficient (< 0.5 ppm)' | 'Sufficient (>= 0.5 ppm)' | 'Unknown';
  boronPpm?: number;
  sulphurPpm?: number;
  electricalConductivityDsM: number; // < 1 Normal, > 2 Saline
  drainage?: 'Good (No waterlogging)' | 'Moderate' | 'Poor (Prone to water stagnation)';
  soilTypeProvenance?: DataProvenance;
  phProvenance?: DataProvenance;
  nutrientsProvenance?: DataProvenance;
  textureProvenance?: DataProvenance;
  depthProvenance?: DataProvenance;
  metadata: DataMetadata;
}

export type WaterSource = 
  | 'Borewell / Tube Well'
  | 'Canal Command Area'
  | 'Open Dug Well'
  | 'River / Lift Irrigation'
  | 'Farm Pond / Check Dam'
  | 'Rainfed Only (No assured irrigation)';

export type IrrigationMethod = 
  | 'Drip Irrigation (Micro-irrigation)'
  | 'Sprinkler Irrigation'
  | 'Furrow / Ridge Irrigation'
  | 'Flood / Basin Irrigation';

export interface FarmCharacteristics {
  totalFarmAreaDisplay: number;
  totalFarmAreaUnit: string;
  proposedCropAreaDisplay: number;
  currentCrop?: string;
  previousCrop?: string;
  proposedPlantingDate?: string;
  expectedHarvestDate?: string;
  hasStorage: boolean;
  storageType?: 'Traditional Grain Bin' | 'On-Farm Covered Shed' | 'Paved Warehouse' | 'None';
  storageCapacityQuintals?: number;
  hasColdStorage: boolean;
  coldStorageDistanceKm?: number;
  machineryAvailable: string[]; // e.g. ["Tractor", "Power Tiller", "Drip Automation", "Harvester/Thresher"]
  farmingSystem: 'Conventional' | 'Organic Certified' | 'Natural / Zero Budget (ZBNF)' | 'Integrated Nutrient Management';
  hasSoilTest: boolean;
}

export interface LandAndIrrigation {
  totalLandAcres: number;
  plannedLandAllocationAcres: number;
  selectedLandUnit?: string;
  originalLandValue?: number;
  customUnitName?: string;
  customUnitToAcresRatio?: number;
  normalizedHectares?: number;
  normalizedSquareMetres?: number;
  
  // Irrigation Specifics
  irrigatedAreaAcres: number;
  rainfedAreaAcres: number;
  hasBorewell: boolean;
  hasOpenWell: boolean;
  hasCanal: boolean;
  hasRiverLift: boolean;
  hasFarmPond: boolean;
  hasDrip: boolean;
  hasSprinkler: boolean;
  hasFloodOther: boolean;
  monthsWaterAvailable: number; // 1 to 12
  irrigationFrequency: 'Daily' | 'Alternate Days' | 'Weekly' | 'Fortnightly' | 'Critical Stages Only' | 'As per Canal Roster';
  sourceReliabilityRating: 'High (Perennial / Assured)' | 'Moderate (Seasonal Dip)' | 'Low (Unpredictable / Depleted in Summer)';
  seasonalLimitations: 'None' | 'Summer Scarcity (March-June)' | 'Winter & Summer Dip' | 'Kharif Only Available' | 'Frequent Power Roster Cuts' | 'Salinity Ingress';
  
  // Engine Outputs
  irrigationReliabilityScore100: number; // 0 to 100
  rainfallDependencyPercent: number; // 0 to 100%
  irrigatedLandPercent: number; // 0 to 100%
  rainfedLandPercent: number; // 0 to 100%
  
  // Backwards compatibility legacy fields
  landSlope: 'Flat (0-1%)' | 'Gentle Slope (1-3%)' | 'Moderate Slope (> 3%)';
  drainageCapacity: 'Good (No waterlogging)' | 'Moderate' | 'Poor (Prone to water stagnation)';
  primaryWaterSource: WaterSource;
  secondaryWaterSource?: WaterSource;
  irrigationMethod: IrrigationMethod;
  dailyWaterAvailabilityHours: number; // e.g. 4-8 hours electricity/water
  waterReliabilityScore: number; // 1 to 10
  groundwaterTableDepthFeet?: number;
  characteristics?: FarmCharacteristics;
  metadata: DataMetadata;
}

export type CropSeason = 'Kharif' | 'Rabi' | 'Zaid' | 'Annual / Commercial' | 'Perennial' | 'Multiple seasons';

export type CropCategory = 
  | 'Cereals'
  | 'Pulses'
  | 'Oilseeds'
  | 'Vegetables'
  | 'Fruits'
  | 'Spices & Condiments'
  | 'Fibre Crops'
  | 'Sugar & Commercial Crops'
  | 'Fodder Crops'
  | 'Millets (Shree Anna)'
  | 'Plantation & Other Crops';

export type CropDataStatus = 
  | 'OFFICIAL DATA'
  | 'SOIL TEST'
  | 'FARMER ENTERED'
  | 'MODEL ESTIMATE'
  | 'DATA NOT CONNECTED'
  | 'DATA UNAVAILABLE';

export interface CropValueProvenance<T> {
  value: T;
  unit: string;
  source: string;
  sourceDate: string;
  dataStatus: CropDataStatus;
}

export interface CropLocalNames {
  en: string;
  hi: string;
  kn?: string; // Kannada
  mr?: string; // Marathi
  te?: string; // Telugu
  ta?: string; // Tamil
  bn?: string; // Bengali
  gu?: string; // Gujarati
  pa?: string; // Punjabi
  ml?: string; // Malayalam
  or?: string; // Odia
  as?: string; // Assamese
  ur?: string; // Urdu
  [key: string]: string | undefined;
}

export interface CropSoilRequirements {
  soilTypes: SoilOrder[];
  texture: string[];
  pHRange: { min: number; max: number; optimalMin: number; optimalMax: number };
  drainage: string[];
  soilDepth: string[];
}

export interface CropClimateRequirements {
  temperature: { minC: number; maxC: number; optimalMinC: number; optimalMaxC: number };
  rainfall: { minMm: number; maxMm: number; optimalMm: number };
  humidity: string;
  sunlight: string;
  altitudeMeters?: { min?: number; max?: number };
}

export interface CropWaterRequirements {
  waterRequirementMm: number;
  waterRequirementLevel: 'Low (< 400 mm)' | 'Medium (400 - 800 mm)' | 'High (> 800 mm)' | 'Very High (> 1500 mm)';
  irrigationRequirement: string;
  criticalIrrigationStages: string[];
  droughtTolerance: 'High' | 'Moderate' | 'Low';
  waterloggingSensitivity: 'High' | 'Moderate' | 'Low';
}

export interface CropAgronomy {
  seedRequirement: CropValueProvenance<number | string>;
  plantingMethod: string;
  spacing: string;
  fertilizerRequirements: {
    rdfKgPerHa?: string;
    majorNutrients: string;
    micronutrients: string;
    note: string;
  };
  majorNutrients: string;
  micronutrients: string;
}

export interface CropProduction {
  yieldRange: {
    min: number;
    max: number;
    benchmarkAvg: number;
    unit: string;
    source: string;
    sourceDate: string;
    dataStatus: CropDataStatus;
  };
  unit: string;
}

export interface CropGeographic {
  majorProducingStates: string[];
  majorProducingDistricts: string[];
  suitableAgroClimaticZones: number[];
}

export type LandIrrigationProfile = LandAndIrrigation;
export type SoilProfileRecord = SoilIntelligence & { soilType?: string; ph?: number | { value: number; unit?: string } };

export interface CropMarket {
  perishability: 'High (Perishable: 1-7 days)' | 'Moderate (Semi-perishable: 1-3 months)' | 'Low (Durable grain/seed: 6-12+ months)' | string;
  storageRequirement: string;
  processingPotential: string;
  majorConsumptionRegions: string[];
}

export interface CropTrade {
  exportImportance: 'High' | 'Moderate' | 'Low' | 'Non-Traded';
  importDependence: 'High (Net Importer)' | 'Self-Sufficient' | 'Net Exporter' | 'Moderate Import';
}

export interface CropGovernment {
  MSPApplicable: boolean;
  mspPrice2024_25?: CropValueProvenance<number | null>;
  mspPrice2023_24?: CropValueProvenance<number | null>;
  cacpCostA2FL?: CropValueProvenance<number | null>;
  cacpCostC2?: CropValueProvenance<number | null>;
  governmentSchemeLinks: string[];
}

export interface CropDataSource {
  sourceName: string;
  sourceType: 'Government of India' | 'ICAR' | 'State Agricultural University' | 'CACP' | 'National Horticulture Board' | 'Commodity Board' | 'Open Government Data';
  datasetName: string;
  url: string;
  publicationDate: string;
  retrievalDate: string;
  geographicCoverage: string;
  parameter: string;
  unit: string;
  license: string;
  dataStatus: CropDataStatus;
}

export interface CropMasterRecord {
  cropId: string;
  cropName: string;
  localNames: CropLocalNames;
  scientificName: string;
  category: CropCategory;
  subcategory: string;
  season: CropSeason;
  plantingWindow: string;
  harvestWindow: string;
  typicalDurationDays: number;
  durationRangeDays?: { min: number; max: number };
  soilRequirements: CropSoilRequirements;
  climateRequirements: CropClimateRequirements;
  waterRequirements: CropWaterRequirements;
  agronomy: CropAgronomy;
  production: CropProduction;
  geographic: CropGeographic;
  market: CropMarket;
  trade: CropTrade;
  government: CropGovernment;
  dataConfidenceScore: number; // 0 - 100
  dataConfidenceLevel: 'High' | 'Moderate' | 'Low';
  sources: CropDataSource[];
  // Backwards-compatible fields for calculationEngine
  id?: string;
  name?: string;
  hindiName?: string;
  botanicalName?: string;
  durationDays?: number;
  sowingWindow?: string;
  waterRequirementMm?: number;
  optimalSoil?: SoilOrder[];
  optimalPhMin?: number;
  optimalPhMax?: number;
  tempMinC?: number;
  tempMaxC?: number;
  seedRateKgPerAcre?: number;
  avgYieldQuintalPerAcre?: number;
  yieldRangeQuintalPerAcre?: { min: number; max: number };
  cacpCostPerQuintalA2?: number;
  cacpCostPerQuintalA2FL?: number;
  cacpCostPerQuintalC2?: number;
  mspNotified?: boolean;
  mspPrice2024_25?: number;
  mspPrice2023_24?: number;
  mspCostA2FLBenchmark?: number;
  pmfbyInsurancePremiumRatePercent?: number;
  riskFactors?: {
    droughtSensitivity: 'Low' | 'Medium' | 'High';
    waterloggingSensitivity: 'Low' | 'Medium' | 'High';
    priceVolatilityRisk: 'Low' | 'Medium' | 'High';
    pestDiseaseRisk: 'Low' | 'Medium' | 'High';
    storagePerishability: 'Low (Grain/Pulse)' | 'Medium' | 'High (Perishable)';
  };
  metadata?: DataMetadata;
}

export type CropSuitabilityLevel = 
  | 'HIGHLY SUITABLE'
  | 'SUITABLE'
  | 'MODERATELY SUITABLE'
  | 'MARGINALLY SUITABLE'
  | 'MARGINAL'
  | 'UNSUITABLE'
  | 'INSUFFICIENT DATA';

export interface SuitabilityFactorDetail {
  factorName: string;
  score: number;
  status: 'OPTIMAL' | 'ACCEPTABLE' | 'LIMITING' | 'INCOMPATIBLE' | 'DATA_NOT_CONNECTED';
  explanation: string;
}

export interface CropSuitabilityResult {
  cropId: string;
  cropName?: string;
  category?: CropCategory;
  overallScore: number; // 0 - 100
  suitabilityLevel: CropSuitabilityLevel;
  factorScores?: {
    soilScore?: number;
    waterScore?: number;
    climateScore?: number;
    seasonScore?: number;
    geographicScore?: number;
  };
  factorDetails?: Record<string, SuitabilityFactorDetail>;
  matchingFactors?: string[];
  positiveFactors?: string[];
  limitingFactors: string[];
  missingDataFlags?: string[];
  agronomicRecommendations?: string[];
  soilScore?: number; // 0 - 100
  waterScore?: number; // 0 - 100
  climateScore?: number; // 0 - 100
  seasonScore?: number; // 0 - 100
  soilCompatibilityNote?: string;
  waterCompatibilityNote?: string;
  seasonCompatibilityNote?: string;
  locationCompatibilityNote?: string;
  evaluatedAt?: string;
}

export interface CropDefinition {
  id: string;
  name: string;
  hindiName: string;
  botanicalName: string;
  category: 'Cereals' | 'Pulses' | 'Oilseeds' | 'Commercial & Fibres' | 'Vegetables & Spices' | 'Millets (Shree Anna)';
  season: CropSeason;
  durationDays: number;
  sowingWindow: string;
  harvestWindow: string;
  waterRequirementMm: number; // Total crop water requirement in mm
  optimalSoil: SoilOrder[];
  optimalPhMin: number;
  optimalPhMax: number;
  tempMinC: number;
  tempMaxC: number;
  seedRateKgPerAcre: number;
  avgYieldQuintalPerAcre: number; // Base yield benchmark under normal management
  yieldRangeQuintalPerAcre: { min: number; max: number };
  cacpCostPerQuintalA2: number; // Paid-out costs
  cacpCostPerQuintalA2FL: number; // Paid out + Family labour (CACP official benchmark)
  cacpCostPerQuintalC2: number; // Comprehensive cost (including land rent & capital interest)
  mspNotified: boolean;
  mspPrice2024_25: number; // INR per quintal
  mspPrice2023_24: number; // INR per quintal
  mspCostA2FLBenchmark: number; // Official CACP projected A2+FL cost used to fix MSP (at least 50% margin)
  pmfbyInsurancePremiumRatePercent: number; // 2% Kharif, 1.5% Rabi, 5% Commercial/Horticulture
  riskFactors: {
    droughtSensitivity: 'Low' | 'Medium' | 'High';
    waterloggingSensitivity: 'Low' | 'Medium' | 'High';
    priceVolatilityRisk: 'Low' | 'Medium' | 'High';
    pestDiseaseRisk: 'Low' | 'Medium' | 'High';
    storagePerishability: 'Low (Grain/Pulse)' | 'Medium' | 'High (Perishable)';
  };
  metadata: DataMetadata;
}

export interface MandiPriceRecord {
  mandiId: string;
  mandiName: string;
  district: string;
  state: string;
  cropId: string;
  cropName: string;
  distanceKm: number;
  minPricePerQuintal: number;
  maxPricePerQuintal: number;
  modalPricePerQuintal: number;
  dailyArrivalsTonnes: number;
  arrivalTrend: 'Increasing' | 'Stable' | 'Decreasing';
  freightCostPerKmPerQuintal: number; // avg Rs 0.8 to Rs 1.5 per quintal per km
  hamaliChargesPerQuintal: number; // loading / unloading / weighing
  mandiCessPercent: number; // typically 1% to 2%
  netRealizationPerQuintal: number; // modal price minus freight minus cess minus hamali
  date: string;
  metadata: DataMetadata;
}

export interface SupplyDemandBalance {
  cropId: string;
  cropName: string;
  season: string;
  nationalAreaMillionHa: number;
  domesticProductionLakhTonnes: number;
  domesticConsumptionLakhTonnes: number;
  endingStocksLakhTonnes: number;
  importVolumeLakhTonnes: number;
  exportVolumeLakhTonnes: number;
  marketBalance: 'Deficit (Bullish Price Outlook)' | 'Balanced' | 'Surplus / Oversupply (Bearish Price Risk)';
  supplyDemandRatio: number;
  importDutyPolicy: string;
  exportPolicyStatus: string;
  metadata: DataMetadata;
}

export interface FertilizerPlan {
  ureaBagsPerAcre: number; // 45 kg bag
  dapBagsPerAcre: number;  // 50 kg bag
  mopBagsPerAcre: number;  // 50 kg bag
  sspBagsPerAcre: number;  // Single super phosphate alternative
  zincSulphateKgPerAcre: number;
  organicCompostTonnesPerAcre: number;
  totalFertilizerCostPerAcre: number;
  subsidizedRateNote: string;
  schedule: Array<{
    stage: string;
    dayRange: string;
    application: string;
    nutrientsSupplied: string;
    precautions: string;
  }>;
  metadata: DataMetadata;
}

export interface ProfitabilityScenario {
  yieldQuintalsPerAcre: number;
  expectedPricePerQuintal: number;
  grossRevenuePerAcre: number;
  totalCostA2FLPerAcre: number;
  totalCostC2PerAcre: number;
  netProfitA2FLPerAcre: number;
  netProfitC2PerAcre: number;
  roiA2FLPercent: number;
  roiC2Percent: number;
  costOfProductionPerQuintalA2FL: number;
  costOfProductionPerQuintalC2: number;
}

export interface CropEvaluation {
  crop: CropDefinition;
  overallSuitabilityScore: number; // 0 - 100
  agronomicSoilScore: number; // 0 - 100
  waterSuitabilityScore: number; // 0 - 100
  climateZoneScore: number; // 0 - 100
  profitabilityScore: number; // 0 - 100
  marketSafetyScore: number; // 0 - 100
  compositeRiskScore: number; // 0 (Low Risk) - 100 (High Risk)
  confidenceScore: number; // 0 - 100
  isRecommended: boolean;
  ranking: number;
  avoidReason?: string;
  worstScenario: ProfitabilityScenario;
  baseScenario: ProfitabilityScenario;
  bestScenario: ProfitabilityScenario;
  breakEvenYieldQuintals: number;
  marginOfSafetyOverMspPercent: number;
  bestMandi: MandiPriceRecord;
  supplyDemand: SupplyDemandBalance;
  fertilizerPlan: FertilizerPlan;
  keyStrengths: string[];
  keyRiskWarnings: string[];
  metadata: DataMetadata;
}

export interface CalculationEnginePayload {
  farmerProfile: FarmerProfile;
  location?: FarmLocation;
  farmLocation?: FarmLocation;
  landAndIrrigation: LandAndIrrigation;
  soil?: SoilIntelligence;
  soilIntelligence?: SoilIntelligence;
  targetSeason: CropSeason;
  preferredCropIds?: string[];
  excludedCropIds?: string[];
  customDieselRate?: number;
  engineWeights?: {
    soilWeight: number;
    waterWeight: number;
    climateWeight: number;
    profitabilityWeight: number;
    marketMspWeight: number;
  };
}

export interface CalculationEngineResult {
  calculationId: string;
  timestamp: string;
  payload: CalculationEnginePayload;
  evaluations: CropEvaluation[];
  recommendedCrops: CropEvaluation[];
  cropsToAvoid: CropEvaluation[];
  topAlternativeCrops: CropEvaluation[];
  totalFarmRevenueBaseEstimate: number;
  totalFarmCostA2FLEstimate: number;
  totalFarmNetProfitBaseEstimate: number;
  engineWeights: {
    soilWeight: number;
    waterWeight: number;
    climateWeight: number;
    profitabilityWeight: number;
    marketMspWeight: number;
  };
  metadata: DataMetadata;
}

export interface WeatherDataPoint {
  date: string;
  dayName: string;
  tempMinC: number;
  tempMaxC: number;
  rainfallMm: number;
  humidityPercent: number;
  windSpeedKmh: number;
  condition: string;
  icon: string;
  agroAdvisory: string;
}

export interface DistrictWeatherSummary {
  district: string;
  state: string;
  currentTempC: number;
  humidityPercent: number;
  cumulativeRainfallSeasonMm: number;
  normalRainfallSeasonMm: number;
  rainfallDeviationPercent: number;
  rainfallStatus: 'Normal (±19%)' | 'Excess (> +19%)' | 'Deficient (-20% to -59%)' | 'Large Deficient (<= -60%)';
  monsoonOnsetActual: string;
  monsoonOnsetNormal: string;
  forecast7Days: WeatherDataPoint[];
  imdAgrometAlerts: string[];
  metadata: DataMetadata;
}

export interface MspNotifiedCropRecord {
  id: string;
  name: string;
  hindiName: string;
  season: 'Kharif' | 'Rabi' | 'Commercial';
  variety: string;
  msp2024_25: number;
  msp2023_24: number;
  absoluteIncrease: number;
  percentageIncrease: number;
  cacpProjectedCostA2FL: number;
  returnOverCostA2FLPercent: number;
  procuringAgencies: string[]; // FCI, NAFED, CCI, JCI
  procurementPeriod: string;
  notificationNumber: string;
  dateOfNotification: string;
  metadata: DataMetadata;
}
