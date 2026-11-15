const josaaProgs = require('../src/data/josaaSheetData.json');
const csabProgs = require('../src/data/csabSheetData.json');

function findCutoff(program, profile, isCSAB) {
  const cat = profile.category === 'GEN-EWS' ? 'EWS' : profile.category;
  const isFemale = profile.genderPool === 'Female-Only';
  const targetGender = isFemale ? 'Female-only (including Supernumerary)' : 'Gender-Neutral';

  // Determine preferred quotas
  let preferredQuotas = [];
  const isHomeState = profile.homeState && program.state && 
    program.state.toLowerCase() === profile.homeState.toLowerCase();

  if (isCSAB) {
    if (program.instituteType === 'NIT') {
      if (isHomeState) preferredQuotas = ['Home State', 'HS', 'All India', 'Other State', 'OS'];
      else preferredQuotas = ['Other State', 'OS', 'All India', 'Home State'];
    } else {
      preferredQuotas = ['All India', 'AI', 'Other State', 'OS', 'Home State'];
    }
  } else {
    if (program.instituteType === 'NIT') {
      if (isHomeState) preferredQuotas = ['HS', 'AI', 'OS'];
      else preferredQuotas = ['OS', 'AI', 'HS'];
    } else {
      preferredQuotas = ['AI', 'OS', 'HS'];
    }
  }

  // Look for match:
  // 1. Exact (preferredQuota, cat, targetGender)
  for (const q of preferredQuotas) {
    const match = program.cutoffs.find(c => 
      c.q.toLowerCase() === q.toLowerCase() && 
      c.s === cat && 
      c.g === targetGender &&
      c.cr > 0
    );
    if (match) return { cr: match.cr, op: match.op, q: match.q, matchLevel: 'exact' };
  }

  // 2. Gender neutral fallback for same category
  if (isFemale) {
    for (const q of preferredQuotas) {
      const match = program.cutoffs.find(c => 
        c.q.toLowerCase() === q.toLowerCase() && 
        c.s === cat && 
        c.g === 'Gender-Neutral' &&
        c.cr > 0
      );
      if (match) return { cr: match.cr, op: match.op, q: match.q, matchLevel: 'gender_neutral_fallback' };
    }
  }

  // 3. Fallback to OPEN seat type if reserved category not available
  if (cat !== 'OPEN') {
    for (const q of preferredQuotas) {
      const match = program.cutoffs.find(c => 
        c.q.toLowerCase() === q.toLowerCase() && 
        c.s === 'OPEN' && 
        (c.g === targetGender || c.g === 'Gender-Neutral') &&
        c.cr > 0
      );
      if (match) return { cr: match.cr, op: match.op, q: match.q, matchLevel: 'open_fallback' };
    }
  }

  // 4. Any valid cutoff for this program
  const anyMatch = program.cutoffs.find(c => c.cr > 0);
  if (anyMatch) return { cr: anyMatch.cr, op: anyMatch.op, q: anyMatch.q, matchLevel: 'general_fallback' };

  return null;
}

console.log('=== TEST JoSAA LOOKUP ===');
const testProfileJoSAA = {
  counselingType: 'JOSAA',
  jeeMainRank: 12000,
  jeeAdvRank: 3500,
  isJeeAdvQualified: true,
  category: 'OPEN',
  genderPool: 'Gender-Neutral',
  homeState: 'Punjab'
};

let josaaMatches = 0;
for (const p of josaaProgs) {
  const c = findCutoff(p, testProfileJoSAA, false);
  if (c) josaaMatches++;
}
console.log(`JoSAA matched ${josaaMatches} / ${josaaProgs.length} programs!`);

console.log('\n=== TEST CSAB LOOKUP ===');
const testProfileCSAB = {
  counselingType: 'CSAB',
  jeeMainRank: 45000,
  category: 'OPEN',
  genderPool: 'Gender-Neutral',
  homeState: 'Telangana'
};

let csabMatches = 0;
for (const p of csabProgs) {
  const c = findCutoff(p, testProfileCSAB, true);
  if (c) csabMatches++;
}
console.log(`CSAB matched ${csabMatches} / ${csabProgs.length} programs!`);
