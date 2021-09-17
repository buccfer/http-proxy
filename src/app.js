'use strict';

const express = require('express');
const morgan = require('morgan');
const { createProxyMiddleware } = require('http-proxy-middleware');
const createRateLimitMiddleware = require('./middlewares/rate-limit');
const logger = require('./logger');
const {
  TARGET_URL,
  LOG_LEVEL,
  REQUEST_LOGGER_FORMAT,
  PROXY_TIMEOUT,
  REQUESTS_LIMIT,
  WINDOW_DURATION_IN_SECONDS,
} = require('./config');

const app = express();

// We enable this in case we are behind a reverse proxy like AWS ALB.
// See https://expressjs.com/en/guide/behind-proxies.html
app.set('trust proxy', true);

app.use(morgan(REQUEST_LOGGER_FORMAT, {
  stream: {
    write: (message) => logger.info(message.trim()),
  },
}));

app.use(createRateLimitMiddleware({
  requestsLimit: REQUESTS_LIMIT,
  windowDurationInSeconds: WINDOW_DURATION_IN_SECONDS,
  keyGenerator(req) {
    // Here we choose the rate limit criteria.
    // Will just use by IP, but probably using by API Key makes more sense.
    return req.ip;
  },
}));

app.use(createProxyMiddleware({
  target: TARGET_URL,
  changeOrigin: true,
  followRedirects: true,
  proxyTimeout: PROXY_TIMEOUT,
  logLevel: LOG_LEVEL,
  logProvider: () => logger,
  onProxyRes(proxyRes, req, res) {
    const { rateLimitHeaders } = res.locals;

    // Use the proxy's rate limit headers and not the ones from the target.
    // The proxy must be configured with a limit that is lower than or equal to the target's
    // to avoid inconsistencies in responses.
    Object.assign(proxyRes.headers, rateLimitHeaders);
  },
}));

module.exports = app;
