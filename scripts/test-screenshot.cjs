const { execSync } = require('child_process');
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const outPath = 'C:\\Users\\Raju\\.gemini\\antigravity\\brain\\20845224-7465-4d56-9c11-406ea7005c30\\screenshot_wizard_step1.png';
const url = 'http://localhost:5173';

const cmd = `"${edgePath}" --headless --no-sandbox --disable-gpu --screenshot="${outPath}" --window-size=1440,2200 "${url}"`;
console.log('Running:', cmd);
try {
  execSync(cmd, { stdio: 'inherit' });
  console.log('Screenshot captured successfully to:', outPath);
} catch (e) {
  console.error('Error running Edge:', e.message);
}
