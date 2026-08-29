import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdtemp, readFile, readdir, rm, stat } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { promisify } from 'node:util';
import { chromium } from 'playwright-core';

const run = promisify(execFile);
const packageDir = await mkdtemp(join(tmpdir(), 'apc-package-'));
const profileDir = await mkdtemp(join(tmpdir(), 'apc-profile-'));
const siteArchive = process.env.APC_PACKAGE_PATH
  || join(process.cwd(), 'dist', 'site', 'downloads', 'accessible-page-capture-chrome.zip');

try {
  const builtArchives = (await readdir(join(process.cwd(), '.output'))).filter((name) => name.endsWith('-chrome.zip'));
  const builtArchive = (await Promise.all(builtArchives.map(async (name) => ({
    name,
    time: (await stat(join(process.cwd(), '.output', name))).mtimeMs
  })))).sort((a, b) => b.time - a.time)[0]?.name;
  assert.ok(builtArchive, 'WXT package was not found');
  const digest = async (path) => createHash('sha256').update(await readFile(path)).digest('hex');
  assert.equal(await digest(siteArchive), await digest(join(process.cwd(), '.output', builtArchive)), 'site download differs from the WXT package');
  await run('unzip', ['-q', siteArchive, '-d', packageDir]);
  const manifest = JSON.parse(await readFile(join(packageDir, 'manifest.json'), 'utf8'));
  const packageManifest = JSON.parse(await readFile(join(process.cwd(), 'package.json'), 'utf8'));
  assert.equal(manifest.manifest_version, 3);
  assert.equal(manifest.name, 'Accessible Page Capture');
  assert.equal(manifest.version, packageManifest.version);
  const context = await chromium.launchPersistentContext(profileDir, {
    channel: 'chromium', headless: true,
    args: [`--disable-extensions-except=${packageDir}`, `--load-extension=${packageDir}`]
  });
  try {
    let worker = context.serviceWorkers()[0];
    if (!worker) worker = await context.waitForEvent('serviceworker');
    const page = await context.newPage();
    await page.goto(`chrome-extension://${new URL(worker.url()).host}/popup.html`);
    assert.equal(await page.locator('h1').textContent(), 'Record this access barrier');
  } finally {
    await context.close();
  }
  console.log('Packaged extension: SHA-256 match, MV3 manifest, and clean Chromium load PASS');
} finally {
  await rm(packageDir, { recursive: true, force: true });
  await rm(profileDir, { recursive: true, force: true });
}
