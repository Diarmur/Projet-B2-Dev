const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('Renderer',   
{
    login: (channel, username, password) => ipcRenderer.send(channel, username, password),
    startServer: () => ipcRenderer.send('start-server'),
    connect: (address) => ipcRenderer.send('connect', address),
    send: (text) => ipcRenderer.send('send-message', text),
    redirect: (file) => ipcRenderer.send('redirect', file)
})