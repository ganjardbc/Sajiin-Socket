const express = require('express');
const app = express();
const http = require('http');
const port = 9999;
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, { cors: { origin: '*' } });

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
    console.log('user id => ', socket.id)
})
    
server.listen(port, () => {
    console.log('listening on *:' + port);
});