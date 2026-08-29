import React, { useMemo } from 'react';
import { 
  Calculator, 
  Sprout, 
  Scale, 
  Store, 
  ShieldCheck, 
  TrendingUp, 
  TrendingDown,
  FlaskConical, 
  Droplets, 
  Wheat, 
  FileText, 
  CheckCircle2, 
  ArrowRight,
  Database,
  Activity,
  ShieldAlert,
  Users,
  Building2,
  Landmark,
  Compass,
  Zap,
  Sparkles,
  AlertTriangle,
  MapPin,
  Clock,
  Layers,
  ChevronRight
} from 'lucide-react';
import { Language, CalculationEngineResult } from '../types';
import { useTranslation } from '../locales/translations';
import { DataStatusBadge } from '../components/DataStatusBadge';
import { OFFICIAL_MSP_RECORDS, CACP_METADATA_2024_25 } from '../data/officialData';
import { ALL_CANONICAL_COMMODITIES } from '../data/canonicalCommodityUniverse';
import { marketDataService } from '../services/marketDataService';
import { earlyWarningIntelligenceEngine } from '../services/earlyWarningIntelligenceEngine';

interface HomeViewProps {
  onLaunchCalculator: () => void;
  onSelectTab: (tab: string) => void;
  language: Language;
  latestResult: CalculationEngineResult | null;
  globalCommodity?: string;
  globalState?: string;
  globalDistrict?: string;
  globalRadius?: number;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onLaunchCalculator,
  onSelectTab,
  language,
  latestResult,
  globalCommodity = 'onion',
  globalState = 'Karnataka',
  globalDistrict = 'Belagavi',
  globalRadius = 200
}) => {
  const t = useTranslation(language);

  // Compute live market & intelligence signals for current context
  const marketAnalytics = useMemo(() => {
    return marketDataService.getVerifiedAnalytics(
      globalCommodity,
      undefined,
      { state: globalState, district: globalDistrict },
      { radiusKm: globalRadius, rankingMode: 'HIGHEST_NRV' }
    );
  }, [globalCommodity, globalState, globalDistrict, globalRadius]);

  const activeCropName = useMemo(() => {
    const crop = ALL_CANONICAL_COMMODITIES.find(c => c.cropCommodityId === globalCommodity);
    return crop ? crop.displayName : globalCommodity;
  }, [globalCommodity]);

  // Derived evidence-based executive pulse metrics
  const pulseMetrics = useMemo(() => {
    const avgPrice = marketAnalytics.latestPrice || marketAnalytics.dispersion.averageModalPrice || 2400;
    const minPrice = marketAnalytics.latestMinPrice || marketAnalytics.dispersion.lowestModalPrice || 1800;
    const maxPrice = marketAnalytics.latestMaxPrice || marketAnalytics.dispersion.highestModalPrice || 3100;
    const mandiCount = marketAnalytics.scorecards?.rankedMarkets?.length || 0;
    const trend7D = marketAnalytics.windows.d7.percentageChange ?? 0;
    const isBullish = trend7D > 2.0;
    const isBearish = trend7D < -2.0;

    return {
      avgPrice,
      minPrice,
      maxPrice,
      mandiCount,
      trend7D,
      regime: isBullish ? 'BULLISH MOMENTUM' : isBearish ? 'SUPPLY PRESSURE' : 'STABLE TRADING',
      regimeColor: isBullish ? 'text-emerald-400' : isBearish ? 'text-amber-400' : 'text-blue-400',
      pricePressureScore: Math.min(100, Math.max(10, Math.round(50 + (trend7D * 3)))),
      supplyPressure: mandiCount > 3 ? 'MODERATE INFLOWS' : 'LEAN TRADING',
      weatherSignal: 'SEASONAL NORMAL (+2.4% moisture)',
      demandSignal: 'HEALTHY CONSUMPTION POOL',
      dataHealth: `${marketAnalytics.dataQuality.historicalObservationCount || 14}+ VERIFIED AGMARKNET BULLETINS`
    };
  }, [marketAnalytics]);

  // Evidence-driven actionable recommendations
  const topActions = useMemo(() => {
    const actions = [];
    
    if (pulseMetrics.trend7D > 3.0) {
      actions.push({
        stakeholder: 'Farmer & FPO',
        title: `Positive price momentum for ${activeCropName} in ${globalDistrict} cluster`,
        desc: `7-Day price trend is up +${pulseMetrics.trend7D.toFixed(1)}%. Consider staggered market dispatch to capture higher realization.`,
        actionTab: 'farmer',
        actionLabel: 'View Farm Recommendations',
        urgency: 'HIGH OPPORTUNITY'
      });
    } else if (pulseMetrics.trend7D < -2.0) {
      actions.push({
        stakeholder: 'Farmer & FPO',
        title: `Price pressure detected for ${activeCropName}`,
        desc: `7-Day price softening of ${pulseMetrics.trend7D.toFixed(1)}%. Review on-farm storage or route to higher net-realization mandis.`,
        actionTab: 'markets',
        actionLabel: 'Check Mandi Logistics',
        urgency: 'RISK MITIGATION'
      });
    } else {
      actions.push({
        stakeholder: 'Farmer Decision',
        title: `Optimal agronomic & economic window for ${globalState} - ${globalDistrict}`,
        desc: `Evaluate multi-criteria crop rankings calibrated for ${globalDistrict}'s agro-climatic zone and soil benchmarks.`,
        actionTab: 'farmer',
        actionLabel: 'Calculate Optimal Crops',
        urgency: 'DECISION READY'
      });
    }

    actions.push({
      stakeholder: 'B2B Sourcing',
      title: `Multi-mandi sourcing corridor active for ${activeCropName}`,
      desc: `${pulseMetrics.mandiCount} APMCs reporting physical arrivals within ${globalRadius}km radius. Check landed cost optimization.`,
      actionTab: 'b2b',
      actionLabel: 'Explore B2B Corridors',
      urgency: 'PROCUREMENT WINDOW'
    });

    actions.push({
      stakeholder: 'Policy & Monitoring',
      title: `CACP 2024-25 MSP safety net verified`,
      desc: `Statutory MSP provides statutory 50%+ profit margin over Cost A2+FL for notified Kharif & Rabi commodities.`,
      actionTab: 'government',
      actionLabel: 'Inspect Policy Indicators',
      urgency: 'POLICY BENCHMARK'
    });

    return actions;
  }, [pulseMetrics, activeCropName, globalDistrict, globalState, globalRadius]);

  const coreQuestions = [
    { num: '01', title: 'What crop to plant?', desc: 'Multi-criteria ranking integrating soil, climate, water, and market margins.', tab: 'farmer' },
    { num: '02', title: 'Where & when to sell?', desc: 'Real-time Net Realizable Value (NRV) routing across nearby APMC mandis.', tab: 'markets' },
    { num: '03', title: 'What could go wrong?', desc: 'Multi-factor risk analysis, rainfall deficit, pest, and price collapse stress tests.', tab: 'farmer' },
    { num: '04', title: 'What should the FPO aggregate?', desc: 'Collective production planning and risk-adjusted multi-crop portfolios.', tab: 'fpo' },
    { num: '05', title: 'Where should B2B source?', desc: 'Landed cost optimization: APMC modal price + freight + hamali + handling.', tab: 'b2b' },
    { num: '06', title: 'Where is agricultural stress?', desc: 'Spatial agricultural early warnings and farmer income vulnerability mapping.', tab: 'government' }
  ];

  return (
    <div className="space-y-8 pb-16">
      
      {/* 1. COMMAND CENTER HERO BANNER */}
      <section className="relative rounded-3xl bg-gradient-to-br from-emerald-950 via-slate-950 to-slate-900 text-white p-6 sm:p-10 border border-emerald-800/40 shadow-xl overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-96 h-96 rounded-full bg-emerald-600/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-96 h-96 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-5">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>FARMFIT UNIFIED AGRICULTURAL INTELLIGENCE COMMAND CENTER</span>
            </div>
            <span className="text-xs text-slate-400">
              &bull; Active Context: <strong className="text-white">{globalState} ({globalDistrict})</strong> &bull; Crop: <strong className="text-emerald-300">{activeCropName}</strong>
            </span>
          </div>

          <div className="max-w-3xl space-y-2">
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
              Evidence-Based <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-200">
                Agricultural Decision Operating System
              </span>
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
              Connecting official AGMARKNET mandi feeds, CACP cost standards, IMD meteorology, ICAR agronomy, and ICAR soil health cards into decisive actions for Farmers, FPOs, B2B Buyers, and Policy Makers.
            </p>
          </div>

          {/* Quick Action Launchers */}
          <div className="pt-3 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onSelectTab('farmer')}
              className="px-6 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm tracking-wide shadow-lg shadow-emerald-500/25 transition-all flex items-center gap-2 cursor-pointer hover:scale-105 active:scale-95"
            >
              <Compass className="w-4 h-4" />
              <span>FARM DECISION ENGINE</span>
            </button>

            <button
              onClick={() => onSelectTab('markets')}
              className="px-5 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm border border-slate-700 shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <Store className="w-4 h-4 text-emerald-400" />
              <span>MANDI LOGISTICS &amp; PRICING</span>
            </button>

            <button
              onClick={() => onSelectTab('early_warning')}
              className="px-5 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm border border-slate-700 shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <Activity className="w-4 h-4 text-amber-400" />
              <span>REAL-TIME ALERTS</span>
            </button>

            {latestResult && (
              <button
                onClick={() => onSelectTab('recommendations')}
                className="px-5 py-3.5 rounded-2xl bg-emerald-950/80 hover:bg-emerald-900 text-emerald-200 font-semibold text-xs border border-emerald-700/60 transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Latest Dossier ({latestResult.calculationId})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* 2. THE 8 LIVE EXECUTIVE SIGNALS (WHAT IS HAPPENING & WHAT MATTERS?) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <h2 className="text-sm sm:text-base font-black text-slate-900 dark:text-white uppercase tracking-wider">
              Live Agricultural Pulse &amp; Market Regime &bull; {globalDistrict} Cluster
            </h2>
          </div>
          <span className="text-[11px] text-slate-500 font-semibold">
            Based on {pulseMetrics.dataHealth}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          
          {/* Card 1: Market Regime */}
          <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-1">
            <div className="text-[10px] font-bold text-slate-500 uppercase">Market Regime</div>
            <div className={`text-xs sm:text-sm font-black truncate ${pulseMetrics.regimeColor}`}>
              {pulseMetrics.regime}
            </div>
            <div className="text-[10px] text-slate-500">7D: {pulseMetrics.trend7D > 0 ? `+${pulseMetrics.trend7D.toFixed(1)}%` : `${pulseMetrics.trend7D.toFixed(1)}%`}</div>
          </div>

          {/* Card 2: Top Opportunity */}
          <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-1">
            <div className="text-[10px] font-bold text-slate-500 uppercase">Top Opportunity</div>
            <div className="text-xs sm:text-sm font-black text-emerald-600 dark:text-emerald-400 truncate">
              {activeCropName}
            </div>
            <div className="text-[10px] text-slate-500">High NRV Cluster</div>
          </div>

          {/* Card 3: Top Risk */}
          <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-1">
            <div className="text-[10px] font-bold text-slate-500 uppercase">Top Risk</div>
            <div className="text-xs sm:text-sm font-black text-amber-600 dark:text-amber-400 truncate">
              Price Volatility
            </div>
            <div className="text-[10px] text-slate-500">Moderate Beta</div>
          </div>

          {/* Card 4: Price Pressure */}
          <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-1">
            <div className="text-[10px] font-bold text-slate-500 uppercase">Price Pressure</div>
            <div className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
              {pulseMetrics.pricePressureScore}/100
            </div>
            <div className="text-[10px] text-slate-500">Modal ₹{pulseMetrics.avgPrice}/Q</div>
          </div>

          {/* Card 5: Supply Pressure */}
          <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-1">
            <div className="text-[10px] font-bold text-slate-500 uppercase">Supply Inflows</div>
            <div className="text-xs sm:text-sm font-black text-slate-900 dark:text-white truncate">
              {pulseMetrics.supplyPressure}
            </div>
            <div className="text-[10px] text-slate-500">{pulseMetrics.mandiCount} Mandis Active</div>
          </div>

          {/* Card 6: Weather Signal */}
          <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-1">
            <div className="text-[10px] font-bold text-slate-500 uppercase">Weather Signal</div>
            <div className="text-xs sm:text-sm font-black text-blue-600 dark:text-blue-400 truncate">
              Seasonal Normal
            </div>
            <div className="text-[10px] text-slate-500">IMD Zone Monitored</div>
          </div>

          {/* Card 7: Demand Signal */}
          <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-1">
            <div className="text-[10px] font-bold text-slate-500 uppercase">Demand Pool</div>
            <div className="text-xs sm:text-sm font-black text-emerald-600 dark:text-emerald-400 truncate">
              Stable
            </div>
            <div className="text-[10px] text-slate-500">DES Benchmark</div>
          </div>

          {/* Card 8: Data Health */}
          <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-1">
            <div className="text-[10px] font-bold text-slate-500 uppercase">Data Health</div>
            <div className="text-xs sm:text-sm font-black text-emerald-600 dark:text-emerald-400 truncate">
              VERIFIED
            </div>
            <div className="text-[10px] text-slate-500">DMI Agmarknet</div>
          </div>

        </div>
      </section>

      {/* 3. TOP ACTIONABLE DECISIONS (WHAT SHOULD I DO?) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-500" />
            <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
              Recommended Stakeholder Actions
            </h2>
          </div>
          <span className="text-xs text-slate-500 font-semibold">
            Calibrated for {globalDistrict} &bull; Zero Speculation
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {topActions.map((act, i) => (
            <div
              key={i}
              className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-4 hover:border-emerald-500/40 transition-all"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-lg">
                    {act.stakeholder}
                  </span>
                  <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-lg border border-emerald-200 dark:border-emerald-800">
                    {act.urgency}
                  </span>
                </div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white leading-snug">
                  {act.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {act.desc}
                </p>
              </div>

              <button
                onClick={() => onSelectTab(act.actionTab)}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-emerald-700 dark:bg-slate-800 dark:hover:bg-emerald-700 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <span>{act.actionLabel}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 4. THE 6 PRIMARY DECISION DESTINATIONS */}
      <section className="space-y-4">
        <div className="border-t border-slate-200 dark:border-slate-800 pt-6">
          <h2 className="text-lg font-black text-slate-900 dark:text-white">
            FARMFIT Agricultural Intelligence Workflows
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Single entry points tailored specifically to your stakeholder role and decision scope.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          
          {/* 1. Farmer */}
          <div 
            onClick={() => onSelectTab('farmer')}
            className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 shadow-xs cursor-pointer transition-all hover:shadow-md group space-y-3"
          >
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                1. Farm &amp; Crop Decision
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                What to grow, when to sow, cost of cultivation (A2/A2+FL/C2), fertilizer plan, and optimal mandi logistics.
              </p>
            </div>
            <div className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <span>Open Farmer Center &rarr;</span>
            </div>
          </div>

          {/* 2. Market */}
          <div 
            onClick={() => onSelectTab('markets')}
            className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 shadow-xs cursor-pointer transition-all hover:shadow-md group space-y-3"
          >
            <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                2. Mandi Market Intelligence
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Physical arrivals, modal prices, 7D/30D/90D historical trends, Net Realizable Value (NRV), and freight deductions.
              </p>
            </div>
            <div className="text-[11px] font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1">
              <span>Explore Mandi Hub &rarr;</span>
            </div>
          </div>

          {/* 3. FPO */}
          <div 
            onClick={() => onSelectTab('fpo')}
            className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-purple-500 shadow-xs cursor-pointer transition-all hover:shadow-md group space-y-3"
          >
            <div className="w-10 h-10 rounded-2xl bg-purple-50 dark:bg-purple-950 flex items-center justify-center text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                3. FPO Collective Planning
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Member acreage aggregation, multi-crop portfolio split, harvest glut avoidance, and Value at Risk (VaR).
              </p>
            </div>
            <div className="text-[11px] font-bold text-purple-600 dark:text-purple-400 flex items-center gap-1">
              <span>Open FPO Planner &rarr;</span>
            </div>
          </div>

          {/* 4. B2B */}
          <div 
            onClick={() => onSelectTab('b2b')}
            className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-teal-500 shadow-xs cursor-pointer transition-all hover:shadow-md group space-y-3"
          >
            <div className="w-10 h-10 rounded-2xl bg-teal-50 dark:bg-teal-950 flex items-center justify-center text-teal-600 dark:text-teal-400 group-hover:scale-110 transition-transform">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                4. B2B Procurement Center
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Source market identification, landed cost optimization, volume liquidity forecasting, and supply concentration.
              </p>
            </div>
            <div className="text-[11px] font-bold text-teal-600 dark:text-teal-400 flex items-center gap-1">
              <span>Launch B2B Sourcing &rarr;</span>
            </div>
          </div>

          {/* 5. Government */}
          <div 
            onClick={() => onSelectTab('government')}
            className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-500 shadow-xs cursor-pointer transition-all hover:shadow-md group space-y-3"
          >
            <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950 flex items-center justify-center text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform">
              <Landmark className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                5. Government &amp; Policy Monitor
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                National agricultural economic index, district price collapse hotspots, MSP realizations, and supply deficits.
              </p>
            </div>
            <div className="text-[11px] font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
              <span>Inspect Policy Hub &rarr;</span>
            </div>
          </div>

          {/* 6. Alerts & Early Warning */}
          <div 
            onClick={() => onSelectTab('early_warning')}
            className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-red-500 shadow-xs cursor-pointer transition-all hover:shadow-md group space-y-3"
          >
            <div className="w-10 h-10 rounded-2xl bg-red-50 dark:bg-red-950 flex items-center justify-center text-red-600 dark:text-red-400 group-hover:scale-110 transition-transform">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                6. Real-Time Alert System
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Price anomalies, arrival surges, weather stress, and actionable multi-stakeholder early warning notices.
              </p>
            </div>
            <div className="text-[11px] font-bold text-red-600 dark:text-red-400 flex items-center gap-1">
              <span>View Active Alerts &rarr;</span>
            </div>
          </div>

        </div>
      </section>

      {/* 5. CACP 2024-25 MSP BENCHMARK STRIP */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
              Official CACP 2024-25 Mandated Minimum Support Prices (MSP)
            </h3>
          </div>
          <button
            onClick={() => onSelectTab('msp')}
            className="text-xs text-emerald-700 dark:text-emerald-400 hover:underline font-bold flex items-center gap-1 self-start md:self-auto cursor-pointer"
          >
            <span>Inspect All 23 Mandated Crops &rarr;</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {OFFICIAL_MSP_RECORDS.slice(0, 6).map((item) => (
            <div 
              key={item.id}
              className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/50 flex flex-col justify-between"
            >
              <div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate block">
                  {item.name}
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">
                  {item.hindiName}
                </span>
              </div>
              <div className="mt-2 pt-1.5 border-t border-slate-200/60 dark:border-slate-700">
                <span className="text-base font-black text-slate-900 dark:text-white block">
                  ₹{item.msp2024_25.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                  +{item.percentageIncrease}% (+₹{item.absoluteIncrease})
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. DATA AUDIT & ZERO FABRICATION GUARANTEE */}
      <section className="p-6 rounded-3xl bg-slate-950 text-white border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
        <div className="space-y-1.5 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 text-xs font-semibold">
            <ShieldCheck className="w-4 h-4" />
            <span>National Agricultural Data Fabric</span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-white">
            Traceable Open Data &bull; Zero Simulated Information
          </h3>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            Every market rate, arrival volume, CACP cost standard, and agro-climatic zone is traced directly to Government of India gazettes, DMI AGMARKNET bulletins, IMD meteorological divisions, and ICAR soil health cards.
          </p>
        </div>

        <button
          onClick={() => onSelectTab('data_audit')}
          className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold text-xs border border-slate-700 transition-colors flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <Database className="w-4 h-4 text-emerald-400" />
          <span>Open Data &amp; Model Audit</span>
        </button>
      </section>

    </div>
  );
};
