---
description: Run mutation testing to measure test quality
argument-hint: Optional: file pattern or "--threshold 80" to set minimum score
---

# Mutation Test

You are the Mutation Testing system. Your job is to run mutation testing to measure test suite quality.

## Purpose

Verify that tests actually catch bugs:
- Inject mutations (bugs) into code
- Run tests against mutations
- Measure mutation score (killed vs survived)
- Identify weak tests

## When to Use

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

## Example Session

### Example 1: Run Full Mutation Testing

```
USER: /mutation-test

SYSTEM: Running mutation testing...

**Framework:** Stryker
**Concurrency:** 4 workers

Generating mutants...
Running tests against each mutant...

---

# Mutation Testing Report

**Date:** 2026-02-17
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

## Recommendations

1. Add tests for `payment.service.ts` fee calculation
2. Add edge case tests for `user.service.ts`
3. Increase coverage for error paths

---
**View Report:** reports/mutation/html/index.html
```

### Example 2: Test Specific File

```
USER: /mutation-test auth.service.ts

SYSTEM: Running mutation testing for auth.service.ts...

---

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

SYSTEM: Running mutation testing with threshold 90%...

---

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

## Commands

### Run Mutation Tests

```bash
# JavaScript/TypeScript
npx stryker run

# Python
mutmut run

# Java
mvn stryker4s:run

# .NET
dotnet stryker
```

### Run Specific Files

```bash
# Stryker
npx stryker run --mutate src/services/auth.service.ts

# View report
open reports/mutation/html/index.html
```

## Configuration

### Stryker (JavaScript/TypeScript)

```javascript
// stryker.config.js
module.exports = {
    packageManager: 'npm',
    reporters: ['html', 'clear-text', 'progress'],
    testRunner: 'jest',
    coverageAnalysis: 'perTest',
    mutate: ['src/**/*.ts', '!src/**/*.spec.ts'],
    thresholds: {
        high: 80,
        low: 60,
        break: 70,
    },
};
```

### mutmut (Python)

```toml
# pyproject.toml
[tool.mutmut]
paths_to_mutate = ["src/"]
runner = "pytest -x"
tests_dir = ["tests/"]
```

### Stryker4s (Java)

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

## Best Practices

1. **Start Small** - Run on changed files first
2. **Set Thresholds** - Enforce minimum scores (70%+)
3. **Fix Survivors** - Add tests for surviving mutants
4. **Ignore Equivalents** - Some mutations are equivalent
5. **Parallelize** - Use concurrency for speed

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

## Output Files

- **HTML Report:** reports/mutation/html/index.html
- **JSON Report:** reports/mutation/mutation.json
- **Dashboard:** https://dashboard.stryker-mutator.io
