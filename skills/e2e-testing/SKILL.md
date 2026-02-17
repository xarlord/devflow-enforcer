---
name: e2e-testing
description: Run end-to-end tests with Playwright or Cypress. Supports cross-browser testing, parallel execution, and detailed reporting.
user-invocable: true
---

# Skill: E2E Testing

## Overview

This skill manages end-to-end testing with:
- Playwright (multi-browser)
- Cypress (developer experience)
- Cross-browser testing
- Parallel execution
- Detailed reporting

## Purpose

Ensure user flows work correctly across browsers. Use this skill:
- During development for quick feedback
- Before code review
- In CI/CD pipelines
- For regression testing

## Execution Flow

```
1. DETECT test framework (Playwright/Cypress)
2. CONFIGURE test environment
3. RUN test suite
4. COLLECT results and artifacts
5. ANALYZE failures
6. GENERATE report
```

## Input Parameters

| Parameter | Type | Description | Required |
|-----------|------|-------------|----------|
| browser | string | chromium, firefox, webkit, all | No |
| headed | boolean | Run in headed mode | No |
| debug | boolean | Enable debug mode | No |
| grep | string | Test pattern to run | No |
| parallel | boolean | Run tests in parallel | No |

## Test Commands

### Playwright
```bash
# Run all tests
npx playwright test

# Run specific browser
npx playwright test --project=chromium

# Run specific test
npx playwright test login.spec.ts

# Run in headed mode
npx playwright test --headed

# Debug mode
npx playwright test --debug

# Run with UI
npx playwright test --ui
```

### Cypress
```bash
# Run all tests
npx cypress run

# Run in specific browser
npx cypress run --browser firefox

# Run specific spec
npx cypress run --spec "cypress/e2e/login.cy.ts"

# Open interactive mode
npx cypress open
```

## Output Format

```markdown
# E2E Test Report

**Date:** [timestamp]
**Framework:** Playwright
**Duration:** 4m 32s

## Test Summary

| Status | Count |
|--------|-------|
| ✅ Passed | 48 |
| ❌ Failed | 2 |
| ⏭️ Skipped | 0 |
| **Total** | **50** |

## Browser Results

| Browser | Passed | Failed |
|---------|--------|--------|
| Chromium | 48 | 2 |
| Firefox | 48 | 2 |
| WebKit | 48 | 2 |

## Failed Tests

### 1. login.spec.ts: retry-payment

**Error:**
```
Error: Timed out waiting for element '#success-message'
    at LoginPage.waitForSuccess (login.page.ts:45)
```

**Screenshot:** artifacts/login-retry-payment-failure.png
**Trace:** artifacts/login-retry-payment-trace.zip

**Steps:**
1. Navigate to /login ✅
2. Fill email ✅
3. Fill password ✅
4. Click login ✅
5. Wait for success ❌ (timeout)

## Coverage

| Category | Coverage |
|----------|----------|
| Critical Paths | 95% |
| User Flows | 88% |
| API Endpoints | 100% |

## Artifacts

- HTML Report: playwright-report/index.html
- JUnit XML: results.xml
- Screenshots: artifacts/screenshots/
```

## Example Usage

### Example 1: Run All Tests

```
USER: /e2e-test

SKILL OUTPUT:
# E2E Test Report

**Date:** 2026-02-17
**Framework:** Playwright
**Duration:** 4m 32s

## Test Summary

✅ 48/50 tests passed

| Status | Count |
|--------|-------|
| Passed | 48 |
| Failed | 2 |
| Total | 50 |

## 2 Failed Tests

### 1. checkout/payment.spec.ts

**Error:** Payment processing timeout

**Suggested Fix:**
```typescript
// Increase timeout for payment processing
await expect(page.getByText('Payment successful')).toBeVisible({
    timeout: 30000  // 30 seconds
});
```

View full report: playwright-report/index.html
```

### Example 2: Run Specific Test

```
USER: /e2e-test login

SKILL INPUT:
{
    "grep": "login"
}

SKILL OUTPUT:
# E2E Test Report

**Date:** 2026-02-17
**Filtered:** Tests matching "login"
**Duration:** 45s

## Test Summary

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
| should redirect to login when unauthorized | ✅ |
```

### Example 3: Debug Mode

```
USER: /e2e-test checkout --debug

SKILL OUTPUT:
Starting Playwright in debug mode...

🔍 Debug session active
- Browser: Chromium
- Headed: Yes
- Step-through: Enabled

Tests to run:
- checkout/payment.spec.ts

Press 'Step Over' to continue through test steps.
Press 'Resume' to run to completion.
```

## Page Object Model Template

```typescript
// pages/base.page.ts
import { Page, Locator } from '@playwright/test';

export abstract class BasePage {
    constructor(protected page: Page) {}

    async navigate(path: string) {
        await this.page.goto(path);
    }

    async waitForPageLoad() {
        await this.page.waitForLoadState('networkidle');
    }
}

// pages/login.page.ts
export class LoginPage extends BasePage {
    readonly emailInput: Locator;
    readonly passwordInput: Locator;
    readonly submitButton: Locator;

    constructor(page: Page) {
        super(page);
        this.emailInput = page.getByLabel('Email');
        this.passwordInput = page.getByLabel('Password');
        this.submitButton = page.getByRole('button', { name: 'Login' });
    }

    async login(email: string, password: string) {
        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);
        await this.submitButton.click();
    }
}
```

## CI/CD Integration

```yaml
# GitHub Actions
name: E2E Tests

on: [push, pull_request]

jobs:
    e2e:
        runs-on: ubuntu-latest
        steps:
            - uses: actions/checkout@v4
            - uses: actions/setup-node@v4
            - run: npm ci
            - run: npx playwright install --with-deps
            - run: npx playwright test
            - uses: actions/upload-artifact@v4
              if: always()
              with:
                  name: playwright-report
                  path: playwright-report/
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Flaky tests | Add retries, fix timing issues |
| Timeout errors | Increase timeout, check selectors |
| Element not found | Update selectors, wait for element |
| Network issues | Mock API calls, use test fixtures |

## Integration

This skill integrates with:
- `visual-testing`: Combined E2E + visual tests
- `ui-testing-agent`: Test development
- CI/CD pipelines for automated testing
