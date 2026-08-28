import { describe, expect, it } from 'vitest';
import { MAX_CAPTURE_MS, buildJson, buildMarkdown, safeUrl, type CaptureSession } from '../../lib/capture';

const session: CaptureSession = {
  id: 'sample', status: 'stopped', stopReason: 'limit', startedAt: Date.parse('2026-08-28T10:00:00Z'),
  endsAt: Date.parse('2026-08-28T10:00:30Z'), stoppedAt: Date.parse('2026-08-28T10:00:30Z'), tabId: 4,
  pageUrl: 'https://example.test/form?token=secret&view=edit#private', pageTitle: 'Request form', note: 'Choose a return date',
  events: [{ at: Date.parse('2026-08-28T10:00:02Z'), kind: 'redacted-input', label: 'Trip reason', role: 'textbox', detail: 'Typed value redacted' }]
};

describe('issue packet', () => {
  it('@claim:thirty-second-limit fixes the capture limit at 30 seconds', () => {
    expect(MAX_CAPTURE_MS).toBe(30_000);
    expect(buildMarkdown(session)).toContain('- Duration: 30 seconds');
  });

  it('@claim:url-redaction redacts sensitive URL parameters and fragments', () => {
    expect(safeUrl(session.pageUrl)).toBe('https://example.test/form?token=%5Bredacted%5D&view=%5Bredacted%5D');
    const privateUrl = 'https://example.test/form?patient=Jane-Doe&diagnosis=low-vision&token=secret#private';
    expect(safeUrl(privateUrl))
      .toBe('https://example.test/form?patient=%5Bredacted%5D&diagnosis=%5Bredacted%5D&token=%5Bredacted%5D');
    const privateSession = { ...session, pageUrl: privateUrl };
    for (const output of [buildMarkdown(privateSession), buildJson(privateSession)]) {
      expect(output).not.toContain('Jane-Doe');
      expect(output).not.toContain('low-vision');
      expect(output).not.toContain('secret');
      expect(output).not.toContain('#private');
    }
  });

  it('builds parseable JSON and readable Markdown', () => {
    const json = JSON.parse(buildJson(session));
    expect(json.format).toBe('accessible-page-capture/v1');
    expect(json.capture.events).toHaveLength(1);
    expect(buildMarkdown(session)).toContain('## Interaction trace');
    expect(buildJson(session)).not.toContain('token=secret');
  });
});
