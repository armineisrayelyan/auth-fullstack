import {useState} from "react";
import {socket} from "../api/socket.js";

const MessageInput = ({conversationId}) => {
    const [text, setText] = useState("");
    const [sending, setSending] = useState(false);

    const handleSend = async () => {
        if (!text.trim()) return;

        setSending(true);
        //const res = await sendMessage(conversationId, text)
        //onMessageSent(res)
        socket.emit('sendMessage', {
            conversationId,
            text,
        })
        setText('');
        setSending(false);
    };

    return (
        <div style={{ display: 'flex', padding: 8 }}>
            <input
                data-testid={`message-input`}
                name="message-input"
                value={text}
                onChange={(e) => setText(e.target.value)}
                style={{ flex: 1 }}
                placeholder="Type a message..."
            />
            <button onClick={handleSend} disabled={sending} data-testid='send-btn'>
                Send
            </button>
        </div>
    );
}

export default MessageInput;