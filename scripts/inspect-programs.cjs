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
        institute: rowObj.A.trim(),
        program: rowObj.B ? rowObj.B.trim() : '',
        quota: rowObj.C ? rowObj.C.trim() : '',
        seatType: rowObj.D ? rowObj.D.trim() : '',
        gender: rowObj.E ? rowObj.E.trim() : '',
        closingRank: parseInt(String(rowObj.G).replace(/[^0-9]/g, ''), 10) || 0,
        openingRank: parseInt(String(rowObj.F).replace(/[^0-9]/g, ''), 10) || 0
      });
    }
  }
  return rows;
}

const josaa = parseSheet(`${path}\\worksheets\\sheet1.xml`);
const csab = parseSheet(`${path}\\worksheets\\sheet2.xml`);

const josaaProgMap = new Map();
for (const r of josaa) {
  const key = `${r.institute}|||${r.program}`;
  if (!josaaProgMap.has(key)) josaaProgMap.set(key, []);
  josaaProgMap.get(key).push(r);
}

const csabProgMap = new Map();
for (const r of csab) {
  const key = `${r.institute}|||${r.program}`;
  if (!csabProgMap.has(key)) csabProgMap.set(key, []);
  csabProgMap.get(key).push(r);
}

console.log('JoSAA distinct (Institute + Program):', josaaProgMap.size);
console.log('CSAB distinct (Institute + Program):', csabProgMap.size);

// Print sample program with its cutoff matrix
const sampleKey = Array.from(josaaProgMap.keys())[0];
console.log('\nSample JoSAA program:', sampleKey);
console.log('Cutoffs count for this program:', josaaProgMap.get(sampleKey).length);
console.log(josaaProgMap.get(sampleKey).slice(0, 5));
