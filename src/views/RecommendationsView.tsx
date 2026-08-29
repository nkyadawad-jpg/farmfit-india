import React, { useState } from 'react';
import { 
  CalculationEngineResult, 
  CropEvaluation, 
  Language 
} from '../types';
import { 
  Wheat, 
  TrendingUp, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  IndianRupee, 
  Scale, 
  Droplets, 
  FlaskConical, 
  Truck, 
  FileText, 
  ChevronRight,
  Info,
  Sparkles
} from 'lucide-react';
import { DataStatusBadge } from '../components/DataStatusBadge';
import { useTranslation } from '../locales/translations';

interface RecommendationsViewProps {
  result: CalculationEngineResult | null;
  onSelectCropForDetails?: (cropId: string) => void;
  onNavigateToReport: () => void;
  onNavigateToRouting: () => void;
  onNavigateToDecision?: () => void;
  language: Language;
}

export const RecommendationsView: React.FC<RecommendationsViewProps> = ({
  result,
  onNavigateToReport,
  onNavigateToRouting,
  onNavigateToDecision,
  language
}) => {
  const [selectedCropId, setSelectedCropId] = useState<string | null>(null);
  const [scenarioMode, setScenarioMode] = useState<'base' | 'worst' | 'best'>('base');
  const t = useTranslation(language);

  if (!result) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-10 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
          <Wheat className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
          No Farm Calculation Executed Yet
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto">
          Please run the primary wizard by clicking &ldquo;CALCULATE MY FARM&rdquo; to generate customized crop suitability, CACP cost projections, and market rankings.
        </p>
      </div>
    );
  }

  const { recommendedCrops = [], conditionallyRecommendedCrops = [], cropsToAvoid = [], payload } = result;
  
  const location = payload?.location || (payload as any)?.farmLocation || {
    district: 'Selected District',
    state: 'State',
    agroClimaticZoneId: 1
  };
  const land = payload?.landAndIrrigation || {
    plannedLandAllocationAcres: 1,
    totalLandAcres: 1,
    primaryWaterSource: 'Assured Irrigation',
    irrigationMethod: 'Standard'
  };
  const soil = payload?.soil || (payload as any)?.soilIntelligence || {
    soilOrder: 'Native Soil',
    ph: 7.0,
    hasSoilHealthCard: false
  };

  const allAvailableCrops = [...recommendedCrops, ...conditionallyRecommendedCrops, ...cropsToAvoid];
  const activeCrop = allAvailableCrops.find((c) => c.crop.id === selectedCropId) || recommendedCrops[0] || conditionallyRecommendedCrops[0] || cropsToAvoid[0];

  return (
    <div className="space-y-8 pb-16">
      {/* CROP SCAN RESULTS Header */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-lg border border-emerald-800/40 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              CROP SCAN RESULTS &bull; {result.calculationId}
            </span>
            <DataStatusBadge
              metadata={result.metadata}
              size="sm"
            />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            {language === 'en' ? 'Farm Decision & Crop Suitability Rankings' : 'फार्म निर्णय एवं फसल उपयुक्तता रैंकिंग'}
          </h1>
          
          {/* Farm Baseline Summary Matrix */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-xs border border-white/10">
              <span className="text-[10px] uppercase font-bold text-emerald-200 block">Farm Location</span>
              <span className="text-xs font-bold text-white truncate block">
                {location.district || 'District'}, {location.state || 'State'}
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-xs border border-white/10">
              <span className="text-[10px] uppercase font-bold text-emerald-200 block">Farm Area</span>
              <span className="text-xs font-bold text-white block">
                {land.plannedLandAllocationAcres || land.totalLandAcres || 1} Acres Allocated
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-xs border border-white/10">
              <span className="text-[10px] uppercase font-bold text-emerald-200 block">Irrigation Status</span>
              <span className="text-xs font-bold text-white truncate block">
                {land.irrigationMethod || land.primaryWaterSource || 'Standard'}
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-xs border border-white/10">
              <span className="text-[10px] uppercase font-bold text-emerald-200 block">Soil Data Status</span>
              <span className="text-xs font-bold text-white block">
                {soil.hasSoilHealthCard ? 'Verified Lab Test' : 'Baseline Parameters'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          {onNavigateToDecision && (
            <button
              onClick={onNavigateToDecision}
              className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>Risk-Adjusted Decision Engine</span>
            </button>
          )}
          <button
            onClick={onNavigateToReport}
            className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow transition-all flex items-center gap-2 cursor-pointer"
          >
            <FileText className="w-4 h-4" />
            <span>Download Farm Report</span>
          </button>
        </div>
      </div>

      {/* Insufficient Data Notice if applicable */}
      {recommendedCrops.length === 0 && (
        <div className="p-6 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-center space-y-2">
          <AlertTriangle className="w-8 h-8 text-amber-600 dark:text-amber-400 mx-auto" />
          <h3 className="font-bold text-base text-slate-900 dark:text-white">
            Insufficient data to determine crop suitability.
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md mx-auto">
            Please verify your soil parameters, water source, or land allocation to ensure sufficient agronomic information.
          </p>
        </div>
      )}

      {/* Top Recommended Crops List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <span>{t.recommendedTitle}</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-black">
                {recommendedCrops.length} Crops
              </span>
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Optimal agro-climatic &amp; economic alignment. Ranked by FARMFIT Suitability Index (0-100).
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {recommendedCrops.map((evalItem, idx) => {
            const isSelected = activeCrop?.crop.id === evalItem.crop.id;
            const scenario = evalItem.baseScenario;

            return (
              <div
                key={evalItem.crop.id}
                onClick={() => setSelectedCropId(evalItem.crop.id)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'border-emerald-600 bg-white dark:bg-slate-900 ring-2 ring-emerald-500 shadow-md'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-slate-300'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-black flex items-center justify-center">
                          #{idx + 1}
                        </span>
                        <h3 className="font-bold text-base text-slate-900 dark:text-white">
                          {evalItem.crop.name}
                        </h3>
                      </div>
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-medium ml-7">
                        {evalItem.crop.hindiName} &bull; {evalItem.crop.category}
                      </span>
                    </div>

                    <div className="text-right">
                      <div className="text-lg font-black text-emerald-600 dark:text-emerald-400">
                        {evalItem.overallSuitabilityScore}
                        <span className="text-xs font-medium text-slate-400">/100</span>
                      </div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">
                        Suitability
                      </span>
                    </div>
                  </div>

                  {/* Key Metrics Grid */}
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                    <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 block uppercase font-semibold">
                        Expected Base Yield
                      </span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        {evalItem.crop.avgYieldQuintalPerAcre} Qtl/Acre
                      </span>
                    </div>

                    <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 block uppercase font-semibold">
                        Net Profit (A2+FL)
                      </span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">
                        +₹{scenario.netProfitA2FLPerAcre.toLocaleString('en-IN')}/Ac
                      </span>
                    </div>

                    <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 block uppercase font-semibold">
                        ROI (A2+FL Cost)
                      </span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">
                        {scenario.roiA2FLPercent}%
                      </span>
                    </div>

                    <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 block uppercase font-semibold">
                        Notified MSP
                      </span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        {evalItem.crop.mspNotified ? `₹${evalItem.crop.mspPrice2024_25}/Qtl` : 'No MSP'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                  <span>View Full Dossier</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Conditionally Recommended Crops (Manageable Constraints) */}
      {conditionallyRecommendedCrops.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                <span>Conditionally Recommended Crops</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-black">
                  {conditionallyRecommendedCrops.length} Crops &bull; Manageable
                </span>
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Viable and profitable if specific field-level water deficits, soil corrections, or inputs are managed.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {conditionallyRecommendedCrops.map((evalItem, idx) => {
              const isSelected = activeCrop?.crop.id === evalItem.crop.id;
              const scenario = evalItem.baseScenario;
              const mgmtCost = evalItem.conditionalManagementPlan?.totalAdditionalManagementCostPerAcre || 0;

              return (
                <div
                  key={evalItem.crop.id}
                  onClick={() => setSelectedCropId(evalItem.crop.id)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'border-amber-500 bg-amber-50/20 dark:bg-amber-950/20 ring-2 ring-amber-400 shadow-md'
                      : 'border-amber-200 dark:border-amber-900/60 bg-white dark:bg-slate-900 hover:border-amber-300'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-xs font-black flex items-center justify-center">
                            #{idx + 1}
                          </span>
                          <h3 className="font-bold text-base text-slate-900 dark:text-white">
                            {evalItem.crop.name}
                          </h3>
                        </div>
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium ml-7">
                          {evalItem.crop.hindiName} &bull; {evalItem.crop.category}
                        </span>
                      </div>

                      <div className="text-right">
                        <div className="text-lg font-black text-amber-600 dark:text-amber-400">
                          {evalItem.overallSuitabilityScore}
                          <span className="text-xs font-medium text-slate-400">/100</span>
                        </div>
                        <span className="text-[10px] uppercase font-bold text-amber-500 block">
                          Conditional
                        </span>
                      </div>
                    </div>

                    {/* Manageable Note */}
                    <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200/60 dark:border-amber-800/60 text-xs text-amber-900 dark:text-amber-200">
                      <span className="font-bold block">Manageable Requirement:</span>
                      <span className="text-[11px] block mt-0.5">
                        {evalItem.conditionalManagementPlan?.recommendedInterventions[0]?.action || 'Requires supplemental irrigation or soil amendment.'}
                      </span>
                    </div>

                    {/* Key Metrics Grid */}
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                      <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 block uppercase font-semibold">
                          Expected Yield
                        </span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                          {evalItem.crop.avgYieldQuintalPerAcre} Qtl/Ac
                        </span>
                      </div>

                      <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 block uppercase font-semibold">
                          Net Profit (Base)
                        </span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">
                          +₹{scenario.netProfitA2FLPerAcre.toLocaleString('en-IN')}/Ac
                        </span>
                      </div>

                      <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 block uppercase font-semibold">
                          Extra Mitigation
                        </span>
                        <span className="font-bold text-amber-700 dark:text-amber-400">
                          +₹{mgmtCost.toLocaleString('en-IN')}/Ac
                        </span>
                      </div>

                      <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 block uppercase font-semibold">
                          Water Deficit
                        </span>
                        <span className="font-bold text-sky-700 dark:text-sky-300">
                          {evalItem.waterFeasibility?.netWaterDeficitMm || 0} mm
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-amber-200/60 dark:border-amber-900/60 flex items-center justify-between text-xs font-semibold text-amber-700 dark:text-amber-400">
                    <span>Inspect Management Plan</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Selected Crop Deep-Dive Dossier */}
      {activeCrop && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                  {activeCrop.crop.name} ({activeCrop.crop.hindiName})
                </h3>
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                  activeCrop.threeTierVerdict === 'RECOMMENDED'
                    ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                    : activeCrop.threeTierVerdict === 'CONDITIONALLY_RECOMMENDED'
                    ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
                    : 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300'
                }`}>
                  {activeCrop.threeTierVerdict?.replace(/_/g, ' ') || `Rank #${activeCrop.ranking}`}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Botanical: <em>{activeCrop.crop.botanicalName}</em> &bull; Duration: <strong>{activeCrop.crop.durationDays} Days</strong> &bull; Sowing: <strong>{activeCrop.crop.sowingWindow}</strong>
              </p>
            </div>

            {/* Scenario Switcher */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold self-start md:self-auto">
              <button
                onClick={() => setScenarioMode('worst')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  scenarioMode === 'worst' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Worst Case (Stress)
              </button>
              <button
                onClick={() => setScenarioMode('base')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  scenarioMode === 'base' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Base Case (Normal)
              </button>
              <button
                onClick={() => setScenarioMode('best')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  scenarioMode === 'best' ? 'bg-teal-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Best Case (Optimal)
              </button>
            </div>
          </div>

          {/* Scenario Profitability Numbers */}
          {(() => {
            const sc = scenarioMode === 'worst' ? activeCrop?.worstScenario : scenarioMode === 'best' ? activeCrop?.bestScenario : activeCrop?.baseScenario;
            const plannedAcres = land?.plannedLandAllocationAcres || (payload as any)?.landAndIrrigation?.plannedLandAllocationAcres || (payload as any)?.land?.plannedLandAllocationAcres || 1;
            
            if (!sc) {
              return (
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 text-center text-xs text-slate-500">
                  Scenario profitability model computing...
                </div>
              );
            }

            const totalFarmProfitA2FL = (sc.netProfitA2FLPerAcre || 0) * plannedAcres;
            const totalFarmProfitC2 = (sc.netProfitC2PerAcre || 0) * plannedAcres;

            return (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block uppercase">
                    Expected Yield
                  </span>
                  <span className="text-xl font-extrabold text-slate-900 dark:text-white mt-1 block">
                    {sc.yieldQuintalsPerAcre || 0} Qtl/Acre
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Total: {((sc.yieldQuintalsPerAcre || 0) * plannedAcres).toFixed(1)} Quintals
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block uppercase">
                    Gross Revenue
                  </span>
                  <span className="text-xl font-extrabold text-slate-900 dark:text-white mt-1 block">
                    ₹{(sc.grossRevenuePerAcre || 0).toLocaleString('en-IN')}/Ac
                  </span>
                  <span className="text-[11px] text-slate-500">
                    At ₹{sc.expectedPricePerQuintal || 0}/Qtl
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block uppercase">
                    CACP A2+FL Net Profit
                  </span>
                  <span className={`text-xl font-extrabold mt-1 block ${(sc.netProfitA2FLPerAcre || 0) >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600'}`}>
                    ₹{(sc.netProfitA2FLPerAcre || 0).toLocaleString('en-IN')}/Ac
                  </span>
                  <span className="text-[11px] text-slate-500">
                    ROI: {sc.roiA2FLPercent || 0}% (A2+FL basis)
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block uppercase">
                    Comprehensive C2 Profit
                  </span>
                  <span className={`text-xl font-extrabold mt-1 block ${(sc.netProfitC2PerAcre || 0) >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600'}`}>
                    ₹{(sc.netProfitC2PerAcre || 0).toLocaleString('en-IN')}/Ac
                  </span>
                  <span className="text-[11px] text-slate-500">
                    ROI: {sc.roiC2Percent || 0}% (C2 basis)
                  </span>
                </div>
              </div>
            );
          })()}

          {/* Water Feasibility Analysis Card */}
          {activeCrop.waterFeasibility && (
            <div className="p-5 rounded-2xl bg-sky-50/70 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-sky-950 dark:text-sky-200 flex items-center gap-2">
                  <Droplets className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                  Water Balance &amp; Irrigation Feasibility
                </h4>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded bg-sky-200 dark:bg-sky-900 text-sky-900 dark:text-sky-200">
                  {activeCrop.waterFeasibility.feasibilityStatus.replace(/_/g, ' ')}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-sky-100 dark:border-sky-900">
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Crop Requirement</span>
                  <span className="font-black text-slate-900 dark:text-white text-base">
                    {activeCrop.waterFeasibility.cropWaterRequirementMm} mm
                  </span>
                </div>
                <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-sky-100 dark:border-sky-900">
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Natural Available</span>
                  <span className="font-black text-slate-900 dark:text-white text-base">
                    {activeCrop.waterFeasibility.naturalMoistureAvailableMm} mm
                  </span>
                </div>
                <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-sky-100 dark:border-sky-900">
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Net Deficit</span>
                  <span className={`font-black text-base ${activeCrop.waterFeasibility.netWaterDeficitMm > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                    {activeCrop.waterFeasibility.netWaterDeficitMm} mm
                  </span>
                </div>
                <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-sky-100 dark:border-sky-900">
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Supplemental Cost</span>
                  <span className="font-black text-slate-900 dark:text-white text-base">
                    ₹{activeCrop.waterFeasibility.estimatedSupplementalCostPerAcre.toLocaleString('en-IN')}/Ac
                  </span>
                </div>
              </div>

              <p className="text-xs text-sky-900 dark:text-sky-300 font-medium">
                {activeCrop.waterFeasibility.feasibilitySummary}
              </p>
            </div>
          )}

          {/* Conditional Management Plan */}
          {activeCrop.conditionalManagementPlan && activeCrop.conditionalManagementPlan.recommendedInterventions.length > 0 && (
            <div className="p-5 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-amber-950 dark:text-amber-200 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  Required Conditional Management Plan
                </h4>
                <span className="text-xs font-black text-amber-900 dark:text-amber-300">
                  Total Interventions: +₹{activeCrop.conditionalManagementPlan.totalAdditionalManagementCostPerAcre.toLocaleString('en-IN')}/acre
                </span>
              </div>

              <div className="space-y-2">
                {activeCrop.conditionalManagementPlan.recommendedInterventions.map((item, idx) => (
                  <div key={idx} className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-amber-200 dark:border-amber-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white block">{item.interventionName}</span>
                      <span className="text-slate-600 dark:text-slate-400 text-[11px]">{item.action} &bull; Required: <strong>{item.requiredInputs.join(', ')}</strong></span>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="font-black text-amber-700 dark:text-amber-400 text-sm">
                        +₹{item.estimatedCostPerAcre.toLocaleString('en-IN')}/ac
                      </span>
                      <span className="block text-[10px] text-slate-400">{item.timing}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-[11px] text-amber-900 dark:text-amber-300 italic pt-1">
                * Note: With these interventions implemented, projected ROI remains viable at <strong>+{activeCrop.conditionalManagementPlan.expectedRoiAfterManagementPercent}%</strong> (A2+FL).
              </div>
            </div>
          )}


          {/* CACP Cost Decomposition Bar */}
          <div className="p-5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/60 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                Official CACP Production Cost Standards per Quintal
              </span>
              <DataStatusBadge metadata={activeCrop.crop.metadata} size="sm" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                <span className="font-semibold text-slate-600 dark:text-slate-300 block">Cost A2 (Paid-out Inputs)</span>
                <span className="text-base font-extrabold text-slate-900 dark:text-white">₹{activeCrop.crop.cacpCostPerQuintalA2} / Qtl</span>
                <p className="text-[10px] text-slate-500 mt-0.5">Seeds, fertilizers, diesel, hired labour, pesticides</p>
              </div>

              <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                <span className="font-semibold text-slate-600 dark:text-slate-300 block">Cost A2+FL (Official Benchmark)</span>
                <span className="text-base font-extrabold text-slate-900 dark:text-white">₹{activeCrop.crop.cacpCostPerQuintalA2FL} / Qtl</span>
                <p className="text-[10px] text-slate-500 mt-0.5">A2 + imputed value of family labour (MSP base)</p>
              </div>

              <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                <span className="font-semibold text-slate-600 dark:text-slate-300 block">Cost C2 (Comprehensive)</span>
                <span className="text-base font-extrabold text-slate-900 dark:text-white">₹{activeCrop.crop.cacpCostPerQuintalC2} / Qtl</span>
                <p className="text-[10px] text-slate-500 mt-0.5">A2+FL + rental value of owned land & capital interest</p>
              </div>
            </div>
          </div>

          {/* Key Strengths and Warnings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-2">
              <h4 className="font-bold text-xs uppercase tracking-wider text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Agronomic & Economic Advantages</span>
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                {activeCrop.keyStrengths.map((str, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-emerald-600 font-bold">&bull;</span>
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 space-y-2">
              <h4 className="font-bold text-xs uppercase tracking-wider text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Operational Risk Advisories</span>
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                {activeCrop.keyRiskWarnings.length > 0 ? (
                  activeCrop.keyRiskWarnings.map((warn, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-amber-600 font-bold">&bull;</span>
                      <span>{warn}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-slate-500 italic">No critical agronomic or market red flags detected.</li>
                )}
              </ul>
            </div>
          </div>

          {/* Optimal Market Routing Banner */}
          {activeCrop.bestMandi && (
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                  <Truck className="w-5 h-5" />
                </div>
                <div className="text-xs">
                  <span className="font-bold text-slate-900 dark:text-white block">
                    Best APMC Mandi: {activeCrop.bestMandi.mandiName || 'Nearby APMC Mandi'} {activeCrop.bestMandi.distanceKm !== null && activeCrop.bestMandi.distanceKm !== undefined ? `(~${activeCrop.bestMandi.distanceKm} km)` : ''}
                  </span>
                  <span className="text-slate-500 dark:text-slate-400">
                    Modal Price: <strong>{activeCrop.bestMandi.modalPricePerQuintal !== null && activeCrop.bestMandi.modalPricePerQuintal !== undefined ? `₹${activeCrop.bestMandi.modalPricePerQuintal}/Qtl` : 'DATA UNAVAILABLE'}</strong>
                    {activeCrop.bestMandi.netRealizationPerQuintal !== null && activeCrop.bestMandi.netRealizationPerQuintal !== undefined ? (
                      <> &bull; Net Realization: <strong className="text-emerald-600">₹{activeCrop.bestMandi.netRealizationPerQuintal.toFixed(1)}/Qtl</strong></>
                    ) : (
                      <> &bull; Net Realization: <span className="italic text-slate-400">NET REALIZATION NOT AVAILABLE</span></>
                    )}
                  </span>
                </div>
              </div>

              <button
                onClick={onNavigateToRouting}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow cursor-pointer shrink-0"
              >
                Inspect Mandi Comparison Matrix
              </button>
            </div>
          )}
        </div>
      )}

      {/* Crops to Avoid Section */}
      {cropsToAvoid.length > 0 && (
        <div className="bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 rounded-3xl p-6 sm:p-8 space-y-4">
          <div>
            <h3 className="text-lg font-bold text-rose-900 dark:text-rose-300 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-600" />
              <span>{t.avoidTitle}</span>
            </h3>
            <p className="text-xs text-rose-700 dark:text-rose-400 mt-0.5">
              {t.avoidSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {cropsToAvoid.map((avoidItem) => (
              <div
                key={avoidItem.crop.id}
                className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-900 shadow-2xs space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-slate-900 dark:text-white">
                    {avoidItem.crop.name} ({avoidItem.crop.hindiName})
                  </span>
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-900/60 text-rose-800 dark:text-rose-300">
                    Flagged: Not Recommended
                  </span>
                </div>

                <p className="text-xs text-rose-700 dark:text-rose-300 font-medium">
                  Reason: {avoidItem.avoidReason || 'Suitability score falls below acceptable threshold.'}
                </p>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Water Requirement: {avoidItem.crop.waterRequirementMm} mm</span>
                  <span>FARMFIT Score: {avoidItem.overallSuitabilityScore}/100</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
