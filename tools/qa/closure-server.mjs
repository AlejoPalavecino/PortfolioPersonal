// Test transport only: serve a built portfolio and control a critical resource.
import http from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const base = path.resolve(process.argv[2] || 'dist');
const port = Number(process.argv[3] || 4195);
if (!Number.isInteger(port) || port < 1024 || port > 65535) throw new Error('Invalid local port');
await readFile(path.join(base, 'index.html'));
let mode = 'release';
const waiting = new Set();
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css',
  '.json': 'application/json', '.webp': 'image/webp', '.pdf': 'application/pdf', '.woff2': 'font/woff2', '.mp3': 'audio/mpeg' };

const server = http.createServer(async (request, response) => {
  try {
    const url = new URL(request.url, 'http://127.0.0.1');
    response.setHeader('Cache-Control', 'no-store');
    if (url.pathname === '/_qa') {
      const next = url.searchParams.get('mode');
      if (next && !['hold', 'release', 'fail'].includes(next)) { response.writeHead(400).end(); return; }
      if (next) mode = next;
      if (mode !== 'hold') for (const resolve of [...waiting]) resolve();
      response.setHeader('Content-Type', 'application/json');
      response.end(JSON.stringify({ mode, waiting: waiting.size }));
      return;
    }
    if (!url.pathname.startsWith('/PortfolioPersonal/')) { response.writeHead(404).end(); return; }
    const name = decodeURIComponent(url.pathname.slice('/PortfolioPersonal/'.length)) || 'index.html';
    const file = path.resolve(base, name);
    if (!file.startsWith(base + path.sep)) { response.writeHead(403).end(); return; }
    if (name === 'assets/avatar/frames.json') {
      if (mode === 'hold') await new Promise(resolve => {
        const release = () => { waiting.delete(release); resolve(); };
        waiting.add(release);
        request.once('aborted', release);
      });
      if (response.destroyed) return;
      if (mode === 'fail') { response.writeHead(503).end('Deliberate QA failure'); return; }
    }
    const data = await readFile(file);
    response.setHeader('Content-Type', types[path.extname(file)] || 'application/octet-stream');
    response.end(data);
  } catch {
    if (!response.destroyed) response.writeHead(404).end();
  }
});
server.listen(port, '127.0.0.1', () => {
  process.stdout.write(`Local QA only: http://127.0.0.1:${port}/PortfolioPersonal/\n`);
});
