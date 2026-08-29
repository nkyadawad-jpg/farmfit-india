/**
 * FARMFIT AGRICULTURAL EARLY WARNING + OPPORTUNITY INTELLIGENCE SYSTEM
 * 
 * Executive View Component: "FARMFIT INDIA AGRICULTURAL PULSE"
 * 
 * Comprehensive Modules:
 * 1. Executive Agricultural Pulse & Market Regime Banner
 * 2. Real-Time Alert Engine (Priority, Lifecycle, "Why Did FARMFIT Alert Me?")
 * 3. Data Control Center (AGMARKNET, IMD, CACP, data.gov.in, NHB, Spices Board)
 * 4. Multi-Stakeholder Action Centers (Farmer, FPO, B2B, Government)
 * 5. Opportunity vs Risk 4-Quadrant Matrix
 * 6. Market Spread & Multi-Mandi Distance Radius Explorer
 * 7. Price & Arrival Anomaly & Seasonality Explorer
 * 8. Model Health, Brier Score Calibration & Degradation Protection
 * 9. Universal Multi-Entity Agricultural Search
 */

import React, { useState, useMemo } from 'react';
import { 
  ShieldAlert, 
  Activity, 
  Database, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown, 
  Layers, 
  MapPin, 
  Search, 
  HelpCircle, 
  Compass, 
  Scale, 
  Truck, 
  RefreshCw, 
  ExternalLink, 
  ChevronRight, 
  ArrowUpRight, 
  ArrowDownRight, 
  Flame, 
  Clock, 
  Eye, 
  Users, 
  Building2, 
  Landmark, 
  BarChart3, 
  CheckCheck,
  Wheat,
  Sliders,
  Filter,
  Info
} from 'lucide-react';
import { earlyWarningIntelligenceEngine } from '../services/earlyWarningIntelligenceEngine';
import { 
  SystemEarlyWarningAlert, 
  PriceAnomalySignal, 
  DataControlCenterSourceItem, 
  OpportunityRiskMatrixItem,
  GovernmentEconomicWarningItem,
  FarmerOpportunityItem,
  FpoMarketOpportunityItem,
  B2bProcurementOpportunityItem
} from '../types/earlyWarningIntelligence';
import { Language } from '../types';

interface EarlyWarningIntelligencePulseViewProps {
  userDistrict?: string;
  language?: Language;
  onNavigateToMandi?: () => void;
  onNavigateToValidation?: () => void;
  onNavigateToStakeholder?: (stakeholder: string) => void;
}

export const EarlyWarningIntelligencePulseView: React.FC<EarlyWarningIntelligencePulseViewProps> = ({
  userDistrict = 'Belagavi',
  language = 'en',
  onNavigateToMandi,
  onNavigateToValidation,
  onNavigateToStakeholder
}) => {
  // Navigation & Sub-Tab State
  const [activeTab, setActiveTab] = useState<
    'alerts' | 'datacontrol' | 'actions' | 'matrix' | 'spreads' | 'anomalies' | 'modelhealth' | 'search'
  >('alerts');

  // Filter States
  const [selectedSeverityFilter, setSelectedSeverityFilter] = useState<string>('ALL');
  const [selectedStakeholderActionTab, setSelectedStakeholderActionTab] = useState<'FARMER' | 'FPO' | 'B2B' | 'GOVERNMENT'>('FARMER');
  const [selectedRadiusKm, setSelectedRadiusKm] = useState<number>(100);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedAlertForDrawer, setSelectedAlertForDrawer] = useState<SystemEarlyWarningAlert | null>(null);

  // Engine Data Memoization
  const sources = useMemo(() => earlyWarningIntelligenceEngine.getDataControlCenterSources(), []);
  const controlSummary = useMemo(() => earlyWarningIntelligenceEngine.getDataControlCenterSummary(), []);
  const priceAnomalies = useMemo(() => earlyWarningIntelligenceEngine.getPriceAnomalies(), []);
  const arrivalAnomalies = useMemo(() => earlyWarningIntelligenceEngine.getArrivalAnomalies(), []);
  const spreads = useMemo(() => earlyWarningIntelligenceEngine.getMarketSpreadComparisons(), []);
  const breadth = useMemo(() => earlyWarningIntelligenceEngine.getAgriculturalMarketBreadth(), []);
  const alerts = useMemo(() => earlyWarningIntelligenceEngine.getSystemAlerts(), []);
  const matrix = useMemo(() => earlyWarningIntelligenceEngine.getOpportunityRiskMatrix(), []);
  const modelHealth = useMemo(() => earlyWarningIntelligenceEngine.getModelHealthMetrics(), []);
  const farmerOpps = useMemo(() => earlyWarningIntelligenceEngine.getFarmerOpportunities(userDistrict, selectedRadiusKm), [userDistrict, selectedRadiusKm]);
  const fpoOpps = useMemo(() => earlyWarningIntelligenceEngine.getFpoMarketOpportunities(), []);
  const b2bOpps = useMemo(() => earlyWarningIntelligenceEngine.getB2bProcurementOpportunities(), []);
  const govWarnings = useMemo(() => earlyWarningIntelligenceEngine.getGovernmentEconomicWarnings(), []);
  const actionRecommendations = useMemo(() => earlyWarningIntelligenceEngine.getActionCenterRecommendations(selectedStakeholderActionTab), [selectedStakeholderActionTab]);

  // Search Results
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return earlyWarningIntelligenceEngine.universalSearch(searchQuery);
  }, [searchQuery]);

  // Filtered Alerts
  const filteredAlerts = useMemo(() => {
    if (selectedSeverityFilter === 'ALL') return alerts;
    return alerts.filter(a => a.priorityTier === selectedSeverityFilter);
  }, [alerts, selectedSeverityFilter]);

  return (
    <div id="farmfit-early-warning-pulse-view" className="space-y-6">
      {/* ========================================================================= */}
      {/* 1. EXECUTIVE AGRICULTURAL PULSE & MARKET REGIME HEADER                   */}
      {/* ========================================================================= */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white rounded-2xl p-6 shadow-xl border border-emerald-500/20 relative overflow-hidden">
        {/* Background Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 border border-emerald-400/40 text-emerald-300">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  LIVE OPERATING SYSTEM
                </span>
                <span className="text-xs text-slate-300">
                  As of Official Bulletin: <strong>{breadth.asOfDate}</strong> (08:30 IST)
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2.5">
                <Activity className="w-7 h-7 text-emerald-400" />
                FARMFIT India Agricultural Pulse
              </h1>
              <p className="text-sm text-slate-300 max-w-3xl mt-1">
                Continuous Agricultural Early Warning &amp; Multi-Stakeholder Opportunity Intelligence across 40+ Official Commodities &amp; 3,000+ APMC Yards.
              </p>
            </div>

            {/* Market Regime Badge */}
            <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-700/80 rounded-xl p-3.5 text-right shrink-0">
              <div className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
                Detected Market Regime
              </div>
              <div className="text-base font-bold text-amber-300 flex items-center justify-end gap-1.5 mt-0.5">
                <Flame className="w-4 h-4 text-amber-400" />
                {breadth.detectedMarketRegime.replace(/_/g, ' ')}
              </div>
              <div className="text-[11px] text-slate-300 max-w-xs mt-1 text-right">
                {breadth.regimeMathematicalJustification}
              </div>
            </div>
          </div>

          {/* Real-Time Breadth Metrics Ribbon */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3 pt-2 border-t border-slate-800">
            <div className="bg-slate-800/60 rounded-lg p-2.5 border border-slate-700/50">
              <div className="text-[11px] text-slate-400 font-medium">Official Commodities</div>
              <div className="text-lg font-bold text-white mt-0.5">{breadth.overallValidCommoditiesCount} Items</div>
              <div className="text-[10px] text-emerald-400">100% Zero-Fabrication</div>
            </div>

            <div className="bg-slate-800/60 rounded-lg p-2.5 border border-slate-700/50">
              <div className="text-[11px] text-slate-400 font-medium">Upward Velocity</div>
              <div className="text-lg font-bold text-emerald-400 mt-0.5 flex items-center gap-1">
                <ArrowUpRight className="w-4 h-4" />
                {breadth.overallRisingPercent}% <span className="text-xs font-normal text-slate-400">({breadth.overallRisingCount})</span>
              </div>
              <div className="text-[10px] text-slate-400">Tomato, Carrot, Turmeric</div>
            </div>

            <div className="bg-slate-800/60 rounded-lg p-2.5 border border-slate-700/50">
              <div className="text-[11px] text-slate-400 font-medium">Downward Pressure</div>
              <div className="text-lg font-bold text-rose-400 mt-0.5 flex items-center gap-1">
                <ArrowDownRight className="w-4 h-4" />
                {breadth.overallFallingPercent}% <span className="text-xs font-normal text-slate-400">({breadth.overallFallingCount})</span>
              </div>
              <div className="text-[10px] text-slate-400">Soybean, Onion (pre-Kharif)</div>
            </div>

            <div className="bg-slate-800/60 rounded-lg p-2.5 border border-slate-700/50">
              <div className="text-[11px] text-slate-400 font-medium">Stable Baselines</div>
              <div className="text-lg font-bold text-sky-400 mt-0.5">
                {breadth.overallStablePercent}% <span className="text-xs font-normal text-slate-400">({breadth.overallStableCount})</span>
              </div>
              <div className="text-[10px] text-slate-400">Wheat, Bajra, Paddy, Maize</div>
            </div>

            <div className="bg-slate-800/60 rounded-lg p-2.5 border border-slate-700/50 col-span-2 sm:col-span-1">
              <div className="text-[11px] text-slate-400 font-medium">Data Freshness Index</div>
              <div className="text-lg font-bold text-emerald-300 mt-0.5">
                {controlSummary.overallFreshnessScorePercent}%
              </div>
              <div className="text-[10px] text-slate-400">{controlSummary.liveCurrentCount} Live &bull; {controlSummary.recentCount} Recent</div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. SUB-NAVIGATION TABS                                                    */}
      {/* ========================================================================= */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-1.5 shadow-xs border border-slate-200 dark:border-slate-800 flex items-center gap-1 overflow-x-auto">
        <button
          onClick={() => setActiveTab('alerts')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'alerts'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>Live Alerts &amp; Anomalies</span>
          <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-rose-500/20 text-rose-300 font-bold">
            {alerts.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('datacontrol')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'datacontrol'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>Data Control Center</span>
          <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-500/20 text-emerald-300 font-bold">
            {controlSummary.liveCurrentCount}/{controlSummary.totalSourcesConfigured} Live
          </span>
        </button>

        <button
          onClick={() => setActiveTab('actions')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'actions'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Action Centers</span>
        </button>

        <button
          onClick={() => setActiveTab('matrix')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'matrix'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Opportunity vs Risk Matrix</span>
        </button>

        <button
          onClick={() => setActiveTab('spreads')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'spreads'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>Market Spreads &amp; Map</span>
        </button>

        <button
          onClick={() => setActiveTab('anomalies')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'anomalies'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Statistical Anomalies</span>
        </button>

        <button
          onClick={() => setActiveTab('modelhealth')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'modelhealth'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <CheckCheck className="w-4 h-4" />
          <span>Model Health &amp; Drift</span>
        </button>

        <button
          onClick={() => setActiveTab('search')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'search'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Search className="w-4 h-4" />
          <span>Universal Search</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: LIVE ALERTS & ANOMALIES                                            */}
      {/* ========================================================================= */}
      {activeTab === 'alerts' && (
        <div className="space-y-6">
          {/* Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-500" />
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200">Filter By Severity:</span>
              {(['ALL', 'CRITICAL', 'ACTION', 'WATCH', 'INFORMATION'] as const).map(sev => (
                <button
                  key={sev}
                  onClick={() => setSelectedSeverityFilter(sev)}
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                    selectedSeverityFilter === sev
                      ? 'bg-slate-900 text-white dark:bg-emerald-700'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {sev}
                </button>
              ))}
            </div>

            <div className="text-xs text-slate-500 dark:text-slate-400">
              Showing <strong>{filteredAlerts.length}</strong> active alerts (Deduplicated with Provenance)
            </div>
          </div>

          {/* Alert Cards List */}
          <div className="space-y-4">
            {filteredAlerts.map(alert => {
              const priorityBadge = 
                alert.priorityTier === 'CRITICAL' ? 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800' :
                alert.priorityTier === 'ACTION' ? 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800' :
                alert.priorityTier === 'WATCH' ? 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800' :
                'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800';

              return (
                <div
                  key={alert.alertId}
                  className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 dark:hover:border-emerald-500/50 shadow-xs transition-all space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${priorityBadge}`}>
                        {alert.priorityTier}
                      </span>
                      <span className="px-2 py-0.5 rounded text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {alert.targetStakeholder}
                      </span>
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(alert.firstDetectedTimestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                      <span className="text-xs font-mono text-slate-400 bg-slate-50 dark:bg-slate-800/50 px-1.5 py-0.5 rounded">
                        Status: {alert.status}
                      </span>
                    </div>

                    <button
                      onClick={() => setSelectedAlertForDrawer(alert)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:underline cursor-pointer"
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                      Why Did FARMFIT Alert Me?
                    </button>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                      {alert.headline}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
                      {alert.detailedMessage}
                    </p>
                  </div>

                  {/* Recommended Action & Provenance Mini-Bar */}
                  <div className="bg-slate-50 dark:bg-slate-800/60 rounded-lg p-3 border border-slate-200/60 dark:border-slate-700/60 space-y-2">
                    <div className="text-xs text-slate-700 dark:text-slate-200">
                      <strong>Recommended Action:</strong> {alert.recommendedAction}
                    </div>
                    <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-200 dark:border-slate-700/40">
                      <span>Source: <strong>{alert.provenance.officialSource}</strong> ({alert.provenance.observationDate})</span>
                      <span>Confidence Score: <strong>{alert.provenance.confidenceScorePercent}%</strong></span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Government Policy Warnings Section */}
          <div className="bg-slate-900 text-white rounded-xl p-5 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Landmark className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-white">Government &amp; Economic Early Warnings</h3>
              </div>
              <span className="text-xs text-slate-400">Classification: Macro Economic Stress &amp; Supply Monitoring</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {govWarnings.map(w => (
                <div key={w.warningId} className="bg-slate-800/80 rounded-lg p-4 border border-slate-700 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                      w.severity === 'RED' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' :
                      w.severity === 'ORANGE' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                      'bg-yellow-500/20 text-yellow-300 border border-yellow-500/40'
                    }`}>
                      {w.severity} SEVERITY
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">{w.whenDateDetected}</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-100">{w.whatChanged}</h4>
                  <p className="text-[11px] text-slate-300 line-clamp-3">{w.whyItMatters}</p>
                  <div className="text-[10px] text-slate-400 pt-2 border-t border-slate-700">
                    Who is exposed: <strong className="text-slate-200">{w.whoIsExposed}</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: DATA CONTROL CENTER                                                */}
      {/* ========================================================================= */}
      {activeTab === 'datacontrol' && (
        <div className="space-y-6">
          {/* Summary Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="text-xs text-slate-500">Live / Current Feeds</div>
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                {controlSummary.liveCurrentCount} / {controlSummary.totalSourcesConfigured}
              </div>
              <div className="text-[11px] text-slate-400">AGMARKNET, CACP, OGD</div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="text-xs text-slate-500">Total Observations Indexed</div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                {controlSummary.totalOfficialRecordsIndexed.toLocaleString('en-IN')}
              </div>
              <div className="text-[11px] text-slate-400">Verified official records</div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="text-xs text-slate-500">Stale / Pending Refresh</div>
              <div className="text-2xl font-bold text-amber-500 mt-1">
                {controlSummary.staleCount} Feed
              </div>
              <div className="text-[11px] text-slate-400">APEDA Trade Registry</div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="text-xs text-slate-500">Credentials Required</div>
              <div className="text-2xl font-bold text-rose-500 mt-1">
                {controlSummary.unavailableCount} Feed
              </div>
              <div className="text-[11px] text-slate-400">DES &amp; RBI Input Cost Index</div>
            </div>
          </div>

          {/* Official Registry Table */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Official Agricultural Data Source Control Matrix
                </h3>
                <p className="text-xs text-slate-500">
                  Continuous validation of official government endpoints with zero-fabrication guarantees.
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                100% Traceable
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
                <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 font-semibold border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="p-3">Data Source &amp; Authority</th>
                    <th className="p-3">Operational Status</th>
                    <th className="p-3">Latest Observation</th>
                    <th className="p-3">Data Age</th>
                    <th className="p-3">Record Count</th>
                    <th className="p-3">Next Scheduled Refresh</th>
                    <th className="p-3">Endpoint / Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {sources.map(src => {
                    const statusBadge = 
                      src.status === 'LIVE / CURRENT' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300' :
                      src.status === 'RECENT' ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300' :
                      src.status === 'STALE' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300' :
                      'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300';

                    return (
                      <tr key={src.sourceId} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                        <td className="p-3 font-medium text-slate-900 dark:text-slate-100">
                          <div>{src.sourceName}</div>
                          <div className="text-[10px] text-slate-500">{src.officialAgency}</div>
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${statusBadge}`}>
                            {src.status}
                          </span>
                        </td>
                        <td className="p-3 font-mono">{src.latestObservationDate}</td>
                        <td className="p-3">{src.freshnessLabel}</td>
                        <td className="p-3 font-mono">{src.recordCount ? src.recordCount.toLocaleString('en-IN') : 'N/A'}</td>
                        <td className="p-3 font-mono text-[11px]">{new Date(src.nextRefreshEligibility).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</td>
                        <td className="p-3 text-[11px]">
                          {src.errorStatus ? (
                            <span className="text-rose-600 dark:text-rose-400 font-semibold">{src.errorStatus}</span>
                          ) : (
                            <span className="text-slate-500">{src.notes}</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: MULTI-STAKEHOLDER ACTION CENTERS                                   */}
      {/* ========================================================================= */}
      {activeTab === 'actions' && (
        <div className="space-y-6">
          {/* Stakeholder Selector */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { id: 'FARMER', label: 'Farmer Action Center', icon: Wheat, desc: 'Harvest & Mandi Dispatch' },
              { id: 'FPO', label: 'FPO Collective Center', icon: Users, desc: 'Bulk Aggregation & Arbitrage' },
              { id: 'B2B', label: 'B2B Procurement', icon: Building2, desc: 'Landed Cost & Sourcing' },
              { id: 'GOVERNMENT', label: 'Government & Policy', icon: Landmark, desc: 'Price Support & Food Security' }
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setSelectedStakeholderActionTab(item.id as any)}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                  selectedStakeholderActionTab === item.id
                    ? 'bg-emerald-900 text-white border-emerald-700 shadow-md'
                    : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <item.icon className="w-5 h-5 text-emerald-400" />
                  <span className="text-sm font-bold">{item.label}</span>
                </div>
                <div className="text-xs text-slate-400 mt-1">{item.desc}</div>
              </button>
            ))}
          </div>

          {/* Action Recommendations List */}
          <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                Action Recommendations for {selectedStakeholderActionTab}
              </h3>
              <span className="text-xs text-slate-500">Verified against latest daily official bulletins</span>
            </div>

            <div className="space-y-4">
              {actionRecommendations.map(rec => (
                <div key={rec.id} className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                      {rec.category.replace(/_/g, ' ')}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">Date: {rec.observationDate}</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{rec.title}</h4>
                  <p className="text-xs text-slate-700 dark:text-slate-300"><strong>Action:</strong> {rec.actionSummary}</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400"><strong>Reason:</strong> {rec.reason}</p>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-700">
                    Official Evidence: <span className="font-mono">{rec.officialEvidence}</span> &bull; Confidence: <strong className="text-emerald-600 dark:text-emerald-400">{rec.confidenceTier}</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: OPPORTUNITY VS RISK MATRIX                                         */}
      {/* ========================================================================= */}
      {activeTab === 'matrix' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                4-Quadrant Opportunity vs. Risk Matrix
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Quantitative risk-adjusted scoring based on APMC price momentum, physical liquidity, storage perishability, and price stability.
              </p>
            </div>

            {/* 4 Quadrants Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Quadrant 1: HIGH OPP / LOW RISK */}
              <div className="p-4 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
                    High Opportunity &bull; Low Risk (Prime Focus)
                  </span>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                </div>
                <div className="space-y-2">
                  {matrix.filter(m => m.quadrant === 'HIGH_OPP_LOW_RISK').map(item => (
                    <div key={item.id} className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-emerald-200/60 dark:border-emerald-800/60 text-xs space-y-1">
                      <div className="flex items-center justify-between font-bold text-slate-900 dark:text-slate-100">
                        <span>{item.name}</span>
                        <span className="text-emerald-600 font-mono">₹{item.modalPrice}/Qtl</span>
                      </div>
                      <div className="text-[11px] text-slate-500">{item.location} &bull; {item.trend}</div>
                      <div className="text-[10px] text-slate-600 dark:text-slate-400">{item.primaryDriver}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quadrant 2: HIGH OPP / HIGH RISK */}
              <div className="p-4 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider">
                    High Opportunity &bull; High Risk (Volatile / Caution)
                  </span>
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                </div>
                <div className="space-y-2">
                  {matrix.filter(m => m.quadrant === 'HIGH_OPP_HIGH_RISK').map(item => (
                    <div key={item.id} className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-amber-200/60 dark:border-amber-800/60 text-xs space-y-1">
                      <div className="flex items-center justify-between font-bold text-slate-900 dark:text-slate-100">
                        <span>{item.name}</span>
                        <span className="text-amber-600 font-mono">₹{item.modalPrice}/Qtl</span>
                      </div>
                      <div className="text-[11px] text-slate-500">{item.location} &bull; {item.trend}</div>
                      <div className="text-[10px] text-slate-600 dark:text-slate-400">{item.primaryDriver}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quadrant 3: LOW OPP / LOW RISK */}
              <div className="p-4 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Low Opportunity &bull; Low Risk (Defensive / Stable)
                  </span>
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
                </div>
                <div className="space-y-2">
                  {matrix.filter(m => m.quadrant === 'LOW_OPP_LOW_RISK').map(item => (
                    <div key={item.id} className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs space-y-1">
                      <div className="flex items-center justify-between font-bold text-slate-900 dark:text-slate-100">
                        <span>{item.name}</span>
                        <span className="text-slate-700 dark:text-slate-300 font-mono">₹{item.modalPrice}/Qtl</span>
                      </div>
                      <div className="text-[11px] text-slate-500">{item.location} &bull; {item.trend}</div>
                      <div className="text-[10px] text-slate-600 dark:text-slate-400">{item.primaryDriver}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quadrant 4: LOW OPP / HIGH RISK */}
              <div className="p-4 rounded-xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-rose-800 dark:text-rose-300 uppercase tracking-wider">
                    Low Opportunity &bull; High Risk (Avoid / Speculative)
                  </span>
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                </div>
                <div className="space-y-2">
                  {matrix.filter(m => m.quadrant === 'LOW_OPP_HIGH_RISK').map(item => (
                    <div key={item.id} className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-rose-200/60 dark:border-rose-800/60 text-xs space-y-1">
                      <div className="flex items-center justify-between font-bold text-slate-900 dark:text-slate-100">
                        <span>{item.name}</span>
                        <span className="text-rose-600 font-mono">₹{item.modalPrice}/Qtl</span>
                      </div>
                      <div className="text-[11px] text-slate-500">{item.location} &bull; {item.trend}</div>
                      <div className="text-[10px] text-slate-600 dark:text-slate-400">{item.primaryDriver}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: MARKET SPREADS & RADIUS EXPLORER                                    */}
      {/* ========================================================================= */}
      {activeTab === 'spreads' && (
        <div className="space-y-6">
          {/* Radius Selector */}
          <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Inter-Mandi Price Spread &amp; Logistics Radius
              </h3>
              <p className="text-xs text-slate-500">
                Evaluating price differentials from your district: <strong>{userDistrict}</strong>
              </p>
            </div>
            <div className="flex items-center gap-1.5">
              {[50, 100, 150, 200].map(r => (
                <button
                  key={r}
                  onClick={() => setSelectedRadiusKm(r)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    selectedRadiusKm === r
                      ? 'bg-emerald-800 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {r} km
                </button>
              ))}
            </div>
          </div>

          {/* Farmer Opportunities Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {farmerOpps.map(opp => (
              <div
                key={opp.opportunityId}
                className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                    {opp.commodityName}
                  </span>
                  <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                    ₹{opp.latestOfficialModalPrice}/Qtl
                  </span>
                </div>

                <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
                  <div>Best Market: <strong>{opp.bestMarketName}</strong> ({opp.distanceKm} km)</div>
                  <div>Estimated NRV: <strong className="text-emerald-600 dark:text-emerald-400 font-mono">₹{opp.estimatedNrvInrPerQtl}/Qtl</strong> (after ₹{opp.transportCostInrPerQtl} freight)</div>
                  <div>Net Advantage Over Local: <strong className="text-emerald-600">+₹{opp.nrvAdvantageOverLocalInrPerQtl}/Qtl</strong></div>
                </div>

                <div className="p-2.5 rounded bg-slate-50 dark:bg-slate-800/60 text-xs text-slate-600 dark:text-slate-300">
                  {opp.actionableRecommendation}
                </div>

                <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span>Observed: {opp.observationDate}</span>
                  <span>Confidence: <strong>{opp.confidenceTier}</strong></span>
                </div>
              </div>
            ))}
          </div>

          {/* Multi-Mandi Spread Table */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
              <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                Cross-Market Spread Benchmarks (Variety &amp; Grade Matched)
              </h4>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
                <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="p-3">Commodity</th>
                    <th className="p-3">Spread Tier</th>
                    <th className="p-3">Highest Modal Market</th>
                    <th className="p-3">Lowest Modal Market</th>
                    <th className="p-3">Absolute Spread</th>
                    <th className="p-3">% Spread</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {spreads.map(s => (
                    <tr key={s.commodityId} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="p-3 font-medium text-slate-900 dark:text-slate-100">{s.commodityName}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                          s.spreadTier === 'HIGH_PRICE_SPREAD' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300' :
                          'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                        }`}>
                          {s.spreadTier.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="p-3 font-mono">{s.regionalPremiumMarket}</td>
                      <td className="p-3 font-mono">{s.regionalDiscountMarket}</td>
                      <td className="p-3 font-mono font-bold text-emerald-600 dark:text-emerald-400">₹{s.absolutePriceSpreadInrPerQtl}/Qtl</td>
                      <td className="p-3 font-mono font-bold">{s.percentageSpread}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 6: STATISTICAL ANOMALIES                                              */}
      {/* ========================================================================= */}
      {activeTab === 'anomalies' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Statistical Price Velocity &amp; Anomaly Signals
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Rolling 7D, 30D, and 90D standard deviations, price velocity (dP/dt), and statistical Z-score calculations.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
                <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="p-3">Commodity</th>
                    <th className="p-3">APMC Mandi</th>
                    <th className="p-3">Current Modal</th>
                    <th className="p-3">30D Baseline</th>
                    <th className="p-3">Velocity (%/day)</th>
                    <th className="p-3">Z-Score</th>
                    <th className="p-3">Anomaly Type</th>
                    <th className="p-3">Severity</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {priceAnomalies.map(ano => (
                    <tr key={ano.signalId} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="p-3 font-medium text-slate-900 dark:text-slate-100">{ano.commodityName}</td>
                      <td className="p-3">{ano.marketName}</td>
                      <td className="p-3 font-mono font-bold">₹{ano.currentModalPrice}/Qtl</td>
                      <td className="p-3 font-mono text-slate-500">₹{ano.baseline30d || 'N/A'}/Qtl</td>
                      <td className="p-3 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        {ano.priceVelocityPercentPerDay > 0 ? '+' : ''}{ano.priceVelocityPercentPerDay}%/d
                      </td>
                      <td className="p-3 font-mono font-bold">{ano.zScore !== null ? ano.zScore : 'N/A'}</td>
                      <td className="p-3 font-semibold">{ano.anomalyType.replace(/_/g, ' ')}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                          ano.anomalySeverity === 'CRITICAL' ? 'bg-rose-100 text-rose-800' :
                          ano.anomalySeverity === 'HIGH' ? 'bg-amber-100 text-amber-800' :
                          'bg-slate-100 text-slate-800'
                        }`}>
                          {ano.anomalySeverity}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 7: MODEL HEALTH & DRIFT MONITOR                                       */}
      {/* ========================================================================= */}
      {activeTab === 'modelhealth' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="text-xs text-slate-500">Historical Decision Accuracy</div>
              <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                {modelHealth.predictionAccuracyPercent}%
              </div>
              <div className="text-xs text-slate-400 mt-1">Audited on {modelHealth.totalDecisionsAudited} walk-forward decisions</div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="text-xs text-slate-500">Confidence Calibration (Brier Score)</div>
              <div className="text-3xl font-bold text-sky-600 dark:text-sky-400 mt-1">
                {modelHealth.confidenceCalibrationBrierScore}
              </div>
              <div className="text-xs text-slate-400 mt-1">0.00 = Perfect &bull; 0.25 = Random Guess</div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="text-xs text-slate-500">Degradation Protection Tier</div>
              <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-2">
                {modelHealth.degradationProtectionStatus}
              </div>
              <div className="text-xs text-slate-400 mt-1">{modelHealth.confidenceRestrictionPolicy}</div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              FARMFIT Self-Monitoring Model Governance Architecture
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              The continuous operating loop evaluates every prediction against subsequent official market evidence. If rolling 30-day accuracy drops below 65%, or if model drift is detected, FARMFIT automatically restricts confidence scoring across all views and alerts users of degraded model performance.
            </p>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 8: UNIVERSAL SEARCH                                                   */}
      {/* ========================================================================= */}
      {activeTab === 'search' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Universal Multi-Entity Agricultural Intelligence Search
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Instant search across 40+ canonical commodities (English, Hindi, Aliases) and 3,000+ APMC Mandi yards.
              </p>
            </div>

            <div className="relative">
              <Search className="w-5 h-5 absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search commodity (e.g., Tomato, Bajra, Soybean, Carrot) or APMC market (e.g., Belagavi, Indore, Lasalgaon)..."
                className="w-full pl-11 pr-4 py-2.5 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {searchQuery && (
              <div className="space-y-3 pt-2">
                <div className="text-xs font-semibold text-slate-500">
                  Search Results ({searchResults.length} matches)
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {searchResults.map(res => (
                    <div key={res.id} className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 space-y-1">
                      <div className="flex items-center justify-between font-bold text-sm text-slate-900 dark:text-slate-100">
                        <span>{res.title}</span>
                        {res.modalPrice && <span className="font-mono text-emerald-600">₹{res.modalPrice}/Qtl</span>}
                      </div>
                      <div className="text-xs text-slate-500">{res.subtitle}</div>
                      <div className="text-[11px] text-slate-600 dark:text-slate-400 pt-1 flex items-center gap-3">
                        <span>Farmer Opp: <strong>{res.farmerOpportunityCount}</strong></span>
                        <span>FPO Opp: <strong>{res.fpoOpportunityCount}</strong></span>
                        <span>B2B Opp: <strong>{res.b2bOpportunityCount}</strong></span>
                      </div>
                    </div>
                  ))}
                  {searchResults.length === 0 && (
                    <div className="text-xs text-slate-500 col-span-2 py-4 text-center">
                      No matching commodities or markets found. Try searching for "Tomato", "Soybean", "Carrot", "Belagavi", or "Indore".
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* "WHY DID FARMFIT ALERT ME?" MODAL DRAWER                                  */}
      {/* ========================================================================= */}
      {selectedAlertForDrawer && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5">
            <div className="flex items-start justify-between">
              <div>
                <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                  ALERT PROVENANCE &amp; STATISTICAL AUDIT
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-2">
                  {selectedAlertForDrawer.headline}
                </h3>
              </div>
              <button
                onClick={() => setSelectedAlertForDrawer(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-700 dark:text-slate-300">
              <div className="p-3.5 rounded-lg bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-slate-800 dark:text-slate-200 font-medium">
                {selectedAlertForDrawer.whyDidFarmfitAlertMe}
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                <div><strong>Official Source:</strong> {selectedAlertForDrawer.provenance.officialSource}</div>
                <div><strong>Observation Date:</strong> {selectedAlertForDrawer.provenance.observationDate}</div>
                <div><strong>Calculation Formula:</strong> <code className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded font-mono">{selectedAlertForDrawer.provenance.calculationFormula}</code></div>
                <div><strong>Statistical Trigger Rule:</strong> {selectedAlertForDrawer.provenance.statisticalRule}</div>
                <div><strong>Confidence Score:</strong> <strong className="text-emerald-600 font-mono">{selectedAlertForDrawer.provenance.confidenceScorePercent}%</strong></div>
                <div><strong>Supporting Official Bulletins:</strong> {selectedAlertForDrawer.provenance.supportingBulletinsCount} transactions</div>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setSelectedAlertForDrawer(null)}
                className="px-4 py-2 rounded-lg bg-slate-900 dark:bg-emerald-700 text-white text-xs font-semibold cursor-pointer"
              >
                Close Audit Window
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
