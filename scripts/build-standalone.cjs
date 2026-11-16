const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const esbuild = require('esbuild');

console.log('Building standalone bundle with JEE College Finder Hero...');

try {
  const distDir = path.join(__dirname, '../dist');
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }

  // 1. Build complete standalone Tailwind CSS if not present or rebuild
  const styleCssPath = path.join(distDir, 'style.css');
  try {
    console.log('Compiling Tailwind CSS with CLI...');
    execSync('npx tailwindcss -i src/index.css -o dist/style.css --minify', {
      cwd: path.join(__dirname, '..'),
      stdio: 'inherit'
    });
  } catch (e) {
    console.warn('Tailwind compilation note:', e.message);
  }

  let css = '';
  if (fs.existsSync(styleCssPath)) {
    css = fs.readFileSync(styleCssPath, 'utf8');
    console.log(`Loaded built CSS: ${(css.length / 1024).toFixed(1)} KB`);
  }

  // 2. Build bundled JS using esbuild with jsx: 'automatic'
  const result = esbuild.buildSync({
    entryPoints: [path.join(__dirname, '../src/main.jsx')],
    bundle: true,
    write: false,
    format: 'iife',
    minify: true,
    jsx: 'automatic',
    define: {
      'process.env.NODE_ENV': '"production"'
    },
    loader: {
      '.js': 'jsx',
      '.jsx': 'jsx',
      '.css': 'empty',
      '.svg': 'dataurl',
      '.png': 'dataurl',
      '.jpg': 'dataurl',
      '.jpeg': 'dataurl'
    }
  });

  const bundledJs = result.outputFiles[0].text;
  console.log(`Bundled JS size: ${(bundledJs.length / 1024).toFixed(1)} KB`);

  // Ensure public assets (hero-banner, Google verification file) are in dist
  const heroSrc = path.join(__dirname, '../public/hero-banner.jpg');
  if (fs.existsSync(heroSrc)) {
    fs.copyFileSync(heroSrc, path.join(distDir, 'hero-banner.jpg'));
  }
  const googleVerifySrc = path.join(__dirname, '../public/googled8ac5e4950d2eb8a.html');
  if (fs.existsSync(googleVerifySrc)) {
    fs.copyFileSync(googleVerifySrc, path.join(distDir, 'googled8ac5e4950d2eb8a.html'));
  }

  // Create standalone HTML in index.html and dist/index.html
  const htmlContent = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="google-site-verification" content="skBNZ6eRIdfmmFon6FpEmBK0E_wZiselLZaBwTka2r4" />
    <title>JoSAA & CSAB College Predictor 2026 | JEE Main Choice Filling Tool</title>
    <meta name="description" content="Free JoSAA and CSAB college predictor and choice-filling order generator for JEE Main & Advanced candidates across IITs, NITs, IIITs, and GFTIs." />
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet">
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
      tailwind.config = {
        darkMode: 'class',
        theme: {
          extend: {
            colors: {
              background: '#040714',
              surface: {
                DEFAULT: '#0d1117',
                elevated: '#161b22',
                card: '#0f141c',
                border: '#1f293d',
              },
              josaa: {
                cyan: '#06b6d4',
                indigo: '#6366f1',
                violet: '#8b5cf6',
                emerald: '#10b981',
                amber: '#f59e0b',
                rose: '#f43f5e',
              }
            },
            fontFamily: {
              sans: ['Inter', 'system-ui', 'sans-serif'],
              mono: ['JetBrains Mono', 'monospace'],
            }
          }
        }
      };
    </script>
    <style>
      ${css}
      @keyframes target-pulse {
        0%, 100% {
          box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.4);
          background-color: rgba(99, 102, 241, 0.15);
        }
        50% {
          box-shadow: 0 0 25px 6px rgba(139, 92, 246, 0.6);
          background-color: rgba(139, 92, 246, 0.25);
        }
      }
      .animate-target-pulse {
        animation: target-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
      }
    </style>
  </head>
  <body class="bg-[#040714] text-slate-100 min-h-screen antialiased selection:bg-indigo-500/40 selection:text-indigo-200">
    <div id="root">
      <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #040714; color: #94a3b8; font-family: sans-serif; text-align: center; padding: 20px;">
        <div>
          <h2 style="color: #60a5fa; font-size: 24px; font-weight: bold; margin-bottom: 8px;">🎓 JEE College Finder 2026</h2>
          <p style="font-size: 14px; margin-bottom: 16px;">Starting Official Choice-Filling &amp; Allotment Studio...</p>
          <p style="font-size: 12px; color: #64748b;">If this message does not disappear in a few seconds, make sure JavaScript is enabled or open http://localhost:5173/</p>
        </div>
      </div>
    </div>
    <script>
      ${bundledJs}
    </script>
  </body>
</html>`;

  const indexPath = path.join(__dirname, '../index.html');
  fs.writeFileSync(indexPath, htmlContent, 'utf8');
  console.log('Successfully updated index.html with standalone self-contained bundle!');

  fs.writeFileSync(path.join(distDir, 'index.html'), htmlContent, 'utf8');

  // Also create a copy directly on the user's Desktop for 100% failproof opening!
  const desktopPath = 'C:\\Users\\Raju\\OneDrive\\Desktop\\JEE College Finder 2026.html';
  try {
    fs.writeFileSync(desktopPath, htmlContent, 'utf8');
    console.log('Created direct 1-click launcher on Desktop: JEE College Finder 2026.html');
  } catch (e) {
    console.warn('Could not write to desktop:', e.message);
  }

} catch (err) {
  console.error('Build error:', err);
  process.exit(1);
}
