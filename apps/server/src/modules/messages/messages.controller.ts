import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware.js';
import { MessagesService } from './messages.service.js';

export class MessagesController {
  static async getMessages(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { chatId } = req.params;
      const limit = parseInt(req.query.limit as string || '50', 10);
      const messages = await MessagesService.getChatMessages(chatId, limit);
      res.json({ success: true, messages });
    } catch (err) {
      next(err);
    }
  }

  static async sendMessage(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id || 'mock_user';
      const message = await MessagesService.sendMessage(userId, req.body);
      res.json({ success: true, message });
    } catch (err) {
      next(err);
    }
  }

  static async editMessage(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id || 'mock_user';
      const { id } = req.params;
      const { content } = req.body;
      const message = await MessagesService.editMessage(id, userId, content);
      res.json({ success: true, message });
    } catch (err) {
      next(err);
    }
  }

  static async deleteMessage(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id || 'mock_user';
      const { id } = req.params;
      const { forEveryone } = req.body;
      const result = await MessagesService.deleteMessage(id, userId, !!forEveryone);
      res.json({ success: true, result });
    } catch (err) {
      next(err);
    }
  }

  static async toggleReaction(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id || 'mock_user';
      const { id } = req.params;
      const { emoji } = req.body;
      const result = await MessagesService.toggleReaction(id, userId, emoji);
      res.json({ success: true, ...result });
    } catch (err) {
      next(err);
    }
  }
}
