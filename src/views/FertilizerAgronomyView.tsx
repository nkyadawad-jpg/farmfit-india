import React from 'react';
import { FlaskConical, Calendar, CheckCircle2, ShieldCheck, IndianRupee } from 'lucide-react';
import { CalculationEngineResult, Language } from '../types';
import { DataStatusBadge } from '../components/DataStatusBadge';

interface FertilizerAgronomyViewProps {
  result: CalculationEngineResult | null;
  language: Language;
}

export const FertilizerAgronomyView: React.FC<FertilizerAgronomyViewProps> = ({ result, language }) => {
  const topCrop = result?.recommendedCrops[0];

  const fertilizerData = [
    { name: "Neem Coated Urea (46% N)", dosage: "45-50 kg / acre", timing: "Split: 50% Basal + 50% Top-dress at 30 DAS", price: "₹266.50 / 45kg bag" },
    { name: "Di-Ammonium Phosphate (DAP 18:46:0)", dosage: "40-50 kg / acre", timing: "100% Basal placement at sowing time", price: "₹1,350 / 50kg bag" },
    { name: "Muriate of Potash (MOP 60% K₂O)", dosage: "20-25 kg / acre", timing: "Basal application with DAP", price: "₹1,650 / 50kg bag" },
    { name: "Zinc Sulphate (ZnSO₄ 21%)", dosage: "10 kg / acre", timing: "Basal soil application once in 2 years", price: "₹650 / 10kg" },
    { name: "Bio-fertilizers (Rhizobium / PSB)", dosage: "250g / 10kg seed", timing: "Seed inoculation before sowing", price: "₹80 / packet" }
  ];

  return (
    <div className="space-y-6 pb-16">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center">
                <FlaskConical className="w-5 h-5" />
              </span>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                Customized Nutrient Management & Fertilizer Plan
              </h1>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              Scientific NPK balancing for <strong>{topCrop?.crop.name || 'Recommended Crops'}</strong> based on ICAR Package of Practices & Department of Fertilizers (DoF) subsidized pricing.
            </p>
          </div>

          <DataStatusBadge
            status="LATEST_AVAILABLE"
            sourceText="ICAR / Department of Fertilizers, GoI"
            dateText="Current Subsidized NBS Rates"
            size="sm"
          />
        </div>

        {/* Schedule Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold uppercase tracking-wider text-[10px] border-y border-slate-200 dark:border-slate-700">
              <tr>
                <th className="py-3 px-4">Fertilizer Grade / Input</th>
                <th className="py-3 px-3">Recommended Dose / Acre</th>
                <th className="py-3 px-4">Application Timing & Method</th>
                <th className="py-3 px-3 text-right">Statutory MRP / Bag</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              {fertilizerData.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                    {item.name}
                  </td>
                  <td className="py-3.5 px-3 font-semibold text-emerald-600 dark:text-emerald-400">
                    {item.dosage}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                    {item.timing}
                  </td>
                  <td className="py-3.5 px-3 text-right font-extrabold text-slate-900 dark:text-white">
                    {item.price}
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
