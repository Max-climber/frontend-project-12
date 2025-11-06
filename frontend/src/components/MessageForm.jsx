import { useSelector } from 'react-redux';
import axios from 'axios';

export default function MessageForm() {
  const currentChannelId = useSelector((state) => state.channels?.currentChannelId);
  const username = useSelector((state) => state.user.username);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const text = e.target.elements.message.value.trim();
    if (!text || !currentChannelId) return;

    try {
      const token = localStorage.getItem('token');
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      // В dev-режиме proxy переписывает /api на /api/v1
      // В prod используем прямой путь /api/v1
      // Socket событие newMessage придет автоматически от сервера
      // и обработается в ChatPage, поэтому здесь не нужно обновлять store
      const apiPath = import.meta.env.PROD ? '/api/v1/messages' : '/api/messages';
      await axios.post(apiPath, {
        body: text,
        channelId: currentChannelId,
        username,
      }, { headers });
      
      e.target.reset();
    } catch (error) {
      console.error('Ошибка при отправке сообщения:', error);
    }
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