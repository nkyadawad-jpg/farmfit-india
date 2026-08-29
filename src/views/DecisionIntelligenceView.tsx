import React, { useState, useMemo } from 'react';
import { 
  Compass, 
  Sprout, 
  Wheat, 
  Store, 
  Truck, 
  ShieldAlert, 
  Sliders, 
  TrendingUp, 
  TrendingDown, 
  CheckCircle2, 
  AlertTriangle, 
  Info, 
  ArrowRight, 
  Scale, 
  Layers, 
  Sparkles, 
  HelpCircle, 
  ChevronRight, 
  MapPin, 
  Droplets, 
  FlaskConical, 
  BarChart3,
  Calendar,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { 
  FarmLocation, 
  LandIrrigationProfile, 
  SoilProfileRecord, 
  FarmerProfile, 
  CropSeason,
  Language,
  RiskDimensionType
} from '../types';
import { 
  FarmDecisionAssessment, 
  CropOpportunityRankItem 
} from '../types/decisionAssessment';
import { TransportCostInputs } from '../types/marketIntelligence';
import { decisionIntelligenceService } from '../services/decisionIntelligenceService';
import { scenarioEngineService } from '../services/scenarioEngineService';
import { getCanonicalCropById, FARMFIT_CROP_COMMODITY_MASTER } from '../data/cropMasterIndex';
import { DataStatusBadge } from '../components/DataStatusBadge';

interface DecisionIntelligenceViewProps {
  farmerProfile?: Partial<FarmerProfile>;
  farmLocation: FarmLocation;
  landProfile?: Partial<LandIrrigationProfile>;
  soilProfile?: Partial<SoilProfileRecord>;
  targetSeason?: CropSeason;
  preferredCropIds?: string[];
  selectedCropId?: string;
  onSelectCrop?: (cropId: string) => void;
  onNavigateToRouting?: () => void;
  language: Language;
}

export const DecisionIntelligenceView: React.FC<DecisionIntelligenceViewProps> = ({
  farmerProfile,
  farmLocation,
  landProfile,
  soilProfile,
  targetSeason = 'Kharif',
  preferredCropIds = [],
  selectedCropId,
  onSelectCrop,
  onNavigateToRouting,
  language
}) => {
  // Active navigation sub-tab
  const [activeTab, setActiveTab] = useState<
    'CROP_RANKING' | 'BEST_MARKETS' | 'PRICE_TREND' | 'RISK_RADAR' | 'WHAT_IF' | 'EXPLAINABLE_DECISION'
  >('CROP_RANKING');

  // Category filter for ranking
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  // Selected crop for single-crop deep dive
  const defaultCropId = selectedCropId || (preferredCropIds.length > 0 ? preferredCropIds[0] : 'bajra');
  const [activeCropId, setActiveCropId] = useState<string>(defaultCropId);

  // Scenario Simulator Shock
  const [selectedShockIdx, setSelectedShockIdx] = useState<number>(0);

  // Transport rates inputs for NRV calculation
  const [transportInputs, setTransportInputs] = useState<Partial<TransportCostInputs>>({
    isValidated: true,
    transportRatePerTonnePerKm: 3.5, // verified standard mini-truck rate ₹3.5 / tonne / km
    loadingCostPerQtl: 10,
    unloadingCostPerQtl: 10,
    otherCostsPerQtl: 15
  });

  // Active risk dimension
  const [selectedRiskDim, setSelectedRiskDim] = useState<RiskDimensionType>('Price Risk');

  // Markets display toggle: top 10 vs view all
  const [viewAllMarkets, setViewAllMarkets] = useState<boolean>(false);

  // Multi-crop comparison list
  const [comparisonCropIds, setComparisonCropIds] = useState<string[]>(['bajra', 'soybean', 'onion', 'tomato']);

  // Compute Ranked Crops List via Decision Engine
  const rankedCrops: CropOpportunityRankItem[] = useMemo(() => {
    return decisionIntelligenceService.rankCandidateCrops({
      candidateCropIds: preferredCropIds.length > 0 ? preferredCropIds : undefined,
      farmLocation,
      farmerProfile,
      landProfile,
      soilProfile,
      targetSeason,
      transportInputs,
      categoryFilter: selectedCategory
    });
  }, [preferredCropIds, farmLocation, farmerProfile, landProfile, soilProfile, targetSeason, transportInputs, selectedCategory]);

  // Compute Active Single-Crop Assessment
  const activeAssessment: FarmDecisionAssessment = useMemo(() => {
    const activeShock = scenarioEngineService.PREDEFINED_SHOCKS[selectedShockIdx];
    return decisionIntelligenceService.evaluateCropDecision({
      cropId: activeCropId,
      farmLocation,
      farmerProfile,
      landProfile,
      soilProfile,
      targetSeason,
      transportInputs,
      customShock: activeShock
    });
  }, [activeCropId, farmLocation, farmerProfile, landProfile, soilProfile, targetSeason, transportInputs, selectedShockIdx]);

  // Handle crop switch
  const handleSwitchCrop = (cropId: string) => {
    setActiveCropId(cropId);
    if (onSelectCrop) onSelectCrop(cropId);
  };

  const currentShock = scenarioEngineService.PREDEFINED_SHOCKS[selectedShockIdx] || scenarioEngineService.PREDEFINED_SHOCKS[0];

  return (
    <div className="space-y-6 pb-24">
      {/* 1. TOP HERO: FARMFIT DECISION INTELLIGENCE HEADER */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-slate-800 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-black tracking-wider uppercase mb-3 border border-emerald-500/30">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>{activeAssessment.derivedLabel}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              {language === 'en' ? 'Risk-Adjusted Crop & Market Decision Intelligence' : 'जोखिम-समायोजित फसल एवं मंडी निर्णय प्रज्ञा'}
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
              Integrated actuarial optimization answering: &ldquo;Given your farm&rsquo;s actual location, soil, water, season, and current AGMARKNET wholesale arrivals, which crop delivers the strongest risk-adjusted economic return, and where should it be sold?&rdquo;
            </p>
          </div>

          {/* Farm Baseline Indicators */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-slate-800/90 border border-slate-700 px-4 py-2.5 rounded-2xl">
              <div className="text-[10px] uppercase font-bold text-slate-400">Farm Location</div>
              <div className="text-xs font-black text-white flex items-center gap-1.5 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-rose-400" />
                <span>{farmLocation?.district || 'Not Set'}, {farmLocation?.state || 'India'}</span>
              </div>
            </div>

            <div className="bg-slate-800/90 border border-slate-700 px-4 py-2.5 rounded-2xl">
              <div className="text-[10px] uppercase font-bold text-slate-400">Season & Water</div>
              <div className="text-xs font-black text-emerald-300 flex items-center gap-1.5 mt-0.5">
                <Droplets className="w-3.5 h-3.5 text-blue-400" />
                <span>{targetSeason} &bull; {landProfile?.primaryWaterSource || 'Rainfed / Assured'}</span>
              </div>
            </div>

            <DataStatusBadge
              status={activeAssessment.priceEvidence.isVerifiedOfficial ? 'LATEST_AVAILABLE' : 'MODEL_ESTIMATE'}
              sourceText="AGMARKNET / ICAR / CACP"
              dateText={activeAssessment.priceEvidence.priceDate || '2024-25'}
              size="sm"
            />
          </div>
        </div>

        {/* CROP QUICK-SWITCH BAR */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-5">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 shrink-0">
              Active Focus Crop:
            </span>
            <div className="flex gap-1.5 shrink-0">
              {['bajra', 'onion', 'tomato', 'soybean', 'wheat', 'cotton'].map((cId) => {
                const cMeta = getCanonicalCropById(cId);
                const isSelected = cId === activeCropId;
                return (
                  <button
                    key={cId}
                    type="button"
                    onClick={() => handleSwitchCrop(cId)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-500 text-slate-950 font-black shadow-md'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                    }`}
                  >
                    {cMeta?.displayName || cId}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Risk-Adjusted Score</span>
              <span className="text-lg font-black text-emerald-400">
                {activeAssessment.riskAdjustedScore}/100
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Best APMC Yard</span>
              <span className="text-xs font-extrabold text-white">
                {activeAssessment.marketOpportunity.bestMarket?.market || 'Regional Mandi'} ({activeAssessment.marketOpportunity.bestMarket?.distance ?? 'N/A'} km)
              </span>
            </div>
          </div>
        </div>

        {/* 6 SUB-TABS */}
        <div className="flex items-center gap-1.5 overflow-x-auto mt-6 pt-2 border-t border-slate-800 scrollbar-none">
          {[
            { id: 'CROP_RANKING', label: 'Best Crop Opportunities', icon: Wheat },
            { id: 'BEST_MARKETS', label: 'Best Mandis & NRV', icon: Store },
            { id: 'PRICE_TREND', label: 'Price Trends & Volatility', icon: TrendingUp },
            { id: 'RISK_RADAR', label: '12-Dimensional Risk', icon: ShieldAlert },
            { id: 'WHAT_IF', label: 'What-If Simulation', icon: Sliders },
            { id: 'EXPLAINABLE_DECISION', label: 'Decision Explanation', icon: Compass }
          ].map((tab) => {
            const Icon = tab.icon;
            const isTabActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                  isTabActive
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================
          SUB-TAB 1: BEST CROP OPPORTUNITIES (RANKED MATRIX)
          ======================================================== */}
      {activeTab === 'CROP_RANKING' && (
        <div className="space-y-6">
          {/* CATEGORY SELECTOR CHIPS */}
          <div className="flex items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-xs">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Commodity Filter:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {['ALL', 'Cereals', 'Pulses', 'Oilseeds', 'Vegetables', 'Sugar & Commercial Crops', 'Spices & Condiments'].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            <span className="text-xs text-slate-500 font-medium">
              {rankedCrops.length} candidate crops evaluated
            </span>
          </div>

          {/* RANKED CROPS TABLE / CARDS */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xs">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  FARMFIT Best Crop Opportunities & Risk-Adjusted Ranking
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Ranks crops by combining Farm Suitability, Wholesale Price, 200 km Mandi NRV, Trend Strength, and 12-Dimensional Risk Penalty.
                </p>
              </div>
              <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                Sorted by Risk-Adjusted Score
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 text-[11px] uppercase font-black border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="py-3 px-4">Rank & Crop</th>
                    <th className="py-3 px-4">Farm Suitability</th>
                    <th className="py-3 px-4">Latest Modal Price</th>
                    <th className="py-3 px-4">7D / 30D Trend</th>
                    <th className="py-3 px-4">Best Mandi & NRV</th>
                    <th className="py-3 px-4">12D Risk Score</th>
                    <th className="py-3 px-4">Risk-Adjusted Score</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {rankedCrops.map((item) => {
                    const isCurrent = item.cropId === activeCropId;
                    return (
                      <tr 
                        key={item.cropId}
                        onClick={() => handleSwitchCrop(item.cropId)}
                        className={`hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer transition-colors ${
                          isCurrent ? 'bg-emerald-50/50 dark:bg-emerald-950/20' : ''
                        }`}
                      >
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <span className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs ${
                              item.rank === 1 ? 'bg-amber-400 text-slate-950 shadow-xs' :
                              item.rank === 2 ? 'bg-slate-300 text-slate-900' :
                              item.rank === 3 ? 'bg-amber-700/30 text-amber-900 dark:text-amber-300' :
                              'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                            }`}>
                              #{item.rank}
                            </span>
                            <div>
                              <span className="font-black text-sm text-slate-900 dark:text-white block">
                                {item.cropName}
                              </span>
                              <span className="text-[10px] text-slate-500 font-bold uppercase">
                                {item.category}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-slate-900 dark:text-white">
                              {item.farmSuitabilityScore}/100
                            </span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              item.farmSuitabilityScore >= 75 
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' 
                                : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                            }`}>
                              {item.farmSuitabilityLevel}
                            </span>
                          </div>
                        </td>

                        <td className="py-4 px-4">
                          {item.latestModalPrice ? (
                            <div>
                              <span className="font-black text-slate-900 dark:text-white">
                                ₹{item.latestModalPrice.toLocaleString('en-IN')}/Qtl
                              </span>
                              <span className="text-[10px] block text-slate-500 font-medium">
                                As of {item.priceDate || 'Recent'}
                              </span>
                            </div>
                          ) : (
                            <span className="text-slate-400 italic">No 200km Trade</span>
                          )}
                        </td>

                        <td className="py-4 px-4">
                          <span className={`inline-flex items-center gap-1 font-bold text-xs ${
                            item.priceTrend === 'RISING' ? 'text-emerald-600 dark:text-emerald-400' :
                            item.priceTrend === 'FALLING' ? 'text-rose-600 dark:text-rose-400' :
                            item.priceTrend === 'STABLE' ? 'text-slate-600 dark:text-slate-300' : 'text-slate-400'
                          }`}>
                            {item.priceTrend === 'RISING' && <TrendingUp className="w-3.5 h-3.5" />}
                            {item.priceTrend === 'FALLING' && <TrendingDown className="w-3.5 h-3.5" />}
                            <span>{item.priceTrend}</span>
                          </span>
                        </td>

                        <td className="py-4 px-4">
                          {item.bestMandiName ? (
                            <div>
                              <span className="font-bold text-slate-900 dark:text-white block">
                                {item.bestMandiName} ({item.bestMandiDistanceKm} km)
                              </span>
                              <span className="text-[11px] font-black text-emerald-600 dark:text-emerald-400">
                                {item.nrvPerQtl ? `NRV: ₹${item.nrvPerQtl.toLocaleString('en-IN')}/Qtl` : 'NRV uncalculated'}
                              </span>
                            </div>
                          ) : (
                            <span className="text-slate-400">No Nearby APMC</span>
                          )}
                        </td>

                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <span className={`w-2.5 h-2.5 rounded-full ${
                              item.riskLevel === 'LOW' ? 'bg-emerald-500' :
                              item.riskLevel === 'MODERATE' ? 'bg-amber-500' : 'bg-rose-500'
                            }`} />
                            <span className="font-bold text-slate-800 dark:text-slate-200">
                              {item.assessment.riskAssessment.overallCompositeRiskScore}/100 ({item.riskLevel})
                            </span>
                          </div>
                        </td>

                        <td className="py-4 px-4">
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-base font-black text-emerald-700 dark:text-emerald-400">
                              {item.riskAdjustedScore}
                            </span>
                            <span className="text-[10px] text-slate-400 font-bold">/100</span>
                          </div>
                        </td>

                        <td className="py-4 px-4 text-right">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSwitchCrop(item.cropId);
                              setActiveTab('EXPLAINABLE_DECISION');
                            }}
                            className="px-3 py-1.5 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-xs font-black hover:opacity-90 transition-opacity cursor-pointer inline-flex items-center gap-1"
                          >
                            <span>Inspect</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* MULTI-CROP COMPARISON BENCHMARK */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h4 className="font-black text-base text-slate-900 dark:text-white">
                  Head-to-Head Crop Comparison Benchmark
                </h4>
                <p className="text-xs text-slate-500">
                  Direct side-by-side evaluation of major staple and vegetable alternatives.
                </p>
              </div>
              <div className="flex items-center gap-1.5">
                {['bajra', 'soybean', 'onion', 'tomato', 'wheat'].map((cid) => (
                  <button
                    key={cid}
                    type="button"
                    onClick={() => {
                      setComparisonCropIds(prev => 
                        prev.includes(cid) ? prev.filter(c => c !== cid) : [...prev, cid]
                      );
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer ${
                      comparisonCropIds.includes(cid)
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {getCanonicalCropById(cid)?.displayName || cid}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
              {comparisonCropIds.map((cId) => {
                const dec = decisionIntelligenceService.evaluateCropDecision({
                  cropId: cId,
                  farmLocation,
                  farmerProfile,
                  landProfile,
                  soilProfile,
                  targetSeason,
                  transportInputs
                });
                return (
                  <div key={cId} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-black text-sm text-slate-900 dark:text-white">
                        {dec.displayName}
                      </span>
                      <span className="text-xs font-black px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                        {dec.riskAdjustedScore}/100
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                      <div className="flex justify-between">
                        <span>Farm Suitability:</span>
                        <span className="font-bold text-slate-900 dark:text-white">{dec.farmSuitabilityScore}/100</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Modal Price:</span>
                        <span className="font-bold text-slate-900 dark:text-white">
                          {dec.priceEvidence.latestModalPrice ? `₹${dec.priceEvidence.latestModalPrice}/Qtl` : 'N/A'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Best APMC:</span>
                        <span className="font-bold text-slate-900 dark:text-white truncate max-w-[120px]">
                          {dec.marketOpportunity.bestMarket?.market || 'None'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Risk Score:</span>
                        <span className="font-bold text-slate-900 dark:text-white">
                          {dec.riskAssessment.overallCompositeRiskScore}/100 ({dec.riskLevel})
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleSwitchCrop(cId)}
                      className="w-full py-2 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-xs font-black hover:opacity-90 transition-opacity cursor-pointer text-center"
                    >
                      Focus Decision
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          SUB-TAB 2: BEST MARKETS & NRV (200 KM RADIUS)
          ======================================================== */}
      {activeTab === 'BEST_MARKETS' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  Best APMC Wholesale Markets for {activeAssessment.displayName}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Verified official AGMARKNET trades within 200 km of farm coordinates ({farmLocation?.latitude?.toFixed(4) || 'N/A'}, {farmLocation?.longitude?.toFixed(4) || 'N/A'}).
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setViewAllMarkets(!viewAllMarkets)}
                  className="px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  {viewAllMarkets ? 'Show Top 10 Only' : `View All (${activeAssessment.marketOpportunity.totalMarketsIn200km} Markets)`}
                </button>
              </div>
            </div>

            {/* NRV WATERFALL SUMMARY CARD */}
            {activeAssessment.marketOpportunity.bestMarket && (
              <div className="p-5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-sm">
                      #1
                    </span>
                    <div>
                      <h4 className="font-black text-base text-emerald-950 dark:text-emerald-200">
                        Top Ranked Market: {activeAssessment.marketOpportunity.bestMarket.market}
                      </h4>
                      <span className="text-xs text-emerald-700 dark:text-emerald-400">
                        {activeAssessment.marketOpportunity.bestMarket.district}, {activeAssessment.marketOpportunity.bestMarket.state} &bull; {activeAssessment.marketOpportunity.bestMarket.distance} km (Straight-line)
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-400 block">
                      Net Realization Value (NRV)
                    </span>
                    <span className="text-xl font-black text-emerald-900 dark:text-emerald-100">
                      {activeAssessment.nrv.isCalculated && activeAssessment.nrv.netRealizationPerQtl
                        ? `₹${activeAssessment.nrv.netRealizationPerQtl.toLocaleString('en-IN')}/Qtl`
                        : `₹${(activeAssessment.marketOpportunity.bestMarket.modalPrice ?? 0).toLocaleString('en-IN')}/Qtl`}
                    </span>
                  </div>
                </div>

                {/* Waterfall Breakdown */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-emerald-200/60 dark:border-emerald-900/60 text-xs">
                  <div className="p-2.5 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-emerald-100 dark:border-emerald-900/40">
                    <span className="text-[10px] text-slate-500 font-bold block uppercase">Gross Modal Price</span>
                    <span className="font-black text-slate-900 dark:text-white">
                      ₹{activeAssessment.marketOpportunity.bestMarket.modalPrice}/Qtl
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-emerald-100 dark:border-emerald-900/40">
                    <span className="text-[10px] text-rose-500 font-bold block uppercase">Est. Freight / Transport</span>
                    <span className="font-black text-rose-600 dark:text-rose-400">
                      -₹{Math.round(((transportInputs.transportRatePerTonnePerKm || 3.5) / 10) * (activeAssessment.marketOpportunity.bestMarket.distance || 0))}/Qtl
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-emerald-100 dark:border-emerald-900/40">
                    <span className="text-[10px] text-slate-500 font-bold block uppercase">Loading / Hamali</span>
                    <span className="font-black text-slate-700 dark:text-slate-300">
                      -₹{transportInputs.loadingCostPerQtl || 10}/Qtl
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-emerald-600 text-white">
                    <span className="text-[10px] text-emerald-100 font-bold block uppercase">Farmer Net in Pocket</span>
                    <span className="font-black text-sm">
                      {activeAssessment.nrv.isCalculated && activeAssessment.nrv.netRealizationPerQtl
                        ? `₹${activeAssessment.nrv.netRealizationPerQtl}/Qtl (₹${activeAssessment.nrv.netRealizationPerKg}/kg)`
                        : `₹${activeAssessment.marketOpportunity.bestMarket.modalPrice}/Qtl`}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* MANDI LIST TABLE */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 text-[11px] uppercase font-black border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="py-3 px-4">Rank & APMC Yard</th>
                    <th className="py-3 px-4">Distance</th>
                    <th className="py-3 px-4">Modal Price</th>
                    <th className="py-3 px-4">Min / Max Range</th>
                    <th className="py-3 px-4">Bulletin Date</th>
                    <th className="py-3 px-4">Est. Transport Cost</th>
                    <th className="py-3 px-4">Net Realization (NRV)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {(viewAllMarkets 
                    ? activeAssessment.marketOpportunity.allMarkets 
                    : activeAssessment.marketOpportunity.top10Markets
                  ).map((mkt, idx) => {
                    const freight = Math.round(((transportInputs.transportRatePerTonnePerKm || 3.5) / 10) * (mkt.distance || 0));
                    const estNrv = Math.max(0, (mkt.modalPrice ?? 0) - freight - 20);
                    return (
                      <tr key={mkt.marketId || idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center font-bold text-[10px]">
                              {idx + 1}
                            </span>
                            <div>
                              <span className="font-extrabold text-slate-900 dark:text-white block">
                                {mkt.market}
                              </span>
                              <span className="text-[10px] text-slate-500 font-medium">
                                {mkt.district}, {mkt.state}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-4 font-bold text-slate-700 dark:text-slate-300">
                          {mkt.distance !== null ? `${mkt.distance} km` : 'N/A'}
                        </td>

                        <td className="py-3 px-4 font-black text-slate-900 dark:text-white">
                          ₹{(mkt.modalPrice ?? 0).toLocaleString('en-IN')}/Qtl
                        </td>

                        <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                          ₹{mkt.minPrice || mkt.modalPrice} - ₹{mkt.maxPrice || mkt.modalPrice}
                        </td>

                        <td className="py-3 px-4 text-slate-500">
                          {mkt.priceDate || 'Latest'}
                        </td>

                        <td className="py-3 px-4 text-rose-600 dark:text-rose-400 font-medium">
                          -₹{freight}/Qtl
                        </td>

                        <td className="py-3 px-4 font-black text-emerald-600 dark:text-emerald-400">
                          ₹{estNrv.toLocaleString('en-IN')}/Qtl
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          SUB-TAB 3: PRICE TRENDS & VOLATILITY
          ======================================================== */}
      {activeTab === 'PRICE_TREND' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  Historical Price Trend & Moving Averages: {activeAssessment.displayName}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Empirical time-series analysis based on AGMARKNET daily trading bulletins.
                </p>
              </div>

              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-xs font-black">
                <span>Trend: {activeAssessment.historicalTrend.priceTrend}</span>
              </div>
            </div>

            {/* 4 STATS CARDS */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">7-Day Moving Avg</span>
                <span className="text-lg font-black text-slate-900 dark:text-white mt-1 block">
                  {activeAssessment.historicalTrend.avg7DayPrice ? `₹${activeAssessment.historicalTrend.avg7DayPrice.toLocaleString('en-IN')}/Qtl` : 'INSUFFICIENT DATA'}
                </span>
                <span className="text-[10px] text-slate-500">Short-term momentum</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">30-Day Moving Avg</span>
                <span className="text-lg font-black text-slate-900 dark:text-white mt-1 block">
                  {activeAssessment.historicalTrend.avg30DayPrice ? `₹${activeAssessment.historicalTrend.avg30DayPrice.toLocaleString('en-IN')}/Qtl` : 'INSUFFICIENT DATA'}
                </span>
                <span className="text-[10px] text-slate-500">Monthly seasonal baseline</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">90-Day Moving Avg</span>
                <span className="text-lg font-black text-slate-900 dark:text-white mt-1 block">
                  {activeAssessment.historicalTrend.avg90DayPrice ? `₹${activeAssessment.historicalTrend.avg90DayPrice.toLocaleString('en-IN')}/Qtl` : 'INSUFFICIENT DATA'}
                </span>
                <span className="text-[10px] text-slate-500">Quarterly trend benchmark</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Verified Observations</span>
                <span className="text-lg font-black text-indigo-600 dark:text-indigo-400 mt-1 block">
                  {activeAssessment.historicalTrend.trendObservationCount} Bulletins
                </span>
                <span className="text-[10px] text-slate-500">Zero synthetic interpolation</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          SUB-TAB 4: 12-DIMENSIONAL RISK RADAR
          ======================================================== */}
      {activeTab === 'RISK_RADAR' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {(Object.keys(activeAssessment.riskAssessment.dimensions) as RiskDimensionType[]).map((dim) => {
              const assessment = activeAssessment.riskAssessment.dimensions[dim];
              const isSelected = selectedRiskDim === dim;
              return (
                <button
                  key={dim}
                  type="button"
                  onClick={() => setSelectedRiskDim(dim)}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'border-rose-500 bg-rose-50/50 dark:bg-rose-950/40 ring-2 ring-rose-500/20 shadow-xs'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-black text-slate-900 dark:text-white">
                      {dim}
                    </span>
                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                      assessment.riskLevel === 'LOW' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                      assessment.riskLevel === 'MODERATE' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' :
                      'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                    }`}>
                      {assessment.riskLevel}
                    </span>
                  </div>

                  <div className="text-sm font-black text-slate-900 dark:text-white mt-1">
                    {assessment.riskScore}/100
                  </div>

                  <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full mt-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        assessment.riskScore < 35 ? 'bg-emerald-500' : assessment.riskScore < 60 ? 'bg-amber-500' : 'bg-rose-500'
                      }`}
                      style={{ width: `${assessment.riskScore}%` }}
                    />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Drilldown Panel */}
          <div className="lg:col-span-4 space-y-4">
            {activeAssessment.riskAssessment.dimensions[selectedRiskDim] && (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <h4 className="font-black text-sm text-slate-900 dark:text-white">
                    {selectedRiskDim} Analysis
                  </h4>
                  <span className="text-sm font-black text-slate-900 dark:text-white">
                    {activeAssessment.riskAssessment.dimensions[selectedRiskDim].riskScore}/100
                  </span>
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Observed Primary Drivers
                  </span>
                  <ul className="space-y-1.5">
                    {activeAssessment.riskAssessment.dimensions[selectedRiskDim].drivers.map((drv, idx) => (
                      <li key={idx} className="text-xs text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 p-2 rounded-xl">
                        &bull; {drv}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block">
                    Recommended Agronomic Mitigation
                  </span>
                  <ul className="space-y-1.5">
                    {activeAssessment.riskAssessment.dimensions[selectedRiskDim].mitigationStrategies.map((mit, idx) => (
                      <li key={idx} className="text-xs text-emerald-900 dark:text-emerald-200 bg-emerald-50/60 dark:bg-emerald-950/30 p-2 rounded-xl border border-emerald-100 dark:border-emerald-900/40">
                        &bull; {mit}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================
          SUB-TAB 5: WHAT-IF SCENARIO SIMULATION
          ======================================================== */}
      {activeTab === 'WHAT_IF' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                FARMFIT What-If Scenario Simulator: {activeAssessment.displayName}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Stress-test how external weather anomalies, fuel cost hikes, and market price shocks impact farmer net income.
              </p>
            </div>

            {/* SHOCK CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {scenarioEngineService.PREDEFINED_SHOCKS.map((sh, idx) => {
                const isSel = selectedShockIdx === idx;
                return (
                  <button
                    key={sh.shockType}
                    type="button"
                    onClick={() => setSelectedShockIdx(idx)}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                      isSel
                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-950 dark:text-indigo-200 ring-2 ring-indigo-500/20'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="font-black text-xs">{sh.shockType}</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                      {sh.description}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* PROPAGATION IMPACT CARD */}
            <div className="p-6 rounded-3xl bg-slate-900 text-white space-y-6 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <span className="text-xs font-bold text-indigo-300 block uppercase">
                    Simulated Shock: {currentShock.shockType}
                  </span>
                  <h4 className="text-xl font-black text-white mt-0.5">
                    {activeAssessment.displayName} Economic Impact
                  </h4>
                </div>

                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Net Farmer Income Shift
                  </span>
                  <span className={`text-2xl font-black ${
                    activeAssessment.scenarioAssessment.impact.farmerNetIncomeChangePercent >= 0 ? 'text-emerald-400' : 'text-rose-400'
                  }`}>
                    {activeAssessment.scenarioAssessment.impact.farmerNetIncomeChangePercent > 0 
                      ? `+${activeAssessment.scenarioAssessment.impact.farmerNetIncomeChangePercent}%`
                      : `${activeAssessment.scenarioAssessment.impact.farmerNetIncomeChangePercent}%`}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Yield Impact</div>
                  <div className="text-lg font-black text-white mt-1">
                    {activeAssessment.scenarioAssessment.impact.yieldImpactPercent}%
                  </div>
                </div>
                <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Market Price Impact</div>
                  <div className="text-lg font-black text-white mt-1">
                    {activeAssessment.scenarioAssessment.impact.priceImpactPercent}%
                  </div>
                </div>
                <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
                  <div className="text-[10px] uppercase font-bold text-slate-400">FPO Value at Risk</div>
                  <div className="text-lg font-black text-amber-400 mt-1">
                    {activeAssessment.scenarioAssessment.impact.fpoValueAtRiskPercent}%
                  </div>
                </div>
                <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Procurement Exposure</div>
                  <div className="text-lg font-black text-indigo-300 mt-1">
                    {activeAssessment.scenarioAssessment.impact.corporateProcurementExposurePercent}%
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          SUB-TAB 6: EXPLAINABLE DECISION ENGINE (5-PART ARCHITECTURE)
          ======================================================== */}
      {activeTab === 'EXPLAINABLE_DECISION' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-black mb-2">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{activeAssessment.recommendation.verdict.replace(/_/g, ' ')}</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                {activeAssessment.recommendation.summaryHeadline}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Authoritative explainable decision breakdown tailored for farmers, FPO managers, and agricultural advisors.
              </p>
            </div>

            {/* 5-PART DECISION EXPLANATION BLOCKS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* PART 1: WHY THIS CROP? */}
              <div className="p-5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 space-y-2">
                <span className="text-xs font-black uppercase tracking-wider text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5">
                  <Sprout className="w-4 h-4 text-emerald-600" />
                  1. Why This Crop?
                </span>
                <ul className="space-y-2 pt-1">
                  {activeAssessment.recommendation.whyThisCrop.map((reason, idx) => (
                    <li key={idx} className="text-xs text-slate-800 dark:text-slate-200 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* PART 2: WHY THIS MARKET? */}
              <div className="p-5 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 space-y-2">
                <span className="text-xs font-black uppercase tracking-wider text-blue-900 dark:text-blue-300 flex items-center gap-1.5">
                  <Store className="w-4 h-4 text-blue-600" />
                  2. Why This Market?
                </span>
                <ul className="space-y-2 pt-1">
                  {activeAssessment.recommendation.whyThisMarket.map((reason, idx) => (
                    <li key={idx} className="text-xs text-slate-800 dark:text-slate-200 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* PART 3: WHAT ARE THE RISKS? */}
              <div className="p-5 rounded-2xl bg-rose-50/60 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/40 space-y-2">
                <span className="text-xs font-black uppercase tracking-wider text-rose-900 dark:text-rose-300 flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-rose-600" />
                  3. What Are The Risks?
                </span>
                <ul className="space-y-2 pt-1">
                  {activeAssessment.recommendation.whatAreTheRisks.map((risk, idx) => (
                    <li key={idx} className="text-xs text-slate-800 dark:text-slate-200 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-600 mt-1.5 shrink-0" />
                      <span>{risk}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* PART 4: WHAT COULD CHANGE THE DECISION? */}
              <div className="p-5 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/40 space-y-2">
                <span className="text-xs font-black uppercase tracking-wider text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
                  <Sliders className="w-4 h-4 text-amber-600" />
                  4. What Could Change The Decision?
                </span>
                <ul className="space-y-2 pt-1">
                  {activeAssessment.recommendation.whatCouldChangeTheDecision.map((sens, idx) => (
                    <li key={idx} className="text-xs text-slate-800 dark:text-slate-200 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-1.5 shrink-0" />
                      <span>{sens}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* PART 5: HOW CONFIDENT IS FARMFIT? & TRACEABLE PROVENANCE */}
            <div className="p-5 rounded-2xl bg-slate-900 text-white space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-black uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  5. How Confident is FARMFIT?
                </span>
                <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Confidence Score: {activeAssessment.confidence.confidenceScore}/100 ({activeAssessment.confidence.confidenceTier})
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {activeAssessment.recommendation.howConfidentIsFarmfit}
              </p>

              {/* Data Provenance Badges */}
              <div className="pt-2 border-t border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-2">
                  Traceable Official Data Sources & Calibration
                </span>
                <div className="flex flex-wrap gap-2">
                  {activeAssessment.provenance.map((prov, i) => (
                    <div key={i} className="text-[11px] bg-slate-800 border border-slate-700 p-2.5 rounded-xl text-slate-300 flex items-center justify-between gap-3">
                      <div>
                        <span className="font-bold text-white block">{prov.sourceName}</span>
                        <span className="text-[10px] text-slate-400">{prov.calculationMethod}</span>
                      </div>
                      <a 
                        href={prov.sourceUrl} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-emerald-400 hover:text-emerald-300 p-1"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
