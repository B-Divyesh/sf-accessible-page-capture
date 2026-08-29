# Polish round 3 — Accessible Page Capture

Reviewed candidate: `dccc722d23bb157a75ee679e00e75b9a2ee225b2`

Review commit: `f933002df32742fb6b735a6abc61115aa16daa34`

Repair commits: `2e2d99d2f31c3fcf602ca0117bcb2b3440470b88`, `a1fed553cbdcb27d64d613eda0583a2064a642ac`

Deployment: `5e878741-7685-4b4a-8807-478b59b4417d`

Live URL: <https://accessible-page-capture.sociobot.in>

Every finding in reviews 1–3 was rechecked. Review 2 contains no finding IDs. No finding remains open.

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 — extension offline capture | Retained the real unpacked-extension offline flow and independently registered the site demo’s offline reload/export. The live ZIP is byte-identical to the build used by the clean-clone extension test. | `@claim:offline-capture` PASS; `@claim:demo-offline-export` PASS; live SHA-256 `cfd51653c64133ce69ab38385bbacc7dbfb1606d8fdfcd2186038a7c005c67ef`; live site suite 9/9 PASS. |
| F-1-2 — $0 real export | Retained the real extension JSON export and strengthened it to assert that neither payment UI nor a payment request appears. | `@claim:free-export` PASS from the clean clone; live ZIP package/load PASS. |
| F-1-3 — replay and limitation claims | Kept only observable packet wording, standardized the exported Markdown heading, and checked both Markdown and JSON for the absence of scores, audits, certification, or compliance results. | `@claim:page-context`, `@claim:ordered-labelled-events`, `@claim:user-note`, and `@claim:no-accessibility-score` PASS. Live copy is visible in `.factory/evidence/polish-3-live/screenshot-desktop.png`. |
| F-1-4 — mobile action outcome | Preserved the action and full outcome before the artwork; the regression test compares the action block’s bottom edge with the artwork’s top edge at 390 × 844. | `landing routes and mobile layout are accessible` PASS locally and live; `.factory/evidence/polish-3-live/screenshot-mobile.png`. |
| F-1-5 — ambiguous demo exit | The persistent demo banner names the action “Download Chrome extension.” Reset now restores the sample, announces completion, and returns focus to Reset demo. | `@claim:demo-private` PASS locally and live; `.factory/evidence/polish-3-live-demo/screenshot-mobile.png`; cold live check at `/?demo=1`. |
| F-1-6 — inconsistent terminology | Replaced remaining visitor-facing “trace,” “event,” and “report” wording in the demo, popup, 404, and Markdown export. Public language now uses **issue packet** and **recorded steps**. | `.factory/copy-audit.md`; `@claim:markdown-json` PASS through the real extension; live root and demo screenshots. |
| F-3-1 — joined mobile wordmark | Removed the small-screen rule that hid the wordmark line break. The 390 px regression asserts visible whitespace and a rendered `<br>`. | `landing routes and mobile layout are accessible` PASS locally and live; `.factory/evidence/polish-3-live/screenshot-mobile.png` visibly reads “Accessible / Page / Capture.” |
| F-3-2 — unregistered art provenance claim | Removed “Hero art generated for this product” from every public footer. Provenance remains in `.factory/design.md`, where it belongs. | The landing regression asserts the sentence is absent; live suite PASS; `.factory/evidence/polish-3-live/screenshot-desktop.png`. |

## Additional acceptance work

- Added route-specific Open Graph and Twitter title/description metadata and `og:url` alongside the existing title, description, and canonical updates.
- Added browser coverage for direct routes, History API Back behavior, h1 focus, polite announcements, legal links, asset routes, and console/page errors.
- Kept `/?demo=1` as the one-click entry and `/demo` as its canonical route. The sample uses only `demo:accessible-page-capture:note`; export, reset, and request isolation are tested together.
- Strengthened `thirty-second-limit` from a constant-only unit assertion to a real 30-second unpacked-extension capture that automatically stops and exports exactly 30 seconds.
- Added a claim-registry contract test that requires unique IDs, runnable commands, non-empty sandboxes, no orphan tags, and exactly one source tag per claim.
- Bumped the extension to 1.0.1 and made package verification compare the WXT manifest version and SHA-256-identical site ZIP.
- Updated the service worker to `apc-site-v3` with network-first navigation and an offline shell fallback, preventing returning users from being pinned to an old HTML shell.
- Updated `.factory/catalog-description.txt` to the 52-character verb-first sentence: “Record a blocked web task as a private issue packet.”

## Verification evidence

- Clean clone: `/tmp/apc-polish3-final-8PbCZf`, commit `a1fed553cbdcb27d64d613eda0583a2064a642ac`.
- Every one of the 22 `.factory/claims.json` commands ran separately and passed.
- Full clean-clone gates: 4 unit/claim-contract tests, 16 Playwright site/extension tests, packaged-extension smoke, TypeScript check, and production build all passed.
- Local URL check: `.factory/evidence/polish-3-local-verify/verify.json`; no console errors, one h1/main, `lang=en`, complete alt and button names.
- Local Lighthouse: `.factory/evidence/polish-3-local-lighthouse.json`; Performance 100, Accessibility 100, Best Practices 100, SEO 100, LCP 1.4 s, TBT 0 ms, CLS 0.
- Live root check: `.factory/evidence/polish-3-live/verify.json`; live demo check: `.factory/evidence/polish-3-live-demo/verify.json`; both have zero console errors.
- Live routes: `.factory/evidence/polish-3-live/routes.txt`; `/missing` is 404, normal routes/assets are 200, and the ZIP is `application/zip`.
- Live Lighthouse: `.factory/evidence/polish-3-live/lighthouse.json`; Performance 100, Accessibility 100, Best Practices 100, SEO 100, LCP 0.8 s, TBT 0 ms, CLS 0.

The Lighthouse CLI reported its known Chromium tab crash after writing each complete JSON result. The reports contain all requested categories and metrics; independent Playwright and URL verification completed without a page crash.
