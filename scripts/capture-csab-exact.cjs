const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');

async function main() {
  const edge = spawn('C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', [
    '--headless=new', '--remote-debugging-port=9562', '--disable-gpu', '--no-sandbox', '--window-size=1440,1400', 'http://localhost:5173'
  ]);
  await new Promise(r => setTimeout(r, 2500));
  const tabs = await new Promise(res => http.get('http://127.0.0.1:9562/json/list', r => {
    let d=''; r.on('data', c=>d+=c); r.on('end', ()=>res(JSON.parse(d)));
  }));
  const pageTab = tabs.find(t => t.url.includes('5173')) || tabs[0];
  const ws = new WebSocket(pageTab.webSocketDebuggerUrl);
  let id = 1; const pending = new Map();
  ws.onmessage = e => { const m = JSON.parse(e.data); if (m.id && pending.has(m.id)) pending.get(m.id)(m.result); };
  const send = (method, params = {}) => new Promise(res => { const reqId = id++; pending.set(reqId, res); ws.send(JSON.stringify({ id: reqId, method, params })); });
  await new Promise(r => ws.onopen = r);
  await send('Page.enable');
  await send('DOM.enable');

  const evalJs = async (expr) => {
    const res = await send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true });
    return res?.result?.value;
  };

  const takeScreenshot = async (filePath) => {
    const res = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(filePath, Buffer.from(res.data, 'base64'));
    console.log('Saved screenshot:', filePath);
  };

  // Wait for buttons
  for (let i = 0; i < 20; i++) {
    const btns = await evalJs("document.querySelectorAll('button').length");
    if (btns > 10) break;
    await new Promise(r => setTimeout(r, 250));
  }

  // Set CSAB Special candidate directly in localStorage and reload
  console.log('Applying CSAB Special Profile (CRL 38,500, Telangana HS, OPEN)...');
  await evalJs(`
    localStorage.setItem('josaa_has_generated_2026', 'true');
    localStorage.setItem('josaa_candidate_profile_2026', JSON.stringify({
      counselingType: 'CSAB',
      jeeMainRank: '38500',
      isJeeAdvQualified: false,
      jeeAdvRank: '',
      homeState: 'Telangana',
      category: 'OPEN',
      genderPool: 'Gender-Neutral',
      preferredBranches: ['ALL']
    }));
    window.location.reload();
  `);

  await new Promise(r => setTimeout(r, 2500));

  // 1. Capture CSAB Top Table View
  await evalJs(`
    const el = document.getElementById('choice-sheet-section');
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
  `);
  await new Promise(r => setTimeout(r, 600));

  const csabTopInfo = await evalJs(`
    ({
      title: document.querySelector('#choice-sheet-section h2')?.innerText,
      dataSource: document.querySelector('.text-indigo-300')?.innerText,
      topCount: document.getElementById('section-top-colleges')?.querySelectorAll('.group')?.length,
      probCount: document.getElementById('section-most-probable')?.querySelectorAll('.group')?.length,
      easyCount: document.getElementById('section-easily-coming')?.querySelectorAll('.group')?.length
    })
  `);
  console.log('CSAB Top View Info:', csabTopInfo);
  await takeScreenshot('C:\\Users\\Raju\\.gemini\\antigravity\\brain\\20845224-7465-4d56-9c11-406ea7005c30\\screenshot_csab_choice_sheet.png');

  // 2. Scroll directly to Section 2: Most Probable (GREEN) and Section 3 (LIGHT BLUE)
  console.log('Scrolling to CSAB Most Probable (GREEN) section...');
  await evalJs(`
    const el = document.getElementById('section-most-probable');
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
  `);
  await new Promise(r => setTimeout(r, 600));
  await takeScreenshot('C:\\Users\\Raju\\.gemini\\antigravity\\brain\\20845224-7465-4d56-9c11-406ea7005c30\\screenshot_csab_green_section.png');

  // 3. Scroll directly to Section 3: Easily Coming (LIGHT BLUE)
  console.log('Scrolling to CSAB Easily Coming (LIGHT BLUE) section...');
  await evalJs(`
    const el = document.getElementById('section-easily-coming');
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
  `);
  await new Promise(r => setTimeout(r, 600));
  await takeScreenshot('C:\\Users\\Raju\\.gemini\\antigravity\\brain\\20845224-7465-4d56-9c11-406ea7005c30\\screenshot_csab_blue_section.png');

  // 4. Now do the same for JoSAA to capture its Green & Light Blue sections
  console.log('\nApplying JoSAA Profile (Main 4200, Adv 3400, Kerala HS, OPEN)...');
  await evalJs(`
    localStorage.setItem('josaa_has_generated_2026', 'true');
    localStorage.setItem('josaa_candidate_profile_2026', JSON.stringify({
      counselingType: 'JOSAA',
      jeeMainRank: '4200',
      isJeeAdvQualified: true,
      jeeAdvRank: '3400',
      homeState: 'Kerala',
      category: 'OPEN',
      genderPool: 'Gender-Neutral',
      preferredBranches: ['ALL']
    }));
    window.location.reload();
  `);

  await new Promise(r => setTimeout(r, 2500));

  // Scroll to Green section in JoSAA
  console.log('Scrolling to JoSAA Most Probable (GREEN) section...');
  await evalJs(`
    const el = document.getElementById('section-most-probable');
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
  `);
  await new Promise(r => setTimeout(r, 600));
  await takeScreenshot('C:\\Users\\Raju\\.gemini\\antigravity\\brain\\20845224-7465-4d56-9c11-406ea7005c30\\screenshot_josaa_green_section.png');

  // Scroll to Light Blue section in JoSAA
  console.log('Scrolling to JoSAA Easily Coming (LIGHT BLUE) section...');
  await evalJs(`
    const el = document.getElementById('section-easily-coming');
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
  `);
  await new Promise(r => setTimeout(r, 600));
  await takeScreenshot('C:\\Users\\Raju\\.gemini\\antigravity\\brain\\20845224-7465-4d56-9c11-406ea7005c30\\screenshot_josaa_blue_section.png');

  ws.close();
  edge.kill();
  console.log('All detailed section screenshots captured successfully!');
}

main().catch(console.error);