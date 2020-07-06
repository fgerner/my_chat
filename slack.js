const express = require('express');
const app = express();
const socketIo = require('socket.io');
let namespaces = require('./data/namespaces');
// console.log(namespaces[0]);

app.use(express.static(__dirname + '/public'));
const expressServer = app.listen(3000);
const io = socketIo(expressServer);

io.on('connection', (socket) => {
    let nsData = namespaces.map((ns) => {
        return {
            img: ns.img,
            endpoint: ns.endpoint
        }
    })
    // console.log(nsData);
    socket.emit('nsList', nsData)
});

namespaces.forEach((namespace) => {
    io.of(namespace.endpoint).on('connection', (nsSocket) => {
        console.log(`${nsSocket.id} has joined ${namespace.endpoint}`);
        nsSocket.emit('nsRoomLoad', namespaces[0].rooms);
    })
})
