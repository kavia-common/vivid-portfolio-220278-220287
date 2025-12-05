'use strict';

const Project = require('../models/Project');

// PUBLIC_INTERFACE
async function listProjects(req, res, next) {
  /** List all projects ordered by 'order' then createdAt desc. */
  try {
    const items = await Project.find().sort({ order: 1, createdAt: -1 });
    return res.json(items);
  } catch (e) {
    return next(e);
  }
}

// PUBLIC_INTERFACE
async function getProject(req, res, next) {
  /** Get project by id. */
  try {
    const item = await Project.findById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Not found' });
    return res.json(item);
  } catch (e) {
    return next(e);
  }
}

// PUBLIC_INTERFACE
async function createProject(req, res, next) {
  /** Create new project (admin only). */
  try {
    const created = await Project.create(req.body || {});
    return res.status(201).json(created);
  } catch (e) {
    return next(e);
  }
}

// PUBLIC_INTERFACE
async function updateProject(req, res, next) {
  /** Update project by id (admin only). */
  try {
    const updated = await Project.findByIdAndUpdate(req.params.id, req.body || {}, { new: true });
    if (!updated) return res.status(404).json({ error: 'Not found' });
    return res.json(updated);
  } catch (e) {
    return next(e);
  }
}

// PUBLIC_INTERFACE
async function deleteProject(req, res, next) {
  /** Delete project by id (admin only). */
  try {
    const deleted = await Project.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Not found' });
    return res.json({ success: true });
  } catch (e) {
    return next(e);
  }
}

module.exports = {
  listProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
};
