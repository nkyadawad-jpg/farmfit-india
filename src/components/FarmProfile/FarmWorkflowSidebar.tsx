import React from 'react';
import { 
  User, 
  MapPin, 
  Layers, 
  FlaskConical, 
  Wheat, 
  CloudSun,
  Calculator, 
  CheckCircle2, 
  ChevronRight,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { 
  FarmerProfile, 
  FarmLocation, 
  LandAndIrrigation, 
  SoilIntelligence, 
  CropSeason, 
  Language 
} from '../../types';

export interface FarmWorkflowSidebarProps {
  currentStep: number;
  onSelectStep: (stepNumber: number) => void;
  farmer: FarmerProfile;
  location: FarmLocation;
  land: LandAndIrrigation;
  soil: SoilIntelligence;
  targetSeason: CropSeason;
  preferredCropIds: string[];
  onCalculate: () => void;
  language: Language;
}

export const FarmWorkflowSidebar: React.FC<FarmWorkflowSidebarProps> = ({
  currentStep,
  onSelectStep,
  farmer,
  location,
  land,
  soil,
  targetSeason,
  preferredCropIds,
  onCalculate,
  language
}) => {
  const steps = [
    {
      id: 1,
      title: language === 'en' ? 'Farmer Details' : 'किसान विवरण',
      subtitle: farmer.name ? `${farmer.name}` : (language === 'en' ? 'Basic Information' : 'मूलभूत जानकारी'),
      detail: farmer.farmerType ? `${farmer.farmerType.split(' ')[0]}` : '',
      icon: User,
      isCompleted: Boolean(farmer.name && farmer.workingCapitalBudget > 0)
    },
    {
      id: 2,
      title: language === 'en' ? 'Farm Location' : 'खेत का स्थान',
      subtitle: location.district ? `${location.district}, ${location.state}` : (language === 'en' ? 'Geospatial & Zone' : 'भू-स्थानिक क्षेत्र'),
      detail: location.agroClimaticZoneId ? `Zone ${location.agroClimaticZoneId}` : '',
      icon: MapPin,
      isCompleted: Boolean(location.state && location.district)
    },
    {
      id: 3,
      title: language === 'en' ? 'Land & Irrigation' : 'भूमि एवं सिंचाई',
      subtitle: `${land.totalLandAcres || 0} Acres Total`,
      detail: land.irrigationReliabilityScore100 ? `${land.irrigationReliabilityScore100}% Reliability` : (land.primaryWaterSource || ''),
      icon: Layers,
      isCompleted: Boolean(land.totalLandAcres > 0)
    },
    {
      id: 4,
      title: language === 'en' ? 'Soil Intelligence' : 'मृदा स्वास्थ्य (Soil)',
      subtitle: soil.soilOrder ? soil.soilOrder.split(' ')[0] : 'Soil Parameters',
      detail: soil.ph ? `pH ${soil.ph} • ${soil.hasSoilHealthCard ? 'SHC Card' : 'Lab Test'}` : '',
      icon: FlaskConical,
      isCompleted: Boolean(soil.soilOrder && soil.ph > 0)
    },
    {
      id: 5,
      title: language === 'en' ? 'Crop Selection' : 'फसल चयन',
      subtitle: `${targetSeason} Season`,
      detail: `${preferredCropIds.length} candidate crops`,
      icon: Wheat,
      isCompleted: Boolean(preferredCropIds.length > 0)
    },
    {
      id: 6,
      title: language === 'en' ? 'Weather Intelligence' : 'मौसम इंटेलिजेंस',
      subtitle: location.latitude ? `Live Open-Meteo Feed` : (language === 'en' ? 'Agro-Met Forecast' : 'मौसम पूर्वानुमान'),
      detail: location.normalAnnualRainfallMm ? `${location.normalAnnualRainfallMm}mm Normal` : '10-Day Horizon',
      icon: CloudSun,
      isCompleted: Boolean(location.latitude && location.longitude)
    },
    {
      id: 7,
      title: language === 'en' ? 'FARMFIT Calculation Engine' : 'गणना इंजन (Engine)',
      subtitle: language === 'en' ? 'Simulation & CACP Model' : 'सिमुलेशन व परिणाम',
      detail: language === 'en' ? 'Ready to execute' : 'गणना तैयार',
      icon: Calculator,
      isCompleted: false
    }
  ];

  return (
    <aside 
      className="w-full lg:w-72 shrink-0 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-5 shadow-xs flex flex-col justify-between self-start sticky top-24 z-10"
      aria-label="Farm Workflow Sidebar"
      id="farm-workflow-sidebar"
    >
      <div>
        {/* Sidebar Header */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-700 dark:text-emerald-400 block">
              FARM WORKFLOW
            </span>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              {language === 'en' ? 'Decision Pipeline' : 'निर्णय कार्यप्रवाह'}
            </h3>
          </div>
          <span className="text-[11px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300">
            {currentStep > 0 ? `Step ${currentStep}/6` : '6 Steps'}
          </span>
        </div>

        {/* Workflow Steps List */}
        <nav className="space-y-2" aria-label="Workflow Navigation">
          {steps.map((step) => {
            const Icon = step.icon;
            const isActive = currentStep > 0 && currentStep === step.id;
            const isCompleted = step.isCompleted && (!isActive || currentStep === 0);

            return (
              <button
                key={step.id}
                type="button"
                id={`workflow-step-${step.id}`}
                onClick={() => onSelectStep(step.id)}
                className={`w-full flex items-center justify-between p-3 rounded-2xl text-left transition-all cursor-pointer group select-none ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25 font-bold ring-2 ring-emerald-500'
                    : isCompleted
                    ? 'bg-emerald-50/70 dark:bg-emerald-950/30 text-slate-800 dark:text-slate-200 hover:bg-emerald-100/80 dark:hover:bg-emerald-950/60 border border-emerald-200/50 dark:border-emerald-800/40'
                    : 'bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-100 dark:border-slate-700/50'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0 pointer-events-none">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                      isActive
                        ? 'bg-emerald-700 text-white shadow-xs'
                        : isCompleted
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300'
                        : 'bg-slate-200/70 dark:bg-slate-700 text-slate-600 dark:text-slate-300 group-hover:bg-slate-300/70'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-700 dark:text-emerald-300" />
                    ) : (
                      <Icon className="w-4 h-4" />
                    )}
                  </div>

                  <div className="truncate">
                    <div className="flex items-center gap-1.5">
                      <span className={`text-xs truncate ${isActive ? 'text-white font-bold' : 'font-semibold text-slate-900 dark:text-white'}`}>
                        {step.id}. {step.title}
                      </span>
                    </div>
                    <p className={`text-[10px] truncate ${isActive ? 'text-emerald-100' : 'text-slate-500 dark:text-slate-400'}`}>
                      {step.subtitle}
                    </p>
                  </div>
                </div>

                <ChevronRight
                  className={`w-4 h-4 shrink-0 transition-transform pointer-events-none ${
                    isActive ? 'text-emerald-200 translate-x-0.5' : 'text-slate-400 group-hover:translate-x-0.5'
                  }`}
                />
              </button>
            );
          })}
        </nav>
      </div>

      {/* Quick Launch Engine Action */}
      <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
        <button
          type="button"
          onClick={onCalculate}
          id="sidebar-calculate-btn"
          className="w-full flex items-center justify-center gap-2 py-3 px-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs tracking-wide shadow-md transition-all cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-emerald-200" />
          <span>{language === 'en' ? 'Run Calculation Engine' : 'गणना इंजन चलाएं'}</span>
        </button>
        <p className="text-[10px] text-center text-slate-500 dark:text-slate-400">
          CACP 2024-25 &bull; Agmarknet &bull; ICAR Standards
        </p>
      </div>
    </aside>
  );
};
