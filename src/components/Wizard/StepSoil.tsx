import React from 'react';
import { SoilIntelligence, SoilOrder, Language } from '../../types';
import { FlaskConical, FileCheck2, ArrowRight, ArrowLeft, AlertCircle } from 'lucide-react';
import { DataStatusBadge } from '../DataStatusBadge';

interface StepSoilProps {
  soil: SoilIntelligence;
  onChange: (soil: SoilIntelligence) => void;
  onNext: () => void;
  onBack: () => void;
  language: Language;
}

export const StepSoil: React.FC<StepSoilProps> = ({
  soil,
  onChange,
  onNext,
  onBack,
  language
}) => {
  const soilOrders: SoilOrder[] = [
    'Black Cotton Soil (Vertisols)',
    'Alluvial Soil (Entisols / Inceptisols)',
    'Red & Yellow Soil (Alfisols / Ultisols)',
    'Laterite Soil (Oxisols)',
    'Arid / Desert Soil (Aridisols)',
    'Saline / Alkaline Soil',
    'Peaty / Organic Soil'
  ];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-5 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300 flex items-center justify-center text-xs font-bold">
              4
            </span>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {language === 'en' ? 'Soil Health & Fertility Intelligence' : 'मृदा स्वास्थ्य एवं उर्वरता बुद्धिमत्ता'}
            </h2>
          </div>
          <p className="text-xs text-slate-700 dark:text-slate-200 mt-1">
            {language === 'en'
              ? 'Calibrate agronomic suitability using your Soil Health Card (SHC) parameters or district soil baseline.'
              : 'मृदा स्वास्थ्य कार्ड (SHC) या जिला मृदा मानकों के आधार पर फसल उपयुक्तता तय करें।'}
          </p>
        </div>

        <DataStatusBadge
          status="LATEST_AVAILABLE"
          sourceText="Soil Health Card Portal (DAC&FW)"
          dateText="National Baseline Reference"
          size="sm"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Soil Order */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
            {language === 'en' ? 'Soil Taxonomy / Type' : 'मृदा प्रकार (Soil Order)'}
          </label>
          <select
            value={soil.soilOrder}
            onChange={(e) => onChange({ ...soil, soilOrder: e.target.value as SoilOrder })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden cursor-pointer"
            id="select-soil-order"
          >
            {soilOrders.map((so) => (
              <option key={so} value={so}>{so}</option>
            ))}
          </select>
        </div>

        {/* Soil Depth */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
            {language === 'en' ? 'Effective Rooting Soil Depth' : 'प्रभावी मृदा गहराई'}
          </label>
          <select
            value={soil.soilDepth}
            onChange={(e) => onChange({ ...soil, soilDepth: e.target.value as any })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden cursor-pointer"
            id="select-soil-depth"
          >
            <option value="Deep (> 50 cm)">Deep (&gt; 50 cm) - Ideal for deep taproots</option>
            <option value="Medium (25 - 50 cm)">Medium (25 - 50 cm)</option>
            <option value="Shallow (< 25 cm)">Shallow (&lt; 25 cm) - Hard pan / rocky subsoil</option>
          </select>
        </div>

        {/* Soil pH */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              <FlaskConical className="inline w-3.5 h-3.5 mr-1 text-emerald-600" />
              {language === 'en' ? 'Soil Reaction (pH Level)' : 'मृदा पीएच (pH)'}
            </label>
            <span className={`text-xs font-bold px-2 py-0.5 rounded ${
              soil.ph >= 6.5 && soil.ph <= 7.8 
                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
            }`}>
              pH {soil.ph.toFixed(1)} ({soil.ph < 6.5 ? 'Acidic' : soil.ph > 7.8 ? 'Alkaline' : 'Neutral / Ideal'})
            </span>
          </div>
          <input
            type="range"
            min={4.5}
            max={9.5}
            step={0.1}
            value={soil.ph}
            onChange={(e) => onChange({ ...soil, ph: Number(e.target.value) })}
            className="w-full accent-emerald-600 cursor-pointer"
            id="range-ph"
          />
          <div className="flex justify-between text-[11px] text-slate-600 dark:text-slate-300 mt-1">
            <span>4.5 (Acidic)</span>
            <span>7.0 (Neutral)</span>
            <span>9.5 (Alkaline)</span>
          </div>
        </div>

        {/* Soil Health Card Toggle */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
            <FileCheck2 className="inline w-3.5 h-3.5 mr-1 text-emerald-600" />
            {language === 'en' ? 'Soil Health Card (SHC) Tested?' : 'क्या मृदा स्वास्थ्य कार्ड बना है?'}
          </label>
          <div className="flex items-center gap-4 py-1.5">
            <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-800 dark:text-slate-200">
              <input
                type="radio"
                checked={soil.hasSoilHealthCard}
                onChange={() => onChange({ ...soil, hasSoilHealthCard: true })}
                className="text-emerald-600 focus:ring-emerald-500"
              />
              <span>Yes (Have Laboratory SHC Report)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-800 dark:text-slate-200">
              <input
                type="radio"
                checked={!soil.hasSoilHealthCard}
                onChange={() => onChange({ ...soil, hasSoilHealthCard: false })}
                className="text-emerald-600 focus:ring-emerald-500"
              />
              <span>No (Use District Average)</span>
            </label>
          </div>
        </div>

        {/* Available NPK status */}
        <div className="md:col-span-2 grid grid-cols-3 gap-4 pt-2">
          <div>
            <label className="block text-[11px] font-semibold uppercase text-slate-700 dark:text-slate-300 mb-1">
              Nitrogen (N)
            </label>
            <select
              value={soil.availableNitrogenKgPerHa}
              onChange={(e) => onChange({ ...soil, availableNitrogenKgPerHa: e.target.value as any })}
              className="w-full px-2.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white"
            >
              <option value="Low (< 280)">Low (&lt; 280 kg/ha)</option>
              <option value="Medium (280 - 560)">Medium (280-560 kg/ha)</option>
              <option value="High (> 560)">High (&gt; 560 kg/ha)</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold uppercase text-slate-700 dark:text-slate-300 mb-1">
              Phosphorus (P)
            </label>
            <select
              value={soil.availablePhosphorusKgPerHa}
              onChange={(e) => onChange({ ...soil, availablePhosphorusKgPerHa: e.target.value as any })}
              className="w-full px-2.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white"
            >
              <option value="Low (< 10)">Low (&lt; 10 kg/ha)</option>
              <option value="Medium (10 - 25)">Medium (10-25 kg/ha)</option>
              <option value="High (> 25)">High (&gt; 25 kg/ha)</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold uppercase text-slate-700 dark:text-slate-300 mb-1">
              Potassium (K)
            </label>
            <select
              value={soil.availablePotassiumKgPerHa}
              onChange={(e) => onChange({ ...soil, availablePotassiumKgPerHa: e.target.value as any })}
              className="w-full px-2.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white"
            >
              <option value="Low (< 108)">Low (&lt; 108 kg/ha)</option>
              <option value="Medium (108 - 280)">Medium (108-280 kg/ha)</option>
              <option value="High (> 280)">High (&gt; 280 kg/ha)</option>
            </select>
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

        <button
          onClick={onNext}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs tracking-wide shadow-md transition-all cursor-pointer"
          id="btn-next-crops"
        >
          <span>{language === 'en' ? 'Next: Crop & Planting' : 'अगला: फसल चयन'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
