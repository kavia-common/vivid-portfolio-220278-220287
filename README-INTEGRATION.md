# Project Integration Guide

This document summarizes environment setup and smoke testing across containers.

Containers
- database (MongoDB): running on localhost:5001
- backend_api (Express): runs on localhost:3001
- frontend_ui (React): runs on localhost:3000

Environment setup

1) Database (MongoDB)
- Ensure a MongoDB instance is available on port 5001.
- Example connection: mongodb://localhost:5001/portfolio

2) Backend API
- Copy backend_api/.env.example to backend_api/.env and adjust as needed:
  - PORT=3001
  - MONGODB_URL=mongodb://localhost:5001/portfolio
  - JWT_SECRET=<set-a-strong-secret>
  - FRONTEND_ORIGIN=http://localhost:3000
- Install deps and start:
  - npm install
  - npm run dev (or npm start)
- Swagger docs at: http://localhost:3001/docs

3) Frontend UI
- Copy frontend_ui/.env.example to frontend_ui/.env
  - REACT_APP_API_BASE_URL=http://localhost:3001
- Install deps and start:
  - npm install
  - npm start
- App served at: http://localhost:3000

CORS
- The backend uses FRONTEND_ORIGIN to allow the browser UI. By default it is set to http://localhost:3000.

Smoke tests

Backend:
- GET http://localhost:3001/ should return { status: "ok", ... }
- GET http://localhost:3001/docs should show API docs

Frontend:
- The UI should load at http://localhost:3000 and interact with the backend via REACT_APP_API_BASE_URL.

Notes
- Do not hardcode secrets. Use .env files for local development and environment variables in deployment.
