const josaaProgs = require('../src/data/josaaSheetData.json');
const csabProgs = require('../src/data/csabSheetData.json');

function findCutoff(program, profile, isCSAB) {
  const cat = profile.category === 'GEN-EWS' ? 'EWS' : profile.category;
  const isFemale = profile.genderPool === 'Female-Only';
  const targetGender = isFemale ? 'Female-only (including Supernumerary)' : 'Gender-Neutral';

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

  // 1. Exact match
  for (const q of preferredQuotas) {
    const match = program.cutoffs.find(c => 
      c.q.toLowerCase() === q.toLowerCase() && 
      c.s === cat && 
      c.g === targetGender &&
      c.cr > 0
    );
    if (match) return { cr: match.cr, op: match.op, q: match.q, matchLevel: 'exact' };
  }

  // 2. Female fallback to Gender-Neutral
  if (isFemale) {
    for (const q of preferredQuotas) {
      const match = program.cutoffs.find(c => 
        c.q.toLowerCase() === q.toLowerCase() && 
        c.s === cat && 
        c.g === 'Gender-Neutral' &&
        c.cr > 0
      );
      if (match) return { cr: match.cr, op: match.op, q: match.q, matchLevel: 'gender_fallback' };
    }
  }

  // 3. Fallback to OPEN
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

  const anyMatch = program.cutoffs.find(c => c.cr > 0);
  if (anyMatch) return { cr: anyMatch.cr, op: anyMatch.op, q: anyMatch.q, matchLevel: 'any_fallback' };

  return null;
}

function generateClassifiedChoices(profile) {
  const isCSAB = profile.counselingType === 'CSAB';
  const programs = isCSAB ? csabProgs : josaaProgs;
  const isAllBranches = !profile.preferredBranches || profile.preferredBranches.length === 0 || profile.preferredBranches.includes('ALL');

  const evaluated = [];

  for (const prog of programs) {
    if (isCSAB && prog.instituteType === 'IIT') continue;
    if (!isCSAB && prog.instituteType === 'IIT' && !profile.isJeeAdvQualified) continue;
    if (!isAllBranches && !profile.preferredBranches.includes(prog.branchCode)) continue;

    const cutoffObj = findCutoff(prog, profile, isCSAB);
    if (!cutoffObj || !cutoffObj.cr) continue;

    const studentRank = (!isCSAB && prog.instituteType === 'IIT')
      ? (Number(profile.jeeAdvRank) || 999999)
      : (Number(profile.jeeMainRank) || 999999);

    const delta = cutoffObj.cr - studentRank;

    evaluated.push({
      ...prog,
      quotaUsed: cutoffObj.q,
      effectiveClosingRank: cutoffObj.cr,
      openingRank: cutoffObj.op,
      studentRank,
      delta
    });
  }

  // Sort overall pool by cutoff hierarchy: lowest closing rank to higher closing rank
  evaluated.sort((a, b) => {
    if (a.instituteType === 'IIT' && b.instituteType !== 'IIT') return -1;
    if (b.instituteType === 'IIT' && a.instituteType !== 'IIT') return 1;
    if (a.effectiveClosingRank !== b.effectiveClosingRank) {
      return a.effectiveClosingRank - b.effectiveClosingRank;
    }
    return a.nirf - b.nirf;
  });

  // Partition into 3 sections:
  // 1. Top Colleges (Gold): delta < 0
  // 2. Most Probable (Green): delta >= 0 and within nearest buffer
  // 3. Easily Probable (Light Blue): delta > buffer
  let topList = [];
  let probableList = [];
  let easilyList = [];

  // Find index of first item where delta >= 0
  let firstEligibleIdx = evaluated.findIndex(c => c.delta >= 0);
  if (firstEligibleIdx === -1) {
    // Student rank is very high, all are delta < 0
    topList = evaluated.slice(0, Math.max(0, evaluated.length - 8));
    probableList = evaluated.slice(Math.max(0, evaluated.length - 8));
  } else if (firstEligibleIdx === 0) {
    // Student rank is very low (e.g. rank #1), all are delta >= 0
    probableList = evaluated.slice(0, 10);
    easilyList = evaluated.slice(10);
  } else {
    topList = evaluated.slice(0, firstEligibleIdx);
    // Probable zone is the next 8-15 colleges or where delta <= 3500
    const endProbableIdx = Math.min(evaluated.length, firstEligibleIdx + 12);
    probableList = evaluated.slice(firstEligibleIdx, endProbableIdx);
    easilyList = evaluated.slice(endProbableIdx);
  }

  const tagItem = (item, section, colorTheme, probabilityBadge, expectedRound) => ({
    ...item,
    section,
    colorTheme,
    probabilityBadge,
    expectedRound
  });

  const finalTop = topList.map(item => tagItem(
    item, 
    'TOP', 
    'gold', 
    'Top College / Dream', 
    isCSAB ? 'High Dream (Beyond CSAB)' : 'High Dream (Beyond Reach)'
  ));

  const finalProbable = probableList.map(item => tagItem(
    item, 
    'PROBABLE', 
    'green', 
    'Most Probable', 
    isCSAB ? 'Likely CSAB Special Round 1/2' : 'Likely Round 5/6 Allotment'
  ));

  const finalEasily = easilyList.map(item => tagItem(
    item, 
    'EASILY', 
    'light_blue', 
    'Easily Probable (Safe)', 
    isCSAB ? 'CSAB Special Confirmed' : 'Likely Round 1/2 Confirmed'
  ));

  // Smart Window: Top choices + Probable choices + Top 30 Easily Probable choices
  const smartEasily = finalEasily.slice(0, 30);
  const smartChoices = [...finalTop, ...finalProbable, ...smartEasily].map((c, i) => ({
    ...c,
    choiceNumber: i + 1
  }));

  const fullChoices = [...finalTop, ...finalProbable, ...finalEasily].map((c, i) => ({
    ...c,
    choiceNumber: i + 1
  }));

  return {
    smartChoices,
    fullChoices,
    topCount: finalTop.length,
    probableCount: finalProbable.length,
    easilyCount: finalEasily.length,
    totalCount: evaluated.length,
    mostProbableList: finalProbable.slice(0, 6)
  };
}

console.log('Testing rank 18,500 in JoSAA:');
const r1 = generateClassifiedChoices({
  counselingType: 'JOSAA',
  jeeMainRank: 18500,
  isJeeAdvQualified: false,
  category: 'OPEN',
  genderPool: 'Gender-Neutral',
  homeState: 'Maharashtra'
});
console.log('Top (Gold):', r1.topCount, '| Probable (Green):', r1.probableCount, '| Easily (Light Blue):', r1.easilyCount, '| Smart:', r1.smartChoices.length);

console.log('\nTesting rank 48,000 in CSAB:');
const r2 = generateClassifiedChoices({
  counselingType: 'CSAB',
  jeeMainRank: 48000,
  category: 'OBC-NCL',
  genderPool: 'Gender-Neutral',
  homeState: 'Rajasthan'
});
console.log('Top (Gold):', r2.topCount, '| Probable (Green):', r2.probableCount, '| Easily (Light Blue):', r2.easilyCount, '| Smart:', r2.smartChoices.length);
console.log('Sample Probable Choice:', r2.mostProbableList[0].instituteName, '-', r2.mostProbableList[0].programName, 'CR:', r2.mostProbableList[0].effectiveClosingRank);
