import React from 'react';
import { FarmLocation, Language } from '../../types';
import { INDIAN_DISTRICTS, AGRO_CLIMATIC_ZONES, IMD_METADATA } from '../../data/officialData';
import { MapPin, CloudRain, Compass, ArrowRight, ArrowLeft } from 'lucide-react';
import { DataStatusBadge } from '../DataStatusBadge';

interface StepLocationProps {
  location: FarmLocation;
  onChange: (location: FarmLocation) => void;
  onNext: () => void;
  onBack: () => void;
  language: Language;
}

export const StepLocation: React.FC<StepLocationProps> = ({
  location,
  onChange,
  onNext,
  onBack,
  language
}) => {
  // Extract unique states
  const states = Array.from(new Set(INDIAN_DISTRICTS.map((d) => d.state))).sort();

  // Filter districts for chosen state
  const availableDistricts = INDIAN_DISTRICTS.filter((d) => d.state === location.state);

  const handleStateChange = (newState: string) => {
    const defaultDistrict = INDIAN_DISTRICTS.find((d) => d.state === newState) || INDIAN_DISTRICTS[0];
    const zone = AGRO_CLIMATIC_ZONES.find((z) => z.id === defaultDistrict.zoneId) || AGRO_CLIMATIC_ZONES[7];

    onChange({
      ...location,
      state: newState,
      district: defaultDistrict.district,
      agroClimaticZoneId: zone.id,
      agroClimaticZoneName: zone.name,
      normalAnnualRainfallMm: defaultDistrict.normalRainfallMm,
      latitude: defaultDistrict.latitude,
      longitude: defaultDistrict.longitude,
      metadata: IMD_METADATA
    });
  };

  const handleDistrictChange = (newDistrictName: string) => {
    const districtObj = INDIAN_DISTRICTS.find((d) => d.district === newDistrictName && d.state === location.state) || availableDistricts[0];
    const zone = AGRO_CLIMATIC_ZONES.find((z) => z.id === districtObj.zoneId) || AGRO_CLIMATIC_ZONES[7];

    onChange({
      ...location,
      district: districtObj.district,
      agroClimaticZoneId: zone.id,
      agroClimaticZoneName: zone.name,
      normalAnnualRainfallMm: districtObj.normalRainfallMm,
      latitude: districtObj.latitude,
      longitude: districtObj.longitude,
      metadata: IMD_METADATA
    });
  };

  const currentZone = AGRO_CLIMATIC_ZONES.find((z) => z.id === location.agroClimaticZoneId);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-5 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300 flex items-center justify-center text-xs font-bold">
              2
            </span>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {language === 'en' ? 'Farm Location & Agro-Climatic Zone' : 'खेत का स्थान एवं कृषि-जलवायु क्षेत्र'}
            </h2>
          </div>
          <p className="text-xs text-slate-700 dark:text-slate-200 mt-1">
            {language === 'en'
              ? 'Mapped against official Planning Commission / ICAR 15 Agro-Climatic Regional Divisions & IMD Climatology.'
              : 'योजना आयोग / आईसीएआर के 15 कृषि-जलवायु क्षेत्रों और मौसम विज्ञान विभाग से संबद्ध।'}
          </p>
        </div>

        <DataStatusBadge
          metadata={IMD_METADATA}
          size="sm"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* State Selector */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
            {language === 'en' ? 'State / Union Territory' : 'राज्य / केंद्र शासित प्रदेश'}
          </label>
          <select
            value={location.state}
            onChange={(e) => handleStateChange(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden cursor-pointer"
            id="select-state"
          >
            {states.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* District Selector */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
            {language === 'en' ? 'Agricultural District' : 'कृषि जिला'}
          </label>
          <select
            value={location.district}
            onChange={(e) => handleDistrictChange(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden cursor-pointer"
            id="select-district"
          >
            {availableDistricts.map((d) => (
              <option key={d.district} value={d.district}>{d.district}</option>
            ))}
          </select>
        </div>

        {/* Taluka / Tehsil (Optional) */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
            {language === 'en' ? 'Taluka / Tehsil / Block' : 'तहसील / ब्लॉक (वैकल्पिक)'}
          </label>
          <input
            type="text"
            value={location.taluka || ''}
            onChange={(e) => onChange({ ...location, taluka: e.target.value })}
            placeholder="e.g. Sanwer / Depalpur"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            id="input-taluka"
          />
        </div>

        {/* Village */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
            {language === 'en' ? 'Village / Gram Panchayat' : 'ग्राम / पंचायत (वैकल्पिक)'}
          </label>
          <input
            type="text"
            value={location.village || ''}
            onChange={(e) => onChange({ ...location, village: e.target.value })}
            placeholder="e.g. Hatod"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            id="input-village"
          />
        </div>
      </div>

      {/* Auto-resolved Agro-Climatic Intelligence Box */}
      <div className="mt-6 p-4 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-emerald-600 text-white shrink-0">
            <Compass className="w-5 h-5" />
          </div>
          <div className="space-y-1 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 dark:text-white text-sm">
                Agro-Climatic Zone {location.agroClimaticZoneId}: {location.agroClimaticZoneName}
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-200 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-200">
                ICAR Classified
              </span>
            </div>
            <p className="text-slate-700 dark:text-slate-300">
              {currentZone?.climateType || 'Semi-arid tropical plateau with distinct wet and dry seasons.'}
            </p>
            <div className="flex flex-wrap gap-4 pt-2 text-slate-700 dark:text-slate-300 font-medium">
              <span className="flex items-center gap-1">
                <CloudRain className="w-3.5 h-3.5 text-blue-600" />
                <span>Normal Annual Rainfall: <strong>{location.normalAnnualRainfallMm} mm</strong></span>
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                <span>Coordinates: <strong>{location.latitude?.toFixed(2)}° N, {location.longitude?.toFixed(2)}° E</strong></span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{language === 'en' ? 'Back' : 'पीछे'}</span>
        </button>

        <button
          onClick={onNext}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs tracking-wide shadow-md transition-all cursor-pointer"
          id="btn-next-land"
        >
          <span>{language === 'en' ? 'Next: Land & Irrigation' : 'अगला: भूमि एवं सिंचाई'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
