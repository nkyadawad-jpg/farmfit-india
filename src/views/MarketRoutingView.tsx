import React, { useState } from 'react';
import { CalculationEngineResult, Language } from '../types';
import { Truck, Store, MapPin, IndianRupee, ArrowUpDown, ExternalLink, ShieldCheck } from 'lucide-react';
import { DataStatusBadge } from '../components/DataStatusBadge';
import { APMC_MANDI_BENCHMARKS, AGMARKNET_METADATA } from '../data/officialData';

interface MarketRoutingViewProps {
  result: CalculationEngineResult | null;
  language: Language;
}

export const MarketRoutingView: React.FC<MarketRoutingViewProps> = ({
  result,
  language
}) => {
  const [selectedCropFilter, setSelectedCropFilter] = useState<string>('All');
  const mandis = APMC_MANDI_BENCHMARKS;

  const filteredMandis = selectedCropFilter === 'All'
    ? mandis
    : mandis.filter((m) => m.cropName.toLowerCase().includes(selectedCropFilter.toLowerCase()));

  return (
    <div className="space-y-6 pb-16">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 flex items-center justify-center">
                <Truck className="w-5 h-5" />
              </span>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                APMC Mandi Logistics & Net Realization Engine
              </h1>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              Calculates true take-home price per quintal after deducting distance-based diesel freight (₹1.85/km/qtl), mandi cess (1.5%), and loading/unloading (₹18/qtl).
            </p>
          </div>

          <DataStatusBadge
            metadata={AGMARKNET_METADATA}
            size="sm"
          />
        </div>

        {/* Formula Explanation Bar */}
        <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 text-xs text-slate-700 dark:text-slate-300 space-y-1">
          <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <span>Standard Net Realization Calculation:</span>
          </div>
          <p className="font-mono text-[11px] text-blue-950 dark:text-blue-200">
            Net Realization (₹/Qtl) = APMC Modal Price - (Distance km × ₹1.85) - Mandi Cess (1.5%) - Hamali (₹18)
          </p>
        </div>
      </div>

      {/* Mandi Comparison Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Store className="w-5 h-5 text-emerald-600" />
            <span>Active APMC Wholesale Markets in Region</span>
          </h3>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 font-medium">Filter Crop:</span>
            <select
              value={selectedCropFilter}
              onChange={(e) => setSelectedCropFilter(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
            >
              <option value="All">All Commodities</option>
              <option value="Soybean">Soybean</option>
              <option value="Wheat">Wheat</option>
              <option value="Cotton">Cotton</option>
              <option value="Maize">Maize</option>
              <option value="Gram">Gram (Chana)</option>
              <option value="Mustard">Mustard</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold uppercase tracking-wider text-[10px] border-y border-slate-200 dark:border-slate-700">
              <tr>
                <th className="py-3 px-4">APMC Mandi & State</th>
                <th className="py-3 px-3">Commodity</th>
                <th className="py-3 px-3 text-right">Modal Price (₹/Qtl)</th>
                <th className="py-3 px-3 text-right">Est. Distance</th>
                <th className="py-3 px-3 text-right">Freight & Handling</th>
                <th className="py-3 px-4 text-right">Net Realization</th>
                <th className="py-3 px-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              {filteredMandis.map((m) => {
                const isProfitable = m.netRealizationPerQuintal > 0;
                return (
                  <tr key={m.mandiId} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span>{m.mandiName}</span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-normal ml-5">
                        {m.district}, {m.state}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 font-semibold text-slate-800 dark:text-slate-200">
                      {m.cropName}
                    </td>
                    <td className="py-3.5 px-3 text-right font-extrabold text-slate-900 dark:text-white">
                      ₹{m.modalPricePerQuintal.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-3 text-right text-slate-600 dark:text-slate-400">
                      {m.distanceKm} km
                    </td>
                    <td className="py-3.5 px-3 text-right text-rose-600 dark:text-rose-400 font-semibold">
                      -₹{((m.distanceKm * (m.freightCostPerKmPerQuintal || 1.1)) + (m.hamaliChargesPerQuintal || 25) + ((m.modalPricePerQuintal * (m.mandiCessPercent || 1.5)) / 100)).toFixed(1)}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">
                        ₹{m.netRealizationPerQuintal.toFixed(1)}
                      </span>
                      <span className="text-[10px] text-slate-400 block">per Qtl</span>
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      <DataStatusBadge metadata={m.metadata} size="sm" showTooltip={false} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
