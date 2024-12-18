# Build stage
FROM node:20-alpine AS builder

WORKDIR /app
COPY . .

RUN npm install
RUN npm run build

# Production stage
FROM nginxinc/nginx-unprivileged:latest

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Crea il template nella directory corretta
RUN mkdir -p /etc/nginx/templates && \
    echo 'server { \
    listen 8080; \
    client_max_body_size 5M; \
    server_name localhost; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
    location /api { \
        proxy_pass ${REACT_BACKEND_SERVER_URL}; \
        proxy_http_version 1.1; \
        proxy_set_header Upgrade $http_upgrade; \
        proxy_set_header Connection "upgrade"; \
        proxy_set_header Host $host; \
    } \
    location /socket.io { \
        proxy_pass ${REACT_BACKEND_SERVER_URL}; \
        proxy_http_version 1.1; \
        proxy_set_header Upgrade $http_upgrade; \
        proxy_set_header Connection "upgrade"; \
        proxy_set_header Host $host; \
    } \
}' > /etc/nginx/templates/default.conf.template

RUN chgrp -R root /var/cache/nginx /var/run /var/log/nginx && \
    chmod -R 777 /var
RUN sed -i.bak 's/^user/#user/' /etc/nginx/nginx.conf

EXPOSE 8080

# Usa l'entrypoint di default di nginx che processerà automaticamente i template
CMD ["nginx", "-g", "daemon off;"]
