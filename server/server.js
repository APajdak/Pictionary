const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const {Users} = require('./utils/users');
const {stringValidation} = require('./utils/validation');
const {Words} = require('./utils/words');
const {generateMessage} = require('./utils/message');
const {TimeLeft} = require('./utils/time');

const publicPath = path.join(__dirname, '../public');
const port = 3000;

let app = express();
let server = http.createServer(app);
let io = socketIO(server);
app.use(express.static(publicPath));

let users = new Users();
let words = new Words();
let timeLeft;

let word = words.getRandomWord();


io.on('connection', (socket)=>{

    socket.on('joinGame', (userName, callback)=>{
        if(!stringValidation(userName)){
            return callback('User name is required');
        }

        if(!users.users.length){
            users.addUser(socket.id, userName, true);
            socket.join('draw');
            socket.emit("drawer", word);
            timeLeft = new TimeLeft((time)=>{
                if(time === 0){
                  io.in('draw').emit('stopCanvas');
                  let newDrawer = switchPlayers();
                  io.emit('serverMessage', generateMessage(`Nobody`, ` guessed the '${word}'. ${newDrawer.name} is now drawing`));
                  
                  wordScoreEmits();
                }
                io.emit('timeLeft', time);
              });
              timeLeft.startCountDown();

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
            io.in('draw').emit('stopCanvas');
            let drawer = users.getDrawer();
            users.addScore(socket.id);
            users.addScore(drawer.id);
            io.emit('chatWindow', generateMessage(user.name, msg));
            io.emit('serverMessage', generateMessage(`${user.name} `, `has guessed the word : ${word}`));
            switchPlayers(user);
            wordScoreEmits();
            timeLeft.resetTime();
        }else{
            io.emit('chatWindow', generateMessage(user.name, msg));

        }

    });
    
    socket.on('drawing', (pic)=>{
        io.in("guess").emit('drawing', pic);
      })
    
    socket.on('clear', ()=>{
        io.emit('clearCanvas');
    })

    socket.on('disconnect', ()=>{
        let user = users.removeUser(socket.id);
        // jezeli last user opuscił gre,  user == undefined
        if(user){
            // jezeli user byl rysownikiem
            if(user.canDraw){
                let newDrawer = switchPlayers()
                word = words.getRandomWord();
                io.emit('scoreBoard', users.users); 
                timeLeft.resetTime();
                if(!word){
                    return gameover();
                }
                io.in("draw").emit("drawer", word);
                socket.broadcast.emit('serverMessage', generateMessage(`Drawer`, ` has left the game. ${newDrawer.name} is now drawing`));    
            }else{
            socket.broadcast.emit('serverMessage', generateMessage(`${user.name} `, `has left the game`));
            }
        }
        if(!users.users.length){
            if(timeLeft){
             timeLeft.stopInterval();
             timeLeft.resetTime();
            }
        }   
    })

    function switchPlayers(user){
        if(!users.users.length){
            gameover();
            return false
        }
        let drawer = users.getDrawer();

        // Jezeli osoba rysująca opusciła gre, drawer == undefined, nalezy wylosować nowego rysującego
        if(!drawer){
            let newDrawer = users.pickRandomGuesser();
            let newDrawerSocket = io.sockets.connected[newDrawer.id];
            newDrawerSocket.leave('guess');
            newDrawerSocket.join('draw');
            newDrawer.canDraw = true;
            timeLeft.resetTime();
            return newDrawer;
        }
        if(users.users.length == 1){
            timeLeft.resetTime();
            return drawer;
        }
        let newDrawer = users.pickRandomGuesser();
        
        let drawerSocket = io.sockets.connected[drawer.id];
        drawerSocket.leave('draw');
        drawerSocket.join('guess');
        drawer.canDraw = false;
        // User ktory odgadł hasło, bedzie teraz rysować.
        if(user){
            let newDrawerSocket = io.sockets.connected[user.id];
            newDrawerSocket.leave('guess');
            newDrawerSocket.join('draw');
            user.canDraw = true;
            timeLeft.resetTime();
            return user;
        }
        let newDrawerSocket = io.sockets.connected[newDrawer.id];
        newDrawerSocket.leave('guess');
        newDrawerSocket.join('draw');
        newDrawer.canDraw = true;
        timeLeft.resetTime();
        return newDrawer;
      }

    function wordScoreEmits(){
        word = words.getRandomWord();
        
        io.emit('scoreBoard', users.users);
        io.emit('clearCanvas');
        if(!word){
            return gameover();
        }
        io.in("draw").emit("drawer", word);
        io.in("guess").emit('guess');
      }

      function gameover () {
        timeLeft.stopInterval();
        if(users.users.length > 0){
            io.emit('serverMessage', generateMessage(`Game Over`, `${users.users[0].name} is the winner`)); 
        }
      }
})

server.listen(port, () => {
    console.log(`Server is up on port ${port}`)
  })
  