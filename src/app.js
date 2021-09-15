'use strict';

const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const logger = require('./logger');
const { TARGET_URL, LOG_LEVEL } = require('./config');

const app = express();

app.use(createProxyMiddleware({
  target: TARGET_URL,
  changeOrigin: true,
  followRedirects: true,
  proxyTimeout: 5000,
  logLevel: LOG_LEVEL,
  logProvider: logger,
}));

module.exports = app;
