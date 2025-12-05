'use strict';

const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema(
  {
    name: { type: String, default: '' },
    title: { type: String, default: '' },
    about: { type: String, default: '' },
    skills: { type: [String], default: [] },
    socials: {
      github: String,
      linkedin: String,
      twitter: String,
      website: String,
      email: String,
    },
    avatarUrl: { type: String, default: '' },
    resumeUrl: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Profile', ProfileSchema);
