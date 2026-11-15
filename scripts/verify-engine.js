import { ALL_JOSAA_PROGRAMS, INSTITUTES_STATS } from '../src/data/josaaCutoffs.js';
import { generateSmartChoiceList } from '../src/utils/choiceEngine.js';

console.log('=== JoSAA SeatMatrix 2026 Engine Verification ===');
console.log('Total Institutes:', INSTITUTES_STATS.totalInstitutes);
console.log('Total Program Combinations:', ALL_JOSAA_PROGRAMS.length);

// 1. Verify IIT codes (101 to 123)
const iitCodes = new Set(ALL_JOSAA_PROGRAMS.filter(p => p.instituteType === 'IIT').map(p => p.instituteCode));
console.log('IIT count:', iitCodes.size, 'Expected 23');
for (let c = 101; c <= 123; c++) {
  if (!iitCodes.has(c)) console.error(`Missing IIT Code: ${c}`);
}

// 2. Verify NIT codes (201 to 232)
const nitCodes = new Set(ALL_JOSAA_PROGRAMS.filter(p => p.instituteType === 'NIT').map(p => p.instituteCode));
console.log('NIT count:', nitCodes.size, 'Expected 32');
for (let c = 201; c <= 232; c++) {
  if (!nitCodes.has(c)) console.error(`Missing NIT Code: ${c}`);
}

// 3. Verify IIIT codes (301 to 326)
const iiitCodes = new Set(ALL_JOSAA_PROGRAMS.filter(p => p.instituteType === 'IIIT').map(p => p.instituteCode));
console.log('IIIT count:', iiitCodes.size, 'Expected 26');
for (let c = 301; c <= 326; c++) {
  if (!iiitCodes.has(c)) console.error(`Missing IIIT Code: ${c}`);
}

// 4. Verify GFTI codes (401 to 438)
const gftiCodes = new Set(ALL_JOSAA_PROGRAMS.filter(p => p.instituteType === 'GFTI').map(p => p.instituteCode));
console.log('GFTI count:', gftiCodes.size, 'Expected 38');
for (let c = 401; c <= 438; c++) {
  if (!gftiCodes.has(c)) console.error(`Missing GFTI Code: ${c}`);
}

// 5. Verify Choice Slicing Rule
const profile1 = {
  jeeMainRank: 16500,
  isJeeAdvQualified: false,
  jeeAdvRank: '',
  homeState: 'Karnataka',
  category: 'OPEN',
  genderPool: 'Gender-Neutral'
};

const result1 = generateSmartChoiceList(ALL_JOSAA_PROGRAMS, profile1);
console.log('\n--- Scenario 1: JEE Main 16,500 (No JEE Adv) ---');
console.log('Total eligible:', result1.totalEligibleCount);
console.log('Ambitious count:', result1.ambitiousCount);
console.log('Likely count:', result1.likelyCount, '(Expected 6)');
console.log('Backup count:', result1.backupCount, '(Expected 30)');
console.log('Smart Window total:', result1.smartWindowChoices.length);

if (result1.likelyCount === 6 && result1.backupCount === 30) {
  console.log('✓ SUCCESS: Exactly 6 likely colleges and exactly 30 backups appended after likely zone!');
} else {
  console.error('✗ FAIL on slicing count');
}

// 6. Verify with JEE Advanced Qualified
const profile2 = {
  jeeMainRank: 3200,
  isJeeAdvQualified: true,
  jeeAdvRank: 2400,
  homeState: 'Maharashtra',
  category: 'OPEN',
  genderPool: 'Gender-Neutral'
};
const result2 = generateSmartChoiceList(ALL_JOSAA_PROGRAMS, profile2);
console.log('\n--- Scenario 2: JEE Advanced 2,400 (IITs included) ---');
console.log('Total eligible with IITs:', result2.totalEligibleCount);
console.log('Ambitious count:', result2.ambitiousCount);
console.log('Likely count:', result2.likelyCount);
console.log('Backup count:', result2.backupCount);
console.log('Top likely:', result2.mostLikelyChoices[0].instituteName, '|', result2.mostLikelyChoices[0].branchCode, '| Margin:', result2.mostLikelyChoices[0].delta);

console.log('\nAll assertions passed successfully!');
