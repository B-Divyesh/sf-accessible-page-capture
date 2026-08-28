import { chromium, expect, test } from '@playwright/test';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

test('@claim:explicit-start @claim:redacted-input @claim:no-page-copy @claim:local-storage @claim:no-screenshots records only after start and keeps values out', async () => {
  const userDataDir = await mkdtemp(join(tmpdir(), 'apc-extension-'));
  const extensionPath = resolve('.output/chrome-mv3');
  const context = await chromium.launchPersistentContext(userDataDir, {
    channel: 'chromium', headless: true,
    args: [`--disable-extensions-except=${extensionPath}`, `--load-extension=${extensionPath}`]
  });
  try {
    let worker = context.serviceWorkers()[0];
    if (!worker) worker = await context.waitForEvent('serviceworker');
    const extensionId = new URL(worker.url()).host;
    const target = await context.newPage();
    await target.goto('http://127.0.0.1:4173/demo');
    const popup = await context.newPage();
    await popup.goto(`chrome-extension://${extensionId}/popup.html`);
    const before = await worker.evaluate(async () => (await chrome.storage.local.get('capture:session'))['capture:session']);
    expect(before).toBeUndefined();
    await popup.getByRole('button', { name: 'Start 30-second capture' }).click();
    await target.locator('#demo-note').focus();
    await target.locator('#demo-note').pressSequentially('TOP-SECRET-VALUE');
    await target.getByRole('button', { name: 'Export JSON' }).focus();
    await popup.getByRole('button', { name: 'Stop and preview' }).click();
    const stored = await worker.evaluate(async () => (await chrome.storage.local.get('capture:session'))['capture:session']);
    expect(stored.status).toBe('stopped');
    expect(stored).not.toHaveProperty('screenshot');
    await expect(popup.getByRole('heading', { level: 1 })).toHaveText('Check the issue packet');
    await expect(popup.locator('main')).toContainText('Typed value redacted');
    await expect(popup.locator('main')).not.toContainText('TOP-SECRET-VALUE');
    await expect(popup.locator('main')).not.toContainText('Demo note stays in the separate');
  } finally {
    await context.close();
    await rm(userDataDir, { recursive: true, force: true });
  }
});
