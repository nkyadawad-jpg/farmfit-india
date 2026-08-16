import React from 'react';
import { CalculationEngineResult, Language } from '../types';
import { FileText, Printer, Download, CheckCircle2, ShieldCheck, Sprout, MapPin, IndianRupee, Wheat } from 'lucide-react';
import { DataStatusBadge } from '../components/DataStatusBadge';

interface FarmReportViewProps {
  result: CalculationEngineResult | null;
  language: Language;
}

export const FarmReportView: React.FC<FarmReportViewProps> = ({ result, language }) => {
  if (!result) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-10 text-center space-y-4">
        <FileText className="w-12 h-12 text-slate-400 mx-auto" />
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">No Farm Report Generated</h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Please run the calculation engine first to generate your official Farm Decision Dossier.
        </p>
      </div>
    );
  }

  const { payload, recommendedCrops, cropsToAvoid } = result;
  const topCrop = recommendedCrops[0];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Top Toolbar */}
      <div className="flex items-center justify-between bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Farm Decision Dossier & Agronomy Plan
          </h2>
          <span className="text-xs text-slate-500">Report ID: {result.calculationId} &bull; Generated: {new Date().toLocaleDateString('en-IN')}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print Dossier</span>
          </button>
        </div>
      </div>

      {/* Printable Report Sheet */}
      <div className="bg-white text-slate-900 border border-slate-300 rounded-2xl p-8 shadow-md space-y-8 print:border-none print:shadow-none print:p-0">
        {/* Dossier Header */}
        <div className="flex items-start justify-between border-b-2 border-slate-900 pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-black">
                FF
              </div>
              <span className="text-2xl font-black tracking-tight text-slate-900">
                FARMFIT INDIA
              </span>
            </div>
            <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
              Intelligent Agricultural Decision-Support Platform &bull; Government of India Data Baseline
            </p>
          </div>

          <div className="text-right text-xs">
            <span className="font-bold text-slate-900 block">Dossier #{result.calculationId}</span>
            <span className="text-slate-500">Date: {new Date().toLocaleDateString('en-IN')}</span>
          </div>
        </div>

        {/* Section 1: Farm & Farmer Baseline */}
        <div className="space-y-3">
          <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">
            1. Farm Operational & Agro-Climatic Profile
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-slate-500 block">Farmer / Farm Name:</span>
              <strong className="text-slate-900">{payload.profile.name}</strong>
            </div>
            <div>
              <span className="text-slate-500 block">Location:</span>
              <strong className="text-slate-900">{payload.location.district}, {payload.location.state}</strong>
            </div>
            <div>
              <span className="text-slate-500 block">Agro-Climatic Zone:</span>
              <strong className="text-slate-900">Zone {payload.location.agroClimaticZoneId} ({payload.location.agroClimaticZoneName})</strong>
            </div>
            <div>
              <span className="text-slate-500 block">Target Land Allocation:</span>
              <strong className="text-slate-900">{payload.landAndIrrigation.plannedLandAllocationAcres} Acres ({payload.targetSeason})</strong>
            </div>
          </div>
        </div>

        {/* Section 2: Top Ranked Recommendations */}
        <div className="space-y-3">
          <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">
            2. Recommended Crop Rankings & Multi-Scenario Economics
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-200">
              <thead className="bg-slate-100 text-slate-900 font-bold uppercase text-[10px]">
                <tr>
                  <th className="py-2.5 px-3 border-r border-slate-200">Rank & Crop</th>
                  <th className="py-2.5 px-2 text-center border-r border-slate-200">Suitability</th>
                  <th className="py-2.5 px-3 text-right border-r border-slate-200">Base Yield</th>
                  <th className="py-2.5 px-3 text-right border-r border-slate-200">CACP A2+FL Cost</th>
                  <th className="py-2.5 px-3 text-right border-r border-slate-200">Notified MSP</th>
                  <th className="py-2.5 px-3 text-right">Net Profit / Acre</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {recommendedCrops.slice(0, 4).map((c, i) => (
                  <tr key={c.crop.id}>
                    <td className="py-2 px-3 font-bold border-r border-slate-200">
                      #{i + 1} {c.crop.name} ({c.crop.hindiName})
                    </td>
                    <td className="py-2 px-2 text-center font-bold text-emerald-700 border-r border-slate-200">
                      {c.overallSuitabilityScore}/100
                    </td>
                    <td className="py-2 px-3 text-right border-r border-slate-200">
                      {c.crop.avgYieldQuintalPerAcre} Qtl/Ac
                    </td>
                    <td className="py-2 px-3 text-right border-r border-slate-200">
                      ₹{c.crop.cacpCostPerQuintalA2FL}/Qtl
                    </td>
                    <td className="py-2 px-3 text-right border-r border-slate-200 font-semibold">
                      {c.crop.mspNotified ? `₹${c.crop.mspPrice2024_25}/Qtl` : 'N/A'}
                    </td>
                    <td className="py-2 px-3 text-right font-black text-emerald-700">
                      +₹{c.baseScenario.netProfitA2FLPerAcre.toLocaleString('en-IN')}/Ac
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 3: Crops to Avoid */}
        {cropsToAvoid.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-black uppercase tracking-wider text-rose-900 border-b border-rose-200 pb-1">
              3. Crops to Avoid (High Agronomic or Market Risk)
            </h3>
            <ul className="text-xs space-y-1 text-slate-700">
              {cropsToAvoid.map((a) => (
                <li key={a.crop.id}>
                  <strong>{a.crop.name}:</strong> {a.avoidReason}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Official Governance Stamp */}
        <div className="pt-6 border-t-2 border-slate-900 flex items-center justify-between text-[11px] text-slate-500">
          <p>
            FARMFIT Algorithmic Engine &bull; Benchmarked against CACP 2024-25, Agmarknet, and IMD standards.
          </p>
          <div className="flex items-center gap-1 font-bold text-slate-800">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Verified Decision Dossier</span>
          </div>
        </div>
      </div>
    </div>
  );
};
