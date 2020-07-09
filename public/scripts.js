const socket = io('http://localhost:3000');
let nsSocket = '';
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
            joinNs(nsEndpoint);
        })
    });
    joinNs('/wiki');

})
