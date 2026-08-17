import React from 'react';
import { SoilIntelligence, Language, FarmLocation } from '../../types';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { SoilEngine } from '../FarmProfile/SoilEngine';

interface StepSoilProps {
  soil: SoilIntelligence;
  farmLocation: FarmLocation;
  onChange: (soil: SoilIntelligence) => void;
  onNext: () => void;
  onBack: () => void;
  language: Language;
}

export const StepSoil: React.FC<StepSoilProps> = ({
  soil,
  farmLocation,
  onChange,
  onNext,
  onBack,
  language
}) => {
  return (
    <div className="space-y-6">
      {/* Soil Intelligence Engine Dashboard & Forms */}
      <SoilEngine
        soilData={soil}
        farmLocation={farmLocation}
        onChange={onChange}
        language={language}
      />

      {/* Navigation Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200 dark:border-slate-800">
        <button
          onClick={onBack}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700/70 text-slate-700 dark:text-slate-200 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-xs"
          id="btn-back-land-irrigation"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{language === 'en' ? 'BACK TO LAND & IRRIGATION' : 'भूमि एवं सिंचाई पर वापस जाएं'}</span>
        </button>

        <button
          onClick={onNext}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs tracking-wider uppercase shadow-md hover:shadow-lg transition-all cursor-pointer"
          id="btn-continue-crop-selection"
        >
          <span>{language === 'en' ? 'CONTINUE TO CROP SELECTION' : 'फसल चयन के लिए आगे बढ़ें'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
