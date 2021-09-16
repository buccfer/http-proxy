'use strict';

const httpStatus = require('http-status');
const { RateLimiterRedis, RateLimiterRes } = require('rate-limiter-flexible');
const redisClient = require('../lib/redis');
const logger = require('../logger');

/**
 * @summary Creates a rate limit middleware.
 *
 * @param {Object} options
 * @param {number} options.requestsLimit - Max amount of requests per window.
 * @param {number} options.windowDurationInSeconds - Window length in seconds.
 * @param {Function} [options.keyGenerator] - Function used to generate keys. Defaults to req.ip.
 *
 * @returns {Function} A rate limit middleware.
 * */
module.exports = function createRateLimitMiddleware(options) {
  const rateLimiter = new RateLimiterRedis({
    keyPrefix: 'proxy-rate-limit',
    points: options.requestsLimit,
    duration: options.windowDurationInSeconds,
    storeClient: redisClient,
    inmemoryBlockOnConsumed: options.requestsLimit, // Prevent DDoS attacks.
  });

  const keyGenerator = options.keyGenerator || (req => req.ip);

  const buildHeaders = (result, includeRetryAfter = true) => {
    const headers = {
      'X-RateLimit-Limit': options.requestsLimit,
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
