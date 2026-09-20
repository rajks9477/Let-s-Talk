import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware.js';
import { PollsService } from './polls.service.js';

export class PollsController {
  static async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id || 'mock_user';
      const { chatId, question, options, isMultipleChoice } = req.body;
      const poll = await PollsService.createPoll(chatId, userId, { question, options, isMultipleChoice });
      res.json({ success: true, poll });
    } catch (err) {
      next(err);
    }
  }

  static async vote(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id || 'mock_user';
      const { id } = req.params;
      const { optionId } = req.body;
      const poll = await PollsService.votePoll(id, optionId, userId);
      res.json({ success: true, poll });
    } catch (err) {
      next(err);
    }
  }
}
