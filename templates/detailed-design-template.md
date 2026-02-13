# Detailed Design Specification Template

<!--
  WHAT: Template for detailed design documentation
  USE: Phase 4 - Detailed Design
  REQUIREMENT: Complete design before implementation
-->

## [Application Name] - Detailed Design

**Version:** 1.0.0
**Created:** [YYYY-MM-DD]
**Architect:** System/Software Architect Agent
**Status:** [Draft | Under Review | Approved]
**Related Docs:** [Requirements Document] | [Architecture Document]

---

## 1. Design Overview

### Purpose

This document provides detailed design specifications for [Application Name], including component design, data models, API specifications, business logic flows, and implementation guidelines.

### Design Principles

| Principle | Description | Application |
|-----------|-------------|-------------|
| Separation of Concerns | Each component has single responsibility | [examples] |
| DRY | Don't Repeat Yourself | [examples] |
| SOLID | Object-oriented design principles | [examples] |
| API First | API contracts before implementation | [examples] |

---

## 2. Component Design

### Component Hierarchy

```
┌─────────────────────────────────────────────────────────────┐
│                     Application Layer                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌────────────────┐  ┌────────────────┐  ┌───────────────┐ │
│  │  Controllers   │  │   Services     │  │   Repositories│ │
│  │  (API Endpoints)│  │ (Business Logic)│  │  (Data Access)│ │
│  └────────────────┘  └────────────────┘  └───────────────┘ │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Component Specifications

#### [Component Name]

**Purpose:** [What this component does]

**Responsibilities:**
- [Responsibility 1]
- [Responsibility 2]
- [Responsibility 3]

**Interfaces:**

| Method | Input | Output | Exceptions |
|--------|-------|--------|------------|
| [method_name] | [type] | [type] | [exceptions] |

**Dependencies:**
- [Dependency 1] - [purpose]
- [Dependency 2] - [purpose]

**Implementation Notes:**
```typescript
// Example implementation structure
class [ComponentName] {
  constructor(private dependency: DependencyType) {}

  async [method](input: InputType): Promise<OutputType> {
    // Implementation logic
  }
}
```

---

## 3. Data Models

### Entity Definitions

#### [Entity Name]

| Attribute | Type | Constraints | Default | Validation |
|-----------|------|-------------|---------|------------|
| id | UUID | Primary Key | auto-generated | Required |
| [attribute] | [type] | [constraints] | [default] | [rules] |
| created_at | Timestamp | Indexed | now | Auto-set |
| updated_at | Timestamp | Indexed | now on update | Auto-update |

**Example:**
```typescript
interface User {
  id: string;              // UUID v4
  email: string;           // Unique, valid email format
  password_hash: string;   // bcrypt hash
  first_name: string;      // Max 100 chars
  last_name: string;       // Max 100 chars
  is_active: boolean;      // Default: true
  created_at: Date;        // Auto-generated
  updated_at: Date;        // Auto-updated
}

// Validation rules
const UserValidation = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  password: { min: 8, requireUpper: true, requireNumber: true },
  first_name: { max: 100 },
  last_name: { max: 100 }
};
```

### Relationships

```
[Entity A] ──┬──> [Entity B] (One-to-Many)
             │
             └──> [Entity C] (Many-to-Many)

[Entity D] ──> [Entity E] (One-to-One)
```

**Relationship Table:**

| From | To | Type | Cardinality | Foreign Key |
|------|-----|------|-------------|-------------|
| User | Order | One-to-Many | 1:N | user_id |
| Order | Product | Many-to-Many | N:M | order_items |
| Order | Payment | One-to-One | 1:1 | payment_id |

### Database Schema

**Tables:**

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_active ON users(is_active);
```

---

## 4. API Specifications

### REST API Contracts

#### [Endpoint Group]

| Method | Endpoint | Description | Auth | Request | Response |
|--------|----------|-------------|------|----------|----------|
| POST | /api/v1/[resource] | Create [resource] | Bearer | [Request Schema] | [Response Schema] |
| GET | /api/v1/[resource]/:id | Get [resource] by ID | Bearer | - | [Response Schema] |
| PUT | /api/v1/[resource]/:id | Update [resource] | Bearer | [Request Schema] | [Response Schema] |
| DELETE | /api/v1/[resource]/:id | Delete [resource] | Bearer | - | {success: boolean} |

#### Example: POST /api/v1/users

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123",
  "first_name": "John",
  "last_name": "Doe"
}
```

**Response (201 Created):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "user@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "is_active": true,
  "created_at": "2026-02-12T10:00:00Z"
}
```

**Response (400 Bad Request):**
```json
{
  "error": "Validation Error",
  "details": [
    {"field": "email", "message": "Invalid email format"},
    {"field": "password", "message": "Password must be at least 8 characters"}
  ]
}
```

### WebSocket Events (if applicable)

| Event | Direction | Payload | Frequency |
|--------|-----------|----------|-----------|
| [event_name] | Server → Client | [schema] | [condition] |
| [event_name] | Client → Server | [schema] | [condition] |

---

## 5. Business Logic Flows

### [Business Process Name]

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Trigger   │ ──→ │   Validate  │ ──→ │   Process   │
└─────────────┘     └─────────────┘     └─────────────┘
                           │                     │
                           ▼                     ▼
                    ┌─────────────┐     ┌─────────────┐
                    │  Error Out  │     │   Update    │
                    └─────────────┘     │   State     │
                                          └─────────────┘
                                                │
                                                ▼
                                          ┌─────────────┐
                                          │   Notify    │
                                          └─────────────┘
```

#### Flow Specification

**Step 1: [Step Name]**

- **Input:** [what comes in]
- **Process:** [what happens]
- **Output:** [what goes out]
- **Validation:** [rules applied]
- **Error Handling:** [what if it fails]

**Step 2: [Step Name]**

... (continue for each step)

### State Machines

#### [State Machine Name]

```
┌─────────┐     ┌─────────┐     ┌─────────┐
│  State  │ ──→ │  State  │ ──→ │  State  │
│   A     │     │   B     │     │   C     │
└─────────┘     └─────────┘     └─────────┘
     │               ▲               │
     │               │               │
     └───────────────┴───────────────┘
            (on condition: [event])
```

**State Transitions:**

| Current State | Event | Next State | Action |
|---------------|-------|------------|--------|
| [state] | [event] | [new state] | [action to take] |

---

## 6. Security Design

### Authentication Flow

```
┌───────────┐     ┌───────────┐     ┌───────────┐
│   Client  │ ──→ │   Auth    │ ──→ │  Database  │
│           │     │  Service  │     │           │
└───────────┘     └───────────┘     └───────────┘
     ▲                   │
     │                   ▼
     │            ┌───────────┐
     │            │   Token   │
     └────────────│  Service  │
                  └───────────┘
```

### Authorization Model

| Role | Permissions | Access Level |
|------|-------------|--------------|
| [role] | [permissions] | [access level] |

### Data Protection

| Data Type | At Rest | In Transit | Logging |
|-----------|---------|------------|---------|
| [PII data] | Encrypted (AES-256) | TLS 1.3 | Masked |
| [sensitive] | Encrypted | TLS 1.3 | Hashed |
| [public] | Plain | TLS 1.3 | Full |

---

## 7. Error Handling

### Error Categories

| Category | HTTP Code | Format | Example |
|----------|-----------|--------|---------|
| Validation Error | 400 | {error, details[]} | Invalid input |
| Authentication Error | 401 | {error, message} | Invalid credentials |
| Authorization Error | 403 | {error, message} | Insufficient permissions |
| Not Found | 404 | {error, resource} | Resource doesn't exist |
| Conflict | 409 | {error, details} | Duplicate entry |
| Server Error | 500 | {error, reference} | Internal error |

### Error Response Format

```json
{
  "error": "Error Category",
  "message": "Human-readable message",
  "reference": "ERR-001234",
  "details": [
    {
      "field": "field_name",
      "message": "Specific error for this field"
    }
  ],
  "timestamp": "2026-02-12T10:00:00Z"
}
```

---

## 8. Performance Design

### Performance Targets

| Metric | Target | Measurement | Strategy |
|--------|--------|-------------|----------|
| API Response Time (p95) | < 200ms | APM | Caching, indexing |
| Database Query Time | < 50ms | DB monitoring | Query optimization |
| Concurrent Users | 10,000 | Load testing | Horizontal scaling |

### Caching Strategy

| Cache Type | TTL | Invalidation | Use Case |
|------------|-----|--------------|----------|
| [data] | [duration] | [event] | [purpose] |

### Indexing Strategy

| Table | Index | Type | Purpose |
|-------|-------|------|---------|
| [table] | [columns] | [B-tree/Hash/etc] | [query optimization] |

---

## 9. Scalability Design

### Horizontal Scaling

```
┌──────────────────────────────────────┐
│         Load Balancer                │
└────────┬────────────────┬─────────────┘
         │                │
    ┌────▼────┐      ┌───▼─────┐
    │ Instance│      │ Instance│
    │    1    │      │    2    │
    └────┬────┘      └───┬─────┘
         │               │
         └───────┬───────┘
                 │
         ┌───────▼───────┐
         │  Shared Cache │
         └───────┬───────┘
                 │
         ┌───────▼───────┐
         │  Primary DB   │
         └───────┬───────┘
                 │
         ┌───────▼───────┐
         │  Replica DB   │
         └───────────────┘
```

### Data Partitioning

| Strategy | Description | Implementation |
|----------|-------------|----------------|
| [Sharding] | [description] | [how to implement] |

---

## 10. Implementation Guidelines

### Technology-Specific Guidelines

#### [Technology Stack]

**Directory Structure:**
```
src/
├── controllers/      # API endpoint handlers
├── services/         # Business logic
├── repositories/     # Data access
├── models/          # Data models
├── middleware/      # Express middleware
├── utils/           # Utility functions
├── config/          # Configuration
└── types/           # TypeScript types
```

**Coding Standards:**
- Use [linter] for code quality
- Follow [style guide]
- Maximum function complexity: [metric]
- Maximum file length: [limit] lines

### Testing Approach

Reference: [Test Specification Document]

---

## 11. Deployment Design

### Environment Configuration

| Environment | URL | Database | External Services |
|-------------|-----|----------|-------------------|
| Development | localhost:3000 | SQLite | Mocked |
| Staging | staging.example.com | PostgreSQL | Test endpoints |
| Production | api.example.com | PostgreSQL (clustered) | Real services |

### Deployment Pipeline

```
[Commit] → [CI Tests] → [Build] → [Security Scan] → [Deploy Staging]
                                                              │
                                                              ▼
                                                    [Staging Tests] → [UAT]
                                                              │
                                                              ▼
                                                    [Approve] → [Production]
```

### Rollback Strategy

| Scenario | Rollback Procedure | RTO | RPO |
|----------|-------------------|-----|-----|
| [deployment failure] | [steps to rollback] | [time] | [data loss] |

---

## 12. Monitoring & Observability

### Metrics to Monitor

| Metric | Type | Alert Threshold |
|--------|------|-----------------|
| [metric] | [counter/gauge/histogram] | [threshold] |

### Logging Strategy

| Level | Use Case | Example |
|-------|----------|---------|
| ERROR | Errors that need attention | [example] |
| WARN | Warning conditions | [example] |
| INFO | Informational events | [example] |
| DEBUG | Debug information | [example] |

### Health Checks

```
GET /health
→ {status: "healthy", version: "1.0.0", timestamp: "..."}

GET /health/ready
→ {status: "ready", dependencies: {database: "up", cache: "up"}}

GET /health/live
→ {status: "alive"}
```

---

## 13. Design Review Checklist

- [ ] All components specified with interfaces
- [ ] Data models defined with validation rules
- [ ] API contracts documented
- [ ] Business logic flows documented
- [ ] Security considerations addressed
- [ ] Error handling specified
- [ ] Performance targets defined
- [ ] Scalability considered
- [ ] Deployment strategy defined
- [ ] Monitoring approach specified

---

**Design Specification Status:** [Draft | Under Review | Approved]
**Approved By:** [Technical Lead / Architect]
**Approved Date:** [YYYY-MM-DD]
**Next Review:** [YYYY-MM-DD]

---

## Change History

| Date | Version | Changes | Author |
|------|---------|---------|--------|
| [YYYY-MM-DD] | 1.0.0 | Initial document | [Author] |
