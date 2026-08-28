import { copyFile, mkdir, readdir, stat } from 'node:fs/promises';
import { join } from 'node:path';

const out = join(process.cwd(), 'dist', 'site', 'downloads');
await mkdir(out, { recursive: true });
const zipDir = join(process.cwd(), '.output');
const candidates = (await readdir(zipDir)).filter((name) => name.endsWith('.zip'));
if (candidates.length === 0) throw new Error('WXT did not produce an extension zip');
const latest = (await Promise.all(candidates.map(async (name) => ({ name, time: (await stat(join(zipDir, name))).mtimeMs }))))
  .sort((a, b) => b.time - a.time)[0];
if (!latest) throw new Error('Could not locate extension zip');
await copyFile(join(zipDir, latest.name), join(out, 'accessible-page-capture-chrome.zip'));
