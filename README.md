# Dev Wiki

A comprehensive development wiki platform built with modern web technologies. This monorepo contains multiple applications and shared packages for creating, managing, and consuming developer documentation and tutorials.

## 🚀 Project Overview

Dev Wiki is a full-stack monorepo application designed to provide a seamless platform for developer documentation and knowledge sharing. The project leverages the power of Turborepo for efficient development and build processes across multiple interconnected applications.

### 🛠 Tech Stack

- **Frontend**: Next.js 15.3.0 with React 19
- **Backend**: NestJS with TypeScript
- **Monorepo Management**: Turborepo 2.5.4
- **Package Manager**: pnpm 9.0.0
- **Language**: TypeScript 5.8.3
- **Styling**: Shared UI component library
- **Code Quality**: ESLint + Prettier
- **Runtime**: Node.js 18+

## 📁 Project Structure

This monorepo includes the following applications and packages:

### Applications

- **`web`**: Main web application built with Next.js (runs on port 3000)
- **`docs`**: Documentation site built with Next.js (runs on port 3001)
- **`api`**: Backend API server built with NestJS

### Shared Packages

- **`@repo/ui`**: Shared React component library used across all applications
- **`@repo/eslint-config`**: ESLint configurations (includes `eslint-config-next` and `eslint-config-prettier`)
- **`@repo/typescript-config`**: Shared TypeScript configurations for the monorepo

All packages and applications are written in 100% TypeScript for enhanced developer experience and type safety.

## 📋 Prerequisites

Before getting started, ensure you have the following installed on your system:

### Required Software

1. **Node.js** (version 18 or higher)

   ```bash
   node --version  # Should show v18.0.0 or higher
   ```

2. **pnpm** (version 9.0.0 or higher) - Required package manager

   ```bash
   npm install -g pnpm
   pnpm --version  # Should show 9.0.0 or higher
   ```

3. **Git** (for cloning the repository)
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
