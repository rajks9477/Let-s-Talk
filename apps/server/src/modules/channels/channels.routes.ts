import { Router } from 'express';
import { ChannelsController } from './channels.controller.js';
import { authMiddleware } from '../../middleware/auth.middleware.js';

export const channelsRouter = Router();

channelsRouter.get('/discover', authMiddleware, ChannelsController.discover);
channelsRouter.post('/', authMiddleware, ChannelsController.create);
channelsRouter.post('/:id/posts', authMiddleware, ChannelsController.createPost);
