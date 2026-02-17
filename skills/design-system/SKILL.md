---
name: design-system
description: Create, maintain, and validate design system components. Manages design tokens, component library, and documentation.
user-invocable: true
---

# Skill: Design System

## Overview

This skill manages the design system, including:
- Design tokens (colors, spacing, typography)
- Component library
- Usage documentation
- Version control
- Compliance validation

## Purpose

Ensure consistent design implementation across the application. Use this skill:
- When creating new components
- When updating design tokens
- For component documentation
- For design system audits
- When onboarding new developers

## Execution Flow

```
1. ANALYZE request type:
   - Create: New component/tokens
   - Update: Modify existing
   - Validate: Check compliance
   - Document: Generate docs
2. EXECUTE appropriate action
3. UPDATE design system files
4. VALIDATE changes
5. GENERATE documentation
6. VERSION if significant change
```

## Input Parameters

| Parameter | Type | Description | Required |
|-----------|------|-------------|----------|
| action | string | Create, Update, Validate, Document | Yes |
| type | string | Token, Component, Pattern | Yes |
| name | string | Name of item | For Create/Update |
| data | object | Component/token data | For Create/Update |
| scope | string[] | Pages/components to validate | For Validate |

## Design Token Structure

```typescript
// tokens.ts
export const tokens = {
    colors: {
        primary: {
            50: '#eff6ff',
            100: '#dbeafe',
            200: '#bfdbfe',
            300: '#93c5fd',
            400: '#60a5fa',
            500: '#3b82f6',  // Main
            600: '#2563eb',
            700: '#1d4ed8',
            800: '#1e40af',
            900: '#1e3a8a',
        },
        neutral: {
            50: '#fafafa',
            100: '#f4f4f5',
            200: '#e4e4e7',
            300: '#d4d4d8',
            400: '#a1a1aa',
            500: '#71717a',
            600: '#52525b',
            700: '#3f3f46',
            800: '#27272a',
            900: '#18181b',
        },
        semantic: {
            success: '#22c55e',
            warning: '#f59e0b',
            error: '#ef4444',
            info: '#3b82f6',
        },
    },
    spacing: {
        0: '0',
        1: '0.25rem',   // 4px
        2: '0.5rem',    // 8px
        3: '0.75rem',   // 12px
        4: '1rem',      // 16px
        5: '1.25rem',   // 20px
        6: '1.5rem',    // 24px
        8: '2rem',      // 32px
        10: '2.5rem',   // 40px
        12: '3rem',     // 48px
        16: '4rem',     // 64px
        20: '5rem',     // 80px
    },
    typography: {
        fontFamily: {
            sans: ['Inter', 'system-ui', 'sans-serif'],
            mono: ['JetBrains Mono', 'monospace'],
        },
        fontSize: {
            xs: '0.75rem',    // 12px
            sm: '0.875rem',   // 14px
            base: '1rem',     // 16px
            lg: '1.125rem',   // 18px
            xl: '1.25rem',    // 20px
            '2xl': '1.5rem',  // 24px
            '3xl': '1.875rem', // 30px
            '4xl': '2.25rem', // 36px
        },
        fontWeight: {
            normal: 400,
            medium: 500,
            semibold: 600,
            bold: 700,
        },
        lineHeight: {
            tight: 1.25,
            normal: 1.5,
            relaxed: 1.75,
        },
    },
    borderRadius: {
        none: '0',
        sm: '0.125rem',
        default: '0.25rem',
        md: '0.375rem',
        lg: '0.5rem',
        xl: '0.75rem',
        '2xl': '1rem',
        full: '9999px',
    },
    shadows: {
        sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        default: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
        md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
        lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
        xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
    },
    breakpoints: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
    },
};
```

## Component Template

```typescript
// Component documentation template
export interface ComponentDoc {
    name: string;
    category: 'layout' | 'form' | 'feedback' | 'navigation' | 'data-display';
    description: string;
    status: 'stable' | 'beta' | 'deprecated';
    version: string;
    props: PropDoc[];
    slots: SlotDoc[];
    events: EventDoc[];
    variants: VariantDoc[];
    accessibility: AccessibilityDoc;
    examples: ExampleDoc[];
}

export interface PropDoc {
    name: string;
    type: string;
    default?: string;
    required: boolean;
    description: string;
}
```

## Output Formats

### Create Component

```markdown
# Component Created: [Name]

**Category:** [category]
**Status:** beta
**Version:** 1.0.0

## Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| variant | 'primary' \| 'secondary' | 'primary' | No | Visual style |
| size | 'sm' \| 'md' \| 'lg' | 'md' | No | Component size |
| disabled | boolean | false | No | Disable interactions |

## Variants

- Primary: Default variant for main actions
- Secondary: For secondary actions
- Outline: For tertiary actions

## Accessibility

- Keyboard: Focusable with Tab
- Screen Reader: Announces as "button"
- ARIA: Supports aria-label, aria-disabled

## Files Created

- components/[Name]/[Name].tsx
- components/[Name]/[Name].test.tsx
- components/[Name]/[Name].module.css
- components/[Name]/index.ts

## Usage

```tsx
import { [Name] } from '@/components/[Name]';

<[Name] variant="primary" size="md">
    Click me
</[Name]>
```
```

### Validate Compliance

```markdown
# Design System Compliance Report

**Date:** [timestamp]
**Scope:** [components/pages checked]

## Summary

| Check | Total | Passing | Failing |
|-------|-------|---------|---------|
| Token Usage | 50 | 48 | 2 |
| Component Compliance | 25 | 24 | 1 |
| Accessibility | 25 | 23 | 2 |
| Documentation | 25 | 20 | 5 |

## Violations

### Hardcoded Colors

| File | Line | Current | Should Use |
|------|------|---------|------------|
| Button.tsx | 45 | #3b82f6 | tokens.colors.primary[500] |
| Header.tsx | 12 | #1e3a8a | tokens.colors.primary[900] |

### Non-standard Spacing

| File | Line | Current | Should Use |
|------|------|---------|------------|
| Card.tsx | 23 | 15px | tokens.spacing[4] (16px) |

### Missing Documentation

- Modal component
- Toast component
- Skeleton component

## Recommendations

1. Replace hardcoded values with tokens
2. Add missing component documentation
3. Update spacing to use 8px grid
```

## Example Usage

### Example 1: Create New Component

```
USER: Create a Card component for the design system

SKILL INPUT:
{
    "action": "Create",
    "type": "Component",
    "name": "Card",
    "data": {
        "category": "data-display",
        "description": "Container for displaying content in a styled box",
        "props": [
            {"name": "variant", "type": "'elevated' | 'outlined' | 'filled'", "default": "'elevated'"},
            {"name": "padding", "type": "'none' | 'sm' | 'md' | 'lg'", "default": "'md'"},
            {"name": "radius", "type": "'none' | 'sm' | 'md' | 'lg'", "default": "'md'"}
        ]
    }
}

SKILL OUTPUT:
# Component Created: Card

**Category:** data-display
**Status:** beta
**Version:** 1.0.0

## Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| variant | 'elevated' \| 'outlined' \| 'filled' | 'elevated' | No | Visual style |
| padding | 'none' \| 'sm' \| 'md' \| 'lg' | 'md' | No | Internal spacing |
| radius | 'none' \| 'sm' \| 'md' \| 'lg' | 'md' | No | Border radius |

## Files Created

- components/Card/Card.tsx
- components/Card/Card.test.tsx
- components/Card/Card.module.css
- components/Card/index.ts

[Component implementation generated]
```

### Example 2: Validate Design System

```
USER: Validate design system compliance for login page

SKILL INPUT:
{
    "action": "Validate",
    "type": "Component",
    "scope": ["pages/login"]
}

SKILL OUTPUT:
# Design System Compliance Report

**Date:** 2026-02-17
**Scope:** pages/login

## Summary

| Check | Total | Passing | Failing |
|-------|-------|---------|---------|
| Token Usage | 15 | 14 | 1 |
| Component Compliance | 8 | 8 | 0 |
| Accessibility | 8 | 7 | 1 |
| Documentation | 8 | 8 | 0 |

## Violations

### Hardcoded Colors

| File | Line | Current | Should Use |
|------|------|---------|------------|
| LoginPage.tsx | 89 | #ff0000 | tokens.colors.semantic.error |

## Recommendations

1. Replace error color with design token
```

## Integration

This skill integrates with:
- **ui-review**: For design validation
- **frontend-developer**: For component implementation
- **accessibility-audit**: For accessibility compliance
