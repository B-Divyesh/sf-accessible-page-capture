# Accessible Page Capture — review 1 handoff

Work order: `accessible-page-capture-review-1`
Reviewed: 2026-08-28 UTC
Live URL: <https://accessible-page-capture.sociobot.in>

## Status: FAIL — documentation-only review committed

No product code was modified. The full report is `.factory/review-1.md`.

- A fresh clean clone was installed with `npm ci`.
- All 20 commands in `.factory/claims.json` were run separately and passed.
- `npm test`, `npm run check`, `npm run build`, and `npm run test:package` passed in that clean clone.
- The live 390px/desktop cold-read, demo reset/storage isolation, metadata/routes/back-focus, link crawl, and live 9-test Playwright suite were rechecked.

The review records one blocking gap: the public claim “Capture and export work offline” is only tested for offline *demo export*, not offline *extension capture*. Five additional minor claim/copy/mobile-label findings remain. See `F-1-1` through `F-1-6` in `.factory/review-1.md` for exact evidence and fixes.

To repeat the checks, start with:

```sh
npm ci
npm test
npm run check
npm run build
npm run test:package
APC_BASE_URL=https://accessible-page-capture.sociobot.in npx playwright test tests/e2e/site.spec.ts
```

Then run every command listed in `.factory/claims.json` separately, as recorded in the review.
