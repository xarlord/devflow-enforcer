# /devflow-status

## Slash Command

**Name:** /devflow-status
**Description:** Show current workflow status, phase, and open findings

## Behavior

Displays the current state of the DevFlow Enforcer workflow.

## Output Format

```
## DevFlow Enforcer Status

### Project Information
- Application: [Application Name]
- Started: [Date]
- Current Phase: [Phase Name]

### Current Phase Details
- Phase: [Phase Name]
- Started: [Date]
- Assigned Agent: [Agent Name]
- Status: [In Progress | Pending Findings Closure | Complete]

### Open Findings
| ID | Phase | Description | Severity | Assigned To | Status |
|----|-------|-------------|----------|-------------|--------|
| F001 | [Phase] | [Description] | [Severity] | [Agent] | [Status] |
| F002 | [Phase] | [Description] | [Severity] | [Agent] | [Status] |

### Quality Metrics
| Metric | Target | Current | Status |
|--------|--------|---------|--------|
| Unit Test Coverage | 95% | [%] | [Pass/Fail] |
| Unit Test Pass Rate | 100% | [%] | [Pass/Fail] |
| Linting | 0 errors | [count] | [Pass/Fail] |

### Active Features
| Feature | Branch | Status |
|---------|--------|--------|
| [Name] | [branch] | [Status] |

### Recent Progress
- [Most recent completed phase/action]
- [Previous phase/action]
```

## Implementation Notes

- Read from task_plan.md for current phase
- Read from findings.md for open findings
- Read from progress.md for recent actions
- Calculate quality metrics if applicable
