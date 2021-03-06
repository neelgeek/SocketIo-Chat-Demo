const mongoose = require('mongoose');
const port = process.env.PORT || 8080;
const client = require('socket.io').listen(port).sockets;
console.log("App running on " + port);
const messageModel = require('./models/messageModel');
//const userCount = require('./models/userCount');
var users = 0;

mongoose.connect(process.env.MONGODB_URI).then(() => {
    console.log("Connected to DB!");
    client.on('connection', function(socket) {



        function sendStatus(data) {
            socket.emit('status', data);
        }


        messageModel.find().limit(100).sort({ _id: -1 }).then(data => {
            data.reverse();
            socket.emit('output', data);
        })


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
                    client.emit('output', [result]);
                });
            }

        });

        socket.on('join', function(d) {
            console.log("A user Connected!");
            users += 1;
            client.emit('count', users);
            console.log(users);
        });

        socket.on('leave', function(d) {
            console.log("A user left");
            if (users > 0) {
                users -= 1;
            }
            client.emit('count', users);
            console.log(users);
        });
    })

}).catch(err => {
    console.log(err.message);
})