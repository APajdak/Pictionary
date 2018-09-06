let socket = io();

document.querySelector('#userName input[type="submit"]').addEventListener('click', enterToTheGame);
document.querySelector('#sendMessage').addEventListener('submit', sendMessage);

let erase = document.querySelector('erase');
let canvas = document.querySelector('#canvas');
let cts = canvas.getContext('2d');
let rect = canvas.getBoundingClientRect();


let score = document.querySelector('#user-list');

function enterToTheGame(e){
    e.preventDefault();
    let userName = document.querySelector('#userName input[type="text"]').value;
    
    socket.emit('joinGame', userName, (err)=>{
        if(err){
            alert(err);
            window.location.href = '/'
        }
    });
    document.querySelector('#login').classList.add('hide');
    document.querySelector('.container').classList.remove('blur');
    document.querySelector('#messageInput').removeAttribute('disabled');
}

function sendMessage(e){
    e.preventDefault();
    socket.emit('message', document.querySelector('#messageInput').value);
    document.querySelector('#messageInput').value = "";
}

socket.on('chatWindow', (data)=>{
    let template = document.querySelector('#message-template').innerHTML;
    let html = Mustache.render(template, {
      text: data.text,
      from: data.from,
      sendedAt: data.sendedAt
    });
    document.querySelector('.chatWindow').insertAdjacentHTML("beforeend", html);
});

socket.on('serverMessage', (data)=>{
    let template = document.querySelector('#server-message-template').innerHTML;
    let html = Mustache.render(template, {
      text: data.text,
      from: data.from
    });
    document.querySelector('.chatWindow').insertAdjacentHTML("beforeend", html);
});

socket.on('scoreBoard', (users)=>{
    let template = document.querySelector('#score-board-template').innerHTML;
    let html = Mustache.render(template, {users});
    let scoreBoard = document.querySelector('#user-list');
    while(scoreBoard.hasChildNodes()){
        scoreBoard.removeChild(scoreBoard.childNodes[0]);
    }
    scoreBoard.insertAdjacentHTML("beforeend", html);
    
});

socket.on('drawer', (word)=>{
    let span = document.createElement('span');
    span.id = "word";
    span.innerHTML = `Draw: ${word}`;
    document.querySelector('#pwd').innerHTML = "";
    document.querySelector('#pwd').appendChild(span);
    document.querySelector('#messageInput').setAttribute('disabled', 'disabled');
    document.querySelector('#messageInput').setAttribute('placeholder', 'You are drawing');
});

socket.on("guess", ()=>{
    document.querySelector('#messageInput').removeAttribute('disabled', 'disabled');
    document.querySelector('#messageInput').setAttribute('placeholder', 'Your guess');
});

socket.on('timeLeft', (time)=>{
    document.querySelector('#timeLeft').innerText = time;
})



