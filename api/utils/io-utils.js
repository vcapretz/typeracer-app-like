const server = require('../index');
const { roomsInfo } = require('./rooms-utils');

const io = require('socket.io')(server);

function handleConnection(socket) {
    console.log('connected to socket');

    socket.on('enter room', (roomname) => {
        if (socket.room && socket.room !== roomname) {
            socket.leave(socket.room);
        }

        socket.join(roomname);
        io.to(roomname).emit('user entered room', roomsInfo[roomname]);
    });

    socket.on('disconnect', () => {
        console.log('disconnected');
    });
}

io.on('connection', handleConnection);

module.exports = {
    io,
};
