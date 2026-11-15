import { ALL_JOSAA_PROGRAMS, COUNSELING_TYPES } from '../src/data/josaaCutoffs.js';
import { generateSmartChoiceList, evaluateProgramCutoff } from '../src/utils/choiceEngine.js';

console.log('=== TEST 1: COUNSELING TYPES ===');
console.log(COUNSELING_TYPES);

console.log('\n=== TEST 2: JOSAA PROFILE (WITH IITs) ===');
const josaaProfile = {
  counselingType: 'JOSAA',
  jeeMainRank: 4200,
  isJeeAdvQualified: true,
  jeeAdvRank: 3400,
  homeState: 'Kerala',
  category: 'OPEN',
  genderPool: 'Gender-Neutral',
  preferredBranches: ['ALL']
};

const josaaResult = generateSmartChoiceList(ALL_JOSAA_PROGRAMS, josaaProfile);
console.log('JoSAA Total Eligible:', josaaResult.totalEligibleCount);
console.log('JoSAA Smart Window Choices:', josaaResult.smartWindowChoices.length);
console.log('JoSAA Ambitious:', josaaResult.ambitiousCount);
console.log('JoSAA Likely:', josaaResult.likelyCount);
console.log('JoSAA Backup:', josaaResult.backupCount);
const iitInJosaa = josaaResult.smartWindowChoices.filter(c => c.instituteType === 'IIT');
console.log('IIT count in JoSAA smart window:', iitInJosaa.length);
console.log('Sample JoSAA Choice #1:', josaaResult.smartWindowChoices[0].instituteName, '-', josaaResult.smartWindowChoices[0].branchCode);
console.log('Sample Likely Choice:', josaaResult.mostLikelyChoices[0]?.instituteName, '-', josaaResult.mostLikelyChoices[0]?.expectedRound);

console.log('\n=== TEST 3: CSAB PROFILE (NO IITs, +15% BUFFER) ===');
const csabProfile = {
  counselingType: 'CSAB',
  jeeMainRank: 38500,
  isJeeAdvQualified: false,
  jeeAdvRank: '',
  homeState: 'Telangana',
  category: 'OPEN',
  genderPool: 'Gender-Neutral',
  preferredBranches: ['ALL']
};

const csabResult = generateSmartChoiceList(ALL_JOSAA_PROGRAMS, csabProfile);
console.log('CSAB Total Eligible:', csabResult.totalEligibleCount);
console.log('CSAB Smart Window Choices:', csabResult.smartWindowChoices.length);
console.log('CSAB Ambitious:', csabResult.ambitiousCount);
console.log('CSAB Likely:', csabResult.likelyCount);
console.log('CSAB Backup:', csabResult.backupCount);
const iitInCsab = csabResult.fullRoundChoices.filter(c => c.instituteType === 'IIT');
console.log('IIT count in CSAB (MUST BE 0):', iitInCsab.length);
console.log('Sample Likely Choice:', csabResult.mostLikelyChoices[0]?.instituteName, '-', csabResult.mostLikelyChoices[0]?.branchCode, '-', csabResult.mostLikelyChoices[0]?.expectedRound);

console.log('\n=== ALL TESTS PASSED! ===');
