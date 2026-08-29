import React, { useState, useMemo } from 'react';
import { 
  Landmark, 
  AlertTriangle, 
  MapPin, 
  TrendingUp, 
  TrendingDown, 
  ShieldAlert, 
  Sliders, 
  CheckCircle2, 
  Globe2, 
  Store, 
  Building2, 
  Layers, 
  Calendar, 
  Sparkles, 
  Activity, 
  Eye, 
  Filter,
  FileText,
  ChevronRight,
  Database
} from 'lucide-react';
import { 
  GovernmentDecisionResult, 
  AgriculturalHotspotItem 
} from '../types/decisionCenter';
import { governmentDecisionService } from '../services/governmentDecisionService';
import { FARMFIT_CROP_COMMODITY_MASTER } from '../data/cropMasterIndex';
import { ALL_INDIAN_STATES } from '../data/indiaAdminData';
import { FarmfitDecisionCard } from '../components/DecisionCenter/FarmfitDecisionCard';
import { ConfidenceBadge } from '../components/DecisionCenter/ConfidenceBadge';
import { EvidenceTypeBadge } from '../components/DecisionCenter/EvidenceTypeBadge';
import { UniversalEvidenceModal } from '../components/DecisionCenter/UniversalEvidenceModal';

export const GovernmentDecisionView: React.FC = () => {
  const [selectedState, setSelectedState] = useState<string>('ALL');
  const [selectedCommodityId, setSelectedCommodityId] = useState<string>('ALL');
  const [activeTab, setActiveTab] = useState<
    'NATIONAL_OVERVIEW' | 'HOTSPOTS' | 'EARLY_WARNINGS' | 'COMMODITY_MONITOR' | 'SCENARIOS' | 'ACTION_PLAN'
  >('NATIONAL_OVERVIEW');

  // Compute decision data
  const decisionData: GovernmentDecisionResult = useMemo(() => {
    return governmentDecisionService.getGovernmentDecisionData(selectedState, selectedCommodityId);
  }, [selectedState, selectedCommodityId]);

  return (
    <div className="space-y-8 pb-16">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <Landmark className="w-4 h-4" />
              NATIONAL AGRICULTURAL RISK &amp; POLICY DECISION CENTER
            </span>
            <span className="text-xs bg-amber-50 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-bold px-2.5 py-0.5 rounded-full border border-amber-200 dark:border-amber-800">
              Government &amp; Institutional Oversight
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            Spatial Agricultural Intelligence &amp; Early Warning System
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Answers: Where is agricultural risk or price collapse building across India, which districts face severe input cost or moisture deficits, and what policy interventions are warranted?
          </p>
        </div>

        {/* Macro Health Snapshot */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full md:w-auto">
          <div className="bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 text-center">
            <div className="text-[10px] uppercase font-bold text-slate-500">APMCs Monitored</div>
            <div className="text-lg sm:text-xl font-black text-slate-900 dark:text-slate-100">
              {decisionData.nationalOverview.totalMandisMonitored} Mandis
            </div>
            <div className="text-[10px] text-slate-500">All 28 States &amp; UTs</div>
          </div>
          <div className="bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 text-center">
            <div className="text-[10px] uppercase font-bold text-slate-500">Price Pressure Index</div>
            <div className="text-lg sm:text-xl font-black text-amber-700 dark:text-amber-400">
              {decisionData.nationalOverview.nationalAgriculturalPricePressureIndex.score}/100
            </div>
            <div className="text-[10px] text-slate-500">Status: {decisionData.nationalOverview.nationalAgriculturalPricePressureIndex.status}</div>
          </div>
          <div className="bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 text-center col-span-2 sm:col-span-1">
            <div className="text-[10px] uppercase font-bold text-slate-500">Agri Health Index</div>
            <div className="text-lg sm:text-xl font-black text-emerald-700 dark:text-emerald-400">
              {decisionData.nationalOverview.compositeAgriculturalHealthScore}/100
            </div>
            <div className="text-[10px] text-emerald-600 font-bold">STABLE RECOVERY</div>
          </div>
        </div>
      </div>

      {/* Spatial Hierarchy & Commodity Filter */}
      <div className="bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          <div>
            <label className="text-[10px] uppercase font-bold text-slate-500 block">State Drill-down</label>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1 font-bold text-slate-800 dark:text-slate-200"
            >
              <option value="ALL">All-India (36 States & UTs)</option>
              {ALL_INDIAN_STATES.map(s => (
                <option key={s.name} value={s.name}>{s.name}</option>
              ))}
            </select>
          </div>

          <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block" />

          <div>
            <label className="text-[10px] uppercase font-bold text-slate-500 block">Commodity Focus</label>
            <select
              value={selectedCommodityId}
              onChange={(e) => setSelectedCommodityId(e.target.value)}
              className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1 font-bold text-slate-800 dark:text-slate-200"
            >
              <option value="ALL">All Tracked Commodities ({FARMFIT_CROP_COMMODITY_MASTER.length})</option>
              {FARMFIT_CROP_COMMODITY_MASTER.map(c => (
                <option key={c.cropCommodityId || c.id} value={c.cropCommodityId || c.id}>
                  {c.displayName || c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          Coverage: {decisionData.nationalOverview.totalDistrictsCovered} Districts &bull; Hierarchy: India &rarr; State &rarr; District &rarr; Mandi &rarr; Crop
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('NATIONAL_OVERVIEW')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
            activeTab === 'NATIONAL_OVERVIEW'
              ? 'bg-amber-600 text-white shadow-md'
              : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
          }`}
        >
          1. NATIONAL OVERVIEW
        </button>

        <button
          onClick={() => setActiveTab('HOTSPOTS')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
            activeTab === 'HOTSPOTS'
              ? 'bg-amber-600 text-white shadow-md'
              : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
          }`}
        >
          2. AGRICULTURAL HOTSPOTS
        </button>

        <button
          onClick={() => setActiveTab('EARLY_WARNINGS')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
            activeTab === 'EARLY_WARNINGS'
              ? 'bg-amber-600 text-white shadow-md'
              : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
          }`}
        >
          3. EARLY WARNING ALERTS
        </button>

        <button
          onClick={() => setActiveTab('COMMODITY_MONITOR')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
            activeTab === 'COMMODITY_MONITOR'
              ? 'bg-amber-600 text-white shadow-md'
              : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
          }`}
        >
          4. COMMODITY MONITOR
        </button>

        <button
          onClick={() => setActiveTab('SCENARIOS')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
            activeTab === 'SCENARIOS'
              ? 'bg-amber-600 text-white shadow-md'
              : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
          }`}
        >
          5. NATIONAL SCENARIO CENTER
        </button>

        <button
          onClick={() => setActiveTab('ACTION_PLAN')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
            activeTab === 'ACTION_PLAN'
              ? 'bg-amber-600 text-white shadow-md'
              : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
          }`}
        >
          6. POLICY ACTION PLAN
        </button>
      </div>

      {/* TAB 1: NATIONAL OVERVIEW */}
      {activeTab === 'NATIONAL_OVERVIEW' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
            <div>
              <div className="flex items-center gap-2">
                <EvidenceTypeBadge classification="OFFICIAL_OBSERVED_DATA" size="sm" />
                <span className="text-xs font-bold text-slate-500">Grounded National Agricultural Exposure</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-1">
                All-India Macro Risk Drivers &amp; Price Pressure
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                {decisionData.nationalOverview.dataCoverageNotice}
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-slate-50 dark:bg-slate-950/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
                <div className="text-[11px] font-bold text-slate-500">Weather &amp; Monsoon Exposure</div>
                <div className="text-2xl font-black text-slate-900 dark:text-slate-100">{decisionData.nationalOverview.weatherRiskScore}/100</div>
                <div className="text-[10px] text-slate-500">Rainfed acre deficit</div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-950/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
                <div className="text-[11px] font-bold text-slate-500">Physical Supply Risk</div>
                <div className="text-2xl font-black text-slate-900 dark:text-slate-100">{decisionData.nationalOverview.supplyRiskScore}/100</div>
                <div className="text-[10px] text-slate-500">Wholesale buffer index</div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-950/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
                <div className="text-[11px] font-bold text-slate-500">Input Cost Inflation</div>
                <div className="text-2xl font-black text-rose-600 dark:text-rose-400">{decisionData.nationalOverview.inputCostPressureScore}/100</div>
                <div className="text-[10px] text-slate-500">Diesel / NPK wholesale</div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-950/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
                <div className="text-[11px] font-bold text-slate-500">Farmer Income Pressure</div>
                <div className="text-2xl font-black text-amber-700 dark:text-amber-400">{decisionData.nationalOverview.farmerIncomeExposureScore}/100</div>
                <div className="text-[10px] text-slate-500">MSP parity buffer</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-4 space-y-2">
                <div className="text-xs font-bold text-amber-900 dark:text-amber-300 uppercase tracking-wider">
                  Commodities Under Inflationary Spot Pressure
                </div>
                <div className="flex flex-wrap gap-2">
                  {decisionData.nationalOverview.nationalAgriculturalPricePressureIndex.commoditiesUnderInflationaryPressure.map((c, i) => (
                    <span key={i} className="text-xs font-bold px-3 py-1 rounded-full bg-white dark:bg-slate-900 border border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-200">
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-4 space-y-2">
                <div className="text-xs font-bold text-blue-900 dark:text-blue-300 uppercase tracking-wider">
                  Commodities Under Deflationary Arrival Flush
                </div>
                <div className="flex flex-wrap gap-2">
                  {decisionData.nationalOverview.nationalAgriculturalPricePressureIndex.commoditiesUnderDeflationaryPressure.map((c, i) => (
                    <span key={i} className="text-xs font-bold px-3 py-1 rounded-full bg-white dark:bg-slate-900 border border-blue-300 dark:border-blue-700 text-blue-900 dark:text-blue-200">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: HOTSPOTS */}
      {activeTab === 'HOTSPOTS' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              Agricultural Hotspot Stress Matrix
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Pinpoints districts with extreme price drops below MSP, severe harvest gluts, or localized moisture stress.
            </p>
          </div>

          <div className="space-y-3">
            {decisionData.hotspots.map((hs) => (
              <div key={hs.id} className="bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300">
                      {hs.stressDimension.replace(/_/g, ' ')}
                    </span>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {hs.district}, {hs.state}
                    </span>
                    <span className="text-[10px] text-slate-500">({hs.dataCoverageStatus.replace(/_/g, ' ')})</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    {hs.commodityName} &bull; Stress Index: {hs.stressScore}/100 ({hs.stressLevel})
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl">
                    {hs.primaryStressDriver}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  {hs.reportedModalPriceInrQtl && (
                    <div className="text-sm font-black text-slate-900 dark:text-slate-100">
                      ₹{hs.reportedModalPriceInrQtl}/Qtl
                    </div>
                  )}
                  {hs.priceVarianceFromMspPercent !== undefined && (
                    <div className={`text-xs font-bold ${hs.priceVarianceFromMspPercent < 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                      {hs.priceVarianceFromMspPercent > 0 ? `+${hs.priceVarianceFromMspPercent}% vs MSP` : `${hs.priceVarianceFromMspPercent}% vs MSP`}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: EARLY WARNINGS */}
      {activeTab === 'EARLY_WARNINGS' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              National Agricultural Early Warning Alert Feed
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Live automated alerts detecting supply disruptions, price anomalies, and climatic distress across states.
            </p>
          </div>

          <div className="space-y-4">
            {decisionData.earlyWarnings.map((al) => (
              <div key={al.alertId} className="bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${
                      al.severity === 'CRITICAL' ? 'bg-rose-600 text-white' : al.severity === 'HIGH' ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {al.severity}
                    </span>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{al.geography} &bull; {al.commodityName}</span>
                  </div>
                  <span className="text-[10px] text-slate-400">{al.dateTriggered}</span>
                </div>

                <h4 className="text-base font-black text-slate-900 dark:text-slate-100">
                  {al.headline}
                </h4>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  <span className="font-bold">Driver: </span>{al.driver}
                </p>

                <div className="bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl p-3 text-xs text-amber-900 dark:text-amber-200">
                  <span className="font-bold">Recommended Policy Attention: </span>
                  {al.recommendedAttention}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: COMMODITY MONITOR */}
      {activeTab === 'COMMODITY_MONITOR' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              National Commodity Price &amp; Production Monitor
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Universal coverage tracking modal prices and CACP statutory MSP thresholds.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {FARMFIT_CROP_COMMODITY_MASTER.slice(0, 9).map((c) => (
              <div key={c.cropCommodityId || c.id} className="bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-100">{c.displayName || c.name}</span>
                  <span className="text-[10px] text-slate-500">{c.category}</span>
                </div>
                <div className="text-lg font-black text-emerald-700 dark:text-emerald-400">
                  MSP: ₹{c.mspPrice2024_25 || 'Notified'}/Qtl
                </div>
                <div className="text-xs text-slate-500">
                  A2+FL Cost: ₹{c.cacpCostPerQuintalA2FL || 2400}/Qtl
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: SCENARIOS */}
      {activeTab === 'SCENARIOS' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <div>
            <div className="flex items-center gap-2">
              <EvidenceTypeBadge classification="FARMFIT_SCENARIO_SIMULATION" size="sm" />
              <span className="text-xs font-bold text-slate-500">National Policy Shock Modeling</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-1">
              Macroeconomic &amp; Agro-Climatic Shocks Simulation
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Evaluates economy-wide consumer inflation, aggregate farmer income, and supply deficits.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {decisionData.scenarioSimulations.map((sim, idx) => (
              <div key={idx} className="bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-3">
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{sim.shockApplied}</h4>

                <div className="space-y-1 text-xs text-slate-600 dark:text-slate-400">
                  <div>Farmer Income Impact: <span className="font-bold text-rose-600">{sim.projectedFarmerGrossIncomeImpactInrCrores} Cr</span></div>
                  <div>Consumer Inflation Impact: <span className="font-bold text-slate-800 dark:text-slate-200">+{sim.projectedConsumerInflationImpactPercent}%</span></div>
                  <div>Affected States: <span className="font-semibold text-slate-700 dark:text-slate-300">{sim.affectedStates.join(', ')}</span></div>
                </div>

                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
                  <span className="font-bold">Policy Preparedness: </span>
                  {sim.recommendedPolicyPreparedness}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: ACTION PLAN */}
      {activeTab === 'ACTION_PLAN' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <div>
            <span className="text-[11px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
              INTER-MINISTERIAL POLICY SEQUENCE
            </span>
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-1">
              Government Priority Interventions
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Chronological administrative roadmap for agricultural market stabilization.
            </p>
          </div>

          <div className="space-y-3">
            {decisionData.nextActionPlan.map((act) => (
              <div key={act.stepNumber} className="bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-600 text-white font-black text-sm flex items-center justify-center shrink-0">
                  {act.stepNumber}
                </div>
                <div className="space-y-0.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{act.actionTitle}</h4>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                      {act.timeline}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{act.actionDescription}</p>
                  <div className="text-[11px] font-semibold text-slate-500">
                    Lead Authority: {act.department}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
