const Conversation = require("../models/Conversation");

exports.getConversation = async (req, res) => {
    try {
        const conversations = await Conversation.find({
            participants: req.user.id,
        })
            .populate('participants', 'name email')
            .populate('lastMessage')
            .sort({ updatedAt: -1 });

        res.json(conversations);
    } catch (err) {
        res.status(500).json({ message: 'Failed to load conversations' });
    }
}

exports.startConversation  = async (req, res) => {
    const { userId } = req.body;

    if (!userId)
        return res.status(400).json({ message: 'userId is required' });

    try {
        // Check existing conversation
        let conversation = await Conversation.findOne({
            participants: { $all: [req.user.id, userId], $size: 2 },
        });

        if (!conversation) {
            conversation = await Conversation.create({
                participants: [req.user.id, userId],
                unreadCount: {
                    [req.user.id]: 0,
                    [userId]: 0
                },
            });

            await conversation.populate('participants', 'name');
        }

        res.status(200).json(conversation);
    } catch (err) {
        res.status(500).json({ message: 'Failed to create conversation' });
    }
}