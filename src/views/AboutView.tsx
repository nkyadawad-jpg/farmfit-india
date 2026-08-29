import React from 'react';
import { 
  Sprout, 
  Users, 
  Building2, 
  Landmark, 
  ArrowRight, 
  ShieldCheck, 
  Compass, 
  Layers, 
  Workflow, 
  Database, 
  Scale, 
  Activity, 
  HelpCircle,
  TrendingUp,
  AlertTriangle,
  FileCheck2,
  CheckCircle2
} from 'lucide-react';
import { Language } from '../types';

interface AboutViewProps {
  onLaunchCalculator: () => void;
  language: Language;
}

export const AboutView: React.FC<AboutViewProps> = ({ onLaunchCalculator, language }) => {
  const workflowSteps = [
    { title: 'FARM CONDITIONS', desc: 'Soil order, depth, pH, landholding & irrigation reliability' },
    { title: 'LOCATION', desc: 'District agro-climatic zone, latitude, longitude & rainfall norm' },
    { title: 'COMMODITY', desc: '25+ universal crops with CACP cost structure & MSP parity' },
    { title: 'WEATHER & WATER', desc: 'IMD rainfall norms, 10-day forecasts & evapotranspiration water balance' },
    { title: 'MARKET & PRICE', desc: 'Agmarknet daily wholesale feeds, modal prices & arrivals' },
    { title: 'SUPPLY / DEMAND', desc: 'Spatial production clusters, arrivals pressure & consumption pools' },
    { title: 'LOGISTICS', desc: 'APMC mandi distances, freight charges, hamali & Net Realizable Value' },
    { title: 'RISK', desc: '13-factor risk matrix separating biophysical blockers from manageable factors' },
    { title: 'SCENARIO ANALYSIS', desc: 'What-if stress testing across price shocks & rainfall anomalies' },
    { title: 'DECISION', desc: '3-tier actionable verdicts: Recommended, Conditional, or Avoid' },
    { title: 'VALIDATION', desc: 'Historical backtesting against observed yields & mandi realizations' }
  ];

  const dataClasses = [
    {
      type: 'OFFICIAL DATA',
      tag: 'CACP • AGMARKNET • IMD • ICAR',
      desc: 'Direct statutory gazettes, notified MSP rates, daily APMC bulletins, and ICAR agro-climatic classifications.'
    },
    {
      type: 'OBSERVED MARKET EVIDENCE',
      tag: 'VERIFIED WHOLESALE SPOT ARRIVALS',
      desc: 'Recorded transactions from physical trading yards across verified mandi clusters within geographic radius.'
    },
    {
      type: 'FARMFIT DERIVED MODEL',
      tag: 'DETERMINISTIC COMPOSITE SCORING',
      desc: 'Deterministic agronomic suitability, net realizable value calculations, and water balance accounting.'
    },
    {
      type: 'MODEL ESTIMATE',
      tag: 'ALGORITHMIC PROJECTION',
      desc: 'Scenario stress tests, prospective landed costs, and conditional management ROI projections.'
    },
    {
      type: 'INSUFFICIENT DATA',
      tag: 'LIMITATION ACKNOWLEDGMENT',
      desc: 'Transparently communicates missing observations rather than creating artificial certainty.'
    }
  ];

  return (
    <div className="space-y-10 pb-16 max-w-6xl mx-auto" id="about-farmfit-page">
      
      {/* 1. HERO SECTION */}
      <section className="relative rounded-3xl bg-gradient-to-br from-emerald-950 via-slate-950 to-slate-900 text-white p-6 sm:p-10 border border-emerald-800/40 shadow-xl overflow-hidden">
        <div className="absolute top-0 right-0 -mr-12 -mt-12 w-80 h-80 rounded-full bg-emerald-600/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold tracking-wide uppercase">
            <Sprout className="w-4 h-4" />
            <span>Platform Overview</span>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white uppercase">
              ABOUT FARMFIT
            </h1>
            <p className="text-base sm:text-lg text-emerald-200/90 font-medium max-w-3xl leading-relaxed">
              Agricultural Decision Intelligence for Better Farming, Markets and Agricultural Planning.
            </p>
          </div>

          <div className="pt-2 border-t border-emerald-800/60 max-w-3xl">
            <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-normal">
              FARMFIT is an Agricultural Decision Intelligence platform designed to connect farm conditions, commodities, markets, weather, logistics, risk and economic signals into one evidence-based decision framework.
            </p>
            <div className="mt-4 p-4 rounded-2xl bg-emerald-900/40 border border-emerald-500/30 text-emerald-100 font-semibold text-sm sm:text-base">
              FARMFIT is designed to help answer:
              <span className="block mt-1 text-white font-bold italic">
                &ldquo;What should we grow, where should we sell or source, what could we earn, what risks could affect the decision, and what should we do next?&rdquo;
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. WHAT FARMFIT SOLVES */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
              WHAT FARMFIT SOLVES
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Tailored decision frameworks across four key agricultural stakeholders
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* FARMERS */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xs hover:border-emerald-500/40 transition-colors space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 flex items-center justify-center">
                <Sprout className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  FARMERS
                </h3>
                <span className="text-xs text-slate-500 dark:text-slate-400">Precision Agronomic &amp; Economic Guidance</span>
              </div>
            </div>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold mt-0.5">•</span>
                <span>Helps evaluate crop suitability for a specific location and farm condition.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold mt-0.5">•</span>
                <span>Compares market opportunities and potential net realization where evidence supports it.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold mt-0.5">•</span>
                <span>Studies historical prices, trends, weather and agricultural risks.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold mt-0.5">•</span>
                <span>Helps distinguish manageable risks from structural risks.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold mt-0.5">•</span>
                <span>Supports better crop-planning decisions.</span>
              </li>
            </ul>
          </div>

          {/* FPOs */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xs hover:border-emerald-500/40 transition-colors space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  FPOs
                </h3>
                <span className="text-xs text-slate-500 dark:text-slate-400">Collective Aggregation &amp; Production Planning</span>
              </div>
            </div>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold mt-0.5">•</span>
                <span>Helps identify collective crop opportunities.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold mt-0.5">•</span>
                <span>Supports aggregation and market planning.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold mt-0.5">•</span>
                <span>Compares markets, prices, trends, logistics and risks.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold mt-0.5">•</span>
                <span>Helps FPOs make evidence-based production decisions.</span>
              </li>
            </ul>
          </div>

          {/* B2B PROCUREMENT */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xs hover:border-emerald-500/40 transition-colors space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 flex items-center justify-center">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  B2B PROCUREMENT
                </h3>
                <span className="text-xs text-slate-500 dark:text-slate-400">Institutional Sourcing &amp; Landed Cost Intelligence</span>
              </div>
            </div>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-purple-600 font-bold mt-0.5">•</span>
                <span>Helps identify potential procurement regions and markets.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 font-bold mt-0.5">•</span>
                <span>Compares price and landed-cost intelligence.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 font-bold mt-0.5">•</span>
                <span>Evaluates market trends, supply signals and procurement risks.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 font-bold mt-0.5">•</span>
                <span>Supports diversified sourcing decisions.</span>
              </li>
            </ul>
          </div>

          {/* GOVERNMENT & INSTITUTIONS */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xs hover:border-emerald-500/40 transition-colors space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 flex items-center justify-center">
                <Landmark className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  GOVERNMENT &amp; INSTITUTIONS
                </h3>
                <span className="text-xs text-slate-500 dark:text-slate-400">Exposure Monitoring &amp; Early-Warning Analysis</span>
              </div>
            </div>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-amber-600 font-bold mt-0.5">•</span>
                <span>Provides agricultural exposure intelligence.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-600 font-bold mt-0.5">•</span>
                <span>Highlights regional commodity, weather, water, market and income risks.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-600 font-bold mt-0.5">•</span>
                <span>Supports evidence-based agricultural planning and early-warning analysis.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 3. HOW FARMFIT WORKS */}
      <section className="space-y-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs">
        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold">
            <Workflow className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
              HOW FARMFIT WORKS
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              FARMFIT combines multiple agricultural, climatic, logistical, and market signals into one integrated decision flow rather than relying on an isolated indicator.
            </p>
          </div>
        </div>

        {/* Process Flow Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-2">
          {workflowSteps.map((step, idx) => (
            <div 
              key={step.title}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/60 space-y-1.5 hover:border-emerald-500/50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black uppercase text-emerald-700 dark:text-emerald-400">
                  {idx + 1}. {step.title}
                </span>
                {idx < workflowSteps.length - 1 && (
                  <span className="text-[10px] text-slate-400 font-mono">↓</span>
                )}
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-snug">
                {step.desc}
              </p>
            </div>
          ))}
        </div>

        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-xs text-emerald-900 dark:text-emerald-200">
          <strong>Holistic Evidence Synthesis:</strong> By joining physical soil characteristics and hydrological data with real-time APMC arrivals, CACP statutory cost benchmarks, and transportation physics, FARMFIT provides verifiable and practical decision support.
        </div>
      </section>

      {/* 4. FARMFIT'S DATA PRINCIPLE */}
      <section className="space-y-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs">
        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold">
            <Database className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
              EVIDENCE-FIRST INTELLIGENCE
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Rigorous data provenance and absolute transparency across all analytical models
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            FARMFIT distinguishes between:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {dataClasses.map((item) => (
              <div 
                key={item.type}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/60 space-y-1.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-black text-slate-900 dark:text-white uppercase">
                    {item.type}
                  </span>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider block">
                  {item.tag}
                </span>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-snug">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-medium">
            FARMFIT must not fabricate missing observations. Where evidence is insufficient, the platform communicates the limitation and reduces confidence rather than creating artificial certainty.
          </div>
        </div>
      </section>

      {/* 5. OUR AIM */}
      <section className="bg-gradient-to-r from-emerald-900 via-slate-900 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 border border-emerald-800/50 shadow-lg space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center text-white">
            <Compass className="w-4 h-4" />
          </div>
          <h2 className="text-xl font-black text-white uppercase tracking-tight">
            OUR AIM
          </h2>
        </div>

        <div className="space-y-3 max-w-4xl text-sm sm:text-base leading-relaxed">
          <p className="text-emerald-100 font-bold">
            &ldquo;To make agricultural decision-making more informed, transparent and practical by connecting farm conditions with crop, market, risk and economic intelligence.&rdquo;
          </p>
          <p className="text-slate-300">
            FARMFIT is designed to support better decisions for farmers, stronger collective planning for FPOs, more intelligent procurement for businesses, and better agricultural planning for institutions.
          </p>
        </div>

        <div className="pt-2">
          <button
            onClick={onLaunchCalculator}
            id="about-start-farm-decision-btn"
            className="px-6 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-md transition-all inline-flex items-center gap-2 cursor-pointer"
          >
            <Compass className="w-4 h-4" />
            <span>START FARM DECISION</span>
          </button>
        </div>
      </section>

      {/* 6. PROFESSIONAL DISCLAIMER */}
      <section className="bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 rounded-3xl p-6 space-y-2">
        <div className="flex items-center gap-2 text-amber-900 dark:text-amber-300 font-black text-xs uppercase tracking-wider">
          <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
          <span>DISCLAIMER</span>
        </div>
        <p className="text-xs text-amber-900/90 dark:text-amber-200/90 leading-relaxed">
          FARMFIT is a decision-support and agricultural intelligence platform. Its outputs are analytical estimates based on available data, models and assumptions and are not guaranteed outcomes.
        </p>
        <p className="text-xs text-amber-900/80 dark:text-amber-200/80 leading-relaxed">
          Actual agricultural and commercial outcomes may vary because of weather, production conditions, market movements, input costs, logistics, policy changes and other unforeseen factors.
        </p>
      </section>

    </div>
  );
};
