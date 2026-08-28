# Accessible Page Capture — review 2 handoff

Work order: `accessible-page-capture-review-2`
Review commit: pending

## Done

- Performed the requested adversarial first-read review without changing product code.
- Wrote `.factory/review-2.md` with a **PASS** verdict: zero blocking or minor findings.
- Rechecked every F-1 finding on the live product and source; all remain fixed.
- Verified the clean clone at `/tmp/apc-review2-NGTXJY`: all 22 claim tags, `npm test`, `npm run check`, and `npm run build` passed. The live Playwright suite recorded a passed final status.

## Handoff

No product work is left by this review. Re-run the commands recorded in `.factory/review-2.md` after a future product change, especially if it changes public copy, demo storage, exports, routing, or the extension capture path.

---

# Accessible Page Capture — polish 1 handoff

Work order: `accessible-page-capture-polish-1`
Repair commit: `6a9c3aa4fcd053140c2becba54b63539dab559ad`
Deployment: <https://accessible-page-capture.sociobot.in>
Deployment ID: `245a5784-23e1-4f90-836a-58028e7e6046`

## Done

- Closed every F-1-1 through F-1-6 finding in `.factory/review-1.md`; the complete mapping is in `.factory/polish-1.md`.
- Added direct isolated `?demo=1` routing with its persistent sample-data banner, Reset demo, and explicit “Download Chrome extension” action. The demo uses only `demo:accessible-page-capture:` localStorage.
- Rewrote the first screen and README in plain language, standardized **issue packet** and **recorded steps**, and kept the action result visible at 390×844 before the art.
- Added real extension claim tests for offline capture/export, no-payment export, and no accessibility score. Registered the demo offline reload/export claim. `.factory/claims.json` now has 22 entries, each with one source tag.
- Preserved the warm-paper, offset-ink field-report visual identity, privacy model, legal routes, metadata, keyboard focus behavior, real HTTP 404, and extension/static deployment classes.

## Verification

Fresh clone: `/tmp/apc-clean-eoadEW` was cloned from `6a9c3aa`, installed with `npm ci`, and ran all 22 declared commands in `.factory/claims.json` separately. Its final Playwright status is `passed` with no failed tests. The same clone then passed:

```sh
npm test
npm run check
npm run build
npm run test:package
```

Local targeted evidence passed:

```sh
npm run test:e2e -- --grep '@claim:(offline-capture|free-export|no-accessibility-score|demo-offline-export|demo-private)'
npm run test:e2e -- --grep 'landing routes and mobile layout are accessible'
```

Production verification passed after deployment:

```sh
VERIFY_NODE_MODULES=/work/repo/node_modules /opt/fleet/lib/verify-url.sh 'https://accessible-page-capture.sociobot.in/?demo=1' .factory/evidence/polish-1-live
APC_BASE_URL=https://accessible-page-capture.sociobot.in npx playwright test tests/e2e/site.spec.ts
APC_PACKAGE_PATH=/tmp/apc-polish-live.zip npm run test:package
```

The live site suite passed all 8 tests, including axe serious/critical checks, routing, 404, titles, touch targets, reduced motion, demo isolation, and demo offline export. `verify-url.sh` reported no console errors, `lang=en`, one `<h1>`, one `<main>`, and zero missing image alt text. The live downloadable ZIP passed the MV3 manifest, SHA-256 match, and clean Chromium-load package check.

Live Lighthouse: Performance 100, Accessibility 100, Best Practices 100, SEO 100; LCP 1.1 s, TBT 20 ms, CLS 0.

Evidence:

- `.factory/evidence/polish-1-live/verify.json`
- `.factory/evidence/polish-1-live/lighthouse.json`
- `.factory/evidence/polish-1-live/desktop.png`
- `.factory/evidence/polish-1-live/landing-mobile.png`
- `.factory/evidence/polish-1-live/demo-mobile.png`
- `.factory/evidence/polish-1-local-desktop.png`
- `.factory/evidence/polish-1-local-mobile.png`

## Known gaps

None. The first review’s blocking and minor findings are resolved and verified locally and on the deployed site.
