const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const userRoutes = require('./routes/userRoutes');
const conversationRoutes = require('./routes/conversations.routes');
const messagesRoutes = require('./routes/messages.routes');

const app = express();

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));

app.use(express.json());
app.use(cookieParser());
app.get('/health', (req, res) =>
    res.send('OK')
);

app.use('/api/user', userRoutes)
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/conversations', conversationRoutes);
app.use('/api/conversations', messagesRoutes);

module.exports = app;