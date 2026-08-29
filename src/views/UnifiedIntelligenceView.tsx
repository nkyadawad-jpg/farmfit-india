import React, { useState, useMemo } from 'react';
import { 
  Compass, 
  MapPin, 
  Layers, 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  ShieldCheck, 
  Truck, 
  Building2, 
  Users, 
  Landmark, 
  Search, 
  Filter, 
  RotateCcw, 
  CheckCircle2, 
  AlertTriangle,
  ArrowRight,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Database,
  BarChart3,
  Scale
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Legend 
} from 'recharts';
import { FarmLocation, Language } from '../types';
import { unifiedCommodityIntelligenceEngine } from '../services/unifiedCommodityIntelligenceEngine';
import { 
  CanonicalCommodityHierarchy, 
  MarketCommodityMatrixCell,
  UniversalStakeholderIntelligence 
} from '../types/unifiedIntelligence';
import { ALL_CROP_CATEGORIES } from '../data/cropMasterIndex';

interface UnifiedIntelligenceViewProps {
  farmerLocation?: FarmLocation;
  selectedCropId?: string;
  onSelectCrop?: (cropId: string) => void;
  language?: Language;
}

export const UnifiedIntelligenceView: React.FC<UnifiedIntelligenceViewProps> = ({
  farmerLocation,
  selectedCropId = 'soybean',
  onSelectCrop
}) => {
  const [activeCropId, setActiveCropId] = useState<string>(selectedCropId);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedState, setSelectedState] = useState<string>(farmerLocation?.state || 'All');
  const [activeSubView, setActiveSubView] = useState<'matrix' | 'stakeholders' | 'commodities'>('matrix');

  React.useEffect(() => {
    if (selectedCropId && selectedCropId !== activeCropId) {
      setActiveCropId(selectedCropId);
    }
  }, [selectedCropId]);

  // 1. Get filtered commodity universe
  const commodityUniverse = useMemo(() => {
    return unifiedCommodityIntelligenceEngine.searchCommodities(searchQuery, selectedCategory);
  }, [searchQuery, selectedCategory]);

  // 2. Generate Universal Stakeholder Intelligence for active commodity & location
  const stakeholderIntelligence = useMemo<UniversalStakeholderIntelligence>(() => {
    return unifiedCommodityIntelligenceEngine.generateUniversalIntelligence({
      cropId: activeCropId,
      farmerLatitude: farmerLocation?.latitude ?? null,
      farmerLongitude: farmerLocation?.longitude ?? null,
      state: selectedState !== 'All' ? selectedState : farmerLocation?.state,
      district: farmerLocation?.district,
      expectedYieldQtl: 20
    });
  }, [activeCropId, farmerLocation, selectedState]);

  // 3. Get Market x Commodity Matrix cells
  const matrixCells = useMemo<MarketCommodityMatrixCell[]>(() => {
    return unifiedCommodityIntelligenceEngine.getMarketCommodityMatrix({
      cropId: activeCropId,
      state: selectedState !== 'All' ? selectedState : undefined
    });
  }, [activeCropId, selectedState]);

  // Unique states from matrix
  const availableStates = useMemo(() => {
    const all = unifiedCommodityIntelligenceEngine.getMarketCommodityMatrix({});
    const states = Array.from(new Set(all.map(m => m.state)));
    return ['All', ...states.sort()];
  }, []);

  const handleSelectCrop = (cropId: string) => {
    setActiveCropId(cropId);
    if (onSelectCrop) onSelectCrop(cropId);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* HEADER BANNER */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5">
              <span className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold">
                <Compass className="w-5 h-5" />
              </span>
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  All-India Commodity × Market Intelligence
                </h2>
                <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                  Unified canonical pipeline answering: What, Where, When, Observed Price, Market, Variety, Grade, NRV & Decisions
                </p>
              </div>
            </div>
          </div>

          {/* Quick Context Chips */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <div className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center gap-2 font-medium">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-slate-500">Location:</span>
              <span className="font-bold text-slate-900 dark:text-white">
                {farmerLocation?.district ? `${farmerLocation.district}, ${farmerLocation.state}` : (selectedState !== 'All' ? selectedState : 'National Master')}
              </span>
            </div>

            <div className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-emerald-900 dark:text-emerald-200 font-bold">
                OFFICIAL AGMARKNET BULLETIN
              </span>
            </div>
          </div>
        </div>

        {/* Commodity Search & Filter Sub-Bar */}
        <div className="pt-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2 flex-1">
            <div className="relative flex-1 min-w-[200px] max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search any crop, variety, Hindi name (e.g. Soyabean, Chana, Bajra)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 cursor-pointer"
            >
              <option value="ALL">All Categories ({commodityUniverse.length})</option>
              {ALL_CROP_CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 cursor-pointer"
            >
              {availableStates.map(st => (
                <option key={st} value={st}>{st === 'All' ? 'All India States' : st}</option>
              ))}
            </select>
          </div>

          {/* Sub-view switches */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl shrink-0">
            <button
              onClick={() => setActiveSubView('matrix')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeSubView === 'matrix' 
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Market × Commodity Matrix
            </button>
            <button
              onClick={() => setActiveSubView('stakeholders')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeSubView === 'stakeholders' 
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Stakeholder Guidance
            </button>
            <button
              onClick={() => setActiveSubView('commodities')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeSubView === 'commodities' 
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              All-India Universe ({commodityUniverse.length})
            </button>
          </div>
        </div>
      </div>

      {/* ACTIVE COMMODITY CAROUSEL */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap pl-1">
          Select Commodity:
        </span>
        {commodityUniverse.slice(0, 15).map(comm => {
          const isSelected = comm.cropCommodityId.toLowerCase() === activeCropId.toLowerCase();
          return (
            <button
              key={comm.cropCommodityId}
              onClick={() => handleSelectCrop(comm.cropCommodityId)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 flex items-center gap-1.5 border ${
                isSelected
                  ? 'bg-emerald-700 text-white border-emerald-600 shadow-sm'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-emerald-300'
              }`}
            >
              <span>{comm.displayName}</span>
              {comm.nationalModalPrice && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-emerald-600'
                }`}>
                  ₹{comm.nationalModalPrice}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* VIEW 1: MARKET X COMMODITY MATRIX */}
      {activeSubView === 'matrix' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <span>Observed Market Bulletins for</span>
                  <span className="text-emerald-700 dark:text-emerald-300">
                    {stakeholderIntelligence.commodity.displayName}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-normal">
                    {matrixCells.length} APMC records
                  </span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Direct official Agmarknet wholesale trading observations with variety, grade, physical arrivals, and minimum-maximum spreads.
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold">
                  {stakeholderIntelligence.commodity.mspNotified ? 'MSP Notified Commodity' : 'Commercial APMC Traded'}
                </span>
              </div>
            </div>

            {matrixCells.length === 0 ? (
              <div className="py-12 text-center text-slate-500 text-xs space-y-2">
                <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto" />
                <div className="font-bold text-slate-800 dark:text-slate-200">
                  No Direct AGMARKNET Bulletin for {stakeholderIntelligence.commodity.displayName} in Selected Scope
                </div>
                <p>Try switching to "All India States" or choosing another active commodity.</p>
              </div>
            ) : (
              <div className="overflow-x-auto mt-4">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                      <th className="py-3 px-3">State / District</th>
                      <th className="py-3 px-3">APMC Market</th>
                      <th className="py-3 px-3">Variety / Grade</th>
                      <th className="py-3 px-3 text-right">Min Price</th>
                      <th className="py-3 px-3 text-right">Modal Price</th>
                      <th className="py-3 px-3 text-right">Max Price</th>
                      <th className="py-3 px-3 text-right">Arrivals</th>
                      <th className="py-3 px-3">Date / Source</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                    {matrixCells.map((cell, idx) => (
                      <tr key={`${cell.marketId}_${idx}`} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                        <td className="py-3 px-3">
                          <div className="font-bold text-slate-900 dark:text-white">{cell.district}</div>
                          <div className="text-[11px] text-slate-500">{cell.state}</div>
                        </td>
                        <td className="py-3 px-3 font-semibold text-slate-800 dark:text-slate-200">
                          {cell.marketName}
                        </td>
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-medium">
                            {cell.variety || 'FAQ'}
                          </span>
                          <span className="ml-1 text-[10px] text-slate-400">{cell.grade || 'FAQ'}</span>
                        </td>
                        <td className="py-3 px-3 text-right text-slate-600 dark:text-slate-400 font-mono">
                          ₹{cell.minPrice}
                        </td>
                        <td className="py-3 px-3 text-right font-bold text-emerald-700 dark:text-emerald-400 font-mono text-sm">
                          ₹{cell.modalPrice}
                        </td>
                        <td className="py-3 px-3 text-right text-slate-600 dark:text-slate-400 font-mono">
                          ₹{cell.maxPrice}
                        </td>
                        <td className="py-3 px-3 text-right font-mono font-semibold text-slate-800 dark:text-slate-200">
                          {cell.arrivalQuantity} {cell.arrivalUnit}
                        </td>
                        <td className="py-3 px-3 text-[11px] text-slate-500">
                          <div>{cell.latestPriceDate}</div>
                          <div className="text-[9px] text-emerald-600 font-bold uppercase">OFFICIAL AGMARKNET</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW 2: MULTI-STAKEHOLDER INTELLIGENCE GUIDANCE */}
      {activeSubView === 'stakeholders' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 1. Farmer Action Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold">
                    <Truck className="w-4 h-4" />
                  </span>
                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                    Farmer Selling Strategy
                  </h4>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                  stakeholderIntelligence.farmerDecision.riskLevel === 'HIGH' 
                    ? 'bg-rose-100 text-rose-800' 
                    : stakeholderIntelligence.farmerDecision.riskLevel === 'MEDIUM'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-emerald-100 text-emerald-800'
                }`}>
                  Risk: {stakeholderIntelligence.farmerDecision.riskLevel}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                {stakeholderIntelligence.farmerDecision.actionSummary}
              </div>

              {stakeholderIntelligence.farmerDecision.optimalMarket && (
                <div className="space-y-1.5 text-xs">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Optimal Dispatch Destination:
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white">
                        {stakeholderIntelligence.farmerDecision.optimalMarket.marketName}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {stakeholderIntelligence.farmerDecision.optimalMarket.district} ({stakeholderIntelligence.farmerDecision.optimalMarket.distanceKm ?? 'Local'} km)
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono font-black text-emerald-600 text-sm">
                        ₹{stakeholderIntelligence.farmerDecision.optimalMarket.estimatedNrvPerQtl}/Qtl
                      </div>
                      <div className="text-[10px] text-slate-400">Estimated NRV</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
              <span>Provenance: FARMFIT DERIVED ANALYSIS</span>
              <span className="font-bold text-emerald-600 uppercase">
                {stakeholderIntelligence.farmerDecision.recommendedAction.replace(/_/g, ' ')}
              </span>
            </div>
          </div>

          {/* 2. FPO Collective Plan Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 flex items-center justify-center font-bold">
                    <Users className="w-4 h-4" />
                  </span>
                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                    FPO Aggregation & Marketing
                  </h4>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-blue-100 text-blue-800">
                  Collective Bargaining
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/50 text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                {stakeholderIntelligence.fpoDecision.aggregationRecommendation}
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] text-slate-500 block">Freight Economy</span>
                  <span className="font-bold text-blue-700 dark:text-blue-300">
                    +₹{stakeholderIntelligence.fpoDecision.bulkTransportSavingsPerQtl}/Qtl saved
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] text-slate-500 block">Working Capital (Est.)</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    ₹{(stakeholderIntelligence.fpoDecision.workingCapitalRequirement / 100000).toFixed(2)} Lakhs
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
              <span>Target: {stakeholderIntelligence.fpoDecision.targetDestinationMandi}</span>
              <span className="font-bold text-blue-600">MIN 100 QTL LOT</span>
            </div>
          </div>

          {/* 3. B2B Sourcing Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 flex items-center justify-center font-bold">
                    <Building2 className="w-4 h-4" />
                  </span>
                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                    B2B Procurement & Landed Cost
                  </h4>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-purple-100 text-purple-800">
                  Liquidity Score: {stakeholderIntelligence.b2bDecision.supplyLiquidityScore}/100
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-900/50 text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                {stakeholderIntelligence.b2bDecision.sourcingRecommendation}
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] text-slate-500 block">Lowest Landed Cost</span>
                  <span className="font-mono font-bold text-purple-700 dark:text-purple-300">
                    ₹{stakeholderIntelligence.b2bDecision.estimatedLandedCostPerQtl}/Qtl
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] text-slate-500 block">Terminal Market</span>
                  <span className="font-bold text-slate-900 dark:text-white truncate block">
                    {stakeholderIntelligence.b2bDecision.lowestLandedCostMarket}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
              <span>Arbitrage Spread: {stakeholderIntelligence.b2bDecision.arbitrageSpreadPercent}%</span>
              <span className="font-bold text-purple-600">DIRECT MANDI GATEWAY</span>
            </div>
          </div>

          {/* 4. Government Early Warning Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 flex items-center justify-center font-bold">
                    <Landmark className="w-4 h-4" />
                  </span>
                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                    Government Early Warning & PSS
                  </h4>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                  stakeholderIntelligence.governmentDecision.procurementInterventionNeeded
                    ? 'bg-rose-100 text-rose-800'
                    : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {stakeholderIntelligence.governmentDecision.priceWarningStatus}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                {stakeholderIntelligence.governmentDecision.policyActionRecommendation}
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] text-slate-500 block">Procurement Action</span>
                  <span className={`font-bold ${stakeholderIntelligence.governmentDecision.procurementInterventionNeeded ? 'text-rose-600' : 'text-emerald-600'}`}>
                    {stakeholderIntelligence.governmentDecision.procurementInterventionNeeded ? 'Intervention Required' : 'Market Stable'}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] text-slate-500 block">Arrival Volume Pressure</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {stakeholderIntelligence.governmentDecision.arrivalTrendStatus}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
              <span>Statutory Alignment: CACP / PSS Norms</span>
              <span className="font-bold text-amber-700 dark:text-amber-300">PRICE SUPPORT SCHEME</span>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: ALL-INDIA COMMODITY UNIVERSE CATALOG */}
      {activeSubView === 'commodities' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs">
          <div className="pb-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                All-India Complete Commodity Universe ({commodityUniverse.length} entries)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Standardized canonical agricultural master index spanning cereals, pulses, oilseeds, horticulture, spices, and commercial fibers.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mt-4">
            {commodityUniverse.map(comm => {
              const isSelected = comm.cropCommodityId.toLowerCase() === activeCropId.toLowerCase();
              return (
                <div
                  key={comm.cropCommodityId}
                  onClick={() => handleSelectCrop(comm.cropCommodityId)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 ring-2 ring-emerald-500'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-emerald-300 hover:bg-slate-50'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-extrabold text-xs text-slate-900 dark:text-white truncate">
                        {comm.displayName}
                      </span>
                      {comm.mspNotified && (
                        <span className="px-1.5 py-0.2 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-[9px] font-bold shrink-0">
                          MSP
                        </span>
                      )}
                    </div>
                    {comm.hindiName && (
                      <span className="text-[11px] text-slate-500 block mt-0.5">
                        {comm.hindiName}
                      </span>
                    )}
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px]">
                    <span className="text-slate-500">{comm.category}</span>
                    {comm.activeMarketCount > 0 ? (
                      <span className="text-emerald-600 font-bold">
                        {comm.activeMarketCount} active APMCs
                      </span>
                    ) : (
                      <span className="text-slate-400">Canonical index</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
