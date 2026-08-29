# Adversarial first-read review 4 — Accessible Page Capture

Reviewed 2026-08-29 UTC against <https://accessible-page-capture.sociobot.in> in fresh Chromium contexts at 390 × 844 and 1440 × 900, and in a clean local clone of `34190a62903914461064581070e1e4e73b69cf12`.

## Verdict: PASS

No blocking or minor findings remain. The live product is understandable, tryable, and honest in a cold first read. Every registered claim was exercised by the clean-clone test run; no visitor-reliant landing or README statement lacks applicable claim coverage.

## First read

Before scrolling, both viewports answered the three required questions.

| Question | Cold-read answer | Exact visible evidence |
| --- | --- | --- |
| What does this do? | It records the steps in a blocked web task and exports an issue packet. | “Record a blocked web task as an issue packet” |
| Who is it for? | Low-vision workers and colleagues who need a product team to reproduce one blocked task. | “For low-vision workers and colleagues who need a product team to reproduce one blocked web task.” |
| What should I click first? | Try the finished sample issue packet. | “Try it with sample data” beside “The demo opens a finished issue packet. Nothing is saved.” |

At 390 px, the header, headline, audience, primary action, outcome, and all three facts are visible before the artwork. The phone layout is 390 px wide with no horizontal overflow. The wordmark visibly reads “Accessible / Page Capture,” rather than joining the first two words.

## Findings

None.

## Copy audit

Counts treat hyphenated compounds, prices, URLs, and paths as one word. Navigation, headings, labels, and actions are included because they are independently exposed to screen-reader users. Sample-recorded-step values are realistic product data rather than marketing copy. No sentence exceeds 22 words, has jargon for the stated audience, contains a banned marketing adjective, uses inconsistent terminology, or uses a non-result-naming action.

### Landing page

| Copy | Words | Check |
| --- | ---: | --- |
| Accessible Page Capture | 3 | Product name |
| Skip to main content | 5 | Clear action |
| Demo | 1 | Clear route label |
| How it works | 3 | Clear route label |
| Privacy | 1 | Clear route label |
| One blocked task, clearly recorded | 5 | Scope label |
| Record a blocked web task as an issue packet | 9 | Plain job headline |
| For low-vision workers and colleagues who need a product team to reproduce one blocked web task. | 16 | Names audience and situation |
| Try it with sample data | 5 | Result-naming primary action |
| The demo opens a finished issue packet. | 7 | States the result |
| Nothing is saved. | 3 | States the demo boundary; `demo-private` |
| Private | 1 | Fact label |
| Typed values never enter the packet. | 6 | `redacted-input` |
| Offline | 1 | Fact label |
| Capture and export work offline. | 5 | `offline-capture` |
| Free | 1 | Fact label |
| Individual exports cost $0. | 4 | `free-export` |
| Recorded steps become an issue packet your team can inspect. | 10 | Packet outcome |
| A recorded issue packet | 4 | Section label |
| See each recorded step in order | 6 | Clear section heading |
| The packet keeps the page address, control labels, timing, and your note. | 12 | `page-context`, `ordered-labelled-events`, `user-note` |
| It does not copy the page. | 6 | `no-page-copy` |
| How it works | 3 | Clear section label |
| Show your team what blocked the task | 7 | Clear section heading |
| Start the capture | 3 | Clear step heading |
| Open the extension on the blocked page. | 7 | Direct instruction |
| Recording begins only when you start it. | 7 | `explicit-start` |
| Repeat the task | 3 | Clear step heading |
| Use focus, clicks, and control keys for up to 30 seconds. | 11 | `ordered-labelled-events`, `thirty-second-limit` |
| Typed values become a redaction note. | 6 | `redacted-input` |
| Check and export | 3 | Clear step heading |
| Add your goal, preview every recorded step, then export Markdown or JSON. | 12 | `user-note`, `preview-before-export`, `markdown-json` |
| Download Chrome extension | 3 | Result-naming download action |
| Before you share | 3 | Section label |
| Check the recorded steps yourself | 5 | Clear section heading |
| The packet shows recorded steps, not an accessibility score. | 9 | `no-accessibility-score` |
| It records only the page where you start. | 8 | `single-page-capture` |
| It does not export a packet without your action. | 9 | `no-auto-export` |
| Review the packet before sharing it. | 6 | Direct instruction |
| Record an access barrier and export a private issue packet. | 10 | Footer summary |
| Terms | 1 | Clear route label |
| Built by Param Factory | 4 | Attribution |
| Version 1.0.1 · Build APC-20260829 | 5 | Build identifier |

### README

| Copy | Words | Check |
| --- | ---: | --- |
| Accessible Page Capture | 3 | Product name |
| Record a blocked web task as a private issue packet. | 10 | Plain summary |
| Accessible Page Capture is a Chrome extension for low-vision workers and their colleagues. | 13 | Names audience |
| It records up to 30 seconds of where focus moved, what you clicked, and which control keys you used. | 19 | `ordered-labelled-events`, `thirty-second-limit` |
| Review the issue packet, add a note, then export Markdown or JSON. | 11 | `user-note`, `preview-before-export`, `markdown-json` |
| Typed values and passwords never enter the packet. | 8 | `redacted-input`, `password-redaction` |
| Every URL query value is redacted. | 6 | `url-redaction` |
| Capture and export work offline. | 5 | `offline-capture` |
| Individual exports cost $0. | 4 | `free-export` |
| Live site | 2 | Clear destination label |
| One-click isolated demo | 3 | `demo-private` |
| What it records | 3 | Clear heading |
| Page address and title | 4 | `page-context` |
| Time-ordered recorded focus, click, and control-key steps | 8 | `ordered-labelled-events` |
| Accessible control labels and roles | 5 | `ordered-labelled-events` |
| A user-written goal or note | 5 | `user-note` |
| It does not record by default. | 6 | `explicit-start` |
| It does not capture screenshots, typed values, page content, or another page after navigation. | 14 | `no-screenshots`, `redacted-input`, `no-page-copy`, `single-page-capture` |
| The packet shows recorded steps, not an accessibility score. | 9 | `no-accessibility-score` |
| Run, test, and deploy | 4 | Clear heading |
| Requires Node.js 22 or newer. | 5 | Setup requirement |
| The build creates | 3 | Clear introduction |
| To install the local build, open `chrome://extensions`, enable Developer mode, choose “Load unpacked,” and select `.output/chrome-mv3`. | 16 | Precise installation instruction |
| To deploy the static site, provide `dist/site/` to the factory static deployment work order; it contains the extension ZIP under `downloads/`. | 19 | Precise deployment instruction |
| Privacy and security | 3 | Clear heading |
| Capture data stays in `chrome.storage.local`. | 5 | `local-storage` |
| The demo uses only the `demo:accessible-page-capture:` localStorage prefix. | 8 | `demo-private` |
| Reset demo removes its note and restores the shipped sample. | 10 | `demo-private` |
| Capture and export make no outside request. | 7 | `no-capture-network` |
| The site loads no third-party scripts, fonts, or analytics. | 9 | `no-runtime-third-party` |
| See `/privacy` and `/terms` on the deployed site. | 8 | Clear destinations |
| Project records | 2 | Clear heading |
| Licensed under MIT. | 3 | License statement |
| Built by Param Factory. | 4 | Attribution |

Terminology is consistent: **issue packet** is the exported file, **recorded steps** are its sequence, **access barrier** is the problem, **capture** is the recording period, and **demo** is the sample workspace.

## Demo, sandbox, and privacy

- The first-screen action opened `/?demo=1` in one click.
- The first screen after activation already showed a complete 18.4-second travel-request issue packet: six realistic recorded steps, the page title and address, a populated note, and both export actions.
- The persistent banner read “Demo — sample data, nothing is saved” and supplied **Reset demo** plus **Download Chrome extension**.
- In a fresh context, the demo started with no local-storage entries. Editing its note created only `demo:accessible-page-capture:note`; Reset restored the shipped note, removed that key, moved focus to Reset demo, and announced the reset.
- The request log for landing, demo, edit, reset, and JSON export contained only the product origin. No demo action read or wrote extension storage. The sample JSON was `accessible-page-capture/v1`, contained the six recorded steps, and retained the sample note.
- The registered offline demo test passed after a first visit, service-worker control, offline reload, and Markdown export. The separate real-extension offline claim also passed.

## Claims and clean-clone verification

I cloned the candidate to `/tmp/apc-review4-OdjfII`, installed with `npm ci`, and ran the complete clean-clone suite. Its 16 browser tests exercise every test tagged by the 22 entries in `.factory/claims.json`; its four unit tests include the claim-registry contract and `url-redaction`. No registered claim test failed.

| Claim IDs | Result |
| --- | --- |
| `explicit-start`, `redacted-input`, `password-redaction`, `no-page-copy`, `preview-before-export`, `no-auto-export`, `single-page-capture`, `markdown-json`, `page-context`, `ordered-labelled-events`, `user-note`, `free-export`, `offline-capture`, `demo-offline-export`, `demo-private`, `local-storage`, `no-screenshots`, `no-capture-network`, `no-runtime-third-party`, `no-accessibility-score` | PASS — tagged browser tests |
| `thirty-second-limit`, `url-redaction` | PASS — tagged unit/extension tests |

The command results were:

```sh
npm test       # PASS: 4 unit tests, 16 browser tests, package/load smoke
npm run check  # PASS
npm run build  # PASS; produced dist/site/
APC_BASE_URL=https://accessible-page-capture.sociobot.in npx playwright test tests/e2e/site.spec.ts
                # PASS: 9 live tests
```

The clean-build ZIP and live download are SHA-256-identical:

```text
cfd51653c64133ce69ab38385bbacc7dbfb1606d8fdfcd2186038a7c005c67ef
```

## Earlier findings and history

I read every prior review, polish report, verification record, and handoff in `.factory/`. Each earlier finding was confirmed fixed both live and in source.

| Earlier finding | Current confirmation |
| --- | --- |
| F-1-1 — offline capture proof | `offline-capture` loads the real unpacked extension, captures a control offline, and exports it; `demo-offline-export` separately checks the PWA sample. |
| F-1-2 — $0 extension export proof | `free-export` completes a real extension export and verifies no payment UI or payment request. |
| F-1-3 — unlisted replay/limitation wording | Current copy makes observable packet statements covered by packet-field/export claims and `no-accessibility-score`. |
| F-1-4 — mobile action outcome | At 390 px the action and both outcome sentences precede the artwork; the responsive test asserts this. |
| F-1-5 — ambiguous demo action | The banner action is “Download Chrome extension.” |
| F-1-6 — inconsistent terminology | Public copy consistently uses issue packet and recorded steps. |
| F-3-1 — joined mobile wordmark | The line break remains visible at 390 px; the cold phone render reads “Accessible / Page Capture.” |
| F-3-2 — unlisted art-provenance claim | The public provenance sentence is absent; provenance remains in `.factory/design.md`. |

## Structure, routes, accessibility, and identity

- The live routes `/`, `/?demo=1`, `/demo`, `/privacy`, and `/terms` return 200; `/missing` returns a styled HTTP 404. Every internal destination, `robots.txt`, `sitemap.xml`, the download, and the Param Factory external link returned 200. Mail links are explicit.
- Each route has exactly one h1, `lang="en"`, a route-specific title under 60 characters, description under 155 characters, canonical URL, Open Graph/Twitter metadata, favicon, and theme color. `robots.txt` and `sitemap.xml` list the public routes.
- Demo navigation and Back return focus to the new route h1 and update the polite route-status message. The shared header has a first-in-order skip link and the shared footer has Privacy, Terms, attribution, and build identifier.
- Live axe, mobile layout, keyboard, 44 px target, reduced-motion, metadata, and console checks passed through the nine-test live suite. The one expected browser console network message was the intentionally requested `/missing` HTTP 404; no application error occurred on normal routes.
- The warm-paper, offset-ink field-report treatment is distinct from a generic SaaS template and implements the palette, typography, tactile-paper shapes, asset provenance, and reduced-motion policy in `.factory/design.md`.
- The brief does not imply an AI action, sync, or further import path. Markdown and JSON export already cover the useful sharing step. The product has no decorative AI feature and no provider key.

## What would make this perfect

Nothing material is currently missing. Maintain the same standard when changing the extension: keep the finished sample reachable in one click, test every new visitor promise in demo mode, and re-run the cold phone first read plus the full clean-clone and live suites before release.
