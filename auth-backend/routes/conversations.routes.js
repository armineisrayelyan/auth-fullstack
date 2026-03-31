const express = require('express');
const router = express.Router();
const {protect} = require("../middleware/authMiddleware");
const {
    startConversation,
    getConversation
} = require("../controllers/conversationController");

router.get('/', protect, getConversation);

router.post('/', protect, startConversation);

module.exports = router;