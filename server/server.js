const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const {Users} = require('./utils/users');
const {stringValidation} = require('./utils/validation');
const {Words} = require('./utils/words');
const {generateMessage} = require('./utils/message');

const publicPath = path.join(__dirname, '../public');
const port = 3002;

let app = express();
let server = http.createServer(app);
let io = socketIO(server);
app.use(express.static(publicPath));

let users = new Users();
let words = new Words();
let word = words.getRandomWord();
console.log(word);


io.on('connection', (socket)=>{

    socket.on('joinGame', (userName, callback)=>{
        if(!stringValidation(userName)){
            return callback('User name is required');
        }

        if(!users.users.length){
            users.addUser(socket.id, userName, true);
        }else{
            users.addUser(socket.id, userName, false);
        }

        socket.emit('serverMessage', generateMessage('Hi,', ` let's play a game`));
        socket.broadcast.emit('serverMessage', generateMessage(`${userName} `, `has joined a game`));

    });

    socket.on('message', (msg)=>{
        if(!stringValidation(msg)) 
             return false;
        let user = users.getUser(socket.id);
        if(word === msg){
            console.log("Bingo");
        }else{
            io.emit('chatWindow', generateMessage(user.name, msg));

        }

    })



    socket.on('disconnect', ()=>{
       let user =  users.removeUser(socket.id);
       console.log(user);
    })
})

server.listen(port, () => {
    console.log(`Server is up on port ${port}`)
  })
  