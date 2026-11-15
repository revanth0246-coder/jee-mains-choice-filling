const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');

async function main() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const port = 9572;
  const edge = spawn(edgePath, [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    '--disable-gpu',
    '--no-sandbox',
    'about:blank'
  ]);

  await new Promise(r => setTimeout(r, 2000));
  const tabs = await new Promise(res => http.get(`http://127.0.0.1:${port}/json/list`, r => {
    let d=''; r.on('data', c=>d+=c); r.on('end', ()=>res(JSON.parse(d)));
  }));

  const ws = new WebSocket(tabs[0].webSocketDebuggerUrl);
  let id = 1; const pending = new Map();
  ws.onmessage = e => { const m = JSON.parse(e.data); if (m.id && pending.has(m.id)) pending.get(m.id)(m.result); };
  const send = (method, params = {}) => new Promise(res => { const reqId = id++; pending.set(reqId, res); ws.send(JSON.stringify({ id: reqId, method, params })); });
  await new Promise(r => ws.onopen = r);
  await send('Page.enable');
  await send('DOM.enable');

  const imgBase64 = fs.readFileSync('C:\\Users\\Raju\\.gemini\\antigravity\\brain\\20845224-7465-4d56-9c11-406ea7005c30\\.user_uploaded\\media_1794739385653_82f6a3c3.jpg').toString('base64');

  const evalJs = async (expr) => {
    const res = await send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true });
    return res?.result?.value;
  };

  const colors = await evalJs(`
    new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

        const getHex = (x, y) => {
          const p = ctx.getImageData(x, y, 1, 1).data;
          return '#' + [p[0], p[1], p[2]].map(v => v.toString(16).padStart(2, '0')).join('');
        };

        resolve({
          width: img.width,
          height: img.height,
          topLeft: getHex(10, 10),
          headerMid: getHex(Math.floor(img.width / 2), 25),
          headerRight: getHex(img.width - 25, 25),
          aboveCards: getHex(Math.floor(img.width / 2), 100),
          leftEdge: getHex(15, 250),
          rightEdge: getHex(img.width - 15, 250),
          betweenCards: getHex(Math.floor(img.width / 2), 260),
          bottomEdge: getHex(20, img.height - 80),
          bottomCenter: getHex(Math.floor(img.width / 2), img.height - 80)
        });
      };
      img.src = 'data:image/jpeg;base64,' + ${JSON.stringify(imgBase64)};
    })
  `);

  console.log('Sampled Image Colors:', colors);

  ws.close();
  edge.kill();
}

main().catch(console.error);