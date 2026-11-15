/**
 * Utility to download the finalized JoSAA / CSAB Choice-Filling Sheet.
 * Generates an exact visual replica of the choice sheet shown on the website,
 * complete with candidate info, 4 summary cards, gold/green/blue category top borders,
 * closing cutoffs, margin pills, and median CTC.
 * Can be opened in any browser, printed/saved as PDF, or exported to Excel.
 */

export function downloadChoiceSheet(choices = [], candidateProfile = {}) {
  if (!choices || choices.length === 0) return;

  const isCSAB = candidateProfile?.counselingType === 'CSAB';
  const authorityName = isCSAB ? 'CSAB 2026 Special Vacancy' : 'JoSAA 2026';
  const rank = candidateProfile?.jeeMainRank ? Number(candidateProfile.jeeMainRank).toLocaleString() : '38,291';
  const rawRank = candidateProfile?.jeeMainRank ? Number(candidateProfile.jeeMainRank) : 38291;
  const category = candidateProfile?.category || 'OPEN';
  const state = candidateProfile?.homeState || 'All India';
  const dateStr = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
  const lockHash = (isCSAB ? 'CSAB-2026-' : 'JOSAA-2026-') + Math.random().toString(36).substring(2, 10).toUpperCase();

  // Partition into the 3 categories
  const topChoices = choices.filter(c => c.section === 'TOP' || c.colorTheme === 'gold' || c.zone === 'AMBITIOUS');
  const probableChoices = choices.filter(c => c.section === 'PROBABLE' || c.colorTheme === 'green' || c.zone === 'LIKELY');
  const easilyChoices = choices.filter(c => 
    c.section === 'EASILY' || 
    c.colorTheme === 'light_blue' || 
    c.zone === 'BACKUP' || 
    c.zone === 'EXTENDED' ||
    (!['TOP', 'PROBABLE'].includes(c.section) && c.colorTheme !== 'gold' && c.colorTheme !== 'green')
  );

  const ctcValues = choices.map(c => c.medianCTC).filter(Boolean);
  const avgCTC = ctcValues.length > 0 ? (ctcValues.reduce((a, b) => a + b, 0) / ctcValues.length).toFixed(1) : '21.0';
  const peakValues = choices.map(c => c.highestCTC).filter(Boolean);
  const highestCTC = peakValues.length > 0 ? Math.max(...peakValues).toFixed(1) : '70.2';

  const renderRow = (choice, index, theme) => {
    const delta = choice.delta ?? (choice.effectiveClosingRank - rawRank);
    const isShort = delta < 0;

    const numBadgeStyle = theme === 'gold'
      ? 'background: #fef3c7; color: #78350f; border: 1px solid #fde68a;'
      : theme === 'green'
      ? 'background: #d1fae5; color: #064e3b; border: 1px solid #a7f3d0;'
      : 'background: #e0f2fe; color: #0c4a6e; border: 1px solid #bae6fd;';

    const instBadgeStyle = choice.instituteType === 'IIT'
      ? 'background: #fffbeb; color: #b45309; border: 1px solid #fde68a;'
      : choice.instituteType === 'NIT'
      ? 'background: #eef2ff; color: #4338ca; border: 1px solid #c7d2fe;'
      : choice.instituteType === 'IIIT'
      ? 'background: #f0f9ff; color: #0369a1; border: 1px solid #bae6fd;'
      : 'background: #ecfdf5; color: #047857; border: 1px solid #a7f3d0;';

    let chancePill = '';
    if (isShort) {
      chancePill = `<span style="display: inline-block; padding: 2px 10px; border-radius: 9999px; font-size: 11px; font-weight: 700; background: #fff1f2; color: #be123c; border: 1px solid #fecdd3;">${Math.abs(delta).toLocaleString()} ranks short</span>`;
    } else if (theme === 'green') {
      chancePill = `<span style="display: inline-block; padding: 2px 10px; border-radius: 9999px; font-size: 11px; font-weight: 700; background: #ecfdf5; color: #047857; border: 1px solid #a7f3d0;">+${delta.toLocaleString()} buffer</span>`;
    } else {
      chancePill = `<span style="display: inline-block; padding: 2px 10px; border-radius: 9999px; font-size: 11px; font-weight: 700; background: #f0f9ff; color: #0369a1; border: 1px solid #bae6fd;">+${delta.toLocaleString()} safe</span>`;
    }

    return `
      <tr style="border-bottom: 1px solid #f1f5f9;">
        <td style="padding: 12px 16px; width: 50px; text-align: center;">
          <div style="display: inline-flex; align-items: center; justify-content: center; width: 28px; height: 28px; border-radius: 8px; font-size: 12px; font-weight: 800; font-family: monospace; ${numBadgeStyle}">
            ${choice.choiceNumber || index + 1}
          </div>
        </td>
        <td style="padding: 12px 16px;">
          <div style="font-size: 13px; font-weight: 800; color: #0f172a; letter-spacing: -0.01em;">
            ${choice.instituteName}
          </div>
          <div style="display: flex; flex-wrap: wrap; align-items: center; gap: 6px; margin-top: 3px; font-size: 11px; color: #64748b;">
            <span style="padding: 1px 6px; border-radius: 4px; font-size: 10px; font-weight: 800; ${instBadgeStyle}">
              ${choice.instituteType}
            </span>
            <span style="font-weight: 700; color: #334155;">${choice.branchCode}</span>
            <span>&bull;</span>
            <span>${choice.programName || choice.branchName}</span>
            <span>&bull;</span>
            <span>${choice.state || choice.city || ''}</span>
            <span>&bull;</span>
            <span>NIRF #${choice.nirf || 'N/A'}</span>
            <span>&bull;</span>
            <span style="font-weight: 600; color: #475569;">Quota: ${choice.quotaUsed || 'AI'}</span>
          </div>
        </td>
        <td style="padding: 12px 16px; text-align: right; width: 110px;">
          <span style="font-family: monospace; font-size: 13px; font-weight: 800; color: #0f172a;">
            ${Number(choice.effectiveClosingRank).toLocaleString()}
          </span>
        </td>
        <td style="padding: 12px 16px; text-align: right; width: 140px;">
          ${chancePill}
        </td>
        <td style="padding: 12px 16px; text-align: right; width: 110px;">
          <span style="font-family: monospace; font-size: 13px; font-weight: 700; color: #0f172a;">
            ₹${choice.medianCTC || 18.5} LPA
          </span>
        </td>
      </tr>
    `;
  };

  const renderSection = (title, badgeText, badgeColor, borderColor, headerGradient, list, theme) => {
    if (!list || list.length === 0) return '';
    return `
      <div style="margin-bottom: 24px; border-radius: 16px; background: #ffffff; border: 1px solid #e2e8f0; border-top: 4px solid ${borderColor}; box-shadow: 0 1px 3px rgba(0,0,0,0.05); overflow: hidden;">
        <div style="padding: 14px 20px; background: ${headerGradient}; border-bottom: 1px solid #e2e8f0; display: flex; align-items: center; justify-content: space-between;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <span style="font-size: 13px; font-weight: 800; color: #0f172a; text-transform: uppercase; letter-spacing: 0.05em;">
              ${title}
            </span>
            <span style="font-size: 10px; font-weight: 800; padding: 2px 8px; border-radius: 9999px; ${badgeColor}">
              ${badgeText}
            </span>
          </div>
          <span style="font-family: monospace; font-size: 11px; font-weight: 700; padding: 3px 10px; border-radius: 9999px; background: #ffffff; border: 1px solid #cbd5e1; color: #334155;">
            ${list.length} Colleges
          </span>
        </div>
        <table style="width: 100%; border-collapse: collapse; text-align: left;">
          <tbody>
            ${list.map((c, i) => renderRow(c, i, theme)).join('')}
          </tbody>
        </table>
      </div>
    `;
  };

  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${authorityName} - Choice-Filling Sheet (CRL #${rank})</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Inter", sans-serif;
      background: #eef2fe;
      color: #0f172a;
      line-height: 1.5;
      padding-bottom: 50px;
    }
    .print-hide {
      position: sticky;
      top: 0;
      z-index: 50;
      background: #081126;
      border-bottom: 1px solid rgba(255,255,255,0.15);
      padding: 12px 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      color: #ffffff;
      box-shadow: 0 4px 12px rgba(0,0,0,0.25);
    }
    .btn {
      padding: 8px 16px;
      border-radius: 9999px;
      font-size: 12px;
      font-weight: 700;
      cursor: pointer;
      border: none;
      transition: all 0.2s;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }
    .btn-print {
      background: #ffffff;
      color: #0f172a;
    }
    .btn-print:hover { background: #f1f5f9; }
    .btn-csv {
      background: #10b981;
      color: #ffffff;
    }
    .btn-csv:hover { background: #059669; }
    .header-banner {
      background: linear-gradient(135deg, #0c1439 0%, #16245f 50%, #25338d 100%);
      color: #ffffff;
      padding: 32px 24px 44px 24px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.15);
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
    }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 16px;
      margin-top: 24px;
    }
    .stat-card {
      background: #ffffff;
      border-radius: 16px;
      padding: 18px 20px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.08);
      border: 1px solid rgba(226, 232, 240, 0.9);
      color: #0f172a;
    }
    .table-container {
      max-width: 1200px;
      margin: -20px auto 0 auto;
      padding: 0 24px;
    }
    .table-header {
      background: #f1f5f9;
      border: 1px solid #cbd5e1;
      border-radius: 12px;
      padding: 10px 16px;
      display: flex;
      justify-content: space-between;
      font-size: 11px;
      font-weight: 800;
      color: #475569;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 16px;
    }
    @media print {
      .print-hide { display: none !important; }
      body { background: #ffffff !important; }
      .header-banner { padding: 20px !important; }
      .table-container { margin-top: 10px !important; }
    }
  </style>
</head>
<body>

  <!-- Top Action Toolbar -->
  <div class="print-hide">
    <div style="display: flex; align-items: center; gap: 10px;">
      <span style="font-weight: 800; font-size: 14px;">JEE College Finder 2026</span>
      <span style="color: rgba(255,255,255,0.4);">&bull;</span>
      <span style="font-size: 12px; color: #cbd5e1;">Official Choice-Filling Sheet</span>
      <span style="font-family: monospace; font-size: 11px; background: rgba(255,255,255,0.15); padding: 2px 8px; border-radius: 6px;">${lockHash}</span>
    </div>
    <div style="display: flex; align-items: center; gap: 8px;">
      <button class="btn btn-csv" onclick="exportToCSV()">
        <span>📊 Export Excel (CSV)</span>
      </button>
      <button class="btn btn-print" onclick="window.print()">
        <span>🖨️ Print / Save as PDF</span>
      </button>
    </div>
  </div>

  <!-- Royal Navy Top Banner -->
  <div class="header-banner">
    <div class="container">
      <div style="display: flex; align-items: center; gap: 8px; font-size: 12px; font-weight: 700; color: #818cf8; text-transform: uppercase; letter-spacing: 0.05em;">
        <span>${authorityName}</span>
        <span>&bull;</span>
        <span style="color: #cbd5e1;">Official Verified Allotment Matrix</span>
      </div>
      <h1 style="font-size: 28px; font-weight: 900; margin-top: 6px; letter-spacing: -0.02em;">
        Your ${isCSAB ? 'CSAB Special' : 'JoSAA'} Choice-Filling Sheet
      </h1>
      <p style="font-size: 13px; color: #cbd5e1; margin-top: 4px;">
        ${choices.length} colleges ranked for CRL #${rank} &bull; Category: ${category} &bull; Home State: ${state} &bull; Generated: ${dateStr}
      </p>

      <!-- 4 Summary Stats Cards -->
      <div class="stats-grid">
        
        <div class="stat-card">
          <div style="font-size: 11px; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em;">
            Total Choices
          </div>
          <div style="font-size: 26px; font-weight: 900; color: #0f172a; font-family: monospace; margin-top: 4px;">
            ${choices.length}
          </div>
          <div style="font-size: 11px; color: #64748b; margin-top: 2px;">
            ${isCSAB ? 'CSAB Special vacancy pool' : 'JoSAA participating pool'}
          </div>
        </div>

        <div class="stat-card">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <span style="font-size: 11px; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em;">
              Dream Colleges
            </span>
            <span style="font-size: 10px; font-weight: 800; padding: 2px 6px; border-radius: 9999px; background: #fef3c7; color: #92400e;">
              Gold
            </span>
          </div>
          <div style="font-size: 26px; font-weight: 900; color: #d97706; font-family: monospace; margin-top: 4px;">
            ${topChoices.length}
          </div>
          <div style="font-size: 11px; color: #64748b; margin-top: 2px;">
            Rank #1 aspirational seats
          </div>
        </div>

        <div class="stat-card">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <span style="font-size: 11px; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em;">
              Most Probable
            </span>
            <span style="font-size: 10px; font-weight: 800; padding: 2px 6px; border-radius: 9999px; background: #d1fae5; color: #065f46;">
              Emerald
            </span>
          </div>
          <div style="font-size: 26px; font-weight: 900; color: #059669; font-family: monospace; margin-top: 4px;">
            ${probableChoices.length}
          </div>
          <div style="font-size: 11px; color: #64748b; margin-top: 2px;">
            Target allotment zone
          </div>
        </div>

        <div class="stat-card">
          <div style="font-size: 11px; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em;">
            Avg Package
          </div>
          <div style="font-size: 26px; font-weight: 900; color: #0f172a; font-family: monospace; margin-top: 4px;">
            ₹${avgCTC} LPA
          </div>
          <div style="font-size: 11px; color: #64748b; margin-top: 2px;">
            Peak ₹${highestCTC} LPA
          </div>
        </div>

      </div>

    </div>
  </div>

  <!-- Main Table Container Sitting on Light Canvas -->
  <div class="table-container">

    <!-- Table Header Columns -->
    <div class="table-header">
      <div style="display: flex; align-items: center; gap: 8px;">
        <span style="width: 40px; text-align: center;">#</span>
        <span>COLLEGE &amp; ACADEMIC BRANCH</span>
      </div>
      <div style="display: flex; align-items: center; gap: 40px;">
        <span style="width: 100px; text-align: right;">CLOSING RANK</span>
        <span style="width: 130px; text-align: right;">YOUR CHANCE</span>
        <span style="width: 100px; text-align: right;">MEDIAN CTC</span>
      </div>
    </div>

    <!-- Section 1: Top Colleges (Dream) - Gold Top Border -->
    ${renderSection(
      'Top Colleges (Dream)',
      'Gold',
      'background: #fef3c7; color: #92400e; border: 1px solid #fde68a;',
      '#f59e0b',
      'linear-gradient(to right, #fffbeb, #ffffff)',
      topChoices,
      'gold'
    )}

    <!-- Section 2: Most Probable Colleges - Emerald Green Top Border -->
    ${renderSection(
      'Most Probable Colleges',
      'Emerald Green',
      'background: #d1fae5; color: #065f46; border: 1px solid #a7f3d0;',
      '#10b981',
      'linear-gradient(to right, #ecfdf5, #ffffff)',
      probableChoices,
      'green'
    )}

    <!-- Section 3: Easily Coming (Safe) - Sky Blue Top Border -->
    ${renderSection(
      'Easily Coming (Safe)',
      'Sky Blue',
      'background: #e0f2fe; color: #075985; border: 1px solid #bae6fd;',
      '#38bdf8',
      'linear-gradient(to right, #f0f9ff, #ffffff)',
      easilyChoices,
      'light_blue'
    )}

  </div>

  <script>
    function exportToCSV() {
      const data = ${JSON.stringify(choices.map((c, i) => ({
        choiceNo: i + 1,
        institute: c.instituteName,
        type: c.instituteType,
        branchCode: c.branchCode,
        program: c.programName || c.branchName,
        quota: c.quotaUsed || 'AI',
        cutoff: c.effectiveClosingRank,
        margin: (c.delta ?? (c.effectiveClosingRank - rawRank)) >= 0 ? '+' + (c.delta ?? (c.effectiveClosingRank - rawRank)) + ' buffer' : Math.abs(c.delta ?? (c.effectiveClosingRank - rawRank)) + ' ranks short',
        ctc: c.medianCTC || 18.5,
        nirf: c.nirf || '',
        state: c.state || c.city || ''
      })))};

      const headers = ['Choice_No','Institute_Name','Institute_Type','Branch_Code','Program_Name','Quota','Closing_Cutoff','Your_Chance','Median_CTC_LPA','NIRF','State'];
      const rows = data.map(d => [
        d.choiceNo,
        '"' + (d.institute || '').replace(/"/g, '""') + '"',
        '"' + d.type + '"',
        '"' + d.branchCode + '"',
        '"' + (d.program || '').replace(/"/g, '""') + '"',
        '"' + d.quota + '"',
        d.cutoff,
        '"' + d.margin + '"',
        d.ctc,
        d.nirf,
        '"' + (d.state || '') + '"'
      ].join(','));

      const csvContent = '\\uFEFF' + [headers.join(','), ...rows].join('\\r\\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = '${isCSAB ? 'CSAB' : 'JoSAA'}_2026_Choice_Sheet_CRL_${rawRank}.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  </script>
</body>
</html>`;

  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${isCSAB ? 'CSAB' : 'JoSAA'}_2026_Choice_Sheet_CRL_${rawRank}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Keep CSV and JSON export functions for internal flexibility
export function downloadChoicesCSV(choices, candidateProfile) {
  downloadChoiceSheet(choices, candidateProfile);
}

export function downloadChoicesText(choices, candidateProfile) {
  downloadChoiceSheet(choices, candidateProfile);
}

export function downloadChoicesJSON(choices, candidateProfile) {
  downloadChoiceSheet(choices, candidateProfile);
}
