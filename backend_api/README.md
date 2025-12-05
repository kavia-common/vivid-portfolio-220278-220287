# Backend API

Express + MongoDB backend for the animated portfolio app.

- JWT auth with /api/auth/login and /api/auth/me
- Projects CRUD at /api/projects (write operations require admin JWT)
- Profile get/put at /api/profile (put requires admin JWT)
- Contact submit at /api/contact with simple in-memory rate limiting
- Swagger docs at /docs

Environment
- See .env.example for required variables (MONGODB_URL, JWT_SECRET, FRONTEND_ORIGIN, etc.)

Development
- npm run dev
- npm test

OpenAPI
- Docs at /docs
- Regenerate static openapi.json (optional) with: npm run generate:openapi
