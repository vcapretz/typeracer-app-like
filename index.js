'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const faker = require('faker');

const app = express();

const server = app.listen(3000, () => {
    console.log('listening on *:3000');
});

const io = require('socket.io')(server);

const roomsInfo = {};

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('static'));

function onConnection(socket) {
    console.log('connected to socket');

    socket.on('enter room', (roomname) => {
        if (socket.room && socket.room !== roomname) {
            socket.leave(socket.room);
        }

        socket.join(roomname);
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
            text: faker.random.words(Math.random() * 100),
            ranking: []
        };
    }

    if (roomsInfo[roomname].users.indexOf(username) !== -1) {
        return res.status(403).json(`user ${username} already joined ${roomname}`);
    }

    roomsInfo[roomname].users.push({ username });
    io.emit('requested join room', roomname);
    io.to(roomname).emit('user entered room', roomsInfo[roomname]);

    res.json(`entered room ${roomname}`);
});
