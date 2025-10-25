// для пути / 
import axios from 'axios';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { setChannels } from '../features/channels/channelsSlice';
import { setMessages } from '../features/messages/messagesSlice';

import { useDispatch } from 'react-redux'


const HomePage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    useEffect(() => {
        const token = localStorage.getItem('token') //получаем токен из встроенного хранилища браузера
        if(!token) {
            navigate('/login');
        }

        const fenchData = async () => {
            try {
                const response = await axios.get('api/v1/data', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                dispatch(setChannels(response.data.channels)) 
                dispatch(setMessages(response.data.messages))
            } catch(e) {
                console.error('Ошибка при получении данных:', e)
            }

        }

        fenchData();
    }, [navigate, dispatch]);
    
    return (
        <div>
            <h1>HomePage</h1>
            <p>Заглушка для главной страницы</p>
        </div>
    );
}
export default HomePage