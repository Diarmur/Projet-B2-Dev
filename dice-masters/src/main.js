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
let globalStat = {maxDamagesDeal:0, maxDamagesTake:0, hitNumber:0, xp:0}

// const URL_API = "http://10.44.18.213:8000"
const URL_API = "http://192.168.1.19:8000"

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
      const response = await axios.post("http://192.168.1.19:8000/api/login", {
        username: name,
        password: password
      });

      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + 7);


      const cookie = {
        url: "http://127.0.0.1:8000", 
        name: 'token', 
        value: response.data.access_token,
        expirationDate : expirationDate.getTime() / 1000
      }

      session.defaultSession.cookies.set(cookie, (error) => {
        if (error) console.error(error)
      })
      mainWindow.loadFile('./src/lobby/lobby.html')
    } catch (error) {
      console.log(`Login: ${error}`);
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
    session.defaultSession.clearStorageData()
    mainWindow.loadFile('./src/login/login.html')
  })

  // MultiSystem Wait befor use

//   ipcMain.on('start-server', (event) => {
//     server = serverCom.serverLaunch()
//     client = clientCom.connectServer(8002, mainWindow, username)
//     mainWindow.loadFile('./src/lobby/lobby.html')
//   })

//   ipcMain.on('connect', (event, address) => {
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
//     client.end()
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
    globalStat ={maxDamagesDeal:0, maxDamagesTake:0, hitNumber:0, xp:0}
    allMonsters = {}
    event.sender.send('init-lobby', data)

  })

  ipcMain.on('request-monster', async (event, data) => {
    // JSON.parse(data)
    console.log("monsters/"+data.name);
    let monsterData
    try {
        monsterData = await apiDnd.getApi("monsters/"+data.name)
    } catch (error) {
        console.log(error);
    }
    const name = monsterData.name
    const id = Object.keys(monstersData).length
    monsterData.id = id
    monstersData[id] = tools.formatMonsterData(monsterData)  
    event.sender.send('get-monster', monsterData)
  })

  ipcMain.on('start', (event, data) => {
    if (selectedCharacter != undefined) mainWindow.loadFile("./src/game/game.html")
  })

  ipcMain.on('select-sheet', (event, data) => {
    selectedCharacter = data
  })

  ipcMain.on('game-ready', async (event, data) => {
    // get the character sheet from the api
    character = await tools.getCharacterSheet(selectedCharacter)
        const allData = {}
        let monsters = []
        let sheet = []
        for (var monsterName in monstersData) {
            monsters.push(monstersData[monsterName])
            
        }
    try {
        allData['sheet'] = await tools.formatCharacterSheet(character)        
    } catch (error) {
        console.log(error);
    }

    // monsters.forEach(monster => {
    //     allMonsters.push(monster)
    // });
    allData.monsters = monsters
    
    event.sender.send('setup-game', allData)
  })

  ipcMain.on("attack", (event, data) => {
    let damages = tools.DealDamages(monstersData,character, data)
    const target = monstersData[data.target]
    target.hit_points -= damages < 0 ? 0 : damages
    console.log(damages);
    if (damages < 0) {
        event.sender.send("attack", {target:target.name+target.id, msg:`You hit ${damages*-1} on touch throw, you miss the target`})
    } else if (target.hit_points <= 0) {
        globalStat.hitNumber += 1
        globalStat.maxDamagesDeal += (damages+target.hit_points)
        globalStat.xp += target.xp
        event.sender.send("kill", {target:target.name+target.id, msg:`You deal ${damages} to ${target.name}, it fell on the ground`})
        delete monstersData[data.target]
        if (Object.keys(monstersData).length <= 0) mainWindow.loadFile("./src/end/end.html")
    } else {
        globalStat.hitNumber += 1
        globalStat.maxDamagesDeal += (damages)
        event.sender.send("attack", {target:target.name+target.id, msg:`You deal ${damages} damages to ${target.name}`})
    }
    if (Object.keys(monstersData).length > 0) {
        for (const monster in monstersData) {
            console.log(monstersData[monster]);
            const damages = tools.GetDamages(character, monstersData[monster])
            character.hit_points -= damages < 0 ? 0 : damages
            if (character.hit_points <= 0) {
                console.log("you died");
                globalStat.maxDamagesTake += (damages+character.hit_points)
                mainWindow.loadFile("./src/end/end.html")
            } else {
                globalStat.maxDamagesTake += damages
                const msg = damages< 0? `${monstersData[monster].name} missed you`:`${monstersData[monster].name} hit you and did ${damages} damages`
                event.sender.send("get-attacked", {msg:msg, hp:character.hit_points})
            }
        }
    }
  })

  ipcMain.on("end-ready", (event, data) => {
    console.log(character.hit_points);
    globalStat.title = character.hit_points > 0 ? "Well done, you killed all monsters":"Sorry, you died"
    console.log(globalStat);
    event.sender.send("get-stats", globalStat)
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