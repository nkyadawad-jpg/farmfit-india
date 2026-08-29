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
import {
  BLANK_FARMER_PROFILE,
  BLANK_FARM_LOCATION,
  BLANK_LAND_IRRIGATION,
  BLANK_SOIL_INTELLIGENCE,
  SAMPLE_DEMO_FARMER_PROFILE,
  SAMPLE_DEMO_FARM_LOCATION,
  SAMPLE_DEMO_LAND_IRRIGATION,
  SAMPLE_DEMO_SOIL_INTELLIGENCE
} from './data/demoProfiles';
import { runFarmfitCalculationEngine } from './services/calculationEngine';
import { Header } from './components/Header';
import { GlobalIntelligenceContextBar } from './components/GlobalIntelligenceContextBar';
import { UnifiedIntelligenceView } from './views/UnifiedIntelligenceView';
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
import { FarmerWorkflowView } from "./views/FarmerWorkflowView";

import { FarmReportView } from './views/FarmReportView';
import { DataSourcesView } from './views/DataSourcesView';
import { AboutView } from './views/AboutView';
import { SupplyDemandView } from './views/SupplyDemandView';
import { MandiMarketView } from './views/MandiMarketView';
import { DecisionIntelligenceView } from './views/DecisionIntelligenceView';
import { AgriculturalIntelligenceView } from './views/AgriculturalIntelligenceView';
import { StakeholderDecisionCenterView } from './views/StakeholderDecisionCenterView';
import { CommodityCoverageAuditView } from './views/CommodityCoverageAuditView';
import { EarlyWarningIntelligencePulseView } from './views/EarlyWarningIntelligencePulseView';
import { FarmfitValidationView } from './views/FarmfitValidationView';
import { AgriculturalControlTowerView } from './views/AgriculturalControlTowerView';
import { SupplyChainCommandCenterView } from './views/SupplyChainCommandCenterView';
import { MoreEnginesView } from './views/MoreEnginesView';

export default function App() {
  const [language, setLanguage] = useState<Language>('en');
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [wizardStep, setWizardStep] = useState<number>(1);
  const [isCalculatingModalOpen, setIsCalculatingModalOpen] = useState<boolean>(false);
  const [computedResult, setComputedResult] = useState<CalculationEngineResult | null>(null);

  // Global Intelligence Context State
  const [globalCommodity, setGlobalCommodity] = useState<string>('onion');
  const [globalState, setGlobalState] = useState<string>('Karnataka');
  const [globalDistrict, setGlobalDistrict] = useState<string>('Belagavi');
  const [globalRadius, setGlobalRadius] = useState<number>(200);

  // Demo Profile tracking
  const [isDemoModeActive, setIsDemoModeActive] = useState<boolean>(false);

  // 1. Farmer Profile State - Clean Safe Blank Startup
  const [farmer, setFarmer] = useState<FarmerProfile>(BLANK_FARMER_PROFILE);

  // 2. Farm Location State - Clean Safe Blank Startup
  const [location, setLocation] = useState<FarmLocation>(BLANK_FARM_LOCATION);

  // 3. Land & Irrigation State - Clean Safe Blank Startup
  const [land, setLand] = useState<LandAndIrrigation>(BLANK_LAND_IRRIGATION);

  // 4. Soil Intelligence State - Clean Safe Blank Startup
  const [soil, setSoil] = useState<SoilIntelligence>(BLANK_SOIL_INTELLIGENCE);

  // 5. Crop Intent & Season - Clean Safe Blank Startup (No preloaded crops)
  const [targetSeason, setTargetSeason] = useState<CropSeason>('Kharif');
  const [preferredCropIds, setPreferredCropIds] = useState<string[]>([]);

  const togglePreferredCrop = (id: string) => {
    setPreferredCropIds((prev) => 
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  // Demo Profile Actions
  const handleLoadDemoProfile = () => {
    setFarmer(SAMPLE_DEMO_FARMER_PROFILE);
    setLocation(SAMPLE_DEMO_FARM_LOCATION);
    setLand(SAMPLE_DEMO_LAND_IRRIGATION);
    setSoil(SAMPLE_DEMO_SOIL_INTELLIGENCE);
    setTargetSeason('Kharif');
    setPreferredCropIds(['soybean', 'cotton', 'maize', 'pigeonpea_tur']);
    setIsDemoModeActive(true);
  };

  const handleClearToBlankProfile = () => {
    setFarmer(BLANK_FARMER_PROFILE);
    setLocation(BLANK_FARM_LOCATION);
    setLand(BLANK_LAND_IRRIGATION);
    setSoil(BLANK_SOIL_INTELLIGENCE);
    setPreferredCropIds([]);
    setTargetSeason('Kharif');
    setComputedResult(null);
    setIsDemoModeActive(false);
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
    setCurrentTab('farm_decision');
    setWizardStep(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Robust Tab & Workflow Step Navigator
  const handleSelectTab = (tab: string) => {
    if (tab === 'farm_decision' || tab === 'profile' || tab === 'farmer' || tab === 'farmer_details') {
      setCurrentTab('farm_decision');
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
    } else if (tab === 'weather_step') {
      setCurrentTab('weather_step');
      setWizardStep(6);
    } else if (tab === 'engine' || tab === 'calculator' || tab === 'wizard') {
      setCurrentTab('engine');
      setWizardStep(7);
    } else {
      setCurrentTab(tab);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStepClick = (stepNumber: number) => {
    const stepTabs = ['farm_decision', 'location', 'land', 'soil', 'crops', 'weather_step', 'engine'];
    const tabName = stepTabs[stepNumber - 1] || 'farm_decision';
    setCurrentTab(tabName);
    setWizardStep(stepNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Helper to ensure rich calculation results are ALWAYS available
  const getActiveResult = (): CalculationEngineResult => {
    if (computedResult) return computedResult;
    return runFarmfitCalculationEngine({
      farmerProfile: farmer.name ? farmer : SAMPLE_DEMO_FARMER_PROFILE,
      farmLocation: location.district ? location : { ...SAMPLE_DEMO_FARM_LOCATION, state: globalState, district: globalDistrict },
      landAndIrrigation: land.totalLandAcres ? land : SAMPLE_DEMO_LAND_IRRIGATION,
      soilIntelligence: soil.soilOrder ? soil : SAMPLE_DEMO_SOIL_INTELLIGENCE,
      targetSeason,
      preferredCropIds: preferredCropIds.length > 0 ? preferredCropIds : [globalCommodity, 'soybean', 'cotton', 'wheat', 'maize', 'pigeonpea_tur'],
      engineWeights: DEFAULT_ENGINE_WEIGHTS
    });
  };

  // Derive active tab key for Header synchronization
  const isWorkflowActive = ['farm_decision', 'farmer_details', 'profile', 'location', 'land', 'soil', 'crops', 'weather_step', 'engine', 'calculator', 'wizard'].includes(currentTab);
  const activeHeaderTab = isWorkflowActive ? 'farm_decision' : currentTab;

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
        isDemoModeActive={isDemoModeActive}
        onLoadDemoProfile={handleLoadDemoProfile}
        onClearToBlankProfile={handleClearToBlankProfile}
      />

      <GlobalIntelligenceContextBar 
        globalCommodity={globalCommodity}
        setGlobalCommodity={setGlobalCommodity}
        globalState={globalState}
        setGlobalState={setGlobalState}
        globalDistrict={globalDistrict}
        setGlobalDistrict={setGlobalDistrict}
        globalRadius={globalRadius}
        setGlobalRadius={setGlobalRadius}
        targetSeason={targetSeason}
        setTargetSeason={setTargetSeason}
        currentStakeholder={['farmer', 'fpo', 'b2b', 'government'].includes(currentTab) ? currentTab : 'farmer'}
        onSelectStakeholder={(stk) => {
          setCurrentTab(stk);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onRunIntelligence={handleRunCalculation}
        language={language}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <ErrorBoundary onResetToCrops={() => setCurrentTab('home')}>

        {currentTab === 'home' && (
          <HomeView 
            onLaunchCalculator={handleLaunchCalculator} 
            onSelectTab={handleSelectTab} 
            language={language} 
            latestResult={getActiveResult()} 
            globalCommodity={globalCommodity}
            globalState={globalState}
            globalDistrict={globalDistrict}
            globalRadius={globalRadius}
          />
        )}
        
        {/* FARM PROFILE WIZARD & CALCULATION WORKFLOW */}
        {isWorkflowActive && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <aside className="lg:col-span-4 xl:col-span-3">
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
            </aside>

            <div className="lg:col-span-8 xl:col-span-9 space-y-6">
              <WizardProgress 
                currentStep={wizardStep} 
                onStepClick={handleStepClick} 
                language={language} 
              />

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
                  onNext={() => { setWizardStep(2); setCurrentTab('location'); }}
                  language={language}
                  isDemoModeActive={isDemoModeActive}
                  onLoadDemoProfile={handleLoadDemoProfile}
                  onClearToBlankProfile={handleClearToBlankProfile}
                />
              )}

              {wizardStep === 2 && (
                <StepLocation
                  location={location}
                  onChange={setLocation}
                  onNext={() => { setWizardStep(3); setCurrentTab('land'); }}
                  onBack={() => { setWizardStep(1); setCurrentTab('farm_decision'); }}
                  language={language}
                />
              )}

              {wizardStep === 3 && (
                <StepLandIrrigation
                  landAndIrrigation={land}
                  onChange={setLand}
                  onNext={() => { setWizardStep(4); setCurrentTab('soil'); }}
                  onBack={() => { setWizardStep(2); setCurrentTab('location'); }}
                  language={language}
                />
              )}

              {wizardStep === 4 && (
                <StepSoil
                  soil={soil}
                  farmLocation={location}
                  onChange={setSoil}
                  onNext={() => { setWizardStep(5); setCurrentTab('crops'); }}
                  onBack={() => { setWizardStep(3); setCurrentTab('land'); }}
                  language={language}
                />
              )}

              {wizardStep === 5 && (
                <StepCrops
                  targetSeason={targetSeason}
                  preferredCropIds={preferredCropIds}
                  onSeasonChange={setTargetSeason}
                  onTogglePreferredCrop={togglePreferredCrop}
                  onRunEngine={handleRunCalculation}
                  onNext={() => { setWizardStep(6); setCurrentTab('weather_step'); }}
                  onBack={() => { setWizardStep(4); setCurrentTab('soil'); }}
                  language={language}
                />
              )}

              {wizardStep === 6 && (
                <WeatherView
                  location={location}
                  land={land}
                  soil={soil}
                  result={getActiveResult()}
                  onNavigateToLocation={() => { setWizardStep(2); setCurrentTab('location'); }}
                  onNavigateToCrops={() => { setWizardStep(5); setCurrentTab('crops'); }}
                  language={language}
                />
              )}

              {wizardStep === 7 && (
                <div className="space-y-6">
                  <FarmProfileSummary
                    farmer={farmer}
                    location={location}
                    land={land}
                    soil={soil}
                    onEditSection={handleStepClick}
                    onCalculate={handleRunCalculation}
                    language={language}
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* RESULTS & RECOMMENDATIONS */}
        {currentTab === 'recommendations' && (
          <RecommendationsView
            result={getActiveResult()}
            onSelectCropForDetails={(cropId) => {
              setGlobalCommodity(cropId);
              setCurrentTab('commodities');
            }}
            onNavigateToReport={() => setCurrentTab('report')}
            onNavigateToRouting={() => setCurrentTab('markets')}
            onNavigateToDecision={() => setCurrentTab('farmer')}
            language={language}
          />
        )}
        
        {/* STAKEHOLDER DECISION CENTERS */}
        {currentTab === 'farmer' && (
          <StakeholderDecisionCenterView 
            initialStakeholder="farmer" 
            farmerProfile={farmer}
            farmLocation={{...location, state: globalState, district: globalDistrict}} 
            landProfile={land}
            soilProfile={soil}
            targetSeason={targetSeason}
            preferredCropIds={[globalCommodity]} 
            selectedCropId={globalCommodity} 
            onSelectCrop={setGlobalCommodity} 
            onLaunchCalculator={handleLaunchCalculator}
            language={language} 
          />
        )}
        
        {currentTab === 'fpo' && (
          <StakeholderDecisionCenterView 
            initialStakeholder="fpo" 
            farmLocation={{...location, state: globalState, district: globalDistrict}} 
            preferredCropIds={[globalCommodity]} 
            selectedCropId={globalCommodity} 
            onSelectCrop={setGlobalCommodity} 
            language={language} 
          />
        )}
        
        {currentTab === 'b2b' && (
          <StakeholderDecisionCenterView 
            initialStakeholder="b2b" 
            farmLocation={{...location, state: globalState, district: globalDistrict}} 
            preferredCropIds={[globalCommodity]} 
            selectedCropId={globalCommodity} 
            onSelectCrop={setGlobalCommodity} 
            language={language} 
          />
        )}
        
        {currentTab === 'government' && (
          <StakeholderDecisionCenterView 
            initialStakeholder="government" 
            farmLocation={{...location, state: globalState, district: globalDistrict}} 
            preferredCropIds={[globalCommodity]} 
            selectedCropId={globalCommodity} 
            onSelectCrop={setGlobalCommodity} 
            language={language} 
          />
        )}

        {currentTab === 'stakeholders' && (
          <StakeholderDecisionCenterView 
            initialStakeholder="hub" 
            farmLocation={{...location, state: globalState, district: globalDistrict}} 
            preferredCropIds={[globalCommodity]} 
            selectedCropId={globalCommodity} 
            onSelectCrop={setGlobalCommodity} 
            language={language} 
          />
        )}
        
        {/* CORE INTELLIGENCE MODULES */}
        {currentTab === 'supply_chain' && (
          <SupplyChainCommandCenterView 
            userDistrict={globalDistrict} 
            selectedCommodityExternal={globalCommodity} 
            onSelectCommodity={setGlobalCommodity} 
            searchRadiusExternal={globalRadius} 
            onSelectRadius={setGlobalRadius} 
            language={language} 
          />
        )}
        
        {currentTab === 'markets' && (
          <MandiMarketView 
            farmerLocation={{...location, state: globalState, district: globalDistrict}} 
            preferredCropIds={[globalCommodity]} 
            selectedCropId={globalCommodity} 
            onSelectCrop={setGlobalCommodity} 
            language={language} 
            expectedHarvestWindow={{startMonth: 'October', endMonth: 'November', season: targetSeason}} 
          />
        )}

        {currentTab === 'routing' && (
          <MarketRoutingView
            farmerLocation={{...location, state: globalState, district: globalDistrict}}
            result={getActiveResult()}
            selectedCropId={globalCommodity}
            onSelectCrop={setGlobalCommodity}
            language={language}
          />
        )}
        
        {currentTab === 'commodities' && (
          <UnifiedIntelligenceView 
            farmerLocation={{...location, state: globalState, district: globalDistrict}} 
            selectedCropId={globalCommodity} 
            onSelectCrop={setGlobalCommodity} 
            language={language} 
          />
        )}
        
        {currentTab === 'early_warning' && (
          <EarlyWarningIntelligencePulseView 
            userDistrict={globalDistrict} 
            language={language} 
          />
        )}
        
        {currentTab === 'control_tower' && (
          <AgriculturalControlTowerView 
            userDistrict={globalDistrict} 
            language={language} 
          />
        )}
        
        {currentTab === 'validation' && (
          <FarmfitValidationView 
            language={language} 
          />
        )}

        {currentTab === 'msp' && (
          <MspPolicyView 
            language={language} 
          />
        )}

        {currentTab === 'fertilizer' && (
          <FertilizerAgronomyView 
            result={getActiveResult()} 
            language={language} 
          />
        )}

        {currentTab === 'weather' && (
          <WeatherView 
            location={{...location, state: globalState, district: globalDistrict}}
            land={land}
            soil={soil}
            result={getActiveResult()}
            onNavigateToLocation={() => handleSelectTab('location')}
            onNavigateToCrops={() => handleSelectTab('crops')}
            language={language} 
          />
        )}

        {currentTab === 'soil_intel' && (
          <SoilIntelligenceView 
            result={getActiveResult()} 
            language={language} 
          />
        )}

        {currentTab === 'risk' && (
          <RiskAnalysisView 
            result={getActiveResult()} 
            farmerLocation={{...location, state: globalState, district: globalDistrict}}
            landProfile={land}
            soilProfile={soil}
            selectedCropId={globalCommodity}
            onSelectCrop={setGlobalCommodity}
            language={language} 
          />
        )}

        {currentTab === 'supply_demand' && (
          <SupplyDemandView 
            farmerLocation={{...location, state: globalState, district: globalDistrict}}
            selectedCropId={globalCommodity}
            onSelectCrop={setGlobalCommodity}
            language={language} 
          />
        )}

        {currentTab === 'report' && (
          <FarmReportView 
            result={getActiveResult()} 
            language={language} 
          />
        )}

        {currentTab === 'about' && (
          <AboutView 
            onLaunchCalculator={handleLaunchCalculator}
            language={language} 
          />
        )}
        
        {(currentTab === 'data_audit' || currentTab === 'datasources') && (
          <div className="space-y-6">
            <DataSourcesView language={language} />
            <CommodityCoverageAuditView />
          </div>
        )}

        {currentTab === 'more_engines' && (
          <MoreEnginesView
            globalCommodity={globalCommodity}
            setGlobalCommodity={setGlobalCommodity}
            globalState={globalState}
            setGlobalState={setGlobalState}
            globalDistrict={globalDistrict}
            setGlobalDistrict={setGlobalDistrict}
            globalRadius={globalRadius}
            setGlobalRadius={setGlobalRadius}
            targetSeason={targetSeason}
            setTargetSeason={setTargetSeason}
            onSelectTab={handleSelectTab}
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
