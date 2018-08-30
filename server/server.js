const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const {Users} = require('./utils/users');

const publicPath = path.join(__dirname, '../public');
const port = 3000;

let app = express();
let server = http.createServer(app);
let io = socketIO(server);
app.use(express.static(publicPath));

let users = new Users();

io.on('connection', (socket)=>{
    socket.on('joinGame', (userName)=>{
        if(!users.users.length){
            users.addUser(socket.id, userName, true);
        }else{
            users.addUser(socket.id, userName, false);
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
  