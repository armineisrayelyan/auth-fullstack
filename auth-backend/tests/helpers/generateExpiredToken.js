const jwt = require("jsonwebtoken");
exports.generateExpiredToken = (userId) => {
    return jwt.sign(
        { id: userId },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "0s" }
    );
};