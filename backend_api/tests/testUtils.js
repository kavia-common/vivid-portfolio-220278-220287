'use strict';

const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

let mongo;

async function startMemoryMongo() {
  mongo = await MongoMemoryServer.create();
  const uri = mongo.getUri();
  process.env.MONGODB_URL = uri;
  await mongoose.connect(uri, { maxPoolSize: 4 });
  return uri;
}

async function stopMemoryMongo() {
  await mongoose.disconnect();
  if (mongo) await mongo.stop();
}

module.exports = { startMemoryMongo, stopMemoryMongo };
