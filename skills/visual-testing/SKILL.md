---
name: visual-testing
description: Run visual regression tests with Percy, Chromatic, or Playwright. Detects visual changes across browsers and viewports.
user-invocable: true
---

# Skill: Visual Testing

## Overview

This skill manages visual regression testing:
- Screenshot comparison
- Cross-browser visual testing
- Responsive viewport testing
- Component snapshot testing
- Visual diff analysis

## Purpose

Detect unintended visual changes. Use this skill:
- Before UI releases
- After CSS/design changes
- For component library updates
- In CI/CD pipelines

## Execution Flow

```
1. DETECT visual testing tool
2. CONFIGURE viewports and browsers
3. CAPTURE snapshots
4. COMPARE with baselines
5. GENERATE diff report
6. REQUIRE approval for changes
```

## Input Parameters

| Parameter | Type | Description | Required |
|-----------|------|-------------|----------|
| tool | string | percy, chromatic, playwright | No |
| viewports | string[] | Viewport sizes to test | No |
| updateBaseline | boolean | Update baselines | No |

## Supported Tools

| Tool | Type | Command |
|------|------|---------|
| Percy | Cloud | `npx percy exec -- npx playwright test` |
| Chromatic | Cloud | `npx chromatic` |
| Playwright | Local | `npx playwright test --project=visual` |
| Loki | Local | `npx loki` |

## Output Format

```markdown
# Visual Test Report

**Date:** [timestamp]
**Tool:** Percy
**Duration:** 2m 15s

## Snapshot Summary

| Status | Count |
|--------|-------|
| ✅ No Changes | 42 |
| 🔄 Changed | 3 |
| ➕ Added | 2 |
| ➖ Removed | 0 |
| **Total** | **47** |

## Changed Snapshots (Require Review)

### 1. Login Page - Mobile (375px)
- **Diff:** 2.3% pixels changed
- **Browser:** Chromium
- **Status:** ⏳ Pending approval
- **View:** https://percy.io/diff/abc123

**Detected Changes:**
- Button position shifted down 5px
- Error message styling changed

### 2. Dashboard - Desktop (1280px)
- **Diff:** 0.5% pixels changed
- **Browser:** Firefox
- **Status:** ⏳ Pending approval
- **View:** https://percy.io/diff/abc124

## New Snapshots

### 1. Settings Page - Desktop (1280px)
- **Status:** ✅ Auto-approved (new page)

### 2. Profile Page - Mobile (375px)
- **Status:** ✅ Auto-approved (new page)

## Viewports Tested

| Viewport | Width | Snapshots |
|----------|-------|-----------|
| Mobile | 375px | 15 |
| Tablet | 768px | 15 |
| Desktop | 1280px | 17 |

## Coverage

| Category | Count |
|----------|-------|
| Pages | 8 |
| Components | 25 |
| States | 14 |

## Approval Required

3 snapshots require review before merge.
Review at: https://percy.io/builds/12345
```

## Example Usage

### Example 1: Run Visual Tests

```
USER: /visual-test

SKILL OUTPUT:
# Visual Test Report

**Date:** 2026-02-17
**Tool:** Percy
**Duration:** 2m 15s

## Snapshot Summary

✅ 42/47 snapshots unchanged
🔄 3 snapshots changed (review required)
➕ 2 new snapshots added

## Changed Snapshots

### 1. Login Page - Mobile
**Diff:** 2.3%

Before → After comparison shows:
- Button moved down 5px
- Input field border changed

[View Diff](https://percy.io/diff/abc123)

## Action Required

Review 3 changed snapshots in Percy:
https://percy.io/builds/12345
```

### Example 2: Update Baselines

```
USER: /visual-test --update-baseline

SKILL INPUT:
{
    "updateBaseline": true
}

SKILL OUTPUT:
# Visual Test Report

**Date:** 2026-02-17
**Mode:** Update Baselines

## Baselines Updated

| Snapshot | Previous | Updated |
|----------|----------|---------|
| Login Page - Mobile | v1.2.0 | v1.3.0 |
| Dashboard - Desktop | v1.2.0 | v1.3.0 |
| Settings Page - Tablet | v1.2.0 | v1.3.0 |

⚠️ Baseline updates committed to repository.
Team will see these as the new expected state.
```

### Example 3: Component Testing

```
USER: /visual-test --component Button

SKILL OUTPUT:
# Visual Test Report - Button Component

**Date:** 2026-02-17
**Component:** Button

## Button States Tested

| State | Viewport | Status |
|-------|----------|--------|
| Default | Mobile | ✅ No change |
| Default | Desktop | ✅ No change |
| Hover | Mobile | ✅ No change |
| Hover | Desktop | ✅ No change |
| Focus | Mobile | ✅ No change |
| Focus | Desktop | ✅ No change |
| Disabled | Mobile | ✅ No change |
| Disabled | Desktop | ✅ No change |
| Loading | Mobile | ✅ No change |
| Loading | Desktop | ✅ No change |

## All Button States Match Baseline ✅
```

## Configuration

### Percy Config
```javascript
// percy.config.js
module.exports = {
    version: 2,
    snapshot: {
        widths: [375, 768, 1280],
        minHeight: 1024,
        percyCSS: `
            .timestamp { visibility: hidden; }
            .random-avatar { visibility: hidden; }
        `,
    },
};
```

### Playwright Visual Config
```typescript
// playwright.visual.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
    expect: {
        toHaveScreenshot: {
            maxDiffPixels: 100,
            maxDiffPixelRatio: 0.01,
        },
    },
    use: {
        viewport: { width: 1280, height: 720 },
    },
});
```

## Masking Dynamic Content

```typescript
// Mask elements that change between runs
await expect(page).toHaveScreenshot('dashboard.png', {
    mask: [
        page.locator('.timestamp'),
        page.locator('.live-chart'),
        page.locator('.notification-badge'),
    ],
    maskColor: '#ff00ff',
});
```

## Best Practices

1. **Stable Environment**: Same fonts, disable animations
2. **Mask Dynamic Content**: Hide timestamps, random data
3. **Consistent Viewports**: Standard mobile/tablet/desktop
4. **Review Workflow**: Approve/reject changes promptly
5. **Baseline Management**: Version control baselines

## CI/CD Integration

```yaml
# GitHub Actions
name: Visual Tests

on: [push, pull_request]

jobs:
    visual:
        runs-on: ubuntu-latest
        steps:
            - uses: actions/checkout@v4
            - run: npm ci
            - run: npx percy exec -- npx playwright test
              env:
                  PERCY_TOKEN: ${{ secrets.PERCY_TOKEN }}
```

## Integration

This skill integrates with:
- `e2e-testing`: Combined E2E + visual tests
- `visual-regression-agent`: Visual analysis
- `ui-ux-designer`: Design review for changes
