const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

code = code.replace(
  /{currentTab === 'home' && <HomeView onNavigate={\(tab\) => setCurrentTab\(tab\)} language={language} \/>}/,
  `{currentTab === 'home' && <HomeView onLaunchCalculator={handleLaunchCalculator} onSelectTab={(tab) => setCurrentTab(tab)} language={language} latestResult={computedResult} />}`
);

code = code.replaceAll('farmerLocation={{...location, state: globalState, district: globalDistrict}}', 'farmLocation={{...location, state: globalState, district: globalDistrict}}');

code = code.replace(
  /{currentTab === 'early_warning' && <EarlyWarningIntelligencePulseView farmLocation={{...location, state: globalState, district: globalDistrict}} selectedCropId={globalCommodity} onSelectCrop={setGlobalCommodity} language={language} \/>}/,
  `{currentTab === 'early_warning' && <EarlyWarningIntelligencePulseView userDistrict={globalDistrict} language={language} />}`
);

code = code.replace(
  /{currentTab === 'control_tower' && <AgriculturalControlTowerView farmLocation={{...location, state: globalState, district: globalDistrict}} selectedCropId={globalCommodity} onSelectCrop={setGlobalCommodity} language={language} \/>}/,
  `{currentTab === 'control_tower' && <AgriculturalControlTowerView userDistrict={globalDistrict} language={language} />}`
);

fs.writeFileSync('src/App.tsx', code);
console.log("Patched 2 successfully");
