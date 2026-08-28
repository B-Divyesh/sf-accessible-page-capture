# Accessible Page Capture

Record an access barrier and export a private issue packet.

Accessible Page Capture is a Chrome MV3 extension for low-vision workers and the colleagues supporting them. It records one explicit focus and control trace for up to 30 seconds. The user previews the packet, adds a note, then exports Markdown or JSON.

Typed values and passwords never enter the packet. Sensitive URL parameters are redacted. Capture and export work offline. Individual exports cost $0.

Live site: <https://accessible-page-capture.sociobot.in>

One-click demo: <https://accessible-page-capture.sociobot.in/demo>

## What it records

- Page address and title
- Time-ordered focus, click, and control-key events
- Accessible control labels and roles
- A user-written goal or note

It does not record by default. It does not capture screenshots, typed values, page content, or a continuous session. A packet is supporting evidence, not an accessibility certification.

## Run locally

Requires Node.js 20 or newer.

```sh
npm install
npm run dev          # WXT extension development
npm run dev:site     # site at http://localhost:5173
npm test             # unit, browser, axe, offline, and extension tests
npm run build        # exact production build command
```

The build creates:

- `.output/chrome-mv3/` — unpacked Chrome extension
- `.output/accessible-page-capture-1.0.0-chrome.zip` — extension package
- `dist/site/index.html` — static deployment root
- `dist/site/downloads/accessible-page-capture-chrome.zip` — site download

To install the local build, open `chrome://extensions`, enable Developer mode, choose “Load unpacked,” and select `.output/chrome-mv3`.

## Optional team handoff

The $39 one-time team handoff adds a team name and triage destination to exports. Core capture, preview, redaction, and export remain free. Checkout and license verification use the Sociobot billing API. No product ID or payment-provider key is stored here.

The v1 static architecture does not host a shared remote inbox. See `.factory/handoff.md` for that honest scope boundary.

## Privacy and security

Capture data stays in `chrome.storage.local`. The demo uses only the `demo:accessible-page-capture:` localStorage prefix. The free path makes no external request. License verification sends only the pasted license token to `api.sociobot.in`.

The site loads no third-party scripts, fonts, or analytics. See `/privacy` and `/terms` on the deployed site.

## Project records

- `.factory/brief.json` — product scope
- `.factory/design.md` — visual system and art provenance
- `.factory/claims.json` — product claims and their tests
- `.factory/demo.md` — demo isolation contract
- `.factory/copy-audit.md` — plain-language audit

Licensed under MIT. Built by Param Factory.
