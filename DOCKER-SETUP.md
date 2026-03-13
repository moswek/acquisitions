# Docker Setup Guide

This guide covers how to run the Acquisitions API using Docker with different configurations for development and production environments.

## Overview

The application supports two deployment modes:

- **Development**: Uses Neon Local proxy for ephemeral database branches
- **Production**: Connects directly to Neon Cloud database

## Prerequisites

- Docker and Docker Compose installed
- Neon account with API access
- Your Neon project credentials

## Development Setup (Neon Local)

### 1. Environment Configuration

Copy the development environment file and configure your Neon credentials:

```bash
cp .env.development .env
```

Edit `.env` and set your Neon project details:

```bash
# Your actual Neon project credentials
NEON_API_KEY=your_actual_neon_api_key
NEON_PROJECT_ID=your_actual_neon_project_id
PARENT_BRANCH_ID=your_parent_branch_id
```

### 2. Start Development Environment

```bash
# Start both the app and Neon Local proxy
docker-compose -f docker-compose.dev.yml up --build
```

This will:
- Start a Neon Local proxy that creates an ephemeral branch
- Build and start your application
- Connect the app to the local Postgres endpoint
- Enable hot reloading for development

### 3. Access Your Application

- Application: http://localhost:3000
- Health check: http://localhost:3000/health
- Database: postgres://neon:npg@localhost:5432/acquisitions

### 4. Development Workflow

```bash
# View logs
docker-compose -f docker-compose.dev.yml logs -f

# Stop services
docker-compose -f docker-compose.dev.yml down

# Rebuild after changes
docker-compose -f docker-compose.dev.yml up --build
```

### 5. Database Operations

```bash
# Run migrations in development
docker-compose -f docker-compose.dev.yml exec app npm run db:migrate

# Generate new migrations
docker-compose -f docker-compose.dev.yml exec app npm run db:generate

# Access Drizzle Studio (run outside container)
npm run db:studio
```

## Production Setup (Neon Cloud)

### 1. Environment Configuration

Create production environment variables:

```bash
# Set these as environment variables in your deployment platform
export DATABASE_URL="postgres://user:pass@ep-xxx.us-east-1.aws.neon.tech/dbname?sslmode=require"
export JWT_SECRET="your-super-secure-production-secret"
export NODE_ENV="production"
export PORT="3000"
export LOG_LEVEL="info"
```

### 2. Deploy Production

```bash
# Build and start production container
docker-compose -f docker-compose.prod.yml up --build -d
```

### 3. Health Monitoring

```bash
# Check container status
docker-compose -f docker-compose.prod.yml ps

# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Check health
curl http://localhost:3000/health
```

## Configuration Details

### Environment Variables

#### Development (.env.development)
```bash
NODE_ENV=development
DATABASE_URL=postgres://neon:npg@neon-local:5432/acquisitions?sslmode=require
NEON_API_KEY=your_neon_api_key
NEON_PROJECT_ID=your_neon_project_id
PARENT_BRANCH_ID=your_parent_branch_id
```

#### Production (.env.production)
```bash
NODE_ENV=production
DATABASE_URL=postgres://user:pass@ep-xxx.neon.tech/dbname?sslmode=require
JWT_SECRET=your-production-secret
```

### Database Connection Modes

#### Development (Neon Local)
- Creates ephemeral database branches automatically
- Each container restart = fresh database copy
- Perfect for testing without data persistence concerns
- Supports both Postgres and Neon serverless drivers

#### Production (Neon Cloud)
- Direct connection to your Neon Cloud database
- Persistent data storage
- Optimized for performance and reliability
- SSL-enabled connections

## Docker Images

### Multi-stage Build
The Dockerfile uses multi-stage builds:

- **base**: Common Node.js setup
- **development**: Includes dev dependencies, enables hot reload
- **deps**: Production dependencies only
- **production**: Optimized runtime image

### Security Features
- Non-root user (nodejs:nodejs)
- Read-only filesystem in production
- Resource limits and health checks
- Proper signal handling with dumb-init

## Troubleshooting

### Common Issues

#### 1. Neon Local Connection Failed
```bash
# Check Neon Local container logs
docker-compose -f docker-compose.dev.yml logs neon-local

# Verify environment variables are set
docker-compose -f docker-compose.dev.yml exec app env | grep NEON
```

#### 2. Database Migration Issues
```bash
# Run migrations manually
docker-compose -f docker-compose.dev.yml exec app npm run db:migrate

# Check database connectivity
docker-compose -f docker-compose.dev.yml exec app node -e "
import { db } from './src/config/database.js';
console.log('Database connected:', !!db);
"
```

#### 3. SSL/TLS Certificate Issues
For development, the Neon Local proxy uses self-signed certificates. This is handled automatically in the configuration.

#### 4. Hot Reload Not Working
Ensure source code is properly mounted:
```bash
# Check volume mounts
docker-compose -f docker-compose.dev.yml exec app ls -la /usr/src/app/src
```

### Performance Optimization

#### Development
- Source code volumes for hot reloading
- Debug logging enabled
- Development-optimized Neon Local config

#### Production
- Read-only container filesystem
- Resource limits (1 CPU, 512MB RAM)
- Compressed logging with rotation
- Health checks for uptime monitoring

## Deployment Platforms

### Docker Swarm
```bash
docker stack deploy -c docker-compose.prod.yml acquisitions
```

### Kubernetes
Convert using kompose:
```bash
kompose convert -f docker-compose.prod.yml
```

### Cloud Platforms
The production Docker Compose file works with:
- AWS ECS
- Google Cloud Run
- Azure Container Instances
- DigitalOcean App Platform

## Security Considerations

1. **Never commit real credentials** to version control
2. **Use environment variable injection** in production
3. **Rotate JWT secrets** regularly
4. **Enable SSL** for all database connections
5. **Use read-only containers** in production
6. **Implement proper logging** without exposing sensitive data

## Next Steps

1. Set up CI/CD pipeline for automated deployments
2. Configure monitoring and alerting
3. Implement backup strategies for production data
4. Set up SSL certificates for HTTPS
5. Configure reverse proxy (Nginx/Traefik) for production