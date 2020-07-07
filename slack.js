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
        nsSocket.on('joinRoom', (roomToJoin, numberOfUsersCallback) => {
            nsSocket.join(roomToJoin);
            io.of('/wiki').in(roomToJoin).clients((error, clients) => {
                numberOfUsersCallback(clients.length);
            });
            const nsRoom = namespaces[0].rooms.find((room) => {
                return room.roomTitle === roomToJoin;
            });
            nsSocket.emit('historyCatchUp', nsRoom.history);
        });
        nsSocket.on('newMessageToServer', (msg) => {
            const fullMsg = {
                text: msg.text,
                time: Date.now(),
                username: 'me',
                avatar: 'http://via.placeholder.com/30'
            }
            // console.log(fullMsg);
            // console.log(nsSocket.rooms);
            const roomTitle = Object.keys(nsSocket.rooms)[1];
            const nsRoom = namespaces[0].rooms.find((room) => {
                return room.roomTitle === roomTitle;
            });
            // console.log(nsRoom);
            nsRoom.addMessage(fullMsg);
            io.of('/wiki').to(roomTitle).emit('messageToClients', fullMsg);
        })
    })
})
