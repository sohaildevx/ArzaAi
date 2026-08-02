FROM node:22 AS builder

WORKDIR /app

# Copy package and prisma early so postinstall hooks (prisma generate) work
COPY package*.json ./
COPY prisma ./prisma
COPY prisma.config.ts ./prisma.config.ts

# Install dependencies (including dev) for build
RUN npm ci

# Copy source and build
COPY . .

RUN npx prisma generate
RUN npm run build

FROM node:22-slim AS runner

WORKDIR /app

# Use production environment
ENV NODE_ENV=production

# Install only production dependencies (skip postinstall scripts such as `prisma generate`)
# Postinstall ran during build stage; skip scripts here to avoid schema lookups at runtime
COPY package*.json ./
RUN npm ci --only=production --ignore-scripts

# Copy built artifacts and necessary runtime files from builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/lib ./lib
COPY --from=builder /app/next.config.ts ./next.config.ts

# Generate Prisma client for runtime
RUN npx prisma generate

EXPOSE 3000

CMD ["npm","start"]