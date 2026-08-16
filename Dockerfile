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

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public


USER node

EXPOSE 3000

CMD ["node", "server.js"]