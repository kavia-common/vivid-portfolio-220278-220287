'use strict';

const request = require('supertest');
const mongoose = require('mongoose');
const { startMemoryMongo, stopMemoryMongo } = require('../testUtils');
const app = require('../../src/app');
const db = require('../../src/config/db');
const User = require('../../src/models/User');
const Project = require('../../src/models/Project');

let server;

beforeAll(async () => {
  const uri = await startMemoryMongo();
  await db.connect(uri);
});

afterAll(async () => {
  if (server && server.close) await new Promise((r) => server.close(r));
  await stopMemoryMongo();
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key of Object.keys(collections)) {
    await collections[key].deleteMany({});
  }
});

describe('Health', () => {
  test('GET / returns ok', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});

describe('Auth and protected routes', () => {
  let token;

  beforeEach(async () => {
    const passwordHash = await User.hashPassword('pass1234');
    await User.create({ email: 'admin@test.com', passwordHash, role: 'admin' });
  });

  test('Login returns token', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: 'admin@test.com', password: 'pass1234' });
    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
    token = res.body.token;
  });

  test('Projects CRUD protected for write', async () => {
    const login = await request(app).post('/api/auth/login').send({ email: 'admin@test.com', password: 'pass1234' });
    token = login.body.token;

    const create = await request(app)
      .post('/api/projects')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Proj1' });
    expect(create.statusCode).toBe(201);
    const id = create.body._id;

    const list = await request(app).get('/api/projects');
    expect(list.statusCode).toBe(200);
    expect(Array.isArray(list.body)).toBe(true);
    expect(list.body.length).toBe(1);

    const get = await request(app).get(`/api/projects/${id}`);
    expect(get.statusCode).toBe(200);
    expect(get.body.title).toBe('Proj1');

    const update = await request(app)
      .put(`/api/projects/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'NewTitle' });
    expect(update.statusCode).toBe(200);
    expect(update.body.title).toBe('NewTitle');

    const del = await request(app)
      .delete(`/api/projects/${id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(del.statusCode).toBe(200);

    const emptyList = await request(app).get('/api/projects');
    expect(emptyList.body.length).toBe(0);
  });

  test('Contact rate limiting', async () => {
    for (let i = 0; i < 5; i++) {
      const res = await request(app).post('/api/contact').send({
        name: 'A',
        email: 'a@b.c',
        message: `Hello ${i}`,
      });
      expect(res.statusCode).toBe(201);
    }
    const block = await request(app).post('/api/contact').send({
      name: 'A',
      email: 'a@b.c',
      message: 'Blocked',
    });
    expect(block.statusCode).toBe(429);
  });
});
