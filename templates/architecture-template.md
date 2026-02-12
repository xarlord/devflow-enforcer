# Architecture Document Template

<!--
  WHAT: Template for creating architecture documents for new projects.
  USE: Copy this to your project docs folder and fill in details.
-->

## [Application Name] - Architecture

### System Overview

**Application:** [Application Name]
**Version:** 1.0.0
**Created:** [YYYY-MM-DD]
**Architect:** System/Software Architect Agent

---

## 1. System Architecture

### High-Level Components

```
┌─────────────────────────────────────────────────────────────────┐
│                    [Application Name]                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌───────────────────────────────────────────────────────────┐   │
│  │                    Frontend Layer                  │   │
│  │  [Framework: React/Vue/Angular/etc]                 │   │
│  └───────────────────────────────────────────────────────────┘   │
│                          │                                      │
│                          ▼                                      │
│  ┌───────────────────────────────────────────────────────────┐   │
│  │                    Backend Layer                     │   │
│  │  [Framework: Express/FastAPI/etc]                      │   │
│  └───────────────────────────────────────────────────────────┘   │
│                          │                                      │
│                          ▼                                      │
│  ┌───────────────────────────────────────────────────────────┐   │
│  │                    Data Layer                       │   │
│  │  [Database: PostgreSQL/MongoDB/etc]                     │   │
│  └───────────────────────────────────────────────────────────┘   │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### Component List

| Component | Responsibility | Technology | Interfaces |
|-----------|-----------------|-------------|-------------|
| [Frontend] | [User interface, state management] | [React/Vue] | REST API |
| [Backend API] | [Request handling, business logic] | [Express/FastAPI] | REST, GraphQL |
| [Auth Service] | [Authentication, authorization] | [JWT/OAuth] | API |
| [Database] | [Data persistence, queries] | [PostgreSQL/MongoDB] | ORM/ODM |
| [Cache] | [Performance optimization] | [Redis/Memcached] | Key-value |
| [Message Queue] | [Async processing] | [RabbitMQ/Kafka] | Pub-sub |

---

## 2. Data Models

### Entity Relationship Diagram

```
[User] ──┬──> [Order]
      │        │
      │        ├──> [OrderItem]
      │        │
      └──────> [Payment]

[Product] ──┬──> [Category]
            │
            └──> [Inventory]
```

### Data Model Specifications

| Entity | Attributes | Relationships | Notes |
|--------|------------|-------------|-------|
| User | id, email, password_hash, created_at | 1:N Order | Password must be hashed |
| Order | id, user_id, status, created_at | N:1 User, 1:N OrderItem | Status: pending/completed |
| Product | id, name, price, stock | N:1 Category | Stock tracking |

### Database Schema

**Database Type:** [PostgreSQL / MySQL / MongoDB]

**Connection String Pattern:**
```
DATABASE_URL=[protocol]://[user]:[password]@[host]:[port]/[database]
```

**Migration Strategy:**
- Tool: [Alembic / Prisma / Migrate]
- Environment-based migrations
- Rollback capability required

---

## 3. Interactions & APIs

### REST API Endpoints

| Method | Endpoint | Description | Auth | Request | Response |
|---------|-----------|-------------|-----|----------|----------|
| POST | /api/v1/auth/login | User login | No | {email, password} | {token, user} |
| GET | /api/v1/users/:id | Get user by ID | Yes | - | {user} |
| POST | /api/v1/orders | Create order | Yes | {order} | {order} |
| PUT | /api/v1/orders/:id | Update order | Yes | {order} | {order} |
| DELETE | /api/v1/orders/:id | Cancel order | Yes | - | {success} |

### WebSocket Events (if applicable)

| Event | Direction | Payload | Frequency |
|--------|-----------|----------|-----------|
| order.update | Server → Client | {order_id, status} | On change |
| user.notification | Server → Client | {message, type} | On event |

---

## 4. Functional Specifications

### Authentication & Authorization

```
┌─────────────┐
│  Login     │
└─────┬───────┘
      │
      ▼
┌─────────────┐     ┌──────────────┐
│  Validate   │ ──→ │  Check       │
│  Credentials │     │  Database    │
└─────┬───────┘     └──────┬───────┘
      │                      │
      ▼                      ▼
┌─────────────┐       ┌──────────────┐
│  Generate   │ ──→  │  Create      │
│  JWT Token  │       │  Session     │
└─────┬───────┘       └──────┬──────┘
      │                       │
      ▼                       ▼
      [Return Token]         [Store Session]
```

**Requirements:**
- Password hashing (bcrypt/argon2)
- JWT token expiration (24h default)
- Refresh token support
- Session invalidation on logout

### Business Logic Flows

**Order Processing:**
```
[Create Order] → [Validate Inventory] → [Process Payment]
                           │                    │
                           ▼                    ▼
                    [Reserve Stock]       [Update Order Status]
                           │                    │
                           └──────┬───────┘
                                  ▼
                           [Send Confirmation]
```

---

## 5. Technology Stack

| Layer | Technology | Version | Justification |
|--------|-------------|---------|---------------|
| Frontend | [Framework] | [X.X] | [Reason for choice] |
| Backend | [Framework] | [X.X] | [Reason for choice] |
| Database | [Database] | [X.X] | [Reason for choice] |
| Cache | [Redis/Memcached] | [X.X] | Performance needs |
| Queue | [RabbitMQ/Kafka] | [X.X] | Async processing |
| Container | [Docker] | [X.X] | Deployment |

---

## 6. Security Considerations

| Concern | Mitigation |
|----------|-------------|
| SQL Injection | Parameterized queries, ORM |
| XSS | Input sanitization, CSP headers |
| CSRF | Token-based authentication |
| Password Storage | bcrypt/argon2 hashing |
| API Rate Limiting | Redis-based throttling |
| Data Encryption | TLS for data in transit |

---

## 7. Deployment Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   Load Balancer                     │
│              [Nginx/HAProxy/ALB]                  │
└─────────────┬─────────────────┬─────────────────┘
              │                 │
      ┌─────────────┐   ┌─────────────┐
      │  App Server │   │  App Server │
      │  Instance 1 │   │  Instance 2 │
      └──────┬──────┘   └──────┬──────┘
             │                    │
      ┌────────┴────────┐   ┌───┴──────────┐
      │   Database      │   │   Database    │
      │   Primary      │   │   Replica     │
      └─────────────────┘   └────────────────┘
```

**Environments:**
- Development: [Docker Compose]
- Staging: [Kubernetes/Cloud]
- Production: [Kubernetes/Cloud with auto-scaling]

---

## 8. Monitoring & Logging

| Metric | Tool | Alert Threshold |
|---------|--------|----------------|
| Application Performance | [APM tool] | p95 > 500ms |
| Error Rate | [Logging tool] | > 1% |
| Database Connections | [DB monitor] | > 80% pool |
| Disk Space | [Cloud watch] | < 20% free |

---

## 9. Non-Functional Requirements

| Requirement | Target | Measurement |
|--------------|--------|--------------|
| Response Time (API) | p95 < 200ms | APM |
| Throughput | 1000 req/min | Load testing |
| Availability | 99.9% uptime | Monitoring |
| Scalability | Handle 10x load | Stress testing |

---

**Document Status:** [Draft | Review | Approved]
**Last Updated:** [YYYY-MM-DD]
**Next Review:** [YYYY-MM-DD]
