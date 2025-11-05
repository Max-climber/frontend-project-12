import { useDispatch, useSelector } from 'react-redux';
import { addMessage } from '../features/messages/messagesSlice';

export default function MessageForm() {
  const dispatch = useDispatch();
  const currentChannelId = useSelector((state) => state.channels?.currentChannelId);
  const username = useSelector((state) => state.user.username);

  const handleSubmit = (e) => {
    e.preventDefault();
    const text = e.target.elements.message.value.trim();
    if (!text || !currentChannelId) return;

    dispatch(addMessage({
      id: Date.now(),
      body: text,
      channelId: currentChannelId,
      username,
    }));

    e.target.reset();
  };

  return (
    <form onSubmit={handleSubmit} className="mt-auto px-5 py-3">
      <div className="input-group">
        <input name="message" placeholder="Введите сообщение..." className="form-control" />
        <button type="submit" className="btn btn-primary">Отправить</button>
      </div>
    </form>
  );
}