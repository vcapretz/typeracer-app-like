const express = require('express');
const faker = require('faker');
const moment = require('moment');

const helpers = require('../helpers');
const router = express.Router();

const roomsInfo = helpers.roomsInfo;
const maxWordsPerGame = 100;

router.get('/:roomname/user/:username', (req, res) => {
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
    res.io.emit('requested join room', roomname);

    res.json(`entered room ${roomname}`);
});

router.get('/:roomname/status', (req, res) => {
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

module.exports = router;