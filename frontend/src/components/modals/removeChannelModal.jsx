import { useDispatch } from 'react-redux';
import { setCurrentChannelId } from '../../features/channels/channelsSlice';
import { removeMessagesByChannelsId } from '../../features/messages/messagesSlice';
import api from '../../api/axios';

export default function RemoveChannelModal({ onClose, channel }) {
  const dispatch = useDispatch();

  const handleRemove = async () => {
    try {
      const apiPath = import.meta.env.PROD ? `/api/v1/channels/${channel.id}` : `/api/channels/${channel.id}`;
      await api.delete(apiPath);
    
      dispatch(removeMessagesByChannelsId(channel.id));
      dispatch(setCurrentChannelId(1)); // переходим в дефолтный канал
      onClose();
    } catch (error) {
      console.error('Ошибка при удалении канала:', error);
    }
  };

  return (
    <>
      <div className="modal-header">
        <h5 className="modal-title">Удалить канал</h5>
        <button type="button" className="btn-close" onClick={onClose}></button>
      </div>
      <div className="modal-body">
        <p>Вы уверены, что хотите удалить канал «{channel.name}» и все его сообщения?</p>
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" onClick={onClose}>
          Отмена
        </button>
        <button type="button" className="btn btn-danger" onClick={handleRemove}>
          Удалить
        </button>
      </div>
    </>
  );
}