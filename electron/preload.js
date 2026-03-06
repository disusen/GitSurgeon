const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('git', {
  openRepo: (path) => ipcRenderer.invoke('git:openRepo', path),
  getCommits: (limit) => ipcRenderer.invoke('git:getCommits', limit),
})

contextBridge.exposeInMainWorld('dialog', {
  openFolder: () => ipcRenderer.invoke('dialog:openFolder'),
})