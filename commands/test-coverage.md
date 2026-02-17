---
description: Analyze test coverage and identify gaps
argument-hint: Optional: threshold percentage (e.g., "80") or "--diff" for branch comparison
---

# Test Coverage

You are the Test Coverage Analysis system. Your job is to analyze test coverage and identify untested code.

## Purpose

Ensure comprehensive test coverage across:
- Line coverage
- Branch coverage
- Function coverage
- Statement coverage

## When to Use

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

## Coverage Tools

| Language | Tool | Output |
|----------|------|--------|
| JavaScript | Jest, Vitest | lcov, json |
| Python | coverage.py | xml, html |
| Java | JaCoCo | xml, html |
| Go | go test -cover | text, html |
| .NET | coverlet | json, opencover |

## Example Session

### Example 1: Full Coverage Analysis

```
USER: /test-coverage

SYSTEM: Running coverage analysis...

**Framework:** Vitest
**Provider:** v8

Running tests with coverage...

---

# Coverage Analysis Report

**Date:** 2026-02-17
**Duration:** 45s

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
});
```

## Recommendations

1. **Priority:** Add tests for validators.ts (14 uncovered lines)
2. **Priority:** Improve branch coverage in utils to 80%+
3. **Medium:** Add edge case tests for components

---
**Artifacts:**
- HTML Report: coverage/lcov-report/index.html
- LCOV: coverage/lcov.info
```

### Example 2: Coverage with Threshold

```
USER: /test-coverage 90

SYSTEM: Running coverage analysis with threshold 90%...

---

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

### Example 3: Coverage Diff

```
USER: /test-coverage --diff

SYSTEM: Comparing coverage with main branch...

---

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

## Commands

### Run Coverage

```bash
# Jest
jest --coverage

# Vitest
vitest run --coverage

# Python
pytest --cov=src --cov-report=html

# Go
go test -coverprofile=coverage.out
go tool cover -html=coverage.out
```

### View Reports

```bash
# Open HTML report
open coverage/lcov-report/index.html

# View text summary
npx nyc report --reporter=text
```

## Configuration

### Vitest

```typescript
// vitest.config.ts
export default defineConfig({
    test: {
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html', 'lcov'],
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

### Jest

```javascript
// jest.config.js
module.exports = {
    collectCoverage: true,
    coverageDirectory: 'coverage',
    coverageReporters: ['text', 'lcov', 'html'],
    coverageThreshold: {
        global: {
            branches: 80,
            functions: 80,
            lines: 80,
        },
    },
};
```

## Best Practices

1. **Set Thresholds** - Enforce minimum coverage (80%+)
2. **Track Trends** - Monitor coverage over time
3. **Review Gaps** - Regularly review uncovered code
4. **Exclude Generated** - Don't cover generated code
5. **Focus on Critical** - Prioritize business logic

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
