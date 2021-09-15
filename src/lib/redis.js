'use strict';

const redis = require('redis');
const { REDIS_URL } = require('../config');
const logger = require('../logger');

const client = redis.createClient({ url: REDIS_URL });

client.on('error', (err) => {
  logger.error('Redis error: %o', err);
});

module.exports = client;
