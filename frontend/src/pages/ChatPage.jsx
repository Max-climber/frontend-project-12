import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setChannels, setCurrentChannelId, addChannel, removeChannel, renameChannel } from '../features/channels/channelsSlice';
import { setMessages, addMessage, removeMessagesByChannelsId } from '../features/messages/messagesSlice';
import ChannelsList from '../components/ChannelsList';
import MessagesBox from '../components/MessagesBox';
import MessageForm from '../components/messageForm';
import AddChannelModal from '../components/modals/AddChannelModal';
import RemoveChannelModal from '../components/modals/removeChannelModal';
import RenameChannelModal from '../components/modals/renameChannelModal';
import api from '../api/axios';
import socket from '../socket';

const ChatPage = () => {
  const [modalType, setModalType] = useState(null);
  const [modalChannel, setModalChannel] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentChannelId = useSelector((state) => state.channels?.currentChannelId);

  const openModal = (type, channel = null) => {
    setModalType(type);
    setModalChannel(channel);
  };

  const closeModal = () => {
    setModalType(null);
    setModalChannel(null);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        // Получаем каналы и сообщения отдельно
        const channelsPath = import.meta.env.PROD ? '/api/v1/channels' : '/api/channels';
        const messagesPath = import.meta.env.PROD ? '/api/v1/messages' : '/api/messages';
        
        const [channelsResponse, messagesResponse] = await Promise.all([
          api.get(channelsPath),
          api.get(messagesPath),
        ]);

        const channels = channelsResponse.data;
        const messages = messagesResponse.data;

        // Проверяем, что получили массивы
        if (!Array.isArray(channels) || !Array.isArray(messages)) {
          console.error('Неверный формат данных от сервера. Возможно, сервер API не запущен или неправильно настроен.');
          return;
        }

        dispatch(setChannels(channels));
        dispatch(setMessages(messages));

        // Устанавливаем дефолтный канал (первый канал или general)
        const defaultChannel = channels.find(ch => ch.name === 'general') || channels[0];
        if (defaultChannel) {
          dispatch(setCurrentChannelId(defaultChannel.id));
        }
      } catch (e) {
        console.error('Ошибка при получении данных:', e);
        if (e.response) {
          console.error('Статус ответа:', e.response.status);
          console.error('Данные ответа:', e.response.data);
          // Если получили HTML вместо JSON, значит API сервер не запущен
          if (typeof e.response.data === 'string' && e.response.data.includes('<!doctype html>')) {
            console.error('API сервер не запущен или недоступен.');
          }
        } else if (e.code === 'ERR_NETWORK' || e.message.includes('Network Error')) {
          console.error('Ошибка сети: API сервер недоступен.');
        }
      }
    };

    fetchData();

    // Подписка на socket события
    socket.on('newMessage', (message) => {
      dispatch(addMessage(message));
    });

    socket.on('newChannel', (channel) => {
      dispatch(addChannel(channel));
    });

    socket.on('removeChannel', (data) => {
      dispatch(removeChannel(data.id));
      dispatch(removeMessagesByChannelsId(data.id));
      if (currentChannelId === data.id) {
        dispatch(setCurrentChannelId(1));
      }
    });

    socket.on('renameChannel', (data) => {
      dispatch(renameChannel({ id: data.id, changes: { name: data.name } }));
    });

    return () => {
      socket.off('newMessage');
      socket.off('newChannel');
      socket.off('removeChannel');
      socket.off('renameChannel');
    };
  }, [dispatch, navigate, currentChannelId]);

  return (
    <div className="container h-100 my-4 overflow-hidden rounded shadow">
        <div className="row h-100 bg-white flex-md-row">
            <ChannelsList openModal={openModal} />
            <div className="col p-0 h-100 d-flex flex-column">
                <MessagesBox currentChannelId={currentChannelId} />
                <MessageForm />
            </div>
        </div>
        {modalType === 'add' && (
          <div className="modal show" style={{ display: 'block', zIndex: 1050 }} tabIndex="-1" role="dialog">
            <div className="modal-dialog">
              <div className="modal-content">
                <AddChannelModal onClose={closeModal} />
              </div>
            </div>
            <div className="modal-backdrop show" onClick={closeModal} style={{ zIndex: 1040 }}></div>
          </div>
        )}
        {modalType === 'rename' && (
          <div className="modal show" style={{ display: 'block', zIndex: 1050 }} tabIndex="-1" role="dialog">
            <div className="modal-dialog">
              <div className="modal-content">
                <RenameChannelModal onClose={closeModal} channel={modalChannel} />
              </div>
            </div>
            <div className="modal-backdrop show" onClick={closeModal} style={{ zIndex: 1040 }}></div>
          </div>
        )}
        {modalType === 'remove' && (
          <div className="modal show" style={{ display: 'block', zIndex: 1050 }} tabIndex="-1" role="dialog">
            <div className="modal-dialog">
              <div className="modal-content">
                <RemoveChannelModal onClose={closeModal} channel={modalChannel} />
              </div>
            </div>
            <div className="modal-backdrop show" onClick={closeModal} style={{ zIndex: 1040 }}></div>
          </div>
        )}
    </div>
  );
};

export default ChatPage;