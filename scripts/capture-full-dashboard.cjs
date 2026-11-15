const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');

async function main() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const userDataDir = 'C:\\Users\\Raju\\.gemini\\antigravity\\brain\\20845224-7465-4d56-9c11-406ea7005c30\\scratch\\edge_full_dash';
  if (!fs.existsSync(userDataDir)) {
    fs.mkdirSync(userDataDir, { recursive: true });
  }

  const port = 9558;
  const edge = spawn(edgePath, [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${userDataDir}`,
    '--disable-gpu',
    '--no-sandbox',
    '--window-size=1440,1600',
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
    const res = await send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true });
    return res?.result?.value;
  };

  console.log('1. Clicking preset: Elite IIT + NIT Calicut (JoSAA)');
  await evalJs(`
    const btns = Array.from(document.querySelectorAll('button'));
    const p = btns.find(b => b.innerText.includes('Elite IIT'));
    if (p) p.click();
  `);
  await new Promise(r => setTimeout(r, 1200));

  // Scroll directly into choice-sheet-section
  await evalJs(`
    const el = document.getElementById('choice-sheet-section');
    if (el) {
      window.scrollTo(0, el.offsetTop - 80);
    }
  `);
  await new Promise(r => setTimeout(r, 800));

  const josaaCounts = await evalJs(`
    ({
      topSection: !!document.getElementById('section-top-colleges'),
      probableSection: !!document.getElementById('section-most-probable'),
      easilySection: !!document.getElementById('section-easily-coming'),
      topTitle: document.getElementById('section-top-colleges')?.querySelector('h3')?.innerText,
      probableTitle: document.getElementById('section-most-probable')?.querySelector('h3')?.innerText,
      easilyTitle: document.getElementById('section-easily-coming')?.querySelector('h3')?.innerText,
      dataSourceText: document.querySelector('.text-indigo-300')?.innerText
    })
  `);
  console.log('JoSAA Verification:', josaaCounts);

  const res1 = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('C:\\Users\\Raju\\.gemini\\antigravity\\brain\\20845224-7465-4d56-9c11-406ea7005c30\\screenshot_josaa_3sections.png', Buffer.from(res1.data, 'base64'));
  console.log('Saved JoSAA screenshot');

  console.log('2. Clicking preset: CSAB Special Round 1/2');
  // Scroll to top
  await evalJs(`window.scrollTo(0, 0);`);
  await new Promise(r => setTimeout(r, 300));
  await evalJs(`
    const btns = Array.from(document.querySelectorAll('button'));
    const p = btns.find(b => b.innerText.includes('CSAB Special'));
    if (p) p.click();
  `);
  await new Promise(r => setTimeout(r, 1200));

  // Scroll to choice sheet
  await evalJs(`
    const el = document.getElementById('choice-sheet-section');
    if (el) {
      window.scrollTo(0, el.offsetTop - 80);
    }
  `);
  await new Promise(r => setTimeout(r, 800));

  const csabCounts = await evalJs(`
    ({
      topSection: !!document.getElementById('section-top-colleges'),
      probableSection: !!document.getElementById('section-most-probable'),
      easilySection: !!document.getElementById('section-easily-coming'),
      topTitle: document.getElementById('section-top-colleges')?.querySelector('h3')?.innerText,
      probableTitle: document.getElementById('section-most-probable')?.querySelector('h3')?.innerText,
      easilyTitle: document.getElementById('section-easily-coming')?.querySelector('h3')?.innerText,
      dataSourceText: document.querySelector('.text-indigo-300')?.innerText
    })
  `);
  console.log('CSAB Verification:', csabCounts);

  const res2 = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('C:\\Users\\Raju\\.gemini\\antigravity\\brain\\20845224-7465-4d56-9c11-406ea7005c30\\screenshot_csab_3sections.png', Buffer.from(res2.data, 'base64'));
  console.log('Saved CSAB screenshot');

  ws.close();
  edge.kill();
  console.log('Verification completed successfully!');
}

main().catch(console.error);