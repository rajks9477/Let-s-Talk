import { Router } from 'express';
import { PrivacyController } from './privacy.controller.js';
import { authMiddleware } from '../../middleware/auth.middleware.js';

export const privacyRouter = Router();

privacyRouter.post('/lock-chat', authMiddleware, PrivacyController.lockChat);
privacyRouter.post('/secret-code', authMiddleware, PrivacyController.setSecretCode);
privacyRouter.patch('/settings', authMiddleware, PrivacyController.updateSettings);
