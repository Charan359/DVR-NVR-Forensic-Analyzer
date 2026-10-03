// ============================================================
// DVR/NVR Forensic Analyzer — main.js
// Real tool demo logic, no slide-presentation code
// ============================================================

// ===== GLOBAL STATE =====
const state = {
    vendor: null,
    caseNum: 'CASE-2024-12345',
    investigator: 'Detective Ravi Sharma',
    deviceHash: null,
    imagingDone: false,
    fsParsed: false,
    carvedSegments: [],
    cocEntries: [],
};

// ===== VENDOR DATABASE =====
const vendors = {
    dahua:    { name: 'Dahua Technology',    model: 'NVR5232-4KS2',       fs: 'DHFS (Dahua Hybrid FS)',          codec: 'H.265+', capacity: '8TB',  rate: 91.8, drift: '+23s', sectors: 15728640 },
    hikvision:{ name: 'Hikvision',           model: 'DS-7608NI-K2/8P',    fs: 'WFS (Hikvision FS)',              codec: 'H.264',  capacity: '4TB',  rate: 87.3, drift: '+47s', sectors: 7864320  },
    honeywell:{ name: 'Honeywell Security',  model: 'HEN-NVR-8MP',        fs: 'Proprietary (Reversed)',          codec: 'H.264',  capacity: '2TB',  rate: 89.5, drift: '+11s', sectors: 3932160  },
    tplink:   { name: 'TP-Link',             model: 'NVR1208H-8MP',       fs: 'Linux EXT4-Based',                codec: 'H.264',  capacity: '1TB',  rate: 85.2, drift: '0s',  sectors: 1966080  },
    cpplus:   { name: 'CP Plus',             model: 'CP-NVR-4U08',        fs: 'RSFS (CP Proprietary)',           codec: 'H.265',  capacity: '4TB',  rate: 88.0, drift: '+8s', sectors: 7864320  },
    godrej:   { name: 'Godrej Security',     model: 'Auditplus 16',        fs: 'Custom Compression (Godrej)',     codec: 'H.264',  capacity: '2TB',  rate: 86.5, drift: '+31s',sectors: 3932160  },
    matrix:   { name: 'Matrix Surveillance', model: 'SATATYA-4U',          fs: 'Encrypted Proprietary',           codec: 'H.265',  capacity: '8TB',  rate: 90.1, drift: '+15s', sectors: 15728640 },
    uniview:  { name: 'Uniview Systems',     model: 'NVR 308-32E',         fs: 'Uniview Proprietary',             codec: 'H.264',  capacity: '6TB',  rate: 87.9, drift: '+19s', sectors: 11796480 },
};

// ===== NAVIGATION =====
window.showPage = function(pageId, el) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
    if (el) el.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

// ===== UTILITY =====
function fakeHash(len = 64) {
    return Array.from({ length: len }, () => Math.floor(Math.random() * 16).toString(16)).join('');
}

function fakeSectors(n) {
    return Math.floor(Math.random() * 1000 + n);
}

function appendLog(termId, msg, cls = '') {
    const t = document.getElementById(termId);
    if (!t) return;
    t.innerHTML += `\n<span class="${cls}">${msg}</span>`;
    t.scrollTop = t.scrollHeight;
}

function updateFlowStep(stepId, done = false) {
    const el = document.getElementById(stepId);
    if (!el) return;
    if (done) {
        el.classList.remove('active-step');
        el.classList.add('done-step');
    } else {
        el.classList.add('active-step');
    }
}

function updateDashboardStats() {
    const carved = document.getElementById('dash-carved');
    const hashEl = document.getElementById('dash-hash-status');
    const cocEl  = document.getElementById('dash-coc');
    if (carved) carved.textContent = state.carvedSegments.length;
    if (hashEl) hashEl.textContent = state.deviceHash ? 'Verified ✓' : '—';
    if (cocEl)  cocEl.textContent  = state.cocEntries.length;

    // activity log
    const logEl = document.getElementById('activity-log');
    if (logEl && state.vendor) {
        const v = vendors[state.vendor];
        logEl.innerHTML = `
<span class="t-ok">[✓] Device connected: ${v.model} (${v.capacity})</span>
<span class="t-ok">[✓] File system identified: ${v.fs}</span>
<span class="t-hash">[✓] SHA-256: ${(state.deviceHash || '').substring(0, 20)}...</span>
<span class="t-ok">[✓] Carved segments: ${state.carvedSegments.length}</span>
<span class="t-ok">[✓] Chain of custody entries: ${state.cocEntries.length}</span>
        `.trim();
    }
}

// ===== DEVICE SCANNER =====
window.scanDevice = function() {
    const v = document.getElementById('vendor-select').value;
    if (!v) { alert('Please select a vendor.'); return; }

    state.vendor = v;
    state.caseNum = document.getElementById('case-num-input').value || state.caseNum;
    state.investigator = document.getElementById('investigator-input').value || state.investigator;
    document.getElementById('active-case-label').textContent = state.caseNum;

    const vd = vendors[v];
    const term = document.getElementById('scan-terminal');
    term.innerHTML = '';

    const lines = [
        ['t-cmd',  `[~] Initializing DVR/NVR Forensic Analyzer...`],
        ['t-muted',`[~] Vendor: ${vd.name}  |  Model: ${vd.model}`],
        ['t-ok',   `[✓] Write-blocker ENGAGED — drive is read-only`],
        ['t-ok',   `[✓] Drive capacity: ${vd.capacity}  |  Total sectors: ${vd.sectors.toLocaleString()}`],
        ['t-cmd',  `[~] Scanning drive headers...`],
        ['t-ok',   `[✓] File system signature detected: ${vd.fs}`],
        ['t-ok',   `[✓] Primary codec: ${vd.codec}`],
        ['t-ok',   `[✓] Timestamp drift: ${vd.drift}`],
        ['t-hash', `[✓] SHA-256 (pre-image): ${fakeHash(32)}...`],
        ['t-ok',   `[✓] Device profile complete — ready for imaging`],
    ];

    let i = 0;
    const interval = setInterval(() => {
        if (i >= lines.length) { clearInterval(interval); showDeviceProfile(vd); return; }
        const [cls, msg] = lines[i++];
        appendLog('scan-terminal', msg, cls);
    }, 180);

    appendLog('activity-log', `[Device Scanner] Scanning ${vd.name} ${vd.model}...`, 't-cmd');
};

function showDeviceProfile(vd) {
    const card = document.getElementById('device-details-card');
    const profile = document.getElementById('device-profile');
    card.style.display = 'block';

    profile.innerHTML = `
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px,1fr)); gap:1rem; margin-bottom:1rem;">
            ${[
                ['Vendor',      vd.name],
                ['Model',       vd.model],
                ['File System', vd.fs],
                ['Codec',       vd.codec],
                ['Capacity',    vd.capacity],
                ['Sectors',     vd.sectors.toLocaleString()],
                ['Drift',       vd.drift],
                ['Est. Recovery', `<span style="color:var(--green); font-weight:800;">${vd.rate}%</span>`],
            ].map(([k, val]) => `
                <div style="background:#F9FAFB; border:1px solid var(--border); border-radius:8px; padding:0.8rem;">
                    <div style="font-size:0.72rem; font-weight:700; color:var(--text-light); text-transform:uppercase; letter-spacing:0.5px;">${k}</div>
                    <div style="font-size:0.9rem; font-weight:600; margin-top:0.2rem;">${val}</div>
                </div>
            `).join('')}
        </div>
        <div class="alert alert-success">✓ Device identified successfully. Proceed to <strong>Forensic Imaging</strong> to create a verified disk image.</div>
    `;
}

window.clearScan = function() {
    document.getElementById('scan-terminal').innerHTML = '<span class="t-muted">Awaiting device connection...</span>';
    document.getElementById('device-details-card').style.display = 'none';
};

// ===== FORENSIC IMAGING =====
window.startImaging = function() {
    if (!state.vendor) { alert('Scan a device first in the Device Scanner module.'); return; }
    const vd = vendors[state.vendor];
    const log = document.getElementById('acq-log');
    const progressWrap = document.getElementById('acq-progress');
    const bar = document.getElementById('acq-bar');
    const pctEl = document.getElementById('acq-progress-pct');
    const labelEl = document.getElementById('acq-progress-label');

    log.innerHTML = '';
    progressWrap.style.display = 'block';
    document.getElementById('acq-result-card').style.display = 'none';

    const phases = [
        [5,  't-cmd',  `[~] Initializing write-blocker for ${vd.model}...`],
        [15, 't-ok',   `[✓] Write-blocker ACTIVE — device is read-only`],
        [20, 't-cmd',  `[~] Reading MBR / partition table...`],
        [30, 't-ok',   `[✓] Partition identified: ${vd.fs}`],
        [35, 't-cmd',  `[~] Creating ${document.getElementById('img-format').value.split('—')[0].trim()} forensic image...`],
        [60, 't-ok',   `[~] Imaging in progress: ${Math.floor(vd.sectors * 0.6).toLocaleString()} / ${vd.sectors.toLocaleString()} sectors`],
        [85, 't-ok',   `[~] Imaging in progress: ${Math.floor(vd.sectors * 0.85).toLocaleString()} / ${vd.sectors.toLocaleString()} sectors`],
        [95, 't-ok',   `[✓] Imaging complete: ${vd.sectors.toLocaleString()} sectors written`],
        [98, 't-cmd',  `[~] Computing SHA-256 hash of acquired image...`],
        [100,'t-hash', `[✓] SHA-256: ${fakeHash()}`],
    ];

    let phase = 0;
    let pct = 0;

    const iv = setInterval(() => {
        pct += 1;
        bar.style.width = pct + '%';
        pctEl.textContent = pct + '%';

        if (phase < phases.length && pct >= phases[phase][0]) {
            const [, cls, msg] = phases[phase++];
            appendLog('acq-log', msg, cls);
            if (pct === 98) labelEl.textContent = 'Computing hash...';
        }

        if (pct >= 100) {
            clearInterval(iv);
            state.deviceHash = fakeHash();
            state.imagingDone = true;
            labelEl.textContent = 'Acquisition complete ✓';
            showAcqCertificate(vd);
            updateFlowStep('flow-1', true);
            updateFlowStep('flow-2', true);
            updateDashboardStats();
            appendLog('activity-log', `[Imaging] ${vd.model} — SHA-256 acquired.`, 't-ok');
        }
    }, 40);
};

function showAcqCertificate(vd) {
    const card = document.getElementById('acq-result-card');
    card.style.display = 'block';
    document.getElementById('acq-certificate').innerHTML = `
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem; margin-bottom:1rem;">
            <div>
                <p style="font-size:0.8rem; color:var(--text-light);">PRE-IMAGE SHA-256</p>
                <div class="hash-display">${fakeHash()}</div>
            </div>
            <div>
                <p style="font-size:0.8rem; color:var(--text-light);">POST-IMAGE SHA-256 (Verification)</p>
                <div class="hash-display" style="color:#66BB6A;">${state.deviceHash}</div>
            </div>
        </div>
        <div class="alert alert-success">
            ✓ <strong>Hashes match — Image integrity verified.</strong> The forensic image is an exact bit-for-bit copy of the original drive. Court admissibility confirmed per ISO/IEC 27037.
        </div>
        <div style="font-size:0.82rem; color:var(--text-mid);">
            Acquired: ${new Date().toLocaleString()} &nbsp;|&nbsp; 
            Device: ${vd.name} ${vd.model} &nbsp;|&nbsp; 
            Capacity: ${vd.capacity} &nbsp;|&nbsp;
            Investigator: ${state.investigator}
        </div>
    `;
}

window.verifyHash = function() {
    if (!state.deviceHash) { alert('Run imaging first to generate a hash.'); return; }
    appendLog('acq-log', `[✓] Hash verification: MATCH — Image integrity intact.`, 't-ok');
};

// ===== FILE SYSTEM PARSER =====
window.parseFS = function() {
    if (!state.imagingDone) { alert('Please complete Forensic Imaging first.'); return; }
    const vd = vendors[state.vendor];
    const fsType = document.getElementById('fs-type').value;
    const log = document.getElementById('fs-log');
    log.innerHTML = '';

    const msgs = [
        ['t-cmd',  `[~] Loading forensic image...`],
        ['t-ok',   `[✓] Image loaded: ${vd.capacity} — ${vd.sectors.toLocaleString()} sectors`],
        ['t-cmd',  `[~] Scanning boot sector and partition table...`],
        ['t-ok',   `[✓] Boot signature found at sector 0`],
        ['t-cmd',  `[~] Parsing ${fsType}...`],
        ['t-ok',   `[✓] Index block table found at offset 0x00004000`],
        ['t-ok',   `[✓] ${fakeSectors(1200)} index entries parsed`],
        ['t-ok',   `[✓] Video segment directory: ${fakeSectors(600)} entries`],
        ['t-warn', `[!] ${fakeSectors(40)} orphaned entries detected (deleted files)`],
        ['t-ok',   `[✓] File system map complete`],
    ];

    let i = 0;
    const iv = setInterval(() => {
        if (i >= msgs.length) {
            clearInterval(iv);
            state.fsParsed = true;
            showFSMap(vd);
            updateFlowStep('flow-3', true);
            updateDashboardStats();
            appendLog('activity-log', `[FS Parser] ${vd.fs} parsed successfully.`, 't-ok');
            return;
        }
        const [cls, msg] = msgs[i++];
        appendLog('fs-log', msg, cls);
    }, 200);
};

function showFSMap(vd) {
    const card = document.getElementById('fs-result-card');
    card.style.display = 'block';
    const active = fakeSectors(600);
    const deleted = fakeSectors(80);
    const orphaned = fakeSectors(40);
    const total = active + deleted + orphaned;

    document.getElementById('fs-map').innerHTML = `
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(180px,1fr)); gap:1rem; margin-bottom:1rem;">
            ${[
                ['Active Segments',   active,   'green'],
                ['Deleted Segments',  deleted,  'red'],
                ['Orphaned Entries',  orphaned, 'amber'],
                ['Total Indexed',     total,    'blue'],
            ].map(([l, n, c]) => `
                <div class="stat-tile">
                    <div class="icon-wrap ${c}">${c === 'green' ? '✅' : c === 'red' ? '🗑️' : c === 'amber' ? '⚠️' : '📊'}</div>
                    <div><div class="val">${n.toLocaleString()}</div><div class="lbl">${l}</div></div>
                </div>
            `).join('')}
        </div>
        <div class="alert alert-info">
            <strong>${deleted + orphaned}</strong> deleted/orphaned entries found — proceed to <strong>Video Carver</strong> to attempt recovery using H.264/H.265 NAL unit signatures.
        </div>
        <div style="background:#F9FAFB; border:1px solid var(--border); border-radius:8px; padding:1rem; font-family:var(--mono); font-size:0.78rem;">
            FS Type: ${vd.fs}<br>
            Block Size: 4096 bytes<br>
            Total Sectors: ${vd.sectors.toLocaleString()}<br>
            Index Block Offset: 0x00004000<br>
            Codec: ${vd.codec}
        </div>
    `;
}

// ===== VIDEO CARVER =====
window.startCarving = function() {
    if (!state.fsParsed) { alert('Please run the File System Parser first.'); return; }
    const vd = vendors[state.vendor];
    const log = document.getElementById('carve-log');
    const progressWrap = document.getElementById('carve-progress');
    const bar = document.getElementById('carve-bar');
    const pctEl = document.getElementById('carve-pct');

    log.innerHTML = '';
    progressWrap.style.display = 'block';
    state.carvedSegments = [];

    const segCount = Math.floor(vd.rate * 14);

    const msgs = [
        ['t-cmd',  `[~] Scanning unallocated space for H.264/H.265 NAL unit headers...`],
        ['t-ok',   `[✓] NAL start codes detected at sector 0x00080000`],
        ['t-cmd',  `[~] Extracting IDR frames and GOP structures...`],
        ['t-ok',   `[~] Carving in progress...`],
    ];

    let mi = 0;
    let pct = 0;

    const iv = setInterval(() => {
        pct += 1;
        bar.style.width = pct + '%';
        pctEl.textContent = pct + '%';

        if (mi < msgs.length && pct % 12 === 0) {
            const [cls, msg] = msgs[mi++];
            appendLog('carve-log', msg, cls);
        }

        if (pct === 70) appendLog('carve-log', `[~] ${Math.floor(segCount * 0.7)} segments recovered so far...`, 't-ok');
        if (pct === 90) appendLog('carve-log', `[~] Timestamp drift correction: ${vd.drift}`, 't-warn');

        if (pct >= 100) {
            clearInterval(iv);
            appendLog('carve-log', `[✓] Carving complete — ${segCount} segments recovered (${vd.rate}% recovery rate)`, 't-ok');
            buildCarvedSegments(segCount, vd);
            updateFlowStep('flow-4', true);

            const badge = document.getElementById('carver-badge');
            if (badge) badge.textContent = segCount;
            updateDashboardStats();
            appendLog('activity-log', `[Video Carver] ${segCount} segments recovered from ${vd.model}.`, 't-ok');
        }
    }, 30);
};

function buildCarvedSegments(count, vd) {
    state.carvedSegments = Array.from({ length: Math.min(count, 20) }, (_, i) => {
        const date = new Date(2024, 0, 15, Math.floor(Math.random() * 20), Math.floor(Math.random() * 60));
        return {
            id: `SEG-${String(i + 1).padStart(3, '0')}`,
            date: date.toLocaleString(),
            duration: `${Math.floor(Math.random() * 30 + 1)}min ${Math.floor(Math.random() * 60)}sec`,
            size: `${(Math.random() * 80 + 10).toFixed(1)} MB`,
            codec: vd.codec,
            status: Math.random() > 0.15 ? 'Recovered' : 'Partial',
        };
    });

    const card = document.getElementById('carved-segments-card');
    const list = document.getElementById('segment-list');
    const countEl = document.getElementById('seg-count');
    card.style.display = 'block';
    countEl.textContent = count;

    list.innerHTML = state.carvedSegments.map(seg => `
        <div class="segment-card">
            <div class="seg-thumb">🎞️</div>
            <div class="seg-info">
                <div class="seg-name">${seg.id} — ${seg.date}</div>
                <div class="seg-meta">${seg.duration} &nbsp;·&nbsp; ${seg.size} &nbsp;·&nbsp; ${seg.codec} &nbsp;·&nbsp;
                    <span style="color:${seg.status === 'Recovered' ? 'var(--green)' : 'var(--amber)'}; font-weight:700;">${seg.status}</span>
                </div>
            </div>
            <div class="seg-actions">
                <button class="btn btn-outline btn-sm" onclick="previewSegment('${seg.id}')">▶ Preview</button>
                <button class="btn btn-primary btn-sm" onclick="addSegToCoC('${seg.id}')">+ CoC</button>
            </div>
        </div>
    `).join('') + `
        ${count > 20 ? `<div class="alert alert-info" style="margin-top:0.8rem;">Showing 20 of <strong>${count}</strong> recovered segments. Full list available in the report.</div>` : ''}
    `;
}

window.previewSegment = function(id) {
    alert(`Segment ${id}\n\nIn the full tool this opens the unified forensic video player with:\n• Frame-by-frame scrubbing\n• Metadata overlay (GPS, timestamp)\n• Motion detection markers\n• Export to standard MP4/AVI`);
};

window.addSegToCoC = function(id) {
    showPage('chain-custody', null);
    document.getElementById('coc-action').value = 'Video Carving Performed';
    alert(`Segment ${id} referenced in Chain of Custody. Switch to the CoC module and record the action.`);
};

window.clearCarving = function() {
    state.carvedSegments = [];
    document.getElementById('carved-segments-card').style.display = 'none';
    document.getElementById('carve-log').innerHTML = '<span class="t-muted">[Ready] Configure carving parameters and run.</span>';
    document.getElementById('carve-progress').style.display = 'none';
    const badge = document.getElementById('carver-badge');
    if (badge) badge.textContent = '0';
    updateDashboardStats();
};

// ===== TIMELINE =====
window.buildTimeline = function() {
    if (state.carvedSegments.length === 0) {
        alert('Run the Video Carver first to recover segments.');
        return;
    }

    const drift = document.getElementById('drift-val').value;
    const list = document.getElementById('timeline-list');
    const sorted = [...state.carvedSegments].sort((a, b) => new Date(a.date) - new Date(b.date));

    list.innerHTML = sorted.map(seg => `
        <div class="timeline-item">
            <div class="tl-dot ${seg.status === 'Recovered' ? 'green' : 'amber'}">${seg.status === 'Recovered' ? '✓' : '~'}</div>
            <div class="tl-content">
                <h4>${seg.id} — ${seg.date}</h4>
                <p>${seg.duration} &nbsp;·&nbsp; ${seg.size} &nbsp;·&nbsp; ${seg.codec} &nbsp;·&nbsp; 
                   <span style="color:${seg.status === 'Recovered' ? 'var(--green)' : 'var(--amber)'}; font-weight:700;">${seg.status}</span></p>
                <div class="tl-time">Timestamp drift corrected: ${drift}</div>
            </div>
        </div>
    `).join('');

    appendLog('activity-log', `[Timeline] ${sorted.length} segments reconstructed (drift: ${drift}).`, 't-ok');
};

// ===== CHAIN OF CUSTODY =====
window.addCoCEntry = function() {
    const evidenceId = document.getElementById('coc-evidence-id').value;
    const role       = document.getElementById('coc-role').value;
    const action     = document.getElementById('coc-action').value;
    const timestamp  = new Date().toLocaleString();
    const hash       = fakeHash(32);

    state.cocEntries.push({ evidenceId, role, action, timestamp, hash });
    renderCoC();
    updateDashboardStats();
    appendLog('activity-log', `[CoC] ${role} — "${action}"`, 't-ok');
};

function renderCoC() {
    const list = document.getElementById('coc-timeline');
    const countEl = document.getElementById('coc-count');
    countEl.textContent = state.cocEntries.length;

    if (state.cocEntries.length === 0) {
        list.innerHTML = '<p style="color:var(--text-light); font-size:0.85rem; text-align:center; padding:2rem 0;">No entries yet.</p>';
        return;
    }

    list.innerHTML = state.cocEntries.map((entry, i) => `
        <div class="timeline-item">
            <div class="tl-dot blue">${i + 1}</div>
            <div class="tl-content">
                <h4>${entry.action}</h4>
                <p><strong>Handler:</strong> ${entry.role} &nbsp;·&nbsp; <strong>Evidence:</strong> ${entry.evidenceId}</p>
                <div class="hash-display" style="margin-top:0.4rem; font-size:0.7rem;">${entry.hash}...</div>
                <div class="tl-time">🕐 ${entry.timestamp}</div>
            </div>
        </div>
    `).join('');

    // Update current hash display
    const lastHash = state.cocEntries[state.cocEntries.length - 1].hash;
    document.getElementById('coc-current-hash').textContent = lastHash + fakeHash(32);

    // Advance workflow
    updateFlowStep('flow-5', true);
}

window.exportCertificate = function() {
    if (state.cocEntries.length === 0) { alert('Add at least one entry first.'); return; }
    const merkle = fakeHash(32);
    alert(
        `CHAIN OF CUSTODY CERTIFICATE\n` +
        `============================================\n` +
        `Evidence ID: ${state.cocEntries[0].evidenceId}\n` +
        `Total Transactions: ${state.cocEntries.length}\n` +
        `Status: VERIFIED ✓\n` +
        `Merkle Root: 0x${merkle}\n` +
        `Timestamp: ${new Date().toISOString()}\n` +
        `Standard: ISO/IEC 27037 & IT Act Section 65B\n\n` +
        `All transactions are SHA-256 signed.\n` +
        `Court Admissibility: CONFIRMED`
    );
};

// ===== REPORT GENERATOR =====
window.generateReport = function() {
    const caseNum    = document.getElementById('rpt-case').value;
    const inv        = document.getElementById('rpt-inv').value;
    const rptType    = document.getElementById('rpt-type');
    const notes      = document.getElementById('rpt-notes').value;
    const vd         = state.vendor ? vendors[state.vendor] : { name: 'N/A', model: 'N/A', fs: 'N/A', capacity: 'N/A', rate: 0, codec: 'N/A' };
    const now        = new Date().toLocaleString();
    const hash       = state.deviceHash || fakeHash();

    const card    = document.getElementById('report-preview-card');
    const preview = document.getElementById('report-preview-content');
    const dlBtn   = document.getElementById('rpt-download-btn');

    card.style.display = 'block';
    dlBtn.style.display = 'inline-flex';

    preview.innerHTML = `
        <div class="report-header">
            <h2>Forensic Examination Report</h2>
            <p style="font-size:0.8rem; color:var(--text-mid); margin-top:0.3rem;">DVR/NVR Forensic Analyzer — VibeX_1 | SIH26150</p>
        </div>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.5rem 1.5rem; font-size:0.83rem; margin-bottom:1rem;">
            <p><strong>Case Number:</strong> ${caseNum}</p>
            <p><strong>Report Type:</strong> ${rptType.options[rptType.selectedIndex].text.split('(')[0]}</p>
            <p><strong>Investigator:</strong> ${inv}</p>
            <p><strong>Generated:</strong> ${now}</p>
            <p><strong>Device:</strong> ${vd.name} ${vd.model}</p>
            <p><strong>File System:</strong> ${vd.fs}</p>
            <p><strong>Capacity:</strong> ${vd.capacity}</p>
            <p><strong>Est. Recovery:</strong> <span style="color:var(--green); font-weight:700;">${vd.rate}%</span></p>
        </div>
        <hr style="border-color:#e0e0e0; margin-bottom:1rem;">
        <p style="font-size:0.83rem; font-weight:700; margin-bottom:0.6rem;">Examination Summary</p>
        <ul style="font-size:0.82rem; padding-left:1.2rem; line-height:1.9;">
            <li>Device Analysis: <span style="color:var(--green); font-weight:700;">✓ Complete</span></li>
            <li>Write-Block Verified: <span style="color:var(--green); font-weight:700;">✓ Engaged Throughout</span></li>
            <li>Forensic Image Created: <span style="color:var(--green); font-weight:700;">${state.imagingDone ? '✓ Complete' : '— Not performed'}</span></li>
            <li>File System Parsed: <span style="color:var(--green); font-weight:700;">${state.fsParsed ? '✓ ' + vd.fs : '— Not performed'}</span></li>
            <li>Video Segments Recovered: <span style="color:var(--green); font-weight:700;">${state.carvedSegments.length > 0 ? '✓ ' + state.carvedSegments.length + ' segments (H.264/H.265 Carving)' : '— Not performed'}</span></li>
            <li>Chain of Custody Entries: <span style="color:var(--green); font-weight:700;">✓ ${state.cocEntries.length} entries recorded</span></li>
            <li>Court Admissibility: <span style="color:var(--green); font-weight:700;">✓ Confirmed (NIST SP 800-86 & ISO/IEC 27037)</span></li>
        </ul>
        <div style="margin-top:1rem;">
            <p style="font-size:0.78rem; color:var(--text-light); margin-bottom:0.3rem;">Acquisition SHA-256</p>
            <div class="hash-display">${hash}</div>
        </div>
        ${notes ? `<div style="margin-top:0.8rem; font-size:0.82rem;"><strong>Additional Notes:</strong><br>${notes}</div>` : ''}
        <div class="alert alert-success" style="margin-top:1rem;">✓ Report ready. All findings are SHA-256 verified and chain of custody is complete.</div>
    `;

    appendLog('activity-log', `[Report] Forensic report generated for ${caseNum}.`, 't-ok');
};

window.downloadReport = function() {
    const caseNum = document.getElementById('rpt-case').value;
    alert(
        `Report for ${caseNum} ready for download.\n\n` +
        `Generated files:\n` +
        `  📄 Forensic Examination Report (PDF)\n` +
        `  🔐 SHA-256 Hash Certificate (PDF)\n` +
        `  📋 Chain of Custody Document (PDF)\n` +
        `  📅 Evidence Timeline (CSV)\n` +
        `  🗂️ Evidence Inventory (XLSX)`
    );
};
