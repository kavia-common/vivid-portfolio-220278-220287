'use strict';

const express = require('express');
const { login, me } = require('../controllers/authController');
const { listProjects, getProject, createProject, updateProject, deleteProject } = require('../controllers/projectController');
const { getProfile, upsertProfile } = require('../controllers/profileController');
const { submitMessage } = require('../controllers/contactController');
const { auth, requireAdmin } = require('../middleware/auth');
const { rateLimit } = require('../middleware/rateLimit');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Authentication
 *   - name: Projects
 *     description: Projects CRUD
 *   - name: Profile
 *     description: Profile management
 *   - name: Contact
 *     description: Contact form
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string }
 *               password: { type: string }
 *     responses:
 *       200:
 *         description: JWT token returned
 */
router.post('/auth/login', login);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Current user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user payload
 */
router.get('/auth/me', auth, me);

/**
 * @swagger
 * /api/projects:
 *   get:
 *     summary: List projects
 *     tags: [Projects]
 *     responses:
 *       200:
 *         description: Projects
 */
router.get('/projects', listProjects);

/**
 * @swagger
 * /api/projects/{id}:
 *   get:
 *     summary: Get project
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Project }
 *       404: { description: Not found }
 */
router.get('/projects/:id', getProject);

/**
 * @swagger
 * /api/projects:
 *   post:
 *     summary: Create project
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201: { description: Created }
 */
router.post('/projects', auth, requireAdmin, createProject);

/**
 * @swagger
 * /api/projects/{id}:
 *   put:
 *     summary: Update project
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Updated }
 *       404: { description: Not found }
 */
router.put('/projects/:id', auth, requireAdmin, updateProject);

/**
 * @swagger
 * /api/projects/{id}:
 *   delete:
 *     summary: Delete project
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Deleted }
 *       404: { description: Not found }
 */
router.delete('/projects/:id', auth, requireAdmin, deleteProject);

/**
 * @swagger
 * /api/profile:
 *   get:
 *     summary: Get profile
 *     tags: [Profile]
 *     responses:
 *       200: { description: Profile }
 */
router.get('/profile', getProfile);

/**
 * @swagger
 * /api/profile:
 *   put:
 *     summary: Upsert profile
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200: { description: Updated or created }
 *       201: { description: Created }
 */
router.put('/profile', auth, requireAdmin, upsertProfile);

/**
 * @swagger
 * /api/contact:
 *   post:
 *     summary: Submit contact message (rate limited)
 *     tags: [Contact]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, message]
 *             properties:
 *               name: { type: string }
 *               email: { type: string }
 *               subject: { type: string }
 *               message: { type: string }
 *     responses:
 *       201: { description: Stored }
 *       429: { description: Rate limited }
 */
router.post('/contact', rateLimit({ windowMs: 60_000, max: 5 }), submitMessage);

module.exports = router;
