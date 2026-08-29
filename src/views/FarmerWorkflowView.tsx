import React, { useState } from 'react';
import { FarmLocation, LandAndIrrigation, SoilIntelligence, CropSeason, Language } from '../types';
import { StepLocation } from '../components/Wizard/StepLocation';
import { StepLandIrrigation } from '../components/Wizard/StepLandIrrigation';
import { StepSoil } from '../components/Wizard/StepSoil';
import { FarmerDecisionView } from './FarmerDecisionView';
import { Compass, CheckCircle2, MapPin, Layers, FlaskConical, Sparkles } from 'lucide-react';

interface FarmerWorkflowViewProps {
  location: FarmLocation;
  setLocation: (loc: FarmLocation) => void;
  land: LandAndIrrigation;
  setLand: (land: LandAndIrrigation) => void;
  soil: SoilIntelligence;
  setSoil: (soil: SoilIntelligence) => void;
  language: Language;
}

export const FarmerWorkflowView: React.FC<FarmerWorkflowViewProps> = ({
  location, setLocation, land, setLand, soil, setSoil, language
}) => {
  const [step, setStep] = useState(1);
  const [analyzing, setAnalyzing] = useState(false);

  const handleAnalyze = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      setStep(4);
    }, 1500);
  };

  const steps = [
    { num: 1, label: 'Location', icon: MapPin },
    { num: 2, label: 'Farm Info', icon: Layers },
    { num: 3, label: 'Soil', icon: FlaskConical },
    { num: 4, label: 'Recommendation', icon: Sparkles }
  ];

  return (
    <div className="space-y-6">
      {/* Workflow Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">Farmer Decision Workflow</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">Discover what to grow and where to sell for maximum profitability.</p>
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            const isActive = step === s.num;
            const isPast = step > s.num;
            return (
              <React.Fragment key={s.num}>
                <button 
                  onClick={() => setStep(s.num)}
                  disabled={s.num === 4 && step < 4}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${
                    isActive ? 'bg-emerald-600 text-white shadow-md' :
                    isPast ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800' :
                    'bg-slate-50 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  {isPast ? <CheckCircle2 className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                  <span>{s.num}. {s.label}</span>
                </button>
                {idx < steps.length - 1 && (
                  <div className={`w-8 h-0.5 rounded-full ${isPast ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-700'}`} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4">Step 1: Where is your farm?</h2>
            <StepLocation location={location} onChange={setLocation} onNext={() => setStep(2)} onBack={() => {}} language={language} />
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4">Step 2: Farm Characteristics</h2>
            <StepLandIrrigation landAndIrrigation={land} onChange={setLand} onNext={() => setStep(3)} onBack={() => setStep(1)} language={language} />
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4">Step 3: Soil Profile (Optional)</h2>
            <StepSoil soil={soil} farmLocation={location} onChange={setSoil} onNext={handleAnalyze} onBack={() => setStep(2)} language={language} />
            <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
              <button 
                onClick={handleAnalyze} 
                disabled={analyzing}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all shadow-md flex items-center gap-2"
              >
                {analyzing ? (
                  <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Analyzing...</>
                ) : (
                  <><Sparkles className="w-5 h-5" /> Run FARMFIT Analysis</>
                )}
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <FarmerDecisionView 
              farmLocation={location} 
              landProfile={land} 
              soilProfile={soil}
              language={language}
            />
          </div>
        )}
      </div>
    </div>
  );
};
