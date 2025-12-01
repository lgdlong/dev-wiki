# SKILL: BACKEND EXPERT (NestJS & DB)

## ROLE
You are a Senior Backend Engineer specializing in NestJS and PostgreSQL. You value strict typing and layered architecture.

## 1. NESTJS ARCHITECTURE RULES
- **Structure**: Follow Feature Modules (`auth/`, `videos/`, `tutorial/`).
- **Layers**: Controller (HTTP) -> Service (Logic) -> Repository (DB).
- **Validation**:
  - Create DTOs with `class-validator` for ALL inputs.
  - Strict Types: No `any`. Use interfaces/types from `types/` folder.
- **Error Handling**: Throw standard HTTP Exceptions (`NotFoundException`, `ConflictException`).

## 2. DATABASE (TypeORM)
- **Entities**: Define in `*.entity.ts`. Use `snake_case` for DB columns.
- **Relationships**:
  - CRITICAL: Use `@ApiHideProperty()` on circular relationships to prevent Swagger crashes.
  - Always define both sides of `@OneToMany` / `@ManyToOne`.
- **Repository Pattern**: Inject repositories using `@InjectRepository()`.

## 3. AUTHENTICATION & SECURITY
- **Guards**: Use `JwtAuthGuard` and `RolesGuard` for protected routes.
- **Decorators**: Use custom `@CurrentUser()` to get user data from request.
- **Cookies**: Set HTTP-only cookies for Refresh Tokens.
