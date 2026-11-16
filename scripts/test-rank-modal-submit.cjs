const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const ARTIFACT_DIR = 'C:\\Users\\Raju\\.gemini\\antigravity\\brain\\20845224-7465-4d56-9c11-406ea7005c30';

async function testModalSubmit() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const userDataDir = path.join(ARTIFACT_DIR, 'scratch', 'edge_test_submit');
  if (!fs.existsSync(userDataDir)) {
    fs.mkdirSync(userDataDir, { recursive: true });
  }

  const port = 9599;
  const fileUrl = 'file:///C:/Users/Raju/OneDrive/Desktop/JEE%20College%20Finder%202026.html';

  const edge = spawn(edgePath, [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${userDataDir}`,
    '--allow-file-access-from-files',
    '--disable-web-security',
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

  await send('Emulation.setDeviceMetricsOverride', {
    width: 1366,
    height: 850,
    deviceScaleFactor: 1,
    mobile: false
  });

  // Wait 3.0s for splash to disappear and modal to be open
  await new Promise(r => setTimeout(r, 3000));

  // Change input in modal to 12500, switch to JoSAA, and submit form!
  console.log('Submitting RankPromptModal with JoSAA and Rank 12500...');
  await send('Runtime.evaluate', {
    expression: `(() => {
      // Click JoSAA button
      const btns = Array.from(document.querySelectorAll('button'));
      const josaaBtn = btns.find(b => b.textContent.includes('JoSAA 2026'));
      if (josaaBtn) josaaBtn.click();

      // Find rank input in modal
      const modal = document.querySelector('form');
      const input = modal.querySelector('input[type="number"]');
      
      // Native setter for React controlled component
      const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
      nativeSetter.call(input, '12500');
      input.dispatchEvent(new Event('input', { bubbles: true }));

      // Click submit
      const submitBtn = btns.find(b => b.textContent.includes('Update & Show My Choices'));
      if (submitBtn) submitBtn.click();

      return 'Submitted';
    })()`
  });

  await new Promise(r => setTimeout(r, 600));

  const afterSubmit = await send('Runtime.evaluate', {
    expression: `({
      mainHeader: document.querySelector('h1')?.innerText || '',
      subtitle: document.querySelector('div.space-y-1 > p')?.innerText || '',
      lockBtnText: Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Lock choices'))?.innerText || ''
    })`,
    returnByValue: true
  });
  console.log('After submit state:', afterSubmit.result.value);

  const shot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(ARTIFACT_DIR, 'screenshot_josaa_submitted.png'), Buffer.from(shot.data, 'base64'));
  console.log('Saved screenshot_josaa_submitted.png');

  await send('Browser.close');
  edge.kill();
}

testModalSubmit().catch(console.error);
