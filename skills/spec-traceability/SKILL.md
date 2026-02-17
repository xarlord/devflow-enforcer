---
name: spec-traceability
description: Generate requirement to test traceability matrix for complete coverage visibility
user-invocable: true
---

# Skill: Spec Traceability

## Overview

This skill generates traceability matrices:
- Map requirements to test cases
- Identify coverage gaps
- Calculate coverage percentages
- Generate compliance reports

## Purpose

Ensure complete test coverage of requirements. Use this skill:
- Before releases
- During audits
- For compliance validation
- When requirements change

## Execution Flow

```
1. PARSE requirement documents
2. PARSE test specifications
3. EXTRACT requirement IDs
4. MAP tests to requirements
5. CALCULATE coverage metrics
6. IDENTIFY gaps
7. GENERATE matrix report
```

## Input Parameters

| Parameter | Type | Description | Required |
|-----------|------|-------------|----------|
| requirementsPath | string | Path to requirements doc | No |
| testsPath | string | Path to test files | No |
| threshold | number | Minimum coverage % | No |
| format | string | matrix, list, graph | No |

## Output Format

```markdown
# Traceability Matrix Report

**Generated:** [timestamp]
**Source:** docs/requirements.md
**Tests:** tests/**/*.spec.ts

## Summary

| Metric | Value |
|--------|-------|
| Total Requirements | 24 |
| Covered Requirements | 21 |
| Coverage Percentage | 87.5% |
| Gaps | 3 |
| Orphan Tests | 2 |

## Coverage by Priority

| Priority | Total | Covered | Coverage |
|----------|-------|---------|----------|
| P1 - Critical | 8 | 8 | 100% |
| P2 - High | 6 | 5 | 83% |
| P3 - Medium | 6 | 5 | 83% |
| P4 - Low | 4 | 3 | 75% |

## Detailed Matrix

### Requirements → Tests

| Req ID | Requirement | Test Cases | Coverage |
|--------|-------------|------------|----------|
| REQ-001 | User login | TC-001, TC-002 | ✅ Full |
| REQ-002 | Password reset | TC-003 | ⚠️ Partial |
| REQ-003 | Session timeout | - | ❌ Gap |
| REQ-004 | SSO integration | TC-004, TC-005, TC-006 | ✅ Full |

### Tests → Requirements

| Test ID | Test Description | Requirements |
|---------|------------------|--------------|
| TC-001 | Login with valid credentials | REQ-001 |
| TC-002 | Login with invalid credentials | REQ-001 |
| TC-003 | Password reset email | REQ-002 |
| TC-004 | SSO redirect | REQ-004 |

## Gap Analysis

### Uncovered Requirements

1. **REQ-003: Session Timeout**
   - Priority: P1 - Critical
   - Risk: High
   - Suggested Tests:
     - TC-NEW-1: Verify 30-minute timeout
     - TC-NEW-2: Verify session refresh
     - TC-NEW-3: Verify timeout warning

2. **REQ-010: Bulk User Import**
   - Priority: P2 - High
   - Risk: Medium
   - Suggested Tests:
     - TC-NEW-4: CSV import
     - TC-NEW-5: Error handling

### Orphan Tests (No Requirements)

| Test ID | Description | Recommendation |
|---------|-------------|----------------|
| TC-099 | Helper utility | Remove or document |
| TC-100 | Edge case | Link to requirement |

## Compliance Status

| Standard | Requirement | Status |
|----------|-------------|--------|
| ISO 27001 | A.14.2.9 | ⚠️ Partial |
| SOC 2 | CC8.1 | ✅ Compliant |
| GDPR | Art. 32 | ⚠️ Partial |

## Recommendations

1. **Critical:** Add tests for REQ-003 (Session Timeout)
2. **High:** Complete coverage for REQ-010 (Bulk Import)
3. **Medium:** Link or remove orphan tests
4. **Documentation:** Update spec comments
```

## Example Usage

### Example 1: Generate Full Matrix

```
USER: /spec-traceability

SKILL OUTPUT:
# Traceability Matrix Report

## Summary
- Total Requirements: 24
- Covered: 21 (87.5%)
- Gaps: 3

## Critical Gaps
1. REQ-003: Session Timeout (P1)
2. REQ-010: Bulk Import (P2)
3. REQ-022: Audit Log (P3)

**Action Required:** Add 8 tests to reach 100% coverage
```

### Example 2: Coverage by Category

```
USER: /spec-traceability --by-category

SKILL OUTPUT:
# Coverage by Category

| Category | Total | Covered | % |
|----------|-------|---------|---|
| Authentication | 5 | 5 | 100% |
| User Management | 6 | 5 | 83% |
| Payments | 4 | 4 | 100% |
| Reporting | 5 | 4 | 80% |
| Admin | 4 | 3 | 75% |

**Lowest Coverage:** Admin (75%)
**Recommendation:** Focus testing on Admin features
```

### Example 3: Compliance Report

```
USER: /spec-traceability --compliance SOC2

SKILL OUTPUT:
# SOC 2 Compliance Report

## Control Coverage

| Control | Requirement | Tests | Status |
|---------|-------------|-------|--------|
| CC6.1 | Access Control | TC-001-005 | ✅ |
| CC6.6 | Security | TC-010-015 | ✅ |
| CC7.1 | Monitoring | TC-020-025 | ⚠️ |
| CC8.1 | Change Mgmt | TC-030-035 | ✅ |

## Compliance Status: 87.5%

⚠️ **Warning:** CC7.1 Monitoring incomplete
- Missing: Log retention tests
- Missing: Alert tests

**Remediation:** Add TC-NEW-6, TC-NEW-7 for CC7.1
```

## Configuration

```json
{
    "traceability": {
        "requirements": {
            "path": "docs/requirements.md",
            "idPattern": "REQ-\\d+",
            "priorityField": "priority"
        },
        "tests": {
            "path": "tests/**/*.spec.ts",
            "idPattern": "TC-\\d+",
            "requirementTag": "@requirement"
        },
        "thresholds": {
            "overall": 90,
            "byPriority": {
                "P1": 100,
                "P2": 90,
                "P3": 80,
                "P4": 70
            }
        }
    }
}
```

## Annotation Format

### Requirements Document

```markdown
## REQ-001: User Authentication

**Priority:** P1 - Critical
**Category:** Authentication
**Status:** Approved

Users must be able to authenticate using email and password.

### Acceptance Criteria
- Valid credentials grant access
- Invalid credentials show error
- Account locks after 5 failures
```

### Test File

```typescript
/**
 * @requirement REQ-001
 * @coverage full
 */
describe('REQ-001: User Authentication', () => {
    /**
     * @test-case TC-001
     * @criterion Valid credentials grant access
     */
    it('should authenticate with valid credentials', () => {
        // Test implementation
    });

    /**
     * @test-case TC-002
     * @criterion Invalid credentials show error
     */
    it('should show error for invalid credentials', () => {
        // Test implementation
    });
});
```

## Matrix Formats

### Table Format
| Req | TC-001 | TC-002 | TC-003 |
|-----|--------|--------|--------|
| REQ-001 | ✅ | ✅ | - |
| REQ-002 | - | - | ✅ |

### Graph Format
```
REQ-001 ──┬── TC-001
          ├── TC-002
          └── TC-003

REQ-002 ──┬── TC-004
          └── TC-005
```

### List Format
- REQ-001 → [TC-001, TC-002, TC-003]
- REQ-002 → [TC-004, TC-005]

## Export Formats

```bash
# Export to Excel
/spec-traceability --export xlsx

# Export to CSV
/spec-traceability --export csv

# Export to HTML
/spec-traceability --export html

# Export to JSON
/spec-traceability --export json
```

## Best Practices

1. **Consistent IDs** - Use standard ID patterns
2. **Bidirectional Links** - Tag tests AND requirements
3. **Regular Updates** - Regenerate matrix on changes
4. **Gap Prioritization** - Focus on high-risk gaps
5. **Automation** - Run in CI/CD pipelines

## Integration

This skill integrates with:
- `coverage-analysis`: Combined test coverage
- `spec-validation`: Validate spec completeness
- Jira/Azure DevOps: Import requirements
- TestRail/Zephyr: Export test mappings
