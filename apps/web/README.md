# Web App - Dev Wiki Frontend

> Modern Next.js 15 frontend application with React 19, providing a rich user interface for the Dev Wiki platform.

## 🏗️ Overview

The **Web App** is the primary frontend application for Dev Wiki, built with Next.js 15 and React 19. It provides an intuitive interface for users to browse tutorials, manage videos, interact with the community, and access administrative features.

### ✨ Key Features

- **🔐 Authentication**: JWT + Google OAuth with role-based access control
- **📚 Content Management**: Tutorial creation, video management, and categorization
- **💬 Community Features**: Comments, voting, and user interactions
- **📱 Responsive Design**: Mobile-first approach with Tailwind CSS
- **⚡ Performance**: Server-side rendering, caching, and optimized loading
- **🎨 Modern UI**: Shadcn/ui components with consistent design system

### 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **React**: React 19 with React Query for state management
- **Styling**: Tailwind CSS + Shadcn/ui components
- **Forms**: React Hook Form + Zod validation
- **Authentication**: JWT tokens + role cookies
- **Notifications**: Sonner toast system
- **TypeScript**: Strict mode for type safety

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- pnpm 9.0.0+
- Backend API running (see [API README](../api/README.md))

### Development Setup

1. **From monorepo root, install dependencies:**
   ```bash
   pnpm install
   ```

2. **Configure environment:**
   ```bash
   cd apps/web
   cp .env.example .env.local
   ```

3. **Start development server:**
   ```bash
   # From monorepo root
   pnpm dev --filter=web

   # Or from apps/web directory
   pnpm dev
   ```

4. **Access the application:**
   ```
   http://localhost:3000
   ```

### Environment Variables

Create `.env.local` in `apps/web/`:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000

# Google OAuth (for social login)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id

# App Configuration
NEXT_PUBLIC_APP_NAME=Dev Wiki
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 📁 Project Structure

```
apps/web/
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── (auth)/         # Authentication routes
│   │   ├── mod/            # Moderator dashboard
│   │   ├── admin/          # Admin dashboard
│   │   └── layout.tsx      # Root layout
│   ├── components/         # React components
│   │   ├── ui/            # Base UI components (Shadcn)
│   │   ├── forms/         # Form components
│   │   └── common/        # Shared components
│   ├── hooks/             # Custom React hooks
│   │   ├── useCurrentUser.ts
│   │   └── useAuth.ts
│   ├── utils/             # Utility functions
│   │   ├── api/           # API client functions
│   │   ├── jwt.ts         # JWT utilities
│   │   └── validation.ts  # Form validation helpers
│   ├── types/             # TypeScript type definitions
│   ├── validations/       # Zod schemas
│   ├── lib/               # Configuration and setup
│   └── middleware.ts      # Next.js middleware (RBAC)
├── public/                # Static assets
├── components.json        # Shadcn/ui configuration
└── package.json
```

## 🔐 Authentication & Authorization

### Authentication Flow

1. **Login Process:**
   ```
   User Login → API Authentication → JWT Token → localStorage
                                  → Role Cookie → Frontend Middleware
   ```

2. **Role-Based Access Control (RBAC):**
   - **User**: Basic access to content and community features
   - **Moderator**: Content moderation and user management
   - **Admin**: Full system administration

3. **Implementation:**
   ```typescript
   // middleware.ts - Route protection
   export function middleware(request: NextRequest) {
     const role = request.cookies.get('role')?.value
     
     if (request.nextUrl.pathname.startsWith('/admin') && role !== 'admin') {
       return NextResponse.redirect(new URL('/login', request.url))
     }
   }
   
   // useCurrentUser.ts - User state management
   export function useCurrentUser() {
     return useQuery<Account>({
       queryKey: ["me"],
       queryFn: meApi,
       retry: false,
     });
   }
   ```

### JWT Token Management

- **Storage**: localStorage for API calls
- **Expiry**: Automatic detection and redirect to login
- **Refresh**: Handled automatically by API client
- **Security**: HttpOnly cookies for role information

## 🎨 UI Components & Styling

### Design System

The app uses a modern design system based on Shadcn/ui:

```typescript
// components/ui/ - Base components
- Button, Input, Select, Dialog
- Form, Table, Card, Badge
- Toast, Alert, Loading states

// components/common/ - Custom components
- Navbar, Footer, Sidebar
- VideoPlayer, CommentList
- UserProfile, SearchBar
```

### Tailwind CSS Configuration

```javascript
// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Custom color palette
      },
      fontFamily: {
        sans: ['Geist', 'system-ui'],
      },
    },
  },
}
```

### Responsive Design

- **Mobile-first approach**
- **Breakpoints**: sm, md, lg, xl, 2xl
- **Components**: Responsive by default
- **Navigation**: Collapsible mobile menu

## 📊 State Management

### React Query Setup

```typescript
// app/layout.tsx - Query client configuration
const [queryClient] = useState(() => new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    },
  },
}));
```

### API Integration

```typescript
// utils/api/video.ts - Type-safe API calls
export async function createVideo(data: CreateVideoRequest): Promise<Video> {
  return fetcher<Video>("/videos", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// hooks/useVideos.ts - React Query hooks
export function useVideos() {
  return useQuery({
    queryKey: ['videos'],
    queryFn: getAllVideos,
  });
}
```

### Form Management

```typescript
// React Hook Form + Zod validation
const form = useForm<VideoFormValues>({
  resolver: zodResolver(videoSchema),
  defaultValues: {
    youtubeUrl: "",
  },
});
```

## 🛣️ Routing & Navigation

### App Router Structure

```
app/
├── page.tsx                 # Home page
├── login/                   # Authentication
├── categories/              # Content categories
│   └── [slug]/
├── mod/                     # Moderator dashboard
│   └── youtube/
│       └── post-video/
└── admin/                   # Admin dashboard
```

### Route Protection

```typescript
// middleware.ts - RBAC enforcement
const protectedRoutes = {
  '/mod': ['mod', 'admin'],
  '/admin': ['admin'],
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const userRole = request.cookies.get('role')?.value
  
  // Check access permissions
  for (const [route, allowedRoles] of Object.entries(protectedRoutes)) {
    if (pathname.startsWith(route) && !allowedRoles.includes(userRole)) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }
}
```

## 📝 Forms & Validation

### Zod Schemas

```typescript
// validations/post-video-schema.ts
export const postVideoSchema = z.object({
  youtubeUrl: z
    .string()
    .regex(YOUTUBE_URL_REGEX, {
      message: "Invalid YouTube URL format"
    }),
});
```

### Form Components

```typescript
// Example form component
export function PostVideoForm() {
  const form = useForm<PostVideoFormValues>({
    resolver: zodResolver(postVideoSchema),
  });

  const onSubmit = async (data: PostVideoFormValues) => {
    try {
      await createVideo(data);
      toast.success("Video added successfully!");
    } catch (error) {
      toast.error("Failed to add video");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {/* Form fields */}
      </form>
    </Form>
  );
}
```

## 🔧 Development Commands

```bash
# Development
pnpm dev              # Start development server
pnpm build            # Production build
pnpm start            # Start production server
pnpm lint             # Lint code
pnpm format           # Format code

# Testing
pnpm test             # Run tests
pnpm test:watch       # Watch mode
pnpm test:coverage    # Coverage report

# Type checking
pnpm type-check       # TypeScript validation
```

## 🚀 Performance Optimization

### Next.js Features

- **Server Components**: Default server-side rendering
- **Image Optimization**: Next.js Image component
- **Font Optimization**: Automatic font loading
- **Bundle Analysis**: Built-in bundle analyzer

### Caching Strategy

```typescript
// React Query caching
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,    // 5 minutes
      cacheTime: 10 * 60 * 1000,   // 10 minutes
    },
  },
});
```

### Code Splitting

- **Route-based splitting**: Automatic with App Router
- **Component splitting**: Dynamic imports for heavy components
- **Lazy loading**: React.lazy for non-critical components

## 🧪 Testing

### Testing Setup

```bash
# Run all tests
pnpm test

# Watch mode during development
pnpm test:watch

# Coverage report
pnpm test:coverage
```

### Testing Patterns

```typescript
// Component testing with React Testing Library
import { render, screen } from '@testing-library/react';
import { VideoForm } from './VideoForm';

test('renders video form', () => {
  render(<VideoForm />);
  expect(screen.getByLabelText(/youtube url/i)).toBeInTheDocument();
});
```

## 🚨 Troubleshooting

### Common Issues

**Authentication not working:**
```bash
# Check API connection
curl http://localhost:8000/health

# Verify environment variables
cat .env.local
```

**Styles not loading:**
```bash
# Rebuild Tailwind CSS
pnpm build:css

# Check Tailwind configuration
npx tailwindcss --init
```

**TypeScript errors:**
```bash
# Check type definitions
pnpm type-check

# Rebuild shared packages
pnpm build --filter=@repo/ui
```

**Build failures:**
```bash
# Clean Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules
pnpm install
```

### Development Tips

1. **Hot Reload**: Changes auto-refresh in development
2. **Error Boundaries**: Check browser console for React errors
3. **Network Tab**: Monitor API calls and responses
4. **React DevTools**: Install browser extension for debugging

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Query Guide](https://tanstack.com/query/latest)
- [Tailwind CSS Reference](https://tailwindcss.com/docs)
- [Shadcn/ui Components](https://ui.shadcn.com/docs)
- [React Hook Form](https://react-hook-form.com/docs)

## 🤝 Contributing

### Code Style

- Use TypeScript strict mode
- Follow ESLint rules
- Format with Prettier
- Write meaningful commit messages

### Component Guidelines

1. **Reusable components** → `@repo/ui` package
2. **Page-specific components** → local `components/` folder
3. **Hooks** → `hooks/` folder with clear naming
4. **Types** → `types/` folder, shared when possible

### Testing Requirements

- Write tests for new components
- Test user interactions
- Mock API calls appropriately
- Maintain test coverage above 80%

---

For more information, see the [main project README](../../README.md) and [API documentation](../api/README.md).
