const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');

async function main() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const userDataDir = 'C:\\Users\\Raju\\.gemini\\antigravity\\brain\\20845224-7465-4d56-9c11-406ea7005c30\\scratch\\edge_check2';
  const port = 9777;
  const edge = spawn(edgePath, [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${userDataDir}`,
    '--disable-gpu',
    '--no-sandbox',
    '--window-size=1440,1100',
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
      pending.get(msg.id).resolve(msg.result);
      pending.delete(msg.id);
    }
  };
  const send = (method, params = {}) => new Promise((resolve, reject) => {
    const reqId = id++;
    pending.set(reqId, { resolve, reject });
    ws.send(JSON.stringify({ id: reqId, method, params }));
  });

  await new Promise(r => ws.onopen = r);
  await send('Page.enable');

  const evalJs = async (expr) => {
    const res = await send('Runtime.evaluate', { expression: expr, returnByValue: true });
    return res?.result?.value;
  };

  const takeScreenshot = async (filePath) => {
    const res = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(filePath, Buffer.from(res.data, 'base64'));
    console.log('Saved screenshot:', filePath);
  };

  // Click preset
  await evalJs(`document.querySelectorAll('.grid button')[3].click();`);
  await new Promise(r => setTimeout(r, 800));

  // Open modal via header candidate button
  await evalJs(`
    const btn = Array.from(document.querySelectorAll('header button')).find(b => b.innerText.includes('CRL'));
    if (btn) btn.click();
  `);
  await new Promise(r => setTimeout(r, 600));

  // Step 1 Screenshot
  await takeScreenshot('C:\\Users\\Raju\\.gemini\\antigravity\\brain\\20845224-7465-4d56-9c11-406ea7005c30\\screenshot_modal_step1.png');

  // Click Ribbon Step 2 (Exam Ranks)
  await evalJs(`
    const btn = Array.from(document.querySelectorAll('.fixed button')).find(b => b.innerText.includes('2. Exam Ranks'));
    if (btn) btn.click();
  `);
  await new Promise(r => setTimeout(r, 400));
  await takeScreenshot('C:\\Users\\Raju\\.gemini\\antigravity\\brain\\20845224-7465-4d56-9c11-406ea7005c30\\screenshot_modal_step2.png');

  // Click Ribbon Step 3 (Domicile & Quota)
  await evalJs(`
    const btn = Array.from(document.querySelectorAll('.fixed button')).find(b => b.innerText.includes('3. Domicile'));
    if (btn) btn.click();
  `);
  await new Promise(r => setTimeout(r, 400));
  await takeScreenshot('C:\\Users\\Raju\\.gemini\\antigravity\\brain\\20845224-7465-4d56-9c11-406ea7005c30\\screenshot_modal_step3.png');

  // Click Ribbon Step 4 (Branches)
  await evalJs(`
    const btn = Array.from(document.querySelectorAll('.fixed button')).find(b => b.innerText.includes('4. Branches'));
    if (btn) btn.click();
  `);
  await new Promise(r => setTimeout(r, 400));
  await takeScreenshot('C:\\Users\\Raju\\.gemini\\antigravity\\brain\\20845224-7465-4d56-9c11-406ea7005c30\\screenshot_modal_step4.png');

  ws.close();
  edge.kill();
  console.log('All 4 modal step screenshots saved successfully!');
}
main().catch(console.error);
