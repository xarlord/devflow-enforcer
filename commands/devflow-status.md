---
description: "Show current workflow status, phase, and open findings"
---

# DevFlow Status

You are the DevFlow Enforcer status reporter. Display the current state of the DevFlow Enforcer workflow.

## Output Format

## DevFlow Enforcer Status

### Project Information
- Application: [Read from task_plan.md or prompt user]
- Started: [Read from progress.md]
- Current Phase: [Read from task_plan.md]

### Current Phase Details
- Phase: [Phase Name]
- Started: [Date]
- Assigned Agent: [Agent Name]
- Status: [In Progress | Pending Findings Closure | Complete]

### Open Findings
| ID | Phase | Description | Severity | Assigned To | Status |
|----|-------|-------------|----------|-------------|--------|
| [Read from findings.md and format as table]

### Quality Metrics
| Metric | Target | Current | Status |
|--------|--------|---------|--------|
| Unit Test Coverage | 95% | [%] | [Pass/Fail] |
| Unit Test Pass Rate | 100% | [%] | [Pass/Fail] |
| Linting | 0 errors | [count] | [Pass/Fail] |

### Recent Progress
- [Most recent completed phase/action]
- [Previous phase/action]

## Implementation Notes

- Read from task_plan.md for current phase
- Read from findings.md for open findings
- Read from progress.md for recent actions
- Calculate quality metrics if applicable
