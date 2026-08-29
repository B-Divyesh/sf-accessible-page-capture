# Accessible Page Capture — independent verification handoff

Work order: `accessible-page-capture-verify-4`

Candidate: `f860ea77b8d72efb9a0664d6fb00a715fa024de4`
Live URL: <https://accessible-page-capture.sociobot.in>

## PASS

The candidate is accepted. The cold live first screen plainly identifies the job, audience, and one-click **Try it with sample data** action. The demo is isolated, resettable, and exports its finished sample offline after the first visit.

From a clean checkout, `npm ci`, every one of the 22 exact commands in `.factory/claims.json`, `npm test`, `npm run check`, `npm run build`, `npm run test:package`, and both dependency audits passed. The production build made `dist/site/`, the MV3 extension, and its ZIP. Fresh local HTML, JS, CSS, service worker, and extension ZIP all hash-match the live deployment exactly.

The live site passed route/metadata/404 checks, keyboard and 390 px mobile checks, response-header/cache-policy inspection, outgoing-request privacy inspection, offline PWA reload/export, and axe with zero serious/critical findings. Lighthouse mobile was 92 performance / 100 accessibility / 100 best-practices / 100 SEO (LCP 1.06 s, CLS 0).

No critical, high, medium, or low defects were found. There are no server-side endpoints, sign-in, or paid unlocks in this static/local-first release; rate-limit and Entra checks are therefore not applicable.

Full evidence and re-run instructions: `.factory/verification-4.md`.
