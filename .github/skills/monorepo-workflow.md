# SKILL: MONOREPO WORKFLOW & ARCHITECT

## 1. TURBOREPO COMMANDS
- **Package Manager**: STRICTLY use `pnpm`.
- **Running Dev**:
  - Full stack: `pnpm dev`
  - Frontend only: `pnpm dev --filter=web`
  - Backend only: `pnpm dev --filter=api`
- **Install**: `pnpm install` (root level).

## 2. SHARED PACKAGES
- **UI**: Components in `packages/ui` are shared. If you create a generic component, suggest moving it there.
- **Config**: Respect `eslint-config` and `typescript-config` in `packages/`.
