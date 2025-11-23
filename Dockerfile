# -------------------------
# Build / Development stage
# -------------------------
    FROM node:18-alpine AS builder

    # Create app directory
    WORKDIR /app
    
    # Install build dependencies deterministically
    # copy package files first to leverage docker cache
    COPY package*.json ./
    RUN npm ci
    
    # Copy source and build
    COPY . .
    RUN npm run build
    
    # -------------------------
    # Production stage
    # -------------------------
    FROM node:18-alpine AS production
    
    WORKDIR /app
    
    # Copy only package files and install production deps
    COPY package*.json ./
    # npm 7+ supports --omit=dev for production-only install
    RUN npm ci --omit=dev
    
    # Copy compiled output from builder
    COPY --from=builder /app/dist ./dist
    
    # If you need other runtime assets (e.g. public/, views/, prisma/*.js), copy them:
    # COPY --from=builder /app/public ./public
    
    # Set production env
    ENV NODE_ENV=production
    ENV PORT=3000
    
    # Create non-root user and adjust ownership
    RUN addgroup -S appgroup && adduser -S appuser -G appgroup \
        && chown -R appuser:appgroup /app
    
    USER appuser
    
    EXPOSE 3000
    
    # Run the built app
    CMD ["node", "dist/main.js"]
    