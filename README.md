# Accessible Page Capture

Record a blocked web task as a private issue packet.

Accessible Page Capture is a Chrome extension for low-vision workers and their colleagues. It records up to 30 seconds of where focus moved, what you clicked, and which control keys you used. Review the issue packet, add a note, then export Markdown or JSON.

Typed values and passwords never enter the packet. Every URL query value is redacted. Capture and export work offline. Individual exports cost $0.

Live site: <https://accessible-page-capture.sociobot.in>

One-click isolated demo: <https://accessible-page-capture.sociobot.in/?demo=1>

## What it records

- Page address and title
- Time-ordered recorded focus, click, and control-key steps
- Accessible control labels and roles
- A user-written goal or note

It does not record by default. It does not capture screenshots, typed values, page content, or another page after navigation. The packet shows recorded steps, not an accessibility score.

## Run, test, and deploy

Requires Node.js 22 or newer.

```sh
npm install
npm run dev          # WXT extension development
npm run dev:site     # site at http://localhost:5173
npm test             # unit, browser, axe, offline, and extension tests
npm run build        # exact production build command
```

The build creates:

- `.output/chrome-mv3/` — unpacked Chrome extension
- `.output/accessible-page-capture-1.0.1-chrome.zip` — extension package
- `dist/site/index.html` — static deployment root
- `dist/site/downloads/accessible-page-capture-chrome.zip` — site download

To install the local build, open `chrome://extensions`, enable Developer mode, choose “Load unpacked,” and select `.output/chrome-mv3`. To deploy the static site, provide `dist/site/` to the factory static deployment work order; it contains the extension ZIP under `downloads/`.

## Privacy and security

Capture data stays in `chrome.storage.local`. The demo uses only the `demo:accessible-page-capture:` localStorage prefix. Reset demo removes its note and restores the shipped sample. Capture and export make no outside request.

The site loads no third-party scripts, fonts, or analytics. See `/privacy` and `/terms` on the deployed site.

## Project records

- `.factory/brief.json` — product scope
- `.factory/design.md` — visual system and art provenance
- `.factory/claims.json` — product claims and their tests
- `.factory/demo.md` — demo isolation contract
- `.factory/copy-audit.md` — plain-language audit

Licensed under MIT. Built by Param Factory.
