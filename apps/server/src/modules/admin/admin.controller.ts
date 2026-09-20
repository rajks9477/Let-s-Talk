import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware.js';
import { AdminService } from './admin.service.js';

export class AdminController {
  static async getMetrics(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const metrics = await AdminService.getSystemMetrics();
      res.json({ success: true, metrics });
    } catch (err) {
      next(err);
    }
  }

  static async getReports(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const reports = await AdminService.getReports();
      res.json({ success: true, reports });
    } catch (err) {
      next(err);
    }
  }

  static async banUser(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const moderatorId = req.user?.id || 'admin_user';
      const { targetUserId, reason } = req.body;
      const result = await AdminService.banUser(moderatorId, targetUserId, reason);
      res.json({ success: true, result });
    } catch (err) {
      next(err);
    }
  }
}
