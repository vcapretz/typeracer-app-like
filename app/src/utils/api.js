import openSocket from 'socket.io-client';
import * as axios from 'axios';

const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3000';
const socket = openSocket(apiUrl);

socket.on('requested join room', (roomname) => {
    socket.emit('enter room', roomname);
});

export async function joinRoom(roomname, username) {
    let join;

    try {
        join = await axios.get(`${apiUrl}/room/${roomname}/user/${username}`);
    } catch (e) {
        throw e;
    }

    return join.data;
}

export default socket;

export function waitNewUsers(callback) {
    socket.on('user entered room', (msg) => {
        callback(msg);
    });
}

export function gameStatus(callback) {
    socket.on('game status changed', (msg) => {
        callback(msg);
    });
}

export async function startCounter(roomname) {
    let start;

    try {
        start = await axios.get(`${apiUrl}/room/${roomname}/start`);
    } catch (e) {
        throw e;
    }

    return start.data;
}

export async function refreshStatus(roomname) {
    let status;

    try {
        status = await axios.get(`${apiUrl}/room/${roomname}/status`);
    } catch (e) {
        throw e;
    }

    return status.data;
}
