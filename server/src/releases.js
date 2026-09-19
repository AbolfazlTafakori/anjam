'use strict';
/* Installers are built by CI and published on GitHub Releases. This module:
   - fetches and caches the latest release description (10 min),
   - mirrors each asset onto this server's disk so users download directly from here
     (one hop, own domain, works where GitHub is slow or blocked), keeping only the latest version,
   - exposes /dl/<platform> URLs that the download page, the panel and the in-app updaters use. */
const https = require('https');
const fs = require('fs');
const path = require('path');
const config = require('./config');

const TTL = 10 * 60e3;
const DIR = path.join(config.dataDir, 'releases');
fs.mkdirSync(DIR, { recursive: true });
let cache = { at: 0, data: null, error: null };
const inflight = new Map(); // asset name → Promise (single download per file)

const PLATFORMS = [
  { id: 'android', test: (n) => /\.apk$/i.test(n), label: 'Android', arch: 'universal', kind: 'apk', type: 'application/vnd.android.package-archive' },
  { id: 'windows', test: (n) => /\.exe$/i.test(n) && !/blockmap/i.test(n), label: 'Windows', arch: 'x64', kind: 'installer', type: 'application/octet-stream' },
  { id: 'linux-appimage', test: (n) => /\.AppImage$/i.test(n), label: 'Linux', arch: 'x64', kind: 'AppImage', type: 'application/octet-stream' },
  { id: 'linux-deb', test: (n) => /\.deb$/i.test(n), label: 'Linux (Debian/Ubuntu)', arch: 'x64', kind: 'deb', type: 'application/vnd.debian.binary-package' },
];

function get(url, onResponse) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { headers: { 'User-Agent': 'anjam-server', Accept: '*/*' } }, (res) => {
      if ([301, 302, 303, 307, 308].includes(res.statusCode) && res.headers.location) { res.resume(); return get(res.headers.location, onResponse).then(resolve, reject); }
      if (res.statusCode !== 200) { res.resume(); return reject(new Error(`http ${res.statusCode} for ${url}`)); }
      onResponse(res, resolve, reject);
    });
    req.on('error', reject);
  });
}
const fetchJson = (url) => get(url, (res, resolve, reject) => { let b = ''; res.on('data', (d) => { b += d; }); res.on('end', () => { try { resolve(JSON.parse(b)); } catch (e) { reject(e); } }); });
const fetchToFile = (url, file) => get(url, (res, resolve, reject) => {
  const tmp = file + '.part'; const out = fs.createWriteStream(tmp);
  res.pipe(out); out.on('finish', () => { fs.renameSync(tmp, file); resolve(file); }); out.on('error', reject); res.on('error', reject);
});

function mapRelease(rel) {
  const assets = (rel.assets || []).map((a) => ({ name: a.name, size: a.size, github: a.browser_download_url, downloads: a.download_count }));
  const files = PLATFORMS.map((p) => { const a = assets.find((x) => p.test(x.name)); return a ? { platform: p.id, label: p.label, arch: p.arch, kind: p.kind, type: p.type, url: `${config.publicUrl}/dl/${p.id}`, ...a } : null; }).filter(Boolean);
  return { version: String(rel.tag_name || '').replace(/^v/, ''), name: rel.name, publishedAt: rel.published_at, notes: rel.body || '', page: rel.html_url, files };
}

async function latest() {
  const age = Date.now() - cache.at;
  if (cache.data ? age < TTL : age < 60e3) return cache.data;
  try {
    const rel = await fetchJson(`https://api.github.com/repos/${config.releasesRepo}/releases/latest`);
    cache = { at: Date.now(), data: mapRelease(rel), error: null };
    setImmediate(() => mirrorAll().catch((e) => console.error('mirror:', e.message)));
  } catch (e) {
    cache = { at: Date.now(), data: cache.data, error: e.message };
  }
  return cache.data;
}

/** Local path of an asset, downloading it from GitHub once. */
async function localFile(file) {
  const dest = path.join(DIR, file.name);
  if (fs.existsSync(dest) && fs.statSync(dest).size === file.size) return dest;
  if (!inflight.has(file.name)) inflight.set(file.name, fetchToFile(file.github, dest).finally(() => inflight.delete(file.name)));
  return inflight.get(file.name);
}
async function mirrorAll() {
  const rel = cache.data; if (!rel) return;
  for (const f of rel.files) await localFile(f);
  const keep = new Set(rel.files.map((f) => f.name)); // drop older versions
  for (const n of fs.readdirSync(DIR)) if (!keep.has(n) && !n.endsWith('.part')) fs.unlink(path.join(DIR, n), () => {});
}
const mirrored = () => Object.fromEntries((cache.data ? cache.data.files : []).map((f) => [f.platform, fs.existsSync(path.join(DIR, f.name))]));
const status = () => ({ cachedAt: cache.at, error: cache.error, repo: config.releasesRepo, mirrored: mirrored(), dir: DIR });

/** Express handler for /dl/:platform — direct download from this server; redirects to GitHub only while the mirror is still filling. */
async function serve(req, res) {
  const rel = await latest();
  const f = rel && rel.files.find((x) => x.platform === req.params.platform);
  if (!f) return res.status(404).type('text').send('No build for this platform yet');
  const dest = path.join(DIR, f.name);
  if (!(fs.existsSync(dest) && fs.statSync(dest).size === f.size)) { localFile(f).catch(() => {}); return res.redirect(302, f.github); }
  res.setHeader('Content-Type', f.type);
  res.setHeader('Cache-Control', 'public, max-age=3600');
  res.download(dest, f.name);
}

module.exports = { latest, status, serve };
