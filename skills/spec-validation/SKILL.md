---
name: spec-validation
description: Validate specifications against requirements for completeness and consistency
user-invocable: true
---

# Skill: Spec Validation

## Overview

This skill validates specification quality:
- Completeness checks
- Consistency verification
- Ambiguity detection
- Requirement alignment
- Quality scoring

## Purpose

Ensure specifications are complete and correct. Use this skill:
- Before implementation
- During design review
- For spec quality audits
- When requirements change

## Execution Flow

```
1. LOAD requirement specifications
2. LOAD test specifications
3. VALIDATE structure and format
4. CHECK completeness
5. VERIFY consistency
6. DETECT ambiguities
7. SCORE quality
8. REPORT findings
```

## Input Parameters

| Parameter | Type | Description | Required |
|-----------|------|-------------|----------|
| specPath | string | Path to spec file | Yes |
| requirementsPath | string | Path to requirements | No |
| strict | boolean | Strict validation mode | No |
| fix | boolean | Auto-fix issues | No |

## Validation Rules

### 1. Completeness Checks

| Rule | Description | Severity |
|------|-------------|----------|
| SPEC-001 | All requirements have test cases | Error |
| SPEC-002 | All test cases have descriptions | Warning |
| SPEC-003 | All test cases have expected results | Error |
| SPEC-004 | All test cases have preconditions | Warning |
| SPEC-005 | All requirements have acceptance criteria | Error |

### 2. Consistency Checks

| Rule | Description | Severity |
|------|-------------|----------|
| SPEC-010 | ID format is consistent | Warning |
| SPEC-011 | Priority values are valid | Error |
| SPEC-012 | Status values are valid | Error |
| SPEC-013 | Cross-references are valid | Error |
| SPEC-014 | No duplicate IDs | Error |

### 3. Quality Checks

| Rule | Description | Severity |
|------|-------------|----------|
| SPEC-020 | Description is clear and specific | Info |
| SPEC-021 | No ambiguous terms used | Warning |
| SPEC-022 | Test cases are testable | Error |
| SPEC-023 | Acceptance criteria are measurable | Warning |
| SPEC-024 | No missing dependencies | Warning |

## Output Format

```markdown
# Specification Validation Report

**Spec:** specs/auth-spec.md
**Requirements:** docs/requirements.md
**Validated:** [timestamp]
**Duration:** 2.3s

## Validation Summary

| Category | Passed | Failed | Warnings |
|----------|--------|--------|----------|
| Completeness | 18 | 2 | 3 |
| Consistency | 12 | 0 | 1 |
| Quality | 15 | 1 | 4 |
| **Total** | **45** | **3** | **8** |

## Quality Score: 85/100

| Dimension | Score | Weight | Weighted |
|-----------|-------|--------|----------|
| Completeness | 90% | 40% | 36 |
| Consistency | 100% | 30% | 30 |
| Clarity | 75% | 20% | 15 |
| Testability | 80% | 10% | 8 |
| **Total** | | | **89/100** |

## Errors (3)

### ERROR-001: Missing Test Case
**Rule:** SPEC-001
**Location:** REQ-003 (Session Timeout)
**Issue:** No test cases linked to requirement

**Fix:**
```markdown
## REQ-003: Session Timeout
**Test Cases:** TC-003-01, TC-003-02
```

### ERROR-002: Missing Expected Result
**Rule:** SPEC-003
**Location:** TC-005 (Password Reset)
**Issue:** Test case lacks expected result

**Fix:**
```markdown
### TC-005: Password Reset Email
**Expected:** Reset email sent within 60 seconds
```

### ERROR-003: Untestable Requirement
**Rule:** SPEC-022
**Location:** REQ-008 (Good UX)
**Issue:** "Good user experience" is not testable

**Fix:**
```markdown
## REQ-008: User Experience
**Acceptance Criteria:**
- Page load < 2 seconds
- Task completion < 3 clicks
- Error rate < 1%
```

## Warnings (8)

### WARN-001: Ambiguous Term
**Rule:** SPEC-021
**Location:** REQ-002
**Issue:** "Fast response" is ambiguous

**Suggestion:** Use specific metric like "< 200ms"

### WARN-002: Missing Preconditions
**Rule:** SPEC-004
**Location:** TC-010
**Issue:** Test case missing preconditions

### WARN-003: Low Specificity
**Rule:** SPEC-020
**Location:** REQ-005
**Issue:** Description could be more specific

## Info (5)

### INFO-001: Style Suggestion
**Location:** REQ-001
**Message:** Consider adding examples to clarify

### INFO-002: Enhancement
**Location:** TC-003
**Message:** Could add edge case tests

## Pass Summary

✅ All IDs are unique
✅ All IDs follow format standard
✅ All statuses are valid
✅ All priorities are valid
✅ All cross-references exist
✅ 18/20 requirements have test cases

## Recommendations

1. **Critical:** Fix 3 errors to pass validation
2. **Important:** Address 8 warnings for quality
3. **Optional:** Review 5 info items for improvement

## Auto-Fix Available

Run with `--fix` to automatically:
- Add missing ID prefixes
- Format inconsistent values
- Add empty sections with placeholders
```

## Example Usage

### Example 1: Validate Single Spec

```
USER: /spec-validation specs/auth-spec.md

SKILL OUTPUT:
# Spec Validation: auth-spec.md

## Summary
- Errors: 2
- Warnings: 5
- Score: 85/100

❌ **FAILED** - Fix 2 errors to pass validation
```

### Example 2: Strict Mode

```
USER: /spec-validation specs/auth-spec.md --strict

SKILL OUTPUT:
# Spec Validation (Strict Mode)

## Summary
- Errors: 2
- Warnings: 5 → Treated as errors
- Score: 85/100

❌ **FAILED** - 7 issues found (strict mode)
```

### Example 3: Auto-Fix

```
USER: /spec-validation specs/auth-spec.md --fix

SKILL OUTPUT:
# Spec Validation with Auto-Fix

## Fixes Applied

| Fix | Location | Change |
|-----|----------|--------|
| Format | REQ-001 | Added ID prefix |
| Format | TC-003 | Standardized status |
| Template | TC-005 | Added missing sections |

## Remaining Issues

| Type | Count |
|------|-------|
| Errors | 1 (manual fix needed) |
| Warnings | 3 |

✅ **5 issues auto-fixed**
⚠️ **4 issues require manual review**
```

### Example 4: Compare with Requirements

```
USER: /spec-validation specs/auth-spec.md --requirements docs/requirements.md

SKILL OUTPUT:
# Spec vs Requirements Validation

## Coverage Check

| Check | Status |
|-------|--------|
| All requirements covered | ❌ |
| All specs have requirements | ✅ |
| IDs match | ✅ |

## Missing Coverage

- REQ-003: Session Timeout (no spec)
- REQ-010: Bulk Import (no spec)

## Extra Specs (No Requirement)

- SPEC-EXTRA-001: Helper functions
- Recommendation: Link to requirement or remove
```

## Validation Templates

### Requirement Template

```markdown
## REQ-XXX: [Title]

**Priority:** P1/P2/P3/P4
**Status:** Draft/Approved/Implemented
**Category:** [Category Name]

### Description
[Clear, specific description]

### Acceptance Criteria
- [ ] Criterion 1 (measurable)
- [ ] Criterion 2 (measurable)
- [ ] Criterion 3 (measurable)

### Test Cases
- TC-XXX-01: [Test description]
- TC-XXX-02: [Test description]

### Dependencies
- REQ-YYY: [Dependency description]
```

### Test Case Template

```markdown
### TC-XXX: [Test Title]

**Requirement:** REQ-XXX
**Type:** Unit/Integration/E2E
**Priority:** High/Medium/Low

**Preconditions:**
- Precondition 1
- Precondition 2

**Steps:**
1. Step 1
2. Step 2
3. Step 3

**Expected Result:**
[Specific, measurable expected outcome]

**Data:**
| Field | Value |
|-------|-------|
| Input | test@example.com |
```

## Configuration

```json
{
    "specValidation": {
        "rules": {
            "completeness": ["SPEC-001", "SPEC-002", "SPEC-003"],
            "consistency": ["SPEC-010", "SPEC-011", "SPEC-012"],
            "quality": ["SPEC-020", "SPEC-021", "SPEC-022"]
        },
        "idPatterns": {
            "requirement": "REQ-\\d{3}",
            "testCase": "TC-\\d{3}-\\d{2}",
            "spec": "SPEC-\\d{3}"
        },
        "validValues": {
            "priority": ["P1", "P2", "P3", "P4"],
            "status": ["Draft", "Approved", "Implemented", "Deprecated"],
            "type": ["Unit", "Integration", "E2E", "Manual"]
        },
        "strictMode": false,
        "autoFix": false
    }
}
```

## Best Practices

1. **Validate Early** - Check specs before implementation
2. **Use Templates** - Standardize spec format
3. **Fix Immediately** - Address errors right away
4. **Review Warnings** - Don't ignore warnings
5. **Automate** - Run validation in CI/CD

## Integration

This skill integrates with:
- `spec-traceability`: Combined coverage validation
- `coverage-mapping`: Map specs to coverage
- Jira/Azure DevOps: Import validation rules
- CI/CD: Block PRs on validation failure
