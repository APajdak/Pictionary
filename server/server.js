const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const {Users} = require('./utils/users');
const {stringValidation} = require('./utils/validation');
const {Words} = require('./utils/words');
const {generateMessage} = require('./utils/message');

const publicPath = path.join(__dirname, '../public');
const port = 3000;

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
            socket.join('draw');
            socket.emit("drawer", word);
        }else{
            users.addUser(socket.id, userName, false);
            socket.join('guess');
            socket.emit('guess');
        }

        socket.emit('serverMessage', generateMessage('Hi,', ` let's play a game`));
        socket.broadcast.emit('serverMessage', generateMessage(`${userName} `, `has joined a game`));
        io.emit('scoreBoard', users.users);

    });

    socket.on('message', (msg)=>{
        if(!stringValidation(msg)) 
             return false;
             
        let user = users.getUser(socket.id);

        if(word === msg){
            let drawer = users.getDrawer();
            users.addScore(socket.id);
            users.addScore(drawer.id);
            io.emit('chatWindow', generateMessage(user.name, msg));
            io.emit('serverMessage', generateMessage(`${user.name} `, `has guessed the word : ${word}`));
            switchPlayers(socket.id)
            wordScoreEmtis(drawer.id);

        }else{
            io.emit('chatWindow', generateMessage(user.name, msg));

        }

    })

    socket.on('disconnect', ()=>{
        let user = users.removeUser(socket.id);
        if(user){
            if(user.canDraw){
                if(switchGuesser()){
                let newDrawer = users.getDrawer();
                word = words.getRandomWord();
                io.emit('scoreBoard', users.users); 
                if(!word){
                    return gameover();
                }
                io.in("draw").emit("drawer", word);
                socket.broadcast.emit('serverMessage', generateMessage(`Drawer`, ` has left the game. ${newDrawer.name} is now drawing`));    
                }
            }else{
            socket.broadcast.emit('serverMessage', generateMessage(`${user.name} `, `has left the game`));
            }
        }   
    })

    function switchPlayers(id){
        switchDrawer(id);
      }
    
      function switchDrawer(id){
        let drawer = users.getDrawer();
        let drawerSocket = io.sockets.connected[drawer.id];
          drawerSocket.leave('draw');
          drawerSocket.join('guess');
          switchGuesser(id);
          drawer.canDraw = false;
          
      }
      
      function switchGuesser(id){
        let drawer = users.getDrawer();
        if(typeof id === "undefined" || id === drawer.id){
          let guesser = users.pickRandomGuesser();
          if(guesser){
            let newDrawerSocket = io.sockets.connected[guesser.id];
            newDrawerSocket.leave('guess');
            newDrawerSocket.join('draw');
            guesser.canDraw = true;
            return guesser;
          }
          return false;
        }else{
            let guesser = users.getUser(id)
            let newDrawerSocket = io.sockets.connected[id];
            newDrawerSocket.leave('guess');
            newDrawerSocket.join('draw');
            guesser.canDraw = true;
            return guesser;
        }
      }

    function wordScoreEmtis(id){
        word = words.getRandomWord();
        io.emit('scoreBoard', users.users);
        io.emit('clearCanvas');

        io.in("draw").emit("drawer", word);
        io.in(id).emit('guess');
      }
      function gameover () {
        io.emit('serverMessage', generateMessage(`Game Over`, `${users.users[0].name} is the winner`)); 
      }
})

server.listen(port, () => {
    console.log(`Server is up on port ${port}`)
  })
  