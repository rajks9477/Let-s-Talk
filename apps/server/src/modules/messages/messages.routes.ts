import { Router } from 'express';
import { MessagesController } from './messages.controller.js';
import { authMiddleware } from '../../middleware/auth.middleware.js';

export const messagesRouter = Router();

messagesRouter.get('/chat/:chatId', authMiddleware, MessagesController.getMessages);
messagesRouter.post('/', authMiddleware, MessagesController.sendMessage);
messagesRouter.post('/send', authMiddleware, MessagesController.sendMessage);
messagesRouter.patch('/:id/edit', authMiddleware, MessagesController.editMessage);
messagesRouter.delete('/:id', authMiddleware, MessagesController.deleteMessage);
messagesRouter.post('/:id/react', authMiddleware, MessagesController.toggleReaction);
