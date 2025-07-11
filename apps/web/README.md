# Web - Dev Wiki Frontend

The main web application for the Dev Wiki platform, built with Next.js 15, React 19, and TypeScript. This application provides the primary user interface for browsing and interacting with developer documentation and tutorials.

## 🚀 Project Overview

The **Web** application serves as the main frontend interface for the Dev Wiki platform. It's responsible for:

- **User Interface**: Modern, responsive web interface for content consumption
- **Content Display**: Rendering developer tutorials, documentation, and wiki content
- **User Interaction**: Interactive features for browsing, searching, and managing content
- **Integration**: Seamless communication with the `api` backend for data operations

### Role in Monorepo

- Primary user-facing web application running on port 3000
- Consumes REST APIs provided by the `api` application
- Uses shared UI components from `@repo/ui` package
- Follows shared TypeScript and ESLint configurations from `@repo/` packages
- Integrates with Turborepo for optimized development and build processes

## 📋 Setup Instructions

### Prerequisites

Ensure you have the following installed:

1. **Node.js** (version 18 or higher)
2. **pnpm** (version 9.0.0 or higher) - Required package manager

### Installation

1. **Install dependencies** from the root of the monorepo:

   ```bash
   # From monorepo root
   pnpm install
   ```

2. **Environment Variables Setup** (Optional):

   Currently, the web application doesn't require environment variables for basic operation. If needed in the future, create:

   ```bash
   cd apps/web
   cp .env.example .env.local  # When .env.example is available
   ```

   **Potential Environment Variables:**

   ```bash
   # API Configuration (when backend integration is needed)
   NEXT_PUBLIC_API_URL=http://localhost:8000  # API server URL

   # App Configuration
   NEXT_PUBLIC_APP_ENV=development            # Environment identifier

   # Analytics/External Services (when applicable)
   NEXT_PUBLIC_ANALYTICS_ID=your_analytics_id
   ```

## 🛠 Development Guide

### Starting Development Server

```bash
# From monorepo root (recommended)
pnpm dev --filter=web

# Or from web directory
cd apps/web
pnpm dev
```

The web application will start at `http://localhost:3000` with Turbopack for fast development.

### Available Scripts

```bash
# Development server with Turbopack (fast refresh)
pnpm dev

# Production build
pnpm build

# Start production server (after build)
pnpm start

# Linting with zero warnings tolerance
pnpm lint

# Type checking
pnpm check-types

# Format code (inherited from root)
pnpm format
```

### Development Features

1. **Hot Reload**: Instant page updates as you edit files
2. **Turbopack**: Next.js's faster bundler for development
3. **TypeScript**: Full type safety across the application
4. **Shared Components**: Access to `@repo/ui` component library
5. **Auto-optimization**: Next.js automatically optimizes fonts, images, and code

### File Structure

```
apps/web/
├── app/                     # Next.js 13+ App Router
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page
│   └── favicon.ico         # App favicon
├── lib/                    # Utility functions and configurations
├── public/                 # Static assets
├── next.config.js          # Next.js configuration
├── tsconfig.json          # TypeScript configuration
└── package.json           # Dependencies and scripts
```

### Debugging

1. **Browser DevTools**: Use React DevTools and standard browser debugging
2. **TypeScript Errors**: Check VS Code problems panel or run `pnpm check-types`
3. **Next.js Debugging**:

   ```bash
   # Enable debug mode
   DEBUG=* pnpm dev

   # Or specific debug categories
   DEBUG=next:* pnpm dev
   ```

## 🏗 Build & Deploy

### Building for Production

```bash
# From monorepo root
pnpm build --filter=web

# Or from web directory
cd apps/web
pnpm build
```

This creates an optimized `.next/` directory with:

- Static pages pre-rendered
- Optimized JavaScript bundles
- Compressed assets and images
- Build analytics and reports

### Production Server

```bash
# Start production server (after build)
pnpm start

# The app will be available at http://localhost:3000
```

### Deployment Options

**1. Vercel (Recommended for Next.js)**

```bash
# Deploy to Vercel
npx vercel --cwd apps/web

# Or connect GitHub repository for automatic deployments
```

**2. Static Export (if applicable)**

```bash
# Configure next.config.js for static export
# Then build and export
pnpm build
```

**3. Docker Deployment**

```bash
# Build Docker image (from web directory)
docker build -t dev-wiki-web .

# Run container
docker run -p 3000:3000 dev-wiki-web
```

**4. Other Platforms**

- **Netlify**: Connect repository for automatic deployments
- **AWS**: Use AWS Amplify or deploy to EC2/ECS
- **Self-hosted**: Use PM2 or similar process managers

## 📏 Coding Standards & Contribution

### Shared Configurations

The web application follows the monorepo's shared standards:

- **TypeScript Config**: Extends `@repo/typescript-config`
- **ESLint Config**: Uses `@repo/eslint-config` with Next.js-specific rules
- **UI Components**: Leverages `@repo/ui` for consistent design system

### Web-Specific Guidelines

1. **Next.js App Router**: Use the new app directory structure
   - Place pages in `app/` directory
   - Use `layout.tsx` for shared layouts
   - Implement proper loading and error states

2. **Component Structure**:

   ```tsx
   // Use TypeScript with proper prop typing
   interface ComponentProps {
     title: string;
     optional?: boolean;
   }

   export default function Component({ title, optional }: ComponentProps) {
     return <div>{title}</div>;
   }
   ```

3. **Styling**: Follow Next.js styling conventions
   - Use CSS Modules for component-specific styles
   - Leverage shared UI components from `@repo/ui`
   - Implement responsive design principles

4. **Performance**:
   - Use Next.js Image component for optimized images
   - Implement proper loading states
   - Follow React performance best practices

### Code Quality

```bash
# Before committing, ensure code passes:
pnpm lint                    # ESLint with zero warnings
pnpm check-types            # TypeScript validation
pnpm build                  # Production build success
```

## 🚨 Common Issues & Troubleshooting

### Development Server Issues

**Problem**: Development server won't start or crashes

```bash
Error: EADDRINUSE: address already in use :::3000
```

**Solutions**:

```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or start on different port
pnpm dev -- --port 3001

# Check for port conflicts
netstat -an | grep 3000
```

### Build Failures

**Problem**: Build fails with TypeScript or ESLint errors

**Solutions**:

```bash
# Check TypeScript errors
pnpm check-types

# Fix linting issues
pnpm lint --fix

# Clear Next.js cache
rm -rf .next
pnpm build
```

### Turbopack Issues

**Problem**: Turbopack development errors

**Solutions**:

```bash
# Disable Turbopack temporarily
pnpm dev -- --no-turbo

# Or use traditional webpack
TURBOPACK=0 pnpm dev

# Clear cache
rm -rf .next
```

### Import/Module Issues

**Problem**: Cannot resolve module imports

**Solutions**:

```bash
# Reinstall dependencies
pnpm install

# Check TypeScript paths
# Verify tsconfig.json baseUrl and paths

# For shared packages, ensure they're built
pnpm build --filter=@repo/ui
```

### Styling Issues

**Problem**: CSS not loading or styles not applied

**Solutions**:

1. Check CSS Module naming conventions
2. Verify import statements
3. Clear browser cache and restart dev server
4. Ensure proper CSS-in-JS setup if used

### Performance Issues

**Problem**: Slow page loads or poor performance

**Solutions**:

1. Use Next.js Image component for images
2. Implement proper code splitting
3. Check bundle analyzer:
   ```bash
   ANALYZE=true pnpm build
   ```
4. Optimize imports and dependencies

## 📚 References

- **Root README**: [../../README.md](../../README.md) - Complete monorepo setup and context
- **Next.js 15 Documentation**: [https://nextjs.org/docs](https://nextjs.org/docs)
- **React 19 Documentation**: [https://react.dev/](https://react.dev/)
- **Turborepo Documentation**: [https://turborepo.com/docs](https://turborepo.com/docs)
- **Shared Packages**:
  - UI Components: `@repo/ui` - [../../packages/ui/README.md](../../packages/ui/README.md)
  - TypeScript Config: `@repo/typescript-config`
  - ESLint Config: `@repo/eslint-config`
- **API Integration**: [../api/README.md](../api/README.md) - Backend API documentation

### Learning Resources

- **Next.js Learn**: [https://nextjs.org/learn](https://nextjs.org/learn) - Interactive Next.js tutorial
- **React DevTools**: Browser extension for debugging React applications
- **Vercel Deployment**: [https://vercel.com/docs](https://vercel.com/docs)

For questions about the overall project setup, deployment, or shared configurations, refer to the [root README](../../README.md).
