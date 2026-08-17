import React, { useState } from 'react';
import { 
  FlaskConical, 
  FileSpreadsheet, 
  CheckCircle2, 
  AlertTriangle, 
  Info, 
  Building2, 
  Database, 
  UserCheck, 
  Sliders, 
  FileText, 
  Upload, 
  MapPin, 
  Layers, 
  TrendingUp, 
  ShieldAlert, 
  Sparkles,
  HelpCircle,
  Clock,
  Check,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { SoilIntelligence, SoilOrder, DataProvenance, Language, FarmLocation } from '../../types';
import { 
  SoilDataStatus,
  SoilDataSource,
  LaboratorySoilTestRecord,
  AUTHORITATIVE_SOIL_SOURCES,
  lookupLocationSoilData,
  evaluateSoilHealthIndicators,
  generateSoilWarnings,
  generateSoilImprovementAdvisories,
  calculateSoilDataConfidence,
  SoilCropComparisonResult
} from '../../services/soilIntelligenceEngine';

interface SoilEngineProps {
  soilData: SoilIntelligence;
  farmLocation: FarmLocation;
  onChange: (data: SoilIntelligence) => void;
  language: Language;
}

export const SoilEngine: React.FC<SoilEngineProps> = ({
  soilData,
  farmLocation,
  onChange,
  language
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'lab_test' | 'indicators' | 'advisories' | 'sources'>('profile');
  const [uploadMockState, setUploadMockState] = useState<{ fileName?: string; fileSize?: string; uploaded: boolean }>({
    fileName: soilData.uploadedFileName,
    fileSize: soilData.uploadedFileName ? '1.2 MB' : undefined,
    uploaded: !!soilData.uploadedFileName
  });

  const soilOrderOptions: SoilOrder[] = [
    'Alluvial Soil (Entisols / Inceptisols)',
    'Black Cotton Soil (Vertisols)',
    'Red & Yellow Soil (Alfisols / Ultisols)',
    'Laterite Soil (Oxisols)',
    'Arid / Desert Soil (Aridisols)',
    'Saline / Alkaline Soil',
    'Peaty / Organic Soil'
  ];

  // Evaluate Mapped Soil Data
  const mappedData = lookupLocationSoilData(
    farmLocation.latitude,
    farmLocation.longitude,
    farmLocation.state,
    farmLocation.district
  );

  // Evaluate Scientific Soil Indicators
  const indicators = evaluateSoilHealthIndicators(
    soilData.ph,
    soilData.electricalConductivityDsM,
    soilData.organicCarbonPercent,
    soilData.nitrogenNumericKgHa,
    soilData.availableNitrogenKgPerHa.split(' ')[0],
    soilData.phosphorusNumericKgHa,
    soilData.availablePhosphorusKgPerHa.split(' ')[0],
    soilData.potassiumNumericKgHa,
    soilData.availablePotassiumKgPerHa.split(' ')[0]
  );

  // Generate Warnings
  const warnings = generateSoilWarnings(
    indicators,
    soilData.hasSoilHealthCard,
    soilData.drainage,
    { zincPpm: soilData.zincPpm, boronPpm: soilData.boronPpm }
  );

  // Generate Improvement Advisories
  const advisories = generateSoilImprovementAdvisories(
    indicators,
    soilData.hasSoilHealthCard
  );

  // Calculate Data Confidence Score
  const labRecord: LaboratorySoilTestRecord = {
    hasLabReport: soilData.hasSoilHealthCard,
    testDate: soilData.testDate || '2024-04-10',
    laboratoryName: soilData.laboratoryName || 'District Soil Testing Laboratory',
    reportReference: soilData.shcNumber,
    ph: soilData.ph,
    organicCarbonPercent: soilData.organicCarbonPercent,
    availableNitrogen: soilData.nitrogenNumericKgHa || 260,
    availablePhosphorus: soilData.phosphorusNumericKgHa || 14,
    availablePotassium: soilData.potassiumNumericKgHa || 290,
    zincPpm: soilData.zincPpm,
    boronPpm: soilData.boronPpm,
    ironPpm: soilData.ironPpm,
    sulphurPpm: soilData.sulphurPpm,
    electricalConductivity: soilData.electricalConductivityDsM
  };

  const confidence = calculateSoilDataConfidence(
    soilData.hasSoilHealthCard,
    labRecord,
    mappedData.isSourceConnected,
    true
  );

  // Handlers
  const handleSoilHealthCardToggle = (checked: boolean) => {
    const provenance: DataProvenance = checked ? 'Soil test (Lab)' : 'Farmer entered';
    onChange({
      ...soilData,
      hasSoilHealthCard: checked,
      testDate: checked ? (soilData.testDate || new Date().toISOString().split('T')[0]) : undefined,
      laboratoryName: checked ? (soilData.laboratoryName || 'Krishi Vigyan Kendra (KVK) / SAU Soil Lab') : undefined,
      soilTypeProvenance: provenance,
      phProvenance: provenance,
      nutrientsProvenance: provenance,
      textureProvenance: provenance,
      depthProvenance: provenance
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadMockState({
        fileName: file.name,
        fileSize: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        uploaded: true
      });
      onChange({
        ...soilData,
        uploadedFileName: file.name,
        hasSoilHealthCard: true,
        soilTypeProvenance: 'Soil test (Lab)',
        phProvenance: 'Soil test (Lab)',
        nutrientsProvenance: 'Soil test (Lab)'
      });
    }
  };

  const renderStatusBadge = (status: SoilDataStatus | DataProvenance) => {
    switch (status) {
      case 'OFFICIAL DATA':
      case 'Mapped dataset':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 tracking-wider uppercase">
            <Database className="w-2.5 h-2.5" /> OFFICIAL DATA
          </span>
        );
      case 'SOIL TEST':
      case 'Soil test (Lab)':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 tracking-wider uppercase">
            <Building2 className="w-2.5 h-2.5" /> SOIL TEST
          </span>
        );
      case 'MODEL ESTIMATE':
      case 'Model derived':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 tracking-wider uppercase">
            <Sliders className="w-2.5 h-2.5" /> MODEL ESTIMATE
          </span>
        );
      case 'DATA UNAVAILABLE':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-300 dark:border-slate-700 tracking-wider uppercase">
            DATA UNAVAILABLE
          </span>
        );
      case 'FARMER ENTERED':
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 tracking-wider uppercase">
            <UserCheck className="w-2.5 h-2.5" /> FARMER ENTERED
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. LOCATION CONTEXT BAR WITH DATA STATUS */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                {language === 'en' ? 'Farm Location & Agro-Climatic Anchor' : 'कृषि क्षेत्र स्थान एवं कृषि-जलवायु विवरण'}
              </h3>
              {renderStatusBadge('OFFICIAL DATA')}
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              {farmLocation.village || 'Field Anchor'}, {farmLocation.taluka || farmLocation.district}, {farmLocation.district}, {farmLocation.state}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs">
            <div className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Latitude: </span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">
                {farmLocation.latitude ? `${farmLocation.latitude.toFixed(4)}° N` : 'Pending GPS'}
              </span>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Longitude: </span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">
                {farmLocation.longitude ? `${farmLocation.longitude.toFixed(4)}° E` : 'Pending GPS'}
              </span>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Elevation: </span>
              <span className="font-bold text-slate-900 dark:text-white">
                {farmLocation.altitudeMeters !== undefined && farmLocation.altitudeMeters !== null
                  ? `${farmLocation.altitudeMeters} m ASL`
                  : 'Data Unavailable'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. SOIL DATA CONFIDENCE SCORE BANNER */}
      <div className="bg-linear-to-r from-slate-900 to-slate-800 text-white rounded-2xl p-6 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
                FARMFIT Soil Data Confidence Protocol
              </span>
            </div>
            <h3 className="text-xl font-extrabold text-white">
              {confidence.summary}
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {confidence.explanation}
            </p>
          </div>

          <div className="flex items-center gap-4 bg-white/10 backdrop-blur-xs p-4 rounded-xl border border-white/15 shrink-0">
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-300 block">Confidence Score</span>
              <span className="text-3xl font-black tracking-tight text-white">{confidence.score}</span>
              <span className="text-xs text-slate-400 font-bold"> / 100</span>
            </div>
            <div className={`px-2.5 py-1 rounded-lg text-xs font-black uppercase tracking-wider ${
              confidence.rating === 'High' ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-500/50' :
              confidence.rating === 'Moderate' ? 'bg-blue-500/30 text-blue-300 border border-blue-500/50' :
              'bg-amber-500/30 text-amber-300 border border-amber-500/50'
            }`}>
              {confidence.rating}
            </div>
          </div>
        </div>

        {/* Confidence Breakdown Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-6 pt-5 border-t border-white/10 text-xs">
          {confidence.breakdown.map((item, idx) => (
            <div key={idx} className="bg-white/5 rounded-xl p-3 border border-white/5 space-y-1">
              <div className="flex items-center justify-between text-slate-300 font-semibold">
                <span className="truncate pr-1">{item.dimension}</span>
                <span className="font-mono font-bold text-white shrink-0">{item.points}/{item.maxPoints}</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                <div 
                  className="bg-emerald-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${(item.points / item.maxPoints) * 100}%` }}
                />
              </div>
              <p className="text-[10px] text-slate-400 line-clamp-1">{item.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 3. SOIL TEST PRIORITY NOTICE & SOIL HEALTH CARD TOGGLE */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FlaskConical className="w-4.5 h-4.5 text-purple-600 dark:text-purple-400" />
              <span>Laboratory Soil Test & Soil Health Card (SHC) Report</span>
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Your laboratory soil test is more specific to your field than regional soil mapping and overrides mapped approximations.
            </p>
          </div>

          <label className="flex items-center gap-3 p-3 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 cursor-pointer hover:bg-purple-100/60 dark:hover:bg-purple-900/50 transition-all shrink-0">
            <input
              type="checkbox"
              checked={soilData.hasSoilHealthCard}
              onChange={(e) => handleSoilHealthCardToggle(e.target.checked)}
              className="w-4 h-4 text-purple-600 rounded cursor-pointer"
            />
            <div className="text-xs">
              <span className="font-bold text-purple-950 dark:text-purple-200 block">I have a Laboratory Soil Test Report</span>
              <span className="text-[10px] text-purple-700 dark:text-purple-400">Enables high-precision NPK & micronutrient calibration</span>
            </div>
          </label>
        </div>

        {/* If NO Lab Test, Show Recommended Next Step */}
        {!soilData.hasSoilHealthCard && (
          <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 flex items-start gap-3 text-xs">
            <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold text-amber-900 dark:text-amber-200 block">
                Recommended next step: Obtain a laboratory soil test before finalizing chemical fertilizer investments.
              </span>
              <p className="text-amber-800 dark:text-amber-300 text-[11px] leading-relaxed">
                You can obtain an official 12-parameter Soil Health Card from your nearest Krishi Vigyan Kendra (KVK), District Soil Testing Laboratory, or Block Agriculture Office under the National Soil Health Scheme.
              </p>
            </div>
          </div>
        )}

        {/* Laboratory Metadata Form when Lab Test is checked */}
        {soilData.hasSoilHealthCard && (
          <div className="p-4 rounded-xl bg-purple-50/40 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/40 space-y-4 pt-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  Testing Laboratory Name
                </label>
                <input
                  type="text"
                  value={soilData.laboratoryName || ''}
                  onChange={(e) => onChange({ ...soilData, laboratoryName: e.target.value })}
                  placeholder="e.g. KVK Soil Testing Lab / SAU Lab"
                  className="w-full px-3 py-2 rounded-xl border border-purple-200 dark:border-purple-800 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  Soil Sample / SHC Reference No.
                </label>
                <input
                  type="text"
                  value={soilData.shcNumber || ''}
                  onChange={(e) => onChange({ ...soilData, shcNumber: e.target.value })}
                  placeholder="e.g. MP-IND-2024-8849"
                  className="w-full px-3 py-2 rounded-xl border border-purple-200 dark:border-purple-800 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  Sample Testing Date
                </label>
                <input
                  type="date"
                  value={soilData.testDate || '2024-04-10'}
                  onChange={(e) => onChange({ ...soilData, testDate: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-purple-200 dark:border-purple-800 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            {/* Optional Document Attachment */}
            <div className="pt-2 border-t border-purple-100 dark:border-purple-900/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <FileText className="w-4 h-4 text-purple-600 shrink-0" />
                <span>
                  {uploadMockState.uploaded ? (
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                      Attached: {uploadMockState.fileName} ({uploadMockState.fileSize})
                    </span>
                  ) : (
                    'Attach Laboratory Soil Test Document (PDF / Scan / JPEG)'
                  )}
                </span>
              </div>

              <label className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-purple-300 dark:border-purple-700 bg-white dark:bg-slate-800 text-purple-700 dark:text-purple-300 font-bold text-xs cursor-pointer hover:bg-purple-50">
                <Upload className="w-3.5 h-3.5" />
                <span>{uploadMockState.uploaded ? 'Replace Attachment' : 'Upload Lab Report'}</span>
                <input
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        )}
      </div>

      {/* 4. TABS NAVIGATION FOR DETAILED SOIL INTELLIGENCE */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 overflow-x-auto pb-1 text-xs">
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2.5 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
            activeTab === 'profile'
              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Soil Profile & Parameters</span>
        </button>

        <button
          onClick={() => setActiveTab('indicators')}
          className={`px-4 py-2.5 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
            activeTab === 'indicators'
              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Health Indicators (ICAR Standards)</span>
        </button>

        <button
          onClick={() => setActiveTab('advisories')}
          className={`px-4 py-2.5 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
            activeTab === 'advisories'
              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>Condition Warnings & Soil Amendments</span>
        </button>

        <button
          onClick={() => setActiveTab('sources')}
          className={`px-4 py-2.5 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
            activeTab === 'sources'
              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>Authoritative Data Sources</span>
        </button>
      </div>

      {/* 5. TAB CONTENT: SOIL PROFILE & PARAMETERS */}
      {activeTab === 'profile' && (
        <div className="space-y-6">
          {/* Physical Soil Properties Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-600" />
                <span>Physical Soil Structure & Profile</span>
              </h4>
              {renderStatusBadge(soilData.soilTypeProvenance || (soilData.hasSoilHealthCard ? 'SOIL TEST' : 'FARMER ENTERED'))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              {/* Soil Order */}
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                  Soil Type / Order
                </label>
                <select
                  value={soilData.soilOrder}
                  onChange={(e) => onChange({
                    ...soilData,
                    soilOrder: e.target.value as SoilOrder,
                    soilTypeProvenance: soilData.hasSoilHealthCard ? 'Soil test (Lab)' : 'Farmer entered'
                  })}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs cursor-pointer font-medium"
                >
                  {soilOrderOptions.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              {/* Texture */}
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                  Soil Texture
                </label>
                <select
                  value={soilData.texture}
                  onChange={(e) => onChange({ ...soilData, texture: e.target.value as any })}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs cursor-pointer font-medium"
                >
                  <option value="Clay Loam">Clay Loam (Medium-Heavy, High Moisture Retention)</option>
                  <option value="Sandy Loam">Sandy Loam (Light, Fast Draining)</option>
                  <option value="Heavy Clay">Heavy Clay (Deep Vertisols / Black Cotton)</option>
                  <option value="Silty Loam">Silty Loam (Alluvial Riverbed Plains)</option>
                  <option value="Sandy">Sandy (Arid / Coastal Sand)</option>
                </select>
              </div>

              {/* Depth */}
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                  Effective Soil Depth
                </label>
                <select
                  value={soilData.soilDepth}
                  onChange={(e) => onChange({ ...soilData, soilDepth: e.target.value as any })}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs cursor-pointer font-medium"
                >
                  <option value="Deep (> 50 cm)">Deep (&gt; 50 cm / 20+ inches)</option>
                  <option value="Medium (25 - 50 cm)">Medium (25 - 50 cm / 10-20 inches)</option>
                  <option value="Shallow (< 25 cm)">Shallow (&lt; 25 cm / Hardpan/Rocky)</option>
                </select>
              </div>

              {/* Drainage */}
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                  Field Drainage
                </label>
                <select
                  value={soilData.drainage || 'Good (No waterlogging)'}
                  onChange={(e) => onChange({ ...soilData, drainage: e.target.value as any })}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs cursor-pointer font-medium"
                >
                  <option value="Good (No waterlogging)">Good (No waterlogging)</option>
                  <option value="Moderate">Moderate (Slow percolation)</option>
                  <option value="Poor (Prone to water stagnation)">Poor (Prone to water stagnation)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Chemical & Primary Nutrients Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                <FlaskConical className="w-4 h-4 text-purple-600" />
                <span>Chemical & Primary Macro-Nutrient Parameters (N-P-K & OC)</span>
              </h4>
              {renderStatusBadge(soilData.nutrientsProvenance || (soilData.hasSoilHealthCard ? 'SOIL TEST' : 'FARMER ENTERED'))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              {/* Soil pH */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-700 dark:text-slate-300">Soil Reaction (pH)</span>
                  <span className={`font-bold px-1.5 py-0.5 rounded text-[10px] ${
                    indicators.phStatus.severity === 'optimal' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300' :
                    indicators.phStatus.severity === 'warning' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300' :
                    'bg-rose-100 text-rose-800 dark:bg-rose-900/60 dark:text-rose-300'
                  }`}>
                    {indicators.phStatus.classification}
                  </span>
                </div>
                <input
                  type="number"
                  min={3.5}
                  max={10.0}
                  step={0.1}
                  value={soilData.ph}
                  onChange={(e) => onChange({ ...soilData, ph: parseFloat(e.target.value) || 7.0 })}
                  className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                />
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Optimal Range: 6.5 - 7.8</span>
              </div>

              {/* Organic Carbon */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-700 dark:text-slate-300">Organic Carbon (OC %)</span>
                  <span className={`font-bold px-1.5 py-0.5 rounded text-[10px] ${
                    indicators.organicCarbonStatus.severity === 'optimal' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300' :
                    indicators.organicCarbonStatus.severity === 'warning' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300' :
                    'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300'
                  }`}>
                    {indicators.organicCarbonStatus.classification}
                  </span>
                </div>
                <input
                  type="number"
                  min={0.1}
                  max={3.0}
                  step={0.05}
                  value={soilData.organicCarbonPercent}
                  onChange={(e) => onChange({ ...soilData, organicCarbonPercent: parseFloat(e.target.value) || 0.5 })}
                  className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                />
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block">&gt; 0.75% indicates fertile soil</span>
              </div>

              {/* Electrical Conductivity */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-700 dark:text-slate-300">Electrical Cond. (dS/m)</span>
                  <span className={`font-bold px-1.5 py-0.5 rounded text-[10px] ${
                    indicators.salinityEcStatus.severity === 'optimal' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300' :
                    'bg-rose-100 text-rose-800 dark:bg-rose-900/60 dark:text-rose-300'
                  }`}>
                    {indicators.salinityEcStatus.classification}
                  </span>
                </div>
                <input
                  type="number"
                  min={0.0}
                  max={10.0}
                  step={0.05}
                  value={soilData.electricalConductivityDsM}
                  onChange={(e) => onChange({ ...soilData, electricalConductivityDsM: parseFloat(e.target.value) || 0.45 })}
                  className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                />
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block">&lt; 1.0 dS/m (Safe non-saline)</span>
              </div>

              {/* Nitrogen */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-700 dark:text-slate-300">Available Nitrogen (N)</span>
                  <span className="font-bold px-1.5 py-0.5 rounded text-[10px] bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200">
                    {soilData.availableNitrogenKgPerHa.split(' ')[0]}
                  </span>
                </div>
                <select
                  value={soilData.availableNitrogenKgPerHa}
                  onChange={(e) => onChange({ ...soilData, availableNitrogenKgPerHa: e.target.value as any })}
                  className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium text-xs"
                >
                  <option value="Low (< 280)">Low (&lt; 280 kg/Ha)</option>
                  <option value="Medium (280 - 560)">Medium (280 - 560 kg/Ha)</option>
                  <option value="High (> 560)">High (&gt; 560 kg/Ha)</option>
                </select>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Drives Urea / Nitrogen dosage</span>
              </div>
            </div>

            {/* Phosphorus & Potassium & Micronutrients */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs pt-2">
              {/* Phosphorus */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-700 dark:text-slate-300">Available Phosphorus (P)</span>
                  <span className="font-bold px-1.5 py-0.5 rounded text-[10px] bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200">
                    {soilData.availablePhosphorusKgPerHa.split(' ')[0]}
                  </span>
                </div>
                <select
                  value={soilData.availablePhosphorusKgPerHa}
                  onChange={(e) => onChange({ ...soilData, availablePhosphorusKgPerHa: e.target.value as any })}
                  className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium text-xs"
                >
                  <option value="Low (< 10)">Low (&lt; 10 kg/Ha)</option>
                  <option value="Medium (10 - 25)">Medium (10 - 25 kg/Ha)</option>
                  <option value="High (> 25)">High (&gt; 25 kg/Ha)</option>
                </select>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Drives DAP / SSP requirement</span>
              </div>

              {/* Potassium */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-700 dark:text-slate-300">Available Potassium (K)</span>
                  <span className="font-bold px-1.5 py-0.5 rounded text-[10px] bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200">
                    {soilData.availablePotassiumKgPerHa.split(' ')[0]}
                  </span>
                </div>
                <select
                  value={soilData.availablePotassiumKgPerHa}
                  onChange={(e) => onChange({ ...soilData, availablePotassiumKgPerHa: e.target.value as any })}
                  className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium text-xs"
                >
                  <option value="Low (< 108)">Low (&lt; 108 kg/Ha)</option>
                  <option value="Medium (108 - 280)">Medium (108 - 280 kg/Ha)</option>
                  <option value="High (> 280)">High (&gt; 280 kg/Ha)</option>
                </select>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Drives MOP application</span>
              </div>

              {/* Zinc Micronutrient */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-700 dark:text-slate-300">Available Zinc (Zn ppm)</span>
                  <span className={`font-bold px-1.5 py-0.5 rounded text-[10px] ${
                    (soilData.zincPpm || 0.8) >= 0.6 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                    {(soilData.zincPpm || 0.8) >= 0.6 ? 'Sufficient' : 'Deficient'}
                  </span>
                </div>
                <input
                  type="number"
                  step={0.05}
                  min={0.1}
                  max={5.0}
                  value={soilData.zincPpm !== undefined ? soilData.zincPpm : 0.8}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value) || 0.6;
                    onChange({
                      ...soilData,
                      zincPpm: val,
                      zincStatus: val >= 0.6 ? 'Sufficient (>= 0.6 ppm)' : 'Deficient (< 0.6 ppm)'
                    });
                  }}
                  className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                />
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Critical Level: 0.60 ppm</span>
              </div>

              {/* Boron Micronutrient */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-700 dark:text-slate-300">Available Boron (B ppm)</span>
                  <span className={`font-bold px-1.5 py-0.5 rounded text-[10px] ${
                    (soilData.boronPpm || 0.6) >= 0.5 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                    {(soilData.boronPpm || 0.6) >= 0.5 ? 'Sufficient' : 'Deficient'}
                  </span>
                </div>
                <input
                  type="number"
                  step={0.05}
                  min={0.1}
                  max={3.0}
                  value={soilData.boronPpm !== undefined ? soilData.boronPpm : 0.6}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value) || 0.5;
                    onChange({
                      ...soilData,
                      boronPpm: val,
                      boronStatus: val >= 0.5 ? 'Sufficient (>= 0.5 ppm)' : 'Deficient (< 0.5 ppm)'
                    });
                  }}
                  className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                />
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Critical Level: 0.50 ppm</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. TAB CONTENT: HEALTH INDICATORS (ICAR Standards) */}
      {activeTab === 'indicators' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="w-4.5 h-4.5 text-emerald-600" />
                <span>ICAR Soil Health Evaluation Matrix</span>
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                Evaluated against official Indian Council of Agricultural Research & Soil Health Card critical thresholds.
              </p>
            </div>
            {renderStatusBadge('OFFICIAL DATA')}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            {/* pH Indicator */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-700 dark:text-slate-300">Soil Reaction Status</span>
                <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                  indicators.phStatus.severity === 'optimal' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300' :
                  indicators.phStatus.severity === 'warning' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300' :
                  'bg-rose-100 text-rose-800 dark:bg-rose-900/60 dark:text-rose-300'
                }`}>
                  {indicators.phStatus.classification}
                </span>
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
                {indicators.phStatus.description}
              </p>
              <div className="pt-2 border-t border-slate-200 dark:border-slate-700 text-[10px] text-slate-500">
                Target Window: <span className="font-mono font-bold text-slate-700 dark:text-slate-300">{indicators.phStatus.targetRange}</span>
              </div>
            </div>

            {/* Organic Carbon Indicator */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-700 dark:text-slate-300">Organic Carbon Level</span>
                <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                  indicators.organicCarbonStatus.severity === 'optimal' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300' :
                  indicators.organicCarbonStatus.severity === 'warning' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300' :
                  'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300'
                }`}>
                  {indicators.organicCarbonStatus.classification}
                </span>
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
                {indicators.organicCarbonStatus.description}
              </p>
              <div className="pt-2 border-t border-slate-200 dark:border-slate-700 text-[10px] text-slate-500">
                Standard: <span className="font-semibold text-slate-700 dark:text-slate-300">{indicators.organicCarbonStatus.benchmarkNote}</span>
              </div>
            </div>

            {/* Salinity EC Indicator */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-700 dark:text-slate-300">Salinity / EC Status</span>
                <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                  indicators.salinityEcStatus.severity === 'optimal' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300' :
                  'bg-rose-100 text-rose-800 dark:bg-rose-900/60 dark:text-rose-300'
                }`}>
                  {indicators.salinityEcStatus.classification}
                </span>
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
                {indicators.salinityEcStatus.description}
              </p>
              <div className="pt-2 border-t border-slate-200 dark:border-slate-700 text-[10px] text-slate-500">
                Threshold: <span className="font-mono font-bold text-slate-700 dark:text-slate-300">{indicators.salinityEcStatus.standardRange}</span>
              </div>
            </div>

            {/* Nitrogen Indicator */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-700 dark:text-slate-300">Nitrogen (N) Rating</span>
                <span className="px-2 py-0.5 rounded-full font-bold text-[10px] bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200">
                  {indicators.nitrogenStatus.classification}
                </span>
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
                {indicators.nitrogenStatus.description}
              </p>
              <div className="pt-2 border-t border-slate-200 dark:border-slate-700 text-[10px] text-slate-500">
                Classification: <span className="font-mono text-slate-700 dark:text-slate-300">{indicators.nitrogenStatus.standardRange}</span>
              </div>
            </div>

            {/* Phosphorus Indicator */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-700 dark:text-slate-300">Phosphorus (P) Rating</span>
                <span className="px-2 py-0.5 rounded-full font-bold text-[10px] bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200">
                  {indicators.phosphorusStatus.classification}
                </span>
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
                {indicators.phosphorusStatus.description}
              </p>
              <div className="pt-2 border-t border-slate-200 dark:border-slate-700 text-[10px] text-slate-500">
                Classification: <span className="font-mono text-slate-700 dark:text-slate-300">{indicators.phosphorusStatus.standardRange}</span>
              </div>
            </div>

            {/* Potassium Indicator */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-700 dark:text-slate-300">Potassium (K) Rating</span>
                <span className="px-2 py-0.5 rounded-full font-bold text-[10px] bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200">
                  {indicators.potassiumStatus.classification}
                </span>
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
                {indicators.potassiumStatus.description}
              </p>
              <div className="pt-2 border-t border-slate-200 dark:border-slate-700 text-[10px] text-slate-500">
                Classification: <span className="font-mono text-slate-700 dark:text-slate-300">{indicators.potassiumStatus.standardRange}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 7. TAB CONTENT: CONDITION WARNINGS & AMENDMENTS */}
      {activeTab === 'advisories' && (
        <div className="space-y-6">
          {/* Soil Condition Warnings */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <AlertTriangle className="w-4.5 h-4.5 text-amber-600" />
              <span>Soil Condition Risk Alerts & Warnings</span>
            </h4>

            {warnings.length === 0 ? (
              <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>No critical agronomic soil hazards detected. All major parameters are within safe operational tolerance.</span>
              </div>
            ) : (
              <div className="space-y-3">
                {warnings.map((warn) => (
                  <div 
                    key={warn.id}
                    className={`p-4 rounded-xl border text-xs space-y-2 ${
                      warn.severity === 'high' 
                        ? 'bg-rose-50/70 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800' 
                        : 'bg-amber-50/70 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className={`font-bold text-sm ${warn.severity === 'high' ? 'text-rose-900 dark:text-rose-200' : 'text-amber-900 dark:text-amber-200'}`}>
                        {warn.title}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                        warn.nature.includes('Confirmed') 
                          ? 'bg-purple-100 dark:bg-purple-900/60 text-purple-800 dark:text-purple-300 border border-purple-200' 
                          : 'bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 border border-amber-200'
                      }`}>
                        {warn.nature}
                      </span>
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{warn.description}</p>
                    <div className="text-[11px] font-semibold text-slate-800 dark:text-slate-200 pt-1 border-t border-slate-200 dark:border-slate-700/60">
                      Crop Impact: {warn.impactOnCrops}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Soil Improvement & Amendments Guidelines */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldAlert className="w-4.5 h-4.5 text-emerald-600" />
                <span>Soil Improvement & Conditioning Protocol</span>
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                Authoritative conditioning recommendations aligned with ICAR and State Agricultural University Package of Practices.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {advisories.map((adv, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-white">{adv.title}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      adv.status === 'Recommended' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300' :
                      adv.status === 'Requires Lab Verification First' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/60 dark:text-purple-300' :
                      'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                    }`}>
                      {adv.status}
                    </span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                    {adv.dosageGuidelines}
                  </p>
                  <div className="p-2 rounded-lg bg-amber-50/60 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30 text-[10px] text-amber-800 dark:text-amber-300">
                    <span className="font-bold">Protocol Requirement: </span>{adv.methodologyNote}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 8. TAB CONTENT: AUTHORITATIVE DATA SOURCES */}
      {activeTab === 'sources' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-5">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Database className="w-4.5 h-4.5 text-blue-600" />
              <span>Government & ICAR Authoritative Soil Baselines</span>
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
              FARMFIT strictly integrates transparent data provenances from official Government of India and Agricultural Research portals.
            </p>
          </div>

          <div className="space-y-4">
            {AUTHORITATIVE_SOIL_SOURCES.map((source, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/40 space-y-2 text-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <span>{source.sourceName}</span>
                    {source.sourceUrl && (
                      <a href={source.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline inline-flex items-center">
                        <ExternalLink className="w-3 h-3 ml-1" />
                      </a>
                    )}
                  </div>
                  {renderStatusBadge('OFFICIAL DATA')}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] text-slate-600 dark:text-slate-400 pt-1">
                  <div><span className="font-semibold text-slate-700 dark:text-slate-300">Dataset: </span>{source.datasetName}</div>
                  <div><span className="font-semibold text-slate-700 dark:text-slate-300">Coverage: </span>{source.geographicCoverage}</div>
                  <div><span className="font-semibold text-slate-700 dark:text-slate-300">Parameters: </span>{source.parameter}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Regional Mapped Connection Status Box */}
          <div className="p-4 rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/60 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-blue-950 dark:text-blue-200">
                Spatial GIS Mapped Layer Status:
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-300">
                {mappedData.isSourceConnected ? 'ONLINE CONNECTED' : 'AWAITING GIS API SYNC'}
              </span>
            </div>
            <p className="text-blue-900 dark:text-blue-300 text-[11px]">
              {mappedData.statusMessage}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
