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

function evaluate(programs, profile) {
  const isCSAB = profile.counselingType === 'CSAB';
  const isAllBranches = !profile.preferredBranches || profile.preferredBranches.length === 0 || profile.preferredBranches.includes('ALL');

  const evaluatedList = [];

  for (const prog of programs) {
    // In CSAB, strictly exclude IITs
    if (isCSAB && prog.instituteType === 'IIT') continue;

    // In JoSAA, exclude IITs if not qualified in JEE Advanced
    if (!isCSAB && prog.instituteType === 'IIT' && !profile.isJeeAdvQualified) continue;

    // Branch filter
    if (!isAllBranches && !profile.preferredBranches.includes(prog.branchCode)) continue;

    const cutoffObj = findCutoff(prog, profile, isCSAB);
    if (!cutoffObj || !cutoffObj.cr) continue;

    const studentRank = (!isCSAB && prog.instituteType === 'IIT')
      ? (Number(profile.jeeAdvRank) || 999999)
      : (Number(profile.jeeMainRank) || 999999);

    const delta = cutoffObj.cr - studentRank;

    let section = 'TOP';
    let sectionLabel = 'TOP COLLEGES (GOLD)';
    let colorTheme = 'gold'; // gold, green, light_blue
    let probabilityBadge = 'Dream Choice';
    let expectedRound = isCSAB ? 'High Dream (Beyond CSAB)' : 'High Dream (Beyond Reach)';

    if (delta < 0) {
      section = 'TOP';
      sectionLabel = 'TOP COLLEGES (GOLD)';
      colorTheme = 'gold';
      probabilityBadge = 'Top College / Dream';
      expectedRound = isCSAB ? 'High Dream (Beyond CSAB)' : 'High Dream (Beyond Reach)';
    } else if (delta >= 0 && delta <= 3000) {
      section = 'PROBABLE';
      sectionLabel = 'MOST PROBABLE COLLEGES (GREEN)';
      colorTheme = 'green';
      probabilityBadge = 'Most Probable';
      expectedRound = isCSAB ? 'Likely CSAB Special Round 1/2' : 'Likely Round 5/6 Allotment';
    } else {
      section = 'EASILY';
      sectionLabel = 'EASILY PROBABLE COLLEGES (LIGHT BLUE)';
      colorTheme = 'light_blue';
      probabilityBadge = 'Easily Probable / Safe';
      expectedRound = isCSAB ? 'CSAB Special Confirmed' : 'Likely Round 1/2 Confirmed';
    }

    evaluatedList.push({
      ...prog,
      quotaUsed: cutoffObj.q,
      effectiveClosingRank: cutoffObj.cr,
      openingRank: cutoffObj.op,
      studentRank,
      delta,
      section,
      sectionLabel,
      colorTheme,
      probabilityBadge,
      expectedRound
    });
  }

  // Sort overall pool by cutoff order:
  // Top IITs / competitive cutoffs first (lowest closing rank to higher closing rank)
  evaluatedList.sort((a, b) => {
    if (a.instituteType === 'IIT' && b.instituteType !== 'IIT') return -1;
    if (b.instituteType === 'IIT' && a.instituteType !== 'IIT') return 1;
    if (a.effectiveClosingRank !== b.effectiveClosingRank) {
      return a.effectiveClosingRank - b.effectiveClosingRank;
    }
    return a.nirf - b.nirf;
  });

  const topColleges = evaluatedList.filter(c => c.section === 'TOP');
  const probableColleges = evaluatedList.filter(c => c.section === 'PROBABLE');
  const easilyColleges = evaluatedList.filter(c => c.section === 'EASILY');

  // If probableColleges is empty (e.g. rank is very high or very low), designate the top 6 nearest choices around delta >= 0 as probable
  let finalProbable = [...probableColleges];
  let finalEasily = [...easilyColleges];

  if (finalProbable.length === 0 && finalEasily.length > 0) {
    finalProbable = finalEasily.slice(0, 6).map(c => ({
      ...c,
      section: 'PROBABLE',
      sectionLabel: 'MOST PROBABLE COLLEGES (GREEN)',
      colorTheme: 'green',
      probabilityBadge: 'Most Probable'
    }));
    finalEasily = finalEasily.slice(6);
  }

  // Smart Window:
  // All Top Colleges + All Probable Colleges + Top 30 Easily Probable Colleges
  const smartEasily = finalEasily.slice(0, 30);
  const smartChoices = [...topColleges, ...finalProbable, ...smartEasily].map((c, i) => ({
    ...c,
    choiceNumber: i + 1
  }));

  const fullChoices = [...topColleges, ...finalProbable, ...finalEasily].map((c, i) => ({
    ...c,
    choiceNumber: i + 1
  }));

  return {
    smartChoices,
    fullChoices,
    topCount: topColleges.length,
    probableCount: finalProbable.length,
    easilyCount: finalEasily.length,
    totalCount: evaluatedList.length,
    mostProbableList: finalProbable.slice(0, 6)
  };
}

console.log('=== TEST JoSAA EVALUATION ===');
const jProfile = {
  counselingType: 'JOSAA',
  jeeMainRank: 12500,
  isJeeAdvQualified: true,
  jeeAdvRank: 3800,
  homeState: 'Punjab',
  category: 'OPEN',
  genderPool: 'Gender-Neutral',
  preferredBranches: ['ALL']
};
const jRes = evaluate(josaaProgs, jProfile);
console.log('JoSAA Total Evaluated:', jRes.totalCount);
console.log('Top Colleges (GOLD):', jRes.topCount);
console.log('Most Probable Colleges (GREEN):', jRes.probableCount);
console.log('Easily Probable Colleges (LIGHT BLUE):', jRes.easilyCount);
console.log('Smart Window Total:', jRes.smartChoices.length);

console.log('\n=== TEST CSAB EVALUATION ===');
const cProfile = {
  counselingType: 'CSAB',
  jeeMainRank: 38500,
  homeState: 'Telangana',
  category: 'OPEN',
  genderPool: 'Gender-Neutral',
  preferredBranches: ['ALL']
};
const cRes = evaluate(csabProgs, cProfile);
console.log('CSAB Total Evaluated:', cRes.totalCount);
console.log('Top Colleges (GOLD):', cRes.topCount);
console.log('Most Probable Colleges (GREEN):', cRes.probableCount);
console.log('Easily Probable Colleges (LIGHT BLUE):', cRes.easilyCount);
console.log('Smart Window Total:', cRes.smartChoices.length);
console.log('Sample Most Probable CSAB Choice:', cRes.mostProbableList[0].instituteName, '-', cRes.mostProbableList[0].programName, 'CR:', cRes.mostProbableList[0].effectiveClosingRank);
