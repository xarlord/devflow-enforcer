# Test Specification Template

<!--
  WHAT: Template for comprehensive test planning and specification
  USE: Phase 5 - Testing Specification
  REQUIREMENT: 95% coverage, 100% pass rate (Quality Gates)
-->

## [Application Name] - Test Specification

**Version:** 1.0.0
**Created:** [YYYY-MM-DD]
**Testing Agent:** [Testing Agent]
**Status:** [Draft | Under Review | Approved]

---

## 1. Test Strategy

### Overview

| Aspect | Strategy |
|--------|----------|
| Test Approach | [TDD | BDD | Hybrid] |
| Test Automation | [Framework: Jest/pytest/etc] |
| Coverage Target | 95% minimum |
| Pass Rate Target | 100% required |
| Test Environment | [Docker | Local | Cloud] |

### Testing Pyramid

```
                    ┌──────────────┐
                    │    E2E/BDD   │
                    │    (10%)     │
                    ├──────────────┤
                    │ Integration  │
                    │    (30%)     │
                    ├──────────────┤
                    │   Unit Tests │
                    │    (60%)     │
                    └──────────────┘
```

---

## 2. Unit Test Specification

### Coverage Requirements

| Metric | Target | Measured By | Status |
|--------|--------|-------------|--------|
| Statement Coverage | 95% | [coverage tool] | ❌ Pending |
| Branch Coverage | 90% | [coverage tool] | ❌ Pending |
| Function Coverage | 100% | [coverage tool] | ❌ Pending |
| Pass Rate | 100% | [test runner] | ❌ Pending |

### Unit Test Cases

| ID | Component | Test Case | Expected Result | Priority | Status |
|----|-----------|-----------|-----------------|----------|--------|
| UTC-001 | [Service] | [description] | [expected behavior] | High | ❌ Pending |
| UTC-002 | [Service] | [description] | [expected behavior] | Medium | ❌ Pending |

**Example Format:**
```
UTC-001: User Authentication Service - Login
- Component: AuthService
- Test Case: Valid credentials return JWT token
- Given: User exists with email "test@example.com" and password "SecurePass123"
- When: I call login with valid credentials
- Then: JWT token is returned
- And: Token expires in 24 hours
- And: User session is created
- Priority: High
```

### Test Framework Configuration

**Technology:** [Python pytest | Jest | etc]

```javascript
// Example Jest configuration
module.exports = {
  coverageThreshold: {
    global: {
      statements: 95,
      branches: 90,
      functions: 100,
      lines: 95
    }
  },
  testMatch: ['**/__tests__/**/*.js', '**/?(*.)+(spec|test).js'],
  coverageReporters: ['text', 'lcov', 'html']
};
```

---

## 3. Integration Test Specification

### API Integration Tests

| ID | Endpoint | Test Scenario | Expected Response | Status |
|----|----------|---------------|-------------------|--------|
| ITC-001 | POST /api/auth/login | Valid credentials | 200 + JWT token | ❌ Pending |
| ITC-002 | POST /api/auth/login | Invalid credentials | 401 error | ❌ Pending |
| ITC-003 | GET /api/users/:id | Valid token | User object | ❌ Pending |

### Service Integration Tests

| ID | Services | Test Scenario | Expected Behavior | Status |
|----|----------|---------------|-------------------|--------|
| ITC-101 | [Service A] → [Service B] | [description] | [expected outcome] | ❌ Pending |
| ITC-102 | [Database] → [Cache] | [description] | [expected outcome] | ❌ Pending |

### Integration Test Environment

| Environment | URL | Database | External Services |
|-------------|-----|----------|-------------------|
| Development | localhost:3000 | Local SQLite | Mocked |
| CI/CD | ci.example.com | Test PostgreSQL | Staged |
| Staging | staging.example.com | Staging PostgreSQL | Real (test) |

---

## 4. BDD Test Scenarios

### User Stories & Scenarios

| ID | Feature | Scenario | Given/When/Then | Status |
|----|---------|----------|-----------------|--------|
| BDD-001 | [Feature] | [description] | [Gherkin syntax] | ❌ Pending |

**Example Format:**
```
BDD-001: User Login Feature

Scenario: Successful login with valid credentials
  Given I am on the login page
  And I have registered with email "test@example.com"
  When I enter "test@example.com" in the email field
  And I enter "SecurePass123" in the password field
  And I click the "Login" button
  Then I should be redirected to the dashboard
  And I should see "Welcome, Test User" message
  And a session token should be stored

Scenario: Failed login with invalid credentials
  Given I am on the login page
  When I enter "test@example.com" in the email field
  And I enter "WrongPassword" in the password field
  And I click the "Login" button
  Then I should see "Invalid credentials" error
  And I should remain on the login page
  And no session token should be stored
```

### BDD Framework

**Framework:** [Cucumber | SpecFlow | Behave | etc]

**Feature File Location:** `tests/features/`
**Step Definitions Location:** `tests/steps/`

---

## 5. Quality Gates

### Non-Negotiable Requirements

| Gate | Target | Measurement | Failure Action |
|------|--------|-------------|----------------|
| Unit Test Coverage | 95% | coverage report | Block deployment |
| Unit Test Pass Rate | 100% | test results | Return to development |
| Integration Tests | Pass | test results | Block deployment |
| BDD Scenarios | Pass | BDD report | Block deployment |
| Linting | 0 errors | linter output | Block commit |
| Security Scan | 0 critical/high | security report | Block deployment |

### Pre-Commit Checklist

- [ ] All unit tests pass (100% pass rate)
- [ ] Coverage ≥ 95%
- [ ] No linting errors
- [ ] Integration tests pass
- [ ] BDD scenarios pass
- [ ] Security scan clean (0 critical/high)

### Pre-Deployment Checklist

- [ ] All quality gates passed
- [ ] Code reviewed and approved
- [ ] Documentation updated
- [ ] User acceptance completed

---

## 6. Test Environment Setup

### Local Development

```bash
# Install dependencies
npm install  # or: pip install -r requirements.txt

# Run unit tests
npm test  # or: pytest

# Run with coverage
npm run test:coverage  # or: pytest --cov

# Run integration tests
npm run test:integration

# Run BDD tests
npm run test:bdd
```

### CI/CD Pipeline

```yaml
# Example CI configuration
test:
  stage: test
  script:
    - npm install
    - npm run lint
    - npm run test:coverage
    - npm run test:integration
    - npm run test:bdd
    - npm run security-scan
  coverage: '/All files[^|]*\|[^|]*\s+([\d\.]+)/'
  artifacts:
    reports:
      coverage_report:
        coverage_format: cobertura
        path: coverage/cobertura-coverage.xml
```

### Test Data Management

| Data Type | Source | Refresh Rate | Privacy |
|-----------|---------|--------------|---------|
| Unit Test Data | Fixtures/Mocks | N/A | Synthetic |
| Integration Data | Test Database | Per build | Anonymized |
| BDD Data | Scenarios | Per build | Synthetic |

---

## 7. Test Reporting

### Coverage Reports

| Report Type | Location | Frequency | Audience |
|-------------|----------|-----------|----------|
| Unit Coverage | coverage/index.html | Every build | Developers |
| Integration Results | test-results/integration.html | Every build | QA Team |
| BDD Report | test-results/bdd.html | Every build | Stakeholders |

### Metrics Dashboard

| Metric | Current | Target | Trend |
|--------|---------|--------|-------|
| Unit Test Pass Rate | [%] | 100% | [↑/↓/→] |
| Coverage | [%] | 95% | [↑/↓/→] |
| Flaky Tests | [count] | 0 | [↑/↓/→] |
| Test Duration | [seconds] | < 300s | [↑/↓/→] |

---

## 8. Risk-Based Testing

| Risk Area | Impact | Likelihood | Test Strategy |
|-----------|--------|------------|---------------|
| [Security] | High | Medium | Penetration testing, security scans |
| [Performance] | High | Low | Load testing, stress testing |
| [Data Loss] | Critical | Low | Backup/restore testing |
| [API Changes] | Medium | High | Integration tests, versioning tests |

---

## 9. Test Schedule

| Phase | Tests | Duration | Owner | Status |
|-------|-------|----------|-------|--------|
| Unit Tests | [count] tests | [time] | [developer] | ❌ Pending |
| Integration Tests | [count] tests | [time] | [QA] | ❌ Pending |
| BDD Tests | [count] scenarios | [time] | [QA + BA] | ❌ Pending |
| UAT | [count] scenarios | [time] | [Stakeholders] | ❌ Pending |

---

## 10. Traceability Matrix

| Requirement ID | Test Cases | Automated | Status |
|---------------|------------|------------|--------|
| FR-001 | UTC-001, ITC-001, BDD-001 | ✅ Yes | ❌ Pending |
| FR-002 | UTC-002, ITC-002 | ✅ Yes | ❌ Pending |

---

**Test Specification Status:** [Draft | Under Review | Approved]
**Approved By:** [QA Lead / Stakeholder]
**Approved Date:** [YYYY-MM-DD]
**Next Review:** [YYYY-MM-DD]

---

## Quality Gate Enforcement Rules

### Enforcement Policy

**Quality gates are NON-NEGOTIABLE** per DevFlow Enforcer requirements:

1. **Coverage < 95%**: Automatically return to development phase
2. **Pass Rate < 100%**: Automatically return to development phase
3. **Integration failures**: Block deployment until fixed
4. **BDD failures**: Block deployment until fixed
5. **Linting errors**: Block commit until fixed
6. **Security vulnerabilities**: Block deployment until fixed

### Finding Creation

Any quality gate failure MUST create a finding:

```
Finding ID: [AUTO-GENERATED]
Type: Quality Gate Failure
Severity: Critical (blocks progress)
Phase: [Phase where failure occurred]
Description: [Specific failure details]
Assigned To: [Appropriate agent]
Status: Open (blocks next phase)
```

### Finding Closure

Findings can ONLY be closed when:
1. Root cause is identified
2. Fix is implemented
3. Tests pass with required metrics
4. Code review approved
