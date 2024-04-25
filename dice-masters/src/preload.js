const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('Renderer',   
{
    login: (channel, username, password) => ipcRenderer.send(channel, username, password),
    startServer: () => ipcRenderer.send('start-server'),
    connect: (address) => ipcRenderer.send('connect', address),
    send: (text) => ipcRenderer.send('send-message', text),
    redirect: (file) => ipcRenderer.send('redirect', file),
    init: (func) => ipcRenderer.on('init-lobby', (event, data) => func(data))
})


contextBridge.exposeInMainWorld('com', {
    sendToMain: (channel, data) => ipcRenderer.send(channel, data),
    getFromMain: (channel, func) => ipcRenderer.on(channel, (event, data) => func(data))
})