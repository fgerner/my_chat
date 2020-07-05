const socket = io('http://localhost:3000');
const socket2 = io('http://localhost:3000/admin');

socket.on('messageFromServer', (messageFromServer) => {
    console.log(messageFromServer);
    socket.emit('messageToServer', {data: 'Data from the client'});
});

socket.on('joined', (msg) => {
    console.log(msg);
})

socket2.on('welcome', (messageFromServer) => {
    console.log(messageFromServer);
})

document.querySelector('#message-form')
    .addEventListener('submit', (event) => {
        event.preventDefault();
        const newMessage = document.querySelector('#user-message').value;
        socket.emit('newMessageToServer', {text: newMessage});
    });
