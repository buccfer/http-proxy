'use strict';

const redis = require('redis');
const { REDIS_URL } = require('../config');
const logger = require('../logger');

const client = redis.createClient({
  url: REDIS_URL,
  enable_offline_queue: false,
});

client.on('error', (err) => {
  logger.error('Redis error: %o', err);
});

module.exports = client;
