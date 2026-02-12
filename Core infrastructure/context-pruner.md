# Context Pruner

## Purpose

Monitor context window usage and trigger pruning when threshold reached.

## Expected Token Savings

~86% (~20,600 tokens)

## Implementation

```typescript
interface ContextMetrics {
    currentTokens: number;
    maxTokens: number;
    percentage: number;
    lastPruneTime: Date;
}

interface PruneConfig {
    threshold: number;      // Default: 80%
    emergencyThreshold: number;  // Default: 90%
    keepRecentMessages: number;    // Default: 10
}

class ContextPruner {
    private config: PruneConfig = {
        threshold: 80,
        emergencyThreshold: 90,
        keepRecentMessages: 10
    };

    shouldPrune(metrics: ContextMetrics): boolean {
        return metrics.percentage >= this.config.threshold;
    }

    async prune(metrics: ContextMetrics): Promise<PruneResult> {
        const result: PruneResult = {
            timestamp: new Date(),
            beforeTokens: metrics.currentTokens,
            afterTokens: 0,
            archivedItems: [],
            keptItems: []
        };

        // 1. Identify what to keep
        result.keptItems = this.identifyKeepItems();

        // 2. Identify what to archive
        result.archivedItems = this.identifyArchiveItems();

        // 3. Write archive
        await this.writeArchive(result);

        // 4. Return reconstruction instructions
        return result;
    }

    private identifyKeepItems(): string[] {
        return [
            'current-phase',
            'active-agent-spec',
            'open-findings',
            'recent-messages-10'
        ];
    }

    private identifyArchiveItems(): string[] {
        return [
            'completed-phase-outputs',
            'closed-findings',
            'old-agent-specs',
            'conversation-history'
        ];
    }

    private async writeArchive(result: PruneResult): Promise<void> {
        const archivePath = 'context-archive.md';
        const archive = this.formatArchive(result);
        await writeFile(archivePath, archive);
    }

    private formatArchive(result: PruneResult): string {
        return `
# Context Archive - ${result.timestamp.toISOString()}

## Session Metrics
- Before Prune: ${result.beforeTokens} tokens
- After Prune: ${result.afterTokens} tokens
- Archived Items: ${result.archivedItems.length}
- Kept Items: ${result.keptItems.length}

## Archived Content
${this.formatArchivedItems()}

## Reconstruction
To reconstruct context, read:
1. task_plan.md (current phase)
2. findings.md (open findings)
3. agents/SUMMARY.md (agent reference)
4. workflow/SUMMARY.md (phase reference)
`;
    }
}

interface PruneResult {
    timestamp: Date;
    beforeTokens: number;
    afterTokens: number;
    archivedItems: string[];
    keptItems: string[];
}
```

## Usage

```typescript
const pruner = new ContextPruner();

// After each major operation
const metrics = getContextMetrics();
if (pruner.shouldPrune(metrics)) {
    const result = await pruner.prune(metrics);
    console.log(`Pruned: ${result.beforeTokens} → ${result.afterTokens} tokens`);
    // Reconstruct context from kept items
    await reconstructContext(result.keptItems);
}
```

## Reconstruction Protocol

After pruning, reconstruct context by reading:

1. **task_plan.md** - Current phase and progress
2. **findings.md** - Open findings requiring action
3. **agents/SUMMARY.md** - Agent capabilities reference
4. **workflow/SUMMARY.md** - Current phase requirements
5. **context-archive.md** - Recent history if needed

```typescript
async function reconstructContext(keptItems: string[]): Promise<void> {
    const plan = await readFile('task_plan.md');
    const findings = await readFile('findings.md');
    const agents = await readFile('docs/agents/SUMMARY.md');
    const workflow = await readFile('docs/workflow/SUMMARY.md');

    // Load these into context
    // Archive is available but not auto-loaded
}
```

## Archive Format

```markdown
# Context Archive - 2026-02-12T14:30:00Z

## Session Metrics
- Before Prune: 28,450 tokens
- After Prune: 4,200 tokens
- Archived Items: 12
- Kept Items: 4
- Reduction: 85%

## Archived Items

### Completed Phases
- Phase 1: Requirements Generation (COMPLETE)
- Phase 2: Validation (COMPLETE)
- Phase 3: High-Level Architecture (COMPLETE)
- Phase 4: Detailed Design (COMPLETE)

### Agent Results Archived
- Architect: Architecture designed (status: success)
- QA: Requirements validated (status: success)
- Testing: Test spec created (status: success)

### Closed Findings
- FINDING-001: Requirements unclear (RESOLVED)
- FINDING-002: Missing tech stack decision (RESOLVED)

### Conversation Summary
- Decided to use TypeScript for frontend
- Decided to use PostgreSQL for database
- User approved architecture design

## Reconstruction Priority

1. Read: task_plan.md (current: Phase 7c)
2. Read: findings.md (3 open findings)
3. Read: docs/agents/SUMMARY.md (need TypeScript agent)
4. Read: docs/workflow/SUMMARY.md (Phase 7c requirements)

Optional: Read this archive for conversation history
```

## Token Savings

| Scenario | Before | After | Savings |
|----------|---------|--------|----------|
| Mid-session prune | ~25,000 | ~4,000 | 84% |
| Late-session prune | ~35,000 | ~4,500 | 87% |
| Average | ~30,000 | ~4,250 | **~86%** |

## Configuration

Edit pruning behavior in `context-pruner.config.json`:

```json
{
    "threshold": 80,
    "emergencyThreshold": 90,
    "keepRecentMessages": 10,
    "archivePath": "context-archive.md",
    "autoReconstruct": true
}
```
