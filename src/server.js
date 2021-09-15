'use strict';

const app = require('./app');
const logger = require('./logger');
const { NODE_ENV, PORT } = require('./config');

app.listen(PORT, () => {
  logger.info(`[${NODE_ENV}] Proxy running on port ${PORT}`);
});
