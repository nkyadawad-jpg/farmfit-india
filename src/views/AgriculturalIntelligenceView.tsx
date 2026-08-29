import React, { useState, useMemo } from 'react';
import { 
  Globe2, 
  Building2, 
  MapPin, 
  Wheat, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  ShieldAlert, 
  Compass, 
  Sparkles, 
  Info, 
  ChevronRight, 
  CheckCircle2, 
  Layers, 
  BarChart3, 
  Sliders, 
  ArrowUpRight, 
  ArrowDownRight, 
  Scale, 
  Truck, 
  DollarSign, 
  Calendar, 
  Flame, 
  CloudRain, 
  Database,
  ExternalLink,
  Users,
  Briefcase,
  Landmark,
  FileSpreadsheet,
  History
} from 'lucide-react';
import { FarmLocation, Language } from '../types';
import { 
  AgriculturalExposureAssessment,
  DistrictAgriculturalProfile,
  StateAgriculturalProfile,
  IndiaAgriculturalIntelligence,
  CommodityIntelligenceProfile,
  PricePressureSignal,
  SupplyPressureSignal,
  DemandPressureSignal,
  FarmerIncomeExposure,
  FPOExposureAssessment,
  CorporateB2BExposureAssessment,
  GovernmentIntelligenceProfile,
  AgriculturalEarlyWarningAlert,
  AgriculturalEconomicIndexFramework,
  AgriculturalBackboneFramework,
  CrossEntityShockPropagation,
  GeographicScope,
  StakeholderEntityType
} from '../types/agriculturalExposure';
import { ExogenousShockInput } from '../types/scenarioEngine';
import { ALL_INDIAN_STATES } from '../data/indiaAdminData';
import { FARMFIT_CROP_COMMODITY_MASTER } from '../data/cropMasterIndex';
import { geographicAggregationService } from '../services/geographicAggregationService';
import { agriculturalExposureService } from '../services/agriculturalExposureService';

import { FarmfitValidationView } from './FarmfitValidationView';

interface AgriculturalIntelligenceViewProps {
  farmerLocation?: FarmLocation;
  selectedCropId?: string;
  onSelectCrop?: (cropId: string) => void;
  language?: Language;
}

export const AgriculturalIntelligenceView: React.FC<AgriculturalIntelligenceViewProps> = ({
  farmerLocation,
  selectedCropId = 'soybean',
  onSelectCrop,
  language = 'en'
}) => {
  // Navigation Tabs within Intelligence Engine
  const [activeModule, setActiveModule] = useState<
    'national' | 'commodity' | 'district_state' | 'early_warnings' | 'exposure_hierarchy' | 'economic_index' | 'validation'
  >('national');

  // Geographic Selection
  const [selectedState, setSelectedState] = useState<string>(farmerLocation?.state || 'Maharashtra');
  const [selectedDistrict, setSelectedDistrict] = useState<string>(farmerLocation?.district || 'Belagavi');
  const [currentCommodityId, setCurrentCommodityId] = useState<string>(selectedCropId);
  const [activeStakeholder, setActiveStakeholder] = useState<StakeholderEntityType>('INDIVIDUAL_FARMER');

  // Interactive Shock Inputs for Propagation Engine
  const [shockInput, setShockInput] = useState<ExogenousShockInput>({
    monsoonRainfallDeviationPercent: -20,
    fuelDieselPriceHikePercent: 12,
    mandiArrivalSurgePercent: 0,
    exportDutyOrTariffChangePercent: 0
  });

  // State Districts list
  const currentDistricts = useMemo(() => {
    const s = ALL_INDIAN_STATES.find(item => item.name.toLowerCase() === selectedState.toLowerCase());
    return s ? s.districts : (ALL_INDIAN_STATES[0]?.districts || []);
  }, [selectedState]);

  // Aggregate Data Models (cached & transparent)
  const indiaData: IndiaAgriculturalIntelligence = useMemo(() => {
    return geographicAggregationService.aggregateStateToIndia();
  }, []);

  const stateProfile: StateAgriculturalProfile = useMemo(() => {
    return geographicAggregationService.aggregateDistrictToState(selectedState);
  }, [selectedState]);

  const districtProfile: DistrictAgriculturalProfile = useMemo(() => {
    return geographicAggregationService.aggregateCommodityToDistrict(selectedState, selectedDistrict);
  }, [selectedState, selectedDistrict]);

  const commodityProfile: CommodityIntelligenceProfile = useMemo(() => {
    return geographicAggregationService.getCommodityNationalProfile(currentCommodityId);
  }, [currentCommodityId]);

  const currentGeography: GeographicScope = useMemo(() => ({
    level: activeStakeholder === 'INDIVIDUAL_FARMER' ? 'FARM' : 'DISTRICT',
    name: `${selectedDistrict}, ${selectedState}`,
    state: selectedState,
    district: selectedDistrict
  }), [selectedDistrict, selectedState, activeStakeholder]);

  const exposureAssessment: AgriculturalExposureAssessment = useMemo(() => {
    return agriculturalExposureService.evaluateCommodityExposure(currentCommodityId, currentGeography, activeStakeholder);
  }, [currentCommodityId, currentGeography, activeStakeholder]);

  const earlyWarnings: AgriculturalEarlyWarningAlert[] = useMemo(() => {
    return agriculturalExposureService.getEarlyWarningAlerts();
  }, []);

  const economicIndex: AgriculturalEconomicIndexFramework = useMemo(() => {
    return agriculturalExposureService.getEconomicIndexFramework();
  }, []);

  const backbone: AgriculturalBackboneFramework = useMemo(() => {
    return agriculturalExposureService.getAgriculturalBackboneFramework();
  }, []);

  const shockPropagation: CrossEntityShockPropagation = useMemo(() => {
    return agriculturalExposureService.simulateCrossEntityShock(shockInput, currentCommodityId);
  }, [shockInput, currentCommodityId]);

  // Stakeholder Exposures
  const farmerIncomeExp: FarmerIncomeExposure = useMemo(() => {
    return agriculturalExposureService.calculateFarmerIncomeExposure(
      'Small (2.5 - 5 Acres)',
      4.0,
      [{ cropId: currentCommodityId, acres: 4.0 }]
    );
  }, [currentCommodityId]);

  const fpoExp: FPOExposureAssessment = useMemo(() => {
    return agriculturalExposureService.evaluateFPOExposure();
  }, []);

  const corporateExp: CorporateB2BExposureAssessment = useMemo(() => {
    return agriculturalExposureService.evaluateCorporateB2BExposure();
  }, []);

  const govtIntel: GovernmentIntelligenceProfile = useMemo(() => {
    return agriculturalExposureService.getGovernmentIntelligence(currentGeography);
  }, [currentGeography]);

  const handleCommodityChange = (cropId: string) => {
    setCurrentCommodityId(cropId);
    if (onSelectCrop) onSelectCrop(cropId);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 pb-20">
      {/* Top Hero & System Scope Header */}
      <div className="bg-gradient-to-b from-emerald-900 via-emerald-950 to-slate-900 text-white border-b border-emerald-800/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  <Globe2 className="w-3.5 h-3.5" />
                  {indiaData.scopeTitle}
                </span>
                <span className="text-xs text-emerald-300/80 font-mono">
                  Observation Period: {indiaData.reportingPeriod}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2.5">
                <span>FARMFIT India Agricultural Intelligence & Economic Exposure Engine</span>
              </h1>
              <p className="text-sm text-emerald-200/90 mt-1 max-w-3xl">
                Unified actuarial intelligence hierarchy connecting Farm &rarr; FPO &rarr; District &rarr; State &rarr; India across the complete commodity universe.
              </p>
            </div>

            {/* Quick Macro Tickers */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 bg-slate-800/60 backdrop-blur-xs border border-emerald-700/30 p-2.5 rounded-lg text-xs">
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-mono block">Backbone Health</span>
                <span className="text-emerald-400 font-bold text-sm flex items-center gap-1">
                  <Activity className="w-3.5 h-3.5" /> {backbone.overallHealthScore}/100 ({backbone.healthTier})
                </span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-mono block">Price Pressure</span>
                <span className={`font-bold text-sm flex items-center gap-1 ${
                  indiaData.commodityPricePressureIndex.overallSignal === 'POSITIVE' ? 'text-emerald-400' :
                  indiaData.commodityPricePressureIndex.overallSignal === 'NEGATIVE' ? 'text-rose-400' : 'text-amber-400'
                }`}>
                  {indiaData.commodityPricePressureIndex.overallSignal === 'POSITIVE' ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                  {indiaData.commodityPricePressureIndex.overallSignal}
                </span>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <span className="text-slate-400 text-[10px] uppercase font-mono block">Daily APMC Inflow</span>
                <span className="text-cyan-300 font-bold text-sm">
                  {indiaData.apmcMarketsCoveredCount} Mandis Active
                </span>
              </div>
            </div>
          </div>

          {/* Module Navigation Tabs */}
          <div className="flex items-center gap-1 mt-6 overflow-x-auto pb-1 border-b border-emerald-800/60 no-scrollbar">
            <button
              onClick={() => setActiveModule('national')}
              className={`px-3.5 py-2 rounded-t-md text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeModule === 'national'
                  ? 'bg-white dark:bg-slate-900 text-emerald-900 dark:text-emerald-400 border-t-2 border-emerald-500 shadow-xs'
                  : 'text-emerald-200/80 hover:text-white hover:bg-emerald-800/40'
              }`}
            >
              <Globe2 className="w-3.5 h-3.5" />
              <span>National Overview & Backbone</span>
            </button>

            <button
              onClick={() => setActiveModule('commodity')}
              className={`px-3.5 py-2 rounded-t-md text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeModule === 'commodity'
                  ? 'bg-white dark:bg-slate-900 text-emerald-900 dark:text-emerald-400 border-t-2 border-emerald-500 shadow-xs'
                  : 'text-emerald-200/80 hover:text-white hover:bg-emerald-800/40'
              }`}
            >
              <Wheat className="w-3.5 h-3.5" />
              <span>Commodity National Profiles</span>
            </button>

            <button
              onClick={() => setActiveModule('district_state')}
              className={`px-3.5 py-2 rounded-t-md text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeModule === 'district_state'
                  ? 'bg-white dark:bg-slate-900 text-emerald-900 dark:text-emerald-400 border-t-2 border-emerald-500 shadow-xs'
                  : 'text-emerald-200/80 hover:text-white hover:bg-emerald-800/40'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>District & State Intelligence</span>
            </button>

            <button
              onClick={() => setActiveModule('early_warnings')}
              className={`px-3.5 py-2 rounded-t-md text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeModule === 'early_warnings'
                  ? 'bg-white dark:bg-slate-900 text-emerald-900 dark:text-emerald-400 border-t-2 border-emerald-500 shadow-xs'
                  : 'text-emerald-200/80 hover:text-white hover:bg-emerald-800/40'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-300" />
              <span>Early Warnings & Alerts</span>
              <span className="px-1.5 py-0.2 rounded-full bg-amber-500/30 text-amber-200 text-[10px] font-bold">
                {earlyWarnings.length}
              </span>
            </button>

            <button
              onClick={() => setActiveModule('exposure_hierarchy')}
              className={`px-3.5 py-2 rounded-t-md text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeModule === 'exposure_hierarchy'
                  ? 'bg-white dark:bg-slate-900 text-emerald-900 dark:text-emerald-400 border-t-2 border-emerald-500 shadow-xs'
                  : 'text-emerald-200/80 hover:text-white hover:bg-emerald-800/40'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Actuarial Exposure & Shock Propagation</span>
            </button>

            <button
              onClick={() => setActiveModule('economic_index')}
              className={`px-3.5 py-2 rounded-t-md text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeModule === 'economic_index'
                  ? 'bg-white dark:bg-slate-900 text-emerald-900 dark:text-emerald-400 border-t-2 border-emerald-500 shadow-xs'
                  : 'text-emerald-200/80 hover:text-white hover:bg-emerald-800/40'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Agricultural Economic Index</span>
            </button>

            <button
              onClick={() => setActiveModule('validation')}
              className={`px-3.5 py-2 rounded-t-md text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeModule === 'validation'
                  ? 'bg-white dark:bg-slate-900 text-emerald-900 dark:text-emerald-400 border-t-2 border-emerald-500 shadow-xs'
                  : 'text-emerald-200/80 hover:text-white hover:bg-emerald-800/40'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>Model Backtesting & Validation</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

        {/* ========================================== */}
        {/* TAB 1: NATIONAL OVERVIEW & BACKBONE        */}
        {/* ========================================== */}
        {activeModule === 'national' && (
          <div className="space-y-6">
            {/* Notice Bar */}
            <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-lg p-3.5 flex items-start gap-3 text-xs text-amber-900 dark:text-amber-200">
              <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold">{indiaData.scopeTitle}:</span> {indiaData.dataCoverageNotice}{' '}
                <span className="font-mono text-[11px] opacity-80">(Latest Observation: {indiaData.latestObservationDate})</span>
              </div>
            </div>

            {/* Backbone Indicator Grid */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                      {backbone.frameworkLabel}
                    </span>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                      {backbone.frameworkName}
                    </h2>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {backbone.takeawayMessage}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 uppercase font-mono block">Composite Resilience</span>
                    <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                      {backbone.overallHealthScore} <span className="text-xs font-normal text-slate-500">/ 100</span>
                    </span>
                  </div>
                  <div className="px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-xs font-bold text-emerald-800 dark:text-emerald-300">
                    {backbone.healthTier}
                  </div>
                </div>
              </div>

              {/* 9 Backbone Pillars Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 mt-4">
                {Object.entries(backbone.pillars).map(([key, pillar]) => (
                  <div 
                    key={key}
                    className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:border-emerald-500/40 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-semibold text-xs text-slate-800 dark:text-slate-200">
                        {pillar.pillarName}
                      </span>
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                        pillar.stabilityLevel === 'ROBUST' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                        pillar.stabilityLevel === 'ADEQUATE' ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300' :
                        'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      }`}>
                        {pillar.score}/100 &bull; {pillar.stabilityLevel}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed mb-2">
                      {pillar.keyObservation}
                    </p>
                    <div className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                      Source: {pillar.sourceAuthority}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* National Macro Pressures Suite */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* 1. Price Pressure */}
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider font-mono">
                    Price Pressure
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    Score: {indiaData.commodityPricePressureIndex.score}
                  </span>
                </div>
                <div className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                  {indiaData.commodityPricePressureIndex.label}
                </div>
                <div className="space-y-1 text-xs text-slate-600 dark:text-slate-400 mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 font-mono">
                  <div className="flex justify-between">
                    <span>Rising Commodities:</span>
                    <span className="font-bold text-emerald-600">{indiaData.commodityPricePressureIndex.risingCommoditiesCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Stable Commodities:</span>
                    <span className="font-bold text-slate-700 dark:text-slate-300">{indiaData.commodityPricePressureIndex.stableCommoditiesCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Falling Commodities:</span>
                    <span className="font-bold text-rose-600">{indiaData.commodityPricePressureIndex.fallingCommoditiesCount}</span>
                  </div>
                </div>
              </div>

              {/* 2. Supply Pressure */}
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider font-mono">
                    Supply Pressure
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300">
                    {indiaData.supplyPressureIndex.overallSignal}
                  </span>
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1 mt-2">
                  <div>
                    <span className="font-semibold text-rose-600 dark:text-rose-400">Shortage Pockets:</span>{' '}
                    {indiaData.supplyPressureIndex.shortageCommodities.join(', ')}
                  </div>
                  <div>
                    <span className="font-semibold text-amber-600 dark:text-amber-400">Market Gluts:</span>{' '}
                    {indiaData.supplyPressureIndex.glutCommodities.join(', ')}
                  </div>
                  <div>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">Balanced:</span>{' '}
                    {indiaData.supplyPressureIndex.balancedCommodities.join(', ')}
                  </div>
                </div>
              </div>

              {/* 3. Demand Pressure */}
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider font-mono">
                    Demand Pressure
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                    {indiaData.demandPressureIndex.overallSignal}
                  </span>
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1 mt-2">
                  <div>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">Strong Absorption:</span>{' '}
                    {indiaData.demandPressureIndex.strongDemandCommodities.join(', ')}
                  </div>
                  <div>
                    <span className="font-semibold text-slate-500">Sluggish Inflow:</span>{' '}
                    {indiaData.demandPressureIndex.sluggishDemandCommodities.join(', ')}
                  </div>
                </div>
              </div>

              {/* 4. Food Inflation & Farmer Income Pressure */}
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider font-mono">
                    Food Inflation & Gate Realization
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    Index: {indiaData.foodInflationPressureIndex.score}
                  </span>
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1 mt-2 font-mono">
                  <div className="flex justify-between">
                    <span>Vegetable Volatility:</span>
                    <span className="font-bold text-amber-600">{indiaData.foodInflationPressureIndex.vegetableInflationRisk}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pulse Inflation:</span>
                    <span className="font-bold text-blue-600">{indiaData.foodInflationPressureIndex.pulseInflationRisk}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>MSP Realization Ratio:</span>
                    <span className="font-bold text-emerald-600">{indiaData.farmerIncomeExposureIndex.mspSupportEffectivenessPercent}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================== */}
        {/* TAB 2: COMMODITY NATIONAL PROFILES         */}
        {/* ========================================== */}
        {activeModule === 'commodity' && (
          <div className="space-y-6">
            {/* Commodity Selector Bar */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 font-mono mb-1">
                    Select Commodity Profile (Universe of {FARMFIT_CROP_COMMODITY_MASTER.length}+ Crops)
                  </label>
                  <div className="flex items-center gap-2">
                    <select
                      value={currentCommodityId}
                      onChange={(e) => handleCommodityChange(e.target.value)}
                      className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-sm font-bold text-slate-900 dark:text-white cursor-pointer focus:ring-2 focus:ring-emerald-500"
                    >
                      {FARMFIT_CROP_COMMODITY_MASTER.map(c => (
                        <option key={c.cropId} value={c.cropId}>
                          {c.displayName} ({c.category})
                        </option>
                      ))}
                    </select>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      Official: <span className="font-mono text-slate-700 dark:text-slate-300">{commodityProfile.officialCommodityName}</span>
                    </span>
                  </div>
                </div>

                {/* Quick Stats Pill */}
                <div className="flex items-center gap-2 text-xs">
                  <div className="px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800">
                    <span className="text-slate-500 text-[10px] uppercase block">Current Modal Price</span>
                    <span className="font-bold text-emerald-700 dark:text-emerald-300 text-sm">
                      {commodityProfile.currentMarketCoverage.latestObservedModalPrice 
                        ? `₹${commodityProfile.currentMarketCoverage.latestObservedModalPrice.toLocaleString('en-IN')}/Qtl`
                        : 'DATA NOT AVAILABLE'}
                    </span>
                  </div>
                  <div className="px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <span className="text-slate-500 text-[10px] uppercase block">Price Pressure</span>
                    <span className={`font-bold text-sm ${
                      commodityProfile.currentMarketCoverage.pricePressure === 'POSITIVE' ? 'text-emerald-600' :
                      commodityProfile.currentMarketCoverage.pricePressure === 'NEGATIVE' ? 'text-rose-600' : 'text-amber-600'
                    }`}>
                      {commodityProfile.currentMarketCoverage.pricePressure}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Detailed Commodity Intelligence Profile Card */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column: Market & Price Intelligence */}
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono">
                    Market Coverage & Price Dynamics
                  </h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    AGMARKNET Data
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
                    <span className="text-slate-500">Active APMC Mandis:</span>
                    <span className="font-bold text-slate-900 dark:text-white">{commodityProfile.currentMarketCoverage.activeApmcCount}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
                    <span className="text-slate-500">Districts Covered:</span>
                    <span className="font-bold text-slate-900 dark:text-white">{commodityProfile.currentMarketCoverage.districtsCoveredCount}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
                    <span className="text-slate-500">States Covered:</span>
                    <span className="font-bold text-slate-900 dark:text-white">{commodityProfile.currentMarketCoverage.statesCoveredCount}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
                    <span className="text-slate-500">Latest Observed Price Date:</span>
                    <span className="font-bold text-slate-900 dark:text-white">{commodityProfile.currentMarketCoverage.latestPriceDate || 'Current Season'}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
                    <span className="text-slate-500">Wholesale Price Range (Min - Max):</span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {commodityProfile.currentMarketCoverage.priceRange 
                        ? `₹${commodityProfile.currentMarketCoverage.priceRange.min} - ₹${commodityProfile.currentMarketCoverage.priceRange.max}`
                        : 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
                    <span className="text-slate-500">CACP MSP Benchmark (2024-25):</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      {commodityProfile.mspBenchmark2024_25 ? `₹${commodityProfile.mspBenchmark2024_25}/Qtl` : 'Not Mandated (Commercial)'}
                    </span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500">Modal vs MSP Spread:</span>
                    <span className={`font-bold ${
                      (commodityProfile.mspSpreadPercent || 0) >= 0 ? 'text-emerald-600' : 'text-rose-600'
                    }`}>
                      {commodityProfile.mspSpreadPercent !== null ? `${commodityProfile.mspSpreadPercent > 0 ? '+' : ''}${commodityProfile.mspSpreadPercent}%` : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Middle Column: Production Geography (DES APY) */}
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono">
                    National Production Geography
                  </h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                    DES APY Data
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
                    <span className="text-slate-500">National Annual Production:</span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {commodityProfile.nationalAnnualProductionMetricTonnes 
                        ? `${(commodityProfile.nationalAnnualProductionMetricTonnes / 100000).toFixed(2)} Lakh MT`
                        : 'DES Advance Estimate Sourced'}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
                    <span className="text-slate-500">National Sown Acreage:</span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {commodityProfile.nationalAcreageHectares 
                        ? `${(commodityProfile.nationalAcreageHectares / 100000).toFixed(2)} Lakh Ha`
                        : 'DES Benchmark'}
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-2">
                    Major Producing States:
                  </span>
                  <div className="space-y-1.5">
                    {commodityProfile.majorProducingStates.map((st, i) => (
                      <div key={i} className="flex items-center justify-between text-xs p-2 rounded bg-slate-50 dark:bg-slate-800">
                        <span className="font-medium text-slate-800 dark:text-slate-200">{st.stateName}</span>
                        <span className="font-mono text-slate-600 dark:text-slate-400 font-bold">
                          {st.annualProductionTonnes ? `${(st.annualProductionTonnes / 100000).toFixed(1)}L MT` : 'Major Belt'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Actuarial Risk Profile */}
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono">
                    Commodity Risk & Sensitivity
                  </h3>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    commodityProfile.riskLevel === 'HIGH' ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300' :
                    commodityProfile.riskLevel === 'MODERATE' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' :
                    'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                  }`}>
                    {commodityProfile.compositeCommodityRiskScore}/100 &bull; {commodityProfile.riskLevel}
                  </span>
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                    Observed Risk Dimensions:
                  </span>
                  <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                    {commodityProfile.topRiskFactors.map((f, i) => (
                      <li key={i} className="flex items-start gap-2 bg-slate-50 dark:bg-slate-800 p-2 rounded">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 space-y-1 font-mono">
                  <div className="flex justify-between">
                    <span>Data Freshness:</span>
                    <span className="text-slate-700 dark:text-slate-300 font-bold">{commodityProfile.dataFreshnessTier}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Model Confidence:</span>
                    <span className="text-emerald-600 font-bold">{commodityProfile.confidenceScore}% ({commodityProfile.confidenceTier})</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================== */}
        {/* TAB 3: DISTRICT & STATE INTELLIGENCE       */}
        {/* ========================================== */}
        {activeModule === 'district_state' && (
          <div className="space-y-6">
            {/* Location Selector */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 font-mono mb-1">
                      Select State
                    </label>
                    <select
                      value={selectedState}
                      onChange={(e) => {
                        setSelectedState(e.target.value);
                        const s = ALL_INDIAN_STATES.find(item => item.name === e.target.value);
                        if (s && s.districts.length > 0) {
                          setSelectedDistrict(s.districts[0].name);
                        }
                      }}
                      className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-sm font-bold text-slate-900 dark:text-white cursor-pointer"
                    >
                      {ALL_INDIAN_STATES.map(s => (
                        <option key={s.code} value={s.name}>{s.name} ({s.code})</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 font-mono mb-1">
                      Select District
                    </label>
                    <select
                      value={selectedDistrict}
                      onChange={(e) => setSelectedDistrict(e.target.value)}
                      className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-sm font-bold text-slate-900 dark:text-white cursor-pointer"
                    >
                      {currentDistricts.map(d => (
                        <option key={d.id} value={d.name}>{d.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="text-right text-xs">
                  <span className="text-slate-500 block uppercase font-mono text-[10px]">District Coverage</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    {districtProfile.dataCoverage} ({districtProfile.totalObservationsRecorded} Bulletin Records)
                  </span>
                </div>
              </div>
            </div>

            {/* Profile Overview: State & District Dual Panes */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* District Profile */}
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                  <div>
                    <span className="text-[10px] font-bold text-emerald-600 uppercase font-mono block">District Profile</span>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {districtProfile.districtName}, {districtProfile.stateName}
                    </h3>
                  </div>
                  <span className="px-2 py-1 rounded text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {districtProfile.agroZoneName}
                  </span>
                </div>

                {/* Major Commodities Table */}
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono block mb-2">
                    Major District Commodities (Production & Mandi Prices)
                  </span>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase font-mono text-[10px]">
                        <tr>
                          <th className="p-2">Commodity</th>
                          <th className="p-2">Category</th>
                          <th className="p-2 text-right">Modal Price</th>
                          <th className="p-2 text-center">Pressure</th>
                          <th className="p-2 text-right">Risk</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {districtProfile.majorCommodities.slice(0, 6).map((c, i) => (
                          <tr key={i} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                            <td className="p-2 font-semibold text-slate-900 dark:text-white">{c.cropName}</td>
                            <td className="p-2 text-slate-500">{c.category}</td>
                            <td className="p-2 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">
                              {c.latestModalPriceInrQtl ? `₹${c.latestModalPriceInrQtl}` : 'N/A'}
                            </td>
                            <td className="p-2 text-center">
                              <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                c.pricePressure === 'POSITIVE' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                                c.pricePressure === 'NEGATIVE' ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300' :
                                'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                              }`}>
                                {c.pricePressure}
                              </span>
                            </td>
                            <td className="p-2 text-right font-mono">{c.riskScore}/100</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* District Risk Breakdown */}
                <div className="grid grid-cols-3 gap-2 text-xs pt-3 border-t border-slate-100 dark:border-slate-800 font-mono">
                  <div className="p-2 rounded bg-slate-50 dark:bg-slate-800 text-center">
                    <span className="text-slate-400 text-[10px] block">Weather Risk</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{districtProfile.aggregateWeatherRiskScore}/100</span>
                  </div>
                  <div className="p-2 rounded bg-slate-50 dark:bg-slate-800 text-center">
                    <span className="text-slate-400 text-[10px] block">Water Stress</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{districtProfile.aggregateWaterStressScore}/100</span>
                  </div>
                  <div className="p-2 rounded bg-slate-50 dark:bg-slate-800 text-center">
                    <span className="text-slate-400 text-[10px] block">Logistics Friction</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{districtProfile.aggregateLogisticsFrictionScore}/100</span>
                  </div>
                </div>
              </div>

              {/* State Profile */}
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                  <div>
                    <span className="text-[10px] font-bold text-blue-600 uppercase font-mono block">State Aggregation</span>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {stateProfile.stateName} ({stateProfile.stateCode})
                    </h3>
                  </div>
                  <span className="px-2 py-1 rounded text-xs font-bold bg-blue-50 dark:bg-blue-950 text-blue-800 dark:text-blue-300">
                    Capital: {stateProfile.capital}
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
                    <span className="text-slate-500">Districts Covered:</span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {stateProfile.districtsWithDataCount} / {stateProfile.totalDistrictsCount} ({stateProfile.dataCoveragePercent}%)
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
                    <span className="text-slate-500">Registered APMC Mandis:</span>
                    <span className="font-bold text-slate-900 dark:text-white">{stateProfile.totalRegisteredAPMCs}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
                    <span className="text-slate-500">State Irrigation Coverage:</span>
                    <span className="font-bold text-slate-900 dark:text-white">{stateProfile.stateIrrigationCoveragePercent}%</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
                    <span className="text-slate-500">Composite State Risk Score:</span>
                    <span className="font-bold text-amber-600 dark:text-amber-400">
                      {stateProfile.compositeStateRiskScore}/100 ({stateProfile.stateRiskLevel})
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono block mb-2">
                    Top Producing Districts in {stateProfile.stateName}
                  </span>
                  <div className="space-y-1.5">
                    {stateProfile.topProducingDistricts.map((d, i) => (
                      <div key={i} className="flex items-center justify-between text-xs p-2 rounded bg-slate-50 dark:bg-slate-800">
                        <div>
                          <span className="font-bold text-slate-900 dark:text-white">{d.districtName}</span>
                          <span className="text-[11px] text-slate-500 block">Dominant: {d.dominantCrops.join(', ')}</span>
                        </div>
                        <span className="font-mono text-xs font-bold text-slate-700 dark:text-slate-300">
                          Risk: {d.riskScore}/100
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================== */}
        {/* TAB 4: EARLY WARNINGS & ALERTS            */}
        {/* ========================================== */}
        {activeModule === 'early_warnings' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-500" />
                  <span>FARMFIT Agricultural Early Warning System</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Automated empirical alerts triggered when wholesale market deviations, rainfall anomalies, or input cost shocks breach actuarial thresholds.
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                {earlyWarnings.length} Active System Alerts
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {earlyWarnings.map(alert => (
                <div 
                  key={alert.alertId}
                  className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-3 flex flex-col justify-between hover:border-amber-500/50 transition-colors"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        alert.severity === 'CRITICAL' ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300' :
                        alert.severity === 'HIGH' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' :
                        'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                      }`}>
                        {alert.severity} &bull; {alert.alertType}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">{alert.dateTriggered}</span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-snug mb-2">
                      {alert.headline}
                    </h3>

                    <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                      <div>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">Geography:</span> {alert.geography}
                      </div>
                      <div>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">Observed Driver:</span> {alert.driver}
                      </div>
                      <div className="p-2 rounded bg-slate-50 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 text-[11px]">
                        <span className="font-semibold text-slate-700 dark:text-slate-300">Evidence:</span> {alert.evidence}
                      </div>
                      <div className="text-[11px]">
                        <span className="font-semibold text-slate-700 dark:text-slate-300">Exposure:</span> {alert.affectedPopulationOrMetric}
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] space-y-1.5">
                    <div className="p-2 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800">
                      <span className="font-bold block text-[10px] uppercase font-mono">Recommended Immediate Action</span>
                      {alert.recommendedImmediateAction}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono flex justify-between">
                      <span>Source: {alert.dataSource}</span>
                      <span>Confidence: {alert.confidenceScore}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================== */}
        {/* TAB 5: ACTUARIAL EXPOSURE & SHOCK ENGINE   */}
        {/* ========================================== */}
        {activeModule === 'exposure_hierarchy' && (
          <div className="space-y-6">
            {/* Stakeholder Selector */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 font-mono mb-1">
                    Select Exposure Hierarchy Stakeholder Perspective
                  </label>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <button
                      onClick={() => setActiveStakeholder('INDIVIDUAL_FARMER')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer ${
                        activeStakeholder === 'INDIVIDUAL_FARMER'
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                      }`}
                    >
                      <Users className="w-3.5 h-3.5" />
                      <span>Individual Farmer</span>
                    </button>
                    <button
                      onClick={() => setActiveStakeholder('FPO')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer ${
                        activeStakeholder === 'FPO'
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                      }`}
                    >
                      <Building2 className="w-3.5 h-3.5" />
                      <span>FPO Collective</span>
                    </button>
                    <button
                      onClick={() => setActiveStakeholder('CORPORATE_B2B')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer ${
                        activeStakeholder === 'CORPORATE_B2B'
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                      }`}
                    >
                      <Briefcase className="w-3.5 h-3.5" />
                      <span>B2B Agribusiness</span>
                    </button>
                    <button
                      onClick={() => setActiveStakeholder('GOVERNMENT_INSTITUTION')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer ${
                        activeStakeholder === 'GOVERNMENT_INSTITUTION'
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                      }`}
                    >
                      <Landmark className="w-3.5 h-3.5" />
                      <span>Government & Policy</span>
                    </button>
                  </div>
                </div>

                <div className="text-right text-xs">
                  <span className="text-slate-500 block uppercase font-mono text-[10px]">Unified Intelligence Core</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    {exposureAssessment.derivedLabel}
                  </span>
                </div>
              </div>
            </div>

            {/* Dynamic Stakeholder Exposure Dashboard */}
            {activeStakeholder === 'INDIVIDUAL_FARMER' && (
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono flex items-center gap-2">
                    <Users className="w-4 h-4 text-emerald-600" />
                    <span>Farmer Income Exposure Model (FarmerIncomeExposure)</span>
                  </h3>
                  <span className="px-2 py-0.5 rounded text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    Status: {farmerIncomeExp.calculationStatus}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <span className="text-slate-500 uppercase text-[10px] font-mono block">Estimated Gross Revenue (4 Acres)</span>
                    <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                      ₹{farmerIncomeExp.totalExpectedGrossRevenueInr?.toLocaleString('en-IN') || 'N/A'}
                    </span>
                  </div>
                  <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <span className="text-slate-500 uppercase text-[10px] font-mono block">Estimated Input Cost (A2+FL)</span>
                    <span className="text-xl font-bold text-slate-700 dark:text-slate-300">
                      ₹{farmerIncomeExp.totalEstimatedInputCostInr?.toLocaleString('en-IN') || 'N/A'}
                    </span>
                  </div>
                  <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <span className="text-slate-500 uppercase text-[10px] font-mono block">Projected Net Farm Income</span>
                    <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                      ₹{farmerIncomeExp.totalEstimatedNetIncomeInr?.toLocaleString('en-IN') || 'N/A'}
                    </span>
                  </div>
                </div>

                <div className="p-3.5 rounded-lg bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-xs">
                  <span className="font-bold text-emerald-900 dark:text-emerald-300 block mb-1">
                    ICAR / CACP Recommended Income Resilience Mitigations:
                  </span>
                  <ul className="list-disc list-inside space-y-1 text-emerald-800 dark:text-emerald-200">
                    {farmerIncomeExp.keyMitigations.map((m, i) => (
                      <li key={i}>{m}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {activeStakeholder === 'FPO' && (
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono">
                      {fpoExp.fpoName}
                    </h3>
                    <span className="text-xs text-slate-500">
                      {fpoExp.memberFarmerCount} Farmer Members &bull; {fpoExp.coveredVillagesCount} Villages &bull; {fpoExp.totalAggregatedAcres} Aggregated Acres
                    </span>
                  </div>
                  <span className="px-2.5 py-1 rounded text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    FPO Health Score: {fpoExp.overallFpoHealthScore}/100
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase font-mono text-[10px]">
                      <tr>
                        <th className="p-2">Crop Portfolio</th>
                        <th className="p-2 text-right">Acreage</th>
                        <th className="p-2 text-right">Expected Production</th>
                        <th className="p-2 text-right">Contracted B2B</th>
                        <th className="p-2 text-right">Open Market Exposure</th>
                        <th className="p-2 text-right">Projected Turnover</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {fpoExp.cropPortfolios.map((cp, i) => (
                        <tr key={i}>
                          <td className="p-2 font-semibold text-slate-900 dark:text-white">{cp.cropName}</td>
                          <td className="p-2 text-right font-mono">{cp.acreage} Acres</td>
                          <td className="p-2 text-right font-mono">{cp.expectedProductionMetricTonnes} MT</td>
                          <td className="p-2 text-right font-mono text-blue-600 font-bold">{cp.contractedCorporateQuantityTonnes} MT</td>
                          <td className="p-2 text-right font-mono text-amber-600 font-bold">{cp.openMarketExposureTonnes} MT</td>
                          <td className="p-2 text-right font-mono font-bold text-emerald-600">₹{cp.projectedTotalTurnoverInrCrores} Cr</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeStakeholder === 'CORPORATE_B2B' && (
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono">
                      {corporateExp.companyName}
                    </h3>
                    <span className="text-xs text-slate-500">Sector: {corporateExp.industrySector}</span>
                  </div>
                  <span className="px-2.5 py-1 rounded text-xs font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                    Procurement Portfolio: ₹{corporateExp.aggregateProcurementValueInrCrores} Crores
                  </span>
                </div>

                <div className="space-y-3">
                  {corporateExp.activeRequirements.map(req => (
                    <div key={req.requirementId} className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-bold text-slate-900 dark:text-white">{req.commodityName}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                          Target: {req.targetQuantityMetricTonnes.toLocaleString('en-IN')} MT
                        </span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono mt-2">
                        <div>
                          <span className="text-slate-400 block">Target Price:</span>
                          <span className="font-bold text-slate-800 dark:text-slate-200">₹{req.targetPriceInrQtl}/Qtl</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block">Mandi Modal Price:</span>
                          <span className="font-bold text-emerald-600">₹{req.currentMarketModalPriceInrQtl}/Qtl</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block">Price Variance:</span>
                          <span className={`font-bold ${req.priceVariancePercent && req.priceVariancePercent > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                            {req.priceVariancePercent ? `${req.priceVariancePercent > 0 ? '+' : ''}${req.priceVariancePercent}%` : '0%'}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 block">Supply Coverage:</span>
                          <span className="font-bold text-blue-600">{req.supplyCoverageRatio}x Target</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeStakeholder === 'GOVERNMENT_INSTITUTION' && (
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono">
                    Government Strategic Agricultural Review ({govtIntel.reportingCycle})
                  </h3>
                  <span className="px-2.5 py-1 rounded text-xs font-bold bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300">
                    {govtIntel.districtsAtHighPriceStressCount} Districts at Price Stress
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <span className="font-bold text-slate-700 dark:text-slate-300 block">
                    Recommended Policy Interventions:
                  </span>
                  {govtIntel.recommendedInterventions.map((rec, i) => (
                    <div key={i} className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-slate-900 dark:text-white">{rec.sector}</span>
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                          Tier: {rec.tier}
                        </span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-400 text-xs">{rec.description}</p>
                      <div className="text-[10px] text-slate-400 font-mono mt-1">Target Area: {rec.targetedGeography}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Shock Propagation Simulation Pipeline */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 gap-2">
                <div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border border-purple-300 dark:border-purple-800">
                    {shockPropagation.modelNotice}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                    Multi-Layer Shock Propagation Engine
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Simulate how an exogenous weather or diesel price anomaly cascades through Physical Weather &rarr; Yield &rarr; APMC Mandi &rarr; Farmer NRV &rarr; FPO &rarr; B2B &rarr; Regional GDP.
                  </p>
                </div>
              </div>

              {/* Shock Parameter Sliders */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs">
                <div>
                  <label className="font-semibold block mb-1 text-slate-700 dark:text-slate-300">
                    Monsoon Rainfall Deficit/Surplus: <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">{shockInput.monsoonRainfallDeviationPercent}%</span>
                  </label>
                  <input
                    type="range"
                    min="-50"
                    max="50"
                    step="5"
                    value={shockInput.monsoonRainfallDeviationPercent}
                    onChange={(e) => setShockInput(prev => ({ ...prev, monsoonRainfallDeviationPercent: Number(e.target.value) }))}
                    className="w-full cursor-pointer accent-emerald-600"
                  />
                </div>

                <div>
                  <label className="font-semibold block mb-1 text-slate-700 dark:text-slate-300">
                    Diesel Fuel Hike: <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">+{shockInput.fuelDieselPriceHikePercent}%</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="40"
                    step="2"
                    value={shockInput.fuelDieselPriceHikePercent}
                    onChange={(e) => setShockInput(prev => ({ ...prev, fuelDieselPriceHikePercent: Number(e.target.value) }))}
                    className="w-full cursor-pointer accent-emerald-600"
                  />
                </div>

                <div>
                  <label className="font-semibold block mb-1 text-slate-700 dark:text-slate-300">
                    Mandi Arrival Surge/Drop: <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">{shockInput.mandiArrivalSurgePercent}%</span>
                  </label>
                  <input
                    type="range"
                    min="-40"
                    max="40"
                    step="5"
                    value={shockInput.mandiArrivalSurgePercent}
                    onChange={(e) => setShockInput(prev => ({ ...prev, mandiArrivalSurgePercent: Number(e.target.value) }))}
                    className="w-full cursor-pointer accent-emerald-600"
                  />
                </div>

                <div>
                  <label className="font-semibold block mb-1 text-slate-700 dark:text-slate-300">
                    Export Duty / Tariff Shift: <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">{shockInput.exportDutyOrTariffChangePercent}%</span>
                  </label>
                  <input
                    type="range"
                    min="-20"
                    max="40"
                    step="5"
                    value={shockInput.exportDutyOrTariffChangePercent}
                    onChange={(e) => setShockInput(prev => ({ ...prev, exportDutyOrTariffChangePercent: Number(e.target.value) }))}
                    className="w-full cursor-pointer accent-emerald-600"
                  />
                </div>
              </div>

              {/* Propagation Chain Visualization */}
              <div className="space-y-2 pt-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono block">
                  Cascading Shock Impact Across 7 Structural Layers:
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2.5">
                  {shockPropagation.propagationPath.map(step => (
                    <div 
                      key={step.step}
                      className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                        <span>Layer {step.step}: {step.layer}</span>
                        <span className={`font-bold ${
                          step.magnitudePercent > 0 ? 'text-emerald-600' : step.magnitudePercent < 0 ? 'text-rose-600' : 'text-slate-500'
                        }`}>
                          {step.magnitudePercent > 0 ? '+' : ''}{step.magnitudePercent}%
                        </span>
                      </div>
                      <div className="font-bold text-slate-900 dark:text-white text-xs">{step.affectedEntity}</div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug">{step.impactDescription}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================== */}
        {/* TAB 6: AGRICULTURAL ECONOMIC INDEX         */}
        {/* ========================================== */}
        {activeModule === 'economic_index' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 border border-blue-300 dark:border-blue-800">
                      {economicIndex.frameworkStatus}
                    </span>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                      {economicIndex.frameworkName}
                    </h2>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {economicIndex.reproducibilityStandard}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 uppercase font-mono block">Composite Index Score</span>
                    <span className="text-2xl font-black text-blue-600 dark:text-blue-400">
                      {economicIndex.compositeIndexScore} <span className="text-xs font-normal text-slate-500">/ 100</span>
                    </span>
                  </div>
                  <div className="px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-xs font-bold text-blue-800 dark:text-blue-300">
                    {economicIndex.compositeState}
                  </div>
                </div>
              </div>

              {/* 12 Measurable Dimensions Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase font-mono text-[10px]">
                    <tr>
                      <th className="p-2.5">Dimension</th>
                      <th className="p-2.5 text-center">Weight</th>
                      <th className="p-2.5 text-center">Score</th>
                      <th className="p-2.5 text-center">Trend</th>
                      <th className="p-2.5">Primary Statutory Data Source</th>
                      <th className="p-2.5">Coverage & Methodology</th>
                      <th className="p-2.5 text-center">Confidence</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {Object.entries(economicIndex.components).map(([key, comp]) => (
                      <tr key={key} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                        <td className="p-2.5 font-bold text-slate-900 dark:text-white">{comp.name}</td>
                        <td className="p-2.5 text-center font-mono font-semibold">{(comp.weight * 100).toFixed(0)}%</td>
                        <td className="p-2.5 text-center font-mono font-bold text-blue-600 dark:text-blue-400">{comp.score}/100</td>
                        <td className="p-2.5 text-center">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            comp.trend === 'EXPANDING' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                            comp.trend === 'STABLE' ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300' :
                            'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          }`}>
                            {comp.trend}
                          </span>
                        </td>
                        <td className="p-2.5 text-slate-600 dark:text-slate-400 text-[11px]">{comp.dataSource}</td>
                        <td className="p-2.5 text-slate-500 text-[11px]">{comp.coverageDescription}</td>
                        <td className="p-2.5 text-center">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                            {comp.confidenceTier}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================== */}
        {/* TAB 7: HISTORICAL MODEL BACKTESTING        */}
        {/* ========================================== */}
        {activeModule === 'validation' && (
          <FarmfitValidationView language={language} />
        )}
      </div>
    </div>
  );
};
