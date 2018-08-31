const socket = io();

document.querySelector('#userName input[type="submit"]').addEventListener('click', enterToTheGame);


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
    document.querySelector('#message').removeAttribute('disabled');
}