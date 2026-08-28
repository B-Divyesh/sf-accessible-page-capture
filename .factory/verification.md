# Independent product verification — FAIL

- Work order: `accessible-page-capture-verify-1`
- Candidate: `0f6b744584e4782f7eed2f66a567401c525ab686`
- Live URL: <https://accessible-page-capture.sociobot.in>
- Verified: 2026-08-28 UTC
- Verdict: **FAIL — do not release**

The first-read gate and all declared claim commands pass, but fresh end-to-end testing found a core privacy failure and a live deployment from which the extension cannot be installed. The paid checkout is also unavailable. No product code was changed during verification.

## Release-blocking findings

### Critical — typed rich-text content and ordinary page copy enter exports

The extension does not uphold “Typed values never enter the packet” or “The extension does not copy the page content.” In a fresh Chromium profile with the candidate extension loaded, I started a capture on the deployed demo, injected a normal `contenteditable` control, typed `RICH-SECRET-9137`, clicked a paragraph containing `PRIVATE PAGE BODY 48291`, stopped, and exported JSON.

Observed:

- A textarea value `TEXTAREA-SECRET-2468` was correctly absent.
- The stored capture contained successive rich-text prefixes, including `RICH`, `RICH-`, `RICH-S`, `RICH-SE`, and `RICH-SEC`.
- The stored capture contained `PRIVATE PAGE BODY 48291` as the label of a click on a `p` element.
- Both values were present in the exported JSON.

Cause: `entrypoints/content.ts` sends `accessibleLabel(target)` for every key/click event. `lib/capture.ts` falls back to `element.textContent`, including for `contenteditable` elements and non-controls. This violates the brief’s redaction constraint and the privacy/landing/README promises.

### Critical — the live extension download is missing

`GET https://accessible-page-capture.sociobot.in/downloads/accessible-page-capture-chrome.zip` returns HTTP 404 with `text/html`. Clicking “Download Chrome extension” raises a browser download event that ends as `canceled`; a visitor cannot install the product.

The candidate build does produce `dist/site/downloads/accessible-page-capture-chrome.zip` (11,026 bytes, SHA-256 `4cb956dd372bdb9e2300f4817fa44e900ade235885de2da91652e56d308ade07`). This is a live deployment omission, not a missing candidate build artifact.

### High — sensitive URL redaction is a denylist, not the stated guarantee

`safeUrl()` redacts only parameter names matching `token|key|auth|session|password|pass|secret|email`. A representative URL containing sensitive but differently named values:

`https://example.test/form?patient=Jane-Doe&diagnosis=low-vision&token=secret#private`

became:

`https://example.test/form?patient=Jane-Doe&diagnosis=low-vision&token=%5Bredacted%5D`

The patient and diagnosis remain. This contradicts “Sensitive URL parameters and fragments are removed from exports.”

### High — the paid checkout is unavailable

`GET https://api.sociobot.in/api/v1/products/accessible-page-capture/checkout` returns HTTP 404 with `{"error":"enabled factory product","status":404}`. Both the live site and extension advertise a $39 purchase through that endpoint. The mocked claim test checks only the link value and a mocked verify response; it does not prove that checkout works.

### High — extension state changes lose keyboard and screen-reader focus

After keyboard activation of “Start 30-second capture” and “Stop and preview,” `document.activeElement` is `BODY`. The new `h1` has `tabindex="-1"` but is never focused or announced. The same loss occurs after the unsupported-page error rerenders. Static axe scans find no rule violation, but the required screen-reader flow is not usable reliably for the product’s target audience.

### Medium — claim coverage permits the failed guarantees above

Every command in `.factory/claims.json` exits successfully, but several tests do not establish the full observable claim:

- `redacted-input` covers a textarea only, not `contenteditable`.
- `no-page-copy` asserts that one untouched demo sentence is absent; it never clicks non-controls.
- `url-redaction` covers one known key (`token`) only.
- `license-verify` mocks verification and checks the checkout URL string, not checkout availability.

Claim-like copy also lacks dedicated registry entries, including password-value redaction, preview-before-export, no automatic submission, and no continuous-session recording.

### Medium — several touch targets are below 44 CSS pixels

At 390 px, the demo banner’s “Reset demo” and “Start for real” targets are 32 px high; the wordmark is 35 px high; footer links and inline policy/contact links are about 15–17 px high. This misses the attached accessibility and design baseline.

### Medium — unknown routes are soft 404s

`/missing` renders the styled not-found view but responds HTTP 200. The required real 404 response override is absent.

### Medium — vulnerable development toolchain

`npm audit --json` reports 11 development dependency findings: 4 critical, 5 high, and 2 moderate, including direct findings in `vitest@3.2.4`, `vite@7.1.3`, and `wxt@0.20.6`. `npm audit --omit=dev` reports zero production dependency vulnerabilities, so this is a build/development risk rather than shipped runtime code.

## Mandatory first-read gate

Cold desktop load returned HTTP 200 with no console or page errors.

- What it does: “Record an access barrier others can replay.”
- For whom: “For low-vision workers and colleagues who need a product team to reproduce one blocked web task.”
- First click: “Try it with sample data,” beside “The demo opens a finished packet. Nothing is saved.”

Result: **PASS**. The one-click demo opens a populated 18.4-second sample packet.

## Declared claims gate

`.factory/claims.json` exists. Each listed command was run separately after `npm ci`, using the shipped demo/test entry point.

| Claim | Exact command | Result |
| --- | --- | --- |
| `explicit-start` | `npm run test:e2e -- --grep @claim:explicit-start` | PASS |
| `redacted-input` | `npm run test:e2e -- --grep @claim:redacted-input` | PASS, but incomplete as described above |
| `no-page-copy` | `npm run test:e2e -- --grep @claim:no-page-copy` | PASS, but incomplete as described above |
| `thirty-second-limit` | `npm run test:unit -- --testNamePattern @claim:thirty-second-limit` | PASS |
| `markdown-json` | `npm run test:e2e -- --grep @claim:markdown-json` | PASS |
| `free-export` | `npm run test:e2e -- --grep @claim:free-export` | PASS |
| `offline-capture` | `npm run test:e2e -- --grep @claim:offline-capture` | PASS |
| `demo-private` | `npm run test:e2e -- --grep @claim:demo-private` | PASS |
| `url-redaction` | `npm run test:unit -- --testNamePattern @claim:url-redaction` | PASS, but incomplete as described above |
| `team-routing` | `npm run test:unit -- --testNamePattern @claim:team-routing` | PASS |
| `local-storage` | `npm run test:e2e -- --grep @claim:local-storage` | PASS |
| `no-screenshots` | `npm run test:e2e -- --grep @claim:no-screenshots` | PASS |
| `no-runtime-third-party` | `npm run test:e2e -- --grep @claim:no-runtime-third-party` | PASS |
| `license-verify` | `npm run test:e2e -- --grep @claim:license-verify` | PASS, mocked only |

## Clean build and automated checks

- `npm ci` — PASS; 413 packages installed.
- `npm test` — PASS; 3 unit tests and 7 Playwright tests.
- `npm run check` — PASS; TypeScript emitted no errors.
- `npm run build` — PASS; produced `dist/site`, `.output/chrome-mv3`, and the packaged ZIP.
- Site bundle — PASS budget: JS 16,376 bytes raw / 5,944 gzip; CSS 11,358 raw / 3,322 gzip; mobile hero 43,696 bytes.
- Extension build — 24.86 KB unpacked; 11.03 KB ZIP.
- `npm audit --omit=dev` — PASS; zero production findings.
- Full `npm audit` — FAIL; 11 development findings as listed above.

## Independent end-to-end exercises

The candidate extension was loaded unpacked into fresh headless Chromium profiles.

- Normal textarea capture: explicit start/stop worked; the unique textarea value was absent; preview appeared; exported JSON parsed as `accessible-page-capture/v1`.
- Real 30-second boundary: session auto-stopped with `stopReason: "limit"` and an exact stored duration of 30,000 ms; preview showed automatically.
- Event boundary: 100 focus events produced the documented internal cap of 80 stored events without a crash.
- Empty/unsupported recovery: capture on `chrome://settings` produced “Open a normal web page, then start again.” and returned to the start screen.
- Demo note boundary: a 1,001-character fill was constrained to 1,000 characters.
- License validation: an empty token produced “Paste a license token first”; a live invalid token produced “That license is not active.”
- Demo keyboard flow: keyboard navigation reached the visible skip link first, opened the demo, reset its note, and exported JSON with Enter.

Library/CLI consumer packaging and sign-in checks are not applicable. There is no product backend or persistence service; the only server-side product dependency is Sociobot billing.

## Live deployment, privacy, and policies

The deployed HTML, JavaScript, CSS, service worker, images, manifest, robots, and sitemap are byte-for-byte matches for the candidate build. Representative hashes:

- `index.html`: `7371ca578c216a750ad389d43677a296bd38bbe179b086ce1f6743bc72cbb687`
- main JS: `b376ce58f986bfa4fc298c77d63f05f5a23c9704e27fce7d62b3ff3a0e75188c`
- service worker: `b25eed66a9e3723f96545531895a4d2545a723c469b483a25c0c091fca55c364`

The exception is the missing extension ZIP described above.

- Runtime request capture across landing/demo/export saw only `https://accessible-page-capture.sociobot.in`.
- Source/bundle inspection found no analytics, third-party scripts/fonts, raw Azure keys, or Sociobot keys.
- Free capture is local. License verification is the only runtime `fetch`, to `api.sociobot.in` after explicit entry/return.
- Live headers include HSTS, CSP, `X-Content-Type-Options`, `Referrer-Policy`, and `Permissions-Policy`.
- HTML caches for 30 seconds with revalidation; hashed assets use one-year immutable caching; `sw.js` is `no-cache`.
- Billing rate limit: a 120-request concurrent burst to the verify endpoint returned 30 HTTP 200 responses and 90 HTTP 429 responses. Every 429 sampled had `Retry-After: 4`. Observed accepted burst threshold: 30 requests.

## Accessibility, responsive behavior, and PWA checks

- Live axe scans at 1440 px and 390 px on `/`, `/demo`, `/privacy`, `/terms`, and `/missing`: zero serious/critical findings and zero findings of any impact.
- Candidate extension axe scans in landing, recording, preview, and error states: zero findings; the manual focus failure remains.
- Desktop and 390 px layouts have no horizontal overflow. A 200% root text-size probe also had no horizontal overflow.
- Visible focus is a 4 px cobalt outline; the skip link is first in keyboard order.
- Reduced motion produces no hero animation, no button transition, no transform, and automatic scrolling.
- Live console/page errors: none across tested routes and flows.
- Service worker registration/update succeeded; an offline `/demo` reload retained the correct route and exported Markdown.
- `/opt/fleet/lib/verify-url.sh` passed: title, `lang`, one `h1`, `main`, image alt, and no console/page errors.

Mobile Lighthouse 13.4.1 against the live URL:

- Performance 100
- Accessibility 100
- Best Practices 100
- SEO 100
- LCP 1.1 s
- FCP 0.9 s
- Total Blocking Time 80 ms
- CLS 0

## Evidence

- `.factory/evidence/verify.json`
- `.factory/evidence/screenshot-desktop.png`
- `.factory/evidence/screenshot-mobile.png`
- `.factory/evidence/live-first-read-desktop.png`
- `.factory/evidence/live-demo-mobile.png`
- `.factory/evidence/extension-recovery.png`
- `.factory/evidence/lighthouse-live.json`

## Required before re-verification

1. Prevent `contenteditable` values and non-control page text from becoming event labels; add adversarial claim tests and verify both export formats.
2. Redact all potentially sensitive URL query data by default, with a test beyond known key names.
3. Deploy the candidate ZIP and verify a clean browser can download and load that exact live artifact.
4. Register/enable the Sociobot product or remove the paid offer until checkout works.
5. Move and announce focus after every popup state change and error.
6. Raise all touch targets to at least 44 CSS pixels and return a true HTTP 404 for unknown routes.
7. Update the claim registry/tests and vulnerable development dependencies.
