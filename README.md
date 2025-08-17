# Dev Wiki Monorepo

> A comprehensive developer knowledge-sharing platform built with TypeScript, featuring video tutorials, product reviews, and community discussions.

## 🏗️ Architecture Overview

Dev Wiki is a modern TypeScript-first monorepo that enables developers to share knowledge through interactive tutorials, video content, and product reviews. Built with scalability and developer experience in mind.

### 🚀 Tech Stack

- **Frontend**: Next.js 15 (React 19) + Tailwind CSS + Shadcn/ui
- **Backend**: NestJS + TypeORM + PostgreSQL
- **Authentication**: JWT + Google OAuth + Role-based Access Control (RBAC)
- **Monorepo**: Turborepo + pnpm workspaces
- **Language**: TypeScript (strict mode)
- **Code Quality**: ESLint + Prettier + shared configurations

### � Project Structure

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

## 🚀 Quick Start

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

## ⚡ Development Workflow

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

## 🏛️ Architecture Details

### Authentication Flow
1. **JWT Tokens**: Stored in localStorage for API authentication
2. **Role Cookies**: Set by backend, read by frontend middleware for RBAC
3. **Google OAuth**: Integrated via Passport.js
4. **Roles**: `user`, `mod`, `admin` with route-level protection

### Key Features
- **Video Management**: YouTube integration with metadata fetching
- **Tutorial System**: Rich content creation and management
- **Comment System**: Nested comments with replies
- **Voting System**: Upvote/downvote for content
- **Product Reviews**: Community-driven product evaluations
- **Category System**: Organized content discovery

### Data Flow
```
Frontend (Next.js) → API Routes → Backend (NestJS) → Database (PostgreSQL)
       ↑                                    ↓
   React Query Cache ←────── JWT Auth ──────┘
```

## 🛠️ Development Guidelines

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

## 📚 Documentation

### Application READMEs
- [Frontend (Web App)](./apps/web/README.md)
- [Backend (API)](./apps/api/README.md)
- [Database Setup](./apps/db/README.md)

### API Documentation
- **Swagger UI**: http://localhost:8000/api (when running)
- **Endpoints**: See `apps/api/README.md` for detailed API documentation
- **Authentication**: JWT bearer tokens + role-based access

### Deployment
- **Frontend**: Vercel-ready (Next.js)
- **Backend**: Docker-ready (NestJS)
- **Database**: PostgreSQL with TypeORM migrations
- **Environment**: Separate configs for dev/staging/production

## 🤝 Contributing

### Before Making Changes
1. **Understand the structure** - Review this README and app-specific docs
2. **Check existing patterns** - Follow established conventions
3. **Run tests** - Ensure all tests pass before committing
4. **Type safety** - Verify TypeScript compilation

### Common Tasks
- **New API endpoint**: Create controller → service → DTO → entity
- **New frontend page**: Use App Router → hooks → API integration
- **Database changes**: Update entities → run migrations → update types
- **UI components**: Add to `@repo/ui` for reusability

### Development Flow
```bash
# 1. Create feature branch
git checkout -b feature/your-feature

# 2. Make changes and test
pnpm dev
pnpm test
pnpm lint

# 3. Build and verify
pnpm build

# 4. Commit and push
git commit -m "feat: your feature description"
git push origin feature/your-feature
```

## 🚨 Troubleshooting

### Common Issues

**Database connection failed:**
```bash
# Ensure PostgreSQL is running
docker compose up -d
# Check logs
docker compose logs postgres
```

**TypeScript errors:**
```bash
# Check shared configs
ls packages/typescript-config/
# Rebuild types
pnpm build --filter=api
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
rm -rf node_modules apps/*/node_modules
pnpm install
pnpm build
```

### Getting Help
- Check app-specific READMEs for detailed setup
- Review error logs in terminal output
- Ensure all environment variables are configured
- Verify Node.js and pnpm versions match requirements

---

## 📄 License

This project is private and proprietary.

## 🔗 Links

- [Frontend Documentation](./apps/web/README.md)
- [API Documentation](./apps/api/README.md)
- [Copilot Instructions](./.github/copilot-instructions.md)

   ```bash
   npm install -g pnpm
   pnpm --version  # Should show 9.0.0 or higher
   ```

1. **Git** (for cloning the repository)
   ```bash
   git --version
   ```

### Optional but Recommended

- **Turborepo CLI** (for advanced usage)
  ```bash
  npm install -g turbo
  ```

## 🚀 Getting Started

Follow these steps to set up the development environment:

### 1. Clone the Repository

```bash
git clone <repository-url>
cd dev-wiki
```

### 2. Install Dependencies

Install all dependencies for the entire monorepo:

```bash
pnpm install
```

This command will:

- Install dependencies for all apps and packages
- Create symlinks between workspace packages
- Set up the development environment

### 3. Environment Setup

Currently, no environment variables are required for basic development. If needed in the future, environment files should be created as:

```bash
# Create environment files (when needed)
cp .env.example .env.local  # If .env.example exists
```

### 4. Start Development

Start all applications in development mode:

```bash
pnpm dev
```

This will start:

- Web app: http://localhost:3000
- Docs app: http://localhost:3001
- API server: http://localhost:3333 (default NestJS port)

### 5. Verify Installation

Check that everything is working:

```bash
# Build all applications
pnpm build

# Run type checking
pnpm check-types

# Run linting (note: may show some warnings)
pnpm lint
```

## 🛠 Development Scripts

Here are the main commands available in the project:

### Core Commands

```bash
# Start all applications in development mode
pnpm dev

# Build all applications for production
pnpm build

# Run linting across all packages
pnpm lint

# Run type checking across all packages
pnpm check-types

# Format code using Prettier
pnpm format
```

### Working with Specific Apps

You can target specific applications using Turborepo filters:

```bash
# Start only the web application
pnpm dev --filter=web

# Build only the docs application
pnpm build --filter=docs

# Run linting for the API only
pnpm lint --filter=api

# Start only the API server
pnpm dev --filter=api
```

### Individual App Commands

Navigate to specific app directories for app-specific commands:

```bash
# Web app commands
cd apps/web
pnpm dev          # Start web app on port 3000
pnpm build        # Build web app
pnpm start        # Start production build

# Docs app commands
cd apps/docs
pnpm dev          # Start docs on port 3001
pnpm build        # Build docs app
pnpm start        # Start production build

# API commands
cd apps/api
pnpm dev          # Start API in watch mode
pnpm start        # Start API in production mode
pnpm test         # Run API tests
pnpm test:e2e     # Run end-to-end tests
```

## 🔧 Troubleshooting

### Common Issues and Solutions

#### Issue: `pnpm: command not found`

**Solution**: Install pnpm globally

```bash
npm install -g pnpm
# or
curl -fsSL https://get.pnpm.io/install.sh | sh -
```

#### Issue: Node.js version mismatch

**Error**: `engines.node` requirement not met
**Solution**: Update Node.js to version 18 or higher

```bash
# Check current version
node --version

# Update using nvm (recommended)
nvm install 18
nvm use 18

# Or download from https://nodejs.org/
```

#### Issue: Package installation fails

**Solution**: Clear cache and reinstall

```bash
pnpm store prune
rm -rf node_modules
rm pnpm-lock.yaml
pnpm install
```

#### Issue: Port already in use

**Error**: `EADDRINUSE: address already in use :::3000`
**Solution**: Kill processes on ports or use different ports

```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or start with different port
cd apps/web
pnpm dev -- --port 3001
```

#### Issue: TypeScript errors during development

**Solution**: Restart TypeScript server in your editor or run type checking

```bash
# Manual type check
pnpm check-types

# In VS Code: Cmd/Ctrl + Shift + P -> "TypeScript: Restart TS Server"
```

#### Issue: ESLint warnings/errors

The project may have some linting issues. To fix automatically:

```bash
# Auto-fix linting issues
pnpm lint --fix

# Format code
pnpm format
```

#### Issue: Build cache issues

**Solution**: Clear Turborepo cache

```bash
npx turbo clean
# or
rm -rf .turbo
```

### Performance Tips

1. **Use Turborepo filters** for faster development when working on specific apps
2. **Enable Turborepo caching** for faster builds (see Remote Caching section)
3. **Use `pnpm dev --filter=<app>`** to start only the app you're working on

## 🤝 Contributing

We welcome contributions to the Dev Wiki project! Here's how to get started:

### Getting Started with Contributions

1. **Fork the repository** on GitHub
2. **Clone your fork** locally
3. **Create a feature branch**: `git checkout -b feature/your-feature-name`
4. **Follow the setup instructions** above to get the project running
5. **Make your changes** following our coding standards
6. **Test your changes** thoroughly
7. **Submit a pull request** with a clear description

### Coding Standards

- **TypeScript**: All code must be written in TypeScript with proper typing
- **ESLint**: Follow the project's ESLint configuration
- **Prettier**: Code formatting is handled by Prettier (run `pnpm format`)
- **Naming**: Use descriptive variable and function names
- **Comments**: Add comments for complex logic

### Before Submitting

Make sure your changes pass all checks:

```bash
# Run type checking
pnpm check-types

# Run linting
pnpm lint

# Run formatting
pnpm format

# Build all apps
pnpm build
```

### Project Guidelines

- Keep changes focused and atomic
- Write clear commit messages
- Update documentation when needed
- Add tests for new functionality
- Ensure backward compatibility

## 📚 Learning Resources

### Turborepo

- [Turborepo Documentation](https://turborepo.com/docs)
- [Tasks](https://turborepo.com/docs/crafting-your-repository/running-tasks)
- [Caching](https://turborepo.com/docs/crafting-your-repository/caching)
- [Filtering](https://turborepo.com/docs/crafting-your-repository/running-tasks#using-filters)

### Tech Stack

- [Next.js 15 Documentation](https://nextjs.org/docs)
- [NestJS Documentation](https://docs.nestjs.com/)
- [React 19 Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [pnpm Documentation](https://pnpm.io/)

## 📄 License

This project is private and not yet licensed for public use.

## 🆘 Support

If you encounter any issues not covered in the troubleshooting section:

1. Check existing GitHub Issues in the repository
2. Create a new issue with detailed description and reproduction steps
3. Include your environment details (Node.js version, OS, etc.)
