import React, { useState, useMemo } from 'react';
import { 
  Network, Route, Tractor, Users, Building2, Landmark, 
  Map, Target, ArrowRight, ArrowUpRight, ArrowDownRight,
  RefreshCw, TrendingUp, TrendingDown, Scale, MapPin, 
  PackageSearch, Zap, AlertTriangle
} from 'lucide-react';
import { supplyChainIntelligenceEngine } from '../services/supplyChainIntelligenceEngine';
import { Language } from '../types';
import { ALL_CANONICAL_COMMODITIES } from '../data/canonicalCommodityUniverse';

interface SupplyChainCommandCenterViewProps {
  userDistrict?: string;
  selectedCommodityExternal?: string;
  onSelectCommodity?: (val: string) => void;
  searchRadiusExternal?: number;
  onSelectRadius?: (val: number) => void;
  language?: Language;
}

export const SupplyChainCommandCenterView: React.FC<SupplyChainCommandCenterViewProps> = ({
  userDistrict = 'Belagavi',
  selectedCommodityExternal,
  onSelectCommodity,
  searchRadiusExternal,
  onSelectRadius,
  language = 'en'
}) => {
  const [activeTab, setActiveTab] = useState<'COMMAND' | 'FARM_ROUTING' | 'FPO_PORTFOLIO' | 'B2B_NETWORK'>('COMMAND');
  const [localSelectedCommodity, setLocalSelectedCommodity] = useState('onion');
  const [localSearchRadius, setLocalSearchRadius] = useState<number>(200);

  const selectedCommodity = selectedCommodityExternal || localSelectedCommodity;
  const setSelectedCommodity = onSelectCommodity || setLocalSelectedCommodity;

  const searchRadius = searchRadiusExternal || localSearchRadius;
  const setSearchRadius = onSelectRadius || setLocalSearchRadius;

  // Data Fetching
  const macroMetrics = useMemo(() => supplyChainIntelligenceEngine.getCommandCenterMetrics('INDIA', 'India'), []);
  const flowGeography = useMemo(() => supplyChainIntelligenceEngine.getCommodityFlowGeography(selectedCommodity), [selectedCommodity]);
  const farmRouting = useMemo(() => supplyChainIntelligenceEngine.getFarmToMarketRouting(userDistrict, selectedCommodity, searchRadius), [userDistrict, selectedCommodity, searchRadius]);
  const fpoPortfolio = useMemo(() => supplyChainIntelligenceEngine.getFpoPortfolioIntelligence('FPO-1'), []);
  const b2bOptions = useMemo(() => supplyChainIntelligenceEngine.getB2bProcurementOptions(selectedCommodity, 1000), [selectedCommodity]);
  const b2bScenarios = useMemo(() => supplyChainIntelligenceEngine.getProcurementScenarios(b2bOptions[0]?.estimatedLandedCostInr || 0), [b2bOptions]);

  // Helper Badges
  const StatusBadge = ({ status }: { status: string }) => {
    const bg = status === 'POSITIVE' ? 'bg-emerald-100 text-emerald-800' : 
               status === 'NEGATIVE' ? 'bg-rose-100 text-rose-800' : 
               status === 'STRESSED' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-800';
    return <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${bg}`}>{status}</span>;
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xl border border-blue-500/20 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/40 via-slate-900 to-slate-900 pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/20 border border-blue-400/40 text-blue-300">
                <Network className="w-3 h-3" />
                SUPPLY CHAIN & PORTFOLIO INTELLIGENCE
              </span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2 mt-2">
              FARMFIT Supply Chain Command Center
            </h1>
            <p className="text-sm text-slate-300 max-w-3xl mt-2">
              Connecting Farm &rarr; Village &rarr; District &rarr; APMC &rarr; Processing &rarr; Consumption.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
             <select 
                value={selectedCommodity} 
                onChange={e => setSelectedCommodity(e.target.value)}
                className="bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-2 text-sm font-bold shadow-sm focus:ring-2 focus:ring-blue-500"
              >
                {ALL_CANONICAL_COMMODITIES.map(c => (
                  <option key={c.cropCommodityId} value={c.cropCommodityId}>{c.displayName}</option>
                ))}
              </select>
          </div>
        </div>
      </div>

      {/* TABS */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-1.5 shadow-sm border border-slate-200 dark:border-slate-800 flex flex-wrap gap-1">
        <button onClick={() => setActiveTab('COMMAND')} className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-2 ${activeTab === 'COMMAND' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'}`}>
          <Target className="w-4 h-4" /> Command Center
        </button>
        <button onClick={() => setActiveTab('FARM_ROUTING')} className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-2 ${activeTab === 'FARM_ROUTING' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'}`}>
          <Tractor className="w-4 h-4" /> Farm &rarr; Market Routing
        </button>
        <button onClick={() => setActiveTab('FPO_PORTFOLIO')} className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-2 ${activeTab === 'FPO_PORTFOLIO' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'}`}>
          <Users className="w-4 h-4" /> FPO Portfolio
        </button>
        <button onClick={() => setActiveTab('B2B_NETWORK')} className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-2 ${activeTab === 'B2B_NETWORK' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'}`}>
          <Building2 className="w-4 h-4" /> B2B Procurement Network
        </button>
      </div>

      {/* ==================== COMMAND CENTER ==================== */}
      {activeTab === 'COMMAND' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {macroMetrics.signals.map((sig, i) => (
              <div key={i} className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex justify-between items-start">
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">{sig.signalType} SIGNAL</div>
                  <StatusBadge status={sig.status} />
                </div>
                <div className="mt-3 flex items-end gap-3">
                  <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">{sig.value}</div>
                  {sig.trend === 'UP' && <ArrowUpRight className="w-5 h-5 text-rose-500 mb-1" />}
                  {sig.trend === 'DOWN' && <ArrowDownRight className="w-5 h-5 text-emerald-500 mb-1" />}
                  {sig.trend === 'STABLE' && <ArrowRight className="w-5 h-5 text-slate-400 mb-1" />}
                </div>
                <div className="text-[10px] text-slate-400 mt-4 pt-3 border-t dark:border-slate-800 flex justify-between">
                  <span>Source: {sig.source}</span>
                  <span className="font-bold">{sig.dataStatus.replace(/_/g, ' ')}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-sm font-bold flex items-center gap-2 mb-4 dark:text-white"><Map className="w-4 h-4 text-blue-500"/> Commodity Flow Geography</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div>
                  <h4 className="text-xs font-bold text-slate-500 uppercase mb-3">Major Market Clusters</h4>
                  <div className="space-y-2">
                    {flowGeography.marketClusters.map((c, i) => (
                      <div key={i} className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded border dark:border-slate-700 flex justify-between items-center">
                        <span className="text-sm font-bold dark:text-slate-200">{c.clusterName}</span>
                        <div className="text-xs text-slate-500">{c.apmcCount} APMCs • Trend: {c.dominantTrend}</div>
                      </div>
                    ))}
                  </div>
               </div>
               <div>
                  <h4 className="text-xs font-bold text-slate-500 uppercase mb-3">Production Regions</h4>
                  <div className="space-y-2">
                    {flowGeography.productionRegions.map((p, i) => (
                      <div key={i} className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded border dark:border-slate-700 flex justify-between items-center">
                        <span className="text-sm font-bold dark:text-slate-200">{p.region}</span>
                        <span className="text-[10px] bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded text-slate-600 dark:text-slate-300">
                           {p.isObserved ? 'OBSERVED DATA' : 'MODEL/UNAVAILABLE'}
                        </span>
                      </div>
                    ))}
                  </div>
               </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== FARM -> MARKET ROUTING ==================== */}
      {activeTab === 'FARM_ROUTING' && (
        <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
           <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 border-b pb-4 dark:border-slate-800">
             <div>
               <h2 className="text-lg font-bold flex items-center gap-2 dark:text-white"><Route className="w-5 h-5 text-indigo-500"/> Farm &rarr; Market Routing</h2>
               <div className="text-sm text-slate-500 mt-1">Origin: {userDistrict} • Commodity: {flowGeography.commodityName}</div>
             </div>
             <div className="flex items-center gap-3">
               <span className="text-xs font-bold text-slate-500">Radius:</span>
               <select 
                 value={searchRadius} 
                 onChange={e => setSearchRadius(Number(e.target.value))}
                 className="bg-slate-50 border border-slate-300 dark:bg-slate-800 dark:border-slate-700 rounded px-3 py-1 text-sm dark:text-white"
               >
                 <option value={50}>50 KM</option>
                 <option value={100}>100 KM</option>
                 <option value={150}>150 KM</option>
                 <option value={200}>200 KM</option>
                 <option value={500}>500 KM (Extended)</option>
               </select>
             </div>
           </div>

           <div className="overflow-x-auto">
             <table className="w-full text-left text-sm text-slate-700 dark:text-slate-300">
               <thead className="bg-slate-50 dark:bg-slate-800 text-xs uppercase text-slate-500">
                 <tr>
                   <th className="p-3">Market</th>
                   <th className="p-3">Distance</th>
                   <th className="p-3">Gross Price</th>
                   <th className="p-3">Est. Freight/Hndl</th>
                   <th className="p-3 text-indigo-600 dark:text-indigo-400 font-bold">Net Realization (NRV)</th>
                   <th className="p-3">7D Trend</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                 {farmRouting.qualifyingMarkets.length === 0 ? (
                   <tr>
                     <td colSpan={6} className="p-8 text-center text-slate-500">
                       No official APMC records found for {flowGeography.commodityName} within {searchRadius} KM of {userDistrict}.
                     </td>
                   </tr>
                 ) : (
                   farmRouting.qualifyingMarkets.map((m, i) => (
                     <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                       <td className="p-3 font-bold dark:text-slate-200">
                         {m.marketName}
                         <div className="text-[10px] text-slate-500 font-normal mt-0.5">{m.district}, {m.state}</div>
                       </td>
                       <td className="p-3">{m.distanceKm} km</td>
                       <td className="p-3 font-mono">₹{m.latestModalPrice}</td>
                       <td className="p-3 font-mono text-rose-500">-₹{(m.freightCostInr||0)+(m.handlingCostInr||0)}</td>
                       <td className="p-3 font-mono font-bold text-indigo-600 dark:text-indigo-400 text-base">₹{m.nrvInr}</td>
                       <td className="p-3">{m.trend7D}</td>
                     </tr>
                   ))
                 )}
               </tbody>
             </table>
           </div>
           
           <div className="text-[10px] text-slate-400 pt-2 flex items-center gap-1">
             <AlertTriangle className="w-3 h-3" />
             Showing ALL {farmRouting.qualifyingMarkets.length} qualifying markets. No artificial limits applied. Freight is estimated.
           </div>
        </div>
      )}

      {/* ==================== FPO PORTFOLIO ==================== */}
      {activeTab === 'FPO_PORTFOLIO' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
             <div className="flex justify-between items-center border-b pb-4 dark:border-slate-800">
               <h2 className="text-lg font-bold flex items-center gap-2 dark:text-white"><Users className="w-5 h-5 text-emerald-500"/> FPO Portfolio Intelligence</h2>
               <div className="text-sm bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded font-mono font-bold dark:text-white">
                 Exposure: ₹{(fpoPortfolio.revenueExposure||0).toLocaleString('en-IN')}
               </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
               <div className="p-4 border dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800/50 text-center">
                 <div className="text-xs text-slate-500 uppercase font-bold mb-1">Commodity HHI</div>
                 <div className="text-xl font-bold dark:text-slate-200">{fpoPortfolio.commodityConcentrationIndex}</div>
               </div>
               <div className="p-4 border dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800/50 text-center">
                 <div className="text-xs text-slate-500 uppercase font-bold mb-1">Market HHI</div>
                 <div className="text-xl font-bold dark:text-slate-200">{fpoPortfolio.marketConcentrationIndex}</div>
               </div>
               <div className="p-4 border dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800/50 text-center">
                 <div className="text-xs text-slate-500 uppercase font-bold mb-1">Geo HHI</div>
                 <div className="text-xl font-bold dark:text-slate-200">{fpoPortfolio.geographicConcentrationIndex}</div>
               </div>
               <div className="p-4 border dark:border-slate-700 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 text-center flex flex-col justify-center">
                 <div className="text-xs text-indigo-600 dark:text-indigo-400 font-bold uppercase mb-1">Action</div>
                 <div className="text-lg font-bold text-indigo-700 dark:text-indigo-300">{fpoPortfolio.diversificationRecommendation}</div>
               </div>
             </div>
             
             <div className="text-xs text-slate-600 dark:text-slate-400 bg-amber-50 dark:bg-amber-900/20 p-3 rounded border border-amber-200 dark:border-amber-800">
               <strong>Diversification Rationale:</strong> {fpoPortfolio.diversificationReasons.join(' • ')}
             </div>

             <div className="overflow-x-auto mt-4">
               <table className="w-full text-left text-sm text-slate-700 dark:text-slate-300">
                 <thead className="bg-slate-50 dark:bg-slate-800 text-xs uppercase text-slate-500">
                   <tr>
                     <th className="p-2">Commodity</th>
                     <th className="p-2">Expected Qty</th>
                     <th className="p-2">Latest Price</th>
                     <th className="p-2">Est. NRV</th>
                     <th className="p-2">Volatilty</th>
                     <th className="p-2">Risk</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                   {fpoPortfolio.commodities.map((c, i) => (
                     <tr key={i}>
                       <td className="p-2 font-bold dark:text-slate-200">{c.commodityName}</td>
                       <td className="p-2">{c.expectedQuantityTonnes} T</td>
                       <td className="p-2 font-mono">₹{c.latestPriceInr}</td>
                       <td className="p-2 font-mono text-indigo-600 dark:text-indigo-400 font-bold">₹{c.estimatedNrvInr}</td>
                       <td className="p-2">{c.volatilityPercent}%</td>
                       <td className="p-2">
                         <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${c.riskLevel === 'HIGH' ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'}`}>{c.riskLevel}</span>
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
          </div>
        </div>
      )}

      {/* ==================== B2B PROCUREMENT ==================== */}
      {activeTab === 'B2B_NETWORK' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h2 className="text-lg font-bold flex items-center gap-2 dark:text-white border-b pb-4 dark:border-slate-800">
              <Building2 className="w-5 h-5 text-amber-500"/> B2B Source Diversification & Landed Cost
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {b2bOptions.map((opt, i) => (
                <div key={i} className="border border-slate-200 dark:border-slate-700 rounded-xl p-4 bg-slate-50 dark:bg-slate-800/30">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="font-bold text-base dark:text-white">{opt.region}</div>
                      <div className="text-xs text-slate-500 mt-1">{opt.apmcCount} Active APMCs • {opt.distanceKm} km distance</div>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      opt.recommendationType === 'PRIMARY' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                      opt.recommendationType === 'SECONDARY' ? 'bg-blue-100 text-blue-800 border border-blue-300' :
                      'bg-slate-100 text-slate-800'
                    }`}>
                      {opt.recommendationType} SOURCE
                    </span>
                  </div>

                  <div className="space-y-2 font-mono text-sm border-t border-b border-slate-200 dark:border-slate-700 py-3 my-3">
                    <div className="flex justify-between text-slate-600 dark:text-slate-400">
                      <span>Observed APMC Price</span>
                      <span>₹{opt.observedPriceInr}</span>
                    </div>
                    <div className="flex justify-between text-slate-600 dark:text-slate-400">
                      <span>Est. Freight Cost</span>
                      <span>+₹{opt.estimatedFreightInr}</span>
                    </div>
                    <div className="flex justify-between text-slate-600 dark:text-slate-400">
                      <span>Est. Handling</span>
                      <span>+₹{opt.estimatedHandlingInr}</span>
                    </div>
                    <div className="flex justify-between font-bold text-slate-900 dark:text-slate-100 text-base pt-2">
                      <span>Est. Landed Cost</span>
                      <span>₹{opt.estimatedLandedCostInr}</span>
                    </div>
                  </div>

                  <div className="text-xs text-slate-500 flex justify-between items-center mt-2">
                    <span>Evidence: {opt.supplyEvidence}</span>
                    <span className="font-bold">Conf: {opt.confidence}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 border-t pt-6 dark:border-slate-800">
               <h3 className="text-sm font-bold flex items-center gap-2 mb-4 dark:text-white"><Zap className="w-4 h-4 text-amber-500"/> Procurement Scenario Engine</h3>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 {b2bScenarios.map((sc, i) => (
                   <div key={i} className="p-4 border dark:border-slate-700 rounded bg-white dark:bg-slate-900 flex justify-between items-center">
                     <div>
                       <div className="text-sm font-bold dark:text-slate-200">{sc.scenarioName}</div>
                       <div className="text-xs text-slate-500 mt-1">Incremental Impact</div>
                     </div>
                     <div className="text-right">
                       <div className="font-mono text-rose-600 font-bold text-lg">+₹{sc.incrementalCostInr.toLocaleString('en-IN')}</div>
                       <div className="text-[10px] font-bold text-slate-400 uppercase">Per Tonne</div>
                     </div>
                   </div>
                 ))}
               </div>
               <div className="text-[10px] text-slate-400 mt-3">*SCENARIO ANALYSIS — NOT A FORECAST</div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
