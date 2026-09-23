'use strict';
/* In-app updates from Anjam's own server (electron-updater, "generic" feed) — the server mirrors
   GitHub releases so the app never talks to GitHub directly. The renderer only sees a small state object:
   { state: idle|checking|available|downloading|ready|error|uptodate, version, percent, message }
   and can ask to check or to install. Nothing is installed without the user clicking "restart". */
const { ipcMain, app } = require('electron');
const fs = require('fs');
const path = require('path');

let getWin = () => null;
let status = { state: 'idle', version: '', percent: 0, message: '' };
let autoUpdater = null;

function emit(next) {
  status = { ...status, ...next };
  const win = getWin();
  if (win && !win.isDestroyed()) win.webContents.send('update:status', status);
}

// Same server this install came from (see main.js's app:defaultServer) — each self-hosted
// Anjam server mirrors GitHub releases, so the app updates from it instead of talking to GitHub.
function resolveServer() {
  try {
    const j = JSON.parse(fs.readFileSync(path.join(app.getPath('userData'), 'server.json'), 'utf8'));
    if (j && j.server) return j.server;
  } catch {}
  return '';
}

function start(winGetter) {
  getWin = winGetter;
  ipcMain.handle('update:status', () => status);
  ipcMain.handle('update:check', () => check(true));
  ipcMain.handle('update:install', () => { if (autoUpdater && status.state === 'ready') setImmediate(() => autoUpdater.quitAndInstall(false, true)); });
  if (!app.isPackaged) { emit({ state: 'uptodate', message: 'dev' }); return; }
  const server = resolveServer();
  if (!server) { emit({ state: 'uptodate', message: 'no server' }); return; }
  try {
    ({ autoUpdater } = require('electron-updater'));
    autoUpdater.setFeedURL({ provider: 'generic', url: server.replace(/\/+$/, '') + '/update' });
    autoUpdater.autoDownload = true;
    autoUpdater.autoInstallOnAppQuit = true;
    autoUpdater.logger = null;
    autoUpdater.on('checking-for-update', () => emit({ state: 'checking' }));
    autoUpdater.on('update-available', (i) => emit({ state: 'available', version: i.version, percent: 0 }));
    autoUpdater.on('update-not-available', () => emit({ state: 'uptodate', version: app.getVersion() }));
    autoUpdater.on('download-progress', (p) => emit({ state: 'downloading', percent: Math.round(p.percent) }));
    autoUpdater.on('update-downloaded', (i) => emit({ state: 'ready', version: i.version, percent: 100 }));
    autoUpdater.on('error', (e) => emit({ state: 'error', message: String(e && e.message || e).slice(0, 200) }));
    setTimeout(() => check(false), 8000);                 // shortly after launch
    setInterval(() => check(false), 6 * 3600e3).unref();  // and every 6 hours
  } catch (e) { emit({ state: 'error', message: String(e.message) }); }
}

async function check(manual) {
  if (!autoUpdater) return status;
  if (status.state === 'downloading' || status.state === 'ready') return status;
  try { await autoUpdater.checkForUpdates(); } catch (e) { if (manual) emit({ state: 'error', message: String(e.message).slice(0, 200) }); }
  return status;
}

module.exports = { start };
