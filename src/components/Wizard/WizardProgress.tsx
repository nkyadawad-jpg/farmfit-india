import React from 'react';
import { User, MapPin, Layers, FlaskConical, Wheat, CloudSun, Calculator, Check } from 'lucide-react';
import { Language } from '../../types';
import { useTranslation } from '../../locales/translations';

interface WizardProgressProps {
  currentStep: number;
  onStepClick: (step: number) => void;
  language: Language;
}

export const WizardProgress: React.FC<WizardProgressProps> = ({
  currentStep,
  onStepClick,
  language
}) => {
  const t = useTranslation(language);

  const steps = [
    { num: 1, label: language === 'en' ? 'Farmer Details' : 'किसान विवरण', icon: User },
    { num: 2, label: language === 'en' ? 'Location' : 'स्थान', icon: MapPin },
    { num: 3, label: language === 'en' ? 'Land & Water' : 'भूमि व जल', icon: Layers },
    { num: 4, label: language === 'en' ? 'Soil Health' : 'मृदा स्वास्थ्य', icon: FlaskConical },
    { num: 5, label: language === 'en' ? 'Crop Intent' : 'फसल चयन', icon: Wheat },
    { num: 6, label: language === 'en' ? 'Weather' : 'मौसम', icon: CloudSun },
    { num: 7, label: language === 'en' ? 'Crop Scan' : 'क्रॉप स्कैन', icon: Calculator }
  ];

  return (
    <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs mb-6">
      <div className="flex items-center justify-between relative">
        {/* Connection Line */}
        <div className="absolute top-1/2 left-6 right-6 -translate-y-1/2 h-1 bg-slate-100 dark:bg-slate-800 z-0 hidden sm:block" />
        
        {steps.map((step) => {
          const Icon = step.icon;
          const isCompleted = currentStep > step.num;
          const isCurrent = currentStep === step.num;

          return (
            <button
              key={step.num}
              onClick={() => onStepClick(step.num)}
              className="relative z-10 flex flex-col items-center group cursor-pointer"
            >
              <div
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-200 ${
                  isCurrent
                    ? 'bg-emerald-600 text-white ring-4 ring-emerald-100 dark:ring-emerald-950 scale-110 shadow-md shadow-emerald-600/30'
                    : isCompleted
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400 group-hover:bg-slate-200'
                }`}
              >
                {isCompleted ? <Check className="w-4 h-4 text-emerald-700 dark:text-emerald-400" /> : <Icon className="w-4 h-4" />}
              </div>
              <span
                className={`mt-1.5 text-[11px] sm:text-xs font-semibold whitespace-nowrap ${
                  isCurrent
                    ? 'text-emerald-800 dark:text-emerald-400 font-bold'
                    : isCompleted
                    ? 'text-slate-700 dark:text-slate-300'
                    : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                {step.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
