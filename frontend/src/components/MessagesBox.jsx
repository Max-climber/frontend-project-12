import { useSelector } from 'react-redux';
import { messagesSelectors } from '../features/messages/messagesSlice';

export default function MessagesBox({ currentChannelId }) {
  const allMessages = useSelector(messagesSelectors.selectAll);
  const messages = currentChannelId 
    ? allMessages.filter((m) => m.channelId === currentChannelId)
    : [];

  return (
    <div className="chat-messages overflow-auto px-5">
      {messages.map((msg) => (
        <div key={msg.id} className="text-break mb-2">
          <b>{msg.username}</b>: {msg.body}
        </div>
      ))}
    </div>
  );
}