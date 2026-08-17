import React from 'react';
import { Sprout, Scale, ShieldCheck, Calculator, ArrowRight, BookOpen, Layers } from 'lucide-react';
import { Language } from '../types';

interface AboutViewProps {
  onLaunchCalculator: () => void;
  language: Language;
}

export const AboutView: React.FC<AboutViewProps> = ({ onLaunchCalculator, language }) => {
  return (
    <div className="space-y-8 pb-16">
      {/* Hero */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-emerald-800/40">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
            <Sprout className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
            About FARMFIT
          </span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
          India Intelligent Agricultural Decision Support System
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-3xl mt-2 leading-relaxed">
          FARMFIT was engineered to address the fundamental economic and agronomic questions faced by India’s 140+ million farm holdings: crop selection, CACP cost benchmarking, minimum support price safety nets, and APMC wholesale mandi logistics.
        </p>
      </div>

      {/* Core Methodology Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold">
            <Scale className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            CACP Cost Standard Decomposition
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Cultivation costs are rigorously computed using official Commission for Agricultural Costs & Prices (CACP) methodology: Cost A2 (paid-out inputs), Cost A2+FL (including imputed family labor), and Cost C2 (comprehensive rental and interest capital).
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold">
            <Layers className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Hydrological & Soil Calibration
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Integrates ICAR-NBSS&LUP soil taxonomy (Vertisols, Inceptisols, Alfisols, Entisols) and irrigation reliability models (borewell, canal, drip, micro-irrigation) to eliminate water-deficit crop recommendations.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold">
            <Calculator className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Multi-Criteria Optimization Engine
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            A deterministic multi-factor scoring model calibrating soil suitability (25%), water match (25%), climate zone (15%), net profitability (20%), and statutory MSP safety margin (15%).
          </p>
        </div>
      </div>

      {/* Action Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 text-white border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-lg font-bold text-white">
            Ready to configure your farm decision plan?
          </h3>
          <p className="text-xs text-slate-300 mt-1">
            Run the 6-step FARMFIT calculation engine with your exact district, soil parameters, and water setup.
          </p>
        </div>

        <button
          onClick={onLaunchCalculator}
          className="px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-md transition-all flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <span>Calculate My Farm</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
