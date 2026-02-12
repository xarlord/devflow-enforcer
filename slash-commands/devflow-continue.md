# /devflow-continue

## Slash Command

**Name:** /devflow-continue
**Description:** Continue workflow after interruption or context reset

## Behavior

Resumes the DevFlow Enforcer workflow from where it left off.

## Execution Flow

```
1. READ task_plan.md to determine current phase
2. READ findings.md to check for open findings
3. READ progress.md to understand what was done
4. RECONSTRUCT context from documentation
5. VERIFY findings status
6. RESUME workflow from current phase
```

## Example Session

```
USER: /devflow-continue

DEVFLOW: Resuming DevFlow Enforcer workflow...

         [Reading planning files]
         [Reconstructing context]

         Current Phase: Requirements Generation
         Status: In Progress

         Open Findings:
         - F001: Requirements validation (assigned to QA Agent)

         Continuing with Phase 1: Requirements Generation...

         [Proceeds with workflow]
```

## Implementation Notes

- Called after context loss or interruption
- Reconstructs context from planning files (requirement #19)
- Validates state before resuming
- Continues from exact point of interruption
