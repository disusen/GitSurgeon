const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('git', {
  openRepo: (path) => ipcRenderer.invoke('git:openRepo', path),
  getCommits: (limit) => ipcRenderer.invoke('git:getCommits', limit),
  amendMessage: (message) => ipcRenderer.invoke('git:amendMessage', message),
  undoCommit: () => ipcRenderer.invoke('git:undoCommit'),
  rewordCommit: (sha, message) => ipcRenderer.invoke('git:rewordCommit', sha, message),
  squashCommits: (shas, message) => ipcRenderer.invoke('git:squashCommits', shas, message),
})

contextBridge.exposeInMainWorld('dialog', {
  openFolder: () => ipcRenderer.invoke('dialog:openFolder'),
})