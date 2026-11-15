const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');

async function main() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const userDataDir = 'C:\\Users\\Raju\\.gemini\\antigravity\\brain\\20845224-7465-4d56-9c11-406ea7005c30\\scratch\\edge_capture_borders';
  if (!fs.existsSync(userDataDir)) {
    fs.mkdirSync(userDataDir, { recursive: true });
  }

  const port = 9571;
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

  for (let i = 0; i < 20; i++) {
    const btns = await evalJs("document.querySelectorAll('button').length");
    if (btns > 10) break;
    await new Promise(r => setTimeout(r, 250));
  }

  // Click CSAB preset
  await evalJs(`
    const btns = Array.from(document.querySelectorAll('button'));
    const b = btns.find(btn => btn.innerText.includes('CSAB Special'));
    if (b) b.click();
  `);
  await new Promise(r => setTimeout(r, 1200));

  // Get exact bounding rects
  const rects = await evalJs(`
    (() => {
      const gold = document.getElementById('section-top-colleges');
      const green = document.getElementById('section-most-probable');
      const blue = document.getElementById('section-easily-coming');
      const gY = gold ? gold.getBoundingClientRect().top + window.scrollY : 0;
      const grY = green ? green.getBoundingClientRect().top + window.scrollY : 0;
      const bY = blue ? blue.getBoundingClientRect().top + window.scrollY : 0;
      return { gY, grY, bY };
    })()
  `);
  console.log('Section Y coordinates:', rects);

  // Capture Gold Section
  if (rects.gY) {
    const clip = await send('Page.captureScreenshot', {
      format: 'png',
      clip: { x: 0, y: Math.max(0, rects.gY - 20), width: 1440, height: 900, scale: 1 },
      captureBeyondViewport: true
    });
    fs.writeFileSync('C:\\Users\\Raju\\.gemini\\antigravity\\brain\\20845224-7465-4d56-9c11-406ea7005c30\\screenshot_gold_border_clipped.png', Buffer.from(clip.data, 'base64'));
    console.log('Saved screenshot_gold_border_clipped.png');
  }

  // Capture Green Section
  if (rects.grY) {
    const clip = await send('Page.captureScreenshot', {
      format: 'png',
      clip: { x: 0, y: Math.max(0, rects.grY - 20), width: 1440, height: 900, scale: 1 },
      captureBeyondViewport: true
    });
    fs.writeFileSync('C:\\Users\\Raju\\.gemini\\antigravity\\brain\\20845224-7465-4d56-9c11-406ea7005c30\\screenshot_green_border_clipped.png', Buffer.from(clip.data, 'base64'));
    console.log('Saved screenshot_green_border_clipped.png');
  }

  // Capture Blue Section
  if (rects.bY) {
    const clip = await send('Page.captureScreenshot', {
      format: 'png',
      clip: { x: 0, y: Math.max(0, rects.bY - 20), width: 1440, height: 900, scale: 1 },
      captureBeyondViewport: true
    });
    fs.writeFileSync('C:\\Users\\Raju\\.gemini\\antigravity\\brain\\20845224-7465-4d56-9c11-406ea7005c30\\screenshot_blue_border_clipped.png', Buffer.from(clip.data, 'base64'));
    console.log('Saved screenshot_blue_border_clipped.png');
  }

  ws.close();
  edge.kill();
  console.log('Done!');
}

main().catch(console.error);