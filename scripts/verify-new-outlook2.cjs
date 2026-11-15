const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');

async function main() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const userDataDir = 'C:\\Users\\Raju\\.gemini\\antigravity\\brain\\20845224-7465-4d56-9c11-406ea7005c30\\scratch\\edge_verify_outlook2';
  if (!fs.existsSync(userDataDir)) {
    fs.mkdirSync(userDataDir, { recursive: true });
  }

  const port = 9566;
  const edge = spawn(edgePath, [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${userDataDir}`,
    '--disable-gpu',
    '--no-sandbox',
    '--window-size=1440,1400',
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

  // Wait for buttons to load
  for (let i = 0; i < 20; i++) {
    const btns = await evalJs("document.querySelectorAll('button').length");
    if (btns > 10) break;
    await new Promise(r => setTimeout(r, 250));
  }

  // 1. Click preset: CSAB Special Round 1/2
  console.log('Clicking CSAB Special Round 1/2 preset...');
  await evalJs(`
    const btns = Array.from(document.querySelectorAll('button'));
    const b = btns.find(btn => btn.innerText.includes('CSAB Special'));
    if (b) b.click();
  `);
  await new Promise(r => setTimeout(r, 1200));

  // Check if Choice Sheet is visible
  const sheetVisible = await evalJs("!!document.getElementById('choice-sheet-section')");
  console.log('Choice sheet rendered:', sheetVisible);

  // Scroll to stats cards & choice sheet top
  await evalJs(`
    const el = document.getElementById('choice-sheet-section');
    if (el) window.scrollTo(0, el.offsetTop - 180);
  `);
  await new Promise(r => setTimeout(r, 600));

  // Capture screenshot of the full outlook
  const res1 = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('C:\\Users\\Raju\\.gemini\\antigravity\\brain\\20845224-7465-4d56-9c11-406ea7005c30\\screenshot_new_outlook_perfect.png', Buffer.from(res1.data, 'base64'));
  console.log('Saved screenshot_new_outlook_perfect.png');

  // 2. Trigger hover on a college name using CDP MouseEvent
  console.log('Finding first college name coordinates for hover...');
  const collegeCoords = await evalJs(`
    (() => {
      const collegeH3 = document.querySelector('#choice-sheet-section h3');
      if (collegeH3) {
        const rect = collegeH3.getBoundingClientRect();
        return {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
          text: collegeH3.innerText
        };
      }
      return null;
    })()
  `);
  console.log('Target college coordinates:', collegeCoords);

  if (collegeCoords) {
    // Send CDP mouse move to hover exactly on the college name
    await send('Input.dispatchMouseEvent', {
      type: 'mouseMoved',
      x: Math.round(collegeCoords.x),
      y: Math.round(collegeCoords.y)
    });
    console.log('Dispatched mouseMoved event to college name');

    // Wait for the hover popover to animate in
    await new Promise(r => setTimeout(r, 700));

    const popoverInfo = await evalJs(`
      (() => {
        const pop = document.querySelector('.fixed.z-50');
        if (pop) {
          return {
            found: true,
            title: pop.querySelector('h4')?.innerText,
            program: pop.querySelector('.text-indigo-400')?.parentElement?.innerText,
            rect: pop.getBoundingClientRect()
          };
        }
        return { found: false };
      })()
    `);
    console.log('Hover Popover Info:', popoverInfo);

    const res2 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('C:\\Users\\Raju\\.gemini\\antigravity\\brain\\20845224-7465-4d56-9c11-406ea7005c30\\screenshot_hover_popover_perfect.png', Buffer.from(res2.data, 'base64'));
    console.log('Saved screenshot_hover_popover_perfect.png');
  }

  ws.close();
  edge.kill();
  console.log('Done!');
}

main().catch(console.error);