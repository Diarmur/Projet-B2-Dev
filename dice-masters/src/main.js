// Modules
const {app, BrowserWindow} = require('electron')
const { ipcMain } = require('electron/main')
const path = require('path')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

// Create a new BrowserWindow when `app` is ready
function createWindow () {

  mainWindow = new BrowserWindow({
    width: 1000, height: 800,
    webPreferences: {
      // --- !! IMPORTANT !! ---
      // Disable 'contextIsolation' to allow 'nodeIntegration'
      // 'contextIsolation' defaults to "true" as from Electron v12
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    //   nodeIntegration: true
    }
  })

  ipcMain.on('log-in', (event, username, password) => {
    // const webContents = event.sender;
    // const win = BrowserWindow.fromWebContents(webContents)
    console.log("erer");
    console.log(username, password);

  })

  // Load index.html into the new BrowserWindow
  mainWindow.loadFile('src/login.html')

  // Open DevTools - Remove for PRODUCTION!
  mainWindow.webContents.openDevTools();

  // Listen for window being closed
  mainWindow.on('closed',  () => {
    mainWindow = null
  })
}

// Electron `app` is ready
app.on('ready', createWindow)

// Quit when all windows are closed - (Not macOS - Darwin)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

// When app icon is clicked and app is running, (macOS) recreate the BrowserWindow
app.on('activate', () => {
  if (mainWindow === null) createWindow()
})
