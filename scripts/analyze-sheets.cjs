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
        institute: rowObj.A,
        program: rowObj.B,
        quota: rowObj.C,
        seatType: rowObj.D,
        gender: rowObj.E,
        openingRank: parseInt(String(rowObj.F).replace(/[^0-9]/g, ''), 10) || 0,
        closingRank: parseInt(String(rowObj.G).replace(/[^0-9]/g, ''), 10) || 0,
        closingRankRaw: rowObj.G
      });
    }
  }
  return rows;
}

const josaaRows = parseSheet(`${path}\\worksheets\\sheet1.xml`);
const csabRows = parseSheet(`${path}\\worksheets\\sheet2.xml`);

console.log('Parsed JoSAA rows:', josaaRows.length);
console.log('Parsed CSAB rows:', csabRows.length);

const josaaInstitutes = new Set(josaaRows.map(r => r.institute));
console.log('JoSAA Unique Institutes:', josaaInstitutes.size);

const csabInstitutes = new Set(csabRows.map(r => r.institute));
console.log('CSAB Unique Institutes:', csabInstitutes.size);

const josaaSeatTypes = new Set(josaaRows.map(r => r.seatType));
console.log('JoSAA Seat Types:', Array.from(josaaSeatTypes));

const csabSeatTypes = new Set(csabRows.map(r => r.seatType));
console.log('CSAB Seat Types:', Array.from(csabSeatTypes));

const josaaQuotas = new Set(josaaRows.map(r => r.quota));
console.log('JoSAA Quotas:', Array.from(josaaQuotas));

const csabQuotas = new Set(csabRows.map(r => r.quota));
console.log('CSAB Quotas:', Array.from(csabQuotas));
