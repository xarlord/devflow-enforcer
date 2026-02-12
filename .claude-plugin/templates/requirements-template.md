# Requirements Document Template

<!--
  WHAT: Template for documenting clear, concise, verifiable requirements.
  REQUIREMENT: All requirements must be clear, concise, verifiable (#12)
-->

## [Application Name] - Requirements

**Version:** 1.0.0
**Created:** [YYYY-MM-DD]
**Status:** [Draft | Under Review | Approved]

---

## Requirements Summary

| Category | Count | Priority Items |
|-----------|--------|----------------|
| Functional | [count] | [highest priority items] |
| Non-Functional | [count] | [performance, security, etc.] |
| Technical | [count] | [technology constraints] |
| Constraints | [count] | [budget, timeline, etc.] |

---

## Functional Requirements

### User Stories

| ID | User Story | Priority | Acceptance Criteria | Status |
|------|-------------|----------|-------------------|--------|
| FR-001 | As a [user role], I want to [action] so that [benefit] | High | [Given/When/Then criteria] | Pending | In Progress | Complete |
| FR-002 | As a [user role], I want to [action] so that [benefit] | Medium | [Given/When/Then criteria] | Pending | In Progress | Complete |

**Example Format:**
```
FR-001: User Authentication
- As a user, I want to log in with email and password so that I can access my account.
- Priority: High
- Acceptance Criteria:
  - Given: I am on the login page
  - When: I enter valid email and password
  - Then: I am redirected to dashboard
  - And: A session token is stored
  - And: I remain logged in for 24 hours
```

### Feature Breakdown

| Feature | Requirements | Dependencies | Estimated Complexity |
|----------|--------------|---------------|---------------------|
| [Feature Name] | FR-001, FR-002 | [depends on] | Low | Medium | High |

---

## Non-Functional Requirements

### Performance

| Requirement | Metric | Verification Method |
|--------------|-------|-------------------|
| API Response Time | p95 < 200ms | Load testing |
| Page Load Time | < 2s | Lighthouse testing |
| Concurrent Users | 10,000 simultaneous | Stress testing |

### Security

| Requirement | Standard | Verification |
|--------------|----------|--------------|
| Password Storage | Hashed (bcrypt/argon2) | Code review |
| Data in Transit | TLS 1.3 | Security scan |
| Input Validation | OWASP Top 10 | Penetration testing |
| Auth Token | JWT with expiration | Security review |

### Reliability

| Requirement | Target | Verification |
|--------------|--------|--------------|
| Uptime | 99.9% | Monitoring |
| Data Backup | Hourly, 30-day retention | Backup audit |
| Failover | < 5s cutover | Disaster recovery test |

### Usability

| Requirement | Standard | Verification |
|--------------|----------|--------------|
| WCAG 2.1 Compliance | Level AA | Accessibility audit |
| Mobile Responsive | All devices | Device testing |
| Browser Support | Last 2 versions | Browser testing |

---

## Technical Requirements

### Technology Stack

| Layer | Technology | Version | Constraint |
|--------|-------------|---------|-------------|
| Frontend | [Framework] | [X.X] | Must be [framework] |
| Backend | [Framework] | [X.X] | Must support [API type] |
| Database | [Database] | [X.X] | Must support [transactions] |
| Deployment | [Docker/K8s] | [X.X] | Must run on [platform] |

### Constraints

| Constraint | Description | Impact |
|-----------|-------------|---------|
| Budget | [$X amount] | Limited resources |
| Timeline | [X weeks] | Scope limitations |
| Team Size | [X developers] | Velocity considerations |
| Legacy Integration | Must support [system] | Technical debt allocation |

---

## Data Requirements

### Data Entities

| Entity | Attributes | Relationships | Privacy |
|---------|------------|-------------|----------|
| [Entity] | [attributes] | [related entities] | [Public/Confidential/PII] |

### Data Classification

| Classification | Examples | Handling |
|--------------|---------|------------|
| Public | Product catalog, marketing content | Standard caching |
| Confidential | User data, order history | Encrypted storage |
| PII | Email, phone, address | Masked in logs |
| Regulated | Payment info | PCI-DSS compliance |

---

## Integration Requirements

| System | Interface Type | Data Format | SLA |
|----------|---------------|-------------|-----|
| [Payment Gateway] | REST API | JSON | 99.9% uptime |
| [Email Service] | SMTP/HTTPS | MIME | 5s delivery |
| [Analytics] | Batch API | CSV/Gzip | Daily sync |

---

## Traceability Matrix

| Requirement ID | Feature | Test Cases | Code Files |
|---------------|---------|-------------|-------------|
| FR-001 | User Authentication | TC-001, TC-002 | auth.service.ts |
| FR-002 | User Registration | TC-003, TC-004 | register.service.ts |

---

## Requirements Quality Checklist

Per requirement #12: All requirements must be **clear, concise, verifiable**.

### Clarity Check

| Requirement | Clear? | Questions/Issues | Action |
|--------------|---------|------------------|--------|
| FR-001 | ✅ Yes | None | Approved |
| FR-002 | ❌ No | "What does 'flexible' mean?" | Revise |

### Conciseness Check

| Requirement | Verbose? | Simplification |
|--------------|-----------|----------------|
| FR-003 | ❌ Yes | Remove implementation details |
| FR-004 | ✅ No | Keep as is |

### Verifiability Check

| Requirement | Testable? | Measurement |
|--------------|----------|--------------|
| FR-005 | ✅ Yes | User login time < 3s |
| FR-006 | ❌ No | "Good performance" - define metric |

---

## Change Log

| Date | Change | Reason | Impact |
|--------|---------|----------|----------|
| [YYYY-MM-DD] | [description] | [affected requirements] |

---

**Document Status:** [Draft | Under Review | Approved]
**Approved By:** [Stakeholder]
**Approved Date:** [YYYY-MM-DD]
