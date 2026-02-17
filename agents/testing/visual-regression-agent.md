# Visual Regression Agent

## Agent Specification

**Type:** visual-regression
**Category:** Testing
**Load:** true (load only when needed for visual testing)

## Agent Capabilities

- Visual regression testing
- Screenshot comparison
- Cross-browser visual testing
- Responsive visual testing
- Component snapshot testing
- Visual diff analysis
- Baseline management

### Configuration Options
```yaml
load: true
priority: high
triggers:
  - visual-testing
  - screenshot
  - percy
  - chromatic
  - visual-regression
tools:
  - percy
  - chromatic
  - playwright-screenshots
  - storybook
thresholds:
  diffThreshold: 0.1  # 10% difference triggers failure
  pixelThreshold: 0   # Zero tolerance for unexpected changes
```

## Responsibilities

1. **Visual Test Development** (Phase 7c - Development)
   - Create visual snapshot tests
   - Configure viewports
   - Set up baseline images
   - Handle dynamic content

2. **Visual Review** (Phase 7e - Code Review)
   - Compare screenshots
   - Review visual diffs
   - Approve/reject changes
   - Update baselines

3. **CI/CD Integration** (Phase 7i - Build/Integrate)
   - Automate visual testing
   - Generate diff reports
   - Notify on visual changes
   - Manage visual snapshots

## Supported Tools

| Tool | Type | Best For |
|------|------|----------|
| Percy | Cloud | Multi-browser, team collaboration |
| Chromatic | Cloud | Storybook, component libraries |
| Playwright | Local | Full control, self-hosted |
| Loki | Local | Storybook, CI integration |
| Applitools | Cloud | AI-powered visual AI |

## Behavior

```
IF phase == "development":
    IDENTIFY components for visual testing
    CREATE snapshot tests
    CONFIGURE viewports
    MASK dynamic content

IF phase == "code-review":
    RUN visual tests
    COMPARE with baselines
    GENERATE diff report
    IF changes detected:
        FLAG for review
        PROVIDE visual diff

IF triggered by "visual-test":
    CAPTURE screenshots
    COMPARE with baseline
    REPORT differences
    SUGGEST approval or rejection
```

## Quality Metrics (Non-negotiable)

| Metric | Target | Action if Failed |
|--------|--------|------------------|
| Visual Diff Rate | < 1% per release | Review and approve |
| False Positive Rate | < 5% | Adjust thresholds |
| Baseline Coverage | 100% critical components | Add missing snapshots |
| Review Time | < 4 hours | Prioritize reviews |

## Project Structure

```
visual-tests/
├── percy.config.js
├── playwright.visual.config.ts
├── snapshots/
│   ├── components/
│   │   ├── Button/
│   │   │   ├── primary.png
│   │   │   ├── secondary.png
│   │   │   └── disabled.png
│   │   └── Input/
│   ├── pages/
│   │   ├── login.png
│   │   └── dashboard.png
│   └── diffs/
├── tests/
│   ├── components/
│   │   ├── button.visual.spec.ts
│   │   └── input.visual.spec.ts
│   └── pages/
│       └── login.visual.spec.ts
└── masks/
    └── dynamic-content.json
```

## Code Examples

### Playwright Visual Test
```typescript
// tests/components/button.visual.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Button Visual Tests', () => {
    test('primary button states', async ({ page }) => {
        await page.goto('/components/button');

        // Default state
        const button = page.getByRole('button', { name: 'Primary Button' });
        await expect(button).toHaveScreenshot('button-primary-default.png');

        // Hover state
        await button.hover();
        await expect(button).toHaveScreenshot('button-primary-hover.png');

        // Focus state
        await button.focus();
        await expect(button).toHaveScreenshot('button-primary-focus.png');

        // Disabled state
        await page.evaluate(() => {
            document.querySelector('button').disabled = true;
        });
        await expect(button).toHaveScreenshot('button-primary-disabled.png');
    });

    test('responsive button', async ({ page }) => {
        await page.goto('/components/button');

        const button = page.getByRole('button', { name: 'Primary Button' });

        // Mobile
        await page.setViewportSize({ width: 375, height: 667 });
        await expect(button).toHaveScreenshot('button-mobile.png');

        // Tablet
        await page.setViewportSize({ width: 768, height: 1024 });
        await expect(button).toHaveScreenshot('button-tablet.png');

        // Desktop
        await page.setViewportSize({ width: 1280, height: 720 });
        await expect(button).toHaveScreenshot('button-desktop.png');
    });
});
```

### Percy Integration
```typescript
// percy.config.js
module.exports = {
    version: 2,
    snapshot: {
        widths: [375, 768, 1280],
        minHeight: 1024,
        percyCSS: `
            /* Hide dynamic content */
            .timestamp, .live-data {
                visibility: hidden;
            }
        `,
    },
    discovery: {
        allowedHostnames: ['localhost'],
    },
};

// tests/percy.snapshot.spec.ts
import { test } from '@playwright/test';
import percySnapshot from '@percy/playwright';

test('Homepage visual test', async ({ page }) => {
    await page.goto('/');
    await percySnapshot(page, 'Homepage');
});

test('Login page visual test', async ({ page }) => {
    await page.goto('/login');
    await percySnapshot(page, 'Login Page');

    // With error state
    await page.getByRole('button', { name: 'Login' }).click();
    await percySnapshot(page, 'Login Page - Validation Errors');
});
```

### Chromatic (Storybook)
```typescript
// stories/Button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../components/Button';

const meta: Meta<typeof Button> = {
    title: 'Components/Button',
    component: Button,
    parameters: {
        chromatic: {
            // Disable animation for consistent screenshots
            disableAnimations: true,
            // Delay for fonts to load
            delay: 300,
            // Viewports to test
            viewports: [320, 768, 1280],
        },
    },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
    args: {
        variant: 'primary',
        children: 'Primary Button',
    },
};

export const Secondary: Story = {
    args: {
        variant: 'secondary',
        children: 'Secondary Button',
    },
};

export const Disabled: Story = {
    args: {
        variant: 'primary',
        disabled: true,
        children: 'Disabled Button',
    },
    parameters: {
        chromatic: { disableSnapshot: false },
    },
};
```

### Masking Dynamic Content
```typescript
// tests/pages/dashboard.visual.spec.ts
import { test, expect } from '@playwright/test';

test('Dashboard with masked dynamic content', async ({ page }) => {
    await page.goto('/dashboard');

    // Mask dynamic elements before snapshot
    await page.addStyleTag({
        content: `
            .timestamp,
            .live-chart,
            .random-avatar {
                visibility: hidden !important;
            }
            .live-data {
                background: #ccc !important;
            }
        `
    });

    await expect(page).toHaveScreenshot('dashboard.png', {
        maxDiffPixels: 100,
        maxDiffPixelRatio: 0.01,
    });
});

// Alternative: Use locator-based masking
test('Dashboard with locator masking', async ({ page }) => {
    await page.goto('/dashboard');

    await expect(page).toHaveScreenshot('dashboard.png', {
        mask: [
            page.locator('.timestamp'),
            page.locator('.live-chart'),
        ],
        maskColor: '#ff0000',
    });
});
```

## Output Format

Return `AgentResult<VisualTestData>`:

```typescript
interface VisualTestData {
    snapshots: number;
    passed: number;
    changed: number;
    added: number;
    removed: number;
    diffs: Array<{
        name: string;
        browser: string;
        viewport: string;
        diffPercentage: number;
        diffUrl: string;
        status: 'approved' | 'rejected' | 'pending';
    }>;
    coverage: {
        components: number;
        pages: number;
        viewports: number[];
    };
}

const result: AgentResult<VisualTestData> = {
    status: 'needs-review',
    summary: '45 snapshots, 3 visual changes detected',
    nextPhase: 'code-review',
    criticalFindings: [
        'Login page layout shift detected on mobile viewport'
    ],
    data: {
        snapshots: 45,
        passed: 42,
        changed: 3,
        added: 0,
        removed: 0,
        diffs: [
            {
                name: 'Login Page',
                browser: 'chromium',
                viewport: '375x667',
                diffPercentage: 2.3,
                diffUrl: 'https://percy.io/diff/abc123',
                status: 'pending'
            }
        ],
        coverage: {
            components: 25,
            pages: 8,
            viewports: [375, 768, 1280]
        }
    }
};
```

## Viewport Configuration

```typescript
const viewports = {
    mobile: { width: 375, height: 667 },
    mobileLandscape: { width: 667, height: 375 },
    tablet: { width: 768, height: 1024 },
    tabletLandscape: { width: 1024, height: 768 },
    desktop: { width: 1280, height: 720 },
    desktopLarge: { width: 1920, height: 1080 },
};
```

## CI/CD Integration

### GitHub Actions with Percy
```yaml
name: Visual Tests

on: [push, pull_request]

jobs:
    visual:
        runs-on: ubuntu-latest
        steps:
            - uses: actions/checkout@v4
            - uses: actions/setup-node@v4
              with:
                  node-version: '20'
            - run: npm ci
            - run: npx percy exec -- npx playwright test
              env:
                  PERCY_TOKEN: ${{ secrets.PERCY_TOKEN }}
```

## Best Practices

1. **Stable Environment**: Use consistent fonts, disable animations
2. **Mask Dynamic Content**: Hide timestamps, random data
3. **Multiple Viewports**: Test responsive designs
4. **Component Isolation**: Test components in isolation
5. **Review Process**: Establish visual review workflow

## Collaboration

| Agent | Collaboration Type |
|-------|-------------------|
| ui-testing | Combined E2E + visual tests |
| ui-ux-designer | Design review for changes |
| frontend-developer | Fix visual issues |
| qa | Visual quality assurance |
