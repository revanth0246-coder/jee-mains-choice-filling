const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');

async function main() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const userDataDir = 'C:\\Users\\Raju\\.gemini\\antigravity\\brain\\20845224-7465-4d56-9c11-406ea7005c30\\scratch\\edge_verify_outlook';
  if (!fs.existsSync(userDataDir)) {
    fs.mkdirSync(userDataDir, { recursive: true });
  }

  const port = 9565;
  const edge = spawn(edgePath, [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${userDataDir}`,
    '--disable-gpu',
    '--no-sandbox',
    '--window-size=1440,1300',
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

  const takeScreenshot = async (filePath) => {
    const res = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(filePath, Buffer.from(res.data, 'base64'));
    console.log('Saved screenshot:', filePath);
  };

  // Set candidate profile matching user screenshot: CSAB, CRL 38291, OBC-NCL, Telangana
  console.log('Setting candidate profile matching user screenshot...');
  await evalJs(`
    localStorage.setItem('josaa_has_generated_2026', 'true');
    localStorage.setItem('josaa_candidate_profile_2026', JSON.stringify({
      counselingType: 'CSAB',
      jeeMainRank: '38291',
      isJeeAdvQualified: false,
      jeeAdvRank: '',
      homeState: 'Telangana',
      category: 'OBC-NCL',
      genderPool: 'Gender-Neutral',
      preferredBranches: ['ALL']
    }));
    window.location.reload();
  `);

  await new Promise(r => setTimeout(r, 2500));

  // 1. Capture Dashboard View showing the 4 Stats Cards + CSAB Table Header
  console.log('Capturing overall dashboard with new 4 cards outlook...');
  await evalJs(`
    const el = document.getElementById('choice-sheet-section');
    if (el) window.scrollTo(0, el.offsetTop - 150);
  `);
  await new Promise(r => setTimeout(r, 600));

  const statsDetails = await evalJs(`
    (() => {
      const cards = Array.from(document.querySelectorAll('.grid-cols-1 > div, .lg\\:grid-cols-4 > div')).map(d => ({
        title: d.querySelector('.text-xs')?.innerText,
        value: d.querySelector('.text-2xl, .text-3xl')?.innerText,
        sub: d.querySelector('.text-\\[11px\\]')?.innerText
      }));
      return cards;
    })()
  `);
  console.log('Stats cards detected:', statsDetails);

  await takeScreenshot('C:\\Users\\Raju\\.gemini\\antigravity\\brain\\20845224-7465-4d56-9c11-406ea7005c30\\screenshot_new_outlook_verified.png');

  // 2. Trigger hover on first college name to verify the details popover
  console.log('Triggering hover on first college name...');
  const hoverTriggered = await evalJs(`
    (() => {
      const firstCollege = document.querySelector('#section-top-colleges h3, .group\\/name h3');
      if (firstCollege) {
        const mouseOverEvent = new MouseEvent('mouseenter', { bubbles: true, cancelable: true });
        firstCollege.parentElement.dispatchEvent(mouseOverEvent);
        firstCollege.dispatchEvent(mouseOverEvent);
        return firstCollege.innerText;
      }
      return null;
    })()
  `);
  console.log('Hovered over college:', hoverTriggered);

  // Wait for hover popover to animate in
  await new Promise(r => setTimeout(r, 500));

  const popoverDetected = await evalJs(`
    (() => {
      const popover = document.querySelector('.fixed.z-50');
      if (popover) {
        return {
          found: true,
          title: popover.querySelector('h4')?.innerText,
          text: popover.innerText.replace(/\\n+/g, ' | ').slice(0, 200)
        };
      }
      return { found: false };
    })()
  `);
  console.log('Popover detection:', popoverDetected);

  await takeScreenshot('C:\\Users\\Raju\\.gemini\\antigravity\\brain\\20845224-7465-4d56-9c11-406ea7005c30\\screenshot_college_hover_details.png');

  ws.close();
  edge.kill();
  console.log('Verification completed successfully!');
}

main().catch(console.error);