'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const faker = require('faker');
const moment = require('moment');

const app = express();

const server = app.listen(3000, () => {
    console.log('listening on *:3000');
});

const io = require('socket.io')(server);

const roomsInfo = {};
const maxWordsPerGame = 100;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('static'));

function onConnection(socket) {
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

io.on('connection', onConnection);

app.get('/', (req, res) => {
    res.sendFile(`${__dirname}/views/index.html`);
});

app.get('/room/:roomname/user/:username', (req, res) => {
    const { roomname, username } = req.params;

    if (!roomsInfo[roomname]) {
        roomsInfo[roomname] = {
            roomname,
            users: [],
            text: faker.random.words(Math.random() * maxWordsPerGame),
            ranking: [],
            created_at: moment()
        };
    }

    if (roomsInfo[roomname].users.indexOf(username) !== -1) {
        return res.status(403).json(`user ${username} already joined ${roomname}`);
    }

    roomsInfo[roomname].users.push({ username });
    io.emit('requested join room', roomname);

    res.json(`entered room ${roomname}`);
});

app.get('/room/:roomname/status', (req, res) => {
    const { roomname } = req.params;

    if (!roomsInfo[roomname]) {
        return res.status(404).json(`room ${roomname} do not exists ):`);
    }

    const currentTime = moment();
    const secondsToRoomCreated = currentTime.diff(roomsInfo[roomname].created_at, 'seconds');

    res.json({
        active_users: roomsInfo[roomname].users.length,
        keystrokes: 1,
        active_since: secondsToRoomCreated,
        below_mean: 4,
        ranking: roomsInfo[roomname].ranking,
        last_minute_lead: 10,
    });
});
