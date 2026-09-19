/* window.anjam for the browser / PWA build and for the Android (Capacitor) shell.
   Same renderer as the desktop; only this bridge differs. */
(() => {
  const KEY = 'anjam-data';
  const cap = window.Capacitor;
  const native = !!(cap && cap.isNativePlatform && cap.isNativePlatform());
  const plugin = (name) => (cap && cap.Plugins && cap.Plugins[name]) || null;
  const version = (document.querySelector('meta[name="anjam-version"]') || {}).content || 'web';

  const download = (name, blob) => { const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 2000); };
  const openUrl = (url) => { const b = plugin('Browser'); if (b) b.open({ url }); else window.open(url, '_blank'); };

  // ---- notifications: native local notifications on Android, Web Notifications elsewhere ----
  async function notify({ title, body, id }) {
    const ln = plugin('LocalNotifications');
    if (ln) {
      try {
        const perm = await ln.checkPermissions();
        if (perm.display !== 'granted' && (await ln.requestPermissions()).display !== 'granted') return false;
        await ln.schedule({ notifications: [{ id: Math.abs(hash(id || title)) % 2147483647, title, body, smallIcon: 'ic_stat_anjam' }] });
        return true;
      } catch { return false; }
    }
    if (!('Notification' in window)) return false;
    if (Notification.permission === 'default') await Notification.requestPermission();
    if (Notification.permission !== 'granted') return false;
    new Notification(title, { body, icon: 'icon.png' }); return true;
  }
  const hash = (s) => { let h = 0; for (const c of String(s)) h = (h * 31 + c.charCodeAt(0)) | 0; return h; };

  // ---- updates (Android): compare the server's latest APK with this build ----
  let updStatus = { state: 'idle', version: '', percent: 0, message: '' };
  let updUrl = '';
  const listeners = [];
  const emit = (s) => { updStatus = { ...updStatus, ...s }; listeners.forEach((cb) => cb(updStatus)); };
  const newer = (a, b) => { const x = a.split('.').map(Number), y = b.split('.').map(Number); for (let i = 0; i < 3; i++) { if ((x[i] || 0) > (y[i] || 0)) return true; if ((x[i] || 0) < (y[i] || 0)) return false; } return false; };
  async function checkUpdate() {
    let server = '';
    try { server = (JSON.parse(localStorage.getItem(KEY) || '{}').sync || {}).server || ''; } catch {}
    if (!server) { emit({ state: 'idle' }); return updStatus; }
    emit({ state: 'checking' });
    try {
      const r = await fetch(server.replace(/\/+$/, '') + '/api/releases'); const j = await r.json();
      const apk = j.release && j.release.files.find((f) => f.platform === 'android');
      if (apk && newer(j.release.version, version)) { updUrl = apk.url; emit({ state: 'ready', version: j.release.version, percent: 100 }); }
      else emit({ state: 'uptodate', version });
    } catch (e) { emit({ state: 'error', message: 'offline' }); }
    return updStatus;
  }
  const update = native ? {
    status: async () => updStatus,
    check: checkUpdate,
    install: async () => { if (updUrl) openUrl(updUrl); },
    onStatus: (cb) => listeners.push(cb),
  } : undefined;

  window.anjam = {
    defaultServer: native ? '' : location.origin,
    // Android: the download server stamps its address into the APK's signing block; ServerConfigPlugin reads it.
    getDefaultServer: async () => { if (!native) return location.origin; const p = plugin('ServerConfig'); if (!p) return ''; try { const r = await p.get(); return (r && r.server) || ''; } catch { return ''; } },
    isNative: native,
    load: async () => { try { return JSON.parse(localStorage.getItem(KEY) || 'null'); } catch { return null; } },
    save: async (d) => { try { localStorage.setItem(KEY, JSON.stringify(d)); return true; } catch { return false; } },
    exportFile: async ({ defaultName, content }) => { download(defaultName, new Blob([defaultName.endsWith('.csv') ? '﻿' + content : content], { type: 'text/plain;charset=utf-8' })); return { ok: true, filePath: defaultName }; },
    exportPdf: async ({ html }) => {
      const w = window.open('', '_blank'); if (!w) return { ok: false };
      w.document.open(); w.document.write(html.replace('</head>', '<style>@font-face{font-family:Vazirmatn;src:url(' + new URL('fonts/Vazirmatn.woff2', location.href) + ') format("woff2-variations");font-weight:100 900}</style></head>')); w.document.close();
      setTimeout(() => { w.focus(); w.print(); }, 400);
      return { ok: false };
    },
    importFile: () => new Promise((resolve) => {
      const i = document.createElement('input'); i.type = 'file'; i.accept = '.json,application/json';
      i.onchange = () => { const f = i.files[0]; if (!f) return resolve({ ok: false }); const r = new FileReader(); r.onload = () => { try { resolve({ ok: true, data: JSON.parse(r.result) }); } catch (e) { resolve({ ok: false, error: String(e) }); } }; r.readAsText(f); };
      i.click();
    }),
    notify,
    openExternal: (u) => openUrl(u),
    onOpenTask: () => {},
    version: async () => version,
    update,
  };
  if (native) setTimeout(checkUpdate, 6000);
  if (!native && 'serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(() => {});
})();
