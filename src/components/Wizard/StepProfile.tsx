import React from 'react';
import { 
  FarmerProfile, 
  FarmLocation, 
  LandAndIrrigation, 
  SoilIntelligence, 
  CropSeason, 
  LandholdingCategory, 
  Language, 
  SoilOrder, 
  WaterSource, 
  IrrigationMethod 
} from '../../types';
import { 
  User, 
  Phone, 
  Briefcase, 
  Shield, 
  Target, 
  IndianRupee, 
  MapPin, 
  Layers, 
  Droplets, 
  FlaskConical, 
  Wheat, 
  Calendar, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  Sparkles,
  Compass,
  FileCheck,
  Building
} from 'lucide-react';
import { DataStatusBadge } from '../DataStatusBadge';
import { INDIAN_STATES, INDIAN_DISTRICTS, AGRO_CLIMATIC_ZONES } from '../../data/officialData';

interface StepProfileProps {
  farmer: FarmerProfile;
  location: FarmLocation;
  land: LandAndIrrigation;
  soil: SoilIntelligence;
  targetSeason: CropSeason;
  onFarmerChange: (farmer: FarmerProfile) => void;
  onLocationChange: (location: FarmLocation) => void;
  onLandChange: (land: LandAndIrrigation) => void;
  onSoilChange: (soil: SoilIntelligence) => void;
  onSeasonChange: (season: CropSeason) => void;
  onNext: () => void;
  onBack?: () => void;
  language: Language;
}

export const StepProfile: React.FC<StepProfileProps> = ({
  farmer,
  location,
  land,
  soil,
  targetSeason,
  onFarmerChange,
  onLocationChange,
  onLandChange,
  onSoilChange,
  onSeasonChange,
  onNext,
  onBack,
  language
}) => {
  const categories: LandholdingCategory[] = [
    'Marginal (< 2.5 Acres)',
    'Small (2.5 - 5 Acres)',
    'Semi-Medium (5 - 10 Acres)',
    'Medium (10 - 25 Acres)',
    'Large (> 25 Acres)'
  ];

  const soilOrders: SoilOrder[] = [
    'Alluvial Soil (Entisols / Inceptisols)',
    'Black Cotton Soil (Vertisols)',
    'Red & Yellow Soil (Alfisols / Ultisols)',
    'Laterite Soil (Oxisols)',
    'Arid / Desert Soil (Aridisols)',
    'Saline / Alkaline Soil',
    'Peaty / Organic Soil'
  ];

  const waterSources: WaterSource[] = [
    'Borewell / Tube Well',
    'Canal Command Area',
    'Open Dug Well',
    'River / Lift Irrigation',
    'Farm Pond / Check Dam',
    'Rainfed Only (No assured irrigation)'
  ];

  const irrigationMethods: IrrigationMethod[] = [
    'Drip Irrigation (Micro-irrigation)',
    'Sprinkler Irrigation',
    'Furrow / Ridge Irrigation',
    'Flood / Basin Irrigation'
  ];

  // Handle District selection update
  const handleDistrictChange = (districtName: string) => {
    const matched = INDIAN_DISTRICTS.find(d => d.district === districtName);
    if (matched) {
      const zone = AGRO_CLIMATIC_ZONES.find(z => z.id === matched.zoneId) || AGRO_CLIMATIC_ZONES[7];
      onLocationChange({
        ...location,
        district: matched.district,
        state: matched.state,
        latitude: matched.latitude,
        longitude: matched.longitude,
        agroClimaticZoneId: zone.id,
        agroClimaticZoneName: zone.name,
        normalAnnualRainfallMm: matched.normalRainfallMm
      });
    }
  };

  return (
    <div className="space-y-8 pb-12" id="farmer-profile-page">
      {/* 1. Page Header with Official Badge */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <span className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center text-sm font-black shadow-sm">
                1
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
                FARMER PROFILE
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              {language === 'en'
                ? 'Comprehensive Agricultural Baseline & Farm Parameters for Precision CACP Recommendations'
                : 'सटीक कृषि-आर्थिक व सीएसीपी सिफारिशों हेतु संपूर्ण किसान प्रोफ़ाइल एवं कृषि आधार'}
            </p>
          </div>

          <DataStatusBadge
            status="LATEST_AVAILABLE"
            sourceText="Farmer Baseline & Operating Constraints"
            dateText="Active Session"
            size="sm"
          />
        </div>

        {/* Quick Summary Pill Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-5">
          <div className="p-3 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/50">
            <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300 uppercase block">Farmer</span>
            <span className="text-xs font-black text-slate-900 dark:text-white truncate block">{farmer.name}</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
            <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300 uppercase block">Location</span>
            <span className="text-xs font-black text-slate-900 dark:text-white truncate block">{location.district}, {location.state}</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
            <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300 uppercase block">Land Holding</span>
            <span className="text-xs font-black text-slate-900 dark:text-white truncate block">{land.totalLandAcres} Acres</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
            <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300 uppercase block">Water Source</span>
            <span className="text-xs font-black text-slate-900 dark:text-white truncate block">{land.primaryWaterSource.split(' ')[0]}</span>
          </div>
        </div>
      </div>

      {/* 2. SECTION 1: Farmer Information */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold">
            <User className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              1. Farmer Information
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Identity, operating experience, risk appetite, and working capital budget.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Farmer Name */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Farmer / Farm Entity Name
            </label>
            <input
              type="text"
              id="input-farmer-name"
              value={farmer.name}
              onChange={(e) => onFarmerChange({ ...farmer, name: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              placeholder="e.g. Ramesh Patel"
            />
          </div>

          {/* Mobile Number */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              <Phone className="inline w-3.5 h-3.5 mr-1 text-emerald-600" />
              Mobile Number (SMS Mandi Advisory)
            </label>
            <input
              type="tel"
              id="input-farmer-mobile"
              value={farmer.mobile || ''}
              onChange={(e) => onFarmerChange({ ...farmer, mobile: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              placeholder="e.g. 9876543210"
            />
          </div>

          {/* Landholding Category */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Operational Landholding Category
            </label>
            <select
              id="select-landholding-category"
              value={farmer.farmerType}
              onChange={(e) => onFarmerChange({ ...farmer, farmerType: e.target.value as LandholdingCategory })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden cursor-pointer"
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Farming Experience */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              <Briefcase className="inline w-3.5 h-3.5 mr-1 text-emerald-600" />
              Farming Experience (Years)
            </label>
            <input
              type="number"
              min={0}
              max={65}
              id="input-farmer-experience"
              value={farmer.experienceYears || 0}
              onChange={(e) => onFarmerChange({ ...farmer, experienceYears: Number(e.target.value) })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            />
          </div>

          {/* Risk Tolerance */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              <Shield className="inline w-3.5 h-3.5 mr-1 text-emerald-600" />
              Risk Tolerance Appetite
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['Conservative', 'Moderate', 'Aggressive'] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => onFarmerChange({ ...farmer, riskTolerance: r })}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    farmer.riskTolerance === r
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-300 ring-2 ring-emerald-500'
                      : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Primary Goal */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              <Target className="inline w-3.5 h-3.5 mr-1 text-emerald-600" />
              Primary Farming Strategy
            </label>
            <select
              id="select-primary-goal"
              value={farmer.primaryGoal}
              onChange={(e) => onFarmerChange({ ...farmer, primaryGoal: e.target.value as any })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden cursor-pointer"
            >
              <option value="Max Profit">Maximize Net Profit per Acre</option>
              <option value="Guaranteed Minimum Return (MSP focus)">Guaranteed Downside Protection (MSP & Procurement Focus)</option>
              <option value="Low Water Risk">Water-Resilient Security (Low water footprint)</option>
              <option value="Low Working Capital">Low Initial Capital Input (Cost conservation)</option>
            </select>
          </div>

          {/* Working Capital Budget */}
          <div className="md:col-span-2">
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                <IndianRupee className="inline w-3.5 h-3.5 mr-1 text-emerald-600" />
                Available Working Capital Budget
              </label>
              <span className="text-sm font-black text-emerald-700 dark:text-emerald-400">
                ₹{farmer.workingCapitalBudget.toLocaleString('en-IN')}
              </span>
            </div>
            <input
              type="range"
              min={10000}
              max={500000}
              step={5000}
              id="range-working-capital"
              value={farmer.workingCapitalBudget}
              onChange={(e) => onFarmerChange({ ...farmer, workingCapitalBudget: Number(e.target.value) })}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-600 dark:text-slate-300 mt-1 font-medium">
              <span>₹10,000 (Marginal)</span>
              <span>₹2,50,000</span>
              <span>₹5,00,000+ (Commercial)</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SECTION 2: Farm Location */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              2. Farm Location
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Administrative district, taluka, village, and Planning Commission Agro-Climatic Zone.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* State */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              State / Union Territory
            </label>
            <select
              id="select-farm-state"
              value={location.state}
              onChange={(e) => {
                const newState = e.target.value;
                const firstDistrict = INDIAN_DISTRICTS.find(d => d.state === newState) || INDIAN_DISTRICTS[0];
                handleDistrictChange(firstDistrict.district);
              }}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden cursor-pointer"
            >
              {INDIAN_STATES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* District */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              District (Official Catalog)
            </label>
            <select
              id="select-farm-district"
              value={location.district}
              onChange={(e) => handleDistrictChange(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden cursor-pointer"
            >
              {INDIAN_DISTRICTS.filter(d => d.state === location.state).map((d) => (
                <option key={d.district} value={d.district}>{d.district}</option>
              ))}
            </select>
          </div>

          {/* Taluka / Tehsil */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Taluka / Tehsil / Block
            </label>
            <input
              type="text"
              id="input-farm-taluka"
              value={location.taluka || ''}
              onChange={(e) => onLocationChange({ ...location, taluka: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              placeholder="e.g. Sanwer"
            />
          </div>

          {/* Village */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Village / Gram Panchayat
            </label>
            <input
              type="text"
              id="input-farm-village"
              value={location.village || ''}
              onChange={(e) => onLocationChange({ ...location, village: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              placeholder="e.g. Hatod"
            />
          </div>

          {/* Agro Climatic Zone (Calibrated) */}
          <div className="md:col-span-2 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 block">
                Agro-Climatic Delineation (Zone {location.agroClimaticZoneId})
              </span>
              <span className="text-xs font-extrabold text-slate-900 dark:text-white">
                {location.agroClimaticZoneName} &bull; Normal Rainfall: {location.normalAnnualRainfallMm} mm
              </span>
            </div>
            <div className="text-[11px] text-slate-600 dark:text-slate-300 font-mono">
              GPS: {location.latitude?.toFixed(4)}° N, {location.longitude?.toFixed(4)}° E &bull; Alt: {location.altitudeMeters || 550}m
            </div>
          </div>
        </div>
      </section>

      {/* 4. SECTION 3: Land Size */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              3. Land Size & Metric Area
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Total operational holding, planned seasonal acreage, and land normalization.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Total Land Holding */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Total Land Holding (Acres)
            </label>
            <input
              type="number"
              min={0.25}
              max={500}
              step={0.25}
              id="input-total-land-acres"
              value={land.totalLandAcres}
              onChange={(e) => {
                const val = Number(e.target.value);
                onLandChange({
                  ...land,
                  totalLandAcres: val,
                  plannedLandAllocationAcres: Math.min(land.plannedLandAllocationAcres, val),
                  normalizedHectares: Number((val * 0.404686).toFixed(2)),
                  normalizedSquareMetres: Math.round(val * 4046.86)
                });
              }}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            />
          </div>

          {/* Planned Allocation */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Target Crop Allocation (Acres)
            </label>
            <input
              type="number"
              min={0.25}
              max={land.totalLandAcres}
              step={0.25}
              id="input-planned-land-acres"
              value={land.plannedLandAllocationAcres}
              onChange={(e) => onLandChange({ ...land, plannedLandAllocationAcres: Number(e.target.value) })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            />
          </div>

          {/* Standard Unit Conversion */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Metric Equivalence
            </label>
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <span>{land.normalizedHectares || (land.totalLandAcres * 0.4047).toFixed(2)} Hectares</span>
              <span className="text-slate-400 font-normal">({(land.totalLandAcres * 4046.86).toLocaleString('en-IN')} m²)</span>
            </div>
          </div>
        </div>
      </section>

      {/* 5. SECTION 4: Irrigation */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold">
            <Droplets className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              4. Irrigation & Water Infrastructure
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Primary water sources, irrigation delivery systems, and hydrological reliability index.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Primary Water Source */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Primary Water Source
            </label>
            <select
              id="select-primary-water-source"
              value={land.primaryWaterSource}
              onChange={(e) => onLandChange({ ...land, primaryWaterSource: e.target.value as WaterSource })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden cursor-pointer"
            >
              {waterSources.map((w) => (
                <option key={w} value={w}>{w}</option>
              ))}
            </select>
          </div>

          {/* Delivery Method */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Irrigation Delivery Method
            </label>
            <select
              id="select-irrigation-method"
              value={land.irrigationMethod}
              onChange={(e) => onLandChange({ ...land, irrigationMethod: e.target.value as IrrigationMethod })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden cursor-pointer"
            >
              {irrigationMethods.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          {/* Irrigated vs Rainfed Area */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Irrigated Area (Acres)
            </label>
            <input
              type="number"
              min={0}
              max={land.totalLandAcres}
              step={0.25}
              id="input-irrigated-acres"
              value={land.irrigatedAreaAcres}
              onChange={(e) => {
                const val = Number(e.target.value);
                onLandChange({
                  ...land,
                  irrigatedAreaAcres: val,
                  rainfedAreaAcres: Math.max(0, land.totalLandAcres - val)
                });
              }}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            />
          </div>

          {/* Water Availability Duration */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Water Availability (Months / Year)
            </label>
            <input
              type="number"
              min={1}
              max={12}
              id="input-months-water"
              value={land.monthsWaterAvailable || 10}
              onChange={(e) => onLandChange({ ...land, monthsWaterAvailable: Number(e.target.value) })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            />
          </div>
        </div>
      </section>

      {/* 6. SECTION 5: Soil Information */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold">
            <FlaskConical className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              5. Soil Information & Health Card (SHC)
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Taxonomical order, laboratory pH, organic carbon, and NPK macronutrient thresholds.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Soil Order */}
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              ICAR-NBSS&LUP Soil Order
            </label>
            <select
              id="select-soil-order"
              value={soil.soilOrder}
              onChange={(e) => onSoilChange({ ...soil, soilOrder: e.target.value as SoilOrder })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden cursor-pointer"
            >
              {soilOrders.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Soil Health Card Toggle */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Soil Health Card (SHC)
            </label>
            <div className="flex items-center gap-3 h-10.5">
              <label className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  id="checkbox-has-shc"
                  checked={soil.hasSoilHealthCard}
                  onChange={(e) => onSoilChange({ ...soil, hasSoilHealthCard: e.target.checked })}
                  className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
                />
                <span>Card Available</span>
              </label>
              {soil.hasSoilHealthCard && (
                <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-mono font-bold">
                  {soil.shcNumber || 'MP-2024-8849'}
                </span>
              )}
            </div>
          </div>

          {/* pH Level */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Soil pH Level (Reaction)
            </label>
            <input
              type="number"
              min={4.0}
              max={10.0}
              step={0.1}
              id="input-soil-ph"
              value={soil.ph}
              onChange={(e) => onSoilChange({ ...soil, ph: Number(e.target.value) })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            />
            <span className="text-[10px] text-slate-500 mt-1 block">
              {soil.ph < 6.0 ? 'Acidic' : soil.ph <= 7.5 ? 'Neutral (Optimal)' : 'Alkaline / Calcareous'}
            </span>
          </div>

          {/* Organic Carbon % */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Organic Carbon (OC %)
            </label>
            <input
              type="number"
              min={0.1}
              max={2.0}
              step={0.05}
              id="input-soil-oc"
              value={soil.organicCarbonPercent}
              onChange={(e) => onSoilChange({ ...soil, organicCarbonPercent: Number(e.target.value) })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            />
            <span className="text-[10px] text-slate-500 mt-1 block">
              {soil.organicCarbonPercent < 0.5 ? 'Low (<0.5%)' : soil.organicCarbonPercent <= 0.75 ? 'Medium (0.5-0.75%)' : 'High (>0.75%)'}
            </span>
          </div>

          {/* Texture */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Soil Texture Class
            </label>
            <select
              id="select-soil-texture"
              value={soil.texture}
              onChange={(e) => onSoilChange({ ...soil, texture: e.target.value as any })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden cursor-pointer"
            >
              <option value="Clay Loam">Clay Loam (Heavy water retention)</option>
              <option value="Sandy Loam">Sandy Loam (Light & well-drained)</option>
              <option value="Heavy Clay">Heavy Clay (Vertisolic)</option>
              <option value="Silty Loam">Silty Loam</option>
              <option value="Sandy">Sandy</option>
            </select>
          </div>
        </div>
      </section>

      {/* 7. SECTION 6: Current / Previous Crop */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold">
            <Wheat className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              6. Current / Previous Crop & Cropping Pattern
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Crop rotation history and existing standing field crops.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Current Crop */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Current Standing Crop
            </label>
            <input
              type="text"
              id="input-current-crop"
              value={land.characteristics?.currentCrop || 'Soybean'}
              onChange={(e) => onLandChange({
                ...land,
                characteristics: {
                  ...land.characteristics!,
                  currentCrop: e.target.value
                }
              })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              placeholder="e.g. Soybean"
            />
          </div>

          {/* Previous Crop */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Previous Season Harvested Crop
            </label>
            <input
              type="text"
              id="input-previous-crop"
              value={land.characteristics?.previousCrop || 'Wheat'}
              onChange={(e) => onLandChange({
                ...land,
                characteristics: {
                  ...land.characteristics!,
                  previousCrop: e.target.value
                }
              })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              placeholder="e.g. Wheat"
            />
          </div>
        </div>
      </section>

      {/* 8. SECTION 7: Planting Date & Season */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              7. Proposed Planting Date & Target Season
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Calendar sowing window aligned with IMD monsoon onset timelines.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Target Season */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Agronomic Season
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['Kharif', 'Rabi', 'Zaid'] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => onSeasonChange(s)}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    targetSeason === s
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-300 ring-2 ring-emerald-500'
                      : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Sowing Date */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Proposed Sowing Date
            </label>
            <input
              type="date"
              id="input-planting-date"
              value={land.characteristics?.proposedPlantingDate || new Date().toISOString().split('T')[0]}
              onChange={(e) => onLandChange({
                ...land,
                characteristics: {
                  ...land.characteristics!,
                  proposedPlantingDate: e.target.value
                }
              })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden cursor-pointer"
            />
          </div>
        </div>
      </section>

      {/* 9. Navigation Actions Bar with prominent "CONTINUE TO FARM LOCATION" button */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200 dark:border-slate-800">
        {onBack ? (
          <button
            type="button"
            id="btn-back-to-dashboard"
            onClick={onBack}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </button>
        ) : <div />}

        <button
          type="button"
          id="btn-continue-to-farm-location"
          onClick={onNext}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-600/30 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
        >
          <span>CONTINUE TO FARM LOCATION</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
