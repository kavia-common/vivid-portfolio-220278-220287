'use strict';

const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: '' },
    tech: { type: [String], default: [] },
    url: { type: String, default: '' },
    repoUrl: { type: String, default: '' },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    images: { type: [String], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Project', ProjectSchema);
