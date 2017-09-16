import openSocket from 'socket.io-client';
import * as axios from 'axios';

const apiUrl = process.env.API_URL || 'http://localhost:3000';
const socket = openSocket(apiUrl);

socket.on('requested join room', (roomname) => {
    socket.emit('enter room', roomname);
});

socket.on('user entered room', (msg) => {
    if (msg.users.length >= 2) {
        // enable button to start game
        // the button will emit a message to room
    }

    console.log(msg);
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
