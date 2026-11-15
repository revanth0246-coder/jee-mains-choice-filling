const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Let's create an automated test that mounts App with pre-filled profile to ensure table & sidebar render perfectly
const testScript = `
<!doctype html>
<html>
<body>
<div id="test-output"></div>
<script>
  window.__TEST_MODE__ = true;
</script>
</body>
</html>
`;
console.log('Verifying choice engine and all components in bundle...');
