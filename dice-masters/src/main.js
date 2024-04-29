// Modules
const { setupTitlebar, attachTitlebarToWindow } = require('custom-electron-titlebar/main');
const {session} = require('electron')
const {app, BrowserWindow} = require('electron')
const { ipcMain } = require('electron/main')
const path = require('path')
const net = require('net')
const serverCom = require('./server')
const clientCom = require('./client')
const messageHandler = require('./messageHandler')
const tools = require('./tools')
const axios = require('axios');
const apiDnd = require('./dnd_api')
const { log } = require('console')
const {Character, Monster} = require('./classes')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
let username
let selectedCharacter
let character
let allMonsters = []
let monstersData = {}

const URL_API = "http://10.44.18.213:8000"

const charSheetExemple = {
            "id": 1,
            "character_name": "Aldric",
            "user_id": "123456",
            "race": "Human",
            "class": "Fighter",
            "level": 5,
            "background": "Noble",
            "alignment": "Lawful Good",
            "experience": 12000,
            "strength": 16,
            "dexterity": 12,
            "constitution": 14,
            "intelligence": 10,
            "wisdom": 10,
            "charisma": 13,
            "weapon": "piercing:1d8",
            "armor_class": 18,
            "speed": 30,
            "spell_book": "fireball,acid-arrow"
    }

// let server, client, port

setupTitlebar();
// Create a new BrowserWindow when `app` is ready
const createWindow = async () => {
  mainWindow = new BrowserWindow({
    width: 1100, height: 700,
    minWidth: 800, minHeight: 500,
    frame:false,
    titleBarStyle: 'hidden',
    titleBarOverlay: true,
    webPreferences: {
      // --- !! IMPORTANT !! ---
      // Disable 'contextIsolation' to allow 'nodeIntegration'
      // 'contextIsolation' defaults to "true" as from Electron v12
      sandbox: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  })

  ipcMain.on('log-in', async (event, name, password) => {
    try {
      const response = await axios.post(URL_API+"/api/login", {
        username: name,
        password: password
      });

      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + 7);

      const cookie = {
        url: URL_API, 
        name: 'token', 
        value: response.data.access_token,
        expirationDate : expirationDate.getTime() / 1000
      }

      session.defaultSession.cookies.set(cookie, (error) => {
        if (error) console.error(error)
      })
      mainWindow.loadFile('./src/lobby/lobby.html')
    } catch (error) {
      console.log(`Error: ${error}`);
    }
  });

  ipcMain.on('register', async (event, username, email, password, password_confirmation) => {
    try {
      const response = await axios.post(URL_API+"/api/register", {
        username: username,
        email: email,
        password: password,
        password_confirmation: password_confirmation
      });
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + 7);

      const cookie = {
        url: URL_API, 
        name: 'token', 
        value: response.data.access_token,
        expirationDate : expirationDate.getTime() / 1000
      }
      session.defaultSession.cookies.set(cookie, (error) => {
        if (error) console.error(error)
      })
      mainWindow.loadFile('./src/lobby/lobby.html')
    } catch (error) {
      console.log(`Error: ${error.response.status}`);
    }
    
  });

  ipcMain.on('redirect', (event, file) => {
    mainWindow.loadFile('src/'+file+'/'+file+'.html')
  })

  ipcMain.on('disconnect', (event) => {
    console.log("disconnect");
    session.defaultSession.clearStorageData()
    mainWindow.loadFile('./src/login/login.html')
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

    ipcMain.on('start-server', async (event) => {
        mainWindow.loadFile('./src/lobby/lobby.html')
      })

  ipcMain.on("lobby-ready", async (event, data) => {
    // Get all character sheet of the user
    const cookies = await session.defaultSession.cookies.get({});
    const token = cookies[0].value;  

    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };

    const me = await axios.get(
      URL_API+'/api/me',
      {
        headers: {
          'Authorization': 'Bearer ' + token
        } 
      }
    );

    const response = await axios.get( 
      URL_API+'/api/characterSheets/user/'+me.data.id,
      {
        headers: {
          'Authorization': 'Bearer ' + token
        } 
      }
    );

    charExemples = {
      "characters": response.data
  }

    data = {
      username:username,
      characterSheets: charExemples
    }
  
    event.sender.send('init-lobby', data)

  })

  ipcMain.on('request-monster', async (event, data) => {
    // JSON.parse(data)
    console.log("monsters/"+data.name);
    monsterData = await apiDnd.getApi("monsters/"+data.name)
    monstersData[monsterData.name] = monsterData  
    event.sender.send('get-monster', monsterData)
  })

  ipcMain.on('start', (event, data) => {
    if (selectedCharacter != undefined) mainWindow.loadFile("./src/game/game.html")
  })

  ipcMain.on('select-sheet', (event, data) => {
    console.log("sheet selected : ", data);
    selectedCharacter = data
  })

  ipcMain.on('game-ready', async (event, data) => {
    // get the character sheet from the api
    const allData = {}
    let monsters = []
    let sheet = []
    for (var monsterName in monstersData) {
        monsters.push(tools.formatMonsterData(monstersData[monsterName]))
        
    }
    try {
        allData['sheet'] = await tools.formatCharacterSheet(charSheetExemple)
        character = new Character(sheet)
    } catch (error) {
        console.log(error);
    }

    monsters.forEach(monster => {
        allMonsters.push(new Monster(monster))
    });
    allData.monsters = monsters
    console.log("player sheet :",allData.sheet);
    // console.log(monsters);
    
    event.sender.send('setup-game', allData)
  })
  const cookies = await session.defaultSession.cookies.get({});
  if  (cookies.length > 0) {
    mainWindow.loadFile('./src/lobby/lobby.html')
  } else{
    mainWindow.loadFile('./src/login/login.html')
  }

  // Open DevTools - Remove for PRODUCTION!
//   mainWindow.webContents.openDevTools();

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