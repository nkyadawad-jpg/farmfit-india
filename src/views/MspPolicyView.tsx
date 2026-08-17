import React, { useState } from 'react';
import { Scale, CheckCircle2, IndianRupee, ShieldCheck, ExternalLink } from 'lucide-react';
import { OFFICIAL_MSP_RECORDS, CACP_METADATA_2024_25 } from '../data/officialData';
import { DataStatusBadge } from '../components/DataStatusBadge';
import { Language } from '../types';

interface MspPolicyViewProps {
  language: Language;
}

export const MspPolicyView: React.FC<MspPolicyViewProps> = ({ language }) => {
  const [seasonFilter, setSeasonFilter] = useState<string>('All');

  const filteredRecords = seasonFilter === 'All'
    ? OFFICIAL_MSP_RECORDS
    : OFFICIAL_MSP_RECORDS.filter((r) => r.season.toLowerCase().includes(seasonFilter.toLowerCase()));

  return (
    <div className="space-y-6 pb-16">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center">
                <Scale className="w-5 h-5" />
              </span>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                Official 2024-25 CACP Mandated Minimum Support Prices (MSP)
              </h1>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              Statutory price support notified by the Cabinet Committee on Economic Affairs (CCEA), Government of India, guaranteeing at least 50% margin over Cost of Production (A2+FL).
            </p>
          </div>

          <DataStatusBadge
            metadata={CACP_METADATA_2024_25}
            size="sm"
          />
        </div>

        {/* CACP Policy Principles Box */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/60">
            <span className="font-bold text-slate-900 dark:text-white block mb-1">Union Budget 2018-19 Mandate</span>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              MSP is fixed at a level of at least 1.5 times of the all-India weighted average Cost of Production (Cost A2+FL).
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-800/60">
            <span className="font-bold text-slate-900 dark:text-white block mb-1">Cost Concept: A2 + FL</span>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Covers all paid-out costs on seeds, fertilizers, pesticides, hired labour, diesel plus the imputed value of family labour.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-purple-50/50 dark:bg-purple-950/30 border border-purple-200/60 dark:border-purple-800/60">
            <span className="font-bold text-slate-900 dark:text-white block mb-1">Nodal Procurement Agencies</span>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              FCI (Food Corporation of India), NAFED, Cotton Corporation of India (CCI), and Jute Corporation of India (JCI).
            </p>
          </div>
        </div>
      </div>

      {/* MSP Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Scale className="w-5 h-5 text-emerald-600" />
            <span>Notified Price Support Schedule (2024-25 Season)</span>
          </h3>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 font-medium">Filter Season:</span>
            <select
              value={seasonFilter}
              onChange={(e) => setSeasonFilter(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
            >
              <option value="All">All 23 Mandated Crops</option>
              <option value="Kharif">Kharif Crops</option>
              <option value="Rabi">Rabi Crops</option>
              <option value="Commercial">Commercial Crops</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold uppercase tracking-wider text-[10px] border-y border-slate-200 dark:border-slate-700">
              <tr>
                <th className="py-3 px-4">Commodity / Crop</th>
                <th className="py-3 px-3">Season</th>
                <th className="py-3 px-3 text-right">Cost A2+FL (₹/Qtl)</th>
                <th className="py-3 px-3 text-right">2024-25 MSP (₹/Qtl)</th>
                <th className="py-3 px-3 text-right">Margin over Cost</th>
                <th className="py-3 px-4">Procuring Agency</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              {filteredRecords.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                    <div>{r.name}</div>
                    <span className="text-[10px] text-slate-500 font-normal">{r.hindiName}</span>
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px]">
                      {r.season}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-right text-slate-600 dark:text-slate-400">
                    ₹{r.cacpProjectedCostA2FL.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3.5 px-3 text-right font-extrabold text-slate-900 dark:text-white">
                    ₹{r.msp2024_25.toLocaleString('en-IN')}
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block font-semibold">
                      +{r.percentageIncrease}% (+₹{r.absoluteIncrease})
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-right font-black text-emerald-600 dark:text-emerald-400">
                    +{r.returnOverCostA2FLPercent}%
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{r.procuringAgencies.join(', ')}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
