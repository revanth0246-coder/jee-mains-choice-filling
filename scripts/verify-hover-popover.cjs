const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');

async function main() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const userDataDir = 'C:\\Users\\Raju\\.gemini\\antigravity\\brain\\20845224-7465-4d56-9c11-406ea7005c30\\scratch\\edge_verify_hover';
  if (!fs.existsSync(userDataDir)) {
    fs.mkdirSync(userDataDir, { recursive: true });
  }

  const port = 9567;
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

  for (let i = 0; i < 20; i++) {
    const btns = await evalJs("document.querySelectorAll('button').length");
    if (btns > 10) break;
    await new Promise(r => setTimeout(r, 250));
  }

  // 1. Click preset
  console.log('Clicking CSAB preset...');
  await evalJs(`
    const btns = Array.from(document.querySelectorAll('button'));
    const b = btns.find(btn => btn.innerText.includes('CSAB Special'));
    if (b) b.click();
  `);
  await new Promise(r => setTimeout(r, 1200));

  // 2. Capture Stats Cards directly at top
  console.log('Scrolling to stats bar view...');
  await evalJs(`
    const stats = document.querySelector('.grid-cols-1.sm\\:grid-cols-2');
    if (stats) window.scrollTo(0, stats.offsetTop - 80);
  `);
  await new Promise(r => setTimeout(r, 600));

  const resStats = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('C:\\Users\\Raju\\.gemini\\antigravity\\brain\\20845224-7465-4d56-9c11-406ea7005c30\\screenshot_stats_4cards_verified.png', Buffer.from(resStats.data, 'base64'));
  console.log('Saved screenshot_stats_4cards_verified.png');

  // 3. Hover over the first college name row
  console.log('Targeting first row college name...');
  const rowTarget = await evalJs(`
    (() => {
      const row = document.querySelector("[id^='choice-row-']");
      if (row) {
        const h3 = row.querySelector('h3');
        const trigger = h3 ? h3.closest('.inline-block.relative') : null;
        if (trigger) {
          const rect = h3.getBoundingClientRect();
          return {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2,
            name: h3.innerText
          };
        }
      }
      return null;
    })()
  `);
  console.log('Row Target:', rowTarget);

  if (rowTarget) {
    // Send mouse move directly to the college name
    await send('Input.dispatchMouseEvent', {
      type: 'mouseMoved',
      x: Math.round(rowTarget.x),
      y: Math.round(rowTarget.y)
    });
    console.log('Dispatched mouseMoved to', rowTarget.name);

    // Wait for the hover popover to render
    await new Promise(r => setTimeout(r, 600));

    const popoverCheck = await evalJs(`
      (() => {
        const pop = document.querySelector('.fixed.z-50');
        return {
          isVisible: !!pop,
          title: pop?.querySelector('h4')?.innerText,
          program: pop?.querySelector('.text-indigo-400')?.parentElement?.innerText
        };
      })()
    `);
    console.log('Popover Check result:', popoverCheck);

    const resHover = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('C:\\Users\\Raju\\.gemini\\antigravity\\brain\\20845224-7465-4d56-9c11-406ea7005c30\\screenshot_hover_popover_verified.png', Buffer.from(resHover.data, 'base64'));
    console.log('Saved screenshot_hover_popover_verified.png');
  }

  ws.close();
  edge.kill();
  console.log('All hover tests finished!');
}

main().catch(console.error);