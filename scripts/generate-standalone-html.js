import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Read the generated dataset
const josaaCutoffsContent = fs.readFileSync(path.resolve(__dirname, '../src/data/josaaCutoffs.js'), 'utf8');

// Extract the data variables
// We can embed the exact dataset and engine logic directly into index.html
console.log('Building standalone index.html...');
