const mongoose = require('mongoose');
const client = require('socket.io').listen(8080).sockets;

mongoose.connect('mongodb://localhost/chat').then(() => {
    console.log("Connected to DB!");
    client.on('connection', function(socket) {
        console.log("A user Connected!");
        socket.on('input', function(data) {

            whiteSpace = /^\s*$/;
            if (whiteSpace.test(data.name) || whiteSpace.test(data.message)) {
                console.log("Invalid");
            } else {
                console.log(data);
            }

        });
    })
}).catch(err => {
    console.log(err.message);
})