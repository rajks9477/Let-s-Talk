import { Router } from 'express';
import { StatusController } from './status.controller.js';
import { authMiddleware } from '../../middleware/auth.middleware.js';

export const statusRouter = Router();

statusRouter.post('/', authMiddleware, StatusController.createStatus);
statusRouter.get('/', authMiddleware, StatusController.getFeed);
statusRouter.get('/feed', authMiddleware, StatusController.getFeed);
statusRouter.post('/:id/view', authMiddleware, StatusController.viewStatus);
