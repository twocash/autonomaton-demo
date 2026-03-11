# Stage 1: Builder
FROM node:20-alpine as builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Build the Vite app (outputs to dist/)
RUN npm run build

# Stage 2: Runner
FROM node:20-alpine

ENV NODE_ENV=production

WORKDIR /app

# Copy built assets from builder
COPY --from=builder /app/dist ./dist
COPY package.json ./

# Install only production dependencies (express)
RUN npm install --omit=dev

COPY server.js ./

# Cloud Run expects port 8080
EXPOSE 8080

CMD ["node", "server.js"]
