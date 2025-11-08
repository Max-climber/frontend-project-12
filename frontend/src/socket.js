import { io } from 'socket.io-client';

// Экспортируем функцию для создания нового экземпляра socket
// Это предотвращает хранение состояния между запусками приложения
// Токен передается для авторизации socket соединения через Authorization header
export const initSocket = (token) => {
  if (!token) {
    console.error('Socket: токен не предоставлен');
    return null;
  }
  
  return io({
    extraHeaders: {
      Authorization: `Bearer ${token}`,
    },
    auth: {
      token,
    },
    transports: ['websocket', 'polling'],
  });
};

export default initSocket;