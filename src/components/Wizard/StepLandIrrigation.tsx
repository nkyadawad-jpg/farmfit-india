import React from 'react';
import { LandAndIrrigation, Language } from '../../types';
import { Layers, ArrowRight, ArrowLeft } from 'lucide-react';
import { DataStatusBadge } from '../DataStatusBadge';
import { LandEngine } from '../FarmProfile/LandEngine';

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
  return (
    <div className="space-y-8" id="step-land-irrigation-root">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300 flex items-center justify-center text-xs font-bold">
              3
            </span>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {language === 'en' ? 'Land & Irrigation Intelligence' : 'भूमि एवं सिंचाई बुद्धिमत्ता'}
            </h2>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
            {language === 'en'
              ? 'Multi-unit Indian land standardizer, crop area allocation, multi-plot architecture, and transparent FARMFIT Irrigation Reliability Engine.'
              : 'भारतीय भूमि इकाइयों का मानकीकरण, फसल क्षेत्र आवंटन, बहु-प्लॉट ढांचा तथा पारदर्शी सिंचाई विश्वसनीयता मॉडल।'}
          </p>
        </div>

        <DataStatusBadge
          status="LATEST_AVAILABLE"
          sourceText="Farmer Farm Parameter Declaration & Hydrological Model"
          dateText="Active Session"
          size="sm"
        />
      </div>

      {/* Complete Land & Irrigation Engine */}
      <LandEngine
        landData={landAndIrrigation}
        onChange={onChange}
        language={language}
      />

      {/* Step Navigation Actions */}
      <div className="flex flex-col sm:flex-row justify-between gap-3 pt-2">
        <button
          type="button"
          onClick={onBack}
          id="btn-back-farm-location"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>BACK TO FARM LOCATION</span>
        </button>

        <button
          type="button"
          onClick={onNext}
          id="btn-continue-soil-intelligence"
          className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all cursor-pointer"
        >
          <span>CONTINUE TO SOIL INTELLIGENCE</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
