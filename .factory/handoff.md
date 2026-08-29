# Accessible Page Capture — polish round 3 handoff

Work order: `accessible-page-capture-polish-3`

Live product: <https://accessible-page-capture.sociobot.in>

Version: 1.0.1

Deployment: `5e878741-7685-4b4a-8807-478b59b4417d`

## Done

- Closed F-3-1 by restoring visible separation in the mobile wordmark.
- Closed F-3-2 by removing the unregistered public art-provenance claim while retaining provenance in `.factory/design.md`.
- Rechecked and preserved F-1-1 through F-1-6, then finished the earlier terminology cleanup across the demo, extension popup, 404, and exported Markdown.
- Kept the first screen job-first, with its action outcome before the artwork at 390 × 844.
- Kept `/?demo=1` one click from the landing page, isolated under the `demo:accessible-page-capture:` namespace, with a persistent banner, Reset demo, and Download Chrome extension.
- Strengthened real extension claim coverage for automatic 30-second stopping, free export, Markdown/JSON output, and no accessibility score or certification result.
- Added claim-manifest integrity coverage, route-specific social metadata, route focus/history checks, reset focus/announcement, and network-first service-worker navigation.
- Bumped and verified the Chrome MV3 extension as 1.0.1. The packaged download remains under `dist/site/downloads/`.
- Updated the catalog line, copy audit, demo documentation, and cumulative mapping in `.factory/polish-3.md`.

## Exact verification

Fresh clone `/tmp/apc-polish3-final-8PbCZf` at `a1fed553cbdcb27d64d613eda0583a2064a642ac`:

```sh
npm ci
# Every test command in .factory/claims.json, run separately: 22/22 PASS
npm test       # 4 unit/contract + 16 browser/extension + package smoke PASS
npm run check  # PASS
npm run build  # PASS; creates dist/site and the Chrome ZIP
```

The deployed work-order build command also passed: `npm ci && npm test && npm run build:site`.

Live checks:

```sh
APC_BASE_URL=https://accessible-page-capture.sociobot.in npx playwright test tests/e2e/site.spec.ts
# 9/9 PASS: routes, metadata, focus/back, 404, axe, mobile, touch targets,
# demo isolation/reset/export, privacy request log, download, and offline reload/export

/opt/fleet/lib/verify-url.sh https://accessible-page-capture.sociobot.in .factory/evidence/polish-3-live
/opt/fleet/lib/verify-url.sh 'https://accessible-page-capture.sociobot.in/?demo=1' .factory/evidence/polish-3-live-demo
# Both PASS with zero console errors

APC_PACKAGE_PATH=/tmp/apc-polish3-live.zip npm run test:package
# SHA-256 match, MV3 1.0.1 manifest, and clean Chromium load PASS
```

Live package SHA-256: `cfd51653c64133ce69ab38385bbacc7dbfb1606d8fdfcd2186038a7c005c67ef`.

Performance evidence:

- Initial site JS: 13.92 KB raw / 4.96 KB gzip.
- Initial CSS: 11.43 KB raw / 3.31 KB gzip.
- Mobile hero: 43 KB.
- Live Lighthouse: Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 0.8 s, LCP 0.8 s, TBT 0 ms, CLS 0.
- Local Lighthouse: 100/100/100/100; LCP 1.4 s, TBT 0 ms, CLS 0.

The Lighthouse CLI wrote complete JSON reports, then reported a Chromium teardown crash. Playwright and URL verification had no page crash or console error.

## Known gaps and next steps

None. All findings in reviews 1–3 are closed, all registered claims pass from a clean clone, and the deployed artifact was cold-checked after release.
