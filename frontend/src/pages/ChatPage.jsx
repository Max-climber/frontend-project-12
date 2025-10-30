// для пути / 
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { setChannels, setCurrentChannelId, addChannel } from '../features/channels/channelsSlice';
import { setMessages } from '../features/messages/messagesSlice';

import { useDispatch } from 'react-redux'
import socket from '../socket.js';

import { Formik, Form, Field } from 'formik';
import AddChannelModal from '../components/AddChannelModal';

const ChatPage = () => {
    const [showModal, setShowModal] = useState(true); // пока true для теста

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
                const response = await axios.get('/api/v1/data', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                dispatch(setChannels(response.data?.channels || [])) 
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

    return (
        
        <div>
            <h1>ChatPage</h1>
            {showModal && (
                <AddChannelModal onClose={() => {
                    console.log('Модалка закрыта');
                    setShowModal(false);
                }}/>
            )}
        </div>
    );
}
export default ChatPage