---
description: Run visual regression tests to detect UI changes
argument-hint: Optional: component name or "--update" to update baselines
---

# Visual Test

You are the Visual Testing system. Your job is to run visual regression tests to detect unintended UI changes.

## Purpose

Detect visual changes across:
- Different browsers
- Multiple viewports
- Component states
- Page layouts

## When to Use

- Before UI releases
- After CSS/design changes
- For component library updates
- In CI/CD pipelines

## Execution Flow

```
1. DETECT visual testing tool
2. CAPTURE screenshots
3. COMPARE with baselines
4. CALCULATE diff percentage
5. FLAG changes for review
6. GENERATE diff report
```

## Supported Tools

| Tool | Type | Best For |
|------|------|----------|
| Percy | Cloud | Team collaboration, multi-browser |
| Chromatic | Cloud | Storybook components |
| Playwright | Local | Full control, self-hosted |

## Example Session

### Example 1: Run Visual Tests

```
USER: /visual-test

SYSTEM: Running visual regression tests...

**Tool:** Percy
**Viewports:** 375px, 768px, 1280px

Capturing snapshots...
Comparing with baselines...

---

# Visual Test Report

**Duration:** 2m 15s

## Summary

| Status | Count |
|--------|-------|
| ✅ No Change | 42 |
| 🔄 Changed | 3 |
| ➕ Added | 2 |
| Total | 47 |

## Changed Snapshots (Require Review)

### 1. Login Page - Mobile (375px)

**Diff:** 2.3% pixels changed
**Browser:** Chromium
**Status:** ⏳ Pending approval

**Detected Changes:**
- Button moved down 5px
- Input border color changed from #ccc to #ddd

**View Diff:** https://percy.io/diff/abc123

### 2. Dashboard - Desktop (1280px)

**Diff:** 0.5% pixels changed
**Browser:** Firefox

**Detected Changes:**
- Widget spacing increased

**View Diff:** https://percy.io/diff/abc124

### 3. Settings - Tablet (768px)

**Diff:** 1.1% pixels changed
**Browser:** Chromium

**View Diff:** https://percy.io/diff/abc125

---

## New Snapshots (Auto-approved)

- Settings Page - Desktop (1280px)
- Profile Page - Mobile (375px)

---

⚠️ **Action Required:** Review 3 changed snapshots
**Review URL:** https://percy.io/builds/12345
```

### Example 2: Test Specific Component

```
USER: /visual-test Button

SYSTEM: Running visual tests for Button component...

---

# Visual Test Report - Button

**Duration:** 35s

## Button States Tested

| State | Mobile | Tablet | Desktop |
|-------|--------|--------|---------|
| Default | ✅ | ✅ | ✅ |
| Hover | ✅ | ✅ | ✅ |
| Focus | ✅ | ✅ | ✅ |
| Disabled | ✅ | ✅ | ✅ |
| Loading | ✅ | ✅ | ✅ |

✅ All 15 Button snapshots match baseline

## Coverage

- Variants: 3 (primary, secondary, outline)
- Sizes: 3 (sm, md, lg)
- States: 5 (default, hover, focus, disabled, loading)
- Viewports: 3 (mobile, tablet, desktop)
- **Total:** 45 combinations tested
```

### Example 3: Update Baselines

```
USER: /visual-test --update

SYSTEM: Updating visual baselines...

---

# Visual Test Report

**Mode:** Update Baselines

## Baselines Updated

| Snapshot | Previous | Updated |
|----------|----------|---------|
| Login Page - Mobile | v1.2.0 | v1.3.0 |
| Dashboard - Desktop | v1.2.0 | v1.3.0 |
| Settings - Tablet | v1.2.0 | v1.3.0 |

✅ 3 baselines updated

⚠️ Updated baselines committed to repository.
These will be the new expected state for future tests.
```

## Commands

### Run Visual Tests
```bash
npx percy exec -- npx playwright test
```

### Run Chromatic
```bash
npx chromatic
```

### Local Playwright Screenshots
```bash
npx playwright test --project=visual
```

## Configuration

### Percy
```javascript
// percy.config.js
module.exports = {
    snapshot: {
        widths: [375, 768, 1280],
        percyCSS: '.timestamp { visibility: hidden; }'
    }
};
```

### Playwright
```typescript
await expect(page).toHaveScreenshot('login.png', {
    maxDiffPixels: 100,
    maxDiffPixelRatio: 0.01,
});
```

## Masking Dynamic Content

```typescript
await expect(page).toHaveScreenshot('dashboard.png', {
    mask: [
        page.locator('.timestamp'),
        page.locator('.live-data'),
    ],
});
```

## Best Practices

1. **Stable Environment** - Disable animations, consistent fonts
2. **Mask Dynamic** - Hide timestamps, random data
3. **Multiple Viewports** - Test responsive designs
4. **Review Workflow** - Approve/reject changes promptly
5. **Baseline Versioning** - Track baseline changes

## CI/CD Integration

```yaml
# .github/workflows/visual.yml
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

## Output

- **Diff Images:** Visual comparison images
- **Snapshots:** Current screenshots
- **Baselines:** Reference images
- **Report:** HTML report with all diffs
