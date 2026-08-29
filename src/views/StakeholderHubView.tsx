import React from 'react';
import { 
  Sprout, 
  Users, 
  Building2, 
  Landmark, 
  ArrowRight, 
  ShieldCheck, 
  TrendingUp, 
  Globe2, 
  Store, 
  CheckCircle2,
  Sparkles,
  Database
} from 'lucide-react';
import { Language } from '../types';
import { DataStatusBadge } from '../components/DataStatusBadge';
import { CACP_METADATA_2024_25 } from '../data/officialData';

interface StakeholderHubViewProps {
  onSelectStakeholder: (role: 'farmer' | 'fpo' | 'b2b' | 'government') => void;
  language: Language;
}

export const StakeholderHubView: React.FC<StakeholderHubViewProps> = ({
  onSelectStakeholder,
  language
}) => {
  const stakeholderCards = [
    {
      id: 'farmer' as const,
      icon: Sprout,
      title: 'FARMER',
      tagline: 'Decide what to grow and where to sell',
      description: 'Scientific crop recommendation calibrated to your soil, water, local climate, 200 km APMC mandi prices, and CACP MSP statutory safety nets.',
      keyQuestions: [
        'What should I grow this season?',
        'Which nearby APMC gives the highest net price (NRV)?',
        'What can change my profit (What-If sensitivity)?'
      ],
      primaryAction: 'Launch Farmer Decision Center',
      theme: 'emerald',
      badge: 'Individual Cultivators'
    },
    {
      id: 'fpo' as const,
      icon: Users,
      title: 'FPO (Farmer Producer Org)',
      tagline: 'Decide what your farmers should produce',
      description: 'Aggregate crop planning, diversified portfolio allocation, bulk logistics routing, and collective bargaining intelligence across hundreds of member farmers.',
      keyQuestions: [
        'Which crops should our FPO encourage members to grow?',
        'How should we allocate total acreage across stable & high-margin crops?',
        'How do we stagger harvest sales to avoid peak arrival gluts?'
      ],
      primaryAction: 'Launch FPO Production Planning',
      theme: 'blue',
      badge: 'Cooperatives & Clusters'
    },
    {
      id: 'b2b' as const,
      icon: Building2,
      title: 'B2B PROCUREMENT',
      tagline: 'Decide what to procure, where and when',
      description: 'Institutional sourcing discovery, multi-district concentration risk mitigation, real-time APMC price momentum, and landed cost freight optimization.',
      keyQuestions: [
        'Where can we procure verified quality commodity at lowest landed cost?',
        'How should we split volume across regions to mitigate supply shocks?',
        'What are the 7-day, 30-day, and 90-day wholesale price trends?'
      ],
      primaryAction: 'Launch B2B Sourcing Center',
      theme: 'purple',
      badge: 'Processors & Exporters'
    },
    {
      id: 'government' as const,
      icon: Landmark,
      title: 'GOVERNMENT / INSTITUTION',
      tagline: 'Monitor agricultural and economic risk',
      description: 'All-India to APMC-level spatial intelligence, early warning alerts for price and supply shocks, agricultural hotspots, and macro policy scenario modeling.',
      keyQuestions: [
        'Where is agricultural price distress or market glut building?',
        'Which districts face severe moisture deficit or input cost inflation?',
        'How would a national monsoon shock or tariff revision propagate?'
      ],
      primaryAction: 'Launch India Risk & Early Warning',
      theme: 'amber',
      badge: 'Policy Planners & Analysts'
    }
  ];

  return (
    <div className="space-y-10 pb-16">
      {/* Top Banner Header */}
      <section className="relative rounded-3xl bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-950 text-white p-6 sm:p-10 lg:p-12 overflow-hidden shadow-xl border border-emerald-800/40">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <DataStatusBadge metadata={CACP_METADATA_2024_25} size="sm" />
            <span className="text-[11px] font-bold text-emerald-300 tracking-wider uppercase flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Unified Agricultural Intelligence Core
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            FARMFIT Stakeholder <br className="hidden sm:block" />
            <span className="text-emerald-400">Decision Intelligence Center</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal max-w-3xl">
            FARMFIT does not simply display raw data — it delivers actionable, actuarially grounded decisions. Four tailored experiences powered by ONE verified underlying intelligence core.
          </p>

          {/* Quick Stat Indicators */}
          <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-3 backdrop-blur-xs">
              <div className="text-xs text-slate-400 font-semibold">Regulated Mandis</div>
              <div className="text-lg sm:text-xl font-black text-emerald-400">2,840+ APMCs</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-3 backdrop-blur-xs">
              <div className="text-xs text-slate-400 font-semibold">CACP MSP Benchmarks</div>
              <div className="text-lg sm:text-xl font-black text-emerald-400">2024-25 Notified</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-3 backdrop-blur-xs">
              <div className="text-xs text-slate-400 font-semibold">Hierarchy Depth</div>
              <div className="text-lg sm:text-xl font-black text-emerald-400">Farm → All-India</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-3 backdrop-blur-xs">
              <div className="text-xs text-slate-400 font-semibold">Zero Fabrication</div>
              <div className="text-lg sm:text-xl font-black text-emerald-400">100% Traceable</div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Large Stakeholder Decision Entry Cards */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
              Select Your Decision Experience
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Choose your role to access tailored workflows, portfolio optimizers, and risk models.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {stakeholderCards.map((card) => {
            const Icon = card.icon;
            
            // Color theme configs
            const themeColors = {
              emerald: {
                border: 'hover:border-emerald-500/80 border-slate-200 dark:border-slate-800',
                iconBg: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
                btn: 'bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white',
                badge: 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
              },
              blue: {
                border: 'hover:border-blue-500/80 border-slate-200 dark:border-slate-800',
                iconBg: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300',
                btn: 'bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white',
                badge: 'bg-blue-50 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300 border-blue-200 dark:border-blue-800'
              },
              purple: {
                border: 'hover:border-purple-500/80 border-slate-200 dark:border-slate-800',
                iconBg: 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300',
                btn: 'bg-purple-600 hover:bg-purple-500 active:bg-purple-700 text-white',
                badge: 'bg-purple-50 text-purple-800 dark:bg-purple-950/80 dark:text-purple-300 border-purple-200 dark:border-purple-800'
              },
              amber: {
                border: 'hover:border-amber-500/80 border-slate-200 dark:border-slate-800',
                iconBg: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
                btn: 'bg-amber-600 hover:bg-amber-500 active:bg-amber-700 text-white',
                badge: 'bg-amber-50 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border-amber-200 dark:border-amber-800'
              }
            }[card.theme];

            return (
              <div
                key={card.id}
                onClick={() => onSelectStakeholder(card.id)}
                className={`bg-white dark:bg-slate-900 border rounded-3xl p-6 sm:p-8 shadow-xs hover:shadow-xl transition-all duration-200 flex flex-col justify-between cursor-pointer group ${themeColors.border}`}
                id={`stakeholder-card-${card.id}`}
              >
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold shadow-xs ${themeColors.iconBg}`}>
                      <Icon className="w-7 h-7" />
                    </div>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full border ${themeColors.badge}`}>
                      {card.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {card.title}
                    </h3>
                    <p className="text-sm font-bold text-emerald-700 dark:text-emerald-400 mt-0.5">
                      "{card.tagline}"
                    </p>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                      {card.description}
                    </p>
                  </div>

                  {/* Core Questions Answered */}
                  <div className="bg-slate-50 dark:bg-slate-950/50 rounded-2xl p-4 border border-slate-100 dark:border-slate-800 space-y-2">
                    <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Key Decisions Answered:
                    </div>
                    <ul className="space-y-1.5">
                      {card.keyQuestions.map((q, idx) => (
                        <li key={idx} className="text-xs font-medium text-slate-700 dark:text-slate-300 flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                          <span>{q}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-6">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectStakeholder(card.id);
                    }}
                    className={`w-full py-3.5 rounded-2xl font-bold text-sm tracking-wide shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer ${themeColors.btn}`}
                  >
                    <span>{card.primaryAction}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Underlying Intelligence Assurance */}
      <section className="bg-slate-100/80 dark:bg-slate-900/60 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Database className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <span>One Unified Intelligence Core</span>
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              All four stakeholder decisions synchronize dynamically with the same official government data, 200 km APMC discovery, and 13-dimensional risk engines.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
            <span className="bg-white dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700">AGMARKNET Daily</span>
            <span className="bg-white dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700">CACP 2024-25 MSP</span>
            <span className="bg-white dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700">IMD Gridded Monsoon</span>
            <span className="bg-white dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700">DES Production APY</span>
          </div>
        </div>
      </section>
    </div>
  );
};
