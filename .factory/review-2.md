# Adversarial first-read review 2 — Accessible Page Capture

Reviewed 2026-08-28 UTC against `https://accessible-page-capture.sociobot.in`, in fresh Chromium contexts at 390 × 844 and 1440 × 900, plus a clean clone of commit `dccc722d23bb157a75ee679e00e75b9a2ee225b2`.

## Verdict: PASS

No blocking or minor findings remain. All 22 registered claims were exercised from the clean clone, and no visitor-reliant landing or README claim was left without an applicable registry entry and observable test.

## First read

Before scrolling, both fresh contexts answered all three required questions.

| Question | Cold-read answer | Exact first-screen evidence |
| --- | --- | --- |
| What does this do? | It records the steps in a blocked web task and exports them as an issue packet. | “Record a blocked web task as an issue packet” |
| Who is it for? | Low-vision workers and colleagues who need a product team to reproduce a blocked task. | “For low-vision workers and colleagues who need a product team to reproduce one blocked web task.” |
| What should I click first? | Try the finished sample packet. | “Try it with sample data” next to “The demo opens a finished issue packet. Nothing is saved.” |

At 390px the complete action and outcome are visible before the artwork. The first-read gate passes.

## Copy audit

Counts treat hyphenated terms, prices, and URLs as one word. The tables include headings, labels, actions, and complete sentences; sample trace values are product data rather than landing copy. No item exceeds 22 words, contains a banned marketing adjective, uses unexplained audience-facing jargon, or has a non-result-naming action. `chrome.storage.local`, `localStorage`, paths, and command names in README are exact technical identifiers in developer/privacy instructions, not introductory copy.

### Landing page

| Copy | Words | Check |
| --- | ---: | --- |
| Accessible Page Capture | 3 | Product wordmark |
| Skip to main content | 5 | Clear navigation action |
| Demo | 1 | Clear route label |
| How it works | 3 | Clear route label |
| Privacy | 1 | Clear route label |
| One blocked task, clearly recorded | 5 | — |
| Record a blocked web task as an issue packet | 9 | Plain job headline |
| For low-vision workers and colleagues who need a product team to reproduce one blocked web task. | 16 | Names audience and situation |
| Try it with sample data | 5 | Result-naming primary action |
| The demo opens a finished issue packet. | 7 | — |
| Nothing is saved. | 3 | — |
| Private | 1 | Fact label |
| Typed values never enter the packet. | 6 | `redacted-input` |
| Offline | 1 | Fact label |
| Capture and export work offline. | 5 | `offline-capture` |
| Free | 1 | Fact label |
| Individual exports cost $0. | 4 | `free-export` |
| Recorded steps become an issue packet your team can inspect. | 10 | Covered by packet-field/export claims |
| A recorded issue packet | 4 | Contextual section label |
| See each recorded step in order | 6 | Clear section heading |
| The packet keeps the page address, control labels, timing, and your note. | 12 | `page-context`, `ordered-labelled-events`, `user-note` |
| It does not copy the page. | 6 | `no-page-copy` |
| Show your team what blocked the task | 7 | Clear section heading |
| Start the capture | 3 | Clear step heading |
| Open the extension on the blocked page. | 7 | — |
| Recording begins only when you start it. | 7 | `explicit-start` |
| Repeat the task | 3 | Clear step heading |
| Use focus, clicks, and control keys for up to 30 seconds. | 11 | `ordered-labelled-events`, `thirty-second-limit` |
| Typed values become a redaction note. | 6 | `redacted-input` |
| Check and export | 3 | Clear step heading |
| Add your goal, preview every event, then export Markdown or JSON. | 11 | `user-note`, `preview-before-export`, `markdown-json` |
| Download Chrome extension | 3 | Result-naming download action |
| Before you share | 3 | Contextual section label |
| Check the recorded steps yourself | 5 | Clear section heading |
| The packet shows recorded steps, not an accessibility score. | 9 | `no-accessibility-score` |
| It records only the page where you start. | 8 | `single-page-capture` |
| It does not export a packet without your action. | 9 | `no-auto-export` |
| Review the packet before sharing it. | 6 | Sensible instruction, not a product claim |
| Record an access barrier and export a private issue packet. | 10 | Footer one-liner |
| Hero art generated for this product. | 6 | Asset provenance; design record provides details |

### README

| Copy | Words | Check |
| --- | ---: | --- |
| Accessible Page Capture | 3 | Product name |
| Record blocked web steps as a private issue packet. | 9 | Plain summary |
| Accessible Page Capture is a Chrome extension for low-vision workers and their colleagues. | 13 | Plain audience statement |
| It records up to 30 seconds of where focus moved, what you clicked, and which control keys you used. | 19 | `ordered-labelled-events`, `thirty-second-limit` |
| Review the issue packet, add a note, then export Markdown or JSON. | 12 | `user-note`, `preview-before-export`, `markdown-json` |
| Typed values and passwords never enter the packet. | 8 | `redacted-input`, `password-redaction` |
| Every URL query value is redacted. | 6 | `url-redaction` |
| Capture and export work offline. | 5 | `offline-capture` |
| Individual exports cost $0. | 4 | `free-export` |
| Live site: `https://accessible-page-capture.sociobot.in` | 3 | Direct destination |
| One-click isolated demo: `https://accessible-page-capture.sociobot.in/?demo=1` | 4 | Direct sandbox entry |
| What it records | 3 | Clear heading |
| Page address and title | 4 | `page-context` |
| Time-ordered recorded focus, click, and control-key steps | 7 | `ordered-labelled-events` |
| Accessible control labels and roles | 5 | `ordered-labelled-events` |
| A user-written goal or note | 5 | `user-note` |
| It does not record by default. | 6 | `explicit-start` |
| It does not capture screenshots, typed values, page content, or another page after navigation. | 14 | `no-screenshots`, `redacted-input`, `no-page-copy`, `single-page-capture` |
| The packet shows recorded steps, not an accessibility score. | 9 | `no-accessibility-score` |
| Run, test, and deploy | 4 | Clear heading |
| Requires Node.js 22 or newer. | 5 | Setup requirement |
| The build creates: | 3 | Clear introduction |
| To install the local build, open `chrome://extensions`, enable Developer mode, choose “Load unpacked,” and select `.output/chrome-mv3`. | 17 | Precise local-install instruction |
| To deploy the static site, provide `dist/site/` to the factory static deployment work order; it contains the extension ZIP under `downloads/`. | 21 | Precise deployment instruction |
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

The terminology is consistent: **issue packet** is the export, **recorded steps** are the sequence, **access barrier** is the problem, **capture** is the recording period, and **demo** is the sample workspace.

## Demo and sandbox

- The hero action opened `/?demo=1` in one click.
- The very first demo screen showed a completed 18.4-second packet with six realistic travel-request events, a populated note, and Markdown/JSON export actions.
- The persistent banner reads “Demo — sample data, nothing is saved,” includes **Reset demo**, and offers **Download Chrome extension** for the real product.
- Editing the note used only `demo:accessible-page-capture:note`; Reset removed that key and restored the shipped note. No extension storage was read or written.
- Request interception over the demo flow found no cross-origin request. After the first visit and service-worker control, the sample reloaded and exported while offline.

The demo requirement and the isolated-storage/privacy requirement pass.

## Claims and clean-clone verification

`.factory/claims.json` contains 22 IDs. A fresh clone in `/tmp/apc-review2-NGTXJY` completed `npm ci` with zero vulnerabilities, then built successfully. Every declared claim tag was run through its clean-clone demo or extension entry point; all passed. Source inspection found exactly one `@claim:<id>` tag for every registered ID.

| Claim IDs | Test form | Result |
| --- | --- | --- |
| `explicit-start`, `redacted-input`, `password-redaction`, `no-page-copy`, `preview-before-export`, `no-auto-export`, `single-page-capture`, `markdown-json`, `page-context`, `ordered-labelled-events`, `user-note`, `free-export`, `offline-capture`, `demo-offline-export`, `demo-private`, `local-storage`, `no-screenshots`, `no-capture-network`, `no-runtime-third-party`, `no-accessibility-score` | `npm run test:e2e -- --grep @claim:<id>` | PASS |
| `thirty-second-limit`, `url-redaction` | `npm run test:unit -- --testNamePattern @claim:<id>` | PASS |

The complete clean-clone quality run also passed: `npm test` (3 Vitest tests, 14 Playwright tests, package smoke), `npm run check`, and `npm run build`. The live site suite with `APC_BASE_URL=https://accessible-page-capture.sociobot.in npx playwright test tests/e2e/site.spec.ts` recorded a passed final status.

## History check

Read every earlier review/polish/handoff record: `.factory/review-1.md`, `.factory/polish-1.md`, and `.factory/handoff.md`.

| Earlier finding | Current live/code confirmation |
| --- | --- |
| F-1-1: offline capture claim | `@claim:offline-capture` loads the real unpacked extension, goes offline, records a control event, and exports it. `demo-offline-export` separately checks the PWA sample reload/export. |
| F-1-2: $0 claim | `@claim:free-export` performs a real extension export and asserts no payment endpoint or step. |
| F-1-3: unlisted replay/audit promises | Copy now makes observable packet statements; `page-context`, `ordered-labelled-events`, `user-note`, and `no-accessibility-score` register and test them. |
| F-1-4: mobile action outcome | Fresh 390px screen shows the action and its outcome before art; the responsive test asserts it. |
| F-1-5: ambiguous real-start control | The demo link is now “Download Chrome extension.” |
| F-1-6: inconsistent or technical public terms | Visitor copy consistently uses **issue packet** and **recorded steps**; the README introduction no longer says MV3 or “control trace.” |

All earlier findings are fixed in both the live product and code; none regressed.

## Structure, routing, accessibility, and identity

- Live `/`, `/demo`, `/privacy`, and `/terms` return 200; `/missing` returns a designed real HTTP 404. The downloadable extension ZIP returns 200 and `application/zip`.
- Every route has `lang="en"`, one `<main>`, one route-specific `<h1>`, an appropriate title, description, canonical URL, OG/Twitter image, favicon, and theme color. The title patterns are correct, including `Demo —`, `Privacy —`, and `Terms —` prefixes.
- Direct loads, navigation, browser Back, h1 focus movement, and the polite route announcement work. Header/footer, skip link, Privacy/Terms links, and build marker are consistent. The internal crawl found no dead normal link; the intentionally current `/missing#main` link is the skip link on the 404 document and correctly retains 404 status.
- Live axe scans in the shipped suite found no serious or critical issues; keyboard demo actions, visible focus, 44px touch targets, 200% text reflow, and reduced-motion behavior passed.
- The warm paper, ink offsets, hard rules, editorial serif, and original report-collage art implement the documented tactile field-report identity. It is recognizably product-specific rather than a generic SaaS template.

## Missed leverage

No missing feature is implied by the brief. Markdown and JSON exports supply the useful handoff formats; a sync, import, or AI step would expand a deliberately local, privacy-first capture tool without improving its stated core job. No decorative AI feature or embedded provider key is present.

## What would make this perfect

This round has no required change. Preserve the current discipline on future work: keep the finished sample isolated, register a sandbox test before adding a visitor-reliant promise, and recheck the 390px first screen whenever hero copy or artwork changes.
