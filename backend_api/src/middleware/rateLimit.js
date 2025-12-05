'use strict';

// simple in-memory rate limiter keyed by ip. Sliding window.
const buckets = new Map();

/**
 * Creates a rate limit middleware.
 * @param {Object} options
 * @param {number} options.windowMs - window in ms
 * @param {number} options.max - max requests per window
 */
function rateLimit({ windowMs = 60_000, max = 5 } = {}) {
  return (req, res, next) => {
    const key = req.ip || req.headers['x-forwarded-for'] || 'unknown';
    const now = Date.now();
    const windowStart = now - windowMs;

    let history = buckets.get(key) || [];
    history = history.filter((ts) => ts > windowStart);
    if (history.length >= max) {
      return res.status(429).json({ error: 'Too many requests. Please try again later.' });
    }
    history.push(now);
    buckets.set(key, history);
    next();
  };
}

module.exports = { rateLimit };
