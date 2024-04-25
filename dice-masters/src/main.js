// Modules
const {app, BrowserWindow} = require('electron')
const { ipcMain } = require('electron/main')
const path = require('path')
const net = require('net')
const serverCom = require('./server')
const clientCom = require('./client')
const messageHandler = require('./messageHandler')
const tools = require('./tools')
const axios = require('axios');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow, server, client, port
let username

// Create a new BrowserWindow when `app` is ready
const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 400, height: 500,
    frame:true,
    webPreferences: {
      // --- !! IMPORTANT !! ---
      // Disable 'contextIsolation' to allow 'nodeIntegration'
      // 'contextIsolation' defaults to "true" as from Electron v12
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  })

  ipcMain.on('log-in', async (event, name, password) => {
    username = name
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/login", {
        username: name,
        password: password
      });
      console.log(response.data);
    } catch (error) {
      console.log(`Error: ${error.response.status}`);
    }
  });

  ipcMain.on('redirect', (event, file) => {
    mainWindow.loadFile('src/'+file+'/'+file+'.html')
  })

  ipcMain.on('start-server', (event) => {
    console.log('shoul start the server');
    server = serverCom.serverLaunch()
    client = clientCom.connectServer(8002)
    mainWindow.loadFile('./src/lobby/lobby.html')
  })

  ipcMain.on('connect', (event, address) => {
    console.log("try connection on :", address);
    client = clientCom.connectServer(address)
    mainWindow.loadFile('./src/lobby/lobby.html')
  })

  ipcMain.on('lobby-ready', (event) => {
    event.sender.send('init-lobby', {username:username, code:"1234"})
    initLobby(username, "1234")
  })

  ipcMain.on('lobby-leave', (event, data) => {
    console.log("test");
    client.end()
    console.log(server);
    if (server != undefined) server.close()
    mainWindow.loadFile("./src/home/home.html")
  })

  ipcMain.on('send-message', (event, text) => {
    messageHandler.sendData(client, text)
  })

  mainWindow.loadFile('./src/login/login.html')

  // Open DevTools - Remove for PRODUCTION!
  mainWindow.webContents.openDevTools();

  // Listen for window being closed
  mainWindow.on('closed',  () => {
    mainWindow = null
  })
}

// Quit when all windows are closed - (Not macOS - Darwin)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})


app.whenReady().then(() => {
    createWindow()
  
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
  })

const initLobby = (username, code) => {
    console.log("send info");

}