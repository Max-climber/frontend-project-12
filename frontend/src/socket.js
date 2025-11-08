import { io } from 'socket.io-client';

export const initSocket = () => io();

export default initSocket;