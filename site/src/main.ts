import './style.css';
import { sampleJson, sampleMarkdown, samplePacket } from './sample';

const app = document.querySelector<HTMLDivElement>('#app')!;
const routeStatus = document.querySelector<HTMLDivElement>('#route-status')!;
const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')!;
const demoNoteKey = 'demo:accessible-page-capture:note';
const licenseKey = 'sb_license:accessible-page-capture';
const verdictKey = 'sb_license_verdict:accessible-page-capture';

type Route = '/' | '/demo' | '/privacy' | '/terms' | '/404';

const header = () => `<header class="site-header">
  <a class="wordmark" href="/" data-link aria-label="Accessible Page Capture home"><span aria-hidden="true" class="wordmark-mark">●</span><span>Accessible<br>Page Capture</span></a>
  <nav aria-label="Main navigation"><a href="/demo" data-link>Demo</a><a href="/#how">How it works</a><a href="/privacy" data-link>Privacy</a></nav>
</header>`;

const footer = () => `<footer class="site-footer">
  <p><strong>Accessible Page Capture</strong><br>Record an access barrier and export a private issue packet.</p>
  <nav aria-label="Footer navigation"><a href="/privacy" data-link>Privacy</a><a href="/terms" data-link>Terms</a><a href="https://hello-factory.sociobot.in" rel="external">Built by Param Factory <span class="sr-only">(external)</span></a></nav>
  <p class="build">Version 1.0.0 · Build APC-20260828<br>Hero art generated for this product.</p>
</footer>`;

function traceMarkup() {
  return `<ol class="trace-list">${samplePacket.events.map((event) => `<li><span class="time">${event.at}</span><div><span class="event-stamp">${event.kind}</span><strong>${event.label}</strong><small>${event.role}${event.detail ? ` · ${event.detail}` : ''}</small></div></li>`).join('')}</ol>`;
}

function landing() {
  return `${header()}<main id="main">
    <section class="hero" aria-labelledby="page-title">
      <div class="hero-copy">
        <p class="eyebrow">A short trace for one blocked task</p>
        <h1 id="page-title" tabindex="-1">Record an access barrier others can replay</h1>
        <p class="lede">For low-vision workers and colleagues who need a product team to reproduce one blocked web task.</p>
        <div class="hero-action"><a class="button primary" href="/demo" data-link>Try it with sample data</a><p>The demo opens a finished packet. Nothing is saved.</p></div>
        <ul class="plain-facts" aria-label="Product facts"><li><b>Private</b> Typed values never enter the packet.</li><li><b>Offline</b> Capture and export work offline.</li><li><b>Free</b> Individual exports cost $0.</li></ul>
      </div>
      <figure class="hero-art"><picture><source media="(max-width: 700px)" srcset="/art/hero-640.webp"><img src="/art/hero-960.webp" width="960" height="640" alt="A paper browser trace connects three numbered steps to a compact report." fetchpriority="high" decoding="async"></picture><figcaption>Focus and control events become a report a team can inspect.</figcaption></figure>
    </section>
    <section class="live-preview ruled-section" aria-labelledby="preview-heading">
      <div class="section-intro"><p class="eyebrow">The product, not a scan</p><h2 id="preview-heading">See the interaction in order</h2><p>The packet keeps the page address, control labels, timing, and your note. It does not copy the page.</p></div>
      <div class="preview-sheet"><div class="sheet-head"><span>Sample trace</span><span>18.4 seconds</span></div>${traceMarkup()}</div>
    </section>
    <section id="how" class="how ruled-section" aria-labelledby="how-heading">
      <div class="section-intro"><p class="eyebrow">How it works</p><h2 id="how-heading">Make one barrier concrete</h2></div>
      <ol class="steps"><li><span>1</span><div><h3>Start the capture</h3><p>Open the extension on the blocked page. Recording begins only when you start it.</p></div></li><li><span>2</span><div><h3>Repeat the task</h3><p>Use focus, clicks, and control keys for up to 30 seconds. Typed values become a redaction note.</p></div></li><li><span>3</span><div><h3>Check and export</h3><p>Add your goal, preview every event, then export Markdown or JSON.</p></div></li></ol>
      <a class="button secondary" href="/downloads/accessible-page-capture-chrome.zip" download>Download Chrome extension</a>
    </section>
    <section class="limits ruled-section" aria-labelledby="limits-heading"><div><p class="eyebrow">Clear limits</p><h2 id="limits-heading">This is evidence, not a verdict</h2></div><ul><li>It does not run an automated accessibility audit.</li><li>It does not record a continuous browsing session.</li><li>It does not submit a report without your action.</li><li>It does not certify legal compliance.</li></ul></section>
    <section class="paid ruled-section" aria-labelledby="paid-heading"><div><p class="eyebrow">Optional team handoff</p><h2 id="paid-heading">Add a route to every packet</h2><p>Save a team name and triage destination in the extension. These fields stay in your browser.</p></div><div class="price-slip"><p><strong>$39</strong> one-time purchase</p><ul><li>Team name in each export</li><li>Triage destination in each export</li><li>Free capture and export stay unchanged</li></ul><a class="button primary" href="https://api.sociobot.in/api/v1/products/accessible-page-capture/checkout">Buy team handoff</a><button class="text-button" id="show-license">Have a license? Paste it</button><div id="license-box" hidden><label for="license-input">License token</label><input id="license-input" type="password" autocomplete="off"><button class="button secondary" id="verify-license">Verify license</button><p id="license-status" aria-live="polite"></p></div><p class="legal-note">Sociobot/Dodo is the merchant of record. Refunds revoke the license. See <a href="/terms" data-link>terms</a>.</p></div></section>
  </main>${footer()}`;
}

function demo() {
  const note = localStorage.getItem(demoNoteKey) || samplePacket.note;
  return `<div class="demo-banner" role="status"><span><strong>Demo</strong> — sample data, nothing is saved</span><span><button id="reset-demo">Reset demo</button><a href="/downloads/accessible-page-capture-chrome.zip" download>Start for real</a></span></div>${header()}<main id="main" class="demo-main">
    <section class="demo-heading" aria-labelledby="page-title"><div><p class="eyebrow">Sample issue packet</p><h1 id="page-title" tabindex="-1">Check a captured access barrier</h1><p>Review the trace, change the note, and export either file.</p></div><div class="demo-stamp" aria-label="Capture complete"><span>6 events</span><strong>18.4s</strong><small>capture complete</small></div></section>
    <section class="packet" aria-labelledby="packet-heading"><div class="packet-meta"><div><p class="eyebrow">Captured page</p><h2 id="packet-heading">${samplePacket.pageTitle}</h2><p>${samplePacket.pageUrl}</p></div><dl><div><dt>Captured</dt><dd>28 Aug 2026, 09:42 UTC</dd></div><div><dt>Duration</dt><dd>${samplePacket.duration}</dd></div></dl></div>
      <div class="packet-grid"><div><label for="demo-note">What I was trying to do</label><textarea id="demo-note" rows="5" maxlength="1000">${note}</textarea><p class="save-note">Demo note stays in the separate <code>demo:</code> storage space.</p></div><div><h2>Interaction trace</h2>${traceMarkup()}</div></div>
      <div class="export-bar"><div><strong>Ready to share</strong><p>Check the note and all six events first.</p></div><button class="button secondary" id="export-md">Export Markdown</button><button class="button secondary" id="export-json">Export JSON</button></div>
      <p id="export-status" class="export-status" aria-live="polite"></p>
    </section>
  </main>${footer()}`;
}

function privacy() {
  return `${header()}<main id="main" class="prose-page"><p class="eyebrow">Policy · 28 August 2026</p><h1 id="page-title" tabindex="-1">Your capture stays under your control</h1><p class="lede">Accessible Page Capture stores active and finished captures in your browser.</p><h2>What the extension stores</h2><p>It stores the page address, page title, focused control labels, event timing, your note, and optional team fields. It does not store typed values, password values, screenshots, or copied page content.</p><h2>When data leaves your device</h2><p>Exports leave only when you save or share them. A license token goes to Sociobot when you verify a team handoff purchase. The free capture does not need that request.</p><h2>Demo data</h2><p>The website demo uses the <code>demo:accessible-page-capture:</code> storage prefix. Reset demo removes that data. Demo data never enters extension storage.</p><h2>Payments</h2><p>Sociobot/Dodo handles checkout and acts as merchant of record. This site does not receive card details.</p><h2>Delete your data</h2><p>Discard the current capture in the extension. You can also remove the extension to clear its local storage.</p><h2>Contact</h2><p>Email <a href="mailto:privacy@sociobot.in">privacy@sociobot.in</a> with a privacy question.</p></main>${footer()}`;
}

function terms() {
  return `${header()}<main id="main" class="prose-page"><p class="eyebrow">Terms · 28 August 2026</p><h1 id="page-title" tabindex="-1">Use the packet as supporting evidence</h1><p class="lede">These terms cover the website, browser extension, exports, and paid team handoff.</p><h2>What the product provides</h2><p>The extension records a short interaction trace after you start it. It produces Markdown and JSON files for your review.</p><h2>Your responsibility</h2><p>Review each packet before sharing it. Do not use the extension to collect information you lack permission to handle.</p><h2>No certification</h2><p>A packet can help reproduce a barrier. It is not an audit, legal opinion, or accessibility certification.</p><h2>Team handoff purchase</h2><p>Team handoff costs $39 as a one-time purchase. It adds local team routing fields. Core capture, preview, redaction, and export remain free.</p><h2>Billing and refunds</h2><p>Sociobot/Dodo is the merchant of record. The hosted checkout states refund terms. A refunded, expired, or revoked license stops paid fields from appearing in new exports.</p><h2>Availability</h2><p>The software is provided under the MIT License without a warranty. See the repository license for the complete text.</p><h2>Contact</h2><p>Email <a href="mailto:support@sociobot.in">support@sociobot.in</a> with a terms question.</p></main>${footer()}`;
}

function notFound() {
  return `${header()}<main id="main" class="not-found"><div class="lost-sheet" aria-hidden="true"><span>4</span><span>0</span><span>4</span></div><p class="eyebrow">Page not found</p><h1 id="page-title" tabindex="-1">This report slipped out of the stack</h1><p>The address does not match a page here.</p><a class="button primary" href="/" data-link>Return home</a></main>${footer()}`;
}

function routeFor(path: string): Route {
  if (path === '/' || path === '/demo' || path === '/privacy' || path === '/terms') return path;
  return '/404';
}

function setMeta(route: Route) {
  const values: [string, string] = ({
    '/': ['Accessible Page Capture — Report web access barriers', 'Record a short focus trace and export a redacted issue packet that helps a product team replay one web access barrier.'],
    '/demo': ['Demo — Accessible Page Capture', 'Review and export a sample web access barrier packet.'],
    '/privacy': ['Privacy — Accessible Page Capture', 'See what Accessible Page Capture stores and when data leaves your browser.'],
    '/terms': ['Terms — Accessible Page Capture', 'Terms for Accessible Page Capture and its optional team handoff purchase.'],
    '/404': ['Page not found — Accessible Page Capture', 'The requested Accessible Page Capture page was not found.']
  } as Record<Route, [string, string]>)[route];
  document.title = values[0];
  document.querySelector<HTMLMetaElement>('meta[name="description"]')!.content = values[1];
  canonical.href = `https://accessible-page-capture.sociobot.in${route === '/404' ? location.pathname : route}`;
}

function download(content: string, filename: string, type: string) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const anchor = document.createElement('a'); anchor.href = url; anchor.download = filename; anchor.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function bindDemo() {
  const note = document.querySelector<HTMLTextAreaElement>('#demo-note')!;
  note.addEventListener('input', () => localStorage.setItem(demoNoteKey, note.value));
  document.querySelector<HTMLButtonElement>('#reset-demo')!.addEventListener('click', () => { localStorage.removeItem(demoNoteKey); render(false); });
  document.querySelector<HTMLButtonElement>('#export-md')!.addEventListener('click', () => { download(sampleMarkdown(note.value), 'sample-access-barrier.md', 'text/markdown'); document.querySelector('#export-status')!.textContent = 'Markdown exported. Your sample data stays in demo mode.'; });
  document.querySelector<HTMLButtonElement>('#export-json')!.addEventListener('click', () => { download(sampleJson(note.value), 'sample-access-barrier.json', 'application/json'); document.querySelector('#export-status')!.textContent = 'JSON exported. Your sample data stays in demo mode.'; });
}

async function verifyLicense(token: string) {
  const response = await fetch(`https://api.sociobot.in/api/v1/products/accessible-page-capture/verify?license=${encodeURIComponent(token)}`);
  if (!response.ok) throw new Error('The license service could not be reached. Try again later.');
  const result = await response.json() as { valid: boolean; reason: string };
  localStorage.setItem(licenseKey, token); localStorage.setItem(verdictKey, JSON.stringify({ valid: result.valid, checkedAt: Date.now() }));
  return result.valid;
}

function bindLicense() {
  const show = document.querySelector<HTMLButtonElement>('#show-license');
  const box = document.querySelector<HTMLDivElement>('#license-box');
  show?.addEventListener('click', () => { if (box) { box.hidden = false; box.querySelector('input')?.focus(); } });
  document.querySelector<HTMLButtonElement>('#verify-license')?.addEventListener('click', async () => {
    const token = document.querySelector<HTMLInputElement>('#license-input')!.value.trim();
    const status = document.querySelector<HTMLParagraphElement>('#license-status')!;
    if (!token) { status.textContent = 'Paste a license token first.'; return; }
    status.textContent = 'Checking license…';
    try { status.textContent = await verifyLicense(token) ? 'License verified. Paste this token into the extension.' : 'That license is not active.'; }
    catch (error) { status.textContent = error instanceof Error ? error.message : 'The license could not be checked.'; }
  });
}

function bindLinks() {
  document.querySelectorAll<HTMLAnchorElement>('a[data-link]').forEach((link) => link.addEventListener('click', (event) => {
    if (link.origin !== location.origin) return;
    event.preventDefault(); history.pushState({}, '', link.pathname + link.search + link.hash); render();
  }));
}

function render(moveFocus = true) {
  const route = routeFor(location.pathname.replace(/\/$/, '') || '/');
  setMeta(route);
  app.innerHTML = route === '/' ? landing() : route === '/demo' ? demo() : route === '/privacy' ? privacy() : route === '/terms' ? terms() : notFound();
  bindLinks();
  if (route === '/demo') bindDemo();
  if (route === '/') bindLicense();
  if (moveFocus) {
    const heading = document.querySelector<HTMLElement>('#page-title');
    heading?.focus({ preventScroll: true }); window.scrollTo(0, 0);
    routeStatus.textContent = heading?.textContent || document.title;
  }
  if (location.hash) document.querySelector(location.hash)?.scrollIntoView();
}

const returnedLicense = new URLSearchParams(location.search).get('license');
if (returnedLicense) {
  localStorage.setItem(licenseKey, returnedLicense);
  history.replaceState({}, '', location.pathname + location.hash);
  void verifyLicense(returnedLicense).catch(() => undefined);
}
window.addEventListener('popstate', () => render());
window.addEventListener('online', () => document.body.classList.remove('is-offline'));
window.addEventListener('offline', () => document.body.classList.add('is-offline'));
if ('serviceWorker' in navigator && import.meta.env.PROD) void navigator.serviceWorker.register('/sw.js');
render(false);
