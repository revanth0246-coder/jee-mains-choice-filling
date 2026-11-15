const { execSync } = require('child_process');

try {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const htmlPath = 'file:///' + process.cwd().replace(/\\/g, '/') + '/index.html';
  console.log('Testing file URL:', htmlPath);
  const out = execSync(`"${edgePath}" --headless --dump-dom "${htmlPath}"`, { maxBuffer: 10 * 1024 * 1024 }).toString();
  console.log('DOM length:', out.length);
  const hasApp = out.includes('JEE College Finder');
  console.log('Renders JEE College Finder:', hasApp);
} catch (e) {
  console.error('Error:', e.message);
}
