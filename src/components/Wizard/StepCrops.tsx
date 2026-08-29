import React from 'react';
import { 
  CropSeason, 
  Language, 
  FarmLocation, 
  LandIrrigationProfile, 
  SoilProfileRecord 
} from '../../types';
import { CACP_METADATA_2024_25 } from '../../data/officialData';
import { 
  Calendar, 
  Calculator, 
  ArrowLeft, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  CloudSun,
  Layers
} from 'lucide-react';
import { DataStatusBadge } from '../DataStatusBadge';
import { CropCommoditySelector } from '../Crops/CropCommoditySelector';

interface StepCropsProps {
  targetSeason: CropSeason;
  onSeasonChange: (season: CropSeason) => void;
  preferredCropIds: string[];
  onTogglePreferredCrop: (id: string) => void;
  onSelectCrops?: (ids: string[]) => void;
  onClearAllCrops?: () => void;
  farmerLocation?: FarmLocation;
  landProfile?: Partial<LandIrrigationProfile>;
  soilProfile?: Partial<SoilProfileRecord>;
  onBack: () => void;
  onNext?: () => void;
  onRunEngine: () => void;
  language: Language;
}

export const StepCrops: React.FC<StepCropsProps> = ({
  targetSeason,
  onSeasonChange,
  preferredCropIds,
  onTogglePreferredCrop,
  onSelectCrops,
  onClearAllCrops,
  farmerLocation,
  landProfile,
  soilProfile,
  onBack,
  onNext,
  onRunEngine,
  language
}) => {
  const seasons: CropSeason[] = ['Kharif', 'Rabi', 'Zaid', 'Annual / Commercial'];

  return (
    <div className="space-y-6">
      {/* SEASON SELECTION HEADER CARD */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-5 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300 flex items-center justify-center text-xs font-black">
                5
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                {language === 'en' ? 'Target Season & Crop Preferences' : 'लक्षित सीजन एवं फसल प्राथमिकताएं'}
              </h2>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 font-medium">
              {language === 'en'
                ? 'Select planting season and candidate crops, vegetables, spices or fruits from the complete Indian commodity master.'
                : 'बुआई सीजन और अखिल भारतीय कृषि मास्टर से अपनी पसंद की फसलें, सब्जियां और मसाले चुनें।'}
            </p>
          </div>

          <DataStatusBadge
            metadata={CACP_METADATA_2024_25}
            size="sm"
          />
        </div>

        {/* Season Selection Buttons */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-3">
            <Calendar className="inline w-3.5 h-3.5 mr-1 text-emerald-600" />
            {language === 'en' ? 'Select Target Agricultural Season' : 'लक्षित कृषि सीजन चुनें'}
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {seasons.map((s) => {
              const isSelected = targetSeason === s;
              const seasonDesc = s === 'Kharif' ? 'Monsoon (Jun-Nov)' : s === 'Rabi' ? 'Winter (Oct-Apr)' : s === 'Zaid' ? 'Summer (Mar-Jun)' : 'Perennial / Year-Round';
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => onSeasonChange(s)}
                  className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-950 dark:bg-emerald-950/60 dark:text-emerald-200 ring-2 ring-emerald-500/30 shadow-xs font-black'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                  }`}
                >
                  <div className="font-extrabold text-sm">{s}</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{seasonDesc}</div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* UNIVERSAL ALL INDIA CROP & COMMODITY SELECTOR */}
      <CropCommoditySelector
        selectedCropIds={preferredCropIds}
        onToggleCrop={onTogglePreferredCrop}
        onSelectCrops={onSelectCrops}
        onClearAllCrops={onClearAllCrops}
        targetSeason={targetSeason}
        farmerLocation={farmerLocation}
        landProfile={landProfile}
        soilProfile={soilProfile}
        onFindBestCropsRequested={onRunEngine}
      />

      {/* DECISION ENGINE ACTION CTA BANNER */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-800 to-emerald-950 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 text-center md:text-left">
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/30 text-emerald-200 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>FARMFIT Multi-Variable Decision Engine Ready</span>
            </div>
            <h3 className="text-xl font-black tracking-tight text-white">
              {preferredCropIds.length > 0
                ? `Evaluate ${preferredCropIds.length} Selected Crops with Real Mandi Prices & Costs`
                : 'Evaluate Complete Crop Master Universe for Best Farm Match'}
            </h3>
            <p className="text-xs text-emerald-200/90 max-w-xl">
              Executes simultaneous calculations across 16 dimensions: soil suitability, water balance, 200 km AGMARKNET APMC freight deductions, CACP costs, MSP parity, and market profit ranking.
            </p>
          </div>

          <button
            type="button"
            onClick={onRunEngine}
            className="px-8 py-4 rounded-2xl bg-white hover:bg-emerald-50 active:bg-emerald-100 text-emerald-950 font-black text-sm sm:text-base tracking-wide shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3 cursor-pointer shrink-0"
            id="btn-calculate-my-farm-main"
          >
            <Calculator className="w-5 h-5 text-emerald-700" />
            <span>CALCULATE MY FARM</span>
          </button>
        </div>
      </div>

      {/* NAVIGATION CONTROLS */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs transition-all cursor-pointer w-full sm:w-auto justify-center"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{language === 'en' ? 'Back: Soil Intelligence' : 'पीछे: मृदा स्वास्थ्य'}</span>
        </button>

        {onNext && (
          <button
            onClick={onNext}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs transition-all cursor-pointer w-full sm:w-auto justify-center"
          >
            <CloudSun className="w-4 h-4" />
            <span>{language === 'en' ? 'Next: Weather Intelligence' : 'आगे: मौसम इंटेलिजेंस'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
