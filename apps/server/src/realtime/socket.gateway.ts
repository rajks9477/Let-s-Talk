import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';
import { PresenceService } from './presence.service.js';

export class SocketGateway {
  private io: Server;

  constructor(io: Server) {
    this.io = io;
    this.setupMiddleware();
    this.setupEvents();
  }

  private setupMiddleware() {
    this.io.use((socket: Socket, next) => {
      const token = socket.handshake.auth.token || socket.handshake.query.token;
      if (!token) {
        // Allow anonymous/guest socket with generated ID if token missing for dev convenience
        socket.data.userId = (socket.handshake.auth.userId as string) || `guest_${socket.id.slice(0, 6)}`;
        return next();
      }

      try {
        const decoded = jwt.verify(token as string, config.jwtSecret) as { id: string };
        socket.data.userId = decoded.id;
        next();
      } catch (err) {
        socket.data.userId = (socket.handshake.auth.userId as string) || `user_${socket.id.slice(0, 6)}`;
        next();
      }
    });
  }

  private setupEvents() {
    this.io.on('connection', (socket: Socket) => {
      const userId = socket.data.userId;
      console.log(`⚡ Socket connected: ${socket.id} (User: ${userId})`);

      PresenceService.userConnected(userId, socket.id);
      socket.broadcast.emit('presence:update', { userId, status: 'online' });

      // Join personal room for notifications/calls
      socket.join(`user:${userId}`);

      // 1. CHAT ROOM MANAGEMENT
      socket.on('chat:join', (chatId: string) => {
        socket.join(`chat:${chatId}`);
        console.log(`User ${userId} joined chat room: ${chatId}`);
      });

      socket.on('chat:leave', (chatId: string) => {
        socket.leave(`chat:${chatId}`);
      });

      // 2. TYPING INDICATORS
      socket.on('typing:start', ({ chatId }: { chatId: string }) => {
        PresenceService.setTyping(chatId, userId, true);
        socket.to(`chat:${chatId}`).emit('typing:update', {
          chatId,
          userId,
          isTyping: true,
          typingUsers: PresenceService.getTypingUsers(chatId),
        });
      });

      socket.on('typing:stop', ({ chatId }: { chatId: string }) => {
        PresenceService.setTyping(chatId, userId, false);
        socket.to(`chat:${chatId}`).emit('typing:update', {
          chatId,
          userId,
          isTyping: false,
          typingUsers: PresenceService.getTypingUsers(chatId),
        });
      });

      // 3. REALTIME MESSAGING BROADCAST
      socket.on('message:send', (message: any) => {
        this.io.to(`chat:${message.chatId}`).emit('message:new', message);
      });

      socket.on('message:reaction', (reaction: any) => {
        this.io.to(`chat:${reaction.chatId}`).emit('message:reaction', reaction);
      });

      socket.on('message:read', ({ chatId, messageId }: { chatId: string; messageId: string }) => {
        socket.to(`chat:${chatId}`).emit('message:read', { chatId, messageId, userId });
      });

      // 4. WEBRTC CALLING & SIGNALING
      socket.on('call:initiate', ({ recipientId, callId, callerName, callerAvatar, type }: any) => {
        console.log(`📞 Call initiated from ${userId} to ${recipientId} (${type})`);
        this.io.to(`user:${recipientId}`).emit('call:incoming', {
          callId,
          callerId: userId,
          callerName: callerName || 'Let\'s Talk User',
          callerAvatar,
          type: type || 'VOICE',
        });
      });

      socket.on('call:offer', ({ recipientId, callId, sdp }: any) => {
        this.io.to(`user:${recipientId}`).emit('call:offer', {
          callId,
          senderId: userId,
          sdp,
        });
      });

      socket.on('call:answer', ({ recipientId, callId, sdp }: any) => {
        this.io.to(`user:${recipientId}`).emit('call:answer', {
          callId,
          senderId: userId,
          sdp,
        });
      });

      socket.on('call:ice', ({ recipientId, callId, candidate }: any) => {
        this.io.to(`user:${recipientId}`).emit('call:ice', {
          callId,
          senderId: userId,
          candidate,
        });
      });

      socket.on('call:reject', ({ recipientId, callId }: any) => {
        this.io.to(`user:${recipientId}`).emit('call:rejected', { callId, userId });
      });

      socket.on('call:end', ({ recipientId, callId }: any) => {
        this.io.to(`user:${recipientId}`).emit('call:ended', { callId, userId });
      });

      // 5. POLL & EVENT UPDATES
      socket.on('poll:vote', (pollData: any) => {
        this.io.to(`chat:${pollData.chatId}`).emit('poll:updated', pollData);
      });

      // 6. DISCONNECTION
      socket.on('disconnect', () => {
        const disconnectedUser = PresenceService.userDisconnected(socket.id);
        if (disconnectedUser) {
          socket.broadcast.emit('presence:update', { userId: disconnectedUser, status: 'offline' });
        }
        console.log(`❌ Socket disconnected: ${socket.id}`);
      });
    });
  }

  public getIO(): Server {
    return this.io;
  }
}
