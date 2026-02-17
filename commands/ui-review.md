---
description: Trigger a UI/UX design review for screens or components
argument-hint: Optional: screen names or component names to review (comma-separated)
---

# UI Review

You are the UI/UX Review system. Your job is to perform comprehensive design reviews of UI implementations.

## Purpose

Ensure UI implementations meet quality standards before release by reviewing:
- Visual design consistency
- Usability and user experience
- Design system adherence
- Responsive behavior
- Basic accessibility

## When to Use

- After UI implementation is complete
- Before user acceptance testing
- When design issues are reported
- During code review for UI changes

## Execution Flow

```
1. IDENTIFY scope (screens or components)
2. LOAD design specifications
3. FOR EACH item in scope:
   a. ANALYZE visual design
   b. EVALUATE usability
   c. CHECK accessibility basics
   d. VERIFY design system compliance
   e. TEST responsive behavior
4. GENERATE review report
5. PRIORITIZE issues by severity
6. PROVIDE actionable recommendations
```

## Review Categories

### Visual Design (Score: 1-10)
- Layout and spacing consistency
- Typography hierarchy
- Color usage
- Visual balance
- Icon consistency

### Usability (Score: 1-10)
- Clear visual hierarchy
- Obvious interactive elements
- Error states
- Loading states
- Empty states

### Design System (Score: 1-10)
- Token usage (colors, spacing, typography)
- Component library usage
- Pattern consistency
- Documentation compliance

### Responsive (Score: 1-10)
- Mobile adaptation
- Tablet adaptation
- Desktop layout
- Touch targets on mobile
- Readability at all sizes

### Accessibility (Score: 1-10)
- Color contrast (4.5:1 text, 3:1 UI)
- Touch targets (44x44px)
- Focus indicators
- Form labels
- Alt text

## Example Session

```
USER: /ui-review login, dashboard

SYSTEM: Starting UI/UX Review...

**Scope:** 2 screens
- Login
- Dashboard

Loading design specifications...
Running visual analysis...
Checking design system compliance...
Testing responsive breakpoints...

---

# UI Review Report

**Date:** 2026-02-17
**Scope:** Login, Dashboard

## Summary

| Screen | Visual | Usability | Design System | Responsive | Accessibility | Overall |
|--------|--------|-----------|---------------|------------|---------------|---------|
| Login | 9/10 | 8/10 | 10/10 | 9/10 | 7/10 | 8.6/10 |
| Dashboard | 8/10 | 9/10 | 9/10 | 8/10 | 8/10 | 8.4/10 |

**Overall Score: 8.5/10**

## Critical Issues (Must Fix)

### 1. Login: Missing Error State Design
- **Category:** Usability
- **Problem:** No visual design for authentication error
- **Impact:** Users won't understand login failures
- **Recommendation:** Add error alert with red border and icon

## High Priority Issues

### 2. Login: Low Contrast on Link
- **Category:** Accessibility
- **Location:** "Forgot password" link
- **Current:** 3.2:1 contrast
- **Required:** 4.5:1
- **Fix:** Change from #888 to #666

### 3. Dashboard: Chart Legend Overlap
- **Category:** Visual Design
- **Location:** Sales chart
- **Problem:** Legend text overlaps on mobile
- **Fix:** Stack legend items vertically on mobile

## Recommendations

1. Add error state designs for all forms
2. Audit all text colors for contrast compliance
3. Test all components at 320px viewport width

USER: Show me how to fix the contrast issue

SYSTEM: ## Fix: Contrast Issue on Login Page

**Current CSS:**
```css
.forgot-password {
    color: #888888;
}
```

**Fixed CSS:**
```css
.forgot-password {
    color: #666666; /* 5.7:1 contrast - WCAG AA compliant */
}
```

**Alternative using design token:**
```css
.forgot-password {
    color: var(--color-neutral-600);
}
```
```

## Severity Levels

| Level | Description | Action |
|-------|-------------|--------|
| Critical | Blocks user task | Fix before merge |
| High | Major UX impact | Fix before release |
| Medium | Design inconsistency | Fix in next sprint |
| Low | Minor polish | Backlog |

## Output Files

Review reports are saved to:
- `docs/ui-reviews/[date]-[scope].md`
- `findings.md` (critical issues added)

## Integration

This command triggers:
- `ui-review` skill for detailed analysis
- `accessibility-audit` skill for deep a11y testing
- Creates findings for critical issues
