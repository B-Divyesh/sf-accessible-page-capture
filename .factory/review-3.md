# Adversarial first-read review 3 — Accessible Page Capture

Reviewed 2026-08-29 UTC against <https://accessible-page-capture.sociobot.in> in new Chromium contexts at 390 × 844 and 1440 × 900, and against a clean local clone of `16987dfa3f28f4520de28687ebe285fbb82dae87`.

## Verdict: FAIL

Two minor findings remain. The product is understandable and its real flow, demo, claims, routing, accessibility, and package checks otherwise pass. Per the review contract, a PASS requires zero findings.

## First read

Before scrolling, the first screen answered all required questions at both viewports.

| Question | Cold-read answer | Exact visible evidence |
| --- | --- | --- |
| What does it do? | It records the steps in a blocked web task and exports them as an issue packet. | “Record a blocked web task as an issue packet” |
| Who is it for? | Low-vision workers and colleagues who need a product team to reproduce a blocked task. | “For low-vision workers and colleagues who need a product team to reproduce one blocked web task.” |
| What should I click first? | Try the finished sample packet. | “Try it with sample data” beside “The demo opens a finished issue packet. Nothing is saved.” |

At 390 px, the complete action block ends at y=581, before the artwork begins. This mandatory gate passes.

## Findings

### F-3-1 — minor — the mobile wordmark runs two words together

- **Quote/location:** The header product name is “Accessible Page Capture”, but at 390 px the rendered wordmark reads visually as `ACCESSIBLEPAGE` on its first line and `CAPTURE` on its second.
- **Evidence:** `site/src/main.ts` supplies `<span>Accessible<br>Page Capture</span>`. The `@media (max-width:520px)` rule in `site/src/style.css` sets `.wordmark br{display:none}`, leaving no visible space between “Accessible” and “Page”. The fresh 390 × 844 live screenshot reproduces it.
- **Why this matters:** A first-time phone visitor sees a malformed product name in the only persistent identity element. This reduces clarity before they have read the headline.
- **Concrete fix:** Keep the line break on small screens (remove `.wordmark br{display:none}`), or replace it with a visible space while preserving a deliberate mobile wrap. Add a 390 px visual or computed-text regression assertion for the wordmark.

### F-3-2 — minor — a live provenance claim is not in the claims registry

- **Quote/location:** “Hero art generated for this product.” — landing-page footer.
- **Evidence:** `.factory/design.md` documents the artwork provenance, but `.factory/claims.json` has no entry for this public assertion. The exact tag audit confirms the 22 registered IDs each occur once; none covers art provenance.
- **Why this matters:** The required claims check applies to every claim-like landing or README sentence. A source-design record is useful handoff evidence, but it is not an observable test registered for a visitor-facing assertion.
- **Concrete fix:** Remove this sentence from the public footer and retain the provenance in `.factory/design.md`, where it is already complete. If the assertion must remain public, add an `art-provenance` claim with a deterministic build/provenance manifest test that verifies the shipped art files against the recorded generated asset metadata.

## Copy audit

Counts treat hyphenated terms, URLs, and prices as one word. Headings, controls, and labels are included because they are heard independently by screen-reader users. Sample trace labels are realistic demo data rather than marketing sentences; they were checked in the demo section below. No audited sentence exceeds 22 words or uses a banned marketing adjective. F-3-1 and F-3-2 are the only flags.

### Landing page

| Copy | Words | Audit |
| --- | ---: | --- |
| Accessible Page Capture | 3 | F-3-1: rendered without the word break at 390 px |
| Skip to main content | 5 | Clear action |
| Demo | 1 | Clear route label |
| How it works | 3 | Clear route label |
| Privacy | 1 | Clear route label |
| One blocked task, clearly recorded | 5 | Context label |
| Record a blocked web task as an issue packet | 9 | Plain job headline |
| For low-vision workers and colleagues who need a product team to reproduce one blocked web task. | 16 | Audience and situation |
| Try it with sample data | 5 | Result-naming action |
| The demo opens a finished issue packet. | 7 | Clear outcome |
| Nothing is saved. | 3 | Clear demo boundary; `demo-private` |
| Private | 1 | Fact label |
| Typed values never enter the packet. | 6 | `redacted-input` |
| Offline | 1 | Fact label |
| Capture and export work offline. | 5 | `offline-capture` |
| Free | 1 | Fact label |
| Individual exports cost $0. | 4 | `free-export` |
| Recorded steps become an issue packet your team can inspect. | 10 | Covered by packet-field/export claims |
| A recorded issue packet | 4 | Context label |
| See each recorded step in order | 6 | Clear section heading |
| The packet keeps the page address, control labels, timing, and your note. | 12 | `page-context`, `ordered-labelled-events`, `user-note` |
| It does not copy the page. | 6 | `no-page-copy` |
| How it works | 3 | Clear section label |
| Show your team what blocked the task | 7 | Clear section heading |
| Start the capture | 3 | Clear step heading |
| Open the extension on the blocked page. | 7 | Usable instruction |
| Recording begins only when you start it. | 7 | `explicit-start` |
| Repeat the task | 3 | Clear step heading |
| Use focus, clicks, and control keys for up to 30 seconds. | 11 | `ordered-labelled-events`, `thirty-second-limit` |
| Typed values become a redaction note. | 6 | `redacted-input` |
| Check and export | 3 | Clear step heading |
| Add your goal, preview every event, then export Markdown or JSON. | 11 | `user-note`, `preview-before-export`, `markdown-json` |
| Download Chrome extension | 3 | Result-naming action |
| Before you share | 3 | Context label |
| Check the recorded steps yourself | 5 | Clear section heading |
| The packet shows recorded steps, not an accessibility score. | 9 | `no-accessibility-score` |
| It records only the page where you start. | 8 | `single-page-capture` |
| It does not export a packet without your action. | 9 | `no-auto-export` |
| Review the packet before sharing it. | 6 | Usable instruction |
| Record an access barrier and export a private issue packet. | 10 | Footer summary; covered by privacy/export claims |
| Hero art generated for this product. | 6 | F-3-2: unlisted public claim |

### README

| Copy | Words | Audit |
| --- | ---: | --- |
| Accessible Page Capture | 3 | Product name |
| Record blocked web steps as a private issue packet. | 9 | Plain summary |
| Accessible Page Capture is a Chrome extension for low-vision workers and their colleagues. | 13 | Clear audience |
| It records up to 30 seconds of where focus moved, what you clicked, and which control keys you used. | 19 | `ordered-labelled-events`, `thirty-second-limit` |
| Review the issue packet, add a note, then export Markdown or JSON. | 12 | `user-note`, `preview-before-export`, `markdown-json` |
| Typed values and passwords never enter the packet. | 8 | `redacted-input`, `password-redaction` |
| Every URL query value is redacted. | 6 | `url-redaction` |
| Capture and export work offline. | 5 | `offline-capture` |
| Individual exports cost $0. | 4 | `free-export` |
| Live site | 2 | Clear destination label |
| One-click isolated demo | 3 | `demo-private` |
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
| The build creates | 3 | Clear introduction |
| To install the local build, open `chrome://extensions`, enable Developer mode, choose “Load unpacked,” and select `.output/chrome-mv3`. | 17 | Precise installation instruction |
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

Terminology is consistent in visitor copy: **issue packet** for the export, **recorded steps** for the sequence, **access barrier** for the problem, **capture** for the recording period, and **demo** for the sample workspace.

## Demo, sandbox, and privacy check

- The visible hero action opened `/?demo=1` in one click.
- The first demo screen showed a completed 18.4-second travel-request packet with six events, a populated note, and both export actions.
- The persistent banner read “Demo — sample data, nothing is saved” and included **Reset demo** and **Download Chrome extension**.
- Editing the note created only `demo:accessible-page-capture:note`. Reset removed that key and restored the shipped note. The exported JSON remained the six-event sample packet.
- A request log covering load, edit, reset, and JSON export contained no cross-origin request.
- `@claim:demo-offline-export` separately passed after first visit, service-worker control, offline reload, and export.

The demo is a separate local-storage namespace and did not touch extension storage in the checked flow.

## Claims and clean-clone verification

I cloned this checkout to `/tmp/apc-review3-MnjTXM`, ran `npm ci`, then ran every `test` command from `.factory/claims.json` separately and exactly as declared. All 22 passed. A source scan also found exactly one `@claim:<id>` occurrence for each registered ID.

| Claims | Result |
| --- | --- |
| `explicit-start`, `redacted-input`, `password-redaction`, `no-page-copy`, `preview-before-export`, `no-auto-export`, `single-page-capture`, `markdown-json`, `page-context`, `ordered-labelled-events`, `user-note`, `free-export`, `offline-capture`, `demo-offline-export`, `demo-private`, `local-storage`, `no-screenshots`, `no-capture-network`, `no-runtime-third-party`, `no-accessibility-score` | PASS — each declared `npm run test:e2e -- --grep @claim:<id>` command |
| `thirty-second-limit`, `url-redaction` | PASS — each declared `npm run test:unit -- --testNamePattern @claim:<id>` command |

The full clean-clone checks also passed:

```sh
npm test
npm run check
npm run build
APC_BASE_URL=https://accessible-page-capture.sociobot.in npx playwright test tests/e2e/site.spec.ts
```

`npm test` passed 3 unit tests, 14 browser tests, and the MV3 package/load smoke test. The live suite passed all 8 tests. No registered claim test failed.

## Earlier findings and history

I read `.factory/review-1.md`, `.factory/review-2.md`, `.factory/polish-1.md`, and the prior handoff. Every earlier finding was rechecked on the live deployment and in current source.

| Earlier finding | Current confirmation |
| --- | --- |
| F-1-1 — extension offline capture | `@claim:offline-capture` uses the real unpacked extension offline and exports its recorded event; PASS. |
| F-1-2 — $0 real export proof | `@claim:free-export` exercises a real extension export and checks for no payment request/step; PASS. |
| F-1-3 — unlisted replay/audit statements | Current observable packet copy is covered by packet-field/export and `no-accessibility-score` claims; PASS. |
| F-1-4 — mobile action outcome | At 390 px, action plus outcome are wholly before the artwork; PASS. |
| F-1-5 — ambiguous demo exit action | The banner says “Download Chrome extension”; PASS. |
| F-1-6 — public terminology | Current public copy consistently uses issue packet and recorded steps; PASS. |

F-3-1 and F-3-2 are newly found issues, not reopened F-1 items.

## Structure, routes, accessibility, and identity

- Live `/`, `/?demo=1`, `/demo`, `/privacy`, `/terms`, the extension ZIP, `robots.txt`, `sitemap.xml`, favicon, and apple-touch icon returned 200. `/missing` returned a designed HTTP 404.
- Fresh route checks confirmed one `h1`, one `main`, `lang="en"`, route-specific title/description/canonical URL, favicon, OG/Twitter metadata, and theme color. The live title is `Accessible Page Capture — Report web access barriers`; policy/demo titles use the required route pattern.
- A live navigation to Privacy and browser Back both moved focus to `#page-title`, updated the polite route status, and restored the correct route/title.
- The live response has self-only CSP with `frame-ancestors` as a response header, `nosniff`, strict-origin referrer policy, HSTS, and restrictive permissions policy. No console error was observed on normal routes.
- The live Playwright suite passed serious/critical axe scans, keyboard skip link, touch-target checks, 200% reflow, reduced motion, demo offline export, download, and route checks.
- The visual system is distinct: warm dotted paper, ink rules, offset print shadows, editorial serif, and original tactile report collage match `.factory/design.md`; it is not a generic SaaS card/grid treatment.

## Missed leverage

No missing AI, import, sync, or export feature is implied by the brief. The supplied Markdown and JSON outputs provide the useful handoff formats. An AI or sync addition would expand a local-first, privacy-constrained capture tool without improving its stated core job. No decorative AI feature or provider key is present.

## What would make this perfect

Fix the 390 px wordmark so “Accessible Page” remains visibly separated, then remove or register-and-test the public hero-art provenance assertion. Re-run the full checklist after those two changes. At that point the review can move to PASS if no new finding appears.
