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
  Truck 
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
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  language,
  onToggleLanguage,
  onLaunchCalculator,
  hasCalculated
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [modulesDropdownOpen, setModulesDropdownOpen] = useState(false);
  const t = useTranslation(language);

  const mainTabs = [
    { id: 'home', label: t.navHome, icon: Sprout },
    { id: 'recommendations', label: t.navRecommendations, icon: Wheat, highlight: hasCalculated },
    { id: 'routing', label: t.navRouting, icon: Truck },
    { id: 'msp', label: t.navMsp, icon: Scale },
    { id: 'weather', label: t.navWeather, icon: CloudSun },
    { id: 'report', label: t.navReport, icon: FileText, highlight: hasCalculated }
  ];

  const intelligenceModules = [
    { id: 'profile', label: t.navProfile, icon: Compass },
    { id: 'location', label: t.navLocation, icon: MapPin },
    { id: 'land', label: t.navLand, icon: Layers },
    { id: 'soil', label: t.navSoil, icon: FlaskConical },
    { id: 'crops', label: t.navCrops, icon: Wheat },
    { id: 'markets', label: t.navMarkets, icon: Store },
    { id: 'supply_demand', label: t.navSupplyDemand, icon: TrendingUp },
    { id: 'trade', label: t.navTrade, icon: Globe2 },
    { id: 'fertilizer', label: t.navFertilizer, icon: FlaskConical },
    { id: 'engine', label: t.navEngine, icon: Calculator },
    { id: 'risk', label: t.navRisk, icon: ShieldAlert },
    { id: 'datasources', label: t.navDataSources, icon: Database },
    { id: 'about', label: t.navAbout, icon: Sprout }
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
          <nav className="hidden lg:flex items-center gap-1">
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
                  {tab.highlight && (
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  )}
                </button>
              );
            })}

            {/* All Modules Dropdown */}
            <div className="relative">
              <button
                onClick={() => setModulesDropdownOpen(!modulesDropdownOpen)}
                className="flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-semibold text-slate-800 hover:text-emerald-800 hover:bg-slate-100 dark:text-slate-200 dark:hover:text-white dark:hover:bg-slate-800 cursor-pointer"
              >
                <span>Modules</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${modulesDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {modulesDropdownOpen && (
                <div 
                  onMouseLeave={() => setModulesDropdownOpen(false)}
                  className="absolute right-0 mt-2 w-64 p-2 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 grid grid-cols-1 gap-1 z-50 animate-in fade-in zoom-in-95"
                >
                  <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 border-b border-slate-100 dark:border-slate-800">
                    Agricultural Intelligence Modules
                  </div>
                  <div className="max-h-80 overflow-y-auto space-y-0.5">
                    {intelligenceModules.map((item) => {
                      const Icon = item.icon;
                      const isItemActive = currentTab === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => handleNavClick(item.id)}
                          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-left font-medium transition-colors cursor-pointer ${
                            isItemActive
                              ? 'bg-emerald-50 text-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-300 font-semibold'
                              : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                          <span>{item.label}</span>
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
            {[...mainTabs, ...intelligenceModules].map((item) => {
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
