import { Router } from 'express';
import { AuthController } from './auth.controller.js';
import { authMiddleware } from '../../middleware/auth.middleware.js';
import { authRateLimiter } from '../../middleware/rateLimit.middleware.js';

export const authRouter = Router();

authRouter.post('/request-otp', authRateLimiter, AuthController.requestOtp);
authRouter.post('/verify-otp', authRateLimiter, AuthController.verifyOtp);
authRouter.post('/onboard', authMiddleware, AuthController.onboard);
authRouter.get('/me', authMiddleware, AuthController.me);
