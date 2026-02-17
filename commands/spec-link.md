---
description: Link test specifications to product requirements
argument-hint: Optional: requirement ID to analyze or "--validate" for validation mode
---

# Spec Link

You are the Specification Linking system. Your job is to create and manage links between test specifications and product requirements.

## Purpose

Ensure complete traceability between:
- Product requirements
- Test specifications
- Test cases
- Code implementations

## When to Use

- After requirements are documented
- When creating test specifications
- Before releases for coverage validation
- When requirements change

## Execution Flow

```
1. PARSE requirement documents
2. PARSE test specifications
3. EXTRACT requirement IDs
4. MAP tests to requirements
5. CALCULATE coverage
6. IDENTIFY gaps
7. GENERATE traceability matrix
```

## Example Session

### Example 1: Generate Traceability Matrix

```
USER: /spec-link

SYSTEM: Analyzing specification coverage...

**Source:** docs/requirements.md
**Tests:** tests/**/*.spec.ts

---

# Specification Traceability Matrix

**Generated:** 2026-02-17
**Total Requirements:** 24
**Covered:** 21 (87.5%)
**Gaps:** 3

## Coverage by Category

| Category | Total | Covered | Coverage |
|----------|-------|---------|----------|
| Authentication | 5 | 5 | 100% |
| User Management | 6 | 5 | 83% |
| Payments | 4 | 4 | 100% |
| Reporting | 5 | 4 | 80% |
| Admin | 4 | 3 | 75% |

## Requirement Coverage

### Authentication (100%)

| ID | Requirement | Test Case | Status |
|----|-------------|-----------|--------|
| REQ-001 | User can login with email | TC-001 | ✅ Linked |
| REQ-002 | User can login with SSO | TC-002 | ✅ Linked |
| REQ-003 | Session expires after 30min | TC-003 | ✅ Linked |
| REQ-004 | Failed login shows error | TC-004 | ✅ Linked |
| REQ-005 | Password reset works | TC-005 | ✅ Linked |

## Gaps Identified

### 1. REQ-010: Bulk User Import
**Status:** ❌ No test coverage
**Priority:** High
**Suggested Tests:**
- TC-NEW-1: Valid CSV import
- TC-NEW-2: Invalid CSV format handling
- TC-NEW-3: Duplicate user handling
```

### Example 2: Validate Spec Coverage

```
USER: /spec-link --validate

SYSTEM: Validating specification coverage...

---

# Spec Validation Report

## Validation Results

| Check | Status | Details |
|-------|--------|---------|
| All requirements have IDs | ✅ Pass | 24/24 have IDs |
| All tests link to requirements | ⚠️ Warning | 2 orphan tests |
| Coverage threshold met | ❌ Fail | 87.5% < 90% target |
| No stale requirements | ✅ Pass | All requirements current |

## Issues Found

### Coverage Below Threshold
- **Current:** 87.5%
- **Target:** 90%
- **Gap:** 2.5% (need 1 more requirement covered)

### Orphan Tests
- `TC-099`: No linked requirement
- `TC-100`: No linked requirement

## Recommendations

1. Link or remove orphan tests
2. Add tests for REQ-010 to meet threshold
```

### Example 3: Impact Analysis

```
USER: /spec-link --impact REQ-003

SYSTEM: Analyzing impact of REQ-003 changes...

---

# Impact Analysis: REQ-003

**Requirement:** Session expires after 30min

## Linked Tests

| Test ID | Description | Impact |
|---------|-------------|--------|
| TC-003 | Session timeout verification | ⚠️ May need update |
| TC-045 | Auto-logout flow | ⚠️ May need update |
| TC-078 | Token refresh | ⚠️ May need update |

## Affected Code

| File | Lines | Type |
|------|-------|------|
| src/auth/session.ts | 45-67 | Core logic |
| src/middleware/auth.ts | 23-34 | Token validation |
| src/utils/token.ts | 12-18 | Token refresh |

## Recommendations

If changing session duration:
1. Update TC-003 expected timeout value
2. Verify TC-045 logout timing
3. Update TC-078 refresh logic tests
```

### Example 4: Link Specific Test

```
USER: /spec-link TC-105 REQ-010

SYSTEM: Creating link...

---

# Link Created

**Test Case:** TC-105 (Bulk user import validation)
**Requirement:** REQ-010 (Bulk user import)

## Link Details

| Property | Value |
|----------|-------|
| Test ID | TC-105 |
| Requirement ID | REQ-010 |
| Coverage | Full |
| Created | 2026-02-17 |
| Status | Active |

## Updated Coverage

- REQ-010: ❌ → ✅ (now covered)
- Overall: 87.5% → 91.7%
- Threshold (90%): ✅ Met
```

## Annotation Format

### In Code

```typescript
/**
 * @requirement REQ-001
 * @test-case TC-001
 * @coverage full
 */
describe('Authentication', () => {
    it('should login with valid credentials', () => {
        // Test implementation
    });
});
```

### In Requirements

```markdown
## REQ-001: User Authentication

**Test Cases:** TC-001, TC-002, TC-003
**Coverage:** Full
**Last Validated:** 2026-02-17
```

## Commands

### Generate Matrix
```bash
/spec-link
```

### Validate Coverage
```bash
/spec-link --validate
```

### Impact Analysis
```bash
/spec-link --impact REQ-001
```

### Create Link
```bash
/spec-link <test-id> <requirement-id>
```

### Export Matrix
```bash
/spec-link --export xlsx
/spec-link --export csv
/spec-link --export html
```

## Configuration

```json
{
    "specLinking": {
        "requirementsPath": "docs/requirements.md",
        "testsPath": "tests/**/*.spec.ts",
        "coverageThreshold": 90,
        "idPattern": "REQ-\\d+",
        "testCasePattern": "TC-\\d+"
    }
}
```

## Best Practices

1. **Unique IDs** - Use consistent requirement and test IDs
2. **Bidirectional Links** - Link from test to requirement and vice versa
3. **Regular Validation** - Run traceability checks in CI/CD
4. **Gap Prioritization** - Focus on high-risk uncovered requirements
5. **Impact Analysis** - Run before requirement changes

## Output Files

- **Matrix:** reports/traceability-matrix.xlsx
- **Validation:** reports/spec-validation.json
- **Impact:** reports/impact-analysis.md
