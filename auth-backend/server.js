require('dotenv').config();
const http = require('http');
const mongoose = require('mongoose');
const { Server } = require('socket.io');
const app = require('./app');
const socketAuth =  require("./middleware/socketAuth");
const Message = require('./models/Message')
const Conversation = require('./models/Conversation')
const User = require('./models/User')

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173',
        credentials: true,
    }
})
io.use(socketAuth);
io.on('connection', async (socket) => {
    await User.findByIdAndUpdate(socket.user.id, {
        isOnline: true,
    })
    console.log('User connected:', socket.user.id);
    socket.join(socket.user.id);
    const conversations = await Conversation.find({
        participants: socket.user.id,
    });
    conversations.forEach(c=>{
        socket.join(c._id.toString());
    });
    console.log('Joined all conversations');

    socket.on('joinConversation',  async (conversationId) => {
        socket.join(conversationId);
        const conversation = await Conversation.findById(conversationId)
        if (!conversation) return;

        conversation.unreadCount.set(socket.user.id, 0);
        await conversation.save();
        const populated = await conversation.populate([
            {path: 'participants', select : 'name'},
            {path: 'lastMessage'}
            ])
        ;

        io.to(socket.id).emit('conversationUpdated', populated);
    });

    socket.on('sendMessage', async ({conversationId, text}) => {
        const conversation = await Conversation.findById(conversationId);
        if (!conversation) return;

        const message = await Message.create({
            conversationId,
            sender: socket.user.id,
            text,
        });

        conversation.lastMessage = message._id;

        conversation.participants.forEach(userId => {
            if (userId.toString() !== socket.user.id){
                const current = conversation.unreadCount.get(userId.toString()) || 0;
                conversation.unreadCount.set(userId.toString(), current + 1);
            }
        });
        await conversation.save();
        const updatedConversation = await conversation.populate([
                {path: 'participants', select : 'name'},
                {path: 'lastMessage'}
            ])
        ;


        const populated = await message.populate('sender', 'name');
        io.to(conversationId).emit('newMessage', populated);
        io.to(conversationId).emit('conversationUpdated', updatedConversation);
    });
    socket.on('disconnect', async () => {
        console.log('User disconnected:', socket.user.id);
        await User.findByIdAndUpdate(socket.user.id, {
            isOnline: false,
            lastSeen: new Date(),
        });
    })
    socket.on('markAsRead', async (conversationId) => {
        const conversation = await Conversation.findById(conversationId);
        if (!conversation) return;
        conversation.unreadCount.set(socket.user.id,0);
        await conversation.save();
        const updatedConversation = await conversation.populate([
                {path: 'participants', select : 'name'},
                {path: 'lastMessage'}
            ])
        ;
        io.to(socket.id).emit('conversationUpdated', updatedConversation);
    })
})


if (process.env.NODE_ENV !== "test") {
    server.listen(3000, () => {
        console.log('Server running on port 3000');
    });
}

module.exports = { io, server };