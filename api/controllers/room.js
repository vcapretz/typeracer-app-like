/* eslint-disable consistent-return */
const faker = require('faker');
const moment = require('moment');

const roomsUtils = require('../utils/rooms-utils');

const { roomsInfo, maxWordsPerGame } = roomsUtils;

/**
 * join  - Returns JSON for room information
 * @returns {Object}  - Single room object
 */
exports.join = async (ctx, next) => {
    try {
        const { roomname, username } = ctx.params;

        if (!roomsInfo[roomname]) {
            roomsInfo[roomname] = {
                roomname,
                users: [],
                text: faker.random.words(Math.random() * maxWordsPerGame),
                ranking: [],
                created_at: moment(),
            };
        }

        if (roomsInfo[roomname].users.find(user => user.username === username)) {
            ctx.status = 403;
            ctx.body = { errors: `user ${username} already joined ${roomname}` };
            return await next();
        }

        roomsInfo[roomname].users.push({ username });

        ctx.res.io.emit('requested join room', roomname);

        ctx.status = 200;
        ctx.body = roomsInfo[roomname];

        await next();
    } catch (err) {
        ctx.throw(500, err);
    }
};

/**
 * status  - Returns status JSON for a specif room
 * @returns {Object}  - Status object
 */
exports.status = async (ctx, next) => {
    try {
        const { roomname } = ctx.params;
        const currentTime = moment();
        const secondsToRoomCreated = currentTime.diff(roomsInfo[roomname].created_at, 'seconds');

        if (!roomsInfo[roomname]) {
            ctx.status = 404;
            ctx.body = { errors: `room ${roomname} do not exists ):` };
            return await next();
        }

        ctx.status = 200;
        ctx.body = {
            active_users: roomsInfo[roomname].users.length,
            keystrokes: 1,
            active_since: secondsToRoomCreated,
            below_mean: 4,
            ranking: roomsInfo[roomname].ranking,
            last_minute_lead: 10,
        };

        await next();
    } catch (err) {
        ctx.throw(500, err);
    }
};

/**
 * start  - Starts active time of room
 * @returns {Object}  - Success/Error message
 */
exports.start = async (ctx, next) => {
    try {
        const { roomname } = ctx.params;
        const currentTime = moment();

        if (!roomsInfo[roomname]) {
            ctx.status = 404;
            ctx.body = { errors: `room ${roomname} do not exists ):` };
            return await next();
        }

        roomsInfo[roomname].started_at = currentTime;

        ctx.status = 200;
        ctx.body = roomsInfo[roomname];

        ctx.res.io.to(roomname).emit('game status changed', roomsInfo[roomname]);

        await next();
    } catch (err) {
        ctx.throw(500, err);
    }
};
