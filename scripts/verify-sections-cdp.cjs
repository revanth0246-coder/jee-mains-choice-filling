const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');

async function main() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const userDataDir = 'C:\\Users\\Raju\\.gemini\\antigravity\\brain\\20845224-7465-4d56-9c11-406ea7005c30\\scratch\\edge_verify_sections';
  if (!fs.existsSync(userDataDir)) {
    fs.mkdirSync(userDataDir, { recursive: true });
  }

  const port = 9557;
  const edge = spawn(edgePath, [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${userDataDir}`,
    '--disable-gpu',
    '--no-sandbox',
    '--window-size=1440,1200',
    'http://localhost:5173'
  ]);

  await new Promise(r => setTimeout(r, 2000));

  const tabs = await new Promise((resolve, reject) => {
    http.get(`http://127.0.0.1:${port}/json/list`, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });

  const page = tabs.find(t => t.url.includes('localhost:5173')) || tabs[0];
  const ws = new WebSocket(page.webSocketDebuggerUrl);

  let id = 1;
  const pending = new Map();

  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    if (msg.id && pending.has(msg.id)) {
      const { resolve } = pending.get(msg.id);
      pending.delete(msg.id);
      resolve(msg.result);
    }
  };

  const send = (method, params = {}) => {
    return new Promise((resolve, reject) => {
      const reqId = id++;
      pending.set(reqId, { resolve, reject });
      ws.send(JSON.stringify({ id: reqId, method, params }));
    });
  };

  await new Promise(r => ws.onopen = r);
  await send('Page.enable');
  await send('DOM.enable');

  const evalJs = async (expr) => {
    const res = await send('Runtime.evaluate', { expression: expr, returnByValue: true });
    return res?.result?.value;
  };

  const takeScreenshot = async (filePath) => {
    const res = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(filePath, Buffer.from(res.data, 'base64'));
    console.log('Saved screenshot:', filePath);
  };

  console.log('--- TEST 1: JoSAA 2026 Choice Sheet with 3 Color-Coded Sections ---');
  // Inject candidate profile for JoSAA
  await evalJs(`
    localStorage.setItem('josaa_has_generated_2026', 'true');
    localStorage.setItem('josaa_candidate_profile_2026', JSON.stringify({
      counselingType: 'JOSAA',
      jeeMainRank: '6500',
      isJeeAdvQualified: true,
      jeeAdvRank: '4500',
      homeState: 'Maharashtra',
      category: 'OPEN',
      genderPool: 'Gender-Neutral',
      preferredBranches: ['ALL']
    }));
    window.location.reload();
  `);

  await new Promise(r => setTimeout(r, 2000));

  // Verify elements on page
  const josaaInfo = await evalJs(`
    (() => {
      const topSection = document.getElementById('section-top-colleges');
      const probableSection = document.getElementById('section-most-probable');
      const easilySection = document.getElementById('section-easily-coming');
      const dataSource = document.querySelector('.text-indigo-300')?.innerText;
      
      const goldRows = document.querySelectorAll('.border-amber-500\\/40').length;
      const greenRows = document.querySelectorAll('.border-emerald-500\\/60').length;
      const blueRows = document.querySelectorAll('.border-sky-500\\/40').length;

      return {
        hasTopSection: !!topSection,
        topText: topSection?.querySelector('h3')?.innerText,
        hasProbableSection: !!probableSection,
        probableText: probableSection?.querySelector('h3')?.innerText,
        hasEasilySection: !!easilySection,
        easilyText: easilySection?.querySelector('h3')?.innerText,
        dataSource,
        goldRows,
        greenRows,
        blueRows
      };
    })()
  `);
  console.log('JoSAA Verification Details:', josaaInfo);

  // Scroll down to show sections and capture screenshot
  await evalJs(`
    const el = document.getElementById('choice-sheet-section');
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
  `);
  await new Promise(r => setTimeout(r, 500));
  await takeScreenshot('C:\\Users\\Raju\\.gemini\\antigravity\\brain\\20845224-7465-4d56-9c11-406ea7005c30\\screenshot_josaa_sections_verified.png');

  console.log('\n--- TEST 2: CSAB 2026 Special Choice Sheet with 3 Color-Coded Sections ---');
  // Inject candidate profile for CSAB
  await evalJs(`
    localStorage.setItem('josaa_has_generated_2026', 'true');
    localStorage.setItem('josaa_candidate_profile_2026', JSON.stringify({
      counselingType: 'CSAB',
      jeeMainRank: '18500',
      isJeeAdvQualified: false,
      jeeAdvRank: '',
      homeState: 'Telangana',
      category: 'OBC-NCL',
      genderPool: 'Gender-Neutral',
      preferredBranches: ['ALL']
    }));
    window.location.reload();
  `);

  await new Promise(r => setTimeout(r, 2000));

  const csabInfo = await evalJs(`
    (() => {
      const topSection = document.getElementById('section-top-colleges');
      const probableSection = document.getElementById('section-most-probable');
      const easilySection = document.getElementById('section-easily-coming');
      const dataSource = document.querySelector('.text-indigo-300')?.innerText;
      
      const goldRows = document.querySelectorAll('.border-amber-500\\/40').length;
      const greenRows = document.querySelectorAll('.border-emerald-500\\/60').length;
      const blueRows = document.querySelectorAll('.border-sky-500\\/40').length;

      return {
        hasTopSection: !!topSection,
        topText: topSection?.querySelector('h3')?.innerText,
        hasProbableSection: !!probableSection,
        probableText: probableSection?.querySelector('h3')?.innerText,
        hasEasilySection: !!easilySection,
        easilyText: easilySection?.querySelector('h3')?.innerText,
        dataSource,
        goldRows,
        greenRows,
        blueRows
      };
    })()
  `);
  console.log('CSAB Verification Details:', csabInfo);

  // Scroll down to show sections and capture screenshot
  await evalJs(`
    const el = document.getElementById('choice-sheet-section');
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
  `);
  await new Promise(r => setTimeout(r, 500));
  await takeScreenshot('C:\\Users\\Raju\\.gemini\\antigravity\\brain\\20845224-7465-4d56-9c11-406ea7005c30\\screenshot_csab_sections_verified.png');

  ws.close();
  edge.kill();
  console.log('Testing completed successfully!');
}

main().catch(console.error);