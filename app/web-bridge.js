/* window.anjam for the browser / PWA build (replaces the Electron preload bridge). */
(() => {
  const KEY = 'anjam-data';
  const download = (name, blob) => { const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 2000); };
  window.anjam = {
    defaultServer: location.origin,
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
    notify: async ({ title, body }) => {
      if (!('Notification' in window)) return false;
      if (Notification.permission === 'default') await Notification.requestPermission();
      if (Notification.permission !== 'granted') return false;
      new Notification(title, { body, icon: 'icon.png' }); return true;
    },
    onOpenTask: () => {},
    version: async () => (document.querySelector('meta[name="anjam-version"]') || {}).content || 'web',
  };
  if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(() => {});
})();
