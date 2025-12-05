'use strict';

const Profile = require('../models/Profile');

// PUBLIC_INTERFACE
async function getProfile(req, res, next) {
  /** Retrieve the profile document (first/only). */
  try {
    const profile = await Profile.findOne();
    return res.json(profile || {});
  } catch (e) {
    return next(e);
  }
}

// PUBLIC_INTERFACE
async function upsertProfile(req, res, next) {
  /** Create or update single profile (admin only). */
  try {
    const existing = await Profile.findOne();
    if (!existing) {
      const created = await Profile.create(req.body || {});
      return res.status(201).json(created);
    }
    Object.assign(existing, req.body || {});
    await existing.save();
    return res.json(existing);
  } catch (e) {
    return next(e);
  }
}

module.exports = { getProfile, upsertProfile };
