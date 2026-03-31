const jwt = require('jsonwebtoken');
const User = require('../models/User');

const socketAuth = async (socket, next) => {
    console.log('Socket auth token:', socket.handshake.auth.token);

    try{
        const token = socket.handshake.auth?.token;

        if (!token) {
            console.log('No socket token');
            return next(new Error('Unauthorized'));
        }

        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decoded.id).select('-password');
        if (!user) {
            console.log('User not found for socket')
            return next(new Error('User not found'));
        }

        socket.user = user;
        console.log('Socket authenticated:', user.email);
        next();
    } catch(err) {
        console.log('Socket auth error:', err.message);
        next(new Error('Unauthorized'));
    }
}

module.exports = socketAuth;