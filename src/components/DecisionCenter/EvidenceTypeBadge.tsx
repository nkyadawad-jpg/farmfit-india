import React from 'react';
import { Database, Sparkles, Cpu, SlidersHorizontal } from 'lucide-react';
import { EvidenceClassification } from '../../types/decisionCenter';

interface EvidenceTypeBadgeProps {
  classification: EvidenceClassification;
  size?: 'xs' | 'sm' | 'md';
}

export const EvidenceTypeBadge: React.FC<EvidenceTypeBadgeProps> = ({
  classification,
  size = 'sm'
}) => {
  let label = 'OFFICIAL OBSERVED DATA';
  let badgeClasses = 'bg-emerald-100/90 text-emerald-900 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-700';
  let Icon = Database;

  if (classification === 'FARMFIT_DERIVED_INTELLIGENCE') {
    label = 'FARMFIT DERIVED INTELLIGENCE';
    badgeClasses = 'bg-blue-100/90 text-blue-900 border-blue-300 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-700';
    Icon = Sparkles;
  } else if (classification === 'FARMFIT_MODEL_ESTIMATE') {
    label = 'FARMFIT MODEL ESTIMATE';
    badgeClasses = 'bg-purple-100/90 text-purple-900 border-purple-300 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-700';
    Icon = Cpu;
  } else if (classification === 'FARMFIT_SCENARIO_SIMULATION') {
    label = 'FARMFIT SCENARIO SIMULATION';
    badgeClasses = 'bg-amber-100/90 text-amber-900 border-amber-300 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-700';
    Icon = SlidersHorizontal;
  }

  const sizeClasses = {
    xs: 'text-[9px] px-1.5 py-0.5 gap-1',
    sm: 'text-[10px] px-2 py-0.5 gap-1.5 font-bold tracking-wider',
    md: 'text-xs px-2.5 py-1 gap-2 font-bold tracking-wide'
  }[size];

  return (
    <span className={`inline-flex items-center rounded-md uppercase border ${badgeClasses} ${sizeClasses} shadow-2xs font-mono select-none`}>
      <Icon className="w-3 h-3 shrink-0" />
      <span>{label}</span>
    </span>
  );
};
