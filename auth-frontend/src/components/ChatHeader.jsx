import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export default function ChatHeader({ otherUser }) {
    return (
        <div>
            <h3>{otherUser.name}</h3>
            <span>
                {otherUser.isOnline ? 'Online'
                    : `Last seen ${dayjs(otherUser.lastSeen).fromNow()}`}
            </span>
        </div>
    );
}