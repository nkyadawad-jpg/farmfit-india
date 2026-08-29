import React, { useState } from 'react';
import { 
  Sprout, 
  Languages, 
  Calculator, 
  Menu, 
  X, 
  ChevronDown, 
  Compass, 
  CloudSun, 
  Store, 
  TrendingUp, 
  FileText, 
  Database, 
  ShieldAlert, 
  Layers, 
  MapPin, 
  Wheat, 
  FlaskConical, 
  Globe2, 
  Scale, 
  Truck,
  Sparkles,
  Users,
  Building2,
  Landmark,
  Activity,
  CheckCheck,
  Shield,
  Network,
  FileCheck2,
  CloudRain,
  Info,
  ChevronRight,
  ArrowRight
} from 'lucide-react';
import { Language } from '../types';
import { useTranslation } from '../locales/translations';

interface HeaderProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  language: Language;
  onToggleLanguage: () => void;
  onLaunchCalculator: () => void;
  hasCalculated: boolean;
  isDemoModeActive?: boolean;
  onLoadDemoProfile?: () => void;
  onClearToBlankProfile?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  language,
  onToggleLanguage,
  onLaunchCalculator,
  hasCalculated,
  isDemoModeActive = false,
  onLoadDemoProfile,
  onClearToBlankProfile
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [modulesDropdownOpen, setModulesDropdownOpen] = useState(false);
  const t = useTranslation(language);

  const mainTabs = [
    { id: 'home', label: language === 'en' ? 'HOME' : 'होम', icon: Sprout },
    { id: 'farm_decision', label: language === 'en' ? 'FARM DECISION' : 'किसान निर्णय', icon: Compass },
    { id: 'markets', label: language === 'en' ? 'MARKET' : 'बाज़ार', icon: Store },
    { id: 'fpo', label: language === 'en' ? 'FPO' : 'एफपीओ', icon: Users },
    { id: 'b2b', label: language === 'en' ? 'B2B' : 'बी2बी', icon: Building2 },
    { id: 'government', label: language === 'en' ? 'GOVERNMENT' : 'सरकार', icon: Landmark },
    { id: 'early_warning', label: language === 'en' ? 'ALERTS' : 'अलर्ट्स', icon: Activity },
    { id: 'data_audit', label: language === 'en' ? 'DATA & AUDIT' : 'डेटा एवं ऑडिट', icon: Database },
    { id: 'about', label: language === 'en' ? 'ABOUT' : 'के बारे में', icon: Info }
  ];

  const subEngineShortcuts = [
    { id: 'recommendations', label: language === 'en' ? 'Crop Scan & Rankings' : 'फसल उपयुक्तता परिणाम', icon: FileCheck2, desc: '3-tier profitability & scoring' },
    { id: 'routing', label: language === 'en' ? 'Mandi Logistics & Routing' : 'मंडी लॉजिस्टिक्स एवं रूटिंग', icon: Truck, desc: 'Net Realization & transport cost' },
    { id: 'msp', label: language === 'en' ? 'CACP & MSP Policy' : 'न्यूनतम समर्थन मूल्य नीति', icon: Scale, desc: 'Official MSP 2024-25 benchmarks' },
    { id: 'fertilizer', label: language === 'en' ? 'Fertilizer & NPK Plan' : 'उर्वरक एवं पोषक तत्व योजना', icon: FlaskConical, desc: 'ICAR package of practices' },
    { id: 'weather', label: language === 'en' ? 'Weather & Climate' : 'मौसम एवं जलवायु', icon: CloudRain, desc: 'Open-Meteo 10-day live forecast' },
    { id: 'soil_intel', label: language === 'en' ? 'Soil Health Card' : 'मृदा स्वास्थ्य कार्ड', icon: FlaskConical, desc: 'Soil chemical & physical metrics' },
    { id: 'risk', label: language === 'en' ? 'Multi-Factor Risk' : 'बहु-कारक जोखिम', icon: ShieldAlert, desc: 'Agronomic & price shock model' },
    { id: 'control_tower', label: language === 'en' ? 'Exposure Control Tower' : 'एक्सपोजर कंट्रोल टावर', icon: Shield, desc: 'Value at Risk & stress testing' },
    { id: 'supply_chain', label: language === 'en' ? 'Supply Chain Network' : 'सप्लाई चेन नेटवर्क', icon: Network, desc: 'Farm to institutional buyers' },
    { id: 'validation', label: language === 'en' ? 'Decision Validation & Backtest' : 'मॉडल बैकटेस्टिंग एवं सत्यापन', icon: CheckCheck, desc: 'Historical accuracy calibration' },
    { id: 'report', label: language === 'en' ? 'Farm Decision Dossier' : 'फार्म निर्णय प्रतिवेदन', icon: FileText, desc: 'Printable official assessment' }
  ];

  const handleNavClick = (tabId: string) => {
    onSelectTab(tabId);
    setMobileMenuOpen(false);
    setModulesDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-emerald-900/10 dark:border-emerald-500/20 shadow-xs">
      {/* Top Utility Banner */}
      <div className="bg-emerald-900 text-emerald-100 text-[11px] px-4 py-1 flex items-center justify-between font-medium">
        <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>India Agricultural Decision Platform &bull; CACP 2024-25 MSP Notified &bull; Agmarknet Daily Feed</span>
        </div>
        <div className="flex items-center gap-3">
          {/* Demo Profile Indicator / Action */}
          {isDemoModeActive ? (
            <div className="flex items-center gap-1.5 bg-amber-500/20 border border-amber-400/40 text-amber-200 px-2 py-0.5 rounded text-[10px] font-bold">
              <span>DEMO PROFILE (Ramesh Patel, Indore)</span>
              {onClearToBlankProfile && (
                <button
                  type="button"
                  onClick={onClearToBlankProfile}
                  className="underline hover:text-white ml-1 cursor-pointer text-[10px]"
                  title="Clear all demo data and start a real blank profile"
                >
                  Clear
                </button>
              )}
            </div>
          ) : (
            onLoadDemoProfile && (
              <button
                type="button"
                onClick={onLoadDemoProfile}
                className="flex items-center gap-1 bg-emerald-800 hover:bg-emerald-700 text-emerald-200 hover:text-white px-2 py-0.5 rounded text-[10px] font-semibold transition-colors cursor-pointer border border-emerald-700"
                title="Load sample Ramesh Patel (Indore) profile for testing"
              >
                <Sparkles className="w-3 h-3 text-amber-300" />
                <span>Load Sample Demo</span>
              </button>
            )
          )}

          <button
            onClick={onToggleLanguage}
            className="flex items-center gap-1 hover:text-white bg-emerald-800/80 px-2 py-0.5 rounded text-[11px] font-semibold transition-colors cursor-pointer"
            title="Switch Language / भाषा बदलें"
          >
            <Languages className="w-3.5 h-3.5 text-emerald-300" />
            <span>{language === 'en' ? 'हिन्दी (Hindi)' : 'English'}</span>
          </button>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div 
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 cursor-pointer select-none group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-700 dark:bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-700/20 group-hover:scale-105 transition-transform">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">
                  FARM<span className="text-emerald-700 dark:text-emerald-400">FIT</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300">
                  India
                </span>
              </div>
              <p className="text-[10px] text-slate-700 dark:text-slate-200 font-medium hidden sm:block">
                Intelligent Agricultural Decision Support
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 overflow-x-auto scrollbar-none max-w-full">
            {mainTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = currentTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleNavClick(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-900/40 dark:text-emerald-300 font-bold'
                      : 'text-slate-800 hover:text-emerald-800 hover:bg-slate-100 dark:text-slate-200 dark:hover:text-white dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}

            {/* Contextual Analytical Engines Dropdown & Discovery Center */}
            <div className="relative flex items-center">
              <button
                type="button"
                onClick={() => handleNavClick('more_engines')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  currentTab === 'more_engines'
                    ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 font-bold shadow-xs'
                    : 'text-slate-800 hover:text-emerald-800 hover:bg-slate-100 dark:text-slate-200 dark:hover:text-white dark:hover:bg-slate-800'
                }`}
                title="Open Engine Discovery Center"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>{language === 'en' ? 'MORE ENGINES' : 'विस्तृत इंजन'}</span>
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setModulesDropdownOpen(!modulesDropdownOpen);
                }}
                className={`p-1.5 rounded-lg text-xs transition-all cursor-pointer ${
                  modulesDropdownOpen || subEngineShortcuts.some(m => m.id === currentTab)
                    ? 'text-slate-900 dark:text-white font-bold bg-slate-100 dark:bg-slate-800'
                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
                }`}
                title="Toggle Quick Shortcuts Dropdown"
              >
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${modulesDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {modulesDropdownOpen && (
                <div 
                  className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200"
                  onMouseLeave={() => setModulesDropdownOpen(false)}
                >
                  <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      Engine Discovery &amp; Modules
                    </span>
                    <button
                      type="button"
                      onClick={() => handleNavClick('more_engines')}
                      className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 hover:underline cursor-pointer flex items-center gap-1"
                    >
                      <span>View All 25+</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Primary Engine Discovery Center Link */}
                  <button
                    type="button"
                    onClick={() => handleNavClick('more_engines')}
                    className="w-full mx-2 my-1 px-3 py-2 bg-emerald-50 dark:bg-emerald-950/60 rounded-xl border border-emerald-200 dark:border-emerald-800 text-left flex items-center justify-between group cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-emerald-950 dark:text-emerald-200">
                          Engine Discovery Center
                        </div>
                        <div className="text-[10px] text-emerald-700 dark:text-emerald-400">
                          Search 25+ specialized engines with live data
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-emerald-700 group-hover:translate-x-0.5 transition-transform" />
                  </button>

                  <div className="max-h-80 overflow-y-auto py-1">
                    {subEngineShortcuts.map((item) => {
                      const Icon = item.icon;
                      const isModActive = currentTab === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => handleNavClick(item.id)}
                          className={`w-full flex items-start gap-2.5 px-3 py-2 text-left transition-colors cursor-pointer ${
                            isModActive
                              ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 font-semibold'
                              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                          }`}
                        >
                          <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${isModActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`} />
                          <div>
                            <div className="text-xs font-semibold leading-snug">{item.label}</div>
                            <div className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">{item.desc}</div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Primary Action Button: "CALCULATE MY FARM" */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={onLaunchCalculator}
              className="group relative inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white font-bold text-xs tracking-wide shadow-md shadow-emerald-700/25 hover:shadow-lg transition-all cursor-pointer"
              id="header-calculate-btn"
            >
              <Calculator className="w-4 h-4 text-emerald-200 group-hover:rotate-12 transition-transform" />
              <span>{t.calculateBtn}</span>
            </button>
          </div>

          {/* Mobile Menu Trigger */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={onLaunchCalculator}
              className="p-2 rounded-lg bg-emerald-600 text-white font-bold text-xs"
              title={t.calculateBtn}
            >
              <Calculator className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-3 pb-6 max-h-[80vh] overflow-y-auto space-y-2">
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 rounded-xl mb-3 border border-emerald-200 dark:border-emerald-800">
            <button
              onClick={() => {
                onLaunchCalculator();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-sm shadow"
            >
              <Calculator className="w-5 h-5" />
              <span>{t.calculateBtn}</span>
            </button>
            <p className="text-[11px] text-emerald-800 dark:text-emerald-300 text-center mt-2 font-medium">
              {t.calculateSub}
            </p>
          </div>

                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 px-2 py-1">
            Main Navigation
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {[...mainTabs, ...subEngineShortcuts].map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-left ${
                    isActive
                      ? 'bg-emerald-600 text-white font-bold'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};
