'use strict';

const {
  NODE_ENV,
  PORT,
  LOG_LEVEL,
  TARGET_URL,
} = process.env;

module.exports = {
  NODE_ENV: NODE_ENV || 'development',
  PORT: parseInt(PORT, 10) || 8080,
  LOG_LEVEL: LOG_LEVEL || 'info',
  TARGET_URL: TARGET_URL || 'https://jsonplaceholder.typicode.com',
};
