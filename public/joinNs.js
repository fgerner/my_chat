function joinNs(endpoint) {
    //closing socket if existing
    if (nsSocket) {
        nsSocket.close();
        document.querySelector('#user-input').removeEventListener('submit', formSubmission);
    }
    //create a new server socket for new namespace server endpoint
    nsSocket = io(`http://localhost:3000${endpoint}`);
    //render room list
    nsSocket.on('nsRoomLoad', (nsRooms) => {
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
        //add event listeners on rooms
        Array.from(roomNodes).forEach((elem) => {
            elem.addEventListener('click', (e) => {
                joinRoom(e.target.innerText);
            })
        })
        //join first room on the list
        const topRoom = document.querySelector('.room');
        const topRoomName = topRoom.innerText;
        joinRoom(topRoomName);
    });

    nsSocket.on('messageToClients', (msg) => {
        const newMsg = buildHTML(msg);
        document.querySelector('#messages').innerHTML += newMsg;
    });
    //add event listener to message form
    document.querySelector('.message-form')
        .addEventListener('submit', formSubmission);
}

function formSubmission(event) {
    event.preventDefault();
    const newMessage = document.querySelector('#user-message').value;
    nsSocket.emit('newMessageToServer', {text: newMessage});
}

function buildHTML(msg) {
    const convertedDate = new Date(msg.time).toLocaleString();
    return `
     <li>
        <div class="user-image">
            <img src="${msg.avatar} "  alt="avatar"/>
        </div>
        <div class="user-message">
            <div class="user-name-time">${msg.username} <span>${convertedDate}</span></div>
            <div class="message-text">${msg.text}</div>
        </div>
    </li>`;
}
