const net = require('net')


const connectServer = (port) => {
    const client = net.createConnection({port:port}, () => {
        console.log("C:Successfully connected");
    })

    client.on('data', (data) => {
        console.log('C:'+data.toString());
    })

    client.on('end', () => {
        console.log('C:disconnected');
    })
    return client
}

module.exports = {connectServer};