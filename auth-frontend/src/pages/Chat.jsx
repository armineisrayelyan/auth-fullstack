import {useEffect, useState} from "react";
import ChatLayout from "../components/ChatLayout.jsx";
import {getConversations} from "../api/conversations.js";
import api from "../api/axios.js";
import {socket} from "../api/socket.js";
import {useAuth} from "../context/AuthContext.jsx";

const Chat = () => {
    const [activeConversation, setActiveConversation] = useState(null);
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const currentUserId = user._id;

    useEffect(() => {
        getConversations()
            .then(setConversations)
            .finally(() => setLoading(false));
    }, [])

    useEffect(() => {
        socket.on('newMessage', (message) => {
            if (activeConversation?._id === message.conversationId) {
                socket.emit('markAsRead', message.conversationId);
            }
            setConversations(prev => {
                const updated = prev.map(c => {
                    if (c._id !== message.conversationId) return c;
                    const unread = {...c.unreadCount};
                    if (message.sender._id !== currentUserId) {
                        unread[currentUserId] = (unread[currentUserId] || 0) + 1;
                    }
                    return {
                        ...c,
                        lastMessage: message,
                        unreadCount: unread,
                    }
                })

                const index = updated.findIndex(c=>c._id === message.conversationId);
                const conv = updated[index];

                updated.splice(index,1);
                return [conv, ...updated];
            })
        });
        return () => socket.off('newMessage');
    }, [activeConversation]);

    useEffect(() => {
        socket.on('conversationUpdated', updated => {
            setConversations(prev =>
                prev.map(c =>
                    c._id === updated._id ? updated : c
                )
            );
        });
        return () => socket.off('conversationUpdated');
    },[]);

    const onStartConversation = async (user) => {
        const res = await api.post("/conversations", {
            userId: user._id,
        });
        const newConversation = res.data;
        setConversations(prev => {
            const exists = prev.find(c => c._id === newConversation._id);
            if (exists) return prev;
            return [newConversation, ...prev];
        });
        setActiveConversation(newConversation);
    };

    if (loading) return <p>Loading chats...</p>;

    console.log('activeConversation', activeConversation);
    return (
        <ChatLayout
            conversations={conversations}
            activeConversation={activeConversation}
            onSelectConversation={setActiveConversation}
            onStartConversation={onStartConversation}
        />
    )
}
export default Chat;