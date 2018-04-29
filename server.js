const mongoose = require('mongoose');
const port = process.env.PORT || 8080;
const client = require('socket.io').listen(port).sockets;
console.log("App running on " + port);
const messageModel = require('./models/messageModel');

mongoose.connect(process.env.MONGODB_URI).then(() => {
    console.log("Connected to DB!");
    client.on('connection', function(socket) {

        function sendStatus(data) {

            socket.emit('status', data);
        }

        console.log("A user Connected!");
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
}).catch(err => {
    console.log(err.message);
})