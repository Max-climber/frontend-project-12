import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useRollbar } from '@rollbar/react';
import { setChannels, setCurrentChannelId, addChannel, removeChannel, renameChannel } from '../features/channels/channelsSlice';
import { setMessages, addMessage, removeMessagesByChannelsId } from '../features/messages/messagesSlice';
import ChannelsList from '../components/ChannelsList';
import MessagesBox from '../components/MessagesBox';
import MessageForm from '../components/MessageForm';
import AddChannelModal from '../components/modals/AddChannelModal';
import RemoveChannelModal from '../components/modals/removeChannelModal';
import RenameChannelModal from '../components/modals/renameChannelModal';
import axios from 'axios';
import initSocket from '../socket';
import store from '../app/store';

const ChatPage = () => {
  const { t } = useTranslation();
  const rollbar = useRollbar();
  const [modalType, setModalType] = useState(null);
  const [modalChannel, setModalChannel] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentChannelId = useSelector((state) => state.channels?.currentChannelId);
  const isInitialized = useRef(false);
  const socketRef = useRef(null);

  const openModal = (type, channel = null) => {
    setModalType(type);
    setModalChannel(channel);
  };

  const closeModal = () => {
    setModalType(null);
    setModalChannel(null);
  };

  // Эффект для начальной загрузки данных (выполняется только один раз)
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      // Получаем каналы и сообщения отдельно
      // В dev-режиме proxy переписывает /api на /api/v1
      // В prod используем прямой путь /api/v1
      const channelsPath = import.meta.env.PROD ? '/api/v1/channels' : '/api/channels';
      const messagesPath = import.meta.env.PROD ? '/api/v1/messages' : '/api/messages';
      
      try {
        const token = localStorage.getItem('token');
        const headers = {
          Authorization: `Bearer ${token}`,
        };
        
        const [channelsResponse, messagesResponse] = await Promise.all([
          axios.get(channelsPath, { headers }),
          axios.get(messagesPath, { headers }),
        ]);

        const channels = channelsResponse.data;
        const messages = messagesResponse.data;

        // Проверяем, что получили массивы
        if (!Array.isArray(channels) || !Array.isArray(messages)) {
          console.error('Неверный формат данных от сервера. Возможно, сервер API не запущен или неправильно настроен.');
          console.error('Channels:', channels);
          console.error('Messages:', messages);
          toast.error(t('toast.dataLoadError'));
          return;
        }

        dispatch(setChannels(channels));
        dispatch(setMessages(messages));

        // Устанавливаем дефолтный канал только при первой загрузке
        // Это предотвращает перезапись выбранного канала при повторной загрузке
        if (!isInitialized.current) {
          const defaultChannel = channels.find(ch => ch.name === 'general') || channels[0];
          if (defaultChannel) {
            dispatch(setCurrentChannelId(defaultChannel.id));
          }
          isInitialized.current = true;
        }
      } catch (e) {
        console.error('Ошибка при получении данных:', e);
        // Отправляем ошибку в Rollbar
        rollbar.error('Ошибка при загрузке данных', e, {
          context: 'ChatPage.fetchData',
          channelsPath,
          messagesPath,
        });
        
        if (e.response) {
          console.error('Статус ответа:', e.response.status);
          console.error('Данные ответа:', e.response.data);
          // Если получили HTML вместо JSON, значит API сервер не запущен
          if (typeof e.response.data === 'string' && e.response.data.includes('<!doctype html>')) {
            console.error('API сервер не запущен или недоступен.');
            toast.error(t('toast.dataLoadError'));
          } else {
            toast.error(t('toast.dataLoadError'));
          }
        } else if (e.code === 'ERR_NETWORK' || e.message?.includes('Network Error')) {
          console.error('Ошибка сети: API сервер недоступен.');
          toast.error(t('toast.networkError'));
        } else {
          toast.error(t('toast.dataLoadError'));
        }
      }
    };

    fetchData();
  }, [dispatch, navigate, t, rollbar]);

  // Эффект для создания socket и подписки на события
  useEffect(() => {
    // Создаем новый экземпляр socket при монтировании компонента
    // Это предотвращает хранение состояния между запусками приложения
    const socket = initSocket();
    socketRef.current = socket;

    // Подписка на socket события
    socket.on('newMessage', (message) => {
      dispatch(addMessage(message));
    });

    socket.on('newChannel', (channel) => {
      dispatch(addChannel(channel));
      // Уведомление показывается в AddChannelModal после успешного API запроса
    });

    socket.on('removeChannel', (data) => {
      dispatch(removeChannel(data.id));
      dispatch(removeMessagesByChannelsId(data.id));
      // Уведомление показывается в RemoveChannelModal после успешного API запроса
      // Получаем текущее значение currentChannelId из store внутри обработчика
      const currentId = store.getState()?.channels?.currentChannelId;
      if (currentId === data.id) {
        // Если удаленный канал был текущим, переключаемся на general или первый канал
        dispatch(setCurrentChannelId(1));
      }
    });

    socket.on('renameChannel', (data) => {
      dispatch(renameChannel({ id: data.id, changes: { name: data.name } }));
      // Уведомление показывается в RenameChannelModal после успешного API запроса
    });

    return () => {
      // Отписываемся от всех событий и закрываем соединение
      socket.off('connect');
      socket.off('connect_error');
      socket.off('newMessage');
      socket.off('newChannel');
      socket.off('removeChannel');
      socket.off('renameChannel');
      socket.disconnect();
      socketRef.current = null;
    };
  }, [dispatch]);

  return (
    <>
      <div className="container h-100 my-4 overflow-hidden rounded shadow">
        <div className="row h-100 bg-white flex-md-row">
          <ChannelsList openModal={openModal} />
          <div className="col p-0 h-100 d-flex flex-column">
            <MessagesBox currentChannelId={currentChannelId} />
            <MessageForm />
          </div>
        </div>
      </div>
      {modalType === 'add' && (
        <>
          <div className="modal-backdrop show" style={{ zIndex: 1040 }}></div>
          <div className="modal show" style={{ display: 'block', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1050 }} tabIndex="-1" role="dialog" onClick={(e) => e.target === e.currentTarget && closeModal()}>
            <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
              <div className="modal-content">
                <AddChannelModal onClose={closeModal} />
              </div>
            </div>
          </div>
        </>
      )}
      {modalType === 'rename' && (
        <>
          <div className="modal-backdrop show" style={{ zIndex: 1040 }}></div>
          <div className="modal show" style={{ display: 'block', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1050 }} tabIndex="-1" role="dialog" onClick={(e) => e.target === e.currentTarget && closeModal()}>
            <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
              <div className="modal-content">
                <RenameChannelModal onClose={closeModal} channel={modalChannel} />
              </div>
            </div>
          </div>
        </>
      )}
      {modalType === 'remove' && (
        <>
          <div className="modal-backdrop show" style={{ zIndex: 1040 }}></div>
          <div className="modal show" style={{ display: 'block', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1050 }} tabIndex="-1" role="dialog" onClick={(e) => e.target === e.currentTarget && closeModal()}>
            <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
              <div className="modal-content">
                <RemoveChannelModal onClose={closeModal} channel={modalChannel} />
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default ChatPage;