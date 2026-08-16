import React from 'react';
import { FlaskConical, CheckCircle2, AlertCircle, FileCheck2, Info } from 'lucide-react';
import { CalculationEngineResult, Language } from '../types';
import { DataStatusBadge } from '../components/DataStatusBadge';

interface SoilIntelligenceViewProps {
  result: CalculationEngineResult | null;
  language: Language;
}

export const SoilIntelligenceView: React.FC<SoilIntelligenceViewProps> = ({ result, language }) => {
  const soil = result?.payload.soil || {
    soilOrder: 'Black Cotton Soil (Vertisols)',
    ph: 7.2,
    organicCarbonPercent: 0.55,
    availableNitrogenKgPerHa: 'Low (< 280)',
    availablePhosphorusKgPerHa: 'Medium (10 - 25)',
    availablePotassiumKgPerHa: 'High (> 280)',
    soilDepth: 'Deep (> 50 cm)',
    hasSoilHealthCard: true
  };

  return (
    <div className="space-y-6 pb-16">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 flex items-center justify-center">
                <FlaskConical className="w-5 h-5" />
              </span>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                Soil Health & Nutrient Intelligence Matrix
              </h1>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              Calibrated with Soil Health Card (SHC) guidelines, ICAR soil orders, and nutrient response curves.
            </p>
          </div>

          <DataStatusBadge
            status="LATEST_AVAILABLE"
            sourceText="Soil Health Card Scheme (DAC&FW)"
            dateText="National Grid Benchmark"
            size="sm"
          />
        </div>

        {/* Current Farm Soil Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700">
            <span className="text-[11px] font-semibold text-slate-500 block uppercase">Soil Taxonomy</span>
            <span className="text-base font-extrabold text-slate-900 dark:text-white mt-1 block">
              {soil.soilOrder}
            </span>
            <span className="text-[10px] text-slate-400">Vertisols (High montmorillonite clay)</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700">
            <span className="text-[11px] font-semibold text-slate-500 block uppercase">Reaction (pH Level)</span>
            <span className="text-base font-extrabold text-slate-900 dark:text-white mt-1 block">
              pH {soil.ph}
            </span>
            <span className="text-[10px] text-emerald-600 font-semibold">Optimal for most field crops</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700">
            <span className="text-[11px] font-semibold text-slate-500 block uppercase">Organic Carbon (OC %)</span>
            <span className="text-base font-extrabold text-slate-900 dark:text-white mt-1 block">
              {soil.organicCarbonPercent}%
            </span>
            <span className="text-[10px] text-amber-600 font-semibold">Medium (Needs FYM / Compost)</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700">
            <span className="text-[11px] font-semibold text-slate-500 block uppercase">Rooting Depth</span>
            <span className="text-base font-extrabold text-slate-900 dark:text-white mt-1 block">
              {soil.soilDepth}
            </span>
            <span className="text-[10px] text-slate-400">Excellent water-holding capacity</span>
          </div>
        </div>
      </div>

      {/* Macronutrient & Micronutrient Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Nitrogen (N) Status</span>
          <div className="text-lg font-black text-rose-600 dark:text-rose-400">{soil.availableNitrogenKgPerHa}</div>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Most Indian soils test low in available nitrogen. Supplement via split doses of Urea and incorporate legume green manuring.
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Phosphorus (P₂O₅) Status</span>
          <div className="text-lg font-black text-emerald-600 dark:text-emerald-400">{soil.availablePhosphorusKgPerHa}</div>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Moderate availability. Apply single superphosphate (SSP) or DAP as basal placement at root depth for optimal uptake.
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Potassium (K₂O) Status</span>
          <div className="text-lg font-black text-blue-600 dark:text-blue-400">{soil.availablePotassiumKgPerHa}</div>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Rich clay minerals supply adequate potassium. Maintenance Muriate of Potash (MOP) dosage required for high-yielding hybrids.
          </p>
        </div>
      </div>
    </div>
  );
};
