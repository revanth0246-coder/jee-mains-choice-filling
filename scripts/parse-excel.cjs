const fs = require('fs');
const path = 'C:\\Users\\Raju\\.gemini\\antigravity\\brain\\20845224-7465-4d56-9c11-406ea7005c30\\scratch\\xlsx_extracted\\xl';

// 1. Read shared strings
const sharedStringsXml = fs.readFileSync(`${path}\\sharedStrings.xml`, 'utf8');
const stringMatches = sharedStringsXml.match(/<si>(.*?)<\/si>/gs) || [];
const sharedStrings = stringMatches.map(si => {
  const tMatches = si.match(/<t[^>]*>(.*?)<\/t>/gs) || [];
  return tMatches.map(t => t.replace(/<t[^>]*>/, '').replace(/<\/t>/, '')).join('');
});

console.log('Total shared strings:', sharedStrings.length);
console.log('First 10 shared strings:', sharedStrings.slice(0, 10));

function parseSheet(sheetXmlPath) {
  const xml = fs.readFileSync(sheetXmlPath, 'utf8');
  const rows = [];
  const rowMatches = xml.match(/<row [^>]*>(.*?)<\/row>/gs) || [];
  
  for (const rXml of rowMatches) {
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
    rows.push(rowObj);
  }
  return rows;
}

const s1Rows = parseSheet(`${path}\\worksheets\\sheet1.xml`);
console.log('Sheet 1 ("jossa 2026") rows:', s1Rows.length);
console.log('Sheet 1 header:', s1Rows[0]);
console.log('Sheet 1 row 1:', s1Rows[1]);
console.log('Sheet 1 row 2:', s1Rows[2]);

const s2Rows = parseSheet(`${path}\\worksheets\\sheet2.xml`);
console.log('Sheet 2 ("csab 2026") rows:', s2Rows.length);
console.log('Sheet 2 header:', s2Rows[0]);
console.log('Sheet 2 row 1:', s2Rows[1]);
console.log('Sheet 2 row 2:', s2Rows[2]);
