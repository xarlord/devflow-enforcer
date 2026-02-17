---
name: mutation-testing
description: Run mutation testing with Stryker to measure test quality. Identifies weak tests that don't catch code mutations.
user-invocable: true
---

# Skill: Mutation Testing

## Overview

This skill runs mutation testing to measure test suite quality:
- Injects mutations (bugs) into code
- Runs tests against mutations
- Measures mutation score (killed vs survived)
- Identifies weak tests

## Purpose

Verify that tests actually catch bugs. Use this skill:
- After writing new tests
- Before major releases
- To identify test gaps
- For test quality improvement

## Execution Flow

```
1. ANALYZE codebase structure
2. CONFIGURE mutation testing
3. GENERATE mutations
4. RUN tests against each mutation
5. CALCULATE mutation score
6. REPORT surviving mutants
7. SUGGEST test improvements
```

## Input Parameters

| Parameter | Type | Description | Required |
|-----------|------|-------------|----------|
| files | string[] | Files to mutate | No |
| threshold | number | Minimum mutation score | No (default: 80) |
| reporters | string[] | Report formats | No |
| concurrency | number | Parallel processes | No |

## Stryker Configuration

### JavaScript/TypeScript
```javascript
// stryker.config.js
module.exports = {
    packageManager: 'npm',
    reporters: ['html', 'clear-text', 'progress', 'dashboard'],
    testRunner: 'jest',
    coverageAnalysis: 'perTest',
    mutate: ['src/**/*.ts', '!src/**/*.spec.ts'],
    thresholds: {
        high: 80,
        low: 60,
        break: 70,
    },
    jest: {
        projectType: 'custom',
        config: require('./jest.config.js'),
    },
};
```

### Python
```toml
# pyproject.toml
[tool.mutmut]
paths_to_mutate = ["src/"]
runner = "pytest -x"
tests_dir = ["tests/"]
```

### Java
```xml
<!-- pom.xml -->
<plugin>
    <groupId>io.stryker-mutator</groupId>
    <artifactId>stryker4s-maven-plugin</artifactId>
    <configuration>
        <mutate>
            <element>src/main/java/**/*.java</element>
        </mutate>
        <thresholds>
            <high>80</high>
            <low>60</low>
            <break>70</break>
        </thresholds>
    </configuration>
</plugin>
```

## Mutation Operators

| Operator | Description | Example |
|----------|-------------|---------|
| Arithmetic | Change operators | `+` → `-` |
| Conditional | Change conditions | `>` → `>=` |
| Equality | Change operators | `==` → `!=` |
| Boolean | Invert values | `true` → `false` |
| String | Change strings | `"hello"` → `""` |
| Array | Change lengths | `.length` → `.length - 1` |
| Object | Remove calls | `obj.method()` → `""` |

## Output Format

```markdown
# Mutation Testing Report

**Date:** [timestamp]
**Framework:** Stryker
**Duration:** 12m 34s

## Mutation Score

| Metric | Value | Target |
|--------|-------|--------|
| **Mutation Score** | **85%** | 80% ✅ |
| Killed | 170 | - |
| Survived | 20 | - |
| Timeout | 5 | - |
| No Coverage | 5 | - |
| **Total Mutants** | **200** | - |

## File Scores

| File | Score | Killed | Survived |
|------|-------|--------|----------|
| auth.service.ts | 95% | 57 | 3 |
| user.service.ts | 82% | 45 | 10 |
| payment.service.ts | 78% | 39 | 11 |
| email.service.ts | 88% | 35 | 5 |

## Surviving Mutants (Need Tests)

### 1. auth.service.ts:45

**Original:**
```typescript
if (user.isActive) {
    return generateToken(user);
}
```

**Mutated:**
```typescript
if (false) {  // Changed: user.isActive → false
    return generateToken(user);
}
```

**Test Needed:** Verify that inactive users cannot get tokens

**Suggested Test:**
```typescript
it('should reject inactive users', async () => {
    user.isActive = false;
    await expect(authService.login(user))
        .rejects.toThrow('User is inactive');
});
```

### 2. payment.service.ts:78

**Original:**
```typescript
const fee = amount * 0.03;
```

**Mutated:**
```typescript
const fee = amount * 0;  // Changed: 0.03 → 0
```

**Test Needed:** Verify fee calculation

**Suggested Test:**
```typescript
it('should calculate correct fee', () => {
    const fee = paymentService.calculateFee(100);
    expect(fee).toBe(3);  // 3% of 100
});
```

## Ignored Mutants

| Reason | Count |
|--------|-------|
| Equivalent mutation | 5 |
| Not worth testing | 3 |

## Recommendations

1. Add tests for `payment.service.ts` fee calculation
2. Add edge case tests for `user.service.ts`
3. Increase coverage for error paths
```

## Example Usage

### Example 1: Run Full Mutation Testing

```
USER: /mutation-test

SKILL OUTPUT:
# Mutation Testing Report

**Duration:** 12m 34s

## Mutation Score: 85% ✅

| Category | Count |
|----------|-------|
| Killed | 170 |
| Survived | 20 |
| Timeout | 5 |
| No Coverage | 5 |
| **Total** | **200** |

## 20 Surviving Mutants

### Top Priority Fixes

1. **auth.service.ts:45** - Inactive user check bypassed
2. **payment.service.ts:78** - Fee calculation zeroed
3. **user.service.ts:102** - Email validation removed

**View Report:** reports/mutation/html/index.html
```

### Example 2: Test Specific File

```
USER: /mutation-test auth.service.ts

SKILL INPUT:
{
    "files": ["src/services/auth.service.ts"]
}

SKILL OUTPUT:
# Mutation Testing Report

**File:** auth.service.ts
**Duration:** 2m 15s

## Mutation Score: 95%

| Mutant Type | Killed | Survived |
|-------------|--------|----------|
| Conditional | 25 | 2 |
| Equality | 18 | 1 |
| Boolean | 14 | 0 |
| **Total** | **57** | **3** |

## 3 Surviving Mutants

### 1. Line 45: Inactive User Check

```typescript
// Original
if (user.isActive) {

// Mutated
if (false) {
```

**Add Test:**
```typescript
it('should reject inactive users', async () => {
    const inactiveUser = { ...user, isActive: false };
    await expect(service.login(inactiveUser))
        .rejects.toThrow('User is inactive');
});
```
```

### Example 3: Set Threshold

```
USER: /mutation-test --threshold 90

SKILL INPUT:
{
    "threshold": 90
}

SKILL OUTPUT:
# Mutation Testing Report

**Threshold:** 90%
**Actual Score:** 85%

❌ Build Failed: Mutation score below threshold

## Missing 5% (10 mutants)

Priority fixes needed:
1. Add fee calculation test
2. Add inactive user test
3. Add email validation test

Run `npx stryker run` to see full report.
```

## Running Mutation Tests

### JavaScript/TypeScript
```bash
npx stryker run
```

### Python
```bash
mutmut run
```

### Java
```bash
mvn stryker4s:run
```

### .NET
```bash
dotnet stryker
```

## CI/CD Integration

```yaml
# .github/workflows/mutation.yml
name: Mutation Testing

on: [push, pull_request]

jobs:
    mutation:
        runs-on: ubuntu-latest
        steps:
            - uses: actions/checkout@v4
            - uses: actions/setup-node@v4
            - run: npm ci
            - run: npx stryker run
              env:
                  STRYKER_DASHBOARD_API_KEY: ${{ secrets.STRYKER_TOKEN }}
```

## Best Practices

1. **Start Small** - Run on changed files first
2. **Set Thresholds** - Enforce minimum scores
3. **Fix Survivors** - Add tests for surviving mutants
4. **Ignore Equivalents** - Some mutations are equivalent
5. **Parallelize** - Use concurrency for speed

## Integration

This skill integrates with:
- `coverage-analysis`: Combined quality metrics
- `test-generation`: Generate missing tests
- CI/CD for automated quality gates
