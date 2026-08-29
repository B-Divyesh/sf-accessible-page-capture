export interface SampleEvent { at: string; kind: string; label: string; role: string; detail?: string }

export const samplePacket = {
  pageTitle: 'Travel requests — Northstar People',
  pageUrl: 'https://work.example.test/travel/new',
  captured: '2026-08-28T09:42:00.000Z',
  duration: '18.4 seconds',
  note: 'I was trying to choose a return date. Focus moved past the date picker without saying which date was selected.',
  events: [
    { at: '+0.8s', kind: 'focus', label: 'New travel request', role: 'heading' },
    { at: '+3.1s', kind: 'focus', label: 'Return date', role: 'textbox' },
    { at: '+4.0s', kind: 'key', label: 'Return date', role: 'textbox', detail: 'Enter' },
    { at: '+7.3s', kind: 'key', label: 'Unlabelled grid', role: 'grid', detail: 'ArrowRight' },
    { at: '+11.2s', kind: 'redacted-input', label: 'Trip reason', role: 'textbox', detail: 'Typed value redacted' },
    { at: '+18.4s', kind: 'click', label: 'Save request', role: 'button' }
  ] as SampleEvent[]
};

export function sampleMarkdown(note = samplePacket.note): string {
  return `# Access barrier issue packet\n\n- Page: ${samplePacket.pageUrl}\n- Page title: ${samplePacket.pageTitle}\n- Captured: ${samplePacket.captured}\n- Duration: ${samplePacket.duration}\n\n## What I was trying to do\n\n${note}\n\n## Recorded steps\n\n${samplePacket.events.map((event, index) => `${index + 1}. ${event.at} ${event.kind}: ${event.label} (${event.role})${event.detail ? ` — ${event.detail}` : ''}`).join('\n')}\n\n## Privacy notes\n\n- Typed values were not recorded.\n- Password values were not recorded.\n- The page content was not copied.\n`;
}

export function sampleJson(note = samplePacket.note): string {
  return JSON.stringify({ format: 'accessible-page-capture/v1', page: { url: samplePacket.pageUrl, title: samplePacket.pageTitle }, capture: { startedAt: samplePacket.captured, duration: samplePacket.duration, note, events: samplePacket.events }, redactions: ['typed values', 'password values', 'page content'] }, null, 2);
}
