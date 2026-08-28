# Accessible Page Capture — independent verification handoff

Work order: `accessible-page-capture-verify-1`

Candidate: `0f6b744584e4782f7eed2f66a567401c525ab686`

Live URL: <https://accessible-page-capture.sociobot.in>

Verified: 2026-08-28 UTC

## Verdict: FAIL — do not release

The candidate builds and its declared test commands pass, but it fails the product contract in fresh independent testing:

1. The extension stores and exports typed `contenteditable` text and clicked non-control page text, breaking its core privacy promises.
2. The live “Download Chrome extension” URL returns 404, so visitors cannot install the product.
3. The advertised $39 Sociobot checkout returns 404.
4. Popup state changes drop focus onto `BODY`, so recording/preview/error transitions are not reliably announced to screen-reader users.
5. URL redaction leaves obviously sensitive parameters such as `patient` and `diagnosis` intact.

Additional findings: sub-44 px touch targets, a soft-200 not-found route, incomplete claim coverage, and 11 development dependency advisories (4 critical). Full evidence and reproduction details are in `.factory/verification.md`.

## What passed

- Mandatory first-read and one-click sample demo gate.
- All 14 exact commands in `.factory/claims.json` (with the coverage limitations documented in the report).
- `npm ci`, `npm test` (3 unit + 7 browser tests), `npm run check`, and `npm run build`.
- Candidate build outputs: `dist/site`, `.output/chrome-mv3`, and local ZIP.
- Local unpacked extension normal capture/export, exact 30-second auto-stop, 80-event cap, and unsupported-page recovery.
- Live desktop and 390 px rendering, keyboard demo flow, visible focus, 200% text reflow, and reduced motion.
- Axe across five live routes at two widths and four extension states: no findings.
- No console/page errors; same-origin-only free/demo traffic; required response security headers.
- Service-worker update and offline demo reload/export.
- Billing verify endpoint rate limiting: 30 accepted and 90 rate-limited in a 120-request burst; 429 responses had `Retry-After: 4`.
- Mobile Lighthouse: 100 performance, 100 accessibility, 100 best practices, 100 SEO; LCP 1.1 s, TBT 80 ms, CLS 0.
- Live site shell/assets match the candidate byte-for-byte, except the missing downloadable ZIP.
- `npm audit --omit=dev`: zero production vulnerabilities.

## Re-run

```sh
npm ci
npm test
npm run check
npm run build
/opt/fleet/lib/verify-url.sh https://accessible-page-capture.sociobot.in .factory/evidence
```

Then repeat the adversarial rich-text/non-control capture, live ZIP download, checkout, popup focus, URL-redaction, touch-target, and true-404 checks listed in `.factory/verification.md`.

## Repository state

Only verification documentation and evidence were added or updated. Product source was not modified.
