const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');

async function testEdge(targetUrl) {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const port = 9596;

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

  console.log('Tabs:', tabs.map(t => ({ id: t.id, url: t.url })));
  const page = tabs.find(t => t.type === 'page') || tabs[0];
  const ws = new WebSocket(page.webSocketDebuggerUrl);

  let id = 1;
  const pending = new Map();
  const consoleLogs = [];
  const errors = [];

  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    if (msg.method === 'Runtime.exceptionThrown') {
      errors.push(msg.params.exceptionDetails);
    }
    if (msg.method === 'Console.messageAdded') {
      consoleLogs.push(msg.params.message);
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
  await send('Page.enable');
  await send('Runtime.enable');
  await send('Console.enable');

  console.log('Navigating to:', targetUrl);
  await send('Page.navigate', { url: targetUrl });
  await new Promise(r => setTimeout(r, 2000));

  const result = await send('Runtime.evaluate', {
    expression: `({
      title: document.title,
      bodyTextLength: document.body ? document.body.innerText.length : 0,
      rootChildren: document.getElementById('root') ? document.getElementById('root').children.length : 0,
      bodySnippet: document.body ? document.body.innerText.slice(0, 200) : ''
    })`,
    returnByValue: true
  });

  console.log('DOM Evaluation:', result && result.result ? result.result.value : result);
  console.log('Exceptions:', errors);
  console.log('Console Logs:', consoleLogs);

  await send('Browser.close');
  edge.kill();
}

testEdge('file:///C:/Users/Raju/OneDrive/Desktop/JEE%20College%20Finder%202026.html').catch(console.error);
