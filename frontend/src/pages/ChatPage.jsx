// для пути / 
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { setChannels, setCurrentChannelId, addChannel } from '../features/channels/channelsSlice';
import { setMessages, addMessage, removeMessagesByChannelsId } from '../features/messages/messagesSlice';

import { useDispatch } from 'react-redux'
import socket from '../socket.js';

import { Formik, Form, Field } from 'formik';
import AddChannelModal from '../components/modals/AddChannelModal.jsx';
import RemoveChannelModal from '../components/modals/removeChannelModal.jsx';
import RenameChannelModal from '../components/modals/renameChannelModal.jsx';
import ChannelsList from '../components/ChannelsList.jsx';

const ChatPage = () => {
    const [showModal, setShowModal] = useState(true); // пока true для теста
    const [modalType, setModalType] = useState(null);
    const [modalChannel, setModalChannel] = useState(null);

    const openModal = (type, channel = null) => {
        setModalType(type);
        setModalChannel(channel);
    };

    const closeModal = () => {
        setModalType(null);
        setModalChannel(null);
    };

    const navigate = useNavigate();
    const dispatch = useDispatch();
    useEffect(() => {
        const token = localStorage.getItem('token') //получаем токен из встроенного хранилища браузера
        if(!token) {
            navigate('/login');
        }
        // Загружаем данные с сервера
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:5001/api/v1/data', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                console.log('Ответ с сервера:', response.data); //проверяем что сервер  возвращает массив каналов
                dispatch(setChannels(response.data?.channels ?? [])) 
                dispatch(setMessages(response.data?.messages || []))

            } catch(e) {
                console.error('Ошибка при получении данных:', e)
            }
        }

        fetchData();

        // Подписываемся на новые сообщения по сокету
        socket.on('newMessage', (messages) => {
            dispatch(addMessage(messages)) // говорим Redux добавить сообщение в список
        })

        socket.on('newChannel', (channel) => {
            dispatch(addChannel(channel));
        });

        return () => {
            socket.off('newMessage') // чтобы каждый раз при открытии страницы не добавлялся новый сокет и сообщения не дублировались
            socket.off('newChannel')
        }
    }, [navigate, dispatch]);
    console.log(modalType);// для проверки, работает ли кнопки “+” 
    return (
        <div className="container h-100 my-4 overflow-hidden rounded shadow">
            <div className="row h-100 bg-white flex-md-row">
                <ChannelsList openModal={openModal} />
                <div className="col p-0 h-100">
                <h2 className="p-3">Чат</h2>
                </div>
            </div>

            {modalType === 'add' && <AddChannelModal onClose={closeModal} />}
            {modalType === 'rename' && <RenameChannelModal onClose={closeModal} channel={modalChannel} />}
            {modalType === 'remove' && <RemoveChannelModal onClose={closeModal} channel={modalChannel} />}
        </div>
    );
}
export default ChatPage