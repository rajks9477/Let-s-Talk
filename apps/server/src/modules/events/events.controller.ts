import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware.js';
import { EventsService } from './events.service.js';

export class EventsController {
  static async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id || 'mock_user';
      const { chatId, title, description, location, startTime, endTime, reminderMinutes } = req.body;
      const event = await EventsService.createEvent(chatId, userId, { title, description, location, startTime, endTime, reminderMinutes });
      res.json({ success: true, event });
    } catch (err) {
      next(err);
    }
  }

  static async rsvp(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id || 'mock_user';
      const { id } = req.params;
      const { rsvp } = req.body;
      const result = await EventsService.rsvpEvent(id, userId, rsvp || 'GOING');
      res.json({ success: true, rsvp: result });
    } catch (err) {
      next(err);
    }
  }
}
