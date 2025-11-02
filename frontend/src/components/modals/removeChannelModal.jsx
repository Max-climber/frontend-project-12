import { useDispatch } from 'react-redux';
import { removeChannel, setCurrentChannelId } from '../../features/channels/channelsSlice';
import { removeMessagesByChannelsId } from '../../features/messages/messagesSlice';

export default function RemoveChannelModal({ onClose, channel }) {
  const dispatch = useDispatch();

  const handleRemove = () => {
    dispatch(removeChannel(channel.id));
    dispatch(removeMessagesByChannelsId(channel.id));
    dispatch(setCurrentChannelId(1)); // переходим в дефолтный канал
    onClose();
  };

  return (
    <div className="modal p-3">
      <h5>Удалить канал «{channel.name}»?</h5>
      <p>Вы уверены, что хотите удалить этот канал и все его сообщения?</p>
      <div className="d-flex justify-content-end mt-3">
        <button type="button" className="btn btn-secondary me-2" onClick={onClose}>
          Отмена
        </button>
        <button type="button" className="btn btn-danger" onClick={handleRemove}>
          Удалить
        </button>
      </div>
    </div>
  );
}