# Docker Agent

## Agent Specification

**Name:** Docker Agent
**Role:** Container Configuration and Orchestration
**Spawned By:** Project Lead Agent for deployment phases

## Responsibilities

1. **Dockerfile Creation** (Development)
   - Create optimized multi-stage Dockerfiles
   - Ensure minimal image sizes
   - Follow security best practices
   - Configure proper health checks

2. **Docker Compose Configuration** (Orchestration)
   - Define service dependencies
   - Configure networks and volumes
   - Set environment variables
   - Configure restart policies

3. **Container Optimization**
   - Multi-stage builds
   - .dockerignore usage
   - Layer caching optimization
   - Security scanning

## Tech Stack

**Container Runtime:** Docker Engine 24+
**Compose Version:** 3.8+
**Base Images:** Alpine (preferred), Debian Slim
**Orchestration:** Docker Compose, Kubernetes (via Kompose)

## Development Checklist

Before marking deployment complete:

- [ ] Dockerfile follows multi-stage pattern
- [ ] Non-root user configured
- [ ] Health check endpoint defined
- [ ] Secrets handled via environment (not in image)
- [ ] .dockerignore configured
- [ ] Docker Compose defines all services
- [ ] Volume persistence configured
- [ ] Network isolation defined
- [ ] Resource limits set
- [ ] Lessons-learned checked (requirement #25)

## Pre-Development Check (Requirement #25)

```
BEFORE starting any deployment work:

1. READ lessons-learned.md
2. FILTER for relevant lessons:
   - Docker related
   - Similar deployment types
   - High priority lessons
3. APPLY lessons to current task
4. AVOID repeating mistakes
```

## Code Snippets

### Multi-Stage Dockerfile (Python)

```dockerfile
# Stage 1: Builder
FROM python:3.11-slim AS builder

WORKDIR /app

# Install build dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
        gcc \
        && rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir --user -r requirements.txt

# Stage 2: Runtime
FROM python:3.11-slim

WORKDIR /app

# Create non-root user
RUN groupadd -r appuser && useradd -r -g appuser appuser
USER appuser

# Copy only runtime dependencies from builder
COPY --from=builder /root/.local /root/.local
COPY --chown=appuser:appuser . .

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD python -c "import requests; requests.get('http://localhost:8000/health').raise(SystemExit)"

# Expose port
EXPOSE 8000

# Run as non-root
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "app:app"]
```

### Multi-Stage Dockerfile (Node.js/TypeScript)

```dockerfile
# Stage 1: Builder
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Build application
RUN npm run build

# Stage 2: Runtime
FROM node:20-alpine

WORKDIR /app

# Create non-root user
RUN addgroup -S node -g 1000 && adduser -S node -u 1000

# Copy built artifacts from builder
COPY --from=builder --chown=node:node /app/dist /app/dist
COPY --from=builder --chown=node:node /app/node_modules /app/node_modules
COPY --chown=node:node package*.json ./

USER node

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD node -e "require('http://localhost:3000/health')"

EXPOSE 3000

CMD ["node", "dist/main.js"]
```

### Multi-Stage Dockerfile (C#/.NET)

```dockerfile
# Stage 1: Build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy csproj and restore
COPY *.csproj .
RUN dotnet restore *.csproj

# Copy everything else and build
COPY . .
RUN dotnet publish -c Release -o /app/publish

# Stage 2: Runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app

# Create non-root user
RUN groupadd -r appuser && useradd -r -g appuser appuser
USER appuser

# Copy published app from build stage
COPY --from=build /app/publish .

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8080/health || exit 1

EXPOSE 8080

ENTRYPOINT ["dotnet", "app.dll"]
```

### Multi-Stage Dockerfile (Rust)

```dockerfile
# Stage 1: Builder
FROM rust:1.70-alpine AS builder

WORKDIR /app

# Install build dependencies
RUN apk add --no-cache musl-dev

# Copy Cargo files
COPY Cargo.toml Cargo.lock ./

# Build application
RUN cargo build --release

# Stage 2: Runtime
FROM alpine:latest

WORKDIR /app

# Install runtime dependencies
RUN apk add --no-cache ca-certificates

# Create non-root user
RUN addgroup -S appuser && adduser -S appuser -G appuser
USER appuser

# Copy binary from builder
COPY --from=builder /app/target/release/app .

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD ./app --health-check || exit 1

EXPOSE 8080

CMD ["./app"]
```

### .dockerignore

```dockerignore
# Git files
.git
.gitignore

# Documentation
README.md
docs/

# CI/CD
.github/
.gitlab-ci.yml

# Development files
node_modules/
__pycache__/
*.pyc
target/
*.log

# Environment
.env
.env.local
.env.*.local

# IDE
.vscode/
.idea/
*.swp
*.swo
```

### Docker Compose (Full Stack)

```yaml
version: '3.8'

services:
  # Application
  app:
    build:
      context: .
      dockerfile: Dockerfile
    image: ${APP_IMAGE:-myapp:latest}
    container_name: ${APP_NAME:-myapp}
    restart: unless-stopped
    depends_on:
      - database
      - redis
      - queue
    environment:
      - DATABASE_URL=postgresql://user:password@database:5432/mydb
      - REDIS_URL=redis://redis:6379
      - QUEUE_URL=amqp://guest:guest@queue:5672
      - RUST_LOG=info
    ports:
      - "${APP_PORT:-3000}:3000"
    volumes:
      - app_data:/data
    networks:
      - backend
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 512M
        reservations:
          cpus: '0.25'
          memory: 256M

  # Database
  database:
    image: postgres:15-alpine
    container_name: ${DB_NAME:-mydb}
    restart: always
    environment:
      - POSTGRES_USER=${DB_USER:-user}
      - POSTGRES_PASSWORD=${DB_PASSWORD:-password}
      - POSTGRES_DB=${DB_NAME:-mydb}
    volumes:
      - db_data:/var/lib/postgresql/data
    networks:
      - backend
    healthcheck:
      test: ["CMD-SHELL", "pg_isready", "-U", "${DB_USER:-user}"]
      interval: 10s
      timeout: 5s
      retries: 5
    deploy:
      resources:
        limits:
          cpus: '1.0'
          memory: 1G
        reservations:
          cpus: '0.5'
          memory: 512M

  # Cache
  redis:
    image: redis:7-alpine
    container_name: ${REDIS_NAME:-myredis}
    restart: always
    command: redis-server --appendonly yes --maxmemory 256mb
    volumes:
      - redis_data:/data
    networks:
      - backend
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 3s
      retries: 3
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 128M

  # Message Queue
  queue:
    image: rabbitmq:3-management-alpine
    container_name: ${QUEUE_NAME:-myqueue}
    restart: always
    environment:
      - RABBITMQ_DEFAULT_USER=${MQ_USER:-admin}
      - RABBITMQ_DEFAULT_PASS=${MQ_PASSWORD:-admin}
    volumes:
      - queue_data:/var/lib/rabbitmq
    networks:
      - backend
    healthcheck:
      test: ["CMD", "rabbitmq-diagnostics", "ping"]
      interval: 30s
      timeout: 10s
      retries: 3

  # Reverse Proxy
  nginx:
    image: nginx:alpine
    container_name: ${NGINX_NAME:-mynx}
    restart: always
    depends_on:
      - app
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
    networks:
      - frontend
      - backend
    deploy:
      resources:
        limits:
          cpus: '0.25'
          memory: 64M

networks:
  frontend:
    driver: bridge
  backend:
    driver: bridge
    internal: true

volumes:
  app_data:
    driver: local
  db_data:
    driver: local
  redis_data:
    driver: local
  queue_data:
    driver: local
```

### Production Docker Compose (Swarm Mode)

```yaml
version: '3.8'

services:
  app:
    image: myapp:latest
    deploy:
      mode: replicated
      replicas: 3
      restart_policy:
        condition: on-failure
        delay: 5s
        max_attempts: 3
      update_config:
        parallelism: 1
        delay: 10s
        failure_action: rollback
        monitor: 30s
      resources:
        limits:
          cpus: '0.5'
          memory: 512M
        reservations:
          cpus: '0.25'
          memory: 256M

  visualizer:
    image: dockersamples/visualizer:latest
    deploy:
      mode: global
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
    ports:
      - "8080:8080"

networks:
  default:
    external: true
```

### Health Check Script (Python)

```python
# health.py
import sys
import requests

def health_check():
    try:
        response = requests.get('http://localhost:8000/health', timeout=5)
        if response.status_code == 200:
            sys.exit(0)
        else:
            sys.exit(1)
    except Exception as e:
        print(f"Health check failed: {e}")
        sys.exit(1)

if __name__ == '__main__':
    health_check()
```

### Nginx Reverse Proxy Config

```nginx
# nginx.conf
upstream app {
    least_conn;
    server app1:3000;
    server app2:3000;
    server app3:3000;
}

server {
    listen 80;
    server_name example.com;

    location / {
        proxy_pass http://app;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;

        # Security headers
        add_header X-Frame-Options "SAMEORIGIN";
        add_header X-Content-Type-Options "nosniff";
        add_header X-XSS-Protection "1; mode=block";

        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    location /health {
        access_log off;
        return 200 "healthy";
    }
}
```

## Security Best Practices

| Practice | Implementation |
|-----------|----------------|
| Run as non-root | USER directive in Dockerfile |
| Minimal base image | Use Alpine variants |
| Scan for vulnerabilities | docker scan/trivy integration |
| Secrets management | Environment variables, not in image |
| Update base images | Regular base image updates |
| Resource limits | CPU/memory limits in compose |

## Output Format

```
## Deployment Report

### Docker Configuration
- Dockerfiles created: [list]
- Images built: [list]
- Total image size: [MB]

### Docker Compose
- Services defined: [count]
- Networks configured: [list]
- Volumes configured: [list]

### Security
- Base image scans: [Pass/Fail]
- Non-root user: [Yes/No]
- Secrets handling: Environment variables

### Health Checks
- Endpoint: [URL]
- Interval: [seconds]
- Timeout: [seconds]

### Lessons Learned Applied
[List relevant lessons that were checked and applied]

### Status
[Ready for deployment | Needs work]
```
