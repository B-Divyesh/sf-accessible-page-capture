export const MAX_CAPTURE_MS = 30_000;
export const MAX_EVENTS = 80;

export type TraceKind = 'focus' | 'click' | 'key' | 'redacted-input';

export interface TraceEvent {
  at: number;
  kind: TraceKind;
  label: string;
  role: string;
  detail?: string;
}

export interface CaptureSession {
  id: string;
  status: 'recording' | 'stopped';
  stopReason?: 'user' | 'limit';
  startedAt: number;
  stoppedAt?: number;
  endsAt: number;
  tabId: number;
  pageUrl: string;
  pageTitle: string;
  events: TraceEvent[];
  note: string;
}

export interface TeamProfile {
  teamName: string;
  routeTo: string;
}

export const sessionKey = 'capture:session';
export const teamProfileKey = 'capture:team-profile';
export const licenseKey = 'sb_license:accessible-page-capture';
export const licenseVerdictKey = 'sb_license_verdict:accessible-page-capture';

export function safeUrl(raw: string): string {
  try {
    const url = new URL(raw);
    url.username = '';
    url.password = '';
    url.hash = '';
    for (const key of new Set(url.searchParams.keys())) url.searchParams.set(key, '[redacted]');
    return url.toString();
  } catch {
    return '[page URL unavailable]';
  }
}

export function cleanText(value: string, limit = 160): string {
  return value.replace(/\s+/g, ' ').trim().slice(0, limit);
}

export function roleFor(element: Element): string {
  const explicit = cleanText(element.getAttribute('role') || '', 40);
  if (explicit) return explicit;
  const tag = element.tagName.toLowerCase();
  if (tag === 'a') return 'link';
  if (tag === 'button') return 'button';
  if (tag === 'select') return 'combobox';
  if (tag === 'textarea') return 'textbox';
  if (tag === 'input') {
    const type = (element.getAttribute('type') || 'text').toLowerCase();
    if (type === 'checkbox') return 'checkbox';
    if (type === 'radio') return 'radio';
    if (type === 'range') return 'slider';
    if (['button', 'submit', 'reset'].includes(type)) return 'button';
    return 'textbox';
  }
  return tag || 'element';
}

export function accessibleLabel(element: Element): string {
  const aria = cleanText(element.getAttribute('aria-label') || '');
  if (aria) return aria;

  const ids = (element.getAttribute('aria-labelledby') || '').split(/\s+/).filter(Boolean);
  const labelled = cleanText(ids.map((id) => document.getElementById(id)?.textContent || '').join(' '));
  if (labelled) return labelled;

  if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement || element instanceof HTMLSelectElement) {
    const labels = cleanText(Array.from(element.labels || []).map((label) => label.textContent || '').join(' '));
    if (labels) return labels;
    const placeholder = cleanText(element.getAttribute('placeholder') || '');
    if (placeholder) return `${placeholder} field`;
  }

  const alt = cleanText(element.getAttribute('alt') || '');
  if (alt) return alt;
  const title = cleanText(element.getAttribute('title') || '');
  if (title) return title;
  const canUseOwnText = !(element instanceof HTMLElement && element.isContentEditable)
    && element.matches('a, button, summary, option, [role]');
  const text = canUseOwnText ? cleanText(element.textContent || '', 100) : '';
  return text || `Unlabelled ${roleFor(element)}`;
}

export function eventLine(event: TraceEvent, startedAt: number, index: number): string {
  const seconds = Math.max(0, (event.at - startedAt) / 1000).toFixed(1);
  const detail = event.detail ? ` — ${event.detail}` : '';
  return `${index + 1}. +${seconds}s ${event.kind}: ${event.label} (${event.role})${detail}`;
}

export function buildMarkdown(session: CaptureSession, profile?: TeamProfile): string {
  const lines = [
    '# Accessibility barrier report',
    '',
    `- Page: ${safeUrl(session.pageUrl)}`,
    `- Page title: ${cleanText(session.pageTitle) || '[title unavailable]'}`,
    `- Captured: ${new Date(session.startedAt).toISOString()}`,
    `- Duration: ${Math.max(0, Math.min(MAX_CAPTURE_MS, (session.stoppedAt || session.endsAt) - session.startedAt)) / 1000} seconds`,
  ];
  if (profile?.teamName) lines.push(`- Team: ${cleanText(profile.teamName)}`);
  if (profile?.routeTo) lines.push(`- Route to: ${cleanText(profile.routeTo)}`);
  lines.push('', '## What I was trying to do', '', cleanText(session.note, 1000) || '_No note added._', '', '## Interaction trace', '');
  if (session.events.length) {
    lines.push(...session.events.map((event, index) => eventLine(event, session.startedAt, index)));
  } else {
    lines.push('_No focus or control events were captured._');
  }
  lines.push('', '## Privacy notes', '', '- Typed values were not recorded.', '- Password values were not recorded.', '- The page content was not copied.', '', '_Created with Accessible Page Capture. This report is evidence, not an accessibility certification._', '');
  return lines.join('\n');
}

export function buildJson(session: CaptureSession, profile?: TeamProfile): string {
  return JSON.stringify({
    format: 'accessible-page-capture/v1',
    page: { url: safeUrl(session.pageUrl), title: cleanText(session.pageTitle) },
    capture: {
      startedAt: new Date(session.startedAt).toISOString(),
      stoppedAt: new Date(session.stoppedAt || session.endsAt).toISOString(),
      note: cleanText(session.note, 1000),
      events: session.events
    },
    ...(profile && (profile.teamName || profile.routeTo) ? { team: profile } : {}),
    redactions: ['typed values', 'password values', 'page content']
  }, null, 2);
}
