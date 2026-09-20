import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware.js';
import { ChannelsService } from './channels.service.js';

export class ChannelsController {
  static async discover(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const channels = await ChannelsService.discoverChannels();
      res.json({ success: true, channels });
    } catch (err) {
      next(err);
    }
  }

  static async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id || 'mock_user';
      const channel = await ChannelsService.createChannel(userId, req.body);
      res.json({ success: true, channel });
    } catch (err) {
      next(err);
    }
  }

  static async createPost(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id || 'mock_user';
      const { id } = req.params;
      const { content, mediaUrl } = req.body;
      const post = await ChannelsService.createPost(id, userId, content, mediaUrl);
      res.json({ success: true, post });
    } catch (err) {
      next(err);
    }
  }
}
