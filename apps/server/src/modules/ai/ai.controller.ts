import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware.js';
import { AIService } from './ai.service.js';

export class AIController {
  static async chat(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id || 'mock_user';
      const { message, conversationId } = req.body;
      const result = await AIService.chat(userId, message, conversationId);
      res.json({ success: true, ...result });
    } catch (err) {
      next(err);
    }
  }

  static async summarize(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { text } = req.body;
      const summary = await AIService.summarize(text);
      res.json({ success: true, summary });
    } catch (err) {
      next(err);
    }
  }

  static async translate(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { text, targetLanguage } = req.body;
      const translation = await AIService.translate(text, targetLanguage);
      res.json({ success: true, translation });
    } catch (err) {
      next(err);
    }
  }

  static async rewrite(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { text, tone } = req.body;
      const rewritten = await AIService.rewrite(text, tone);
      res.json({ success: true, rewritten });
    } catch (err) {
      next(err);
    }
  }
}
