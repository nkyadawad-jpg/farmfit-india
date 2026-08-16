import React from 'react';
import { LandAndIrrigation, WaterSource, IrrigationMethod, Language } from '../../types';
import { Layers, Droplets, Gauge, ArrowRight, ArrowLeft } from 'lucide-react';
import { DataStatusBadge } from '../DataStatusBadge';

interface StepLandIrrigationProps {
  landAndIrrigation: LandAndIrrigation;
  onChange: (data: LandAndIrrigation) => void;
  onNext: () => void;
  onBack: () => void;
  language: Language;
}

export const StepLandIrrigation: React.FC<StepLandIrrigationProps> = ({
  landAndIrrigation,
  onChange,
  onNext,
  onBack,
  language
}) => {
  const waterSources: WaterSource[] = [
    'Borewell / Tube Well',
    'Canal Command Area',
    'Open Dug Well',
    'River / Lift Irrigation',
    'Farm Pond / Check Dam',
    'Rainfed Only (No assured irrigation)'
  ];

  const irrigationMethods: IrrigationMethod[] = [
    'Drip Irrigation (Micro-irrigation)',
    'Sprinkler Irrigation',
    'Furrow / Ridge Irrigation',
    'Flood / Basin Irrigation'
  ];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-5 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300 flex items-center justify-center text-xs font-bold">
              3
            </span>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {language === 'en' ? 'Land Allocation & Irrigation Infrastructure' : 'भूमि आवंटन एवं सिंचाई अवसंरचना'}
            </h2>
          </div>
          <p className="text-xs text-slate-700 dark:text-slate-200 mt-1">
            {language === 'en'
              ? 'Assess farm water security, pump availability, topography, and field drainage capacity.'
              : 'खेत की जल सुरक्षा, पंप क्षमता, ढलान और जल निकासी का आकलन करें।'}
          </p>
        </div>

        <DataStatusBadge
          status="LATEST_AVAILABLE"
          sourceText="Farmer Farm Parameter Declaration"
          dateText="Active Session"
          size="sm"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Total Farm Land Size */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              <Layers className="inline w-3.5 h-3.5 mr-1 text-emerald-600" />
              {language === 'en' ? 'Total Farm Holding (Acres)' : 'कुल भूमि जोत (एकड़)'}
            </label>
            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
              {landAndIrrigation.totalLandAcres} Acres (~{(landAndIrrigation.totalLandAcres * 0.4047).toFixed(1)} Hectares)
            </span>
          </div>
          <input
            type="number"
            min={0.5}
            max={100}
            step={0.5}
            value={landAndIrrigation.totalLandAcres}
            onChange={(e) => {
              const val = Math.max(0.5, Number(e.target.value));
              onChange({
                ...landAndIrrigation,
                totalLandAcres: val,
                plannedLandAllocationAcres: Math.min(landAndIrrigation.plannedLandAllocationAcres, val)
              });
            }}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            id="input-total-acres"
          />
        </div>

        {/* Planned Land for this Calculation */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              {language === 'en' ? 'Land to Allocate for Target Season (Acres)' : 'लक्षित सीजन हेतु आवंटित भूमि (एकड़)'}
            </label>
            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
              {landAndIrrigation.plannedLandAllocationAcres} Acres
            </span>
          </div>
          <input
            type="number"
            min={0.5}
            max={landAndIrrigation.totalLandAcres}
            step={0.5}
            value={landAndIrrigation.plannedLandAllocationAcres}
            onChange={(e) => onChange({ ...landAndIrrigation, plannedLandAllocationAcres: Math.min(landAndIrrigation.totalLandAcres, Math.max(0.5, Number(e.target.value))) })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            id="input-allocated-acres"
          />
        </div>

        {/* Primary Water Source */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
            <Droplets className="inline w-3.5 h-3.5 mr-1 text-blue-600" />
            {language === 'en' ? 'Primary Water Source' : 'प्राथमिक जल स्रोत'}
          </label>
          <select
            value={landAndIrrigation.primaryWaterSource}
            onChange={(e) => onChange({ ...landAndIrrigation, primaryWaterSource: e.target.value as WaterSource })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden cursor-pointer"
            id="select-water-source"
          >
            {waterSources.map((ws) => (
              <option key={ws} value={ws}>{ws}</option>
            ))}
          </select>
        </div>

        {/* Irrigation Method */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
            {language === 'en' ? 'Irrigation Delivery Method' : 'सिंचाई वितरण विधि'}
          </label>
          <select
            value={landAndIrrigation.irrigationMethod}
            onChange={(e) => onChange({ ...landAndIrrigation, irrigationMethod: e.target.value as IrrigationMethod })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden cursor-pointer"
            id="select-irrigation-method"
          >
            {irrigationMethods.map((im) => (
              <option key={im} value={im}>{im}</option>
            ))}
          </select>
        </div>

        {/* Daily Water Availability Hours */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              <Gauge className="inline w-3.5 h-3.5 mr-1 text-emerald-600" />
              {language === 'en' ? 'Daily Pumping / Water Hours Available' : 'दैनिक बिजली / जल उपलब्धता (घंटे)'}
            </label>
            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
              {landAndIrrigation.dailyWaterAvailabilityHours} Hours/Day
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={14}
            step={1}
            value={landAndIrrigation.dailyWaterAvailabilityHours}
            onChange={(e) => onChange({ ...landAndIrrigation, dailyWaterAvailabilityHours: Number(e.target.value) })}
            className="w-full accent-emerald-600 cursor-pointer"
            id="range-water-hours"
          />
          <div className="flex justify-between text-[11px] text-slate-600 dark:text-slate-300 mt-1">
            <span>0 hrs (Rainfed)</span>
            <span>6-8 hrs (Standard Rural Grid)</span>
            <span>12+ hrs</span>
          </div>
        </div>

        {/* Field Drainage */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
            {language === 'en' ? 'Field Drainage Capacity' : 'खेत जल निकासी क्षमता'}
          </label>
          <select
            value={landAndIrrigation.drainageCapacity}
            onChange={(e) => onChange({ ...landAndIrrigation, drainageCapacity: e.target.value as any })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden cursor-pointer"
            id="select-drainage"
          >
            <option value="Good (No waterlogging)">Good (No waterlogging, quick percolation)</option>
            <option value="Moderate">Moderate (Transient standing water after heavy rain)</option>
            <option value="Poor (Prone to water stagnation)">Poor (Prone to chronic water stagnation / clayey lowland)</option>
          </select>
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

        <button
          onClick={onNext}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs tracking-wide shadow-md transition-all cursor-pointer"
          id="btn-next-soil"
        >
          <span>{language === 'en' ? 'Next: Soil Intelligence' : 'अगला: मृदा स्वास्थ्य'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
