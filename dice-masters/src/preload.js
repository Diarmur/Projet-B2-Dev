const { Titlebar,TitlebarColor } = require ("custom-electron-titlebar");
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('com', {
    login: (channel, username, password) => ipcRenderer.send(channel, username, password),
    register: (channel, username, email, password, password_confirmation) => ipcRenderer.send(channel, username, email, password, password_confirmation),
    startServer: () => ipcRenderer.send('start-server'),
    connect: (address) => ipcRenderer.send('connect', address),
    send: (text) => ipcRenderer.send('send-message', text),
    redirect: (file) => ipcRenderer.send('redirect', file),
    init: (func) => ipcRenderer.on('init-lobby', (event, data) => func(data)),
    sendToMain: (channel, data) => ipcRenderer.send(channel, data),
    getFromMain: (channel, func) => ipcRenderer.on(channel, (event, data) => func(data)),
})



window.addEventListener('DOMContentLoaded', () => {
    const options = {
        backgroundColor: TitlebarColor.fromHex('#16202A'),
        transparent: 0.5
      };
    new Titlebar(options);
  });