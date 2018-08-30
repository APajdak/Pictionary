const socket = io();

document.querySelector('#userName input[type="submit"]').addEventListener('click', enterToTheGame);


function enterToTheGame(e){
    e.preventDefault();
    let userName = document.querySelector('#userName input[type="text"]').value;
    socket.emit('joinGame', userName);
}