const express = require('express');
const app = express();
const socketIo = require('socket.io');

app.use(express.static(__dirname + '/public'));

const expressServer = app.listen(3000);

const io = socketIo(expressServer);

io.on('connection', (socket) => {
    socket.emit('messageFromServer', {data: 'welcome from the server'});
    socket.on('messageToServer', (dataFromClient) => {
        console.log(dataFromClient);
    });
    socket.on('newMessageToServer', (msg) => {
        io.emit('messageToClients', {text: msg.text});
    });
    setTimeout(() => {
        io.of('/admin').emit('welcome', 'welcome to admin from main channel');
    }, 2000);
});
io.of('/admin').on('connection', (socket) => {
    console.log('admin shit');
    io.of('/admin').emit('welcome', 'welcome to admin channel');
});
