# Build stage
FROM node:20-alpine AS builder

WORKDIR /app
COPY . .

RUN npm install
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

ENV REACT_BACKEND_SERVER_URL=http://backend:3000

# Create nginx configuration
RUN echo 'server { \
    listen 8080; \
    server_name localhost; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
    location /api { \
        proxy_pass REACT_BACKEND_SERVER_URL_PLACEHOLDER; \
        proxy_http_version 1.1; \
        proxy_set_header Upgrade $http_upgrade; \
        proxy_set_header Connection "upgrade"; \
        proxy_set_header Host $host; \
    } \
    location /socket.io { \
        proxy_pass REACT_BACKEND_SERVER_URL_PLACEHOLDER; \
        proxy_http_version 1.1; \
        proxy_set_header Upgrade $http_upgrade; \
        proxy_set_header Connection "upgrade"; \
        proxy_set_header Host $host; \
    } \
}' > /etc/nginx/conf.d/default.conf

# Expose port 8080
EXPOSE 8080

RUN printf '#!/bin/sh\n\
sed -i "s|REACT_APP_SOCKET_SERVER_URL_PLACEHOLDER|$REACT_APP_SOCKET_HOST|g" /usr/share/nginx/html/static/js/*.js\n\
sed -i "s|REACT_BACKEND_SERVER_URL_PLACEHOLDER|$REACT_BACKEND_SERVER_URL|g" /etc/nginx/conf.d/default.conf\n\
nginx -g "daemon off;"\n' > /docker-entrypoint.sh && chmod +x /docker-entrypoint.sh

# Use the shell script as the entrypoint
CMD ["/docker-entrypoint.sh"]
