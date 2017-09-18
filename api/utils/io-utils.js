const { roomsInfo } = require('./rooms-utils');

function handleConnection(io) {
    return function events(socket) {
        console.log('connected to socket');

        socket.on('enter room', (roomname) => {
            if (socket.room && socket.room !== roomname) {
                socket.leave(socket.room);
            }

            socket.join(roomname);
            io.to(roomname).emit('user entered room', roomsInfo[roomname]);
        });

        socket.on('disconnect', () => {
            if (socket.room) {
                socket.leave(socket.room);
            }

            console.log('disconnected');
        });
    };
}

module.exports = {
    handleConnection,
};
