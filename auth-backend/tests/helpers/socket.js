const {io} = require('socket.io-client');

const connectSocket = (token) => {
    return io("http://localhost:4000", {
        auth: { token },
        transports: ['websocket'],
    });
}

module.exports = connectSocket;