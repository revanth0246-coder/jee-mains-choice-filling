import { ALL_JOSAA_PROGRAMS } from '../src/data/josaaCutoffs.js';
import { generateSmartChoiceList } from '../src/utils/choiceEngine.js';

console.log('--- Verifying Preferred Branches Multiple Selection Logic ---');

// Test Case 1: All Branches
const profileAll = {
  jeeMainRank: 4200,
  isJeeAdvQualified: true,
  jeeAdvRank: 3400,
  homeState: 'Kerala',
  category: 'OPEN',
  genderPool: 'Gender-Neutral',
  preferredBranches: ['ALL']
};

const resultAll = generateSmartChoiceList(ALL_JOSAA_PROGRAMS, profileAll);
console.log(`[Test 1 - All Branches] Total eligible: ${resultAll.totalEligibleCount}, Smart Window choices: ${resultAll.smartWindowChoices.length}`);
console.log(`[Test 1] Distinct branch codes in smart window:`, [...new Set(resultAll.smartWindowChoices.map(c => c.branchCode))]);

if (resultAll.smartWindowChoices.length > 0 && resultAll.totalEligibleCount === 716) {
  console.log('✅ Test 1 PASSED: All 716 programs eligible under ALL branches.');
} else {
  console.error('❌ Test 1 FAILED');
  process.exit(1);
}

// Test Case 2: Only CSE and ECE branches selected
const profileCseEce = {
  jeeMainRank: 4200,
  isJeeAdvQualified: true,
  jeeAdvRank: 3400,
  homeState: 'Kerala',
  category: 'OPEN',
  genderPool: 'Gender-Neutral',
  preferredBranches: ['CSE', 'ECE']
};

const resultCseEce = generateSmartChoiceList(ALL_JOSAA_PROGRAMS, profileCseEce);
const branchSet = new Set(resultCseEce.smartWindowChoices.map(c => c.branchCode));
console.log(`[Test 2 - CSE & ECE Only] Total eligible: ${resultCseEce.totalEligibleCount}, Smart Window choices: ${resultCseEce.smartWindowChoices.length}`);
console.log(`[Test 2] Distinct branches in result:`, [...branchSet]);

const invalidBranch = resultCseEce.smartWindowChoices.find(c => c.branchCode !== 'CSE' && c.branchCode !== 'ECE');
if (!invalidBranch && branchSet.has('CSE') && branchSet.has('ECE')) {
  console.log('✅ Test 2 PASSED: Only CSE and ECE branches are present in the choice sheet and likely zone!');
} else {
  console.error('❌ Test 2 FAILED: Found unexpected branch:', invalidBranch);
  process.exit(1);
}

// Test Case 3: Circuit branches (CSE, AI_DS, IT, MNC, ECE, EE)
const profileCircuit = {
  jeeMainRank: 12000,
  isJeeAdvQualified: false,
  jeeAdvRank: '',
  homeState: 'Tamil Nadu',
  category: 'OPEN',
  genderPool: 'Gender-Neutral',
  preferredBranches: ['CSE', 'AI_DS', 'IT', 'MNC', 'ECE', 'EE']
};

const resultCircuit = generateSmartChoiceList(ALL_JOSAA_PROGRAMS, profileCircuit);
const circuitBranches = new Set(resultCircuit.smartWindowChoices.map(c => c.branchCode));
console.log(`[Test 3 - Circuit Streams] Total eligible: ${resultCircuit.totalEligibleCount}`);
console.log(`[Test 3] Branches present:`, [...circuitBranches]);

const nonCircuit = resultCircuit.smartWindowChoices.find(c => ['ME', 'CHE', 'CE', 'AERO', 'ARCH', 'PLAN'].includes(c.branchCode));
if (!nonCircuit) {
  console.log('✅ Test 3 PASSED: Core engineering & architecture excluded from circuit selection!');
} else {
  console.error('❌ Test 3 FAILED: Found non-circuit branch:', nonCircuit);
  process.exit(1);
}

console.log('🎉 ALL BRANCH FILTER LOGIC VERIFIED SUCCESSFULLY!');
