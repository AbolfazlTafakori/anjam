/* Builds the browser/PWA version of Anjam into ./web (served by the sync server). */
const fs = require('fs'); const path = require('path');
const root = path.join(__dirname, '..'); const src = path.join(root, 'src'); const out = path.join(root, 'web');
fs.rmSync(out, { recursive: true, force: true }); fs.mkdirSync(path.join(out, 'fonts'), { recursive: true });
for (const f of ['styles.css', 'app.js', 'jalali.js', 'web-bridge.js', 'admin.html']) fs.copyFileSync(path.join(src, f), path.join(out, f));
fs.copyFileSync(path.join(src, 'fonts', 'Vazirmatn.woff2'), path.join(out, 'fonts', 'Vazirmatn.woff2'));
fs.copyFileSync(path.join(root, 'build', 'icon.png'), path.join(out, 'icon.png'));
let html = fs.readFileSync(path.join(src, 'index.html'), 'utf8');
html = html.replace(/<meta http-equiv="Content-Security-Policy"[^>]*>\s*/, '')
  .replace('<link rel="stylesheet" href="styles.css" />', '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />\n  <meta name="theme-color" content="#160a0d" />\n  <link rel="manifest" href="manifest.webmanifest" />\n  <link rel="icon" href="icon.png" />\n  <link rel="apple-touch-icon" href="icon.png" />\n  <link rel="stylesheet" href="styles.css" />')
  .replace('<script src="jalali.js"></script>', '<script src="jalali.js"></script>\n<script src="web-bridge.js"></script>');
fs.writeFileSync(path.join(out, 'index.html'), html);
fs.writeFileSync(path.join(out, 'manifest.webmanifest'), JSON.stringify({ name: 'Anjam · انجام', short_name: 'Anjam', start_url: './', scope: './', display: 'standalone', background_color: '#160a0d', theme_color: '#160a0d', dir: 'rtl', lang: 'fa', icons: [{ src: 'icon.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' }] }, null, 2));
const ver = Date.now().toString(36);
fs.writeFileSync(path.join(out, 'sw.js'), `/* Anjam PWA — offline shell (v${ver}) */
const CACHE = 'anjam-${ver}';
const ASSETS = ['./', './index.html', './styles.css', './app.js', './jalali.js', './web-bridge.js', './fonts/Vazirmatn.woff2', './icon.png', './manifest.webmanifest'];
self.addEventListener('install', (e) => { e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting())); });
self.addEventListener('activate', (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())); });
// Network first (so updates land immediately), cache as the offline fallback.
self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.pathname.startsWith('/api/')) return;
  e.respondWith(fetch(e.request).then((r) => { if (r.ok) { const copy = r.clone(); caches.open(CACHE).then((c) => c.put(e.request, copy)); } return r; })
    .catch(() => caches.match(e.request, { ignoreSearch: true }).then((hit) => hit || caches.match('./index.html'))));
});
`);
console.log('web build written to', out);
