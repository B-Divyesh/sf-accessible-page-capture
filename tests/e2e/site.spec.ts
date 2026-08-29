import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { readFile } from 'node:fs/promises';

async function downloadedText(page: import('@playwright/test').Page, buttonName: string): Promise<string> {
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: buttonName }).click();
  const path = await (await download).path();
  expect(path).not.toBeNull();
  return readFile(path as string, 'utf8');
}

test('landing routes and mobile layout are accessible', async ({ page }) => {
  for (const route of ['/', '/?demo=1', '/demo', '/privacy', '/terms', '/missing']) {
    await page.goto(route);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.locator('main')).toHaveCount(1);
    await expect(page.locator('h1')).toHaveCount(1);
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations.filter((item) => ['serious', 'critical'].includes(item.impact || ''))).toEqual([]);
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Record a blocked web task');
  const actionCopy = page.locator('.hero-action');
  expect((await actionCopy.boundingBox())?.y ?? Number.POSITIVE_INFINITY).toBeLessThan(844);
  expect((await actionCopy.boundingBox())?.y! + (await actionCopy.boundingBox())?.height!).toBeLessThanOrEqual(844);
  expect((await actionCopy.boundingBox())?.y! + (await actionCopy.boundingBox())?.height!)
    .toBeLessThanOrEqual((await page.locator('.hero-art').boundingBox())?.y ?? 0);
  const visibleWordmark = await page.locator('.wordmark span').nth(1).evaluate((element) => ({
    text: (element as HTMLElement).innerText,
    breakDisplay: getComputedStyle(element.querySelector('br')!).display
  }));
  expect(visibleWordmark.text).toMatch(/^Accessible\s+Page Capture$/i);
  expect(visibleWordmark.breakDisplay).not.toBe('none');
  await expect(page.locator('footer')).not.toContainText('Hero art generated for this product.');
  if (!process.env.APC_BASE_URL) {
    await page.addStyleTag({ content: ':root{font-size:32px!important}' });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
  }
  await page.reload();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to main content' })).toBeFocused();
});

test('route metadata, history focus, announcements, legal links, and errors are production-ready', async ({ page, request }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  const routes = [
    { path: '/', title: 'Accessible Page Capture — Report web access barriers', canonical: '/' },
    { path: '/?demo=1', title: 'Demo — Accessible Page Capture', canonical: '/demo' },
    { path: '/demo', title: 'Demo — Accessible Page Capture', canonical: '/demo' },
    { path: '/privacy', title: 'Privacy — Accessible Page Capture', canonical: '/privacy' },
    { path: '/terms', title: 'Terms — Accessible Page Capture', canonical: '/terms' }
  ];
  for (const route of routes) {
    await page.goto(route.path);
    await expect(page).toHaveTitle(route.title);
    expect(route.title.length).toBeLessThanOrEqual(60);
    const description = await page.locator('meta[name="description"]').getAttribute('content');
    expect(description?.length).toBeGreaterThan(0);
    expect(description?.length).toBeLessThanOrEqual(155);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://accessible-page-capture.sociobot.in${route.canonical}`);
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', route.title);
    await expect(page.locator('meta[property="og:description"]')).toHaveAttribute('content', description!);
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content', `https://accessible-page-capture.sociobot.in${route.canonical}`);
    await expect(page.locator('meta[name="twitter:title"]')).toHaveAttribute('content', route.title);
    await expect(page.locator('meta[name="twitter:description"]')).toHaveAttribute('content', description!);
    await expect(page.locator('footer').getByRole('link', { name: 'Privacy' })).toHaveAttribute('href', '/privacy');
    await expect(page.locator('footer').getByRole('link', { name: 'Terms' })).toHaveAttribute('href', '/terms');
  }

  await page.goto('/');
  await page.getByRole('link', { name: 'Privacy' }).first().click();
  await expect(page).toHaveURL(/\/privacy$/);
  await expect(page.getByRole('heading', { level: 1 })).toBeFocused();
  await expect(page.locator('#route-status')).toHaveText('Your capture stays under your control');
  await page.goBack();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole('heading', { level: 1 })).toBeFocused();
  await expect(page.locator('#route-status')).toHaveText('Record a blocked web task as an issue packet');

  for (const path of ['/privacy', '/terms', '/demo', '/downloads/accessible-page-capture-chrome.zip', '/robots.txt', '/sitemap.xml']) {
    expect((await request.get(path)).status(), path).toBe(200);
  }
  expect(errors).toEqual([]);
});

test('production routes, download, and touch targets meet the release response policy', async ({ page, request }) => {
  const config = JSON.parse(await readFile('site/public/staticwebapp.config.json', 'utf8'));
  expect(config.responseOverrides['404']).toEqual({ rewrite: '/404.html' });
  expect(config.globalHeaders['Content-Security-Policy']).toContain("default-src 'self'");
  const missing = await request.get('/missing');
  expect(missing.status()).toBe(404);
  const archive = await request.get('/downloads/accessible-page-capture-chrome.zip');
  expect(archive.status()).toBe(200);
  expect((await archive.body()).subarray(0, 2).toString()).toBe('PK');
  await page.setViewportSize({ width: 390, height: 844 });
  for (const route of ['/', '/demo', '/privacy', '/terms']) {
    await page.goto(route);
    const undersized = await page.locator('a, button, input, textarea, summary').evaluateAll((elements) => elements
      .filter((element) => {
        const style = getComputedStyle(element);
        const rect = element.getBoundingClientRect();
        return style.display !== 'none' && style.visibility !== 'hidden' && (rect.width < 44 || rect.height < 44);
      })
      .map((element) => ({ text: element.textContent?.trim(), tag: element.tagName, rect: element.getBoundingClientRect().toJSON() })));
    expect(undersized).toEqual([]);
  }
  await page.goto('/');
  await expect(page.getByRole('link', { name: /Buy team handoff/i })).toHaveCount(0);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.reload();
  await expect(page.locator('.hero-art')).toHaveCSS('transform', 'none');
});

test('the demo exports usable Markdown and JSON', async ({ page }) => {
  await page.goto('/demo');
  const markdown = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export Markdown' }).click();
  const markdownFile = await markdown;
  expect(markdownFile.suggestedFilename()).toBe('sample-access-barrier.md');
  const markdownBody = await (await import('node:fs/promises')).readFile(await markdownFile.path() as string, 'utf8');
  expect(markdownBody).toContain('# Access barrier issue packet');
  expect(markdownBody).toContain('Typed value redacted');
  const json = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export JSON' }).click();
  const jsonFile = await json;
  expect(JSON.parse(await (await import('node:fs/promises')).readFile(await jsonFile.path() as string, 'utf8')).format).toBe('accessible-page-capture/v1');
});

test('@claim:page-context exports the captured page address and title', async ({ page }) => {
  await page.goto('/demo');
  const markdown = await downloadedText(page, 'Export Markdown');
  const json = JSON.parse(await downloadedText(page, 'Export JSON'));
  expect(markdown).toContain('- Page: https://work.example.test/travel/new');
  expect(markdown).toContain('- Page title: Travel requests — Northstar People');
  expect(json.page).toEqual({
    url: 'https://work.example.test/travel/new',
    title: 'Travel requests — Northstar People'
  });
});

test('@claim:ordered-labelled-events exports ordered focus, click, and control-key events with labels and roles', async ({ page }) => {
  await page.goto('/demo');
  const packet = JSON.parse(await downloadedText(page, 'Export JSON'));
  const events = packet.capture.events as Array<{ at: string; kind: string; label: string; role: string; detail?: string }>;
  expect(events.map((event) => event.kind)).toEqual(['focus', 'focus', 'key', 'key', 'redacted-input', 'click']);
  expect(events.map((event) => Number.parseFloat(event.at.slice(1)))).toEqual([0.8, 3.1, 4, 7.3, 11.2, 18.4]);
  expect(events.every((event) => event.label.length > 0 && event.role.length > 0)).toBe(true);
  expect(events.filter((event) => event.kind === 'key').map((event) => event.detail)).toEqual(['Enter', 'ArrowRight']);
});

test('@claim:user-note exports the exact user-written note', async ({ page }) => {
  const note = 'I need the return-date control to announce the selected Friday.';
  await page.goto('/demo');
  await page.locator('#demo-note').fill(note);
  const markdown = await downloadedText(page, 'Export Markdown');
  const packet = JSON.parse(await downloadedText(page, 'Export JSON'));
  expect(markdown).toContain(`## What I was trying to do\n\n${note}`);
  expect(packet.capture.note).toBe(note);
});

test('@claim:demo-offline-export reloads and exports the sample offline after one visit', async ({ page, context }) => {
  await page.goto('/?demo=1');
  await page.evaluate(async () => { await navigator.serviceWorker.ready; });
  await page.reload();
  expect(await page.evaluate(async () => (await caches.keys()).includes('apc-site-v3'))).toBe(true);
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Check a captured access barrier');
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export Markdown' }).click();
  await download;
  await context.setOffline(false);
});

test('@claim:demo-private @claim:no-runtime-third-party keeps the sample in its demo namespace and makes no outside request', async ({ page }) => {
  const outside: string[] = [];
  const expectedOrigin = new URL(process.env.APC_BASE_URL || 'http://127.0.0.1:4173').origin;
  page.on('request', (request) => { if (new URL(request.url()).origin !== expectedOrigin) outside.push(request.url()); });
  await page.goto('/?demo=1');
  await expect(page.getByRole('status')).toContainText('Demo — sample data, nothing is saved');
  await expect(page.getByRole('link', { name: 'Download Chrome extension' })).toHaveAttribute('download', '');
  await page.locator('#demo-note').fill('A changed sample note');
  expect(await page.evaluate(() => Object.keys(localStorage))).toEqual(['demo:accessible-page-capture:note']);
  await downloadedText(page, 'Export Markdown');
  await downloadedText(page, 'Export JSON');
  await page.getByRole('button', { name: 'Reset demo' }).click();
  expect(await page.evaluate(() => localStorage.getItem('demo:accessible-page-capture:note'))).toBeNull();
  await expect(page.getByRole('button', { name: 'Reset demo' })).toBeFocused();
  await expect(page.locator('#export-status')).toHaveText('Demo reset. The shipped sample is restored.');
  await expect(page.locator('#demo-note')).toHaveValue(/choose a return date/i);
  expect(outside).toEqual([]);
});
