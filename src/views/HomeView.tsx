import React from 'react';
import { 
  Calculator, 
  Sprout, 
  Scale, 
  Store, 
  ShieldCheck, 
  TrendingUp, 
  FlaskConical, 
  Droplets, 
  Wheat, 
  FileText, 
  CheckCircle2, 
  ArrowRight,
  Database
} from 'lucide-react';
import { Language, CalculationEngineResult } from '../types';
import { useTranslation } from '../locales/translations';
import { DataStatusBadge } from '../components/DataStatusBadge';
import { OFFICIAL_MSP_RECORDS, CACP_METADATA_2024_25 } from '../data/officialData';

interface HomeViewProps {
  onLaunchCalculator: () => void;
  onSelectTab: (tab: string) => void;
  language: Language;
  latestResult: CalculationEngineResult | null;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onLaunchCalculator,
  onSelectTab,
  language,
  latestResult
}) => {
  const t = useTranslation(language);

  const keyQuestions = [
    { title: "1. What crop to plant?", desc: "Multi-criteria ranking based on soil, climate, water, and market margins." },
    { title: "2. When to plant?", desc: "Agro-climatic sowing windows calibrated with IMD monsoon onset." },
    { title: "3. How much land to allocate?", desc: "Optimal acreage allocation matching working capital and water capacity." },
    { title: "4. Soil, climate & irrigation fit?", desc: "Matching soil order, pH, and water availability to crop biological thresholds." },
    { title: "5. Future supply & demand?", desc: "DES production estimates and national consumption balance sheets." },
    { title: "6. Expected future price?", desc: "Agmarknet modal prices and historical harvest seasonality indices." },
    { title: "7. Applicable official MSP?", desc: "Statutory 2024-25 CACP Minimum Support Prices with 50%+ profit margin over A2+FL." },
    { title: "8. Estimated cultivation cost?", desc: "Decomposed CACP cost standards: A2 paid-out, A2+FL, and C2 comprehensive cost." },
    { title: "9. Fertilizer & nutrient plan?", desc: "Customized NPK dosage per acre adjusted for Soil Health Card status." },
    { title: "10. Expected profitability?", desc: "Net returns per acre and Return on Investment (ROI %) across scenarios." },
    { title: "11. Worst/Base/Best case spread?", desc: "3-tier sensitivity simulation modeling yield and market price fluctuations." },
    { title: "12. Operation & price risk?", desc: "Composite 0-100 risk score assessing drought, pests, and price collapse." },
    { title: "13. Model confidence score?", desc: "Precision index based on laboratory Soil Health Card data availability." },
    { title: "14. Best APMC mandi to sell?", desc: "Logistics routing to optimal wholesale market maximizing net returns." },
    { title: "15. Freight & net realization?", desc: "Exact diesel freight, hamali, and mandi cess deductions per quintal." },
    { title: "16. Crops to strictly avoid?", desc: "Clear red-flag alerts for crops with water deficits or expected market gluts." }
  ];

  return (
    <div className="space-y-10 pb-16">
      {/* Hero Section */}
      <section className="relative rounded-3xl bg-gradient-to-br from-emerald-900 via-emerald-950 to-slate-950 text-white p-6 sm:p-10 lg:p-12 overflow-hidden shadow-xl border border-emerald-800/40">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-96 h-96 rounded-full bg-emerald-600/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-96 h-96 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-5">
          <div className="flex flex-wrap items-center gap-2">
            <DataStatusBadge
              metadata={CACP_METADATA_2024_25}
              size="sm"
            />
            <span className="text-[11px] font-semibold text-emerald-300 tracking-wide">
              &bull; Official Government of India Open Data Standards
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            India-Wide Intelligent <br className="hidden sm:block" />
            <span className="text-emerald-400">Agricultural Decision Support</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl font-normal">
            FARMFIT empowers Indian farmers and agricultural planners with scientific crop selection, CACP cultivation cost benchmarking, official 2024-25 MSP safety nets, and APMC mandi logistics optimization.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <button
              onClick={onLaunchCalculator}
              className="px-8 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-slate-950 font-black text-sm sm:text-base tracking-wide shadow-lg shadow-emerald-500/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 cursor-pointer"
              id="hero-calculate-btn"
            >
              <Calculator className="w-5 h-5 text-slate-950" />
              <span>{t.calculateBtn}</span>
            </button>

            {latestResult && (
              <button
                onClick={() => onSelectTab('recommendations')}
                className="px-6 py-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm tracking-wide border border-white/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>View Latest Calculation ({latestResult.calculationId})</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Live MSP & CACP Ticker Strip */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Official CACP 2024-25 Mandated Minimum Support Prices (MSP)
            </h3>
          </div>
          <button
            onClick={() => onSelectTab('msp')}
            className="text-xs text-emerald-700 dark:text-emerald-400 hover:underline font-semibold flex items-center gap-1 self-start md:self-auto cursor-pointer"
          >
            <span>View All 23 Mandated Crops →</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {OFFICIAL_MSP_RECORDS.slice(0, 6).map((item) => (
            <div 
              key={item.id}
              className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/50 flex flex-col justify-between"
            >
              <div>
                <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-200 truncate block">
                  {item.name}
                </span>
                <span className="text-[10px] text-slate-600 dark:text-slate-300 font-medium">
                  {item.hindiName}
                </span>
              </div>
              <div className="mt-2 pt-1.5 border-t border-slate-200/60 dark:border-slate-700">
                <span className="text-base font-extrabold text-slate-900 dark:text-white block">
                  ₹{item.msp2024_25.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold">
                  +{item.percentageIncrease}% (+₹{item.absoluteIncrease})
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* The 16 Critical Farm Decisions Addressed */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              16 Core Questions Solved by FARMFIT
            </h2>
            <p className="text-xs text-slate-700 dark:text-slate-200 mt-0.5">
              An end-to-end scientific methodology translating agricultural data into actionable farm management decisions.
            </p>
          </div>
          <button
            onClick={onLaunchCalculator}
            className="self-start sm:self-auto px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow cursor-pointer"
          >
            Start Your Farm Calculation
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {keyQuestions.map((q, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-700 transition-all shadow-2xs space-y-2 flex flex-col justify-between"
            >
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                  {q.title}
                </h4>
                <p className="text-xs text-slate-700 dark:text-slate-300 mt-1 leading-relaxed">
                  {q.desc}
                </p>
              </div>
              <div className="pt-2 flex items-center gap-1.5 text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Engine Evaluated</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Data Integrity & Open Standards Guarantee */}
      <section className="p-6 sm:p-8 rounded-3xl bg-slate-900 text-white border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 text-xs font-semibold">
            <ShieldCheck className="w-4 h-4" />
            <span>Strict Agricultural Data Integrity</span>
          </div>
          <h3 className="text-xl font-bold text-white">
            Zero Fabricated or Artificial Agricultural Data
          </h3>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            Every cost benchmark, price record, soil order, and MSP is sourced directly from Government of India gazettes, CACP price policy reports, Agmarknet mandi sessions, and IMD meteorological divisions.
          </p>
        </div>

        <button
          onClick={() => onSelectTab('datasources')}
          className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition-colors flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <Database className="w-4 h-4 text-emerald-400" />
          <span>Inspect Open Data Registry</span>
        </button>
      </section>
    </div>
  );
};
