const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

io.on('connection', (socket) => {
    socket.on('visible', () => {
        console.log('user visible');
    });
})

io.on('connection', (socket) => {
    socket.on('chat_message', (msg) => {
        console.log('message: ' + msg)
    })
})

io.on('connection', (socket) => {
    socket.on('chat_message', (msg) => {
        io.emit('chat_message', msg)
    })
})

// io.on('connection', (socket) => {
//     socket.broadcast.emit('hi there!!');
// })

server.listen(3000, () => {
  console.log('listening on *:3000');
});