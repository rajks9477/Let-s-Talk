import { Router } from 'express';
import { AdminController } from './admin.controller.js';
import { authMiddleware, adminGuard } from '../../middleware/auth.middleware.js';

export const adminRouter = Router();

adminRouter.get('/metrics', authMiddleware, adminGuard, AdminController.getMetrics);
adminRouter.get('/reports', authMiddleware, adminGuard, AdminController.getReports);
adminRouter.post('/ban-user', authMiddleware, adminGuard, AdminController.banUser);
