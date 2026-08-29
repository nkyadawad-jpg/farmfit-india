import React, { useState, useMemo } from 'react';
import { 
  ShieldAlert, Activity, Database, Sparkles, AlertTriangle, TrendingUp, TrendingDown, 
  Layers, MapPin, Search, HelpCircle, Compass, Scale, Truck, RefreshCw, ExternalLink, 
  ChevronRight, ArrowUpRight, ArrowDownRight, Flame, Clock, Eye, Users, Building2, Landmark, 
  BarChart3, CheckCheck, Wheat, Filter, Info, Shield, Target, Zap
} from 'lucide-react';
import { exposureIntelligenceEngine } from '../services/exposureIntelligenceEngine';
import { earlyWarningIntelligenceEngine } from '../services/earlyWarningIntelligenceEngine';
import { ALL_CANONICAL_COMMODITIES } from '../data/canonicalCommodityUniverse';
import { DecisionCard, ShockEventType } from '../types/exposureIntelligence';
import { Language } from '../types';

interface AgriculturalControlTowerViewProps {
  userDistrict?: string;
  language?: Language;
}

export const AgriculturalControlTowerView: React.FC<AgriculturalControlTowerViewProps> = ({
  userDistrict = 'Belagavi',
  language = 'en'
}) => {
  const [activeTab, setActiveTab] = useState<'MACRO' | 'FARMER' | 'FPO' | 'B2B' | 'GOVERNMENT' | 'DECISIONS' | 'SIMULATOR'>('MACRO');
  
  // Data fetch
  const controlTower = useMemo(() => exposureIntelligenceEngine.getControlTowerMetrics(), []);
  const fpoPortfolio = useMemo(() => exposureIntelligenceEngine.getFpoPortfolioExposure(), []);
  const fpoStress = useMemo(() => exposureIntelligenceEngine.getFpoStressTest(), []);
  const govExposure = useMemo(() => exposureIntelligenceEngine.getDistrictExposureScore(userDistrict), [userDistrict]);
  const b2bExposure = useMemo(() => exposureIntelligenceEngine.getB2bProcurementExposure('onion', 1000), []);
  const farmerExposure = useMemo(() => exposureIntelligenceEngine.getFarmerExposure(userDistrict, 'onion', 10), [userDistrict]);
  
  // Simulation State
  const [simCommodity, setSimCommodity] = useState('onion');
  const [simShock, setSimShock] = useState<ShockEventType>('PRICE_SHOCK');
  const simulationResult = useMemo(() => exposureIntelligenceEngine.simulateEventImpact(simCommodity, simShock), [simCommodity, simShock]);

  // Decisions
  const [decisionStakeholder, setDecisionStakeholder] = useState<'FARMER' | 'FPO' | 'B2B' | 'GOVERNMENT'>('FPO');
  const decisions = useMemo(() => exposureIntelligenceEngine.getDecisionCards(decisionStakeholder), [decisionStakeholder]);

  // ==========================================
  // HELPER COMPONENTS
  // ==========================================
  const ConfidenceBadge = ({ confidence, status }: { confidence: string, status: string }) => {
    if (status === 'INSUFFICIENT_DATA') {
      return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-500 border border-slate-300">INSUFFICIENT DATA</span>;
    }
    const bg = confidence === 'HIGH' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 
               confidence === 'MEDIUM' ? 'bg-amber-100 text-amber-800 border-amber-300' : 
               'bg-rose-100 text-rose-800 border-rose-300';
    return (
      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${bg}`}>
        {confidence} CONFIDENCE
      </span>
    );
  };

  const ExposureBadge = ({ level }: { level: string }) => {
    const bg = level === 'CRITICAL' ? 'bg-rose-600 text-white' : 
               level === 'HIGH' ? 'bg-rose-500 text-white' : 
               level === 'MODERATE' ? 'bg-amber-500 text-white' : 
               level === 'LOW' ? 'bg-emerald-500 text-white' : 
               'bg-slate-300 text-slate-700';
    return <span className={`px-2 py-0.5 rounded text-xs font-bold ${bg}`}>{level}</span>;
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xl border border-indigo-500/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/20 border border-indigo-400/40 text-indigo-300">
                <Shield className="w-3 h-3" />
                INDIA'S DECISION &amp; RISK CONTROL TOWER
              </span>
              <span className="text-xs text-slate-400">As of: {controlTower.asOfDate}</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
              <Target className="w-7 h-7 text-indigo-400" />
              FARMFIT Exposure Engine
            </h1>
            <p className="text-sm text-slate-300 max-w-3xl mt-1">
              Quantifying WHO is exposed, TO WHAT, HOW MUCH, WHY, and WHAT ACTION to take.
            </p>
          </div>

          <div className="bg-slate-800/80 rounded-xl p-4 border border-slate-700 text-right">
            <div className="text-xs text-slate-400 font-semibold uppercase">Macro Market Regime</div>
            <div className="text-lg font-bold text-amber-400 mt-1">{controlTower.agriculturalMarketRegime.replace(/_/g, ' ')}</div>
            <div className="text-[11px] text-slate-300 mt-1 flex gap-2 justify-end">
              <span>Price Stress: <strong className="text-rose-400">{controlTower.priceStressIndex}%</strong></span>
              <span>Supply Stress: <strong className="text-rose-400">{controlTower.supplyStressIndex}%</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* TABS */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-1.5 shadow-sm border border-slate-200 dark:border-slate-800 flex overflow-x-auto gap-1">
        {(['MACRO', 'FARMER', 'FPO', 'B2B', 'GOVERNMENT', 'DECISIONS', 'SIMULATOR'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
              activeTab === tab ? 'bg-indigo-900 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
            }`}
          >
            {tab === 'MACRO' ? 'Macro Control' : 
             tab === 'DECISIONS' ? 'Decision Approvals' : 
             tab === 'SIMULATOR' ? 'Shock Simulator' : `${tab} Exposure`}
          </button>
        ))}
      </div>

      {/* ==================== MACRO ==================== */}
      {activeTab === 'MACRO' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-500" />
              Major Structural Risks
            </h3>
            <div className="space-y-3">
              {controlTower.majorRisks.map((r, i) => (
                <div key={i} className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900">
                  <div className="flex justify-between items-start">
                    <div className="font-bold text-sm text-slate-900 dark:text-slate-100">{r.name}</div>
                    <ExposureBadge level={r.severity} />
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">Exposed: {r.affected}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-500" />
              Major Structural Opportunities
            </h3>
            <div className="space-y-3">
              {controlTower.majorOpportunities.map((o, i) => (
                <div key={i} className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900">
                  <div className="flex justify-between items-start">
                    <div className="font-bold text-sm text-slate-900 dark:text-slate-100">{o.name}</div>
                    <ExposureBadge level={o.potential} />
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">Target: {o.affected}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ==================== FARMER EXPOSURE ==================== */}
      {activeTab === 'FARMER' && (
        <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex justify-between items-end border-b pb-4 dark:border-slate-800">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">MY FARM EXPOSURE</h2>
              <div className="text-sm text-slate-500 mt-1">{farmerExposure.cropName} • {userDistrict}</div>
            </div>
            <ExposureBadge level={farmerExposure.overallExposureLevel} />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
              <div className="text-xs text-slate-500">Estimated Area</div>
              <div className="text-lg font-bold text-slate-900 dark:text-slate-100">{farmerExposure.farmAreaAcres || 'N/A'} Acres</div>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
              <div className="text-xs text-slate-500">Estimated Prod.</div>
              <div className="text-lg font-bold text-slate-900 dark:text-slate-100">{farmerExposure.estimatedProductionTonnes || 'N/A'} Tonnes</div>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
              <div className="text-xs text-slate-500">Current Modal</div>
              <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">₹{farmerExposure.currentModalPrice}/Qtl</div>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
              <div className="text-xs text-slate-500">Best NRV Market</div>
              <div className="text-lg font-bold text-indigo-600 dark:text-indigo-400">₹{farmerExposure.potentialSellingMarkets[0]?.nrv}/Qtl</div>
              <div className="text-[10px] text-slate-500">{farmerExposure.potentialSellingMarkets[0]?.marketName}</div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 border-b pb-2 dark:border-slate-800">Risk Dimensions</h3>
            {[farmerExposure.priceExposure, farmerExposure.weatherRisk, farmerExposure.waterRisk, farmerExposure.priceVolatility].map((dim, i) => (
              <div key={i} className="flex flex-col md:flex-row md:items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900 dark:text-slate-100">{dim.dimension}</span>
                    <ExposureBadge level={dim.exposureLevel} />
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">{dim.evidence}</div>
                  <div className="text-[10px] text-slate-500 mt-1">Driver: {dim.primaryDriver}</div>
                </div>
                <div className="mt-3 md:mt-0 flex flex-col items-end">
                  <ConfidenceBadge confidence={dim.confidence} status={dim.dataStatus} />
                  <div className="text-[10px] text-slate-400 mt-1">{dim.dataStatus.replace(/_/g, ' ')}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================== FPO EXPOSURE ==================== */}
      {activeTab === 'FPO' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b pb-4 dark:border-slate-800">
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-500" />
                FPO PORTFOLIO RISK
              </h2>
              <div className="text-sm font-mono bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded">
                Total Value: <strong className="text-slate-900 dark:text-slate-100">₹{(fpoPortfolio.totalExpectedValueInr || 0).toLocaleString('en-IN')}</strong>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-3 border rounded-lg dark:border-slate-800">
                <div className="text-xs text-slate-500">Commodity Concentration</div>
                <div className="font-bold mt-1 text-sm">{fpoPortfolio.commodityConcentration.replace(/_/g, ' ')}</div>
              </div>
              <div className="p-3 border rounded-lg dark:border-slate-800">
                <div className="text-xs text-slate-500">Market Concentration</div>
                <div className="font-bold mt-1 text-sm">{fpoPortfolio.marketConcentration.replace(/_/g, ' ')}</div>
              </div>
              <div className="p-3 border rounded-lg dark:border-slate-800">
                <div className="text-xs text-slate-500">Diversification Strategy</div>
                <div className="font-bold mt-1 text-sm text-indigo-600 dark:text-indigo-400">{fpoPortfolio.diversificationStatus}</div>
              </div>
            </div>

            <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300 mt-4">
              <thead className="bg-slate-50 dark:bg-slate-800">
                <tr>
                  <th className="p-2">Commodity</th>
                  <th className="p-2">Qty (T)</th>
                  <th className="p-2">Value (₹)</th>
                  <th className="p-2">Trend</th>
                  <th className="p-2">Vol.</th>
                  <th className="p-2">Risk</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {fpoPortfolio.commodities.map(c => (
                  <tr key={c.commodityId}>
                    <td className="p-2 font-bold">{c.commodityName}</td>
                    <td className="p-2">{c.expectedQuantityTonnes}</td>
                    <td className="p-2 font-mono">{(c.expectedValueInr || 0).toLocaleString('en-IN')}</td>
                    <td className="p-2">{c.trend}</td>
                    <td className="p-2">{c.volatilityPercent}%</td>
                    <td className="p-2"><ExposureBadge level={c.riskLevel} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* FPO VALUE AT RISK */}
          <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 border-b pb-4 dark:border-slate-800">
              FPO STRESS TEST &amp; VALUE AT RISK
            </h2>
            <div className="space-y-4">
              {fpoStress.scenarios.map((sc, i) => (
                <div key={i} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
                      {sc.isStatisticalVaR && <BarChart3 className="w-4 h-4 text-indigo-500" />}
                      {sc.scenarioName}
                    </span>
                    <span className="text-xs bg-slate-200 dark:bg-slate-700 px-2 py-1 rounded font-semibold text-slate-700 dark:text-slate-300">
                      {sc.isStatisticalVaR ? 'STATISTICAL VaR' : 'SCENARIO ANALYSIS'}
                    </span>
                  </div>
                  <div className="flex gap-6 items-end mt-4">
                    <div>
                      <div className="text-xs text-slate-500">Portfolio Value Change</div>
                      <div className="text-xl font-bold text-rose-600 font-mono">
                        {sc.portfolioValueChangeInr?.toLocaleString('en-IN')} ({sc.portfolioValueChangePercent}%)
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="text-xs text-slate-500 mb-1">Commodity Impact</div>
                      <div className="flex gap-2">
                        {sc.commodityLevelImpacts.map(c => (
                          <span key={c.commodityId} className="text-[11px] bg-white dark:bg-slate-900 border px-2 py-1 rounded">
                            {c.commodityId}: <strong className="text-rose-500">{c.changePercent}%</strong>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-3 pt-2 border-t dark:border-slate-700">
                    Methodology: {sc.methodologyNotes}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ==================== B2B EXPOSURE ==================== */}
      {activeTab === 'B2B' && (
        <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex justify-between items-center border-b pb-4 dark:border-slate-800">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-amber-500" />
                PROCUREMENT EXPOSURE
              </h2>
              <div className="text-sm text-slate-500 mt-1">{b2bExposure.commodityName} • {b2bExposure.requiredQuantityTonnes} Tonnes • {b2bExposure.deliveryLocation}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
              <div className="text-xs text-slate-500">Current Landed Cost Estimate</div>
              <div className="text-xl font-bold text-slate-900 dark:text-slate-100 font-mono">₹{b2bExposure.currentEstimatedLandedCostInr.toLocaleString('en-IN')}/T</div>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
              <div className="text-xs text-slate-500">Historical Maximum</div>
              <div className="text-lg font-bold text-rose-600 dark:text-rose-400 font-mono">₹{(b2bExposure.historicalMaxPriceInr||0).toLocaleString('en-IN')}/T</div>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
              <div className="text-xs text-slate-500">30D Range</div>
              <div className="text-sm font-bold text-slate-900 dark:text-slate-100 font-mono">
                {b2bExposure.range30d?.min} - {b2bExposure.range30d?.max}
              </div>
            </div>
             <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
              <div className="text-xs text-slate-500">Diversification</div>
              <div className="text-sm font-bold text-indigo-600 dark:text-indigo-400 mt-1">{b2bExposure.sourceDiversificationRecommendation}</div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 border-b pb-2 dark:border-slate-800">Risk Dimensions</h3>
            {[b2bExposure.priceVolatility, b2bExposure.supplyConcentration, b2bExposure.marketConcentration].map((dim, i) => (
              <div key={i} className="flex flex-col md:flex-row md:items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900 dark:text-slate-100">{dim.dimension}</span>
                    <ExposureBadge level={dim.exposureLevel} />
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">{dim.evidence}</div>
                  <div className="text-[10px] text-slate-500 mt-1">Driver: {dim.primaryDriver}</div>
                </div>
                <div className="mt-3 md:mt-0 flex flex-col items-end">
                   <ConfidenceBadge confidence={dim.confidence} status={dim.dataStatus} />
                   <div className="text-[10px] text-slate-400 mt-1">{dim.dataStatus.replace(/_/g, ' ')}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Economic Waterfall */}
          <div className="bg-slate-50 dark:bg-slate-800/40 rounded-xl p-4 border border-slate-200 dark:border-slate-700 mt-6">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-4">Landed Cost Waterfall Estimate (Per Tonne)</h3>
            <div className="space-y-2 font-mono text-sm">
              <div className="flex justify-between items-center text-slate-600 dark:text-slate-300">
                <span>Commodity Base Cost (APMC)</span>
                <span>₹38,500</span>
              </div>
              <div className="flex justify-between items-center text-slate-600 dark:text-slate-300">
                <span>+ Estimated Freight (Belagavi -&gt; Bengaluru)</span>
                <span>₹2,100</span>
              </div>
              <div className="flex justify-between items-center text-slate-600 dark:text-slate-300">
                <span>+ Mandi Cess &amp; Handling</span>
                <span>₹1,400</span>
              </div>
              <div className="border-t border-slate-300 dark:border-slate-600 my-2"></div>
              <div className="flex justify-between items-center font-bold text-slate-900 dark:text-slate-100 text-base">
                <span>Estimated Landed Cost</span>
                <span>₹42,000</span>
              </div>
            </div>
            <div className="text-[10px] text-slate-400 mt-4">*Freight and handling are FARMFIT estimates and must be verified.</div>
          </div>
        </div>
      )}

      {/* ==================== GOVERNMENT EXPOSURE ==================== */}
      {activeTab === 'GOVERNMENT' && (
        <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex justify-between items-center border-b pb-4 dark:border-slate-800">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Landmark className="w-5 h-5 text-rose-500" />
                GOVERNMENT AGRICULTURAL EXPOSURE MAP
              </h2>
              <div className="text-sm text-slate-500 mt-1">{govExposure.districtName}, {govExposure.stateName}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-rose-600 dark:text-rose-400">{govExposure.overallExposureScore}</div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Overall Risk Score</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-3">District Commodity Dependency</h3>
              <div className="space-y-3">
                {govExposure.dominantCommodities.map((c, i) => (
                  <div key={i} className="p-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800/40">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-sm text-slate-900 dark:text-slate-100">{c.commodityName}</span>
                      <span className="text-[10px] bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded font-bold dark:bg-indigo-900/50 dark:text-indigo-300">
                        Importance: {c.estimatedImportance}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-600 dark:text-slate-400 mt-2 flex gap-3">
                      <span>Market Depend.: <strong>{c.marketDependence}</strong></span>
                      <span>Price Exp.: <strong>{c.priceExposure}</strong></span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-2 pt-1 border-t dark:border-slate-700">
                      Basis: {c.isObservedProduction ? 'Observed Production Data' : 'Market Arrivals Proxy'}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-3">Stress Dimensions</h3>
              <div className="space-y-3">
                {govExposure.dimensions.map((dim, i) => (
                  <div key={i} className="p-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800/40">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-sm text-slate-900 dark:text-slate-100">{dim.dimension}</span>
                      <ExposureBadge level={dim.exposureLevel} />
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">{dim.evidence}</div>
                    <div className="mt-2 flex justify-between items-end">
                      <span className="text-[10px] text-slate-500">Driver: {dim.primaryDriver}</span>
                      <ConfidenceBadge confidence={dim.confidence} status={dim.dataStatus} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== DECISION CONTROL ==================== */}
      {activeTab === 'DECISIONS' && (
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Stakeholder:</span>
            {(['FARMER', 'FPO', 'B2B', 'GOVERNMENT'] as const).map(s => (
              <button 
                key={s} onClick={() => setDecisionStakeholder(s)}
                className={`px-3 py-1 rounded text-xs font-bold ${decisionStakeholder === s ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'}`}
              >
                {s}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {decisions.length === 0 ? (
              <div className="p-8 text-center text-slate-500">No active decision cards for {decisionStakeholder}</div>
            ) : (
              decisions.map(d => (
                <div key={d.decisionId} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                  <div className="bg-slate-50 dark:bg-slate-800 p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                    <div>
                      <span className="text-[10px] font-mono text-slate-500">{d.decisionId} • {d.date}</span>
                      <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mt-1">DECISION CARD: {d.recommendation}</h3>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                      d.workflowState === 'RECOMMENDED' ? 'bg-blue-100 text-blue-800 border-blue-300' :
                      d.workflowState === 'APPROVED' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' :
                      'bg-slate-100 text-slate-800 border-slate-300'
                    }`}>
                      {d.workflowState}
                    </span>
                  </div>
                  
                  <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <div className="text-xs font-bold text-slate-500 uppercase">Expected Benefit</div>
                        <div className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 mt-1">{d.expectedBenefit}</div>
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-500 uppercase">Evidence &amp; Rationale</div>
                        <div className="text-sm text-slate-700 dark:text-slate-300 mt-1">{d.evidence}</div>
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-500 uppercase">Alternative</div>
                        <div className="text-sm text-slate-700 dark:text-slate-300 mt-1">{d.alternative}</div>
                      </div>
                    </div>

                    <div className="space-y-4 bg-slate-50 dark:bg-slate-800/30 p-4 rounded-lg border border-slate-100 dark:border-slate-700/50">
                       <div className="flex justify-between items-center border-b pb-2 dark:border-slate-700">
                         <span className="text-xs font-bold text-slate-500">Risk Level</span>
                         <ExposureBadge level={d.riskLevel} />
                       </div>
                       <div className="flex justify-between items-center border-b pb-2 dark:border-slate-700">
                         <span className="text-xs font-bold text-slate-500">Confidence Tier</span>
                         <ConfidenceBadge confidence={d.confidenceTier} status="OBSERVED_DATA" />
                       </div>
                       <div>
                         <div className="text-[10px] font-bold text-slate-500 uppercase">Scenario Sensitivity</div>
                         <div className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">{d.scenarioSensitivity}</div>
                       </div>
                       <div className="text-[9px] font-mono text-slate-400 mt-4 pt-2 border-t dark:border-slate-700">
                         Model: {d.modelVersion} • Data Source: Official AGMARKNET
                       </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="bg-slate-50 dark:bg-slate-800 p-4 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-3">
                    <button className="px-4 py-2 rounded text-xs font-bold bg-white text-slate-700 border border-slate-300 hover:bg-slate-100">REVIEW</button>
                    <button className="px-4 py-2 rounded text-xs font-bold bg-rose-50 text-rose-700 border border-rose-300 hover:bg-rose-100">REJECT</button>
                    <button className="px-4 py-2 rounded text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700">ACCEPT / APPROVE</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ==================== SIMULATOR ==================== */}
      {activeTab === 'SIMULATOR' && (
        <div className="space-y-6">
          <div className="bg-slate-900 rounded-xl p-5 border border-slate-800 shadow-sm text-white space-y-4">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-400" />
              EVENT IMPACT SIMULATOR
            </h2>
            <div className="flex flex-wrap gap-4 items-center">
              <select 
                value={simCommodity} 
                onChange={e => setSimCommodity(e.target.value)}
                className="bg-slate-800 border border-slate-700 rounded px-3 py-1.5 text-sm"
              >
                <option value="onion">Onion</option>
                <option value="tomato">Tomato</option>
                <option value="cotton">Cotton</option>
              </select>

              <select 
                value={simShock} 
                onChange={e => setSimShock(e.target.value as ShockEventType)}
                className="bg-slate-800 border border-slate-700 rounded px-3 py-1.5 text-sm"
              >
                <option value="PRICE_SHOCK">Price Shock</option>
                <option value="WEATHER_SHOCK">Weather Shock</option>
                <option value="LOGISTICS_SHOCK">Logistics Shock</option>
              </select>

              <div className="text-sm font-mono text-amber-400 bg-amber-400/10 px-3 py-1.5 rounded border border-amber-400/30">
                Magnitude: {simulationResult.magnitude}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
              <div className="p-4 rounded-lg bg-slate-800 border border-slate-700">
                <div className="text-xs text-slate-400 font-bold uppercase mb-2">Farmer Impact</div>
                <div className="text-sm text-slate-200">{simulationResult.farmerImpact}</div>
              </div>
              <div className="p-4 rounded-lg bg-slate-800 border border-slate-700">
                <div className="text-xs text-slate-400 font-bold uppercase mb-2">FPO Impact</div>
                <div className="text-sm text-slate-200">{simulationResult.fpoImpact}</div>
              </div>
              <div className="p-4 rounded-lg bg-slate-800 border border-slate-700">
                <div className="text-xs text-slate-400 font-bold uppercase mb-2">B2B Impact</div>
                <div className="text-sm text-slate-200">{simulationResult.b2bImpact}</div>
              </div>
              <div className="p-4 rounded-lg bg-slate-800 border border-slate-700">
                <div className="text-xs text-slate-400 font-bold uppercase mb-2">Govt Impact</div>
                <div className="text-sm text-slate-200">{simulationResult.governmentImpact}</div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
