# Base image
FROM node:20-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# Builder stage
FROM base AS builder
WORKDIR /app
# Install turbo globally
RUN pnpm install turbo --global
COPY . .
# Prune the workspace for the api app
RUN turbo prune @trooper/api --docker

# Installer stage
FROM base AS installer
WORKDIR /app
# First install dependencies (as they change less often)
COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm install --frozen-lockfile

# Build the project and its dependencies
COPY --from=builder /app/out/full/ .
COPY turbo.json turbo.json
# Generate Prisma Client and build the API
RUN pnpm turbo run build --filter=@trooper/api...

# Runner stage
FROM base AS runner
WORKDIR /app
# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs
USER nestjs

COPY --from=installer /app .

WORKDIR /app/apps/api
EXPOSE 3001
ENV PORT=3001
ENV NODE_ENV=production

CMD ["node", "dist/main.js"]
