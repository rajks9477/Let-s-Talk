import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import { config } from './config/index.js';
import { errorHandler } from './middleware/error.middleware.js';
import { apiRateLimiter } from './middleware/rateLimit.middleware.js';

// Route imports
import { authRouter } from './modules/auth/auth.routes.js';
import { chatsRouter } from './modules/chats/chats.routes.js';
import { messagesRouter } from './modules/messages/messages.routes.js';
import { mediaRouter } from './modules/media/media.routes.js';
import { callsRouter } from './modules/calls/calls.routes.js';
import { statusRouter } from './modules/status/status.routes.js';
import { channelsRouter } from './modules/channels/channels.routes.js';
import { pollsRouter } from './modules/polls/polls.routes.js';
import { eventsRouter } from './modules/events/events.routes.js';
import { paymentsRouter } from './modules/payments/payments.routes.js';
import { businessRouter } from './modules/business/business.routes.js';
import { aiRouter } from './modules/ai/ai.routes.js';
import { privacyRouter } from './modules/privacy/privacy.routes.js';
import { backupsRouter } from './modules/backups/backups.routes.js';
import { adminRouter } from './modules/admin/admin.routes.js';

export const app = express();

// Security and CORS
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));
app.use(cors({
  origin: config.clientOrigin,
  credentials: true,
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Static file serving for uploads
app.use('/uploads', express.static(config.uploadLocalPath));

// Health Check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: "Let's Talk SuperApp Backend",
    version: '1.0.0',
  });
});

// API Routes
app.use('/api', apiRateLimiter);
app.use('/api/auth', authRouter);
app.use('/api/chats', chatsRouter);
app.use('/api/messages', messagesRouter);
app.use('/api/media', mediaRouter);
app.use('/api/calls', callsRouter);
app.use('/api/status', statusRouter);
app.use('/api/channels', channelsRouter);
app.use('/api/polls', pollsRouter);
app.use('/api/events', eventsRouter);
app.use('/api/payments', paymentsRouter);
app.use('/api/business', businessRouter);
app.use('/api/ai', aiRouter);
app.use('/api/privacy', privacyRouter);
app.use('/api/backups', backupsRouter);
app.use('/api/admin', adminRouter);

// Global Error Handler
app.use(errorHandler);
