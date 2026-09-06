# Review 5 — Record a blocked web task as an issue packet

- Reviewed: 2026-09-06 UTC
- Live URL: <https://accessible-page-capture.sociobot.in>
- Implementation candidate: `f860ea77b8d72efb9a0664d6fb00a715fa024de4`
- Documentation checkout: `c1c40fc049b2fbd64635aa5527eaa50d827d5011`

## Verdict: PASS

**PASS — 0 findings and 0 untested public claims.** The later commits after the implementation candidate contain only review and handoff records. A fresh candidate build exactly matches the live site and downloadable extension.

## First screen

Fresh Chromium contexts opened the live root at 1440 × 900 and a phone-sized 390 × 844 viewport before scrolling.

| Required answer | What the first screen says |
| --- | --- |
| Job | “Record a blocked web task as an issue packet.” |
| Audience | “For low-vision workers and colleagues who need a product team to reproduce one blocked web task.” |
| First action | “Try it with sample data.” The adjacent copy says it opens a finished issue packet and saves nothing. |

The full action block and three facts are visible before the art at 390 px. The fresh renders have no page or console errors. Evidence: [desktop](evidence/review-5-live-desktop.png), [phone](evidence/review-5-live-phone.png).

## Demo and real-data boundary

The first action opened the populated sample in one click. It showed a realistic travel-request barrier with a page title and address, six recorded steps, a populated note, 18.4-second duration, and Markdown and JSON export controls. The persistent banner says “Demo — sample data, nothing is saved” and includes **Reset demo** and **Download Chrome extension**.

In a fresh phone context, the demo began with no local-storage keys. Editing the sample note created only `demo:accessible-page-capture:note`; Reset demo removed that key, restored the shipped note, and left no data behind. The checked demo did not read or write extension capture storage. The separate live suite recorded only same-origin requests during landing, demo, reset, and export. Evidence: [sample phone view](evidence/review-5-live-demo-phone.png).

## Claim checks

From the clean checkout, `npm ci` installed 177 packages with zero reported audit vulnerabilities. I invoked every command declared in `.factory/claims.json` separately and exactly as recorded. All 22 passed; no public claim is untested.

| Claim IDs | Declared command | Result |
| --- | --- | --- |
| `explicit-start`, `redacted-input`, `password-redaction`, `no-page-copy`, `preview-before-export`, `no-auto-export`, `single-page-capture`, `thirty-second-limit`, `markdown-json`, `page-context`, `ordered-labelled-events`, `user-note`, `free-export`, `offline-capture`, `demo-offline-export`, `demo-private`, `local-storage`, `no-screenshots`, `no-capture-network`, `no-runtime-third-party`, `no-accessibility-score` | `npm run test:e2e -- --grep @claim:<id>` | PASS, each invocation |
| `url-redaction` | `npm run test:unit -- --testNamePattern @claim:url-redaction` | PASS |

The full regression command also passed: `npm test` (4 Vitest tests, 16 browser/extension tests, and package smoke). `npm run check`, `npm run build`, `npm run test:package`, and both production-only and full moderate audit commands passed. The clean build produced `dist/site/`, the MV3 unpacked extension, and the 9,554-byte ZIP.

## Live product checks

- `APC_BASE_URL=https://accessible-page-capture.sociobot.in npx playwright test tests/e2e/site.spec.ts` passed all 9 live tests.
- The live root, `/demo`, `/privacy`, `/terms`, `robots.txt`, `sitemap.xml`, and extension ZIP return 200. `/missing` returns a designed HTTP 404, which is expected and not a defect.
- Route titles, descriptions, canonical and social metadata, `lang`, one `main`, one `h1`, skip link, keyboard focus, history focus, legal links, touch-target size, reduced motion, and axe serious/critical scans passed on the live routes.
- The downloaded live ZIP passed the clean-consumer package/load test. Its SHA-256 is `cfd51653c64133ce69ab38385bbacc7dbfb1606d8fdfcd2186038a7c005c67ef`.
- Fresh local and live SHA-256 values match for `index.html`, site JavaScript, site CSS, `sw.js`, and the ZIP. This proves the live runtime is the implementation candidate rather than the two documentation-only commits.
- A service-worker-controlled demo reload and Markdown export worked offline after its first visit. The real extension offline capture/export claim also passed separately.
- There is no product backend, sign-in, paid tier, or product API endpoint. Tenant isolation, restart persistence, and 429/`Retry-After` checks are therefore not applicable. The extension is local-first; direct request logging found no analytics, third-party runtime resource, or capture/export network call.

The live response includes a self-only CSP with `frame-ancestors 'none'`, HSTS, `nosniff`, strict-origin referrer policy, and a restrictive permissions policy. There is no repository `verify-url.sh`; the passing live Playwright suite covered its required semantic and console checks, and the route scans use Playwright axe.

## Performance and accessibility

The candidate site bundle is 13.92 KB raw / 4.96 KB gzip JavaScript and 11.43 KB raw / 3.31 KB gzip CSS. The first-screen art is below the 300 KB budget. A fresh mobile Lighthouse report recorded Performance 100, Accessibility 100, Best Practices 100, SEO 100, LCP 1.05 s, CLS 0, and TBT 0 ms: [report](evidence/review-5-lighthouse-live.json).

The Lighthouse CLI reported a Chromium tab crash after writing the complete JSON report. This is a measurement teardown issue, not a live-page error: the report contains all audits, and the independent Playwright live suite and fresh desktop/phone contexts completed without page crashes or console errors.

## Earlier findings

Every earlier review and verification finding, including minor findings, has a current disposition.

| Earlier finding | Current disposition |
| --- | --- |
| Original verification: rich-text/page-copy leak; missing ZIP; URL redaction; unavailable paid checkout; lost popup focus; small targets; soft 404; dependency findings; incomplete claim coverage | Fixed or removed from scope. Current tests exclude textarea/password/contenteditable/page-copy values, load the live ZIP, redact every query value and fragment, retain heading focus, enforce 44 px targets, and verify a real 404. There is no current paid offer or price claim. Both audit commands report zero moderate vulnerabilities. All 22 current claims are registered and tested. |
| Verification 2: missing registered tests for page context, ordered labelled steps, and note | `page-context`, `ordered-labelled-events`, and `user-note` now export and assert those exact fields. |
| F-1-1: offline wording did not test extension capture | `offline-capture` uses the unpacked extension offline, records a control, and exports it. `demo-offline-export` separately covers the PWA sample. |
| F-1-2: $0 proof only used demo | `free-export` completes a real extension JSON export with no payment UI or payment request. |
| F-1-3: unlisted replay and limitation wording | Observable packet fields and the no-score limitation are covered by registered tests. |
| F-1-4: mobile action outcome below the fold | This review's 390 × 844 fresh render shows the action and both outcome sentences before the artwork. |
| F-1-5: unclear demo exit action | The persistent action is now “Download Chrome extension.” |
| F-1-6: inconsistent or technical public terms | Current public copy consistently uses **issue packet** and **recorded steps**. |
| F-3-1: joined mobile wordmark | The fresh phone render visibly separates “Accessible”, “Page”, and “Capture”. |
| F-3-2: unregistered hero-art provenance claim | The public provenance claim is absent; provenance remains in `.factory/design.md`. |

## Findings

None. Critical: 0. High: 0. Medium: 0. Low: 0. Untested claims: 0.
