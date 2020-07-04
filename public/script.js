const socket = io('http://localhost:3000');
const socket2 = io('http://localhost:3000/admin');

socket.on('connect', () => {
    console.log(socket.id);
});
socket2.on('connect', () => {
    console.log(socket2.id);
});
socket2.on('welcome', (msg) => {
    console.log(msg);
})

socket.on('messageFromServer', (messageFromServer) => {
    console.log(messageFromServer);
    socket.emit('messageToServer', {data: 'Data from the client'});
})

document.querySelector('#message-form')
    .addEventListener('submit', (event) => {
        event.preventDefault();
        const newMessage = document.querySelector('#user-message').value;
        socket.emit('newMessageToServer', {text: newMessage});
    });
socket.on('messageToClients', (newMessage) => {
    document.querySelector('#messages').innerHTML += `<li>${newMessage.text}</li>`;
})