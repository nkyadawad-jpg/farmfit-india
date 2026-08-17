import React, { useState } from 'react';
import { 
  FlaskConical, 
  FileSpreadsheet, 
  CheckCircle2, 
  AlertCircle, 
  Info, 
  HelpCircle, 
  Sliders, 
  Database,
  UserCheck,
  Building
} from 'lucide-react';
import { SoilIntelligence, SoilOrder, DataProvenance, Language } from '../../types';

interface SoilInputEngineProps {
  soilData: SoilIntelligence;
  onChange: (data: SoilIntelligence) => void;
  language: Language;
}

export const SoilInputEngine: React.FC<SoilInputEngineProps> = ({
  soilData,
  onChange,
  language
}) => {
  const [hasSoilHealthCard, setHasSoilHealthCard] = useState<boolean>(
    soilData.hasSoilHealthCard ?? false
  );

  const soilOrderOptions: SoilOrder[] = [
    'Alluvial Soil (Entisols / Inceptisols)',
    'Black Cotton Soil (Vertisols)',
    'Red & Yellow Soil (Alfisols / Ultisols)',
    'Laterite Soil (Oxisols)',
    'Arid / Desert Soil (Aridisols)',
    'Saline / Alkaline Soil',
    'Peaty / Organic Soil'
  ];

  const handleSoilOrderChange = (newOrder: SoilOrder) => {
    onChange({
      ...soilData,
      soilOrder: newOrder,
      soilTypeProvenance: hasSoilHealthCard ? 'Soil test (Lab)' : 'Farmer entered'
    });
  };

  const handleSoilHealthCardToggle = (checked: boolean) => {
    setHasSoilHealthCard(checked);
    const provenance: DataProvenance = checked ? 'Soil test (Lab)' : 'Farmer entered';
    onChange({
      ...soilData,
      hasSoilHealthCard: checked,
      soilTypeProvenance: provenance,
      phProvenance: provenance,
      nutrientsProvenance: provenance,
      textureProvenance: provenance,
      depthProvenance: provenance
    });
  };

  const getProvenanceBadge = (prov?: DataProvenance) => {
    const p = prov || (hasSoilHealthCard ? 'Soil test (Lab)' : 'Farmer entered');
    switch (p) {
      case 'Soil test (Lab)':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
            <Building className="w-3 h-3" /> Lab Soil Test
          </span>
        );
      case 'Mapped dataset':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
            <Database className="w-3 h-3" /> ICAR Mapped Dataset
          </span>
        );
      case 'Model derived':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
            <Sliders className="w-3 h-3" /> Model Derived
          </span>
        );
      case 'Data unavailable':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-300 dark:border-slate-700">
            Data Unavailable
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            <UserCheck className="w-3 h-3" /> Farmer Entered
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Soil Health Card & Source Verification Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FlaskConical className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <span>Soil Intelligence Foundation & Provenance Protocol</span>
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
              Accurate soil parameters drive precise fertilizer dosing and crop suitability. Every parameter is strictly provenance-tagged.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 flex items-center gap-3">
            <FileSpreadsheet className="w-5 h-5 text-purple-600 shrink-0" />
            <div className="text-xs">
              <label className="font-bold text-purple-950 dark:text-purple-200 flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasSoilHealthCard}
                  onChange={(e) => handleSoilHealthCardToggle(e.target.checked)}
                  className="w-4 h-4 text-purple-600 rounded cursor-pointer"
                />
                <span>I have a Government Soil Health Card / Lab Report</span>
              </label>
            </div>
          </div>
        </div>

        {hasSoilHealthCard && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2 border-t border-purple-100 dark:border-purple-900/50">
            <div>
              <label className="block font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Soil Health Card (SHC) Sample ID / Reference No.
              </label>
              <input
                type="text"
                value={soilData.shcNumber || ''}
                onChange={(e) => onChange({ ...soilData, shcNumber: e.target.value })}
                placeholder="e.g. MP-IND-2024-8849"
                className="w-full px-3.5 py-2.5 rounded-xl border border-purple-200 dark:border-purple-800 bg-purple-50/50 dark:bg-purple-950/20 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Laboratory Soil Testing Year
              </label>
              <input
                type="number"
                defaultValue={2024}
                className="w-full px-3.5 py-2.5 rounded-xl border border-purple-200 dark:border-purple-800 bg-purple-50/50 dark:bg-purple-950/20 text-slate-900 dark:text-white"
              />
            </div>
          </div>
        )}
      </div>

      {/* 2. Primary Physical Properties */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 text-xs">
          {/* Soil Order / Type */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Soil Type / Order
              </label>
              {getProvenanceBadge(soilData.soilTypeProvenance)}
            </div>
            <select
              value={soilData.soilOrder}
              onChange={(e) => handleSoilOrderChange(e.target.value as SoilOrder)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm cursor-pointer"
            >
              {soilOrderOptions.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          {/* Soil Texture */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Soil Texture
              </label>
              {getProvenanceBadge(soilData.textureProvenance)}
            </div>
            <select
              value={soilData.texture}
              onChange={(e) => onChange({ ...soilData, texture: e.target.value as any })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm cursor-pointer"
            >
              <option value="Clay Loam">Clay Loam (Medium-Heavy, High Moisture Retention)</option>
              <option value="Sandy Loam">Sandy Loam (Light, Fast Draining)</option>
              <option value="Heavy Clay">Heavy Clay (Deep Vertisols / Black Soil)</option>
              <option value="Silty Loam">Silty Loam (Alluvial Riverbed Plains)</option>
              <option value="Sandy">Sandy (Arid / Coastal)</option>
            </select>
          </div>

          {/* Soil Depth */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Effective Soil Depth
              </label>
              {getProvenanceBadge(soilData.depthProvenance)}
            </div>
            <select
              value={soilData.soilDepth}
              onChange={(e) => onChange({ ...soilData, soilDepth: e.target.value as any })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm cursor-pointer"
            >
              <option value="Deep (> 50 cm)">Deep (&gt; 50 cm / 20+ inches)</option>
              <option value="Medium (25 - 50 cm)">Medium (25 - 50 cm / 10-20 inches)</option>
              <option value="Shallow (< 25 cm)">Shallow (&lt; 25 cm / Hardpan/Rocky)</option>
            </select>
          </div>
        </div>

        {/* 3. Chemical & Macro-Nutrient Parameter Cards */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
              <FlaskConical className="w-4 h-4 text-purple-600" />
              <span>Chemical & Nutrient Test Values</span>
            </h4>
            {getProvenanceBadge(soilData.nutrientsProvenance)}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            {/* Soil pH */}
            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-700 dark:text-slate-300">Soil Reaction (pH)</span>
                <span className={`font-bold px-1.5 py-0.5 rounded text-[10px] ${
                  soilData.ph >= 6.5 && soilData.ph <= 7.8 ? 'bg-emerald-100 text-emerald-800' :
                  soilData.ph < 6.5 ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                }`}>
                  {soilData.ph < 6.5 ? 'Acidic' : soilData.ph > 7.8 ? 'Alkaline' : 'Optimal Neutral'}
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
              <span className="text-[10px] text-slate-500 block">Ideal: 6.5 - 7.5</span>
            </div>

            {/* Organic Carbon */}
            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-700 dark:text-slate-300">Organic Carbon (OC %)</span>
                <span className={`font-bold px-1.5 py-0.5 rounded text-[10px] ${
                  soilData.organicCarbonPercent >= 0.75 ? 'bg-emerald-100 text-emerald-800' :
                  soilData.organicCarbonPercent >= 0.5 ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {soilData.organicCarbonPercent < 0.5 ? 'Low' : soilData.organicCarbonPercent > 0.75 ? 'High' : 'Medium'}
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
              <span className="text-[10px] text-slate-500 block">&gt;0.75% indicates fertile soil</span>
            </div>

            {/* Available Nitrogen */}
            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/40 space-y-2">
              <span className="font-bold text-slate-700 dark:text-slate-300 block">Available Nitrogen (N)</span>
              <select
                value={soilData.availableNitrogenKgPerHa}
                onChange={(e) => onChange({ ...soilData, availableNitrogenKgPerHa: e.target.value as any })}
                className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
              >
                <option value="Low (< 280)">Low (&lt; 280 kg/Ha)</option>
                <option value="Medium (280 - 560)">Medium (280 - 560 kg/Ha)</option>
                <option value="High (> 560)">High (&gt; 560 kg/Ha)</option>
              </select>
              <span className="text-[10px] text-slate-500 block">Drives Urea / DAP requirement</span>
            </div>

            {/* Available Phosphorus */}
            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/40 space-y-2">
              <span className="font-bold text-slate-700 dark:text-slate-300 block">Available Phosphorus (P)</span>
              <select
                value={soilData.availablePhosphorusKgPerHa}
                onChange={(e) => onChange({ ...soilData, availablePhosphorusKgPerHa: e.target.value as any })}
                className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
              >
                <option value="Low (< 10)">Low (&lt; 10 kg/Ha)</option>
                <option value="Medium (10 - 25)">Medium (10 - 25 kg/Ha)</option>
                <option value="High (> 25)">High (&gt; 25 kg/Ha)</option>
              </select>
              <span className="text-[10px] text-slate-500 block">Drives SSP / DAP requirement</span>
            </div>
          </div>

          {/* Potassium & Micro-nutrients */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs pt-2">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Available Potassium (K)
              </label>
              <select
                value={soilData.availablePotassiumKgPerHa}
                onChange={(e) => onChange({ ...soilData, availablePotassiumKgPerHa: e.target.value as any })}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                <option value="Low (< 108)">Low (&lt; 108 kg/Ha)</option>
                <option value="Medium (108 - 280)">Medium (108 - 280 kg/Ha)</option>
                <option value="High (> 280)">High (&gt; 280 kg/Ha)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Electrical Conductivity (EC dS/m)
              </label>
              <input
                type="number"
                step={0.1}
                min={0}
                max={10}
                value={soilData.electricalConductivityDsM}
                onChange={(e) => onChange({ ...soilData, electricalConductivityDsM: parseFloat(e.target.value) || 0.5 })}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Field Drainage Capacity
              </label>
              <select
                value={soilData.drainage || 'Good (No waterlogging)'}
                onChange={(e) => onChange({ ...soilData, drainage: e.target.value as any })}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                <option value="Good (No waterlogging)">Good (No waterlogging)</option>
                <option value="Moderate">Moderate (Slow percolation)</option>
                <option value="Poor (Prone to water stagnation)">Poor (Prone to water stagnation)</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
