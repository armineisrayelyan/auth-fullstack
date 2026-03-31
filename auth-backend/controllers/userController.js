const User = require('../models/User');

exports.getProfile = async (req, res) => {
    res.json(req.user);
};

exports.searchUsers = async (req, res) => {
    const q = req.query.q;

    if (!q) return res.json([]);

    const users = await User.find({
        name: { $regex: q, $options: 'i' },
        _id: { $ne: req.user._id },
    }).select('_id name email');

    res.json(users);
};
