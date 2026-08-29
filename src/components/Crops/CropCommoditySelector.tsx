import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Check, 
  X, 
  Sparkles, 
  Layers, 
  Database, 
  ShieldCheck, 
  Filter, 
  ChevronRight, 
  AlertCircle, 
  CheckCircle2, 
  Grid, 
  List, 
  ArrowRight,
  Info,
  Maximize2,
  HelpCircle
} from 'lucide-react';
import { 
  cropMasterSelectorService, 
  SelectorCategoryTab, 
  EnrichedCropSelectorItem,
  CategoryCountsSummary 
} from '../../services/cropMasterSelectorService';
import { 
  CropSeason, 
  FarmLocation, 
  LandIrrigationProfile, 
  SoilProfileRecord 
} from '../../types';
import { CropMasterRecord } from '../../types';

interface CropCommoditySelectorProps {
  selectedCropIds: string[];
  onToggleCrop: (cropId: string) => void;
  onSelectCrops?: (cropIds: string[]) => void;
  onClearAllCrops?: () => void;
  targetSeason?: CropSeason | 'ANY';
  farmerLocation?: FarmLocation;
  landProfile?: Partial<LandIrrigationProfile>;
  soilProfile?: Partial<SoilProfileRecord>;
  onFindBestCropsRequested?: () => void;
  title?: string;
  subtitle?: string;
  allowVarietySelection?: boolean;
}

export const CropCommoditySelector: React.FC<CropCommoditySelectorProps> = ({
  selectedCropIds = [],
  onToggleCrop,
  onSelectCrops,
  onClearAllCrops,
  targetSeason = 'Kharif',
  farmerLocation,
  landProfile,
  soilProfile,
  onFindBestCropsRequested,
  title = "FARMFIT All India Crop & Commodity Selector",
  subtitle = "Search and select from the complete verified Indian agricultural crop and horticulture commodity universe"
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeCategoryTab, setActiveCategoryTab] = useState<SelectorCategoryTab>('ALL');
  const [seasonFilter, setSeasonFilter] = useState<CropSeason | 'ALL'>('ALL');
  const [mspOnlyFilter, setMspOnlyFilter] = useState<boolean>(false);
  const [isBrowseModalOpen, setIsBrowseModalOpen] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedVarietiesMap, setSelectedVarietiesMap] = useState<Record<string, string>>({});
  const [selectedGradesMap, setSelectedGradesMap] = useState<Record<string, string>>({});

  // Dynamic Category Counts
  const counts: CategoryCountsSummary = useMemo(() => {
    return cropMasterSelectorService.getCategoryCounts();
  }, []);

  // Farm Context for real-time suitability scoring
  const farmContext = useMemo(() => {
    return {
      location: farmerLocation,
      land: landProfile,
      soil: soilProfile,
      targetSeason: targetSeason === 'ANY' ? undefined : targetSeason
    };
  }, [farmerLocation, landProfile, soilProfile, targetSeason]);

  // Filtered & Enriched Crop Results
  const searchResults: EnrichedCropSelectorItem[] = useMemo(() => {
    return cropMasterSelectorService.searchCrops({
      query: searchTerm,
      categoryTab: activeCategoryTab,
      season: seasonFilter,
      mspOnly: mspOnlyFilter,
      farmContext: farmerLocation?.district ? farmContext : undefined
    });
  }, [searchTerm, activeCategoryTab, seasonFilter, mspOnlyFilter, farmContext, farmerLocation]);

  // Selected crop full records
  const selectedCropRecords = useMemo(() => {
    return selectedCropIds.map(id => {
      const items = cropMasterSelectorService.searchCrops({ query: id });
      const found = items.find(it => it.crop.cropId.toLowerCase() === id.toLowerCase());
      return found || items[0] || null;
    }).filter(Boolean) as EnrichedCropSelectorItem[];
  }, [selectedCropIds]);

  // Handle Find Best Crops (Automated Decision Engine)
  const handleFindBestCrops = () => {
    const { recommendedCrops } = cropMasterSelectorService.findBestCropsForFarm(farmContext);
    if (recommendedCrops.length > 0 && onSelectCrops) {
      // Pick top 4-5 recommended crops for this farm
      const topIds = recommendedCrops.slice(0, 4).map(c => c.crop.cropId);
      onSelectCrops(topIds);
    }
    if (onFindBestCropsRequested) {
      onFindBestCropsRequested();
    }
  };

  const handleVarietyChange = (cropId: string, variety: string) => {
    setSelectedVarietiesMap(prev => ({ ...prev, [cropId]: variety }));
  };

  const handleGradeChange = (cropId: string, grade: string) => {
    setSelectedGradesMap(prev => ({ ...prev, [cropId]: grade }));
  };

  const categoryTabs: Array<{ id: SelectorCategoryTab; label: string; count: number }> = [
    { id: 'ALL', label: 'ALL', count: counts.totalOptions },
    { id: 'CEREALS', label: 'CEREALS', count: counts.cereals },
    { id: 'PULSES', label: 'PULSES', count: counts.pulses },
    { id: 'OILSEEDS', label: 'OILSEEDS', count: counts.oilseeds },
    { id: 'VEGETABLES', label: 'VEGETABLES', count: counts.vegetables },
    { id: 'FRUITS', label: 'FRUITS', count: counts.fruits },
    { id: 'SPICES', label: 'SPICES', count: counts.spices },
    { id: 'COMMERCIAL CROPS', label: 'COMMERCIAL CROPS', count: counts.commercialCrops },
    { id: 'FIBRE', label: 'FIBRE', count: counts.fibre },
    { id: 'PLANTATION', label: 'PLANTATION', count: counts.plantation },
    { id: 'NUTS & DRY FRUITS', label: 'NUTS & DRY FRUITS', count: counts.nutsAndDryFruits },
    { id: 'OTHER', label: 'OTHER', count: counts.other },
  ];

  return (
    <div id="farmfit-crop-selector-container" className="space-y-6">
      {/* HEADER WITH REAL DATA COUNTER */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold">
                <Layers className="w-4 h-4" />
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                {title}
              </h2>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 font-medium">
              {subtitle}
            </p>
          </div>

          {/* ACTION BUTTONS: [FIND BEST CROPS] & [BROWSE ALL CROPS] */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              id="btn-find-best-crops"
              onClick={handleFindBestCrops}
              type="button"
              className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Find Best Crops for My Farm</span>
            </button>

            <button
              id="btn-browse-all-crops"
              onClick={() => setIsBrowseModalOpen(true)}
              type="button"
              className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer border border-slate-200 dark:border-slate-700"
            >
              <Maximize2 className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
              <span>Browse All Crops ({counts.totalOptions})</span>
            </button>
          </div>
        </div>

        {/* DYNAMIC DATA COUNTER ROW */}
        <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-12 gap-2 text-center text-xs">
          <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60">
            <span className="text-[9px] text-emerald-800 dark:text-emerald-300 block font-bold truncate">TOTAL</span>
            <span className="text-sm font-black text-emerald-900 dark:text-emerald-100">{counts.totalOptions}</span>
          </div>
          <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <span className="text-[9px] text-slate-500 block font-bold truncate">CEREALS</span>
            <span className="text-sm font-black text-slate-800 dark:text-slate-200">{counts.cereals}</span>
          </div>
          <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <span className="text-[9px] text-slate-500 block font-bold truncate">PULSES</span>
            <span className="text-sm font-black text-slate-800 dark:text-slate-200">{counts.pulses}</span>
          </div>
          <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <span className="text-[9px] text-slate-500 block font-bold truncate">OILSEEDS</span>
            <span className="text-sm font-black text-slate-800 dark:text-slate-200">{counts.oilseeds}</span>
          </div>
          <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <span className="text-[9px] text-slate-500 block font-bold truncate">VEGETABLES</span>
            <span className="text-sm font-black text-slate-800 dark:text-slate-200">{counts.vegetables}</span>
          </div>
          <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <span className="text-[9px] text-slate-500 block font-bold truncate">FRUITS</span>
            <span className="text-sm font-black text-slate-800 dark:text-slate-200">{counts.fruits}</span>
          </div>
          <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <span className="text-[9px] text-slate-500 block font-bold truncate">SPICES</span>
            <span className="text-sm font-black text-slate-800 dark:text-slate-200">{counts.spices}</span>
          </div>
          <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <span className="text-[9px] text-slate-500 block font-bold truncate">COMMERCIAL</span>
            <span className="text-sm font-black text-slate-800 dark:text-slate-200">{counts.commercialCrops}</span>
          </div>
          <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <span className="text-[9px] text-slate-500 block font-bold truncate">FIBRE</span>
            <span className="text-sm font-black text-slate-800 dark:text-slate-200">{counts.fibre}</span>
          </div>
          <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <span className="text-[9px] text-slate-500 block font-bold truncate">PLANTATION</span>
            <span className="text-sm font-black text-slate-800 dark:text-slate-200">{counts.plantation}</span>
          </div>
          <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <span className="text-[9px] text-slate-500 block font-bold truncate">NUTS & DRY</span>
            <span className="text-sm font-black text-slate-800 dark:text-slate-200">{counts.nutsAndDryFruits}</span>
          </div>
          <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <span className="text-[9px] text-slate-500 block font-bold truncate">OTHER</span>
            <span className="text-sm font-black text-slate-800 dark:text-slate-200">{counts.other}</span>
          </div>
        </div>

        {/* SEARCH BOX */}
        <div className="mt-5 relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
            <Search className="w-5 h-5" />
          </div>
          <input
            id="crop-search-input"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search any crop, vegetable, fruit, spice or agricultural commodity (e.g. Bajra, Onion, Tomato, Cauliflower, Turmeric, Garlic)..."
            className="w-full pl-11 pr-10 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-semibold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition-all"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* CATEGORY FILTER TABS */}
        <div className="mt-4 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categoryTabs.map(tab => (
            <button
              key={tab.id}
              id={`tab-category-${tab.id.toLowerCase().replace(/\s+/g, '-')}`}
              onClick={() => setActiveCategoryTab(tab.id)}
              type="button"
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeCategoryTab === tab.id
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                activeCategoryTab === tab.id
                  ? 'bg-emerald-800 text-emerald-100'
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* SELECTED CROPS SUMMARY BAR */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xs">
        <div className="flex items-center justify-between gap-4 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
              Selected Crops ({selectedCropIds.length})
            </span>
            {selectedCropIds.length === 0 ? (
              <span className="text-xs text-slate-400 italic">
                (No crops selected. Fresh profile starts blank.)
              </span>
            ) : (
              <span className="text-xs text-emerald-700 dark:text-emerald-400 font-bold">
                &bull; Active in Mandi Intelligence & Farm Decision Engine
              </span>
            )}
          </div>

          {selectedCropIds.length > 0 && onClearAllCrops && (
            <button
              onClick={onClearAllCrops}
              type="button"
              className="text-xs font-bold text-rose-600 hover:text-rose-700 cursor-pointer flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" />
              <span>Clear All</span>
            </button>
          )}
        </div>

        {selectedCropIds.length === 0 ? (
          <div className="pt-4 text-center py-6">
            <p className="text-xs text-slate-500 max-w-lg mx-auto">
              Select crops from below, search any commodity, or click <strong className="text-emerald-700">"Find Best Crops for My Farm"</strong> to evaluate the entire Indian agricultural universe based on your farm's soil, water, and climate.
            </p>
          </div>
        ) : (
          <div className="pt-3.5 flex flex-wrap gap-2.5">
            {selectedCropRecords.map(({ crop, marketInfo }) => (
              <div 
                key={crop.cropId}
                className="flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-xs shadow-xs"
              >
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-emerald-950 dark:text-emerald-100">{crop.cropName}</span>
                    <span className="text-[10px] text-emerald-700 dark:text-emerald-300 font-medium">({crop.category})</span>
                  </div>
                  <div className="text-[9px] text-slate-500 font-mono">
                    {marketInfo.hasOfficialBulletinPrice ? `Modal: ₹${marketInfo.latestModalPrice}/Qtl` : 'Planning Available'}
                  </div>
                </div>

                <button
                  onClick={() => onToggleCrop(crop.cropId)}
                  type="button"
                  className="w-5 h-5 rounded-full bg-emerald-200/80 dark:bg-emerald-900/80 hover:bg-rose-100 hover:text-rose-700 text-emerald-800 dark:text-emerald-200 flex items-center justify-center cursor-pointer transition-colors"
                  title={`Remove ${crop.cropName}`}
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CROPS SELECTION GRID */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
            Showing <strong className="text-slate-900 dark:text-white">{searchResults.length}</strong> available commodities for category <strong className="text-emerald-700 dark:text-emerald-400">{activeCategoryTab}</strong>
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg border text-xs cursor-pointer ${
                viewMode === 'grid' 
                  ? 'bg-emerald-100 dark:bg-emerald-900 border-emerald-300 text-emerald-800 dark:text-emerald-200' 
                  : 'bg-white dark:bg-slate-800 border-slate-200 text-slate-500'
              }`}
              title="Grid View"
            >
              <Grid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg border text-xs cursor-pointer ${
                viewMode === 'list' 
                  ? 'bg-emerald-100 dark:bg-emerald-900 border-emerald-300 text-emerald-800 dark:text-emerald-200' 
                  : 'bg-white dark:bg-slate-800 border-slate-200 text-slate-500'
              }`}
              title="List View"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {searchResults.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-10 text-center space-y-3">
            <AlertCircle className="w-8 h-8 text-amber-500 mx-auto" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              No crops found matching "{searchTerm}"
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Try searching by English name, Hindi name (e.g. बाजरा, प्याज, लहसुन), botanical name, or switch category tabs.
            </p>
            <button
              onClick={() => { setSearchTerm(''); setActiveCategoryTab('ALL'); }}
              className="px-4 py-2 rounded-xl bg-emerald-700 text-white font-bold text-xs cursor-pointer"
            >
              Reset Filters & Show All {counts.totalOptions} Crops
            </button>
          </div>
        ) : (
          <div className={viewMode === 'grid' 
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5"
            : "space-y-2.5"
          }>
            {searchResults.map(({ crop, marketInfo, suitabilityScore, suitabilityLevel, limitingReasons }) => {
              const isSelected = selectedCropIds.includes(crop.cropId);
              const officialVarieties = marketInfo.availableVarieties || [];
              const selectedVariety = selectedVarietiesMap[crop.cropId] || officialVarieties[0] || 'FAQ';

              return (
                <div
                  key={crop.cropId}
                  id={`crop-card-${crop.cropId}`}
                  className={`border rounded-2xl p-4 transition-all relative flex flex-col justify-between ${
                    isSelected
                      ? 'bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-500 dark:border-emerald-600 ring-2 ring-emerald-500/20 shadow-xs'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div>
                    {/* TOP BADGES: Category & Market Status */}
                    <div className="flex items-center justify-between gap-2 pb-2">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-bold uppercase tracking-wider">
                        {crop.category}
                      </span>

                      {marketInfo.status === 'AVAILABLE' ? (
                        <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          Official Market Data: AVAILABLE
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 text-[10px] font-medium">
                          Market Data: NOT CURRENTLY AVAILABLE
                        </span>
                      )}
                    </div>

                    {/* CROP NAME & HINDI/LOCAL NAMES */}
                    <div className="mt-1">
                      <h4 className="text-base font-black text-slate-900 dark:text-white leading-snug">
                        {crop.cropName}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                        {(crop.localNames?.hi ? `${crop.localNames.hi} • ` : '') + (crop.scientificName || '')}
                      </p>
                    </div>

                    {/* AGRONOMIC ATTRIBUTES */}
                    <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-2 text-[11px]">
                      <div>
                        <span className="text-slate-400 block text-[10px]">Season</span>
                        <span className="font-semibold text-slate-700 dark:text-slate-300">{crop.season}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Duration</span>
                        <span className="font-semibold text-slate-700 dark:text-slate-300">
                          {crop.durationRangeDays ? `${crop.durationRangeDays.min}-${crop.durationRangeDays.max} days` : `${crop.typicalDurationDays || 100} days`}
                        </span>
                      </div>
                    </div>

                    {/* VARIETY SELECTOR (IF MULTIPLE VARIETIES AVAILABLE) */}
                    {officialVarieties.length > 1 && (
                      <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                        <label className="text-[10px] text-slate-400 font-bold block mb-1">
                          Official Variety:
                        </label>
                        <select
                          value={selectedVariety}
                          onChange={(e) => handleVarietyChange(crop.cropId, e.target.value)}
                          className="w-full text-xs font-semibold py-1 px-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none"
                        >
                          {officialVarieties.map(v => (
                            <option key={v} value={v}>{v}</option>
                          ))}
                        </select>
                      </div>
                    )}

                    {/* SUITABILITY SCORE / REASONS (IF FARM LOCATION CONNECTED) */}
                    {suitabilityScore !== undefined && (
                      <div className="mt-2.5 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 text-[10px]">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-slate-500 font-bold">Farm Suitability:</span>
                          <span className={`font-black ${
                            suitabilityScore >= 75 ? 'text-emerald-600' :
                            suitabilityScore >= 55 ? 'text-blue-600' : 'text-amber-600'
                          }`}>
                            {suitabilityScore}% ({suitabilityLevel})
                          </span>
                        </div>
                        {limitingReasons && limitingReasons.length > 0 && (
                          <div className="text-amber-700 dark:text-amber-300 text-[10px] break-words space-y-0.5 mt-1">
                            {limitingReasons.map((reason, rIdx) => (
                              <div key={rIdx} className="leading-snug">&bull; {reason}</div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* BOTTOM SELECTION BUTTON */}
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <button
                      id={`btn-select-crop-${crop.cropId}`}
                      onClick={() => onToggleCrop(crop.cropId)}
                      type="button"
                      className={`w-full py-2 px-3 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-700 text-white shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-emerald-50 hover:text-emerald-800 dark:hover:bg-emerald-950 dark:hover:text-emerald-200'
                      }`}
                    >
                      {isSelected ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>SELECTED</span>
                        </>
                      ) : (
                        <span>SELECT COMMODITY</span>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* FULL CROP BROWSER MODAL (PAGINATED & SEARCHABLE) */}
      {isBrowseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/80 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-base sm:text-xl font-black text-slate-900 dark:text-white">
                  FARMFIT Complete Commodity Universe Browser
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Browse, search, and multi-select across all {counts.totalOptions} crops, vegetables, fruits, spices, and commercial agricultural commodities
                </p>
              </div>
              <button
                onClick={() => setIsBrowseModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-700 cursor-pointer shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Search & Filters */}
            <div className="p-3 sm:p-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700 flex flex-wrap items-center gap-3">
              <div className="flex-1 min-w-[220px] relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search in full commodity universe..."
                  className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold focus:outline-hidden"
                />
              </div>

              <div className="flex items-center gap-1 overflow-x-auto max-w-full pb-1">
                {categoryTabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveCategoryTab(tab.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap cursor-pointer ${
                      activeCategoryTab === tab.id
                        ? 'bg-emerald-700 text-white'
                        : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {tab.label} ({tab.count})
                  </button>
                ))}
              </div>
            </div>

            {/* Modal Table / List with responsive container */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
                <table className="w-full min-w-[650px] text-left text-xs border-collapse">
                  <thead className="bg-slate-50 dark:bg-slate-800">
                    <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px]">
                      <th className="py-2.5 pl-3 w-16">Select</th>
                      <th className="py-2.5 px-3">Crop / Commodity</th>
                      <th className="py-2.5 px-3">Category</th>
                      <th className="py-2.5 px-3">Official / Botanical Name</th>
                      <th className="py-2.5 px-3">Season</th>
                      <th className="py-2.5 px-3">Market Data Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {searchResults.map(({ crop, marketInfo }) => {
                      const isSelected = selectedCropIds.includes(crop.cropId);
                      return (
                        <tr key={crop.cropId} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                          <td className="py-2.5 pl-3">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => onToggleCrop(crop.cropId)}
                              className="w-4 h-4 text-emerald-600 rounded cursor-pointer accent-emerald-600"
                            />
                          </td>
                          <td className="py-2.5 px-3 font-extrabold text-slate-900 dark:text-white">
                            {crop.cropName}
                          </td>
                          <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300">
                            {crop.category}
                          </td>
                          <td className="py-2.5 px-3 text-slate-500 font-mono text-[11px]">
                            {crop.scientificName || crop.cropName}
                          </td>
                          <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300">
                            {crop.season}
                          </td>
                          <td className="py-2.5 px-3">
                            {marketInfo.status === 'AVAILABLE' ? (
                              <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 text-[10px] font-bold">
                                AVAILABLE (₹{marketInfo.latestModalPrice}/Qtl)
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 text-[10px]">
                                PLANNING ONLY
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {selectedCropIds.length} commodities selected
                </span>
                {selectedCropIds.length > 0 && onClearAllCrops && (
                  <button
                    type="button"
                    onClick={onClearAllCrops}
                    className="text-xs font-semibold text-rose-600 hover:text-rose-700 underline cursor-pointer"
                  >
                    Clear Selection
                  </button>
                )}
              </div>
              <button
                onClick={() => setIsBrowseModalOpen(false)}
                className="px-5 py-2 rounded-xl bg-emerald-700 text-white font-bold text-xs cursor-pointer shadow-xs"
              >
                Done ({selectedCropIds.length} Selected)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ZERO-FABRICATION GUARANTEE & PROVENANCE FOOTER */}
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            <strong>Zero-Fabrication Mandate:</strong> Master data synchronized directly from ICAR Packages of Practices, National Horticulture Board (NHB), Spices Board, and AGMARKNET Daily Bulletins.
          </span>
        </div>
        <div className="font-mono text-[10px] text-slate-400">
          DATASET: FARMFIT-CROP-MASTER-2026.08
        </div>
      </div>
    </div>
  );
};
