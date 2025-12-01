# ================================
# Stage 1: Build (Chỉ Build code)
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

# Install ALL dependencies (Dùng --ignore-scripts để bỏ qua husky/prepare)
RUN pnpm install --frozen-lockfile --ignore-scripts

# Build API
RUN pnpm --filter api build

# ================================
# Stage 2: Production (Fix lỗi MODULE_NOT_FOUND triệt để)
# ================================
FROM node:20-alpine AS runner

WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy workspace config files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Copy packages (needed for workspace resolution)
COPY packages ./packages

# Copy API package.json
COPY apps/api/package.json ./apps/api/

# === SỬA LỖI CỐT LÕI ===
# Cài đặt ALL dependencies (BỎ cờ --prod để tránh lỗi thiếu express)
# Vẫn dùng --ignore-scripts để tránh lỗi husky/prepare script
RUN pnpm install --frozen-lockfile --ignore-scripts

# Copy built output từ builder
COPY --from=builder /app/apps/api/dist ./apps/api/dist

# Set working directory to API
WORKDIR /app/apps/api

# Expose port
EXPOSE 3000

# Start the application
CMD ["node", "dist/main.js"]
