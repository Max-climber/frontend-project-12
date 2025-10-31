import { useDispatch } from 'react-redux';
import {  setChannels, addChannel, removeChannel, renameChannel, setCurrentChannelId } from '../../features/channels/channelsSlice';
import { removeMessagesByChannelsId } from '../../features/messages/messagesSlice';
import socket from '../../socket';

export default function RemoveChannelModal({ onClose, channel }) {
  const dispatch = useDispatch();

  const handleRemove = () => {
    socket.emit('removeChannel', { id: channel.id }, () => {
      dispatch(removeChannel(channel.id));
      dispatch(removeMessagesByChannelsId(channel.id));
      dispatch(setCurrentChannelId(1)); // дефолтный канал
      onClose();
    });
  };

  return (
    <div className="modal">
      <p>Удалить канал <b>{channel.name}</b>?</p>
      <h3>Уверены?</h3>
      <button type="button" className="btn btn-danger" onClick={handleRemove}>Удалить</button>
      <button type="button" className="btn btn-secondary" onClick={onClose}>Отмена</button>
    </div>
  );
}