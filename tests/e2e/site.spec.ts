import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('landing routes and mobile layout are accessible', async ({ page }) => {
  for (const route of ['/', '/demo', '/privacy', '/terms', '/missing']) {
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
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Record an access barrier');
});

test('@claim:markdown-json exports usable Markdown and JSON', async ({ page }) => {
  await page.goto('/demo');
  const markdown = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export Markdown' }).click();
  const markdownFile = await markdown;
  expect(markdownFile.suggestedFilename()).toBe('sample-access-barrier.md');
  const markdownBody = await (await import('node:fs/promises')).readFile(await markdownFile.path() as string, 'utf8');
  expect(markdownBody).toContain('# Accessibility barrier report');
  expect(markdownBody).toContain('Typed value redacted');
  const json = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export JSON' }).click();
  const jsonFile = await json;
  expect(JSON.parse(await (await import('node:fs/promises')).readFile(await jsonFile.path() as string, 'utf8')).format).toBe('accessible-page-capture/v1');
});

test('@claim:free-export exports sample files without a license', async ({ page }) => {
  await page.goto('/demo');
  expect(await page.evaluate(() => localStorage.getItem('sb_license:accessible-page-capture'))).toBeNull();
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export JSON' }).click();
  await download;
  await expect(page.locator('#export-status')).toContainText('JSON exported');
});

test('@claim:offline-capture reloads and exports offline after one visit', async ({ page, context }) => {
  await page.goto('/demo');
  await page.evaluate(async () => { await navigator.serviceWorker.ready; });
  await page.reload();
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
  page.on('request', (request) => { if (new URL(request.url()).origin !== 'http://127.0.0.1:4173') outside.push(request.url()); });
  await page.goto('/demo');
  await page.locator('#demo-note').fill('A changed sample note');
  expect(await page.evaluate(() => Object.keys(localStorage))).toEqual(['demo:accessible-page-capture:note']);
  expect(outside).toEqual([]);
});

test('@claim:license-verify stores a returned license and verifies it with Sociobot', async ({ page }) => {
  await page.route('https://api.sociobot.in/api/v1/products/accessible-page-capture/verify?license=paid-test-token', (route) => route.fulfill({ json: { valid: true, reason: 'ok', expires_at: null } }));
  await page.goto('/?license=paid-test-token');
  await expect.poll(() => page.evaluate(() => localStorage.getItem('sb_license:accessible-page-capture'))).toBe('paid-test-token');
  await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('sb_license_verdict:accessible-page-capture') || 'null')?.valid)).toBe(true);
  expect(new URL(page.url()).search).toBe('');
  await expect(page.getByRole('link', { name: 'Buy team handoff' })).toHaveAttribute('href', 'https://api.sociobot.in/api/v1/products/accessible-page-capture/checkout');
});
