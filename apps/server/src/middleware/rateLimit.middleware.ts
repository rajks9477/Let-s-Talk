import rateLimit from 'express-rate-limit';

export const authRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10, // max 10 requests per minute
  message: { success: false, error: 'Too many authentication attempts, please try again after 1 minute.' },
  standardHeaders: true,
  legacyHeaders: false,
});

export const apiRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 120, // max 120 requests per minute
  message: { success: false, error: 'Rate limit exceeded, please slow down.' },
  standardHeaders: true,
  legacyHeaders: false,
});
