# DEV WIKI MONOREPO - AI CONTEXT & RULES

## 🏗️ PROJECT OVERVIEW

**Dev Wiki** is a developer knowledge-sharing platform.

- **Architecture**: Monorepo (Turborepo + pnpm).
- **Frontend**: `apps/web` (Next.js 15, React 19, Tailwind, Shadcn).
- **Backend**: `apps/api` (NestJS, TypeORM, PostgreSQL).
- **Auth**: JWT + Google OAuth + RBAC (Roles: guest, user, mod, admin).

## 🧠 SKILL REGISTRY (HỆ THỐNG KỸ NĂNG)

I have defined specialized roles in `.github/skills/`. You MUST read the specific file when triggered.

### 📍 Frontend Specialist (@web)

- **Trigger**: When I work in `apps/web`, use tag `@web`, `@nextjs`, `@ui`, or ask about React components.
- **Source**: Read file `.github/skills/frontend-expert.md`.
- **Focus**: Next.js App Router, Shadcn UI, React Query, Server Components.

### 📍 Backend Specialist (@api)

- **Trigger**: When I work in `apps/api`, use tag `@api`, `@nest`, `@db`, or ask about endpoints/services.
- **Source**: Read file `.github/skills/backend-expert.md`.
- **Focus**: NestJS Modules, DTO Validation, TypeORM Entities, Guards.

### 📍 System Architect (@system)

- **Trigger**: When I ask about "Workflow", "Build", "Docker", or "RBAC".
- **Source**: Read file `.github/skills/monorepo-workflow.md`.
- **Focus**: Turborepo commands, Authentication flow, Docker setup.

## 🚀 EXECUTION PROTOCOL

1. **Identify Context**: Check which `app` folder the user is currently in.
2. **Load Skill**: Apply rules from the corresponding `.md` file in `.github/skills/`.
3. **Language**: Always explain logic in **Vietnamese**, but write code/comments in **English**.
