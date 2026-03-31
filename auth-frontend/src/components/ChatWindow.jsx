import {useEffect, useState} from "react";
import {useAuth} from "../context/AuthContext.jsx";
import {getMessages} from "../api/messages.js";
import MessageInput from "./MessageInput.jsx";
import {socket} from "../api/socket.js";

const ChatWindow = ({conversation}) => {
    const { user } = useAuth();
    const [messages, setMessages] = useState([]);
    useEffect(() => {
        getMessages(conversation._id)
            .then(setMessages);
        if (!conversation) return;

        socket.emit('joinConversation', conversation._id);
        socket.on('newMessage', (message) => {
            if (message.conversationId === conversation._id) {
                setMessages((prev) => [...prev, message]);
            }
        });
        return () => {
            socket.off('newMessage');
        };
    }, [conversation])

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div data-testid='messages' style={{ flex: 1, padding: 16, overflowY: 'auto' }}>
                {messages.map((m) => {
                    return (
                        <div
                            key={m._id}
                            style={{
                                textAlign: m.sender._id === user._id ? 'right' : 'left',
                                marginBottom: 8,
                            }}
                        >
                            <strong>{m.sender.name}</strong>
                            <p>{m.text}</p>
                        </div>
                    )
                })}
            </div>

            <MessageInput
                conversationId={conversation._id}
            />
        </div>
    );
};

 export default ChatWindow;