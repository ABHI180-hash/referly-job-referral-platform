import { Server as HttpServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import { verifyAccessToken } from '../utils/token';
import { ENV } from '../config/environment';

let io: SocketIOServer | null = null;
const onlineUsers = new Map<string, string>(); // userId -> socketId

export const initSocketIO = (httpServer: HttpServer): SocketIOServer => {
  io = new SocketIOServer(httpServer, {
    cors: {
      origin: [ENV.CLIENT_URL, 'http://localhost:5173', 'http://localhost:5174'],
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      credentials: true,
    },
  });

  // Socket Authentication Middleware
  io.use((socket: Socket, next) => {
    try {
      const token =
        socket.handshake.auth?.token ||
        socket.handshake.headers?.authorization?.replace('Bearer ', '');

      if (!token) {
        // Allow unauthenticated connection or proceed as guest
        return next();
      }

      const decoded = verifyAccessToken(token);
      (socket as any).user = decoded;
      next();
    } catch (err) {
      next(new Error('Authentication failed for WebSocket.'));
    }
  });

  io.on('connection', (socket: Socket) => {
    const user = (socket as any).user;

    if (user?.userId) {
      const userId = user.userId;
      onlineUsers.set(userId, socket.id);
      socket.join(userId);
      console.log(`[Socket] User connected & joined room: ${userId}`);

      // Broadcast user online status
      socket.broadcast.emit('user_status', { userId, status: 'online' });
    }

    // Join conversation room
    socket.on('join_conversation', (conversationId: string) => {
      socket.join(`conv_${conversationId}`);
      console.log(`[Socket] Socket ${socket.id} joined conversation conv_${conversationId}`);
    });

    // Leave conversation room
    socket.on('leave_conversation', (conversationId: string) => {
      socket.leave(`conv_${conversationId}`);
    });

    socket.on('disconnect', () => {
      if (user?.userId) {
        onlineUsers.delete(user.userId);
        socket.broadcast.emit('user_status', { userId: user.userId, status: 'offline' });
        console.log(`[Socket] User disconnected: ${user.userId}`);
      }
    });
  });

  return io;
};

export const getIO = (): SocketIOServer | null => {
  return io;
};

export const isUserOnline = (userId: string): boolean => {
  return onlineUsers.has(userId);
};
