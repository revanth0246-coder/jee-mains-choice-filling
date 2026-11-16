const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');

async function testSplashDisappears() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const port = 9597;

  const edge = spawn(edgePath, [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    '--allow-file-access-from-files',
    '--disable-web-security',
    '--disable-gpu',
    '--no-sandbox'
  ]);

  await new Promise(r => setTimeout(r, 1200));

  const tabs = await new Promise((resolve, reject) => {
    http.get(`http://127.0.0.1:${port}/json/list`, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });

  const page = tabs.find(t => t.type === 'page') || tabs[0];
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
  await send('Runtime.enable');

  await send('Page.navigate', { url: 'file:///C:/Users/Raju/OneDrive/Desktop/JEE%20College%20Finder%202026.html' });
  
  // At 1 second:
  await new Promise(r => setTimeout(r, 1000));
  let res = await send('Runtime.evaluate', {
    expression: `!!document.querySelector('div[class*="fixed inset-0 z-50 bg-[#040714]"]')`,
    returnByValue: true
  });
  console.log('At 1s: is splash present?', res.result.value);

  // At 3.5 seconds:
  await new Promise(r => setTimeout(r, 2500));
  res = await send('Runtime.evaluate', {
    expression: `!!document.querySelector('div[class*="fixed inset-0 z-50 bg-[#040714]"]')`,
    returnByValue: true
  });
  console.log('At 3.5s: is splash present?', res.result.value);

  let res2 = await send('Runtime.evaluate', {
    expression: `document.body ? document.body.innerText.slice(0, 300) : ''`,
    returnByValue: true
  });
  console.log('At 3.5s: snippet:', res2.result.value);

  await send('Browser.close');
  edge.kill();
}

testSplashDisappears().catch(console.error);
