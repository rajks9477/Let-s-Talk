import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '../../.env') });
dotenv.config(); // fallback to local .env

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  clientOrigin: process.env.CLIENT_ORIGIN || 'http://localhost:3000',
  jwtSecret: process.env.JWT_SECRET || 'lets-talk-super-jwt-secret-dev-key',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'lets-talk-super-refresh-secret',
  dataEncryptionKey: process.env.DATA_ENCRYPTION_KEY || '01234567890123456789012345678901',
  storageDriver: process.env.STORAGE_DRIVER || 'local',
  uploadLocalPath: process.env.UPLOAD_LOCAL_PATH || path.resolve(process.cwd(), 'uploads'),
  aiDefaultProvider: process.env.AI_DEFAULT_PROVIDER || 'mock',
  geminiApiKey: process.env.GEMINI_API_KEY || '',
  openaiApiKey: process.env.OPENAI_API_KEY || '',
  adminSecretToken: process.env.ADMIN_SECRET_TOKEN || 'admin-master-super-access-token',
};
