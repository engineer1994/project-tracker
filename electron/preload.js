const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods to the renderer process
contextBridge.exposeInMainWorld('electronAPI', {
  // Excel operations
  readData: () => ipcRenderer.invoke('excel:read'),
  writeData: (projects) => ipcRenderer.invoke('excel:write', projects),
  getFilePath: () => ipcRenderer.invoke('excel:getFilePath'),
  showInFolder: () => ipcRenderer.invoke('excel:showInFolder'),
  exportData: () => ipcRenderer.invoke('excel:export'),

  // Settings operations
  readSettings: () => ipcRenderer.invoke('settings:read'),
  writeSettings: (settings) => ipcRenderer.invoke('settings:write', settings),

  // Check if running in Electron
  isElectron: true,
});
