import ConversationList from './ConversationList';
import ChatWindow from './ChatWindow';
import UserSearchModal from "./UserSearchModal.jsx";

const ChatLayout = ({conversations, activeConversation, onSelectConversation, onStartConversation }) => {
    return (
        <div style={{ display: 'flex', height: '100vh' }}>
            <div style={{ width: '30%', borderRight: '1px solid #ddd', padding: 10 }}>

                <UserSearchModal onSelectUser={onStartConversation} />

                <ConversationList
                    conversations={conversations}
                    onSelectConversation={onSelectConversation}
                    activeConversation={activeConversation}
                />
            </div>

            <div data-testid="chat-layout" style={{ flex: 1 }}>
                {activeConversation ? (
                    <ChatWindow conversation={activeConversation} />
                ) : (
                    <p style={{ padding: 20 }}>Select a conversation</p>
                )}
            </div>
        </div>
    );
};

export default ChatLayout;