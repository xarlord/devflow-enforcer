# Phase 4: Context Pruning Policy

## Status: IN PROGRESS

Date: 2026-02-12

## Goal

Implement context monitoring and pruning at 80% threshold to achieve ~70% savings (~2,000 tokens).

## Implementation Plan

### Step 1: Context Monitor

Track context usage percentage and trigger pruning at threshold.

### Step 2: Pruning Strategy

Define what to keep, archive, and discard.

### Step 3: Reconstruction Protocol

Process for restoring context after pruning.

## Context Usage Thresholds

| Percentage | Action |
|------------|--------|
| < 50% | Normal operation |
| 50-79% | Monitor closely |
| 80% | **PRUNE NOW** |
| > 90% | Emergency prune |

## Pruning Strategy

### Keep (Always in Context)

- Current phase info
- Active agent spec
- Open findings
- Recent user messages (last 10)

### Archive (Save to File, Remove from Context)

- Completed phase outputs
- Closed findings
- Old agent specs
- Long conversation history

### Discard (Remove Entirely)

- Duplicate information
- Verbose error messages (after logging)
- Intermediate calculations

## Pruning Workflow

```
WHEN context >= 80%:

1. STOP new work
2. CALCULATE current context percentage
3. IDENTIFY what to keep vs archive
4. WRITE archive to context-archive.md
5. CLEAR old messages from context
6. RECONSTRUCT from:
   - task_plan.md (current phase)
   - findings.md (open findings)
   - agents/SUMMARY.md (agent reference)
   - workflow/SUMMARY.md (phase reference)
7. CONTINUE work
```

## Archive Format

```markdown
# Context Archive - [Timestamp]

## Session Info
- Start Time: [timestamp]
- Prune Time: [timestamp]
- Phases Completed: [list]
- Current Phase: [phase]

## Archived Outputs

### Agent Results
[Compressed AgentResult<T> outputs]

### Closed Findings
[Finding IDs and resolutions]

### Conversation Summary
[Key decisions made]
```

## Expected Token Savings

| Phase | Pre-Prune | Post-Prune | Savings |
|--------|-------------|-------------|----------|
| Mid-workflow (phase 7) | ~25,000 | ~5,000 | 80% |
| End of workflow | ~35,000 | ~5,000 | 86% |
| **Average** | **~30,000** | **~5,000** | **~83%** |

## Progress Updates

*To be updated as implementation progresses...*
