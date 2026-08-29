import React from 'react';
import { ShieldCheck, ShieldAlert, Shield, HelpCircle } from 'lucide-react';
import { ModelConfidenceTier } from '../../types/confidenceFramework';

interface ConfidenceBadgeProps {
  tier: ModelConfidenceTier;
  whyExplanation?: string;
  size?: 'sm' | 'md' | 'lg';
  showWhy?: boolean;
}

export const ConfidenceBadge: React.FC<ConfidenceBadgeProps> = ({
  tier,
  whyExplanation,
  size = 'md',
  showWhy = false
}) => {
  let badgeStyle = 'bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700';
  let Icon = HelpCircle;
  let label = 'INSUFFICIENT DATA';

  if (tier === 'VERY_HIGH' || tier === 'HIGH') {
    badgeStyle = 'bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-700';
    Icon = ShieldCheck;
    label = tier === 'VERY_HIGH' ? 'HIGH CONFIDENCE' : 'HIGH CONFIDENCE';
  } else if (tier === 'MEDIUM') {
    badgeStyle = 'bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-700';
    Icon = Shield;
    label = 'MEDIUM CONFIDENCE';
  } else if (tier === 'LOW') {
    badgeStyle = 'bg-rose-50 text-rose-800 border-rose-300 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-700';
    Icon = ShieldAlert;
    label = 'LOW CONFIDENCE';
  }

  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3.5 py-1.5 gap-2 font-bold'
  }[size];

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4'
  }[size];

  return (
    <div className="inline-flex flex-col gap-1">
      <div className={`inline-flex items-center rounded-full font-semibold border ${badgeStyle} ${sizeClasses} shadow-xs`}>
        <Icon className={`${iconSizes} shrink-0`} />
        <span>{label}</span>
      </div>
      {showWhy && whyExplanation && (
        <p className="text-[11px] text-slate-500 dark:text-slate-400 max-w-xs leading-tight">
          <span className="font-semibold text-slate-700 dark:text-slate-300">Why? </span>
          {whyExplanation}
        </p>
      )}
    </div>
  );
};
