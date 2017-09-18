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
                created_at: moment(),
            };
        }

        if (roomsInfo[roomname].users.find(user => user.username === username)) {
            ctx.status = 403;
            ctx.body = { errors: `user ${username} already joined ${roomname}` };
            return await next();
        }

        roomsInfo[roomname].users.push({ username, typeHistory: [] });

        ctx.res.io.emit('requested join room', roomname);

        ctx.status = 200;
        ctx.body = roomsInfo[roomname];

        await next();
    } catch (err) {
        ctx.throw(500, err);
    }
};

function calculateScore(start, end, correctKeys) {
    const timeDiff = start.diff(end, 'milliseconds');

    if (timeDiff === 0) {
        return 0;
    }

    return (correctKeys / timeDiff).toFixed(2);
}

function calculateTotalRanking(roomInfo) {
    return roomInfo.users
        .map((user) => {
            if (user.typeHistory.length === 0) {
                return [user.username, 0];
            }

            const timeFirstKeyPressed = user.typeHistory[0].typed_at;
            const timeLastKeyPressed = user.typeHistory[user.typeHistory.length - 1].typed_at;

            const correctKeys = user.typeHistory
                .filter(keyInfo => keyInfo.key === roomInfo.text[keyInfo.index]).length;

            const score = calculateScore(timeLastKeyPressed, timeFirstKeyPressed, correctKeys);
            return [user.username, score];
        })
        .sort((a, b) => b[1] - a[1]);
}

function calculateLastMinuteRanking(roomInfo) {
    const now = moment();

    return roomInfo.users
        .map((user) => {
            if (user.typeHistory.length === 0) {
                return [user.username, 0];
            }

            const timeFirstKeyPressed = user.typeHistory[0].typed_at;
            const timeLastKeyPressed = user.typeHistory[user.typeHistory.length - 1].typed_at;

            const correctKeys = user.typeHistory
                .filter(keyInfo => now.diff(keyInfo.typed_at, 'seconds') <= 60)
                .filter(keyInfo => keyInfo.key === roomInfo.text[keyInfo.index]).length;

            const score = calculateScore(timeLastKeyPressed, timeFirstKeyPressed, correctKeys);
            return [user.username, score];
        })
        .sort((a, b) => b[1] - a[1]);
}

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

        const arrayKeysTyped = roomsInfo[roomname].users
            .reduce((prev, user) => prev.concat(user.typeHistory), []);

        const ranking = calculateTotalRanking(roomsInfo[roomname]);

        const mean = ranking.reduce((prev, position) => prev + position[1], 0) / ranking.length;
        const belowMean = ranking.filter(position => position[1] < mean).length;

        ctx.status = 200;
        ctx.body = {
            active_users: roomsInfo[roomname].users.length,
            keystrokes: arrayKeysTyped.length,
            active_since: secondsToRoomCreated,
            below_mean: belowMean,
            ranking,
            last_minute_lead: calculateLastMinuteRanking(roomsInfo[roomname])[0][0],
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
