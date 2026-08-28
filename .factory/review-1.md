# Adversarial first-read review 1 — Accessible Page Capture

Reviewed 2026-08-28 UTC against `https://accessible-page-capture.sociobot.in`, from a fresh Chromium context at 390 × 844 and 1440 × 900, and from a clean clone of commit `3ba6d29395ddd09f38c33de115ee018b409dd7f7`.

## Verdict: FAIL

One blocking verification gap remains, followed by five minor copy and claim-registry findings. A passing build is not sufficient here: the public offline promise is broader than the test that is meant to prove it.

## First read

Before scrolling, the product was understandable on both viewports.

| Question | Cold-read answer | Evidence visible before scrolling |
| --- | --- | --- |
| What does it do? | It records the steps of an inaccessible web interaction and produces an issue packet. | “Record an access barrier others can replay” |
| Who is it for? | Low-vision workers and colleagues who need a product team to reproduce a blocked task. | “For low-vision workers and colleagues who need a product team to reproduce one blocked web task.” |
| What should I click first? | “Try it with sample data.” | Visible primary action |

This does **not** trigger the first-read blocking gate. On the 390px screenshot, though, the explanatory text after the action is below the fold; that is recorded as F-1-4.

## Findings

### F-1-1 — BLOCKING — the offline claim is not exercised for extension capture

- **Quote/location:** “Capture and export work offline.” — landing-page fact and README introduction.
- **Registry entry:** `offline-capture` in `.factory/claims.json`.
- **Evidence:** Its declared test, `tests/e2e/site.spec.ts` (`@claim:offline-capture`), visits `/demo`, waits for the website service worker, sets the browser context offline, reloads `/demo`, and exports Markdown. It never loads the unpacked extension, starts a capture, records an event, stops it, or exports an extension packet while offline.
- **Why this fails review:** The web demo can export a bundled sample offline, but that does not verify the first half of the visitor-facing promise: extension capture works offline. The claim test therefore proves a narrower behavior than the text says.
- **Concrete fix:** Add an extension Playwright claim test using a fresh persistent profile: load an ordinary page while online, switch the context offline, start the extension capture, focus/click a control, stop it, and assert a Markdown or JSON export contains that recorded event. Keep the existing demo reload/export check as a separate `demo-offline-export` claim, or expand `offline-capture` to perform both checks.

### F-1-2 — minor — the $0 claim is tested only in the sandbox, not for a real extension export

- **Quote/location:** “Individual exports cost $0.” — landing-page fact and README introduction.
- **Registry entry:** `free-export`.
- **Evidence:** The tagged test opens `/demo` and asserts that `Export JSON` downloads. The real extension export path is tested elsewhere, but not by `@claim:free-export`; the declared claim test cannot distinguish a free demo from a paid real export.
- **Why this fails review:** A visitor relies on the price statement for the installed extension, not only for the sample packet.
- **Concrete fix:** Move or duplicate the real extension JSON-export-with-no-payment/no-payment-network assertion into the `@claim:free-export` test. Alternatively, narrow the public sentence to “Demo exports cost $0,” though that would be less useful.

### F-1-3 — minor — replay and limitation promises are absent from the claim registry

- **Quotes/locations:**
  - “Record an access barrier others can replay” — landing `<h1>`.
  - “Focus and control events become a report a team can inspect.” — landing hero caption.
  - “It does not run an automated accessibility audit.” — landing “Clear limits”.
  - “It does not certify legal compliance.” — landing “Clear limits”.
  - “A packet is supporting evidence, not an accessibility certification.” — README.
- **Evidence:** `.factory/claims.json` has useful entries for ordered events, page context, and export, but none for replayable evidence, the absence of automated audit output, or the absence of certification output. These are visitor-relevant statements without matching registry entries.
- **Why this fails review:** The claims contract requires every claim-like sentence to be listed and tested. Existing partial tests do not create a claim entry for these promises.
- **Concrete fix:** Add separately tagged, observable tests for a packet containing the context and ordered labelled steps needed to inspect a replay, and for a completed capture showing only a trace packet rather than an audit score, conformance result, or certification. If the negative promises cannot be tested honestly, move them to a clearly scoped legal disclaimer and remove them from the marketing copy.

### F-1-4 — minor — mobile action outcome is below the first viewport

- **Quote/location:** “Try it with sample data” is visible on the 390px landing screen; its adjacent explanation, “The demo opens a finished packet. Nothing is saved.”, begins below the viewport.
- **Why this fails review:** The required first-screen action must state what happens next beside the action. A mobile visitor can infer “sample data,” but cannot see that it opens a finished packet or that nothing is saved without scrolling.
- **Concrete fix:** Keep the action and its two short outcome sentences together above the art on small screens, or move the art below the complete action block. Verify at 390px with a screenshot or viewport assertion.

### F-1-5 — minor — one result action is not named for its result

- **Quote/location:** “Start for real” — persistent demo banner.
- **Why this fails review:** It is a download link for the Chrome extension, but its label does not tell a first-time visitor what will happen. This conflicts with the result-naming button/link rule.
- **Concrete fix:** Replace it with “Download Chrome extension”.

### F-1-6 — minor — terms for the exported artefact and trace are inconsistent or technical

- **Quotes/locations:** “A short trace for one blocked task”, “Focus and control events become a report”, “compact report”, and “issue packet” on the landing page; README opening uses “Chrome MV3 extension” and “focus and control trace”.
- **Why this fails review:** The product uses *trace*, *report*, and *packet* for overlapping concepts, while “MV3” and “control trace” are implementation/accessibility jargon in the README’s introductory explanation. This adds translation work for the low-vision workers named as the audience.
- **Concrete fix:** Pick “issue packet” for the exported file and “recorded steps” for the sequence. For example, rewrite the README opening as: “Accessible Page Capture is a Chrome extension for low-vision workers and their colleagues. It records up to 30 seconds of where focus moved, what you clicked, and which keys you used.” Retain “Manifest V3” only in an installation/developer-details section if needed.

## Copy audit

Counts treat hyphenated terms, URLs, and prices as one word. No landing or README sentence exceeds the 22-word cap. The terminology and action-label issues above are the flags; no banned marketing adjective was found.

### Landing page

| Copy | Words | Flag |
| --- | ---: | --- |
| A short trace for one blocked task | 7 | F-1-6: technical/undefined “trace” |
| Record an access barrier others can replay | 7 | F-1-3: unlisted replay promise |
| For low-vision workers and colleagues who need a product team to reproduce one blocked web task. | 16 | — |
| Try it with sample data | 5 | F-1-4: outcome is below mobile viewport |
| The demo opens a finished packet. | 6 | F-1-4: not visible with the action at 390px |
| Nothing is saved. | 3 | F-1-4: not visible with the action at 390px |
| Private | 1 | — |
| Typed values never enter the packet. | 6 | — |
| Offline | 1 | F-1-1: associated promise not fully tested |
| Capture and export work offline. | 5 | F-1-1 |
| Free | 1 | F-1-2: associated promise tested only in demo |
| Individual exports cost $0. | 4 | F-1-2 |
| The product, not a scan | 5 | F-1-6: context-poor heading |
| See the interaction in order | 5 | — |
| The packet keeps the page address, control labels, timing, and your note. | 12 | — |
| It does not copy the page. | 6 | — |
| Focus and control events become a report a team can inspect. | 11 | F-1-3, F-1-6 |
| How it works | 3 | — |
| Make one barrier concrete | 4 | F-1-6: abstract/context-poor heading |
| Start the capture | 3 | — |
| Open the extension on the blocked page. | 7 | — |
| Recording begins only when you start it. | 7 | — |
| Repeat the task | 3 | — |
| Use focus, clicks, and control keys for up to 30 seconds. | 11 | — |
| Typed values become a redaction note. | 6 | — |
| Check and export | 3 | — |
| Add your goal, preview every event, then export Markdown or JSON. | 11 | — |
| Download Chrome extension | 3 | — |
| Clear limits | 2 | — |
| This is evidence, not a verdict | 6 | F-1-3: limitation claim needs registry coverage |
| It does not run an automated accessibility audit. | 8 | F-1-3 |
| It records only the page where you start. | 8 | — |
| It does not export a packet without your action. | 9 | — |
| It does not certify legal compliance. | 6 | F-1-3 |
| Record an access barrier and export a private issue packet. | 10 | — |
| Hero art generated for this product. | 6 | — |
| Start for real | 3 | F-1-5: does not name the download result |

### README

| Copy | Words | Flag |
| --- | ---: | --- |
| Record an access barrier and export a private issue packet. | 10 | — |
| Accessible Page Capture is a Chrome MV3 extension for low-vision workers and the colleagues supporting them. | 15 | F-1-6: “MV3” is unexplained jargon |
| It records one explicit focus and control trace for up to 30 seconds. | 13 | F-1-6: “control trace” is jargon |
| The user previews the packet, adds a note, then exports Markdown or JSON. | 13 | — |
| Typed values and passwords never enter the packet. | 8 | — |
| Every URL query value is redacted. | 6 | — |
| Capture and export work offline. | 5 | F-1-1 |
| Individual exports cost $0. | 4 | F-1-2 |
| Page address and title | 4 | — |
| Time-ordered focus, click, and control-key events | 6 | — |
| Accessible control labels and roles | 5 | — |
| A user-written goal or note | 5 | — |
| It does not record by default. | 6 | — |
| It does not capture screenshots, typed values, page content, or another page after navigation. | 14 | — |
| A packet is supporting evidence, not an accessibility certification. | 9 | F-1-3 |
| Requires Node.js 22 or newer. | 5 | — |
| The build creates: | 3 | — |
| To install the local build, open `chrome://extensions`, enable Developer mode, choose “Load unpacked,” and select `.output/chrome-mv3`. | 16 | F-1-6: retain MV3 only as a developer installation detail |
| Capture data stays in `chrome.storage.local`. | 5 | — |
| The demo uses only the `demo:accessible-page-capture:` localStorage prefix. | 6 | — |
| Capture and export make no outside request. | 6 | — |
| The site loads no third-party scripts, fonts, or analytics. | 8 | — |
| See `/privacy` and `/terms` on the deployed site. | 7 | — |
| Licensed under MIT. | 3 | — |
| Built by Param Factory. | 4 | — |

README headings, command comments, filenames, URLs, and list labels are fragments rather than sentences and were checked for jargon/action labels. The only material introductory jargon is covered by F-1-6.

## Demo and sandbox checks

- The one-click landing action opened `/demo` in a fresh context.
- Its first screen already showed a finished 18.4-second, six-event travel-request packet with a populated note and export actions.
- The persistent banner read “Demo — sample data, nothing is saved” and included Reset demo plus the real-start download link.
- Editing the note created only `demo:accessible-page-capture:note`; Reset demo restored the bundled note and left localStorage empty.
- Request capture for the landing/demo path found no cross-origin request. The separately declared demo-private and no-runtime-third-party commands passed.
- The live site suite passed its service-worker offline reload/export check. F-1-1 remains because that does not exercise offline *extension capture*.

## Claims and clean-clone verification

I ran `npm ci` in `/tmp/apc-review-kpYIUz`, then every command declared in `.factory/claims.json` separately. All commands returned passing tests; the final Playwright status file reports `passed` with no failed tests.

| Claim IDs | Declared command | Result |
| --- | --- | --- |
| `thirty-second-limit`, `url-redaction` | `npm run test:unit -- --testNamePattern @claim:<id>` | PASS |
| `explicit-start`, `redacted-input`, `password-redaction`, `no-page-copy`, `preview-before-export`, `no-auto-export`, `single-page-capture`, `markdown-json`, `page-context`, `ordered-labelled-events`, `user-note`, `free-export`, `offline-capture`, `demo-private`, `local-storage`, `no-screenshots`, `no-capture-network`, `no-runtime-third-party` | `npm run test:e2e -- --grep @claim:<id>` | PASS |

The full clean-clone quality commands also passed: `npm test` (3 unit + 12 browser tests + package smoke), `npm run check`, `npm run build`, and `npm run test:package`. The live-site suite, `APC_BASE_URL=https://accessible-page-capture.sociobot.in npx playwright test tests/e2e/site.spec.ts`, passed all 9 tests.

## Structure, routing, accessibility, and visual review

- Live routes `/`, `/demo`, `/privacy`, and `/terms` returned 200. `/missing` returned an actual 404 with the designed “This report slipped out of the stack” page and a return-home action.
- Each route had one `<h1>`, `lang="en"`, a route-specific title and description, canonical URL, favicon, and shared social image. Titles follow the required patterns: home is `Accessible Page Capture — Report web access barriers`; policy and demo routes use `Privacy —`, `Terms —`, and `Demo —` prefixes.
- Deep-link loading and browser Back returned to the home route, focused its `<h1>`, and updated the polite route-status region.
- The header/footer are consistent and include the skip link, Demo/How it works/Privacy, Privacy, Terms, Param Factory, and build identifier.
- Direct link crawl returned 200 for all internal destinations, the downloadable ZIP, `robots.txt`, `sitemap.xml`, and the external Param Factory link. `mailto:` links are explicit and were not HTTP-crawled.
- Live mobile/desktop page errors were absent apart from Chromium's expected resource message for the deliberately requested `/missing` HTTP 404. Live axe and responsive tests pass through the site suite.
- The warm-paper, offset-ink, tactile report visual system is distinct from a generic SaaS template and matches `.factory/design.md`. No decorative or embedded-key AI feature exists; the brief does not imply an AI, sync, or additional import/export feature beyond the Markdown/JSON exports already supplied.

## History check

No earlier `.factory/review-*.md` or `.factory/polish-*.md` files exist. I read the prior `.factory/handoff.md` and the available verification reports. They reported no individual finding IDs to carry forward. Their accepted behaviors were rechecked live and in source: demo namespace/reset, privacy redaction, route behavior, metadata, package generation, and offline demo export all still work. F-1-1 through F-1-6 are newly identified gaps, not unresolved earlier IDs.

## What would make this perfect

Exercise the real extension capture offline and attach that behavior to the exact offline claim; prove the real extension's $0 export; register or remove the remaining replay/limitation promises; then keep the mobile action explanation in the first viewport and tighten the labels/terminology. Re-run the complete clean-clone and live checklist after those changes. Only then should this review change to PASS.
