import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service.js';
import { AuthRequest } from '../../middleware/auth.middleware.js';

export class AuthController {
  static async requestOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const { phoneNumber, countryCode } = req.body;
      if (!phoneNumber) {
        return res.status(400).json({ success: false, error: 'Phone number is required' });
      }
      const result = await AuthService.requestOtp(phoneNumber, countryCode);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  static async verifyOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const { phoneNumber, countryCode, code } = req.body;
      if (!phoneNumber || !code) {
        return res.status(400).json({ success: false, error: 'Phone number and OTP code are required' });
      }
      const result = await AuthService.verifyOtp(phoneNumber, countryCode, code);
      res.json({ success: true, ...result });
    } catch (err) {
      next(err);
    }
  }

  static async onboard(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) return res.status(401).json({ success: false, error: 'Unauthorized' });
      const result = await AuthService.onboard(userId, req.body);
      res.json({ success: true, profile: result });
    } catch (err) {
      next(err);
    }
  }

  static async me(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      res.json({ success: true, user: req.user });
    } catch (err) {
      next(err);
    }
  }
}
