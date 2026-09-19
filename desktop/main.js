const { app, BrowserWindow, ipcMain, dialog, shell, Menu, screen, Notification, nativeTheme } = require('electron');
const updater = require('./updater');
app.setAppUserModelId('ir.abolfazl.anjam');
const path = require('path');
const fs = require('fs');

const DATA_FILE = () => path.join(app.getPath('userData'), 'anjam-data.json');
let win;

function readData() {
  try {
    const raw = fs.readFileSync(DATA_FILE(), 'utf8');
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function writeData(data) {
  const file = DATA_FILE();
  const tmp = file + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(data, null, 2), 'utf8');
  try { if (fs.existsSync(file)) fs.copyFileSync(file, file + '.bak'); } catch {} // keep the previous copy as a safety net
  fs.renameSync(tmp, file);
  return true;
}

function createWindow() {
  const { width: sw, height: sh } = screen.getPrimaryDisplay().workAreaSize;
  win = new BrowserWindow({
    width: Math.min(1180, Math.round(sw * 0.85)),
    height: Math.min(780, Math.round(sh * 0.85)),
    minWidth: 480,
    minHeight: 420,
    backgroundColor: nativeTheme.shouldUseDarkColors ? '#191415' : '#ffffff',
    autoHideMenuBar: true,
    icon: path.join(__dirname, '..', 'build', 'icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      spellcheck: false,
    },
  });
  Menu.setApplicationMenu(null);
  win.loadFile(path.join(__dirname, '..', 'app', 'index.html'));
  // Dev helper: ANJAM_SHOT=<file.png> captures the window and exits (used for visual checks)
  if (process.env.ANJAM_SHOT) {
    if (process.env.ANJAM_SIZE) { const [w, h] = process.env.ANJAM_SIZE.split('x').map(Number); win.setSize(w, h); }
    win.webContents.once('did-finish-load', () => setTimeout(async () => {
      if (process.env.ANJAM_SEED) await win.webContents.executeJavaScript(process.env.ANJAM_SEED);
      await new Promise((r) => setTimeout(r, 400));
      const img = await win.webContents.capturePage();
      fs.writeFileSync(process.env.ANJAM_SHOT, img.toPNG());
      app.quit();
    }, 900));
  }
  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });
}

if (process.env.ANJAM_USERDATA) app.setPath('userData', process.env.ANJAM_USERDATA); // dev: isolated profile for visual checks
// One running copy per user: a second launch just focuses the existing window
if (!app.requestSingleInstanceLock()) app.quit();
app.on('second-instance', () => { if (win) { if (win.isMinimized()) win.restore(); win.show(); win.focus(); } });

app.whenReady().then(() => {
  createWindow();
  updater.start(() => win);
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => app.quit());

// ---- IPC ----
ipcMain.handle('data:load', () => readData());
ipcMain.handle('data:save', (_e, data) => writeData(data));

ipcMain.handle('export:file', async (_e, { defaultName, filters, content }) => {
  const { canceled, filePath } = await dialog.showSaveDialog(win, {
    defaultPath: path.join(app.getPath('documents'), defaultName),
    filters,
  });
  if (canceled || !filePath) return { ok: false };
  // BOM so Excel opens CSV with correct Persian encoding
  const bom = filePath.toLowerCase().endsWith('.csv') ? '﻿' : '';
  fs.writeFileSync(filePath, bom + content, 'utf8');
  return { ok: true, filePath };
});

ipcMain.handle('export:pdf', async (_e, { defaultName, html }) => {
  const { canceled, filePath } = await dialog.showSaveDialog(win, {
    defaultPath: path.join(app.getPath('documents'), defaultName),
    filters: [{ name: 'PDF', extensions: ['pdf'] }],
  });
  if (canceled || !filePath) return { ok: false };
  // Embed the bundled Persian font so the PDF renders identically everywhere
  let fontCss = '';
  try {
    const b64 = fs.readFileSync(path.join(__dirname, '..', 'app', 'fonts', 'Vazirmatn.woff2')).toString('base64');
    fontCss = `<style>@font-face{font-family:'Vazirmatn';src:url(data:font/woff2;base64,${b64}) format('woff2-variations');font-weight:100 900}</style>`;
  } catch {}
  const pdfWin = new BrowserWindow({ show: false, webPreferences: { sandbox: true } });
  const tmpHtml = path.join(app.getPath('temp'), 'anjam-report.html');
  fs.writeFileSync(tmpHtml, html.replace('</head>', fontCss + '</head>'), 'utf8');
  await pdfWin.loadFile(tmpHtml);
  await new Promise((r) => setTimeout(r, 300));
  const buf = await pdfWin.webContents.printToPDF({
    printBackground: true,
    pageSize: 'A4',
    margins: { top: 0.5, bottom: 0.5, left: 0.5, right: 0.5 },
  });
  pdfWin.destroy();
  try { fs.unlinkSync(tmpHtml); } catch {}
  fs.writeFileSync(filePath, buf);
  return { ok: true, filePath };
});

ipcMain.handle('import:file', async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog(win, {
    properties: ['openFile'],
    filters: [{ name: 'Anjam backup', extensions: ['json'] }],
  });
  if (canceled || !filePaths[0]) return { ok: false };
  try {
    const data = JSON.parse(fs.readFileSync(filePaths[0], 'utf8'));
    return { ok: true, data };
  } catch (err) {
    return { ok: false, error: String(err) };
  }
});

ipcMain.handle('notify', (_e, { title, body, id }) => {
  if (!Notification.isSupported()) return false;
  const n = new Notification({ title, body, icon: path.join(__dirname, '..', 'build', 'icon.png') });
  n.on('click', () => { if (win) { if (win.isMinimized()) win.restore(); win.show(); win.focus(); win.webContents.send('open-task', id); } });
  n.show();
  return true;
});

ipcMain.handle('shell:openExternal', (_e, u) => { if (/^https?:\/\//.test(u)) shell.openExternal(u); });
ipcMain.handle('shell:showItem', (_e, p) => shell.showItemInFolder(p));
ipcMain.handle('app:version', () => app.getVersion());

// Server address stamped by the download server: Windows installer writes %APPDATA%njam\server.json
// (see build/installer.nsh); an AppImage carries it in its own file name (Anjam-1.3.0.srv-<host>.AppImage).
ipcMain.handle('app:defaultServer', () => {
  try { const j = JSON.parse(fs.readFileSync(path.join(app.getPath('userData'), 'server.json'), 'utf8')); if (j && j.server) return j.server; } catch {}
  const m = /\.srv-([^/\\]+?)\.(AppImage|exe)$/i.exec(process.env.APPIMAGE || '');
  return m ? 'https://' + m[1] : '';
});
