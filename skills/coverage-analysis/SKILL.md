---
name: coverage-analysis
description: Analyze test coverage in depth. Identifies uncovered lines, branches, and functions with detailed reporting.
user-invocable: true
---

# Skill: Coverage Analysis

## Overview

This skill performs deep coverage analysis:
- Line coverage
- Branch coverage
- Function coverage
- Statement coverage
- Coverage trends
- Uncovered code identification

## Purpose

Ensure comprehensive test coverage. Use this skill:
- During development
- Before code review
- For coverage reports
- To identify testing gaps

## Execution Flow

```
1. DETECT test framework
2. RUN tests with coverage
3. PARSE coverage data
4. ANALYZE coverage patterns
5. IDENTIFY gaps
6. GENERATE detailed report
```

## Input Parameters

| Parameter | Type | Description | Required |
|-----------|------|-------------|----------|
| threshold | number | Minimum coverage % | No |
| type | string | line, branch, function, all | No |
| diff | boolean | Compare with base branch | No |

## Coverage Tools

| Language | Tool | Output |
|----------|------|--------|
| JavaScript | Jest, Vitest | lcov, json |
| Python | coverage.py | xml, html |
| Java | JaCoCo | xml, html |
| Go | go test -cover | text, html |
| .NET | coverlet | json, opencover |

## Configuration

### Jest
```javascript
// jest.config.js
module.exports = {
    collectCoverage: true,
    coverageDirectory: 'coverage',
    coverageReporters: ['text', 'lcov', 'html', 'json-summary'],
    coverageThreshold: {
        global: {
            branches: 80,
            functions: 80,
            lines: 80,
            statements: 80,
        },
    },
    collectCoverageFrom: [
        'src/**/*.{ts,tsx}',
        '!src/**/*.spec.{ts,tsx}',
        '!src/**/*.d.ts',
    ],
};
```

### Vitest
```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html', 'lcov'],
            exclude: ['**/*.spec.ts', '**/*.test.ts'],
            thresholds: {
                lines: 80,
                functions: 80,
                branches: 80,
                statements: 80,
            },
        },
    },
});
```

### Python
```ini
# .coveragerc
[run]
source = src
branch = True
omit = tests/*

[report]
exclude_lines =
    pragma: no cover
    if TYPE_CHECKING:
    raise NotImplementedError
fail_under = 80

[html]
directory = htmlcov
```

## Output Format

```markdown
# Coverage Analysis Report

**Date:** [timestamp]
**Framework:** Jest with v8 coverage

## Coverage Summary

| Type | Coverage | Target | Status |
|------|----------|--------|--------|
| **Lines** | **85%** | 80% | ✅ Pass |
| **Branches** | **78%** | 80% | ❌ Fail |
| **Functions** | **92%** | 80% | ✅ Pass |
| **Statements** | **86%** | 80% | ✅ Pass |

## Coverage by Directory

| Directory | Lines | Branches | Functions |
|-----------|-------|----------|-----------|
| src/services | 92% | 85% | 95% |
| src/components | 88% | 75% | 90% |
| src/utils | 72% | 65% | 80% |
| src/api | 95% | 90% | 100% |

## Files Below Threshold

### 1. src/utils/validators.ts

| Type | Coverage | Missing |
|------|----------|---------|
| Lines | 65% | 14 lines |
| Branches | 55% | 9 branches |
| Functions | 70% | 3 functions |

**Uncovered Lines:** 23-28, 45-52, 78-82

```typescript
// Line 23-28: Not covered
export function validateEmail(email: string): boolean {
    if (!email) return false;  // ❌ Not covered
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);  // ❌ Not covered
}
```

**Suggested Tests:**
```typescript
describe('validateEmail', () => {
    it('should return false for empty email', () => {
        expect(validateEmail('')).toBe(false);
    });

    it('should return true for valid email', () => {
        expect(validateEmail('test@example.com')).toBe(true);
    });
});
```

### 2. src/components/Button.tsx

| Type | Coverage | Missing |
|------|----------|---------|
| Lines | 70% | 8 lines |
| Branches | 60% | 4 branches |

**Uncovered:** Loading state, disabled variant

## Branch Coverage Details

| File | Branch | Coverage |
|------|--------|----------|
| validators.ts | if (!email) | ❌ False path |
| validators.ts | if (!phone) | ❌ Both paths |
| Button.tsx | if (loading) | ❌ True path |
| Button.tsx | if (disabled) | ❌ True path |

## Coverage Trend

| Date | Lines | Branches | Change |
|------|-------|----------|--------|
| 2026-02-15 | 82% | 75% | - |
| 2026-02-16 | 84% | 77% | +2% |
| 2026-02-17 | 85% | 78% | +1% |

## Recommendations

1. **Priority:** Add tests for validators.ts (14 uncovered lines)
2. **Priority:** Cover Button loading/disabled states
3. **Medium:** Improve utils directory coverage to 80%+

## Artifacts

- HTML Report: coverage/lcov-report/index.html
- LCOV: coverage/lcov.info
- JSON: coverage/coverage-final.json
```

## Example Usage

### Example 1: Full Coverage Analysis

```
USER: /coverage-analysis

SKILL OUTPUT:
# Coverage Analysis Report

## Coverage Summary

| Type | Coverage | Target |
|------|----------|--------|
| Lines | 85% | 80% ✅ |
| Branches | 78% | 80% ❌ |
| Functions | 92% | 80% ✅ |
| Statements | 86% | 80% ✅ |

## Files Below Threshold

### src/utils/validators.ts
- Lines: 65%
- Missing: 14 lines
- Top uncovered: validateEmail(), validatePhone()

### src/components/Button.tsx
- Lines: 70%
- Missing: loading state, disabled variant

## Recommendation

Add 8 tests to reach 80% branch coverage:
1. validateEmail empty test
2. validateEmail valid test
3. validatePhone empty test
4. Button loading state test
5. Button disabled state test
...
```

### Example 2: Coverage Diff

```
USER: /coverage-analysis --diff main

SKILL OUTPUT:
# Coverage Diff Report

**Base:** main
**Current:** feature/new-auth

## Coverage Change

| Type | Base | Current | Change |
|------|------|---------|--------|
| Lines | 82% | 85% | +3% ✅ |
| Branches | 75% | 78% | +3% ✅ |
| Functions | 90% | 92% | +2% ✅ |

## New Code Coverage

| File | New Lines | Covered | Coverage |
|------|-----------|---------|----------|
| auth.service.ts | 45 | 40 | 89% |
| login.component.ts | 32 | 28 | 88% |

## Regression Alert

⚠️ **Coverage decreased** in:
- user.service.ts: 90% → 85%

Missing tests for new error handling code.
```

### Example 3: Threshold Enforcement

```
USER: /coverage-analysis --threshold 90

SKILL OUTPUT:
# Coverage Analysis Report

**Threshold:** 90%

## Results

| Type | Coverage | Status |
|------|----------|--------|
| Lines | 85% | ❌ Fail |
| Branches | 78% | ❌ Fail |
| Functions | 92% | ✅ Pass |
| Statements | 86% | ❌ Fail |

❌ **Build Failed:** Coverage below threshold

## Required to Pass

Need 5% more line coverage (10 lines):
- validators.ts: 4 lines
- Button.tsx: 3 lines
- Form.tsx: 3 lines
```

## Running Coverage

### Jest
```bash
jest --coverage
```

### Vitest
```bash
vitest run --coverage
```

### Python
```bash
pytest --cov=src --cov-report=html
```

### Go
```bash
go test -coverprofile=coverage.out
go tool cover -html=coverage.out
```

## CI/CD Integration

```yaml
# .github/workflows/coverage.yml
name: Coverage

on: [push, pull_request]

jobs:
    coverage:
        runs-on: ubuntu-latest
        steps:
            - uses: actions/checkout@v4
            - uses: actions/setup-node@v4
            - run: npm ci
            - run: npm test -- --coverage
            - uses: codecov/codecov-action@v3
              with:
                  files: ./coverage/lcov.info
```

## Best Practices

1. **Set Thresholds** - Enforce minimum coverage
2. **Track Trends** - Monitor coverage over time
3. **Review Gaps** - Regularly review uncovered code
4. **Exclude Generated** - Don't cover generated code
5. **Focus on Critical** - Prioritize business logic

## Integration

This skill integrates with:
- `mutation-testing`: Combined quality metrics
- `test-generation`: Generate missing tests
- Codecov/SonarQube for trend tracking
