const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const Conversation = require('../models/Conversation');
const { protect } = require('../middleware/authMiddleware');

router.get('/:id/messages', protect, async (req, res) => {
    try {
        const messages = await Message.find({
            conversationId: req.params.id,
        })
            .populate('sender', 'name email')
            .sort({ createdAt: 1 });

        res.json(messages);
    } catch (err) {
        res.status(500).json({ message: 'Failed to load messages' });
    }
});

router.post('/:id/messages', protect, async (req, res) => {
    const { text } = req.body;
    if (!text)
        return res.status(400).json({ message: 'Message text is required' });

    try {
        const message = await Message.create({
            conversationId: req.params.id,
            sender: req.user._id,
            text,
        });

        // Update lastMessage
        await Conversation.findByIdAndUpdate(req.params.id, {
            lastMessage: message._id,
            updatedAt: new Date(),
        });

        await message.populate('sender', 'name email');

        res.status(201).json(message);
    } catch (err) {
        res.status(500).json({ message: 'Failed to send message' });
    }
});

module.exports = router;