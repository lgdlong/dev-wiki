# Copilot AI Coding Agent Instructions for Dev Wiki Monorepo

## Project Architecture & Structure

- **Monorepo** managed by Turborepo, using pnpm workspaces.
- Major apps:
  - `apps/web`: Next.js 15 (React 19) frontend, port 3000
  - `apps/api`: NestJS backend, port 8000 (configurable)
  - `apps/db`: Database scripts, Docker Compose for Postgres
- Shared packages:
  - `packages/eslint-config`, `packages/typescript-config`, `@repo/ui`
- All code is TypeScript-first, with strict linting and formatting via shared configs.

## Key Workflows

- **Install all dependencies:**
  ```bash
  pnpm install
  ```
- **Start all apps in dev mode:**
  ```bash
  pnpm dev
  ```
- **Build all apps:**
  ```bash
  pnpm build
  ```
- **Run only API or Web:**
  ```bash
  pnpm dev --filter=api
  pnpm dev --filter=web
  ```
- **Database:**
  - Use `docker compose up --build` in the repo root to start Postgres and supporting services.
  - DB config is in `.env` files in `apps/api`.

## Backend (NestJS API)

- Follows standard NestJS module/service/controller/entity structure.
- Auth uses JWT (with Passport.js) and sets a `role` cookie for web middleware.
- DTOs use `class-validator` for validation.
- All database access via TypeORM entities.
- Test with `pnpm test` (unit), `pnpm test:e2e` (e2e), `pnpm test:cov` (coverage).
- API endpoints are documented in `apps/api/README.md`.

## Frontend (Next.js Web)

- Uses `/src` for all app code.
- Auth tokens are stored in `localStorage` and `role` cookie is set by backend for RBAC in middleware.
- Uses React Query for data fetching (`useCurrentUser` etc).
- UI components are imported from `@repo/ui`.
- Linting and formatting via shared configs.

## Project Conventions & Patterns

- **RBAC:** Role-based access enforced in both backend (NestJS guards) and frontend (Next.js middleware reads `role` cookie).
- **Environment:** All apps expect `.env` files for secrets/config.
- **Testing:** Use `pnpm test`, `pnpm test:e2e`, `pnpm test:cov` in each app.
- **Formatting:** Use `pnpm format` and `pnpm lint --fix` before PRs.
- **Build:** Use `pnpm build` at root or per-app.
- **Docker:** Use `docker compose up --build` for local DB/dev infra.

## Integration & Communication

- **API <-> Web:** Web app calls API endpoints (see `utils/api/` in web) and expects cookies for auth/role.
- **Shared Types:** Use shared TypeScript config and lint rules from `packages/`.
- **Database:** All persistent data via Postgres (TypeORM).

## Examples

- See `apps/api/src/auth/auth.controller.ts` for login, Google OAuth, and role cookie logic.
- See `apps/web/src/middleware.ts` for RBAC enforcement in Next.js middleware.
- See `apps/web/src/utils/api/auth.ts` for API integration patterns.

## Troubleshooting

- See `apps/api/README.md` and root `README.md` for common issues, commands, and environment setup.

---

For any new agent, always:

- Use pnpm and Turborepo commands for builds/dev.
- Follow the RBAC pattern: backend sets `role` cookie, frontend middleware enforces.
- Use TypeScript, shared configs, and validate with lint/type/test before PRs.
