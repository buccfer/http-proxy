'use strict';

const express = require('express');
const morgan = require('morgan');
const { createProxyMiddleware } = require('http-proxy-middleware');
const logger = require('./logger');
const {
  TARGET_URL,
  LOG_LEVEL,
  REQUEST_LOGGER_FORMAT,
  PROXY_TIMEOUT,
} = require('./config');

const app = express();

app.use(morgan(REQUEST_LOGGER_FORMAT, {
  stream: {
    write: message => logger.info(message.trim()),
  }
}));

app.use(createProxyMiddleware({
  target: TARGET_URL,
  changeOrigin: true,
  followRedirects: true,
  proxyTimeout: PROXY_TIMEOUT,
  logLevel: LOG_LEVEL,
  logProvider: () => logger,
}));

module.exports = app;
