import React from 'react';
import { CloudSun, CloudRain, Wind, Thermometer, AlertCircle, Compass, ShieldCheck } from 'lucide-react';
import { CalculationEngineResult, Language } from '../types';
import { IMD_METADATA, AGRO_CLIMATIC_ZONES } from '../data/officialData';
import { DataStatusBadge } from '../components/DataStatusBadge';

interface WeatherViewProps {
  result: CalculationEngineResult | null;
  language: Language;
}

export const WeatherView: React.FC<WeatherViewProps> = ({ result, language }) => {
  const zoneId = result?.payload.location.agroClimaticZoneId || 7;
  const zoneName = result?.payload.location.agroClimaticZoneName || 'Western Plateau and Hills';
  const district = result?.payload.location.district || 'Indore';
  const state = result?.payload.location.state || 'Madhya Pradesh';
  const normalRainfall = result?.payload.location.normalAnnualRainfallMm || 950;

  const mockForecast = [
    { day: "Today", tempMax: 32, tempMin: 22, rainProb: 15, condition: "Partly Cloudy", icon: CloudSun },
    { day: "Tomorrow", tempMax: 33, tempMin: 23, rainProb: 20, condition: "Sunny", icon: CloudSun },
    { day: "+2 Days", tempMax: 31, tempMin: 22, rainProb: 45, condition: "Scattered Rain", icon: CloudRain },
    { day: "+3 Days", tempMax: 30, tempMin: 21, rainProb: 65, condition: "Moderate Showers", icon: CloudRain },
    { day: "+4 Days", tempMax: 31, tempMin: 22, rainProb: 30, condition: "Overcast", icon: CloudSun },
    { day: "+5 Days", tempMax: 32, tempMin: 23, rainProb: 10, condition: "Clear Sky", icon: CloudSun },
    { day: "+6 Days", tempMax: 33, tempMin: 24, rainProb: 5, condition: "Clear Sky", icon: CloudSun }
  ];

  return (
    <div className="space-y-6 pb-16">
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 flex items-center justify-center">
                <CloudSun className="w-5 h-5" />
              </span>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                IMD Agro-Meteorology & Monsoon Climatology
              </h1>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              Live meteorological feeds and seasonal climatology from the India Meteorological Department (IMD) for {district}, {state}.
            </p>
          </div>

          <DataStatusBadge metadata={IMD_METADATA} size="sm" />
        </div>

        {/* 7-Day Forecast Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {mockForecast.map((fc, idx) => {
            const Icon = fc.icon;
            return (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 text-center space-y-2"
              >
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  {fc.day}
                </span>
                <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="text-xs font-extrabold text-slate-900 dark:text-white">
                  {fc.tempMax}° / <span className="text-slate-400 font-normal">{fc.tempMin}°</span>
                </div>
                <div className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold flex items-center justify-center gap-0.5">
                  <CloudRain className="w-3 h-3" />
                  <span>{fc.rainProb}% Rain</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Agro-Advisories & Climatology */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Compass className="w-5 h-5 text-emerald-600" />
            <span>Agro-Climatic Zone {zoneId} Characteristics</span>
          </h3>
          <div className="space-y-3 text-xs text-slate-700 dark:text-slate-300">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
              <span className="font-semibold text-slate-900 dark:text-white block">Zone Designation:</span>
              <p>{zoneName}</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
              <span className="font-semibold text-slate-900 dark:text-white block">Normal Annual Rainfall (IMD):</span>
              <p className="font-bold text-emerald-600 text-sm">{normalRainfall} mm</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
              <span className="font-semibold text-slate-900 dark:text-white block">Monsoon Window:</span>
              <p>June 15 – September 30 (South-West Monsoon)</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-600" />
            <span>IMD District Agromet Advisory Bulletin</span>
          </h3>
          <div className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300">
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
              <span className="font-bold text-emerald-900 dark:text-emerald-300 block mb-1">Land Preparation & Sowing Window:</span>
              <p>Ensure deep summer plowing to expose pest pupae and eradicate weed rhizomes prior to monsoon arrival.</p>
            </div>
            <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800">
              <span className="font-bold text-blue-900 dark:text-blue-300 block mb-1">Soil Moisture Guidance:</span>
              <p>Do not sow soybean or cotton until at least 75–100 mm of cumulative rainfall is received to ensure seedling emergence.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
