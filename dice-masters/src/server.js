const net = require('net')
const tools = require('./tools')
const clientCom = require('./client')
const messageHandler = require('./messageHandler')


// const minPort = 8002
// const maxPort = 8003

const sockets = []
let server

const serverLaunch = () => {
    // const port = tools.pickPort(minPort, maxPort)
    // console.log(port);
    server = net.createServer(socket => {
        socket.on('end', () => {
            console.log('D:Client disconnect');
        });
    });
    server.on('connection', (socket) => {
        console.log('D:Client connected');
        console.log(socket);
        sockets.push({socket:socket})
        socket.on('data', (data) => {
            console.log(`D:Received data from client: ${data}`);
            const parseData = JSON.parse(data)
            if (parseData.action == "can start") {
                broadCast(sockets, {action:"is ready"})
            } else if (parseData.action == "not ready"){
                broadCast(sockets, {action:"not ready"})
            }else if (parseData.action == "start") {
                broadCast(sockets, {action:"ready"})
            } else if (parseData.action == "register"){
                sockets.forEach((socketPresent) => {
                    if (socket == socketPresent.socket) {
                        socketPresent.username = parseData.username
                    }
                })
                updatePlayers(sockets)
                console.log(sockets);
            } else{
                broadCast(sockets, parseData)
            }
        });
    })
    
    server.listen(8002, () => {
        console.log('D:Server listening on port '+ server.address().port);
    })
    return server
}

const broadCast = (sockets, data) => {
    // "Multicast" the data to all connected clients
    const strData = JSON.stringify(data) 
    sockets.forEach((socketJson) => {
        console.log(strData);
        const client = socketJson.socket
        // if (client !== socket) {
        client.write(strData);
    })
}

const updatePlayers = (sockets) => {
    const usernameList = []
    sockets.forEach((socketJson) => {
        usernameList.push(socketJson.username)
    })
    broadCast(sockets, {action:"refresh-players", usernames:usernameList})
}
module.exports = {serverLaunch};