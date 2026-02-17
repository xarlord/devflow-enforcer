---
name: coverage-mapping
description: Map product features to test coverage for gap identification and risk analysis
user-invocable: true
---

# Skill: Coverage Mapping

## Overview

This skill maps product features to test coverage:
- Feature coverage analysis
- Risk-based coverage mapping
- Gap identification
- Coverage recommendations

## Purpose

Understand what features are tested and at what level. Use this skill:
- For release planning
- During risk assessment
- To identify testing gaps
- For coverage optimization

## Execution Flow

```
1. INVENTORY product features
2. ANALYZE test coverage
3. MAP features to tests
4. CALCULATE coverage levels
5. IDENTIFY gaps
6. ASSESS risk
7. GENERATE recommendations
```

## Input Parameters

| Parameter | Type | Description | Required |
|-----------|------|-------------|----------|
| featurePath | string | Path to feature list | No |
| coveragePath | string | Path to coverage report | No |
| riskModel | string | Risk model to use | No |

## Coverage Levels

| Level | Description | Criteria |
|-------|-------------|----------|
| **Full** | Complete coverage | All paths, all cases |
| **High** | Good coverage | Main paths + edge cases |
| **Medium** | Basic coverage | Happy path only |
| **Low** | Minimal coverage | Few tests |
| **None** | No coverage | No tests |

## Output Format

```markdown
# Coverage Mapping Report

**Product:** MyApplication v2.1.0
**Features:** 42
**Generated:** [timestamp]

## Coverage Summary

| Coverage Level | Features | Percentage |
|----------------|----------|------------|
| Full | 12 | 29% |
| High | 15 | 36% |
| Medium | 8 | 19% |
| Low | 4 | 9% |
| None | 3 | 7% |

## Coverage by Category

| Category | Full | High | Medium | Low | None |
|----------|------|------|--------|-----|------|
| Authentication | 4 | 1 | - | - | - |
| User Management | 2 | 3 | 1 | - | - |
| Payments | 3 | 2 | - | - | - |
| Reporting | 1 | 4 | 2 | 1 | - |
| Admin | 2 | 3 | 3 | 2 | 1 |
| Integration | - | 2 | 2 | 1 | 2 |

## Risk Assessment

### High Risk (Low/No Coverage)

| Feature | Category | Risk Score | Tests | Recommendation |
|---------|----------|------------|-------|----------------|
| Bulk Import | User Mgmt | 85 | 0 | Add 5+ tests |
| Audit Log | Admin | 78 | 1 | Add 3+ tests |
| Webhook Delivery | Integration | 72 | 0 | Add 4+ tests |

### Medium Risk (Medium Coverage)

| Feature | Category | Risk Score | Tests | Recommendation |
|---------|----------|------------|-------|----------------|
| Report Export | Reporting | 45 | 3 | Add edge cases |
| User Roles | Admin | 42 | 4 | Add permission tests |
| Email Templates | Integration | 38 | 2 | Add rendering tests |

## Feature Coverage Details

### Authentication (100% Coverage)

| Feature | Coverage | Tests | Lines |
|---------|----------|-------|-------|
| Email Login | Full | 8 | 95% |
| SSO Login | Full | 6 | 92% |
| Password Reset | High | 5 | 88% |
| Session Management | Full | 7 | 94% |
| MFA | High | 4 | 85% |

### Payments (92% Coverage)

| Feature | Coverage | Tests | Lines |
|---------|----------|-------|-------|
| Credit Card | Full | 12 | 96% |
| PayPal | High | 6 | 88% |
| Refunds | High | 5 | 85% |
| Invoices | High | 4 | 82% |
| Subscriptions | Full | 8 | 92% |

### Integration (58% Coverage)

| Feature | Coverage | Tests | Lines |
|---------|----------|-------|-------|
| API v1 | Full | 10 | 94% |
| API v2 | High | 8 | 88% |
| Webhooks | None | 0 | 0% |
| Email Service | Medium | 3 | 65% |
| SMS Service | Low | 1 | 30% |

## Gap Analysis

### Critical Gaps

1. **Webhook Delivery (0% coverage)**
   - Risk: High
   - Business Impact: Customer notifications fail silently
   - Recommended Tests: 5
   - Estimated Effort: 4 hours

2. **Bulk Import (0% coverage)**
   - Risk: High
   - Business Impact: Data corruption in production
   - Recommended Tests: 6
   - Estimated Effort: 6 hours

### Recommended Test Additions

| Priority | Feature | Tests Needed | Effort |
|----------|---------|--------------|--------|
| P1 | Webhook Delivery | 5 | 4h |
| P1 | Bulk Import | 6 | 6h |
| P2 | Audit Log | 4 | 3h |
| P2 | SMS Service | 3 | 2h |
| P3 | Report Export | 2 | 1h |

## Coverage Trend

| Week | Full | High | Medium | Low | None |
|------|------|------|--------|-----|------|
| W1 | 25% | 30% | 20% | 15% | 10% |
| W2 | 27% | 32% | 20% | 14% | 7% |
| W3 | 28% | 34% | 19% | 12% | 7% |
| W4 | 29% | 36% | 19% | 9% | 7% |

## Coverage Recommendations

1. **Immediate:** Add tests for webhook delivery (0% → 80%)
2. **Immediate:** Add tests for bulk import (0% → 80%)
3. **This Week:** Improve audit log coverage (20% → 70%)
4. **This Month:** Improve integration coverage (58% → 80%)
```

## Example Usage

### Example 1: Full Coverage Map

```
USER: /coverage-mapping

SKILL OUTPUT:
# Coverage Mapping Report

## Summary
- 42 features analyzed
- 65% have high/full coverage
- 3 critical gaps identified

## Top Recommendations
1. Add webhook tests (Risk: 85)
2. Add bulk import tests (Risk: 78)
3. Add audit log tests (Risk: 72)
```

### Example 2: Risk-Based Analysis

```
USER: /coverage-mapping --risk

SKILL OUTPUT:
# Risk-Based Coverage Analysis

## Risk Distribution

| Risk Level | Features | Action |
|------------|----------|--------|
| Critical | 3 | Immediate testing |
| High | 5 | Priority testing |
| Medium | 8 | Scheduled testing |
| Low | 26 | Maintain coverage |

## Critical Risk Features

1. **Webhook Delivery** - 0% coverage
   - Impact: Customer notifications
   - Likelihood: High failure rate
   - Risk Score: 85/100

2. **Bulk Import** - 0% coverage
   - Impact: Data integrity
   - Likelihood: Medium failure rate
   - Risk Score: 78/100
```

### Example 3: Category Focus

```
USER: /coverage-mapping --category Integration

SKILL OUTPUT:
# Coverage Map: Integration Category

## Features (5)

| Feature | Coverage | Tests | Gap |
|---------|----------|-------|-----|
| API v1 | Full | 10 | - |
| API v2 | High | 8 | - |
| Webhooks | None | 0 | Critical |
| Email | Medium | 3 | Warning |
| SMS | Low | 1 | Warning |

## Category Coverage: 58%

**Target:** 80%
**Gap:** 22%
**Tests Needed:** ~15
```

## Feature Coverage Template

```yaml
feature:
  id: FEAT-001
  name: User Authentication
  category: Authentication
  risk: High
  coverage:
    level: Full
    percentage: 95%
    tests: 8
    lastUpdated: 2026-02-17
  mapping:
    requirements:
      - REQ-001
      - REQ-002
    testCases:
      - TC-001
      - TC-002
      - TC-003
    codePaths:
      - src/auth/login.ts
      - src/auth/session.ts
```

## Risk Model

```typescript
interface RiskModel {
    factors: {
        businessImpact: number;    // 1-10
        failureLikelihood: number; // 1-10
        codeComplexity: number;    // 1-10
        usageFrequency: number;    // 1-10
    };
    calculate(): number; // Returns risk score 0-100
}

// Risk = (Impact × Likelihood × Complexity × Frequency) / 40 × 100
```

## Configuration

```json
{
    "coverageMapping": {
        "featuresPath": "docs/features.yaml",
        "coverageReportPath": "coverage/coverage-final.json",
        "riskModel": "default",
        "thresholds": {
            "full": 90,
            "high": 75,
            "medium": 50,
            "low": 25
        },
        "riskWeights": {
            "businessImpact": 0.4,
            "failureLikelihood": 0.3,
            "codeComplexity": 0.2,
            "usageFrequency": 0.1
        }
    }
}
```

## Best Practices

1. **Prioritize by Risk** - Test high-risk features first
2. **Track Trends** - Monitor coverage over time
3. **Set Targets** - Define coverage goals by category
4. **Review Gaps** - Regularly review uncovered features
5. **Automate** - Run coverage mapping in CI/CD

## Integration

This skill integrates with:
- `coverage-analysis`: Line/branch coverage data
- `spec-traceability`: Requirement coverage
- Risk management tools
- Release planning tools
