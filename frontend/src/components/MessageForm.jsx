import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { filterProfanity } from '../utils/profanityFilter';

export default function MessageForm() {
  const { t } = useTranslation();
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
      // Фильтруем нецензурные слова перед отправкой
      const filteredText = filterProfanity(text);
      // В dev-режиме proxy переписывает /api на /api/v1
      // В prod используем прямой путь /api/v1
      // Socket событие newMessage придет автоматически от сервера
      // и обработается в ChatPage, поэтому здесь не нужно обновлять store
      const apiPath = import.meta.env.PROD ? '/api/v1/messages' : '/api/messages';
      const response = await axios.post(apiPath, {
        body: filteredText,
        channelId: currentChannelId,
        username,
      }, { headers });
      
      console.log('Сообщение отправлено через API:', response.data);
      e.target.reset();
    } catch (error) {
      console.error('Ошибка при отправке сообщения:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-auto px-5 py-3">
      <div className="input-group">
        <input 
          name="message" 
          placeholder={t('messages.placeholder')} 
          className="form-control"
          aria-label={t('messages.newMessage')}
        />
        <button type="submit" className="btn btn-primary">{t('messages.send')}</button>
      </div>
    </form>
  );
}