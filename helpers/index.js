module.exports = {
    handleConnection(io) {
        const roomsInfo = this.roomsInfo;

        return function (socket) {
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
    },
    roomsInfo: {},
}