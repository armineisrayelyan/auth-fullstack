const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

            const user = await User.findById(decoded.id).select('-password');
            if (!user) {
                console.log('No user found');
                return res.status(401).json({message: 'User no longer exists'});
            }

            req.user = user;
            next();
        } catch (error) {
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }
    if (!token) {
        console.log('No token found');
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
};

module.exports = { protect };
