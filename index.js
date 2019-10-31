const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const data = require('./ANDis.json')

app.get('/', function(req, res) {
    res.render('index.ejs');
});

io.sockets.on('connection', function(socket) {
    socket.on('username', function(username) {
        socket.username = username;

        var names = [];

        for (i=0; i<=data.length-1; i++) {
            names[i] = data[i].name;
            if(data[i].name == username){
                image = data[i].image;
                title = data[i].title;
            }
        } 

        if(names.includes(username)){
            console.log('pass');
            socket.image = image;
            socket.title = title;
        }else{
            console.log('fail');
            socket.username = 'Sorry, you are not an ANDi';
            socket.image = '';
            socket.title = 'we dont want you here';
        }

        io.emit('is_online', `<i><img src='${socket.image}' height='30'> ${socket.username} <b>AND</b> ${socket.title} join the chat..</i>`);
    });

    socket.on('disconnect', function(username) {
        io.emit('is_online', `🔴 <i>${socket.username} <b>AND</b> ${socket.title} left the chat..</i>`);
    })

    socket.on('chat_message', function(message) {
        io.emit('chat_message', '<strong>' + socket.username + '</strong>: ' + message);
    });

});

const PORT = process.env.PORT || 80;
const server = http.listen(PORT, function() {
    console.log('listening on *:80');
});