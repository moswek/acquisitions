# Acquisitions API - Warp Documentation

## Project Overview

A Node.js REST API for user acquisition management built with Express 5, Drizzle ORM, and Neon PostgreSQL. The project uses ES modules and implements authentication with JWT tokens and HTTP-only cookies.

## Tech Stack

- **Runtime**: Node.js (ES Modules)
- **Framework**: Express 5
- **Database**: PostgreSQL (Neon serverless)
- **ORM**: Drizzle ORM
- **Validation**: Zod
- **Authentication**: JWT + bcrypt
- **Logging**: Winston
- **Security**: Helmet, CORS, HTTP-only cookies
- **Code Quality**: ESLint + Prettier

## Project Structure

```
src/
├── index.js              # Entry point (loads env, starts server)
├── app.js                # Express app configuration
├── server.js             # Server startup
├── config/
│   ├── database.js       # Neon + Drizzle connection
│   └── logger.js         # Winston logger setup
├── controllers/
│   └── auth.controller.js # Authentication handlers
├── services/
│   └── auth.service.js   # Business logic (user creation, password hashing)
├── models/
│   └── user.model.js     # Drizzle database schema
├── routes/
│   └── auth.routes.js    # API route definitions
├── utils/
│   ├── jwt.js            # JWT token utilities
│   ├── cookies.js        # Cookie management helpers
│   └── format.js         # Error formatting utilities
└── validations/
    └── auth.validation.js # Zod validation schemas
```

## Path Aliases

The project uses Node.js subpath imports for clean imports:

- `#config/*` → `./src/config/*`
- `#controllers/*` → `./src/controllers/*`
- `#middleware/*` → `./src/middleware/*`
- `#models/*` → `./src/models/*`
- `#routes/*` → `./src/routes/*`
- `#services/*` → `./src/services/*`
- `#utils/*` → `./src/utils/*`
- `#validations/*` → `./src/validations/*`

## Available Scripts

```bash
npm run dev              # Start development server with watch mode
npm run lint             # Run ESLint
npm run lint:fix         # Fix ESLint issues automatically
npm run format           # Format code with Prettier
npm run format:check     # Check code formatting
npm run db:generate      # Generate Drizzle migrations
npm run db:migrate       # Run database migrations
npm run db:studio        # Open Drizzle Studio
```

## Environment Variables

Required environment variables (see `.env.example`):

```bash
# Server Configuration
PORT=3000
NODE_ENV=development
LOG_LEVEL=info

# Database Configuration
DATABASE_URL=postgresql://...

# JWT Configuration (optional, has defaults)
JWT_SECRET=your-secret-key-please-change-in-production
```

## Database Schema

### Users Table

- `id`: Serial primary key
- `name`: VARCHAR(255), required
- `email`: VARCHAR(255), required, unique
- `password`: VARCHAR(255), required (bcrypt hashed)
- `role`: VARCHAR(50), default 'user', enum: ['user', 'admin']
- `createdAt`: Timestamp, default now
- `updatedAt`: Timestamp, default now

## API Endpoints

### Authentication Routes (`/api/auth`)

- `POST /api/auth/sign-up` - User registration (implemented)
  - Body: `{ name, email, password, role? }`
  - Returns: User object + JWT cookie
- `POST /api/auth/sign-in` - User login (stub)
- `POST /api/auth/sign-out` - User logout (stub)

### Health Check Routes

- `GET /` - Basic hello response
- `GET /health` - Health check with uptime
- `GET /api` - API status check

## Development Workflow

1. **Setup**: Copy `.env.example` to `.env` and configure DATABASE_URL
2. **Install**: `npm install`
3. **Database**: `npm run db:generate && npm run db:migrate`
4. **Development**: `npm run dev` (uses Node.js --watch)
5. **Testing**: Use Drizzle Studio (`npm run db:studio`) for database inspection

## Code Style

- **ESLint**: Configured with recommended rules, 2-space indentation
- **Prettier**: Single quotes, semicolons, 80 char width
- **Import Style**: ES modules with path aliases
- **Error Handling**: Winston logging with structured error messages

## Security Features

- Password hashing with bcrypt (salt rounds: 10)
- JWT tokens with 1-day expiration
- HTTP-only cookies with secure flags in production
- Helmet for security headers
- CORS protection
- Input validation with Zod

## Known Issues

- Sign-in and sign-out routes are not implemented (only stubs exist)
- Bug in `cookies.clear()` function: references undefined `options` variable
- Missing JWT secret validation in production environments

## Common Tasks

- **Add new route**: Create in `src/routes/`, add controller in `src/controllers/`
- **Database changes**: Update schema in `src/models/`, run `npm run db:generate`
- **Add validation**: Create schemas in `src/validations/` using Zod
- **Add middleware**: Create in `src/middleware/` (directory needs to be created)

## Logging

- **Development**: Console output with colors
- **Production**: File logging to `logs/` directory
  - `logs/error.log` - Error level logs
  - `logs/combined.log` - All logs
- **HTTP requests**: Morgan middleware logs to Winston

## Dependencies

### Core

- `express` (5.2.1) - Web framework
- `drizzle-orm` (0.45.1) - Database ORM
- `@neondatabase/serverless` (1.0.2) - Neon database driver
- `zod` (4.3.6) - Schema validation
- `bcrypt` (6.0.0) - Password hashing
- `jsonwebtoken` (9.0.3) - JWT tokens

### Utilities

- `winston` (3.19.0) - Logging
- `helmet` (8.1.0) - Security headers
- `cors` (2.8.6) - Cross-origin requests
- `morgan` (1.10.1) - HTTP request logging
- `cookie-parser` (1.4.7) - Cookie handling
- `dotenv` (17.3.1) - Environment variables
