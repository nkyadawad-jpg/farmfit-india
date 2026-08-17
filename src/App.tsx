import React, { useState } from 'react';
import { 
  Language, 
  FarmerProfile, 
  FarmLocation, 
  LandAndIrrigation, 
  SoilIntelligence, 
  CropSeason, 
  CalculationEnginePayload, 
  CalculationEngineResult 
} from './types';
import { 
  INDIAN_DISTRICTS, 
  AGRO_CLIMATIC_ZONES, 
  IMD_METADATA, 
  SOIL_METADATA, 
  DEFAULT_ENGINE_WEIGHTS 
} from './data/officialData';
import { runFarmfitCalculationEngine } from './services/calculationEngine';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { FarmWorkflowSidebar } from './components/FarmProfile/FarmWorkflowSidebar';
import { WizardProgress } from './components/Wizard/WizardProgress';
import { StepProfile } from './components/Wizard/StepProfile';
import { StepLocation } from './components/Wizard/StepLocation';
import { StepLandIrrigation } from './components/Wizard/StepLandIrrigation';
import { StepSoil } from './components/Wizard/StepSoil';
import { StepCrops } from './components/Wizard/StepCrops';
import { FarmProfileSummary } from './components/FarmProfile/FarmProfileSummary';
import { CalculationEngineModal } from './components/Engine/CalculationEngineModal';
import { ErrorBoundary } from './components/ErrorBoundary';

// Analytical & Domain Views
import { HomeView } from './views/HomeView';
import { RecommendationsView } from './views/RecommendationsView';
import { FertilizerAgronomyView } from './views/FertilizerAgronomyView';
import { MarketRoutingView } from './views/MarketRoutingView';
import { MspPolicyView } from './views/MspPolicyView';
import { RiskAnalysisView } from './views/RiskAnalysisView';
import { WeatherView } from './views/WeatherView';
import { SoilIntelligenceView } from './views/SoilIntelligenceView';
import { FarmReportView } from './views/FarmReportView';
import { DataSourcesView } from './views/DataSourcesView';
import { AboutView } from './views/AboutView';

export default function App() {
  const [language, setLanguage] = useState<Language>('en');
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [wizardStep, setWizardStep] = useState<number>(1);
  const [isCalculatingModalOpen, setIsCalculatingModalOpen] = useState<boolean>(false);
  const [computedResult, setComputedResult] = useState<CalculationEngineResult | null>(null);

  // 1. Farmer Profile State
  const [farmer, setFarmer] = useState<FarmerProfile>({
    name: 'Ramesh Patel',
    mobile: '9876543210',
    farmerType: 'Small (2.5 - 5 Acres)',
    experienceYears: 14,
    riskTolerance: 'Moderate',
    primaryGoal: 'Max Profit',
    workingCapitalBudget: 120000
  });

  // 2. Farm Location State
  const defaultDistrict = INDIAN_DISTRICTS[0]; // Indore, MP
  const defaultZone = AGRO_CLIMATIC_ZONES.find((z) => z.id === defaultDistrict.zoneId) || AGRO_CLIMATIC_ZONES[7];

  const [location, setLocation] = useState<FarmLocation>({
    state: defaultDistrict.state,
    district: defaultDistrict.district,
    taluka: 'Sanwer',
    village: 'Hatod',
    latitude: defaultDistrict.latitude,
    longitude: defaultDistrict.longitude,
    altitudeMeters: 553,
    altitudeStatus: 'OBTAINED',
    altitudeSourceName: 'Open-Meteo Free Elevation Dataset (SRTM / Copernicus DEM)',
    locationSource: 'CATALOG_DEFAULT',
    agroClimaticZoneId: defaultZone.id,
    agroClimaticZoneName: defaultZone.name,
    normalAnnualRainfallMm: defaultDistrict.normalRainfallMm,
    metadata: IMD_METADATA
  });

  // 3. Land & Irrigation State
  const [land, setLand] = useState<LandAndIrrigation>({
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
  });

  // 4. Soil Intelligence State
  const [soil, setSoil] = useState<SoilIntelligence>({
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
  });

  // 5. Crop Intent & Season
  const [targetSeason, setTargetSeason] = useState<CropSeason>('Kharif');
  const [preferredCropIds, setPreferredCropIds] = useState<string[]>(['soybean', 'cotton', 'maize', 'pigeonpea_tur']);

  const togglePreferredCrop = (id: string) => {
    setPreferredCropIds((prev) => 
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  // Launch Calculation Engine
  const handleRunCalculation = () => {
    const payload: CalculationEnginePayload = {
      farmerProfile: farmer,
      farmLocation: location,
      landAndIrrigation: land,
      soilIntelligence: soil,
      targetSeason,
      preferredCropIds,
      engineWeights: DEFAULT_ENGINE_WEIGHTS
    };

    const result = runFarmfitCalculationEngine(payload);
    setComputedResult(result);
    setIsCalculatingModalOpen(true);
  };

  const handleCalculationComplete = (res: CalculationEngineResult) => {
    setIsCalculatingModalOpen(false);
    setComputedResult(res);
    setCurrentTab('recommendations');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleLanguage = () => {
    setLanguage((prev) => (prev === 'en' ? 'hi' : 'en'));
  };

  const handleLaunchCalculator = () => {
    setCurrentTab('profile');
    setWizardStep(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Robust Tab & Workflow Step Navigator
  const handleSelectTab = (tab: string) => {
    if (tab === 'profile') {
      setCurrentTab('profile');
      setWizardStep(1);
    } else if (tab === 'location') {
      setCurrentTab('location');
      setWizardStep(2);
    } else if (tab === 'land') {
      setCurrentTab('land');
      setWizardStep(3);
    } else if (tab === 'soil') {
      setCurrentTab('soil');
      setWizardStep(4);
    } else if (tab === 'crops') {
      setCurrentTab('crops');
      setWizardStep(5);
    } else if (tab === 'engine' || tab === 'calculator') {
      setCurrentTab('engine');
      setWizardStep(6);
    } else if (tab === 'markets' || tab === 'supply_demand' || tab === 'trade') {
      setCurrentTab('routing');
    } else {
      setCurrentTab(tab);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStepClick = (stepNumber: number) => {
    const stepTabs = ['profile', 'location', 'land', 'soil', 'crops', 'engine'];
    const tabName = stepTabs[stepNumber - 1] || 'profile';
    setCurrentTab(tabName);
    setWizardStep(stepNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Derive active tab key for Header synchronization
  const isWorkflowActive = currentTab === 'workflow' || currentTab === 'calculator' || ['profile', 'location', 'land', 'soil', 'crops', 'engine'].includes(currentTab);
  const activeHeaderTab = isWorkflowActive 
    ? ['profile', 'location', 'land', 'soil', 'crops', 'engine'][wizardStep - 1] || 'profile'
    : currentTab;

  return (
    <div className="min-h-screen bg-[#F8FAF8] dark:bg-slate-950 text-[#1F2937] dark:text-slate-100 flex flex-col font-sans selection:bg-emerald-200 selection:text-emerald-950">
      {/* Universal Top Header */}
      <Header
        currentTab={activeHeaderTab}
        onSelectTab={handleSelectTab}
        language={language}
        onToggleLanguage={handleToggleLanguage}
        onLaunchCalculator={handleLaunchCalculator}
        hasCalculated={!!computedResult}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <ErrorBoundary onResetToCrops={() => setCurrentTab('crops')}>
        {/* VIEW 1: Dashboard Home with Accessible FARM WORKFLOW Sidebar */}
        {currentTab === 'home' && (
          <div className="space-y-6">
            {/* Top Wizard Progress Bar for Mobile/Tablet */}
            <div className="block lg:hidden">
              <WizardProgress
                currentStep={0}
                onStepClick={handleStepClick}
                language={language}
              />
            </div>

            <div className="flex flex-col lg:flex-row items-start gap-8">
              {/* Desktop FARM WORKFLOW Sidebar - Always Accessible */}
              <div className="hidden lg:block shrink-0">
                <FarmWorkflowSidebar
                  currentStep={0}
                  onSelectStep={handleStepClick}
                  farmer={farmer}
                  location={location}
                  land={land}
                  soil={soil}
                  targetSeason={targetSeason}
                  preferredCropIds={preferredCropIds}
                  onCalculate={handleRunCalculation}
                  language={language}
                />
              </div>

              {/* Main Dashboard Content */}
              <div className="flex-1 w-full min-w-0">
                <HomeView
                  onLaunchCalculator={handleLaunchCalculator}
                  onSelectTab={handleSelectTab}
                  language={language}
                  latestResult={computedResult}
                />
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: Interactive Multi-Step Farm Workflow & Dedicated Step Views */}
        {isWorkflowActive && (
          <div className="space-y-6">
            {/* Top Wizard Progress Bar for Mobile/Tablet */}
            <div className="block lg:hidden">
              <WizardProgress
                currentStep={wizardStep}
                onStepClick={handleStepClick}
                language={language}
              />
            </div>

            {/* 2-Column Responsive Workflow Layout */}
            <div className="flex flex-col lg:flex-row items-start gap-8">
              {/* Desktop FARM WORKFLOW Sidebar */}
              <div className="hidden lg:block shrink-0">
                <FarmWorkflowSidebar
                  currentStep={wizardStep}
                  onSelectStep={handleStepClick}
                  farmer={farmer}
                  location={location}
                  land={land}
                  soil={soil}
                  targetSeason={targetSeason}
                  preferredCropIds={preferredCropIds}
                  onCalculate={handleRunCalculation}
                  language={language}
                />
              </div>

              {/* Dedicated Step Views */}
              <div className="flex-1 w-full min-w-0">
                {/* STEP 1: Dedicated FARMER PROFILE View */}
                {wizardStep === 1 && (
                  <StepProfile
                    farmer={farmer}
                    location={location}
                    land={land}
                    soil={soil}
                    targetSeason={targetSeason}
                    onFarmerChange={setFarmer}
                    onLocationChange={setLocation}
                    onLandChange={setLand}
                    onSoilChange={setSoil}
                    onSeasonChange={setTargetSeason}
                    onNext={() => handleStepClick(2)}
                    onBack={() => setCurrentTab('home')}
                    language={language}
                  />
                )}

                {/* STEP 2: Dedicated Farm Location View */}
                {wizardStep === 2 && (
                  <StepLocation
                    location={location}
                    onChange={setLocation}
                    onNext={() => handleStepClick(3)}
                    onBack={() => handleStepClick(1)}
                    language={language}
                  />
                )}

                {/* STEP 3: Dedicated Land & Irrigation View */}
                {wizardStep === 3 && (
                  <StepLandIrrigation
                    landAndIrrigation={land}
                    onChange={setLand}
                    onNext={() => handleStepClick(4)}
                    onBack={() => handleStepClick(2)}
                    language={language}
                  />
                )}

                {/* STEP 4: Dedicated Soil Intelligence View */}
                {wizardStep === 4 && (
                  <StepSoil
                    soil={soil}
                    farmLocation={location}
                    onChange={setSoil}
                    onNext={() => handleStepClick(5)}
                    onBack={() => handleStepClick(3)}
                    language={language}
                  />
                )}

                {/* STEP 5: Dedicated Crop Selection View */}
                {wizardStep === 5 && (
                  <StepCrops
                    targetSeason={targetSeason}
                    onSeasonChange={setTargetSeason}
                    preferredCropIds={preferredCropIds}
                    onTogglePreferredCrop={togglePreferredCrop}
                    onBack={() => handleStepClick(4)}
                    onRunEngine={() => handleStepClick(6)}
                    language={language}
                  />
                )}

                {/* STEP 6: Dedicated FARMFIT Calculation Engine & Review View */}
                {wizardStep === 6 && (
                  <FarmProfileSummary
                    farmer={farmer}
                    location={location}
                    land={land}
                    soil={soil}
                    onCalculate={handleRunCalculation}
                    onEditSection={(step) => handleStepClick(step)}
                    language={language}
                  />
                )}
              </div>
            </div>
          </div>
        )}

        {/* VIEW 3: Recommendations & Ranking View */}
        {currentTab === 'recommendations' && (
          <RecommendationsView
            result={computedResult || runFarmfitCalculationEngine({
              farmerProfile: farmer,
              farmLocation: location,
              landAndIrrigation: land,
              soilIntelligence: soil,
              targetSeason,
              preferredCropIds,
              engineWeights: DEFAULT_ENGINE_WEIGHTS
            })}
            onNavigateToReport={() => setCurrentTab('report')}
            onNavigateToRouting={() => setCurrentTab('routing')}
            language={language}
          />
        )}

        {/* VIEW 4: Fertilizer & Agronomy Plan View */}
        {currentTab === 'fertilizer' && (
          <FertilizerAgronomyView
            result={computedResult || runFarmfitCalculationEngine({
              farmerProfile: farmer,
              farmLocation: location,
              landAndIrrigation: land,
              soilIntelligence: soil,
              targetSeason,
              preferredCropIds,
              engineWeights: DEFAULT_ENGINE_WEIGHTS
            })}
            language={language}
          />
        )}

        {/* VIEW 5: APMC Mandi Logistics & Routing View */}
        {currentTab === 'routing' && (
          <MarketRoutingView
            result={computedResult || runFarmfitCalculationEngine({
              farmerProfile: farmer,
              farmLocation: location,
              landAndIrrigation: land,
              soilIntelligence: soil,
              targetSeason,
              preferredCropIds,
              engineWeights: DEFAULT_ENGINE_WEIGHTS
            })}
            language={language}
          />
        )}

        {/* VIEW 6: Official 2024-25 MSP Policy View */}
        {currentTab === 'msp' && (
          <MspPolicyView
            language={language}
          />
        )}

        {/* VIEW 7: Multi-Scenario Risk & Sensitivity Analysis View */}
        {currentTab === 'risk' && (
          <RiskAnalysisView
            result={computedResult || runFarmfitCalculationEngine({
              farmerProfile: farmer,
              farmLocation: location,
              landAndIrrigation: land,
              soilIntelligence: soil,
              targetSeason,
              preferredCropIds,
              engineWeights: DEFAULT_ENGINE_WEIGHTS
            })}
            language={language}
          />
        )}

        {/* VIEW 8: Weather & Agro-Climatic Zones View */}
        {currentTab === 'weather' && (
          <WeatherView
            result={computedResult || runFarmfitCalculationEngine({
              farmerProfile: farmer,
              farmLocation: location,
              landAndIrrigation: land,
              soilIntelligence: soil,
              targetSeason,
              preferredCropIds,
              engineWeights: DEFAULT_ENGINE_WEIGHTS
            })}
            language={language}
          />
        )}

        {/* VIEW 9: Standalone Soil Intelligence View */}
        {currentTab === 'soil_view' && (
          <SoilIntelligenceView
            result={computedResult || runFarmfitCalculationEngine({
              farmerProfile: farmer,
              farmLocation: location,
              landAndIrrigation: land,
              soilIntelligence: soil,
              targetSeason,
              preferredCropIds,
              engineWeights: DEFAULT_ENGINE_WEIGHTS
            })}
            language={language}
          />
        )}

        {/* VIEW 10: Printable Comprehensive Farm Report */}
        {currentTab === 'report' && (
          <FarmReportView
            result={computedResult || runFarmfitCalculationEngine({
              farmerProfile: farmer,
              farmLocation: location,
              landAndIrrigation: land,
              soilIntelligence: soil,
              targetSeason,
              preferredCropIds,
              engineWeights: DEFAULT_ENGINE_WEIGHTS
            })}
            language={language}
          />
        )}

        {/* VIEW 11: Official Data Sources Registry */}
        {currentTab === 'datasources' && (
          <DataSourcesView
            language={language}
          />
        )}

        {/* VIEW 12: About FARMFIT & CACP Methodology */}
        {currentTab === 'about' && (
          <AboutView
            onLaunchCalculator={handleLaunchCalculator}
            language={language}
          />
        )}
        </ErrorBoundary>
      </main>

      {/* Real-time Calculation Simulation Modal */}
      {computedResult && (
        <CalculationEngineModal
          isOpen={isCalculatingModalOpen}
          onComplete={handleCalculationComplete}
          computedResult={computedResult}
        />
      )}

      {/* Universal Footer */}
      <Footer
        onSelectTab={handleSelectTab}
        language={language}
      />
    </div>
  );
}
