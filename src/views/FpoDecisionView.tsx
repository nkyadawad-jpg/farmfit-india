import React, { useState, useMemo } from 'react';
import { 
  Users, 
  Sprout, 
  PieChart, 
  Store, 
  ShieldAlert, 
  Sliders, 
  CheckCircle2, 
  TrendingUp, 
  Calendar, 
  AlertTriangle, 
  Building2, 
  Truck, 
  FileText, 
  Sparkles, 
  ArrowRight,
  Database,
  Layers,
  ChevronRight
} from 'lucide-react';
import { 
  FpoSetupProfile, 
  FpoDecisionPlanResult, 
  FpoCropPlanItem 
} from '../types/decisionCenter';
import { fpoDecisionService } from '../services/fpoDecisionService';
import { FarmfitDecisionCard } from '../components/DecisionCenter/FarmfitDecisionCard';
import { ConfidenceBadge } from '../components/DecisionCenter/ConfidenceBadge';
import { EvidenceTypeBadge } from '../components/DecisionCenter/EvidenceTypeBadge';
import { UniversalEvidenceModal } from '../components/DecisionCenter/UniversalEvidenceModal';
import { MarketTrendScorecard } from '../components/DecisionCenter/MarketTrendScorecard';
import { marketDataService } from '../services/marketDataService';
import { MarketRankingMode } from '../types/marketAnalytics';
import { ALL_INDIAN_STATES } from '../data/indiaAdminData';

export const FpoDecisionView: React.FC = () => {
  const [fpoProfile, setFpoProfile] = useState<FpoSetupProfile>(
    fpoDecisionService.getDefaultFpoProfile()
  );

  const [activeTab, setActiveTab] = useState<
    'CROP_PLAN' | 'PORTFOLIO_SPLIT' | 'MARKET_STRATEGY' | 'HARVEST_GLUT' | 'RISK_MITIGATION' | 'WHAT_IF' | 'ACTION_PLAN'
  >('CROP_PLAN');

  const [selectedCropModal, setSelectedCropModal] = useState<FpoCropPlanItem | null>(null);
  const [fpoSelectedCropId, setFpoSelectedCropId] = useState<string>('soybean');
  const [fpoRankingMode, setFpoRankingMode] = useState<MarketRankingMode>('HIGHEST_NRV');

  // Compute FPO decision plan
  const planResult: FpoDecisionPlanResult = useMemo(() => {
    return fpoDecisionService.evaluateFpoPlan(fpoProfile);
  }, [fpoProfile]);

  const fpoVerifiedAnalytics = useMemo(() => {
    return marketDataService.getVerifiedAnalytics(
      fpoSelectedCropId,
      undefined,
      { state: fpoProfile.state, district: fpoProfile.district },
      { radiusKm: 250, rankingMode: fpoRankingMode }
    );
  }, [fpoSelectedCropId, fpoProfile.state, fpoProfile.district, fpoRankingMode]);

  return (
    <div className="space-y-8 pb-16">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
              <Users className="w-4 h-4" />
              FPO PRODUCTION & MARKET DECISION CENTER
            </span>
            <span className="text-xs bg-blue-50 text-blue-800 dark:bg-blue-950 dark:text-blue-300 font-bold px-2.5 py-0.5 rounded-full border border-blue-200 dark:border-blue-800">
              {fpoProfile.fpoName}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            Collective Production Planning & Portfolio Allocation
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Answers: What crops should our FPO encourage members to produce, how should we allocate total acreage across stable &amp; high-margin crops, and when/where should we sell to avoid arrival gluts?
          </p>
        </div>

        {/* FPO Key Aggregated Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full md:w-auto">
          <div className="bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 text-center">
            <div className="text-[10px] uppercase font-bold text-slate-500">Aggregated Land</div>
            <div className="text-lg sm:text-xl font-black text-slate-900 dark:text-slate-100">{fpoProfile.totalCultivableAreaAcres} Acres</div>
            <div className="text-[10px] text-slate-500">{fpoProfile.numberOfFarmers} Farmers</div>
          </div>
          <div className="bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 text-center">
            <div className="text-[10px] uppercase font-bold text-slate-500">Est. Production</div>
            <div className="text-lg sm:text-xl font-black text-blue-700 dark:text-blue-400">{planResult.aggregateExpectedProductionTonnes.toLocaleString('en-IN')} MT</div>
            <div className="text-[10px] text-slate-500">Aggregate Output</div>
          </div>
          <div className="bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 text-center col-span-2 sm:col-span-1">
            <div className="text-[10px] uppercase font-bold text-slate-500">Est. Gross Revenue</div>
            <div className="text-lg sm:text-xl font-black text-emerald-700 dark:text-emerald-400">₹{planResult.aggregateGrossRevenueInrCrores} Cr</div>
            <div className="text-[10px] text-slate-500">Net: ₹{planResult.aggregateNetRealizationInrCrores} Cr</div>
          </div>
        </div>
      </div>

      {/* Profile Parameters Quick Adjuster */}
      <div className="bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          <div>
            <label className="text-[10px] uppercase font-bold text-slate-500 block">District & State</label>
            <span className="font-bold text-slate-800 dark:text-slate-200">{fpoProfile.district}, {fpoProfile.state}</span>
          </div>
          <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block" />
          <div>
            <label className="text-[10px] uppercase font-bold text-slate-500 block">Season</label>
            <select
              value={fpoProfile.targetSeason}
              onChange={(e) => setFpoProfile({ ...fpoProfile, targetSeason: e.target.value as any })}
              className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 font-bold text-slate-800 dark:text-slate-200"
            >
              <option value="Kharif">Kharif</option>
              <option value="Rabi">Rabi</option>
              <option value="Zaid">Zaid</option>
            </select>
          </div>
          <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block" />
          <div>
            <label className="text-[10px] uppercase font-bold text-slate-500 block">Cultivable Acres</label>
            <input
              type="number"
              value={fpoProfile.totalCultivableAreaAcres}
              onChange={(e) => setFpoProfile({ ...fpoProfile, totalCultivableAreaAcres: Number(e.target.value) || 100 })}
              className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 font-bold text-slate-800 dark:text-slate-200 w-24"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold text-slate-500">Storage: {fpoProfile.storageCapacityMetricTonnes} MT &bull; Cold Storage: {fpoProfile.hasColdStorage ? 'Yes' : 'No'}</span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('CROP_PLAN')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
            activeTab === 'CROP_PLAN'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
          }`}
        >
          1. FPO CROP PLAN
        </button>

        <button
          onClick={() => setActiveTab('PORTFOLIO_SPLIT')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
            activeTab === 'PORTFOLIO_SPLIT'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
          }`}
        >
          2. PORTFOLIO ALLOCATION
        </button>

        <button
          onClick={() => setActiveTab('MARKET_STRATEGY')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
            activeTab === 'MARKET_STRATEGY'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
          }`}
        >
          3. MARKET PLANNING
        </button>

        <button
          onClick={() => setActiveTab('HARVEST_GLUT')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
            activeTab === 'HARVEST_GLUT'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
          }`}
        >
          4. HARVEST &amp; GLUT RISKS
        </button>

        <button
          onClick={() => setActiveTab('RISK_MITIGATION')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
            activeTab === 'RISK_MITIGATION'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
          }`}
        >
          5. RISK &amp; TOP 5 MITIGATIONS
        </button>

        <button
          onClick={() => setActiveTab('WHAT_IF')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
            activeTab === 'WHAT_IF'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
          }`}
        >
          6. WHAT-IF SCENARIOS
        </button>

        <button
          onClick={() => setActiveTab('ACTION_PLAN')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
            activeTab === 'ACTION_PLAN'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
          }`}
        >
          7. ACTION PLAN
        </button>
      </div>

      {/* TAB 1: FPO CROP PLAN */}
      {activeTab === 'CROP_PLAN' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {planResult.cropPlan.map((crop, idx) => (
              <FarmfitDecisionCard
                key={crop.cropCommodityId}
                decisionTitle={`${crop.cropName} (${crop.recommendedAcreageAcres} Acres)`}
                decisionSubtitle={`${crop.portfolioBucketLabel} • ${crop.recommendedAcreagePercent}% Total Area`}
                commodityName={crop.cropName}
                cropCommodityId={crop.cropCommodityId}
                whyExplanation={crop.recommendationReason}
                opportunityValue={`₹${crop.expectedGrossRevenueInrLakhs} Lakhs Gross Revenue`}
                opportunityDetail={`Est. Output: ${crop.expectedProductionTonnes} MT • Net Margin: ₹${crop.expectedNetRealizationInrLakhs} Lakhs`}
                riskLevel={crop.riskLevel}
                riskScore={crop.riskScore}
                riskSummary={`Best Selling Hub: ${crop.bestApmcName} (${crop.bestApmcDistanceKm} km)`}
                confidenceTier={crop.confidenceTier}
                confidenceExplanation={crop.confidenceWhy}
                dataDate={crop.priceDate}
                dataSourceName="AGMARKNET & CACP 2024-25"
                badgeTag={crop.portfolioBucket.replace(/_/g, ' ')}
                actionLabel="View Sourcing Detail"
                onAction={() => setSelectedCropModal(crop)}
                evidenceItems={crop.evidenceItems}
              />
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: PORTFOLIO ALLOCATION */}
      {activeTab === 'PORTFOLIO_SPLIT' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <div>
            <div className="flex items-center gap-2">
              <EvidenceTypeBadge classification="FARMFIT_MODEL_ESTIMATE" size="sm" />
              <span className="text-xs font-bold text-slate-500">Portfolio Diversification Model</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-1">
              Structured Acreage Distribution Across 4 Portfolios
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              {planResult.portfolioBreakdown.portfolioRationale}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-2xl p-4 space-y-2">
              <div className="text-xs font-bold text-blue-900 dark:text-blue-300">CORE CROPS (40%)</div>
              <div className="text-2xl font-black text-blue-950 dark:text-blue-100">{Math.round(fpoProfile.totalCultivableAreaAcres * 0.40)} Acres</div>
              <p className="text-xs text-blue-800 dark:text-blue-300/80">High liquidity, MSP protection, staple volume for collective marketing.</p>
            </div>

            <div className="bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-4 space-y-2">
              <div className="text-xs font-bold text-emerald-900 dark:text-emerald-300">OPPORTUNITY (25%)</div>
              <div className="text-2xl font-black text-emerald-950 dark:text-emerald-100">{Math.round(fpoProfile.totalCultivableAreaAcres * 0.25)} Acres</div>
              <p className="text-xs text-emerald-800 dark:text-emerald-300/80">Premium net realizable value per quintal with established processing demand.</p>
            </div>

            <div className="bg-purple-50/60 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 rounded-2xl p-4 space-y-2">
              <div className="text-xs font-bold text-purple-900 dark:text-purple-300">DIVERSIFICATION (20%)</div>
              <div className="text-2xl font-black text-purple-950 dark:text-purple-100">{Math.round(fpoProfile.totalCultivableAreaAcres * 0.20)} Acres</div>
              <p className="text-xs text-purple-800 dark:text-purple-300/80">Nitrogen-fixing pulses stabilizing aggregate farmer cashflows.</p>
            </div>

            <div className="bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-2xl p-4 space-y-2">
              <div className="text-xs font-bold text-amber-900 dark:text-amber-300">HIGH RISK / VALUE (15%)</div>
              <div className="text-2xl font-black text-amber-950 dark:text-amber-100">{Math.round(fpoProfile.totalCultivableAreaAcres * 0.15)} Acres</div>
              <p className="text-xs text-amber-800 dark:text-amber-300/80">Commercial horticulture with forward buyer contracts.</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: MARKET PLANNING */}
      {activeTab === 'MARKET_STRATEGY' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                FPO Collective Market &amp; Offtake Strategy
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Optimal selling channels by crop to maximize net price after bulk logistics pooling.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-500 uppercase tracking-wider bg-slate-50/50 dark:bg-slate-950/50">
                    <th className="py-3 px-3">Crop</th>
                    <th className="py-3 px-3">Aggregated Volume</th>
                    <th className="py-3 px-3">Primary APMC Hub</th>
                    <th className="py-3 px-3">Secondary Market</th>
                    <th className="py-3 px-3">Recommended Strategy</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {planResult.cropPlan.map((crop) => (
                    <tr key={crop.cropCommodityId} className="hover:bg-slate-50 dark:hover:bg-slate-950/60">
                      <td className="py-3.5 px-3 font-bold text-slate-900 dark:text-slate-100">{crop.cropName}</td>
                      <td className="py-3.5 px-3 font-bold text-blue-700 dark:text-blue-400">{crop.expectedProductionTonnes} MT</td>
                      <td className="py-3.5 px-3">
                        <div className="font-semibold text-slate-800 dark:text-slate-200">{crop.bestApmcName}</div>
                        <div className="text-[10px] text-slate-500">{crop.bestApmcDistanceKm} km &bull; ₹{crop.bestApmcPrice}/Qtl</div>
                      </td>
                      <td className="py-3.5 px-3">
                        <div className="font-medium text-slate-700 dark:text-slate-300">{crop.secondApmcName}</div>
                        <div className="text-[10px] text-slate-500">{crop.secondApmcDistanceKm} km &bull; ₹{crop.secondApmcPrice}/Qtl</div>
                      </td>
                      <td className="py-3.5 px-3">
                        <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                          {crop.recommendedSellingStrategy.replace(/_/g, ' ')}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Commodity Intelligence & Mandi Scorecard */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
            <div className="flex items-center gap-2">
              <Store className="w-5 h-5 text-blue-600" />
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  FPO Verified Market Intelligence Scorecard
                </h4>
                <p className="text-xs text-slate-500">
                  Explore multi-window trends, liquidity &amp; spatial NRV across APMC yards for member crops.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <label htmlFor="fpo-crop-scorecard-select" className="text-xs font-bold text-slate-500">Target Crop:</label>
              <select
                id="fpo-crop-scorecard-select"
                value={fpoSelectedCropId}
                onChange={(e) => setFpoSelectedCropId(e.target.value)}
                className="text-xs font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-200"
              >
                {planResult.cropPlan.map((c) => (
                  <option key={c.cropCommodityId} value={c.cropCommodityId}>
                    {c.cropName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <MarketTrendScorecard
            analytics={fpoVerifiedAnalytics}
            onRankingModeChange={(mode) => setFpoRankingMode(mode)}
          />
        </div>
      )}

      {/* TAB 4: HARVEST & GLUT RISKS */}
      {activeTab === 'HARVEST_GLUT' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              Harvest Calendar &amp; Arrival Glut Risk Windows
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Identify the exact 15–20 day windows where wholesale mandi spot prices collapse due to synchronized regional harvesting.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {planResult.cropPlan.map((crop) => (
              <div key={crop.cropCommodityId} className="bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{crop.cropName}</h4>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    crop.arrivalGlutRiskLevel === 'HIGH' ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300' : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                  }`}>
                    Glut Risk: {crop.arrivalGlutRiskLevel}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Sowing Period</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{crop.expectedSowingPeriod}</span>
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Harvest Window</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{crop.expectedProductionPeriod}</span>
                  </div>
                </div>

                <div className="bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 rounded-xl p-3 text-xs text-amber-900 dark:text-amber-200 space-y-1">
                  <span className="font-bold flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                    Price Vulnerability Flush: {crop.priceRiskPeriod}
                  </span>
                  <p className="text-[11px] leading-relaxed">{crop.arrivalGlutExplanation}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: RISK & TOP 5 MITIGATIONS */}
      {activeTab === 'RISK_MITIGATION' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              FPO 13-Dimensional Risk Exposure &amp; Actionable Mitigations
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Structured risk assessment and top 4 operational safeguards for the FPO Board of Directors.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="text-xs uppercase font-bold text-slate-500 tracking-wider">Top 5 Operational Risks</h4>
              {planResult.riskSummary.top5Risks.map((r, idx) => (
                <div key={idx} className="bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 font-bold text-xs flex items-center justify-center shrink-0">
                    {idx + 1}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-slate-100">{r.title}</div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">{r.driver}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <h4 className="text-xs uppercase font-bold text-slate-500 tracking-wider">Top Operational Safeguards</h4>
              {planResult.riskSummary.mitigationActions.map((m, idx) => (
                <div key={idx} className="bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 rounded-xl p-3.5 flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-bold text-emerald-950 dark:text-emerald-200">{m.actionTitle}</div>
                    <div className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold">{m.timeframe}</div>
                    <p className="text-[11px] text-emerald-800/80 dark:text-emerald-300/80 mt-0.5">{m.impact}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: WHAT-IF SCENARIOS */}
      {activeTab === 'WHAT_IF' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <div>
            <div className="flex items-center gap-2">
              <EvidenceTypeBadge classification="FARMFIT_SCENARIO_SIMULATION" size="sm" />
              <span className="text-xs font-bold text-slate-500">Collective Stress Simulator</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-1">
              Simulate Economic &amp; Climate Shocks on Total FPO Turnover
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Evaluates how severe weather, price drops, or input hikes impact aggregate member distributions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {planResult.scenarioSimulations.map((sim, idx) => (
              <div key={idx} className="bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{sim.shockApplied}</h4>
                  <span className={`text-xs font-black px-2.5 py-0.5 rounded-full ${
                    sim.grossValueDeltaPercent < 0 ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300' : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                  }`}>
                    {sim.grossValueDeltaPercent > 0 ? `+${sim.grossValueDeltaPercent}%` : `${sim.grossValueDeltaPercent}%`}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-200 dark:border-slate-800">
                    <div className="text-[10px] text-slate-400 font-bold">Turnover</div>
                    <div className="font-bold text-slate-800 dark:text-slate-200">₹{sim.simulatedGrossValueInrCrores} Cr</div>
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-200 dark:border-slate-800">
                    <div className="text-[10px] text-slate-400 font-bold">Net Profit</div>
                    <div className="font-bold text-emerald-700 dark:text-emerald-400">₹{sim.simulatedNetTurnoverInrCrores} Cr</div>
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-200 dark:border-slate-800">
                    <div className="text-[10px] text-slate-400 font-bold">Risk Score</div>
                    <div className="font-bold text-slate-800 dark:text-slate-200">{sim.simulatedRiskScore}/100</div>
                  </div>
                </div>

                <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1 pt-1">
                  {sim.keyImpactNotes.map((note, nIdx) => (
                    <li key={nIdx} className="flex items-start gap-1.5">
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <span>{note}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 7: ACTION PLAN */}
      {activeTab === 'ACTION_PLAN' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <div>
            <span className="text-[11px] font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider">
              EXECUTIVE ROADMAP
            </span>
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-1">
              FPO Board Action Plan
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Immediate chronological steps to operationalize the production and market plan.
            </p>
          </div>

          <div className="space-y-3">
            {planResult.nextActionPlan.map((act) => (
              <div key={act.stepNumber} className="bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-black text-sm flex items-center justify-center shrink-0">
                  {act.stepNumber}
                </div>
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{act.actionTitle}</h4>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                      {act.targetTimeframe}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{act.actionDescription}</p>
                  <div className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                    Benefit: {act.expectedBenefit}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Selected Crop Evidence Modal */}
      {selectedCropModal && (
        <UniversalEvidenceModal
          isOpen={true}
          onClose={() => setSelectedCropModal(null)}
          title={`${selectedCropModal.cropName} — Production & Market Evidence`}
          evidenceItems={selectedCropModal.evidenceItems}
          commodityName={selectedCropModal.cropName}
        />
      )}
    </div>
  );
};
