import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware.js';
import { StatusService } from './status.service.js';

export class StatusController {
  static async createStatus(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id || 'mock_user';
      const status = await StatusService.createStatus(userId, req.body);
      res.json({ success: true, status });
    } catch (err) {
      next(err);
    }
  }

  static async getFeed(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id || 'mock_user';
      const feed = await StatusService.getStatusFeed(userId);
      res.json({ success: true, feed });
    } catch (err) {
      next(err);
    }
  }

  static async viewStatus(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id || 'mock_user';
      const { id } = req.params;
      const view = await StatusService.recordView(id, userId);
      res.json({ success: true, view });
    } catch (err) {
      next(err);
    }
  }
}
