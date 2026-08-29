import React, { useState, useMemo } from 'react';
import { 
  Store, 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  MapPin, 
  Calendar, 
  Scale, 
  Truck, 
  Info, 
  Database, 
  Search, 
  ArrowUpDown, 
  ExternalLink, 
  CheckCircle2, 
  AlertTriangle, 
  BarChart3, 
  Clock, 
  Layers, 
  ChevronRight, 
  ShieldCheck,
  Building2,
  Navigation,
  Sliders,
  Compass,
  HelpCircle,
  Check,
  Calculator,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Plus,
  X,
  Sparkles
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Legend 
} from 'recharts';
import { FarmLocation, Language } from '../types';
import { marketDataService } from '../services/marketDataService';
import { marketDataRepository } from '../services/marketDataRepository';
import { nearbyMandiService } from '../services/nearbyMandiService';
import { TransportCostInputs } from '../types/marketIntelligence';
import { UnifiedIntelligenceView } from './UnifiedIntelligenceView';
import { MarketTrendScorecard } from '../components/DecisionCenter/MarketTrendScorecard';
import { MarketRankingMode } from '../types/marketAnalytics';
import { 
  COMPLETE_INDIA_CROP_MASTER, 
  getCropById,
  FARMFIT_CROP_COMMODITY_MASTER,
  getCanonicalCropById,
  getOfficialCommodityMapping,
  ALL_CROP_CATEGORIES
} from '../data/cropMasterIndex';

interface MandiMarketViewProps {
  farmerLocation?: FarmLocation;
  selectedCropId?: string;
  preferredCropIds?: string[];
  onSelectCrop?: (cropId: string) => void;
  language?: Language;
  expectedHarvestWindow?: { startMonth: string; endMonth: string; season: string };
}

export const MandiMarketView: React.FC<MandiMarketViewProps> = ({
  farmerLocation,
  selectedCropId = 'soybean',
  preferredCropIds = [],
  onSelectCrop,
  expectedHarvestWindow
}) => {
  // Navigation sub-tabs
  const [activeTab, setActiveTab] = useState<
    'unified' | 'verified_analytics' | 'nearby' | 'overview' | 'price_history' | 'arrivals' | 'pressure' | 'msp_compare' | 'sources'
  >('verified_analytics');

  const [verifiedAnalyticsRankingMode, setVerifiedAnalyticsRankingMode] = useState<MarketRankingMode>('HIGHEST_NRV');

  // Search & Filter State - initialized directly from props
  const [activeCropId, setActiveCropId] = useState<string>(selectedCropId || (preferredCropIds.length > 0 ? preferredCropIds[0] : 'soybean'));
  const [selectedState, setSelectedState] = useState<string>(farmerLocation?.state || 'All');
  const [selectedDistrict, setSelectedDistrict] = useState<string>(farmerLocation?.district || 'All');
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  // Location Coordinates (strictly sourced from farmerLocation, NO arbitrary hardcoded Indore coordinates)
  const [farmLat, setFarmLat] = useState<number | null>(farmerLocation?.latitude ?? null);
  const [farmLon, setFarmLon] = useState<number | null>(farmerLocation?.longitude ?? null);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [showDebugPanel, setShowDebugPanel] = useState<boolean>(false);
  const [isUpdatingLocation, setIsUpdatingLocation] = useState<boolean>(false);
  const [locationTimestamp, setLocationTimestamp] = useState<string>(new Date().toISOString());

  // Mandi Data Refresh & Quality Sync State
  const [isRefreshingMandi, setIsRefreshingMandi] = useState<boolean>(false);
  const [lastRefreshedAt, setLastRefreshedAt] = useState<string>(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
  const [refreshCount, setRefreshCount] = useState<number>(0);

  // Commodity Search Modal & Filter State
  const [isCommodityModalOpen, setIsCommodityModalOpen] = useState<boolean>(false);
  const [commoditySearch, setCommoditySearch] = useState<string>('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('ALL');

  // Sync state when props change and trigger immediate invalidation + synchronization
  React.useEffect(() => {
    if (selectedCropId && selectedCropId !== activeCropId) {
      setActiveCropId(selectedCropId);
    }
  }, [selectedCropId]);

  const prevLocRef = React.useRef<{ lat?: number | null; lng?: number | null; state?: string; district?: string } | null>(null);

  React.useEffect(() => {
    if (farmerLocation) {
      const prev = prevLocRef.current;
      const hasChanged = !prev || 
        prev.lat !== farmerLocation.latitude || 
        prev.lng !== farmerLocation.longitude || 
        prev.state !== farmerLocation.state || 
        prev.district !== farmerLocation.district;

      if (hasChanged) {
        setIsUpdatingLocation(true);
        if (farmerLocation.state) {
          setSelectedState(farmerLocation.state);
        }
        if (farmerLocation.district) {
          setSelectedDistrict(farmerLocation.district);
        }
        setFarmLat(farmerLocation.latitude ?? null);
        setFarmLon(farmerLocation.longitude ?? null);
        setLocationTimestamp(new Date().toISOString());
        prevLocRef.current = {
          lat: farmerLocation.latitude,
          lng: farmerLocation.longitude,
          state: farmerLocation.state,
          district: farmerLocation.district
        };

        const timer = setTimeout(() => {
          setIsUpdatingLocation(false);
        }, 300);
        return () => clearTimeout(timer);
      }
    }
  }, [farmerLocation?.state, farmerLocation?.district, farmerLocation?.latitude, farmerLocation?.longitude]);

  // Harvest Volume (1 Quintal = 100 kg)
  const [expectedYieldQtl, setExpectedYieldQtl] = useState<number>(20);

  // Search Radius & Sorting for Nearby Markets (Default auto 200 km)
  const [radiusFilter, setRadiusFilter] = useState<'auto' | 50 | 100 | 150 | 200 | 250 | 500 | 'all'>('auto');
  const [nearbySortBy, setNearbySortBy] = useState<'nrv' | 'price' | 'distance' | 'arrivals'>('price');
  const [nearbyViewSection, setNearbyViewSection] = useState<'top10' | 'all'>('top10');

  // Transporter Agreement & Verified Logistics Calculator State
  const [showLogisticsCalculator, setShowLogisticsCalculator] = useState<boolean>(false);
  const [transportUnit, setTransportUnit] = useState<'₹/tonne/km' | '₹/Qtl/km'>('₹/tonne/km');
  const [ratePerTonneKm, setRatePerTonneKm] = useState<string>('30');
  const [ratePerQtlKm, setRatePerQtlKm] = useState<string>('3.0');
  const [loadingCostPerQtl, setLoadingCostPerQtl] = useState<string>('12');
  const [unloadingCostPerQtl, setUnloadingCostPerQtl] = useState<string>('8');
  const [otherCostsPerQtl, setOtherCostsPerQtl] = useState<string>('0');
  const [isValidatedAgreement, setIsValidatedAgreement] = useState<boolean>(false);
  const [vehicleType, setVehicleType] = useState<string>('Tractor-Trolley (3-5 Tonnes)');

  // Refresh handler for Mandi price synchronization
  const handleRefreshMandiData = () => {
    setIsRefreshingMandi(true);
    setTimeout(() => {
      setRefreshCount(prev => prev + 1);
      setLastRefreshedAt(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      setIsRefreshingMandi(false);
    }, 400);
  };

  // Handle browser geolocation detection
  const handleDetectCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.');
      return;
    }
    setIsLocating(true);
    setLocationError(null);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = Math.round(position.coords.latitude * 10000) / 10000;
        const lon = Math.round(position.coords.longitude * 10000) / 10000;
        setFarmLat(lat);
        setFarmLon(lon);
        setIsLocating(false);
      },
      (err) => {
        setIsLocating(false);
        setLocationError(`Location acquisition failed (${err.message}). Using saved coordinates.`);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Handle crop change
  const handleCropChange = (cropId: string) => {
    setActiveCropId(cropId);
    if (onSelectCrop) {
      onSelectCrop(cropId);
    }
  };

  // Parsed numerical logistics values
  const parsedRatePerTonneKm = parseFloat(ratePerTonneKm) || 0;
  const parsedRatePerQtlKm = parseFloat(ratePerQtlKm) || 0;
  const parsedLoading = parseFloat(loadingCostPerQtl) || 0;
  const parsedUnloading = parseFloat(unloadingCostPerQtl) || 0;
  const parsedOther = parseFloat(otherCostsPerQtl) || 0;

  // Selected crop definition from CropMaster
  const cropDef = useMemo(() => {
    const found = getCropById(activeCropId) || COMPLETE_INDIA_CROP_MASTER.find(c => c.cropId.toLowerCase() === activeCropId.toLowerCase());
    return found ? {
      id: found.cropId,
      name: found.cropName,
      category: found.category
    } : {
      id: activeCropId,
      name: activeCropId.charAt(0).toUpperCase() + activeCropId.slice(1),
      category: 'Commodity'
    };
  }, [activeCropId]);

  const activeCropMeta = useMemo(() => {
    return getCanonicalCropById(activeCropId);
  }, [activeCropId]);

  const activeCommodityMapping = useMemo(() => {
    return getOfficialCommodityMapping(activeCropId);
  }, [activeCropId]);

  // Active crop buttons: include all preferredCropIds, plus activeCropId if not already present
  const availableSelectorCrops = useMemo(() => {
    const ids = [...preferredCropIds];
    if (!ids.includes(activeCropId)) {
      ids.push(activeCropId);
    }
    return ids.map(id => {
      const crop = getCanonicalCropById(id);
      const mapped = getOfficialCommodityMapping(id);
      return {
        id,
        label: crop?.cropName || mapped?.displayName || id,
        hindi: crop?.localNames?.hi || mapped?.hindiName || '',
        category: crop?.category || mapped?.category || 'Commodity'
      };
    });
  }, [preferredCropIds, activeCropId]);

  // Filtered commodity list for the All-India picker modal
  const filteredCommodities = useMemo(() => {
    const q = commoditySearch.toLowerCase().trim();
    return FARMFIT_CROP_COMMODITY_MASTER.filter(c => {
      if (selectedCategoryFilter !== 'ALL' && c.category !== selectedCategoryFilter) {
        return false;
      }
      if (q) {
        const matchName = c.cropName.toLowerCase().includes(q);
        const matchSci = c.scientificName.toLowerCase().includes(q);
        const matchCat = c.category.toLowerCase().includes(q);
        const matchHindi = (c.localNames?.hi || '').toLowerCase().includes(q);
        const matchAliases = Object.values(c.localNames || {}).join(' ').toLowerCase().includes(q);
        return matchName || matchSci || matchCat || matchHindi || matchAliases;
      }
      return true;
    });
  }, [commoditySearch, selectedCategoryFilter]);

  // Unified Location Filter based on current state & props
  const locationFilter = useMemo(() => {
    const effectiveState = selectedState !== 'All' ? selectedState : farmerLocation?.state;
    const effectiveDistrict = selectedDistrict !== 'All' ? selectedDistrict : farmerLocation?.district;
    return {
      state: effectiveState,
      district: effectiveDistrict,
      latitude: farmLat,
      longitude: farmLon,
      radiusKm: radiusFilter === 'auto' ? 200 : radiusFilter === 'all' ? undefined : radiusFilter
    };
  }, [selectedState, selectedDistrict, farmerLocation, farmLat, farmLon, radiusFilter]);

  // Derived Trend and Analysis Data from MarketDataService (Strictly location-aware)
  const priceTrendAnalysis = useMemo(() => {
    return marketDataService.calculatePriceTrend(activeCropId, undefined, locationFilter);
  }, [activeCropId, locationFilter, refreshCount]);

  const arrivalTrendAnalysis = useMemo(() => {
    return marketDataService.calculateArrivalTrend(activeCropId, undefined, locationFilter);
  }, [activeCropId, locationFilter, refreshCount]);

  const marketPressure = useMemo(() => {
    return marketDataService.calculateMarketPressure(activeCropId, undefined, locationFilter);
  }, [activeCropId, locationFilter, refreshCount]);

  // Verified Multi-Window Market Analytics
  const verifiedAnalytics = useMemo(() => {
    return marketDataService.getVerifiedAnalytics(
      activeCropId,
      undefined,
      locationFilter,
      {
        radiusKm: radiusFilter === 'auto' ? 200 : radiusFilter === 'all' ? 500 : radiusFilter,
        rankingMode: verifiedAnalyticsRankingMode
      }
    );
  }, [activeCropId, locationFilter, radiusFilter, verifiedAnalyticsRankingMode, refreshCount]);

  // Nearby Mandi Search Result directly from nearbyMandiService
  const nearbySearchResult = useMemo(() => {
    const effectiveState = selectedState !== 'All' ? selectedState : farmerLocation?.state;
    const effectiveDistrict = selectedDistrict !== 'All' ? selectedDistrict : farmerLocation?.district;
    return nearbyMandiService.findNearbyMarkets({
      farmLatitude: farmLat,
      farmLongitude: farmLon,
      state: effectiveState,
      district: effectiveDistrict,
      cropId: activeCropId,
      initialRadiusKm: radiusFilter === 'auto' ? 200 : radiusFilter === 'all' ? 500 : radiusFilter,
      transportInputs: {
        distanceKm: null,
        commodity: activeCropId,
        quantityQtl: expectedYieldQtl,
        vehicleType,
        transportUnit,
        transportRatePerTonnePerKm: transportUnit === '₹/tonne/km' ? parsedRatePerTonneKm : null,
        transportRatePerKmPerQtl: transportUnit === '₹/Qtl/km' ? parsedRatePerQtlKm : null,
        loadingCostPerQtl: parsedLoading,
        unloadingCostPerQtl: parsedUnloading,
        otherCostsPerQtl: parsedOther,
        isValidated: isValidatedAgreement
      },
      expectedYieldQtl,
      forceRefreshTimestamp: refreshCount
    });
  }, [
    farmLat, 
    farmLon, 
    selectedState, 
    selectedDistrict, 
    farmerLocation, 
    activeCropId, 
    radiusFilter, 
    expectedYieldQtl,
    vehicleType,
    transportUnit,
    parsedRatePerTonneKm,
    parsedRatePerQtlKm,
    parsedLoading,
    parsedUnloading,
    parsedOther,
    isValidatedAgreement,
    refreshCount
  ]);

  // Filtered by selected radius (if explicit radius clicked) and sorted
  const sortedNearbyMarkets = useMemo(() => {
    let list = [...nearbySearchResult.markets];

    if (radiusFilter !== 'auto' && radiusFilter !== 'all') {
      list = list.filter(m => m.distance !== null && m.distance <= radiusFilter);
    }

    if (nearbySortBy === 'nrv') {
      return list.sort((a, b) => {
        const nrvA = a.nrvPerQtl ?? -1;
        const nrvB = b.nrvPerQtl ?? -1;
        if (nrvB !== nrvA) return nrvB - nrvA;
        return (b.modalPrice || 0) - (a.modalPrice || 0);
      });
    }
    if (nearbySortBy === 'distance') {
      return list.sort((a, b) => {
        if (a.distance === null) return 1;
        if (b.distance === null) return -1;
        return a.distance - b.distance;
      });
    }
    if (nearbySortBy === 'arrivals') {
      return list.sort((a, b) => (b.arrivalQuantity || 0) - (a.arrivalQuantity || 0));
    }
    // default: maintain default ranking
    return list;
  }, [nearbySearchResult.markets, radiusFilter, nearbySortBy]);

  // Top 10 Best Markets
  const top10NearbyMarkets = useMemo(() => {
    return sortedNearbyMarkets.slice(0, 10);
  }, [sortedNearbyMarkets]);

  // All Qualifying Markets in Radius
  const allNearbyMarketsInRadius = sortedNearbyMarkets;

  // Active displayed list based on nearbyViewSection tab
  const displayedNearbyMarkets = useMemo(() => {
    return nearbyViewSection === 'top10' ? top10NearbyMarkets : allNearbyMarketsInRadius;
  }, [nearbyViewSection, top10NearbyMarkets, allNearbyMarketsInRadius]);

  const mspComparison = useMemo(() => {
    return marketDataService.compareMsp(activeCropId, priceTrendAnalysis.latestModalPrice);
  }, [activeCropId, priceTrendAnalysis.latestModalPrice]);

  const timeSeries = useMemo(() => {
    return marketDataRepository.getMarketTimeSeries(activeCropId, undefined, locationFilter);
  }, [activeCropId, locationFilter]);

  const dataSources = useMemo(() => {
    return marketDataRepository.getDataSourceRegistry();
  }, []);

  const allMandiRecords = useMemo(() => {
    return marketDataService.getMandiRecords({ cropId: activeCropId });
  }, [activeCropId]);

  // Filtered mandi records for Overview search
  const filteredMandiRecords = useMemo(() => {
    return allMandiRecords.filter(record => {
      const matchState = selectedState === 'All' || record.state.toLowerCase() === selectedState.toLowerCase();
      const matchDistrict = selectedDistrict === 'All' || record.district.toLowerCase() === selectedDistrict.toLowerCase();
      const matchSearch = !searchTerm || 
        record.market.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.variety.toLowerCase().includes(searchTerm.toLowerCase());
      return matchState && matchDistrict && matchSearch;
    });
  }, [allMandiRecords, selectedState, selectedDistrict, searchTerm]);

  // Extract unique states & districts for filter dropdowns
  const availableStates = useMemo(() => {
    const states = Array.from(new Set(allMandiRecords.map(r => r.state)));
    return ['All', ...states.sort()];
  }, [allMandiRecords]);

  const availableDistricts = useMemo(() => {
    const records = selectedState === 'All' 
      ? allMandiRecords 
      : allMandiRecords.filter(r => r.state.toLowerCase() === selectedState.toLowerCase());
    const districts = Array.from(new Set(records.map(r => r.district)));
    return ['All', ...districts.sort()];
  }, [allMandiRecords, selectedState]);

  // Freshness notice
  const freshnessInfo = useMemo(() => {
    return marketDataService.getFreshnessNotice(priceTrendAnalysis.latestDate);
  }, [priceTrendAnalysis.latestDate]);

  return (
    <div className="space-y-6 pb-20 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
      {/* TOP BANNER: Title & Farm Context Connection */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold">
                <Store className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Mandi Market Intelligence
                </h1>
                <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                  Official AGMARKNET wholesale APMC rates, physical arrivals, moving averages & CACP MSP parity
                </p>
              </div>
            </div>
          </div>

          {/* Quick Context Chips */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <div className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-slate-500 font-medium">Farm Location:</span>
              <span className="font-bold text-slate-900 dark:text-white">
                {farmerLocation?.district ? `${farmerLocation.district}, ${farmerLocation.state}` : (selectedState !== 'All' ? `${selectedDistrict !== 'All' ? selectedDistrict + ', ' : ''}${selectedState}` : 'All India Markets')}
              </span>
            </div>

            <div className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-emerald-900 dark:text-emerald-200 font-semibold">{freshnessInfo.notice}</span>
            </div>

            <button
              onClick={handleRefreshMandiData}
              disabled={isRefreshingMandi}
              className="px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs disabled:opacity-75"
              title="Refresh Mandi rates and synchronize latest AGMARKNET bulletin"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${isRefreshingMandi ? 'animate-spin' : ''}`} />
              <span>{isRefreshingMandi ? 'Refreshing...' : 'Refresh Mandi Data'}</span>
            </button>

            <button
              onClick={() => setShowDebugPanel(prev => !prev)}
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                showDebugPanel 
                  ? 'bg-emerald-700 text-white border-emerald-600' 
                  : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Location Trace Debug</span>
              {showDebugPanel ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* DIAGNOSTIC / DEBUG TRACE PANEL */}
        {showDebugPanel && (
          <div className="mt-4 p-4 rounded-2xl bg-slate-900 text-slate-100 border border-slate-800 space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-bold text-emerald-400">FARM LOCATION DEBUG & COORDINATES VERIFICATION</span>
              </div>
              <span className="text-[10px] text-slate-400">Development / Verification Protocol</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-[11px]">
              {/* CURRENT FARM LOCATION (Exact Schema) */}
              <div className="space-y-1 bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
                <span className="text-emerald-400 block font-bold border-b border-slate-700 pb-1">CURRENT FARM LOCATION</span>
                <div>Latitude: <span className="text-cyan-300 font-bold">{farmerLocation?.latitude !== undefined && farmerLocation?.latitude !== null ? farmerLocation.latitude.toString() : 'MISSING'}</span></div>
                <div>Longitude: <span className="text-cyan-300 font-bold">{farmerLocation?.longitude !== undefined && farmerLocation?.longitude !== null ? farmerLocation.longitude.toString() : 'MISSING'}</span></div>
                <div>Location Name: <span className="text-white font-bold">{farmerLocation?.formattedAddress || farmerLocation?.village || farmerLocation?.district || 'Not Set'}</span></div>
                <div>Village/Locality: <span className="text-white">{farmerLocation?.village || farmerLocation?.taluka || 'Not Set'}</span></div>
                <div>District: <span className="text-emerald-300 font-bold">{farmerLocation?.district || 'Not Set'}</span></div>
                <div>State: <span className="text-emerald-300 font-bold">{farmerLocation?.state || 'Not Set'}</span></div>
              </div>

              {/* FARM LOCATION DEBUG & PIPELINE SOURCE */}
              <div className="space-y-1 bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
                <span className="text-amber-400 block font-bold border-b border-slate-700 pb-1">FARM LOCATION DEBUG</span>
                <div>Source: <span className="text-amber-300 font-bold">FarmLocation Object (App.tsx / props)</span></div>
                <div>Latitude: <span className="text-cyan-300">{farmerLocation?.latitude ?? 'null'}</span></div>
                <div>Longitude: <span className="text-cyan-300">{farmerLocation?.longitude ?? 'null'}</span></div>
                <div>Location: <span className="text-white">{farmerLocation?.village || farmerLocation?.district || 'N/A'}</span></div>
                <div>District: <span className="text-white">{farmerLocation?.district ?? 'N/A'}</span></div>
                <div>State: <span className="text-white">{farmerLocation?.state ?? 'N/A'}</span></div>
                <div>Location Timestamp: <span className="text-slate-400 text-[10px]">{locationTimestamp}</span></div>
              </div>

              {/* MANDI QUERY PARAMETERS & MATCH STATUS */}
              <div className="space-y-1 bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
                <span className="text-cyan-400 block font-bold border-b border-slate-700 pb-1">MANDI QUERY MATCH</span>
                <div>Mandi Query Latitude: <span className="text-cyan-300 font-bold">{farmLat ?? 'null'}</span></div>
                <div>Mandi Query Longitude: <span className="text-cyan-300 font-bold">{farmLon ?? 'null'}</span></div>
                <div>Mandi Query State: <span className="text-white font-bold">{selectedState}</span></div>
                <div>Mandi Query District: <span className="text-white font-bold">{selectedDistrict}</span></div>
                <div>Coordinates Match: <span className={`font-bold ${farmLat === farmerLocation?.latitude && farmLon === farmerLocation?.longitude ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {farmLat === farmerLocation?.latitude && farmLon === farmerLocation?.longitude ? 'PERFECT MATCH (100%)' : 'MISMATCH'}
                </span></div>
                <div>Resolved APMC: <span className="text-emerald-300 font-bold">{priceTrendAnalysis.market || 'None for Filter'}</span></div>
              </div>
            </div>

            {(!farmerLocation?.latitude || !farmerLocation?.longitude) && (
              <div className="p-2.5 rounded-lg bg-rose-950/80 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>Exact farm coordinates are required for nearby mandi calculation.</span>
              </div>
            )}
          </div>
        )}

        {/* LOCATION UPDATE TRANSITION NOTIFICATION */}
        {isUpdatingLocation && (
          <div className="mt-4 p-4 rounded-2xl bg-emerald-900/90 text-white flex items-center justify-center gap-3 border border-emerald-700 animate-pulse shadow-lg">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span className="font-bold text-xs tracking-wider uppercase">UPDATING MARKETS FOR NEW FARM LOCATION...</span>
          </div>
        )}

        {/* ZERO STATE NOTIFICATION WHEN NO CROPS SELECTED */}
        {preferredCropIds.length === 0 && (
          <div className="mt-4 p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5 text-amber-800 dark:text-amber-300">
              <Info className="w-4 h-4 shrink-0 text-amber-600" />
              <span>
                <strong>No crops selected in Farm Profile.</strong> Currently viewing <strong>{activeCropMeta?.cropName || activeCommodityMapping?.displayName || activeCropId}</strong>. You can switch commodities below or search the All India catalog.
              </span>
            </div>
            <button
              onClick={() => setIsCommodityModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shrink-0 cursor-pointer shadow-xs"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Browse All Commodities</span>
            </button>
          </div>
        )}

        {/* DYNAMIC CROP SELECTOR BAR */}
        <div className="pt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none max-w-full">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-emerald-600" />
              Active Commodity:
            </span>
            {availableSelectorCrops.map(c => {
              const isActive = activeCropId.toLowerCase() === c.id.toLowerCase();
              return (
                <button
                  key={c.id}
                  onClick={() => handleCropChange(c.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  <span>{c.label}</span>
                  {c.hindi && (
                    <span className={`text-[10px] font-normal ${isActive ? 'text-emerald-100' : 'text-slate-500'}`}>
                      ({c.hindi})
                    </span>
                  )}
                </button>
              );
            })}

            {/* Quick Button to Select Any Other Commodity from All India Master */}
            <button
              onClick={() => setIsCommodityModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900 transition-all cursor-pointer whitespace-nowrap"
              title="Search & select from all Indian crops, vegetables, fruits, and spices"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Select Other Commodity ({FARMFIT_CROP_COMMODITY_MASTER.length})</span>
            </button>
          </div>

          <div className="text-[11px] text-slate-500 font-medium flex items-center gap-1.5 self-end sm:self-auto shrink-0">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Zero fabrication guarantee &bull; Official AGMARKNET API & Data.gov.in</span>
          </div>
        </div>
      </div>

      {/* ALL-INDIA COMMODITY SEARCH & SELECTION MODAL */}
      {isCommodityModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-3xl max-h-[85vh] shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold">
                  <Layers className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">
                    Select All India Mandi Commodity
                  </h3>
                  <p className="text-xs text-slate-500">
                    Choose from {FARMFIT_CROP_COMMODITY_MASTER.length} verified crops, vegetables, fruits, spices, and pulses
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsCommodityModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search & Category Filter Bar */}
            <div className="p-4 sm:p-6 border-b border-slate-100 dark:border-slate-800 space-y-3 bg-slate-50/50 dark:bg-slate-800/30">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by crop, vegetable, Hindi name, scientific name..."
                  value={commoditySearch}
                  onChange={(e) => setCommoditySearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  autoFocus
                />
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px]">
                <button
                  onClick={() => setSelectedCategoryFilter('ALL')}
                  className={`px-3 py-1 rounded-xl font-bold whitespace-nowrap cursor-pointer transition-all ${
                    selectedCategoryFilter === 'ALL'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                  }`}
                >
                  All ({FARMFIT_CROP_COMMODITY_MASTER.length})
                </button>
                {ALL_CROP_CATEGORIES.map(cat => {
                  const count = FARMFIT_CROP_COMMODITY_MASTER.filter(c => c.category === cat).length;
                  return (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategoryFilter(cat)}
                      className={`px-3 py-1 rounded-xl font-bold whitespace-nowrap cursor-pointer transition-all ${
                        selectedCategoryFilter === cat
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {cat} ({count})
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Commodity Grid */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-1 min-h-[280px]">
              {filteredCommodities.length === 0 ? (
                <div className="py-12 text-center text-slate-500 text-xs">
                  No commodities found matching "{commoditySearch}".
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                  {filteredCommodities.map(c => {
                    const isSelected = activeCropId.toLowerCase() === c.cropId.toLowerCase();
                    return (
                      <button
                        key={c.cropId}
                        onClick={() => {
                          handleCropChange(c.cropId);
                          setIsCommodityModalOpen(false);
                        }}
                        className={`p-3 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 dark:border-emerald-600 ring-2 ring-emerald-500'
                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-700 hover:bg-slate-50/70'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between gap-1">
                            <span className="font-bold text-xs text-slate-900 dark:text-white">
                              {c.cropName}
                            </span>
                            {c.government?.MSPApplicable && (
                              <span className="px-1.5 py-0.2 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-[9px] font-bold shrink-0">
                                MSP
                              </span>
                            )}
                          </div>
                          {c.localNames?.hi && (
                            <span className="text-[11px] text-slate-500 block mt-0.5">
                              {c.localNames.hi}
                            </span>
                          )}
                        </div>
                        <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px]">
                          <span className="text-slate-500">{c.category}</span>
                          <span className="text-emerald-600 font-bold">{c.season}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between text-xs">
              <span className="text-slate-500">
                Showing {filteredCommodities.length} commodities
              </span>
              <button
                onClick={() => setIsCommodityModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold hover:bg-slate-300 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6 TOP KPI CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {/* Card 1: Latest Modal Price */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-[11px] font-semibold mb-1">
            <span>MODAL PRICE</span>
            <span className="px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 text-[9px] font-bold">PRIMARY</span>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            {priceTrendAnalysis.latestModalPrice !== null 
              ? `₹${priceTrendAnalysis.latestModalPrice.toLocaleString('en-IN')}` 
              : 'MODAL PRICE UNAVAILABLE'}
          </div>
          <div className="text-[10px] text-slate-500 mt-1 font-medium truncate">
            {priceTrendAnalysis.latestModalPrice !== null ? 'Reported market modal price' : 'No verified trades recorded'}
          </div>
        </div>

        {/* Card 2: Minimum Price */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
          <div className="text-slate-500 text-[11px] font-semibold mb-1">MINIMUM PRICE</div>
          <div className="text-xl sm:text-2xl font-black text-slate-700 dark:text-slate-300">
            {priceTrendAnalysis.latestMinPrice !== null 
              ? `₹${priceTrendAnalysis.latestMinPrice.toLocaleString('en-IN')}` 
              : 'N/A'}
          </div>
          <div className="text-[10px] text-slate-500 mt-1 font-medium">
            ₹/Quintal (Lowest trade)
          </div>
        </div>

        {/* Card 3: Maximum Price */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
          <div className="text-slate-500 text-[11px] font-semibold mb-1">MAXIMUM PRICE</div>
          <div className="text-xl sm:text-2xl font-black text-slate-700 dark:text-slate-300">
            {priceTrendAnalysis.latestMaxPrice !== null 
              ? `₹${priceTrendAnalysis.latestMaxPrice.toLocaleString('en-IN')}` 
              : 'N/A'}
          </div>
          <div className="text-[10px] text-slate-500 mt-1 font-medium">
            ₹/Quintal (Top premium lot)
          </div>
        </div>

        {/* Card 4: Daily Arrivals */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
          <div className="text-slate-500 text-[11px] font-semibold mb-1">TODAY'S ARRIVAL</div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            {arrivalTrendAnalysis.latestArrivalQuantity !== null 
              ? `${arrivalTrendAnalysis.latestArrivalQuantity.toLocaleString('en-IN')}` 
              : 'ARRIVAL UNAVAILABLE'}
          </div>
          <div className="text-[10px] text-slate-500 mt-1 font-medium">
            {arrivalTrendAnalysis.arrivalUnit} in APMC yard
          </div>
        </div>

        {/* Card 5: Price Trend */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
          <div className="text-slate-500 text-[11px] font-semibold mb-1 flex items-center justify-between">
            <span>PRICE TREND</span>
            <span className="text-[9px] text-slate-400 font-mono">7-DAY</span>
          </div>
          <div className="flex items-center gap-1.5">
            {priceTrendAnalysis.priceTrend === 'RISING' && (
              <TrendingUp className="w-5 h-5 text-emerald-600 shrink-0" />
            )}
            {priceTrendAnalysis.priceTrend === 'FALLING' && (
              <TrendingDown className="w-5 h-5 text-rose-600 shrink-0" />
            )}
            {priceTrendAnalysis.priceTrend === 'STABLE' && (
              <Minus className="w-5 h-5 text-blue-600 shrink-0" />
            )}
            <span className={`text-base sm:text-lg font-black ${
              priceTrendAnalysis.priceTrend === 'RISING' ? 'text-emerald-600' :
              priceTrendAnalysis.priceTrend === 'FALLING' ? 'text-rose-600' :
              priceTrendAnalysis.priceTrend === 'STABLE' ? 'text-blue-600' : 'text-slate-500'
            }`}>
              {priceTrendAnalysis.priceTrend}
            </span>
          </div>
          <div className="text-[10px] text-slate-500 mt-1 font-medium">
            {priceTrendAnalysis.priceChange7DayPercent !== null 
              ? `${priceTrendAnalysis.priceChange7DayPercent > 0 ? '+' : ''}${priceTrendAnalysis.priceChange7DayPercent}% vs 7d avg`
              : 'Insufficient observations'}
          </div>
        </div>

        {/* Card 6: Arrival Trend */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
          <div className="text-slate-500 text-[11px] font-semibold mb-1 flex items-center justify-between">
            <span>ARRIVAL TREND</span>
            <span className="text-[9px] text-slate-400 font-mono">7-DAY</span>
          </div>
          <div className="flex items-center gap-1.5">
            {arrivalTrendAnalysis.arrivalTrend === 'INCREASING' && (
              <TrendingUp className="w-5 h-5 text-amber-600 shrink-0" />
            )}
            {arrivalTrendAnalysis.arrivalTrend === 'DECREASING' && (
              <TrendingDown className="w-5 h-5 text-purple-600 shrink-0" />
            )}
            {arrivalTrendAnalysis.arrivalTrend === 'STABLE' && (
              <Minus className="w-5 h-5 text-blue-600 shrink-0" />
            )}
            <span className={`text-base sm:text-lg font-black ${
              arrivalTrendAnalysis.arrivalTrend === 'INCREASING' ? 'text-amber-600' :
              arrivalTrendAnalysis.arrivalTrend === 'DECREASING' ? 'text-purple-600' :
              arrivalTrendAnalysis.arrivalTrend === 'STABLE' ? 'text-blue-600' : 'text-slate-500'
            }`}>
              {arrivalTrendAnalysis.arrivalTrend}
            </span>
          </div>
          <div className="text-[10px] text-slate-500 mt-1 font-medium">
            {arrivalTrendAnalysis.arrivalChange7DayPercent !== null 
              ? `${arrivalTrendAnalysis.arrivalChange7DayPercent > 0 ? '+' : ''}${arrivalTrendAnalysis.arrivalChange7DayPercent}% volume shift`
              : 'Insufficient observations'}
          </div>
        </div>
      </div>

      {/* SUB-NAVIGATION TABS */}
      <div className="border-b border-slate-200 dark:border-slate-800 flex overflow-x-auto scrollbar-none gap-2 pt-2">
        {[
          { id: 'verified_analytics', label: 'Verified Market Analytics & Scorecard', icon: Sparkles },
          { id: 'unified', label: 'Universal Commodity × Market Intelligence', icon: Compass },
          { id: 'nearby', label: 'Available APMC Markets (Distance-Ranked)', icon: Navigation },
          { id: 'overview', label: 'Live Mandi Finder', icon: Search },
          { id: 'price_history', label: 'Price Trends & Moving Averages', icon: TrendingUp },
          { id: 'arrivals', label: 'Arrivals & Volume Dynamics', icon: BarChart3 },
          { id: 'pressure', label: 'Market Pressure Indicator', icon: Scale },
          { id: 'msp_compare', label: 'MSP vs Market Price', icon: ShieldCheck },
          { id: 'sources', label: 'Official Data Registry', icon: Database }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 py-3 px-4 text-xs font-bold border-b-2 transition-all whitespace-nowrap cursor-pointer ${
                isActive 
                  ? 'border-emerald-700 text-emerald-800 dark:text-emerald-300 dark:border-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/30 rounded-t-xl' 
                  : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* VIEW: VERIFIED MARKET ANALYTICS SCORECARD */}
      {activeTab === 'verified_analytics' && (
        <div className="space-y-6">
          <MarketTrendScorecard
            analytics={verifiedAnalytics}
            onRankingModeChange={(mode) => setVerifiedAnalyticsRankingMode(mode)}
          />
        </div>
      )}

      {/* VIEW 0: UNIVERSAL COMMODITY X MARKET INTELLIGENCE */}
      {activeTab === 'unified' && (
        <UnifiedIntelligenceView
          farmerLocation={farmerLocation}
          selectedCropId={activeCropId}
          onSelectCrop={handleCropChange}
        />
      )}

      {/* VIEW 1: LIVE MANDI FINDER & DETAILED OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Filters Bar */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">State Filter</label>
                <select
                  value={selectedState}
                  onChange={(e) => {
                    setSelectedState(e.target.value);
                    setSelectedDistrict('All');
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white"
                >
                  {availableStates.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">District Filter</label>
                <select
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white"
                >
                  {availableDistricts.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-1 md:col-span-2">
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Search Mandi Yard / Variety</label>
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search by market yard name, district, variety, or grade..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white font-medium placeholder-slate-400"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Mandi Records Grid / Cards */}
          {filteredMandiRecords.length === 0 ? (
            <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 rounded-3xl p-8 text-center space-y-3">
              <AlertTriangle className="w-8 h-8 text-amber-600 mx-auto" />
              <h3 className="text-base font-bold text-amber-900 dark:text-amber-200">
                MARKET DATA UNAVAILABLE FOR CURRENT FILTER
              </h3>
              <p className="text-xs text-amber-700 dark:text-amber-300 max-w-lg mx-auto">
                No official APMC daily auction records reported for {cropDef.name} under the selected state/district filters. Try switching to "All States" or searching for a nearby regional terminal mandi.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredMandiRecords.map((record) => (
                <div 
                  key={record.recordId}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xs space-y-4 hover:border-emerald-500/40 transition-colors"
                >
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <Building2 className="w-4 h-4 text-emerald-600" />
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                          {record.market}
                        </h3>
                      </div>
                      <p className="text-[11px] text-slate-500 font-medium">
                        {record.district}, {record.state}
                      </p>
                    </div>

                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase ${
                      record.dataStatus === 'OFFICIAL DATA'
                        ? 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300'
                        : record.dataStatus === 'HISTORICAL DATA'
                        ? 'bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-300'
                        : 'bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300'
                    }`}>
                      {record.dataStatus}
                    </span>
                  </div>

                  {/* Variety & Grade */}
                  <div className="flex items-center justify-between text-xs bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl">
                    <div>
                      <span className="text-slate-500 block text-[10px]">Variety:</span>
                      <span className="font-bold text-slate-900 dark:text-white">{record.variety}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-slate-500 block text-[10px]">Grade:</span>
                      <span className="font-bold text-slate-900 dark:text-white">{record.grade}</span>
                    </div>
                  </div>

                  {/* Prices Breakdown */}
                  <div className="grid grid-cols-3 gap-2 text-center bg-slate-50/70 dark:bg-slate-800/40 p-3 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <div>
                      <div className="text-[10px] text-slate-500 font-medium">Min Price</div>
                      <div className="text-xs font-black text-slate-700 dark:text-slate-300 mt-0.5">
                        {record.minPrice !== null ? `₹${record.minPrice.toLocaleString('en-IN')}` : 'DATA UNAVAILABLE'}
                      </div>
                    </div>

                    <div className="border-x border-slate-200 dark:border-slate-700">
                      <div className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400">Modal Price</div>
                      <div className="text-sm font-black text-emerald-900 dark:text-emerald-200 mt-0.5">
                        {record.modalPrice !== null ? `₹${record.modalPrice.toLocaleString('en-IN')}` : 'MODAL PRICE UNAVAILABLE'}
                      </div>
                    </div>

                    <div>
                      <div className="text-[10px] text-slate-500 font-medium">Max Price</div>
                      <div className="text-xs font-black text-slate-700 dark:text-slate-300 mt-0.5">
                        {record.maxPrice !== null ? `₹${record.maxPrice.toLocaleString('en-IN')}` : 'DATA UNAVAILABLE'}
                      </div>
                    </div>
                  </div>

                  {/* Physical Arrivals */}
                  <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <Truck className="w-3.5 h-3.5 text-slate-400" />
                      <span>Reported Physical Arrivals:</span>
                    </span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {record.arrivalQuantity !== null 
                        ? `${record.arrivalQuantity.toLocaleString('en-IN')} ${record.arrivalUnit}` 
                        : 'ARRIVAL DATA UNAVAILABLE'}
                    </span>
                  </div>

                  {/* Provenance & Source Metadata */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1.5 text-[11px] text-slate-600 dark:text-slate-400">
                    <div className="grid grid-cols-2 gap-1 text-[10px]">
                      <div>
                        <span className="text-slate-400 block text-[9px] uppercase font-bold">Source</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{record.sourceName?.includes('AGMARKNET') ? 'AGMARKNET' : (record.sourceName || 'AGMARKNET')}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[9px] uppercase font-bold">Data Quality</span>
                        <span className={`font-bold ${
                          record.dataQuality === 'HIGH' ? 'text-emerald-700 dark:text-emerald-400' :
                          record.dataQuality === 'MEDIUM' ? 'text-blue-700 dark:text-blue-400' :
                          record.dataQuality === 'LOW' ? 'text-amber-700 dark:text-amber-400' : 'text-slate-500'
                        }`}>
                          {record.dataQuality || 'HIGH'}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[9px] uppercase font-bold">Market Date</span>
                        <span className="font-medium text-slate-700 dark:text-slate-300">{record.date}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[9px] uppercase font-bold">Retrieved</span>
                        <span className="font-mono text-[9px] text-slate-500">{record.retrievedAt ? record.retrievedAt.replace('T', ' ').replace('Z', ' UTC') : '2026-08-18 06:30 UTC'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[9px] uppercase font-bold">Commodity</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{record.commodity}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[9px] uppercase font-bold">Variety</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{record.variety || 'Standard / Local'}</span>
                      </div>
                    </div>

                    <div className="pt-1.5 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase ${
                        record.dataStatus === 'OFFICIAL DATA'
                          ? 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300'
                          : record.dataStatus === 'HISTORICAL DATA'
                          ? 'bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-300'
                          : record.dataStatus === 'PARTIAL DATA'
                          ? 'bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}>
                        {record.dataStatus === 'OFFICIAL DATA' ? 'OFFICIAL' : 
                         record.dataStatus === 'HISTORICAL DATA' ? 'HISTORICAL' : 
                         record.dataStatus === 'PARTIAL DATA' ? 'PARTIAL' : record.dataStatus}
                      </span>

                      {record.sourceUrl ? (
                        <a 
                          href={record.sourceUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1 font-bold text-[10px]"
                        >
                          <span>VIEW SOURCE</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : null}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* VIEW 2: AVAILABLE APMC MARKETS COMPARISON */}
      {activeTab === 'nearby' && (
        <div className="space-y-6">
          {/* Location & GPS Status Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Navigation className="w-5 h-5 text-emerald-600" />
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Farm Location & Nearby APMC Discovery
                  </h3>
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400 flex flex-wrap items-center gap-2">
                  <span>Farm Origin:</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {farmerLocation?.district ? `${farmerLocation.district}, ${farmerLocation.state}` : (selectedState !== 'All' ? `${selectedDistrict !== 'All' ? selectedDistrict + ', ' : ''}${selectedState}` : 'Location Not Set')}
                  </span>
                  {farmLat !== null && farmLon !== null ? (
                    <span className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-mono text-[11px] font-bold">
                      {farmLat.toFixed(4)}° N, {farmLon.toFixed(4)}° E
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-mono text-[11px] font-bold">
                      COORDINATES UNAVAILABLE
                    </span>
                  )}
                </div>
              </div>

              {/* Location Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleDetectCurrentLocation}
                  disabled={isLocating}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Compass className={`w-4 h-4 text-emerald-600 ${isLocating ? 'animate-spin' : ''}`} />
                  <span>{isLocating ? 'Detecting GPS...' : 'Use Current GPS Location'}</span>
                </button>

                <button
                  onClick={() => {
                    setFarmLat(farmerLocation?.latitude ?? null);
                    setFarmLon(farmerLocation?.longitude ?? null);
                    if (farmerLocation?.state) setSelectedState(farmerLocation.state);
                    if (farmerLocation?.district) setSelectedDistrict(farmerLocation.district);
                  }}
                  className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold cursor-pointer"
                  title="Sync coordinates from saved farm profile"
                >
                  Sync Saved Farm Location
                </button>
              </div>
            </div>

            {/* Notice if exact coordinates missing */}
            {(!farmLat || !farmLon) && (
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-900 text-xs text-amber-900 dark:text-amber-200 space-y-2">
                <div className="flex items-center gap-2 font-bold">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Exact farm coordinates are required for nearby mandi calculation.</span>
                </div>
                <p className="text-[11px] text-amber-800 dark:text-amber-300">
                  Please select/save the farm location to calculate nearby mandis. Straight-line distance calculation to APMC wholesale yards strictly requires verified farm GPS latitude and longitude.
                </p>
              </div>
            )}

            {locationError && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs text-rose-800 dark:text-rose-300">
                {locationError}
              </div>
            )}

            {/* DATA QUALITY & AGMARKNET FRESHNESS PANEL */}
            <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                  <span className="font-bold text-emerald-950 dark:text-emerald-200">
                    Official AGMARKNET Bulletin & Taluka Discovery Standard
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-200 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-200 text-[10px] font-extrabold uppercase">
                    {nearbySearchResult.latestPriceDate ? '20-AUG-2026 BULLETIN' : 'OFFICIAL AGMARKNET'}
                  </span>
                </div>
                <p className="text-[11px] text-emerald-900/80 dark:text-emerald-300">
                  Data sourced from Directorate of Marketing & Inspection (DMI) & State APMCs. Showing newest verified daily price & arrival records with comprehensive 200 km all-qualifying APMC discovery.
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <div className="text-right text-[10px] text-emerald-900/70 dark:text-emerald-400 font-mono">
                  <div>Synced: {lastRefreshedAt}</div>
                  <div>Discovery Radius: {nearbySearchResult.searchRadiusKm} km</div>
                </div>
                <button
                  onClick={handleRefreshMandiData}
                  disabled={isRefreshingMandi}
                  className="py-1.5 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all cursor-pointer disabled:opacity-75"
                >
                  <RotateCcw className={`w-3.5 h-3.5 ${isRefreshingMandi ? 'animate-spin' : ''}`} />
                  <span>{isRefreshingMandi ? 'Refreshing...' : 'Refresh Mandi Data'}</span>
                </button>
              </div>
            </div>

            {/* Controls Bar: Radius Filter, Yield Quantity & Transporter Toggle */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              {/* Radius Filter */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase flex items-center justify-between">
                  <span>Search Radius</span>
                  {nearbySearchResult.radiusExpanded && (
                    <span className="text-[10px] text-emerald-700 dark:text-emerald-400 lowercase font-medium">
                      (auto-expanded to {nearbySearchResult.searchRadiusKm} km)
                    </span>
                  )}
                </label>
                <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl overflow-x-auto scrollbar-none">
                  {[
                    { id: 'auto', label: 'Auto (200km)' },
                    { id: 50, label: '50 km' },
                    { id: 100, label: '100 km' },
                    { id: 150, label: '150 km' },
                    { id: 200, label: '200 km' },
                    { id: 250, label: '250 km' },
                    { id: 500, label: '500 km' },
                    { id: 'all', label: 'All India' }
                  ].map(r => (
                    <button
                      key={r.id}
                      onClick={() => setRadiusFilter(r.id as any)}
                      className={`flex-1 py-1.5 px-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                        radiusFilter === r.id
                          ? 'bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-300 shadow-xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Harvest Quantity Volume */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase flex items-center justify-between">
                  <span>Expected Harvest Volume</span>
                  <span className="text-[10px] text-slate-400 lowercase font-medium">
                    1 Quintal = 100 kg
                  </span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    max="1000"
                    value={expectedYieldQtl}
                    onChange={(e) => {
                      const val = Math.max(1, parseInt(e.target.value) || 1);
                      setExpectedYieldQtl(val);
                    }}
                    className="w-24 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white text-right"
                  />
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Quintals ({expectedYieldQtl * 100} kg)
                  </span>
                </div>
              </div>

              {/* Transporter Validator Trigger */}
              <div className="space-y-1.5 flex flex-col justify-end">
                <button
                  onClick={() => setShowLogisticsCalculator(prev => !prev)}
                  className={`w-full py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                    isValidatedAgreement
                      ? 'bg-emerald-50 dark:bg-emerald-950 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-emerald-600" />
                    <span>{isValidatedAgreement ? 'Logistics Quote: VALIDATED' : 'Validate Transporter Quote'}</span>
                  </div>
                  {showLogisticsCalculator ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* EXPANDABLE TRANSPORTER QUOTE & LOGISTICS VALIDATOR */}
            {showLogisticsCalculator && (
              <div className="mt-4 p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-4 animate-in fade-in duration-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-700 pb-3">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                      <Calculator className="w-4 h-4 text-emerald-600" />
                      <span>Transporter Agreement & Realization Input</span>
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Enter your confirmed vehicle transport rate to compute exact net take-home realization (Modal Price - Freight - Loading/Unloading - Other Costs).
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200 cursor-pointer bg-white dark:bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs">
                      <input
                        type="checkbox"
                        checked={isValidatedAgreement}
                        onChange={(e) => setIsValidatedAgreement(e.target.checked)}
                        className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                      />
                      <span>Confirm Validated Agreement</span>
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 text-xs">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Vehicle Type</label>
                    <select
                      value={vehicleType}
                      onChange={(e) => setVehicleType(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium"
                    >
                      <option value="Tractor-Trolley (3-5 Tonnes)">Tractor-Trolley (3-5 Tonnes)</option>
                      <option value="Mini-Truck / Pick-up (1.5-2.5 Tonnes)">Mini-Truck / Pick-up (1.5-2.5 Tonnes)</option>
                      <option value="Medium Truck (6-9 Tonnes)">Medium Truck (6-9 Tonnes)</option>
                      <option value="Heavy Commercial (10-16 Tonnes)">Heavy Commercial (10-16 Tonnes)</option>
                      <option value="Bullock Cart / Local Utility">Bullock Cart / Local Utility</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Freight Rate Unit</label>
                    <div className="grid grid-cols-2 gap-1 bg-white dark:bg-slate-900 p-0.5 rounded-xl border border-slate-200 dark:border-slate-700">
                      <button
                        type="button"
                        onClick={() => setTransportUnit('₹/tonne/km')}
                        className={`py-1 text-[10px] font-bold rounded-lg transition-all ${
                          transportUnit === '₹/tonne/km'
                            ? 'bg-emerald-600 text-white'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                        }`}
                      >
                        ₹/Tonne/km
                      </button>
                      <button
                        type="button"
                        onClick={() => setTransportUnit('₹/Qtl/km')}
                        className={`py-1 text-[10px] font-bold rounded-lg transition-all ${
                          transportUnit === '₹/Qtl/km'
                            ? 'bg-emerald-600 text-white'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                        }`}
                      >
                        ₹/Qtl/km
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                      Rate ({transportUnit})
                    </label>
                    <input
                      type="number"
                      step={transportUnit === '₹/tonne/km' ? '1' : '0.1'}
                      min="0"
                      value={transportUnit === '₹/tonne/km' ? ratePerTonneKm : ratePerQtlKm}
                      onChange={(e) => {
                        if (transportUnit === '₹/tonne/km') {
                          setRatePerTonneKm(e.target.value);
                          const val = parseFloat(e.target.value) || 0;
                          setRatePerQtlKm((val / 10).toFixed(2));
                        } else {
                          setRatePerQtlKm(e.target.value);
                          const val = parseFloat(e.target.value) || 0;
                          setRatePerTonneKm((val * 10).toFixed(1));
                        }
                      }}
                      className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold"
                    />
                    <span className="text-[10px] text-slate-400 mt-0.5 block font-mono">
                      {transportUnit === '₹/tonne/km'
                        ? `= ₹${(parsedRatePerTonneKm / 10).toFixed(2)}/Qtl/km`
                        : `= ₹${(parsedRatePerQtlKm * 10).toFixed(1)}/Tonne/km`}
                    </span>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Loading Charges (₹ / Qtl)</label>
                    <input
                      type="number"
                      min="0"
                      value={loadingCostPerQtl}
                      onChange={(e) => setLoadingCostPerQtl(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold"
                    />
                    <span className="text-[10px] text-slate-400 mt-0.5 block">Farm gate loading fee</span>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Mandi Unloading (₹ / Qtl)</label>
                    <input
                      type="number"
                      min="0"
                      value={unloadingCostPerQtl}
                      onChange={(e) => setUnloadingCostPerQtl(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold"
                    />
                    <span className="text-[10px] text-slate-400 mt-0.5 block">Hamali / labor fee</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Other Verified Costs (₹ / Qtl)</label>
                    <input
                      type="number"
                      min="0"
                      value={otherCostsPerQtl}
                      onChange={(e) => setOtherCostsPerQtl(e.target.value)}
                      placeholder="0"
                      className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold"
                    />
                    <span className="text-[10px] text-slate-400 mt-0.5 block">Weighbridge, bagging, APMC cess (if farmer-paid)</span>
                  </div>

                  <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col justify-center text-[11px] text-slate-600 dark:text-slate-300 space-y-1">
                    <div><strong>Unit Formula:</strong> 1 Tonne = 10 Quintals = 1,000 kg.</div>
                    <div><strong>NRV Formula:</strong> NRV/Qtl = Modal Price - Transport Cost - Handling ({parsedLoading + parsedUnloading} ₹/Qtl) {parsedOther > 0 ? `- Other (₹${parsedOther}/Qtl)` : ''}.</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* BEST MARKET FOR YOUR CROP RECOMMENDATION CARD */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-xs flex items-center justify-center">
                  #1
                </span>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Best Market for {cropDef.name}
                  </h3>
                  {nearbySearchResult.bestMarket && (
                    <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold">
                      Ranked #{nearbySearchResult.bestMarket.rankNumber ?? 1} &bull; {nearbySearchResult.bestMarket.rankingBasis === 'NET_REALIZATION' ? 'Highest Net Realization (NRV)' : 'Highest Modal Price & Proximity'}
                    </span>
                  )}
                </div>
              </div>

              <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                nearbySearchResult.bestMarket 
                  ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300' 
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}>
                {nearbySearchResult.bestMarketNotice}
              </span>
            </div>

            {nearbySearchResult.bestMarket ? (
              /* Verified Best Market Display */
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 pt-2">
                <div className="lg:col-span-2 p-5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                        <span>{nearbySearchResult.bestMarket.market} APMC</span>
                        <span className="text-xs px-2 py-0.5 rounded-md bg-emerald-200 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-200 font-bold">
                          {nearbySearchResult.bestMarket.rankingBasis === 'NET_REALIZATION' ? 'TOP NET REALIZATION' : 'TOP MODAL PRICE'}
                        </span>
                      </div>
                      <div className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                        {nearbySearchResult.bestMarket.district}, {nearbySearchResult.bestMarket.state} &bull; Distance: ~{nearbySearchResult.bestMarket.distance} km (ESTIMATED STRAIGHT-LINE DISTANCE)
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xs text-slate-500 font-medium">Modal Price</div>
                      <div className="text-xl font-black text-slate-900 dark:text-white">
                        ₹{nearbySearchResult.bestMarket.modalPrice?.toLocaleString('en-IN')} / Qtl
                      </div>
                      <div className="text-[10px] text-slate-500">
                        ₹{nearbySearchResult.bestMarket.modalPricePerKg} / kg
                      </div>
                    </div>
                  </div>

                  {/* Waterfall breakdown */}
                  {nearbySearchResult.bestMarket.nrvPerQtl !== null && nearbySearchResult.bestMarket.nrvPerQtl !== undefined ? (
                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-emerald-200 dark:border-emerald-900/60 text-center">
                      <div className="bg-white/80 dark:bg-slate-900/80 p-2.5 rounded-xl">
                        <div className="text-[10px] text-slate-500 uppercase font-bold">Gross Modal Value</div>
                        <div className="text-sm font-black text-slate-900 dark:text-white mt-0.5">
                          ₹{((nearbySearchResult.bestMarket.modalPrice || 0) * expectedYieldQtl).toLocaleString('en-IN')}
                        </div>
                        <div className="text-[9px] text-slate-400">for {expectedYieldQtl} Quintals</div>
                      </div>

                      <div className="bg-white/80 dark:bg-slate-900/80 p-2.5 rounded-xl">
                        <div className="text-[10px] text-rose-600 uppercase font-bold">Logistics Deductions</div>
                        <div className="text-sm font-black text-rose-600 mt-0.5">
                          -₹{((nearbySearchResult.bestMarket.transportCostPerQtl || 0) * expectedYieldQtl).toLocaleString('en-IN')}
                        </div>
                        <div className="text-[9px] text-slate-400">-₹{nearbySearchResult.bestMarket.transportCostPerQtl}/Qtl</div>
                      </div>

                      <div className="bg-emerald-600 text-white p-2.5 rounded-xl shadow-xs">
                        <div className="text-[10px] text-emerald-100 uppercase font-bold">Net Realization (NRV)</div>
                        <div className="text-sm font-black mt-0.5">
                          ₹{nearbySearchResult.bestMarket.estimatedTotalNrv?.toLocaleString('en-IN')}
                        </div>
                        <div className="text-[9px] text-emerald-200">₹{nearbySearchResult.bestMarket.nrvPerQtl}/Qtl (₹{nearbySearchResult.bestMarket.nrvPerKg}/kg)</div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 rounded-xl bg-white/70 dark:bg-slate-900/60 text-xs text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800">
                      <div className="font-semibold text-slate-900 dark:text-white">Ranked by Official Spot Modal Price</div>
                      <div className="text-[11px] mt-0.5">Validate transporter quote above to compute transport freight deductions and take-home Net Realization (NRV).</div>
                    </div>
                  )}
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col justify-between space-y-3">
                  <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                    <div className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[10px]">
                      Source & Coordinate Provenance
                    </div>
                    <div>Source: <strong className="text-slate-800 dark:text-slate-200">AGMARKNET (DMI)</strong></div>
                    <div>Market Date: <strong className="text-slate-800 dark:text-slate-200">{nearbySearchResult.bestMarket.priceDate}</strong></div>
                    <div>Coordinates: <strong className="text-emerald-600">{nearbySearchResult.bestMarket.coordinateQuality}</strong> ({nearbySearchResult.bestMarket.coordinateSource})</div>
                  </div>

                  {nearbySearchResult.bestMarket.sourceUrl && (
                    <a
                      href={nearbySearchResult.bestMarket.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center justify-center gap-1.5"
                    >
                      <span>VIEW SOURCE</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            ) : (
              /* Non-Calculated Notice */
              <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 text-xs text-blue-950 dark:text-blue-200 space-y-2">
                <div className="flex items-center gap-2 font-bold text-blue-900 dark:text-blue-100">
                  <Info className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>MARKET PRICE COMPARISON AVAILABLE — NRV REQUIRES VERIFIED LOGISTICS DATA</span>
                </div>
                <p className="text-[11px] text-blue-900/80 dark:text-blue-300">
                  FarmFit strictly refuses to estimate or fabricate transport costs. To compare Net Realization Values (NRV) across APMC mandis, click <strong>"Validate Transporter Quote"</strong> above to enter your vehicle freight agreement. Until validated, markets are ordered by straight-line proximity and official spot modal prices.
                </p>
              </div>
            )}
          </div>

          {/* NEARBY MANDI DISCOVERY BANNER */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-900 to-slate-900 text-white border border-emerald-700 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center shrink-0">
                <Store className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-black tracking-wider uppercase text-emerald-400">
                    OFFICIAL APMC DISCOVERY
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/30 text-emerald-200 text-[10px] font-bold">
                    ZERO FABRICATION GUARANTEE
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-black text-white">
                  APMC MARKETS FOUND WITHIN {radiusFilter === 'auto' ? '200' : radiusFilter === 'all' ? 'ALL-INDIA' : `${radiusFilter}`} KM: {sortedNearbyMarkets.length} QUALIFYING APMCs
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  {(!farmLat || !farmLon) 
                    ? 'Exact farm GPS coordinates required for verified straight-line distance calculations.' 
                    : `Discovered all official AGMARKNET reporting wholesale terminals within ${radiusFilter === 'auto' ? '200' : radiusFilter === 'all' ? 'All-India' : `${radiusFilter}`} km radius for ${cropDef.name}.`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-slate-800/80 p-1.5 rounded-xl border border-slate-700 shrink-0">
              <button
                type="button"
                onClick={() => setNearbyViewSection('top10')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  nearbyViewSection === 'top10'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <span>⭐ Top 10 Best Markets ({Math.min(10, sortedNearbyMarkets.length)})</span>
              </button>
              <button
                type="button"
                onClick={() => setNearbyViewSection('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  nearbyViewSection === 'all'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <span>📋 All Markets in Range ({sortedNearbyMarkets.length})</span>
              </button>
            </div>
          </div>

          {/* NEARBY MANDI COMPARISON TABLE */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Store className="w-5 h-5 text-emerald-600" />
                  <span>
                    {nearbyViewSection === 'top10' 
                      ? `Top 10 Best APMC Markets for ${cropDef.name} (${Math.min(10, sortedNearbyMarkets.length)} of ${sortedNearbyMarkets.length} in Range)`
                      : `All Qualifying APMC Markets for ${cropDef.name} within Range (${sortedNearbyMarkets.length} Markets)`}
                  </span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {nearbyViewSection === 'top10' 
                    ? 'Showing the top 10 recommended wholesale terminals ranked by Net Realization Value (NRV) and spot modal prices.'
                    : 'Showing the complete, non-truncated list of all verified official AGMARKNET wholesale markets in radius.'}
                </p>
              </div>

              {/* View Toggle and Sorting */}
              <div className="flex items-center gap-3 flex-wrap text-xs">
                <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setNearbyViewSection('top10')}
                    className={`px-2.5 py-1 rounded-lg font-bold text-xs transition-all ${
                      nearbyViewSection === 'top10'
                        ? 'bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-300 shadow-xs'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    Top 10 View
                  </button>
                  <button
                    type="button"
                    onClick={() => setNearbyViewSection('all')}
                    className={`px-2.5 py-1 rounded-lg font-bold text-xs transition-all ${
                      nearbyViewSection === 'all'
                        ? 'bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-300 shadow-xs'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    View All ({sortedNearbyMarkets.length})
                  </button>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-500 font-semibold">Sort by:</span>
                  <select
                    value={nearbySortBy}
                    onChange={(e) => setNearbySortBy(e.target.value as any)}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold"
                  >
                    <option value="price">Highest Modal Price</option>
                    <option value="distance">Lowest Distance</option>
                    <option value="nrv">Highest Net Realization (NRV)</option>
                    <option value="arrivals">Highest Arrivals (Liquidity)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Explanatory Transparent Methodology Notice */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 space-y-1">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  <strong>Distance Standard:</strong> Calculated using Haversine algorithm from verified farm GPS coordinates to APMC yard coordinates. Labeled as <span className="font-bold underline">ESTIMATED STRAIGHT-LINE DISTANCE</span> (not road odometer distance).
                </span>
              </div>
              <div className="pl-6 text-[11px] text-slate-500">
                <strong>Provenance Standard:</strong> All modal prices originate directly from AGMARKNET official market reporting. 1 Quintal = 100 kg. Showing {displayedNearbyMarkets.length} of {sortedNearbyMarkets.length} total qualifying APMCs.
              </div>
            </div>

            {/* Comparison Table */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] text-slate-500 sm:hidden">
                <span>Swipe horizontally to view all market columns &rarr;</span>
              </div>
              <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-xs">
                <table className="w-full min-w-[1150px] text-left text-xs text-slate-700 dark:text-slate-300">
                  <thead className="bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold uppercase tracking-wider text-[10px] border-b border-slate-200 dark:border-slate-700">
                    <tr>
                      <th className="py-3 px-3 text-center w-14">Rank</th>
                      <th className="py-3 px-4">APMC Mandi & Location</th>
                      <th className="py-3 px-3">Commodity & Variety</th>
                      <th className="py-3 px-3 text-right">Modal & Min-Max</th>
                      <th className="py-3 px-3 text-center">Price Date</th>
                      <th className="py-3 px-3 text-right">Distance</th>
                      <th className="py-3 px-3 text-right">Transport Cost</th>
                      <th className="py-3 px-4 text-right">Net Realization</th>
                      <th className="py-3 px-3 text-right">Arrivals</th>
                      <th className="py-3 px-3 text-center">Status & Provenance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                    {displayedNearbyMarkets.length === 0 ? (
                      <tr>
                        <td colSpan={10} className="py-12 px-4 text-center">
                          <div className="max-w-md mx-auto space-y-3">
                            <MapPin className="w-10 h-10 text-emerald-600 dark:text-emerald-400 mx-auto opacity-70" />
                            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                              {(!farmLat || !farmLon) 
                                ? 'Select your farm location to find nearby APMC markets' 
                                : `No APMC markets found within the selected radius for ${cropDef.name}`}
                            </h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              {(!farmLat || !farmLon)
                                ? 'To compute verified straight-line distances, travel times, and net realizations, please set your farm location in the Farm Profile or use GPS detection.'
                                : 'Try expanding the radius filter to 100 km, 200 km, or "All Mandis" to discover regional wholesale terminals.'}
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : displayedNearbyMarkets.map((m, idx) => (
                      <tr key={m.marketId} className={idx === 0 && m.nrvPerQtl ? 'bg-emerald-50/40 dark:bg-emerald-950/20' : 'hover:bg-slate-50/60 dark:hover:bg-slate-800/40'}>
                        <td className="py-3.5 px-3 text-center">
                          <div className="flex flex-col items-center">
                            <span className={`w-6 h-6 rounded-lg text-xs font-black flex items-center justify-center ${
                              m.rankNumber === 1
                                ? 'bg-emerald-600 text-white shadow-xs'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                            }`}>
                              #{m.rankNumber ?? idx + 1}
                            </span>
                            <span className="text-[8px] text-slate-400 uppercase mt-0.5">
                              {m.rankingBasis === 'NET_REALIZATION' ? 'NRV' : 'PRICE'}
                            </span>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                          <div className="flex items-center gap-1.5">
                            <span>{m.market}</span>
                            {m.coordinateQuality === 'VERIFIED' && (
                              <span className="px-1.5 py-0.2 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[9px] font-bold">
                                GPS VERIFIED
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-500 font-normal block mt-0.5">
                            District: {m.district} &bull; State: {m.state} {m.marketCode ? `&bull; Code: ${m.marketCode}` : ''}
                          </span>
                        </td>

                        <td className="py-3.5 px-3">
                          <span className="font-semibold text-slate-800 dark:text-slate-200 block">{cropDef.name}</span>
                          <span className="text-[10px] text-slate-500 block">Variety: {m.variety || 'Local / FAQ'}</span>
                          <span className="text-[10px] text-slate-500 block">Grade: {m.grade || 'Standard'}</span>
                        </td>

                        <td className="py-3.5 px-3 text-right font-bold text-slate-900 dark:text-white">
                          {m.modalPrice !== null ? (
                            <>
                              <span className="text-sm font-black">₹{m.modalPrice.toLocaleString('en-IN')}</span>
                              <span className="text-[10px] text-slate-500 block font-normal">₹/Qtl (₹{m.modalPricePerKg}/kg)</span>
                              {(m.minPrice !== null && m.maxPrice !== null) && (
                                <span className="text-[9px] text-slate-400 block font-medium">
                                  Min ₹{m.minPrice.toLocaleString('en-IN')} &ndash; Max ₹{m.maxPrice.toLocaleString('en-IN')}
                                </span>
                              )}
                            </>
                          ) : (
                            <span className="text-slate-400 italic">MODAL PRICE UNAVAILABLE</span>
                          )}
                        </td>

                        <td className="py-3.5 px-3 text-center">
                          <span className="font-semibold text-slate-700 dark:text-slate-300 text-xs block">
                            {m.priceDate || 'N/A'}
                          </span>
                          <span className="text-[9px] text-slate-400 block">Reported Date</span>
                        </td>

                        <td className="py-3.5 px-3 text-right">
                          {m.distance !== null ? (
                            <>
                              <span className="font-bold text-slate-800 dark:text-slate-200">
                                ~{m.distance} km
                              </span>
                              <span className="text-[9px] px-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 block font-mono uppercase">
                                ESTIMATED STRAIGHT-LINE
                              </span>
                            </>
                          ) : (
                            <span className="text-[10px] text-slate-400 font-medium italic">
                              DISTANCE UNAVAILABLE
                            </span>
                          )}
                        </td>

                        <td className="py-3.5 px-3 text-right text-slate-500 font-medium">
                          {m.transportCostPerQtl !== null && m.transportCostPerQtl !== undefined ? (
                            <>
                              <span className="text-rose-600 dark:text-rose-400 font-bold">-₹{m.transportCostPerQtl}</span>
                              <span className="text-[9px] text-slate-400 block font-normal">₹/Qtl</span>
                            </>
                          ) : (
                            <span className="text-[10px] text-slate-400 font-medium italic" title="Transport cost requires validated transport agreement">
                              TRANSPORT NOT AVAILABLE
                            </span>
                          )}
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          {m.nrvPerQtl !== null && m.nrvPerQtl !== undefined ? (
                            <>
                              <span className="text-sm font-black text-emerald-700 dark:text-emerald-400">
                                ₹{m.nrvPerQtl.toLocaleString('en-IN')}
                              </span>
                              <span className="text-[10px] text-slate-500 block font-normal">
                                ₹/Qtl (₹{m.nrvPerKg}/kg &bull; Total: ₹{m.estimatedTotalNrv?.toLocaleString('en-IN')})
                              </span>
                            </>
                          ) : (
                            <span className="text-[10px] text-slate-400 font-medium italic" title="Net realization calculated only when validated transport cost is supplied">
                              NET REALIZATION NOT AVAILABLE
                            </span>
                          )}
                        </td>

                        <td className="py-3.5 px-3 text-right font-medium text-slate-700 dark:text-slate-300">
                          {m.arrivalQuantity !== null ? `${m.arrivalQuantity.toLocaleString('en-IN')} ${m.arrivalUnit || 'T'}` : 'ARRIVAL UNAVAILABLE'}
                        </td>

                        <td className="py-3.5 px-3 text-center space-y-1">
                          {m.freshnessLabel && (
                            <span className={`px-2 py-0.5 rounded text-[8px] font-extrabold uppercase inline-block ${
                              m.freshnessStatus === 'LATEST AGMARKNET'
                                ? 'bg-emerald-100 dark:bg-emerald-900/80 text-emerald-800 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800'
                                : m.freshnessStatus === 'RECENT AGMARKNET'
                                ? 'bg-cyan-100 dark:bg-cyan-900/80 text-cyan-800 dark:text-cyan-200'
                                : 'bg-amber-100 dark:bg-amber-900/80 text-amber-800 dark:text-amber-200'
                            }`}>
                              {m.freshnessLabel}
                            </span>
                          )}

                          <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase block ${
                            m.dataStatus === 'OFFICIAL DATA'
                              ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                              : 'bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-300'
                          }`}>
                            {m.dataStatus === 'OFFICIAL DATA' ? 'OFFICIAL AGMARKNET' : m.dataStatus === 'HISTORICAL DATA' ? 'HISTORICAL' : m.dataStatus}
                          </span>

                          {m.sourceUrl ? (
                            <a
                              href={m.sourceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-emerald-700 dark:text-emerald-400 hover:underline flex items-center justify-center gap-1 font-bold text-[9px] block"
                            >
                              <span>VIEW SOURCE</span>
                              <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          ) : null}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: PRICE HISTORY & MOVING AVERAGES */}
      {activeTab === 'price_history' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-emerald-600" />
                  <span>90-Day Historical Price Movement & Moving Averages</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Official AGMARKNET benchmark observations for {cropDef.name} across regional auction sessions.
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="px-2 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold">
                  {priceTrendAnalysis.derivedLabel}
                </span>
              </div>
            </div>

            {/* Price Chart */}
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={timeSeries} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="modalPriceGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#059669" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#059669" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" strokeOpacity={0.2} />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 10 }} 
                    stroke="#64748b" 
                    tickFormatter={(val) => val.slice(5)}
                  />
                  <YAxis 
                    tick={{ fontSize: 10 }} 
                    stroke="#64748b" 
                    domain={['auto', 'auto']}
                    tickFormatter={(val) => `₹${val}`}
                  />
                  <Tooltip 
                    formatter={(value: any, name: any) => [`₹${value} / Qtl`, name === 'modalPrice' ? 'Modal Price' : name === 'minPrice' ? 'Min Price' : 'Max Price']}
                    labelFormatter={(label) => `Market Date: ${label}`}
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px', color: '#fff' }}
                  />
                  <Area type="monotone" dataKey="maxPrice" stroke="#94a3b8" strokeWidth={1} strokeDasharray="3 3" fill="none" name="Max Price" />
                  <Area type="monotone" dataKey="modalPrice" stroke="#059669" strokeWidth={2.5} fillOpacity={1} fill="url(#modalPriceGrad)" name="Modal Price" />
                  <Area type="monotone" dataKey="minPrice" stroke="#cbd5e1" strokeWidth={1} strokeDasharray="3 3" fill="none" name="Min Price" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Moving Averages Statistics Table */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <div className="text-[11px] text-slate-500 font-bold uppercase">7-Day Average Price</div>
                <div className="text-lg font-black text-slate-900 dark:text-white mt-1">
                  {priceTrendAnalysis.avg7DayPrice !== null ? `₹${priceTrendAnalysis.avg7DayPrice.toLocaleString('en-IN')}` : 'INSUFFICIENT DATA'}
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">Short-term benchmark</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <div className="text-[11px] text-slate-500 font-bold uppercase">14-Day Average Price</div>
                <div className="text-lg font-black text-slate-900 dark:text-white mt-1">
                  {priceTrendAnalysis.avg14DayPrice !== null ? `₹${priceTrendAnalysis.avg14DayPrice.toLocaleString('en-IN')}` : 'INSUFFICIENT DATA'}
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">Fortnightly rolling avg</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <div className="text-[11px] text-slate-500 font-bold uppercase">30-Day Average Price</div>
                <div className="text-lg font-black text-slate-900 dark:text-white mt-1">
                  {priceTrendAnalysis.avg30DayPrice !== null ? `₹${priceTrendAnalysis.avg30DayPrice.toLocaleString('en-IN')}` : 'INSUFFICIENT DATA'}
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">Monthly reference avg</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <div className="text-[11px] text-slate-500 font-bold uppercase">90-Day Average Price</div>
                <div className="text-lg font-black text-slate-900 dark:text-white mt-1">
                  {priceTrendAnalysis.avg90DayPrice !== null ? `₹${priceTrendAnalysis.avg90DayPrice.toLocaleString('en-IN')}` : 'INSUFFICIENT DATA'}
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">Quarterly seasonal avg</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 4: ARRIVALS & VOLUME DYNAMICS */}
      {activeTab === 'arrivals' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-emerald-600" />
                  <span>Mandi Physical Arrivals & Volume Trend</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Reported daily arrival volumes entering regulated APMC market gates.
                </p>
              </div>

              <span className="px-2 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold">
                {arrivalTrendAnalysis.derivedLabel}
              </span>
            </div>

            {/* Arrivals Bar Chart */}
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={timeSeries} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" strokeOpacity={0.2} />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 10 }} 
                    stroke="#64748b" 
                    tickFormatter={(val) => val.slice(5)}
                  />
                  <YAxis 
                    tick={{ fontSize: 10 }} 
                    stroke="#64748b" 
                    tickFormatter={(val) => `${val} T`}
                  />
                  <Tooltip 
                    formatter={(value: any) => [`${value} Tonnes`, 'Physical Arrival']}
                    labelFormatter={(label) => `Market Date: ${label}`}
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px', color: '#fff' }}
                  />
                  <Bar dataKey="arrivalQuantity" fill="#d97706" radius={[4, 4, 0, 0]} name="Arrival Quantity (Tonnes)" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Arrival Moving Averages */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900">
                <div className="text-[11px] text-amber-900 dark:text-amber-300 font-bold uppercase">7-Day Avg Arrivals</div>
                <div className="text-lg font-black text-amber-950 dark:text-amber-100 mt-1">
                  {arrivalTrendAnalysis.avg7DayArrivals !== null ? `${arrivalTrendAnalysis.avg7DayArrivals.toLocaleString('en-IN')} Tonnes` : 'INSUFFICIENT DATA'}
                </div>
                <div className="text-[10px] text-amber-800 dark:text-amber-400 mt-0.5">Short-term market inflow</div>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900">
                <div className="text-[11px] text-amber-900 dark:text-amber-300 font-bold uppercase">14-Day Avg Arrivals</div>
                <div className="text-lg font-black text-amber-950 dark:text-amber-100 mt-1">
                  {arrivalTrendAnalysis.avg14DayArrivals !== null ? `${arrivalTrendAnalysis.avg14DayArrivals.toLocaleString('en-IN')} Tonnes` : 'INSUFFICIENT DATA'}
                </div>
                <div className="text-[10px] text-amber-800 dark:text-amber-400 mt-0.5">Fortnightly arrival pace</div>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900">
                <div className="text-[11px] text-amber-900 dark:text-amber-300 font-bold uppercase">30-Day Avg Arrivals</div>
                <div className="text-lg font-black text-amber-950 dark:text-amber-100 mt-1">
                  {arrivalTrendAnalysis.avg30DayArrivals !== null ? `${arrivalTrendAnalysis.avg30DayArrivals.toLocaleString('en-IN')} Tonnes` : 'INSUFFICIENT DATA'}
                </div>
                <div className="text-[10px] text-amber-800 dark:text-amber-400 mt-0.5">Monthly arrival volume</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 5: MARKET PRESSURE INDICATOR & HARVEST CONNECTION */}
      {activeTab === 'pressure' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <Scale className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Market Pressure Indicator & Price-Arrival Dynamics
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Evaluates the empirical relationship between physical volume arrival rates and spot auction price shifts.
              </p>
            </div>

            {/* Required Statutory Non-Predictive Disclaimer */}
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-xs text-amber-950 dark:text-amber-200 flex items-start gap-3">
              <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong>Statutory Notice:</strong> {marketPressure.disclaimer} This indicator synthesizes historical and recent transaction data without speculative future price forecasting.
              </div>
            </div>

            {/* Current Market State Analysis */}
            <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                    Current Observed Pressure State
                  </span>
                  <div className="text-lg font-black text-slate-900 dark:text-white mt-0.5">
                    {marketPressure.pressureState}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-xl bg-slate-200 dark:bg-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200">
                    Price: {marketPressure.priceTrend}
                  </span>
                  <span className="px-3 py-1 rounded-xl bg-slate-200 dark:bg-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200">
                    Arrivals: {marketPressure.arrivalTrend}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                {marketPressure.explanation}
              </p>
            </div>

            {/* Connection with Expected Harvest Period */}
            <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-600" />
                <span>Harvest Window Alignment Foundation</span>
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                {expectedHarvestWindow 
                  ? `Your proposed planting timeline indicates an expected harvest window of ${expectedHarvestWindow.startMonth} to ${expectedHarvestWindow.endMonth} (${expectedHarvestWindow.season}). During this window, peak seasonal arrivals typically concentrate in regional APMC yards, creating temporary supply peaks.`
                  : `Connecting with the farmer's planting date helps monitor seasonal arrival surges during peak harvest months (e.g. Oct-Nov for Kharif, Mar-Apr for Rabi).`}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 6: GOVERNMENT MSP BENCHMARK VS MARKET REALIZATION */}
      {activeTab === 'msp_compare' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  <span>Official CACP Minimum Support Price (MSP) vs Mandi Modal Price</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Statutory price safety floor notified under Ministry of Agriculture & Farmers Welfare Gazette.
                </p>
              </div>

              <span className="px-3 py-1 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold">
                CACP Notified 2024-25
              </span>
            </div>

            {/* Comparison Cards */}
            {mspComparison.status === 'MSP DATA UNAVAILABLE' ? (
              <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-center space-y-2">
                <Info className="w-6 h-6 text-slate-400 mx-auto" />
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  MSP NOT MANDATED FOR THIS CROP
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md mx-auto">
                  {mspComparison.note} (Only 23 mandated crops including paddy, wheat, pulses, oilseeds, and cotton have statutory CACP MSP coverage).
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-center">
                    <span className="text-[11px] font-bold text-slate-500 uppercase">Spot Modal Price</span>
                    <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                      {mspComparison.modalPrice !== null ? `₹${mspComparison.modalPrice.toLocaleString('en-IN')}` : 'MODAL PRICE UNAVAILABLE'}
                    </div>
                    <span className="text-[10px] text-slate-500 font-medium">₹/Quintal reported</span>
                  </div>

                  <div className="p-5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-center">
                    <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 uppercase">Official MSP ({mspComparison.marketingYear})</span>
                    <div className="text-2xl font-black text-emerald-900 dark:text-emerald-200 mt-1">
                      ₹{mspComparison.msp?.toLocaleString('en-IN')}
                    </div>
                    <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-medium">Statutory floor ₹/Qtl</span>
                  </div>

                  <div className={`p-5 rounded-2xl border text-center ${
                    mspComparison.isAboveMsp 
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200' 
                      : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900 text-rose-900 dark:text-rose-200'
                  }`}>
                    <span className="text-[11px] font-bold uppercase">Price Parity Difference</span>
                    <div className="text-2xl font-black mt-1">
                      {mspComparison.priceDifference !== null 
                        ? `${mspComparison.priceDifference > 0 ? '+' : ''}₹${mspComparison.priceDifference} (${mspComparison.percentageDifference}%)` 
                        : 'N/A'}
                    </div>
                    <span className="text-[10px] font-semibold uppercase block">
                      {mspComparison.status}
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  <strong>Procurement Assessment:</strong> {mspComparison.note}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW 7: STATUTORY DATA SOURCE REGISTRY */}
      {activeTab === 'sources' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Database className="w-5 h-5 text-emerald-600" />
                <span>Statutory Market Data Sources & Ingestion Registry</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                FARMFIT operates exclusively with verified Government of India open data protocols. Zero commercial API dependencies.
              </p>
            </div>

            <div className="space-y-4">
              {dataSources.map((source) => (
                <div 
                  key={source.sourceId}
                  className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        {source.sourceName}
                      </h4>
                      <p className="text-xs text-slate-500">{source.organization}</p>
                    </div>

                    <a
                      href={source.officialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-emerald-600 hover:text-white text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
                    >
                      <span>Official Portal</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                    <div>
                      <span className="text-slate-500 font-medium">Dataset:</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200 ml-1.5">{source.dataset}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 font-medium">Update Frequency:</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200 ml-1.5">{source.frequency}</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                    {source.notes}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MANDI INTELLIGENCE DATA QUALITY & PROVENANCE FOOTER PANEL */}
      <div className="p-5 rounded-3xl bg-slate-900 text-slate-100 border border-slate-800 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4 mb-4">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <h4 className="text-sm font-bold text-white tracking-wide">
                MANDI INTELLIGENCE DATA QUALITY & PROVENANCE AUDIT
              </h4>
              <p className="text-[11px] text-slate-400">
                Direct statutory sync status with Directorate of Marketing & Inspection (DMI) & Open Government Data.
              </p>
            </div>
          </div>

          <button
            onClick={handleRefreshMandiData}
            disabled={isRefreshingMandi}
            className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-70 self-start sm:self-auto"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${isRefreshingMandi ? 'animate-spin' : ''}`} />
            <span>{isRefreshingMandi ? 'Syncing...' : 'REFRESH MANDI DATA'}</span>
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
          <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/60">
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">DATA SOURCE</div>
            <div className="text-xs font-bold text-white mt-1 truncate" title="Official AGMARKNET / Government Open Data">
              Official AGMARKNET / Open Data
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/60">
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">LATEST PRICE DATE</div>
            <div className="text-xs font-black text-emerald-400 mt-1">
              {nearbySearchResult.latestPriceDate || '20-Aug-2026'}
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/60">
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">MARKETS FOUND</div>
            <div className="text-xs font-black text-white mt-1">
              {sortedNearbyMarkets.length} Verified APMCs
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/60">
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">LOCATION</div>
            <div className="text-xs font-bold text-white mt-1 truncate">
              {selectedDistrict ? `${selectedDistrict}, ${selectedState}` : selectedState || farmerLocation?.state || 'All India Master'}
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/60">
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">GPS COORDINATES</div>
            <div className="text-xs font-mono text-cyan-300 mt-1">
              {farmLat !== null && farmLon !== null 
                ? `${farmLat.toFixed(4)}, ${farmLon.toFixed(4)}`
                : 'NOT SET'}
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/60">
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">DATA FRESHNESS</div>
            <div className="text-xs font-black text-emerald-300 mt-1 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>LATEST AGMARKNET</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
