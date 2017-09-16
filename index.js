'use strict';

const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const server = app.listen(3000, () => {
    console.log('listening on *:3000');
});

const io = require('socket.io')(server);
const env = process.env.NODE_ENV || 'development';

const room = require('./routes/room');
const helpers = require('./helpers');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('static'));

io.on('connection', helpers.handleConnection(io));

app.use((req, res, next) => {
    res.io = io;
    next();
});

app.get('/', (req, res) => {
    res.sendFile(`${__dirname}/views/index.html`);
});

app.use('/room', room);

if (env === 'development') {
    app.use((err, req, res, next) => {
        res.status(err.status || 500);

        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// on production do not leak stacktrace
app.use((err, req, res, next) => {
    res.status(err.status || 500);

    res.render('error', {
        message: err.message,
        error: {}
    });
});
