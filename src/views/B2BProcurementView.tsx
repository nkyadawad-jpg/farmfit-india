import React, { useState, useMemo } from 'react';
import { 
  Building2, 
  Store, 
  Truck, 
  TrendingUp, 
  TrendingDown, 
  ShieldAlert, 
  Sliders, 
  CheckCircle2, 
  AlertTriangle, 
  Layers, 
  Calendar, 
  Sparkles, 
  ChevronRight, 
  MapPin, 
  DollarSign, 
  Database,
  ArrowRight,
  HelpCircle,
  FileText,
  Search,
  X,
  Filter,
  Globe,
  Info,
  Check
} from 'lucide-react';
import { 
  B2BProcurementInput, 
  B2BProcurementDecisionResult, 
  B2BSourcingOpportunityItem 
} from '../types/decisionCenter';
import { 
  b2bProcurementService, 
  INSTITUTIONAL_DELIVERY_HUBS 
} from '../services/b2bProcurementService';
import { unifiedCommodityIntelligenceEngine } from '../services/unifiedCommodityIntelligenceEngine';
import { CanonicalCommodityHierarchy } from '../types/unifiedIntelligence';
import { FarmfitDecisionCard } from '../components/DecisionCenter/FarmfitDecisionCard';
import { ConfidenceBadge } from '../components/DecisionCenter/ConfidenceBadge';
import { EvidenceTypeBadge } from '../components/DecisionCenter/EvidenceTypeBadge';
import { UniversalEvidenceModal } from '../components/DecisionCenter/UniversalEvidenceModal';
import { MarketTrendScorecard } from '../components/DecisionCenter/MarketTrendScorecard';
import { marketDataService } from '../services/marketDataService';
import { MarketRankingMode } from '../types/marketAnalytics';

const CATEGORY_TABS = [
  'ALL',
  'Vegetables',
  'Fruits',
  'Cereals',
  'Pulses',
  'Oilseeds',
  'Spices & Condiments',
  'Commercial Crops'
];

export const B2BProcurementView: React.FC = () => {
  const [requirementInput, setRequirementInput] = useState<B2BProcurementInput>(
    b2bProcurementService.getDefaultRequirement()
  );

  const [activeTab, setActiveTab] = useState<
    'SOURCING_OPPORTUNITIES' | 'MULTI_SOURCING' | 'PRICE_INTELLIGENCE' | 'RISK_SCORE' | 'WHAT_IF' | 'ACTION_PLAN'
  >('SOURCING_OPPORTUNITIES');

  const [selectedOpportunityModal, setSelectedOpportunityModal] = useState<B2BSourcingOpportunityItem | null>(null);

  // Commodity Search & Filtering State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Commodity Universe from Canonical Engine
  const commodityUniverse: CanonicalCommodityHierarchy[] = useMemo(() => {
    return unifiedCommodityIntelligenceEngine.getCommodityUniverse();
  }, []);

  // Filtered Commodities
  const filteredCommodities = useMemo(() => {
    return unifiedCommodityIntelligenceEngine.searchCommodities(
      searchQuery,
      selectedCategory === 'ALL' ? 'ALL' : selectedCategory
    );
  }, [searchQuery, selectedCategory]);

  // Dynamic Category Counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { ALL: commodityUniverse.length };
    CATEGORY_TABS.forEach(cat => {
      if (cat !== 'ALL') {
        counts[cat] = commodityUniverse.filter(
          c => c.category === cat || c.commodityGroup === cat
        ).length;
      }
    });
    return counts;
  }, [commodityUniverse]);

  // Selected Commodity Object
  const selectedCommodity = useMemo(() => {
    if (!requirementInput.commodityId) return null;
    return commodityUniverse.find(
      c => c.cropCommodityId.toLowerCase() === requirementInput.commodityId.toLowerCase()
    ) || null;
  }, [requirementInput.commodityId, commodityUniverse]);

  // Compute decision result strictly based on current input
  const decisionResult: B2BProcurementDecisionResult = useMemo(() => {
    return b2bProcurementService.evaluateProcurement(requirementInput);
  }, [requirementInput]);

  const handleSelectCommodity = (comm: CanonicalCommodityHierarchy) => {
    setRequirementInput(prev => ({
      ...prev,
      commodityId: comm.cropCommodityId,
      commodityName: comm.displayName
    }));
    setIsDropdownOpen(false);
    setSearchQuery('');
  };

  const handleClearCommodity = () => {
    setRequirementInput(prev => ({
      ...prev,
      commodityId: '',
      commodityName: ''
    }));
    setSearchQuery('');
  };

  const handleSelectHub = (hubId: string) => {
    const hub = INSTITUTIONAL_DELIVERY_HUBS.find(h => h.id === hubId);
    if (hub) {
      setRequirementInput(prev => ({
        ...prev,
        deliveryHubName: hub.name,
        deliveryHubState: hub.state,
        deliveryHubLatitude: hub.latitude,
        deliveryHubLongitude: hub.longitude
      }));
    }
  };

  const [b2bRankingMode, setB2bRankingMode] = useState<MarketRankingMode>('LOWEST_B2B_LANDED');

  const b2bVerifiedAnalytics = useMemo(() => {
    return marketDataService.getVerifiedAnalytics(
      requirementInput.commodityId || 'carrot',
      undefined,
      { state: requirementInput.deliveryHubState },
      { radiusKm: requirementInput.preferredSourcingRadiusKm || 300, rankingMode: b2bRankingMode }
    );
  }, [requirementInput.commodityId, requirementInput.deliveryHubState, requirementInput.preferredSourcingRadiusKm, b2bRankingMode]);

  const isCommoditySelected = Boolean(requirementInput.commodityId && requirementInput.commodityId.trim() !== '');
  const hasOfficialData = decisionResult.sourcingOpportunities.length > 0;

  return (
    <div className="space-y-8 pb-16">
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold text-purple-700 dark:text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
              <Building2 className="w-4 h-4" />
              B2B INSTITUTIONAL PROCUREMENT DECISION CENTER
            </span>
            <span className="text-xs bg-purple-50 text-purple-800 dark:bg-purple-950 dark:text-purple-300 font-bold px-2.5 py-0.5 rounded-full border border-purple-200 dark:border-purple-800">
              {requirementInput.deliveryHubName}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            Commodity Sourcing &amp; Landed Cost Optimization
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Answers: Where can we procure verified quality commodity at lowest landed cost, how should we split volume to hedge geographic concentration risk, and when should we execute?
          </p>
        </div>

        {/* Aggregated Sourcing Snapshot */}
        {isCommoditySelected && hasOfficialData ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full md:w-auto">
            <div className="bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 text-center">
              <div className="text-[10px] uppercase font-bold text-slate-500">Volume Required</div>
              <div className="text-lg sm:text-xl font-black text-purple-900 dark:text-purple-300">
                {requirementInput.requiredQuantityMetricTonnes.toLocaleString('en-IN')} MT
              </div>
              <div className="text-[10px] text-slate-500 truncate max-w-[120px]">
                {requirementInput.commodityName}
              </div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 text-center">
              <div className="text-[10px] uppercase font-bold text-slate-500">Best Landed Cost</div>
              <div className="text-lg sm:text-xl font-black text-emerald-700 dark:text-emerald-400">
                ₹{decisionResult.sourcingOpportunities[0]?.landedCostInrPerQtl || '—'}/Qtl
              </div>
              <div className="text-[10px] text-slate-500">Modal + Freight</div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 text-center col-span-2 sm:col-span-1">
              <div className="text-[10px] uppercase font-bold text-slate-500">Procurement Risk</div>
              <div className="text-lg sm:text-xl font-black text-slate-800 dark:text-slate-200">
                {decisionResult.riskBreakdown.compositeRiskScore}/100
              </div>
              <div className="text-[10px] text-emerald-600 font-bold">{decisionResult.riskBreakdown.riskLevel} RISK</div>
            </div>
          </div>
        ) : (
          <div className="bg-purple-50/60 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800/60 rounded-2xl p-4 text-left max-w-sm">
            <div className="flex items-center gap-2 text-purple-800 dark:text-purple-300 font-bold text-xs">
              <Sparkles className="w-4 h-4 text-purple-600 shrink-0" />
              Canonical Intelligence Connected
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">
              Select an agricultural commodity below to evaluate official APMC market quotes, transit distances, and multi-district risk allocation.
            </p>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 1. COMPREHENSIVE COMMODITY SELECTOR & PROCUREMENT REQUIREMENT BUILDER */}
      {/* ========================================================================= */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Step 1: Universal Commodity Master</span>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Database className="w-5 h-5 text-purple-600" />
              Select Sourcing Commodity &amp; Procurement Hub
            </h2>
          </div>
          
          {isCommoditySelected && (
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-500 font-medium">Currently Selected:</span>
              <span className="inline-flex items-center gap-1.5 bg-purple-100 dark:bg-purple-950 text-purple-900 dark:text-purple-200 font-bold text-xs px-3 py-1 rounded-full border border-purple-200 dark:border-purple-800">
                <Check className="w-3.5 h-3.5 text-purple-600" />
                {requirementInput.commodityName}
                <button 
                  onClick={handleClearCommodity}
                  className="hover:text-rose-600 ml-1 cursor-pointer"
                  title="Clear Commodity Selection"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            </div>
          )}
        </div>

        {/* Commodity Search & Category Filters */}
        <div className="space-y-4">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            {CATEGORY_TABS.map(category => (
              <button
                key={category}
                onClick={() => {
                  setSelectedCategory(category);
                }}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer flex items-center gap-1.5 ${
                  selectedCategory === category
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <span>{category === 'ALL' ? 'All Commodities' : category}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                  selectedCategory === category ? 'bg-purple-800 text-purple-100' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}>
                  {categoryCounts[category] || 0}
                </span>
              </button>
            ))}
          </div>

          {/* Search Bar + Quick Select Dropdown Container */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
            {/* Search Input */}
            <div className="lg:col-span-2 relative">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setIsDropdownOpen(true);
                  }}
                  onFocus={() => setIsDropdownOpen(true)}
                  placeholder="Search commodity by English, Hindi (गाजर, प्याज, बाजरा), scientific name or alias..."
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-purple-500"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Quick Suggestion Pills */}
              <div className="flex flex-wrap items-center gap-1.5 mt-2">
                <span className="text-[10px] font-bold uppercase text-slate-400">Popular:</span>
                {['Carrot', 'Onion', 'Tomato', 'Bajra', 'Soybean', 'Wheat', 'Potato', 'Cauliflower', 'Turmeric'].map(name => {
                  const item = commodityUniverse.find(c => c.displayName.toLowerCase() === name.toLowerCase() || c.cropCommodityId.toLowerCase() === name.toLowerCase());
                  if (!item) return null;
                  const isSelected = requirementInput.commodityId.toLowerCase() === item.cropCommodityId.toLowerCase();
                  return (
                    <button
                      key={name}
                      onClick={() => handleSelectCommodity(item)}
                      className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-purple-600 text-white border-purple-600'
                          : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-purple-400'
                      }`}
                    >
                      {item.displayName}
                    </button>
                  );
                })}
              </div>

              {/* Expandable Search Results List */}
              {isDropdownOpen && (
                <div className="absolute z-30 left-0 right-0 mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl max-h-72 overflow-y-auto p-2 space-y-1">
                  <div className="flex items-center justify-between px-2 py-1 text-[11px] text-slate-400 font-bold border-b border-slate-100 dark:border-slate-800 mb-1">
                    <span>{filteredCommodities.length} Commodities Available</span>
                    <button 
                      onClick={() => setIsDropdownOpen(false)}
                      className="text-purple-600 hover:underline cursor-pointer"
                    >
                      Close
                    </button>
                  </div>
                  
                  {filteredCommodities.length === 0 ? (
                    <div className="text-center py-6 text-xs text-slate-500">
                      No commodities matching &ldquo;{searchQuery}&rdquo; in category &ldquo;{selectedCategory}&rdquo;.
                    </div>
                  ) : (
                    filteredCommodities.map(comm => {
                      const isSelected = requirementInput.commodityId.toLowerCase() === comm.cropCommodityId.toLowerCase();
                      return (
                        <div
                          key={comm.cropCommodityId}
                          onClick={() => handleSelectCommodity(comm)}
                          className={`p-2.5 rounded-xl cursor-pointer transition-all flex items-center justify-between gap-3 ${
                            isSelected
                              ? 'bg-purple-50 dark:bg-purple-950/60 border border-purple-300 dark:border-purple-800'
                              : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 border border-transparent'
                          }`}
                        >
                          <div className="space-y-0.5 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-slate-100">
                                {comm.displayName}
                              </span>
                              {comm.hindiName && (
                                <span className="text-xs text-slate-400 font-medium">
                                  ({comm.hindiName})
                                </span>
                              )}
                              <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded-md font-medium">
                                {comm.category || comm.commodityGroup}
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                              Official: {comm.officialCommodityName} &bull; {comm.scientificName || 'Botanical'}
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            {comm.activeMarketCount > 0 ? (
                              <span className="text-[10px] bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 font-bold px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
                                {comm.activeMarketCount} Mandis Active
                              </span>
                            ) : (
                              <span className="text-[10px] bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400 px-2 py-0.5 rounded-md">
                                Master Catalog
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>

            {/* Delivery Hub Selector */}
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold text-slate-500 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-purple-600" />
                Institutional Delivery Hub
              </label>
              <select
                value={
                  INSTITUTIONAL_DELIVERY_HUBS.find(h => h.name === requirementInput.deliveryHubName)?.id || 'hub_nagpur'
                }
                onChange={(e) => handleSelectHub(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-3 py-2.5 text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-purple-500 cursor-pointer"
              >
                {INSTITUTIONAL_DELIVERY_HUBS.map(hub => (
                  <option key={hub.id} value={hub.id}>
                    {hub.name} ({hub.state})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Secondary Requirement Attributes: Volume, Target Price, Sourcing Radius */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-100 dark:border-slate-800">
            <div>
              <label className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
                Required Volume (Metric Tonnes)
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={requirementInput.requiredQuantityMetricTonnes}
                  onChange={(e) => setRequirementInput({
                    ...requirementInput,
                    requiredQuantityMetricTonnes: Math.max(1, Number(e.target.value) || 1000)
                  })}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-200"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                  MT
                </span>
              </div>
            </div>

            <div>
              <label className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
                Target Ceiling Price (₹ / Qtl)
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={requirementInput.maxTargetPriceInrPerQtl || ''}
                  placeholder="Optional (e.g. 2800)"
                  onChange={(e) => setRequirementInput({
                    ...requirementInput,
                    maxTargetPriceInrPerQtl: e.target.value ? Number(e.target.value) : undefined
                  })}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-200"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                  ₹/Qtl
                </span>
              </div>
            </div>

            <div>
              <label className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
                Max Sourcing Radius (km)
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={requirementInput.preferredSourcingRadiusKm || 500}
                  onChange={(e) => setRequirementInput({
                    ...requirementInput,
                    preferredSourcingRadiusKm: Number(e.target.value) || 500
                  })}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-200"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                  km
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. SELECTED COMMODITY BANNER / UNSELECTED GUIDANCE BANNER */}
      {/* ========================================================================= */}
      {isCommoditySelected ? (
        <div className="bg-gradient-to-r from-purple-900 to-indigo-900 text-white rounded-3xl p-6 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-purple-500/40 text-purple-200">
                ACTIVE SOURCING PIPELINE
              </span>
              <span className="text-[10px] font-bold text-purple-300">
                {selectedCommodity?.category || 'Agricultural Commodity'}
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-black flex items-center gap-3">
              <span>SELECTED COMMODITY: {requirementInput.commodityName}</span>
              {selectedCommodity?.hindiName && (
                <span className="text-lg font-normal text-purple-300">
                  ({selectedCommodity.hindiName})
                </span>
              )}
            </div>
            <p className="text-xs text-purple-200">
              Official Agmarknet Name: <span className="font-semibold text-white">{selectedCommodity?.officialCommodityName || requirementInput.commodityName}</span> &bull; Destination: <span className="font-semibold text-white">{requirementInput.deliveryHubName}</span>
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {hasOfficialData ? (
              <div className="bg-emerald-500/20 border border-emerald-400/40 px-3.5 py-2 rounded-2xl text-right">
                <div className="text-[10px] font-bold text-emerald-300 uppercase">Surveillance Status</div>
                <div className="text-xs sm:text-sm font-black text-emerald-100">
                  {decisionResult.sourcingOpportunities.length} Verified APMCs Found
                </div>
              </div>
            ) : (
              <div className="bg-amber-500/20 border border-amber-400/40 px-3.5 py-2 rounded-2xl text-right">
                <div className="text-[10px] font-bold text-amber-300 uppercase">Data Notice</div>
                <div className="text-xs sm:text-sm font-black text-amber-100">
                  Official Data Unavailable
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-slate-100 dark:bg-slate-900 border-2 border-dashed border-purple-300 dark:border-purple-800 rounded-3xl p-8 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-300 flex items-center justify-center mx-auto">
            <Building2 className="w-7 h-7" />
          </div>
          <div className="space-y-1 max-w-xl mx-auto">
            <h3 className="text-xl font-black text-slate-900 dark:text-slate-100">
              SELECT A COMMODITY TO BEGIN PROCUREMENT INTELLIGENCE
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Please choose a commodity from the master catalog above (e.g., <span className="font-bold text-purple-700 dark:text-purple-400">Carrot</span>, <span className="font-bold text-purple-700 dark:text-purple-400">Onion</span>, <span className="font-bold text-purple-700 dark:text-purple-400">Tomato</span>, <span className="font-bold text-purple-700 dark:text-purple-400">Bajra</span>, <span className="font-bold text-purple-700 dark:text-purple-400">Soybean</span>) to evaluate official spot prices, geodesic transit distances, landed cost rankings, multi-district volume allocation, and live what-if risk simulations.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            {['Carrot', 'Onion', 'Tomato', 'Bajra', 'Soybean', 'Wheat'].map(name => {
              const item = commodityUniverse.find(c => c.displayName.toLowerCase() === name.toLowerCase() || c.cropCommodityId.toLowerCase() === name.toLowerCase());
              if (!item) return null;
              return (
                <button
                  key={name}
                  onClick={() => handleSelectCommodity(item)}
                  className="bg-white dark:bg-slate-800 hover:bg-purple-50 dark:hover:bg-purple-950 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold px-3 py-1.5 rounded-xl cursor-pointer transition-all shadow-xs"
                >
                  Select {item.displayName} &rarr;
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. CASE: COMMODITY SELECTED BUT OFFICIAL DATA UNAVAILABLE */}
      {/* ========================================================================= */}
      {isCommoditySelected && !hasOfficialData && (
        <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-3xl p-6 sm:p-8 space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <EvidenceTypeBadge classification="OFFICIAL_OBSERVED_DATA" size="sm" />
                <span className="text-xs font-black text-amber-800 dark:text-amber-300 uppercase">
                  OFFICIAL DATA UNAVAILABLE
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                No Active AGMARKNET Market Bulletins for {requirementInput.commodityName}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                FARMFIT adheres to a strict non-fabrication policy. Because no official DMI AGMARKNET daily price record is currently published for &ldquo;{requirementInput.commodityName}&rdquo; in the surveillance window, the system does not fabricate proxy prices or substitute unrelated vegetables.
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-amber-200/60 dark:border-amber-800/60 rounded-2xl p-4 space-y-3">
            <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
              Recommended Procurement Contingency Actions
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600 dark:text-slate-400">
              <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
                <span className="font-bold text-slate-800 dark:text-slate-200 block mb-1">1. Direct Field Mandi Assay</span>
                Dispatch field procurement representatives to primary growing clusters to conduct manual assaying and obtain physical quotes.
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
                <span className="font-bold text-slate-800 dark:text-slate-200 block mb-1">2. FPO Federation Bilateral Contracting</span>
                Engage state-level FPO federations or NABARD aggregation consortiums for direct off-take agreements.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. MAIN DECISION MODULES (RENDERED WHEN COMMODITY HAS OFFICIAL DATA) */}
      {/* ========================================================================= */}
      {isCommoditySelected && hasOfficialData && (
        <div className="space-y-6">
          {/* Navigation Tabs */}
          <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
            <button
              onClick={() => setActiveTab('SOURCING_OPPORTUNITIES')}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                activeTab === 'SOURCING_OPPORTUNITIES'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
              }`}
            >
              1. SOURCING OPPORTUNITIES ({decisionResult.sourcingOpportunities.length})
            </button>

            <button
              onClick={() => setActiveTab('MULTI_SOURCING')}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                activeTab === 'MULTI_SOURCING'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
              }`}
            >
              2. MULTI-SOURCING SPLIT
            </button>

            <button
              onClick={() => setActiveTab('PRICE_INTELLIGENCE')}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                activeTab === 'PRICE_INTELLIGENCE'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
              }`}
            >
              3. PRICE MOMENTUM (7D / 30D / 90D)
            </button>

            <button
              onClick={() => setActiveTab('RISK_SCORE')}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                activeTab === 'RISK_SCORE'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
              }`}
            >
              4. PROCUREMENT RISK MATRIX
            </button>

            <button
              onClick={() => setActiveTab('WHAT_IF')}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                activeTab === 'WHAT_IF'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
              }`}
            >
              5. WHAT-IF SCENARIOS
            </button>

            <button
              onClick={() => setActiveTab('ACTION_PLAN')}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                activeTab === 'ACTION_PLAN'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
              }`}
            >
              6. ACTION PLAN
            </button>
          </div>

          {/* TAB 1: SOURCING OPPORTUNITIES */}
          {activeTab === 'SOURCING_OPPORTUNITIES' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {decisionResult.sourcingOpportunities.map((op) => (
                  <FarmfitDecisionCard
                    key={op.rank}
                    decisionTitle={`#${op.rank} ${op.marketName}`}
                    decisionSubtitle={`${op.district}, ${op.state} • ${op.distanceToHubKm} km to ${requirementInput.deliveryHubName}`}
                    commodityName={op.commodityDisplayName}
                    cropCommodityId={op.cropCommodityId}
                    whyExplanation={`Lowest landed procurement cost (₹${op.landedCostInrPerQtl}/Qtl) factoring ₹${op.estimatedFreightInrPerQtl}/Qtl freight to ${requirementInput.deliveryHubName}.`}
                    opportunityValue={`₹${op.landedCostInrPerQtl.toLocaleString('en-IN')}/Qtl Landed Cost`}
                    opportunityDetail={`Modal Price: ₹${op.latestModalPriceInrQtl}/Qtl (${op.priceDate}) • Freight: +₹${op.estimatedFreightInrPerQtl}/Qtl`}
                    riskLevel={op.procurementRiskLevel}
                    riskScore={op.procurementRiskScore}
                    riskSummary={op.supplyEvidenceLabel}
                    confidenceTier={op.confidenceTier}
                    confidenceExplanation={op.confidenceWhy}
                    dataDate={op.priceDate}
                    dataSourceName="AGMARKNET & FARMFIT Freight Engine"
                    badgeTag={op.supplyVerificationTag}
                    actionLabel="Inspect Evidence & Quotes"
                    onAction={() => setSelectedOpportunityModal(op)}
                    evidenceItems={op.evidenceItems}
                  />
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: MULTI-SOURCING SPLIT */}
          {activeTab === 'MULTI_SOURCING' && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
              <div>
                <div className="flex items-center gap-2">
                  <EvidenceTypeBadge classification="FARMFIT_DERIVED_INTELLIGENCE" size="sm" />
                  <span className="text-xs font-bold text-slate-500">Geographic Concentration Mitigation</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-1">
                  Recommended Multi-District Sourcing Split
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  {decisionResult.multiSourcingAllocation.diversificationAdvantage}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {decisionResult.multiSourcingAllocation.recommendedSourcingSplit.map((split, idx) => (
                  <div key={idx} className="bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-purple-700 dark:text-purple-400">{split.regionName}</span>
                      <span className="text-xs font-black px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-900 dark:text-purple-300">
                        {split.allocatedPercent}% Split
                      </span>
                    </div>

                    <div className="text-2xl font-black text-slate-900 dark:text-slate-100">
                      {split.allocatedQuantityMetricTonnes.toLocaleString('en-IN')} MT
                    </div>

                    <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
                      <div>Avg. Landed: <span className="font-bold text-slate-800 dark:text-slate-200">₹{split.avgLandedCostInrPerQtl}/Qtl</span></div>
                      <div>Primary APMC: <span className="font-semibold text-slate-700 dark:text-slate-300">{split.primaryApmcs.join(', ')}</span></div>
                    </div>

                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
                      {split.rationale}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: PRICE MOMENTUM */}
          {activeTab === 'PRICE_INTELLIGENCE' && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                    Procurement Price Signal &amp; Historical Velocity
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    {decisionResult.priceIntelligence.signalReasoning}
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-slate-50 dark:bg-slate-950/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 text-center">
                    <div className="text-[10px] font-bold uppercase text-slate-400">Latest Modal Quote</div>
                    <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100">
                      ₹{decisionResult.priceIntelligence.latestOfficialPriceInrQtl}/Qtl
                    </div>
                    <div className="text-[10px] text-slate-500">{decisionResult.priceIntelligence.priceDate}</div>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-950/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 text-center">
                    <div className="text-[10px] font-bold uppercase text-slate-400">Price Range (Min–Max)</div>
                    <div className="text-lg sm:text-xl font-black text-slate-800 dark:text-slate-200">
                      ₹{decisionResult.priceIntelligence.priceRangeMinInrQtl} – ₹{decisionResult.priceIntelligence.priceRangeMaxInrQtl}
                    </div>
                    <div className="text-[10px] text-slate-500">Across Reporting Mandis</div>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-950/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 text-center">
                    <div className="text-[10px] font-bold uppercase text-slate-400">Volatility Spread</div>
                    <div className="text-xl sm:text-2xl font-black text-purple-700 dark:text-purple-400">
                      {decisionResult.priceIntelligence.volatilityIndex}%
                    </div>
                    <div className="text-[10px] text-slate-500">Inter-Mandi Arbitrage</div>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-950/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 text-center">
                    <div className="text-[10px] font-bold uppercase text-slate-400">Execution Stance</div>
                    <div className="text-lg sm:text-xl font-black text-emerald-700 dark:text-emerald-400">
                      {decisionResult.priceIntelligence.priceSignal}
                    </div>
                    <div className="text-[10px] text-slate-500">FARMFIT Strategy Signal</div>
                  </div>
                </div>
              </div>

              {/* Verified Multi-Window Analytics Engine Scorecard */}
              <MarketTrendScorecard
                analytics={b2bVerifiedAnalytics}
                onRankingModeChange={(mode) => setB2bRankingMode(mode)}
              />
            </div>
          )}

          {/* TAB 4: RISK SCORE */}
          {activeTab === 'RISK_SCORE' && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  8-Dimensional Procurement Risk Breakdown
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  {decisionResult.riskBreakdown.methodologyNotes}
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: 'Price Volatility', score: decisionResult.riskBreakdown.priceRisk },
                  { label: 'Physical Supply', score: decisionResult.riskBreakdown.supplyRisk },
                  { label: 'Weather / Rain', score: decisionResult.riskBreakdown.weatherRisk },
                  { label: 'Freight Logistics', score: decisionResult.riskBreakdown.logisticsRisk },
                  { label: 'Quality & Assaying', score: decisionResult.riskBreakdown.qualityRisk },
                  { label: 'Trade & Import Duty', score: decisionResult.riskBreakdown.tradeRisk },
                  { label: 'Regulatory Policy', score: decisionResult.riskBreakdown.policyRisk },
                  { label: 'Concentration Risk', score: decisionResult.riskBreakdown.concentrationRisk }
                ].map((r, idx) => (
                  <div key={idx} className="bg-slate-50 dark:bg-slate-950/60 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                    <div className="text-[11px] font-bold text-slate-500">{r.label}</div>
                    <div className="text-lg font-black text-slate-900 dark:text-slate-100">{r.score}/100</div>
                    <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-purple-600 h-full rounded-full" style={{ width: `${r.score}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: WHAT-IF SCENARIOS */}
          {activeTab === 'WHAT_IF' && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
              <div>
                <div className="flex items-center gap-2">
                  <EvidenceTypeBadge classification="FARMFIT_SCENARIO_SIMULATION" size="sm" />
                  <span className="text-xs font-bold text-slate-500">Corporate Procurement Shock Engine</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-1">
                  Procurement Cost Sensitivity Simulations
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Evaluates total financial variance against budget in case of commodity spot surges or freight escalation.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {decisionResult.scenarioSimulations.map((sim, idx) => (
                  <div key={idx} className="bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-3">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{sim.shockApplied}</h4>

                    <div className="space-y-1">
                      <div className="text-xs text-slate-500">Simulated Landed Cost</div>
                      <div className="text-xl font-black text-purple-900 dark:text-purple-300">₹{sim.landedCostInrPerQtl}/Qtl</div>
                    </div>

                    <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
                      <div>Total Outlay: <span className="font-bold text-slate-800 dark:text-slate-200">₹{sim.totalProcurementCostInrCrores} Cr</span></div>
                      <div>Variance: <span className="font-bold text-rose-600">+₹{sim.costVarianceInrLakhs} Lakhs</span></div>
                    </div>

                    <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
                      <span className="font-bold">FARMFIT Recommendation: </span>
                      {sim.alternativeSourcingRecommendation}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: ACTION PLAN */}
          {activeTab === 'ACTION_PLAN' && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
              <div>
                <span className="text-[11px] font-bold text-purple-700 dark:text-purple-400 uppercase tracking-wider">
                  OPERATIONAL EXECUTION
                </span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-1">
                  Procurement Next Steps
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Immediate operational sequence for the sourcing and logistics team.
                </p>
              </div>

              <div className="space-y-3">
                {decisionResult.nextActionPlan.map((act) => (
                  <div key={act.stepNumber} className="bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-purple-600 text-white font-black text-sm flex items-center justify-center shrink-0">
                      {act.stepNumber}
                    </div>
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{act.actionTitle}</h4>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">
                          {act.urgency}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{act.actionDescription}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Evidence Modal */}
      {selectedOpportunityModal && (
        <UniversalEvidenceModal
          isOpen={true}
          onClose={() => setSelectedOpportunityModal(null)}
          title={`${selectedOpportunityModal.marketName} — Sourcing Evidence Audit`}
          evidenceItems={selectedOpportunityModal.evidenceItems}
          commodityName={selectedOpportunityModal.commodityDisplayName}
        />
      )}
    </div>
  );
};
