---
description: Save current workflow state to documentation for context recovery
argument-hint: Optional: "force" to force checkpoint regardless of context level
---

# Context Checkpoint

You are the Context Checkpoint system. Your job is to proactively save the current workflow state to documentation before Claude's auto-compaction triggers.

## Purpose

**CRITICAL FIX:** This command enables proactive context management.

**Problem:** Claude's auto-compaction is unpredictable and may lose important context.

**Solution:** Manually trigger a checkpoint to save all state to documentation, enabling recovery.

## When to Use

- Before complex operations that may use significant context
- When context usage warning is issued (80%)
- Before switching to a different task
- When explicitly requested by user
- Periodically during long sessions

## Execution Flow

```
1. CHECK current context usage
2. GATHER current state:
   - Current phase
   - Open findings
   - Recent progress
   - Pending decisions
   - Active agents
3. SAVE to documentation:
   - Update task_plan.md
   - Update findings.md
   - Update progress.md
   - Create checkpoint file
4. CONFIRM checkpoint complete
5. REPORT summary to user
```

## Checkpoint Files Created

| File | Purpose |
|------|---------|
| `.devflow/context-checkpoint.md` | Full checkpoint with state |
| `task_plan.md` (updated) | Current phase and progress |
| `findings.md` (updated) | All findings with status |
| `progress.md` (updated) | Session log updated |

## Checkpoint File Format

```markdown
# Context Checkpoint

**Created:** [timestamp]
**Context Usage:** [percentage]%
**Triggered By:** [manual/auto]

## Current State

### Active Phase
- Phase: [phase-id]
- Name: [phase-name]
- Status: [status]
- Started: [timestamp]

### Open Findings
| ID | Phase | Description | Severity | Status |
|----|-------|-------------|----------|--------|
| ... | ... | ... | ... | ... |

### Recent Progress
[List of recent actions]

### Pending Decisions
[List of decisions pending]

### Active Agents
[List of currently spawned agents]

## Recovery Instructions

To recover from this checkpoint:

1. **READ task_plan.md** - Get current phase and progress
2. **READ findings.md** - Get open findings
3. **READ progress.md** - Get session history
4. **READ templates/lessons-learned.md** - Get relevant lessons
5. **RESUME** from current phase

## Context Thresholds

| Level | Usage | Action |
|-------|-------|--------|
| Normal | < 80% | No action needed |
| Warning | 80% | Checkpoint suggested |
| Checkpoint | 70% | **MANDATORY checkpoint** |
| Clear | 60% | Context cleared |
| Reconstruct | 50% | Reconstruct from docs |

---
*Checkpoint created by /context-checkpoint command*
```

## Example Session

```
USER: /context-checkpoint

SYSTEM: Creating context checkpoint...

✅ Context Checkpoint Complete

**Context Usage:** 65%
**Checkpoint File:** .devflow/context-checkpoint.md

**Saved State:**
- Current Phase: code-review (Phase 11)
- Open Findings: 3
- Recent Progress: 12 actions logged
- Pending Decisions: 2

**Files Updated:**
- task_plan.md
- findings.md
- progress.md
- .devflow/context-checkpoint.md

**Next Steps:**
- Continue working normally
- Run /context-checkpoint again if context exceeds 80%
- If context reaches 70%, checkpoint is MANDATORY
```

## Force Checkpoint

Use `force` argument to create checkpoint regardless of context level:

```
USER: /context-checkpoint force

SYSTEM: Forcing context checkpoint...

✅ Context Checkpoint Complete (Forced)

**Context Usage:** 45%
**Checkpoint saved anyway due to force flag.
```

## Integration with Workflow

The ContextManager automatically triggers checkpoints:

```
Context Usage    Action
-------------    ------
80%             → Warning issued (suggest /context-checkpoint)
70%             → MANDATORY automatic checkpoint
60%             → Context cleared, prepare for reconstruction
50%             → Context reconstructed from documentation
```

## Recovery After Context Clear

When context is cleared, recovery is automatic:

```
1. READ .devflow/context-checkpoint.md
2. READ task_plan.md
3. READ findings.md
4. READ progress.md
5. READ templates/lessons-learned.md
6. RESUME workflow from saved phase
```

## Error Handling

| Error | Resolution |
|-------|------------|
| Cannot write checkpoint file | Check .devflow/ directory permissions |
| Documentation files not found | Create missing files from templates |
| Context read failed | Use fallback estimation |

## Best Practices

1. **Checkpoint before complex work** - Prevents context loss
2. **Checkpoint after major decisions** - Preserves decision context
3. **Checkpoint before phase transitions** - Enables clean recovery
4. **Review checkpoint periodically** - Ensure state is captured
