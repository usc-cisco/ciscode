# syntax=docker/dockerfile:1

FROM node:20-alpine AS deps
WORKDIR /app
RUN apk add --no-cache libc6-compat python3 make g++
# Install bun globally
RUN npm install -g bun
COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./
RUN if [ -f pnpm-lock.yaml ]; then corepack enable && corepack prepare pnpm@9.12.3 --activate && pnpm install --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f yarn.lock ]; then corepack enable && corepack prepare yarn@1.22.22 --activate && yarn install --frozen-lockfile; \
  else npm install; fi

FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create non-root user
RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001

# Copy package.json and public files
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public
COPY --from=builder /app/tsconfig.json ./tsconfig.json
COPY --from=builder /app/bunfig.toml ./bunfig.toml

# Copy Next.js build output - ensure static files are in the right place
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Copy source files needed for database operations
COPY --from=builder /app/src ./src

# Copy bun from deps stage so it's available for database operations
COPY --from=deps /usr/local/bin/bun /usr/local/bin/bun
COPY --from=deps /usr/local/lib/node_modules/bun /usr/local/lib/node_modules/bun

# Also include node_modules so db scripts can resolve runtime deps (e.g., sequelize)
COPY --from=deps /app/node_modules ./node_modules

ENV PORT=3000
EXPOSE 3000
USER nextjs

# Start the standalone server
CMD ["node", "server.js"]
