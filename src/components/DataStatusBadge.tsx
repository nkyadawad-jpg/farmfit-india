import React, { useState } from 'react';
import { DataMetadata, DataStatus } from '../types';
import { Info, CheckCircle2, AlertCircle, Clock, Sparkles, TrendingUp, HelpCircle } from 'lucide-react';

interface DataStatusBadgeProps {
  metadata?: DataMetadata;
  status?: DataStatus;
  sourceText?: string;
  dateText?: string;
  showTooltip?: boolean;
  size?: 'sm' | 'md';
}

export const DataStatusBadge: React.FC<DataStatusBadgeProps> = ({
  metadata,
  status: propStatus,
  sourceText,
  dateText,
  showTooltip = true,
  size = 'md'
}) => {
  const [open, setOpen] = useState(false);

  const status = metadata?.status || propStatus || 'LATEST_AVAILABLE';
  const source = metadata?.source || sourceText || 'Ministry of Agriculture & Farmers Welfare, GoI';
  const date = metadata?.date || dateText || 'Latest Official Publication';
  const sourceUrl = metadata?.sourceUrl;
  const disclaimer = metadata?.disclaimer;

  const getStatusConfig = () => {
    switch (status) {
      case 'LIVE':
        return {
          label: 'LIVE / CURRENT',
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-700',
          dot: 'bg-emerald-500 animate-pulse',
          icon: CheckCircle2,
          desc: 'Real-time live market feed from active trading session.'
        };
      case 'LATEST_AVAILABLE':
        return {
          label: 'LATEST OFFICIAL',
          bg: 'bg-blue-50 text-blue-800 border-blue-300 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-700',
          dot: 'bg-blue-500',
          icon: CheckCircle2,
          desc: 'Verified baseline from most recently published Government of India gazette or official bulletin.'
        };
      case 'MODEL_ESTIMATE':
        return {
          label: 'MODEL ESTIMATE',
          bg: 'bg-amber-50 text-amber-900 border-amber-300 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-700',
          dot: 'bg-amber-500',
          icon: Sparkles,
          desc: 'Algorithmic calculation combining CACP cost standards, soil matrices, and logistics models.'
        };
      case 'FORECAST':
        return {
          label: 'FORECAST',
          bg: 'bg-purple-50 text-purple-900 border-purple-300 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-700',
          dot: 'bg-purple-500',
          icon: TrendingUp,
          desc: 'Projected future harvest supply, price seasonality, or meteorological forecast.'
        };
      case 'HISTORICAL':
        return {
          label: 'HISTORICAL',
          bg: 'bg-slate-100 text-slate-800 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
          dot: 'bg-slate-400',
          icon: Clock,
          desc: 'Historical multi-year benchmark series for trend analysis.'
        };
      case 'INSUFFICIENT_DATA':
      default:
        return {
          label: 'DATA UNAVAILABLE',
          bg: 'bg-rose-50 text-rose-800 border-rose-300 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-700',
          dot: 'bg-rose-500',
          icon: AlertCircle,
          desc: 'Insufficient field data or pending open-data connector sync.'
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  const sizeClasses = size === 'sm' 
    ? 'text-[11px] px-2 py-0.5 gap-1.5' 
    : 'text-xs px-2.5 py-1 gap-2';

  return (
    <div className="relative inline-flex items-center">
      <button
        type="button"
        onClick={() => showTooltip && setOpen(!open)}
        onMouseEnter={() => showTooltip && setOpen(true)}
        onMouseLeave={() => showTooltip && setOpen(false)}
        className={`inline-flex items-center font-medium rounded-full border transition-all cursor-pointer select-none ${config.bg} ${sizeClasses}`}
        title="Click to inspect official data source and verification status"
      >
        <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
        <span className="tracking-wide font-semibold">{config.label}</span>
        {showTooltip && <Info className="w-3 h-3 opacity-60 ml-0.5" />}
      </button>

      {/* Verification Tooltip / Metadata Card */}
      {showTooltip && open && (
        <div 
          className="absolute z-50 bottom-full mb-2 left-0 w-80 p-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl text-left text-xs text-slate-700 dark:text-slate-300 animate-in fade-in zoom-in-95 duration-150 pointer-events-auto"
        >
          <div className="flex items-start justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-2 mb-2">
            <div className="flex items-center gap-1.5 font-semibold text-slate-900 dark:text-white">
              <Icon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Data Governance & Source</span>
            </div>
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${config.bg}`}>
              {config.label}
            </span>
          </div>

          <div className="space-y-1.5">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-600 dark:text-slate-300 block">
                Official Source:
              </span>
              <p className="text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
                {source}
              </p>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-600 dark:text-slate-300 block">
                Verification / Session:
              </span>
              <p className="text-slate-700 dark:text-slate-300">{date}</p>
            </div>

            {disclaimer && (
              <p className="text-[11px] text-slate-500 dark:text-slate-400 italic pt-1 border-t border-slate-100 dark:border-slate-800">
                {disclaimer}
              </p>
            )}

            {sourceUrl && (
              <div className="pt-1.5">
                <a
                  href={sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-emerald-700 dark:text-emerald-400 hover:underline font-medium inline-flex items-center gap-1 text-[11px]"
                >
                  Verify at Official Portal →
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
