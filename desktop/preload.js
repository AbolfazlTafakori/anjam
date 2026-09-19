const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('anjam', {
  load: () => ipcRenderer.invoke('data:load'),
  save: (data) => ipcRenderer.invoke('data:save', data),
  exportFile: (opts) => ipcRenderer.invoke('export:file', opts),
  exportPdf: (opts) => ipcRenderer.invoke('export:pdf', opts),
  importFile: () => ipcRenderer.invoke('import:file'),
  showItem: (p) => ipcRenderer.invoke('shell:showItem', p),
  version: () => ipcRenderer.invoke('app:version'),
  notify: (o) => ipcRenderer.invoke('notify', o),
  openExternal: (u) => ipcRenderer.invoke('shell:openExternal', u),
  update: {
    status: () => ipcRenderer.invoke('update:status'),
    check: () => ipcRenderer.invoke('update:check'),
    install: () => ipcRenderer.invoke('update:install'),
    onStatus: (cb) => ipcRenderer.on('update:status', (_e, s) => cb(s)),
  },
  onOpenTask: (cb) => ipcRenderer.on('open-task', (_e, id) => cb(id)),
});
