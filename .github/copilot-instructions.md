# Dev Wiki Monorepo - AI Coding Agent Instructions

## 🏗️ Project Overview

**Dev Wiki** is a TypeScript-first monorepo for a developer knowledge-sharing platform. It features user authentication, content management, video tutorials, product reviews, and community discussions.

### Architecture

- **Monorepo Management**: Turborepo + pnpm workspaces
- **Frontend**: Next.js 15 (React 19) - Port 3000
- **Backend**: NestJS API - Port 8000
- **Database**: PostgreSQL with TypeORM
- **Authentication**: JWT + Google OAuth with role-based access control (RBAC)

## 📁 Project Structure

```
dev-wiki/
├── apps/
│   ├── web/                 # Next.js frontend application
│   │   ├── src/
│   │   │   ├── app/         # App Router pages
│   │   │   ├── components/  # React components
│   │   │   ├── utils/api/   # API client functions
│   │   │   ├── hooks/       # Custom React hooks
│   │   │   ├── types/       # TypeScript type definitions
│   │   │   └── middleware.ts # Auth middleware for RBAC
│   │   └── package.json
│   ├── api/                 # NestJS backend application
│   │   ├── src/
│   │   │   ├── auth/        # Authentication module
│   │   │   ├── videos/      # Video management
│   │   │   ├── tutorial/    # Tutorial content
│   │   │   ├── comments/    # Comment system
│   │   │   └── common/      # Shared utilities/guards
│   │   └── package.json
│   └── db/                  # Database scripts & Docker setup
├── packages/
│   ├── eslint-config/       # Shared ESLint configuration
│   ├── typescript-config/   # Shared TypeScript configuration
│   └── ui/                  # Shared UI components (@repo/ui)
└── docker-compose.yml       # Local development infrastructure
```

## ⚡ Essential Commands

### Development Workflow

```bash
# Install all dependencies
pnpm install

# Start all services (frontend + backend + database)
pnpm dev

# Start individual services
pnpm dev --filter=web    # Frontend only
pnpm dev --filter=api    # Backend only

# Database setup
docker compose up -d     # Start PostgreSQL container
```

### Build & Test

```bash
# Build all applications
pnpm build

# Run tests
pnpm test                # All tests
pnpm test --filter=api   # Backend tests only
pnpm test:e2e            # End-to-end tests
pnpm test:cov            # Coverage report

# Code quality
pnpm lint                # Lint all code
pnpm lint --fix          # Auto-fix linting issues
pnpm format              # Format code with Prettier
```

## 🔐 Authentication & Authorization

### Authentication Flow

1. **JWT Tokens**: Stored in `localStorage` for API calls
2. **Role Cookies**: Set by backend, read by frontend middleware
3. **Google OAuth**: Integrated with Passport.js strategy

### Role-Based Access Control (RBAC)

- **Roles**: `user`, `mod`, `admin`
- **Backend**: Guards protect routes based on JWT payload
- **Frontend**: Middleware checks role cookie and redirects unauthorized users

### Key Files

- `apps/api/src/auth/auth.controller.ts` - Login, OAuth, role management
- `apps/web/src/middleware.ts` - Frontend route protection
- `apps/web/src/utils/api/auth.ts` - API client for auth operations
- `apps/web/src/hooks/useCurrentUser.ts` - React Query hook for user data

## 🛠️ Backend (NestJS API)

### Architecture Patterns

- **Modules**: Feature-based organization (auth, videos, tutorials, etc.)
- **Services**: Business logic and database operations
- **Controllers**: HTTP request/response handling
- **DTOs**: Data Transfer Objects with `class-validator`
- **Entities**: TypeORM database models
- **Guards**: Authentication and authorization
- **Mappers**: Data transformation utilities

### Database Design

- **TypeORM**: ORM for PostgreSQL
- **Entities**: Located in `*/entities/*.entity.ts`
- **Migrations**: Auto-generated when schema changes
- **Relationships**: Use `@ApiHideProperty()` to prevent Swagger circular dependencies

### Key Modules

- `auth/` - JWT authentication, Google OAuth, user sessions
- `videos/` - YouTube video integration, metadata fetching
- `tutorial/` - Tutorial content management
- `comments/` - Nested comment system with replies
- `votes/` - Upvote/downvote system for content
- `categories/` - Content categorization
- `products/` - Product reviews and management

## 🎨 Frontend (Next.js Web)

### Architecture

- **App Router**: Next.js 13+ routing system
- **React Query**: Server state management and caching
- **Tailwind CSS**: Utility-first styling
- **Shadcn/ui**: Component library base
- **Zod**: Schema validation for forms

### State Management

- **Server State**: React Query (`@tanstack/react-query`)
- **Client State**: React hooks and context
- **Forms**: React Hook Form + Zod validation
- **Notifications**: Sonner toast library

### Key Components

- `components/Navbar.tsx` - Main navigation with auth state
- `hooks/useCurrentUser.ts` - User authentication hook
- `utils/api/` - Type-safe API client functions
- `validations/` - Zod schemas for form validation

## 🔧 Development Guidelines

### Code Standards

- **TypeScript**: Strict mode enabled, no `any` types
- **ESLint**: Shared configuration across all packages
- **Prettier**: Automatic code formatting
- **Naming**: Use descriptive names, follow existing patterns

### API Development

```typescript
// DTO with validation
export class CreateVideoDto {
  @IsString()
  @IsNotEmpty()
  youtubeId: string;

  @IsNumber()
  @IsOptional()
  uploaderId?: number;
}

// Service with error handling
async create(dto: CreateVideoDto): Promise<Video> {
  const existing = await this.videoRepository.findOne({
    where: { youtubeId: dto.youtubeId }
  });

  if (existing) {
    throw new ConflictException('Video already exists');
  }

  return this.videoRepository.save(dto);
}
```

### Frontend Development

```typescript
// API client function
export async function createVideo(data: CreateVideoRequest): Promise<Video> {
  return fetcher<Video>("/videos", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// React component with hooks
export function VideoForm() {
  const { data: user } = useCurrentUser();
  const form = useForm<VideoFormValues>({
    resolver: zodResolver(videoSchema),
  });

  // Component implementation...
}
```

### Error Handling

- **Backend**: Use NestJS exception filters, return structured errors
- **Frontend**: Use React Query error boundaries, display user-friendly messages
- **Validation**: Use DTOs (backend) and Zod schemas (frontend) for consistent validation

## 🐛 Common Issues & Solutions

### Build Issues

- **TypeScript errors**: Check shared configs in `packages/typescript-config/`
- **Swagger circular dependencies**: Add `@ApiHideProperty()` to entity relationships
- **Import issues**: Verify path aliases in `tsconfig.json`

### Runtime Issues

- **Database connection**: Ensure Docker PostgreSQL is running
- **Authentication**: Check JWT token expiry and role cookie setup
- **CORS**: Verify API CORS configuration for frontend domain

### Performance

- **React Query**: Use proper cache keys and stale times
- **Database**: Add indexes for frequently queried fields
- **API**: Implement pagination for list endpoints

## 📚 Key Resources

### Documentation

- `apps/api/README.md` - Backend setup and API documentation
- `apps/web/README.md` - Frontend setup and development guide
- Root `README.md` - Project overview and quick start

### External Dependencies

- [NestJS Documentation](https://docs.nestjs.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [TypeORM Documentation](https://typeorm.io/)
- [React Query Documentation](https://tanstack.com/query)

## 🤖 AI Agent Guidelines

### When working on this project:

1. **Always use pnpm** for package management and scripts
2. **Follow TypeScript-first approach** - prefer explicit types over `any`
3. **Respect the monorepo structure** - use Turborepo filters for targeted operations
4. **Maintain RBAC patterns** - backend sets cookies, frontend middleware enforces
5. **Use existing patterns** - follow established code conventions and file organization
6. **Test thoroughly** - run builds and tests before suggesting changes
7. **Handle errors gracefully** - provide clear error messages and proper HTTP status codes
8. **Document breaking changes** - update relevant README files when making structural changes

### Before making changes:

- Understand the existing codebase structure
- Check for similar implementations in the codebase
- Consider impact on both frontend and backend
- Ensure TypeScript compilation passes
- Run linting and formatting tools
- Test the changes in development environment

### Common tasks:

- Adding new API endpoints: Create controller, service, DTO, and entity
- Adding frontend pages: Use App Router structure, implement proper error handling
- Database changes: Update entities, run migrations, update related types
- Authentication features: Follow existing JWT + role cookie patterns
- UI components: Use Tailwind CSS and follow existing design patterns
