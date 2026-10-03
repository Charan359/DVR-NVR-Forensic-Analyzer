# DVR/NVR Forensic Analyzer - Interactive Demo

This repository contains the interactive front-end demo for the **DVR/NVR Forensic Analyzer** (Team VibeX_1 | Problem Statement: SIH26150).

## What This Demo Does
This web application serves as a **functional prototype and interactive dashboard** demonstrating the workflow of our proposed forensic tool. It allows users to simulate the complete forensic analysis lifecycle:
- **Device Scanner:** Auto-detects connected DVR/NVR drives and identifies proprietary file systems (WFS, DHFS, RSFS).
- **Forensic Imaging:** Simulates bit-by-bit acquisition with software write-blocking and SHA-256 hash generation.
- **FS Parser:** Demonstrates how proprietary index blocks and file system maps are parsed.
- **Video Carver:** Simulates the recovery of deleted/fragmented H.264/H.265 video segments from unallocated disk space.
- **Timeline Viewer:** Reconstructs the timeline of recovered evidence with timestamp drift correction.
- **Chain of Custody:** Tracks every action taken on the evidence with simulated immutable SHA-256 state hashes.
- **Report Generator:** Previews a standardized forensic examination report ready for court admissibility (ISO/IEC 27037).

## How Far It Works (Current State)
Currently, this is a **purely front-end simulation** built using Vanilla HTML, CSS, and JavaScript. 
- It accurately represents the UI/UX, workflow steps, and data structures of the final tool.
- It dynamically generates simulated terminal outputs, hashes, carved video lists, and timeline events based on the selected vendor.
- **It does not** interact with actual physical drives, parse real binary hex data, or carve real video files yet. It is designed to visually explain our technical approach and feasibility to judges and stakeholders.

## What Needs to be Done for Full Completion
To turn this front-end dashboard into the fully functional forensic software, the following backend components must be developed and integrated:
1. **Core Backend Integration:** Build the underlying engine using **C++ / Python** to handle raw disk I/O operations.
2. **Hardware/Software Write-Blocking:** Implement low-level OS API calls to enforce strict read-only access to connected SATA/USB drives.
3. **Proprietary FS Parsers:** Develop binary parsers for Dahua (DHFS), Hikvision (WFS), CP Plus (RSFS), and others by reverse-engineering their index block structures.
4. **Hex-Level Video Carving:** Implement the actual search algorithms to find `00 00 00 01` (NAL unit start codes) on unallocated disk space and assemble H.264/H.265 frames into playable MP4/MKV files using **FFmpeg**.
5. **Backend Database:** Connect an embedded database (e.g., SQLite) to securely store the Chain of Custody audit logs and evidence metadata.
6. **Local Desktop App Packaging:** Wrap the front-end and back-end into a standalone, offline desktop application (e.g., using Electron or Tauri) suitable for air-gapped forensic environments.
7. **Report Generation Pipeline:** Integrate a PDF generation library to export the final ISO/IEC 27037 compliant reports and certificates.
