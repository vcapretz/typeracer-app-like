'use strict';

const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const server = app.listen(3000, () => {
    console.log('listening on *:3000');
});

const io = require('socket.io')(server);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('static'));

function onConnection(socket) {
    console.log('connected to socket');

    socket.on('disconnect', () => {
        console.log('disconnected');
    });
}

io.on('connection', onConnection);

app.get('/', (req, res) => {
    res.sendFile(`${__dirname}/views/index.html`);
});
