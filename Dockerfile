# syntax=docker/dockerfile:1

FROM node:20-alpine AS deps
WORKDIR /app

# Install system dependencies needed for native modules (especially node-pty)
RUN apk add --no-cache \
    libc6-compat \
    python3 \
    make \
    g++ \
    git \
    bash \
    curl \
    ca-certificates \
    openssl \
    pkgconfig \
    # Additional dependencies for native modules
    linux-headers \
    # Dependencies for node-pty and other native packages
    libstdc++ \
    # For better compatibility
    musl-dev

# Install bun globally with proper setup
RUN npm install -g bun
# Ensure bun is properly linked and available
RUN ln -sf /usr/local/bin/bun /usr/bin/bun

# Copy package files
COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./

# Install dependencies with proper fallback
RUN if [ -f pnpm-lock.yaml ]; then \
        corepack enable && corepack prepare pnpm@9.12.3 --activate && pnpm install --frozen-lockfile; \
    elif [ -f package-lock.json ]; then \
        npm ci --build-from-source; \
    elif [ -f yarn.lock ]; then \
        corepack enable && corepack prepare yarn@1.22.22 --activate && yarn install --frozen-lockfile; \
    else \
        npm install --build-from-source; \
    fi

FROM node:20-alpine AS builder
WORKDIR /app

# Install build dependencies for native modules
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    git \
    linux-headers \
    musl-dev \
    pkgconfig

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Set environment variables for build
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Build the application
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Install runtime dependencies needed for native modules
RUN apk add --no-cache \
    libc6-compat \
    # Runtime dependencies for node-pty
    libstdc++ \
    # For database connections
    ca-certificates \
    # For better compatibility
    musl

# Create non-root user
RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001

# Copy package.json and configuration files
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public
COPY --from=builder /app/tsconfig.json ./tsconfig.json
COPY --from=builder /app/bunfig.toml ./bunfig.toml

# Copy environment file for database connections
COPY .env .env

# Copy Next.js build output
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Copy source files needed for database operations
COPY --from=builder /app/src ./src

# Copy bun from deps stage with proper setup
COPY --from=deps /usr/local/bin/bun /usr/local/bin/bun
COPY --from=deps /usr/local/lib/node_modules/bun /usr/local/lib/node_modules/bun
# Ensure bun is accessible
RUN ln -sf /usr/local/bin/bun /usr/bin/bun

# Copy node_modules for runtime dependencies
COPY --from=deps /app/node_modules ./node_modules

# Set proper permissions
RUN chown -R nextjs:nodejs /app

ENV PORT=${PORT:-3000}
EXPOSE ${PORT:-3000}

USER nextjs

# Start the standalone server
CMD ["node", "server.js"]
