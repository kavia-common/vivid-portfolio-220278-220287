# Backend API Quick Start

Environment
- Copy .env.example to .env and set required values:
  - PORT=3001
  - MONGODB_URL=mongodb://localhost:5001/portfolio
  - JWT_SECRET=changeme-in-prod
  - FRONTEND_ORIGIN=http://localhost:3000

Commands
- npm install
- npm run dev (development with nodemon)
- npm test (runs unit + integration tests)
- npm start (production-like)

CORS
- Controlled by FRONTEND_ORIGIN; ensure it matches your frontend URL.

Docs
- Swagger at /docs (e.g., http://localhost:3001/docs)
