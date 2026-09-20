import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    phoneNumber: string;
    role: string;
  };
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'Unauthorized: Missing or invalid token' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, config.jwtSecret) as { id: string; phoneNumber: string; role: string };
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, error: 'Unauthorized: Token expired or invalid' });
  }
}

export function adminGuard(req: AuthRequest, res: Response, next: NextFunction) {
  if (!req.user || (req.user.role !== 'ADMIN' && req.headers['x-admin-token'] !== config.adminSecretToken)) {
    return res.status(403).json({ success: false, error: 'Forbidden: Admin authorization required' });
  }
  next();
}
