const cors = require('cors');
const express = require('express');
const dotenv = require('dotenv');
const routes = require('./routes');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('../swagger');
const db = require('./../src/config/db');

dotenv.config();

// Initialize express app
const app = express();

/**
 * CORS configuration:
 * - FRONTEND_ORIGIN must be set in .env (e.g., http://localhost:3000) to allow browser access.
 * - Falls back to '*' if not provided (credentials disabled in that case).
 */
const allowedOrigin = process.env.FRONTEND_ORIGIN || '*';
app.use(cors({
  origin: allowedOrigin,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: allowedOrigin !== '*',
}));
app.set('trust proxy', true);

// Swagger docs with dynamic server URL
app.use('/docs', swaggerUi.serve, (req, res, next) => {
  const host = req.get('host');
  let protocol = req.protocol;
  const actualPort = req.socket.localPort;
  const hasPort = host.includes(':');

  const needsPort =
    !hasPort &&
    ((protocol === 'http' && actualPort !== 80) ||
      (protocol === 'https' && actualPort !== 443));
  const fullHost = needsPort ? `${host}:${actualPort}` : host;
  protocol = req.secure ? 'https' : protocol;

  const dynamicSpec = {
    ...swaggerSpec,
    servers: [
      {
        url: `${protocol}://${fullHost}`,
      },
    ],
  };
  swaggerUi.setup(dynamicSpec)(req, res, next);
});

// Parse JSON request body
app.use(express.json());

// Establish DB connection when app starts (server ensures env present)
db.connect().catch((err) => {
  // Do not crash app import for tests; server.js will log/fail fast if needed.
  // eslint-disable-next-line no-console
  console.error('DB connection error:', err.message);
});

// Mount routes
app.use('/', routes);

// Centralized error handling
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  // eslint-disable-next-line no-console
  console.error(err);
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  res.status(status).json({ error: message });
});

module.exports = app;
