import React, { useState, useMemo } from 'react';
import { 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  TrendingDown, 
  TrendingUp,
  CloudRain, 
  Bug, 
  IndianRupee,
  Layers,
  Sparkles,
  Sliders,
  HelpCircle,
  Compass,
  ArrowRight,
  RefreshCw,
  Info,
  Truck,
  Droplets,
  Scale,
  Globe2,
  FileCheck2,
  BarChart3
} from 'lucide-react';
import { 
  CalculationEngineResult, 
  Language, 
  FarmLocation, 
  LandIrrigationProfile, 
  SoilProfileRecord,
  RiskDimensionType,
  ScenarioShockType,
  ExogenousShockInput
} from '../types';
import { DataStatusBadge } from '../components/DataStatusBadge';
import { agriculturalRiskEngineService } from '../services/riskEngineService';
import { scenarioEngineService } from '../services/scenarioEngineService';
import { 
  FARMFIT_CROP_COMMODITY_MASTER, 
  getCanonicalCropById, 
  getOfficialCommodityMapping 
} from '../data/cropMasterIndex';

interface RiskAnalysisViewProps {
  result?: CalculationEngineResult | null;
  farmerLocation?: FarmLocation;
  landProfile?: Partial<LandIrrigationProfile>;
  soilProfile?: Partial<SoilProfileRecord>;
  preferredCropIds?: string[];
  selectedCropId?: string;
  onSelectCrop?: (cropId: string) => void;
  language: Language;
}

export const RiskAnalysisView: React.FC<RiskAnalysisViewProps> = ({
  result,
  farmerLocation,
  landProfile,
  soilProfile,
  preferredCropIds = [],
  selectedCropId,
  onSelectCrop,
  language
}) => {
  const initialCrop = selectedCropId || (preferredCropIds.length > 0 ? preferredCropIds[0] : 'bajra');
  const [activeCropId, setActiveCropId] = useState<string>(initialCrop);
  const [activeSubTab, setActiveSubTab] = useState<'12_DIMENSIONS' | 'WHAT_IF_SIMULATOR' | 'CONFIDENCE_FRAMEWORK'>('12_DIMENSIONS');
  const [selectedDimension, setSelectedDimension] = useState<RiskDimensionType>('Weather Risk');

  // Scenario Simulator State
  const [selectedShockIndex, setSelectedShockIndex] = useState<number>(0);

  // Available selector crops
  const availableCrops = useMemo(() => {
    if (preferredCropIds.length > 0) {
      return preferredCropIds.map(id => getCanonicalCropById(id)).filter(Boolean);
    }
    return [
      getCanonicalCropById('bajra'),
      getCanonicalCropById('onion'),
      getCanonicalCropById('tomato'),
      getCanonicalCropById('soybean'),
      getCanonicalCropById('wheat'),
      getCanonicalCropById('cotton'),
      getCanonicalCropById('turmeric')
    ].filter(Boolean);
  }, [preferredCropIds]);

  // Compute 12-Dimensional Risk Assessment
  const riskProfile = useMemo(() => {
    return agriculturalRiskEngineService.evaluateRisk({
      cropId: activeCropId,
      location: farmerLocation,
      landProfile,
      soilProfile
    });
  }, [activeCropId, farmerLocation, landProfile, soilProfile]);

  // Compute Active Scenario Simulation
  const currentShock = scenarioEngineService.PREDEFINED_SHOCKS[selectedShockIndex] || scenarioEngineService.PREDEFINED_SHOCKS[0];
  const scenarioImpact = useMemo(() => {
    return scenarioEngineService.simulateScenario(activeCropId, currentShock);
  }, [activeCropId, currentShock]);

  const activeCropMeta = useMemo(() => {
    return getCanonicalCropById(activeCropId);
  }, [activeCropId]);

  const dimensionIcons: Record<RiskDimensionType, any> = {
    'Weather Risk': CloudRain,
    'Production Risk': Bug,
    'Price Risk': IndianRupee,
    'Demand Risk': Scale,
    'Supply Risk': Layers,
    'Input Cost Risk': TrendingUp,
    'Water Risk': Droplets,
    'Logistics Risk': Truck,
    'Trade Risk': Globe2,
    'Policy Risk': FileCheck2,
    'Climate Risk': AlertTriangle,
    'Geopolitical Risk': Compass
  };

  return (
    <div className="space-y-6 pb-20">
      {/* HEADER CARD */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 flex items-center justify-center font-black">
                <ShieldAlert className="w-5 h-5" />
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                {language === 'en' ? 'FARMFIT Agricultural Risk & Scenario Engine' : 'फार्मफ़िट व्यापक कृषि जोखिम एवं परिदृश्य इंजन'}
              </h1>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 font-medium max-w-2xl">
              12-Dimensional actuarial risk matrix grounded in ICAR agronomy, IMD weather stations, CACP costs, and AGMARKNET price volatility indices.
            </p>
          </div>

          <DataStatusBadge
            status="LATEST_AVAILABLE"
            sourceText="ICAR / IMD / CACP / AGMARKNET"
            dateText="2024-25 Grounded"
            size="sm"
          />
        </div>

        {/* CROP SELECTOR BAR */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {language === 'en' ? 'Target Crop Analysis:' : 'लक्षित फसल:'}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {availableCrops.map((c) => {
                if (!c) return null;
                const isSelected = c.cropId === activeCropId;
                return (
                  <button
                    key={c.cropId}
                    type="button"
                    onClick={() => {
                      setActiveCropId(c.cropId);
                      if (onSelectCrop) onSelectCrop(c.cropId);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-rose-600 text-white shadow-xs'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-rose-300'
                    }`}
                  >
                    {c.cropName.split('(')[0].trim()}
                  </button>
                );
              })}
            </div>
          </div>

          {/* COMPOSITE RISK BADGE */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="text-right">
              <div className="text-[10px] uppercase font-bold text-slate-400">Composite Risk Score</div>
              <div className="text-base font-black text-slate-900 dark:text-white">
                {riskProfile.overallCompositeRiskScore}/100
              </div>
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-black uppercase ${
              riskProfile.overallRiskLevel === 'LOW' 
                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                : riskProfile.overallRiskLevel === 'MODERATE'
                ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
            }`}>
              {riskProfile.overallRiskLevel} Risk
            </div>
          </div>
        </div>

        {/* SUB-TABS */}
        <div className="flex items-center gap-2 mt-6 border-b border-slate-100 dark:border-slate-800 pb-2">
          <button
            type="button"
            onClick={() => setActiveSubTab('12_DIMENSIONS')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-2 ${
              activeSubTab === '12_DIMENSIONS'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            12-Dimensional Risk Radar
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('WHAT_IF_SIMULATOR')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-2 ${
              activeSubTab === 'WHAT_IF_SIMULATOR'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            What-If Scenario Simulator
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('CONFIDENCE_FRAMEWORK')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-2 ${
              activeSubTab === 'CONFIDENCE_FRAMEWORK'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Confidence & Provenance
          </button>
        </div>
      </div>

      {/* VIEW 1: 12-DIMENSIONAL RISK RADAR */}
      {activeSubTab === '12_DIMENSIONS' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* 12 DIMENSIONS GRID */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {(Object.keys(riskProfile.dimensions) as RiskDimensionType[]).map((dim) => {
              const assessment = riskProfile.dimensions[dim];
              const Icon = dimensionIcons[dim] || AlertTriangle;
              const isSelected = selectedDimension === dim;

              return (
                <div
                  key={dim}
                  onClick={() => setSelectedDimension(dim)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer text-left ${
                    isSelected
                      ? 'border-rose-500 bg-rose-50/50 dark:bg-rose-950/40 ring-2 ring-rose-500/20 shadow-xs'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                      assessment.riskLevel === 'LOW'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : assessment.riskLevel === 'MODERATE'
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                    }`}>
                      {assessment.riskLevel}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-xs text-slate-900 dark:text-white leading-tight">
                    {dim}
                  </h3>
                  <div className="flex items-baseline justify-between mt-2">
                    <span className="text-[11px] text-slate-500">Risk Score</span>
                    <span className="text-sm font-black text-slate-900 dark:text-white">{assessment.riskScore}/100</span>
                  </div>

                  <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full mt-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        assessment.riskScore < 35 ? 'bg-emerald-500' : assessment.riskScore < 60 ? 'bg-amber-500' : 'bg-rose-500'
                      }`}
                      style={{ width: `${assessment.riskScore}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* ACTIVE DIMENSION DRILL-DOWN PANEL */}
          <div className="lg:col-span-4 space-y-4">
            {riskProfile.dimensions[selectedDimension] && (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div className="flex items-center gap-2.5">
                    {(() => {
                      const Icon = dimensionIcons[selectedDimension] || AlertTriangle;
                      return (
                        <div className="p-2.5 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300">
                          <Icon className="w-5 h-5" />
                        </div>
                      );
                    })()}
                    <div>
                      <h4 className="font-black text-sm text-slate-900 dark:text-white">
                        {selectedDimension}
                      </h4>
                      <span className="text-[10px] font-bold text-slate-500 uppercase">
                        Actuarial Factor Analysis
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-base font-black text-slate-900 dark:text-white">
                      {riskProfile.dimensions[selectedDimension].riskScore}/100
                    </span>
                    <span className="text-[10px] block text-slate-400 font-bold uppercase">Score</span>
                  </div>
                </div>

                {/* Primary Drivers */}
                <div className="space-y-2">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500 block">
                    Observed Key Drivers
                  </span>
                  <ul className="space-y-2">
                    {riskProfile.dimensions[selectedDimension].drivers.map((drv, i) => (
                      <li key={i} className="text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2 bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                        <span>{drv}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Mitigation Strategies */}
                <div className="space-y-2">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 block">
                    Actionable Agronomic & Market Mitigation
                  </span>
                  <ul className="space-y-2">
                    {riskProfile.dimensions[selectedDimension].mitigationStrategies.map((mit, i) => (
                      <li key={i} className="text-xs text-slate-800 dark:text-slate-200 flex items-start gap-2 bg-emerald-50/60 dark:bg-emerald-950/30 p-2.5 rounded-xl border border-emerald-100 dark:border-emerald-900/50">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                        <span>{mit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Grounded Data Sources */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Grounded Official Benchmarks
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {riskProfile.dimensions[selectedDimension].dataSources.map((src, i) => (
                      <span key={i} className="text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded-md">
                        {src}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW 2: WHAT-IF SCENARIO SIMULATOR */}
      {activeSubTab === 'WHAT_IF_SIMULATOR' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs">
            <div className="mb-6">
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                Select Exogenous Shock Scenario
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                Simulate how climate anomalies, global tariff adjustments, diesel freight inflation, and price collapses propagate to farm-gate margins.
              </p>
            </div>

            {/* PREDEFINED SHOCK CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              {scenarioEngineService.PREDEFINED_SHOCKS.map((sh, idx) => {
                const isSelected = selectedShockIndex === idx;
                return (
                  <button
                    key={sh.shockType}
                    type="button"
                    onClick={() => setSelectedShockIndex(idx)}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-950 dark:text-indigo-200 ring-2 ring-indigo-500/20 shadow-xs'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                    }`}
                  >
                    <div className="font-extrabold text-xs">{sh.shockType}</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                      {sh.description}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* PROPAGATION RESULTS GRID */}
            <div className="p-6 rounded-3xl bg-slate-900 text-white space-y-6 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/30 text-indigo-300 text-xs font-semibold">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>Propagation Shock Result: {activeCropMeta?.cropName || activeCropId}</span>
                  </div>
                  <h4 className="text-xl font-black mt-1 text-white">
                    {currentShock.shockType}
                  </h4>
                </div>

                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Farmer Net Realization</span>
                  <div className={`text-xl font-black flex items-center justify-end gap-1 ${
                    scenarioImpact.farmerNetIncomeChangePercent >= 0 ? 'text-emerald-400' : 'text-rose-400'
                  }`}>
                    {scenarioImpact.farmerNetIncomeChangePercent >= 0 ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                    <span>{scenarioImpact.farmerNetIncomeChangePercent > 0 ? `+${scenarioImpact.farmerNetIncomeChangePercent}%` : `${scenarioImpact.farmerNetIncomeChangePercent}%`}</span>
                  </div>
                </div>
              </div>

              {/* 4 MULTI-STAGE PROPAGATION METRICS */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Yield Impact</div>
                  <div className={`text-lg font-black mt-1 ${scenarioImpact.yieldImpactPercent < 0 ? 'text-rose-400' : 'text-slate-200'}`}>
                    {scenarioImpact.yieldImpactPercent > 0 ? `+${scenarioImpact.yieldImpactPercent}%` : `${scenarioImpact.yieldImpactPercent}%`}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Per-acre harvested output</div>
                </div>

                <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Wholesale Price Impact</div>
                  <div className={`text-lg font-black mt-1 ${scenarioImpact.priceImpactPercent < 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {scenarioImpact.priceImpactPercent > 0 ? `+${scenarioImpact.priceImpactPercent}%` : `${scenarioImpact.priceImpactPercent}%`}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">AGMARKNET modal price shift</div>
                </div>

                <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
                  <div className="text-[10px] uppercase font-bold text-slate-400">FPO Value at Risk</div>
                  <div className="text-lg font-black mt-1 text-amber-400">
                    {scenarioImpact.fpoValueAtRiskPercent}%
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Aggregated pool exposure</div>
                </div>

                <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Corporate Procurement Exposure</div>
                  <div className="text-lg font-black mt-1 text-indigo-300">
                    {scenarioImpact.corporateProcurementExposurePercent > 0 ? `+${scenarioImpact.corporateProcurementExposurePercent}%` : `${scenarioImpact.corporateProcurementExposurePercent}%`}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Input raw material inflation</div>
                </div>
              </div>

              {/* RECOMMENDED INTERVENTIONS */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  Recommended Tactical Interventions for this Scenario
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {scenarioImpact.recommendedInterventions.map((rec, i) => (
                    <div key={i} className="text-xs text-slate-200 bg-slate-800/60 p-3 rounded-xl border border-slate-700 flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                      <span>{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: CONFIDENCE & PROVENANCE FRAMEWORK */}
      {activeSubTab === 'CONFIDENCE_FRAMEWORK' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white">
              FARMFIT Traceable Data Provenance & Confidence Architecture
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              Zero-fabrication principle: every price, cost benchmark, agronomic baseline, and risk coefficient carries explicit mathematical provenance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700 space-y-2">
              <div className="text-[10px] uppercase font-bold text-slate-400">Empirical Freshness Tier</div>
              <div className="text-base font-black text-emerald-600 dark:text-emerald-400">
                LATEST_OFFICIAL_DATA
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Directly indexed from Ministry of Agriculture & Farmers Welfare, DMI AGMARKNET, and CACP official gazettes.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700 space-y-2">
              <div className="text-[10px] uppercase font-bold text-slate-400">Historical Observation Depth</div>
              <div className="text-base font-black text-indigo-600 dark:text-indigo-400">
                365+ Daily Market Bulletins
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Verified daily wholesale arrival records across active principal APMC yards within 200 km radius.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700 space-y-2">
              <div className="text-[10px] uppercase font-bold text-slate-400">Actuarial Calibration</div>
              <div className="text-base font-black text-slate-900 dark:text-white">
                12 Risk Dimensions
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Comprehensive modeling spanning weather, price volatility, input costs, trade barriers, and hydrological stress.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
