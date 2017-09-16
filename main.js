const socket = io();

socket.on('event', (msg) => {
    console.log(msg);
});
