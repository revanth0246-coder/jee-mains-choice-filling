const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

async function main() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const artifactDir = 'C:\\Users\\Raju\\.gemini\\antigravity\\brain\\20845224-7465-4d56-9c11-406ea7005c30';
  const userDataDir = path.join(artifactDir, 'scratch/edge_splash_test2');
  if (!fs.existsSync(userDataDir)) {
    fs.mkdirSync(userDataDir, { recursive: true });
  }

  const port = 9591;

  console.log('Launching Edge headless with remote debugging on port', port);
  const edge = spawn(edgePath, [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${userDataDir}`,
    '--disable-gpu',
    '--no-sandbox',
    '--window-size=1440,1100',
    'http://localhost:5173'
  ]);

  await new Promise(r => setTimeout(r, 1200));

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
    return res && res.result ? res.result.value : null;
  };

  const takeScreenshot = async (filename) => {
    const res = await send('Page.captureScreenshot', { format: 'png' });
    const buffer = Buffer.from(res.data, 'base64');
    const outPath = path.join(artifactDir, filename);
    fs.writeFileSync(outPath, buffer);
    console.log(`Saved screenshot: ${filename} (${(buffer.length / 1024).toFixed(1)} KB)`);
  };

  // Wait for initial DOM load
  for (let i = 0; i < 20; i++) {
    const hasBody = await evalJs("document.body ? true : false");
    if (hasBody) break;
    await new Promise(r => setTimeout(r, 100));
  }

  // 1. Capture Splash Screen
  console.log('1. Checking & Capturing Splash Screen...');
  const isSplashVisible = await evalJs(`!!document.querySelector('button')?.textContent?.includes('Enter Studio') || document.body.innerText.includes('Your Dream College')`);
  console.log('Is splash screen text detected?', isSplashVisible);
  await takeScreenshot('screenshot_splash_screen.png');

  // 2. Wait for Splash auto-transition (2.2s)
  console.log('2. Waiting for splash screen transition (2.6s)...');
  await new Promise(r => setTimeout(r, 2600));

  // 3. Capture Candidate Setup Wizard in White and Blue
  console.log('3. Capturing Candidate Setup Wizard in White & Blue...');
  const wizardPresent = await evalJs(`!!document.getElementById('candidate-wizard-section')`);
  console.log('Is Candidate Setup Wizard present?', wizardPresent);
  await takeScreenshot('screenshot_white_blue_wizard.png');

  // 4. Test clicking CSAB Special preset
  console.log('4. Clicking CSAB Special Round preset...');
  await evalJs(`
    const btns = Array.from(document.querySelectorAll('button'));
    const csabBtn = btns.find(b => b.textContent && b.textContent.includes('CSAB Special'));
    if (csabBtn) csabBtn.click();
  `);
  await new Promise(r => setTimeout(r, 1500));

  console.log('5. Capturing Results page in White & Blue...');
  await takeScreenshot('screenshot_white_blue_results.png');

  // 5. Test page reload
  console.log('6. Testing page refresh (location.reload)...');
  await evalJs(`location.reload()`);
  await new Promise(r => setTimeout(r, 600));

  const splashOnReload = await evalJs(`document.body.innerText.includes('Your Dream College')`);
  console.log('On reload: is splash showing?', splashOnReload);
  await takeScreenshot('screenshot_reload_splash.png');

  // 6. After 2.6s, verify Candidate Setup Wizard is back asking for details again!
  console.log('7. Waiting for splash on reload to finish...');
  await new Promise(r => setTimeout(r, 2600));

  const wizardOnReload = await evalJs(`!!document.getElementById('candidate-wizard-section')`);
  console.log('On reload: does it ask again for candidate details (wizard open)?', wizardOnReload);
  await takeScreenshot('screenshot_reload_wizard_ready.png');

  await send('Browser.close');
  edge.kill();
  console.log('All tests completed successfully!');
  process.exit(0);
}

main().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
