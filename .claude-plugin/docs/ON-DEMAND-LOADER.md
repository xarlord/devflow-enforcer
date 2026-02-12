# On-Demand Documentation Loader

## Purpose

Load detailed documentation only when needed, keeping high-level summaries in context.

## Design

```typescript
interface DocLoadContext {
    currentPhase: string;
    requiredDoc?: string;
}

interface DocSpec {
    path: string;
    summary: string;  // Always loaded
    detail: string;   // Loaded on demand
    estimatedTokens: number;
}

async function loadDoc(docId: string, context: DocLoadContext): Promise<DocSpec> {
    // Always load SUMMARY.md first
    const summary = await loadDoc(`${docId}/SUMMARY.md`);

    // Only load detail if explicitly requested
    if (context.requiredDoc && context.requiredDoc === docId) {
        const detail = await loadDoc(`${docId}/detailed.md`);
        return { ...summary, ...detail };
    }

    return summary;  // Return summary only
}
```

## Loading Strategy

| Situation | Load Behavior |
|-----------|---------------|
| Session start | Load all SUMMARY.md files (~500 tokens) |
| Agent spawned | Load agent's detailed spec (~500 tokens) |
| Phase starts | Load phase's detailed doc (~300 tokens) |
| Normal operation | Use summaries only |

## Documentation Hierarchy

```
Session Start:
  └─> Load docs/SUMMARY.md (main overview)
  └─> Load docs/agents/SUMMARY.md (agent registry)
  └─> Load docs/workflow/SUMMARY.md (phases overview)

On Agent Spawn:
  └─> Load agents/<agent-id>/spec.md (full spec)

On Phase Detail Needed:
  └─> Load docs/workflow/detailed-phases.md (phase details)
```

## Token Savings

| Approach | Tokens Loaded |
|-----------|---------------|
| Load all docs upfront | ~12,500 |
| Load summaries only | ~2,000 |
| **Savings** | **~84% (~10,500 tokens)** |

## Usage Example

```typescript
// Start of session - load summaries
const mainSummary = await loadDoc('SUMMARY.md');
const agentsSummary = await loadDoc('agents/SUMMARY.md');
const workflowSummary = await loadDoc('workflow/SUMMARY.md');
// Total: ~500 tokens

// When spawning TypeScript Coding Agent
const tsAgentSpec = await loadAgent('typescript-coding', {
    currentPhase: '7c',
    requiredAgent: 'typescript-coding'
});
// Additional: ~500 tokens

// When phase detail needed
const phaseDetail = await loadDoc('workflow/detailed-phases', {
    requiredDoc: 'phases'
});
// Additional: ~300 tokens
```

## Implementation Notes

1. **Cache loaded docs** during session
2. **Clear cache** when context > 80%
3. **Reconstruct** from summaries after clearing
4. **Load detail** only when explicitly needed
