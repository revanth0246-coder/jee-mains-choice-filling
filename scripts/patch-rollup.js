import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rollupNativePath = path.resolve(__dirname, '../node_modules/rollup/dist/native.js');

if (fs.existsSync(rollupNativePath)) {
  let content = fs.readFileSync(rollupNativePath, 'utf8');
  if (!content.includes("@rollup/wasm-node/dist/native.js")) {
    const target = `const nativeModule = requireWithFriendlyError(\n\texistsSync(path.join(__dirname, localName)) ? localName : \`@rollup/rollup-\${packageBase}\`\n);`;
    const replacement = `let nativeModule;
try {
\tnativeModule = requireWithFriendlyError(
\t\texistsSync(path.join(__dirname, localName)) ? localName : \`@rollup/rollup-\${packageBase}\`
\t);
} catch (e) {
\tnativeModule = require('@rollup/wasm-node/dist/native.js');
}`;
    if (content.includes(target)) {
      content = content.replace(target, replacement);
      fs.writeFileSync(rollupNativePath, content, 'utf8');
      console.log('Successfully patched rollup with wasm fallback');
    }
  }
}
