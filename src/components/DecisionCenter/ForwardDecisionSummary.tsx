import React, { useState } from 'react';
import { 
  Sprout, 
  Store, 
  Calendar, 
  TrendingUp, 
  DollarSign, 
  Droplet, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Truck, 
  Layers, 
  ChevronDown, 
  ChevronUp, 
  HelpCircle, 
  ArrowRight,
  ShieldCheck,
  Zap,
  Info,
  Scale,
  Activity
} from 'lucide-react';
import { FarmDecisionAssessment, WhyNotReason } from '../../types/decisionAssessment';
import { ConfidenceBadge } from './ConfidenceBadge';
import { EvidenceTypeBadge } from './EvidenceTypeBadge';
import { UniversalEvidenceModal } from './UniversalEvidenceModal';

interface ForwardDecisionSummaryProps {
  assessment: FarmDecisionAssessment;
  allRankedAssessments?: FarmDecisionAssessment[];
  onSelectCrop?: (cropId: string) => void;
  onNavigateToMarkets?: () => void;
}

export const ForwardDecisionSummary: React.FC<ForwardDecisionSummaryProps> = ({
  assessment,
  allRankedAssessments = [],
  onSelectCrop,
  onNavigateToMarkets
}) => {
  const [selectedScenario, setSelectedScenario] = useState<'BASE' | 'BEAR' | 'BULL'>('BASE');
  const [showCostBreakdown, setShowCostBreakdown] = useState(false);
  const [showWhyNotModal, setShowWhyNotModal] = useState(false);
  const [isEvidenceModalOpen, setIsEvidenceModalOpen] = useState(false);

  const {
    displayName,
    category,
    season,
    farmSuitabilityScore,
    suitability,
    expectedPrice,
    profitability,
    productionTiming,
    sellingTiming,
    waterAndWeather,
    alternativeMarkets,
    marketOpportunity,
    riskAssessment,
    confidence,
    recommendation,
    whyNotReasons = []
  } = assessment;

  const plannedAcres = assessment.farm?.plannedAcres || 1;
  const currentPriceCase = 
    selectedScenario === 'BEAR' ? profitability.bearCase :
    selectedScenario === 'BULL' ? profitability.bullCase :
    profitability.baseCase;

  const expectedPriceData = 
    selectedScenario === 'BEAR' ? expectedPrice.bearCase :
    selectedScenario === 'BULL' ? expectedPrice.bullCase :
    expectedPrice.baseCase;

  const bestMarket = marketOpportunity.bestMarket;

  return (
    <div className="space-y-6">
      {/* 1. EXECUTIVE FORWARD DECISION HERO CARD */}
      <div className="bg-gradient-to-br from-emerald-900 via-slate-900 to-slate-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-emerald-800/40 relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        {/* Top Status & Recommendation Tag */}
        <div className="flex flex-wrap items-center justify-between gap-3 relative z-10 pb-6 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <span className="text-[11px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-emerald-400" />
              FORWARD DECISION INTELLIGENCE
            </span>
            <span className="text-xs text-slate-300 font-medium hidden sm:inline">
              Calibrated for {assessment.location?.district || 'Your District'}, {assessment.location?.state || 'India'} &bull; {season} Season
            </span>
          </div>

          <div className="flex items-center gap-2">
            <ConfidenceBadge tier={confidence.confidenceTier} size="sm" />
            <button
              onClick={() => setIsEvidenceModalOpen(true)}
              className="text-xs font-bold px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-slate-200 border border-white/20 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Info className="w-3.5 h-3.5" />
              Evidence &amp; Provenance
            </button>
          </div>
        </div>

        {/* Hero Title & Primary Action Verdict */}
        <div className="mt-6 space-y-2 relative z-10">
          <div className="flex flex-wrap items-baseline gap-3">
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
              Produce <span className="text-emerald-400 underline decoration-emerald-500/40 underline-offset-8">{displayName}</span>
            </h2>
            <span className="text-sm font-semibold text-emerald-200/80 bg-emerald-950/60 px-3 py-0.5 rounded-full border border-emerald-700/50">
              Rank #1 Optimal Crop ({category})
            </span>
          </div>
          <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
            {recommendation.whyThisCrop[0]} {recommendation.whyThisMarket[0]}
          </p>
        </div>

        {/* 4 CORE DECISION PILLARS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8 relative z-10">
          {/* PILLAR 1: WHAT TO PRODUCE */}
          <div className="bg-white/5 hover:bg-white/10 transition-colors border border-white/10 rounded-2xl p-4.5 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sprout className="w-4 h-4 text-emerald-400" />
                1. WHAT TO PRODUCE
              </span>
              <span className="text-xs font-black text-emerald-300">{farmSuitabilityScore}/100 Match</span>
            </div>
            <div className="text-lg font-black text-white">{displayName}</div>
            <div className="text-xs text-slate-300 space-y-1">
              <div>Agronomic Fit: <strong className="text-emerald-300">{suitability.suitabilityLevel}</strong></div>
              <div>Water Req: <strong className="text-slate-200">{waterAndWeather.waterRequirementMm} mm</strong> ({waterAndWeather.waterSufficiencyIndex}% fit)</div>
            </div>
          </div>

          {/* PILLAR 2: WHEN TO PRODUCE */}
          <div className="bg-white/5 hover:bg-white/10 transition-colors border border-white/10 rounded-2xl p-4.5 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-amber-400" />
                2. WHEN TO PRODUCE
              </span>
              <span className="text-xs font-bold text-amber-300">{productionTiming.durationDays} Days</span>
            </div>
            <div className="text-sm font-bold text-white leading-tight">
              Sow: <span className="text-amber-200">{productionTiming.sowingWindow}</span>
            </div>
            <div className="text-xs text-slate-300 space-y-1">
              <div>Harvest: <strong className="text-slate-200">{productionTiming.harvestWindow}</strong></div>
              <div className="text-emerald-400 font-semibold">{productionTiming.arrivalPatternExpectation}</div>
            </div>
          </div>

          {/* PILLAR 3: WHERE TO SELL */}
          <div className="bg-white/5 hover:bg-white/10 transition-colors border border-white/10 rounded-2xl p-4.5 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
                <Store className="w-4 h-4 text-sky-400" />
                3. WHERE TO SELL
              </span>
              <span className="text-xs font-black text-sky-300">
                {bestMarket?.distance ? `${bestMarket.distance} km` : 'Local Mandi'}
              </span>
            </div>
            <div className="text-lg font-black text-white truncate">
              {bestMarket?.market || 'Recommended APMC'}
            </div>
            <div className="text-xs text-slate-300 space-y-1">
              <div>Modal Price: <strong className="text-sky-300">₹{bestMarket?.modalPrice || expectedPrice.baseCase.price}/Qtl</strong></div>
              <div>Est. Freight: <strong className="text-slate-200">₹{bestMarket?.distance ? Math.round(bestMarket.distance * 1.4) : 80}/Qtl</strong></div>
            </div>
          </div>

          {/* PILLAR 4: ECONOMIC OUTCOME */}
          <div className="bg-emerald-950/60 hover:bg-emerald-950/80 transition-colors border border-emerald-600/50 rounded-2xl p-4.5 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-emerald-300" />
                4. NET PROFIT (BASE)
              </span>
              <span className="text-xs font-black text-emerald-300">+{profitability.baseCase.roiPercent}% ROI</span>
            </div>
            <div className="text-2xl font-black text-emerald-400">
              ₹{profitability.baseCase.netRealizationPerAcre.toLocaleString('en-IN')}<span className="text-xs font-normal text-slate-300">/acre</span>
            </div>
            <div className="text-xs text-slate-300 space-y-1">
              <div>Total Net ({plannedAcres} ac): <strong className="text-emerald-300">₹{profitability.baseCase.totalNetRealization.toLocaleString('en-IN')}</strong></div>
              <div>Cultivation Cost: <strong className="text-slate-200">₹{profitability.totalCostPerAcre.toLocaleString('en-IN')}/ac</strong></div>
            </div>
          </div>
        </div>

        {/* BOTTOM SELLING SIGNAL BAR */}
        <div className="mt-6 pt-5 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-400">Selling Signal:</span>
            <span className={`px-2.5 py-0.5 rounded-md font-black tracking-wide ${
              sellingTiming.action === 'SELL NOW' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
              sellingTiming.action === 'HOLD / MONITOR' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' :
              'bg-slate-700 text-slate-300'
            }`}>
              {sellingTiming.action}
            </span>
            <span className="text-slate-300 hidden md:inline">&bull; {sellingTiming.recommendationDetail}</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-slate-400">30D Price Momentum: <strong className="text-emerald-400">{sellingTiming.thirtyDayTrend}</strong></span>
            <span className="text-slate-400">Liquidity: <strong className="text-slate-200">{sellingTiming.liquidityCondition}</strong></span>
          </div>
        </div>
      </div>

      {/* 1.5. CONSTRAINT CLASSIFICATION & WATER FEASIBILITY INTELLIGENCE */}
      {(recommendation.constraints && recommendation.constraints.length > 0) || recommendation.waterFeasibility || recommendation.conditionalManagementPlan ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <EvidenceTypeBadge classification="FARMFIT_DERIVED_INTELLIGENCE" size="sm" />
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">
                  AGRONOMIC CONSTRAINT MANAGEMENT ENGINE
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 mt-1">
                Constraint Diagnosis &amp; Conditional Management Plan
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                Actionable mitigation pathways for field-level water deficits, soil conditions, and operational risks.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className={`text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider ${
                recommendation.threeTierVerdict === 'RECOMMENDED' 
                  ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                  : recommendation.threeTierVerdict === 'CONDITIONALLY_RECOMMENDED'
                  ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
                  : 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-800'
              }`}>
                {recommendation.threeTierVerdict?.replace(/_/g, ' ') || 'DECISION READY'}
              </span>
            </div>
          </div>

          {/* Water Feasibility Diagnostic Card */}
          {recommendation.waterFeasibility && (
            <div className="p-5 rounded-2xl bg-sky-50/70 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-sky-950 dark:text-sky-200 flex items-center gap-2">
                  <Droplet className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                  Water Balance &amp; Irrigation Feasibility Analysis
                </h4>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-sky-200 dark:bg-sky-900 text-sky-900 dark:text-sky-200">
                  {recommendation.waterFeasibility.feasibilityStatus.replace(/_/g, ' ')}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-sky-100 dark:border-sky-900">
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Crop Requirement</span>
                  <span className="font-black text-slate-900 dark:text-white text-base">
                    {recommendation.waterFeasibility.cropWaterRequirementMm} mm
                  </span>
                </div>
                <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-sky-100 dark:border-sky-900">
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Natural Available</span>
                  <span className="font-black text-slate-900 dark:text-white text-base">
                    {recommendation.waterFeasibility.naturalMoistureAvailableMm} mm
                  </span>
                </div>
                <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-sky-100 dark:border-sky-900">
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Net Deficit</span>
                  <span className={`font-black text-base ${recommendation.waterFeasibility.netWaterDeficitMm > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                    {recommendation.waterFeasibility.netWaterDeficitMm} mm
                  </span>
                </div>
                <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-sky-100 dark:border-sky-900">
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Mitigation Cost / Ac</span>
                  <span className="font-black text-slate-900 dark:text-white text-base">
                    ₹{recommendation.waterFeasibility.estimatedSupplementalCostPerAcre.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <p className="text-xs text-sky-900 dark:text-sky-300 font-medium">
                {recommendation.waterFeasibility.feasibilitySummary}
              </p>
            </div>
          )}

          {/* Manageable vs Hard Constraints Matrix */}
          {recommendation.constraints && recommendation.constraints.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Detailed Constraint Diagnostics
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {recommendation.constraints.map((c, i) => (
                  <div 
                    key={i} 
                    className={`p-4 rounded-2xl border ${
                      c.classification === 'HARD_CONSTRAINT'
                        ? 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-800/80'
                        : 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800/80'
                    } space-y-2`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-900 dark:text-white">
                        {c.parameterName} ({c.observedValue})
                      </span>
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                        c.classification === 'HARD_CONSTRAINT'
                          ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      }`}>
                        {c.classification.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 dark:text-slate-300">{c.description}</p>
                    {c.actionableManagementOptions.length > 0 && (
                      <div className="pt-2 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400">
                        <strong>Management Action:</strong> {c.actionableManagementOptions[0]}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Conditional Management Plan Breakdown */}
          {recommendation.conditionalManagementPlan && recommendation.conditionalManagementPlan.recommendedInterventions.length > 0 && (
            <div className="p-5 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-amber-950 dark:text-amber-200 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  Recommended Conditional Management Plan
                </h4>
                <span className="text-xs font-black text-amber-900 dark:text-amber-300">
                  Total Interventions: +₹{recommendation.conditionalManagementPlan.totalAdditionalManagementCostPerAcre.toLocaleString('en-IN')}/acre
                </span>
              </div>

              <div className="space-y-2">
                {recommendation.conditionalManagementPlan.recommendedInterventions.map((item, idx) => (
                  <div key={idx} className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-amber-200 dark:border-amber-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white block">{item.interventionName}</span>
                      <span className="text-slate-600 dark:text-slate-400 text-[11px]">{item.action} &bull; Required: <strong>{item.requiredInputs.join(', ')}</strong></span>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="font-black text-amber-700 dark:text-amber-400 text-sm">
                        +₹{item.estimatedCostPerAcre.toLocaleString('en-IN')}/ac
                      </span>
                      <span className="block text-[10px] text-slate-400">{item.timing}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-[11px] text-amber-900 dark:text-amber-300 italic pt-1">
                * Note: With these interventions implemented, projected ROI remains viable at <strong>+{recommendation.conditionalManagementPlan.expectedRoiAfterManagementPercent}%</strong> (A2+FL).
              </div>
            </div>
          )}
        </div>
      ) : null}

      {/* 2. THREE SCENARIOS (BEAR / BASE / BULL) & PROFITABILITY DEEP-DIVE */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <EvidenceTypeBadge classification="FARMFIT_DERIVED_INTELLIGENCE" size="sm" />
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">ECONOMIC OUTCOME ENGINE</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 mt-1">
              Expected Price &amp; Profitability Scenarios
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Evaluated for {plannedAcres} acre(s) with CACP 2024-25 cultivation cost benchmarks.
            </p>
          </div>

          {/* Scenario Selector Pills */}
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setSelectedScenario('BEAR')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedScenario === 'BEAR'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Bear Case (Pessimistic)
            </button>
            <button
              onClick={() => setSelectedScenario('BASE')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedScenario === 'BASE'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Base Case (Expected)
            </button>
            <button
              onClick={() => setSelectedScenario('BULL')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedScenario === 'BULL'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Bull Case (Optimistic)
            </button>
          </div>
        </div>

        {/* Active Scenario Numbers Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
          <div>
            <div className="text-[11px] uppercase font-bold text-slate-500">Wholesale Price</div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 mt-0.5">
              ₹{currentPriceCase.pricePerQtl.toLocaleString('en-IN')}<span className="text-xs font-normal text-slate-500">/Qtl</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-1 truncate">{expectedPriceData.assumptions[0] || 'Market assumption'}</div>
          </div>

          <div>
            <div className="text-[11px] uppercase font-bold text-slate-500">Gross Revenue / Acre</div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 mt-0.5">
              ₹{currentPriceCase.grossRevenuePerAcre.toLocaleString('en-IN')}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">Yield: {profitability.expectedYieldQuintalsPerAcre} Qtl/acre</div>
          </div>

          <div>
            <div className="text-[11px] uppercase font-bold text-slate-500">Cost of Cultivation</div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 mt-0.5">
              ₹{profitability.totalCostPerAcre.toLocaleString('en-IN')}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">CACP 2024-25 A2+FL Benchmark</div>
          </div>

          <div>
            <div className="text-[11px] uppercase font-bold text-emerald-700 dark:text-emerald-400">Net Realization / Acre</div>
            <div className={`text-xl sm:text-2xl font-black mt-0.5 ${
              currentPriceCase.netRealizationPerAcre >= 0 ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-600'
            }`}>
              ₹{currentPriceCase.netRealizationPerAcre.toLocaleString('en-IN')}
            </div>
            <div className="text-[11px] text-emerald-700 dark:text-emerald-400 font-bold mt-1">
              ROI: {currentPriceCase.roiPercent}% &bull; Total: ₹{currentPriceCase.totalNetRealization.toLocaleString('en-IN')}
            </div>
          </div>
        </div>

        {/* Working Capital & Budget Constraint Box */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs">
          <div className="flex items-center gap-2.5">
            <Scale className="w-4 h-4 text-emerald-600" />
            <div>
              <span className="font-bold text-slate-800 dark:text-slate-200">
                Total Farm Capital Requirement ({plannedAcres} ac):
              </span>{' '}
              <strong className="text-emerald-700 dark:text-emerald-400 font-black">
                ₹{profitability.totalFarmCost.toLocaleString('en-IN')}
              </strong>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-slate-500">
              Working Capital Budget:{' '}
              <strong className="text-slate-800 dark:text-slate-200">
                {profitability.workingCapitalBudget === 'UNLIMITED' ? 'UNLIMITED / CUSTOM' : `₹${profitability.workingCapitalBudget.toLocaleString('en-IN')}`}
              </strong>
            </span>
            <span className={`px-2.5 py-0.5 rounded-full font-bold ${
              profitability.capitalSufficiencyStatus === 'WITHIN_BUDGET' || profitability.capitalSufficiencyStatus === 'UNLIMITED'
                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
            }`}>
              {profitability.capitalSufficiencyStatus.replace('_', ' ')}
            </span>
          </div>
        </div>

        {/* Accordion Toggle for Itemized Cost of Cultivation */}
        <div>
          <button
            onClick={() => setShowCostBreakdown(!showCostBreakdown)}
            className="w-full flex items-center justify-between p-3.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200/70 dark:hover:bg-slate-800 transition-colors text-xs font-bold text-slate-800 dark:text-slate-200 cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-600" />
              Itemized Cost of Cultivation Breakdown (₹{profitability.totalCostPerAcre.toLocaleString('en-IN')} / acre)
            </span>
            {showCostBreakdown ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showCostBreakdown && (
            <div className="mt-3 p-4 bg-slate-50 dark:bg-slate-950/40 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                {profitability.itemizedCosts.map((cost, idx) => (
                  <div key={idx} className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                    <div className="flex items-center justify-between text-slate-500">
                      <span className="font-bold">{cost.category}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono">
                        {cost.provenance}
                      </span>
                    </div>
                    <div className="text-base font-black text-slate-900 dark:text-slate-100">
                      ₹{cost.costPerAcre.toLocaleString('en-IN')} <span className="text-[11px] font-normal text-slate-500">/acre</span>
                    </div>
                    <div className="text-[10px] text-slate-500 truncate">{cost.benchmarkReference}</div>
                  </div>
                ))}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 italic">
                * Note: Cultivation costs are calculated using standard CACP 2024-25 A2+FL factor allocations (Seed 15%, Fertilizer 20%, Labour 30%, Irrigation &amp; Power 15%, Machinery 12%, Transport/Other 8%). Actual expenditures may vary based on farm-level input sourcing.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 3. ALTERNATIVE MARKETS & SELLING REALIZATION COMPARISON */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <EvidenceTypeBadge classification="OFFICIAL_OBSERVED_DATA" size="sm" />
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">WHERE TO SELL?</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 mt-1">
              Nearby APMC Mandi Realization Comparison (200 km Radius)
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Sorted by Net Realization Value (NRV = Spot Wholesale Price minus Freight &amp; Mandi Cess).
            </p>
          </div>

          {onNavigateToMarkets && (
            <button
              onClick={onNavigateToMarkets}
              className="text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
            >
              View Full 200km Mandi Map <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Alternative Mandis Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-3">Mandi / Yard</th>
                <th className="py-3 px-3">Distance</th>
                <th className="py-3 px-3">Modal Price</th>
                <th className="py-3 px-3">Est. Freight</th>
                <th className="py-3 px-3">Net Realization (NRV)</th>
                <th className="py-3 px-3">Liquidity</th>
                <th className="py-3 px-3">Recommendation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {alternativeMarkets.map((mkt, i) => (
                <tr 
                  key={i} 
                  className={`hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors ${
                    mkt.isBest ? 'bg-emerald-50/60 dark:bg-emerald-950/20 font-semibold' : ''
                  }`}
                >
                  <td className="py-3.5 px-3">
                    <div className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                      {mkt.marketName}
                      {mkt.isBest && (
                        <span className="text-[10px] bg-emerald-600 text-white font-bold px-2 py-0.5 rounded-full">
                          BEST NRV
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-500">{mkt.district}, {mkt.state}</div>
                  </td>
                  <td className="py-3.5 px-3 text-slate-700 dark:text-slate-300">
                    {mkt.distanceKm} km
                  </td>
                  <td className="py-3.5 px-3 font-bold text-slate-900 dark:text-slate-100">
                    ₹{mkt.modalPrice.toLocaleString('en-IN')}/Qtl
                  </td>
                  <td className="py-3.5 px-3 text-slate-600 dark:text-slate-400">
                    -₹{mkt.estimatedFreightPerQtl}/Qtl
                  </td>
                  <td className="py-3.5 px-3 font-black text-emerald-700 dark:text-emerald-400 text-sm">
                    ₹{mkt.netRealizationPerQtl.toLocaleString('en-IN')}/Qtl
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {mkt.liquidity}
                    </span>
                  </td>
                  <td className="py-3.5 px-3">
                    {mkt.isBest ? (
                      <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Primary Choice
                      </span>
                    ) : (
                      <span className="text-xs text-slate-500">Secondary Backup</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. "WHY NOT?" COMPARISON PANEL */}
      {whyNotReasons.length > 0 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
                COMPARATIVE DECISION TRANSPARENCY
              </span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                Why was {displayName} selected over other crops?
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Transparent breakdown of why alternative candidates scored lower for your specific farm parameters.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {whyNotReasons.map((wn, idx) => (
              <div 
                key={idx}
                className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                    #{wn.rank} {wn.cropName}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                    Lower Risk-Adjusted Score
                  </span>
                </div>
                <div className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                  {wn.primaryDeficit}
                </div>
                <ul className="text-[11px] text-slate-500 space-y-0.5 list-disc list-inside">
                  {wn.reasons.slice(1).map((r, rIdx) => (
                    <li key={rIdx}>{r}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal for Universal Evidence */}
      {isEvidenceModalOpen && (
        <UniversalEvidenceModal
          isOpen={isEvidenceModalOpen}
          onClose={() => setIsEvidenceModalOpen(false)}
          evidenceItems={assessment.provenance.map((p, idx) => ({
            id: `${p.cropCommodityId || 'prov_item'}_${idx}`,
            classification: p.sourceName.includes('AGMARKNET') || p.sourceName.includes('Ministry') ? 'OFFICIAL_OBSERVED_DATA' : 'FARMFIT_DERIVED_INTELLIGENCE',
            label: p.sourceName,
            source: p.sourceName,
            date: p.publicationDate,
            confidence: p.confidenceIndex > 80 ? 'HIGH' : 'MEDIUM'
          }))}
          title={`Evidence Provenance for ${displayName}`}
          commodityName={displayName}
        />
      )}
    </div>
  );
};
