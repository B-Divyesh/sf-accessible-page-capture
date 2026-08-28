# Independent product verification — FAIL

- Work order: `accessible-page-capture-verify-2`
- Candidate commit: `26f715e4e8362ad7fd9b0327960563d988cb76e3`
- Live URL: <https://accessible-page-capture.sociobot.in>
- Verified: 2026-08-28 UTC
- Verdict: **FAIL — do not release until the claims registry covers the remaining user-reliant core claims.**

This is a fresh clean-clone verification. The prior critical privacy, extension-download, focus, URL-redaction, target-size, checkout, and 404 findings were rechecked and do not reproduce on this candidate or deployment. The sole release blocker below follows the factory claims contract.

## Release-blocking finding

### High — user-reliant core claims are not registered or tested

The live landing page and README make concrete promises which a visitor can rely on, but `.factory/claims.json` has no claim/test for them:

- README, “What it records”: page address and title; time-ordered focus, click, and control-key events; accessible control labels and roles; and a user-written goal/note.
- Landing page: “Focus and control events become a report a team can inspect.”

The direct extension exercise shows this functionality works for a representative case: an explicit capture at `/demo` stored focus/click events with labels and roles, retained the note, and exported JSON with `page.url`, `page.title`, three events, and the entered note. That is not sufficient under the attached `claims` contract: every claim-like visitor promise must appear in `claims.json` with an observable demo-entry test. Add appropriately scoped claim IDs/tests (rather than removing this core-product copy) and re-verify. Per the contract, this finding fails the review.

## First-read gate — PASS

Cold loading the production URL returned 200 with no console or page errors. Within the first screen:

- What it does: “Record an access barrier others can replay.”
- For whom: “For low-vision workers and colleagues who need a product team to reproduce one blocked web task.”
- What to click first: the visible “Try it with sample data” action, with “The demo opens a finished packet. Nothing is saved.”

The action opened `/demo` in one click, showed the populated 18.4-second packet, and exposed the persistent “Demo — sample data, nothing is saved” banner, Reset demo, and Start for real controls.

## Required claims gate — PASS

From a clean clone detached at the candidate: `npm ci` completed with 177 packages and zero audit vulnerabilities. Every command declared in `.factory/claims.json` was run separately through the shipped demo/extension test entry point and passed. Each ID appears exactly once in the test sources.

| Claim IDs | Exact declared command | Result |
| --- | --- | --- |
| `explicit-start`, `redacted-input`, `password-redaction`, `no-page-copy`, `preview-before-export`, `no-auto-export`, `single-page-capture`, `markdown-json`, `free-export`, `offline-capture`, `demo-private`, `local-storage`, `no-screenshots`, `no-capture-network`, `no-runtime-third-party` | `npm run test:e2e -- --grep @claim:<id>` | PASS for every ID |
| `thirty-second-limit`, `url-redaction` | `npm run test:unit -- --testNamePattern @claim:<id>` | PASS for both IDs |

The complete suite also passed: `npm test` — 3 unit tests, 9 Playwright tests, and packaged-extension SHA-256/MV3/clean-Chromium smoke test. `npm run check` passed. `npm run build` passed and produced `dist/site`, the 9,554-byte Chrome ZIP, and the unpacked MV3 extension.

## End-to-end, privacy, and deployment evidence — PASS

- Fresh Chromium extension profile: explicit start/stop, preview before export, Markdown/JSON export, optional note, normal focus/click/key trace, input/password/contenteditable redaction, no copied paragraph text, no screenshots, local `chrome.storage.local`, navigation boundary, unsupported-page recovery, and keyboard/screen-reader focus state all passed.
- The direct normal flow exported `accessible-page-capture/v1`, page URL/title, three labelled events, and its note. Input values were absent in the adversarial test suite.
- Demo: note edits stayed under `demo:accessible-page-capture:note`; Reset removed it; no cross-origin requests occurred. Offline reload and Markdown export passed after the first visit.
- Live site Playwright test suite passed all six site tests against the production URL, including `/`, `/demo`, `/privacy`, `/terms`, `/missing` (real 404), ZIP download, 390px layout/touch targets, 200% text reflow, reduced motion, offline export, and axe scans.
- Production JS, CSS, and hero asset SHA-256 values exactly matched the fresh candidate build. The downloadable ZIP returned 200 / `application/zip` / 9,554 bytes.
- No runtime third-party scripts, fonts, analytics, Azure/OpenAI endpoints, or product API calls were found. The only `fetch` is the same-origin service worker cache strategy. There is no product server-side API or sign-in flow, so rate-limit and Entra checks are not applicable.

## Accessibility, policies, and performance — PASS

- Live axe scans on `/`, `/demo`, `/privacy`, `/terms`, and `/missing`, plus extension landing/recording/preview/error states: zero serious/critical findings.
- At 390px: no horizontal overflow; first Tab reached the skip link; its computed focus outline was a visible `rgb(23, 74, 139) solid 4px`; demo navigation, reset, and export worked by keyboard. Reduced-motion rendering removed the hero transform.
- Live console/page errors: none. A supplied `verify-url.sh` was not present in the repository; its semantic/console coverage was performed by the Playwright tests and live inspection.
- Service worker was controlling `/demo`, `registration.update()` succeeded, and cache `apc-site-v2` was present. Offline reload/export was independently exercised.
- Response headers include HSTS, CSP limited to `'self'`, `X-Content-Type-Options`, strict-origin Referrer-Policy, and Permissions-Policy. HTML revalidates at 30 seconds; hashed assets are one-year immutable; `sw.js` is `no-cache`.
- Lighthouse against live production (Chromium, mobile defaults): Performance **100**, Accessibility **100**, LCP **1.1 s**, CLS **0**, TBT **0 ms**, Speed Index **0.9 s**. Fresh build budget: JS 13,337 bytes raw / 4,910 gzip; CSS 11,463 bytes raw / 3,319 gzip; extension 22.02 KB unpacked.

## Required remediation

1. Add claim IDs and observable tests for the core packet fields/events/note promised by the landing/README, using the demo entry point and real exported output.
2. Re-run all declared claim commands from a clean clone and repeat independent verification.

