'use strict';
/* Installers come from GitHub Releases (built by CI). This module fetches the latest release,
   caches it, and maps assets to platforms so the download page and the panel can list them. */
const https = require('https');
const config = require('./config');

const TTL = 10 * 60e3;
let cache = { at: 0, data: null, error: null };

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'anjam-server', Accept: 'application/vnd.github+json' } }, (res) => {
      let body = '';
      res.on('data', (d) => { body += d; });
      res.on('end', () => { if (res.statusCode !== 200) return reject(new Error(`github ${res.statusCode}`)); try { resolve(JSON.parse(body)); } catch (e) { reject(e); } });
    }).on('error', reject);
  });
}

const PLATFORMS = [
  { id: 'android', test: (n) => /\.apk$/i.test(n), label: 'Android', arch: 'arm64+x86', kind: 'apk' },
  { id: 'windows', test: (n) => /\.exe$/i.test(n) && !/blockmap/i.test(n), label: 'Windows', arch: 'x64', kind: 'installer' },
  { id: 'linux-appimage', test: (n) => /\.AppImage$/i.test(n), label: 'Linux', arch: 'x64', kind: 'AppImage' },
  { id: 'linux-deb', test: (n) => /\.deb$/i.test(n), label: 'Linux (Debian/Ubuntu)', arch: 'x64', kind: 'deb' },
  { id: 'macos', test: (n) => /\.dmg$/i.test(n), label: 'macOS', arch: 'universal', kind: 'dmg' },
];

function mapRelease(rel) {
  const assets = (rel.assets || []).map((a) => ({ name: a.name, size: a.size, url: a.browser_download_url, downloads: a.download_count }));
  const files = PLATFORMS.map((p) => { const a = assets.find((x) => p.test(x.name)); return a ? { platform: p.id, label: p.label, arch: p.arch, kind: p.kind, ...a } : null; }).filter(Boolean);
  return { version: String(rel.tag_name || '').replace(/^v/, ''), name: rel.name, publishedAt: rel.published_at, notes: rel.body || '', page: rel.html_url, files };
}

async function latest() {
  const age = Date.now() - cache.at;
  if (cache.data ? age < TTL : age < 60e3) return cache.data; // successes cached 10 min, failures retried after 1 min
  try {
    const rel = await fetchJson(`https://api.github.com/repos/${config.releasesRepo}/releases/latest`);
    cache = { at: Date.now(), data: mapRelease(rel), error: null };
  } catch (e) {
    cache = { at: Date.now(), data: cache.data, error: e.message }; // keep serving the last good copy
  }
  return cache.data;
}
const status = () => ({ cachedAt: cache.at, error: cache.error, repo: config.releasesRepo });

module.exports = { latest, status };
