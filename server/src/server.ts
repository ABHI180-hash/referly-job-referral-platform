import http from 'http';
import app from './app';
import { ENV } from './config/environment';
import { connectDB, disconnectDB } from './config/database';
import { initSocketIO } from './sockets/socketHandler';
import { seedDatabase } from './utils/seedDatabase';

const server = http.createServer(app);

// Initialize real-time Socket.IO handler
const io = initSocketIO(server);

const startServer = async () => {
  try {
    // 1. Connect to MongoDB (External or in-memory fallback)
    await connectDB();

    // 2. Populate initial seed dataset if database is empty
    await seedDatabase();

    // 3. Listen on configured port
    const PORT = ENV.PORT || 5000;
    server.listen(PORT, () => {
      console.log('====================================================');
      console.log(`🚀 Referly Backend Server running in [${ENV.NODE_ENV}] mode`);
      console.log(`🔗 API Base URL:       http://localhost:${PORT}/api/v1`);
      console.log(`📖 API Documentation:  http://localhost:${PORT}/api-docs`);
      console.log(`💓 Health Check:       http://localhost:${PORT}/health`);
      console.log(`⚡ WebSocket Server:   ws://localhost:${PORT}`);
      console.log('====================================================');
    });
  } catch (error: any) {
    console.error('Fatal Error during server startup:', error.message);
    process.exit(1);
  }
};

// Graceful shutdown handling
const gracefulShutdown = async (signal: string) => {
  console.log(`\n[Server] Received ${signal}. Initiating graceful shutdown...`);
  server.close(async () => {
    console.log('[Server] HTTP and Socket server closed.');
    await disconnectDB();
    console.log('[Server] Process exited cleanly.');
    process.exit(0);
  });

  setTimeout(() => {
    console.error('[Server] Forceful shutdown initiated after timeout.');
    process.exit(1);
  }, 10000);
};

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

process.on('unhandledRejection', (reason: any) => {
  console.error('[Server] Unhandled Rejection detected:', reason);
});

process.on('uncaughtException', (error: Error) => {
  console.error('[Server] Uncaught Exception:', error.message, error.stack);
  process.exit(1);
});

startServer();

export { server, io };
