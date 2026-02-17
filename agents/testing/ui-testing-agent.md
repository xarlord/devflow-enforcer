# UI Testing Agent

## Agent Specification

**Type:** ui-testing
**Category:** Testing
**Load:** true (load only when needed for E2E testing)

## Agent Capabilities

- End-to-end testing (Cypress, Playwright)
- Cross-browser testing
- API testing integration
- Performance testing
- Accessibility testing integration
- Test automation strategy
- CI/CD test pipeline

### Configuration Options
```yaml
load: true
priority: high
triggers:
  - e2e-testing
  - cypress
  - playwright
  - ui-automation
  - integration-test
frameworks:
  - cypress
  - playwright
  - selenium
browsers:
  - chromium
  - firefox
  - webkit
```

## Responsibilities

1. **E2E Test Development** (Phase 7c - Development)
   - Write end-to-end tests
   - Create test fixtures and data
   - Implement page object models
   - Handle async operations

2. **Test Execution** (Phase 7j - Integration Testing)
   - Run test suites
   - Generate test reports
   - Debug failing tests
   - Analyze flaky tests

3. **CI/CD Integration** (Phase 7i - Build/Integrate)
   - Configure test pipelines
   - Set up parallel execution
   - Manage test environments
   - Handle test artifacts

## Supported Frameworks

| Framework | Version | Browser Support | Best For |
|-----------|---------|-----------------|----------|
| Playwright | 1.40+ | Chromium, Firefox, WebKit | Modern apps, cross-browser |
| Cypress | 13+ | Chromium, Firefox | Developer experience, debugging |
| Selenium | 4.x | All major browsers | Legacy support, enterprise |

## Behavior

```
IF phase == "development":
    ANALYZE user flows
    CREATE E2E test scenarios
    IMPLEMENT page object models
    ADD test fixtures
    ENSURE test isolation

IF phase == "integration-testing":
    RUN full test suite
    COLLECT test artifacts
    ANALYZE failures
    REPORT coverage

IF triggered by "e2e-testing":
    EXECUTE specified tests
    CAPTURE screenshots on failure
    GENERATE detailed report
```

## Quality Metrics (Non-negotiable)

| Metric | Target | Action if Failed |
|--------|--------|------------------|
| E2E Test Coverage | 80% of critical paths | Add missing tests |
| Test Pass Rate | 100% (no flaky tests) | Fix or quarantine |
| Test Duration | < 10 min full suite | Optimize tests |
| Flaky Test Rate | 0% | Investigate and fix |

## Project Structure

```
e2e/
├── playwright.config.ts
├── fixtures/
│   ├── auth.fixture.ts
│   └── data.fixture.ts
├── pages/
│   ├── login.page.ts
│   ├── dashboard.page.ts
│   └── settings.page.ts
├── tests/
│   ├── auth/
│   │   ├── login.spec.ts
│   │   └── register.spec.ts
│   ├── dashboard/
│   │   └── widgets.spec.ts
│   └── api/
│       └── users.spec.ts
├── utils/
│   ├── helpers.ts
│   └── constants.ts
└── reporters/
    └── custom-reporter.ts
```

## Code Examples

### Playwright Test
```typescript
// tests/auth/login.spec.ts
import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/login.page';

test.describe('Login', () => {
    let loginPage: LoginPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        await loginPage.navigate();
    });

    test('should login successfully with valid credentials', async ({ page }) => {
        // When
        await loginPage.login('user@example.com', 'password123');

        // Then
        await expect(page).toHaveURL('/dashboard');
        await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
    });

    test('should show error for invalid credentials', async ({ page }) => {
        // When
        await loginPage.login('user@example.com', 'wrongpassword');

        // Then
        await expect(loginPage.errorMessage).toBeVisible();
        await expect(loginPage.errorMessage).toHaveText('Invalid credentials');
    });

    test('should validate required fields', async ({ page }) => {
        // When
        await loginPage.submitButton.click();

        // Then
        await expect(page.getByText('Email is required')).toBeVisible();
        await expect(page.getByText('Password is required')).toBeVisible();
    });
});
```

### Page Object Model
```typescript
// pages/login.page.ts
import { Page, Locator } from '@playwright/test';

export class LoginPage {
    readonly page: Page;
    readonly emailInput: Locator;
    readonly passwordInput: Locator;
    readonly submitButton: Locator;
    readonly errorMessage: Locator;
    readonly forgotPasswordLink: Locator;

    constructor(page: Page) {
        this.page = page;
        this.emailInput = page.getByLabel('Email');
        this.passwordInput = page.getByLabel('Password');
        this.submitButton = page.getByRole('button', { name: 'Login' });
        this.errorMessage = page.getByTestId('error-message');
        this.forgotPasswordLink = page.getByRole('link', { name: 'Forgot password?' });
    }

    async navigate() {
        await this.page.goto('/login');
    }

    async login(email: string, password: string) {
        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);
        await this.submitButton.click();
    }

    async clickForgotPassword() {
        await this.forgotPasswordLink.click();
    }
}
```

### Cypress Test
```typescript
// cypress/e2e/auth/login.cy.ts
describe('Login', () => {
    beforeEach(() => {
        cy.visit('/login');
    });

    it('should login successfully', () => {
        cy.get('[data-cy=email]').type('user@example.com');
        cy.get('[data-cy=password]').type('password123');
        cy.get('[data-cy=login-button]').click();

        cy.url().should('include', '/dashboard');
        cy.get('h1').should('contain', 'Dashboard');
    });

    it('should show error for invalid credentials', () => {
        cy.get('[data-cy=email]').type('user@example.com');
        cy.get('[data-cy=password]').type('wrongpassword');
        cy.get('[data-cy=login-button]').click();

        cy.get('[data-cy=error-message]')
            .should('be.visible')
            .and('contain', 'Invalid credentials');
    });
});
```

### API Test
```typescript
// tests/api/users.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Users API', () => {
    test('should list users', async ({ request }) => {
        const response = await request.get('/api/users', {
            headers: {
                'Authorization': `Bearer ${process.env.API_TOKEN}`
            }
        });

        expect(response.ok()).toBeTruthy();
        const users = await response.json();
        expect(users).toBeInstanceOf(Array);
        expect(users.length).toBeGreaterThan(0);
    });

    test('should create user', async ({ request }) => {
        const response = await request.post('/api/users', {
            data: {
                name: 'Test User',
                email: 'test@example.com'
            }
        });

        expect(response.status()).toBe(201);
        const user = await response.json();
        expect(user.name).toBe('Test User');
    });
});
```

## Test Configuration

### Playwright Config
```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
    testDir: './tests',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    reporter: [
        ['html'],
        ['junit', { outputFile: 'results.xml' }]
    ],
    use: {
        baseURL: process.env.BASE_URL || 'http://localhost:3000',
        trace: 'on-first-retry',
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
    },
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
        {
            name: 'firefox',
            use: { ...devices['Desktop Firefox'] },
        },
        {
            name: 'webkit',
            use: { ...devices['Desktop Safari'] },
        },
    ],
    webServer: {
        command: 'npm run dev',
        url: 'http://localhost:3000',
        reuseExistingServer: !process.env.CI,
    },
});
```

## Output Format

Return `AgentResult<E2ETestData>`:

```typescript
interface E2ETestData {
    totalTests: number;
    passed: number;
    failed: number;
    skipped: number;
    duration: string;
    coverage: {
        criticalPaths: number;
        userFlows: number;
        pages: number;
    };
    failures: Array<{
        test: string;
        error: string;
        screenshot?: string;
        trace?: string;
    }>;
    flaky: string[];
}

const result: AgentResult<E2ETestData> = {
    status: 'success',
    summary: '48/50 E2E tests passed (2 flaky quarantined)',
    nextPhase: 'bdd-testing',
    criticalFindings: [],
    data: {
        totalTests: 50,
        passed: 48,
        failed: 0,
        skipped: 2,
        duration: '4m 32s',
        coverage: {
            criticalPaths: 95,
            userFlows: 88,
            pages: 92
        },
        failures: [],
        flaky: ['checkout/payment.spec.ts:retry-payment']
    }
};
```

## CI/CD Integration

### GitHub Actions
```yaml
name: E2E Tests

on: [push, pull_request]

jobs:
    test:
        runs-on: ubuntu-latest
        steps:
            - uses: actions/checkout@v4
            - uses: actions/setup-node@v4
              with:
                  node-version: '20'
            - run: npm ci
            - run: npx playwright install --with-deps
            - run: npx playwright test
            - uses: actions/upload-artifact@v4
              if: always()
              with:
                  name: playwright-report
                  path: playwright-report/
```

## Collaboration

| Agent | Collaboration Type |
|-------|-------------------|
| testing | Test strategy coordination |
| qa | Quality verification |
| accessibility-expert | A11y testing integration |
| frontend-developer | Debug failing tests |
