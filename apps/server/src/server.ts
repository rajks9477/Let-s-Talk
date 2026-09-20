import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { app } from './app.js';
import { config } from './config/index.js';
import { connectDB } from './db/prisma.js';
import { SocketGateway } from './realtime/socket.gateway.js';
import { CronService } from './services/cron.service.js';

async function bootstrap() {
  // Connect to Database
  await connectDB();

  // Create HTTP Server
  const server = http.createServer(app);

  // Initialize Socket.io Gateway
  const io = new SocketIOServer(server, {
    cors: {
      origin: config.clientOrigin,
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  const socketGateway = new SocketGateway(io);

  // Start background cron jobs (Status 24h expiration, Disappearing messages)
  CronService.startBackgroundJobs();

  // Start HTTP & WebSocket Server
  server.listen(config.port, () => {
    console.log(`
🚀 =========================================================
💬 LET'S TALK SUPER-APP BACKEND RUNNING
📡 REST API:      http://localhost:${config.port}/api
⚡ WebSocket:     http://localhost:${config.port}
🩺 Health Check:  http://localhost:${config.port}/health
🌐 Client Origin: ${config.clientOrigin}
🚀 =========================================================
    `);
  });

  // Graceful Shutdown
  process.on('SIGTERM', () => {
    console.log('🛑 Received SIGTERM. Shutting down gracefully...');
    CronService.stopBackgroundJobs();
    server.close(() => process.exit(0));
  });
}

bootstrap().catch((err) => {
  console.error('❌ Failed to bootstrap server:', err);
  process.exit(1);
});
