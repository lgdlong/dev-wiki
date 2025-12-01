# ================================
# Stage 1: Build
# ================================
FROM node:20-alpine AS builder

WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy workspace config files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Copy shared packages
COPY packages ./packages

# Copy API source
COPY apps/api ./apps/api

# Install all dependencies (ignore scripts to skip husky)
RUN pnpm install --frozen-lockfile --ignore-scripts

# Build API
RUN pnpm --filter api build

# ================================
# Stage 2: Production
# ================================
FROM node:20-alpine AS runner

WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy workspace config
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Copy packages (needed for workspace resolution)
COPY packages ./packages

# Copy API package.json for production deps
COPY apps/api/package.json ./apps/api/

# Install production dependencies only (ignore scripts to skip husky)
RUN pnpm install --frozen-lockfile --ignore-scripts

# Copy built output from builder
COPY --from=builder /app/apps/api/dist ./apps/api/dist

# Set working directory to API
WORKDIR /app/apps/api

# Expose port
EXPOSE 3000

# Start the application
CMD ["node", "dist/main.js"]
