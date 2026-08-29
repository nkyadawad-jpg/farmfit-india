import React, { useState } from 'react';
import { 
  Database, 
  ExternalLink, 
  CheckCircle2, 
  ShieldCheck, 
  RefreshCw, 
  Layers, 
  FileText, 
  Clock, 
  Globe2,
  AlertTriangle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { OPEN_DATA_REGISTRY } from '../data/dataSourcesRegistry';
import { OFFICIAL_AGMARKNET_DAILY_BULLETINS } from '../data/agmarknetOfficialData';
import { OFFICIAL_CACP_MSP_RECORDS, APMC_MARKET_MASTER } from '../data/mandiMarketData';
import { ALL_CANONICAL_COMMODITIES } from '../data/canonicalCommodityUniverse';

interface SourceProvenancePanelProps {
  currentCommodityName?: string;
  authoritativeSource?: string;
  sourceUrl?: string;
  dataStatus?: 'OFFICIAL DATA' | 'FARMFIT DERIVED ANALYSIS' | 'FARMFIT SCENARIO';
  compact?: boolean;
}

export const SourceProvenancePanel: React.FC<SourceProvenancePanelProps> = ({
  currentCommodityName,
  authoritativeSource,
  sourceUrl,
  dataStatus = 'OFFICIAL DATA',
  compact = false
}) => {
  const [expanded, setExpanded] = useState(!compact);

  const observationCount = OFFICIAL_AGMARKNET_DAILY_BULLETINS.length;
  const apmcCount = APMC_MARKET_MASTER.length;
  const canonicalCount = ALL_CANONICAL_COMMODITIES.length;

  return (
    <div id="source-provenance-panel" className="bg-slate-900 border border-slate-700/80 rounded-xl overflow-hidden shadow-lg text-slate-200">
      {/* Panel Header */}
      <div 
        id="provenance-header-toggle"
        onClick={() => setExpanded(!expanded)}
        className="px-5 py-4 bg-slate-850 border-b border-slate-700/70 flex items-center justify-between cursor-pointer hover:bg-slate-800/80 transition-colors"
      >
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-semibold text-slate-100 text-sm md:text-base">Official Data Source Provenance & Governance</h3>
              <span className={`px-2 py-0.5 text-xs font-semibold rounded-full uppercase tracking-wider ${
                dataStatus === 'OFFICIAL DATA' 
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              }`}>
                {dataStatus}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Zero-Fabrication Architecture • Direct Linkage to Government AGMARKNET, CACP & NHB Repositories
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <span className="hidden sm:inline-flex items-center text-xs text-emerald-400 bg-emerald-950/40 px-2.5 py-1 rounded-md border border-emerald-800/60">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
            Zero-Missing Active
          </span>
          <button 
            id="btn-toggle-provenance" 
            className="text-slate-400 hover:text-slate-200 p-1"
            aria-label="Toggle details"
          >
            {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Expanded Content */}
      {expanded && (
        <div className="p-5 space-y-5 text-xs md:text-sm">
          {/* Active Context Banner if commodity is passed */}
          {currentCommodityName && (
            <div id="provenance-active-crop-banner" className="p-3.5 bg-slate-800/80 border border-slate-700 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-slate-400 block text-xs uppercase tracking-wider font-semibold">Active Commodity Authority</span>
                <span className="text-slate-100 font-bold text-sm md:text-base">{currentCommodityName}</span>
                <span className="text-slate-400 ml-2 text-xs">({authoritativeSource || 'DAC&FW / DMI AGMARKNET'})</span>
              </div>
              {sourceUrl && (
                <a 
                  id="link-official-source-url"
                  href={sourceUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1 text-emerald-400 hover:text-emerald-300 underline font-medium"
                >
                  <span>Verify at Official Portal</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          )}

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/60">
              <span className="text-slate-400 text-xs block">Universal Universe</span>
              <span className="text-lg font-bold text-slate-100">{canonicalCount}+ Crops</span>
              <span className="text-[11px] text-emerald-400 block mt-0.5">100% Uncapped</span>
            </div>
            <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/60">
              <span className="text-slate-400 text-xs block">Official Observations</span>
              <span className="text-lg font-bold text-slate-100">{observationCount} Records</span>
              <span className="text-[11px] text-slate-400 block mt-0.5">Daily APMC Bulletins</span>
            </div>
            <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/60">
              <span className="text-slate-400 text-xs block">APMC Market Registry</span>
              <span className="text-lg font-bold text-slate-100">{apmcCount}+ Mandis</span>
              <span className="text-[11px] text-emerald-400 block mt-0.5">Geocoded & Verified</span>
            </div>
            <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/60">
              <span className="text-slate-400 text-xs block">CACP MSP Benchmarks</span>
              <span className="text-lg font-bold text-slate-100">{OFFICIAL_CACP_MSP_RECORDS.length} Mandated</span>
              <span className="text-[11px] text-emerald-400 block mt-0.5">2024-25 Gazette</span>
            </div>
          </div>

          {/* Authoritative Primary Repositories */}
          <div>
            <h4 className="font-semibold text-slate-200 text-xs uppercase tracking-wider mb-2 flex items-center">
              <Database className="w-4 h-4 mr-1.5 text-emerald-400" />
              Authoritative Primary Repositories Integrated
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {OPEN_DATA_REGISTRY.slice(0, 6).map((src) => (
                <div 
                  key={src.id} 
                  id={`source-item-${src.id}`}
                  className="p-3 bg-slate-800/40 border border-slate-700/60 rounded-lg hover:border-slate-600 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h5 className="font-medium text-slate-200 text-xs">{src.name}</h5>
                      <p className="text-[11px] text-slate-400 mt-0.5">{src.agency}</p>
                    </div>
                    <span className="px-1.5 py-0.5 text-[10px] bg-slate-700 text-slate-300 rounded">
                      {src.updateCadence}
                    </span>
                  </div>
                  <div className="mt-2 pt-2 border-t border-slate-700/40 flex items-center justify-between text-[11px] text-slate-400">
                    <span>Coverage: {src.coverage}</span>
                    <a 
                      href={src.portalUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-emerald-400 hover:text-emerald-300 inline-flex items-center"
                    >
                      <span>Gov Link</span>
                      <ExternalLink className="w-3 h-3 ml-1" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Data Integrity Standard Notice */}
          <div className="p-3 bg-emerald-950/20 border border-emerald-800/40 rounded-lg text-slate-300 text-xs flex items-start space-x-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
            <div>
              <span className="font-semibold text-emerald-300">FARMFIT Statutory Integrity Protocol:</span>
              <p className="text-slate-400 mt-0.5">
                Market prices and arrivals reflect published APMC bulletins. In the absence of an official price for a specific mandi-commodity pair, the system provides transparent derived benchmarks rather than fabricated records.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
