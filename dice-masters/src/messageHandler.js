const net = require('net')


// Create a send data function
const sendDataToServer = (client, msg) => {
    client.write(msg)
}

const sendDataToRenderer = (window, channel, msg) => {
    window.webContents.send(channel, msg)
}

// // BroadCast 
// const broadCast = (currentSocket, sockets, msg) => {
//     console.log("broadCast");
//     sockets.forEach(socket => {
//         socket.write(msg)
//     });
// }

// Create a data handler
const handleMsg = (msg) => {
    // exemple : "'action type':attack, "
    data = JSON.parse(msg)
    return data
}


module.exports = {sendDataToServer, sendDataToRenderer};