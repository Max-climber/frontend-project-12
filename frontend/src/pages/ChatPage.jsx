import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setChannels, setCurrentChannelId } from '../features/channels/channelsSlice';
import { setMessages } from '../features/messages/messagesSlice';
import ChannelsList from '../components/ChannelsList';
import MessagesBox from '../components/MessagesBox';
import MessageForm from '../components/messageForm';
import AddChannelModal from '../components/modals/AddChannelModal';
import RemoveChannelModal from '../components/modals/removeChannelModal';
import RenameChannelModal from '../components/modals/renameChannelModal';
import api from '../api/axios';

const ChatPage = () => {
  const [modalType, setModalType] = useState(null);
  const [modalChannel, setModalChannel] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentChannelId = useSelector((state) => state.channels.currentChannelId);

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
        const { data } = await api.get('/api/data'); // api подставит baseURL и токен

        if (!data || !Array.isArray(data.channels) || !Array.isArray(data.messages)) {
          console.error('Неверный формат данных от сервера:', data);
          return;
        }

        dispatch(setChannels(data.channels));
        dispatch(setMessages(data.messages));

        const defaultChannelId = data.currentChannelId  || data.channels[0]?.id   || null;

        if (defaultChannelId) {
          dispatch(setCurrentChannelId(defaultChannelId));
        }
      } catch (e) {
        console.error('Ошибка при получении данных:', e);
      }
    };

    fetchData();
  }, [dispatch, navigate]);

  return (
    <div className="container h-100 my-4 overflow-hidden rounded shadow">
        <div className="row h-100 bg-white flex-md-row">
            <ChannelsList openModal={openModal} />
            <div className="col p-0 h-100 d-flex flex-column">
                <MessagesBox currentChannelId={currentChannelId} />
                <MessageForm />
            </div>
        </div>
        {modalType === 'add' && <AddChannelModal show={true} handleClose={closeModal} />}
        {modalType === 'rename' && <RenameChannelModal show={true} handleClose={closeModal} channel={modalChannel} />}
        {modalType === 'remove' && <RemoveChannelModal show={true} handleClose={closeModal} channel={modalChannel} />}
    </div>
  );
};

export default ChatPage;