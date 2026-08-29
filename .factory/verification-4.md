# Independent product verification — PASS

- Work order: `accessible-page-capture-verify-4`
- Candidate commit: `f860ea77b8d72efb9a0664d6fb00a715fa024de4`
- Live URL: <https://accessible-page-capture.sociobot.in>
- Verified: 2026-08-29 UTC
- Verdict: **PASS — candidate accepted.**

No product code was changed during this verification.

## Mandatory gates

### Cold first read — PASS

A fresh desktop Chromium context loaded the live root with HTTP 200 and no page or console errors. The first viewport says:

- What it does: “Record a blocked web task as an issue packet.”
- Who it is for: “low-vision workers and colleagues who need a product team to reproduce one blocked web task.”
- What to do first: the visible one-click **Try it with sample data** link, with adjacent text: “The demo opens a finished issue packet. Nothing is saved.”

That action opens `/?demo=1`, a finished six-step, 18.4-second sample packet. It has the persistent `Demo — sample data, nothing is saved` status banner, **Reset demo**, and the real-product **Download Chrome extension** action. The demo sample is isolated until its note is edited, when it uses only `demo:accessible-page-capture:note`.

### Claims gate — PASS

`.factory/claims.json` is present and declares 22 claims. From the clean checkout after `npm ci` (177 packages installed; `npm audit` and production-only audit both found zero vulnerabilities), I ran each declared test command separately and exactly as recorded:

| Claim IDs | Command | Result |
| --- | --- | --- |
| `explicit-start`, `redacted-input`, `password-redaction`, `no-page-copy`, `preview-before-export`, `no-auto-export`, `single-page-capture`, `thirty-second-limit`, `markdown-json`, `page-context`, `ordered-labelled-events`, `user-note`, `free-export`, `offline-capture`, `demo-offline-export`, `demo-private`, `local-storage`, `no-screenshots`, `no-capture-network`, `no-runtime-third-party`, `no-accessibility-score` | `npm run test:e2e -- --grep @claim:<id>` | PASS, each individual invocation |
| `url-redaction` | `npm run test:unit -- --testNamePattern @claim:url-redaction` | PASS |

Independent source cross-check: every one of the 22 declared IDs occurs exactly once as `@claim:<id>` in the test suite. The complete clean regression command also passed: `npm test` = 4 Vitest tests, 16 Playwright browser/extension tests, and the package smoke test; `test-results/.last-run.json` says `passed` with no failed tests.

## Build, package, and deployment identity — PASS

The exact production command `npm run build` passed and created `dist/site/`, `.output/chrome-mv3/`, and `.output/accessible-page-capture-1.0.1-chrome.zip`. `npm run check` passed; there is no separate lint script. `npm run test:package` passed MV3 manifest validation, SHA verification, and a clean Chromium extension load.

Freshly-built candidate artifacts exactly matched the live deployment:

| Artifact | SHA-256 | Result |
| --- | --- | --- |
| `index.html` | `365149a253bf0eb98f4461719e70258b8c1d4202da15a84c4adad14d85f00503` | exact live match |
| main JavaScript | `414d49b041a227bb6529838ce1476f4db7779ab6c3e930d9f89cc0f732bead9f` | exact live match |
| main CSS | `79ce7b27be3a825c479c8865888214b690fb81c393ad5e973c4887edd7a192c3` | exact live match |
| `sw.js` | `5d420632bb9699865706a3c2226cc4bc4cc326afafdd5847b8ade2926149d128` | exact live match |
| Chrome extension ZIP | `cfd51653c64133ce69ab38385bbacc7dbfb1606d8fdfcd2186038a7c005c67ef` | exact live match; archive integrity passed |

Initial site JavaScript is 13.92 KB raw / 4.96 KB gzip; CSS is 11.43 KB raw / 3.31 KB gzip; the mobile hero is 43.7 KB. All are within the stated static-product budgets.

## Functional, privacy, and PWA checks — PASS

The shipped tests and fresh manual extension flows exercise explicit Start/Stop, preview-before-export, Markdown and parseable `accessible-page-capture/v1` JSON, note retention, page address/title, ordered labelled events, 30-second automatic stop, navigation boundary, offline capture/export, and recovery on an unsupported page. They also verify that typed text, password values, rich text, page copy, URL query values/fragments, screenshots, and automatic downloads are excluded. The popup keeps focus on its current `h1` across start, preview, and recovery states.

Fresh live-page request logging across landing, demo, reset, and both exports recorded only the product origin; no third-party script, font, analytics, or capture/export request was observed. Valid live loads had no console/page errors. The product has no sign-in, paid unlock, product API, or other server endpoint, so Entra-tenant and 429/`Retry-After` checks are not applicable.

The service worker is active at `https://accessible-page-capture.sociobot.in/sw.js`; `registration.update()` completed without a waiting worker. After a first `/demo` visit, a fresh context was set offline, reloaded `/demo`, and exported `sample-access-barrier.md` successfully without errors.

## Accessibility, responsive behavior, headers, and performance — PASS

- Live axe scans found zero serious or critical issues on `/`, `/?demo=1`, `/demo`, `/privacy`, `/terms`, and the real `/not-a-real-page` 404.
- Each route has `lang=en`, one `main`, one `h1`, and its own appropriate title. At 390 × 844 there was no horizontal overflow; the primary demo action was in the first viewport (50 px tall). All interactive touch targets tested by the shipped live suite were at least 44 px.
- Keyboard-only first Tab reaches the skip link, which has a designed `rgb(23, 74, 139)` 4 px focus outline. `prefers-reduced-motion: reduce` is honored and removes the hero transform. The extension tests also axe-check its start, recording, preview, and error states.
- Live headers include self-only CSP with `frame-ancestors 'none'`, HSTS, `nosniff`, strict-origin referrer policy, and restrictive permissions policy. HTML is 30-second revalidated; hashed JS/CSS/art are one-year immutable; `sw.js` is `no-cache`.
- Fresh mobile Lighthouse report: Performance 92, Accessibility 100, Best Practices 100, SEO 100; LCP 1.06 s, TBT 346 ms, CLS 0. Lighthouse reported its known Chromium tab crash after producing the complete JSON; independent Playwright checks had no page crash.

## Defects by severity

None found: **critical 0, high 0, medium 0, low 0**.

## Re-run

```sh
npm ci
# Run each command in .factory/claims.json individually.
npm test
npm run check
npm run build
APC_BASE_URL=https://accessible-page-capture.sociobot.in npx playwright test tests/e2e/site.spec.ts
```
