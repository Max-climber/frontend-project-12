import { io } from 'socket.io-client';

// Экспортируем функцию для создания нового экземпляра socket
// Это предотвращает хранение состояния между запусками приложения
// Создаем socket как в примере студента - просто io() с настройками
export const initSocket = () => {
  const socket = io('/', {
    path: '/socket.io',
    transports: ['websocket'],
  });

  socket.on('connect', () => {
    console.log('Сокет подключен');
  });

  socket.on('connect_error', (err) => {
    console.error('Ошибка подключения к сокету:', err);
  });

  return socket;
};

export default initSocket;