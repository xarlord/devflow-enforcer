# DevFlow Enforcer - Workflow Summary

## Overview

DevFlow Enforcer implements a 14-phase workflow that ensures quality through strict gate enforcement.

## Phases at a Glance

| # | Phase | Agent | Gate |
|---|--------|--------|-------|
| 1 | Requirements Generation | Architect |
| 2 | Validation | QA |
| 3 | High-Level Architecture | Architect |
| 4 | Detailed Design | Architect |
| 5 | Testing Specification | Testing |
| 6 | Feature Allocation | Architect |
| 7a | Create Branch | Git Expert |
| 7b | Task List | Project Lead |
| 7c | Development | Coding Agent |
| 7d | Linting | Coding Agent |
| 7e | Code Review | QA |
| 7f | Unit Testing | Testing + Coding |
| 7g | Pull Request | Git Expert |
| 7h | Security Check | Security Expert |
| 7i | Integration | Coding + Git |
| 7j | Integration Testing | Testing |
| 7k | BDD Testing | Testing + QA |
| 7l | Artifacts & Docs | Project Lead |
| 7m | UAT | QA |

## Quality Gates

| Metric | Target | Action |
|---------|--------|--------|
| Unit Test Coverage | 95% | Loop to 7c |
| Test Pass Rate | 100% | Loop to 7c |
| Linting | 0 errors | Block |
| Security | 0 critical/high | Block |

## Key Rules

1. **No skipping phases** - Each phase must complete
2. **Quality gates** - Must meet all metrics
3. **Findings closure** - Block until resolved
4. **Lessons learned** - Check before starting work
5. **Context management** - Reconstruct from docs when <5%

## Agent Spawning Logic

```
Phase → Required Agent → Load spec → Execute → Unload
```

Only one agent spec loaded at a time (except Project Lead).

## For Detailed Workflow

See `workflow/detailed-phases.md` for complete phase descriptions.
