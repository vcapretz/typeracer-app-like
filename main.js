const socket = io();

socket.on('requested join room', (roomname) => {
    socket.emit('enter room', roomname);
});

socket.on('user entered room', (msg) => {
    if (msg.users.length >= 2) {
        // enable button to start game
        // the button will emit a message to room
    }

    console.log(msg);
});
