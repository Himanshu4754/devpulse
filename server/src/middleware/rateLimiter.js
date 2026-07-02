import rateLimit from 'express-rate-limit';

// Generous for normal use, tight enough to stop abuse/runaway loops.
// GitHub sync + AI insight generation are your most expensive operations —
// they're the ones worth protecting, not every read-only GET.
export const syncLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  message: { message: 'Too many sync requests. Please wait a few minutes and try again.' },
  standardHeaders: true,
  legacyHeaders: false
});

export const insightLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  message: { message: 'Too many AI insight requests. Please wait a few minutes and try again.' },
  standardHeaders: true,
  legacyHeaders: false
});