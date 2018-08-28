const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname, '../public');
const port = 3000;

let app = express();
let server = http.createServer(app);
let io = socketIO(server);
app.use(express.static(publicPath));

io.on('connection', (socket)=>{
    console.log("connected");

    socket.on('disconnect', ()=>{
        console.log("disconnected");
    })
})

server.listen(port, () => {
    console.log(`Server is up on port ${port}`)
  })
  