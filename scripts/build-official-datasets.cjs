const fs = require('fs');
const path = 'C:\\Users\\Raju\\.gemini\\antigravity\\brain\\20845224-7465-4d56-9c11-406ea7005c30\\scratch\\xlsx_extracted\\xl';

const sharedStringsXml = fs.readFileSync(`${path}\\sharedStrings.xml`, 'utf8');
const stringMatches = sharedStringsXml.match(/<si>(.*?)<\/si>/gs) || [];
const sharedStrings = stringMatches.map(si => {
  const tMatches = si.match(/<t[^>]*>(.*?)<\/t>/gs) || [];
  return tMatches.map(t => t.replace(/<t[^>]*>/, '').replace(/<\/t>/, '')).join('');
});

function parseSheet(sheetXmlPath) {
  const xml = fs.readFileSync(sheetXmlPath, 'utf8');
  const rows = [];
  const rowMatches = xml.match(/<row [^>]*>(.*?)<\/row>/gs) || [];
  
  for (let i = 1; i < rowMatches.length; i++) {
    const rXml = rowMatches[i];
    const rowObj = {};
    const cMatches = rXml.match(/<c [^>]*>(.*?)<\/c>|<c [^>]*\/>/gs) || [];
    for (const cXml of cMatches) {
      const rAttr = cXml.match(/r="([A-Z]+)(\d+)"/);
      if (!rAttr) continue;
      const col = rAttr[1];
      const isString = cXml.includes('t="s"');
      const vMatch = cXml.match(/<v>(.*?)<\/v>/);
      if (vMatch) {
        const val = vMatch[1];
        rowObj[col] = isString ? sharedStrings[parseInt(val, 10)] : val;
      }
    }
    if (rowObj.A) {
      rows.push({
        inst: rowObj.A.trim(),
        prog: rowObj.B ? rowObj.B.trim() : '',
        quota: rowObj.C ? rowObj.C.trim() : '',
        seat: rowObj.D ? rowObj.D.trim() : '',
        gender: rowObj.E ? rowObj.E.trim() : '',
        cr: parseInt(String(rowObj.G).replace(/[^0-9]/g, ''), 10) || 0,
        op: parseInt(String(rowObj.F).replace(/[^0-9]/g, ''), 10) || 0
      });
    }
  }
  return rows;
}

// NIRF map
const NIRF_MAP = {
  'Indian Institute of Technology Madras': 1,
  'Indian Institute of Technology Delhi': 2,
  'Indian Institute of Technology Bombay': 3,
  'Indian Institute of Technology Kanpur': 4,
  'Indian Institute of Technology Roorkee': 5,
  'Indian Institute of Technology Kharagpur': 6,
  'Indian Institute of Technology Guwahati': 7,
  'Indian Institute of Technology Hyderabad': 8,
  'National Institute of Technology, Tiruchirappalli': 9,
  'Indian Institute of Technology (BHU) Varanasi': 10,
  'National Institute of Technology Karnataka, Surathkal': 12,
  'Indian Institute of Technology (ISM) Dhanbad': 14,
  'National Institute of Technology, Rourkela': 16,
  'Indian Institute of Technology Indore': 17,
  'Indian Institute of Technology Gandhinagar': 18,
  'National Institute of Technology Calicut': 23,
  'Indian Institute of Technology Ropar': 22,
  'Indian Institute of Technology Bhubaneswar': 27,
  'Indian Institute of Technology Patna': 41,
  'Indian Institute of Technology Mandi': 33,
  'Indian Institute of Technology Jodhpur': 30,
  'Malaviya National Institute of Technology Jaipur': 37,
  'Motilal Nehru National Institute of Technology Allahabad': 49,
  'National Institute of Technology Silchar': 40,
  'National Institute of Technology Durgapur': 43,
  'National Institute of Technology Delhi': 51,
  'Visvesvaraya National Institute of Technology, Nagpur': 41,
  'Sardar Vallabhbhai National Institute of Technology, Surat': 65,
  'Dr. B R Ambedkar National Institute of Technology, Jalandhar': 46,
  'Maulana Azad National Institute of Technology Bhopal': 80,
  'National Institute of Technology, Jamshedpur': 90,
  'National Institute of Technology, Kurukshetra': 83,
  'Indian Institute of Engineering Science and Technology, Shibpur': 35,
  'Indian Institute of Information Technology, Allahabad': 89,
  'Atal Bihari Vajpayee Indian Institute of Information Technology & Management Gwalior': 88,
  'Punjab Engineering College, Chandigarh': 87,
  'Birla Institute of Technology, Mesra, Ranchi': 53,
  'School of Planning & Architecture, New Delhi': 5,
  'School of Planning & Architecture, Bhopal': 11,
  'School of Planning & Architecture: Vijayawada': 18
};

function getBranchCode(progName) {
  const p = progName.toLowerCase();
  if (p.includes('computer science') || p.includes('cse') || p.includes('computer engineering')) return 'CSE';
  if (p.includes('artificial intelligence') || p.includes('data science') || p.includes('ai') || p.includes('machine learning')) return 'AI_DS';
  if (p.includes('information technology') || p.includes('it- bin') || p.includes('business informatics')) return 'IT';
  if (p.includes('mathematics') || p.includes('computing')) return 'MNC';
  if (p.includes('electronics and communication') || p.includes('ece') || p.includes('telecommunication') || p.includes('vlsi') || p.includes('electronic engineering')) return 'ECE';
  if (p.includes('electrical') || p.includes('eee') || p.includes('e mobility') || p.includes('electric mobility')) return 'EE';
  if (p.includes('mechanical') || p.includes('mechatronics') || p.includes('manufacturing') || p.includes('production') || p.includes('robotics')) return 'ME';
  if (p.includes('chemical') || p.includes('biochemical') || p.includes('petroleum')) return 'CHE';
  if (p.includes('civil') || p.includes('infrastructure') || p.includes('environmental')) return 'CE';
  if (p.includes('aerospace') || p.includes('aviation') || p.includes('aeronautical') || p.includes('avionics')) return 'AERO';
  if (p.includes('architecture') || p.includes('b.arch')) return 'ARCH';
  if (p.includes('planning') || p.includes('b.plan')) return 'PLAN';
  return 'OTHER';
}

function getInstType(name) {
  if (name.includes('Indian Institute of Technology') || name.includes('IIT ') || name === 'Indian Institute of Science, Bangalore') return 'IIT';
  if (name.includes('National Institute of Technology') || name.includes('IIEST')) return 'NIT';
  if (name.includes('Indian Institute of Information Technology') || name.includes('IIIT')) return 'IIIT';
  return 'GFTI';
}

function getStateFromInst(name) {
  const n = name.toLowerCase();
  if (n.includes('bhubaneswar') || n.includes('rourkela') || n.includes('odisha')) return 'Odisha';
  if (n.includes('bombay') || n.includes('nagpur') || n.includes('pune') || n.includes('aurangabad') || n.includes('maharashtra')) return 'Maharashtra';
  if (n.includes('delhi')) return 'Delhi';
  if (n.includes('kharagpur') || n.includes('shibpur') || n.includes('kalyani') || n.includes('malda') || n.includes('west bengal')) return 'West Bengal';
  if (n.includes('kanpur') || n.includes('allahabad') || n.includes('varanasi') || n.includes('lucknow') || n.includes('bhadohi') || n.includes('gorakhpur') || n.includes('amethi')) return 'Uttar Pradesh';
  if (n.includes('madras') || n.includes('tiruchirappalli') || n.includes('trichy') || n.includes('salem') || n.includes('kancheepuram') || n.includes('thanjavur')) return 'Tamil Nadu';
  if (n.includes('roorkee') || n.includes('haridwar') || n.includes('uttarakhand')) return 'Uttarakhand';
  if (n.includes('guwahati') || n.includes('silchar') || n.includes('tezpur') || n.includes('kokrajar') || n.includes('assam')) return 'Assam';
  if (n.includes('hyderabad') || n.includes('warangal') || n.includes('telangana')) return 'Telangana';
  if (n.includes('surat') || n.includes('gandhinagar') || n.includes('vadodara') || n.includes('ahmedabad') || n.includes('gujarat') || n.includes('gujrat')) return 'Gujarat';
  if (n.includes('indore') || n.includes('bhopal') || n.includes('gwalior') || n.includes('jabalpur') || n.includes('sagar') || n.includes('madhya pradesh')) return 'Madhya Pradesh';
  if (n.includes('jaipur') || n.includes('jodhpur') || n.includes('kota') || n.includes('ajmer') || n.includes('rajasthan')) return 'Rajasthan';
  if (n.includes('patna') || n.includes('bhagalpur') || n.includes('bihar')) return 'Bihar';
  if (n.includes('dhanbad') || n.includes('jamshedpur') || n.includes('ranchi') || n.includes('deoghar') || n.includes('jharkhand')) return 'Jharkhand';
  if (n.includes('ropar') || n.includes('jalandhar') || n.includes('bathinda') || n.includes('longowal') || n.includes('punjab')) return 'Punjab';
  if (n.includes('chandigarh')) return 'Chandigarh';
  if (n.includes('kurukshetra') || n.includes('sonepat') || n.includes('kundli') || n.includes('haryana')) return 'Haryana';
  if (n.includes('surathkal') || n.includes('dharwad') || n.includes('raichur') || n.includes('karnataka') || n.includes('bangalore')) return 'Karnataka';
  if (n.includes('calicut') || n.includes('palakkad') || n.includes('kottayam') || n.includes('kerala')) return 'Kerala';
  if (n.includes('tirupati') || n.includes('kurnool') || n.includes('chittoor') || n.includes('vijayawada') || n.includes('andhra pradesh')) return 'Andhra Pradesh';
  if (n.includes('goa')) return 'Goa';
  if (n.includes('mandi') || n.includes('hamirpur') || n.includes('una') || n.includes('himachal')) return 'Himachal Pradesh';
  if (n.includes('jammu') || n.includes('srinagar') || n.includes('katra') || n.includes('kashmir')) return 'Jammu & Kashmir';
  if (n.includes('bhilai') || n.includes('raipur') || n.includes('bilaspur') || n.includes('chhattisgarh')) return 'Chhattisgarh';
  if (n.includes('agartala') || n.includes('tripura')) return 'Tripura';
  if (n.includes('manipur') || n.includes('imphal')) return 'Manipur';
  if (n.includes('meghalaya') || n.includes('shillong')) return 'Meghalaya';
  if (n.includes('mizoram') || n.includes('aizawl')) return 'Mizoram';
  if (n.includes('nagaland') || n.includes('kohima')) return 'Nagaland';
  if (n.includes('sikkim')) return 'Sikkim';
  if (n.includes('arunachal') || n.includes('itanagar') || n.includes('nirjuli')) return 'Arunachal Pradesh';
  if (n.includes('puducherry')) return 'Puducherry';
  if (n.includes('diu')) return 'Dadra & Nagar Haveli and Daman & Diu';
  return 'All India';
}

function getCTC(instType, branchCode) {
  let base = 16.0;
  let peak = 45.0;
  if (instType === 'IIT') { base = 24.0; peak = 75.0; }
  else if (instType === 'NIT') { base = 18.0; peak = 52.0; }
  else if (instType === 'IIIT') { base = 19.5; peak = 54.0; }
  else { base = 13.0; peak = 38.0; }

  if (['CSE', 'AI_DS', 'IT', 'MNC'].includes(branchCode)) {
    base = parseFloat((base * 1.35).toFixed(1));
    peak = parseFloat((peak * 1.3).toFixed(1));
  } else if (['ECE', 'EE'].includes(branchCode)) {
    base = parseFloat((base * 1.1).toFixed(1));
    peak = parseFloat((peak * 1.1).toFixed(1));
  } else if (['ME', 'CHE', 'AERO'].includes(branchCode)) {
    base = parseFloat((base * 0.9).toFixed(1));
    peak = parseFloat((peak * 0.9).toFixed(1));
  } else {
    base = parseFloat((base * 0.75).toFixed(1));
    peak = parseFloat((peak * 0.75).toFixed(1));
  }
  return { medianCTC: base, highestCTC: peak };
}

function groupIntoPrograms(rows) {
  const progMap = new Map();
  let idCounter = 1;
  for (const r of rows) {
    const key = `${r.inst}|||${r.prog}`;
    if (!progMap.has(key)) {
      const instType = getInstType(r.inst);
      const branchCode = getBranchCode(r.prog);
      const state = getStateFromInst(r.inst);
      const ctc = getCTC(instType, branchCode);
      const nirf = NIRF_MAP[r.inst] || (instType === 'IIT' ? 25 : instType === 'NIT' ? 55 : instType === 'IIIT' ? 85 : 120);

      progMap.set(key, {
        id: `PROG-${idCounter++}`,
        instituteName: r.inst,
        programName: r.prog,
        instituteType: instType,
        branchCode,
        state,
        city: r.inst.split(',')[1]?.trim() || state,
        nirf,
        medianCTC: ctc.medianCTC,
        highestCTC: ctc.highestCTC,
        examRequired: instType === 'IIT' ? 'JEE_ADV' : 'JEE_MAIN',
        cutoffs: []
      });
    }
    progMap.get(key).cutoffs.push({
      q: r.quota,
      s: r.seat,
      g: r.gender,
      cr: r.cr,
      op: r.op
    });
  }
  return Array.from(progMap.values());
}

const josaaRows = parseSheet(`${path}\\worksheets\\sheet1.xml`);
const csabRows = parseSheet(`${path}\\worksheets\\sheet2.xml`);

const josaaProgs = groupIntoPrograms(josaaRows);
const csabProgs = groupIntoPrograms(csabRows);

console.log('Processed JoSAA programs:', josaaProgs.length);
console.log('Processed CSAB programs:', csabProgs.length);

const outDir = 'C:\\Users\\Raju\\OneDrive\\Desktop\\jossa app\\src\\data';
fs.writeFileSync(`${outDir}\\josaaSheetData.json`, JSON.stringify(josaaProgs));
fs.writeFileSync(`${outDir}\\csabSheetData.json`, JSON.stringify(csabProgs));

console.log('Successfully written official josaaSheetData.json and csabSheetData.json!');
