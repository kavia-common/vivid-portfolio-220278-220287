'use strict';

const mongoose = require('mongoose');

/**
 * Connect to MongoDB using the MONGODB_URL from environment variables.
 * Exposes connect() and disconnect() helpers to be used in server and tests.
 */
const db = {
  // PUBLIC_INTERFACE
  async connect(uri) {
    /** Connects to MongoDB using provided uri or env MONGODB_URL. */
    const mongoUri = uri || process.env.MONGODB_URL;
    if (!mongoUri) {
      throw new Error('MONGODB_URL not set. Please configure environment variable.');
    }

    // Recommended options
    const opts = {
      autoIndex: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };

    if (mongoose.connection.readyState === 1) return mongoose.connection;
    await mongoose.connect(mongoUri, opts);
    return mongoose.connection;
  },

  // PUBLIC_INTERFACE
  async disconnect() {
    /** Disconnects from MongoDB. */
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
  },
};

module.exports = db;
