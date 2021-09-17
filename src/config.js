'use strict';

const {
  NODE_ENV,
  PORT,
  LOG_LEVEL,
  REQUEST_LOGGER_FORMAT,
  TARGET_URL,
  PROXY_TIMEOUT,
  REDIS_URL,
} = process.env;

module.exports = {
  NODE_ENV: NODE_ENV || 'development',
  PORT: parseInt(PORT, 10) || 8080,
  LOG_LEVEL: LOG_LEVEL || 'info',
  REQUEST_LOGGER_FORMAT: REQUEST_LOGGER_FORMAT || 'tiny',
  TARGET_URL: TARGET_URL || 'https://jsonplaceholder.typicode.com',
  PROXY_TIMEOUT: parseInt(PROXY_TIMEOUT, 10) || 5000,
  REDIS_URL: REDIS_URL || 'redis://redis',
};
