import josaaProgramsData from '../data/josaaSheetData.json';
import csabProgramsData from '../data/csabSheetData.json';
import { RESERVATION_CATEGORIES, GENDER_POOLS } from '../data/josaaCutoffs.js';

export { josaaProgramsData, csabProgramsData };

/**
 * Accurately matches official sheet cutoff based on preferred quota, category, and gender
 */
export function findProgramCutoff(program, profile, isCSAB) {
  if (!program.cutoffs || program.cutoffs.length === 0) return null;

  const cat = profile.category === 'GEN-EWS' ? 'EWS' : (profile.category || 'OPEN');
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

  // 1. Exact match for (quota, category, gender)
  for (const q of preferredQuotas) {
    const match = program.cutoffs.find(c => 
      c.q && c.q.toLowerCase() === q.toLowerCase() && 
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
        c.q && c.q.toLowerCase() === q.toLowerCase() && 
        c.s === cat && 
        c.g === 'Gender-Neutral' &&
        c.cr > 0
      );
      if (match) return { cr: match.cr, op: match.op, q: match.q, matchLevel: 'gender_fallback' };
    }
  }

  // 3. Fallback to OPEN seat type for this quota and gender
  if (cat !== 'OPEN') {
    for (const q of preferredQuotas) {
      const match = program.cutoffs.find(c => 
        c.q && c.q.toLowerCase() === q.toLowerCase() && 
        c.s === 'OPEN' && 
        (c.g === targetGender || c.g === 'Gender-Neutral') &&
        c.cr > 0
      );
      if (match) return { cr: match.cr, op: match.op, q: match.q, matchLevel: 'open_fallback' };
    }
  }

  // 4. Any valid closing rank for this program
  const anyMatch = program.cutoffs.find(c => c.cr > 0);
  if (anyMatch) return { cr: anyMatch.cr, op: anyMatch.op, q: anyMatch.q, matchLevel: 'any_fallback' };

  return null;
}

/**
 * Generates the full sorted pool evaluated from JoSAA or CSAB sheets,
 * and sections the choices into:
 * 1. TOP COLLEGES (GOLD)
 * 2. MOST PROBABLE COLLEGES (GREEN)
 * 3. EASILY PROBABLE COLLEGES (LIGHT BLUE)
 */
export function generateSmartChoiceList(allPrograms, profile) {
  const isCSAB = profile.counselingType === 'CSAB';
  const dataset = isCSAB ? csabProgramsData : josaaProgramsData;

  const isAllBranches = !profile.preferredBranches || 
                        profile.preferredBranches.length === 0 || 
                        profile.preferredBranches.includes('ALL');

  const evaluated = [];

  for (const prog of dataset) {
    // In CSAB, strictly exclude IITs (IITs conclude in JoSAA Round 6)
    if (isCSAB && prog.instituteType === 'IIT') continue;

    // In JoSAA, exclude IITs if not qualified in JEE Advanced
    if (!isCSAB && prog.instituteType === 'IIT' && !profile.isJeeAdvQualified) continue;

    // Filter by candidate's preferred branches
    if (!isAllBranches && !profile.preferredBranches.includes(prog.branchCode)) continue;

    const cutoffObj = findProgramCutoff(prog, profile, isCSAB);
    if (!cutoffObj || !cutoffObj.cr) continue;

    const studentRank = (!isCSAB && prog.instituteType === 'IIT')
      ? (Number(profile.jeeAdvRank) || 999999)
      : (Number(profile.jeeMainRank) || 999999);

    const delta = cutoffObj.cr - studentRank;

    evaluated.push({
      ...prog,
      quotaUsed: cutoffObj.q || (prog.instituteType === 'IIT' ? 'AI' : 'OS'),
      effectiveClosingRank: cutoffObj.cr,
      openingRank: cutoffObj.op || cutoffObj.cr,
      studentRank,
      delta
    });
  }

  // Sort choices by official cutoff hierarchy:
  // Top tier (lowest closing rank / hardest to get) -> down to higher closing ranks (easier to get)
  evaluated.sort((a, b) => {
    if (a.instituteType === 'IIT' && b.instituteType !== 'IIT') return -1;
    if (b.instituteType === 'IIT' && a.instituteType !== 'IIT') return 1;
    if (a.effectiveClosingRank !== b.effectiveClosingRank) {
      return a.effectiveClosingRank - b.effectiveClosingRank;
    }
    return a.nirf - b.nirf;
  });

  // Partition into the 3 sections:
  // 1. TOP COLLEGES (GOLD): delta < 0
  // 2. MOST PROBABLE COLLEGES (GREEN): nearest high probability allotment zone
  // 3. EASILY PROBABLE COLLEGES (LIGHT BLUE): safe buffer choices
  let topList = [];
  let probableList = [];
  let easilyList = [];

  let firstEligibleIdx = evaluated.findIndex(c => c.delta >= 0);

  if (firstEligibleIdx === -1) {
    // Candidate rank is very high, all choices are delta < 0
    topList = evaluated.slice(0, Math.max(0, evaluated.length - 8));
    probableList = evaluated.slice(Math.max(0, evaluated.length - 8));
  } else if (firstEligibleIdx === 0) {
    // Candidate rank is very low (e.g. #1 ranker), all choices are delta >= 0
    probableList = evaluated.slice(0, 10);
    easilyList = evaluated.slice(10);
  } else {
    topList = evaluated.slice(0, firstEligibleIdx);
    const endProbableIdx = Math.min(evaluated.length, firstEligibleIdx + 12);
    probableList = evaluated.slice(firstEligibleIdx, endProbableIdx);
    easilyList = evaluated.slice(endProbableIdx);
  }

  // Tag items with colorTheme, section, probabilityBadge, and expectedRound
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
    'Top College (Gold)', 
    isCSAB ? 'High Dream (Beyond CSAB)' : 'High Dream (Beyond Reach)'
  ));

  const finalProbable = probableList.map(item => tagItem(
    item, 
    'PROBABLE', 
    'green', 
    'Most Probable (Green)', 
    isCSAB ? 'Likely CSAB Special Round 1/2' : 'Likely Round 5/6 Allotment'
  ));

  const finalEasily = easilyList.map(item => tagItem(
    item, 
    'EASILY', 
    'light_blue', 
    'Easily Probable (Light Blue)', 
    isCSAB ? 'CSAB Special Confirmed' : 'Likely Round 1/2 Confirmed'
  ));

  // Smart Window:
  // All Top Choices + All Most Probable Choices + Exactly 30 Easily Probable Backups
  const smartEasily = finalEasily.slice(0, 30);
  const smartWindowChoices = [...finalTop, ...finalProbable, ...smartEasily].map((c, i) => ({
    ...c,
    choiceNumber: i + 1
  }));

  const fullRoundChoices = [...finalTop, ...finalProbable, ...finalEasily].map((c, i) => ({
    ...c,
    choiceNumber: i + 1
  }));

  return {
    smartWindowChoices,
    fullRoundChoices,
    topCount: finalTop.length,
    probableCount: finalProbable.length,
    easilyCount: finalEasily.length,
    totalEligibleCount: evaluated.length,
    mostProbableChoices: finalProbable.slice(0, 6),
    mostLikelyChoices: finalProbable.slice(0, 6),
    ambitiousCount: finalTop.length,
    likelyCount: finalProbable.length,
    backupCount: smartEasily.length
  };
}

/**
 * Filter utility for choice list
 */
export function filterChoices(choices, { filterType, branchStream, searchQuery }) {
  if (!choices || !Array.isArray(choices)) return [];
  return choices.filter(choice => {
    if (filterType !== 'ALL' && choice.instituteType !== filterType) {
      return false;
    }

    if (branchStream !== 'ALL') {
      if (branchStream === 'CS_IT' && !['CSE', 'AI_DS', 'IT', 'MNC'].includes(choice.branchCode)) {
        return false;
      }
      if (branchStream === 'ELECTRONICS' && !['ECE', 'EE'].includes(choice.branchCode)) {
        return false;
      }
      if (branchStream === 'CORE_ENG' && !['ME', 'CHE', 'CE', 'AERO'].includes(choice.branchCode)) {
        return false;
      }
      if (branchStream === 'ARCHITECTURE' && !['ARCH', 'PLAN'].includes(choice.branchCode)) {
        return false;
      }
    }

    if (searchQuery && searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase().trim();
      const matchName = choice.instituteName.toLowerCase().includes(q);
      const matchBranch = (choice.programName || choice.branchName || '').toLowerCase().includes(q) || 
                          choice.branchCode.toLowerCase().includes(q);
      const matchState = (choice.state || '').toLowerCase().includes(q);
      const matchCity = (choice.city || '').toLowerCase().includes(q);
      if (!matchName && !matchBranch && !matchState && !matchCity) {
        return false;
      }
    }

    return true;
  });
}
