const username = prompt('Please enter your username: ');
//client connect to server socket
const socket = io('http://localhost:3000', {
    query: {
        username
    }
});
let nsSocket = '';
//listen for namespace event from server
socket.on('nsList', (nsData) => {
    let namespacesDiv = document.querySelector('.namespaces');
    namespacesDiv.innerHTML = "";
    //render namespaces
    nsData.forEach((ns) => {
        namespacesDiv.innerHTML += `<div class='namespace' ns="${ns.endpoint}" ><img src="${ns.img}" /></div>`
    });
    //attach event listeners on namespaces
    Array.from(document.getElementsByClassName('namespace')).forEach((elem) => {
        elem.addEventListener('click', (e) => {
            const nsEndpoint = elem.getAttribute('ns');
            joinNs(nsEndpoint);
        })
    });
    //default namespace
    joinNs('/wiki');

})
