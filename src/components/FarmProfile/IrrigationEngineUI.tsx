import React, { useState, useEffect } from 'react';
import { 
  Droplets, 
  Gauge, 
  CloudRain, 
  Waves, 
  Calendar, 
  AlertTriangle, 
  ShieldCheck, 
  Sliders, 
  Info, 
  CheckCircle2, 
  Layers
} from 'lucide-react';
import { LandAndIrrigation, Language } from '../../types';
import { 
  calculateIrrigationReliability, 
  DEFAULT_IRRIGATION_WEIGHTS, 
  IrrigationEngineWeights, 
  IrrigationAnalysisResult 
} from '../../services/irrigationEngine';

interface IrrigationEngineUIProps {
  landData: LandAndIrrigation;
  onChange: (data: LandAndIrrigation) => void;
  language: Language;
}

export const IrrigationEngineUI: React.FC<IrrigationEngineUIProps> = ({
  landData,
  onChange,
  language
}) => {
  const [irrigatedArea, setIrrigatedArea] = useState<number>(
    landData.irrigatedAreaAcres !== undefined ? landData.irrigatedAreaAcres : landData.totalLandAcres
  );
  const [hasBorewell, setHasBorewell] = useState<boolean>(landData.hasBorewell ?? true);
  const [hasOpenWell, setHasOpenWell] = useState<boolean>(landData.hasOpenWell ?? false);
  const [hasCanal, setHasCanal] = useState<boolean>(landData.hasCanal ?? false);
  const [hasRiverLift, setHasRiverLift] = useState<boolean>(landData.hasRiverLift ?? false);
  const [hasFarmPond, setHasFarmPond] = useState<boolean>(landData.hasFarmPond ?? false);
  const [hasDrip, setHasDrip] = useState<boolean>(landData.hasDrip ?? true);
  const [hasSprinkler, setHasSprinkler] = useState<boolean>(landData.hasSprinkler ?? false);
  const [hasFloodOther, setHasFloodOther] = useState<boolean>(landData.hasFloodOther ?? false);
  const [monthsWaterAvailable, setMonthsWaterAvailable] = useState<number>(
    landData.monthsWaterAvailable ?? 10
  );
  const [irrigationFrequency, setIrrigationFrequency] = useState<any>(
    landData.irrigationFrequency ?? 'Alternate Days'
  );
  const [sourceReliability, setSourceReliability] = useState<any>(
    landData.sourceReliabilityRating ?? 'High (Perennial / Assured)'
  );
  const [seasonalLimitations, setSeasonalLimitations] = useState<any>(
    landData.seasonalLimitations ?? 'None'
  );
  const [showMethodologyModal, setShowMethodologyModal] = useState(false);

  // Compute irrigation model
  const totalLand = Math.max(0.01, landData.totalLandAcres || 5.0);
  const safeIrrigated = Math.min(totalLand, Math.max(0, irrigatedArea));
  const safeRainfed = Math.max(0, totalLand - safeIrrigated);

  const analysis: IrrigationAnalysisResult = calculateIrrigationReliability({
    totalLandAcres: totalLand,
    irrigatedAreaAcres: safeIrrigated,
    rainfedAreaAcres: safeRainfed,
    hasBorewell,
    hasOpenWell,
    hasCanal,
    hasRiverLift,
    hasFarmPond,
    hasDrip,
    hasSprinkler,
    hasFloodOther,
    monthsWaterAvailable,
    irrigationFrequency,
    sourceReliability,
    seasonalLimitations
  });

  // Sync back to parent
  useEffect(() => {
    onChange({
      ...landData,
      irrigatedAreaAcres: safeIrrigated,
      rainfedAreaAcres: safeRainfed,
      hasBorewell,
      hasOpenWell,
      hasCanal,
      hasRiverLift,
      hasFarmPond,
      hasDrip,
      hasSprinkler,
      hasFloodOther,
      monthsWaterAvailable,
      irrigationFrequency,
      sourceReliabilityRating: sourceReliability,
      seasonalLimitations,
      irrigationReliabilityScore100: analysis.reliabilityScore,
      rainfallDependencyPercent: analysis.rainfallDependencyPercent,
      irrigatedLandPercent: analysis.irrigatedLandPercent,
      rainfedLandPercent: analysis.rainfedLandPercent,
      waterReliabilityScore: Math.max(1, Math.min(10, Math.round(analysis.reliabilityScore / 10)))
    });
  }, [
    safeIrrigated,
    safeRainfed,
    hasBorewell,
    hasOpenWell,
    hasCanal,
    hasRiverLift,
    hasFarmPond,
    hasDrip,
    hasSprinkler,
    hasFloodOther,
    monthsWaterAvailable,
    irrigationFrequency,
    sourceReliability,
    seasonalLimitations,
    analysis.reliabilityScore,
    analysis.rainfallDependencyPercent
  ]);

  return (
    <div className="space-y-8">
      {/* 1. Key Metric Dashboard */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Irrigation Reliability Score */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase font-bold text-slate-500">Irrigation Reliability</span>
            <Droplets className="w-4 h-4 text-blue-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className={`text-3xl font-black ${
              analysis.reliabilityScore >= 70 ? 'text-emerald-600 dark:text-emerald-400' :
              analysis.reliabilityScore >= 45 ? 'text-amber-600 dark:text-amber-400' :
              'text-rose-600 dark:text-rose-400'
            }`}>
              {analysis.reliabilityScore}
            </span>
            <span className="text-xs text-slate-400 font-bold">/ 100</span>
          </div>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block mt-2 ${
            analysis.waterSecurityCategory === 'High Security' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
            analysis.waterSecurityCategory === 'Moderate Security' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' :
            'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
          }`}>
            {analysis.waterSecurityCategory}
          </span>
        </div>

        {/* Rainfall Dependency */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase font-bold text-slate-500">Rainfall Dependency</span>
            <CloudRain className="w-4 h-4 text-teal-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-3xl font-black text-slate-900 dark:text-white">
              {analysis.rainfallDependencyPercent}%
            </span>
          </div>
          <p className="text-[10px] text-slate-500 mt-2">
            {analysis.rainfallDependencyPercent > 50 ? 'High vulnerability to monsoon delays' : 'Strong assured irrigation shield'}
          </p>
        </div>

        {/* Irrigated Land Ratio */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase font-bold text-slate-500">Irrigated Area</span>
            <Waves className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-3xl font-black text-emerald-700 dark:text-emerald-400">
              {analysis.irrigatedLandPercent}%
            </span>
          </div>
          <p className="text-[10px] text-slate-500 mt-2 font-medium">
            {safeIrrigated} Acres of {totalLand} Acres
          </p>
        </div>

        {/* Rainfed Area */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase font-bold text-slate-500">Rainfed (Barani) Area</span>
            <Gauge className="w-4 h-4 text-amber-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-3xl font-black text-amber-700 dark:text-amber-400">
              {analysis.rainfedLandPercent}%
            </span>
          </div>
          <p className="text-[10px] text-slate-500 mt-2 font-medium">
            {safeRainfed.toFixed(1)} Acres rain-dependent
          </p>
        </div>
      </div>

      {/* 2. Irrigation Infrastructure Details */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Droplets className="w-5 h-5 text-blue-600" />
              <span>Water Sources & Irrigation Delivery Engine</span>
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
              Specify active on-farm water sources, delivery systems, and seasonal limitations for precision water-stress modeling.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowMethodologyModal(true)}
            className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <Info className="w-4 h-4 text-emerald-600" />
            <span>Calculation Methodology</span>
          </button>
        </div>

        {/* Irrigated vs Rainfed Land Split */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Total Irrigated Land Area (Acres)
            </label>
            <input
              type="number"
              min={0}
              max={totalLand}
              step={0.1}
              value={irrigatedArea}
              onChange={(e) => setIrrigatedArea(Math.min(totalLand, Math.max(0, parseFloat(e.target.value) || 0)))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden font-bold"
            />
            <span className="text-[11px] text-slate-500 mt-1 block">
              {((safeIrrigated / totalLand) * 100).toFixed(0)}% of total farm holding ({totalLand} Acres)
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Annual Assured Water Availability Duration (Months/Year)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={1}
                max={12}
                step={1}
                value={monthsWaterAvailable}
                onChange={(e) => setMonthsWaterAvailable(parseInt(e.target.value))}
                className="flex-1 accent-emerald-600"
              />
              <span className="text-sm font-black text-slate-900 dark:text-white w-20 text-right">
                {monthsWaterAvailable} Months
              </span>
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">
              {monthsWaterAvailable >= 10 ? 'Perennial (Kharif, Rabi & Zaid supported)' : monthsWaterAvailable >= 7 ? 'Two seasons (Kharif + early Rabi)' : 'Single season (Kharif supplementary only)'}
            </span>
          </div>
        </div>

        {/* Water Sources Checkboxes */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
            Active Water Sources (Select all that apply)
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
            {[
              { label: 'Borewell / Tube Well', checked: hasBorewell, setter: setHasBorewell },
              { label: 'Open Dug Well', checked: hasOpenWell, setter: setHasOpenWell },
              { label: 'Canal Command Area', checked: hasCanal, setter: setHasCanal },
              { label: 'River / Lift Irrigation', checked: hasRiverLift, setter: setHasRiverLift },
              { label: 'Farm Pond / Check Dam', checked: hasFarmPond, setter: setHasFarmPond }
            ].map((src) => (
              <button
                type="button"
                key={src.label}
                onClick={() => src.setter(!src.checked)}
                className={`p-3 rounded-xl border text-left text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                  src.checked
                    ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-300 dark:border-blue-800 text-blue-900 dark:text-blue-200'
                    : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-400'
                }`}
              >
                <span>{src.label}</span>
                {src.checked && <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 ml-1" />}
              </button>
            ))}
          </div>
        </div>

        {/* Delivery Methods */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
            Irrigation Distribution & Micro-Irrigation Delivery Systems
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { label: 'Drip Irrigation (Micro-irrigation, 90%+ efficiency)', checked: hasDrip, setter: setHasDrip },
              { label: 'Sprinkler Irrigation (75% efficiency)', checked: hasSprinkler, setter: setHasSprinkler },
              { label: 'Surface / Furrow / Flood Distribution', checked: hasFloodOther, setter: setHasFloodOther }
            ].map((method) => (
              <button
                type="button"
                key={method.label}
                onClick={() => method.setter(!method.checked)}
                className={`p-3 rounded-xl border text-left text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                  method.checked
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                    : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-400'
                }`}
              >
                <span>{method.label}</span>
                {method.checked && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 ml-1" />}
              </button>
            ))}
          </div>
        </div>

        {/* Reliability Rating & Seasonal Limitations */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Irrigation Frequency
            </label>
            <select
              value={irrigationFrequency}
              onChange={(e) => setIrrigationFrequency(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm cursor-pointer"
            >
              <option value="Daily">Daily (Precision Drip)</option>
              <option value="Alternate Days">Alternate Days</option>
              <option value="Weekly">Weekly Cycle</option>
              <option value="Fortnightly">Fortnightly Cycle</option>
              <option value="Critical Stages Only">Critical Vegetative & Flowering Stages Only</option>
              <option value="As per Canal Roster">As per Canal Release Roster (Warabandi)</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Water Source Reliability
            </label>
            <select
              value={sourceReliability}
              onChange={(e) => setSourceReliability(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm cursor-pointer"
            >
              <option value="High (Perennial / Assured)">High (Perennial / Assured Discharge)</option>
              <option value="Moderate (Seasonal Dip)">Moderate (Seasonal Dip in Summer)</option>
              <option value="Low (Unpredictable / Depleted in Summer)">Low (Unpredictable / Critical Summer Drop)</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Seasonal Water Limitations
            </label>
            <select
              value={seasonalLimitations}
              onChange={(e) => setSeasonalLimitations(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm cursor-pointer"
            >
              <option value="None">None (Stable throughout year)</option>
              <option value="Summer Scarcity (March-June)">Summer Scarcity (March-June)</option>
              <option value="Winter & Summer Dip">Winter & Summer Water Table Dip</option>
              <option value="Kharif Only Available">Kharif Only Available</option>
              <option value="Frequent Power Roster Cuts">Frequent Electricity / Power Roster Cuts</option>
              <option value="Salinity Ingress">Salinity Ingress / Brackish Water</option>
            </select>
          </div>
        </div>

        {/* Agronomic Recommendations */}
        {analysis.recommendations.length > 0 && (
          <div className="p-4 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 space-y-1.5 text-xs">
            <span className="font-bold text-blue-900 dark:text-blue-200 block uppercase text-[10px]">
              FARMFIT Agronomic Water Advisory
            </span>
            <ul className="list-disc list-inside space-y-1 text-blue-800 dark:text-blue-300">
              {analysis.recommendations.map((rec, i) => (
                <li key={i}>{rec}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Methodology Transparent Modal / Drawer */}
      {showMethodologyModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-2xl w-full space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sliders className="w-5 h-5 text-emerald-600" />
                <span>Irrigation Reliability Calculation Methodology</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowMethodologyModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg cursor-pointer px-2"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              FARMFIT calculates the Irrigation Reliability Score (0 to 100) using a multi-parameter weighted model calibrated with hydrological benchmarks:
            </p>

            <div className="space-y-3">
              {analysis.breakdown.map((item, index) => (
                <div key={index} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="space-y-0.5">
                    <span className="font-bold text-slate-900 dark:text-white block">
                      {item.componentName} ({item.weightPercent}% Weight)
                    </span>
                    <span className="text-slate-500 text-[11px] block">{item.explanation}</span>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-extrabold text-emerald-700 dark:text-emerald-400 text-sm">
                      +{item.weightedContribution} pts
                    </span>
                    <span className="text-[10px] text-slate-400 block">Raw: {item.rawScore}/100</span>
                  </div>
                </div>
              ))}

              {analysis.seasonalPenaltyApplied > 0 && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs flex items-center justify-between text-rose-800 dark:text-rose-300">
                  <span>Seasonal Water Limitation Stress Deduction</span>
                  <span className="font-bold">-{analysis.seasonalPenaltyApplied} pts</span>
                </div>
              )}
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-900 dark:text-emerald-200">
                Final Composite Irrigation Score
              </span>
              <span className="text-xl font-black text-emerald-700 dark:text-emerald-300">
                {analysis.reliabilityScore} / 100
              </span>
            </div>

            <button
              type="button"
              onClick={() => setShowMethodologyModal(false)}
              className="w-full py-3 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow hover:bg-emerald-700 cursor-pointer"
            >
              Close Methodology
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
