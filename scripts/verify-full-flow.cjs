const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const ARTIFACT_DIR = 'C:\\Users\\Raju\\.gemini\\antigravity\\brain\\20845224-7465-4d56-9c11-406ea7005c30';

async function runVerification() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const userDataDir = path.join(ARTIFACT_DIR, 'scratch', 'edge_verify_flow');
  if (!fs.existsSync(userDataDir)) {
    fs.mkdirSync(userDataDir, { recursive: true });
  }

  const port = 9598;
  const fileUrl = 'file:///C:/Users/Raju/OneDrive/Desktop/JEE%20College%20Finder%202026.html';

  console.log('Launching headless Edge for verification...');
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
  await send('DOM.enable');

  // Set viewport to a typical desktop size
  await send('Emulation.setDeviceMetricsOverride', {
    width: 1366,
    height: 850,
    deviceScaleFactor: 1,
    mobile: false
  });

  console.log('1. Checking initial splash screen state (at ~800ms)...');
  await new Promise(r => setTimeout(r, 800));

  const splashCheck = await send('Runtime.evaluate', {
    expression: `({
      isSplashPresent: !!document.querySelector('button')?.textContent?.includes('Find My College'),
      headingText: document.querySelector('h1')?.innerText || ''
    })`,
    returnByValue: true
  });
  console.log('Splash Screen check:', splashCheck.result.value);

  // Take screenshot of splash screen
  const splashShot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(ARTIFACT_DIR, 'screenshot_step1_splash.png'), Buffer.from(splashShot.data, 'base64'));
  console.log('Saved screenshot_step1_splash.png');

  console.log('2. Waiting for 2.2s splash timer to finish and website to open (total ~3.2s)...');
  await new Promise(r => setTimeout(r, 2600));

  const websiteCheck = await send('Runtime.evaluate', {
    expression: `({
      isSplashPresent: !!document.querySelector('button')?.textContent?.includes('Find My College'),
      isPromptModalOpen: !!document.querySelector('h2')?.textContent?.includes('Enter Your Rank'),
      mainHeader: document.querySelector('h1')?.innerText || '',
      statsBoxesCount: document.querySelectorAll('[class*="rounded-2xl bg-white border border-slate-200"]').length,
      collegesCount: document.querySelectorAll('tr[id^="choice-row-"], [id^="choice-row-"]').length,
      pageTextSnippet: document.body.innerText.slice(0, 350)
    })`,
    returnByValue: true
  });
  console.log('Website opened state:', websiteCheck.result.value);

  // Take screenshot with rank prompter open over the website
  const promptShot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(ARTIFACT_DIR, 'screenshot_step2_prompt_open.png'), Buffer.from(promptShot.data, 'base64'));
  console.log('Saved screenshot_step2_prompt_open.png');

  console.log('3. Closing rank prompt modal to reveal the complete open website...');
  await send('Runtime.evaluate', {
    expression: `(() => {
      // Find the "View 321 Colleges Directly" button or close button
      const btns = Array.from(document.querySelectorAll('button'));
      const viewDirectlyBtn = btns.find(b => b.textContent.includes('View 321 Colleges Directly') || b.title?.includes('Close dialog'));
      if (viewDirectlyBtn) {
        viewDirectlyBtn.click();
        return 'Clicked View Directly / Close';
      }
      return 'Button not found';
    })()`
  });

  await new Promise(r => setTimeout(r, 500));

  const openWebsiteCheck = await send('Runtime.evaluate', {
    expression: `({
      isPromptModalOpen: !!document.querySelector('h2')?.textContent?.includes('Enter Your Rank'),
      mainHeader: document.querySelector('h1')?.innerText || '',
      subtitle: document.querySelector('p.text-xs.sm\\:text-sm')?.innerText || '',
      firstCollege: document.querySelector('[id^="choice-row-"]')?.innerText?.slice(0, 80) || '',
      hasQuickCustomizer: !!document.querySelector('input[type="number"]')
    })`,
    returnByValue: true
  });
  console.log('Full website state after prompt dismissed:', openWebsiteCheck.result.value);

  // Take screenshot of the open website
  const fullWebsiteShot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(ARTIFACT_DIR, 'screenshot_step3_open_website.png'), Buffer.from(fullWebsiteShot.data, 'base64'));
  console.log('Saved screenshot_step3_open_website.png');

  // Test changing the rank in the quick toolbar
  console.log('4. Testing Quick Customizer rank change in the top header...');
  await send('Runtime.evaluate', {
    expression: `(() => {
      const input = document.querySelector('input[type="number"]');
      if (input) {
        input.value = '25000';
        input.dispatchEvent(new Event('input', { bubbles: true }));
        const btns = Array.from(document.querySelectorAll('button'));
        const updateBtn = btns.find(b => b.textContent.includes('Update Choices'));
        if (updateBtn) updateBtn.click();
        return 'Updated rank to 25000 and clicked Update Choices';
      }
      return 'Rank input not found';
    })()`
  });

  await new Promise(r => setTimeout(r, 600));

  const afterUpdateCheck = await send('Runtime.evaluate', {
    expression: `({
      subtitle: document.querySelector('p.text-xs.sm\\:text-sm')?.innerText || '',
      firstCollege: document.querySelector('[id^="choice-row-"]')?.innerText?.slice(0, 80) || ''
    })`,
    returnByValue: true
  });
  console.log('After rank update state:', afterUpdateCheck.result.value);

  const updatedShot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(ARTIFACT_DIR, 'screenshot_step4_updated_rank.png'), Buffer.from(updatedShot.data, 'base64'));
  console.log('Saved screenshot_step4_updated_rank.png');

  await send('Browser.close');
  edge.kill();
  console.log('Verification completed successfully!');
}

runVerification().catch(err => {
  console.error('Verification error:', err);
  process.exit(1);
});
