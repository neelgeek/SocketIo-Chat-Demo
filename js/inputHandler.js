var textarea = document.getElementById("chat-textarea");
var Chatname = document.getElementById("chat-name");


try {
    var socket = io.connect('http://127.0.0.1:8080');
} catch (e) {
    console.log(e.message);
}

if (socket != undefined) {


    console.log("Connected!");
    textarea.addEventListener('keydown', function(event) {
        var self = this,
            name = Chatname.value;

        if (event.which === 13 && event.shiftKey === false) {
            socket.emit('input', {
                name: name,
                message: self.value
            })
            event.preventDefault();
        }


    });

    socket.on('status', function(data) {
        if (data === "clear") {
            textarea.value = '';
        } else if (data === 'error') {
            alert('Enter Name and Message');
        }
    });

} else {
    alert("Cannot Connect to Server!");
    location.reload();
}