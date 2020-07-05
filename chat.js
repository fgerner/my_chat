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
    socket.join('level1');
    socket.to('level1').emit('joined', `${socket.id} have joined the level one room`);
});
io.of('/admin').on('connection', (socket) => {
    console.log('admin namespace');
    io.of('/admin').emit('welcome', 'welcome to admin channel');
});
