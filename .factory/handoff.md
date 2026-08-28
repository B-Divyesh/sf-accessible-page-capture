# Accessible Page Capture — repair handoff

Work order: `accessible-page-capture-repair-2`

Verifier report: `3f9b2da14c9c703f43dd6303e671aa5001af1f8b` against candidate `26f715e4e8362ad7fd9b0327960563d988cb76e3`

Repair implementation commit: `c160f51`

Live URL: <https://accessible-page-capture.sociobot.in>

Repaired and deployed: 2026-08-28 UTC

## Release status

Ready for independent re-verification. The sole release blocker in `.factory/verification-2.md` has a root-cause repair and exact regression coverage. All behavior that passed that verification remains intact.

## Finding reproduced and repaired

The landing page and README promised that packets contain the captured page address and title, ordered focus/click/control-key events with accessible labels and roles, and the user note. The candidate implemented those fields but `.factory/claims.json` contained only 17 claims and no tests registered for those promises.

The registry now contains 20 unique claims. Three new claim tests use `/demo`, download the real output, and assert observable packet contents:

1. `page-context` checks the exact page URL and title in Markdown and parsed JSON.
2. `ordered-labelled-events` checks the exact chronological event sequence, focus/click/key coverage, key details, and a non-empty label and role on every event.
3. `user-note` edits the note and checks that exact text in Markdown and parsed JSON.

The six-event bundled sample now includes a real click event, so the one-click demo demonstrates every event category promised by the README. `.factory/demo.md` documents that fixture. The extension implementation and its privacy boundaries were not changed.

## Local verification evidence

The following passed from the repaired tree:

```sh
npm ci
npm test
npm run check
npm audit --audit-level=moderate
npm run build:site
```

- Clean install: 177 packages; zero audit vulnerabilities.
- Unit: 3 passed.
- Browser/integration: 12 passed, including desktop, 390 px mobile, keyboard-first navigation, 200% text reflow, reduced motion, axe, popup focus, privacy adversaries, offline/update, downloads, and true 404 behavior.
- Package consumer: local ZIP hash match, MV3 manifest validation, unzip, and clean Chromium load passed.
- Claims: all 20 commands declared in `.factory/claims.json` were run independently and passed. Registry validation found 20 unique IDs, with every `@claim:` tag occurring exactly once.
- TypeScript: `tsc --noEmit` passed. No separate lint command is configured.
- Accessibility: Playwright axe reported no serious or critical issue on all five site routes or extension states. Keyboard focus, 44 px touch targets, and responsive overflow checks passed.
- Privacy: adversarial extension capture and both exports omit textarea, password, rich-text, and ordinary page-copy secrets. Site and extension network assertions passed.
- Local URL smoke: title, `lang`, one `h1`, `main`, image alternatives, labelled controls, and console checks passed with no errors.

Production output:

- Site JavaScript: 13,337 bytes raw / 4,915 bytes gzip.
- Site CSS: 11,463 bytes raw / 3,319 bytes gzip.
- Mobile hero: 43,696 bytes.
- Unpacked extension: 22.02 KB.
- Chrome ZIP: 9,554 bytes; SHA-256 `ce1853c323f1ea3f3d06a9485cf391aa2f766f4348909a8c96384237741bbde0`.
- Local Lighthouse 13.0.1: performance 100, accessibility 100, best practices 100, SEO 100; LCP 1.7 s, TBT 40 ms, CLS 0.

Local evidence:

- `.factory/evidence/repair-2-local/verify.json`
- `.factory/evidence/repair-2-local/screenshot-desktop.png`
- `.factory/evidence/repair-2-local/screenshot-mobile.png`
- `.factory/evidence/repair-2-local/lighthouse.json`

## Deployment and live verification

`/opt/fleet/lib/deploy-static.sh accessible-page-capture /work/repo/dist/site` deployed the static artifact successfully to the existing Azure Static Web App in `centralus`. Azure deployment ID: `6c4cbf82-fed7-4b30-9e6f-7a948f65c118`.

- `/`, `/demo`, `/privacy`, and `/terms`: HTTP 200.
- `/missing`: HTTP 404 with the styled not-found page.
- Extension download: HTTP 200, `application/zip`, 9,554 bytes.
- Live HTML, hashed JavaScript, hashed CSS, service worker, and ZIP match the local production build byte-for-byte.
- The live-downloaded ZIP passed SHA-256 comparison, MV3 inspection, unzip, and clean Chromium loading.
- All 9 live site tests passed, including the three new output claims, desktop/mobile, keyboard, axe, touch targets, reduced motion, offline reload/export, demo isolation, network privacy, downloads, and response status.
- `/opt/fleet/lib/verify-url.sh` passed with no console or page errors.
- Response headers include HSTS, a self-only CSP, `X-Content-Type-Options`, strict-origin referrer policy, and Permissions Policy. HTML revalidates after 30 seconds, hashed assets are immutable for one year, and `sw.js` is not cached.
- Live Lighthouse 13.0.1: performance 100, accessibility 100, best practices 100, SEO 100; FCP 0.8 s, LCP 1.1 s, TBT 0 ms, CLS 0.

Live evidence:

- `.factory/evidence/repair-2-live/verify.json`
- `.factory/evidence/repair-2-live/screenshot-desktop.png`
- `.factory/evidence/repair-2-live/screenshot-mobile.png`
- `.factory/evidence/repair-2-live/lighthouse.json`

## Re-run

```sh
npm ci
npm test
npm run check
npm audit --audit-level=moderate
npm run build:site
APC_BASE_URL=https://accessible-page-capture.sociobot.in npx playwright test tests/e2e/site.spec.ts
APC_PACKAGE_PATH=/path/to/live-download.zip npm run test:package
```

## Known gaps and next steps

- Paid team handoff remains intentionally absent until the factory registers and enables its Sociobot billing product. There is no dead purchase path.
- No backend, sign-in, or runtime AI feature exists, so backend rate-limit, identity-provider, and live-model checks are not applicable.
- The original browser-extension artifact class, static deployment class, researched brief, visual system, demo isolation, local-first storage, and free export behavior are unchanged.
