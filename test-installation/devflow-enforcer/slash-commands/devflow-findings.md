# /devflow-findings

## Slash Command

**Name:** /devflow-findings
**Description:** Show open findings that must be closed before proceeding

## Behavior

Displays all open findings across all phases, blocking progress until resolved.

## Output Format

```
## Open Findings

### Summary
- Total open findings: [count]
- Critical: [count]
- High: [count]
- Medium: [count]
- Low: [count]

### Findings by Phase

#### [Phase Name]
| ID | Description | Severity | Assigned To | Status | Created |
|----|-------------|----------|-------------|--------|---------|
| F001 | [Description] | Critical | High | Medium | Low | [Agent] | Open | In Progress | [Date] |
| F002 | [Description] | Critical | High | Medium | Low | [Agent] | Open | In Progress | [Date] |

#### [Phase Name]
[Same format]

### Blocking Findings
The following findings are blocking progress:
- [F001: Description - assigned to Agent]
- [F005: Description - assigned to Agent]

Progress cannot continue until these findings are closed.
```

## Optional Arguments

| Argument | Description |
|----------|-------------|
| `--phase [name]` | Filter by phase |
| `--agent [name]` | Filter by assigned agent |
| `--severity [level]` | Filter by severity |

## Examples

```
USER: /devflow-findings
[Shows all open findings]

USER: /devflow-findings --phase development
[Shows findings for development phase only]

USER: /devflow-findings --severity critical
[Shows only critical findings]
```

## Implementation Notes

- Read from findings.md
- Findings must be closed before proceeding (enforcement requirement #11)
- Critical and High findings block progress
- Medium and Low findings are warnings
