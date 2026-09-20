import { Router } from 'express';
import { BackupsController } from './backups.controller.js';
import { authMiddleware } from '../../middleware/auth.middleware.js';

export const backupsRouter = Router();

backupsRouter.get('/export', authMiddleware, BackupsController.export);
