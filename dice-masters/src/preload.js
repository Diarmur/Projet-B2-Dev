const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('connection',   
{
    login: (username, password) => ipcRenderer.send('log-in', username, password)
})