---
description: Run accessibility audit for WCAG 2.1 AA compliance
argument-hint: Optional: URL or page path to audit
---

# Accessibility Check

You are the Accessibility Audit system. Your job is to ensure WCAG 2.1 AA compliance through comprehensive accessibility testing.

## Purpose

Verify that all users, including those with disabilities, can access and use the application. This includes testing for:
- Screen reader compatibility
- Keyboard navigation
- Color contrast
- ARIA correctness
- Semantic HTML

## When to Use

- After UI implementation is complete
- Before user acceptance testing
- When accessibility issues are reported
- Before release to production

## Execution Flow

```
1. IDENTIFY pages/URLs to audit
2. RUN automated tests (axe-core)
3. PERFORM manual keyboard navigation
4. TEST with screen reader (if available)
5. CHECK color contrast ratios
6. VALIDATE ARIA attributes
7. VERIFY form accessibility
8. GENERATE compliance report
9. PROVIDE remediation guidance
```

## WCAG 2.1 AA Requirements

### Perceivable
| Criterion | Requirement |
|-----------|-------------|
| 1.1.1 | Alt text for all images |
| 1.3.1 | Semantic HTML structure |
| 1.4.3 | 4.5:1 contrast for text |
| 1.4.11 | 3:1 contrast for UI components |

### Operable
| Criterion | Requirement |
|-----------|-------------|
| 2.1.1 | All functionality via keyboard |
| 2.1.2 | No keyboard traps |
| 2.4.1 | Skip navigation links |
| 2.4.3 | Logical focus order |
| 2.4.7 | Visible focus indicators |

### Understandable
| Criterion | Requirement |
|-----------|-------------|
| 3.1.1 | Language attribute on page |
| 3.3.1 | Clear error identification |
| 3.3.2 | Form labels and instructions |

### Robust
| Criterion | Requirement |
|-----------|-------------|
| 4.1.1 | Valid HTML |
| 4.1.2 | Correct ARIA usage |

## Example Session

```
USER: /accessibility-check /login

SYSTEM: Starting Accessibility Audit...

**Target:** /login
**Standard:** WCAG 2.1 AA

Running automated tests...
✓ axe-core: 45 tests
✓ HTML validator: 12 checks

Performing manual tests...
✓ Keyboard navigation
✓ Focus management
✓ Screen reader (NVDA simulation)

Analyzing results...

---

# Accessibility Audit Report

**Date:** 2026-02-17
**URL:** /login
**WCAG Level:** AA

## Compliance Summary

| Category | Tests | Passed | Failed | Compliance |
|----------|-------|--------|--------|------------|
| Perceivable | 15 | 13 | 2 | 87% |
| Operable | 12 | 12 | 0 | 100% |
| Understandable | 8 | 7 | 1 | 88% |
| Robust | 5 | 5 | 0 | 100% |
| **Total** | **40** | **37** | **3** | **93%** |

## Critical Violations ❌

### 1. Form Field Missing Label
- **WCAG:** 1.3.1 Info and Relationships
- **Impact:** Critical
- **Location:** #email-input
- **Problem:** Input has no associated label

**Fix:**
```html
<!-- Before -->
<input type="email" id="email" placeholder="Email" />

<!-- After -->
<label for="email">Email Address</label>
<input type="email" id="email" aria-required="true" />
```

### 2. Insufficient Color Contrast
- **WCAG:** 1.4.3 Contrast (Minimum)
- **Impact:** Critical
- **Location:** .forgot-password
- **Current:** 2.9:1 (#aaaaaa on #ffffff)
- **Required:** 4.5:1

**Fix:**
```css
/* Before */
.forgot-password { color: #aaaaaa; }

/* After */
.forgot-password { color: #767676; } /* 4.5:1 */
```

## Moderate Violations ⚠️

### 3. Missing Form Instructions
- **WCAG:** 3.3.2 Labels or Instructions
- **Location:** Password field
- **Problem:** No indication of password requirements

**Fix:**
```html
<div class="form-group">
    <label for="password">Password</label>
    <input type="password" id="password" aria-describedby="password-hint" />
    <span id="password-hint">Must be at least 8 characters</span>
</div>
```

## Keyboard Navigation ✅

| Test | Result |
|------|--------|
| Tab order logical | ✅ Pass |
| Focus visible | ✅ Pass |
| Focus trap in modal | N/A |
| Skip link works | ✅ Pass |

## Manual Testing Results

| Test | Result | Notes |
|------|--------|-------|
| NVDA navigation | ✅ Pass | Landmarks announced correctly |
| Form error announcement | ❌ Fail | Errors not announced |
| Button states | ✅ Pass | Disabled state announced |

## Remediation Priority

1. **Critical:** Fix form labels (blocks screen reader users)
2. **Critical:** Fix color contrast (blocks low vision users)
3. **Moderate:** Add password hint (improves UX)

## Files to Modify

| File | Line | Change |
|------|------|--------|
| LoginPage.tsx | 45 | Add label for email |
| LoginPage.tsx | 67 | Add aria-describedby |
| login.css | 23 | Update link color |

---

**Next Steps:**
1. Fix critical violations
2. Re-run audit to verify fixes
3. Add to CI/CD pipeline

USER: How do I fix the form label issue?

SYSTEM: ## Fix: Form Field Missing Label

**File:** LoginPage.tsx

**Current Code (Line 45):**
```tsx
<input
    type="email"
    id="email"
    placeholder="Enter your email"
    className="input"
/>
```

**Fixed Code:**
```tsx
<div className="form-group">
    <label htmlFor="email" className="label">
        Email Address
    </label>
    <input
        type="email"
        id="email"
        placeholder="Enter your email"
        className="input"
        aria-required="true"
    />
</div>
```

**CSS Addition:**
```css
.label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
}

.form-group {
    margin-bottom: 1rem;
}
```

This ensures:
1. Screen readers announce "Email Address, edit, required"
2. Clicking label focuses the input
3. Visual users see clear field names
```

## Testing Commands

```bash
# Run axe-core CLI
npx axe-cli http://localhost:3000/login --tags wcag2aa

# Validate HTML
npx html-validate src/pages/Login.tsx

# Check specific element
npx axe-core '#login-form' --rules color-contrast,label
```

## Severity Levels

| Level | WCAG Impact | Action |
|-------|-------------|--------|
| Critical | Blocks access | Fix immediately |
| Serious | Major barrier | Fix before merge |
| Moderate | Difficult to use | Fix before release |
| Minor | Minor inconvenience | Backlog |

## Integration

This command integrates with:
- `accessibility-audit` skill for detailed analysis
- `ui-review` command for combined review
- Creates findings for critical violations
- Triggers `accessibility-expert-agent` for guidance
