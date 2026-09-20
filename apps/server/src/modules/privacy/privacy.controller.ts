import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware.js';
import { PrivacyService } from './privacy.service.js';

export class PrivacyController {
  static async lockChat(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id || 'mock_user';
      const { chatId, isLocked } = req.body;
      const result = await PrivacyService.lockChat(userId, chatId, isLocked ?? true);
      res.json({ success: true, result });
    } catch (err) {
      next(err);
    }
  }

  static async setSecretCode(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id || 'mock_user';
      const { secretCode } = req.body;
      const result = await PrivacyService.setSecretCode(userId, secretCode);
      res.json({ success: true, result });
    } catch (err) {
      next(err);
    }
  }

  static async updateSettings(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id || 'mock_user';
      const result = await PrivacyService.updatePrivacy(userId, req.body);
      res.json({ success: true, settings: result });
    } catch (err) {
      next(err);
    }
  }
}
