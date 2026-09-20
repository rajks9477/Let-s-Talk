import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware.js';
import { ChatsService } from './chats.service.js';

export class ChatsController {
  static async getChats(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id || 'mock_user';
      const chats = await ChatsService.getUserChats(userId);
      res.json({ success: true, chats });
    } catch (err) {
      next(err);
    }
  }

  static async getOrCreateDirectChat(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id || 'mock_user';
      const { targetUserId, targetPhone, phoneNumber } = req.body;
      const effectivePhone = targetPhone || phoneNumber;
      const effectiveTargetId = targetUserId || (effectivePhone ? `usr_${effectivePhone.replace(/\D/g, '')}` : null);

      if (!effectiveTargetId) {
        return res.status(400).json({ success: false, error: 'targetUserId or targetPhone is required' });
      }
      const chat = await ChatsService.getOrCreateDirectChat(userId, effectiveTargetId, effectivePhone);
      res.json({ success: true, chat });
    } catch (err) {
      next(err);
    }
  }
}
