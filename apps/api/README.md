# API - Dev Wiki Backend

The backend API server for the Dev Wiki platform, built with NestJS and TypeScript. This application provides REST APIs for user authentication, account management, and tutorial content management in the monorepo.

## 🚀 Project Overview

The **API** application serves as the core backend service for the Dev Wiki platform. It's responsible for:

- **User Authentication & Authorization**: JWT-based authentication with Passport.js
- **Account Management**: User registration, login, and profile management
- **Tutorial Management**: CRUD operations for developer tutorials and documentation
- **Data Persistence**: PostgreSQL database integration with TypeORM

### Role in Monorepo

- Provides REST APIs consumed by the `web` and `docs` applications
- Shares TypeScript configurations and ESLint rules from `@repo/` packages
- Runs independently on port 8000 (configurable via environment)
- Integrates with the Turborepo build system for efficient development and deployment

## 📋 Setup Instructions

### Prerequisites

Ensure you have the following installed:

1. **Node.js** (version 18 or higher)
2. **pnpm** (version 9.0.0 or higher) - Required package manager
3. **PostgreSQL** (for database, or use external hosted database)

### Installation

1. **Install dependencies** from the root of the monorepo:
   ```bash
   # From monorepo root
   pnpm install
   ```

2. **Environment Variables Setup**:
   
   Copy and configure the environment file:
   ```bash
   cd apps/api
   cp .env.development .env
   ```

   **Required Environment Variables:**
   ```bash
   # Server Configuration
   PORT=8000                    # API server port (default: 8000)

   # Database Configuration (choose one approach)
   
   # Option 1: Local PostgreSQL Database
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=dev_wiki_local
   USERNAME=postgres
   PASSWORD=postgres

   # Option 2: External Database (for development/production)
   DB_HOST=your-db-host.com
   DB_PORT=5432
   DB_NAME=dev_wiki
   USERNAME=your_username
   PASSWORD=your_password
   ```

   **Optional Environment Variables:**
   ```bash
   # Database URL alternatives (if not using individual DB_ vars)
   INTERNAL_DB_URL=postgresql://user:pass@host/db_name
   EXTERNAL_DB_URL=postgresql://user:pass@external-host/db_name
   ```

### Database Setup

**Option 1: Local PostgreSQL**
```bash
# Create local database
createdb dev_wiki_local

# Update .env with local database settings
DB_HOST=localhost
DB_PORT=5432
DB_NAME=dev_wiki_local
USERNAME=postgres
PASSWORD=postgres
```

**Option 2: Use External Database**
- Uncomment the external database configuration in `.env`
- The application will automatically create tables using TypeORM synchronization

## 🛠 Development Guide

### Starting Development Server

```bash
# From monorepo root (recommended)
pnpm dev --filter=api

# Or from api directory
cd apps/api
pnpm dev
```

The API server will start at `http://localhost:8000` (or configured PORT).

### Available Scripts

```bash
# Development server with hot reload
pnpm dev                    # or pnpm start:dev

# Production build
pnpm build

# Start production server
pnpm start                  # or pnpm start:prod

# Debug mode
pnpm start:debug

# Code formatting
pnpm format

# Linting
pnpm lint

# Type checking (from monorepo root)
pnpm check-types --filter=api
```

### Testing

```bash
# Run unit tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run end-to-end tests
pnpm test:e2e

# Generate test coverage report
pnpm test:cov

# Debug tests
pnpm test:debug
```

### Debugging

1. **VS Code Debugging**: Use the debug configuration or run:
   ```bash
   pnpm start:debug
   ```

2. **Database Debugging**: 
   - Check TypeORM logs in console output
   - Verify database connection in application startup logs
   - Use database client tools to inspect data

3. **API Testing**: 
   - Use tools like Postman, Insomnia, or curl
   - API runs on `http://localhost:8000`
   - Check available endpoints in controller files

## 🏗 Build & Deploy

### Building for Production

```bash
# From monorepo root
pnpm build --filter=api

# Or from api directory
cd apps/api
pnpm build
```

This creates a `dist/` directory with compiled JavaScript files.

### Starting Production Server

```bash
# After building
pnpm start:prod

# Or directly run the compiled output
node dist/main
```

### Deployment Considerations

1. **Environment Variables**: Ensure production environment variables are properly configured
2. **Database**: Use external PostgreSQL database for production
3. **SSL**: Configure SSL for external database connections
4. **Process Management**: Use PM2, Docker, or similar for process management
5. **Logging**: Configure proper logging levels for production
6. **Health Checks**: The application includes basic health endpoints

### Docker Deployment (if applicable)

```bash
# Build Docker image (from api directory)
docker build -t dev-wiki-api .

# Run container
docker run -p 8000:8000 --env-file .env dev-wiki-api
```

## 📏 Coding Standards & Contribution

### Shared Configurations

The API application follows the monorepo's shared standards:

- **TypeScript Config**: Extends `@repo/typescript-config`
- **ESLint Config**: Uses shared ESLint configurations with NestJS-specific rules
- **Prettier**: Automatic code formatting on save

### API-Specific Guidelines

1. **Module Structure**: Follow NestJS module pattern
   - Each feature should have its own module (e.g., `auth`, `account`, `tutorial`)
   - Use proper separation between controllers, services, and entities

2. **Database Entities**: Use TypeORM decorators and follow entity naming conventions

3. **DTOs**: Use class-validator for request/response validation

4. **Error Handling**: Use NestJS built-in exception filters

5. **Authentication**: Follow JWT + Passport.js patterns already established

### Code Quality

```bash
# Before committing, ensure code passes:
pnpm lint --fix              # Fix linting issues
pnpm format                  # Format code
pnpm test                    # Run tests
pnpm build                   # Verify build success
```

## 🚨 Common Issues & Troubleshooting

### Database Connection Issues

**Problem**: `ENOTFOUND` or connection timeout errors
```bash
Error: getaddrinfo ENOTFOUND your-db-host
```

**Solutions**:
1. Verify database host and credentials in `.env`
2. Check if database is accessible from your network
3. For external databases, ensure SSL configuration is correct
4. Try using database URL format instead of individual parameters

### Port Already in Use

**Problem**: `EADDRINUSE: address already in use :::8000`

**Solution**:
```bash
# Find and kill process on port 8000
lsof -ti:8000 | xargs kill -9

# Or use a different port
PORT=8001 pnpm dev
```

### TypeORM Synchronization Issues

**Problem**: Database schema sync errors

**Solutions**:
1. For development: Drop and recreate database
2. Check entity definitions for syntax errors
3. Disable synchronization and use migrations for production

### Missing Dependencies

**Problem**: Module not found errors

**Solution**:
```bash
# Reinstall dependencies
pnpm install

# Clear cache if needed
pnpm store prune
rm -rf node_modules
pnpm install
```

### ESLint/TypeScript Errors

**Problem**: Linting or type checking failures

**Solutions**:
```bash
# Fix auto-fixable linting issues
pnpm lint --fix

# Check TypeScript errors
pnpm check-types --filter=api

# Restart TypeScript server in VS Code
# Cmd/Ctrl + Shift + P -> "TypeScript: Restart TS Server"
```

### JWT Authentication Issues

**Problem**: Token validation failures

**Solutions**:
1. Verify JWT secret configuration
2. Check token expiration settings
3. Ensure proper token format in requests
4. Verify Passport.js strategy configuration

## 📚 References

- **Root README**: [../../README.md](../../README.md) - Complete monorepo setup and context
- **NestJS Documentation**: [https://docs.nestjs.com](https://docs.nestjs.com)
- **TypeORM Documentation**: [https://typeorm.io](https://typeorm.io)
- **Turborepo Documentation**: [https://turborepo.com/docs](https://turborepo.com/docs)
- **Shared Packages**:
  - UI Components: `packages/ui/README.md`
  - TypeScript Config: `packages/typescript-config`
  - ESLint Config: `packages/eslint-config`

For questions about the overall project setup, deployment, or shared configurations, refer to the [root README](../../README.md).
