import { Router } from 'express';
import { MediaController } from './media.controller.js';
import { uploadMiddleware } from '../../services/storage.service.js';
import { authMiddleware } from '../../middleware/auth.middleware.js';

export const mediaRouter = Router();

mediaRouter.post('/upload', authMiddleware, uploadMiddleware.single('file'), MediaController.upload);
