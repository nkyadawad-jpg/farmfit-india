import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, 
  Layers, 
  MapPin, 
  Wheat, 
  Building2, 
  Globe2, 
  Scale, 
  Database, 
  ExternalLink, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Info, 
  Search, 
  BarChart3, 
  ArrowUpRight, 
  ArrowDownRight, 
  RefreshCw,
  ShoppingBag,
  ArrowRight,
  Sparkles,
  Calendar,
  Clock,
  PieChart as PieChartIcon,
  Filter,
  FileText
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';
import { Language, FarmLocation, CropMasterRecord } from '../types';
import { 
  filterProductionRecords, 
  calculateProductionTrend, 
  calculateCropSpecialization, 
  calculateDistrictCropSpecialization,
  calculateProductionConcentration, 
  calculateDistrictConcentration,
  calculateTradeImpact, 
  getSupplyBalance, 
  assessDataConfidence,
  getAvailableProductionYears,
  getAvailableProductionStates,
  getAvailableProductionDistricts,
  calculateHarvestWindow
} from '../services/supplyDemandEngine';
import { 
  DOMESTIC_CONSUMPTION_RECORDS, 
  AGRICULTURAL_TRADE_RECORDS, 
  AGRICULTURAL_DATA_REGISTRY,
  OFFICIAL_PRODUCTION_RECORDS,
  DEMAND_RECORDS
} from '../data/indiaAgriculturalSupplyData';
import { COMPLETE_INDIA_CROP_MASTER, ALL_CROP_CATEGORIES } from '../data/cropMasterIndex';

interface SupplyDemandViewProps {
  farmerLocation?: FarmLocation;
  selectedCropId?: string;
  onSelectCrop?: (cropId: string) => void;
  language: Language;
  initialTab?: 'production' | 'state_profile' | 'district_profile' | 'consumption' | 'imports' | 'exports' | 'supply_balance';
  plantingDate?: string;
  cropDurationDays?: number;
  landAreaAcres?: number;
  irrigationType?: string;
}

export const SupplyDemandView: React.FC<SupplyDemandViewProps> = ({
  farmerLocation,
  selectedCropId = 'soybean',
  onSelectCrop,
  language,
  initialTab = 'production',
  plantingDate,
  cropDurationDays,
  landAreaAcres,
  irrigationType
}) => {
  const [activeTab, setActiveTab] = useState<'production' | 'state_profile' | 'district_profile' | 'consumption' | 'imports' | 'exports' | 'supply_balance'>(initialTab);
  
  // Filters
  const [selectedCrop, setSelectedCrop] = useState<string>(selectedCropId || 'soybean');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedState, setSelectedState] = useState<string>(farmerLocation?.state || 'All India');
  const [selectedDistrict, setSelectedDistrict] = useState<string>(farmerLocation?.district || 'ALL');
  const [selectedSeason, setSelectedSeason] = useState<string>('ALL');
  const [selectedYear, setSelectedYear] = useState<string>('2023-24');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Sowing / Harvest Date Simulation
  const [customPlantingDate, setCustomPlantingDate] = useState<string>(plantingDate || new Date().toISOString().split('T')[0]);

  const availableYears = useMemo(() => getAvailableProductionYears(), []);
  const availableStates = useMemo(() => ['All India', ...getAvailableProductionStates()], []);
  const availableDistricts = useMemo(() => {
    if (!selectedState || selectedState === 'All India') return [];
    return getAvailableProductionDistricts(selectedState);
  }, [selectedState]);

  // Sync state if farmer location changes
  React.useEffect(() => {
    if (farmerLocation?.state && selectedState === 'All India') {
      setSelectedState(farmerLocation.state);
    }
    if (farmerLocation?.district && selectedDistrict === 'ALL') {
      setSelectedDistrict(farmerLocation.district);
    }
  }, [farmerLocation]);

  // Sync selected crop if external prop changes
  React.useEffect(() => {
    if (selectedCropId && selectedCropId !== selectedCrop) {
      setSelectedCrop(selectedCropId);
    }
  }, [selectedCropId]);

  // Current crop metadata
  const currentCropMeta = useMemo(() => {
    const found = COMPLETE_INDIA_CROP_MASTER.find(c => c.cropId === selectedCrop);
    if (found) {
      const minDays = found.durationRangeDays?.min || found.typicalDurationDays || 90;
      const maxDays = found.durationRangeDays?.max || found.typicalDurationDays || 120;
      return {
        cropId: found.cropId,
        name: found.cropName,
        hindiName: found.localNames?.hi || '',
        category: found.category,
        season: found.season,
        durationDaysMin: minDays,
        durationDaysMax: maxDays
      };
    }
    return {
      cropId: selectedCrop,
      name: selectedCrop.charAt(0).toUpperCase() + selectedCrop.slice(1),
      hindiName: '',
      category: 'Field Crops',
      season: 'Kharif',
      durationDaysMin: 90,
      durationDaysMax: 120
    };
  }, [selectedCrop]);

  // Expected Harvest Window
  const harvestWindow = useMemo(() => {
    const duration = cropDurationDays || 
      (currentCropMeta ? Math.round((currentCropMeta.durationDaysMin + currentCropMeta.durationDaysMax) / 2) : 100);
    return calculateHarvestWindow(selectedCrop, customPlantingDate, duration);
  }, [selectedCrop, customPlantingDate, cropDurationDays, currentCropMeta]);

  // Filtered production records
  const filteredRecords = useMemo(() => {
    return filterProductionRecords({
      cropId: selectedCrop,
      category: selectedCategory !== 'ALL' ? selectedCategory : undefined,
      state: selectedState !== 'ALL' ? selectedState : undefined,
      district: selectedDistrict !== 'ALL' ? selectedDistrict : undefined,
      season: selectedSeason !== 'ALL' ? selectedSeason : undefined,
      year: selectedYear !== 'ALL' ? selectedYear : undefined
    });
  }, [selectedCrop, selectedCategory, selectedState, selectedDistrict, selectedSeason, selectedYear]);

  // National record for selected crop & year
  const nationalRecord = useMemo(() => {
    return OFFICIAL_PRODUCTION_RECORDS.find(r => 
      r.cropId === selectedCrop && 
      r.state === 'All India' && 
      r.year === selectedYear
    );
  }, [selectedCrop, selectedYear]);

  // State record for selected state & crop & year
  const stateRecord = useMemo(() => {
    if (selectedState === 'All India') return null;
    return OFFICIAL_PRODUCTION_RECORDS.find(r => 
      r.cropId === selectedCrop && 
      r.state.toLowerCase() === selectedState.toLowerCase() && 
      r.district === 'ALL' &&
      r.year === selectedYear
    );
  }, [selectedCrop, selectedState, selectedYear]);

  // District record for selected district & crop & year
  const districtRecord = useMemo(() => {
    if (selectedDistrict === 'ALL' || selectedState === 'All India') return null;
    return OFFICIAL_PRODUCTION_RECORDS.find(r => 
      r.cropId === selectedCrop && 
      r.state.toLowerCase() === selectedState.toLowerCase() && 
      r.district.toLowerCase() === selectedDistrict.toLowerCase() &&
      r.year === selectedYear
    );
  }, [selectedCrop, selectedState, selectedDistrict, selectedYear]);

  // Production Trend (State vs National)
  const trendAnalysis = useMemo(() => {
    return calculateProductionTrend(selectedCrop, selectedState);
  }, [selectedCrop, selectedState]);

  // State Specialization
  const stateSpecializations = useMemo(() => {
    const targetState = selectedState !== 'All India' 
      ? selectedState 
      : (farmerLocation?.state || getAvailableProductionStates()[0] || 'Madhya Pradesh');
    return calculateCropSpecialization(targetState, selectedYear);
  }, [selectedState, farmerLocation, selectedYear]);

  // District Specialization
  const districtSpecializations = useMemo(() => {
    const targetState = selectedState !== 'All India' 
      ? selectedState 
      : (farmerLocation?.state || getAvailableProductionStates()[0] || 'Madhya Pradesh');
    const targetDistrict = selectedDistrict !== 'ALL' 
      ? selectedDistrict 
      : (farmerLocation?.district || (getAvailableProductionDistricts(targetState)[0] || ''));
    if (!targetDistrict) return [];
    return calculateDistrictCropSpecialization(targetState, targetDistrict, selectedYear);
  }, [selectedState, selectedDistrict, farmerLocation, selectedYear]);

  // Production Concentration (State shares)
  const productionConcentration = useMemo(() => {
    return calculateProductionConcentration(selectedCrop, selectedYear);
  }, [selectedCrop, selectedYear]);

  // District Concentration within State
  const districtConcentration = useMemo(() => {
    if (!selectedState || selectedState === 'All India') return [];
    return calculateDistrictConcentration(selectedCrop, selectedState, selectedYear);
  }, [selectedCrop, selectedState, selectedYear]);

  // Trade Impact
  const tradeImpact = useMemo(() => {
    return calculateTradeImpact(selectedCrop, selectedYear);
  }, [selectedCrop, selectedYear]);

  // Domestic Consumption
  const consumptionRecord = useMemo(() => {
    return DOMESTIC_CONSUMPTION_RECORDS.find(c => c.cropId === selectedCrop && c.year === selectedYear) ||
           DOMESTIC_CONSUMPTION_RECORDS.find(c => c.cropId === selectedCrop);
  }, [selectedCrop, selectedYear]);

  // Demand records
  const cropDemandRecords = useMemo(() => {
    return DEMAND_RECORDS.filter(d => d.cropId === selectedCrop);
  }, [selectedCrop]);

  // Trade Records
  const exportRecords = useMemo(() => {
    return AGRICULTURAL_TRADE_RECORDS.filter(t => t.cropId === selectedCrop && t.tradeType === 'EXPORT');
  }, [selectedCrop]);

  const importRecords = useMemo(() => {
    return AGRICULTURAL_TRADE_RECORDS.filter(t => t.cropId === selectedCrop && t.tradeType === 'IMPORT');
  }, [selectedCrop]);

  // Supply Balance
  const supplyBalance = useMemo(() => {
    return getSupplyBalance(selectedCrop, selectedYear);
  }, [selectedCrop, selectedYear]);

  return (
    <div id="supply-demand-intelligence-page" className="space-y-6 pb-20">
      {/* Top Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-emerald-800/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <TrendingUp className="w-64 h-64 text-emerald-300" />
        </div>

        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <Database className="w-3.5 h-3.5" />
                <span>DES MoA&FW &bull; MoSPI &bull; APEDA Benchmark Layer</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-slate-800/80 text-slate-300 border border-slate-700">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span>Zero Fabricated Data</span>
              </span>
            </div>

            {farmerLocation && (
              <div className="flex items-center gap-2 text-xs bg-emerald-900/60 px-3 py-1.5 rounded-xl border border-emerald-700/50">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-slate-300">Farm Location:</span>
                <span className="font-bold text-emerald-200">{farmerLocation.district}, {farmerLocation.state}</span>
              </div>
            )}
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-3">
              <span>{language === 'en' ? 'Supply & Demand Intelligence Engine' : 'कृषि आपूर्ति, उत्पादन एवं मांग इंटेलिजेंस'}</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-4xl mt-1.5 leading-relaxed">
              Official statutory statistics on India-wide crop production, sown area, yields, state & district specialization, MoSPI household consumption benchmarks, and APEDA foreign trade balances.
            </p>
          </div>

          {/* Harvest Period Key Foundation Card */}
          <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/30 backdrop-blur-md space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-200">
                  Harvest Period Foundation Key ({currentCropMeta.name})
                </span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                DATA FOUNDATION KEY
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              <div className="bg-slate-900/70 p-2.5 rounded-xl border border-emerald-900/50">
                <span className="text-slate-400 text-[11px] block">Proposed Planting Date</span>
                <input
                  type="date"
                  value={customPlantingDate}
                  onChange={(e) => setCustomPlantingDate(e.target.value)}
                  className="mt-1 w-full bg-slate-800 text-white font-bold px-2 py-1 rounded-lg text-xs border border-slate-700 focus:ring-1 focus:ring-emerald-500 cursor-pointer"
                />
              </div>

              <div className="bg-slate-900/70 p-2.5 rounded-xl border border-emerald-900/50">
                <span className="text-slate-400 text-[11px] block">Crop Duration</span>
                <span className="text-base font-extrabold text-white block mt-1">
                  ~{harvestWindow.durationDays} Days
                </span>
                <span className="text-[10px] text-slate-400">{currentCropMeta.season} crop cycle</span>
              </div>

              <div className="bg-slate-900/70 p-2.5 rounded-xl border border-emerald-900/50">
                <span className="text-slate-400 text-[11px] block">Expected Harvest Window</span>
                <span className="text-base font-extrabold text-emerald-300 block mt-1">
                  {harvestWindow.harvestWindowStart} &ndash; {harvestWindow.harvestWindowEnd}
                </span>
                <span className="text-[10px] text-emerald-400 font-medium">{harvestWindow.harvestSeason}</span>
              </div>

              <div className="bg-slate-900/70 p-2.5 rounded-xl border border-emerald-900/50">
                <span className="text-slate-400 text-[11px] block">Expected Harvest Month</span>
                <span className="text-base font-extrabold text-white block mt-1">
                  {harvestWindow.harvestMonth}
                </span>
                <span className="text-[10px] text-slate-400">Chronological Anchor</span>
              </div>
            </div>

            <p className="text-[11px] text-emerald-200/80 leading-normal pt-1">
              <em>Note: This chronologically links your planting date to expected harvest window. Price or demand forecasting is not yet applied; this establishes the precise time-window foundation for future market arrival models.</em>
            </p>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="bg-slate-800/60 backdrop-blur-md rounded-xl p-3 border border-slate-700/60">
              <div className="text-[11px] font-medium text-slate-400">All-India Production ({currentCropMeta.name})</div>
              <div className="text-lg font-black text-white mt-0.5">
                {nationalRecord?.production !== null && nationalRecord?.production !== undefined
                  ? `${nationalRecord.production.toLocaleString()} ${nationalRecord.productionUnit}`
                  : 'DATA UNAVAILABLE'}
              </div>
              <div className="text-[10px] text-emerald-400 font-medium">
                {nationalRecord?.dataStatus || 'DES APY Benchmark'}
              </div>
            </div>

            <div className="bg-slate-800/60 backdrop-blur-md rounded-xl p-3 border border-slate-700/60">
              <div className="text-[11px] font-medium text-slate-400">National Area Sown</div>
              <div className="text-lg font-black text-white mt-0.5">
                {nationalRecord?.area !== null && nationalRecord?.area !== undefined
                  ? `${nationalRecord.area.toLocaleString()} ${nationalRecord.areaUnit}`
                  : 'DATA UNAVAILABLE'}
              </div>
              <div className="text-[10px] text-slate-400">
                {selectedYear} Final / 4th Advance Series
              </div>
            </div>

            <div className="bg-slate-800/60 backdrop-blur-md rounded-xl p-3 border border-slate-700/60">
              <div className="text-[11px] font-medium text-slate-400">Average National Yield</div>
              <div className="text-lg font-black text-emerald-300 mt-0.5">
                {nationalRecord?.yield !== null && nationalRecord?.yield !== undefined
                  ? `${nationalRecord.yield.toLocaleString()} ${nationalRecord.yieldUnit}`
                  : 'DATA UNAVAILABLE'}
              </div>
              <div className="text-[10px] text-slate-400">
                Crop Cutting Experiments (CCE)
              </div>
            </div>

            <div className="bg-slate-800/60 backdrop-blur-md rounded-xl p-3 border border-slate-700/60">
              <div className="text-[11px] font-medium text-slate-400">Trade Orientation</div>
              <div className="text-lg font-black text-white mt-0.5 truncate">
                {tradeImpact.tradeExposureLevel}
              </div>
              <div className="text-[10px] text-slate-300 truncate">
                {tradeImpact.label}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Controls & Filters */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Wheat className="w-5 h-5 text-emerald-600" />
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              {language === 'en' ? 'Crop & Geography Filter Engine' : 'फसल एवं क्षेत्र चयन'}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Data Confidence:</span>
            <span className={`px-2.5 py-0.5 rounded-md text-xs font-bold ${
              assessDataConfidence(nationalRecord) === 'HIGH'
                ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                : assessDataConfidence(nationalRecord) === 'MEDIUM'
                ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}>
              {assessDataConfidence(nationalRecord)}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
          {/* Crop Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Select Crop / फसल
            </label>
            <select
              value={selectedCrop}
              onChange={(e) => {
                setSelectedCrop(e.target.value);
                if (onSelectCrop) onSelectCrop(e.target.value);
              }}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 cursor-pointer"
            >
              <option value="soybean">Soybean (सोयाबीन)</option>
              <option value="wheat">Wheat (गेहूं)</option>
              <option value="paddy">Paddy / Rice (धान)</option>
              <option value="cotton">Cotton (कपास)</option>
              <option value="gram">Gram / Chickpea (चना)</option>
              <option value="mustard">Mustard & Rapeseed (सरसों)</option>
              <option value="onion">Onion (प्याज)</option>
              <option value="potato">Potato (आलू)</option>
              <option value="tomato">Tomato (टमाटर)</option>
              <option value="maize">Maize (मक्का)</option>
              <option value="sugarcane">Sugarcane (गन्ना)</option>
              <option value="tur">Tur / Arhar (अरहर)</option>
              <option value="chilli">Chilli (मिर्च)</option>
            </select>
          </div>

          {/* State Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              State / राज्य
            </label>
            <select
              value={selectedState}
              onChange={(e) => {
                setSelectedState(e.target.value);
                setSelectedDistrict('ALL');
              }}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 cursor-pointer"
            >
              {availableStates.map(st => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>

          {/* District Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              District / जिला
            </label>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 cursor-pointer"
            >
              <option value="ALL">All Districts (सभी जिले)</option>
              {availableDistricts.map(dist => (
                <option key={dist} value={dist}>{dist}</option>
              ))}
            </select>
          </div>

          {/* Year Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Statistical Year / वर्ष
            </label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 cursor-pointer"
            >
              {availableYears.map(yr => (
                <option key={yr} value={yr}>{yr} {yr === '2023-24' ? '(Latest Final / 4th Est.)' : ''}</option>
              ))}
            </select>
          </div>

          {/* Season Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Season / मौसम
            </label>
            <select
              value={selectedSeason}
              onChange={(e) => setSelectedSeason(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 cursor-pointer"
            >
              <option value="ALL">All Seasons / Total</option>
              <option value="Kharif">Kharif</option>
              <option value="Rabi">Rabi</option>
              <option value="Zaid">Zaid</option>
              <option value="Whole Year">Whole Year</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-slate-200 dark:border-slate-800 no-scrollbar">
        {[
          { id: 'production', label: language === 'en' ? '1. Production' : '1. उत्पादन', icon: TrendingUp },
          { id: 'state_profile', label: language === 'en' ? '2. State Production' : '2. राज्य उत्पादन', icon: Building2 },
          { id: 'district_profile', label: language === 'en' ? '3. District Production' : '3. जिला उत्पादन', icon: MapPin },
          { id: 'consumption', label: language === 'en' ? '4. Consumption' : '4. घरेलू उपभोग', icon: ShoppingBag },
          { id: 'imports', label: language === 'en' ? '5. Imports' : '5. आयात', icon: Globe2 },
          { id: 'exports', label: language === 'en' ? '6. Exports' : '6. निर्यात', icon: ArrowUpRight },
          { id: 'supply_balance', label: language === 'en' ? '7. Supply Balance' : '7. आपूर्ति संतुलन', icon: Scale }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-emerald-600'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: PRODUCTION DASHBOARD                                              */}
      {/* ========================================================================= */}
      {activeTab === 'production' && (
        <div className="space-y-6">
          {/* APY Cards: India vs State vs District */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* India Card */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  National Benchmark
                </span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                  All India
                </span>
              </div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                {currentCropMeta.name} Production
              </h3>
              
              {nationalRecord ? (
                <div className="space-y-2 pt-1 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500">Total Output:</span>
                    <span className="font-bold text-slate-900 dark:text-white">{nationalRecord.production} {nationalRecord.productionUnit}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500">Cultivated Area:</span>
                    <span className="font-bold text-slate-900 dark:text-white">{nationalRecord.area} {nationalRecord.areaUnit}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500">Average Yield:</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">{nationalRecord.yield} {nationalRecord.yieldUnit}</span>
                  </div>
                  <div className="text-[10px] text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                    <span>Source: {nationalRecord.sourceName}</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">{nationalRecord.dataQuality || 'OFFICIAL — FINAL'}</span>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl text-center text-xs text-slate-500">
                  DATA UNAVAILABLE for {selectedCrop} in {selectedYear}
                </div>
              )}
            </div>

            {/* State Card */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  State Production
                </span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300">
                  {selectedState}
                </span>
              </div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                {selectedState !== 'All India' ? `${selectedState} Output` : 'Select a State'}
              </h3>

              {stateRecord ? (
                <div className="space-y-2 pt-1 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500">State Output:</span>
                    <span className="font-bold text-slate-900 dark:text-white">{stateRecord.production} {stateRecord.productionUnit}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500">State Sown Area:</span>
                    <span className="font-bold text-slate-900 dark:text-white">{stateRecord.area} {stateRecord.areaUnit}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500">State Yield:</span>
                    <span className="font-bold text-blue-600 dark:text-blue-400">{stateRecord.yield} {stateRecord.yieldUnit}</span>
                  </div>
                  {nationalRecord?.production && stateRecord.production && (
                    <div className="flex justify-between items-center text-xs pt-1">
                      <span className="text-slate-500">National Share:</span>
                      <span className="font-bold text-emerald-600">
                        {((stateRecord.production / nationalRecord.production) * 100).toFixed(1)}% of India
                      </span>
                    </div>
                  )}
                  <div className="text-[10px] text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                    <span>Source: {stateRecord.sourceName}</span>
                    <span className="font-bold text-blue-600 dark:text-blue-400">{stateRecord.dataQuality || 'OFFICIAL — FINAL'}</span>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl text-center text-xs text-slate-500">
                  {selectedState === 'All India' 
                    ? 'Select a specific state in the filter above to inspect state-level APY records' 
                    : `DATA UNAVAILABLE for ${selectedCrop} in ${selectedState}`}
                </div>
              )}
            </div>

            {/* District Card */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  District Resolution
                </span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300">
                  {selectedDistrict !== 'ALL' ? selectedDistrict : 'District Level'}
                </span>
              </div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                {selectedDistrict !== 'ALL' ? `${selectedDistrict} Local APY` : 'Local District Sowing'}
              </h3>

              {districtRecord ? (
                <div className="space-y-2 pt-1 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500">District Output:</span>
                    <span className="font-bold text-slate-900 dark:text-white">{districtRecord.production} {districtRecord.productionUnit}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500">District Area:</span>
                    <span className="font-bold text-slate-900 dark:text-white">{districtRecord.area} {districtRecord.areaUnit}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500">District Yield:</span>
                    <span className="font-bold text-purple-600 dark:text-purple-400">{districtRecord.yield} {districtRecord.yieldUnit}</span>
                  </div>
                  <div className="text-[10px] text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                    <span>Source: {districtRecord.sourceName}</span>
                    <span className="font-bold text-purple-600 dark:text-purple-400">{districtRecord.dataQuality || 'OFFICIAL — FINAL'}</span>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl text-center text-xs text-slate-500">
                  {selectedDistrict === 'ALL'
                    ? 'Select a specific district in the filter to inspect micro-regional harvest data'
                    : `DATA UNAVAILABLE for ${selectedCrop} in ${selectedDistrict} district`}
                </div>
              )}
            </div>
          </div>

          {/* Historical Trend Chart & CAGR Engine */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-emerald-600" />
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Historical Production & Yield Trend — {currentCropMeta.name} ({trendAnalysis.geography})
                  </h3>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Official historical series from Directorate of Economics & Statistics (DES)
                </p>
              </div>

              {/* Statistical CAGR Metrics */}
              {trendAnalysis.hasFiveYearTrend && (
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  {trendAnalysis.cagrStatisticallyAppropriate && trendAnalysis.fiveYearProductionCagrPercent !== null ? (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold border border-emerald-200 dark:border-emerald-800">
                      <span>5-Yr Production CAGR:</span>
                      <span>{trendAnalysis.fiveYearProductionCagrPercent > 0 ? `+${trendAnalysis.fiveYearProductionCagrPercent}%` : `${trendAnalysis.fiveYearProductionCagrPercent}%`}</span>
                    </span>
                  ) : (
                    <span className="text-[11px] text-slate-400">
                      CAGR not applicable (insufficient observations)
                    </span>
                  )}
                  {trendAnalysis.fiveYearProductionGrowthPercent !== null && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-800 dark:text-blue-300 font-bold border border-blue-200 dark:border-blue-800">
                      <span>5-Yr Total Growth:</span>
                      <span>{trendAnalysis.fiveYearProductionGrowthPercent > 0 ? `+${trendAnalysis.fiveYearProductionGrowthPercent}%` : `${trendAnalysis.fiveYearProductionGrowthPercent}%`}</span>
                    </span>
                  )}
                </div>
              )}
            </div>

            {trendAnalysis.points.length > 0 ? (
              <div className="h-72 w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendAnalysis.points} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="prodColor" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#059669" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#059669" stopOpacity={0.0}/>
                      </linearGradient>
                      <linearGradient id="areaColor" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                    <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                    />
                    <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                    <Area type="monotone" dataKey="production" name="Production (Lakh MT)" stroke="#059669" strokeWidth={2.5} fillOpacity={1} fill="url(#prodColor)" />
                    <Area type="monotone" dataKey="area" name="Cultivated Area (Lakh Ha)" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#areaColor)" />
                    <Line type="monotone" dataKey="yield" name="Yield (kg/Ha)" stroke="#f59e0b" strokeWidth={2} dot={{ r: 4 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="py-12 text-center text-xs text-slate-500 bg-slate-50 dark:bg-slate-800 rounded-xl">
                DATA UNAVAILABLE: No continuous historical time-series registered for {currentCropMeta.name} in {trendAnalysis.geography}.
              </div>
            )}
          </div>

          {/* Production Concentration Chart: State Shares */}
          {productionConcentration.length > 0 && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <PieChartIcon className="w-5 h-5 text-emerald-600" />
                    <span>Production Concentration — Major Producing States ({currentCropMeta.name})</span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Percentage share of national harvest ({selectedYear} official APY)
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
                <div className="lg:col-span-2 h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={productionConcentration} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                      <XAxis type="number" unit="%" tick={{ fontSize: 11 }} />
                      <YAxis dataKey="state" type="category" tick={{ fontSize: 11 }} width={100} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                        formatter={(val: any) => [`${val}%`, 'National Share']}
                      />
                      <Bar dataKey="sharePercent" name="National Share %" fill="#059669" radius={[0, 6, 6, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="space-y-2 border-t lg:border-t-0 lg:border-l border-slate-100 dark:border-slate-800 lg:pl-6">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">State Ranking</span>
                  {productionConcentration.map((item, idx) => (
                    <div key={item.state} className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 flex items-center justify-center font-bold text-[10px]">
                          {idx + 1}
                        </span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{item.state}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-slate-900 dark:text-white">{item.sharePercent}%</span>
                        <span className="text-[10px] text-slate-400 block">{item.production} {item.productionUnit}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Filtered Records Table */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-600" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Official Sowing & APY Records (Filter Matches: {filteredRecords.length})
                </h3>
              </div>
              <span className="text-xs text-slate-400">DES APY Gazette Series</span>
            </div>

            {filteredRecords.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 uppercase font-bold text-[10px] border-b border-slate-200 dark:border-slate-700">
                    <tr>
                      <th className="py-2.5 px-3">Crop</th>
                      <th className="py-2.5 px-3">State / District</th>
                      <th className="py-2.5 px-3">Season</th>
                      <th className="py-2.5 px-3">Year</th>
                      <th className="py-2.5 px-3">Area</th>
                      <th className="py-2.5 px-3">Production</th>
                      <th className="py-2.5 px-3">Yield</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3">Data Quality</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {filteredRecords.map((r) => (
                      <tr key={r.recordId} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                        <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-white">
                          {r.cropName}
                        </td>
                        <td className="py-2.5 px-3 text-slate-700 dark:text-slate-300">
                          {r.state} {r.district !== 'ALL' ? `(${r.district})` : ''}
                        </td>
                        <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400">
                          {r.season}
                        </td>
                        <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400 font-medium">
                          {r.year}
                        </td>
                        <td className="py-2.5 px-3 text-slate-800 dark:text-slate-200">
                          {r.area !== null ? `${r.area} ${r.areaUnit}` : 'DATA UNAVAILABLE'}
                        </td>
                        <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-white">
                          {r.production !== null ? `${r.production} ${r.productionUnit}` : 'DATA UNAVAILABLE'}
                        </td>
                        <td className="py-2.5 px-3 font-semibold text-emerald-600 dark:text-emerald-400">
                          {r.yield !== null ? `${r.yield} ${r.yieldUnit}` : 'DATA UNAVAILABLE'}
                        </td>
                        <td className="py-2.5 px-3">
                          <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                            {r.dataStatus}
                          </span>
                        </td>
                        <td className="py-2.5 px-3">
                          <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                            {r.dataQuality || 'OFFICIAL — FINAL'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-8 text-center text-xs text-slate-500 bg-slate-50 dark:bg-slate-800 rounded-xl">
                DATA UNAVAILABLE: No records match the active filter combination. Adjust state, district, or year filters.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: STATE SPECIALIZATION PROFILE                                       */}
      {/* ========================================================================= */}
      {activeTab === 'state_profile' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-emerald-600" />
                  <span>State Crop Specialization — {selectedState === 'All India' ? 'Madhya Pradesh' : selectedState}</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Relative agronomic importance calculated from official DES production and sown area data
                </p>
              </div>

              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                <Info className="w-3.5 h-3.5" />
                <span>FARMFIT DERIVED INDICATOR</span>
              </span>
            </div>

            {stateSpecializations.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 uppercase font-bold text-[11px] border-b border-slate-200 dark:border-slate-700">
                    <tr>
                      <th className="py-3 px-4">State Rank</th>
                      <th className="py-3 px-4">Crop</th>
                      <th className="py-3 px-4">Specialization Classification</th>
                      <th className="py-3 px-4">State Production</th>
                      <th className="py-3 px-4">State Output Share</th>
                      <th className="py-3 px-4">All-India Harvest Share</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {stateSpecializations.map((spec) => (
                      <tr key={spec.cropId} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                        <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                          #{spec.stateRank}
                        </td>
                        <td className="py-3 px-4 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                          <Wheat className="w-4 h-4 text-emerald-600" />
                          <span>{spec.cropName}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2.5 py-0.5 rounded-full font-bold text-[11px] ${
                            spec.classification === 'Major Crop'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : spec.classification === 'Secondary Crop'
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                              : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          }`}>
                            {spec.classification}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-semibold text-slate-800 dark:text-slate-200">
                          {spec.productionVolume} {spec.productionUnit}
                        </td>
                        <td className="py-3 px-4 font-semibold text-slate-800 dark:text-slate-200">
                          {spec.productionShareOfStatePercent !== null ? `${spec.productionShareOfStatePercent}%` : 'N/A'}
                        </td>
                        <td className="py-3 px-4 font-bold text-emerald-700 dark:text-emerald-400">
                          {spec.nationalProductionSharePercent !== null ? `${spec.nationalProductionSharePercent}% of India` : 'N/A'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-12 text-center text-xs text-slate-500 bg-slate-50 dark:bg-slate-800 rounded-xl">
                DATA UNAVAILABLE: No state crop records found for {selectedState}. Select another state in the filter above.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: DISTRICT PRODUCTION PROFILE                                       */}
      {/* ========================================================================= */}
      {activeTab === 'district_profile' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-emerald-600" />
                  <span>District Agricultural Production Profile — {selectedDistrict !== 'ALL' ? selectedDistrict : (selectedState !== 'All India' ? selectedState : (farmerLocation?.district ? `${farmerLocation.district}, ${farmerLocation.state}` : 'State & District View'))}</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Micro-regional Area, Production & Yield (APY) datasets from State Directorate of Agriculture / DES
                </p>
              </div>
            </div>

            {districtRecord ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <span className="text-xs text-slate-500">District Production Volume</span>
                  <div className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
                    {districtRecord.production} {districtRecord.productionUnit}
                  </div>
                  <span className="text-[11px] text-slate-400">{districtRecord.cropName} ({districtRecord.season})</span>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <span className="text-xs text-slate-500">District Sown Area</span>
                  <div className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
                    {districtRecord.area} {districtRecord.areaUnit}
                  </div>
                  <span className="text-[11px] text-slate-400">Total reported parcel coverage</span>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <span className="text-xs text-slate-500">District Average Yield</span>
                  <div className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
                    {districtRecord.yield} {districtRecord.yieldUnit}
                  </div>
                  <span className="text-[11px] text-slate-400">
                    {stateRecord?.yield ? `State Avg: ${stateRecord.yield} kg/Ha` : 'District benchmark'}
                  </span>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center bg-slate-50 dark:bg-slate-800 rounded-xl space-y-2">
                <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto" />
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">District Sowing Record Note</h4>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  {selectedDistrict === 'ALL'
                    ? 'Please select a specific district in the filter to inspect micro-level APY statistics.'
                    : `District-level crop cutting experiment data for ${selectedCrop} in ${selectedDistrict} has not been published in the central gazette yet.`}
                </p>
              </div>
            )}

            {/* District Specialization Table */}
            {districtSpecializations.length > 0 && (
              <div className="pt-4 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                  District Crop Specialization ({selectedDistrict !== 'ALL' ? selectedDistrict : (farmerLocation?.district || 'District View')})
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 uppercase font-bold text-[10px]">
                      <tr>
                        <th className="py-2.5 px-3">District Rank</th>
                        <th className="py-2.5 px-3">Crop</th>
                        <th className="py-2.5 px-3">District Production</th>
                        <th className="py-2.5 px-3">Classification</th>
                        <th className="py-2.5 px-3">Share of State Output</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {districtSpecializations.map((ds) => (
                        <tr key={ds.cropId} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                          <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-white">
                            #{ds.stateRank}
                          </td>
                          <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-white">
                            {ds.cropName}
                          </td>
                          <td className="py-2.5 px-3 font-semibold text-slate-800 dark:text-slate-200">
                            {ds.productionVolume} {ds.productionUnit}
                          </td>
                          <td className="py-2.5 px-3">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                              {ds.classification}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 font-bold text-emerald-600 dark:text-emerald-400">
                            {ds.productionShareOfStatePercent !== null ? `${ds.productionShareOfStatePercent}%` : 'N/A'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: DOMESTIC CONSUMPTION FOUNDATION                                    */}
      {/* ========================================================================= */}
      {activeTab === 'consumption' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-emerald-600" />
                  <span>MoSPI Household Consumption Expenditure Survey (HCES) & Domestic Demand</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Representative National Sample Survey benchmark of monthly household food quantities
                </p>
              </div>

              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                <Info className="w-3.5 h-3.5" />
                <span>HOUSEHOLD CONSUMPTION INDICATOR</span>
              </span>
            </div>

            {/* Crucial Context Banner */}
            <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
              <strong>Important Statistical Protocol:</strong> Household consumption expenditure survey (HCES) figures represent direct surveyed household table intake. They are <em>not</em> directly equal to total national commodity demand because they do not include seed retention, livestock feed, industrial processing, hotel/catering services, or transit loss.
            </div>

            {consumptionRecord ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <span className="text-xs text-slate-500">Annualized Household Volume</span>
                  <div className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
                    {consumptionRecord.annualizedHouseholdDemandLakhTonnes || consumptionRecord.quantity} {consumptionRecord.unit}
                  </div>
                  <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                    {consumptionRecord.commodity} Household Indicator
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <span className="text-xs text-slate-500">Rural Per-Capita Intake</span>
                  <div className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
                    {consumptionRecord.monthlyPerCapitaKgRural ? `${consumptionRecord.monthlyPerCapitaKgRural} kg` : 'DATA UNAVAILABLE'}
                  </div>
                  <span className="text-[11px] text-slate-400">per person / month</span>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <span className="text-xs text-slate-500">Urban Per-Capita Intake</span>
                  <div className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
                    {consumptionRecord.monthlyPerCapitaKgUrban ? `${consumptionRecord.monthlyPerCapitaKgUrban} kg` : 'DATA UNAVAILABLE'}
                  </div>
                  <span className="text-[11px] text-slate-400">per person / month</span>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-xs text-slate-500 bg-slate-50 dark:bg-slate-800 rounded-xl">
                DATA UNAVAILABLE: No specific MoSPI consumption survey benchmark logged for {selectedCrop}.
              </div>
            )}

            {/* Demand Breakdown Table */}
            {cropDemandRecords.length > 0 && (
              <div className="pt-4 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                  Sectoral Demand Breakdown ({currentCropMeta.name})
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 uppercase font-bold text-[10px]">
                      <tr>
                        <th className="py-2.5 px-3">Demand Type</th>
                        <th className="py-2.5 px-3">Volume</th>
                        <th className="py-2.5 px-3">Methodology / Source</th>
                        <th className="py-2.5 px-3">Estimate Type</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {cropDemandRecords.map(d => (
                        <tr key={d.demandId}>
                          <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-white">
                            {d.demandType}
                          </td>
                          <td className="py-2.5 px-3 font-semibold text-slate-800 dark:text-slate-200">
                            {d.quantity} {d.unit}
                          </td>
                          <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400">
                            {d.methodology} ({d.source})
                          </td>
                          <td className="py-2.5 px-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              d.isModelEstimate 
                                ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' 
                                : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            }`}>
                              {d.isModelEstimate ? 'MODEL_ESTIMATE' : 'OFFICIAL_SURVEY'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: IMPORTS                                                            */}
      {/* ========================================================================= */}
      {activeTab === 'imports' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Globe2 className="w-5 h-5 text-emerald-600" />
                  <span>Agricultural Imports & Tariff Protection</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Official trade statistics from APEDA AgriXchange and Directorate General of Commercial Intelligence & Statistics (DGCIS)
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-500">Import Dependence:</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {tradeImpact.importDependencePercent !== null ? `${tradeImpact.importDependencePercent}%` : 'Negligible / Zero'}
                </span>
              </div>
            </div>

            {importRecords.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 uppercase font-bold text-[11px] border-b border-slate-200 dark:border-slate-700">
                    <tr>
                      <th className="py-3 px-4">Commodity</th>
                      <th className="py-3 px-4">Import Volume</th>
                      <th className="py-3 px-4">Monetary Value (₹ Cr)</th>
                      <th className="py-3 px-4">Key Origin Countries</th>
                      <th className="py-3 px-4">Tariff / Policy Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {importRecords.map(t => (
                      <tr key={t.tradeId} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                        <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                          {t.commodityName}
                        </td>
                        <td className="py-3 px-4 font-bold text-blue-600 dark:text-blue-400">
                          {t.quantity} {t.quantityUnit}
                        </td>
                        <td className="py-3 px-4 font-semibold text-slate-800 dark:text-slate-200">
                          ₹{t.value?.toLocaleString()} Cr
                        </td>
                        <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                          {t.country}
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                            {t.tariffOrPolicyStatus || 'Statutory tariff order'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-12 text-center text-xs text-slate-500 bg-slate-50 dark:bg-slate-800 rounded-xl space-y-1">
                <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto" />
                <div className="font-bold text-slate-800 dark:text-slate-200">Self-Sufficient / Minimal Import Exposure</div>
                <div>India does not maintain significant commercial imports of {currentCropMeta.name}.</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 6: EXPORTS                                                            */}
      {/* ========================================================================= */}
      {activeTab === 'exports' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <ArrowUpRight className="w-5 h-5 text-emerald-600" />
                  <span>Agricultural Export Intelligence (APEDA / DGCIS)</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Shipment volumes, foreign currency realization, export duty & minimum export price (MEP) orders
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-500">Export Dependence:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  {tradeImpact.exportDependencePercent !== null ? `${tradeImpact.exportDependencePercent}%` : 'Minimal'}
                </span>
              </div>
            </div>

            {exportRecords.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 uppercase font-bold text-[11px] border-b border-slate-200 dark:border-slate-700">
                    <tr>
                      <th className="py-3 px-4">Commodity</th>
                      <th className="py-3 px-4">Export Volume</th>
                      <th className="py-3 px-4">Export Value (₹ Cr)</th>
                      <th className="py-3 px-4">Key Export Destinations</th>
                      <th className="py-3 px-4">Trade Policy Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {exportRecords.map(t => (
                      <tr key={t.tradeId} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                        <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                          {t.commodityName}
                        </td>
                        <td className="py-3 px-4 font-bold text-emerald-600 dark:text-emerald-400">
                          {t.quantity} {t.quantityUnit}
                        </td>
                        <td className="py-3 px-4 font-semibold text-slate-800 dark:text-slate-200">
                          ₹{t.value?.toLocaleString()} Cr
                        </td>
                        <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                          {t.country}
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                            {t.tariffOrPolicyStatus || 'Export permitted'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-12 text-center text-xs text-slate-500 bg-slate-50 dark:bg-slate-800 rounded-xl">
                DATA UNAVAILABLE: No significant official export volumes recorded for {currentCropMeta.name} in {selectedYear}.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 7: SUPPLY BALANCE & AVAILABILITY                                      */}
      {/* ========================================================================= */}
      {activeTab === 'supply_balance' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Scale className="w-5 h-5 text-emerald-600" />
                  <span>National Supply-Demand Balance & Indicative Availability</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Production vs Consumption vs Trade Balances (DES MoA&FW / CACP / FCI)
                </p>
              </div>

              {supplyBalance && (
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                  supplyBalance.isComplete
                    ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                    : 'bg-amber-50 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-300 dark:border-amber-800'
                }`}>
                  {supplyBalance.statusMessage}
                </span>
              )}
            </div>

            {supplyBalance ? (
              <div className="space-y-4">
                {/* Completeness / Incomplete Warning */}
                {!supplyBalance.isComplete && (
                  <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 space-y-2">
                    <div className="flex items-center gap-2 font-bold">
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                      <span>Supply Balance Incomplete — Missing Official Components:</span>
                    </div>
                    <ul className="list-disc list-inside space-y-1 pl-1">
                      {supplyBalance.missingComponents.map((item, idx) => (
                        <li key={idx}><span className="font-semibold">{item}</span> (unmonitored or not published in central gazette)</li>
                      ))}
                    </ul>
                    <p className="pt-1 text-[11px] text-amber-800 dark:text-amber-300">
                      <em>Rule: Never calculate an official national surplus/deficit unless all statutory balance sheet components exist. Indicative supply numbers below reflect individual verified datasets.</em>
                    </p>
                  </div>
                )}

                {/* Balance Sheet Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <span className="text-[11px] text-slate-500 font-medium">1. Domestic Production</span>
                    <div className="text-lg font-black text-slate-900 dark:text-white mt-0.5">
                      {supplyBalance.production !== null ? `${supplyBalance.production} L MT` : 'DATA UNAVAILABLE'}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <span className="text-[11px] text-slate-500 font-medium">2. Official Imports</span>
                    <div className="text-lg font-black text-blue-600 dark:text-blue-400 mt-0.5">
                      {supplyBalance.imports !== null ? `${supplyBalance.imports} L MT` : '0.00 L MT'}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <span className="text-[11px] text-slate-500 font-medium">3. Official Exports</span>
                    <div className="text-lg font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
                      {supplyBalance.exports !== null ? `${supplyBalance.exports} L MT` : '0.00 L MT'}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <span className="text-[11px] text-slate-500 font-medium">4. Domestic Consumption</span>
                    <div className="text-lg font-black text-slate-900 dark:text-white mt-0.5">
                      {supplyBalance.domesticConsumption !== null ? `${supplyBalance.domesticConsumption} L MT` : 'DATA UNAVAILABLE'}
                    </div>
                  </div>
                </div>

                {/* Indicative Note */}
                {supplyBalance.indicativeSurplusDeficitNote && (
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 space-y-1">
                    <span className="font-bold text-slate-900 dark:text-white block">Indicative Supply Outlook:</span>
                    <p className="leading-relaxed">{supplyBalance.indicativeSurplusDeficitNote}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-12 text-center text-xs text-slate-500 bg-slate-50 dark:bg-slate-800 rounded-xl">
                DATA UNAVAILABLE: No formal supply-demand balance record available for {selectedCrop} in {selectedYear}.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STATUTORY DATA SOURCES REGISTRY & PROVENANCE                              */}
      {/* ========================================================================= */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              {language === 'en' ? 'Official Data Source Registry & Verification' : 'आधिकारिक डेटा स्रोत एवं पारदर्शिता'}
            </h3>
          </div>
          <span className="text-xs text-slate-400">Government Open Data License (GODL)</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
          {AGRICULTURAL_DATA_REGISTRY.map((source) => (
            <div key={source.sourceId} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    {source.status}
                  </span>
                  <span className="text-[10px] text-slate-400">{source.frequency}</span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-snug">
                  {source.sourceName}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                  {source.datasetName}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <span className="text-[10px] text-slate-400">Retrieved: {source.lastRetrieved}</span>
                <a
                  href={source.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 hover:underline cursor-pointer"
                >
                  <span>VIEW SOURCE</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Decision Framing Notice */}
      <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 text-xs text-emerald-900 dark:text-emerald-200 flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold block">Current Supply & Historical Production Foundation</span>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">
            This module establishes statutory empirical baselines on domestic production, state specialization, household intake, and international trade. Prescriptive planting recommendations are integrated only after synchronizing local weather forecasts, harvest dates, mandi arrivals, and CACP MSP benchmarks.
          </p>
        </div>
      </div>
    </div>
  );
};
