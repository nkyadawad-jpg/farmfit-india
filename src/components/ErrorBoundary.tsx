import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, ArrowLeft, ShieldAlert, CheckCircle2, HelpCircle } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
  onResetToCrops?: () => void;
  onRetryCalculation?: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  errorId: string;
  errorMessage?: string;
  errorType: 'CALCULATION_ERROR' | 'PARTIAL_DATA' | 'DATA_UNAVAILABLE';
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      errorId: '',
      errorType: 'CALCULATION_ERROR'
    };
  }

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    const randomHex = Math.random().toString(36).substring(2, 9).toUpperCase();
    const msg = error?.message || '';
    
    let errorType: 'CALCULATION_ERROR' | 'PARTIAL_DATA' | 'DATA_UNAVAILABLE' = 'CALCULATION_ERROR';
    if (msg.toLowerCase().includes('unavailable') || msg.toLowerCase().includes('not found')) {
      errorType = 'DATA_UNAVAILABLE';
    } else if (msg.toLowerCase().includes('partial') || msg.toLowerCase().includes('incomplete')) {
      errorType = 'PARTIAL_DATA';
    }

    return {
      hasError: true,
      errorId: `ERR-FF-${randomHex}`,
      errorMessage: msg || 'Agronomic calculation or rendering condition encountered.',
      errorType
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('FARMFIT Error Boundary caught an error:', error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, errorId: '', errorMessage: undefined, errorType: 'CALCULATION_ERROR' });
    if (this.props.onRetryCalculation) {
      this.props.onRetryCalculation();
    } else {
      window.location.reload();
    }
  };

  private handleBackToCrops = () => {
    this.setState({ hasError: false, errorId: '', errorMessage: undefined, errorType: 'CALCULATION_ERROR' });
    if (this.props.onResetToCrops) {
      this.props.onResetToCrops();
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[420px] flex items-center justify-center p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm text-center">
          <div className="max-w-md w-full space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto border border-amber-200 dark:border-amber-800">
              <ShieldAlert className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300">
                {this.state.errorType === 'DATA_UNAVAILABLE' 
                  ? 'DATA STATUS: DATA UNAVAILABLE' 
                  : this.state.errorType === 'PARTIAL_DATA' 
                  ? 'DATA STATUS: PARTIAL DATA' 
                  : 'STATUS: CALCULATION RECOVERY'}
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                FARMFIT Calculation Safety Shield
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                The agronomic and multi-variable suitability engine encountered an unexpected data condition. Your farm profile, location, soil, and irrigation parameters remain fully preserved.
              </p>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] font-mono text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
              <span>Incident Reference:</span>
              <strong className="text-slate-800 dark:text-slate-200">{this.state.errorId}</strong>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={this.handleBackToCrops}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 text-xs font-bold transition-all cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Crop Selection</span>
              </button>

              <button
                type="button"
                onClick={this.handleRetry}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm hover:shadow transition-all cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Retry Scan</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
