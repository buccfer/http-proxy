'use strict';

const {
  NODE_ENV,
  PORT,
  LOG_LEVEL,
  REQUEST_LOGGER_FORMAT,
  TARGET_URL,
  PROXY_TIMEOUT,
  REDIS_URL,
  REQUESTS_LIMIT,
  WINDOW_DURATION_IN_SECONDS,
} = process.env;

module.exports = {
  NODE_ENV: NODE_ENV || 'development',
  PORT: parseInt(PORT, 10) || 8080,
  LOG_LEVEL: LOG_LEVEL || 'info',
  REQUEST_LOGGER_FORMAT: REQUEST_LOGGER_FORMAT || 'tiny',
  TARGET_URL: TARGET_URL || 'https://jsonplaceholder.typicode.com',
  PROXY_TIMEOUT: parseInt(PROXY_TIMEOUT, 10) || 5000,
  REDIS_URL: REDIS_URL || 'redis://redis',
  REQUESTS_LIMIT: parseInt(REQUESTS_LIMIT, 10) || 1,
  WINDOW_DURATION_IN_SECONDS: parseInt(WINDOW_DURATION_IN_SECONDS, 10) || 10,
};
