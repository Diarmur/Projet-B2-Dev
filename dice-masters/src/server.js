const net = require('net')
const tools = require('./tools')
const clientCom = require('./client')
const messageHandler = require('./messageHandler')


const minPort = 8000
const maxPort = 8001

const sockets = []
let client, server

const serverLaunch = () => {
    const port = tools.pickPort(minPort, maxPort)
    console.log(port);
    server = net.createServer(socket => {
        socket.on('end', () => {
            console.log('D:Client disconnect');
        });
    });
    server.on('connection', (socket) => {
        console.log('D:Client connected');
        sockets.push(socket)
        socket.on('data', (data) => {
            console.log(`D:Received data from client: ${data}`);
    
            // "Multicast" the data to all connected clients
            sockets.forEach((clientA) => {
                if (clientA !== socket) {
                    clientA.write(data);
            }})
        });
    })
    
    server.listen(8000, () => {
        console.log('D:Server listening on port '+ server.address().port);
    })
    return server
}
module.exports = {serverLaunch, server, client};