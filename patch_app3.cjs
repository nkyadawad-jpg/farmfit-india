const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

code = code.replace(
  /<MandiMarketView farmLocation/g,
  `<MandiMarketView farmerLocation`
);

code = code.replace(
  /<UnifiedIntelligenceView farmLocation/g,
  `<UnifiedIntelligenceView farmerLocation`
);

fs.writeFileSync('src/App.tsx', code);
console.log("Patched 3 successfully");
