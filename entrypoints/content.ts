import { accessibleLabel, roleFor, type TraceEvent, type TraceKind } from '../lib/capture';

export default defineContentScript({
  matches: ['http://*/*', 'https://*/*'],
  main() {
    let recording = false;
    let endsAt = 0;
    let timer: number | undefined;
    let lastSignature = '';
    let lastAt = 0;

    const send = (kind: TraceKind, target: EventTarget | null, detail?: string) => {
      if (!recording || Date.now() >= endsAt || !(target instanceof Element)) return;
      const event: TraceEvent = { at: Date.now(), kind, label: accessibleLabel(target), role: roleFor(target), ...(detail ? { detail } : {}) };
      const signature = `${kind}:${event.label}:${event.role}:${detail || ''}`;
      if (signature === lastSignature && event.at - lastAt < 400) return;
      lastSignature = signature; lastAt = event.at;
      void chrome.runtime.sendMessage({ type: 'TRACE_EVENT', event });
    };

    const onFocus = (event: FocusEvent) => send('focus', event.target);
    const onClick = (event: MouseEvent) => send('click', event.target);
    const onKey = (event: KeyboardEvent) => {
      const target = event.target;
      const isText = target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || (target instanceof HTMLElement && target.isContentEditable);
      const isPassword = target instanceof HTMLInputElement && target.type === 'password';
      if (isText && (event.key.length === 1 || event.key === 'Backspace' || event.key === 'Delete')) {
        send('redacted-input', target, isPassword ? 'Password input redacted' : 'Typed value redacted');
      } else if (['Tab', 'Enter', ' ', 'Escape', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
        send('key', target, event.key === ' ' ? 'Space' : event.key);
      }
    };

    const stop = () => {
      recording = false;
      if (timer) window.clearTimeout(timer);
      document.removeEventListener('focusin', onFocus, true);
      document.removeEventListener('click', onClick, true);
      document.removeEventListener('keydown', onKey, true);
    };

    const start = (limit: number) => {
      stop(); recording = true; endsAt = limit;
      document.addEventListener('focusin', onFocus, true);
      document.addEventListener('click', onClick, true);
      document.addEventListener('keydown', onKey, true);
      timer = window.setTimeout(() => { stop(); void chrome.runtime.sendMessage({ type: 'AUTO_STOP' }); }, Math.max(0, endsAt - Date.now()));
    };

    chrome.runtime.onMessage.addListener((message) => {
      if (message.type === 'CAPTURE_STARTED') start(message.endsAt);
      if (message.type === 'CAPTURE_STOPPED') stop();
    });
  }
});
