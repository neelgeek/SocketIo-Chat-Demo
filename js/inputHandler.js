var textarea = document.getElementById("chat-textarea");
var Chatname = document.getElementById("chat-name");
var messages = document.getElementById("chat-messages");
var usercount = document.getElementById("usercount");


$.ajax({
        type: 'POST',
        url: 'https://api.codetunnel.net/random-nick',
        dataType: 'json',
        data: JSON.stringify({})
    })
    .done(function(r) {
        Chatname.value = r.nickname;
    });




try {
    var socket = io.connect('https://neel-test-chat.herokuapp.com');
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

    socket.on('output', function(data) {
        data.forEach(message => {
            let msg = document.createElement('div');
            msg.setAttribute('class', 'chat-message');
            msg.textContent = message.name + ": " + message.message;
            messages.appendChild(msg);
            messages.scrollTo(0, messages.scrollHeight);

            //messages.insertBefore(msg, messages.firstChild);
        });

    });

    socket.on('count', function(data) {
        console.log(data);
        usercount.innerText = "Users Online : " + data;
    });

    window.onload = function() {
        if (localStorage.getItem("hasCodeRunBefore") === null) {
            socket.emit('join', {});
            localStorage.setItem("hasCodeRunBefore", true);
        }
    }

    window.onbeforeunload = function() {
        socket.emit('leave', {});
        localStorage.removeItem("hasCodeRunBefore");
    }


} else {
    alert("Cannot Connect to Server!");
    location.reload();
}