const socket = io('http://localhost:3000');

socket.on('connect', () => {
    console.log(socket.id);
});

socket.on('nsList', (nsData) => {
    console.log('list of namespaces is here');
    let namespacesDiv = document.querySelector('.namespaces');
    namespacesDiv.innerHTML = "";
    nsData.forEach((ns) => {
        namespacesDiv.innerHTML += `<div class='namespace' ns="${ns.endpoint}" ><img src="${ns.img}" /></div>`
    });
    Array.from(document.getElementsByClassName('namespace')).forEach((elem) => {
        elem.addEventListener('click', (e) => {
            const nsEndpoint = elem.getAttribute('ns');
        })
    });
    const nsSocket = io('http://localhost:3000/wiki');
    nsSocket.on('nsRoomLoad', (nsRooms) => {
        // console.log(nsRooms);
        let roomList = document.querySelector('.room-list');
        roomList.innerHTML = '';
        nsRooms.forEach((room) => {
            let glyph;
            if (room.privateRoom) {
                glyph = 'lock';
            } else {
                glyph = 'globe';
            }
            roomList.innerHTML += `<li class="room"><span class="glyphicon glyphicon-${glyph}"></span>${room.roomTitle}</li>`;
        });
        let roomNodes = document.getElementsByClassName('room');
        Array.from(roomNodes).forEach((elem) => {
            elem.addEventListener('click', (e) => {
                console.log(e.target.innerText);
            })
        })
    });
})

socket.on('messageFromServer', (messageFromServer) => {
    console.log(messageFromServer);
    socket.emit('messageToServer', {data: 'Data from the client'});
});

socket.on('joined', (msg) => {
    console.log(msg);
})

document.querySelector('#message-form')
    .addEventListener('submit', (event) => {
        event.preventDefault();
        const newMessage = document.querySelector('#user-message').value;
        socket.emit('newMessageToServer', {text: newMessage});
    });

socket.on('messageToClients', (msg) => {
    document.querySelector('#messages').innerHTML += `<li>${msg.text}</li>`
})