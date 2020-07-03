const socket = io('http://localhost:3000');
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