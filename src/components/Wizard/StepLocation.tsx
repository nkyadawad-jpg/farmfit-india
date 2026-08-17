import React from 'react';
import { FarmLocation, Language } from '../../types';
import { IMD_METADATA } from '../../data/officialData';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { DataStatusBadge } from '../DataStatusBadge';
import { LocationEngine } from '../FarmProfile/LocationEngine';

interface StepLocationProps {
  location: FarmLocation;
  onChange: (location: FarmLocation) => void;
  onNext: () => void;
  onBack: () => void;
  language: Language;
}

export const StepLocation: React.FC<StepLocationProps> = ({
  location,
  onChange,
  onNext,
  onBack,
  language
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300 flex items-center justify-center text-xs font-bold">
              2
            </span>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {language === 'en' ? 'Farm Location & GPS Geolocation Engine' : 'खेत का स्थान एवं भू-स्थानिक (GPS) इंजन'}
            </h2>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
            {language === 'en'
              ? 'Multi-mode location detection (GPS, Map pin drop, Google Maps share URL, or administrative catalog) mapped to official ICAR zones & open elevation data.'
              : 'जीपीएस, मैप पिन, गूगल मैप्स लिंक या प्रशासनिक सूची द्वारा खेत का सटीक स्थान निर्धारित करें।'}
          </p>
        </div>

        <DataStatusBadge
          metadata={IMD_METADATA}
          size="sm"
        />
      </div>

      {/* Production-Ready Farm Location Engine */}
      <LocationEngine
        location={location}
        onChange={onChange}
        language={language}
      />

      <div className="flex flex-col sm:flex-row justify-between gap-3 pt-2">
        <button
          type="button"
          onClick={onBack}
          id="btn-back-profile"
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{language === 'en' ? 'BACK TO FARMER PROFILE' : 'किसान प्रोफ़ाइल पर वापस'}</span>
        </button>

        <button
          type="button"
          onClick={onNext}
          id="btn-continue-land"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all cursor-pointer"
        >
          <span>{language === 'en' ? 'CONTINUE TO LAND & IRRIGATION' : 'भूमि एवं सिंचाई पर आगे बढ़ें'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
