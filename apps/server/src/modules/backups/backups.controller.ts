import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware.js';
import { BackupsService } from './backups.service.js';

export class BackupsController {
  static async export(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id || 'mock_user';
      const backup = await BackupsService.exportBackup(userId);
      res.json({ success: true, backup });
    } catch (err) {
      next(err);
    }
  }
}
