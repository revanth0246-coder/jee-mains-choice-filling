const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');

async function main() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const userDataDir = 'C:\\Users\\Raju\\.gemini\\antigravity\\brain\\20845224-7465-4d56-9c11-406ea7005c30\\scratch\\edge_verify_theme';
  if (!fs.existsSync(userDataDir)) {
    fs.mkdirSync(userDataDir, { recursive: true });
  }

  const port = 9570;
  const edge = spawn(edgePath, [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${userDataDir}`,
    '--disable-gpu',
    '--no-sandbox',
    '--window-size=1440,1200',
    'http://localhost:5173'
  ]);

  await new Promise(r => setTimeout(r, 2500));

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

  // Set candidate profile matching user screenshot: CSAB, CRL 38291, OBC-NCL, Telangana
  console.log('Setting candidate profile matching user screenshot (CRL 38,291)...');
  await evalJs(`
    const btns = Array.from(document.querySelectorAll('button'));
    const b = btns.find(btn => btn.innerText.includes('CSAB Special'));
    if (b) b.click();
  `);
  await new Promise(r => setTimeout(r, 1200));

  // 1. Capture Top Overview: Title + 4 White Stats Cards + Top of Choice Table
  console.log('Capturing Top Overview...');
  await evalJs(`
    const el = document.getElementById('stats-summary-bar');
    if (el) window.scrollTo(0, el.offsetTop - 110);
  `);
  await new Promise(r => setTimeout(r, 600));
  await takeScreenshot('C:\\Users\\Raju\\.gemini\\antigravity\\brain\\20845224-7465-4d56-9c11-406ea7005c30\\screenshot_theme_top_overview.png');

  // 2. Scroll to and capture Section 1: Top Colleges (Dream) - Gold Top Border
  console.log('Capturing Section 1 (Gold Top Border)...');
  await evalJs(`
    const el = document.getElementById('section-top-colleges');
    if (el) window.scrollTo(0, el.offsetTop - 80);
  `);
  await new Promise(r => setTimeout(r, 600));
  await takeScreenshot('C:\\Users\\Raju\\.gemini\\antigravity\\brain\\20845224-7465-4d56-9c11-406ea7005c30\\screenshot_gold_dream_section.png');

  // 3. Scroll to and capture Section 2: Most Probable - Emerald Green Top Border
  console.log('Capturing Section 2 (Emerald Green Top Border)...');
  await evalJs(`
    const el = document.getElementById('section-most-probable');
    if (el) window.scrollTo(0, el.offsetTop - 80);
  `);
  await new Promise(r => setTimeout(r, 600));
  await takeScreenshot('C:\\Users\\Raju\\.gemini\\antigravity\\brain\\20845224-7465-4d56-9c11-406ea7005c30\\screenshot_green_probable_section.png');

  // 4. Scroll to and capture Section 3: Easily Coming (Safe) - Sky Blue Top Border
  console.log('Capturing Section 3 (Sky Blue Top Border)...');
  await evalJs(`
    const el = document.getElementById('section-easily-coming');
    if (el) window.scrollTo(0, el.offsetTop - 80);
  `);
  await new Promise(r => setTimeout(r, 600));
  await takeScreenshot('C:\\Users\\Raju\\.gemini\\antigravity\\brain\\20845224-7465-4d56-9c11-406ea7005c30\\screenshot_blue_safe_section.png');

  ws.close();
  edge.kill();
  console.log('All theme verification screenshots captured successfully!');
}

main().catch(console.error);