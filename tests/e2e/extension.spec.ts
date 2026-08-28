import { chromium, expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

test('@claim:explicit-start @claim:redacted-input @claim:password-redaction @claim:no-page-copy @claim:preview-before-export @claim:no-auto-export @claim:local-storage @claim:no-screenshots @claim:no-capture-network records only after start and keeps private values out of both exports', async () => {
  const userDataDir = await mkdtemp(join(tmpdir(), 'apc-extension-'));
  const extensionPath = resolve('.output/chrome-mv3');
  const context = await chromium.launchPersistentContext(userDataDir, {
    channel: 'chromium', headless: true, acceptDownloads: true,
    args: [`--disable-extensions-except=${extensionPath}`, `--load-extension=${extensionPath}`]
  });
  try {
    const outsideRequests: string[] = [];
    context.on('request', (request) => {
      const url = new URL(request.url());
      if (url.protocol.startsWith('http') && url.origin !== 'http://127.0.0.1:4173') outsideRequests.push(request.url());
    });
    let worker = context.serviceWorkers()[0];
    if (!worker) worker = await context.waitForEvent('serviceworker');
    const extensionId = new URL(worker.url()).host;
    const target = await context.newPage();
    await target.goto('http://127.0.0.1:4173/demo');
    await target.evaluate(() => {
      const fixture = document.createElement('section');
      fixture.innerHTML = `<p id="private-copy">PRIVATE PAGE BODY 48291</p>
        <label for="private-textarea">Private textarea</label><textarea id="private-textarea"></textarea>
        <label for="private-password">Private password</label><input id="private-password" type="password">
        <div id="private-rich" role="textbox" contenteditable="true" aria-label="Rich text editor"></div>`;
      document.body.prepend(fixture);
    });
    const popup = await context.newPage();
    await popup.goto(`chrome-extension://${extensionId}/popup.html`);
    expect((await new AxeBuilder({ page: popup }).analyze()).violations.filter((item) => ['serious', 'critical'].includes(item.impact || ''))).toEqual([]);
    const downloads: string[] = [];
    popup.on('download', (download) => downloads.push(download.suggestedFilename()));
    const before = await worker.evaluate(async () => (await chrome.storage.local.get('capture:session'))['capture:session']);
    expect(before).toBeUndefined();
    await popup.getByRole('button', { name: 'Start 30-second capture' }).click();
    await expect(popup.getByRole('heading', { level: 1 })).toBeFocused();
    expect((await new AxeBuilder({ page: popup }).analyze()).violations.filter((item) => ['serious', 'critical'].includes(item.impact || ''))).toEqual([]);
    await target.locator('#private-textarea').pressSequentially('TEXTAREA-SECRET-2468');
    await target.locator('#private-password').pressSequentially('PASSWORD-SECRET-7391');
    await target.locator('#private-rich').pressSequentially('RICH-SECRET-9137');
    await target.locator('#private-copy').click();
    await target.getByRole('button', { name: 'Export JSON' }).focus();
    await popup.getByRole('button', { name: 'Stop and preview' }).click();
    await expect(popup.getByRole('heading', { level: 1 })).toBeFocused();
    const stored = await worker.evaluate(async () => (await chrome.storage.local.get('capture:session'))['capture:session']);
    expect(stored.status).toBe('stopped');
    expect(stored).not.toHaveProperty('screenshot');
    await expect(popup.getByRole('heading', { level: 1 })).toHaveText('Check the issue packet');
    expect((await new AxeBuilder({ page: popup }).analyze()).violations.filter((item) => ['serious', 'critical'].includes(item.impact || ''))).toEqual([]);
    await expect(popup.locator('main')).toContainText('Typed value redacted');
    const serialized = JSON.stringify(stored);
    expect(serialized).not.toContain('TEXTAREA-SECRET-2468');
    expect(serialized).not.toContain('PASSWORD-SECRET-7391');
    expect(serialized).not.toContain('RICH-SECRET-9137');
    expect(serialized).not.toContain('PRIVATE PAGE BODY 48291');
    await expect(popup.locator('main')).not.toContainText('Demo note stays in the separate');
    expect(downloads).toEqual([]);
    await expect(popup.getByRole('button', { name: 'Export Markdown' })).toBeVisible();
    await expect(popup.getByRole('button', { name: 'Export JSON' })).toBeVisible();
    const markdownDownload = popup.waitForEvent('download');
    await popup.getByRole('button', { name: 'Export Markdown' }).click();
    const markdownPath = await (await markdownDownload).path();
    const jsonDownload = popup.waitForEvent('download');
    await popup.getByRole('button', { name: 'Export JSON' }).click();
    const jsonPath = await (await jsonDownload).path();
    expect(markdownPath).not.toBeNull();
    expect(jsonPath).not.toBeNull();
    const exported = `${await readFile(markdownPath as string, 'utf8')}\n${await readFile(jsonPath as string, 'utf8')}`;
    expect(exported).not.toContain('TEXTAREA-SECRET-2468');
    expect(exported).not.toContain('PASSWORD-SECRET-7391');
    expect(exported).not.toContain('RICH-SECRET-9137');
    expect(exported).not.toContain('PRIVATE PAGE BODY 48291');
    expect(downloads).toHaveLength(2);
    expect(exported).toContain('# Accessibility barrier report');
    expect(exported).toContain('"format": "accessible-page-capture/v1"');
    expect(outsideRequests).toEqual([]);
  } finally {
    await context.close();
    await rm(userDataDir, { recursive: true, force: true });
  }
});

test('@claim:offline-capture captures a real extension event and exports it while offline', async () => {
  const userDataDir = await mkdtemp(join(tmpdir(), 'apc-extension-offline-'));
  const extensionPath = resolve('.output/chrome-mv3');
  const context = await chromium.launchPersistentContext(userDataDir, {
    channel: 'chromium', headless: true, acceptDownloads: true,
    args: [`--disable-extensions-except=${extensionPath}`, `--load-extension=${extensionPath}`]
  });
  try {
    let worker = context.serviceWorkers()[0];
    if (!worker) worker = await context.waitForEvent('serviceworker');
    const extensionId = new URL(worker.url()).host;
    const target = await context.newPage();
    await target.goto('http://127.0.0.1:4173/?demo=1');
    await target.evaluate(() => {
      const button = document.createElement('button');
      button.id = 'offline-control'; button.textContent = 'Offline sample control';
      document.body.prepend(button);
    });
    const popup = await context.newPage();
    await popup.goto(`chrome-extension://${extensionId}/popup.html`);
    await context.setOffline(true);
    await popup.getByRole('button', { name: 'Start 30-second capture' }).click();
    await target.getByRole('button', { name: 'Offline sample control' }).click();
    await popup.getByRole('button', { name: 'Stop and preview' }).click();
    const download = popup.waitForEvent('download');
    await popup.getByRole('button', { name: 'Export JSON' }).click();
    const file = await download;
    const content = await readFile(await file.path() as string, 'utf8');
    const packet = JSON.parse(content) as { capture: { events: Array<{ label: string; kind: string }> } };
    expect(packet.capture.events).toEqual(expect.arrayContaining([
      expect.objectContaining({ label: 'Offline sample control', kind: 'click' })
    ]));
    await context.setOffline(false);
  } finally {
    await context.close();
    await rm(userDataDir, { recursive: true, force: true });
  }
});

test('@claim:free-export exports a real extension packet without a payment step', async () => {
  const userDataDir = await mkdtemp(join(tmpdir(), 'apc-extension-free-export-'));
  const extensionPath = resolve('.output/chrome-mv3');
  const context = await chromium.launchPersistentContext(userDataDir, {
    channel: 'chromium', headless: true, acceptDownloads: true,
    args: [`--disable-extensions-except=${extensionPath}`, `--load-extension=${extensionPath}`]
  });
  try {
    const paymentRequests: string[] = [];
    context.on('request', (request) => {
      if (/checkout|payment|billing|api\.sociobot/i.test(request.url())) paymentRequests.push(request.url());
    });
    let worker = context.serviceWorkers()[0];
    if (!worker) worker = await context.waitForEvent('serviceworker');
    const extensionId = new URL(worker.url()).host;
    const target = await context.newPage();
    await target.goto('http://127.0.0.1:4173/?demo=1');
    const popup = await context.newPage();
    await popup.goto(`chrome-extension://${extensionId}/popup.html`);
    await popup.getByRole('button', { name: 'Start 30-second capture' }).click();
    await target.getByRole('button', { name: 'Export JSON' }).focus();
    await popup.getByRole('button', { name: 'Stop and preview' }).click();
    const download = popup.waitForEvent('download');
    await popup.getByRole('button', { name: 'Export JSON' }).click();
    const file = await download;
    expect(file.suggestedFilename()).toMatch(/\.json$/);
    expect(JSON.parse(await readFile(await file.path() as string, 'utf8')).format).toBe('accessible-page-capture/v1');
    expect(paymentRequests).toEqual([]);
  } finally {
    await context.close();
    await rm(userDataDir, { recursive: true, force: true });
  }
});

test('@claim:no-accessibility-score exports recorded steps without an audit score or certification result', async () => {
  const userDataDir = await mkdtemp(join(tmpdir(), 'apc-extension-no-score-'));
  const extensionPath = resolve('.output/chrome-mv3');
  const context = await chromium.launchPersistentContext(userDataDir, {
    channel: 'chromium', headless: true, acceptDownloads: true,
    args: [`--disable-extensions-except=${extensionPath}`, `--load-extension=${extensionPath}`]
  });
  try {
    let worker = context.serviceWorkers()[0];
    if (!worker) worker = await context.waitForEvent('serviceworker');
    const extensionId = new URL(worker.url()).host;
    const target = await context.newPage();
    await target.goto('http://127.0.0.1:4173/?demo=1');
    const popup = await context.newPage();
    await popup.goto(`chrome-extension://${extensionId}/popup.html`);
    await popup.getByRole('button', { name: 'Start 30-second capture' }).click();
    await target.getByRole('button', { name: 'Export Markdown' }).focus();
    await popup.getByRole('button', { name: 'Stop and preview' }).click();
    await expect(popup.locator('main')).not.toContainText(/score|audit|certif/i);
    const download = popup.waitForEvent('download');
    await popup.getByRole('button', { name: 'Export JSON' }).click();
    const packet = JSON.parse(await readFile(await (await download).path() as string, 'utf8')) as Record<string, unknown>;
    expect(Object.keys(packet).sort()).toEqual(['capture', 'format', 'page', 'redactions']);
    expect(JSON.stringify(packet)).not.toMatch(/"(?:score|audit|certification|compliance)"/i);
  } finally {
    await context.close();
    await rm(userDataDir, { recursive: true, force: true });
  }
});

test('@claim:single-page-capture does not continue recording after page navigation', async () => {
  const userDataDir = await mkdtemp(join(tmpdir(), 'apc-extension-navigation-'));
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
    await popup.getByRole('button', { name: 'Start 30-second capture' }).click();
    await target.goto('http://127.0.0.1:4173/privacy');
    await target.evaluate(() => {
      const button = document.createElement('button');
      button.textContent = 'AFTER NAVIGATION';
      document.body.prepend(button);
      button.click();
    });
    await popup.getByRole('button', { name: 'Stop and preview' }).click();
    const stored = await worker.evaluate(async () => (await chrome.storage.local.get('capture:session'))['capture:session']);
    expect(stored.events).toEqual([]);
  } finally {
    await context.close();
    await rm(userDataDir, { recursive: true, force: true });
  }
});

test('popup state changes keep keyboard and screen-reader focus on the current heading', async () => {
  const userDataDir = await mkdtemp(join(tmpdir(), 'apc-extension-focus-'));
  const extensionPath = resolve('.output/chrome-mv3');
  const context = await chromium.launchPersistentContext(userDataDir, {
    channel: 'chromium', headless: true,
    args: [`--disable-extensions-except=${extensionPath}`, `--load-extension=${extensionPath}`]
  });
  try {
    let worker = context.serviceWorkers()[0];
    if (!worker) worker = await context.waitForEvent('serviceworker');
    const extensionId = new URL(worker.url()).host;
    const popup = await context.newPage();
    await popup.goto(`chrome-extension://${extensionId}/popup.html`);
    await popup.getByRole('button', { name: 'Start 30-second capture' }).click();
    await expect(popup.getByRole('heading', { level: 1 })).toHaveText('Record this access barrier');
    await expect(popup.getByRole('heading', { level: 1 })).toBeFocused();
    await expect(popup.getByRole('alert')).toContainText('Open a normal web page');
    expect((await new AxeBuilder({ page: popup }).analyze()).violations.filter((item) => ['serious', 'critical'].includes(item.impact || ''))).toEqual([]);
  } finally {
    await context.close();
    await rm(userDataDir, { recursive: true, force: true });
  }
});
