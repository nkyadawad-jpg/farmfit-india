const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

const startStr = '{/* Main Content Area */}';
const startIdx = code.indexOf(startStr);
const endStr = '</ErrorBoundary>';
const endIdx = code.indexOf(endStr, startIdx);

if (startIdx === -1 || endIdx === -1) {
  console.log("Could not find boundaries");
  process.exit(1);
}

const replacement = `{/* Main Content Area */}
      <main className="flex-1 w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 overflow-x-hidden">
        <ErrorBoundary onResetToCrops={() => setCurrentTab('home')}>

        {currentTab === 'home' && <HomeView onNavigate={(tab) => setCurrentTab(tab)} language={language} />}
        
        {currentTab === 'farmer' && <StakeholderDecisionCenterView initialStakeholder="farmer" farmerLocation={{...location, state: globalState, district: globalDistrict}} preferredCropIds={[globalCommodity]} selectedCropId={globalCommodity} onSelectCrop={setGlobalCommodity} language={language} />}
        
        {currentTab === 'fpo' && <StakeholderDecisionCenterView initialStakeholder="fpo" farmerLocation={{...location, state: globalState, district: globalDistrict}} preferredCropIds={[globalCommodity]} selectedCropId={globalCommodity} onSelectCrop={setGlobalCommodity} language={language} />}
        
        {currentTab === 'b2b' && <StakeholderDecisionCenterView initialStakeholder="b2b" farmerLocation={{...location, state: globalState, district: globalDistrict}} preferredCropIds={[globalCommodity]} selectedCropId={globalCommodity} onSelectCrop={setGlobalCommodity} language={language} />}
        
        {currentTab === 'government' && <StakeholderDecisionCenterView initialStakeholder="government" farmerLocation={{...location, state: globalState, district: globalDistrict}} preferredCropIds={[globalCommodity]} selectedCropId={globalCommodity} onSelectCrop={setGlobalCommodity} language={language} />}
        
        {currentTab === 'supply_chain' && <SupplyChainCommandCenterView userDistrict={globalDistrict} selectedCommodityExternal={globalCommodity} onSelectCommodity={setGlobalCommodity} searchRadiusExternal={globalRadius} onSelectRadius={setGlobalRadius} language={language} />}
        
        {currentTab === 'markets' && <MandiMarketView farmerLocation={{...location, state: globalState, district: globalDistrict}} preferredCropIds={[globalCommodity]} selectedCropId={globalCommodity} onSelectCrop={setGlobalCommodity} language={language} expectedHarvestWindow={{startMonth: 'October', endMonth: 'November', season: 'Kharif'}} />}
        
        {currentTab === 'commodities' && <UnifiedIntelligenceView farmerLocation={{...location, state: globalState, district: globalDistrict}} selectedCropId={globalCommodity} onSelectCrop={setGlobalCommodity} language={language} />}
        
        {currentTab === 'early_warning' && <EarlyWarningIntelligencePulseView farmerLocation={{...location, state: globalState, district: globalDistrict}} selectedCropId={globalCommodity} onSelectCrop={setGlobalCommodity} language={language} />}
        
        {currentTab === 'control_tower' && <AgriculturalControlTowerView farmerLocation={{...location, state: globalState, district: globalDistrict}} selectedCropId={globalCommodity} onSelectCrop={setGlobalCommodity} language={language} />}
        
        {currentTab === 'validation' && <FarmfitValidationView language={language} />}
        
        {currentTab === 'data_audit' && (
          <div className="space-y-6">
            <DataSourcesView language={language} />
            <CommodityCoverageAuditView />
          </div>
        )}

        `;

code = code.substring(0, startIdx) + replacement + code.substring(endIdx);
fs.writeFileSync('src/App.tsx', code);
console.log("Patched successfully");
