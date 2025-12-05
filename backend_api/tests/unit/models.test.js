'use strict';

const mongoose = require('mongoose');
const { startMemoryMongo, stopMemoryMongo } = require('../testUtils');

const User = require('../../src/models/User');
const Project = require('../../src/models/Project');
const Profile = require('../../src/models/Profile');
const Message = require('../../src/models/Message');

beforeAll(async () => {
  await startMemoryMongo();
});

afterAll(async () => {
  await stopMemoryMongo();
});

describe('Models basic behavior', () => {
  test('User password hashing and compare', async () => {
    const passwordHash = await User.hashPassword('secret');
    const u = await User.create({ email: 'a@b.com', passwordHash, role: 'admin' });
    expect(u.email).toBe('a@b.com');
    const same = await u.comparePassword('secret');
    expect(same).toBe(true);
  });

  test('Project create/read', async () => {
    const p = await Project.create({ title: 'Test', description: 'D' });
    const found = await Project.findById(p._id);
    expect(found.title).toBe('Test');
  });

  test('Profile upsert-like behavior', async () => {
    const pr = await Profile.create({ name: 'Me', title: 'Dev' });
    expect(pr.name).toBe('Me');
  });

  test('Message create', async () => {
    const m = await Message.create({ name: 'X', email: 'x@y.z', message: 'Hi' });
    expect(m._id).toBeDefined();
  });
});

afterEach(async () => {
  // cleanup
  const collections = mongoose.connection.collections;
  for (const key of Object.keys(collections)) {
    await collections[key].deleteMany({});
  }
});
