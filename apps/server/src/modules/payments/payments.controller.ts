import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware.js';
import { PaymentsService } from './payments.service.js';

export class PaymentsController {
  static async verifyVPA(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { vpa } = req.body;
      const result = await PaymentsService.verifyVPA(vpa);
      res.json({ success: true, ...result });
    } catch (err) {
      next(err);
    }
  }

  static async transfer(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const senderId = req.user?.id || 'mock_user';
      const result = await PaymentsService.transferFunds(senderId, req.body);
      res.json({ success: true, payment: result });
    } catch (err) {
      next(err);
    }
  }

  static async getHistory(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id || 'mock_user';
      const history = await PaymentsService.getTransactionHistory(userId);
      res.json({ success: true, history });
    } catch (err) {
      next(err);
    }
  }
}
