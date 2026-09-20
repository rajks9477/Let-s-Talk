import { Router } from 'express';
import { BusinessController } from './business.controller.js';
import { authMiddleware } from '../../middleware/auth.middleware.js';

export const businessRouter = Router();

businessRouter.get('/profile/:userId?', authMiddleware, BusinessController.getProfile);
businessRouter.post('/products', authMiddleware, BusinessController.addProduct);
