import React from 'react';
import { Sprout, ExternalLink, ShieldCheck, Database, FileCheck2 } from 'lucide-react';
import { Language } from '../types';
import { useTranslation } from '../locales/translations';

interface FooterProps {
  language: Language;
  onSelectTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ language, onSelectTab }) => {
  const t = useTranslation(language);

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 text-xs">
      {/* Official Data Transparency Bar */}
      <div className="bg-slate-950 border-b border-slate-800/80 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-slate-300 text-xs">
            <div className="p-2 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-800">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="font-semibold text-white block text-sm">
                Government of India Open Data Compliance
              </span>
              <p className="text-[11px] text-slate-400">
                FARMFIT references verified official gazettes and open datasets under the GODL-India framework.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-[11px]">
            <a 
              href="https://cacp.dacnet.nic.in/" 
              target="_blank" 
              rel="noreferrer"
              className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1 transition-colors"
            >
              <span>CACP Price Policy</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>
            <a 
              href="https://agmarknet.gov.in/" 
              target="_blank" 
              rel="noreferrer"
              className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1 transition-colors"
            >
              <span>Agmarknet Portal</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>
            <a 
              href="https://mausam.imd.gov.in/" 
              target="_blank" 
              rel="noreferrer"
              className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1 transition-colors"
            >
              <span>IMD Agromet</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>
            <a 
              href="https://soilhealth.dac.gov.in/" 
              target="_blank" 
              rel="noreferrer"
              className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1 transition-colors"
            >
              <span>Soil Health Card</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
                <Sprout className="w-5 h-5" />
              </div>
              <span className="font-bold text-lg text-white tracking-tight">
                FARM<span className="text-emerald-400">FIT</span>
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              India-wide intelligent agricultural decision-support platform engineered to help farmers plan optimal crops, assess soil and irrigation capacity, benchmark against official CACP production costs, evaluate market realizations, and minimize operational risk.
            </p>
          </div>

          {/* Core Decision Journey */}
          <div>
            <h4 className="font-semibold text-white text-xs uppercase tracking-wider mb-3">
              Primary Journey
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onSelectTab('profile')} className="hover:text-emerald-400 transition-colors">
                  1. Farm & Farmer Profile
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('location')} className="hover:text-emerald-400 transition-colors">
                  2. Farm Agro-Climatic Location
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('land')} className="hover:text-emerald-400 transition-colors">
                  3. Land & Irrigation Setup
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('soil')} className="hover:text-emerald-400 transition-colors">
                  4. Soil Health Intelligence
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('crops')} className="hover:text-emerald-400 transition-colors">
                  5. Crop & Planting Constraints
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('engine')} className="hover:text-emerald-400 font-semibold text-emerald-400 transition-colors">
                  6. FARMFIT Calculation Engine
                </button>
              </li>
            </ul>
          </div>

          {/* Intelligence Modules */}
          <div>
            <h4 className="font-semibold text-white text-xs uppercase tracking-wider mb-3">
              Intelligence Layers
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onSelectTab('recommendations')} className="hover:text-emerald-400 transition-colors">
                  Crop Recommendations & Suitability
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('routing')} className="hover:text-emerald-400 transition-colors">
                  APMC Mandi Routing & Net Realization
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('msp')} className="hover:text-emerald-400 transition-colors">
                  CACP 2024-25 MSP Notified Rates
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('fertilizer')} className="hover:text-emerald-400 transition-colors">
                  Customized Fertilizer Plan (NPK)
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('weather')} className="hover:text-emerald-400 transition-colors">
                  IMD Agro-Meteorology & Alerts
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('risk')} className="hover:text-emerald-400 transition-colors">
                  Multi-Factor Risk Analysis
                </button>
              </li>
            </ul>
          </div>

          {/* Data Governance & Disclaimers */}
          <div>
            <h4 className="font-semibold text-white text-xs uppercase tracking-wider mb-3">
              Data Governance
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onSelectTab('datasources')} className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Open Data Registry</span>
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('about')} className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <FileCheck2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>CACP Cost & ICAR Methodology</span>
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('report')} className="hover:text-emerald-400 transition-colors">
                  Download Farm Decision Dossier
                </button>
              </li>
            </ul>
            <div className="mt-4 p-2.5 rounded bg-slate-950 border border-slate-800 text-[11px] text-slate-400 leading-tight">
              All baseline statistics are directly mapped to public data published by Ministry of Agriculture & Farmers Welfare, Government of India.
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-300 text-xs">
          <p>© {new Date().getFullYear()} FARMFIT • India Intelligent Agricultural Decision System</p>
          <p className="text-slate-300 text-[11px]">
            Designed for transparent, accessible Indian agricultural agronomy and farm economics.
          </p>
        </div>
      </div>
    </footer>
  );
};
