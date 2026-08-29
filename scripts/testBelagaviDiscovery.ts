import { nearbyMandiService } from '../src/services/nearbyMandiService';
import { canonicalLocationService } from '../src/services/canonicalLocationService';
import { agmarknetPipeline } from '../src/services/agmarknetPipeline';

console.log('====================================================');
console.log('RUNNING MANDI DISCOVERY REGRESSION TEST: BELAGAVI');
console.log('====================================================\n');

// 1. Test canonical normalization for Belagavi / Belgaum
console.log('Test 1: Canonical District & State Normalization');
const d1 = canonicalLocationService.canonicalizeDistrict('Belgaum', 'Karnataka');
const d2 = canonicalLocationService.canonicalizeDistrict('Belagavi', 'Karnataka');
const s1 = canonicalLocationService.canonicalizeState('Karnataka');
const eq = canonicalLocationService.areDistrictsEqual('Belgaum', 'Belagavi', 'Karnataka');

console.log(`- canonicalizeDistrict('Belgaum') -> "${d1}"`);
console.log(`- canonicalizeDistrict('Belagavi') -> "${d2}"`);
console.log(`- areDistrictsEqual('Belgaum', 'Belagavi') -> ${eq}`);

if (d1 !== 'Belagavi' || d2 !== 'Belagavi' || !eq) {
  console.error('❌ FAILED: Canonical district normalization failed for Belagavi/Belgaum');
  process.exit(1);
}
console.log('✅ PASSED: Canonical district normalization works.\n');

// 2. Test Discovery from Belagavi Farm Coordinates (15.8497, 74.4977)
console.log('Test 2: Spatially Discovered APMC Markets around Belagavi (lat: 15.8497, lon: 74.4977)');
const result = nearbyMandiService.findNearbyMarkets({
  farmLatitude: 15.8497,
  farmLongitude: 74.4977,
  state: 'Karnataka',
  district: 'Belagavi',
  cropId: 'soybean',
  initialRadiusKm: 200,
  expectedYieldQtl: 25
});

console.log(`Total Markets Discovered in Radius (${result.searchRadiusKm} km): ${result.totalMarketsInRadius}`);
console.log(`Best Market: ${result.bestMarket?.market || 'None'} (Rank: ${result.bestMarket?.rankNumber}, Modal Price: ${result.bestMarket?.modalPrice}, Distance: ${result.bestMarket?.distance} km)`);
console.log('\nDiscovered Markets in Radius:');
result.markets.forEach((m, idx) => {
  console.log(`  [${idx + 1}] ${m.market} (${m.district}, ${m.state}) - Dist: ${m.distance} km - Modal Price: ${m.modalPrice ?? 'N/A'} - Status: ${m.dataStatus}`);
});

const marketNames = result.markets.map(m => m.market.toLowerCase());
const hasBelagavi = marketNames.some(n => n.includes('belagavi') || n.includes('belgaum'));
const hasBailahongal = marketNames.some(n => n.includes('bailahongal') || n.includes('bailhongal'));
const hasSaundatti = marketNames.some(n => n.includes('saundatti') || n.includes('soundatti') || n.includes('savadatti'));

console.log(`\n- Discovered Belagavi APMC: ${hasBelagavi ? '✅ YES' : '❌ NO'}`);
console.log(`- Discovered Bailahongal APMC: ${hasBailahongal ? '✅ YES' : '❌ NO'}`);
console.log(`- Discovered Saundatti APMC: ${hasSaundatti ? '✅ YES' : '❌ NO'}`);

if (!hasBelagavi || !hasBailahongal) {
  console.error('❌ FAILED: Belagavi / Bailahongal markets were not discovered!');
  process.exit(1);
}

// 3. Test searching with 'Belgaum' district spelling alias
console.log('\nTest 3: Searching with alternate spelling "Belgaum"');
const resultBelgaum = nearbyMandiService.findNearbyMarkets({
  farmLatitude: 15.8497,
  farmLongitude: 74.4977,
  state: 'Karnataka',
  district: 'Belgaum',
  cropId: 'soybean',
  initialRadiusKm: 200
});

console.log(`Total Markets with 'Belgaum' alias: ${resultBelgaum.totalMarketsInRadius}`);
if (resultBelgaum.totalMarketsInRadius !== result.totalMarketsInRadius) {
  console.error('❌ FAILED: Search with Belgaum alias yielded different market count!');
  process.exit(1);
}
console.log('✅ PASSED: Both Belagavi and Belgaum yield identical robust discovery results.');

// 4. Test Agmarknet direct query for Belagavi
console.log('\nTest 4: AGMARKNET Official Pipeline Query for Belagavi');
const officialRecords = agmarknetPipeline.queryOfficialRecords({
  state: 'Karnataka',
  district: 'Belagavi'
});
console.log(`Found ${officialRecords.length} official records for Belagavi district.`);
officialRecords.forEach(r => {
  console.log(`  - ${r.commodity} (${r.variety}) @ ${r.market}: Modal ₹${r.modalPrice}/${r.priceUnit} (${r.date})`);
});

if (officialRecords.length === 0) {
  console.error('❌ FAILED: No official records retrieved for Belagavi district');
  process.exit(1);
}
console.log('✅ PASSED: AGMARKNET records successfully retrieved and canonicalized.');

console.log('\n====================================================');
console.log('🎉 ALL BELAGAVI REGRESSION TESTS PASSED CLEANLY!');
console.log('====================================================');
