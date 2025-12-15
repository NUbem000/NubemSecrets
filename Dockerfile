# Multi-stage build for NubemSecrets

# Stage 1: Build frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install
COPY client/ ./
RUN npm run build

# Stage 2: Production image
FROM node:20-alpine
WORKDIR /app

# Install production dependencies
COPY package*.json ./
RUN npm install --production

# Copy backend code
COPY server/ ./server/

# Copy built frontend from previous stage
COPY --from=frontend-builder /app/client/dist ./client/dist

# Set production environment
ENV NODE_ENV=production

# Expose port
EXPOSE 8080

# Start the application
CMD ["node", "server/index.js"]
