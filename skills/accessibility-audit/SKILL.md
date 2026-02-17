---
name: accessibility-audit
description: Perform comprehensive WCAG 2.1 AA accessibility audit. Tests for screen reader compatibility, keyboard navigation, color contrast, and ARIA correctness.
user-invocable: true
---

# Skill: Accessibility Audit

## Overview

This skill performs a comprehensive WCAG 2.1 AA accessibility audit, testing:
- Screen reader compatibility (NVDA, JAWS, VoiceOver)
- Keyboard navigation
- Color contrast ratios
- ARIA attribute correctness
- Semantic HTML structure
- Form accessibility

## Purpose

Ensure WCAG 2.1 AA compliance before release. This skill should be used:
- After UI implementation is complete
- Before user acceptance testing
- When accessibility issues are reported
- As part of Phase 7e (Code Review)

## Execution Flow

```
1. RUN automated tests (axe-core)
2. MANUAL keyboard navigation test
3. SCREEN reader testing (NVDA/VoiceOver)
4. CHECK color contrast ratios
5. VALIDATE ARIA attributes
6. TEST form accessibility
7. VERIFY focus management
8. GENERATE compliance report
9. PROVIDE remediation guidance
```

## Input Parameters

| Parameter | Type | Description | Required |
|-----------|------|-------------|----------|
| url | string | URL to audit | Yes |
| wcagLevel | string | Target WCAG level (AA default) | No |
| includeScreenReader | boolean | Include screen reader tests | No |
| pages | string[] | Specific pages to audit | No |

## Output Format

```markdown
# Accessibility Audit Report

**Date:** [timestamp]
**URL:** [audited URL]
**WCAG Level:** AA
**Auditor:** Accessibility Expert Agent

## Compliance Summary

| Category | Tests | Passed | Failed | Compliance |
|----------|-------|--------|--------|------------|
| Perceivable | 15 | 14 | 1 | 93% |
| Operable | 12 | 12 | 0 | 100% |
| Understandable | 8 | 7 | 1 | 88% |
| Robust | 5 | 5 | 0 | 100% |
| **Total** | **40** | **38** | **2** | **95%** |

## Critical Violations (Block Release)

### 1. Color Contrast Insufficient
- **WCAG:** 1.4.3 Contrast (Minimum)
- **Impact:** Critical
- **Location:** .btn-primary
- **Current:** #888888 on #FFFFFF (3.5:1)
- **Required:** 4.5:1 minimum
- **Fix:** Change text to #616161 or darker
- **Code:**
  ```css
  .btn-primary {
      color: #616161; /* 5.1:1 contrast */
  }
  ```

## Serious Violations (Fix Before Merge)

[Same format]

## Moderate Violations

[Same format]

## Manual Testing Results

### Keyboard Navigation
| Test | Result | Notes |
|------|--------|-------|
| Tab order logical | Pass | Sequential through form |
| Focus visible | Pass | Blue outline present |
| Skip link works | Pass | Jumps to main content |
| Modal focus trap | Pass | Focus stays in modal |
| Escape closes modal | Pass | Works correctly |

### Screen Reader Testing (NVDA)
| Element | Result | Announced As |
|---------|--------|--------------|
| Main navigation | Pass | "Navigation landmark" |
| Search input | Pass | "Search, edit, blank" |
| Submit button | Pass | "Submit, button" |
| Error message | Fail | Not announced |
| Success toast | Pass | "Success, alert" |

## Remediation Roadmap

### Immediate (Critical)
1. Fix button color contrast
2. Add aria-live to error messages

### Short-term (Serious)
1. Add form field descriptions
2. Fix heading hierarchy

### Medium-term (Moderate)
1. Add skip links
2. Improve focus indicators

## Files to Modify

| File | Changes Needed |
|------|----------------|
| styles/buttons.css | Update color values |
| components/Form.tsx | Add aria-describedby |
| components/Error.tsx | Add aria-live |

## Testing Commands

```bash
# Run axe-core
npx axe-cli [url] --tags wcag2aa

# Validate HTML
npx html-validate [url]

# Check contrast
npx color-contrast-checker --ratio 4.5
```
```

## Example Usage

### Example 1: Audit Login Page

```
USER: /accessibility-audit https://example.com/login

SKILL OUTPUT:
# Accessibility Audit Report

**Date:** 2026-02-17T12:00:00Z
**URL:** https://example.com/login
**WCAG Level:** AA
**Auditor:** Accessibility Expert Agent

## Compliance Summary

| Category | Tests | Passed | Failed | Compliance |
|----------|-------|--------|--------|------------|
| Perceivable | 12 | 10 | 2 | 83% |
| Operable | 10 | 9 | 1 | 90% |
| Understandable | 6 | 5 | 1 | 83% |
| Robust | 4 | 4 | 0 | 100% |
| **Total** | **32** | **28** | **4** | **88%** |

## Critical Violations

### 1. Form Field Missing Label
- **WCAG:** 1.3.1 Info and Relationships
- **Impact:** Critical
- **Location:** #email-input
- **Problem:** Input has no associated label
- **Fix:** Add label element or aria-label
- **Code:**
  ```html
  <label for="email">Email Address</label>
  <input type="email" id="email" name="email" />
  ```

### 2. Insufficient Color Contrast
- **WCAG:** 1.4.3 Contrast (Minimum)
- **Impact:** Critical
- **Location:** .forgot-password-link
- **Current:** #aaaaaa on #ffffff (2.9:1)
- **Required:** 4.5:1
- **Fix:** Darken to #767676 or darker
```

### Example 2: Quick Contrast Check

```
USER: Check color contrast for primary button

SKILL INPUT:
{
    "foreground": "#3b82f6",
    "background": "#ffffff"
}

SKILL OUTPUT:
## Color Contrast Analysis

| Combination | Ratio | AA Text | AA Large | AAA Text |
|-------------|-------|---------|----------|----------|
| #3b82f6 on #ffffff | 3.9:1 | ❌ Fail | ✅ Pass | ❌ Fail |

**Recommendation:** For normal text, use #2563eb (4.5:1) or darker.

```css
/* Current */
.btn-primary {
    background: #3b82f6;
}

/* Recommended */
.btn-primary {
    background: #2563eb; /* WCAG AA compliant for text */
}
```
```

## WCAG 2.1 AA Quick Reference

| Criterion | Requirement | Test |
|-----------|-------------|------|
| 1.1.1 | Alt text for images | Check img tags |
| 1.3.1 | Semantic structure | Check headings, lists |
| 1.4.3 | 4.5:1 contrast (text) | Contrast checker |
| 1.4.11 | 3:1 contrast (UI) | Contrast checker |
| 2.1.1 | Keyboard accessible | Tab through page |
| 2.4.1 | Skip navigation | Test skip link |
| 2.4.7 | Visible focus | Tab and observe |
| 4.1.2 | ARIA correct | axe-core scan |

## Tools Used

| Tool | Purpose |
|------|---------|
| axe-core | Automated testing |
| WAVE | Visual feedback |
| NVDA | Screen reader testing |
| Keyboard | Manual navigation |
| Contrast Checker | Color validation |

## Integration

This skill integrates with:
- **ui-review**: Combined with visual review
- **accessibility-expert-agent**: For remediation guidance
- **frontend-developer**: For implementation fixes
