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
  return 'Other';
}

function groupIntoPrograms(rows) {
  const progMap = new Map();
  for (const r of rows) {
    const key = `${r.inst}|||${r.prog}`;
    if (!progMap.has(key)) {
      const instType = getInstType(r.inst);
      const branchCode = getBranchCode(r.prog);
      const state = getStateFromInst(r.inst);
      progMap.set(key, {
        id: key,
        instituteName: r.inst,
        programName: r.prog,
        instituteType: instType,
        branchCode,
        state,
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

const s1Size = (fs.statSync(`${outDir}\\josaaSheetData.json`).size / 1024).toFixed(1);
const s2Size = (fs.statSync(`${outDir}\\csabSheetData.json`).size / 1024).toFixed(1);
console.log(`Saved josaaSheetData.json (${s1Size} KB) and csabSheetData.json (${s2Size} KB)!`);
