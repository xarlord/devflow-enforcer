# Phase 5: Just-in-Time Workflow Loading

## Status: IN PROGRESS

Date: 2026-02-12

## Goal

Load only current + next phases to achieve ~18% savings (~1,000 tokens), while showing user what's coming next.

## Implementation Plan

### Step 1: Phase Grouping

Group related phases to reduce loading overhead.

### Step 2: Preview System

Show next phase preview without full details.

### Step 3: Loader Implementation

Dynamic phase loading based on progress.

## Phase Grouping

Instead of loading all 14 phases upfront:

| Group | Phases | Tokens |
|-------|----------|--------|
| Requirements | 1-2 | ~800 |
| Design | 3-4 | ~1,200 |
| Planning | 5-6 | ~1,000 |
| Development Core | 7a-7d | ~1,500 |
| Development Quality | 7e-7h | ~1,200 |
| Integration | 7i-7k | ~1,000 |
| Finalize | 7l-7m | ~800 |

**Load only current group + preview of next**

## Loading Strategy

```
Current Phase: 7c (Development)
├── Load Group: Development Core (7a-7d)
├── Preview: Development Quality (7e-7h)
└── Keep: Requirements summary

Current Phase: 7e (Code Review)
├── Load Group: Development Quality (7e-7h)
├── Preview: Integration (7i-7k)
└── Archive: Development Core outputs
```

## Preview Format

```markdown
## Next: Development Quality Phases

Coming up after current phase:

- 7e: Code Review (QA Agent)
- 7f: Unit Testing (Testing Agent)
- 7g: Pull Request (Git Expert)
- 7h: Security Check (Security Expert)

[Full details will load when starting this group]
```

## Token Savings

| Approach | Tokens Loaded |
|----------|---------------|
| Load all 14 phases | ~8,000 |
| Load current + next group | ~1,500 |
| Load current + preview only | ~1,000 |
| **Savings** | **~88% (~7,000 tokens)** |

## Progress Updates

*To be updated as implementation progresses...*
