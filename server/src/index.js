const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const app = require('./app');
const { connectDB } = require('./config/db');
const { logger } = require('./config/logger');

const PORT = process.env.PORT || 8080;

connectDB()
  .then(() => {
    const server = app.listen(PORT, () => {
      logger.info(
        { port: PORT, env: process.env.NODE_ENV || 'development' },
        '[server] Server started'
      );
    });

    server.on('error', (err) => {
      if (err && err.code === 'EADDRINUSE') {
        logger.error(
          {
            port: PORT,
            hint: `Port ${PORT} is already in use. Stop the other process or set PORT to a free value, e.g. PORT=8081 npm run dev`,
          },
          '[server] Port is already in use'
        );
      } else {
        logger.error({ err }, '[server] Server runtime error');
      }
      process.exit(1);
    });
  })
  .catch((err) => {
    logger.error({ err }, '[server] Startup failed');
    process.exit(1);
  });
