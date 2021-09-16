'use strict';

const httpStatus = require('http-status');
const { RateLimiterRedis, RateLimiterRes } = require('rate-limiter-flexible');
const redisClient = require('../lib/redis');
const logger = require('../logger');

module.exports = function createRateLimitMiddleware(options) {
  const rateLimiter = new RateLimiterRedis({
    keyPrefix: 'proxy-rate-limit::',
    points: options.requestsCount,
    duration: options.durationInSeconds,
    storeClient: redisClient,
    inmemoryBlockOnConsumed: options.points, // Prevent DDoS attacks.
  });

  return async function rateLimitMiddleware(req, res, next) {
    try {
      await rateLimiter.consume(key, 1);
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

      res.status(statusCode)
        .set({
          'Retry-After': err.msBeforeNext / 1000,
          'X-RateLimit-Limit': options.requestsCount,
          'X-RateLimit-Remaining': err.remainingPoints,
          'X-RateLimit-Reset': new Date(Date.now() + err.msBeforeNext),
        })
        .json({
          statusCode,
          errorMessage,
        });
    }
  };
};
