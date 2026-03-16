# Acquisitions API

A production-ready RESTful API built with Node.js and Express, featuring authentication, role-based access control, rate limiting, bot protection, and a fully automated CI/CD pipeline.

## Features

- **JWT Authentication** — Secure cookie-based auth with sign up, sign in, and sign out
- **Role-Based Access Control** — Admin and user roles with protected routes
- **Request Security** — Bot detection and shield protection via Arcjet
- **Rate Limiting** — Dynamic rate limits per user role (admin/user/guest)
- **Input Validation** — Schema-based request validation using Zod
- **Database ORM** — Type-safe queries with Drizzle ORM on Neon Postgres
- **Structured Logging** — Winston logger with Morgan HTTP request logging
- **Containerized** — Docker support for both development and production
- **CI/CD Pipeline** — GitHub Actions workflows for linting, testing, and Docker builds
- **Test Coverage** — Jest test suite with coverage reporting

## Tech Stack

| Layer            | Technology                                    |
| ---------------- | --------------------------------------------- |
| Runtime          | Node.js 18+                                   |
| Framework        | Express.js                                    |
| Database         | PostgreSQL via Neon                           |
| ORM              | Drizzle ORM                                   |
| Auth             | JWT + HTTP-only cookies                       |
| Validation       | Zod                                           |
| Security         | Arcjet (rate limiting, bot detection, shield) |
| Logging          | Winston + Morgan                              |
| Testing          | Jest + Supertest                              |
| Containerization | Docker + Docker Compose                       |
| CI/CD            | GitHub Actions                                |

## Project Structure

```
src/
├── config/          # Database, logger, and Arcjet configuration
├── controllers/     # Route handlers for auth and users
├── middleware/      # Authentication and security middleware
├── models/          # Drizzle ORM schema definitions
├── routes/          # Express route definitions
├── services/        # Business logic layer
├── utils/           # JWT, cookies, and formatting utilities
└── validations/     # Zod schemas for request validation
```

## Getting Started

### Prerequisites

- Node.js 18+
- Docker and Docker Compose
- A [Neon](https://neon.tech) PostgreSQL database
- An [Arcjet](https://arcjet.com) account

### Installation

1. Clone the repository

```bash
git clone https://github.com/moswek/acquisitions.git
cd acquisitions
```

2. Install dependencies

```bash
npm install
```

3. Set up environment variables

```bash
cp .env.example .env
```

Fill in your values in `.env`.

4. Run database migrations

```bash
npx drizzle-kit push
```

5. Start the development server

```bash
npm run dev
```

### Running with Docker

```bash
npm run dev:docker
```

This spins up the app and a local Neon proxy via Docker Compose with hot reload enabled.

## API Endpoints

### Auth

| Method | Endpoint             | Description                    | Access |
| ------ | -------------------- | ------------------------------ | ------ |
| POST   | `/api/auth/sign-up`  | Register a new user            | Public |
| POST   | `/api/auth/sign-in`  | Authenticate and receive token | Public |
| POST   | `/api/auth/sign-out` | Clear session token            | Public |

### Users

| Method | Endpoint         | Description    | Access               |
| ------ | ---------------- | -------------- | -------------------- |
| GET    | `/api/users`     | Get all users  | Admin only           |
| GET    | `/api/users/:id` | Get user by ID | Authenticated        |
| PUT    | `/api/users/:id` | Update user    | Own profile or Admin |
| DELETE | `/api/users/:id` | Delete user    | Admin only           |

### Health

| Method | Endpoint  | Description          |
| ------ | --------- | -------------------- |
| GET    | `/health` | Service health check |
| GET    | `/api`    | API status           |

## Environment Variables

See `.env.example` for all required variables.

```env
PORT=3000
NODE_ENV=development
LOG_LEVEL=info
DATABASE_URL=postgresql://user:password@host/dbname
JWT_SECRET=your-secret-here
ARCJET_KEY=your-arcjet-key-here
```

## CI/CD

Three GitHub Actions workflows are included:

- **lint-and-format.yml** — Runs ESLint and Prettier on pushes to `main` and `staging`
- **tests.yml** — Runs the Jest test suite and uploads coverage reports
- **docker-build-and-push.yml** — Builds and pushes a multi-platform Docker image to Docker Hub on merge to `main`

## License

MIT
