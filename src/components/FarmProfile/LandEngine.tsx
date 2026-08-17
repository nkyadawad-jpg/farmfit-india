import React, { useState, useEffect } from 'react';
import { 
  Ruler, 
  Layers, 
  Plus, 
  Trash2, 
  AlertCircle, 
  CheckCircle2, 
  HelpCircle,
  TrendingUp,
  Sliders,
  ChevronDown,
  ChevronUp,
  Info
} from 'lucide-react';
import { LandAndIrrigation, Language } from '../../types';
import { 
  LandUnit, 
  LAND_UNIT_CONVERSIONS, 
  normalizeLandArea, 
  FarmPlot,
  ALL_IRRIGATION_SOURCES,
  IrrigationSourceType,
  QualitativeRating,
  calculateIrrigationAssessment,
  CENTRAL_IRRIGATION_WEIGHTS
} from '../../services/landUnits';

interface LandEngineProps {
  landData: LandAndIrrigation;
  onChange: (data: LandAndIrrigation) => void;
  language: Language;
}

export const LandEngine: React.FC<LandEngineProps> = ({
  landData,
  onChange,
  language
}) => {
  // -------------------------------------------------------------
  // 1. LAND SIZE & MEASUREMENT UNIT
  // -------------------------------------------------------------
  const [selectedUnit, setSelectedUnit] = useState<LandUnit>(
    (landData.selectedLandUnit as LandUnit) || 'Acre'
  );
  const [totalFarmAreaInput, setTotalFarmAreaInput] = useState<string>(
    landData.originalLandValue !== undefined
      ? landData.originalLandValue.toString()
      : (landData.totalLandAcres || 5).toString()
  );
  const [customUnitName, setCustomUnitName] = useState<string>(
    landData.customUnitName || 'Local Bigha'
  );
  const [customRatioToAcres, setCustomRatioToAcres] = useState<string>(
    (landData.customUnitToAcresRatio || 0.625).toString()
  );

  // -------------------------------------------------------------
  // 2. CROP AREA ALLOCATION & MULTI-PLOT ARCHITECTURE
  // -------------------------------------------------------------
  const [cultivatedAreaInput, setCultivatedAreaInput] = useState<string>(
    (landData.originalLandValue !== undefined ? landData.originalLandValue : (landData.totalLandAcres || 5)).toString()
  );
  const [fallowAreaInput, setFallowAreaInput] = useState<string>('0');
  const [proposedCropAreaInput, setProposedCropAreaInput] = useState<string>(
    (landData.plannedLandAllocationAcres !== undefined
      ? (landData.selectedLandUnit === 'Acre' ? landData.plannedLandAllocationAcres : landData.originalLandValue || 5)
      : (landData.totalLandAcres || 5)).toString()
  );

  // Future Multi-Plot Data Architecture
  const [plots, setPlots] = useState<FarmPlot[]>([
    {
      id: 'plot-1',
      name: 'Plot 1 (Main Field)',
      areaDisplay: parseFloat(totalFarmAreaInput) || 5,
      areaUnit: selectedUnit,
      normalizedAcres: landData.totalLandAcres || 5,
      isIrrigated: true,
      irrigationSource: 'Borewell',
      soilType: 'Alluvial Soil',
      currentCrop: 'Soybean',
      proposedCrop: 'Wheat'
    }
  ]);
  const [showPlotDrawer, setShowPlotDrawer] = useState<boolean>(false);

  // -------------------------------------------------------------
  // 3. IRRIGATION SOURCES (Multiple Selections)
  // -------------------------------------------------------------
  const initialSources = (): IrrigationSourceType[] => {
    const s: IrrigationSourceType[] = [];
    if (landData.hasBorewell) s.push('Borewell');
    if (landData.hasOpenWell) s.push('Open well');
    if (landData.hasCanal) s.push('Canal');
    if (landData.hasRiverLift) s.push('River');
    if (landData.hasFarmPond) s.push('Farm pond');
    if (landData.hasDrip) s.push('Drip irrigation');
    if (landData.hasSprinkler) s.push('Sprinkler');
    if (s.length === 0) s.push('Borewell', 'Drip irrigation');
    return s;
  };

  const [selectedSources, setSelectedSources] = useState<IrrigationSourceType[]>(initialSources());

  // -------------------------------------------------------------
  // 4. IRRIGATION AREA & RAINFED AREA
  // -------------------------------------------------------------
  const [irrigatedAreaInput, setIrrigatedAreaInput] = useState<string>(
    (landData.irrigatedAreaAcres !== undefined
      ? (selectedUnit === 'Acre' ? landData.irrigatedAreaAcres : totalFarmAreaInput)
      : totalFarmAreaInput).toString()
  );
  const [rainfedAreaInput, setRainfedAreaInput] = useState<string>(
    (landData.rainfedAreaAcres !== undefined
      ? (selectedUnit === 'Acre' ? landData.rainfedAreaAcres : 0)
      : 0).toString()
  );
  const [bothIrrigationAndRainfed, setBothIrrigationAndRainfed] = useState<boolean>(false);

  // -------------------------------------------------------------
  // 5. WATER AVAILABILITY
  // -------------------------------------------------------------
  const [monthsReliableWater, setMonthsReliableWater] = useState<number>(
    landData.monthsWaterAvailable ?? 10
  );
  const [monthsWaterShortage, setMonthsWaterShortage] = useState<number>(2);
  const [sourceReliability, setSourceReliability] = useState<QualitativeRating>('High');
  const [typicalFrequency, setTypicalFrequency] = useState<any>(
    landData.irrigationFrequency || 'Alternate Days'
  );
  const [availableInSummer, setAvailableInSummer] = useState<boolean>(true);
  const [availableInMonsoon, setAvailableInMonsoon] = useState<boolean>(true);
  const [availableInWinter, setAvailableInWinter] = useState<boolean>(true);

  // Methodology modal
  const [showMethodologyModal, setShowMethodologyModal] = useState<boolean>(false);

  // Parse numeric values safely
  const parsedTotalArea = Math.max(0.01, parseFloat(totalFarmAreaInput) || 0);
  const parsedCultivatedArea = Math.max(0, parseFloat(cultivatedAreaInput) || 0);
  const parsedFallowArea = Math.max(0, parseFloat(fallowAreaInput) || 0);
  const parsedProposedArea = Math.max(0, parseFloat(proposedCropAreaInput) || 0);
  const parsedCustomRatio = Math.max(0.0001, parseFloat(customRatioToAcres) || 1);

  const parsedIrrigatedArea = Math.max(0, parseFloat(irrigatedAreaInput) || 0);
  const parsedRainfedArea = Math.max(0, parseFloat(rainfedAreaInput) || 0);

  // Normalization
  const normalizedTotal = normalizeLandArea(
    parsedTotalArea,
    selectedUnit,
    customUnitName,
    parsedCustomRatio
  );
  const normalizedProposed = normalizeLandArea(
    parsedProposedArea,
    selectedUnit,
    customUnitName,
    parsedCustomRatio
  );
  const normalizedIrrigated = normalizeLandArea(
    parsedIrrigatedArea,
    selectedUnit,
    customUnitName,
    parsedCustomRatio
  );
  const normalizedRainfed = normalizeLandArea(
    parsedRainfedArea,
    selectedUnit,
    customUnitName,
    parsedCustomRatio
  );

  // Validations
  const isCultivatedExceedingTotal = (parsedCultivatedArea + parsedFallowArea) > parsedTotalArea;
  const isProposedExceedingTotal = parsedProposedArea > parsedTotalArea;
  const isIrrigationExceedingTotal = !bothIrrigationAndRainfed && ((parsedIrrigatedArea + parsedRainfedArea) > (parsedTotalArea + 0.01));

  // Run central irrigation assessment engine
  const assessment = calculateIrrigationAssessment({
    totalFarmArea: parsedTotalArea,
    cultivatedArea: parsedCultivatedArea,
    fallowArea: parsedFallowArea,
    proposedCropArea: parsedProposedArea,
    irrigatedArea: parsedIrrigatedArea,
    rainfedArea: parsedRainfedArea,
    bothIrrigationAndRainfedArea: bothIrrigationAndRainfed,
    selectedSources,
    monthsReliableWater,
    monthsWaterShortage,
    sourceReliability,
    typicalFrequency,
    availableInSummer,
    availableInMonsoon,
    availableInWinter
  });

  // Sync state upward to parent
  useEffect(() => {
    onChange({
      ...landData,
      totalLandAcres: normalizedTotal.normalizedAcres,
      plannedLandAllocationAcres: Math.min(normalizedTotal.normalizedAcres, normalizedProposed.normalizedAcres),
      selectedLandUnit: selectedUnit,
      originalLandValue: parsedTotalArea,
      customUnitName,
      customUnitToAcresRatio: parsedCustomRatio,
      normalizedHectares: normalizedTotal.normalizedHectares,
      normalizedSquareMetres: normalizedTotal.normalizedSquareMetres,

      irrigatedAreaAcres: normalizedIrrigated.normalizedAcres,
      rainfedAreaAcres: normalizedRainfed.normalizedAcres,
      hasBorewell: selectedSources.includes('Borewell'),
      hasOpenWell: selectedSources.includes('Open well'),
      hasCanal: selectedSources.includes('Canal'),
      hasRiverLift: selectedSources.includes('River'),
      hasFarmPond: selectedSources.includes('Farm pond'),
      hasDrip: selectedSources.includes('Drip irrigation'),
      hasSprinkler: selectedSources.includes('Sprinkler'),
      hasFloodOther: selectedSources.includes('Other') || selectedSources.includes('Community irrigation'),
      monthsWaterAvailable: monthsReliableWater,
      irrigationFrequency: typicalFrequency,
      sourceReliabilityRating: (sourceReliability === 'Very High' || sourceReliability === 'High') ? 'High (Perennial / Assured)' : sourceReliability === 'Moderate' ? 'Moderate (Seasonal Dip)' : 'Low (Unpredictable / Depleted in Summer)',
      seasonalLimitations: !availableInSummer ? 'Summer Scarcity (March-June)' : !availableInWinter ? 'Winter & Summer Dip' : 'None',

      irrigationReliabilityScore100: assessment.irrigationReliabilityScore,
      rainfallDependencyPercent: assessment.rainfallDependencyPercent,
      irrigatedLandPercent: assessment.irrigatedPercentage,
      rainfedLandPercent: assessment.rainfedPercentage,
      waterReliabilityScore: Math.max(1, Math.min(10, Math.round(assessment.irrigationReliabilityScore / 10)))
    });
  }, [
    parsedTotalArea,
    selectedUnit,
    customUnitName,
    parsedCustomRatio,
    parsedProposedArea,
    parsedIrrigatedArea,
    parsedRainfedArea,
    selectedSources,
    monthsReliableWater,
    typicalFrequency,
    sourceReliability,
    availableInSummer,
    availableInMonsoon,
    availableInWinter,
    assessment.irrigationReliabilityScore,
    assessment.rainfallDependencyPercent
  ]);

  // Source selection handler
  const handleToggleSource = (source: IrrigationSourceType) => {
    if (source === 'Rainfed only') {
      if (selectedSources.includes('Rainfed only')) {
        setSelectedSources(['Borewell']);
      } else {
        setSelectedSources(['Rainfed only']);
        setIrrigatedAreaInput('0');
        setRainfedAreaInput(totalFarmAreaInput);
        setAvailableInSummer(false);
      }
      return;
    }

    let updated: IrrigationSourceType[] = selectedSources.filter(s => s !== 'Rainfed only');
    if (updated.includes(source)) {
      updated = updated.filter(s => s !== source);
      if (updated.length === 0) updated = ['Rainfed only'];
    } else {
      updated.push(source);
    }
    setSelectedSources(updated);
  };

  // Plot management helpers
  const handleAddPlot = () => {
    const nextPlotNum = plots.length + 1;
    const newPlot: FarmPlot = {
      id: `plot-${Date.now()}`,
      name: `Plot ${nextPlotNum}`,
      areaDisplay: 1.0,
      areaUnit: selectedUnit,
      normalizedAcres: normalizeLandArea(1.0, selectedUnit, customUnitName, parsedCustomRatio).normalizedAcres,
      isIrrigated: true,
      irrigationSource: selectedSources[0] || 'Borewell',
      soilType: 'Alluvial Soil',
      currentCrop: '',
      proposedCrop: ''
    };
    setPlots([...plots, newPlot]);
  };

  const handleRemovePlot = (id: string) => {
    if (plots.length <= 1) return;
    setPlots(plots.filter(p => p.id !== id));
  };

  return (
    <div className="space-y-8" id="land-irrigation-module">
      {/* ======================================================= */}
      {/* SECTION 1: LAND SIZE & MEASUREMENT NORMALIZATION        */}
      {/* ======================================================= */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Ruler className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <span>1. Total Farm Land Size & Unit Normalization</span>
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
              Enter your total farm holding. Choose your regional Indian measurement unit to automatically calculate standard metrics.
            </p>
          </div>

          <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 self-start sm:self-auto">
            1 Acre = 0.4047 Ha = 4,047 m²
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Measurement Dropdown */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
              Measurement Unit Dropdown
            </label>
            <select
              id="select-land-unit"
              value={selectedUnit}
              onChange={(e) => setSelectedUnit(e.target.value as LandUnit)}
              className="w-full px-3.5 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden cursor-pointer"
            >
              {Object.keys(LAND_UNIT_CONVERSIONS).map((unitKey) => (
                <option key={unitKey} value={unitKey}>
                  {LAND_UNIT_CONVERSIONS[unitKey as LandUnit].labelEn}
                </option>
              ))}
            </select>
            <span className="text-[11px] text-slate-500 mt-1 block">
              {LAND_UNIT_CONVERSIONS[selectedUnit].regionNote}
            </span>
          </div>

          {/* Total Farm Area Numeric Input */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
              Total Farm Area ({selectedUnit})
            </label>
            <input
              type="number"
              min="0.01"
              step="0.1"
              id="input-total-farm-area"
              value={totalFarmAreaInput}
              onChange={(e) => setTotalFarmAreaInput(e.target.value)}
              className="w-full px-3.5 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-base font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              placeholder="e.g. 5.0"
            />
          </div>
        </div>

        {/* Custom / Local Unit Conversion Factor Config */}
        {selectedUnit === 'Custom/local unit' && (
          <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-amber-600" />
              <span>Define Custom / Local Unit Conversion Factor</span>
            </h4>
            <p className="text-xs text-amber-800 dark:text-amber-300">
              Local units (such as Bigha or Biswa) vary in size across different states and tehsils in India. Define your local ratio below:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Local Unit Name
                </label>
                <input
                  type="text"
                  value={customUnitName}
                  onChange={(e) => setCustomUnitName(e.target.value)}
                  placeholder="e.g. Kachha Bigha / Lecha"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  1 {customUnitName || 'Unit'} = How many Standard Acres?
                </label>
                <input
                  type="number"
                  step="0.001"
                  min="0.0001"
                  value={customRatioToAcres}
                  onChange={(e) => setCustomRatioToAcres(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-bold"
                />
              </div>
            </div>
          </div>
        )}

        {/* Display Normalized Areas Display Grid */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
          <span className="text-[11px] uppercase font-bold text-slate-500 block mb-3">
            Normalized Land Area Breakdown
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
            <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Original Area</span>
              <span className="text-sm font-black text-slate-900 dark:text-white mt-0.5 block">
                {parsedTotalArea}
              </span>
            </div>

            <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Selected Unit</span>
              <span className="text-xs font-bold text-slate-900 dark:text-white mt-0.5 block truncate">
                {selectedUnit === 'Custom/local unit' ? customUnitName : selectedUnit}
              </span>
            </div>

            <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-emerald-200 dark:border-emerald-800">
              <span className="text-[10px] text-emerald-700 dark:text-emerald-300 font-bold uppercase block">Equivalent Acres</span>
              <span className="text-base font-black text-emerald-700 dark:text-emerald-400 mt-0.5 block">
                {normalizedTotal.normalizedAcres} Acres
              </span>
            </div>

            <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-emerald-200 dark:border-emerald-800">
              <span className="text-[10px] text-emerald-700 dark:text-emerald-300 font-bold uppercase block">Equivalent Hectares</span>
              <span className="text-base font-black text-emerald-700 dark:text-emerald-400 mt-0.5 block">
                {normalizedTotal.normalizedHectares} Ha
              </span>
            </div>

            <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-emerald-200 dark:border-emerald-800 col-span-2 sm:col-span-1">
              <span className="text-[10px] text-emerald-700 dark:text-emerald-300 font-bold uppercase block">Square Metres</span>
              <span className="text-sm font-black text-emerald-700 dark:text-emerald-400 mt-0.5 block">
                {normalizedTotal.normalizedSquareMetres.toLocaleString()} m²
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================= */}
      {/* SECTION 2: CROP AREA ALLOCATION & PLOT ARCHITECTURE     */}
      {/* ======================================================= */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-6">
        <div className="border-b border-slate-100 dark:border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <span>2. Crop Area Allocation & Multi-Plot Architecture</span>
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
              Specify cultivated, fallow, and proposed crop areas. Multi-plot architecture allows dividing the farm into modular plots.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowPlotDrawer(!showPlotDrawer)}
            className="px-3.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
          >
            <span>Multi-Plot Division</span>
            {showPlotDrawer ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Currently Cultivated Area */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Currently Cultivated Area ({selectedUnit})
            </label>
            <input
              type="number"
              min="0"
              step="0.1"
              value={cultivatedAreaInput}
              onChange={(e) => setCultivatedAreaInput(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            />
          </div>

          {/* Currently Fallow Area */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Currently Fallow Area ({selectedUnit})
            </label>
            <input
              type="number"
              min="0"
              step="0.1"
              value={fallowAreaInput}
              onChange={(e) => setFallowAreaInput(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            />
          </div>

          {/* Proposed Crop Area */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Proposed Crop Area ({selectedUnit})
            </label>
            <input
              type="number"
              min="0"
              step="0.1"
              value={proposedCropAreaInput}
              onChange={(e) => setProposedCropAreaInput(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            />
          </div>
        </div>

        {/* Validation Warning */}
        {isCultivatedExceedingTotal && (
          <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-800 dark:text-rose-300 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>Cultivated area + Fallow area ({parsedCultivatedArea + parsedFallowArea} {selectedUnit}) exceeds total farm area ({parsedTotalArea} {selectedUnit}). Please adjust your entries.</span>
          </div>
        )}

        {isProposedExceedingTotal && (
          <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>Proposed crop area ({parsedProposedArea} {selectedUnit}) exceeds total farm area ({parsedTotalArea} {selectedUnit}). Calculations will be constrained to available holding.</span>
          </div>
        )}

        {/* Modular Multi-Plot Architecture Drawer */}
        {showPlotDrawer && (
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                  Farm Plot Division Engine (Multi-Plot Readiness)
                </h4>
                <p className="text-[11px] text-slate-500">
                  Each plot can have its own specific location, area, soil, irrigation source, crop, and yield records.
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddPlot}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-xs flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Plot</span>
              </button>
            </div>

            <div className="space-y-2">
              {plots.map((plot, index) => (
                <div key={plot.id} className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 grid grid-cols-1 sm:grid-cols-5 gap-3 items-center text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">Plot Name</span>
                    <input
                      type="text"
                      value={plot.name}
                      onChange={(e) => {
                        const updated = [...plots];
                        updated[index].name = e.target.value;
                        setPlots(updated);
                      }}
                      className="w-full font-bold text-slate-900 dark:text-white bg-transparent border-b border-slate-200 dark:border-slate-700 py-1"
                    />
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">Plot Area ({selectedUnit})</span>
                    <input
                      type="number"
                      value={plot.areaDisplay}
                      onChange={(e) => {
                        const updated = [...plots];
                        updated[index].areaDisplay = parseFloat(e.target.value) || 0;
                        setPlots(updated);
                      }}
                      className="w-full font-bold text-slate-900 dark:text-white bg-transparent border-b border-slate-200 dark:border-slate-700 py-1"
                    />
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">Primary Irrigation</span>
                    <select
                      value={plot.irrigationSource || 'Borewell'}
                      onChange={(e) => {
                        const updated = [...plots];
                        updated[index].irrigationSource = e.target.value;
                        setPlots(updated);
                      }}
                      className="w-full text-slate-900 dark:text-white bg-transparent border-b border-slate-200 dark:border-slate-700 py-1 cursor-pointer"
                    >
                      {ALL_IRRIGATION_SOURCES.map(s => (
                        <option key={s.id} value={s.id}>{s.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">Planned Crop</span>
                    <input
                      type="text"
                      value={plot.proposedCrop || ''}
                      onChange={(e) => {
                        const updated = [...plots];
                        updated[index].proposedCrop = e.target.value;
                        setPlots(updated);
                      }}
                      placeholder="e.g. Wheat / Gram"
                      className="w-full text-slate-900 dark:text-white bg-transparent border-b border-slate-200 dark:border-slate-700 py-1"
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleRemovePlot(plot.id)}
                      disabled={plots.length <= 1}
                      className="p-1.5 text-slate-400 hover:text-rose-600 disabled:opacity-30 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ======================================================= */}
      {/* SECTION 3: IRRIGATION SOURCES (Multiple Selections)     */}
      {/* ======================================================= */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-6">
        <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 flex items-center justify-center text-xs font-bold">3</span>
            <span>Irrigation Sources & Delivery Systems</span>
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
            Select all active water sources available on your farm holding (multiple selections allowed).
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {ALL_IRRIGATION_SOURCES.map((source) => {
            const isSelected = selectedSources.includes(source.id);
            return (
              <button
                type="button"
                key={source.id}
                onClick={() => handleToggleSource(source.id)}
                className={`p-3.5 rounded-xl border text-left text-xs font-bold flex flex-col justify-between transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-400 dark:border-blue-700 text-blue-950 dark:text-blue-200 shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-750'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className="text-xs font-bold">{source.label}</span>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 ml-1" />}
                </div>
                <span className="text-[10px] text-slate-500 font-normal">{source.description}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ======================================================= */}
      {/* SECTION 4: IRRIGATION AREA & RAINFED AREA               */}
      {/* ======================================================= */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-6">
        <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center text-xs font-bold">4</span>
            <span>Irrigation Area Coverage & Automatic Ratio Calculation</span>
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
            How much of your land has assured irrigation, and how much is rainfed?
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Irrigated Area */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Irrigated Area ({selectedUnit})
            </label>
            <input
              type="number"
              min="0"
              step="0.1"
              value={irrigatedAreaInput}
              onChange={(e) => setIrrigatedAreaInput(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            />
          </div>

          {/* Rainfed Area */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Exclusively Rainfed (Barani) Area ({selectedUnit})
            </label>
            <input
              type="number"
              min="0"
              step="0.1"
              value={rainfedAreaInput}
              onChange={(e) => setRainfedAreaInput(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            />
          </div>
        </div>

        {/* Same-Land Dual Use Checkbox */}
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center gap-3">
          <input
            type="checkbox"
            id="checkbox-dual-irrigation"
            checked={bothIrrigationAndRainfed}
            onChange={(e) => setBothIrrigationAndRainfed(e.target.checked)}
            className="w-4 h-4 text-emerald-600 rounded cursor-pointer"
          />
          <label htmlFor="checkbox-dual-irrigation" className="text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
            <strong className="block font-semibold">Dual Use Seasonality:</strong>
            I utilize rainfall during Kharif and supplemental irrigation on the same land for Rabi/Zaid (do not double-count total holding).
          </label>
        </div>

        {/* Validation Warning */}
        {isIrrigationExceedingTotal && (
          <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-800 dark:text-rose-300 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>Irrigated area + Exclusively rainfed area ({parsedIrrigatedArea + parsedRainfedArea} {selectedUnit}) exceeds total farm area ({parsedTotalArea} {selectedUnit}). Please adjust areas or check "Dual Use Seasonality".</span>
          </div>
        )}

        {/* Automatic Calculation Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
            <span className="text-[11px] uppercase font-bold text-emerald-800 dark:text-emerald-300 block">
              Irrigated Land Percentage
            </span>
            <div className="text-2xl font-black text-emerald-800 dark:text-emerald-300 mt-1">
              {assessment.irrigatedPercentage}%
            </div>
            <span className="text-[11px] text-emerald-700 dark:text-emerald-400 mt-0.5 block font-medium">
              Formula: {parsedIrrigatedArea} / {parsedTotalArea} × 100
            </span>
          </div>

          <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800">
            <span className="text-[11px] uppercase font-bold text-amber-800 dark:text-amber-300 block">
              Rainfed Land Percentage
            </span>
            <div className="text-2xl font-black text-amber-800 dark:text-amber-300 mt-1">
              {assessment.rainfedPercentage}%
            </div>
            <span className="text-[11px] text-amber-700 dark:text-amber-400 mt-0.5 block font-medium">
              Formula: {parsedRainfedArea} / {parsedTotalArea} × 100
            </span>
          </div>
        </div>
      </div>

      {/* ======================================================= */}
      {/* SECTION 5: WATER AVAILABILITY                           */}
      {/* ======================================================= */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-6">
        <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 flex items-center justify-center text-xs font-bold">5</span>
            <span>Water Availability & Seasonal Duration</span>
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
            How many months is water normally available, and is water assured during peak summer?
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Months of Reliable Water */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Months of Reliable Water Availability: <strong className="text-emerald-700 dark:text-emerald-400">{monthsReliableWater} Months</strong>
            </label>
            <input
              type="range"
              min="0"
              max="12"
              step="1"
              value={monthsReliableWater}
              onChange={(e) => setMonthsReliableWater(parseInt(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-bold mt-1">
              <span>0 (Rainfed only)</span>
              <span>6 (Monsoon+Winter)</span>
              <span>12 (Perennial)</span>
            </div>
          </div>

          {/* Months of Water Shortage */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Months of Water Shortage / Stress: <strong className="text-rose-600">{monthsWaterShortage} Months</strong>
            </label>
            <input
              type="range"
              min="0"
              max="12"
              step="1"
              value={monthsWaterShortage}
              onChange={(e) => setMonthsWaterShortage(parseInt(e.target.value))}
              className="w-full accent-rose-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-bold mt-1">
              <span>0 (No stress)</span>
              <span>3 (Summer dip)</span>
              <span>6+ (Severe stress)</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          {/* Water Source Reliability */}
          <div>
            <label className="block font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Water Source Reliability Rating
            </label>
            <select
              value={sourceReliability}
              onChange={(e) => setSourceReliability(e.target.value as QualitativeRating)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden cursor-pointer"
            >
              <option value="Very High">Very High (Perennial / Non-depleting discharge)</option>
              <option value="High">High (Reliable across Kharif & Rabi)</option>
              <option value="Moderate">Moderate (Dip during peak summer months)</option>
              <option value="Low">Low (Unpredictable or low recharge rate)</option>
              <option value="Very Low">Very Low (Frequent dry well / canal failure)</option>
            </select>
          </div>

          {/* Typical Irrigation Frequency */}
          <div>
            <label className="block font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Typical Irrigation Frequency
            </label>
            <select
              value={typicalFrequency}
              onChange={(e) => setTypicalFrequency(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden cursor-pointer"
            >
              <option value="Daily">Daily (Precision Drip / Micro)</option>
              <option value="Alternate Days">Alternate Days</option>
              <option value="Weekly">Weekly Cycle</option>
              <option value="Fortnightly">Fortnightly Cycle</option>
              <option value="Critical Stages Only">Critical Vegetative & Flowering Stages Only</option>
              <option value="As per Canal Roster">As per Canal Release Roster (Warabandi)</option>
            </select>
          </div>
        </div>

        {/* Seasonal Availability Checkboxes */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
            Seasonal Irrigation Availability
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <button
              type="button"
              onClick={() => setAvailableInMonsoon(!availableInMonsoon)}
              className={`p-3 rounded-xl border text-left font-semibold flex items-center justify-between cursor-pointer ${
                availableInMonsoon
                  ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-300 dark:border-blue-800 text-blue-900 dark:text-blue-200'
                  : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-400'
              }`}
            >
              <span>Available in Monsoon (Kharif)</span>
              {availableInMonsoon && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
            </button>

            <button
              type="button"
              onClick={() => setAvailableInWinter(!availableInWinter)}
              className={`p-3 rounded-xl border text-left font-semibold flex items-center justify-between cursor-pointer ${
                availableInWinter
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                  : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-400'
              }`}
            >
              <span>Available in Winter (Rabi)</span>
              {availableInWinter && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
            </button>

            <button
              type="button"
              onClick={() => setAvailableInSummer(!availableInSummer)}
              className={`p-3 rounded-xl border text-left font-semibold flex items-center justify-between cursor-pointer ${
                availableInSummer
                  ? 'bg-teal-50 dark:bg-teal-950/60 border-teal-300 dark:border-teal-800 text-teal-900 dark:text-teal-200'
                  : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-400'
              }`}
            >
              <span>Available in Summer (Zaid)</span>
              {availableInSummer && <CheckCircle2 className="w-4 h-4 text-teal-600" />}
            </button>
          </div>
        </div>
      </div>

      {/* ======================================================= */}
      {/* SECTIONS 6, 7, 8: FARMFIT SCORES & PRELIMINARY RISK     */}
      {/* ======================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* 6. Irrigation Reliability Score */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-bold text-slate-500">6. Score (0–100)</span>
              <button
                type="button"
                onClick={() => setShowMethodologyModal(true)}
                className="text-xs text-emerald-600 hover:text-emerald-700 font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Weights</span>
              </button>
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1">
              FARMFIT Irrigation Reliability Score
            </h4>
            <div className="mt-3 flex items-baseline gap-2">
              <span className={`text-4xl font-black ${
                assessment.irrigationReliabilityScore >= 70 ? 'text-emerald-600 dark:text-emerald-400' :
                assessment.irrigationReliabilityScore >= 45 ? 'text-amber-600 dark:text-amber-400' :
                'text-rose-600 dark:text-rose-400'
              }`}>
                {assessment.irrigationReliabilityScore}
              </span>
              <span className="text-sm text-slate-400 font-bold">/ 100</span>
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-[11px] text-slate-500">
            Preliminary model score — will improve when verified water/geospatial datasets are connected.
          </div>
        </div>

        {/* 7. Rainfall Dependency */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <span className="text-xs uppercase font-bold text-slate-500">7. Dependency Breakdown</span>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1">
              Rainfall & Irrigation Dependency
            </h4>

            <div className="grid grid-cols-2 gap-3 mt-3">
              <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800">
                <span className="text-[10px] font-bold uppercase text-blue-700 dark:text-blue-300 block">Rainfall</span>
                <span className="text-2xl font-black text-blue-800 dark:text-blue-200">{assessment.rainfallDependencyPercent}%</span>
              </div>
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
                <span className="text-[10px] font-bold uppercase text-emerald-700 dark:text-emerald-300 block">Irrigation</span>
                <span className="text-2xl font-black text-emerald-800 dark:text-emerald-200">{assessment.irrigationDependencyPercent}%</span>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-slate-500">
            {assessment.rainfallDependencyPercent > 50 
              ? 'High dependency on monsoon arrival and in-season precipitation distribution.'
              : 'Protected by assured irrigation infrastructure for key vegetative stages.'}
          </p>
        </div>

        {/* 8. Water Availability Risk */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <span className="text-xs uppercase font-bold text-slate-500">8. Preliminary Risk</span>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1">
              Water Availability Risk
            </h4>

            <div className="mt-3">
              <span className={`inline-block px-3.5 py-1.5 rounded-xl text-base font-black uppercase tracking-wider ${
                assessment.waterAvailabilityRisk === 'Low' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300' :
                assessment.waterAvailabilityRisk === 'Moderate' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300' :
                assessment.waterAvailabilityRisk === 'High' ? 'bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300 border border-orange-300' :
                'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border border-rose-300'
              }`}>
                {assessment.waterAvailabilityRisk} Risk
              </span>
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-[11px] text-slate-500">
            Preliminary water risk — weather and groundwater datasets will be incorporated later.
          </div>
        </div>
      </div>

      {/* ======================================================= */}
      {/* SECTION 10: COMPLETE STRUCTURED SUMMARY                 */}
      {/* ======================================================= */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-5">
        <h3 className="text-base font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span>Complete Land & Irrigation Summary</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          {/* Land Summary */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2.5">
            <span className="font-bold text-slate-900 dark:text-white uppercase text-[11px] block border-b border-slate-200 dark:border-slate-700 pb-1.5">
              LAND SUMMARY
            </span>
            <div className="flex justify-between">
              <span className="text-slate-500">Total area:</span>
              <strong className="text-slate-900 dark:text-white">{parsedTotalArea} {selectedUnit} ({normalizedTotal.normalizedAcres} Acres / {normalizedTotal.normalizedHectares} Ha)</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Cultivated area:</span>
              <strong className="text-slate-900 dark:text-white">{parsedCultivatedArea} {selectedUnit}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Fallow area:</span>
              <strong className="text-slate-900 dark:text-white">{parsedFallowArea} {selectedUnit}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Proposed crop area:</span>
              <strong className="text-emerald-600 dark:text-emerald-400">{parsedProposedArea} {selectedUnit}</strong>
            </div>
          </div>

          {/* Irrigation Summary */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2.5">
            <span className="font-bold text-slate-900 dark:text-white uppercase text-[11px] block border-b border-slate-200 dark:border-slate-700 pb-1.5">
              IRRIGATION SUMMARY
            </span>
            <div className="flex justify-between">
              <span className="text-slate-500">Irrigated area:</span>
              <strong className="text-slate-900 dark:text-white">{parsedIrrigatedArea} {selectedUnit}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Rainfed area:</span>
              <strong className="text-slate-900 dark:text-white">{parsedRainfedArea} {selectedUnit}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Irrigated %:</span>
              <strong className="text-emerald-600 dark:text-emerald-400">{assessment.irrigatedPercentage}%</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Rainfed %:</span>
              <strong className="text-amber-600 dark:text-amber-400">{assessment.rainfedPercentage}%</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Main water sources:</span>
              <strong className="text-slate-900 dark:text-white truncate max-w-[140px] text-right">{selectedSources.join(', ')}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Months of reliable water:</span>
              <strong className="text-slate-900 dark:text-white">{monthsReliableWater} Months / Year</strong>
            </div>
          </div>

          {/* FARMFIT Indicators */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2.5">
            <span className="font-bold text-slate-900 dark:text-white uppercase text-[11px] block border-b border-slate-200 dark:border-slate-700 pb-1.5">
              FARMFIT INDICATORS
            </span>
            <div className="flex justify-between">
              <span className="text-slate-500">Irrigation Reliability Score:</span>
              <strong className="text-emerald-600 dark:text-emerald-400 font-black">{assessment.irrigationReliabilityScore} / 100</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Rainfall Dependency:</span>
              <strong className="text-blue-600 dark:text-blue-400">{assessment.rainfallDependencyPercent}%</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Preliminary Water Risk:</span>
              <strong className="text-slate-900 dark:text-white uppercase">{assessment.waterAvailabilityRisk}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Methodology Transparent Modal */}
      {showMethodologyModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-2xl w-full space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sliders className="w-5 h-5 text-emerald-600" />
                <span>Central Scoring Weights & Calculation Model</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowMethodologyModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg cursor-pointer px-2"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              All scoring weights are centralized in one calculation module. The 0–100 score evaluates assured land ratio, sources quality, duration, seasonal coverage, and farmer reliability:
            </p>

            <div className="space-y-2.5">
              {assessment.scoringBreakdown.map((item, index) => (
                <div key={index} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">
                      {item.factor} ({item.weightPercent}% Weight)
                    </span>
                    <span className="text-slate-500 text-[11px] block">{item.description}</span>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-bold text-emerald-700 dark:text-emerald-400 text-sm">
                      +{item.contribution} pts
                    </span>
                    <span className="text-[10px] text-slate-400 block">Raw: {item.score}/100</span>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setShowMethodologyModal(false)}
              className="w-full py-3 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow hover:bg-emerald-700 cursor-pointer uppercase tracking-wider"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
