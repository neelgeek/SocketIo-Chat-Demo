const mongoose = require('mongoose');
const port = process.env.PORT || 8080;
const client = require('socket.io').listen(port).sockets;
console.log("App running on " + port);
const messageModel = require('./models/messageModel');
const userCount = require('./models/userCount');
var users = 0;

mongoose.connect(process.env.MONGODB_URI).then(() => {
    console.log("Connected to DB!");
    client.on('connection', function(socket) {


        // userCount.findOneAndUpdate({ "name": "master" }, { $inc: { "users": 1 } }).then(data => {
        //     socket.emit('count', data);
        // }).catch(err => {
        //     console.log(err.message);
        // });

        function sendStatus(data) {
            client.emit('status', data);
        }

        console.log("A user Connected!");
        users += 1;
        socket.emit('count', users);
        console.log(users);
        messageModel.find().limit(100).sort({ _id: 1 }).then(data => {
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
    })


    client.on('disconnect', function(socket) {
        users -= 1;
        console.log("A user left");
        client.emit('count', users);
        console.log(users);
        // userCount.findOneAndUpdate({ "name": "master" }, { $inc: { "users": -1 } }).then(data => {
        //     socket.emit('count', data);
        // }).catch(err => {
        //     console.log(err.message);
        // });
    })
}).catch(err => {
    console.log(err.message);
})