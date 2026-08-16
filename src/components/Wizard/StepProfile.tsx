import React from 'react';
import { FarmerProfile, LandholdingCategory, Language } from '../../types';
import { User, Shield, Target, IndianRupee, ArrowRight } from 'lucide-react';
import { DataStatusBadge } from '../DataStatusBadge';

interface StepProfileProps {
  profile: FarmerProfile;
  onChange: (profile: FarmerProfile) => void;
  onNext: () => void;
  language: Language;
}

export const StepProfile: React.FC<StepProfileProps> = ({
  profile,
  onChange,
  onNext,
  language
}) => {
  const categories: LandholdingCategory[] = [
    'Marginal (< 2.5 Acres)',
    'Small (2.5 - 5 Acres)',
    'Semi-Medium (5 - 10 Acres)',
    'Medium (10 - 25 Acres)',
    'Large (> 25 Acres)'
  ];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-5 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300 flex items-center justify-center text-xs font-bold">
              1
            </span>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {language === 'en' ? 'Farmer & Operation Profile' : 'किसान एवं कृषि संचालन प्रोफ़ाइल'}
            </h2>
          </div>
          <p className="text-xs text-slate-700 dark:text-slate-200 mt-1">
            {language === 'en' 
              ? 'Establish the baseline economic and operational constraints for tailored recommendations.' 
              : 'सटीक सिफारिशों के लिए आर्थिक और परिचालन संबंधी जानकारी दर्ज करें।'}
          </p>
        </div>

        <DataStatusBadge
          status="LATEST_AVAILABLE"
          sourceText="User-Authored Operational Input"
          dateText="Active Farm Configuration"
          size="sm"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Name */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
            {language === 'en' ? 'Farmer / Farm Name' : 'किसान / खेत का नाम'}
          </label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={profile.name}
              onChange={(e) => onChange({ ...profile, name: e.target.value })}
              placeholder="e.g. Ramesh Patel Farm"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              id="input-farmer-name"
            />
          </div>
        </div>

        {/* Landholding Category */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
            {language === 'en' ? 'Landholding Operational Category' : 'भूमि जोत परिचालन श्रेणी'}
          </label>
          <select
            value={profile.farmerType}
            onChange={(e) => onChange({ ...profile, farmerType: e.target.value as LandholdingCategory })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden cursor-pointer"
            id="select-landholding-category"
          >
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Primary Farming Goal */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
            <Target className="inline w-3.5 h-3.5 mr-1 text-emerald-600" />
            {language === 'en' ? 'Primary Strategic Goal' : 'मुख्य रणनीतिक लक्ष्य'}
          </label>
          <select
            value={profile.primaryGoal}
            onChange={(e) => onChange({ ...profile, primaryGoal: e.target.value as any })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden cursor-pointer"
            id="select-primary-goal"
          >
            <option value="Max Profit">Maximize Net Profit per Acre (Higher risk tolerance)</option>
            <option value="Guaranteed Minimum Return (MSP focus)">Guaranteed Downside Protection (MSP & FCI/NAFED focus)</option>
            <option value="Low Water Risk">Water-Stressed Resilient (Low crop water requirement)</option>
            <option value="Low Working Capital">Low Initial Capital Input (Cost-effective seeds & inputs)</option>
          </select>
        </div>

        {/* Risk Tolerance */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
            <Shield className="inline w-3.5 h-3.5 mr-1 text-emerald-600" />
            {language === 'en' ? 'Risk Tolerance Profile' : 'जोखिम सहनशीलता'}
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(['Conservative', 'Moderate', 'Aggressive'] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => onChange({ ...profile, riskTolerance: r })}
                className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  profile.riskTolerance === r
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-300 ring-2 ring-emerald-500'
                    : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Working Capital Budget */}
        <div className="md:col-span-2">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              <IndianRupee className="inline w-3.5 h-3.5 mr-1 text-emerald-600" />
              {language === 'en' ? 'Available Working Capital Budget (INR)' : 'उपलब्ध कार्यशील पूंजी बजट (रुपये)'}
            </label>
            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
              ₹{profile.workingCapitalBudget.toLocaleString('en-IN')}
            </span>
          </div>
          <input
            type="range"
            min={10000}
            max={500000}
            step={5000}
            value={profile.workingCapitalBudget}
            onChange={(e) => onChange({ ...profile, workingCapitalBudget: Number(e.target.value) })}
            className="w-full accent-emerald-600 cursor-pointer"
            id="range-working-capital"
          />
          <div className="flex justify-between text-[11px] text-slate-600 dark:text-slate-300 mt-1">
            <span>₹10,000</span>
            <span>₹2,50,000</span>
            <span>₹5,00,000+</span>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <button
          onClick={onNext}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs tracking-wide shadow-md transition-all cursor-pointer"
          id="btn-next-location"
        >
          <span>{language === 'en' ? 'Next: Farm Location' : 'अगला: खेत का स्थान'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
