# Independent product verification — PASS

- Work order: `accessible-page-capture-verify-3`
- Candidate commit: `0c97e65678e0545f88490dc027ca41c20de5bc4a`
- Live URL: <https://accessible-page-capture.sociobot.in>
- Verified: 2026-08-28 UTC
- Verdict: **PASS — release candidate accepted.**

This was a fresh clean-clone verification. No product code was changed. The candidate is a local-first MV3 browser extension with a static/PWA landing and demo; it has no product backend, sign-in flow, paid unlock, or runtime AI call.

## Mandatory first-read gate — PASS

A cold desktop load of the live URL returned HTTP 200, with no page errors or JavaScript-console errors.

- It does: “Record an access barrier others can replay.”
- It is for: “low-vision workers and colleagues who need a product team to reproduce one blocked web task.”
- Click first: the visible “Try it with sample data” action; adjacent copy says that it opens a finished packet and saves nothing.

That one click opened `/demo`, showing the finished 18.4-second, six-event issue packet plus the persistent “Demo — sample data, nothing is saved” banner, Reset demo, and Start for real controls. This meets the plain-words and one-click isolated-demo gates.

## Claims gate — PASS

`.factory/claims.json` exists and contains 20 unique IDs. After `npm ci` from this clean checkout (177 packages, zero audit vulnerabilities), I ran **every declared `test` command separately and exactly as listed**. All passed through the shipped demo/extension entry points. Registry/source inspection also found each `@claim:<id>` exactly once.

| Claims | Declared command | Result |
| --- | --- | --- |
| `explicit-start`, `redacted-input`, `password-redaction`, `no-page-copy`, `preview-before-export`, `no-auto-export`, `single-page-capture`, `markdown-json`, `page-context`, `ordered-labelled-events`, `user-note`, `free-export`, `offline-capture`, `demo-private`, `local-storage`, `no-screenshots`, `no-capture-network`, `no-runtime-third-party` | `npm run test:e2e -- --grep @claim:<id>` | PASS for each individual invocation |
| `thirty-second-limit`, `url-redaction` | `npm run test:unit -- --testNamePattern @claim:<id>` | PASS for each individual invocation |

The registry now covers the prior missing core packet promises: address/title, ordered labelled focus/click/key events, and exact user note. It also covers explicit start, 30-second limit, all query-value and fragment redaction, text/password/rich-text/page-copy exclusion, preview-before-export, no automatic export, navigation boundary, local storage, no screenshots, and no capture/export network request.

## Clean build and package checks — PASS

```sh
npm ci
npm test
npm run check
npm run build
npm run test:package
npm audit --omit=dev --audit-level=moderate
npm audit --audit-level=moderate
```

All commands passed. `npm test` passed 3 Vitest tests, 12 Playwright tests, and the package smoke test. TypeScript has no errors; no separate lint script is configured. The exact production build produced `dist/site`, `.output/chrome-mv3`, and `.output/accessible-page-capture-1.0.0-chrome.zip`.

- Initial JavaScript: 13,337 bytes raw / 4,941 bytes gzip (under the 200 KB budget).
- CSS: 11,463 bytes raw / 3,330 bytes gzip (under the 50 KB budget).
- Mobile hero: 43,696 bytes (under the 300 KB budget).
- Packaged extension: 9,554 bytes; unpacked MV3 output: 22,022 bytes.

`npm run test:package` passed both for the local ZIP and for a fresh download of the live ZIP: SHA-256 match, MV3 manifest validation, unpacking, and clean Chromium load. The manifest has only `storage`, `tabs`, `activeTab`, and `downloads` permissions; broad HTTP(S) host access is used to support explicit capture on a user-selected page.

## Independent functional and privacy exercises — PASS

Fresh Chromium extension profiles confirmed the real flow: no session before Start; explicit start/stop; preview before either download; usable Markdown and parseable `accessible-page-capture/v1` JSON; page title/address, ordered labelled events, and optional note in the packet. Input, password, contenteditable, and ordinary paragraph-copy adversaries were absent from storage and both export formats. A sensitive URL with `patient`, `diagnosis`, `token`, and a fragment exported only redacted query values and no fragment.

The extension auto-stops at the exact 30-second boundary, stops on navigation away from the starting tab, limits storage to local `chrome.storage.local`, excludes screenshots, and returns the accessible recovery message on an unsupported page. Its popup moves focus to the new `h1` on start, preview, and error states; axe found no serious or critical issues in landing, recording, preview, or recovery states.

The live `/demo` test edited the sample note, reset it, exported both formats, and confirmed its only storage key was `demo:accessible-page-capture:note`. Request capture for the landing/demo/offline flow contained only `https://accessible-page-capture.sociobot.in`; source and packaged-artifact inspection found no analytics, third-party fonts/scripts, Azure/OpenAI endpoint, or embedded secret.

## Live deployment, response policy, and PWA — PASS

Fresh local output matched live output byte-for-byte:

| Artifact | SHA-256 | Match |
| --- | --- | --- |
| `index.html` | `9fd2eed969b5f6cde78779541c379291d44e431117c3cbeb1ba6c9839db18df1` | exact |
| main JS | `5447981331ad86641a38b97cd40e4a30bfca0bd986fb3cb573dda6b9b6223d0b` | exact |
| main CSS | `8582476027c3de99249e0fc4da4b08561d527ccd67aa0da1216d81a1798cfd10` | exact |
| `sw.js` | `bf734043b72cb8affcbf275f69a6a23109a0494e1eb2cddb70589aebff4b54b9` | exact |
| Chrome ZIP | `ce1853c323f1ea3f3d06a9485cf391aa2f766f4348909a8c96384237741bbde0` | exact |

Live site Playwright testing (`APC_BASE_URL=https://accessible-page-capture.sociobot.in npx playwright test tests/e2e/site.spec.ts`) passed all 9 tests, including the download, the real HTTP 404, responsive checks, claims observable from the live demo, and offline reload/export. A fresh service-worker context was controlled by the `apc-site-v2` worker; `registration.update()` completed, offline `/demo` reload restored the right page, and Markdown export worked offline.

Response checks found a self-only CSP, HSTS, `nosniff`, strict-origin referrer policy, restrictive permissions policy, 30-second revalidated HTML, immutable one-year hashed assets, and `sw.js: no-cache`. `/missing` correctly returns HTTP 404 and the site map/robots/privacy/terms/download links resolve. There is no server-side product API or factory unlock endpoint in this build, so rate-limit testing is not applicable. There is no sign-in, so Entra tenant verification is not applicable.

## Accessibility, responsive behavior, and performance — PASS

- Live axe scans at desktop and 390 px on `/`, `/demo`, `/privacy`, `/terms`, and `/missing`: zero serious/critical findings.
- At 390 px all tested controls were at least 44 by 44 CSS pixels, no route overflowed, first Tab reached the skip link, and keyboard navigation/reset/export worked. The designed focus outline is visible; text at 200% retained a single-column usable layout.
- All normal live routes loaded without console/page errors. Chromium reports the expected network message for the deliberately requested HTTP-404 document itself; there is no application exception.
- `prefers-reduced-motion` removes the hero transform; no flashing or autoplay behavior is present.
- Live Lighthouse mobile JSON: Performance 97, Accessibility 100, Best Practices 100, SEO 100; LCP 2.3 s, TBT 0 ms, CLS 0. The Lighthouse CLI reported a Chromium target crash during teardown after writing the complete JSON; the resulting audits and metrics are complete, and independent Playwright runs had no page crash.

## Defects

No release-blocking, high, medium, or low product defects found in this candidate.

## Re-run

```sh
npm ci
npm test
npm run check
npm run build
APC_BASE_URL=https://accessible-page-capture.sociobot.in npx playwright test tests/e2e/site.spec.ts
curl -fsSL https://accessible-page-capture.sociobot.in/downloads/accessible-page-capture-chrome.zip -o /tmp/apc-live-extension.zip
APC_PACKAGE_PATH=/tmp/apc-live-extension.zip npm run test:package
```
