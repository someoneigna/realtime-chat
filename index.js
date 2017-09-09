const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const path = require('path');

const port = 3001;

app.use(express.static(path.join(__dirname, 'client/build/')));

http.listen(port, function() {
    console.log(`Listening on ${port}`);
});

let users = [];

io.on('connection', function(socket) {    

    socket.on('connected', function(nickname) {
        socket.username = nickname;
        console.log(`User connected:${socket.username}`);
        users.push(nickname);        
        io.emit('users_status', users);
    });

    socket.on('disconnect', function() {
        users = users.filter(u => u !== socket.username);
        console.log(`User disconnected:${socket.username}`);
        io.emit('users_status', users);
    });

    socket.on('message', function(message) {
        io.emit('message', { username: socket.username, text: message });
        console.log(`${socket.username}: ${JSON.stringify(message)}`);
    })
});