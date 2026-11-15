const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');

async function main() {
  const edge = spawn('C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', [
    '--headless=new', '--remote-debugging-port=9563', '--disable-gpu', '--no-sandbox', '--window-size=1440,1400', 'http://localhost:5173'
  ]);
  await new Promise(r => setTimeout(r, 2000));
  const tabs = await new Promise(res => http.get('http://127.0.0.1:9563/json/list', r => {
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

  // JoSAA profile
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
  await new Promise(r => setTimeout(r, 2000));

  // Get bounding client rects of sections
  const rects = await evalJs(`
    (() => {
      const green = document.getElementById('section-most-probable');
      const blue = document.getElementById('section-easily-coming');
      const gRect = green ? green.getBoundingClientRect() : null;
      const bRect = blue ? blue.getBoundingClientRect() : null;
      return {
        scrollY: window.scrollY,
        greenY: gRect ? gRect.top + window.scrollY : null,
        greenHeight: gRect ? gRect.height : null,
        blueY: bRect ? bRect.top + window.scrollY : null,
        blueHeight: bRect ? bRect.height : null
      };
    })()
  `);
  console.log('Section Rectangles:', rects);

  // Capture screenshot of the Green section directly by clip
  if (rects.greenY) {
    const clipRes = await send('Page.captureScreenshot', {
      format: 'png',
      clip: {
        x: 0,
        y: Math.max(0, rects.greenY - 20),
        width: 1440,
        height: 1100,
        scale: 1
      },
      captureBeyondViewport: true
    });
    fs.writeFileSync('C:\\Users\\Raju\\.gemini\\antigravity\\brain\\20845224-7465-4d56-9c11-406ea7005c30\\screenshot_josaa_green_clipped.png', Buffer.from(clipRes.data, 'base64'));
    console.log('Saved screenshot_josaa_green_clipped.png');
  }

  // Capture screenshot of the Blue section directly by clip
  if (rects.blueY) {
    const clipRes = await send('Page.captureScreenshot', {
      format: 'png',
      clip: {
        x: 0,
        y: Math.max(0, rects.blueY - 20),
        width: 1440,
        height: 1100,
        scale: 1
      },
      captureBeyondViewport: true
    });
    fs.writeFileSync('C:\\Users\\Raju\\.gemini\\antigravity\\brain\\20845224-7465-4d56-9c11-406ea7005c30\\screenshot_josaa_blue_clipped.png', Buffer.from(clipRes.data, 'base64'));
    console.log('Saved screenshot_josaa_blue_clipped.png');
  }

  ws.close();
  edge.kill();
}

main().catch(console.error);