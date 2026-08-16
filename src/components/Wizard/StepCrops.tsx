import React from 'react';
import { CropSeason, Language } from '../../types';
import { MASTER_CROPS, CACP_METADATA_2024_25 } from '../../data/officialData';
import { Wheat, Calendar, Calculator, ArrowLeft, ShieldCheck, Sparkles } from 'lucide-react';
import { DataStatusBadge } from '../DataStatusBadge';

interface StepCropsProps {
  targetSeason: CropSeason;
  onSeasonChange: (season: CropSeason) => void;
  preferredCropIds: string[];
  onTogglePreferredCrop: (id: string) => void;
  onBack: () => void;
  onRunEngine: () => void;
  language: Language;
}

export const StepCrops: React.FC<StepCropsProps> = ({
  targetSeason,
  onSeasonChange,
  preferredCropIds,
  onTogglePreferredCrop,
  onBack,
  onRunEngine,
  language
}) => {
  const seasons: CropSeason[] = ['Kharif', 'Rabi', 'Zaid', 'Annual / Commercial'];

  const seasonCrops = MASTER_CROPS.filter(
    (c) => targetSeason === 'Annual / Commercial' || c.season === targetSeason || c.season === 'Annual / Commercial'
  );

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-5 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300 flex items-center justify-center text-xs font-bold">
              5
            </span>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {language === 'en' ? 'Target Season & Crop Preferences' : 'लक्षित सीजन एवं फसल प्राथमिकताएं'}
            </h2>
          </div>
          <p className="text-xs text-slate-700 dark:text-slate-200 mt-1">
            {language === 'en'
              ? 'Select planting season and optional candidate crops for comparative profitability evaluation.'
              : 'बुआई सीजन और तुलनात्मक लाभ मूल्यांकन हेतु फसलें चुनें।'}
          </p>
        </div>

        <DataStatusBadge
          metadata={CACP_METADATA_2024_25}
          size="sm"
        />
      </div>

      <div className="space-y-6">
        {/* Season Selection */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-3">
            <Calendar className="inline w-3.5 h-3.5 mr-1 text-emerald-600" />
            {language === 'en' ? 'Select Target Agricultural Season' : 'लक्षित कृषि सीजन चुनें'}
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {seasons.map((s) => {
              const isSelected = targetSeason === s;
              const seasonDesc = s === 'Kharif' ? 'Monsoon Sown (Jun-Nov)' : s === 'Rabi' ? 'Winter Sown (Oct-Apr)' : s === 'Zaid' ? 'Summer (Mar-Jun)' : 'Sugarcane / Perennial';
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => onSeasonChange(s)}
                  className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-950 dark:bg-emerald-950/60 dark:text-emerald-200 ring-2 ring-emerald-500 shadow-xs'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                  }`}
                >
                  <div className="font-bold text-sm">{s}</div>
                  <div className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">{seasonDesc}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Candidate Crops Available for Evaluation */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              <Wheat className="inline w-3.5 h-3.5 mr-1 text-emerald-600" />
              {language === 'en' ? 'Candidate Crops in Database for this Season' : 'इस सीजन हेतु उपलब्ध फसलें'}
            </label>
            <span className="text-xs text-slate-700 dark:text-slate-300">
              {seasonCrops.length} Crops Analyzed Simultaneously
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {seasonCrops.map((crop) => {
              const isPreferred = preferredCropIds.includes(crop.id);
              return (
                <div
                  key={crop.id}
                  onClick={() => onTogglePreferredCrop(crop.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isPreferred
                      ? 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/50 ring-1 ring-emerald-500'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 bg-white dark:bg-slate-800/40'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-slate-900 dark:text-white">
                        {crop.name}
                      </span>
                      {crop.mspNotified && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300">
                          MSP ₹{crop.mspPrice2024_25}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-700 dark:text-slate-300 mt-0.5 font-medium">
                      {crop.hindiName} &bull; {crop.category}
                    </p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-[11px] text-slate-700 dark:text-slate-300">
                    <span>Duration: <strong>{crop.durationDays} days</strong></span>
                    <span>Water: <strong>{crop.waterRequirementMm} mm</strong></span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Central Action CTA Banner */}
        <div className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-emerald-800 to-emerald-950 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1.5 text-center md:text-left">
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/30 text-emerald-200 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>FARMFIT Multi-Variable Decision Engine Ready</span>
              </div>
              <h3 className="text-xl font-black tracking-tight text-white">
                Ready to Compute Optimal Crop, Costs & Markets
              </h3>
              <p className="text-xs text-emerald-200/90 max-w-xl">
                Executes simultaneous calculations across 16 dimensions: soil suitability, water balance, CACP A2+FL & C2 costs, MSP safety margins, APMC freight deductions, and supply-demand risk.
              </p>
            </div>

            <button
              type="button"
              onClick={onRunEngine}
              className="px-8 py-4 rounded-xl bg-white hover:bg-emerald-50 active:bg-emerald-100 text-emerald-950 font-black text-sm sm:text-base tracking-wide shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3 cursor-pointer shrink-0"
              id="btn-calculate-my-farm-main"
            >
              <Calculator className="w-5 h-5 text-emerald-700" />
              <span>CALCULATE MY FARM</span>
            </button>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{language === 'en' ? 'Back' : 'पीछे'}</span>
        </button>
      </div>
    </div>
  );
};
