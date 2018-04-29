const mongoose = require('mongoose');
const client = require('socket.io').listen(8080).sockets;
const messageModel = require('./models/messageModel');

mongoose.connect('mongodb://localhost/chat').then(() => {
    console.log("Connected to DB!");
    client.on('connection', function(socket) {

        function sendStatus(data) {

            socket.emit('status', data);
        }

        console.log("A user Connected!");
        socket.on('input', function(data) {

            whiteSpace = /^\s*$/;
            if (whiteSpace.test(data.name) || whiteSpace.test(data.message)) {
                console.log("Invalid");
                sendStatus('error');
            } else {
                let newMessage = new messageModel(data);
                newMessage.save().then((result) => {
                    console.log(result);
                    sendStatus('clear');
                });
            }

        });
    })
}).catch(err => {
    console.log(err.message);
})