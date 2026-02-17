---
name: ui-review
description: Perform a comprehensive UI/UX review of screens or components. Analyzes visual design, usability, accessibility, and consistency with design system.
user-invocable: true
---

# Skill: UI Review

## Overview

This skill performs a comprehensive UI/UX review of screens or components, analyzing:
- Visual design consistency
- Usability and user experience
- Accessibility compliance
- Design system adherence
- Responsive behavior

## Purpose

Ensure UI implementations meet quality standards before release. This skill should be used:
- After UI implementation is complete
- Before user acceptance testing
- When design issues are reported
- During code review for UI changes

## Execution Flow

```
1. IDENTIFY screens/components to review
2. ANALYZE visual design:
   - Layout and spacing
   - Typography hierarchy
   - Color usage
   - Visual consistency
3. EVALUATE usability:
   - User flows
   - Interaction patterns
   - Error handling
   - Feedback mechanisms
4. CHECK accessibility (basic):
   - Color contrast
   - Touch targets
   - Focus indicators
5. VERIFY design system compliance
6. TEST responsive behavior
7. GENERATE report with recommendations
```

## Input Parameters

| Parameter | Type | Description | Required |
|-----------|------|-------------|----------|
| screens | string[] | List of screens to review | Yes |
| components | string[] | List of components to review | No |
| designSystem | string | Path to design system docs | No |
| viewportSizes | string[] | Viewport sizes to test | No |

## Output Format

```markdown
# UI Review Report

**Date:** [timestamp]
**Reviewer:** UI/UX Designer Agent
**Scope:** [screens/components reviewed]

## Summary

| Category | Score | Issues |
|----------|-------|--------|
| Visual Design | 8/10 | 3 |
| Usability | 9/10 | 2 |
| Accessibility | 7/10 | 4 |
| Design System | 10/10 | 0 |
| Responsive | 8/10 | 2 |

**Overall Score: 8.4/10**

## Critical Issues (Must Fix)

### 1. [Issue Title]
- **Screen:** [screen name]
- **Location:** [specific element]
- **Problem:** [description]
- **Impact:** [user/business impact]
- **Recommendation:** [how to fix]
- **Priority:** Critical

## High Priority Issues

[Same format as above]

## Medium Priority Issues

[Same format as above]

## Low Priority Issues (Polish)

[Same format as above]

## Positive Findings

- [What's working well]
- [Best practices followed]

## Recommendations

1. [Strategic recommendation]
2. [Process improvement]

## Next Steps

1. [ ] Fix critical issues before release
2. [ ] Schedule accessibility audit
3. [ ] Update design system documentation
```

## Example Usage

### Example 1: Review Single Screen

```
USER: Review the login screen

SKILL INPUT:
{
    "screens": ["login"],
    "viewportSizes": ["mobile", "tablet", "desktop"]
}

SKILL OUTPUT:
# UI Review Report

**Date:** 2026-02-17
**Reviewer:** UI/UX Designer Agent
**Scope:** Login Screen

## Summary

| Category | Score | Issues |
|----------|-------|--------|
| Visual Design | 9/10 | 1 |
| Usability | 8/10 | 2 |
| Accessibility | 6/10 | 3 |
| Design System | 10/10 | 0 |
| Responsive | 9/10 | 1 |

**Overall Score: 8.4/10**

## Critical Issues (Must Fix)

### 1. Missing Error State for Invalid Credentials
- **Screen:** Login
- **Location:** Form error handling
- **Problem:** No visual design for authentication error state
- **Impact:** Users won't understand why login failed
- **Recommendation:** Add error alert component with red border and icon
- **Priority:** Critical

## High Priority Issues

### 2. Low Contrast on Secondary Link
- **Screen:** Login
- **Location:** "Forgot password" link
- **Problem:** Contrast ratio 3.2:1 (needs 4.5:1)
- **Impact:** Users with low vision cannot read link
- **Recommendation:** Change color from #888 to #666
- **Priority:** High
```

### Example 2: Review Multiple Components

```
USER: Review all form components

SKILL INPUT:
{
    "components": ["Input", "Select", "Checkbox", "Radio", "Button"],
    "designSystem": "docs/design-system.md"
}

SKILL OUTPUT:
# UI Review Report - Form Components

**Date:** 2026-02-17
**Reviewer:** UI/UX Designer Agent
**Scope:** 5 form components

## Component Summary

| Component | Score | Issues | Status |
|-----------|-------|--------|--------|
| Input | 9/10 | 1 | Pass |
| Select | 8/10 | 2 | Pass |
| Checkbox | 10/10 | 0 | Pass |
| Radio | 10/10 | 0 | Pass |
| Button | 7/10 | 3 | Needs Work |

## Critical Issues

### 1. Button Missing Focus Indicator
- **Component:** Button
- **Problem:** No visible focus ring on keyboard navigation
- **Impact:** Keyboard users cannot navigate
- **Recommendation:** Add 2px outline with offset
- **Priority:** Critical
```

## Review Checklist

### Visual Design
- [ ] Consistent spacing (8px grid)
- [ ] Typography hierarchy clear
- [ ] Color usage follows palette
- [ ] Icons are consistent style
- [ ] Shadows and borders consistent

### Usability
- [ ] Clear visual hierarchy
- [ ] Obvious interactive elements
- [ ] Error states designed
- [ ] Loading states designed
- [ ] Empty states designed

### Accessibility (Basic)
- [ ] Color contrast 4.5:1 (text)
- [ ] Color contrast 3:1 (UI)
- [ ] Touch targets 44x44px
- [ ] Focus indicators visible
- [ ] Form labels present

### Responsive
- [ ] Mobile layout works
- [ ] Tablet layout works
- [ ] Desktop layout works
- [ ] Touch-friendly on mobile
- [ ] Readable at all sizes

## Integration

This skill integrates with:
- **accessibility-audit**: For deep accessibility analysis
- **design-system**: For design token validation
- **ui-ux-designer-agent**: For remediation guidance
