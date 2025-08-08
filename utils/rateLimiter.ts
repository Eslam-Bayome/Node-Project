import rateLimit from 'express-rate-limit';

export const limiter = (windowMs: number, max?: number, message?: string) => {
  return rateLimit({
    windowMs: windowMs * 60 * 60 * 1000, //  1 hour
    max: max || 100,
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message:
      message || 'Too many requests from this IP, please try again in an hour',
  });
};
