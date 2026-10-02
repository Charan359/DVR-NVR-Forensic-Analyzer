// Navigation
window.showSection = function(sectionId) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.getElementById(sectionId).classList.add('active');
    window.scrollTo(0, 0);
};

// Device Detection Demo
window.detectDevice = function() {
    const vendor = document.getElementById('vendorSelect').value;
    if (!vendor) {
        alert('Please select a vendor');
        return;
    }

    const vendorData = {
        dahua: {
            model: 'Dahua NVR5232-4KS2',
            fileSystem: 'DHFS (Dahua Hybrid File System)',
            capacity: '8TB',
            status: 'Forensically Intact',
            recoveryRate: '91.8%',
            supportLevel: 'Full'
        },
        hikvision: {
            model: 'Hikvision DS-7608NI-K2/8P',
            fileSystem: 'HIKVISION FS',
            capacity: '4TB',
            status: 'Partially Overwritten',
            recoveryRate: '87.3%',
            supportLevel: 'Full'
        },
        honeywell: {
            model: 'Honeywell HEN-NVR-8MP',
            fileSystem: 'Proprietary (Recently Analyzed)',
            capacity: '2TB',
            status: 'Clean',
            recoveryRate: '89.5%',
            supportLevel: 'Full'
        },
        tplink: {
            model: 'TP-Link NVR1208H-8MP',
            fileSystem: 'Linux-Based EXT4',
            capacity: '1TB',
            status: 'Clean',
            recoveryRate: '85.2%',
            supportLevel: 'Full (New)'
        },
        cpplus: {
            model: 'CP Plus CP-NVR-4U08',
            fileSystem: 'CP Plus Proprietary',
            capacity: '4TB',
            status: 'Clean',
            recoveryRate: '88.0%',
            supportLevel: 'Full (New)'
        },
        godrej: {
            model: 'Godrej Auditplus 16',
            fileSystem: 'Godrej Custom Compression',
            capacity: '2TB',
            status: 'Clean',
            recoveryRate: '86.5%',
            supportLevel: 'Full (New)'
        },
        matrix: {
            model: 'Matrix SATATYA-4U',
            fileSystem: 'Encrypted Proprietary',
            capacity: '8TB',
            status: 'Encrypted',
            recoveryRate: '90.1%',
            supportLevel: 'Full (New)'
        },
        uniview: {
            model: 'Uniview NVR 308-32E',
            fileSystem: 'Uniview Proprietary',
            capacity: '6TB',
            status: 'Clean',
            recoveryRate: '87.9%',
            supportLevel: 'Full (New)'
        }
    };

    const data = vendorData[vendor];
    const resultBox = document.getElementById('detectionResult');
    const resultContent = document.getElementById('resultContent');

    resultContent.innerHTML = \`
        <p><strong>Vendor:</strong> \${vendor.charAt(0).toUpperCase() + vendor.slice(1)}</p>
        <p><strong>Model:</strong> \${data.model}</p>
        <p><strong>File System:</strong> \${data.fileSystem}</p>
        <p><strong>Storage Capacity:</strong> \${data.capacity}</p>
        <p><strong>Device Status:</strong> \${data.status}</p>
        <p><strong>Expected Recovery Rate:</strong> <span style="color: #28a745; font-weight: bold;">\${data.recoveryRate}</span></p>
        <p><strong>Support Level:</strong> <span class="badge">\${data.supportLevel}</span></p>
        <p style="margin-top: 1rem; font-size: 0.9rem; color: #666;"><em>✓ Blockchain chain of custody initialized<br/>✓ Forensic acquisition workflow ready<br/>✓ AI analysis engines activated</em></p>
    \`;

    resultBox.classList.add('show');
};

// Blockchain Demo
const chainOfCustody = [];

window.addToChainOfCustody = function() {
    const role = document.getElementById('handlerRole').value;
    const timestamp = new Date().toLocaleString();
    
    chainOfCustody.push({
        role: role,
        action: \`Evidence accessed by \${role}\`,
        timestamp: timestamp,
        hash: Math.random().toString(16).substr(2, 8)
    });

    window.updateChainDisplay();
};

window.updateChainDisplay = function() {
    const chainContent = document.getElementById('chainContent');
    const resultBox = document.getElementById('chainResult');

    chainContent.innerHTML = chainOfCustody.map((item, index) => \`
        <div class="timeline-item">
            <h4>Step \${index + 1}: \${item.action}</h4>
            <div class="time">🕐 \${item.timestamp}</div>
            <p><strong>Handler Role:</strong> \${item.role}</p>
            <p><strong>Block Hash:</strong> <code>\${item.hash}...</code></p>
            <p>✓ Verified on Blockchain</p>
        </div>
    \`).join('');

    resultBox.classList.add('show');
};

window.viewBlockchainCertificate = function() {
    if (chainOfCustody.length === 0) {
        alert('Please add at least one action to the chain of custody first');
        return;
    }

    const cert = \`
BLOCKCHAIN CHAIN OF CUSTODY CERTIFICATE
========================================
Evidence ID: CHAIN-2024-001
Total Transactions: \${chainOfCustody.length}
Blockchain Status: VERIFIED ✓
Merkle Root: 0x\${Math.random().toString(16).substr(2, 64)}
Block Height: 12345
Network: Hyperledger Fabric (Private)
Timestamp: \${new Date().toISOString()}

This certificate verifies the complete and unaltered chain of custody
for the evidence. All transactions are cryptographically signed and
immutable. This document is admissible in court proceedings.

Verified by: Blockchain Verification System
Court Admissibility: CONFIRMED
    \`;

    alert(cert);
};

// AI Analysis Demo
window.runEventCorrelation = function() {
    const startTime = document.getElementById('startTime').value;
    const endTime = document.getElementById('endTime').value;
    const resultBox = document.getElementById('aiResult');
    const aiContent = document.getElementById('aiContent');

    const analysisResults = \`
<p><strong>Analysis Period:</strong> \${startTime} - \${endTime}</p>
<p><strong>Cameras Analyzed:</strong> 8 cameras</p>
<p><strong>Frames Processed:</strong> 43,200 frames</p>
<p><strong>Processing Time:</strong> 12.3 seconds</p>
<br/>
<p><strong>🎯 Key Findings:</strong></p>
<ul style="margin-left: 1rem;">
    <li><strong>Suspicious Pattern Detected:</strong> Individual moved through camera 3→5→7 with coordinated movement (92% confidence)</li>
    <li><strong>Behavioral Anomaly:</strong> Unusual loitering at entrance (camera 1) from \${startTime} to \${startTime} (87% anomaly score)</li>
    <li><strong>Face Recognition Match:</strong> 2 individuals matched against wanted persons database</li>
    <li><strong>High-Probability Evidence Areas:</strong> \${startTime}, \${endTime} contain 91% probability of relevant footage</li>
</ul>
<br/>
<p><strong>AI Recommendation:</strong> Focus manual review on timestamps marked above. All findings blockchain-verified.</p>
    \`;

    aiContent.innerHTML = analysisResults;
    resultBox.classList.add('show');
};

// Role-Based Access Demo
window.selectRole = function(role, button) {
    document.querySelectorAll('.role-btn').forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');

    const roleData = {
        investigator: {
            title: '👮 Investigator Dashboard',
            content: \`
                <p><strong>Your Access Level:</strong> Full read/write access to assigned cases</p>
                <p><strong>Available Evidence:</strong> All evidence in your jurisdiction</p>
                <p><strong>Actions Available:</strong> Upload evidence, Annotate, Add findings, Share with other investigators</p>
                <div class="alert alert-info" style="margin-top: 1rem;">
                    <strong>Shared Cases:</strong> 3 active multi-agency investigations with forensic evidence
                </div>
            \`
        },
        analyst: {
            title: '🔬 Analyst Dashboard',
            content: \`
                <p><strong>Your Access Level:</strong> Read access to evidence assigned for analysis</p>
                <p><strong>Available Evidence:</strong> Evidence marked for forensic analysis</p>
                <p><strong>Actions Available:</strong> View evidence, Run analysis, Generate findings, Comment on evidence</p>
                <div class="alert alert-info" style="margin-top: 1rem;">
                    <strong>Analysis Queue:</strong> 5 cases pending forensic review
                </div>
            \`
        },
        manager: {
            title: '📋 Case Manager Dashboard',
            content: \`
                <p><strong>Your Access Level:</strong> Administrative access to case management</p>
                <p><strong>Available Evidence:</strong> All evidence in jurisdiction</p>
                <p><strong>Actions Available:</strong> Assign cases, Create investigation requests, Approve evidence sharing, Generate reports</p>
                <div class="alert alert-info" style="margin-top: 1rem;">
                    <strong>Pending Approvals:</strong> 2 inter-agency evidence requests waiting review
                </div>
            \`
        },
        prosecutor: {
            title: '⚖️ Prosecutor Dashboard',
            content: \`
                <p><strong>Your Access Level:</strong> Read-only access to completed analysis</p>
                <p><strong>Available Evidence:</strong> Finalized evidence ready for court</p>
                <p><strong>Actions Available:</strong> View evidence, Access chain-of-custody certificates, Download reports, Export for court</p>
                <div class="alert alert-success" style="margin-top: 1rem;">
                    <strong>Court-Ready Cases:</strong> 1 case with complete blockchain-verified evidence ready for prosecution
                </div>
            \`
        }
    };

    const roleInfo = roleData[role];
    document.getElementById('roleTitle').textContent = roleInfo.title;
    document.getElementById('roleContent').innerHTML = roleInfo.content;

    // Update activity feed
    const activityFeed = document.getElementById('activityFeed');
    const activities = [
        { time: '14:35', actor: 'Investigator Smith', action: 'Uploaded video evidence from Dahua NVR' },
        { time: '14:28', actor: 'Analyst Johnson', action: 'Completed forensic analysis on device' },
        { time: '14:15', actor: 'Manager Brown', action: 'Approved inter-agency evidence sharing request' },
        { time: '14:02', actor: 'System', action: 'Blockchain verification completed ✓' },
        { time: '13:45', actor: 'Prosecutor Davis', action: 'Reviewed chain-of-custody certificate' },
    ];

    activityFeed.innerHTML = activities.map(activity => \`
        <div class="timeline-item">
            <h4>\${activity.actor}</h4>
            <div class="time">🕐 \${activity.time}</div>
            <p>\${activity.action}</p>
        </div>
    \`).join('');
};

// Initialize with default role when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const activeRoleBtn = document.querySelector('.role-btn.active');
    if(activeRoleBtn) {
        window.selectRole('investigator', activeRoleBtn);
    }
});

// Report Generation
window.generateReport = function() {
    const caseNumber = document.getElementById('caseNumber').value;
    const investigatorName = document.getElementById('investigatorName').value;
    const reportType = document.getElementById('reportType').value;
    const notes = document.getElementById('reportNotes').value;

    const reportContent = document.getElementById('reportContent');
    const resultBox = document.getElementById('reportResult');
    const downloadBtn = document.getElementById('downloadBtn');

    const reportHTML = \`
        <p><strong>Case Number:</strong> \${caseNumber}</p>
        <p><strong>Investigator:</strong> \${investigatorName}</p>
        <p><strong>Report Type:</strong> \${reportType.charAt(0).toUpperCase() + reportType.slice(1)}</p>
        <p><strong>Generated:</strong> \${new Date().toLocaleString()}</p>
        <br/>
        <p><strong>Report Summary:</strong></p>
        <ul style="margin-left: 1rem;">
            <li>Device Analysis: ✓ Complete</li>
            <li>File System Parsing: ✓ Successful</li>
            <li>Data Recovery: ✓ 91.8% success rate</li>
            <li>Chain of Custody: ✓ Blockchain verified</li>
            <li>AI Analysis: ✓ Completed</li>
            <li>Court Admissibility: ✓ Confirmed (NIST & ISO compliant)</li>
        </ul>
        <p style="margin-top: 1rem;"><strong>Additional Notes:</strong> \${notes || 'No additional notes'}</p>
        <p style="margin-top: 1rem; color: #28a745; font-weight: bold;">✓ Report ready for download</p>
    \`;

    reportContent.innerHTML = reportHTML;
    resultBox.classList.add('show');
    downloadBtn.style.display = 'inline-block';
};

window.downloadReport = function() {
    const caseNumber = document.getElementById('caseNumber').value;
    alert(\`Report for Case \${caseNumber} ready to download as PDF.\\n\\nIn production, this would generate and download:\\n- Forensic Report (PDF)\\n- Blockchain Certificate (PDF)\\n- Evidence Inventory\\n- Timeline Analysis\\n- Chain of Custody Document\`);
};
