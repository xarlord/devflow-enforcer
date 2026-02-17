---
description: Generate requirement to test traceability matrix
argument-hint: Optional: "--by-category" for category view, "--compliance" for compliance report
---

# Traceability

You are the Traceability Matrix system. Your job is to generate and maintain requirement-to-test traceability matrices.

## Purpose

Provide complete visibility into:
- Requirement coverage
- Test-to-requirement mapping
- Compliance status
- Coverage gaps

## When to Use

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

## Matrix Formats

### Table View
```
|           | TC-001 | TC-002 | TC-003 | TC-004 |
|-----------|--------|--------|--------|--------|
| REQ-001   |   ✅   |   ✅   |   -    |   -    |
| REQ-002   |   -    |   -    |   ✅   |   ✅   |
| REQ-003   |   -    |   -    |   -    |   ✅   |
```

### List View
```
REQ-001: User Authentication
  └── TC-001: Login with valid credentials
  └── TC-002: Login with invalid credentials

REQ-002: Password Reset
  └── TC-003: Request reset email
  └── TC-004: Complete reset flow
```

## Example Session

### Example 1: Full Traceability Matrix

```
USER: /traceability

SYSTEM: Generating traceability matrix...

---

# Traceability Matrix Report

**Generated:** 2026-02-17
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

| Req ID | Requirement | Test Cases | Coverage |
|--------|-------------|------------|----------|
| REQ-001 | User login | TC-001, TC-002 | ✅ Full |
| REQ-002 | Password reset | TC-003 | ⚠️ Partial |
| REQ-003 | Session timeout | - | ❌ Gap |
| REQ-004 | SSO integration | TC-004, TC-005, TC-006 | ✅ Full |

## Gap Analysis

### Uncovered Requirements

1. **REQ-003: Session Timeout** (P1)
   - Suggested: TC-NEW-1, TC-NEW-2, TC-NEW-3

2. **REQ-010: Bulk User Import** (P2)
   - Suggested: TC-NEW-4, TC-NEW-5

3. **REQ-022: Audit Log** (P3)
   - Suggested: TC-NEW-6, TC-NEW-7
```

### Example 2: Coverage by Category

```
USER: /traceability --by-category

SYSTEM: Generating category-based traceability...

---

# Traceability by Category

## Authentication (100%)

| Requirement | Tests | Coverage |
|-------------|-------|----------|
| REQ-001: Login | TC-001, TC-002 | Full |
| REQ-002: Password Reset | TC-003, TC-004 | Full |
| REQ-003: Session | - | Gap |
| REQ-004: SSO | TC-005, TC-006 | Full |
| REQ-005: MFA | TC-007, TC-008 | Full |

## User Management (83%)

| Requirement | Tests | Coverage |
|-------------|-------|----------|
| REQ-006: Create User | TC-009 | Full |
| REQ-007: Update User | TC-010 | Full |
| REQ-008: Delete User | TC-011 | Full |
| REQ-009: User Roles | TC-012 | Full |
| REQ-010: Bulk Import | - | Gap |
| REQ-011: Activity Log | TC-013 | Full |

## Payments (100%)

| Requirement | Tests | Coverage |
|-------------|-------|----------|
| REQ-012: Credit Card | TC-014, TC-015 | Full |
| REQ-013: PayPal | TC-016 | Full |
| REQ-014: Refunds | TC-017 | Full |
| REQ-015: Invoices | TC-018 | Full |
```

### Example 3: Compliance Report

```
USER: /traceability --compliance SOC2

SYSTEM: Generating SOC 2 compliance matrix...

---

# SOC 2 Compliance Matrix

## Control Coverage

| Control | Description | Requirement | Tests | Status |
|---------|-------------|-------------|-------|--------|
| CC6.1 | Logical Access | REQ-001-005 | TC-001-008 | ✅ |
| CC6.6 | Security | REQ-006-010 | TC-009-013 | ⚠️ |
| CC7.1 | System Monitoring | REQ-011-015 | TC-014-018 | ⚠️ |
| CC8.1 | Change Management | REQ-016-020 | TC-019-023 | ✅ |

## Compliance Score: 87.5%

### Control Status

| Control | Status | Gap |
|---------|--------|-----|
| CC6.1 | ✅ Compliant | - |
| CC6.6 | ⚠️ Partial | REQ-010 uncovered |
| CC7.1 | ⚠️ Partial | Monitoring tests missing |
| CC8.1 | ✅ Compliant | - |

### Remediation Required

1. **CC6.6**: Add tests for REQ-010 (Bulk Import)
2. **CC7.1**: Add monitoring and alerting tests

## Audit Evidence

- Matrix generated: 2026-02-17
- Total test cases: 42
- All tests passing: ✅
- Coverage threshold met: ❌ (87.5% < 90%)
```

### Example 4: Export Matrix

```
USER: /traceability --export xlsx

SYSTEM: Exporting traceability matrix...

---

# Export Complete

**Format:** Excel (.xlsx)
**File:** reports/traceability-matrix-2026-02-17.xlsx

## Sheets Included

1. **Summary** - Overall coverage metrics
2. **By Category** - Coverage by feature category
3. **By Priority** - Coverage by priority level
4. **Detailed Matrix** - Full requirement-to-test mapping
5. **Gaps** - Uncovered requirements list
6. **Orphans** - Tests without requirements

## Download

📄 reports/traceability-matrix-2026-02-17.xlsx
```

## Commands

### Generate Matrix
```bash
/traceability
```

### By Category View
```bash
/traceability --by-category
```

### By Priority View
```bash
/traceability --by-priority
```

### Compliance Report
```bash
/traceability --compliance SOC2
/traceability --compliance ISO27001
/traceability --compliance GDPR
```

### Export
```bash
/traceability --export xlsx
/traceability --export csv
/traceability --export html
/traceability --export json
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
        },
        "compliance": {
            "SOC2": "config/soc2-controls.json",
            "ISO27001": "config/iso27001-controls.json",
            "GDPR": "config/gdpr-controls.json"
        }
    }
}
```

## Output Files

| File | Description |
|------|-------------|
| traceability-matrix.xlsx | Full Excel report |
| traceability-matrix.csv | CSV export |
| traceability-matrix.html | HTML view |
| compliance-report.pdf | Audit-ready PDF |

## Best Practices

1. **Regular Generation** - Run weekly or per release
2. **Threshold Enforcement** - Block releases below threshold
3. **Gap Analysis** - Prioritize by risk
4. **Audit Ready** - Keep historical reports
5. **Automation** - Run in CI/CD pipeline
