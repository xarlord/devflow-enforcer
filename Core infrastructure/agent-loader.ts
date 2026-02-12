# Agent Loader

## Purpose
Load agent specifications on-demand, only for current phase

import { AgentSpecification } from './agents/${agentId}/spec';

interface LoadContext {
    currentPhase: string;
    requiredAgent?: string;
}

export async function loadAgent(
    agentId: string,
    context: LoadContext
): Promise<AgentSpecification> {
    const specPath = `./agents/${agentId}/spec.md`;
    const spec = await import(specPath);
    
    // Only load current phase
    if (context.requiredAgent && !spec.phases.includes(context.currentPhase)) {
        return spec;
    }
    
    return spec; // Only what's needed for now
}
```

## Configuration

- **Load all agents:** Only read spec files
- **Lazy:** Only when agent is spawned
- **On-demand:** Load only current + next phases

## Expected Impact

**Token Savings:** ~75% of agent loading (~6,000 lines)

## Return Format

Structured `AgentResult<T>` interface
```typescript
interface AgentResult<T = {}> {
    status: 'success' | 'failure' | 'blocked';
    summary: string;
    nextPhase?: string;
    criticalFindings: string[];
    data?: object;
}
```