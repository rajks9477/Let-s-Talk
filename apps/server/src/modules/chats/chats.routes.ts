import { Router } from 'express';
import { ChatsController } from './chats.controller.js';
import { authMiddleware } from '../../middleware/auth.middleware.js';

export const chatsRouter = Router();

chatsRouter.get('/', authMiddleware, ChatsController.getChats);
chatsRouter.post('/', authMiddleware, ChatsController.getOrCreateDirectChat);
chatsRouter.post('/direct', authMiddleware, ChatsController.getOrCreateDirectChat);
