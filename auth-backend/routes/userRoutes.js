const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const {getProfile, searchUsers} = require("../controllers/userController");
const router = express.Router();

router.get('/profile', protect, getProfile);

router.get('/search', protect, searchUsers);

module.exports = router;
