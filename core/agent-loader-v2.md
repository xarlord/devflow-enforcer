# Agent Loader v2

## Purpose

Load agent specifications on-demand, only for current phase, to minimize context window usage.

## Design

```typescript
interface LoadContext {
    currentPhase: string;
    requiredAgent?: string;
}

interface AgentSpecification {
    id: string;
    name: string;
    capabilities: string[];
    load: boolean | 'always';
    phases: string[];
}

async function loadAgent(
    agentId: string,
    context: LoadContext
): Promise<AgentSpecification> {
    const specPath = `./agents/${agentId}/spec.md`;

    // Check if agent should be loaded
    const spec = await loadAgentSpec(specPath);

    // Project Lead is always loaded
    if (agentId === 'project-lead') {
        return spec;
    }

    // Only load if agent is needed for current phase
    if (context.requiredAgent && context.requiredAgent !== agentId) {
        return null; // Don't load
    }

    // Check if agent's load flag is true
    if (spec.load !== true && spec.load !== 'always') {
        return null; // Don't load
    }

    return spec;
}
```

## Configuration

| Load Strategy | Behavior | Token Savings |
|--------------|----------|---------------|
| Eager (load all) | Read all agent specs upfront | 0% (baseline ~8,000 tokens) |
| Lazy (on spawn) | Only read spec when agent is spawned | ~75% (~6,000 tokens saved) |
| On-demand (current + next) | Load current phase agent + next phase preview | ~70% (~5,600 tokens saved) |

## Agent Phase Mapping

| Agent | Phases Active | Load Strategy |
|-------|--------------|---------------|
| project-lead | All phases | Always loaded |
| architect | 1, 3, 4, 6 | On-demand |
| qa | 2, 7e, 7m | On-demand |
| testing | 5, 7f, 7j, 7k | On-demand |
| coding (ts) | 7c, 7d, 7i | On-demand |
| coding (python) | 7c, 7d, 7i | On-demand |
| coding (java) | 7c, 7d, 7i | On-demand |
| coding (cpp) | 7c, 7d, 7i | On-demand |
| coding (rust) | 7c, 7d, 7i | On-demand |
| coding (csharp) | 7c, 7d, 7i | On-demand |
| git-expert | 7a, 7g | On-demand |
| security | 7h | On-demand |
| docker | deployment | On-demand |
| database | 4, 7i | On-demand |
| retrospective | After each phase | On-demand |

## Load Workflow

```
START: User request
  │
  ▼
LOAD project-lead agent (always)
  │
  ▼
DETERMINE current phase
  │
  ▼
IDENTIFY required agent for phase
  │
  ▼
LOAD required agent spec (lazy)
  │
  ▼
AGENT executes task
  │
  ▼
RETURN AgentResult<T>
  │
  ▼
UNLOAD agent spec (free context)
  │
  ▼
NEXT PHASE → Repeat
```

## Context Savings Calculation

**Baseline (Eager Loading):**
- All 15 agent specs: ~8,000 tokens
- Loaded at session start

**Optimized (Lazy Loading):**
- Project Lead: ~500 tokens (always)
- 1 active agent per phase: ~500 tokens
- Total per session: ~1,000-2,000 tokens
- **Savings: ~6,000-7,000 tokens (~75%)**

## Implementation Notes

1. **Agent Spec Structure**:
   ```yaml
   ---
   load: true  # Enable lazy loading for this agent
   phases: [1, 3, 4, 6]  # Active phases
   capabilities:
     - Architecture design
     - Requirements engineering
   ---
   ```

2. **Load Condition**:
   ```typescript
   shouldLoad(agent, phase) {
       return agent.load === true &&
              agent.phases.includes(phase);
   }
   ```

3. **Cache Strategy**:
   - Keep loaded specs in memory during phase
   - Clear after phase completes
   - Reload if same agent needed later

## Expected Impact

**Token Savings:** ~75% of agent loading (~6,000 tokens per session)

**Quality Impact:** None - agents have full specs when active

**Performance:** Minimal - loading is fast relative to LLM calls
