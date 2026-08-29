import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  ALL_CANONICAL_COMMODITIES,
  searchCanonicalCommodities 
} from '../data/canonicalCommodityUniverse';
import { 
  ALL_INDIAN_STATES, 
  getDistrictsByState 
} from '../data/indiaAdminData';
import { CropSeason, Language } from '../types';
import { 
  MapPin, 
  Wheat, 
  Target, 
  Play, 
  Search, 
  X, 
  ChevronDown, 
  Sparkles, 
  Compass, 
  Users, 
  Building2, 
  Landmark,
  Calendar,
  Layers
} from 'lucide-react';

export interface GlobalIntelligenceContextBarProps {
  globalCommodity: string;
  setGlobalCommodity: (val: string) => void;
  globalState: string;
  setGlobalState: (val: string) => void;
  globalDistrict: string;
  setGlobalDistrict: (val: string) => void;
  globalRadius: number;
  setGlobalRadius: (val: number) => void;
  targetSeason?: CropSeason;
  setTargetSeason?: (season: CropSeason) => void;
  currentStakeholder?: string;
  onSelectStakeholder?: (stakeholder: string) => void;
  onRunIntelligence?: () => void;
  language?: Language;
}

export const GlobalIntelligenceContextBar: React.FC<GlobalIntelligenceContextBarProps> = ({
  globalCommodity,
  setGlobalCommodity,
  globalState,
  setGlobalState,
  globalDistrict,
  setGlobalDistrict,
  globalRadius,
  setGlobalRadius,
  targetSeason = 'Kharif',
  setTargetSeason,
  currentStakeholder = 'farmer',
  onSelectStakeholder,
  onRunIntelligence,
  language = 'en'
}) => {
  // Searchable Commodity Dropdown state
  const [isCommoditySearchOpen, setIsCommoditySearchOpen] = useState(false);
  const [commoditySearchQuery, setCommoditySearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('ALL');
  const commodityDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (commodityDropdownRef.current && !commodityDropdownRef.current.contains(event.target as Node)) {
        setIsCommoditySearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Dynamic States from authoritative dataset
  const stateOptions = useMemo(() => {
    return ALL_INDIAN_STATES.map(s => s.name).sort();
  }, []);

  // Dynamic Districts for selected State
  const districtOptions = useMemo(() => {
    const dList = getDistrictsByState(globalState);
    if (dList && dList.length > 0) {
      return dList.map(d => d.name).sort();
    }
    return ['All Districts'];
  }, [globalState]);

  // Handle State Change
  const handleStateChange = (newState: string) => {
    setGlobalState(newState);
    const newDistricts = getDistrictsByState(newState);
    if (newDistricts && newDistricts.length > 0) {
      setGlobalDistrict(newDistricts[0].name);
    }
  };

  // Canonical selected commodity details
  const currentCommodityObj = useMemo(() => {
    return ALL_CANONICAL_COMMODITIES.find(c => c.cropCommodityId === globalCommodity) ||
      ALL_CANONICAL_COMMODITIES[0];
  }, [globalCommodity]);

  // Search Results across full canonical commodity universe
  const searchedCommodities = useMemo(() => {
    return searchCanonicalCommodities(
      commoditySearchQuery,
      selectedCategoryFilter === 'ALL' ? undefined : selectedCategoryFilter
    );
  }, [commoditySearchQuery, selectedCategoryFilter]);

  // All unique commodity categories
  const categories = useMemo(() => {
    const cats = Array.from(new Set(ALL_CANONICAL_COMMODITIES.map(c => c.commodityGroup || c.category)));
    return ['ALL', ...cats];
  }, []);

  const stakeholders = [
    { id: 'farmer', label: 'Farmer', icon: Compass },
    { id: 'fpo', label: 'FPO', icon: Users },
    { id: 'b2b', label: 'B2B Procurement', icon: Building2 },
    { id: 'government', label: 'Government', icon: Landmark }
  ];

  return (
    <div className="bg-slate-950 text-white border-b border-slate-800 shadow-md sticky top-[62px] z-30 font-sans">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
        
        {/* Left Section: Geography & Commodity Pickers */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 flex-1 min-w-[280px]">
          
          {/* Location Group */}
          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 shadow-inner">
            <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider hidden md:inline">Region:</span>
            
            {/* State Selector */}
            <select
              value={globalState}
              onChange={(e) => handleStateChange(e.target.value)}
              className="bg-transparent text-slate-100 font-semibold text-xs outline-none cursor-pointer focus:text-emerald-300 max-w-[110px] sm:max-w-[140px] truncate"
              title="Select Indian State"
            >
              {stateOptions.map((st) => (
                <option key={st} value={st} className="bg-slate-900 text-white">
                  {st}
                </option>
              ))}
            </select>

            <span className="text-slate-600">/</span>

            {/* District Selector */}
            <select
              value={globalDistrict}
              onChange={(e) => setGlobalDistrict(e.target.value)}
              className="bg-transparent text-emerald-400 font-bold text-xs outline-none cursor-pointer focus:text-emerald-300 max-w-[110px] sm:max-w-[140px] truncate"
              title="Select District"
            >
              {districtOptions.map((dist) => (
                <option key={dist} value={dist} className="bg-slate-900 text-white">
                  {dist}
                </option>
              ))}
            </select>
          </div>

          {/* Searchable Commodity Group */}
          <div className="relative" ref={commodityDropdownRef}>
            <button
              type="button"
              onClick={() => setIsCommoditySearchOpen(!isCommoditySearchOpen)}
              className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/50 rounded-xl px-3 py-1.5 transition-colors cursor-pointer shadow-inner"
              title="Search and select agricultural commodity"
            >
              <Wheat className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider hidden lg:inline">Crop:</span>
              <span className="font-bold text-white max-w-[130px] sm:max-w-[160px] truncate">
                {currentCommodityObj.displayName}
              </span>
              <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${isCommoditySearchOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Search Dropdown Dialog */}
            {isCommoditySearchOpen && (
              <div className="absolute left-0 mt-2 w-80 sm:w-96 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl z-50 p-3 animate-in fade-in zoom-in-95 duration-150">
                {/* Search Header */}
                <div className="relative mb-2">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={commoditySearchQuery}
                    onChange={(e) => setCommoditySearchQuery(e.target.value)}
                    placeholder="Search by English, Hindi (Gajar, Pyaz), or Aliases..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-8 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-emerald-500"
                    autoFocus
                  />
                  {commoditySearchQuery && (
                    <button
                      onClick={() => setCommoditySearchQuery('')}
                      className="absolute right-2.5 top-2.5 text-slate-400 hover:text-white"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Category Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-2 scrollbar-none">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategoryFilter(cat)}
                      className={`px-2 py-0.5 rounded-lg text-[10px] font-bold whitespace-nowrap transition-colors ${
                        selectedCategoryFilter === cat
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Results List */}
                <div className="max-h-60 overflow-y-auto space-y-1 pr-1">
                  {searchedCommodities.length > 0 ? (
                    searchedCommodities.map((crop) => {
                      const isSelected = crop.cropCommodityId === globalCommodity;
                      return (
                        <button
                          key={crop.cropCommodityId}
                          onClick={() => {
                            setGlobalCommodity(crop.cropCommodityId);
                            setIsCommoditySearchOpen(false);
                          }}
                          className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-colors cursor-pointer ${
                            isSelected
                              ? 'bg-emerald-950/80 border border-emerald-500/60 text-emerald-200'
                              : 'hover:bg-slate-800/80 text-slate-300'
                          }`}
                        >
                          <div>
                            <div className="font-bold text-xs text-white flex items-center gap-1.5">
                              <span>{crop.displayName}</span>
                              {crop.localNames?.hi && (
                                <span className="text-[10px] font-normal text-slate-400">({crop.localNames.hi})</span>
                              )}
                            </div>
                            <div className="text-[10px] text-slate-500">
                              {crop.commodityGroup || crop.category} &bull; {crop.officialCommodityName || 'Canonical'}
                            </div>
                          </div>
                          {isSelected && (
                            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-900/60 px-1.5 py-0.5 rounded">
                              Active
                            </span>
                          )}
                        </button>
                      );
                    })
                  ) : (
                    <div className="p-4 text-center text-slate-500 text-xs">
                      No commodities matched "{commoditySearchQuery}". Try search alias e.g. Gajar, Pyaz, Aloo, Mirchi.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Season / Period Selector */}
          {setTargetSeason && (
            <div className="hidden sm:flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 shadow-inner">
              <Calendar className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <select
                value={targetSeason}
                onChange={(e) => setTargetSeason(e.target.value as CropSeason)}
                className="bg-transparent text-slate-200 font-semibold text-xs outline-none cursor-pointer focus:text-blue-300"
                title="Target Crop Season"
              >
                <option value="Kharif" className="bg-slate-900 text-white">Kharif (Monsoon)</option>
                <option value="Rabi" className="bg-slate-900 text-white">Rabi (Winter)</option>
                <option value="Zaid" className="bg-slate-900 text-white">Zaid (Summer)</option>
                <option value="Annual" className="bg-slate-900 text-white">Annual / Perennial</option>
              </select>
            </div>
          )}

          {/* Radius Selector */}
          <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 shadow-inner">
            <Target className="w-3.5 h-3.5 text-purple-400 shrink-0" />
            <select
              value={globalRadius}
              onChange={(e) => setGlobalRadius(Number(e.target.value))}
              className="bg-transparent text-slate-200 font-semibold text-xs outline-none cursor-pointer focus:text-purple-300"
              title="Mandi Discovery Radius"
            >
              <option value={50} className="bg-slate-900 text-white">50 KM</option>
              <option value={100} className="bg-slate-900 text-white">100 KM</option>
              <option value={150} className="bg-slate-900 text-white">150 KM</option>
              <option value={200} className="bg-slate-900 text-white">200 KM</option>
              <option value={500} className="bg-slate-900 text-white">500 KM</option>
            </select>
          </div>
        </div>

        {/* Right Section: Stakeholder Mode Switcher + Run Intelligence CTA */}
        <div className="flex items-center gap-2 sm:gap-3 ml-auto">
          
          {/* Stakeholder Segmented Control (Desktop / Tablet) */}
          {onSelectStakeholder && (
            <div className="hidden xl:flex items-center bg-slate-900 border border-slate-800 rounded-xl p-0.5">
              {stakeholders.map((s) => {
                const Icon = s.icon;
                const isActive = currentStakeholder === s.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => onSelectStakeholder(s.id)}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-slate-800 text-emerald-400 shadow-xs'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                    }`}
                  >
                    <Icon className="w-3 h-3" />
                    <span>{s.label}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Universal Action Button */}
          {onRunIntelligence && (
            <button
              onClick={onRunIntelligence}
              className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 active:from-emerald-700 active:to-teal-700 text-white font-black px-3.5 py-1.5 rounded-xl shadow-md shadow-emerald-900/30 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer text-xs"
              title="Execute unified agricultural intelligence analysis for current context"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>RUN INTELLIGENCE</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
