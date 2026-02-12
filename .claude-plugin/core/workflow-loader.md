# Workflow Loader

## Purpose

Load workflow phases on-demand, showing previews of upcoming work.

## Expected Token Savings

~88% (~7,000 tokens)

## Implementation

Groups 14 phases into 7 logical groups.

```typescript
interface PhaseGroup {
    id: string;
    name: string;
    phases: number[];
    estimatedTokens: number;
    preview: string;
}

interface WorkflowLoadContext {
    currentPhase: number;
    completedPhases: number[];
}

const PHASE_GROUPS: PhaseGroup[] = [
    {
        id: 'requirements',
        name: 'Requirements & Validation',
        phases: [1, 2],
        estimatedTokens: 800,
        preview: 'Generate requirements, validate clarity'
    },
    {
        id: 'design',
        name: 'Architecture & Design',
        phases: [3, 4],
        estimatedTokens: 1200,
        preview: 'High-level architecture, detailed design'
    },
    {
        id: 'planning',
        name: 'Testing & Features',
        phases: [5, 6],
        estimatedTokens: 1000,
        preview: 'Test specifications, feature allocation'
    },
    {
        id: 'dev-core',
        name: 'Core Development',
        phases: [7, 8, 9, 10],  // 7a-7d
        estimatedTokens: 1500,
        preview: 'Branching, task list, development, linting'
    },
    {
        id: 'dev-quality',
        name: 'Quality Assurance',
        phases: [11, 12, 13, 14],  // 7e-7h
        estimatedTokens: 1200,
        preview: 'Review, testing, PR, security'
    },
    {
        id: 'integration',
        name: 'Integration & BDD',
        phases: [15, 16, 17],  // 7i-7k
        estimatedTokens: 1000,
        preview: 'Integration, BDD testing, artifacts'
    },
    {
        id: 'finalize',
        name: 'Finalization',
        phases: [18, 19],  // 7l-7m
        estimatedTokens: 800,
        preview: 'Documentation, user acceptance'
    }
];

class WorkflowLoader {
    async loadForPhase(context: WorkflowLoadContext): Promise<LoadResult> {
        const currentGroup = this.findGroup(context.currentPhase);
        const nextGroup = this.getNextGroup(currentGroup);

        return {
            currentGroup: await this.loadGroup(currentGroup),
            nextGroupPreview: nextGroup ? this.createPreview(nextGroup) : null,
            completedSummaries: this.summarizeCompleted(context.completedPhases)
        };
    }

    private findGroup(phase: number): PhaseGroup {
        return PHASE_GROUPS.find(g => g.phases.includes(phase))!;
    }

    private getNextGroup(current: PhaseGroup): PhaseGroup | null {
        const currentIndex = PHASE_GROUPS.indexOf(current);
        return PHASE_GROUPS[currentIndex + 1] || null;
    }

    private async loadGroup(group: PhaseGroup): Promise<PhaseGroupDetail> {
        // Load detailed phase info for this group
        return {
            ...group,
            phasesDetail: await this.loadPhasesDetail(group.phases)
        };
    }

    private createPreview(group: PhaseGroup): GroupPreview {
        return {
            name: group.name,
            phaseCount: group.phases.length,
            preview: group.preview,
            phases: group.phases
        };
    }

    private summarizeizeCompleted(phases: number[]): CompletedSummary[] {
        // One-line summaries of completed phases
        return phases.map(p => ({
            phase: p,
            summary: getPhaseSummary(p),
            status: 'complete'
        }));
    }
}

interface LoadResult {
    currentGroup: PhaseGroupDetail;
    nextGroupPreview: GroupPreview | null;
    completedSummaries: CompletedSummary[];
}

interface PhaseGroupDetail extends PhaseGroup {
    phasesDetail: PhaseDetail[];
}

interface GroupPreview {
    name: string;
    phaseCount: number;
    preview: string;
    phases: number[];
}

interface CompletedSummary {
    phase: number;
    summary: string;
    status: 'complete';
}
```

## Usage

```typescript
const loader = new WorkflowLoader();

// When starting phase 7c (Development)
const result = await loader.loadForPhase({
    currentPhase: 7,
    completedPhases: [1, 2, 3, 4, 5, 6]
});

// Result contains:
// - Current group (Development Core): phases 7a-7d with details
// - Next preview (Development Quality): phases 7e-7h preview only
// - Completed summaries: one-line for phases 1-6
```

## Phase Summary Template

```typescript
function getPhaseSummary(phase: number): string {
    const SUMMARIES = {
        1: 'Requirements generated and documented',
        2: 'Requirements validated (clear, concise, verifiable)',
        3: 'High-level architecture designed',
        4: 'Detailed design completed (interactions, data models)',
        5: 'Test specifications created',
        6: 'Features allocated from requirements',
        7: 'Branch created',
        8: 'Task list and reference docs created',
        9: 'Feature development complete',
        10: 'Linting passed',
        11: 'Code review complete',
        12: 'Unit tests passed (95% coverage)',
        13: 'Pull request created',
        14: 'Security scan passed',
        15: 'Code integrated',
        16: 'Integration tests passed',
        17: 'BDD tests passed',
        18: 'Artifacts built, docs updated',
        19: 'User acceptance obtained'
    };
    return SUMMARIES[phase];
}
```

## Preview Display

```markdown
## Current Phase: 7c - Development

[Active agent: TypeScript Coding Agent]
[Progress: Implementation in progress...]
```

```markdown
## Coming Next: Development Quality Phases

This group includes 4 phases (7e-7h):

- **7e: Code Review** - QA Agent reviews implementation
- **7f: Unit Testing** - Testing Agent verifies 95% coverage
- **7g: Pull Request** - Git Expert creates PR
- **7h: Security Check** - Security Expert scans for vulnerabilities

[Full details will load when starting this group]
```

## Token Savings

| Load Strategy | Tokens | Savings |
|---------------|---------|----------|
| Load all 14 phases upfront | ~8,000 | 0% |
| Load current group only | ~1,500 | 81% |
| Load current + preview next | ~1,000 | **~88%** |

## Configuration

Edit workflow loading in `workflow-loader.config.json`:

```json
{
    "loadStrategy": "jit-preview",
    "previewLength": "short",
    "completedSummaryLength": "one-line",
    "cacheLoadedGroups": true
}
```
