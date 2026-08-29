import React from 'react';
import { X, ExternalLink, Database, Calendar, Layers, ShieldCheck, Calculator } from 'lucide-react';
import { DecisionEvidenceItem } from '../../types/decisionCenter';
import { EvidenceTypeBadge } from './EvidenceTypeBadge';
import { ConfidenceBadge } from './ConfidenceBadge';

interface UniversalEvidenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  evidenceItems: DecisionEvidenceItem[];
  commodityName?: string;
}

export const UniversalEvidenceModal: React.FC<UniversalEvidenceModalProps> = ({
  isOpen,
  onClose,
  title,
  evidenceItems,
  commodityName
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/50">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                FARMFIT Provenance & Evidence Audit
              </span>
              {commodityName && (
                <span className="text-[11px] bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold px-2 py-0.5 rounded-full">
                  {commodityName}
                </span>
              )}
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-0.5">
              {title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4 divide-y divide-slate-100 dark:divide-slate-800">
          <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 rounded-xl p-3.5 text-xs text-emerald-900 dark:text-emerald-200 leading-relaxed flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Zero Fabrication Policy:</span> Every metric shown in FARMFIT is classified into strictly observed open government data (AGMARKNET, CACP, DES), deterministic mathematical models, or clearly identified scenario simulations.
            </div>
          </div>

          {evidenceItems.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-sm">
              No evidence records attached for this item.
            </div>
          ) : (
            <div className="pt-4 space-y-4">
              {evidenceItems.map((item, idx) => (
                <div key={item.id || idx} className="bg-slate-50 dark:bg-slate-950/50 border border-slate-200/80 dark:border-slate-800 rounded-xl p-4 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <EvidenceTypeBadge classification={item.classification} size="sm" />
                    <ConfidenceBadge tier={item.confidence} size="sm" />
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      {item.label}
                    </h4>
                    <div className="text-xs text-slate-600 dark:text-slate-400 mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                      <span className="flex items-center gap-1">
                        <Database className="w-3.5 h-3.5 text-slate-400" />
                        <span className="font-medium text-slate-700 dark:text-slate-300">{item.source}</span>
                      </span>
                      {item.date && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>Reported: {item.date}</span>
                        </span>
                      )}
                      {item.observationCount !== undefined && (
                        <span className="flex items-center gap-1">
                          <Layers className="w-3.5 h-3.5 text-slate-400" />
                          <span>{item.observationCount} Observations</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {item.calculationFormula && (
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-2.5 font-mono text-[11px] text-slate-800 dark:text-slate-200 flex items-start gap-2">
                      <Calculator className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                      <div>
                        <div className="text-[10px] uppercase font-bold text-slate-400 font-sans">Formula / Derivation</div>
                        <div>{item.calculationFormula}</div>
                      </div>
                    </div>
                  )}

                  {item.sourceUrl && (
                    <div className="pt-1">
                      <a
                        href={item.sourceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 font-semibold"
                      >
                        <span>Official Bulletin Portal</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-100 dark:text-slate-900 font-semibold text-xs transition-colors cursor-pointer"
          >
            Close Audit View
          </button>
        </div>
      </div>
    </div>
  );
};
