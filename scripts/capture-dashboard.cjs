const { execSync } = require('child_process');
const fs = require('fs');

// We test Edge with an HTML that preloads localStorage or simulates generation
const testHtml = `
<!doctype html>
<html>
<head>
<script>
  localStorage.setItem('josaa_has_generated_2026', 'true');
  localStorage.setItem('josaa_candidate_profile_2026', JSON.stringify({
    jeeMainRank: 4200,
    isJeeAdvQualified: true,
    jeeAdvRank: 3400,
    homeState: 'Kerala',
    category: 'OPEN',
    genderPool: 'Gender-Neutral'
  }));
  window.location.replace('file:///' + ${JSON.stringify(process.cwd().replace(/\\/g, '/'))} + '/index.html');
</script>
</head>
<body>Redirecting...</body>
</html>
`;

fs.writeFileSync('test-redirect.html', testHtml, 'utf8');
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const redirectUrl = 'file:///' + process.cwd().replace(/\\/g, '/') + '/test-redirect.html';

console.log('Capturing dashboard screenshot...');
try {
  execSync(`"${edgePath}" --headless --screenshot="C:\\Users\\Raju\\.gemini\\antigravity\\brain\\20845224-7465-4d56-9c11-406ea7005c30\\screenshot_dashboard_final.png" --window-size=1440,1400 "${redirectUrl}"`);
  console.log('Dashboard screenshot captured successfully!');
} catch (e) {
  console.error(e.message);
}
