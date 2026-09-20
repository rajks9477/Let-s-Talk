import { Router } from 'express';
import { CallsController } from './calls.controller.js';
import { authMiddleware } from '../../middleware/auth.middleware.js';

export const callsRouter = Router();

callsRouter.post('/initiate', authMiddleware, CallsController.initiateCall);
callsRouter.patch('/:id/status', authMiddleware, CallsController.updateStatus);
callsRouter.get('/history', authMiddleware, CallsController.getHistory);
