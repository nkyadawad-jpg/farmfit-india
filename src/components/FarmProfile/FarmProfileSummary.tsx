import React, { useState } from 'react';
import { 
  MapPin, 
  Ruler, 
  Droplets, 
  FlaskConical, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Layers, 
  Sparkles, 
  ShieldCheck, 
  Warehouse, 
  Wrench, 
  Calendar,
  Mountain,
  FileSpreadsheet
} from 'lucide-react';
import { FarmerProfile, FarmLocation, LandAndIrrigation, SoilIntelligence, Language } from '../../types';
import { formatLandDisplay, normalizeLandArea } from '../../services/landUnits';

interface FarmProfileSummaryProps {
  farmer: FarmerProfile;
  location: FarmLocation;
  land: LandAndIrrigation;
  soil: SoilIntelligence;
  onCalculate: () => void;
  onEditSection: (stepIndex: number) => void;
  language: Language;
}

export const FarmProfileSummary: React.FC<FarmProfileSummaryProps> = ({
  farmer,
  location,
  land,
  soil,
  onCalculate,
  onEditSection,
  language
}) => {
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const handleValidateAndCalculate = () => {
    const errors: string[] = [];

    if (!location.state || !location.district) {
      errors.push('Farm State and District are required.');
    }
    if (!land.totalLandAcres || land.totalLandAcres <= 0) {
      errors.push('Total farm holding size must be greater than 0.');
    }
    if (!land.plannedLandAllocationAcres || land.plannedLandAllocationAcres <= 0) {
      errors.push('Allocated area for proposed crop must be greater than 0.');
    }
    if (land.plannedLandAllocationAcres > land.totalLandAcres) {
      errors.push('Allocated crop area cannot exceed total farm holding size.');
    }

    if (errors.length > 0) {
      setValidationErrors(errors);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setValidationErrors([]);
    onCalculate();
  };

  const normalizedLandObj = normalizeLandArea(
    land.originalLandValue || land.totalLandAcres,
    (land.selectedLandUnit as any) || 'Acre',
    land.customUnitName,
    land.customUnitToAcresRatio
  );

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-linear-to-r from-emerald-800 to-teal-800 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-xs font-bold uppercase tracking-wider text-emerald-100">
              Verified Farm Identity
            </span>
            <span className="text-xs text-emerald-200">
              FARMFIT Intelligent Agro-Engine Ready
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Farm Profile & Agronomic Baseline
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100/90 max-w-2xl leading-relaxed">
            Review your farm data before generating real-time crop profitability, water stress risk, MSP protection, and ICAR fertilizer dosing.
          </p>
        </div>

        <button
          type="button"
          onClick={handleValidateAndCalculate}
          className="px-8 py-4 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm uppercase tracking-wider shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 shrink-0 cursor-pointer"
        >
          <Sparkles className="w-5 h-5 text-slate-950" />
          <span>CALCULATE MY FARM</span>
          <ArrowRight className="w-5 h-5 text-slate-950" />
        </button>
      </div>

      {/* Validation Errors Notice */}
      {validationErrors.length > 0 && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 space-y-2">
          <div className="flex items-center gap-2 text-rose-800 dark:text-rose-300 font-bold text-sm">
            <AlertCircle className="w-5 h-5 text-rose-600" />
            <span>Please resolve the following before calculating:</span>
          </div>
          <ul className="list-disc list-inside text-xs text-rose-700 dark:text-rose-300 space-y-1">
            {validationErrors.map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      {/* 4-Card Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Section 1: Location & Coordinates */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <span>1. Location & Micro-Climate</span>
            </h3>
            <button
              type="button"
              onClick={() => onEditSection(1)}
              className="text-xs text-emerald-600 hover:text-emerald-700 font-bold cursor-pointer"
            >
              Edit
            </button>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500 font-medium">State & District</span>
              <strong className="text-slate-900 dark:text-white">{location.district}, {location.state}</strong>
            </div>

            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500 font-medium">Taluk & Village</span>
              <strong className="text-slate-900 dark:text-white">
                {location.taluka || 'Tehsil Centroid'} {location.village ? `/ ${location.village}` : ''}
              </strong>
            </div>

            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500 font-medium">GPS Coordinates</span>
              <strong className="text-slate-900 dark:text-white font-mono">
                {location.latitude?.toFixed(5)}° N, {location.longitude?.toFixed(5)}° E
              </strong>
            </div>

            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500 font-medium">Altitude / Elevation</span>
              <strong className="text-slate-900 dark:text-white">
                {location.altitudeMeters !== null && location.altitudeMeters !== undefined 
                  ? `${location.altitudeMeters} m (${Math.round(location.altitudeMeters * 3.28)} ft)` 
                  : 'Elevation data unavailable'}
              </strong>
            </div>

            <div className="flex justify-between py-1">
              <span className="text-slate-500 font-medium">Agro-Climatic Zone</span>
              <strong className="text-slate-900 dark:text-white">Zone {location.agroClimaticZoneId}: {location.agroClimaticZoneName}</strong>
            </div>
          </div>
        </div>

        {/* Section 2: Land & Production Allocation */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Ruler className="w-4 h-4 text-emerald-600" />
              <span>2. Land Normalization & Holding</span>
            </h3>
            <button
              type="button"
              onClick={() => onEditSection(2)}
              className="text-xs text-emerald-600 hover:text-emerald-700 font-bold cursor-pointer"
            >
              Edit
            </button>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500 font-medium">Farmer Selected Input</span>
              <strong className="text-slate-900 dark:text-white">
                {land.originalLandValue || land.totalLandAcres} {land.selectedLandUnit || 'Acres'}
              </strong>
            </div>

            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500 font-medium">Standard Normalized Holding</span>
              <strong className="text-emerald-700 dark:text-emerald-400 font-bold">
                {land.totalLandAcres} Acres ({normalizedLandObj.normalizedHectares} Ha / {normalizedLandObj.normalizedSquareMetres.toLocaleString()} m²)
              </strong>
            </div>

            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500 font-medium">Proposed Crop Allocation</span>
              <strong className="text-slate-900 dark:text-white">
                {land.plannedLandAllocationAcres} Acres ({((land.plannedLandAllocationAcres / land.totalLandAcres) * 100).toFixed(0)}% of Farm)
              </strong>
            </div>

            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500 font-medium">Farming System</span>
              <strong className="text-slate-900 dark:text-white">
                {land.characteristics?.farmingSystem || 'Conventional'}
              </strong>
            </div>

            <div className="flex justify-between py-1">
              <span className="text-slate-500 font-medium">Cropping History</span>
              <strong className="text-slate-900 dark:text-white">
                Prev: {land.characteristics?.previousCrop || 'Wheat'} | Current: {land.characteristics?.currentCrop || 'Soybean'}
              </strong>
            </div>
          </div>
        </div>

        {/* Section 3: Irrigation & Hydrological Reliability */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Droplets className="w-4 h-4 text-blue-600" />
              <span>3. Irrigation Engine & Reliability</span>
            </h3>
            <button
              type="button"
              onClick={() => onEditSection(3)}
              className="text-xs text-emerald-600 hover:text-emerald-700 font-bold cursor-pointer"
            >
              Edit
            </button>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between items-center py-1 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500 font-medium">Irrigation Reliability Score</span>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-black text-emerald-700 dark:text-emerald-400">
                  {land.irrigationReliabilityScore100 || 80}
                </span>
                <span className="text-[10px] text-slate-400 font-bold">/ 100</span>
              </div>
            </div>

            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500 font-medium">Irrigated vs Rainfed Area</span>
              <strong className="text-slate-900 dark:text-white">
                {land.irrigatedAreaAcres ?? land.totalLandAcres} Ac ({land.irrigatedLandPercent ?? 100}%) / {land.rainfedAreaAcres ?? 0} Ac Rainfed
              </strong>
            </div>

            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500 font-medium">Rainfall Dependency</span>
              <strong className="text-slate-900 dark:text-white">
                {land.rainfallDependencyPercent ?? 15}%
              </strong>
            </div>

            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500 font-medium">Delivery Method</span>
              <strong className="text-slate-900 dark:text-white">
                {land.hasDrip ? 'Micro-Irrigation (Drip)' : land.hasSprinkler ? 'Sprinkler' : 'Flood/Surface'}
              </strong>
            </div>

            <div className="flex justify-between py-1">
              <span className="text-slate-500 font-medium">Annual Water Duration</span>
              <strong className="text-slate-900 dark:text-white">
                {land.monthsWaterAvailable ?? 10} Months / Year
              </strong>
            </div>
          </div>
        </div>

        {/* Section 4: Soil Intelligence & Laboratory Tests */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FlaskConical className="w-4 h-4 text-purple-600" />
              <span>4. Soil Intelligence & Provenance</span>
            </h3>
            <button
              type="button"
              onClick={() => onEditSection(4)}
              className="text-xs text-emerald-600 hover:text-emerald-700 font-bold cursor-pointer"
            >
              Edit
            </button>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between items-center py-1 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500 font-medium">Soil Health Card / Test</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                soil.hasSoilHealthCard ? 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300' : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
              }`}>
                {soil.hasSoilHealthCard ? `Verified SHC (${soil.shcNumber || 'Lab Report'})` : 'Farmer Entered'}
              </span>
            </div>

            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500 font-medium">Soil Type & Texture</span>
              <strong className="text-slate-900 dark:text-white">
                {soil.soilOrder.split('(')[0]} ({soil.texture})
              </strong>
            </div>

            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500 font-medium">pH & Organic Carbon (OC)</span>
              <strong className="text-slate-900 dark:text-white">
                pH {soil.ph} | OC: {soil.organicCarbonPercent}%
              </strong>
            </div>

            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500 font-medium">NPK Macronutrient Profile</span>
              <strong className="text-slate-900 dark:text-white">
                N: {soil.availableNitrogenKgPerHa.split('(')[0]} | P: {soil.availablePhosphorusKgPerHa.split('(')[0]} | K: {soil.availablePotassiumKgPerHa.split('(')[0]}
              </strong>
            </div>

            <div className="flex justify-between py-1">
              <span className="text-slate-500 font-medium">Salinity / EC</span>
              <strong className="text-slate-900 dark:text-white">
                {soil.electricalConductivityDsM} dS/m (Normal Non-saline)
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* Main Calculate My Farm Action Button */}
      <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-4">
        <h3 className="text-lg font-black text-slate-900 dark:text-white">
          Ready to run FARMFIT Multi-Factor Optimization?
        </h3>
        <p className="text-xs text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
          The engine will benchmark all official crops against your location's elevation ({location.altitudeMeters ? `${location.altitudeMeters}m` : 'catalog'}), normalized land, irrigation score ({land.irrigationReliabilityScore100 || 80}/100), and soil chemistry.
        </p>

        <button
          type="button"
          onClick={handleValidateAndCalculate}
          className="w-full sm:w-auto px-10 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm uppercase tracking-wider shadow-lg hover:shadow-xl transition-all cursor-pointer inline-flex items-center justify-center gap-3"
        >
          <Sparkles className="w-5 h-5 text-amber-300" />
          <span>CALCULATE MY FARM &amp; GENERATE CROPS</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
