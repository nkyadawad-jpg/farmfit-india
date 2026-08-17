import React from 'react';
import { Database, ExternalLink, ShieldCheck, FileCheck, CheckCircle2 } from 'lucide-react';
import { Language } from '../types';
import { 
  CACP_METADATA_2024_25, 
  AGMARKNET_METADATA, 
  IMD_METADATA, 
  SOIL_METADATA, 
  SUPPLY_DEMAND_METADATA 
} from '../data/officialData';
import { DataStatusBadge } from '../components/DataStatusBadge';

interface DataSourcesViewProps {
  language: Language;
}

export const DataSourcesView: React.FC<DataSourcesViewProps> = ({ language }) => {
  const sources = [
    {
      title: 'Commission for Agricultural Costs and Prices (CACP)',
      dept: 'Department of Agriculture & Farmers Welfare, Ministry of Agriculture & Farmers Welfare',
      url: 'https://cacp.dacnet.nic.in/',
      scope: 'Statutory 2024-25 Kharif & Rabi MSP Gazette, Comprehensive Cost of Cultivation (A2, A2+FL, C2), Projected Yields, and Return over Cost percentages.',
      metadata: CACP_METADATA_2024_25,
      fields: ['MSP Rates (₹/Quintal)', 'Projected Cost of Production', 'Return over Cost A2+FL (%)', 'Buffer Procurement Mandates']
    },
    {
      title: 'Agmarknet Wholesale Mandi Network & Directorate of Marketing and Inspection (DMI)',
      dept: 'Ministry of Agriculture & Farmers Welfare',
      url: 'https://agmarknet.gov.in/',
      scope: 'Real-time daily mandi arrivals (MT), modal wholesale auction prices (₹/Quintal), minimum and maximum trading spread across 3,200+ regulated APMC yards.',
      metadata: AGMARKNET_METADATA,
      fields: ['Daily Modal Price', 'Daily Arrival Volumes', 'Historical Seasonality Index', 'Mandi Cess & Logistics Deductions']
    },
    {
      title: 'India Meteorological Department (IMD) & Agro-Meteorological Advisory Service',
      dept: 'Ministry of Earth Sciences, Govt of India',
      url: 'https://mausam.imd.gov.in/',
      scope: 'District-level normal annual rainfall (mm), 15 Agro-Climatic Zone delineations, monsoon onset timeline tracking, and weather stress indices.',
      metadata: IMD_METADATA,
      fields: ['Agro-Climatic Zone 1-15', 'Normal Rainfall (mm)', 'Temperature Extremes', 'Monsoon Sowing Calendar']
    },
    {
      title: 'National Bureau of Soil Survey and Land Use Planning (ICAR-NBSS&LUP) & Soil Health Card Portal',
      dept: 'Indian Council of Agricultural Research (ICAR)',
      url: 'https://soilhealth.dac.gov.in/',
      scope: 'Soil taxonomical orders (Vertisols, Inceptisols, Alfisols, etc.), pH suitability boundaries, Organic Carbon %, NPK deficiency matrices, and ICAR customized fertilizer recommendations.',
      metadata: SOIL_METADATA,
      fields: ['Soil Order & Texture Suitability', 'Soil pH Thresholds', 'NPK Basal & Top Dressing Rates', 'Secondary Nutrients (Zinc, Boron)']
    },
    {
      title: 'Directorate of Economics and Statistics (DES)',
      dept: 'Ministry of Agriculture & Farmers Welfare',
      url: 'https://desagri.gov.in/',
      scope: 'Third Advance Estimates of Production of Major Crops (2023-24 / 2024-25), national consumption balance sheets, opening stocks, and import/export trade balances.',
      metadata: SUPPLY_DEMAND_METADATA,
      fields: ['Domestic Production Estimates (Lakh MT)', 'Annual Consumption Requirement', 'Import/Export Deficits & Tariffs']
    }
  ];

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-900 via-slate-900 to-slate-950 text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-emerald-800/40">
        <div className="flex items-center gap-2 mb-3">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
            Government of India Open Data Registry
          </span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
          {language === 'en' ? 'Official Data Registry & Provenance' : 'आधिकारिक डेटा स्रोत एवं पारदर्शिता'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-3xl mt-2 leading-relaxed">
          FARMFIT strictly integrates official open datasets released by Government of India ministries, CACP statutory reports, Agmarknet mandi sessions, and ICAR agronomic research. Zero fabricated or artificial numbers are used.
        </p>
      </div>

      {/* Sources Grid */}
      <div className="grid grid-cols-1 gap-6">
        {sources.map((s, idx) => (
          <div 
            key={idx}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 flex items-center justify-center text-xs font-bold">
                    {idx + 1}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {s.title}
                  </h3>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                  {s.dept}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <DataStatusBadge
                  metadata={s.metadata}
                  size="sm"
                />
                <a
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <span>Official Portal</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
              {s.scope}
            </p>

            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 block mb-2">
                Governed Parameters & Model Benchmarks:
              </span>
              <div className="flex flex-wrap gap-2">
                {s.fields.map((f, fIdx) => (
                  <span
                    key={fIdx}
                    className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60 font-medium"
                  >
                    <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                    <span>{f}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
