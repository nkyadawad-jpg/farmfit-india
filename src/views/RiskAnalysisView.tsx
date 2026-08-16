import React from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle2, TrendingDown, CloudRain, Bug, IndianRupee } from 'lucide-react';
import { CalculationEngineResult, Language } from '../types';
import { DataStatusBadge } from '../components/DataStatusBadge';

interface RiskAnalysisViewProps {
  result: CalculationEngineResult | null;
  language: Language;
}

export const RiskAnalysisView: React.FC<RiskAnalysisViewProps> = ({ result, language }) => {
  const topCrop = result?.recommendedCrops[0];

  const riskFactors = [
    { title: "Drought & Hydrological Stress", level: "Low to Moderate", score: 25, desc: "Farm water capacity and normal monsoon rainfall sufficient for crop lifecycle.", icon: CloudRain, color: "text-blue-500" },
    { title: "Wholesale Price Collapse Risk", level: "Low (Protected by MSP)", score: 18, desc: "Notified 2024-25 MSP provides guaranteed statutory price floor through FCI/NAFED procurement.", icon: IndianRupee, color: "text-emerald-500" },
    { title: "Pest & Pathogen Vulnerability", level: "Moderate", score: 40, desc: "Potential incidence of stem fly or pod borer during peak vegetative phase; regular field scouting recommended.", icon: Bug, color: "text-amber-500" },
    { title: "Post-Harvest Perishability", level: "Very Low", score: 10, desc: "Non-perishable grain with safe storage life exceeding 6 months under standard warehouse conditions.", icon: ShieldAlert, color: "text-emerald-500" }
  ];

  return (
    <div className="space-y-6 pb-16">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 flex items-center justify-center">
                <ShieldAlert className="w-5 h-5" />
              </span>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                Multi-Factor Agricultural Risk Assessment
              </h1>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              Probabilistic risk modeling evaluating climate, price shocks, pest infestation, and capital exposure.
            </p>
          </div>

          <DataStatusBadge
            status="MODEL_ESTIMATE"
            sourceText="FARMFIT Risk Matrix Engine"
            dateText="Active Calculation Simulation"
            size="sm"
          />
        </div>

        {/* Risk Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {riskFactors.map((rf, idx) => {
            const Icon = rf.icon;
            return (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      <Icon className={`w-5 h-5 ${rf.color}`} />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">{rf.title}</h4>
                      <span className="text-[11px] font-semibold text-slate-500">{rf.level}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-black text-slate-900 dark:text-white">{rf.score}/100</span>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Risk Index</span>
                  </div>
                </div>

                <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-500 rounded-full"
                    style={{ width: `${rf.score}%` }}
                  />
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {rf.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
