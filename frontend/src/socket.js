import { io } from 'socket.io-client';

// Экспортируем функцию для создания нового экземпляра socket
// Это предотвращает хранение состояния между запусками приложения
// Токен передается для авторизации socket соединения
export const initSocket = (token) => {
  if (!token) {
    console.error('Socket: токен не предоставлен');
    return null;
  }
  
  return io({
    auth: {
      token,
    },
    transports: ['websocket', 'polling'],
  });
};

export default initSocket;