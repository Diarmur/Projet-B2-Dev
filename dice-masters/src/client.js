const { ipcMain } = require('electron');
const net = require('net')
// const main = require('./main')
const messageHandler = require('./messageHandler')


const connectServer = (port, window, username) => {
    const client = net.createConnection({port:port}, () => {
        client.write(JSON.stringify({action:"register", username:username}))
        console.log("C:Successfully connected");
    })

    client.on('data', (data) => {
        // console.log('C:'+data.toString());
        console.log('c',JSON.parse(data));
        const parseData = JSON.parse(data) 
        if (parseData.action == "ready") {
            window.loadFile("./src/game/game.html")
        } else if (parseData.action == "refresh-players") {
            console.log(parseData.usernames);
            
            window.webContents.send('new-player', parseData.usernames)
        }
    })

    client.on('end', () => {
        console.log('C:disconnected');
    })
    return client
}

module.exports = {connectServer};