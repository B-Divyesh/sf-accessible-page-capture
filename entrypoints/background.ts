import { MAX_CAPTURE_MS, MAX_EVENTS, sessionKey, type CaptureSession, type TraceEvent } from '../lib/capture';

type Request =
  | { type: 'GET_SESSION' }
  | { type: 'START_CAPTURE' }
  | { type: 'STOP_CAPTURE'; note?: string }
  | { type: 'TRACE_EVENT'; event: TraceEvent; tabId?: number }
  | { type: 'AUTO_STOP'; tabId?: number }
  | { type: 'DISCARD_CAPTURE' };

async function getSession(): Promise<CaptureSession | undefined> {
  return (await chrome.storage.local.get(sessionKey))[sessionKey] as CaptureSession | undefined;
}

async function saveSession(session: CaptureSession): Promise<void> {
  await chrome.storage.local.set({ [sessionKey]: session });
}

async function stopSession(reason: 'user' | 'limit', note?: string): Promise<CaptureSession | undefined> {
  const session = await getSession();
  if (!session) return undefined;
  const stopped = { ...session, status: 'stopped' as const, stopReason: reason, stoppedAt: Math.min(Date.now(), session.endsAt), note: note ?? session.note };
  await saveSession(stopped);
  if (session.tabId >= 0) void chrome.tabs.sendMessage(session.tabId, { type: 'CAPTURE_STOPPED' }).catch(() => undefined);
  return stopped;
}

export default defineBackground(() => {
  chrome.runtime.onMessage.addListener((request: Request, sender, sendResponse) => {
    void (async () => {
      if (request.type === 'GET_SESSION') {
        const session = await getSession();
        if (session?.status === 'recording' && Date.now() >= session.endsAt) {
          sendResponse({ ok: true, session: await stopSession('limit') });
        } else sendResponse({ ok: true, session });
        return;
      }
      if (request.type === 'START_CAPTURE') {
        const tabs = await chrome.tabs.query({ currentWindow: true });
        const tab = tabs.find((candidate) => candidate.active && /^https?:/.test(candidate.url || ''))
          || tabs.find((candidate) => /^https?:/.test(candidate.url || ''));
        if (!tab?.id || !tab.url || !/^https?:/.test(tab.url)) {
          sendResponse({ ok: false, error: 'Open a normal web page, then start again.' });
          return;
        }
        const now = Date.now();
        const session: CaptureSession = {
          id: crypto.randomUUID(), status: 'recording', startedAt: now, endsAt: now + MAX_CAPTURE_MS,
          tabId: tab.id, pageUrl: tab.url, pageTitle: tab.title || '', events: [], note: ''
        };
        await saveSession(session);
        try {
          await chrome.tabs.sendMessage(tab.id, { type: 'CAPTURE_STARTED', endsAt: session.endsAt });
        } catch {
          await chrome.storage.local.remove(sessionKey);
          sendResponse({ ok: false, error: 'Reload this page so the extension can record it.' });
          return;
        }
        sendResponse({ ok: true, session });
        return;
      }
      if (request.type === 'STOP_CAPTURE') {
        sendResponse({ ok: true, session: await stopSession('user', request.note) });
        return;
      }
      if (request.type === 'AUTO_STOP') {
        const session = await getSession();
        if (session && session.tabId === sender.tab?.id && session.status === 'recording') await stopSession('limit');
        sendResponse({ ok: true });
        return;
      }
      if (request.type === 'TRACE_EVENT') {
        const session = await getSession();
        if (!session || session.status !== 'recording' || session.tabId !== sender.tab?.id) {
          sendResponse({ ok: false }); return;
        }
        if (Date.now() >= session.endsAt) {
          await stopSession('limit'); sendResponse({ ok: true }); return;
        }
        if (session.events.length < MAX_EVENTS) {
          session.events.push(request.event);
          await saveSession(session);
        }
        sendResponse({ ok: true });
        return;
      }
      if (request.type === 'DISCARD_CAPTURE') {
        const session = await getSession();
        if (session?.status === 'recording') await stopSession('user');
        await chrome.storage.local.remove(sessionKey);
        sendResponse({ ok: true });
      }
    })().catch((error: unknown) => sendResponse({ ok: false, error: error instanceof Error ? error.message : 'The extension could not finish that action.' }));
    return true;
  });
});
