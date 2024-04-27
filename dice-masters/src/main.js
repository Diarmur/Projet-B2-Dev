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
    width: 800, height: 500,
    minWidth: 800, minHeight: 500,
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

  ipcMain.on('register', async (event, username, email, password, password_confirmation, first_name, last_name) => {
    console.log('hit register');
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/register", {
        username: username,
        email: email,
        password: password,
        password_confirmation: password_confirmation,
        first_name: first_name,
        last_name: last_name
      });
      console.log(response.data);
    } catch (error) {
      console.log(`Error: ${error.response.status}`);
    }
    
  });

  ipcMain.on('redirect', (event, file) => {
    mainWindow.loadFile('src/'+file+'/'+file+'.html')
  })

  // MultiSystem Wait befor use

//   ipcMain.on('start-server', (event) => {
//     console.log('shoul start the server');
//     server = serverCom.serverLaunch()
//     client = clientCom.connectServer(8002, mainWindow, username)
//     mainWindow.loadFile('./src/lobby/lobby.html')
//   })

//   ipcMain.on('connect', (event, address) => {
//     console.log("try connection on :", address);
//     client = clientCom.connectServer(address, mainWindow, username)
//     mainWindow.loadFile('./src/lobby/lobby.html')
//   })

//   ipcMain.on('lobby-ready', (event) => {
//     mainWindow.webContents.send('init-lobby', {username:username, code:"1234"})
//   })

//   ipcMain.on('lobby-start', (event, data) => {
//     client.write(JSON.stringify({action:"start"}))
//   })

//   ipcMain.on('refresh-list-players', (event, data) => {
//     event.sender.send('refresh-players')
//   })

//   ipcMain.on('lobby-leave', (event, data) => {
//     console.log("test");
//     client.end()
//     console.log(server);
//     if (server != undefined) server.close()
//     mainWindow.loadFile("./src/home/home.html")
//   })

//   ipcMain.on('send-message', (event, text) => {
//     messageHandler.sendDataToServer(client, text)
//   })

//   ipcMain.on('game-ready', (event, data) => {
//   })

    ipcMain.on('start-server', (event) => {
        mainWindow.loadFile('./src/lobby/lobby.html')
      })

  ipcMain.on("lobby-ready", (event, data) => {
    // Get all character sheet of the user
    charExemples = {
        "characters": [
            {
                "character_name": "Aldric",
                "level":5,
                "class": "Fighter"
            },
            {
                "character_name": "Lyra",
                "level":2,
                "class": "Wizard"
            }
        ]
    }

    data = {
        username:username,
        characterSheets: charExemples
    }
    
    event.sender.send('init-lobby', data)
  })

  mainWindow.loadFile('./src/register/register.html')

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


const checkReady = () => {
    messageHandler.sendDataToRenderer(window, 'is-ready', '')
}

module.exports = {checkReady}