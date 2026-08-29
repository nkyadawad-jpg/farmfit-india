import React, { useState } from 'react';
import { 
  CheckCircle2, 
  HelpCircle, 
  TrendingUp, 
  ShieldAlert, 
  Calendar, 
  Database, 
  FileText, 
  ArrowRight,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Droplets,
  Zap,
  AlertTriangle,
  Layers,
  ShieldCheck
} from 'lucide-react';
import { UniversalDecisionCardProps } from '../../types/decisionCenter';
import { ConfidenceBadge } from './ConfidenceBadge';
import { UniversalEvidenceModal } from './UniversalEvidenceModal';
import { RiskLevel } from '../../types/riskEngine';

export const FarmfitDecisionCard: React.FC<UniversalDecisionCardProps> = ({
  decisionTitle,
  decisionSubtitle,
  commodityName,
  cropCommodityId,
  whyExplanation,
  opportunityValue,
  opportunityDetail,
  riskLevel,
  riskScore,
  riskSummary,
  confidenceTier,
  confidenceExplanation,
  dataDate,
  dataSourceName,
  evidenceItems = [],
  actionLabel,
  onAction,
  badgeTag,
  evidenceSufficiencyTag,
  isTrendSufficient,
  primaryDecisionStatus,
  manageableRisks = [],
  economicWaterfall,
  actionPlan,
  decisionChangeTriggers = [],
  linkedEarlyWarnings = []
}) => {
  const [isEvidenceModalOpen, setIsEvidenceModalOpen] = useState(false);
  const [showDetailedPlan, setShowDetailedPlan] = useState(false);

  // Status-driven styling
  const status = primaryDecisionStatus || (
    riskLevel === 'LOW' ? 'RECOMMENDED' : 
    riskLevel === 'MODERATE' ? 'CONDITIONALLY_RECOMMENDED' : 
    riskLevel === 'HIGH' ? 'HIGH_RISK_OPPORTUNITY' : 'AVOID'
  );

  let statusBadgeClasses = 'bg-slate-100 text-slate-800 border-slate-300 dark:bg-slate-800 dark:text-slate-200';
  let statusLabel = 'DECISION READY';
  
  if (status === 'RECOMMENDED') {
    statusBadgeClasses = 'bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-950/80 dark:text-emerald-300 dark:border-emerald-700';
    statusLabel = 'RECOMMENDED';
  } else if (status === 'CONDITIONALLY_RECOMMENDED') {
    statusBadgeClasses = 'bg-teal-100 text-teal-900 border-teal-300 dark:bg-teal-950/80 dark:text-teal-300 dark:border-teal-700';
    statusLabel = 'CONDITIONALLY RECOMMENDED (MANAGEABLE)';
  } else if (status === 'HIGH_RISK_OPPORTUNITY') {
    statusBadgeClasses = 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950/80 dark:text-amber-300 dark:border-amber-700';
    statusLabel = 'HIGH RISK / HIGH RETURN';
  } else if (status === 'AVOID') {
    statusBadgeClasses = 'bg-rose-100 text-rose-900 border-rose-300 dark:bg-rose-950/80 dark:text-rose-300 dark:border-rose-700';
    statusLabel = 'AVOID (STRUCTURAL BLOCKER)';
  }

  // Risk styling
  let riskBadgeClasses = 'bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300';
  if (riskLevel === 'LOW') {
    riskBadgeClasses = 'bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800';
  } else if (riskLevel === 'MODERATE') {
    riskBadgeClasses = 'bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800';
  } else if (riskLevel === 'HIGH' || riskLevel === 'CRITICAL') {
    riskBadgeClasses = 'bg-rose-50 text-rose-800 border-rose-300 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800';
  }

  return (
    <>
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between relative overflow-hidden w-full space-y-4">
        {/* Top Header Row */}
        <div>
          <div className="flex flex-wrap items-start justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800/80">
            <div className="space-y-1.5 max-w-full">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border tracking-wide uppercase ${statusBadgeClasses}`}>
                  {statusLabel}
                </span>
                {badgeTag && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                    {badgeTag}
                  </span>
                )}
                {evidenceSufficiencyTag && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border flex items-center gap-1 ${
                    isTrendSufficient === false 
                      ? 'bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800'
                      : 'bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800'
                  }`}>
                    <CheckCircle2 className="w-3 h-3 text-current" />
                    {evidenceSufficiencyTag}
                  </span>
                )}
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight break-words">
                {decisionTitle}
              </h3>
              {decisionSubtitle && (
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium break-words">
                  {decisionSubtitle}
                </p>
              )}
            </div>

            <div className="flex flex-col items-end gap-1.5 shrink-0">
              <ConfidenceBadge tier={confidenceTier} size="sm" />
              <div className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${riskBadgeClasses}`}>
                Risk: {riskLevel} {riskScore !== undefined ? `(${riskScore}/100)` : ''}
              </div>
            </div>
          </div>

          {/* Core Decision Body */}
          <div className="py-3.5 space-y-3.5">
            {/* WHY? */}
            <div className="bg-slate-50/90 dark:bg-slate-950/50 rounded-2xl p-3.5 border border-slate-100 dark:border-slate-800/80 space-y-1">
              <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>FARMFIT EVALUATION</span>
              </div>
              <p className="text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200 leading-relaxed break-words">
                {whyExplanation}
              </p>
            </div>

            {/* Economic Waterfall (Phase 6) */}
            {economicWaterfall && (
              <div className="bg-emerald-950/5 dark:bg-emerald-950/30 border border-emerald-200/70 dark:border-emerald-800/50 rounded-2xl p-3.5 space-y-2">
                <div className="flex items-center justify-between text-[11px] font-bold text-emerald-900 dark:text-emerald-300 uppercase tracking-wider">
                  <span className="flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                    <span>ECONOMIC REALIZATION WATERFALL (PER ACRE)</span>
                  </span>
                  <span className="font-mono text-xs">
                    ₹{economicWaterfall.expectedEconomicRealizationPerAcre.value.toLocaleString('en-IN')}/ac
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div className="p-2 bg-white dark:bg-slate-900 rounded-xl border border-emerald-100 dark:border-slate-800">
                    <span className="text-[10px] text-slate-500 uppercase font-bold block truncate">Gross Revenue</span>
                    <span className="font-black text-slate-900 dark:text-white text-sm">
                      ₹{economicWaterfall.grossRevenuePerAcre.value.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="p-2 bg-white dark:bg-slate-900 rounded-xl border border-emerald-100 dark:border-slate-800">
                    <span className="text-[10px] text-slate-500 uppercase font-bold block truncate">Base Cost (CACP)</span>
                    <span className="font-bold text-slate-700 dark:text-slate-300 text-sm">
                      -₹{economicWaterfall.baseProductionCostPerAcre.value.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="p-2 bg-white dark:bg-slate-900 rounded-xl border border-emerald-100 dark:border-slate-800">
                    <span className="text-[10px] text-slate-500 uppercase font-bold block truncate">Risk Mitigation</span>
                    <span className={`font-bold text-sm ${economicWaterfall.additionalRiskMitigationCostPerAcre.value > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-slate-500'}`}>
                      {economicWaterfall.additionalRiskMitigationCostPerAcre.value > 0 ? `-₹${economicWaterfall.additionalRiskMitigationCostPerAcre.value.toLocaleString('en-IN')}` : '₹0'}
                    </span>
                  </div>

                  <div className="p-2 bg-emerald-50 dark:bg-emerald-950/80 rounded-xl border border-emerald-300 dark:border-emerald-700">
                    <span className="text-[10px] text-emerald-800 dark:text-emerald-300 uppercase font-bold block truncate">Expected Net</span>
                    <span className="font-black text-emerald-700 dark:text-emerald-300 text-sm">
                      ₹{economicWaterfall.expectedEconomicRealizationPerAcre.value.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Manageable vs Structural Risks Highlights (Phase 6) */}
            {manageableRisks.length > 0 && (
              <div className="bg-slate-50/90 dark:bg-slate-950/40 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wide flex items-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
                    <span>RISK MANAGEMENT &amp; MITIGATION FEASIBILITY</span>
                  </span>
                  <span className="text-[10px] font-bold text-slate-500">
                    {manageableRisks.filter(r => r.managementClassification === 'MANAGEABLE' || r.managementClassification === 'MANAGEABLE_WITH_COST').length} Manageable &bull; {manageableRisks.filter(r => r.managementClassification === 'STRUCTURAL_CONSTRAINT').length} Structural
                  </span>
                </div>

                <div className="space-y-1.5">
                  {manageableRisks.slice(0, 2).map((risk, rIdx) => (
                    <div key={rIdx} className="p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/60 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-slate-900 dark:text-white">{risk.riskFactor}</span>
                          <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase ${
                            risk.managementClassification === 'MANAGEABLE' || risk.managementClassification === 'MANAGEABLE_WITH_COST'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' 
                              : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                          }`}>
                            {risk.managementClassification.replace(/_/g, ' ')}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                          {risk.managementOption || risk.actionableSteps?.[0]}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-xs font-black text-slate-800 dark:text-slate-200 block">
                          {(risk.estimatedCostPerAcre || 0) > 0 ? `+₹${risk.estimatedCostPerAcre.toLocaleString('en-IN')}/ac` : 'No added cost'}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          Residual Risk: {risk.riskAfterManagement}% ({risk.residualRiskLevel})
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Plan Toggle (Phase 6) */}
            {actionPlan && (
              <div>
                <button
                  type="button"
                  onClick={() => setShowDetailedPlan(!showDetailedPlan)}
                  className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors flex items-center justify-between cursor-pointer"
                >
                  <span className="flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-500" />
                    <span>View Step-by-Step Action Plan ({actionPlan.now.actions.length + actionPlan.beforePlanting.actions.length + actionPlan.duringCrop.actions.length + actionPlan.sellingWindow.actions.length} Milestones)</span>
                  </span>
                  {showDetailedPlan ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>

                {showDetailedPlan && (
                  <div className="mt-2 p-3.5 bg-slate-50 dark:bg-slate-950/60 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 text-xs">
                    <div>
                      <span className="font-bold text-[10px] text-emerald-700 dark:text-emerald-400 uppercase tracking-wider block mb-1">
                        1. {actionPlan.now.title} ({actionPlan.now.timeframe})
                      </span>
                      <ul className="space-y-1 text-slate-700 dark:text-slate-300 list-disc list-inside">
                        {actionPlan.now.actions.map((act, i) => (
                          <li key={i}>{act}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <span className="font-bold text-[10px] text-sky-700 dark:text-sky-400 uppercase tracking-wider block mb-1">
                        2. {actionPlan.duringCrop.title} ({actionPlan.duringCrop.timeframe})
                      </span>
                      <ul className="space-y-1 text-slate-700 dark:text-slate-300 list-disc list-inside">
                        {actionPlan.duringCrop.actions.map((act, i) => (
                          <li key={i}>{act}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <span className="font-bold text-[10px] text-amber-700 dark:text-amber-400 uppercase tracking-wider block mb-1">
                        3. {actionPlan.sellingWindow.title} ({actionPlan.sellingWindow.timeframe})
                      </span>
                      <ul className="space-y-1 text-slate-700 dark:text-slate-300 list-disc list-inside">
                        {actionPlan.sellingWindow.actions.map((act, i) => (
                          <li key={i}>{act}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Card Footer: Data Date, Source & View Evidence Button */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
          <div className="text-[11px] text-slate-500 dark:text-slate-400 flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="flex items-center gap-1">
              <Database className="w-3.5 h-3.5 text-slate-400" />
              <span>{dataSourceName}</span>
            </span>
            {dataDate && (
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Bulletin: {dataDate}</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEvidenceModalOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>View Technical Evidence ({evidenceItems.length || 1})</span>
            </button>

            {actionLabel && onAction && (
              <button
                onClick={onAction}
                className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span>{actionLabel}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Universal Evidence Modal */}
      <UniversalEvidenceModal
        isOpen={isEvidenceModalOpen}
        onClose={() => setIsEvidenceModalOpen(false)}
        title={`${decisionTitle} — Evidence & Provenance`}
        evidenceItems={evidenceItems}
        commodityName={commodityName}
      />
    </>
  );
};

