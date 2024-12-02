# Build stage
FROM node:20-alpine AS builder

ENV NODE_ENV=development

WORKDIR /app
COPY . .

RUN npm install
RUN npm run build

# Production stage
FROM node:20-alpine

ENV NODE_ENV=production
WORKDIR /app

# Copy built assets and package files from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

RUN npm install --omit=dev

EXPOSE 3000
CMD ["node", "/app/dist/main"]