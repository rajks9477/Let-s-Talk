import { Router } from 'express';
import { PaymentsController } from './payments.controller.js';
import { authMiddleware } from '../../middleware/auth.middleware.js';

export const paymentsRouter = Router();

paymentsRouter.post('/vpa/verify', authMiddleware, PaymentsController.verifyVPA);
paymentsRouter.post('/transfer', authMiddleware, PaymentsController.transfer);
paymentsRouter.get('/history', authMiddleware, PaymentsController.getHistory);
