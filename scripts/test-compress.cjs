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

const josaaRows = parseSheet(`${path}\\worksheets\\sheet1.xml`);
const csabRows = parseSheet(`${path}\\worksheets\\sheet2.xml`);

console.log('Sample JoSAA row:', josaaRows[0]);
console.log('Sample CSAB row:', csabRows[0]);
