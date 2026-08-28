import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';

const root = join(process.cwd(), 'dist', 'site');
const port = Number(process.env.APC_TEST_PORT || 4173);
const routeShells = new Set(['/', '/demo', '/privacy', '/terms']);
const types = new Map([
  ['.css', 'text/css; charset=utf-8'], ['.html', 'text/html; charset=utf-8'],
  ['.js', 'text/javascript; charset=utf-8'], ['.json', 'application/json; charset=utf-8'],
  ['.png', 'image/png'], ['.svg', 'image/svg+xml'], ['.webp', 'image/webp'],
  ['.xml', 'application/xml; charset=utf-8'], ['.txt', 'text/plain; charset=utf-8'],
  ['.webmanifest', 'application/manifest+json'], ['.zip', 'application/zip']
]);

createServer(async (request, response) => {
  const path = decodeURIComponent(new URL(request.url || '/', 'http://127.0.0.1').pathname).replace(/\/$/, '') || '/';
  const relative = routeShells.has(path) ? 'index.html' : normalize(path).replace(/^(\.\.(\/|\\|$))+/, '').replace(/^[/\\]+/, '');
  let status = 200;
  let file = join(root, relative);
  try {
    const body = await readFile(file);
    response.writeHead(status, { 'content-type': types.get(extname(file)) || 'application/octet-stream' });
    response.end(request.method === 'HEAD' ? undefined : body);
  } catch {
    status = 404;
    file = join(root, '404.html');
    const body = await readFile(file);
    response.writeHead(status, { 'content-type': 'text/html; charset=utf-8' });
    response.end(request.method === 'HEAD' ? undefined : body);
  }
}).listen(port, '127.0.0.1');
