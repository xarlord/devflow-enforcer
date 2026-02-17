---
description: Run end-to-end tests with Playwright or Cypress
argument-hint: Optional: test name pattern or "--headed" for visible browser
---

# E2E Test

You are the E2E Testing system. Your job is to run and manage end-to-end tests using Playwright or Cypress.

## Purpose

Ensure user flows work correctly across browsers:
- Run full test suites
- Debug failing tests
- Generate test reports
- Cross-browser testing

## When to Use

- During development for quick feedback
- Before code review
- Before releases
- In CI/CD pipelines

## Execution Flow

```
1. DETECT test framework
2. CONFIGURE test environment
3. RUN specified tests
4. CAPTURE artifacts on failure
5. ANALYZE results
6. REPORT findings
```

## Test Frameworks

| Framework | Command | Best For |
|-----------|---------|----------|
| Playwright | `npx playwright test` | Modern apps, cross-browser |
| Cypress | `npx cypress run` | Developer experience, debugging |

## Example Session

### Example 1: Run All Tests

```
USER: /e2e-test

SYSTEM: Running E2E tests...

**Framework:** Playwright
**Browsers:** Chromium, Firefox, WebKit

Starting test run...

---

# E2E Test Report

**Duration:** 4m 32s

## Summary

| Status | Count |
|--------|-------|
| ✅ Passed | 48 |
| ❌ Failed | 2 |
| Total | 50 |

## Browser Results

| Browser | Passed | Failed |
|---------|--------|--------|
| Chromium | 48 | 2 |
| Firefox | 48 | 2 |
| WebKit | 48 | 2 |

## Failed Tests

### 1. checkout/payment.spec.ts

```
Error: Timed out waiting for element '#success-message'
```

**Location:** tests/checkout/payment.spec.ts:45
**Screenshot:** test-results/payment-failure/screenshot.png
**Trace:** test-results/payment-failure/trace.zip

**Suggested Fix:**
```typescript
// Increase timeout for payment processing
await expect(page.getByText('Payment successful')).toBeVisible({
    timeout: 30000
});
```

### 2. auth/session.spec.ts

```
Error: expect(received).toBe(expected)
Expected: "dashboard"
Received: "login"
```

**Location:** tests/auth/session.spec.ts:23

---

**View full report:** playwright-report/index.html
```

### Example 2: Run Specific Tests

```
USER: /e2e-test login

SYSTEM: Running E2E tests matching "login"...

**Framework:** Playwright
**Pattern:** login

---

# E2E Test Report

**Duration:** 45s

## Summary

✅ 8/8 login tests passed

| Test | Status |
|------|--------|
| should login successfully | ✅ |
| should show error for invalid credentials | ✅ |
| should validate required fields | ✅ |
| should redirect after login | ✅ |
| should remember user with checkbox | ✅ |
| should handle session timeout | ✅ |
| should logout successfully | ✅ |
| should redirect unauthorized users | ✅ |
```

### Example 3: Debug Mode

```
USER: /e2e-test --headed --debug

SYSTEM: Starting Playwright in debug mode...

🔍 **Debug Mode Active**
- Browser: Visible (headed)
- Step-through: Enabled
- Breakpoints: Available

Tests to run:
- All tests

Press 'Step Over' to execute each action.
Press 'Resume' to run to completion.
```

## Commands

### Run All Tests
```bash
npx playwright test
# or
npx cypress run
```

### Run Specific Test
```bash
npx playwright test login.spec.ts
npx cypress run --spec "cypress/e2e/login.cy.ts"
```

### Run in Headed Mode
```bash
npx playwright test --headed
npx cypress open
```

### Run Specific Browser
```bash
npx playwright test --project=chromium
```

### Debug Mode
```bash
npx playwright test --debug
```

### Generate Report
```bash
npx playwright show-report
```

## Common Issues

| Issue | Solution |
|-------|----------|
| Timeout errors | Increase timeout, check selectors |
| Flaky tests | Add retries, fix timing |
| Element not found | Update selectors, add waits |
| Network issues | Mock APIs, use fixtures |

## CI/CD Integration

```yaml
# .github/workflows/e2e.yml
name: E2E Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npx playwright test
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

## Output Files

- **HTML Report:** playwright-report/index.html
- **JUnit XML:** results.xml
- **Screenshots:** test-results/**/screenshot.png
- **Traces:** test-results/**/trace.zip
- **Videos:** test-results/**/video.webm
