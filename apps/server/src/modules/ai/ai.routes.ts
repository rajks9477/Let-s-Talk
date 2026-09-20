import { Router } from 'express';
import { AIController } from './ai.controller.js';
import { authMiddleware } from '../../middleware/auth.middleware.js';

export const aiRouter = Router();

aiRouter.post('/chat', authMiddleware, AIController.chat);
aiRouter.post('/summarize', authMiddleware, AIController.summarize);
aiRouter.post('/translate', authMiddleware, AIController.translate);
aiRouter.post('/rewrite', authMiddleware, AIController.rewrite);
