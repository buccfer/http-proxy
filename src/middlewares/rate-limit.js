'use strict';

const httpStatus = require('http-status');
const { RateLimiterRedis, RateLimiterRes } = require('rate-limiter-flexible');
const redisClient = require('../lib/redis');
const logger = require('../logger');

module.exports = function createRateLimitMiddleware(options) {
  const rateLimiter = new RateLimiterRedis({
    keyPrefix: 'proxy-rate-limit',
    points: options.requestsCount,
    duration: options.durationInSeconds,
    storeClient: redisClient,
    inmemoryBlockOnConsumed: options.points, // Prevent DDoS attacks.
  });

  const keyGenerator = options.keyGenerator || (req => req.ip);

  const buildHeaders = (result, includeRetryAfter = true) => {
    const headers = {
      'X-RateLimit-Limit': options.requestsCount,
      'X-RateLimit-Remaining': result.remainingPoints,
      'X-RateLimit-Reset': new Date(Date.now() + result.msBeforeNext),
    };

    if (includeRetryAfter) {
      headers['Retry-After'] = result.msBeforeNext / 1000;
    }

    return headers;
  };

  return async function rateLimitMiddleware(req, res, next) {
    try {
      const key = keyGenerator(req);
      const result = await rateLimiter.consume(key, 1);
      const headers = buildHeaders(result, false);
      res.set(headers);
      next();
    } catch (err) {
      if (!(err instanceof RateLimiterRes)) {
        // Do not block the request if redis is not available
        // or some transient error happens.
        logger.error('Rate limit error: %o', err);
        next();
        return;
      }

      const statusCode = httpStatus.TOO_MANY_REQUESTS;
      const errorMessage = httpStatus[statusCode];
      const headers = buildHeaders(err);

      res.status(statusCode).set(headers).json({
        statusCode,
        errorMessage,
      });
    }
  };
};
