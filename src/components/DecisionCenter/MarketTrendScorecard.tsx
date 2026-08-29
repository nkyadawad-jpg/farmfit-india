import React, { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  ShieldCheck, 
  AlertTriangle, 
  Layers, 
  BarChart3, 
  Calendar, 
  Compass, 
  HelpCircle, 
  CheckCircle2, 
  Info, 
  ArrowRight,
  Filter,
  Sliders,
  DollarSign,
  Truck,
  MapPin,
  Activity
} from 'lucide-react';
import { 
  VerifiedMarketAnalytics, 
  MarketRankingMode, 
  TrendWindowStats,
  MultiMarketScorecardItem 
} from '../../types/marketAnalytics';
import { ConfidenceBadge } from './ConfidenceBadge';

interface MarketTrendScorecardProps {
  analytics: VerifiedMarketAnalytics;
  onRankingModeChange?: (mode: MarketRankingMode) => void;
  onSelectMarket?: (marketName: string) => void;
}

export const MarketTrendScorecard: React.FC<MarketTrendScorecardProps> = ({
  analytics,
  onRankingModeChange,
  onSelectMarket
}) => {
  const [selectedWindow, setSelectedWindow] = useState<'7D' | '14D' | '30D' | '60D' | '90D' | '180D' | '365D'>('30D');
  const [activeTab, setActiveTab] = useState<'TRENDS' | 'SCORECARD' | 'RELATIONSHIP' | 'QUALITY'>('TRENDS');
  const [activeMode, setActiveMode] = useState<MarketRankingMode>(analytics.scorecards.activeMode || 'HIGHEST_NRV');

  // Get active window data
  const getActiveWindowData = (): TrendWindowStats => {
    switch (selectedWindow) {
      case '7D': return analytics.windows.d7;
      case '14D': return analytics.windows.d14;
      case '30D': return analytics.windows.d30;
      case '60D': return analytics.windows.d60;
      case '90D': return analytics.windows.d90;
      case '180D': return analytics.windows.d180;
      case '365D': return analytics.windows.d365;
      default: return analytics.windows.d30;
    }
  };

  const windowData = getActiveWindowData();

  const handleModeChange = (mode: MarketRankingMode) => {
    setActiveMode(mode);
    if (onRankingModeChange) onRankingModeChange(mode);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xs space-y-6">
      {/* 1. Header & Evidence Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-extrabold tracking-wider uppercase px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              {analytics.derivedAnalyticsLabel}
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              {analytics.targetMarket} • {analytics.district}, {analytics.state}
            </span>
          </div>
          <h3 className="text-xl font-black text-slate-900 dark:text-slate-100 mt-1">
            Verified Market Intelligence: {analytics.commodity}
          </h3>
        </div>

        {/* Evidence Status Pill */}
        <div className="flex flex-col items-start sm:items-end gap-1">
          <div className={`px-2.5 py-1 rounded-lg text-xs font-black flex items-center gap-1.5 border ${
            analytics.evidenceSufficiency.businessReadiness === 'READY FOR DECISION'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800'
              : analytics.evidenceSufficiency.businessReadiness === 'LIMITED EVIDENCE'
              ? 'bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800'
              : 'bg-rose-50 text-rose-800 border-rose-300 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800'
          }`}>
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{analytics.evidenceSufficiency.businessReadiness}</span>
          </div>
          <span className="text-[10px] text-slate-500 font-medium">
            {analytics.evidenceSufficiency.priceEvidence} • {analytics.evidenceSufficiency.trendEvidence}
          </span>
        </div>
      </div>

      {/* 2. Top Metric Ribbon (Official Observation vs Moving Averages) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Latest Official Observation */}
        <div className="bg-slate-50 dark:bg-slate-950/50 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800">
          <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide flex items-center justify-between">
            <span>LATEST OFFICIAL PRICE</span>
            {analytics.isVerifiedOfficial ? (
              <span className="text-[9px] font-bold text-emerald-700 bg-emerald-100 dark:bg-emerald-950 px-1.5 py-0.2 rounded">VERIFIED</span>
            ) : (
              <span className="text-[9px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.2 rounded">UNVERIFIED</span>
            )}
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 mt-1">
            {analytics.latestPrice ? `₹${analytics.latestPrice.toLocaleString('en-IN')}` : 'N/A'}
            <span className="text-xs font-normal text-slate-500 ml-1">/Qtl</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-1 flex items-center gap-1">
            <Calendar className="w-3 h-3 text-slate-400" />
            <span>{analytics.priceDate || 'No date'} • Range: ₹{analytics.latestMinPrice ?? '—'} - ₹{analytics.latestMaxPrice ?? '—'}</span>
          </div>
        </div>

        {/* 7-Day Moving Average */}
        <div className="bg-slate-50 dark:bg-slate-950/50 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800">
          <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
            7-DAY MOVING AVG
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 mt-1">
            {analytics.movingAverages.ma7Day ? `₹${analytics.movingAverages.ma7Day.toLocaleString('en-IN')}` : 'INSUFFICIENT'}
          </div>
          <div className="text-[10px] mt-1 font-bold">
            {analytics.movingAverages.priceVs7dMaPercent !== null ? (
              <span className={analytics.movingAverages.priceVs7dMaPercent >= 0 ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}>
                {analytics.movingAverages.priceVs7dMaPercent >= 0 ? '+' : ''}{analytics.movingAverages.priceVs7dMaPercent}% vs Spot
              </span>
            ) : (
              <span className="text-slate-400">Min 2 observations req.</span>
            )}
          </div>
        </div>

        {/* 30-Day Moving Average */}
        <div className="bg-slate-50 dark:bg-slate-950/50 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800">
          <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
            30-DAY MOVING AVG
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 mt-1">
            {analytics.movingAverages.ma30Day ? `₹${analytics.movingAverages.ma30Day.toLocaleString('en-IN')}` : 'INSUFFICIENT'}
          </div>
          <div className="text-[10px] mt-1 font-bold">
            {analytics.movingAverages.priceVs30dMaPercent !== null ? (
              <span className={analytics.movingAverages.priceVs30dMaPercent >= 0 ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}>
                {analytics.movingAverages.priceVs30dMaPercent >= 0 ? '+' : ''}{analytics.movingAverages.priceVs30dMaPercent}% vs Spot
              </span>
            ) : (
              <span className="text-slate-400">Min 4 obs across 15d req.</span>
            )}
          </div>
        </div>

        {/* Observed Volatility */}
        <div className="bg-slate-50 dark:bg-slate-950/50 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800">
          <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
            PRICE VOLATILITY (CV)
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 mt-1">
            {analytics.volatility.volatilityScore !== null ? `${analytics.volatility.volatilityScore}%` : 'INSUFFICIENT'}
          </div>
          <div className="text-[10px] text-slate-500 mt-1 font-medium">
            Category: <strong className="text-slate-700 dark:text-slate-300">{analytics.volatility.volatilityCategory}</strong>
          </div>
        </div>
      </div>

      {/* 3. Interactive Section Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 overflow-x-auto pb-1 text-sm font-bold">
        <button
          onClick={() => setActiveTab('TRENDS')}
          className={`px-3 py-2 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'TRENDS'
              ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          Multi-Window Statistical Trends
        </button>
        <button
          onClick={() => setActiveTab('SCORECARD')}
          className={`px-3 py-2 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'SCORECARD'
              ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          6-Mode Market Scorecard ({analytics.scorecards.rankedMarkets.length})
        </button>
        <button
          onClick={() => setActiveTab('RELATIONSHIP')}
          className={`px-3 py-2 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'RELATIONSHIP'
              ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          Price vs Arrival Dynamics
        </button>
        <button
          onClick={() => setActiveTab('QUALITY')}
          className={`px-3 py-2 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'QUALITY'
              ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          Evidence Quality Audit ({analytics.dataQuality.overallEvidenceScore}/100)
        </button>
      </div>

      {/* 4. Tab 1: Multi-Window Statistical Trends */}
      {activeTab === 'TRENDS' && (
        <div className="space-y-4">
          {/* Time Window Switcher */}
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 dark:bg-slate-800/80 p-1.5 rounded-xl">
            {(['7D', '14D', '30D', '60D', '90D', '180D', '365D'] as const).map(w => (
              <button
                key={w}
                onClick={() => setSelectedWindow(w)}
                className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                  selectedWindow === w
                    ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                {w} Window
              </button>
            ))}
          </div>

          {/* Window Evidence Summary Box */}
          <div className={`p-4 rounded-xl border ${
            windowData.isSufficient
              ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/50'
              : 'bg-amber-50/40 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800/50'
          }`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black uppercase text-slate-800 dark:text-slate-200">
                    {windowData.windowLabel} STATISTICAL PROFILE
                  </span>
                  {windowData.isSufficient ? (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      SUFFICIENT EVIDENCE
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3 text-amber-700" />
                      INSUFFICIENT OBSERVATIONS
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  {windowData.isSufficient ? windowData.methodology : windowData.insufficientReason}
                </p>
              </div>

              {windowData.isSufficient && (
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-[10px] text-slate-500 font-bold uppercase">TREND DIRECTION</div>
                    <div className={`text-sm font-black flex items-center gap-1 ${
                      windowData.trendDirection === 'RISING' 
                        ? 'text-emerald-700 dark:text-emerald-400' 
                        : windowData.trendDirection === 'FALLING'
                        ? 'text-rose-600 dark:text-rose-400'
                        : 'text-slate-700 dark:text-slate-300'
                    }`}>
                      {windowData.trendDirection === 'RISING' && <TrendingUp className="w-4 h-4" />}
                      {windowData.trendDirection === 'FALLING' && <TrendingDown className="w-4 h-4" />}
                      {windowData.trendDirection === 'STABLE' && <Minus className="w-4 h-4" />}
                      <span>{windowData.trendDirection} ({windowData.percentageChange}%)</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Detailed Window Statistics Grid */}
            {windowData.isSufficient ? (
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-4 pt-3 border-t border-emerald-200/60 dark:border-emerald-800/40 text-xs">
                <div>
                  <span className="text-slate-500 block">First Obs Price</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">₹{windowData.firstPrice}/Qtl</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Window Average</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">₹{windowData.average}/Qtl</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Window Range (Min-Max)</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">₹{windowData.min} - ₹{windowData.max}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Std Dev & CV</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">₹{windowData.stdDev} ({windowData.coefficientOfVariation}%)</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Observation Depth</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{windowData.observationCount} obs / {windowData.coveragePeriodDays} days</span>
                </div>
              </div>
            ) : (
              <div className="mt-3 p-3 bg-white dark:bg-slate-900 rounded-lg border border-amber-200 text-xs text-amber-900 dark:text-amber-300 space-y-1">
                <strong>Why is this marked INSUFFICIENT?</strong>
                <p>
                  FARMFIT enforces strict evidence gates. Mathematical trend calculations require a minimum of {windowData.minObservationsRequired} verified official AGMARKNET observations across the time window to avoid presenting false confidence to farmers, FPOs, and procurement desks.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 5. Tab 2: 6-Mode Market Scorecard */}
      {activeTab === 'SCORECARD' && (
        <div className="space-y-4">
          {/* Ranking Mode Switcher */}
          <div className="space-y-2">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-emerald-600" />
              <span>Select Ranking Optimization Mode:</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              {[
                { mode: 'HIGHEST_NRV' as MarketRankingMode, label: 'Highest NRV (Farmer/FPO)', icon: DollarSign },
                { mode: 'HIGHEST_GROSS_PRICE' as MarketRankingMode, label: 'Highest Gross Price', icon: TrendingUp },
                { mode: 'LOWEST_B2B_LANDED' as MarketRankingMode, label: 'Lowest B2B Landed Cost', icon: Truck },
                { mode: 'RISK_ADJUSTED' as MarketRankingMode, label: 'Risk-Adjusted Opp.', icon: ShieldCheck },
                { mode: 'CLOSEST_VERIFIED' as MarketRankingMode, label: 'Closest APMC Yard', icon: MapPin },
                { mode: 'MOST_STABLE' as MarketRankingMode, label: 'Most Stable Market', icon: Activity }
              ].map(({ mode, label, icon: Icon }) => (
                <button
                  key={mode}
                  onClick={() => handleModeChange(mode)}
                  className={`p-2.5 rounded-xl border text-left flex flex-col justify-between text-xs font-bold transition-all cursor-pointer ${
                    activeMode === mode
                      ? 'bg-emerald-50 dark:bg-emerald-950 border-emerald-400 dark:border-emerald-700 text-emerald-950 dark:text-emerald-200 shadow-xs'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                  }`}
                >
                  <Icon className="w-4 h-4 mb-1 text-emerald-600 dark:text-emerald-400" />
                  <span className="leading-tight">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Dispersion Summary Header */}
          <div className="p-3 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200 dark:border-slate-800 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span className="font-bold text-slate-700 dark:text-slate-300">
              {analytics.dispersion.dispersionSummary}
            </span>
            <span className="text-[11px] text-slate-500">
              Active Optimization: <strong className="text-slate-900 dark:text-slate-100">{activeMode}</strong>
            </span>
          </div>

          {/* Markets Scorecard Table */}
          <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 font-extrabold border-b border-slate-200 dark:border-slate-700">
                  <th className="p-3">Rank & APMC Yard</th>
                  <th className="p-3">Distance</th>
                  <th className="p-3">Modal Price</th>
                  <th className="p-3">Est. Freight</th>
                  <th className="p-3">Net Realization (NRV)</th>
                  <th className="p-3">B2B Landed Cost</th>
                  <th className="p-3">Optimization Logic</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {analytics.scorecards.rankedMarkets.slice(0, 10).map((m, idx) => (
                  <tr 
                    key={m.marketId || idx}
                    onClick={() => onSelectMarket && onSelectMarket(m.market)}
                    className={`hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors ${
                      idx === 0 ? 'bg-emerald-50/30 dark:bg-emerald-950/20 font-medium' : ''
                    }`}
                  >
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                          idx === 0 
                            ? 'bg-emerald-600 text-white' 
                            : idx === 1 
                            ? 'bg-slate-300 text-slate-800 dark:bg-slate-700 dark:text-slate-200' 
                            : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                        }`}>
                          {idx + 1}
                        </span>
                        <div>
                          <span className="font-black text-slate-900 dark:text-slate-100 block">{m.market}</span>
                          <span className="text-[10px] text-slate-500">{m.district}, {m.state}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 font-semibold text-slate-700 dark:text-slate-300">
                      {m.distanceKm !== null ? `${m.distanceKm} km` : '—'}
                    </td>
                    <td className="p-3 font-black text-slate-900 dark:text-slate-100">
                      {m.modalPrice ? `₹${m.modalPrice.toLocaleString('en-IN')}` : '—'}
                    </td>
                    <td className="p-3 text-slate-600 dark:text-slate-400">
                      {m.freightPerQtl ? `₹${m.freightPerQtl}/Qtl` : '—'}
                    </td>
                    <td className="p-3 font-black text-emerald-800 dark:text-emerald-300">
                      {m.netRealizationPerQtl ? `₹${m.netRealizationPerQtl.toLocaleString('en-IN')}` : '—'}
                    </td>
                    <td className="p-3 font-bold text-slate-700 dark:text-slate-300">
                      {m.estimatedLandedCostPerQtl ? `₹${m.estimatedLandedCostPerQtl.toLocaleString('en-IN')}` : '—'}
                    </td>
                    <td className="p-3 text-[11px] text-slate-600 dark:text-slate-400 max-w-[200px]">
                      {m.rankingFormulaExplanation}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 6. Tab 3: Price vs Arrival Dynamics */}
      {activeTab === 'RELATIONSHIP' && (
        <div className="space-y-4 text-xs">
          <div className="p-4 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase text-slate-800 dark:text-slate-200">
                PRICE-ARRIVAL INTERACTION MODEL
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                {analytics.arrivals.isNonCausalLabel}
              </span>
            </div>
            <p className="text-sm font-bold text-emerald-800 dark:text-emerald-300">
              {analytics.arrivals.marketRelationship}
            </p>
            <p className="text-slate-600 dark:text-slate-400">
              {analytics.arrivals.relationshipExplanation}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
              <span className="text-slate-500 font-bold uppercase block text-[10px]">APMC Arrival Volume</span>
              <div className="text-lg font-black text-slate-900 dark:text-slate-100 mt-1">
                {analytics.arrivals.latestArrivalQty ? `${analytics.arrivals.latestArrivalQty.toLocaleString('en-IN')} ${analytics.arrivals.arrivalUnit}` : 'UNAVAILABLE'}
              </div>
              <span className="text-[10px] text-slate-500">
                Trend: {analytics.arrivals.arrivalTrendDirection} ({analytics.arrivals.arrivalChange7DPercent !== null ? `${analytics.arrivals.arrivalChange7DPercent}% 7D` : 'N/A'})
              </span>
            </div>

            <div className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
              <span className="text-slate-500 font-bold uppercase block text-[10px]">Seasonality Profile</span>
              <div className="text-lg font-black text-slate-900 dark:text-slate-100 mt-1">
                {analytics.seasonality.status}
              </div>
              <span className="text-[10px] text-slate-500">
                Peak Price Month: {analytics.seasonality.peakPriceMonth || 'N/A'} • Trough: {analytics.seasonality.troughPriceMonth || 'N/A'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 7. Tab 4: Quality & Evidence Audit */}
      {activeTab === 'QUALITY' && (
        <div className="space-y-4 text-xs">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div className="p-3 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
              <span className="text-[10px] font-bold text-slate-500 block uppercase">Price Quality</span>
              <span className="text-xl font-black text-slate-900 dark:text-slate-100 mt-1 block">
                {analytics.dataQuality.priceDataQualityScore}%
              </span>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
              <span className="text-[10px] font-bold text-slate-500 block uppercase">Trend Depth</span>
              <span className="text-xl font-black text-slate-900 dark:text-slate-100 mt-1 block">
                {analytics.dataQuality.trendDataQualityScore}%
              </span>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
              <span className="text-[10px] font-bold text-slate-500 block uppercase">Arrival Completeness</span>
              <span className="text-xl font-black text-slate-900 dark:text-slate-100 mt-1 block">
                {analytics.dataQuality.arrivalDataQualityScore}%
              </span>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
              <span className="text-[10px] font-bold text-slate-500 block uppercase">Freshness</span>
              <span className="text-xl font-black text-slate-900 dark:text-slate-100 mt-1 block">
                {analytics.dataQuality.freshnessScore}%
              </span>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
              <span className="text-[10px] font-bold text-slate-500 block uppercase">Market Stability</span>
              <span className="text-xl font-black text-emerald-800 dark:text-emerald-300 mt-1 block">
                {analytics.stability.stabilityScore}/100
              </span>
            </div>
          </div>

          {/* Audit Deficits */}
          {analytics.dataQuality.evidenceDeficits.length > 0 && (
            <div className="p-3 bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl space-y-1">
              <span className="text-[11px] font-bold text-amber-900 dark:text-amber-300 uppercase block">
                Identified Evidence Constraints:
              </span>
              <ul className="list-disc list-inside text-amber-800 dark:text-amber-400 space-y-0.5">
                {analytics.dataQuality.evidenceDeficits.map((d, i) => (
                  <li key={i}>{d}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
