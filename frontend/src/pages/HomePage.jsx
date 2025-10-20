// для пути / 
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
    
export const HomePage = () => {
    const navigate = useNavigate()

    useEffect(() => {
        const token = localStorage.getItem('token') //получаем токен из встроенного хранилища браузера
        if(!token) {
            navigate('/login');
        }
    }, [navigate]);
    
    return (
        <div>
            <h1>HomePage</h1>
            <p>Заглушка для главной страницы</p>
        </div>
    );
}