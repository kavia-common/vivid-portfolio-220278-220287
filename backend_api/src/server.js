const app = require('./app');
const db = require('./config/db');

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';

let server;

async function start() {
  try {
    await db.connect();
    server = app.listen(PORT, HOST, () => {
      // eslint-disable-next-line no-console
      console.log(`Server running at http://${HOST}:${PORT}`);
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

start();

// Graceful shutdown
async function shutdown() {
  // eslint-disable-next-line no-console
  console.log('Shutting down...');
  if (server) {
    await new Promise((resolve) => server.close(resolve));
  }
  await db.disconnect();
  // eslint-disable-next-line no-console
  console.log('Shutdown complete.');
  process.exit(0);
}

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

module.exports = server;
