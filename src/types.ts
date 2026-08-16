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

export interface FarmLocation {
  state: string;
  district: string;
  taluka?: string;
  village?: string;
  latitude?: number;
  longitude?: number;
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
  ph: number; // 6.5 - 7.5 is neutral
  organicCarbonPercent: number; // <0.5 Low, 0.5-0.75 Medium, >0.75 High
  availableNitrogenKgPerHa: 'Low (< 280)' | 'Medium (280 - 560)' | 'High (> 560)';
  availablePhosphorusKgPerHa: 'Low (< 10)' | 'Medium (10 - 25)' | 'High (> 25)';
  availablePotassiumKgPerHa: 'Low (< 108)' | 'Medium (108 - 280)' | 'High (> 280)';
  zincStatus: 'Deficient (< 0.6 ppm)' | 'Sufficient (>= 0.6 ppm)' | 'Unknown';
  boronStatus: 'Deficient (< 0.5 ppm)' | 'Sufficient (>= 0.5 ppm)' | 'Unknown';
  electricalConductivityDsM: number; // < 1 Normal, > 2 Saline
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

export interface LandAndIrrigation {
  totalLandAcres: number;
  plannedLandAllocationAcres: number;
  landSlope: 'Flat (0-1%)' | 'Gentle Slope (1-3%)' | 'Moderate Slope (> 3%)';
  drainageCapacity: 'Good (No waterlogging)' | 'Moderate' | 'Poor (Prone to water stagnation)';
  primaryWaterSource: WaterSource;
  secondaryWaterSource?: WaterSource;
  irrigationMethod: IrrigationMethod;
  dailyWaterAvailabilityHours: number; // e.g. 4-8 hours electricity/water
  waterReliabilityScore: number; // 1 to 10
  groundwaterTableDepthFeet?: number;
  metadata: DataMetadata;
}

export type CropSeason = 'Kharif' | 'Rabi' | 'Zaid' | 'Annual / Commercial';

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
  location: FarmLocation;
  landAndIrrigation: LandAndIrrigation;
  soil: SoilIntelligence;
  targetSeason: CropSeason;
  preferredCropIds?: string[];
  excludedCropIds?: string[];
  customDieselRate?: number;
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
