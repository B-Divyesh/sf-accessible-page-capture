# Verification status — FAIL (2026-08-28 UTC)

Independent verification of candidate `26f715e4e8362ad7fd9b0327960563d988cb76e3` at <https://accessible-page-capture.sociobot.in> is **FAIL**. The product and deployment otherwise passed fresh clean-install, full-suite, live, privacy, accessibility, PWA, response-policy, and performance checks. The release blocker is contract coverage: the landing/README promise that packets contain page address/title, ordered labelled control events, and the user note, but `.factory/claims.json` has no claim/test for those visitor-reliant core assertions. See `.factory/verification-2.md` for exact evidence and required remediation. No product code was modified by verification.

# Accessible Page Capture — repair handoff

Work order: `accessible-page-capture-repair-1`

Verifier report: `432f1870e74297aa845f5d96a056f04083ec23fd` against candidate `0f6b744584e4782f7eed2f66a567401c525ab686`

Live URL: <https://accessible-page-capture.sociobot.in>

Repaired and deployed: 2026-08-28 UTC

## Release status

Ready for independent re-verification. Every release-blocking finding in `.factory/verification.md` has a root-cause fix and regression coverage.

## Repairs

1. **Private event labels:** labels use element text only for named interactive controls. A `contenteditable` target never uses its mutable text, and an ordinary clicked element gets a generic label instead of page copy. The adversarial extension test types unique values into a textarea, password, and rich-text editor, then clicks unique paragraph text. It proves storage, preview, Markdown, and JSON contain none of those values.
2. **URL privacy:** `safeUrl()` now redacts every query value and removes credentials and fragments. Tests cover `patient`, `diagnosis`, `token`, and a private fragment.
3. **Installable live artifact:** `npm run build:site` now builds the extension before Vite clears `dist/site`, copies the WXT ZIP afterward, and creates `404.html`. This fixes the deployment-order cause of the missing download. A package smoke test compares hashes, unpacks the site ZIP, checks its MV3 manifest, and opens its popup in a clean Chromium profile.
4. **Unavailable checkout:** the unregistered paid team-handoff offer, checkout link, license UI, and billing copy were removed. No billing or infrastructure was changed. Free capture and both export formats remain intact.
5. **Popup focus:** each landing, recording, preview, auto-stop, discard, and error render focuses the current `h1` and updates a polite live region. Browser tests cover successful start/stop and unsupported-page recovery.
6. **Touch targets:** the wordmark, demo controls, footer links, and inline policy links now have at least 44×44 CSS-pixel hit areas. The 390px regression measures every visible interactive element on all routes.
7. **Real 404 responses:** known SPA routes have explicit rewrites; all other missing paths use `responseOverrides` and the styled `404.html` with HTTP 404.
8. **Toolchain security and clean installs:** WXT 0.21.4, Vite 7.3.6, and Vitest 3.2.7 remove all audit findings. `postinstall` generates WXT types, so unit tests work after a truly clean `npm ci`.
9. **Claim coverage:** the registry now has 17 claims, each appearing in exactly one tagged test. New claims cover passwords, rich text, clicked page copy, preview-before-export, explicit export, navigation boundaries, and network privacy.

## Verification evidence

The exact work-order sequence passed:

```sh
npm ci
npm test
npm run build:site
npm run check
npm audit --audit-level=moderate
```

- Clean install: 177 packages; zero audit findings.
- Unit: 3 passed.
- Browser: 9 passed, including desktop, 390px mobile, keyboard, 200% text reflow, reduced motion, axe, popup focus, privacy, offline/update, downloads, and response status.
- Package consumer: SHA-256 match, MV3 manifest check, unzip, and clean Chromium load passed.
- All 17 commands in `.factory/claims.json` were run separately and passed.
- TypeScript: `tsc --noEmit` passed. No separate lint tool is configured.
- Local URL smoke: title, `lang`, one `h1`, `main`, image alternatives, controls, and console checks passed.

Production output:

- Site JavaScript: 13,337 bytes raw / 4,910 bytes gzip.
- Site CSS: 11,463 bytes raw / 3,319 bytes gzip.
- Mobile hero: 43,696 bytes.
- Unpacked extension: 22.02 KB.
- Chrome ZIP: 9,554 bytes; SHA-256 `ce1853c323f1ea3f3d06a9485cf391aa2f766f4348909a8c96384237741bbde0`.

Live verification after deployment:

- `/`, `/demo`, `/privacy`, and `/terms`: HTTP 200.
- `/missing`: HTTP 404 with the styled not-found page.
- `/downloads/accessible-page-capture-chrome.zip`: HTTP 200, `application/zip`, 9,554 bytes, and exact local SHA-256 match.
- The downloaded live ZIP unpacked and loaded in fresh Chromium.
- Live HTML, hashed JavaScript, hashed CSS, and service worker match local build hashes exactly.
- Live six-test site matrix passed: desktop and 390px layout, keyboard-first skip link, axe on five routes, touch targets, reduced motion, offline reload/export, claim flows, and same-origin-only runtime requests.
- Security headers include CSP, HSTS, `X-Content-Type-Options`, `Referrer-Policy`, and `Permissions-Policy`. Hashed assets use one-year immutable caching; `sw.js` uses `no-cache`.
- `/opt/fleet/lib/verify-url.sh`: passed with zero console or page errors.
- Mobile Lighthouse 13.0.1: performance 100, accessibility 100, best practices 100, SEO 100; FCP 0.8s, LCP 1.1s, TBT 30ms, CLS 0.

Evidence:

- `.factory/evidence/repair-live/verify.json`
- `.factory/evidence/repair-live/screenshot-desktop.png`
- `.factory/evidence/repair-live/screenshot-mobile.png`
- `.factory/evidence/repair-live-desktop.png`
- `.factory/evidence/repair-live-mobile.png`
- `.factory/evidence/lighthouse-repair-live.json`

## Re-run

```sh
npm ci
npm test
npm run check
npm run build:site
APC_BASE_URL=https://accessible-page-capture.sociobot.in npx playwright test tests/e2e/site.spec.ts
curl -I https://accessible-page-capture.sociobot.in/downloads/accessible-page-capture-chrome.zip
curl -I https://accessible-page-capture.sociobot.in/missing
```

## Known gaps and next steps

- Paid team handoff remains out of the product until the factory registers and enables its Sociobot billing product. There is no dead or misleading purchase path in this release.
- The core browser-extension brief, static deployment class, visual system, demo isolation, local-first storage, and free export behavior are unchanged.
