import {useAuth} from "../context/AuthContext.jsx";

const ConversationList = ({conversations, onSelectConversation, activeConversation }) => {
    console.log(conversations);
    const { user } = useAuth();
    return (
        <ul>
            {conversations.map((c) => {
                const unread = c.unreadCount?.[user._id] || 0;
                return (
                    <li
                        data-testid={`conversation-${c._id}`}
                        key={c._id}
                        onClick={() => onSelectConversation(c)}
                        style={{
                            padding: 12,
                            cursor: 'pointer',
                            background:
                                activeConversation?._id === c._id ? '#eee' : 'transparent',
                        }}
                    >
                        {c.participants.map(p => p.name).join(', ')}
                        <br />
                        <small data-testid={`${c._id}-unread-count`}>
                            {unread > 1 ? `${unread} unread messages`
                            : c.lastMessage?.text}
                        </small>
                    </li>
                )
            })}
        </ul>
    )
}
export default ConversationList;