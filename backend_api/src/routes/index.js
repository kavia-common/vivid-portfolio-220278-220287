const express = require('express');
const healthController = require('../controllers/health');
const apiRouter = require('./api');

const router = express.Router();

/**
 * @swagger
 * /:
 *   get:
 *     summary: Health endpoint
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Service health check passed
 */
router.get('/', healthController.check.bind(healthController));

// Mount versioned API routes
router.use('/api', apiRouter);

module.exports = router;
