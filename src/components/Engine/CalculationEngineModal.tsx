import React, { useEffect, useState } from 'react';
import { 
  Calculator, 
  CheckCircle2, 
  Sparkles, 
  Scale, 
  Droplets, 
  FlaskConical, 
  Store, 
  ShieldAlert, 
  TrendingUp, 
  ArrowRight 
} from 'lucide-react';
import { CalculationEngineResult } from '../../types';

interface CalculationEngineModalProps {
  isOpen: boolean;
  onComplete: (result: CalculationEngineResult) => void;
  computedResult: CalculationEngineResult;
}

export const CalculationEngineModal: React.FC<CalculationEngineModalProps> = ({
  isOpen,
  onComplete,
  computedResult
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const steps = [
    { title: "Layer 1: Agro-Climatic Zone & Soil Mapping", desc: "Cross-referencing soil taxonomy, pH and root depth vs crop matrices...", icon: FlaskConical },
    { title: "Layer 2: Hydrological & Irrigation Balance", desc: "Modeling crop evapotranspiration vs farm pumping hours and seasonal rainfall...", icon: Droplets },
    { title: "Layer 3: CACP Cultivation Cost Decomposition", desc: "Synthesizing A2 (paid-out), A2+FL (family labour) and C2 (comprehensive) costs...", icon: Scale },
    { title: "Layer 4: Notified MSP & Market Safety Net", desc: "Evaluating 2024-25 CACP MSP notifications and procurement agency coverage...", icon: CheckCircle2 },
    { title: "Layer 5: APMC Mandi Logistics & Net Realization", desc: "Calculating diesel freight deductions, mandi cess, and hamali charges...", icon: Store },
    { title: "Layer 6: National Supply-Demand & Trade Parity", desc: "Inspecting DES Advance Estimates and import-export tariff pressure...", icon: TrendingUp },
    { title: "Layer 7: Multi-Scenario Profitability & Risk Scoring", desc: "Simulating Base-case, Worst-case (drought/pest), and Best-case scenarios...", icon: ShieldAlert },
    { title: "Layer 8: FARMFIT Decision Ranking & Output Generation", desc: "Finalizing suitability index, fertilizer plans, and crops to avoid...", icon: Sparkles }
  ];

  useEffect(() => {
    if (!isOpen) {
      setCurrentStepIndex(0);
      return;
    }

    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          setTimeout(() => {
            onComplete(computedResult);
          }, 400);
          return prev;
        }
      });
    }, 280);

    return () => clearInterval(interval);
  }, [isOpen, onComplete, computedResult]);

  if (!isOpen) return null;

  const progressPercent = Math.round(((currentStepIndex + 1) / steps.length) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 max-w-lg w-full text-white shadow-2xl relative overflow-hidden">
        {/* Top Header */}
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
            <Calculator className="w-6 h-6 animate-spin" style={{ animationDuration: '4s' }} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                FARMFIT Engine
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800">
                v2.4 Active
              </span>
            </div>
            <h3 className="text-lg font-bold text-white">
              Computing Optimal Farm Decision
            </h3>
          </div>
        </div>

        {/* Live Progress Bar */}
        <div className="space-y-2 mb-6">
          <div className="flex justify-between text-xs font-semibold text-slate-400">
            <span>Algorithmic Execution Progress</span>
            <span className="text-emerald-400">{progressPercent}%</span>
          </div>
          <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Steps Visual List */}
        <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isPassed = idx < currentStepIndex;
            const isCurrent = idx === currentStepIndex;

            return (
              <div
                key={idx}
                className={`p-3 rounded-xl border text-xs transition-all flex items-start gap-3 ${
                  isCurrent
                    ? 'border-emerald-500 bg-emerald-950/40 text-emerald-200 ring-1 ring-emerald-500'
                    : isPassed
                    ? 'border-slate-800 bg-slate-800/40 text-slate-300'
                    : 'border-slate-800/40 opacity-40 text-slate-500'
                }`}
              >
                <div className="mt-0.5">
                  {isPassed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Icon className={`w-4 h-4 ${isCurrent ? 'text-emerald-400 animate-pulse' : 'text-slate-500'}`} />
                  )}
                </div>
                <div>
                  <div className="font-bold">{step.title}</div>
                  <div className="text-[11px] opacity-80 mt-0.5">{step.desc}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="mt-6 pt-4 border-t border-slate-800 text-center text-[11px] text-slate-400">
          Synthesizing CACP Cost Standards, Agmarknet Mandis & IMD Agromet Grid.
        </div>
      </div>
    </div>
  );
};
