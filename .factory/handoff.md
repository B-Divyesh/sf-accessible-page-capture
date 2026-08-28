# Accessible Page Capture — build handoff

Work order: `accessible-page-capture-build-1`

Completed: 2026-08-28

Version: 1.0.0

## What shipped

- A WXT + TypeScript Chrome MV3 extension.
- Explicit start and stop with a hard 30-second limit.
- Focus, click, control-key, and redacted-input trace events.
- Accessible-name and role extraction without form values.
- Sensitive query-parameter and URL-fragment redaction.
- A preview with an optional user note before export.
- Local Markdown and JSON downloads.
- Empty, error, auto-stop, discard, and unsupported-page states.
- Keyboard access, visible focus, semantic controls, and reduced motion.
- Optional $39 team handoff license verification through Sociobot.
- Local paid team and triage fields added to exports after verification.
- A routed static site with `/`, `/demo`, `/privacy`, `/terms`, and a styled not-found view.
- A one-click demo with realistic sample data, reset, two exports, offline reload, and a separate `demo:` storage namespace.
- Original generated risograph hero art with prompt, review, and provenance.
- A service worker, metadata, social image, sitemap, robots file, CSP, and static-host configuration.

## Build and output

Exact build command:

```sh
npm install
npm run build
```

Static deploy root: `dist/site` with `dist/site/index.html` at its root. The site download is `dist/site/downloads/accessible-page-capture-chrome.zip`. The unpacked extension is `.output/chrome-mv3`.

Production sizes:

- Site JavaScript: 16.38 KB raw / 5.91 KB gzip.
- Site CSS: 11.36 KB raw / 3.31 KB gzip.
- Mobile hero WebP: 43 KB.
- Desktop hero WebP: 123 KB.
- Packaged extension: 11.03 KB zip / 24.86 KB uncompressed.
- No runtime fonts, third-party scripts, or analytics.

## Verification

- `npm run check` — passed.
- `npm test` — passed: 3 unit tests and 7 Playwright tests.
- Unpacked-extension test — passed in a fresh Chromium profile.
- Unique typed value test — passed; preview contained only “Typed value redacted.”
- Markdown and JSON download tests — passed and file bodies were inspected.
- Offline demo reload and export — passed.
- Demo storage and request-isolation test — passed.
- Axe serious/critical scan on all routes — zero findings.
- Mobile 390px overflow check — passed.
- `/opt/fleet/lib/verify-url.sh` — passed with no console or page errors, one `h1`, one `main`, `lang`, title, and image alt.
- `npm audit --omit=dev` — zero production vulnerabilities.

Mobile Lighthouse 13.4.1 from the production preview:

- Performance: 100
- Accessibility: 100
- Best Practices: 100
- SEO: 100
- LCP: 1.4 s
- CLS: 0
- Total Blocking Time: 0 ms

Evidence is in `.factory/evidence/`: screenshots, `verify.json`, and `lighthouse.json`.

## Scope decisions and known gaps

- The stack decision is followed without deviation: WXT + TypeScript MV3 and a Vite static site.
- The brief names a future shared team inbox. A real remote inbox needs a backend, identity, access control, retention policy, and consent workflow. Those conflict with this static work order and the brief’s no-upload v1 boundary. V1 therefore ships the paid license contract and useful local team routing fields. It does not pretend to provide remote coordination.
- The factory must register `accessible-page-capture` with Sociobot before the checkout and live license response can work. No product ID is hardcoded.
- Chrome MV3 is the packaged target. Firefox packaging is a later compatibility task.
- Browser-internal pages and extension-store pages block content scripts. The popup explains that the user must open a normal web page.
- Accessibility output varies with each page’s own names and roles. Unlabelled controls are reported as unlabelled rather than guessed.

## Suggested next steps

1. Register the checkout product and set its return URL to the deployed landing page.
2. Pilot ten real barrier reports and measure how many teams reproduce without a meeting.
3. Use pilot consent and retention findings to design a separate shared inbox backend.
4. Add Firefox packaging after the Chromium pilot proves the event model.
