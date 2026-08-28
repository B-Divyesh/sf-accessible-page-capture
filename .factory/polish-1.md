# Polish round 1 — Accessible Page Capture

Base reviewed: `98fd9b19ec19b6a218d9cb239c36bb9535cca520`
Repair commit: `6a9c3aa4fcd053140c2becba54b63539dab559ad`
Deployed URL: <https://accessible-page-capture.sociobot.in>

The review directory contains only `review-1.md`; there are no earlier `review-*.md` or `polish-*.md` files to carry forward. Every finding in that report is closed below.

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Added a real unpacked-extension offline claim: after loading a normal page online, the test goes offline, starts capture, clicks a control, stops, and exports JSON containing that recorded click. The demo’s offline reload/export now has its own claim. | `@claim:offline-capture`; `@claim:demo-offline-export`; clean-clone Playwright status `passed`. |
| F-1-2 | Moved the $0 proof to a real extension export. The test completes a capture, exports JSON, and verifies no payment endpoint or payment step occurs. | `@claim:free-export`; clean-clone Playwright status `passed`. |
| F-1-3 | Rewrote the replay/audit wording into observable packet language. The landing now says recorded steps become an issue packet a team can inspect. It says the packet has recorded steps, not an accessibility score. Added a separately registered no-score test. | `@claim:page-context`, `@claim:ordered-labelled-events`, `@claim:user-note`, `@claim:no-accessibility-score`; live `APC_BASE_URL=… playwright test tests/e2e/site.spec.ts` passed. |
| F-1-4 | Kept the complete action block before the art on small screens and added a 390×844 viewport assertion that the action and outcome fit in the first viewport. | `landing routes and mobile layout are accessible`; [live mobile screenshot](evidence/polish-1-live/landing-mobile.png). |
| F-1-5 | Replaced the ambiguous demo-banner action with “Download Chrome extension”. | `@claim:demo-private` checks the named downloadable link; [live demo mobile screenshot](evidence/polish-1-live/demo-mobile.png). |
| F-1-6 | Standardized visitor language on **issue packet** for the exported file and **recorded steps** for the sequence. Rewrote the README opening without MV3 or trace jargon; moved implementation wording to the installation detail. | `.factory/copy-audit.md`; [live desktop screenshot](evidence/polish-1-live/desktop.png). |

Additional work required by this round:

- `?demo=1` is now a direct isolated demo entry point. It renders the persistent “Demo — sample data, nothing is saved” banner, Reset demo, and Download Chrome extension. `/demo` remains a direct bookmarked route.
- Route titles, canonical metadata, focus announcements, legal links, designed 404 behavior, static response configuration, and the tactile field-report visual system were retained and rechecked live.
- `.factory/claims.json` has 22 IDs. Source inspection confirms every ID appears in exactly one tagged test.
