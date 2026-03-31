const jwt = require('jsonwebtoken');
const User = require('../models/User');
const {
    generateAccessToken,
    generateRefreshToken,
} = require('../utils/generateToken');

exports.register = async function (req, res) {
    try{
        const {name, email, password} = req.body;
        let existingUser = await User.findOne({email});
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        if(existingUser){
            return res.status(400).json({message:"User already exists"});
        }
        const user = await User.create({ name, email, password });
        const accessToken = generateAccessToken(user._id)
        const refreshToken = generateRefreshToken(user._id);

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: false, // true in production (HTTPS)
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        res.status(201).json({
            message: 'User registered successfully',
            accessToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (err){
        console.log(err.message);
        res.status(500).send( 'Server error');
    }
}
exports.login = async function (req, res) {
    try{
        const {email, password} = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password required' });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const accessToken = generateAccessToken(user._id)
        const refreshToken = generateRefreshToken(user._id);

        // Store refresh token securely
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: false, // true in production (HTTPS)
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        res.json({
            message: 'Login successful',
            accessToken,
            user,
        });
    }catch (err){
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
}
exports.refreshToken = (req, res) => {
    try {
        const refreshToken = req.cookies?.refreshToken;
        if (!refreshToken) return res.sendStatus(401);

        jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
            async (err, decoded) => {
                console.log('JWT verify error:', err);
                console.log('Decoded token:', decoded);

                if (err) return res.sendStatus(403);

                const accessToken = generateAccessToken(decoded.id);
                const user = await User.findById(decoded.id)
                    .select('-password');

                res.json({
                    accessToken,
                    user,
                });
            }
        );
    } catch (err) {
        console.error('Refresh crash:', err);
        res.sendStatus(500);
    }
}

exports.logout = (req, res) => {
    res.clearCookie('refreshToken', {
        httpOnly: true,
        sameSite: 'lax',
        secure: false, // true in prod
        path: '/',
    });
    res.status(200).json({ message: 'Logged out' });//204 without message use it
}
