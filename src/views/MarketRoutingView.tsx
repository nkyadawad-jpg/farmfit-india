import React, { useState, useMemo } from 'react';
import { CalculationEngineResult, Language, FarmLocation } from '../types';
import { 
  Truck, 
  Store, 
  MapPin, 
  ExternalLink, 
  ShieldCheck, 
  AlertTriangle, 
  Info, 
  ArrowUpDown, 
  ChevronDown, 
  ChevronUp, 
  Calculator, 
  Scale, 
  Award, 
  CheckCircle2, 
  DollarSign,
  Search,
  Plus,
  Layers,
  X,
  Sparkles
} from 'lucide-react';
import { DataStatusBadge } from '../components/DataStatusBadge';
import { AGMARKNET_METADATA } from '../data/officialData';
import { nearbyMandiService } from '../services/nearbyMandiService';
import { 
  FARMFIT_CROP_COMMODITY_MASTER, 
  getCanonicalCropById, 
  getOfficialCommodityMapping, 
  ALL_CROP_CATEGORIES 
} from '../data/cropMasterIndex';

interface MarketRoutingViewProps {
  farmerLocation: FarmLocation;
  result?: CalculationEngineResult | null;
  preferredCropIds?: string[];
  selectedCropId?: string;
  onSelectCrop?: (cropId: string) => void;
  language: Language;
}

export const MarketRoutingView: React.FC<MarketRoutingViewProps> = ({
  farmerLocation,
  result,
  preferredCropIds = [],
  selectedCropId = 'soybean',
  onSelectCrop,
  language
}) => {
  const initialCrop = selectedCropId || (preferredCropIds.length > 0 ? preferredCropIds[0] : 'soybean');
  const [activeCropId, setActiveCropId] = useState<string>(initialCrop);
  const [sortBy, setSortBy] = useState<'default' | 'distance' | 'price' | 'nrv' | 'arrivals'>('default');
  const [expectedYieldQtl, setExpectedYieldQtl] = useState<number>(20);
  
  // Commodity Picker Modal & Filter State
  const [isCommodityModalOpen, setIsCommodityModalOpen] = useState<boolean>(false);
  const [commoditySearch, setCommoditySearch] = useState<string>('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('ALL');

  // Logistics rate calculator state
  const [showLogisticsValidator, setShowLogisticsValidator] = useState<boolean>(true);
  const [isValidatedAgreement, setIsValidatedAgreement] = useState<boolean>(false);
  const [transportUnit, setTransportUnit] = useState<'₹/tonne/km' | '₹/Qtl/km'>('₹/tonne/km');
  const [ratePerTonneKm, setRatePerTonneKm] = useState<string>('30');
  const [ratePerQtlKm, setRatePerQtlKm] = useState<string>('3.0');
  const [loadingCostPerQtl, setLoadingCostPerQtl] = useState<string>('12');
  const [unloadingCostPerQtl, setUnloadingCostPerQtl] = useState<string>('8');
  const [otherCostsPerQtl, setOtherCostsPerQtl] = useState<string>('0');
  const [vehicleType, setVehicleType] = useState<string>('Tractor-Trolley (3-5 Tonnes)');

  // Synchronize when selectedCropId prop changes
  React.useEffect(() => {
    if (selectedCropId && selectedCropId !== activeCropId) {
      setActiveCropId(selectedCropId);
    }
  }, [selectedCropId]);

  const handleCropChange = (cropId: string) => {
    setActiveCropId(cropId);
    if (onSelectCrop) {
      onSelectCrop(cropId);
    }
  };

  // Parsed numerical values
  const parsedRatePerTonneKm = parseFloat(ratePerTonneKm) || 0;
  const parsedRatePerQtlKm = parseFloat(ratePerQtlKm) || 0;
  const parsedLoading = parseFloat(loadingCostPerQtl) || 0;
  const parsedUnloading = parseFloat(unloadingCostPerQtl) || 0;
  const parsedOther = parseFloat(otherCostsPerQtl) || 0;

  // Active crop metadata from canonical master
  const activeCropMeta = useMemo(() => {
    return getCanonicalCropById(activeCropId);
  }, [activeCropId]);

  const activeCommodityMapping = useMemo(() => {
    return getOfficialCommodityMapping(activeCropId);
  }, [activeCropId]);

  // Compute nearby markets strictly based on farmer's active coordinates
  const searchResults = useMemo(() => {
    return nearbyMandiService.findNearbyMarkets({
      farmLatitude: farmerLocation?.latitude ?? null,
      farmLongitude: farmerLocation?.longitude ?? null,
      state: farmerLocation?.state,
      district: farmerLocation?.district,
      cropId: activeCropId,
      initialRadiusKm: 50,
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
      expectedYieldQtl
    });
  }, [
    farmerLocation, 
    activeCropId, 
    expectedYieldQtl, 
    isValidatedAgreement, 
    transportUnit, 
    parsedRatePerTonneKm, 
    parsedRatePerQtlKm, 
    parsedLoading, 
    parsedUnloading, 
    parsedOther, 
    vehicleType
  ]);

  // Multi-crop Mandi & NRV comparative summary for all crops in preferredCropIds
  const multiCropComparisons = useMemo(() => {
    if (!preferredCropIds || preferredCropIds.length <= 1) return [];
    return preferredCropIds.map(cropId => {
      const cropInfo = getCanonicalCropById(cropId);
      const mapped = getOfficialCommodityMapping(cropId);
      const res = nearbyMandiService.findNearbyMarkets({
        farmLatitude: farmerLocation?.latitude ?? null,
        farmLongitude: farmerLocation?.longitude ?? null,
        state: farmerLocation?.state,
        district: farmerLocation?.district,
        cropId: cropId,
        initialRadiusKm: 50,
        transportInputs: {
          distanceKm: null,
          commodity: cropId,
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
        expectedYieldQtl
      });
      return {
        cropId,
        displayName: cropInfo?.cropName || mapped?.displayName || cropId,
        hindiName: cropInfo?.localNames?.hi || mapped?.hindiName || '',
        category: cropInfo?.category || mapped?.category || 'Crop',
        marketCount: res.markets.length,
        bestMarket: res.bestMarket,
        hasPrices: res.markets.length > 0 && res.bestMarket?.modalPrice !== null
      };
    });
  }, [
    preferredCropIds, 
    farmerLocation, 
    expectedYieldQtl, 
    isValidatedAgreement, 
    transportUnit, 
    parsedRatePerTonneKm, 
    parsedRatePerQtlKm, 
    parsedLoading, 
    parsedUnloading, 
    parsedOther, 
    vehicleType
  ]);

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

  // Sort according to user preference or maintain default primary/secondary ranking
  const sortedMarkets = useMemo(() => {
    const list = [...searchResults.markets];
    if (sortBy === 'distance') {
      return list.sort((a, b) => {
        if (a.distance === null) return 1;
        if (b.distance === null) return -1;
        return a.distance - b.distance;
      });
    }
    if (sortBy === 'price') {
      return list.sort((a, b) => (b.modalPrice || 0) - (a.modalPrice || 0));
    }
    if (sortBy === 'nrv') {
      return list.sort((a, b) => (b.nrvPerQtl || 0) - (a.nrvPerQtl || 0));
    }
    if (sortBy === 'arrivals') {
      return list.sort((a, b) => (b.arrivalQuantity || 0) - (a.arrivalQuantity || 0));
    }
    // Default ranking from nearbyMandiService
    return list;
  }, [searchResults.markets, sortBy]);

  const hasCoords = farmerLocation?.latitude !== undefined && farmerLocation?.latitude !== null &&
                    farmerLocation?.longitude !== undefined && farmerLocation?.longitude !== null;

  const bestMarket = searchResults.bestMarket;
  const hasCalculatedNrv = isValidatedAgreement && bestMarket?.nrvPerQtl !== null && bestMarket?.nrvPerQtl !== undefined;

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

  return (
    <div className="space-y-6 pb-16">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center">
                <Truck className="w-5 h-5" />
              </span>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                Mandi Intelligence & Net Realization Engine
              </h1>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              Live location-based market intelligence calculating straight-line Haversine distances from verified farm coordinates and transparent Net Realization (NRV).
            </p>
          </div>

          <DataStatusBadge
            metadata={AGMARKNET_METADATA}
            size="sm"
          />
        </div>

        {/* ACTIVE FARM LOCATION SUMMARY BANNER */}
        <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
                ACTIVE FARM ORIGIN
              </div>
              <div className="text-sm font-black text-slate-900 dark:text-white">
                {farmerLocation?.village || farmerLocation?.taluka ? `${farmerLocation.village || farmerLocation.taluka}, ` : ''}
                {farmerLocation?.district || 'District Not Set'}, {farmerLocation?.state || 'State Not Set'}
              </div>
              <div className="text-[11px] text-slate-500 font-mono">
                GPS: {hasCoords ? `${farmerLocation.latitude?.toFixed(4)}° N, ${farmerLocation.longitude?.toFixed(4)}° E` : 'Coordinates Not Set'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${hasCoords ? 'bg-emerald-200 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-200' : 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300'}`}>
              {hasCoords ? 'GPS COORDINATES ACTIVE' : 'NO GPS COORDINATES'}
            </span>
          </div>
        </div>

        {/* MANDI QUERY DEBUG PANEL */}
        <div className="p-4 rounded-2xl bg-slate-900 text-slate-200 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-bold text-emerald-400 text-xs uppercase tracking-wider">MANDI QUERY DEBUG & PROVENANCE</span>
            </div>
            <span className="text-[10px] text-slate-400">Single Source of Truth: FarmLocation Object</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/50">
              <span className="text-slate-400 text-[10px] block font-medium">FARM STATE</span>
              <span className="text-white font-bold">{farmerLocation?.state || 'Not Set'}</span>
            </div>
            <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/50">
              <span className="text-slate-400 text-[10px] block font-medium">FARM DISTRICT</span>
              <span className="text-white font-bold">{farmerLocation?.district || 'Not Set'}</span>
            </div>
            <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/50">
              <span className="text-slate-400 text-[10px] block font-medium">FARM COORDINATES</span>
              <span className="text-cyan-300 font-mono font-bold">
                {hasCoords ? `${farmerLocation.latitude}, ${farmerLocation.longitude}` : 'MISSING'}
              </span>
            </div>
            <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/50">
              <span className="text-slate-400 text-[10px] block font-medium">MATCHED MARKETS</span>
              <span className="text-emerald-400 font-bold">{sortedMarkets.length} APMCs in range</span>
            </div>
          </div>
        </div>

        {/* ZERO STATE NOTIFICATION WHEN NO CROPS SELECTED */}
        {preferredCropIds.length === 0 && (
          <div className="mt-4 p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5 text-amber-800 dark:text-amber-300">
              <Info className="w-4 h-4 shrink-0 text-amber-600" />
              <span>
                <strong>No crops selected in Farm Profile.</strong> Currently viewing <strong>{activeCropMeta?.cropName || activeCommodityMapping?.displayName || activeCropId}</strong>. You can switch commodities below or browse the All India catalog.
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

        {/* DYNAMIC CROP SELECTOR BAR (CANONICAL MASTER DRIVEN) */}
        <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none max-w-full">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-emerald-600" />
              Active Commodity:
            </span>

            {/* Render dynamic chips for all user selected crops */}
            {availableSelectorCrops.map(c => {
              const isActive = activeCropId.toLowerCase() === c.id.toLowerCase();
              return (
                <button
                  key={c.id}
                  onClick={() => handleCropChange(c.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-xs'
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

            {/* Quick Button to Browse/Add any commodity from All India Master */}
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
            <span>Zero fabrication &bull; AGMARKNET Official Mandi Bulletin</span>
          </div>
        </div>
      </div>

      {/* MULTI-CROP MANDI & NRV COMPARISON TABLE (When farmer has selected > 1 crop) */}
      {multiCropComparisons.length > 1 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-xs flex items-center justify-center">
                <Scale className="w-4 h-4" />
              </span>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Multi-Crop Market Realization Comparison
                </h3>
                <p className="text-xs text-slate-500">
                  Side-by-side market realization across your {preferredCropIds.length} selected crops within 200 km discovery radius.
                </p>
              </div>
            </div>
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              {preferredCropIds.length} Crops in Profile
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 text-[11px] uppercase tracking-wider bg-slate-50/50 dark:bg-slate-800/30">
                  <th className="py-2.5 px-3 font-bold">Crop / Commodity</th>
                  <th className="py-2.5 px-3 font-bold">Category</th>
                  <th className="py-2.5 px-3 font-bold">Best APMC Yard</th>
                  <th className="py-2.5 px-3 font-bold text-right">Distance</th>
                  <th className="py-2.5 px-3 font-bold text-right">Modal Price</th>
                  <th className="py-2.5 px-3 font-bold text-right">Logistics / Qtl</th>
                  <th className="py-2.5 px-3 font-bold text-right">Net Realization (NRV)</th>
                  <th className="py-2.5 px-3 font-bold text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {multiCropComparisons.map((c) => {
                  const isCurrentActive = activeCropId.toLowerCase() === c.cropId.toLowerCase();
                  const best = c.bestMarket;
                  return (
                    <tr 
                      key={c.cropId} 
                      className={`hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${
                        isCurrentActive ? 'bg-emerald-50/40 dark:bg-emerald-950/20 font-medium' : ''
                      }`}
                    >
                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                          <span>{c.displayName}</span>
                          {isCurrentActive && (
                            <span className="px-1.5 py-0.2 rounded bg-emerald-600 text-white text-[9px] font-bold">
                              ACTIVE
                            </span>
                          )}
                        </div>
                        {c.hindiName && (
                          <span className="text-[10px] text-slate-500 block">
                            {c.hindiName}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-semibold">
                          {c.category}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        {best ? (
                          <div>
                            <span className="font-bold text-slate-800 dark:text-slate-200">{best.market}</span>
                            <span className="text-[10px] text-slate-500 block">{best.district}, {best.state}</span>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">No APMC in radius</span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-right">
                        {best?.distance !== null && best?.distance !== undefined ? (
                          <span className="font-bold text-slate-800 dark:text-slate-200">~{best.distance} km</span>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-right font-bold">
                        {best?.modalPrice !== null && best?.modalPrice !== undefined ? (
                          <span className="text-emerald-700 dark:text-emerald-400">₹{best.modalPrice.toLocaleString('en-IN')}/Qtl</span>
                        ) : (
                          <span className="text-slate-400 italic">Unavailable</span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-right">
                        {best?.transportCostPerQtl !== null && best?.transportCostPerQtl !== undefined ? (
                          <span className="text-rose-600 dark:text-rose-400 font-semibold">−₹{best.estimatedFreightPerQtl + (best.estimatedHamaliAndCess || 0)}</span>
                        ) : (
                          <span className="text-slate-400 italic">Not Applied</span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-right">
                        {best?.nrvPerQtl !== null && best?.nrvPerQtl !== undefined ? (
                          <div>
                            <span className="text-sm font-black text-emerald-800 dark:text-emerald-300">
                              ₹{best.nrvPerQtl.toLocaleString('en-IN')}
                            </span>
                            <span className="text-[10px] text-slate-500 block font-normal">
                              (₹{best.nrvPerKg}/kg)
                            </span>
                          </div>
                        ) : best?.modalPrice ? (
                          <span className="text-[10px] text-amber-700 dark:text-amber-400 font-semibold">
                            Modal: ₹{best.modalPrice}
                          </span>
                        ) : (
                          <span className="text-slate-400 italic">N/A</span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <button
                          onClick={() => handleCropChange(c.cropId)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                            isCurrentActive
                              ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-emerald-600 hover:text-white'
                          }`}
                        >
                          {isCurrentActive ? 'Viewing' : 'Focus Mandis'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

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
                    Select All India Commodity
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

      {/* SECTION 2: TRANSPORT COST CALCULATOR & LOGISTICS INPUTS */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-xs flex items-center justify-center">
              <Calculator className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Transport Cost & Logistics Rate Calculator
              </h3>
              <p className="text-xs text-slate-500">
                Uses verified farm-to-mandi straight-line distances. Enter your confirmed transport rate to compute Net Realization Value (NRV).
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200 cursor-pointer bg-slate-50 dark:bg-slate-800 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs">
              <input
                type="checkbox"
                checked={isValidatedAgreement}
                onChange={(e) => setIsValidatedAgreement(e.target.checked)}
                className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
              />
              <span>Apply Transport & Logistics Rates</span>
            </label>
            <button
              onClick={() => setShowLogisticsValidator(prev => !prev)}
              className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {showLogisticsValidator ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {showLogisticsValidator && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              {/* Transport Rate Input with Unit Selector */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase">
                    Transport Rate Unit
                  </label>
                  <span className="text-[10px] text-emerald-600 font-bold">
                    {transportUnit}
                  </span>
                </div>
                <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setTransportUnit('₹/tonne/km')}
                    className={`flex-1 py-1 px-2 rounded-lg text-[11px] font-bold transition-all ${
                      transportUnit === '₹/tonne/km'
                        ? 'bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-300 shadow-xs'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    ₹ / tonne / km
                  </button>
                  <button
                    type="button"
                    onClick={() => setTransportUnit('₹/Qtl/km')}
                    className={`flex-1 py-1 px-2 rounded-lg text-[11px] font-bold transition-all ${
                      transportUnit === '₹/Qtl/km'
                        ? 'bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-300 shadow-xs'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    ₹ / Qtl / km
                  </button>
                </div>
              </div>

              {/* Rate Value Input */}
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-500 uppercase">
                  Transport Rate ({transportUnit})
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step={transportUnit === '₹/tonne/km' ? '1' : '0.1'}
                    min="0"
                    value={transportUnit === '₹/tonne/km' ? ratePerTonneKm : ratePerQtlKm}
                    onChange={(e) => {
                      if (transportUnit === '₹/tonne/km') {
                        setRatePerTonneKm(e.target.value);
                      } else {
                        setRatePerQtlKm(e.target.value);
                      }
                    }}
                    placeholder={transportUnit === '₹/tonne/km' ? '30' : '3.0'}
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-xs"
                  />
                  <span className="absolute right-3 top-2 text-[10px] text-slate-400 font-bold">
                    {transportUnit}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 block">
                  {transportUnit === '₹/tonne/km' 
                    ? `Equivalent to ₹${((parseFloat(ratePerTonneKm) || 0) / 10).toFixed(2)}/Qtl/km (1 Tonne = 10 Quintals)` 
                    : `Equivalent to ₹${((parseFloat(ratePerQtlKm) || 0) * 10).toFixed(0)}/tonne/km`}
                </span>
              </div>

              {/* Loading Charges */}
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-500 uppercase">
                  Loading / Handling (₹ / Qtl)
                </label>
                <input
                  type="number"
                  min="0"
                  value={loadingCostPerQtl}
                  onChange={(e) => setLoadingCostPerQtl(e.target.value)}
                  placeholder="12"
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-xs"
                />
                <span className="text-[10px] text-slate-400 block">Farm gate loading fee</span>
              </div>

              {/* Mandi Unloading / Hamali */}
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-500 uppercase">
                  Mandi Unloading / Hamali (₹ / Qtl)
                </label>
                <input
                  type="number"
                  min="0"
                  value={unloadingCostPerQtl}
                  onChange={(e) => setUnloadingCostPerQtl(e.target.value)}
                  placeholder="8"
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-xs"
                />
                <span className="text-[10px] text-slate-400 block">Mandi labor fee</span>
              </div>
            </div>

            {/* Transparent Calculation Formula Explanation */}
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 space-y-1">
              <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                <Info className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Transparent Transport & NRV Calculation Formula:</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px] text-slate-600 dark:text-slate-400 pl-6">
                <div>
                  <strong>Transport Cost/Qtl:</strong> {transportUnit === '₹/tonne/km' ? '(Rate per Tonne per km ÷ 10) × Distance (km)' : 'Rate per Qtl per km × Distance (km)'}
                </div>
                <div>
                  <strong>Net Realization (NRV/Qtl):</strong> Modal Price − Transport Cost − Loading − Unloading − Other Costs
                </div>
              </div>
              {!isValidatedAgreement && (
                <div className="pl-6 text-[11px] text-amber-700 dark:text-amber-300 font-semibold pt-1">
                  ⚠️ Transport rates not applied. Check "Apply Transport & Logistics Rates" above to compute verified NRV. Until enabled, markets are ranked by Modal Price and Distance.
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* SECTION 5: BEST MANDI CARD */}
      {bestMarket && (
        <div className="bg-white dark:bg-slate-900 border-2 border-emerald-500/50 dark:border-emerald-500/30 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-emerald-600 text-white font-black text-xs flex items-center justify-center shadow-xs">
                #1
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {hasCalculatedNrv ? 'BEST MANDI FOR YOUR FARM' : 'BEST AVAILABLE MARKET'}
              </h3>
            </div>

            <span className={`px-3 py-1 rounded-xl text-xs font-bold ${
              hasCalculatedNrv
                ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800'
                : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-200 border border-amber-300 dark:border-amber-800'
            }`}>
              {hasCalculatedNrv 
                ? 'BEST REALIZATION — Based on verified NRV' 
                : 'BEST MARKET AVAILABLE — NRV unavailable — ranked by Modal Price and distance'}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 pt-1">
            {/* Main Best Mandi Info */}
            <div className="lg:col-span-2 p-5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <span>{bestMarket.market} APMC</span>
                    <span className="text-xs px-2 py-0.5 rounded-md bg-emerald-200 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-200 font-bold">
                      TOP RANKED (#1)
                    </span>
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                    {bestMarket.district}, {bestMarket.state} &bull; Distance: <strong>~{bestMarket.distance} km</strong> (ESTIMATED STRAIGHT-LINE DISTANCE)
                  </div>
                </div>

                <div className="text-left sm:text-right">
                  <div className="text-[10px] text-slate-500 font-bold uppercase">Official Modal Price</div>
                  <div className="text-2xl font-black text-slate-900 dark:text-white">
                    ₹{bestMarket.modalPrice?.toLocaleString('en-IN')} <span className="text-xs font-semibold text-slate-500">/ Qtl</span>
                  </div>
                  <div className="text-[10px] text-slate-500">
                    ₹{bestMarket.modalPricePerKg} / kg
                  </div>
                </div>
              </div>

              {/* Waterfall Breakdown if NRV is calculated */}
              {hasCalculatedNrv ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-emerald-200 dark:border-emerald-900/60 text-center">
                  <div className="bg-white/80 dark:bg-slate-900/80 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                    <div className="text-[10px] text-slate-500 uppercase font-bold">Modal Price</div>
                    <div className="text-sm font-black text-slate-900 dark:text-white mt-0.5">
                      ₹{bestMarket.modalPrice?.toLocaleString('en-IN')}
                    </div>
                    <div className="text-[9px] text-slate-400">/ Quintal</div>
                  </div>

                  <div className="bg-white/80 dark:bg-slate-900/80 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                    <div className="text-[10px] text-rose-600 uppercase font-bold">Transport Cost</div>
                    <div className="text-sm font-black text-rose-600 mt-0.5">
                      −₹{bestMarket.estimatedFreightPerQtl}
                    </div>
                    <div className="text-[9px] text-slate-400">/ Qtl ({bestMarket.distance} km)</div>
                  </div>

                  <div className="bg-white/80 dark:bg-slate-900/80 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                    <div className="text-[10px] text-rose-600 uppercase font-bold">Loading / Handling</div>
                    <div className="text-sm font-black text-rose-600 mt-0.5">
                      −₹{bestMarket.estimatedHamaliAndCess || 0}
                    </div>
                    <div className="text-[9px] text-slate-400">/ Qtl labor</div>
                  </div>

                  <div className="bg-emerald-600 text-white p-2.5 rounded-xl shadow-xs">
                    <div className="text-[10px] text-emerald-100 uppercase font-bold">Net Realization (NRV)</div>
                    <div className="text-sm font-black mt-0.5">
                      ₹{bestMarket.nrvPerQtl?.toLocaleString('en-IN')}
                    </div>
                    <div className="text-[9px] text-emerald-200">/ Qtl (₹{bestMarket.nrvPerKg}/kg)</div>
                  </div>
                </div>
              ) : (
                <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-xs text-amber-900 dark:text-amber-200 space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>NET REALIZATION NOT AVAILABLE</span>
                  </div>
                  <p className="text-[11px] text-amber-800 dark:text-amber-300">
                    Reason: Verified logistics cost data required. Check <strong>"Apply Transport & Logistics Rates"</strong> in the calculator above to calculate NRV for all markets.
                  </p>
                </div>
              )}
            </div>

            {/* Provenance & Source Card */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col justify-between space-y-3">
              <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                <div className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[10px]">
                  Source & Provenance
                </div>
                <div>Source: <strong className="text-slate-800 dark:text-slate-200">Official AGMARKNET</strong></div>
                <div>Commodity: <strong className="text-slate-800 dark:text-slate-200">{bestMarket.commodity} ({bestMarket.variety})</strong></div>
                <div>Grade: <strong className="text-slate-800 dark:text-slate-200">{bestMarket.grade}</strong></div>
                <div>Market Date: <strong className="text-slate-800 dark:text-slate-200">{bestMarket.priceDate}</strong></div>
                <div>Distance Standard: <strong className="text-emerald-600">Haversine Straight-Line</strong></div>
              </div>

              {bestMarket.sourceUrl && (
                <a
                  href={bestMarket.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center justify-center gap-1.5"
                >
                  <span>VIEW AGMARKNET SOURCE</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 4: MANDI COMPARISON TABLE */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Store className="w-5 h-5 text-emerald-600" />
              <span>Mandi Market Comparison for {activeCropId.toUpperCase()} ({sortedMarkets.length} Available)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {hasCalculatedNrv 
                ? 'Ranked by highest Net Realization Value (NRV/Qtl) after verified transport and handling deductions.' 
                : 'Ranked by official spot Modal Price and proximity distance (NRV requires logistics rate).'}
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 font-medium">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold"
            >
              <option value="default">Default ({hasCalculatedNrv ? 'Best NRV' : 'Modal Price & Distance'})</option>
              <option value="nrv">Highest Net Realization (NRV)</option>
              <option value="price">Highest Modal Price</option>
              <option value="distance">Lowest Distance (Closest First)</option>
              <option value="arrivals">Highest Arrivals (Liquidity)</option>
            </select>
          </div>
        </div>

        {/* Distance Standard Explanatory Box */}
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 space-y-1">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              <strong>Distance Standard:</strong> Calculated using Haversine algorithm from verified farm GPS coordinates to APMC yard coordinates. Labeled as <span className="font-bold underline">ESTIMATED STRAIGHT-LINE DISTANCE</span> (not road odometer distance).
            </span>
          </div>
          <div className="pl-6 text-[11px] text-slate-500">
            <strong>Provenance Standard:</strong> All modal prices originate directly from AGMARKNET official market reporting. 1 Quintal = 100 kg.
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold uppercase tracking-wider text-[10px] border-y border-slate-200 dark:border-slate-700">
              <tr>
                <th className="py-3 px-3 text-center">Rank</th>
                <th className="py-3 px-4">APMC Mandi & State</th>
                <th className="py-3 px-3">Commodity & Variety</th>
                <th className="py-3 px-3 text-right">Modal Price</th>
                <th className="py-3 px-3 text-right">Distance</th>
                <th className="py-3 px-3 text-right">Transport Cost</th>
                <th className="py-3 px-3 text-right">Loading/Handling</th>
                <th className="py-3 px-4 text-right">NRV / Qtl</th>
                <th className="py-3 px-3 text-right">NRV / kg</th>
                <th className="py-3 px-3 text-center">Data Date</th>
                <th className="py-3 px-3 text-center">Source & Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              {sortedMarkets.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-12 px-4 text-center">
                    <div className="max-w-md mx-auto space-y-3">
                      <MapPin className="w-10 h-10 text-emerald-600 dark:text-emerald-400 mx-auto opacity-70" />
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        {!hasCoords 
                          ? 'Select your farm location to find nearby APMC markets' 
                          : 'No verified APMC markets found for this farm location.'}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {!hasCoords
                          ? 'Please configure your State, District, and Farm Coordinates in Farm Location step to enable distance-based APMC routing.'
                          : `No official APMC market records matching ${activeCropId.toUpperCase()} were found in the vicinity of ${farmerLocation?.district || ''}, ${farmerLocation?.state || ''}.`}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                sortedMarkets.map((m, idx) => {
                  const isTop = idx === 0;
                  return (
                    <tr 
                      key={m.marketId} 
                      className={isTop ? 'bg-emerald-50/50 dark:bg-emerald-950/30 font-semibold' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'}
                    >
                      {/* Rank Number */}
                      <td className="py-3.5 px-3 text-center">
                        <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-black ${
                          isTop 
                            ? 'bg-emerald-600 text-white shadow-xs' 
                            : idx === 1 
                            ? 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200' 
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                        }`}>
                          #{m.rankNumber || idx + 1}
                        </span>
                      </td>

                      {/* APMC & State */}
                      <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                        <div className="flex items-center gap-1.5">
                          <span>{m.market}</span>
                          {m.coordinateQuality === 'VERIFIED' && (
                            <span className="px-1.5 py-0.2 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[9px] font-bold">
                              GPS VERIFIED
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-500 font-normal block">
                          {m.district}, {m.state}
                        </span>
                      </td>

                      {/* Commodity & Variety */}
                      <td className="py-3.5 px-3">
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{m.commodity}</span>
                        <span className="text-[10px] text-slate-500 block">{m.variety} &bull; {m.grade}</span>
                      </td>

                      {/* Modal Price */}
                      <td className="py-3.5 px-3 text-right font-bold text-slate-900 dark:text-white">
                        {m.modalPrice !== null ? (
                          <>
                            <span className="text-sm font-black">₹{m.modalPrice.toLocaleString('en-IN')}</span>
                            <span className="text-[10px] text-slate-500 block font-normal">₹/Qtl</span>
                          </>
                        ) : (
                          <span className="text-slate-400 italic">UNAVAILABLE</span>
                        )}
                      </td>

                      {/* Distance */}
                      <td className="py-3.5 px-3 text-right">
                        {m.distance !== null ? (
                          <>
                            <span className="font-bold text-slate-800 dark:text-slate-200">
                              ~{m.distance} km
                            </span>
                            <span className="text-[9px] text-slate-400 block font-mono">
                              EST. STRAIGHT-LINE
                            </span>
                          </>
                        ) : (
                          <span className="text-[10px] text-slate-400 font-medium italic">
                            UNAVAILABLE
                          </span>
                        )}
                      </td>

                      {/* Transport Cost */}
                      <td className="py-3.5 px-3 text-right text-slate-500 font-medium">
                        {m.transportCostPerQtl !== null && m.transportCostPerQtl !== undefined ? (
                          <>
                            <span className="text-rose-600 dark:text-rose-400 font-bold">−₹{m.estimatedFreightPerQtl}</span>
                            <span className="text-[9px] text-slate-400 block font-normal">₹/Qtl</span>
                          </>
                        ) : (
                          <span className="text-[10px] text-slate-400 font-medium italic">
                            Not Available
                          </span>
                        )}
                      </td>

                      {/* Loading/Handling */}
                      <td className="py-3.5 px-3 text-right text-slate-500 font-medium">
                        {m.estimatedHamaliAndCess !== null && m.estimatedHamaliAndCess !== undefined ? (
                          <>
                            <span className="text-rose-600 dark:text-rose-400 font-bold">−₹{m.estimatedHamaliAndCess}</span>
                            <span className="text-[9px] text-slate-400 block font-normal">₹/Qtl</span>
                          </>
                        ) : (
                          <span className="text-[10px] text-slate-400 font-medium italic">
                            -
                          </span>
                        )}
                      </td>

                      {/* NRV / Qtl */}
                      <td className="py-3.5 px-4 text-right">
                        {m.nrvPerQtl !== null && m.nrvPerQtl !== undefined ? (
                          <span className="text-sm font-black text-emerald-700 dark:text-emerald-400">
                            ₹{m.nrvPerQtl.toLocaleString('en-IN')}
                          </span>
                        ) : (
                          <span className="text-[10px] text-amber-700 dark:text-amber-300 font-semibold block" title="Verified logistics cost data required">
                            NOT AVAILABLE
                          </span>
                        )}
                      </td>

                      {/* NRV / kg */}
                      <td className="py-3.5 px-3 text-right">
                        {m.nrvPerKg !== null && m.nrvPerKg !== undefined ? (
                          <span className="font-bold text-slate-800 dark:text-slate-200">
                            ₹{m.nrvPerKg}
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-400 italic">
                            -
                          </span>
                        )}
                      </td>

                      {/* Data Date */}
                      <td className="py-3.5 px-3 text-center text-[11px] text-slate-600 dark:text-slate-400">
                        {m.priceDate}
                      </td>

                      {/* Source & Status */}
                      <td className="py-3.5 px-3 text-center">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                          Official AGMARKNET
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

