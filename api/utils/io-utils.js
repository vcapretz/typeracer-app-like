const moment = require('moment');

const { roomsInfo } = require('./rooms-utils');

function handleConnection(io) {
    return function events(socket) {
        console.log('connected to socket');

        socket.on('enter room', (roomname) => {
            socket.join(roomname);
            io.to(roomname).emit('user entered room', roomsInfo[roomname]);
        });

        socket.on('user typing', (newData) => {
            const { roomname, username, key, index } = newData;

            if (roomname && username && roomsInfo[roomname]) {
                const userIndex = roomsInfo[roomname].users
                    .findIndex(user => user.username === username);

                if (userIndex >= 0) {
                    roomsInfo[roomname].users[userIndex].typeHistory
                        .push(Object.assign({}, { username, key, index, typed_at: moment() }));
                }
            }
        });

        socket.on('disconnect', () => { // on disconnect user already leaves channel
            console.log('disconnected');
        });
    };
}

module.exports = {
    handleConnection,
};
