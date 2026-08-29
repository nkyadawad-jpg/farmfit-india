import { 
  FarmerProfile, 
  FarmLocation, 
  LandAndIrrigation, 
  SoilIntelligence, 
  CropSeason 
} from '../types';
import { 
  INDIAN_DISTRICTS, 
  AGRO_CLIMATIC_ZONES, 
  IMD_METADATA, 
  SOIL_METADATA 
} from './officialData';

/**
 * BLANK PRODUCTION PROFILES (Safe default state for new farmers)
 */
export const BLANK_FARMER_PROFILE: FarmerProfile = {
  name: '',
  mobile: '',
  farmerType: 'Small (2.5 - 5 Acres)',
  experienceYears: 0,
  riskTolerance: 'Moderate',
  primaryGoal: 'Max Profit',
  workingCapitalBudget: 0
};

export const BLANK_FARM_LOCATION: FarmLocation = {
  state: '',
  district: '',
  taluka: '',
  village: '',
  latitude: null,
  longitude: null,
  altitudeMeters: null,
  altitudeStatus: 'NOT_QUERIED',
  locationSource: 'NOT_SPECIFIED',
  formattedAddress: '',
  agroClimaticZoneId: null,
  agroClimaticZoneName: '',
  normalAnnualRainfallMm: null,
  metadata: IMD_METADATA
};

export const BLANK_LAND_IRRIGATION: LandAndIrrigation = {
  totalLandAcres: 0,
  plannedLandAllocationAcres: 0,
  selectedLandUnit: 'Acre',
  originalLandValue: 0,
  normalizedHectares: 0,
  normalizedSquareMetres: 0,
  irrigatedAreaAcres: 0,
  rainfedAreaAcres: 0,
  hasBorewell: false,
  hasOpenWell: false,
  hasCanal: false,
  hasRiverLift: false,
  hasFarmPond: false,
  hasDrip: false,
  hasSprinkler: false,
  hasFloodOther: false,
  monthsWaterAvailable: 0,
  irrigationFrequency: 'Critical Stages Only',
  sourceReliabilityRating: 'Moderate (Seasonal Dip)',
  seasonalLimitations: 'None',
  irrigationReliabilityScore100: 50,
  rainfallDependencyPercent: 50,
  irrigatedLandPercent: 0,
  rainfedLandPercent: 0,
  landSlope: 'Flat (0-1%)',
  drainageCapacity: 'Good (No waterlogging)',
  primaryWaterSource: 'Rainfed Only (No assured irrigation)',
  irrigationMethod: 'Flood / Basin Irrigation',
  dailyWaterAvailabilityHours: 0,
  waterReliabilityScore: 5,
  characteristics: {
    totalFarmAreaDisplay: 0,
    totalFarmAreaUnit: 'Acre',
    proposedCropAreaDisplay: 0,
    currentCrop: '',
    previousCrop: '',
    proposedPlantingDate: new Date().toISOString().split('T')[0],
    hasStorage: false,
    storageType: 'None',
    storageCapacityQuintals: 0,
    hasColdStorage: false,
    coldStorageDistanceKm: 0,
    machineryAvailable: [],
    farmingSystem: 'Conventional',
    hasSoilTest: false
  },
  metadata: {
    status: 'INSUFFICIENT_DATA',
    source: 'Farmer Parameter Declaration Required',
    date: 'New Session'
  }
};

export const BLANK_SOIL_INTELLIGENCE: SoilIntelligence = {
  soilOrder: 'Alluvial Soil (Entisols / Inceptisols)',
  soilDepth: 'Medium (25 - 50 cm)',
  texture: 'Clay Loam',
  hasSoilHealthCard: false,
  shcNumber: '',
  ph: 7.0,
  organicCarbonPercent: 0.5,
  availableNitrogenKgPerHa: 'Medium (280 - 560)',
  availablePhosphorusKgPerHa: 'Medium (10 - 25)',
  availablePotassiumKgPerHa: 'Medium (108 - 280)',
  zincStatus: 'Unknown',
  boronStatus: 'Unknown',
  electricalConductivityDsM: 0.4,
  drainage: 'Good (No waterlogging)',
  soilTypeProvenance: 'Mapped dataset',
  phProvenance: 'Mapped dataset',
  nutrientsProvenance: 'Mapped dataset',
  textureProvenance: 'Mapped dataset',
  depthProvenance: 'Mapped dataset',
  metadata: SOIL_METADATA
};

/**
 * SAMPLE DEMO PROFILE (Ramesh Patel — Malwa Plateau, Indore, MP)
 * Explicitly available for evaluation, testing, and benchmarking.
 */
const demoDistrict = INDIAN_DISTRICTS[0]; // Indore, MP
const demoZone = AGRO_CLIMATIC_ZONES.find((z) => z.id === demoDistrict.zoneId) || AGRO_CLIMATIC_ZONES[7];

export const SAMPLE_DEMO_FARMER: FarmerProfile = {
  name: 'Ramesh Patel',
  mobile: '9876543210',
  farmerType: 'Small (2.5 - 5 Acres)',
  experienceYears: 14,
  riskTolerance: 'Moderate',
  primaryGoal: 'Max Profit',
  workingCapitalBudget: 120000
};

export const SAMPLE_DEMO_LOCATION: FarmLocation = {
  state: demoDistrict.state,
  district: demoDistrict.district,
  taluka: 'Sanwer',
  village: 'Hatod',
  latitude: demoDistrict.latitude,
  longitude: demoDistrict.longitude,
  altitudeMeters: 553,
  altitudeStatus: 'OBTAINED',
  altitudeSourceName: 'Open-Meteo Free Elevation Dataset (SRTM / Copernicus DEM)',
  locationSource: 'CATALOG_DEFAULT',
  formattedAddress: 'Hatod, Sanwer, Indore, Madhya Pradesh, India',
  agroClimaticZoneId: demoZone.id,
  agroClimaticZoneName: demoZone.name,
  normalAnnualRainfallMm: demoDistrict.normalRainfallMm,
  metadata: IMD_METADATA
};

export const SAMPLE_DEMO_LAND: LandAndIrrigation = {
  totalLandAcres: 5.0,
  plannedLandAllocationAcres: 5.0,
  selectedLandUnit: 'Acre',
  originalLandValue: 5.0,
  normalizedHectares: 2.02,
  normalizedSquareMetres: 20234,
  irrigatedAreaAcres: 5.0,
  rainfedAreaAcres: 0.0,
  hasBorewell: true,
  hasOpenWell: false,
  hasCanal: false,
  hasRiverLift: false,
  hasFarmPond: false,
  hasDrip: true,
  hasSprinkler: false,
  hasFloodOther: false,
  monthsWaterAvailable: 10,
  irrigationFrequency: 'Alternate Days',
  sourceReliabilityRating: 'High (Perennial / Assured)',
  seasonalLimitations: 'None',
  irrigationReliabilityScore100: 82,
  rainfallDependencyPercent: 18,
  irrigatedLandPercent: 100,
  rainfedLandPercent: 0,
  landSlope: 'Flat (0-1%)',
  drainageCapacity: 'Good (No waterlogging)',
  primaryWaterSource: 'Borewell / Tube Well',
  irrigationMethod: 'Drip Irrigation (Micro-irrigation)',
  dailyWaterAvailabilityHours: 7,
  waterReliabilityScore: 8,
  characteristics: {
    totalFarmAreaDisplay: 5.0,
    totalFarmAreaUnit: 'Acre',
    proposedCropAreaDisplay: 5.0,
    currentCrop: 'Soybean',
    previousCrop: 'Wheat',
    proposedPlantingDate: new Date().toISOString().split('T')[0],
    hasStorage: true,
    storageType: 'On-Farm Covered Shed',
    storageCapacityQuintals: 200,
    hasColdStorage: false,
    coldStorageDistanceKm: 25,
    machineryAvailable: ['Tractor (35-55 HP)', 'Drip / Fertigation Automation', 'Rotavator / Cultivator'],
    farmingSystem: 'Conventional',
    hasSoilTest: true
  },
  metadata: {
    status: 'LATEST_AVAILABLE',
    source: 'Farmer Farm Parameter Declaration & Hydrological Model',
    date: 'Active Session'
  }
};

export const SAMPLE_DEMO_SOIL: SoilIntelligence = {
  soilOrder: 'Black Cotton Soil (Vertisols)',
  soilDepth: 'Deep (> 50 cm)',
  texture: 'Clay Loam',
  hasSoilHealthCard: true,
  shcNumber: 'MP-IND-2024-8849',
  ph: 7.4,
  organicCarbonPercent: 0.65,
  availableNitrogenKgPerHa: 'Medium (280 - 560)',
  availablePhosphorusKgPerHa: 'Medium (10 - 25)',
  availablePotassiumKgPerHa: 'High (> 280)',
  zincStatus: 'Sufficient (>= 0.6 ppm)',
  boronStatus: 'Sufficient (>= 0.5 ppm)',
  electricalConductivityDsM: 0.45,
  drainage: 'Good (No waterlogging)',
  soilTypeProvenance: 'Soil test (Lab)',
  phProvenance: 'Soil test (Lab)',
  nutrientsProvenance: 'Soil test (Lab)',
  textureProvenance: 'Soil test (Lab)',
  depthProvenance: 'Soil test (Lab)',
  metadata: SOIL_METADATA
};

export const SAMPLE_DEMO_FARMER_PROFILE = SAMPLE_DEMO_FARMER;
export const SAMPLE_DEMO_FARM_LOCATION = SAMPLE_DEMO_LOCATION;
export const SAMPLE_DEMO_LAND_IRRIGATION = SAMPLE_DEMO_LAND;
export const SAMPLE_DEMO_SOIL_INTELLIGENCE = SAMPLE_DEMO_SOIL;

export const SAMPLE_DEMO_CROPS: { season: CropSeason; preferredCropIds: string[] } = {
  season: 'Kharif',
  preferredCropIds: ['soybean', 'cotton', 'maize', 'pigeonpea_tur']
};
