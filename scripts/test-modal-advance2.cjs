const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');

async function test() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const userDataDir = 'C:\\Users\\Raju\\.gemini\\antigravity\\brain\\20845224-7465-4d56-9c11-406ea7005c30\\scratch\\edge_m3';
  const port = 9999;
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
  const tabs = await new Promise(res => http.get(`http://127.0.0.1:${port}/json/list`, r => { let d=''; r.on('data', c=>d+=c); r.on('end', ()=>res(JSON.parse(d))); }));
  const page = tabs.find(t => t.url.includes('localhost:5173')) || tabs[0];
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  let id = 1; const pending = new Map();
  ws.onmessage = e => { const m = JSON.parse(e.data); if (m.id && pending.has(m.id)) { pending.get(m.id).resolve(m.result); pending.delete(m.id); }};
  const send = (method, params = {}) => new Promise((resolve, reject) => { const reqId = id++; pending.set(reqId, { resolve, reject }); ws.send(JSON.stringify({ id: reqId, method, params })); });
  await new Promise(r => ws.onopen = r);
  await send('Page.enable');
  const evalJs = async expr => (await send('Runtime.evaluate', { expression: expr, returnByValue: true }))?.result?.value;
  const takeScreenshot = async (filePath) => {
    const res = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(filePath, Buffer.from(res.data, 'base64'));
    console.log('Saved screenshot:', filePath);
  };

  // Open modal
  await evalJs(`document.querySelectorAll('.grid button')[3].click();`);
  await new Promise(r => setTimeout(r, 600));
  await evalJs(`Array.from(document.querySelectorAll('header button')).find(b => b.innerText.includes('CRL')).click();`);
  await new Promise(r => setTimeout(r, 600));

  // Advance to Step 2
  await evalJs(`Array.from(document.querySelectorAll('.fixed button')).find(b => b.innerText.includes('Continue to Step 2')).click();`);
  await new Promise(r => setTimeout(r, 500));

  // Advance to Step 3
  await evalJs(`Array.from(document.querySelectorAll('.fixed button')).find(b => b.innerText.includes('Continue to Step 3')).click();`);
  await new Promise(r => setTimeout(r, 500));
  await takeScreenshot('C:\\Users\\Raju\\.gemini\\antigravity\\brain\\20845224-7465-4d56-9c11-406ea7005c30\\screenshot_modal_step3_verified.png');

  // Advance to Step 4
  await evalJs(`Array.from(document.querySelectorAll('.fixed button')).find(b => b.innerText.includes('Continue to Step 4')).click();`);
  await new Promise(r => setTimeout(r, 500));
  await takeScreenshot('C:\\Users\\Raju\\.gemini\\antigravity\\brain\\20845224-7465-4d56-9c11-406ea7005c30\\screenshot_modal_step4_verified.png');

  ws.close(); edge.kill();
  console.log('Screenshots saved!');
}
test().catch(console.error);
