import './style.css';
import { buildJson, buildMarkdown, licenseKey, licenseVerdictKey, sessionKey, teamProfileKey, type CaptureSession, type TeamProfile } from '../../lib/capture';

const app = document.querySelector<HTMLDivElement>('#app')!;
let session: CaptureSession | undefined;
let timer: number | undefined;
let error = '';

const escapeHtml = (value: string) => value.replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[char] || char);

async function message(payload: object) {
  return chrome.runtime.sendMessage(payload) as Promise<{ ok: boolean; session?: CaptureSession; error?: string }>;
}

async function stored<T>(key: string): Promise<T | undefined> {
  return (await chrome.storage.local.get(key))[key] as T | undefined;
}

function remainingSeconds(): number {
  if (!session || session.status !== 'recording') return 0;
  return Math.max(0, Math.ceil((session.endsAt - Date.now()) / 1000));
}

function landing() {
  document.title = 'Capture a barrier — Accessible Page Capture';
  app.innerHTML = `
    <section class="intro" aria-labelledby="page-title">
      <p class="kicker">30-second issue packet</p>
      <h1 id="page-title" tabindex="-1">Record this access barrier</h1>
      <p>For people who need a product team to replay one blocked web task.</p>
      ${error ? `<p class="error" role="alert">${escapeHtml(error)}</p>` : ''}
      <button class="primary" id="start">Start 30-second capture</button>
      <p class="after-action">Then return to the page and repeat the blocked step.</p>
    </section>
    <ul class="fact-list" aria-label="Capture facts">
      <li>Nothing records before you start.</li>
      <li>Typed values stay out of the packet.</li>
      <li>Markdown and JSON exports are free.</li>
    </ul>
    <details class="team-settings">
      <summary>Team handoff settings</summary>
      <div id="team-panel"><p class="muted">Checking your license…</p></div>
    </details>`;
  app.querySelector<HTMLButtonElement>('#start')!.addEventListener('click', startCapture);
  void renderTeamPanel();
}

function recording() {
  if (!session) return;
  document.title = 'Recording — Accessible Page Capture';
  app.innerHTML = `
    <section aria-labelledby="page-title">
      <p class="recording-state"><span aria-hidden="true">●</span> Recording</p>
      <h1 id="page-title" tabindex="-1">Repeat the blocked step</h1>
      <p class="timer"><span id="seconds">${remainingSeconds()}</span><small> seconds left</small></p>
      <p>Use the page now. Focus, clicks, and control keys enter the trace.</p>
      <label for="note">What were you trying to do? <span>(optional)</span></label>
      <textarea id="note" rows="3" maxlength="1000"></textarea>
      <button class="primary" id="stop">Stop and preview</button>
      <button class="quiet" id="discard">Discard this capture</button>
    </section>`;
  app.querySelector<HTMLButtonElement>('#stop')!.addEventListener('click', stopCapture);
  app.querySelector<HTMLButtonElement>('#discard')!.addEventListener('click', discardCapture);
  timer = window.setInterval(async () => {
    const seconds = app.querySelector('#seconds');
    if (seconds) seconds.textContent = String(remainingSeconds());
    if (remainingSeconds() === 0) {
      window.clearInterval(timer);
      const response = await message({ type: 'GET_SESSION' });
      session = response.session;
      preview();
    }
  }, 250);
}

function preview() {
  if (!session) return landing();
  if (timer) window.clearInterval(timer);
  document.title = 'Preview packet — Accessible Page Capture';
  const events = session.events.length
    ? `<ol class="trace">${session.events.map((event) => `<li><span class="event-kind">${escapeHtml(event.kind)}</span><strong>${escapeHtml(event.label)}</strong><small>${escapeHtml(event.role)}${event.detail ? ` · ${escapeHtml(event.detail)}` : ''}</small></li>`).join('')}</ol>`
    : '<div class="empty"><strong>No interactions captured.</strong><p>Start again and move focus or use a control on the page.</p></div>';
  app.innerHTML = `
    <section aria-labelledby="page-title">
      <p class="kicker">Preview before export</p>
      <h1 id="page-title" tabindex="-1">Check the issue packet</h1>
      ${session.stopReason === 'limit' ? '<p class="notice">The capture stopped at the 30-second limit.</p>' : ''}
      <p class="page-title">${escapeHtml(session.pageTitle || 'Untitled page')}</p>
      <p class="page-url">${escapeHtml(session.pageUrl)}</p>
      <label for="note">What were you trying to do? <span>(optional)</span></label>
      <textarea id="note" rows="3" maxlength="1000">${escapeHtml(session.note)}</textarea>
      <h2>${session.events.length} trace ${session.events.length === 1 ? 'event' : 'events'}</h2>
      ${events}
      <div class="button-row">
        <button class="primary" id="markdown">Export Markdown</button>
        <button class="secondary" id="json">Export JSON</button>
      </div>
      <button class="quiet" id="again">Record again</button>
    </section>`;
  app.querySelector<HTMLButtonElement>('#markdown')!.addEventListener('click', () => exportPacket('markdown'));
  app.querySelector<HTMLButtonElement>('#json')!.addEventListener('click', () => exportPacket('json'));
  app.querySelector<HTMLButtonElement>('#again')!.addEventListener('click', discardCapture);
}

async function startCapture() {
  error = '';
  const response = await message({ type: 'START_CAPTURE' });
  if (!response.ok) { error = response.error || 'The capture did not start. Reload the page and try again.'; landing(); return; }
  session = response.session;
  recording();
}

async function stopCapture() {
  const note = app.querySelector<HTMLTextAreaElement>('#note')?.value || '';
  const response = await message({ type: 'STOP_CAPTURE', note });
  session = response.session;
  preview();
}

async function discardCapture() {
  if (session?.events.length && !window.confirm('Discard this capture and its trace?')) return;
  await message({ type: 'DISCARD_CAPTURE' });
  session = undefined; error = ''; landing();
}

async function exportPacket(format: 'markdown' | 'json') {
  if (!session) return;
  session.note = app.querySelector<HTMLTextAreaElement>('#note')?.value || '';
  await chrome.storage.local.set({ [sessionKey]: session });
  const verdict = await stored<{ valid: boolean }>(licenseVerdictKey);
  const profile = verdict?.valid ? await stored<TeamProfile>(teamProfileKey) : undefined;
  const body = format === 'markdown' ? buildMarkdown(session, profile) : buildJson(session, profile);
  const mime = format === 'markdown' ? 'text/markdown' : 'application/json';
  const blobUrl = URL.createObjectURL(new Blob([body], { type: `${mime};charset=utf-8` }));
  try {
    await chrome.downloads.download({ url: blobUrl, filename: `access-barrier-${new Date(session.startedAt).toISOString().slice(0, 10)}.${format === 'markdown' ? 'md' : 'json'}`, saveAs: true });
    const button = app.querySelector<HTMLButtonElement>(format === 'markdown' ? '#markdown' : '#json');
    if (button) button.textContent = `${format === 'markdown' ? 'Markdown' : 'JSON'} ready`;
  } finally { window.setTimeout(() => URL.revokeObjectURL(blobUrl), 5000); }
}

async function verifyLicense(token: string): Promise<boolean> {
  const response = await fetch(`https://api.sociobot.in/api/v1/products/accessible-page-capture/verify?license=${encodeURIComponent(token)}`);
  if (!response.ok) throw new Error('The license service could not be reached. Try again when you are online.');
  const result = await response.json() as { valid: boolean };
  await chrome.storage.local.set({ [licenseKey]: token, [licenseVerdictKey]: { valid: result.valid, checkedAt: Date.now() } });
  return result.valid;
}

async function renderTeamPanel() {
  const panel = app.querySelector<HTMLDivElement>('#team-panel');
  if (!panel) return;
  const token = await stored<string>(licenseKey);
  const verdict = await stored<{ valid: boolean; checkedAt: number }>(licenseVerdictKey);
  if (token && (!verdict || Date.now() - verdict.checkedAt > 86_400_000)) {
    try { await verifyLicense(token); } catch { /* cached access remains available */ }
  }
  const current = await stored<{ valid: boolean }>(licenseVerdictKey);
  if (current?.valid) {
    const profile = await stored<TeamProfile>(teamProfileKey) || { teamName: '', routeTo: '' };
    panel.innerHTML = `<p class="success">Team handoff is active.</p>
      <label for="team-name">Team name</label><input id="team-name" maxlength="80" value="${escapeHtml(profile.teamName)}">
      <label for="route-to">Route reports to</label><input id="route-to" maxlength="120" value="${escapeHtml(profile.routeTo)}" placeholder="Accessibility triage">
      <button class="secondary" id="save-team">Save team profile</button><p class="muted">These fields appear in exports. They stay on this browser.</p>`;
    panel.querySelector<HTMLButtonElement>('#save-team')!.addEventListener('click', async () => {
      const teamName = panel.querySelector<HTMLInputElement>('#team-name')!.value;
      const routeTo = panel.querySelector<HTMLInputElement>('#route-to')!.value;
      await chrome.storage.local.set({ [teamProfileKey]: { teamName, routeTo } });
      panel.querySelector<HTMLButtonElement>('#save-team')!.textContent = 'Team profile saved';
    });
    return;
  }
  panel.innerHTML = `<p>Add team routing fields to each export. <strong>$39 once.</strong></p>
    <a class="button-link" href="https://api.sociobot.in/api/v1/products/accessible-page-capture/checkout" target="_blank">Buy team handoff</a>
    ${token && current && !current.valid ? '<p class="notice">This license is no longer active.</p>' : ''}
    <label for="license">Have a license? Paste it</label>
    <input id="license" type="password" autocomplete="off">
    <button class="secondary" id="verify">Verify license</button><p id="license-status" class="muted" aria-live="polite"></p>`;
  panel.querySelector<HTMLButtonElement>('#verify')!.addEventListener('click', async () => {
    const value = panel.querySelector<HTMLInputElement>('#license')!.value.trim();
    const status = panel.querySelector<HTMLParagraphElement>('#license-status')!;
    if (!value) { status.textContent = 'Paste a license token first.'; return; }
    status.textContent = 'Checking license…';
    try { status.textContent = await verifyLicense(value) ? 'License verified.' : 'That license is not active.'; await renderTeamPanel(); }
    catch (caught) { status.textContent = caught instanceof Error ? caught.message : 'The license could not be checked.'; }
  });
}

async function init() {
  const response = await message({ type: 'GET_SESSION' });
  session = response.session;
  if (session?.status === 'recording') recording();
  else if (session) preview();
  else landing();
}

void init();
