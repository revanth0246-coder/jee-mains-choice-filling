const { spawn } = require('child_process');
const http = require('http');

async function test() {
  const edge = spawn('C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', [
    '--headless=new', '--remote-debugging-port=9560', '--disable-gpu', '--no-sandbox', 'http://localhost:5173'
  ]);
  await new Promise(r => setTimeout(r, 2500));
  const tabs = await new Promise(res => http.get('http://127.0.0.1:9560/json/list', r => {
    let d=''; r.on('data', c=>d+=c); r.on('end', ()=>res(JSON.parse(d)));
  }));
  console.log('Tabs:', tabs.map(t => ({ url: t.url, title: t.title })));
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

  // Wait for document to be ready
  let ready = false;
  for (let i = 0; i < 20; i++) {
    const title = await evalJs("document.title");
    const btns = await evalJs("document.querySelectorAll('button').length");
    if (btns > 0) {
      console.log(`Page ready after ${i * 300}ms, buttons:`, btns);
      ready = true;
      break;
    }
    await new Promise(r => setTimeout(r, 300));
  }

  const btnTexts = await evalJs("Array.from(document.querySelectorAll('button')).map(b => b.innerText.trim()).filter(Boolean)");
  console.log('Buttons found:', btnTexts.slice(0, 10));

  // Click Top IIT Ranker
  console.log('Clicking "⚡ Elite IIT + NIT Calicut"...');
  await evalJs(`
    const btns = Array.from(document.querySelectorAll('button'));
    const b = btns.find(btn => btn.innerText.includes('Elite IIT'));
    if (b) b.click();
  `);

  await new Promise(r => setTimeout(r, 1000));

  const status = await evalJs(`
    (() => {
      const topSec = document.getElementById('section-top-colleges');
      const probSec = document.getElementById('section-most-probable');
      const easySec = document.getElementById('section-easily-coming');
      const table = document.getElementById('choice-sheet-section');
      return {
        hasTable: !!table,
        topHeading: topSec?.querySelector('h3')?.innerText,
        topItems: topSec?.querySelectorAll('.group')?.length,
        probHeading: probSec?.querySelector('h3')?.innerText,
        probItems: probSec?.querySelectorAll('.group')?.length,
        easyHeading: easySec?.querySelector('h3')?.innerText,
        easyItems: easySec?.querySelectorAll('.group')?.length,
        statsBar: Array.from(document.querySelectorAll('.grid-cols-2 .text-2xl')).map(e => e.innerText)
      };
    })()
  `);
  console.log('Sections Status:', JSON.stringify(status, null, 2));

  ws.close();
  edge.kill();
}

test().catch(console.error);