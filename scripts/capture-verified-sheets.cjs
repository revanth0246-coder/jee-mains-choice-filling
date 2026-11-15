const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');

async function main() {
  const edge = spawn('C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', [
    '--headless=new', '--remote-debugging-port=9561', '--disable-gpu', '--no-sandbox', '--window-size=1440,1400', 'http://localhost:5173'
  ]);
  await new Promise(r => setTimeout(r, 2500));
  const tabs = await new Promise(res => http.get('http://127.0.0.1:9561/json/list', r => {
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

  // Wait for page
  for (let i = 0; i < 20; i++) {
    const btns = await evalJs("document.querySelectorAll('button').length");
    if (btns > 10) break;
    await new Promise(r => setTimeout(r, 250));
  }

  // 1. JoSAA Test
  console.log('--- CAPTURING JOSAA CHOICE SHEET (Elite IIT + NIT Calicut) ---');
  await evalJs(`
    const btns = Array.from(document.querySelectorAll('button'));
    const b = btns.find(btn => btn.innerText.includes('Elite IIT'));
    if (b) b.click();
  `);
  await new Promise(r => setTimeout(r, 1200));

  // Scroll to Choice Table toolbar and sections
  await evalJs(`
    const el = document.getElementById('choice-sheet-section');
    if (el) {
      window.scrollTo(0, el.offsetTop - 70);
    }
  `);
  await new Promise(r => setTimeout(r, 600));

  await takeScreenshot('C:\\Users\\Raju\\.gemini\\antigravity\\brain\\20845224-7465-4d56-9c11-406ea7005c30\\screenshot_josaa_3sections_verified.png');

  // Scroll to Green and Blue sections in JoSAA
  await evalJs(`
    const el = document.getElementById('section-most-probable');
    if (el) {
      window.scrollTo(0, el.offsetTop - 80);
    }
  `);
  await new Promise(r => setTimeout(r, 600));
  await takeScreenshot('C:\\Users\\Raju\\.gemini\\antigravity\\brain\\20845224-7465-4d56-9c11-406ea7005c30\\screenshot_josaa_probable_green_verified.png');

  // 2. CSAB Test
  console.log('\n--- CAPTURING CSAB CHOICE SHEET (CSAB Special Round 1/2) ---');
  await evalJs(`window.scrollTo(0, 0);`);
  await new Promise(r => setTimeout(r, 300));
  await evalJs(`
    const btns = Array.from(document.querySelectorAll('button'));
    const b = btns.find(btn => btn.innerText.includes('CSAB Special'));
    if (b) b.click();
  `);
  await new Promise(r => setTimeout(r, 1200));

  // Scroll to Choice Table toolbar and sections
  await evalJs(`
    const el = document.getElementById('choice-sheet-section');
    if (el) {
      window.scrollTo(0, el.offsetTop - 70);
    }
  `);
  await new Promise(r => setTimeout(r, 600));

  const csabDetails = await evalJs(`
    (() => {
      const topSec = document.getElementById('section-top-colleges');
      const probSec = document.getElementById('section-most-probable');
      const easySec = document.getElementById('section-easily-coming');
      return {
        topTitle: topSec?.querySelector('h3')?.innerText,
        topCount: topSec?.querySelectorAll('.group')?.length,
        probTitle: probSec?.querySelector('h3')?.innerText,
        probCount: probSec?.querySelectorAll('.group')?.length,
        easyTitle: easySec?.querySelector('h3')?.innerText,
        easyCount: easySec?.querySelectorAll('.group')?.length,
        dataSource: document.querySelector('.text-indigo-300')?.innerText
      };
    })()
  `);
  console.log('CSAB Details:', csabDetails);

  await takeScreenshot('C:\\Users\\Raju\\.gemini\\antigravity\\brain\\20845224-7465-4d56-9c11-406ea7005c30\\screenshot_csab_3sections_verified.png');

  // Scroll to Green and Blue sections in CSAB
  await evalJs(`
    const el = document.getElementById('section-most-probable');
    if (el) {
      window.scrollTo(0, el.offsetTop - 80);
    }
  `);
  await new Promise(r => setTimeout(r, 600));
  await takeScreenshot('C:\\Users\\Raju\\.gemini\\antigravity\\brain\\20845224-7465-4d56-9c11-406ea7005c30\\screenshot_csab_probable_green_verified.png');

  ws.close();
  edge.kill();
  console.log('All screenshots captured successfully!');
}

main().catch(console.error);