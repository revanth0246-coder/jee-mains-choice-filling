const http = require('http');
const { spawn } = require('child_process');

async function run() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const edge = spawn(edgePath, [
    '--headless=new',
    '--remote-debugging-port=9574',
    '--user-data-dir=C:\\Users\\Raju\\.gemini\\antigravity\\brain\\20845224-7465-4d56-9c11-406ea7005c30\\scratch\\edge_debug',
    'http://localhost:5173'
  ]);
  await new Promise(r => setTimeout(r, 2000));
  
  const tabs = await new Promise((res, rej) => 
    http.get('http://127.0.0.1:9574/json/list', r => {
      let d = '';
      r.on('data', c => d += c);
      r.on('end', () => res(JSON.parse(d)));
    })
  );

  const ws = new WebSocket(tabs[0].webSocketDebuggerUrl);
  let id = 1;
  const pending = new Map();

  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    if (msg.id && pending.has(msg.id)) {
      const { resolve } = pending.get(msg.id);
      pending.delete(msg.id);
      resolve(msg.result);
    }
    if (msg.method === 'Runtime.consoleAPICalled') {
      console.log('CONSOLE:', msg.params.type, msg.params.args.map(a => a.value));
    }
    if (msg.method === 'Runtime.exceptionThrown') {
      console.log('EXCEPTION:', JSON.stringify(msg.params));
    }
  };

  const send = (method, params = {}) => new Promise(res => {
    const reqId = id++;
    pending.set(reqId, { resolve: res });
    ws.send(JSON.stringify({ id: reqId, method, params }));
  });

  await new Promise(r => ws.onopen = r);
  await send('Page.enable');
  await send('Runtime.enable');

  // Wait for initial load
  await new Promise(r => setTimeout(r, 1000));
  
  const initialCheck = await send('Runtime.evaluate', { expression: `
    (() => {
      const btns = Array.from(document.querySelectorAll('button')).map(b => b.innerText);
      const hasGenerated = localStorage.getItem('josaa_has_generated_2026');
      return { btnsCount: btns.length, sampleBtns: btns.slice(0, 10), hasGenerated };
    })()
  `, returnByValue: true });
  console.log('Initial check:', initialCheck.result.value);
  await new Promise(r => setTimeout(r, 1000));

  // Click the CSAB preset button
  console.log('Clicking CSAB preset button...');
  await send('Runtime.evaluate', { expression: `
    const btns = Array.from(document.querySelectorAll('button'));
    const csabBtn = btns.find(b => b.innerText.includes('CSAB Special Round 1/2') || b.innerText.includes('CSAB Special'));
    if (csabBtn) {
      csabBtn.click();
      'clicked';
    } else {
      'not found';
    }
  ` });
  await new Promise(r => setTimeout(r, 1500));

  // Find Edit Choices button
  const info = await send('Runtime.evaluate', { expression: `
    (() => {
      const section = document.getElementById('edit-choices-section');
      if (!section) return { foundSection: false };
      const btns = Array.from(section.querySelectorAll('button'));
      return { foundSection: true, btns: btns.map(b => b.innerText) };
    })()
  `, returnByValue: true });
  console.log('Buttons inside #edit-choices-section:', info.result.value);

  // Click Edit Choices button
  console.log('Clicking Edit Choices button...');
  await send('Runtime.evaluate', { expression: `
    const editBtn = Array.from(document.querySelectorAll('#edit-choices-section button')).find(b => b.innerText.includes('Edit Choices'));
    if (editBtn) editBtn.click();
  ` });
  await new Promise(r => setTimeout(r, 1000));

  const modalCheck = await send('Runtime.evaluate', { expression: `
    (() => {
      const h2 = Array.from(document.querySelectorAll('h2')).map(h => h.innerText);
      const isVisible = document.querySelector('.fixed.inset-0') !== null;
      const modalTitle = document.querySelector('h2');
      return { h2, isVisible, firstTitle: modalTitle ? modalTitle.innerText : null };
    })()
  `, returnByValue: true });
  console.log('Modal check after clicking Edit Choices:', modalCheck.result.value);

  // Capture open modal screenshot
  const fs = require('fs');
  const modalScreen = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('C:\\Users\\Raju\\.gemini\\antigravity\\brain\\20845224-7465-4d56-9c11-406ea7005c30\\screenshot_edit_choices_modal_open.png', Buffer.from(modalScreen.data, 'base64'));
  console.log('Saved modal screenshot to screenshot_edit_choices_modal_open.png');

  // Test clicking Save & Apply Changes
  console.log('Testing Save & Apply Changes...');
  const saveResult = await send('Runtime.evaluate', { expression: `
    (() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const saveBtn = btns.find(b => b.innerText.includes('Save & Apply'));
      if (saveBtn) {
        saveBtn.click();
        return 'clicked saveBtn successfully';
      }
      return 'saveBtn not found: ' + btns.map(b => b.innerText).join(' | ');
    })()
  `, returnByValue: true });
  console.log('Save result:', saveResult.result.value);
  await new Promise(r => setTimeout(r, 600));

  const bannerText = await send('Runtime.evaluate', { expression: `
    (() => {
      const el = document.body.innerText;
      return {
        hasSavedBanner: el.includes('Choice order saved'),
        hasCSVBtn: el.includes('Download CSV (Excel)')
      };
    })()
  `, returnByValue: true });
  console.log('Banner check:', bannerText.result.value);

  const afterSaveScreen = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('C:\\Users\\Raju\\.gemini\\antigravity\\brain\\20845224-7465-4d56-9c11-406ea7005c30\\screenshot_after_save_choices.png', Buffer.from(afterSaveScreen.data, 'base64'));
  console.log('Saved after save screenshot to screenshot_after_save_choices.png');

  edge.kill();
  process.exit(0);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
