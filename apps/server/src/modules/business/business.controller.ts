import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware.js';
import { BusinessService } from './business.service.js';

export class BusinessController {
  static async getProfile(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.params.userId || req.user?.id || 'mock_user';
      const profile = await BusinessService.getBusinessProfile(userId);
      res.json({ success: true, profile });
    } catch (err) {
      next(err);
    }
  }

  static async addProduct(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { catalogId, name, price, description, imageUrl } = req.body;
      const product = await BusinessService.addProduct(catalogId, { name, price, description, imageUrl });
      res.json({ success: true, product });
    } catch (err) {
      next(err);
    }
  }
}
