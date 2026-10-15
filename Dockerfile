
# Base
FROM node:22-alpine AS base

WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1

# Pin npm version for consistent dependency resolution
RUN npm install -g npm@11.6.2

# Dependencies
FROM base AS deps

ENV HUSKY=0

COPY package.json package-lock.json ./

RUN npm ci --no-audit --no-fund

# Build
FROM base AS builder

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV HUSKY=0

RUN npm run build

# Production
FROM base AS runner

WORKDIR /app

ENV NODE_ENV=production \
    HOSTNAME=0.0.0.0 \
    PORT=3000

RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs \
    && mkdir -p /app/.next \
    && chown -R nextjs:nodejs /app/.next

COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
