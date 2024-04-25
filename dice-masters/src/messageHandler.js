const net = require('net')


// Create a send data function
const sendData = (client, msg) => {
    client.write(msg)
}

// // BroadCast 
// const broadCast = (currentSocket, sockets, msg) => {
//     console.log("broadCast");
//     sockets.forEach(socket => {
//         socket.write(msg)
//     });
// }

// Create a data handler


module.exports = {sendData};