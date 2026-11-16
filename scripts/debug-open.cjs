const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

async function checkConsole(fileUrl) {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const userDataDir = 'C:\\Users\\Raju\\.gemini\\antigravity\\brain\\20845224-7465-4d56-9c11-406ea7005c30\\scratch\\edge_debug_open';
  if (!fs.existsSync(userDataDir)) {
    fs.mkdirSync(userDataDir, { recursive: true });
  }

  const port = 9595;
  console.log(`Testing URL: ${fileUrl}`);
  const edge = spawn(edgePath, [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${userDataDir}`,
    '--disable-gpu',
    '--no-sandbox',
    fileUrl
  ]);

  await new Promise(r => setTimeout(r, 1500));

  const tabs = await new Promise((resolve, reject) => {
    http.get(`http://127.0.0.1:${port}/json/list`, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });

  const page = tabs[0];
  const ws = new WebSocket(page.webSocketDebuggerUrl);

  let id = 1;
  const pending = new Map();
  const consoleLogs = [];
  const errors = [];

  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    if (msg.method === 'Console.messageAdded') {
      consoleLogs.push(msg.params.message);
    }
    if (msg.method === 'Runtime.consoleAPICalled') {
      consoleLogs.push(msg.params);
    }
    if (msg.method === 'Runtime.exceptionThrown') {
      errors.push(msg.params);
    }
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
  await send('Console.enable');
  await send('Runtime.enable');
  await send('Page.enable');

  // Wait 4 seconds to see splash and auto-transition
  await new Promise(r => setTimeout(r, 3500));

  const evalRes = await send('Runtime.evaluate', {
    expression: `({
      title: document.title,
      bodyTextLength: document.body ? document.body.innerText.length : 0,
      bodySnippet: document.body ? document.body.innerText.slice(0, 300) : '',
      isSplashPresent: !!document.querySelector('button')?.textContent?.includes('Enter Studio'),
      isWizardPresent: !!document.getElementById('candidate-wizard-section')
    })`,
    returnByValue: true
  });

  console.log('DOM State:', JSON.stringify(evalRes.result.value, null, 2));
  console.log('Errors caught:', JSON.stringify(errors, null, 2));
  console.log('Console logs:', JSON.stringify(consoleLogs, null, 2));

  await send('Browser.close');
  edge.kill();
}

async function run() {
  console.log('--- Checking Desktop file ---');
  await checkConsole('file:///C:/Users/Raju/OneDrive/Desktop/JEE%20College%20Finder%202026.html');
}

run().catch(console.error);
