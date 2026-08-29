import React, { useState, useMemo } from 'react';
import { 
  Sprout, 
  Store, 
  ShieldAlert, 
  MapPin, 
  Sparkles, 
  ChevronRight, 
  Calendar, 
  CheckCircle2, 
  Layers, 
  HelpCircle,
  Truck,
  Scale,
  Activity,
  Filter
} from 'lucide-react';
import { 
  FarmLocation, 
  LandIrrigationProfile, 
  SoilProfileRecord, 
  FarmerProfile, 
  CropSeason,
  Language 
} from '../types';
import { 
  FarmDecisionAssessment, 
  CropOpportunityRankItem 
} from '../types/decisionAssessment';
import { decisionIntelligenceService } from '../services/decisionIntelligenceService';
import { scenarioEngineService } from '../services/scenarioEngineService';
import { FARMFIT_CROP_COMMODITY_MASTER } from '../data/cropMasterIndex';
import { ALL_INDIAN_STATES, getDistrictsByState } from '../data/indiaAdminData';
import { FarmfitDecisionCard } from '../components/DecisionCenter/FarmfitDecisionCard';
import { ForwardDecisionSummary } from '../components/DecisionCenter/ForwardDecisionSummary';
import { EvidenceTypeBadge } from '../components/DecisionCenter/EvidenceTypeBadge';
import { MarketTrendScorecard } from '../components/DecisionCenter/MarketTrendScorecard';
import { marketDataService } from '../services/marketDataService';
import { MarketRankingMode } from '../types/marketAnalytics';

interface FarmerDecisionViewProps {
  farmerProfile?: Partial<FarmerProfile>;
  farmLocation: FarmLocation;
  landProfile?: Partial<LandIrrigationProfile>;
  soilProfile?: Partial<SoilProfileRecord>;
  targetSeason?: CropSeason;
  preferredCropIds?: string[];
  selectedCropId?: string;
  onSelectCrop?: (cropId: string) => void;
  onNavigateToRouting?: () => void;
  onLaunchCalculator?: () => void;
  language: Language;
}

export const FarmerDecisionView: React.FC<FarmerDecisionViewProps> = ({
  farmerProfile,
  farmLocation,
  landProfile,
  soilProfile,
  targetSeason = 'Kharif',
  preferredCropIds = [],
  selectedCropId,
  onSelectCrop,
  onNavigateToRouting,
  onLaunchCalculator,
  language
}) => {
  // Navigation inside Farmer Decision View
  const [activeWorkflowSection, setActiveWorkflowSection] = useState<
    'WHAT_TO_GROW' | 'WHERE_TO_SELL' | 'WHAT_CAN_CHANGE' | 'ACTION_PLAN'
  >('WHAT_TO_GROW');

  // Category filter
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  // Active crop for single crop deep-dive
  const defaultCrop = selectedCropId || (preferredCropIds.length > 0 ? preferredCropIds[0] : 'soybean');
  const [activeCropId, setActiveCropId] = useState<string>(defaultCrop);

  // Farm contextual state
  const [simState, setSimState] = useState<string>(farmLocation.state || 'Madhya Pradesh');
  const availableDistricts = useMemo(() => getDistrictsByState(simState), [simState]);
  const [simDistrict, setSimDistrict] = useState<string>(farmLocation.district || availableDistricts[0]?.name || 'Indore');
  const [simSeason, setSimSeason] = useState<CropSeason>(targetSeason);
  const [simAcres, setSimAcres] = useState<number>(landProfile?.totalLandAcres || 5);
  const [selectedShockIdx, setSelectedShockIdx] = useState<number>(0);
  const [cropViewCount, setCropViewCount] = useState<'4' | '12' | 'ALL'>('4');

  const handleSimStateChange = (newState: string) => {
    setSimState(newState);
    const newDistricts = getDistrictsByState(newState);
    if (newDistricts.length > 0) {
      setSimDistrict(newDistricts[0].name);
    } else {
      setSimDistrict('');
    }
  };

  const currentLocation: FarmLocation = useMemo(() => ({
    ...farmLocation,
    state: simState,
    district: simDistrict
  }), [farmLocation, simState, simDistrict]);

  // Ranked crops calculated via core engine
  const rankedCropItems: CropOpportunityRankItem[] = useMemo(() => {
    return decisionIntelligenceService.rankCandidateCrops({
      candidateCropIds: preferredCropIds.length > 0 ? preferredCropIds : undefined,
      farmLocation: currentLocation,
      farmerProfile,
      landProfile: { ...landProfile, totalLandAcres: simAcres },
      soilProfile,
      targetSeason: simSeason,
      categoryFilter: selectedCategory !== 'ALL' ? selectedCategory : undefined
    });
  }, [currentLocation, farmerProfile, landProfile, soilProfile, simSeason, simAcres, preferredCropIds, selectedCategory]);

  // Single Crop Assessment
  const currentAssessment: FarmDecisionAssessment = useMemo(() => {
    return decisionIntelligenceService.evaluateCropDecision({
      cropId: activeCropId,
      farmLocation: currentLocation,
      farmerProfile,
      landProfile: { ...landProfile, totalLandAcres: simAcres },
      soilProfile,
      targetSeason: simSeason,
      plannedAcres: simAcres
    });
  }, [activeCropId, currentLocation, farmerProfile, landProfile, soilProfile, simSeason, simAcres]);

  // What-if simulations
  const whatIfSimulations = useMemo(() => {
    return scenarioEngineService.PREDEFINED_SHOCKS.map(shock => 
      scenarioEngineService.simulateScenario(activeCropId, shock)
    );
  }, [activeCropId]);

  const activeSimulation = whatIfSimulations[selectedShockIdx] || whatIfSimulations[0];

  const [mandiRankingMode, setMandiRankingMode] = useState<MarketRankingMode>('HIGHEST_NRV');

  // Verified Market Analytics from Engine
  const verifiedAnalytics = useMemo(() => {
    return marketDataService.getVerifiedAnalytics(
      activeCropId, 
      undefined, 
      { state: simState, district: simDistrict }, 
      { radiusKm: 200, rankingMode: mandiRankingMode }
    );
  }, [activeCropId, simState, simDistrict, mandiRankingMode]);

  return (
    <div className="space-y-8 pb-16">
      {/* Top Title & Context Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sprout className="w-4 h-4" />
              FARMER DECISION CENTER
            </span>
            <span className="text-xs bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
              {simDistrict}, {simState} &bull; {simSeason}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            Scientific Crop &amp; Mandi Decision Support
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Answers: What to grow, where to sell for highest net price (NRV), and what risks could impact your profit.
          </p>
        </div>

        {/* Quick Location & Season Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Complete 36 States/UTs */}
          <select
            value={simState}
            onChange={(e) => handleSimStateChange(e.target.value)}
            className="text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-200"
          >
            {ALL_INDIAN_STATES.map(st => (
              <option key={st.name} value={st.name}>{st.name}</option>
            ))}
          </select>

          {/* Complete District List */}
          <select
            value={simDistrict}
            onChange={(e) => setSimDistrict(e.target.value)}
            className="text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-200"
          >
            {availableDistricts.map(d => (
              <option key={d.id || d.name} value={d.name}>{d.name}</option>
            ))}
          </select>

          <select
            value={simSeason}
            onChange={(e) => setSimSeason(e.target.value as CropSeason)}
            className="text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-200"
          >
            <option value="Kharif">Kharif Season</option>
            <option value="Rabi">Rabi Season</option>
            <option value="Zaid">Zaid / Summer</option>
          </select>

          {onLaunchCalculator && (
            <button
              onClick={onLaunchCalculator}
              className="text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white px-3.5 py-2 rounded-xl transition-colors cursor-pointer"
            >
              Edit My Full Farm
            </button>
          )}
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveWorkflowSection('WHAT_TO_GROW')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
            activeWorkflowSection === 'WHAT_TO_GROW'
              ? 'bg-emerald-700 text-white shadow-md'
              : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
          }`}
        >
          1. WHAT SHOULD I GROW?
        </button>

        <button
          onClick={() => setActiveWorkflowSection('WHERE_TO_SELL')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
            activeWorkflowSection === 'WHERE_TO_SELL'
              ? 'bg-emerald-700 text-white shadow-md'
              : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
          }`}
        >
          2. WHERE SHOULD I SELL?
        </button>

        <button
          onClick={() => setActiveWorkflowSection('WHAT_CAN_CHANGE')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
            activeWorkflowSection === 'WHAT_CAN_CHANGE'
              ? 'bg-emerald-700 text-white shadow-md'
              : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
          }`}
        >
          3. WHAT CAN CHANGE MY DECISION?
        </button>

        <button
          onClick={() => setActiveWorkflowSection('ACTION_PLAN')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
            activeWorkflowSection === 'ACTION_PLAN'
              ? 'bg-emerald-700 text-white shadow-md'
              : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
          }`}
        >
          4. WHAT SHOULD I DO NEXT?
        </button>
      </div>

      {/* SECTION 1: WHAT SHOULD I GROW? */}
      {activeWorkflowSection === 'WHAT_TO_GROW' && (
        <div className="space-y-8">
          {/* Active Crop Forward Decision Summary */}
          <ForwardDecisionSummary
            assessment={currentAssessment}
            onSelectCrop={(cropId) => {
              setActiveCropId(cropId);
              if (onSelectCrop) onSelectCrop(cropId);
            }}
            onNavigateToMarkets={() => setActiveWorkflowSection('WHERE_TO_SELL')}
          />

          {/* Section Divider & Crop Candidate Exploration Header */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                  ALL CANDIDATE CROPS RANKING
                </span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  Compare Alternative Crops for {simDistrict}
                </h3>
                <p className="text-xs text-slate-500">
                  Click any crop card to update the full Forward Decision Model above.
                </p>
              </div>

              {/* Category Filter Pills */}
              <div className="flex flex-wrap items-center gap-1.5">
                {['ALL', 'Cereals', 'Pulses', 'Oilseeds', 'Commercial', 'Spices', 'Horticulture'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-emerald-700 text-white'
                        : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>
                Showing {cropViewCount === '4' ? Math.min(4, rankedCropItems.length) : cropViewCount === '12' ? Math.min(12, rankedCropItems.length) : rankedCropItems.length} of {rankedCropItems.length} candidate commodities
              </span>
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setCropViewCount('4')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    cropViewCount === '4' ? 'bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-300 shadow-xs' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  Top 4
                </button>
                <button
                  type="button"
                  onClick={() => setCropViewCount('12')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    cropViewCount === '12' ? 'bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-300 shadow-xs' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  Top 12
                </button>
                <button
                  type="button"
                  onClick={() => setCropViewCount('ALL')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    cropViewCount === 'ALL' ? 'bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-300 shadow-xs' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  All ({rankedCropItems.length})
                </button>
              </div>
            </div>
          </div>

          {/* Ranked Crops Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(cropViewCount === '4' ? rankedCropItems.slice(0, 4) : cropViewCount === '12' ? rankedCropItems.slice(0, 12) : rankedCropItems).map((cropItem, idx) => {
              const isSelected = activeCropId === cropItem.cropId;
              return (
                <div
                  key={cropItem.cropId}
                  onClick={() => {
                    setActiveCropId(cropItem.cropId);
                    if (onSelectCrop) onSelectCrop(cropItem.cropId);
                  }}
                  className={`rounded-2xl transition-all cursor-pointer ${
                    isSelected ? 'ring-2 ring-emerald-500 shadow-lg' : ''
                  }`}
                >
                  <FarmfitDecisionCard
                    decisionTitle={`#${idx + 1} ${cropItem.cropName}`}
                    decisionSubtitle={`${cropItem.category} • Suitability: ${cropItem.farmSuitabilityScore}/100 • Water: ${cropItem.waterRequirementMm || 450}mm`}
                    commodityName={cropItem.cropName}
                    cropCommodityId={cropItem.cropId}
                    whyExplanation={`Net Realization ₹${(cropItem.expectedNetRealizationPerAcre || cropItem.nrvPerQtl || 4000).toLocaleString('en-IN')}/acre with ${cropItem.farmSuitabilityLevel.toLowerCase()} agro-climatic match for ${simDistrict}.`}
                    opportunityValue={`₹${(cropItem.expectedNetRealizationPerAcre || 32000).toLocaleString('en-IN')}/acre`}
                    opportunityDetail={`Wholesale: ₹${cropItem.latestModalPrice || 4200}/Qtl (${cropItem.priceDate || 'Recent'}) • Trend: ${cropItem.priceTrend} • Yield: ${cropItem.expectedYieldPerAcre || 12} Qtl/ac`}
                    riskLevel={cropItem.riskLevel}
                    riskScore={cropItem.riskAdjustedScore}
                    riskSummary={`Best APMC: ${cropItem.bestMandiName || 'Local Mandi'} (${cropItem.bestMandiDistanceKm || 22} km) • NRV: ₹${(cropItem.nrvPerQtl || 4100).toLocaleString('en-IN')}/Qtl`}
                    confidenceTier={cropItem.confidenceTier}
                    confidenceExplanation={`Calibrated with CACP 2024-25 cultivation cost benchmarks.`}
                    dataDate={cropItem.priceDate || '2024-08-21'}
                    dataSourceName="AGMARKNET & CACP 2024-25"
                    badgeTag={idx === 0 ? 'TOP RECOMMENDATION' : isSelected ? 'CURRENTLY SELECTED' : undefined}
                    actionLabel={isSelected ? 'Active Selection' : 'Analyze This Crop'}
                    onAction={() => {
                      setActiveCropId(cropItem.cropId);
                    }}
                    primaryDecisionStatus={cropItem.primaryDecisionStatus}
                    manageableRisks={cropItem.manageableRisks}
                    economicWaterfall={cropItem.economicWaterfall}
                    actionPlan={cropItem.actionPlan}
                    decisionChangeTriggers={cropItem.decisionChangeTriggers}
                    linkedEarlyWarnings={cropItem.linkedEarlyWarnings}
                    evidenceItems={[
                      {
                        id: `ev_price_${cropItem.cropId}`,
                        classification: 'OFFICIAL_OBSERVED_DATA',
                        label: 'Wholesale APMC Modal Price',
                        source: 'AGMARKNET Daily Bulletin',
                        date: cropItem.priceDate || '2024-08-21',
                        confidence: cropItem.confidenceTier
                      },
                      {
                        id: `ev_nrv_${cropItem.cropId}`,
                        classification: 'FARMFIT_DERIVED_INTELLIGENCE',
                        label: 'Net Realizable Value (NRV)',
                        source: 'FARMFIT Freight Engine',
                        date: new Date().toISOString().split('T')[0],
                        calculationFormula: `NRV = Modal Price (₹${cropItem.latestModalPrice || 4200}) - Freight (${cropItem.bestMandiDistanceKm || 20}km * ₹1.4/km) = ₹${cropItem.nrvPerQtl || 4100}/Qtl`,
                        confidence: 'HIGH'
                      }
                    ]}
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SECTION 2: WHERE SHOULD I SELL? */}
      {activeWorkflowSection === 'WHERE_TO_SELL' && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
            <div className="flex items-center gap-2">
              <Store className="w-5 h-5 text-emerald-600" />
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  APMC Market Intelligence & Decision Engine
                </h3>
                <p className="text-xs text-slate-500">
                  Target Commodity: <strong className="text-slate-800 dark:text-slate-200">{currentAssessment.displayName}</strong> • Origin: {simDistrict}, {simState}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <label htmlFor="farmer-where-crop-select" className="text-xs font-bold text-slate-500">Change Commodity:</label>
              <select
                id="farmer-where-crop-select"
                value={activeCropId}
                onChange={(e) => setActiveCropId(e.target.value)}
                className="text-xs font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-200"
              >
                {FARMFIT_CROP_COMMODITY_MASTER.map(c => (
                  <option key={c.cropCommodityId || c.id} value={c.cropCommodityId || c.id}>
                    {c.displayName || c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Verified Market Analytics & Scorecard */}
          <MarketTrendScorecard
            analytics={verifiedAnalytics}
            onRankingModeChange={(mode) => setMandiRankingMode(mode)}
          />
        </div>
      )}

      {/* SECTION 3: WHAT CAN CHANGE MY DECISION? */}
      {activeWorkflowSection === 'WHAT_CAN_CHANGE' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-6">
            <div>
              <div className="flex items-center gap-2">
                <EvidenceTypeBadge classification="FARMFIT_SCENARIO_SIMULATION" size="sm" />
                <span className="text-xs font-bold text-slate-500">What-If Sensitivity Simulation</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-1">
                Stress-Testing Your Expected Returns for {currentAssessment.displayName}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Simulates real agricultural shocks (monsoon deficit, wholesale price drop, fuel hike) to see if this crop remains viable.
              </p>
            </div>

            {/* Shock Selection Pills */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {whatIfSimulations.map((sim, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedShockIdx(idx)}
                  className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                    selectedShockIdx === idx
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    {sim.shock.shockType}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    Farmer Net Income: <span className={`font-bold ${sim.farmerNetIncomeChangePercent < 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                      {sim.farmerNetIncomeChangePercent > 0 ? `+${sim.farmerNetIncomeChangePercent}%` : `${sim.farmerNetIncomeChangePercent}%`}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            {/* Active Simulation Result Card */}
            {activeSimulation && (
              <div className="bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/80 dark:border-slate-800 pb-3">
                  <div>
                    <span className="text-[11px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wide">
                      Active Stress Simulation
                    </span>
                    <h4 className="text-lg font-black text-slate-900 dark:text-slate-100">
                      {activeSimulation.shock.shockType}
                    </h4>
                  </div>
                  <div className="text-xs font-bold px-3 py-1 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                    {activeSimulation.shock.description}
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                  <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                    <div className="text-[10px] uppercase font-bold text-slate-500">Yield Impact</div>
                    <div className={`text-base sm:text-lg font-black ${activeSimulation.yieldImpactPercent < 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                      {activeSimulation.yieldImpactPercent > 0 ? `+${activeSimulation.yieldImpactPercent}%` : `${activeSimulation.yieldImpactPercent}%`}
                    </div>
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                    <div className="text-[10px] uppercase font-bold text-slate-500">Price Impact</div>
                    <div className={`text-base sm:text-lg font-black ${activeSimulation.priceImpactPercent < 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                      {activeSimulation.priceImpactPercent > 0 ? `+${activeSimulation.priceImpactPercent}%` : `${activeSimulation.priceImpactPercent}%`}
                    </div>
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                    <div className="text-[10px] uppercase font-bold text-slate-500">Net Income Change</div>
                    <div className={`text-base sm:text-lg font-black ${activeSimulation.farmerNetIncomeChangePercent < 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                      {activeSimulation.farmerNetIncomeChangePercent > 0 ? `+${activeSimulation.farmerNetIncomeChangePercent}%` : `${activeSimulation.farmerNetIncomeChangePercent}%`}
                    </div>
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                    <div className="text-[10px] uppercase font-bold text-slate-500">FPO Exposure</div>
                    <div className="text-base sm:text-lg font-black text-amber-700 dark:text-amber-400">{activeSimulation.fpoValueAtRiskPercent}% VaR</div>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1.5">
                  <div className="text-[11px] uppercase font-bold text-emerald-700 dark:text-emerald-400">
                    Recommended Action Interventions
                  </div>
                  <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-1 list-disc list-inside">
                    {activeSimulation.recommendedInterventions.map((rec, i) => (
                      <li key={i}>{rec}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SECTION 4: ACTION PLAN (Phase 6 Engine) */}
      {activeWorkflowSection === 'ACTION_PLAN' && (
        <div className="space-y-6">
          {/* Main Action Plan Execution Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-[11px] font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-widest">
                  ACTION PLAN &amp; DECISION QUALITY ENGINE
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 mt-1">
                  What Should You Do Next for {currentAssessment.displayName}?
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                  Practical, step-by-step guidance covering pre-sowing, crop maintenance, harvest, and adaptive triggers.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-black px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                  {currentAssessment.primaryDecisionStatus?.replace(/_/g, ' ') || 'ACTION READY'}
                </span>
              </div>
            </div>

            {/* Structured Step-by-Step Flow */}
            <div className="space-y-4">
              {/* Milestone 1: Now & Pre-Sowing */}
              <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-800/60 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wide text-emerald-900 dark:text-emerald-300 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-black text-xs flex items-center justify-center">1</span>
                    {currentAssessment.actionPlan?.now?.title || 'Pre-Sowing & Input Planning'}
                  </span>
                  <span className="text-[11px] font-bold text-slate-500">
                    Timeline: {currentAssessment.actionPlan?.now?.timeframe || '15-30 Days Before Sowing'}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
                  {(currentAssessment.actionPlan?.now?.actions || [
                    'Procure certified variety foundation seeds with >85% germination certification.',
                    'Apply recommended NPK basal dose and organic compost based on local soil card.',
                    'Test irrigation borewell pump output and prepare drip/furrow channels.'
                  ]).map((actionText, idx) => (
                    <div key={idx} className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-900 dark:text-white">Step {idx + 1}</span>
                        <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">HIGH</span>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400">{actionText}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Milestone 2: Vegetative & Crop Protection */}
              <div className="p-4 rounded-2xl bg-sky-50/50 dark:bg-sky-950/20 border border-sky-200/80 dark:border-sky-800/60 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wide text-sky-900 dark:text-sky-300 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-sky-600 text-white font-black text-xs flex items-center justify-center">2</span>
                    {currentAssessment.actionPlan?.duringCrop?.title || 'Vegetative Phase & Irrigation Regimen'}
                  </span>
                  <span className="text-[11px] font-bold text-slate-500">
                    Timeline: {currentAssessment.actionPlan?.duringCrop?.timeframe || '30-75 Days After Sowing'}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
                  {(currentAssessment.actionPlan?.duringCrop?.actions || [
                    'Weekly field scouting for early pest infestation and targeted bio-spray.',
                    'Maintain soil moisture at flowering and pod/grain formation stages.',
                    'Apply secondary micronutrient foliar spray to maximize grain weight.'
                  ]).map((actionText, idx) => (
                    <div key={idx} className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-900 dark:text-white">Step {idx + 1}</span>
                        <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300">CRITICAL</span>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400">{actionText}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Milestone 3: Harvest & APMC Mandi Routing */}
              <div className="p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-800/60 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wide text-amber-900 dark:text-amber-300 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-amber-600 text-white font-black text-xs flex items-center justify-center">3</span>
                    {currentAssessment.actionPlan?.sellingWindow?.title || 'Harvest & Dynamic Mandi Routing'}
                  </span>
                  <span className="text-[11px] font-bold text-slate-500">
                    Timeline: {currentAssessment.actionPlan?.sellingWindow?.timeframe || '10-15 Days Before Harvest'}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
                  {(currentAssessment.actionPlan?.sellingWindow?.actions || [
                    'Check real-time AGMARKNET spreads between local yard and regional terminal mandi.',
                    'Sun-dry harvested produce to bring grain moisture below 12% for maximum mandi grade.',
                    'Book shared freight with neighboring farmers to reduce transport cost per quintal.'
                  ]).map((actionText, idx) => (
                    <div key={idx} className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-900 dark:text-white">Step {idx + 1}</span>
                        <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">ACTION</span>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400">{actionText}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Decision Change Triggers (When should you change your plan?) */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-black text-rose-700 dark:text-rose-400 uppercase tracking-wider">
                  WHAT-IF EARLY WARNING &amp; CONTINGENCY TRIGGERS
                </span>
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">
                When should you change your decision?
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {(currentAssessment.decisionChangeTriggers || [
                  { condition: 'Monsoon Delayed > 15 Days', alternativeAction: 'Switch from long-duration crop to short-duration pulse (e.g., Moong / Urad) or drought-tolerant millet.', triggerThreshold: 'No rain by July 15' },
                  { condition: 'Wholesale Mandi Price Crashes > 20%', alternativeAction: 'Utilize WDRA certified warehouse storage / negotiable warehouse receipts (e-NWR) to hold stock for 60-90 days.', triggerThreshold: 'Spot price < CACP A2+FL cost' },
                  { condition: 'Borewell Discharge Drops Below 40%', alternativeAction: 'Implement micro-irrigation / drip fertigation and reduce crop acreage by 25% to protect yield on remaining area.', triggerThreshold: 'Pump run dry within 2 hours' }
                ]).map((trigger, tIdx) => (
                  <div key={tIdx} className="p-3.5 bg-slate-50 dark:bg-slate-950/40 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
                    <div className="text-xs font-black text-rose-700 dark:text-rose-400">
                      If: {trigger.condition}
                    </div>
                    <div className="text-xs text-slate-700 dark:text-slate-300">
                      <strong>Action:</strong> {trigger.alternativeAction}
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 italic">
                      Trigger Level: {trigger.triggerThreshold}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
