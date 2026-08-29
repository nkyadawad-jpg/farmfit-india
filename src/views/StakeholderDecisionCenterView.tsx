import React, { useState } from 'react';
import { 
  Sprout, 
  Users, 
  Building2, 
  Landmark, 
  LayoutGrid, 
  ShieldCheck, 
  Sparkles,
  ChevronRight,
  Database,
  History
} from 'lucide-react';
import { 
  FarmLocation, 
  LandIrrigationProfile, 
  SoilProfileRecord, 
  FarmerProfile, 
  CropSeason,
  Language 
} from '../types';
import { StakeholderHubView } from './StakeholderHubView';
import { FarmerDecisionView } from './FarmerDecisionView';
import { FpoDecisionView } from './FpoDecisionView';
import { B2BProcurementView } from './B2BProcurementView';
import { GovernmentDecisionView } from './GovernmentDecisionView';
import { FarmfitValidationView } from './FarmfitValidationView';

interface StakeholderDecisionCenterViewProps {
  initialStakeholder?: 'hub' | 'farmer' | 'fpo' | 'b2b' | 'government' | 'validation';
  farmerProfile?: Partial<FarmerProfile>;
  farmLocation: FarmLocation;
  landProfile?: Partial<LandIrrigationProfile>;
  soilProfile?: Partial<SoilProfileRecord>;
  targetSeason?: CropSeason;
  preferredCropIds?: string[];
  selectedCropId?: string;
  onSelectCrop?: (cropId: string) => void;
  onNavigateToRouting?: () => void;
  onLaunchCalculator?: () => void;
  language: Language;
}

export const StakeholderDecisionCenterView: React.FC<StakeholderDecisionCenterViewProps> = ({
  initialStakeholder = 'hub',
  farmerProfile,
  farmLocation,
  landProfile,
  soilProfile,
  targetSeason = 'Kharif',
  preferredCropIds = [],
  selectedCropId,
  onSelectCrop,
  onNavigateToRouting,
  onLaunchCalculator,
  language
}) => {
  const [activeStakeholder, setActiveStakeholder] = useState<
    'hub' | 'farmer' | 'fpo' | 'b2b' | 'government' | 'validation'
  >(initialStakeholder);

  React.useEffect(() => {
    if (initialStakeholder) {
      setActiveStakeholder(initialStakeholder);
    }
  }, [initialStakeholder]);

  const stakeholderTabs = [
    { id: 'hub' as const, label: 'Decision Hub', icon: LayoutGrid, count: '4 Modes' },
    { id: 'farmer' as const, label: 'Farmer', icon: Sprout, count: 'Crop & Mandi' },
    { id: 'fpo' as const, label: 'FPO Co-op', icon: Users, count: 'Collective Plan' },
    { id: 'b2b' as const, label: 'B2B Sourcing', icon: Building2, count: 'Landed Cost' },
    { id: 'government' as const, label: 'Government', icon: Landmark, count: 'Early Warning' },
    { id: 'validation' as const, label: 'Validation', icon: History, count: 'Backtesting' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Persistent Stakeholder Experience Switcher Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-2 sm:p-2.5 shadow-xs flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          {stakeholderTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeStakeholder === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveStakeholder(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-md scale-102'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
                id={`stakeholder-switch-${tab.id}`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400 dark:text-emerald-600' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-semibold ${
                  isActive
                    ? 'bg-white/20 dark:bg-slate-900/20 text-white dark:text-slate-900'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                }`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="hidden lg:flex items-center gap-2 text-xs font-semibold text-slate-500 pr-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>One Universal Intelligence Core</span>
        </div>
      </div>

      {/* Render Selected Stakeholder View */}
      {activeStakeholder === 'hub' && (
        <StakeholderHubView
          onSelectStakeholder={(role) => setActiveStakeholder(role)}
          language={language}
        />
      )}

      {activeStakeholder === 'farmer' && (
        <FarmerDecisionView
          farmerProfile={farmerProfile}
          farmLocation={farmLocation}
          landProfile={landProfile}
          soilProfile={soilProfile}
          targetSeason={targetSeason}
          preferredCropIds={preferredCropIds}
          selectedCropId={selectedCropId}
          onSelectCrop={onSelectCrop}
          onNavigateToRouting={onNavigateToRouting}
          onLaunchCalculator={onLaunchCalculator}
          language={language}
        />
      )}

      {activeStakeholder === 'fpo' && (
        <FpoDecisionView />
      )}

      {activeStakeholder === 'b2b' && (
        <B2BProcurementView />
      )}

      {activeStakeholder === 'government' && (
        <GovernmentDecisionView />
      )}

      {activeStakeholder === 'validation' && (
        <FarmfitValidationView language={language} />
      )}
    </div>
  );
};
