import { io, Socket } from 'socket.io-client';

const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

let socket: Socket | null = null;

export const getSocket = (): Socket => {
  if (!socket) {
    const token = localStorage.getItem('referly_token');
    socket = io(SOCKET_URL, {
      auth: { token },
      autoConnect: false,
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
      withCredentials: true,
    });
  }
  return socket;
};

export const connectSocket = (token?: string): Socket => {
  const s = getSocket();
  if (token) {
    s.auth = { token };
  }
  if (!s.connected) {
    s.connect();
  }
  return s;
};

export const disconnectSocket = (): void => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
