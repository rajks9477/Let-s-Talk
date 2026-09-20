import { Router } from 'express';
import { PollsController } from './polls.controller.js';
import { authMiddleware } from '../../middleware/auth.middleware.js';

export const pollsRouter = Router();

pollsRouter.post('/', authMiddleware, PollsController.create);
pollsRouter.post('/:id/vote', authMiddleware, PollsController.vote);
