import { io } from 'socket.io-client';

// Экспортируем функцию для создания нового экземпляра socket
// Это предотвращает хранение состояния между запусками приложения
export const initSocket = () => {
  const socket = io('/', {
    path: '/socket.io',
    transports: ['polling', 'websocket'], 
  });

  return socket;
};

export default initSocket;