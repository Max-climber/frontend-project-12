import { io } from 'socket.io-client';

const socket = io('http://localhost:5001'); //Это сервер бэка
export default socket;