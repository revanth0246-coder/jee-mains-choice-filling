const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');

async function main() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const userDataDir = 'C:\\Users\\Raju\\.gemini\\antigravity\\brain\\20845224-7465-4d56-9c11-406ea7005c30\\scratch\\edge_bg_theme';
  if (!fs.existsSync(userDataDir)) {
    fs.mkdirSync(userDataDir, { recursive: true });
  }

  const port = 9572;
  const edge = spawn(edgePath, [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${userDataDir}`,
    '--disable-gpu',
    '--no-sandbox',
    '--window-size=1440,1100',
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

  for (let i = 0; i < 20; i++) {
    const btns = await evalJs("document.querySelectorAll('button').length");
    if (btns > 10) break;
    await new Promise(r => setTimeout(r, 250));
  }

  // 1. Reset first to capture pristine Landing Page
  await evalJs(`
    localStorage.clear();
    const btns = Array.from(document.querySelectorAll('button'));
    const startOverBtn = btns.find(btn => btn.innerText.includes('Start Over'));
    if (startOverBtn) startOverBtn.click();
    else location.reload();
  `);
  await new Promise(r => setTimeout(r, 1500));

  const landingScreen = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('C:\\Users\\Raju\\.gemini\\antigravity\\brain\\20845224-7465-4d56-9c11-406ea7005c30\\screenshot_bg_landing.png', Buffer.from(landingScreen.data, 'base64'));
  console.log('Saved pristine landing screenshot.');

  // 2. Click CSAB Special preset
  await evalJs(`
    const btns = Array.from(document.querySelectorAll('button'));
    const b = btns.find(btn => btn.innerText.includes('CSAB Special'));
    if (b) b.click();
  `);
  await new Promise(r => setTimeout(r, 1500));

  // 3. Scroll to top to capture Header + Stats + Table top
  await evalJs(`window.scrollTo(0, 0);`);
  await new Promise(r => setTimeout(r, 500));

  const topOverview = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('C:\\Users\\Raju\\.gemini\\antigravity\\brain\\20845224-7465-4d56-9c11-406ea7005c30\\screenshot_bg_top_overview.png', Buffer.from(topOverview.data, 'base64'));
  console.log('Saved top overview screenshot.');

  // 4. Capture Table and Sidebar on the light canvas
  await evalJs(`
    const el = document.getElementById('choice-sheet-section');
    if (el) window.scrollTo(0, el.offsetTop - 40);
  `);
  await new Promise(r => setTimeout(r, 500));

  const tableCanvas = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('C:\\Users\\Raju\\.gemini\\antigravity\\brain\\20845224-7465-4d56-9c11-406ea7005c30\\screenshot_bg_table_canvas.png', Buffer.from(tableCanvas.data, 'base64'));
  console.log('Saved table canvas screenshot.');

  await send('Browser.close');
  edge.kill();
  console.log('Done capturing.');
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
