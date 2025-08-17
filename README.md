# Dev Wiki Monorepo

> A comprehensive developer knowledge-sharing platform built with TypeScript, featuring video tutorials, product reviews, and community discussions.

## Architecture Overview

Dev Wiki is a modern TypeScript-first monorepo that enables developers to share knowledge through interactive tutorials, video content, and product reviews. Built with scalability and developer experience in mind.

### Tech Stack

- **Frontend**: Next.js 15 (React 19) + Tailwind CSS + Shadcn/ui
- **Backend**: NestJS + TypeORM + PostgreSQL
- **Authentication**: JWT + Google OAuth + Role-based Access Control (RBAC)
- **Monorepo**: Turborepo + pnpm workspaces
- **Language**: TypeScript (strict mode)
- **Code Quality**: ESLint + Prettier + shared configurations

### Project Structure

```
dev-wiki/
├── apps/
│   ├── web/                 # Next.js frontend (port 3000)
│   ├── api/                 # NestJS backend (port 8000)
│   └── db/                  # Database scripts & Docker setup
├── packages/
│   ├── eslint-config/       # Shared ESLint rules
│   ├── typescript-config/   # Shared TypeScript configs
│   └── ui/                  # Shared React components (@repo/ui)
└── docker-compose.yml       # PostgreSQL + development services
```

## Quick Start

### Prerequisites

- **Node.js** 18+ 
- **pnpm** 9.0.0+
- **Docker** (for PostgreSQL)

### Setup

1. **Clone and install dependencies:**
   ```bash
   git clone <repository-url>
   cd dev-wiki
   pnpm install
   ```

2. **Start database:**
   ```bash
   docker compose up -d
   ```

3. **Configure environment variables:**
   ```bash
   # Copy environment files for each app
   cp apps/api/.env.example apps/api/.env
   cp apps/web/.env.example apps/web/.env
   ```

4. **Start development servers:**
   ```bash
   pnpm dev
   ```

### Access Points

- **Frontend**: http://localhost:3000
- **API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/api (Swagger)
- **Database**: PostgreSQL on localhost:5432

## Development Workflow

### Essential Commands

```bash
# Install dependencies
pnpm install

# Development (all apps)
pnpm dev

# Individual apps
pnpm dev --filter=web    # Frontend only
pnpm dev --filter=api    # Backend only

# Build
pnpm build               # All apps
pnpm build --filter=api  # Backend only

# Testing
pnpm test               # All tests
pnpm test:e2e          # End-to-end tests
pnpm test:cov          # Coverage report

# Code quality
pnpm lint              # Lint all code
pnpm lint --fix        # Auto-fix issues
pnpm format            # Format code
```

### Database Management

```bash
# Start PostgreSQL
docker compose up -d

# View logs
docker compose logs postgres

# Connect to database
docker exec -it dev-wiki-postgres psql -U devwiki -d devwiki
```

## Database Setup

For detailed database connection information and configuration, see the [Database README](./apps/db/README.md).

For step-by-step backup instructions with DBeaver, see [Database Backup Guide](./apps/db/BACKUP_DUMP_DBEAVER.md).

## Authentication & RBAC

1. **JWT Tokens**: Stored in localStorage for API authentication
2. **Role Cookies**: Set by backend, read by frontend middleware for RBAC
3. **Google OAuth**: Integrated via Passport.js
4. **Roles**: `user`, `mod`, `admin` with route-level protection

## Development Guidelines

### Code Standards
- **TypeScript strict mode** - No `any` types
- **Shared configurations** - ESLint/Prettier/TypeScript
- **Component patterns** - Reusable UI components in `@repo/ui`
- **API patterns** - DTOs, Guards, Services, Controllers

### Best Practices
1. **Use pnpm** for all package management
2. **Follow RBAC patterns** - Backend sets cookies, frontend enforces
3. **Type-safe APIs** - Share types between frontend/backend
4. **Test thoroughly** - Unit tests, E2E tests, coverage reports
5. **Error handling** - Structured errors with user-friendly messages

### Project Conventions
- **File naming**: kebab-case for files, PascalCase for components
- **Import order**: External → Internal → Relative
- **Error handling**: Try/catch with specific error types
- **Validation**: DTOs (backend) + Zod schemas (frontend)

## Documentation

### Application READMEs
- [Frontend (Web App)](./apps/web/README.md)
- [Backend (API)](./apps/api/README.md)
- [Database Setup](./apps/db/README.md)

### API Documentation
- **Swagger UI**: http://localhost:8000/api (when running)

## Troubleshooting

### Common Issues

**Database connection failed:**
```bash
# Ensure PostgreSQL is running
docker compose up -d
```

**TypeScript errors:**
```bash
# Rebuild types
pnpm build
```

**Port conflicts:**
```bash
# Check running processes
lsof -i :3000  # Frontend
lsof -i :8000  # Backend
lsof -i :5432  # Database
```

**Build failures:**
```bash
# Clean and reinstall
rm -rf node_modules
pnpm install
pnpm build
```
