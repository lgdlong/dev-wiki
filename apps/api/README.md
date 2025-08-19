# API - Dev Wiki Backend

> Robust NestJS backend API providing authentication, content management, and community features for the Dev Wiki platform.

## Overview

The **API** is the core backend service for Dev Wiki, built with NestJS and TypeScript. It provides a comprehensive REST API with JWT authentication, role-based access control, and full CRUD operations for all platform features.

### Key Features

- ** Authentication**: JWT + Google OAuth with Passport.js
- ** Role-Based Access Control**: User, Moderator, and Admin roles
- ** Content Management**: Videos, tutorials, categories, and tags
- ** Community Features**: Comments, voting, and user interactions
- ** Product Reviews**: Product management and categorization
- ** Security**: Guards, validation, and error handling
- ** API Documentation**: Automatic Swagger/OpenAPI generation

### Tech Stack

- **Framework**: NestJS (Node.js/Express)
- **Database**: PostgreSQL with TypeORM
- **Authentication**: JWT + Passport.js strategies
- **Validation**: class-validator + class-transformer
- **Documentation**: Swagger/OpenAPI
- **Testing**: Jest + Supertest
- **TypeScript**: Strict mode for type safety

## Quick Start

### Prerequisites

- Node.js 18+
- pnpm 9.0.0+
- PostgreSQL database (Docker recommended)

### Development Setup

1. **From monorepo root, install dependencies:**

   ```bash
   pnpm install
   ```

2. **Start PostgreSQL database:**

   ```bash
   # From monorepo root
   docker compose up -d
   ```

3. **Configure environment:**

   ```bash
   cd apps/api
   cp .env.example .env
   ```

4. **Run database migrations:**

   ```bash
   # From apps/api directory
   pnpm migration:run
   ```

5. **Start development server:**

   ```bash
   # From monorepo root
   pnpm dev --filter=api

   # Or from apps/api directory
   pnpm dev
   ```

6. **Access the API:**
   ```
   API: http://localhost:8000
   Swagger Docs: http://localhost:8000/api
   ```

### Environment Variables

Create `.env` in `apps/api/`:

```env
# Database Configuration
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=dev_wiki_user
DATABASE_PASSWORD=dev_wiki_password
DATABASE_NAME=dev_wiki

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=24h

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Application
PORT=8000
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
```

## Project Structure

```
apps/api/
├── src/
│   ├── main.ts              # Application entry point
│   ├── app.module.ts        # Root module
│   ├── app.controller.ts    # Health check endpoint
│   │
│   ├── auth/                # Authentication module
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.module.ts
│   │   ├── *.strategy.ts    # Passport strategies
│   │   ├── dto/             # Data Transfer Objects
│   │   └── entities/        # Database entities
│   │
│   ├── account/             # User account management
│   ├── videos/              # Video content management
│   ├── tutorial/            # Tutorial system
│   ├── comments/            # Comment system
│   ├── votes/               # Voting system
│   ├── categories/          # Content categories
│   ├── products/            # Product reviews
│   ├── tags/                # Tagging system
│   │
│   ├── common/              # Shared utilities
│   │   ├── constants.ts
│   │   ├── decorators/      # Custom decorators
│   │   ├── enums/           # Enum definitions
│   │   └── guards/          # Auth & role guards
│   │
│   ├── mappers/             # Data transformation
│   └── types/               # Type definitions
│
├── test/                    # E2E tests
├── jest.config.ts           # Jest configuration
└── package.json
```

## Authentication & Authorization

### Authentication Architecture

```
Login Request → Passport Strategy → JWT Token Generation
                                 → Role Cookie Setting
                                 → Response to Client
```

### Passport Strategies

```typescript
// jwt.strategy.ts - JWT token validation
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, email: payload.email, role: payload.role };
  }
}

// google.strategy.ts - Google OAuth
@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/auth/google/redirect',
      scope: ['email', 'profile'],
    });
  }
}
```

### Role-Based Access Control

```typescript
// guards/roles.guard.ts
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<Role[]>('roles', context.getHandler());
    if (!roles) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    return roles.some(role => user.role === role);
  }
}

// Usage in controllers
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.MOD)
@Post()
async create(@Body() dto: CreateDto) {
  // Only admins and mods can access
}
```

### Authentication Endpoints

```typescript
// auth.controller.ts - Key endpoints
@Controller('auth')
export class AuthController {
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    // Local authentication
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    // Initiates Google OAuth flow
  }

  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  async googleRedirect(@Req() req) {
    // Handles Google OAuth callback
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@Request() req) {
    // Get current user profile
  }
}
```

## Database Design

### TypeORM Configuration

```typescript
// app.module.ts - Database setup
TypeOrmModule.forRoot({
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  synchronize: process.env.NODE_ENV === 'development',
  migrations: ['dist/migrations/*{.ts,.js}'],
}),
```

### Entity Relationships

```typescript
// entities/videos.entity.ts
@Entity()
export class Video {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  youtubeId: string;

  @ManyToOne(() => Account, (account) => account.videos)
  uploader: Account;

  @OneToMany(() => Comment, (comment) => comment.video)
  @ApiHideProperty() // Prevents Swagger circular dependency
  comments: Comment[];

  @OneToMany(() => Vote, (vote) => vote.video)
  @ApiHideProperty()
  votes: Vote[];
}
```

### Database Migrations

```bash
# Generate migration after entity changes
pnpm migration:generate -- --name=MigrationName

# Run pending migrations
pnpm migration:run

# Revert last migration
pnpm migration:revert
```

## API Modules

### Video Management

```typescript
// videos/videos.controller.ts
@Controller('videos')
@ApiTags('videos')
export class VideosController {
  @Get()
  @ApiOperation({ summary: 'Get all videos' })
  @ApiResponse({ status: 200, type: [Video] })
  async findAll(): Promise<Video[]> {
    return this.videosService.findAll();
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.MOD, Role.ADMIN)
  @ApiOperation({ summary: 'Create a new videos' })
  async create(@Body() createVideoDto: CreateVideoDto): Promise<Video> {
    return this.videosService.create(createVideoDto);
  }
}
```

### Data Transfer Objects (DTOs)

```typescript
// dto/create-videos.dto.ts
export class CreateVideoDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'YouTube videos ID' })
  youtubeId: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: 'Video title', required: false })
  title?: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ description: 'Uploader ID', required: false })
  uploaderId?: number;
}
```

### Service Layer

```typescript
// videos/videos.service.ts
@Injectable()
export class VideosService {
  constructor(
    @InjectRepository(Video)
    private videoRepository: Repository<Video>,
  ) {}

  async findAll(): Promise<Video[]> {
    return this.videoRepository.find({
      relations: ['uploader', 'categories'],
    });
  }

  async create(createVideoDto: CreateVideoDto): Promise<Video> {
    const existingVideo = await this.videoRepository.findOne({
      where: { youtubeId: createVideoDto.youtubeId },
    });

    if (existingVideo) {
      throw new ConflictException('Video already exists');
    }

    const video = this.videoRepository.create(createVideoDto);
    return this.videoRepository.save(video);
  }
}
```

## Security & Validation

### Input Validation

```typescript
// Global validation pipe in main.ts
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }),
);
```

### Error Handling

```typescript
// Custom exception filter
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: exception.message || 'Internal server error',
    });
  }
}
```

### CORS Configuration

```typescript
// main.ts - CORS setup
app.enableCors({
  origin: [process.env.FRONTEND_URL],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
});
```

## API Documentation

### Swagger Configuration

```typescript
// main.ts - Swagger setup
const config = new DocumentBuilder()
  .setTitle('Dev Wiki API')
  .setDescription('Backend API for Dev Wiki platform')
  .setVersion('1.0')
  .addBearerAuth()
  .build();

const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('api', app, document);
```

### API Documentation Features

- **Interactive API Explorer**: Test endpoints directly
- **Authentication**: Built-in Bearer token auth
- **Schema Documentation**: Automatic DTO documentation
- **Response Examples**: Real response samples

### Access Documentation

```
Local: http://localhost:8000/api
Production: https://your-domain.com/api
```

## Testing

### Unit Tests

```typescript
// videos.service.spec.ts
describe('VideosService', () => {
  let service: VideosService;
  let repository: Repository<Video>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VideosService,
        {
          provide: getRepositoryToken(Video),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<VideosService>(VideosService);
    repository = module.get<Repository<Video>>(getRepositoryToken(Video));
  });

  it('should create a videos', async () => {
    const createVideoDto = { youtubeId: 'test123' };
    jest.spyOn(repository, 'save').mockResolvedValue(createVideoDto as Video);

    const result = await service.create(createVideoDto);
    expect(result).toEqual(createVideoDto);
  });
});
```

### E2E Tests

```typescript
// test/app.e2e-spec.ts
describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/videos (GET)', () => {
    return request(app.getHttpServer()).get('/videos').expect(200);
  });
});
```

### Testing Commands

```bash
# Unit tests
pnpm test

# Watch mode
pnpm test:watch

# E2E tests
pnpm test:e2e

# Coverage report
pnpm test:cov
```

## Development Commands

```bash
# Development
pnpm dev              # Start development server
pnpm build            # Build for production
pnpm start:prod       # Start production server
pnpm lint             # Lint code
pnpm format           # Format code

# Database
pnpm migration:generate -- --name=MigrationName
pnpm migration:run    # Apply migrations
pnpm migration:revert # Revert last migration

# Testing
pnpm test             # Unit tests
pnpm test:e2e         # End-to-end tests
pnpm test:cov         # Coverage report
```

## Performance & Optimization

### Database Optimization

```typescript
// Add indexes for frequently queried fields
@Entity()
export class Video {
  @Index()
  @Column()
  youtubeId: string;

  @Index()
  @CreateDateColumn()
  createdAt: Date;
}
```

### Caching Strategy

```typescript
// Redis caching (if implemented)
@Injectable()
export class VideosService {
  @CacheKey('videos')
  @CacheTTL(300) // 5 minutes
  async findAll(): Promise<Video[]> {
    return this.videoRepository.find();
  }
}
```

### API Response Optimization

- **Pagination**: Implement for list endpoints
- **Selective Loading**: Use `relations` judiciously
- **Response Compression**: gzip enabled
- **Rate Limiting**: Implement for production

## Troubleshooting

### Common Issues

**Database connection failed:**

```bash
# Check PostgreSQL status
docker compose ps

# Restart database
docker compose restart postgres

# Check environment variables
cat .env
```

**JWT authentication not working:**

```bash
# Verify JWT secret is set
echo $JWT_SECRET

# Check token format in requests
curl -H "Authorization: Bearer <token>" http://localhost:8000/auth/me
```

**Swagger circular dependency:**

```typescript
// Add @ApiHideProperty() to entity relationships
@OneToMany(() => Comment, comment => comment.video)
@ApiHideProperty()
comments: Comment[];
```

**Migration errors:**

```bash
# Reset database (development only)
docker compose down -v
docker compose up -d

# Generate fresh migration
pnpm migration:generate -- --name=Initial
```

### Debug Mode

```bash
# Start with debug logging
DEBUG=nest:* pnpm dev

# TypeORM query logging
# Set in app.module.ts: logging: true
```

## Additional Resources

### NestJS Documentation

- [Official Docs](https://docs.nestjs.com/)
- [TypeORM Integration](https://docs.nestjs.com/techniques/database)
- [Authentication](https://docs.nestjs.com/security/authentication)
- [Swagger Module](https://docs.nestjs.com/openapi/introduction)

### Database & ORM

- [TypeORM Documentation](https://typeorm.io/)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [Database Migrations](https://typeorm.io/migrations)

### Testing Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [NestJS Testing](https://docs.nestjs.com/fundamentals/testing)
- [Supertest](https://github.com/visionmedia/supertest)

## 🤝 Contributing

### Code Standards

- Use TypeScript strict mode
- Follow NestJS conventions
- Write comprehensive tests
- Document all public APIs
- Use meaningful commit messages

### API Design Guidelines

1. **RESTful endpoints** with consistent naming
2. **Proper HTTP status codes** for all responses
3. **Comprehensive validation** on all inputs
4. **Detailed error messages** for debugging
5. **Swagger documentation** for all endpoints

### Database Guidelines

1. **Foreign key constraints** for data integrity
2. **Indexes** on frequently queried fields
3. **Migrations** for all schema changes
4. **Soft deletes** where appropriate
5. **Consistent naming** conventions

---

For more information, see the [main project README](../../README.md) and [Web App documentation](../web/README.md).
