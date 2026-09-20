import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware.js';
import { CallsService } from './calls.service.js';

export class CallsController {
  static async initiateCall(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const callerId = req.user?.id || 'mock_user';
      const { recipientId, type } = req.body;
      const call = await CallsService.initiateCall(callerId, recipientId, type || 'VOICE');
      res.json({ success: true, call });
    } catch (err) {
      next(err);
    }
  }

  static async updateStatus(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { status, durationSec } = req.body;
      const updated = await CallsService.updateCallStatus(id, status, durationSec);
      res.json({ success: true, call: updated });
    } catch (err) {
      next(err);
    }
  }

  static async getHistory(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id || 'mock_user';
      const history = await CallsService.getCallHistory(userId);
      res.json({ success: true, history });
    } catch (err) {
      next(err);
    }
  }
}
