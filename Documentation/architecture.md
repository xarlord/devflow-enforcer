# DevFlow Enforcer - Architecture Design

## Overview
DevFlow Enforcer is a Claude Code plugin that implements a documentation-driven software development workflow with enforced quality gates and specialized agents.

## Plugin Architecture

### Component Structure
```
devflow-enforcer/
├── agents/              # Specialized agent implementations
│   ├── project-lead/    # Orchestrates workflow, enforces process
│   ├── qa/             # Quality assurance
│   ├── testing/        # Test execution and validation
│   ├── architect/      # System/Software architecture
│   ├── git-expert/     # Git operations
│   ├── security/       # Security reviews
│   ├── retrospective/  # Lessons-learned management
│   └── coders/         # Tech stack specific coding agents
│       ├── typescript/
│       └── python/
├── workflows/           # Workflow definitions
│   ├── main-workflow.md
│   └── phase-workflows/
├── skills/             # Reusable skills
├── slash-commands/     # User-invocable commands
├── docs/               # Documentation templates
│   ├── lessons-learned.md
│   ├── findings.md
│   └── task-status.md
└── core/               # Core orchestration engine
    ├── workflow-enforcer.ts
    ├── context-manager.ts
    └── documentation-manager.ts
```

## Agent Hierarchy

### 1. Project Lead Agent (PRIMARY ENFORCER)
**Responsibilities:**
- Orchestrates entire workflow
- Enforces process compliance (CRITICAL - requirement #23)
- Spawns appropriate agents for each phase
- Ensures no phase is skipped
- Validates findings closure before proceeding

**Always Spawns:**
- System/Software Architect for requirements/design phases
- QA Agent and Testing Agent for testing phases
- Other specialists as needed

### 2. System/Software Architect Agent
**Responsibilities:**
- High-level architecture design
- Data model design
- Interaction design
- Functional specifications
- Requirements validation

### 3. QA Agent
**Responsibilities:**
- Quality process enforcement
- Requirements verification
- Documentation completeness checks
- Consistency validation

### 4. Testing Agent
**Responsibilities:**
- Test specification creation
- Test execution oversight
- Coverage verification (95% requirement)
- Pass rate validation (100% requirement)
- BDD testing coordination

### 5. Git Expert Agent
**Responsibilities:**
- Branch creation per feature
- Pull request creation
- Merge operations
- Rebase operations
- Push/pull operations

### 6. Security Expert Agent
**Responsibilities:**
- Security reviews
- Static analysis coordination
- Vulnerability scanning
- Security best practices enforcement

### 7. Retrospective Agent
**Responsibilities:**
- Collect findings from wrongly implemented features
- Log lessons-learned (what went wrong, how fixed, status)
- Maintain lessons-learned document
- Keep lessons-learned under 10% of context window
- Prioritize important lessons when limit reached

### 8. Tech Stack Coding Agents
**Types:**
- TypeScript/JavaScript Coding Agent
- Python Coding Agent
- (Extensible for more stacks)

**Responsibilities:**
- Feature implementation
- Test code development
- Linting checks
- Code quality compliance

## Main Workflow Pipeline

```
┌─────────────────────────────────────────────────────────────────────┐
│                     DEVFLOW ENFORCER WORKFLOW                       │
│                    (Enforced by Project Lead Agent)                │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│ PHASE 1: Requirements Generation                                     │
│ - Generate requirements from user input                             │
│ - [Agent: Project Lead + System/Software Architect]                │
│ - Creates findings for requirements phase                           │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│ PHASE 2: Validation & Consistency Check                             │
│ - Validate requirements clarity, conciseness, verifiability          │
│ - Check for vague definitions (avoid per requirement #12)           │
│ - [Agent: Project Lead + QA Agent]                                  │
│ - Enforces findings closure before proceeding                      │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│ PHASE 3: High Level Architecture Design                            │
│ - Design system architecture                                        │
│ - [Agent: Project Lead + System/Software Architect]                │
│ - Creates findings for architecture phase                           │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│ PHASE 4: Detailed Design                                            │
│ - Design Interactions                                               │
│ - Design Data Models                                                │
│ - Design Functional Specifications                                  │
│ - [Agent: Project Lead + System/Software Architect]                │
│ - Creates findings for design phase                                 │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│ PHASE 5: Testing Specification                                      │
│ - Create comprehensive testing specification                        │
│ - [Agent: Project Lead + Testing Agent]                            │
│ - Creates findings for testing spec phase                           │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│ PHASE 6: Feature Creation & Allocation                              │
│ - Create features from requirements                                 │
│ - Allocate requirements to features                                 │
│ - [Agent: Project Lead + System/Software Architect]                │
│ - Creates findings for feature allocation phase                    │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│ FOR EACH FEATURE (Iterative Loop)                                   │
│ ┌─────────────────────────────────────────────────────────────────┐ │
│ │ STEP 1: Branch Creation                                         │ │
│ │ - Create feature branch                                         │ │
│ │ - [Agent: Git Expert]                                          │ │
│ └─────────────────────────────────────────────────────────────────┘ │
│                              │                                        │
│                              ▼                                        │
│ │ ┌─────────────────────────────────────────────────────────────────┐ │
│ │ │ STEP 2: Task List & Reference Docs                            │ │
│ │ │ - Create detailed task list for feature                        │ │
│ │ │ - Create reference documentation                               │ │
│ │ │ - [Agent: Project Lead]                                       │ │
│ │ └─────────────────────────────────────────────────────────────────┘ │
│ │                              │                                        │
│ │                              ▼                                        │
│ │ ┌─────────────────────────────────────────────────────────────────┐ │
│ │ │ STEP 3: Development                                            │ │
│ │ │ - Develop functional code                                      │ │
│ │ │ - Develop testing code                                        │ │
│ │ │ - [Agent: Tech Stack Coding Agent(s)]                          │ │
│ │ │ - Checks lessons-learned BEFORE starting (requirement #25)     │ │
│ │ └─────────────────────────────────────────────────────────────────┘ │
│ │                              │                                        │
│ │                              ▼                                        │
│ │ ┌─────────────────────────────────────────────────────────────────┐ │
│ │ │ STEP 4: Linting Check                                         │ │
│ │ │ - Run linting tools                                           │ │
│ │ │ - Fix linting issues                                          │ │
│ │ │ - [Agent: Tech Stack Coding Agent]                             │ │
│ │ └─────────────────────────────────────────────────────────────────┘ │
│ │                              │                                        │
│ │                              ▼                                        │
│ │ ┌─────────────────────────────────────────────────────────────────┐ │
│ │ │ STEP 5: Code Review                                           │ │
│ │ │ - Review code quality                                         │ │
│ │ │ - Review against requirements                                 │ │
│ │ │ - [Agent: QA Agent]                                           │ │
│ │ └─────────────────────────────────────────────────────────────────┘ │
│ │                              │                                        │
│ │                              ▼                                        │
│ │ ┌─────────────────────────────────────────────────────────────────┐ │
│ │ │ STEP 6: Unit Testing                                          │ │
│ │ │ - Execute unit tests                                          │ │
│ │ │ - Verify 95% coverage (requirement)                           │ │
│ │ │ - Verify 100% pass rate (requirement)                          │ │
│ │ │ - [Agent: Testing Agent + Tech Stack Coding Agent]            │ │
│ │ │ - Loop until metrics satisfied                                 │ │
│ │ └─────────────────────────────────────────────────────────────────┘ │
│ │                              │                                        │
│ │                              ▼                                        │
│ │ ┌─────────────────────────────────────────────────────────────────┐ │
│ │ │ STEP 7: Pull Request Creation                                 │ │
│ │ │ - Create PR                                                   │ │
│ │ │ - [Agent: Git Expert]                                         │ │
│ │ └─────────────────────────────────────────────────────────────────┘ │
│ │                              │                                        │
│ │                              ▼                                        │
│ │ ┌─────────────────────────────────────────────────────────────────┐ │
│ │ │ STEP 8: Static Analysis & Security Check                      │ │
│ │ │ - Run static analysis                                         │ │
│ │ │ - Run security scans                                          │ │
│ │ │ - [Agent: Security Expert]                                    │ │
│ │ └─────────────────────────────────────────────────────────────────┘ │
│ │                              │                                        │
│ │                              ▼                                        │
│ │ ┌─────────────────────────────────────────────────────────────────┐ │
│ │ │ STEP 9: Build/Integrate Code                                  │ │
│ │ │ - Build the code                                             │ │
│ │ │ - Integrate with main codebase                                │ │
│ │ │ - [Agent: Tech Stack Coding Agent + Git Expert]               │ │
│ │ └─────────────────────────────────────────────────────────────────┘ │
│ │                              │                                        │
│ │                              ▼                                        │
│ │ ┌─────────────────────────────────────────────────────────────────┐ │
│ │ │ STEP 10: Integration Testing                                  │ │
│ │ │ - Run integration tests                                       │ │
│ │ │ - Verify integrations work correctly                           │ │
│ │ │ - [Agent: Testing Agent]                                      │ │
│ │ └─────────────────────────────────────────────────────────────────┘ │
│ │                              │                                        │
│ │                              ▼                                        │
│ │ ┌─────────────────────────────────────────────────────────────────┐ │
│ │ │ STEP 11: BDD Testing                                         │ │
│ │ │ - Stage to real world scenario                                │ │
│ │ │ - Execute BDD tests                                          │ │
│ │ │ - [Agent: Testing Agent + QA Agent]                           │ │
│ │ └─────────────────────────────────────────────────────────────────┘ │
│ │                              │                                        │
│ │                              ▼                                        │
│ │ ┌─────────────────────────────────────────────────────────────────┐ │
│ │ │ STEP 12: Build Artifacts & Update Docs                        │ │
│ │ │ - Build release artifacts                                     │ │
│ │ │ - Update documentation                                       │ │
│ │ │ - [Agent: Tech Stack Coding Agent + Project Lead]             │ │
│ │ └─────────────────────────────────────────────────────────────────┘ │
│ │                              │                                        │
│ │                              ▼                                        │
│ │ ┌─────────────────────────────────────────────────────────────────┐ │
│ │ │ STEP 13: User Acceptance Testing                             │ │
│ │ │ - Request user testing                                       │ │
│ │ │ - Verify user satisfaction                                    │ │
│ │ │ - [Agent: QA Agent + Project Lead]                            │ │
│ │ └─────────────────────────────────────────────────────────────────┘ │
│ │                              │                                        │
│ │                              ▼                                        │
│ │ ┌─────────────────────────────────────────────────────────────────┐ │
│ │ │ QUALITY GATE CHECK                                           │ │
│ │ │ - All tests pass?                                            │ │
│ │ │ - Coverage met?                                               │ │
│ │ │ - Security checks pass?                                      │ │
│ │ │ - User satisfied?                                            │ │
│ │ │ - If NO → Loop back to appropriate step                       │ │
│ │ │ - [Agent: Project Lead - enforcement]                        │ │
│ │ └─────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│ RETROSPECTIVE (After each feature/phase)                           │
│ - Retrospective Agent collects findings                            │
│ - Logs lessons-learned for wrong implementations                  │
│ - Maintains lessons-learned doc under 10% context                 │
│ - All agents check lessons-learned before starting work           │
└─────────────────────────────────────────────────────────────────────┘
```

## Workflow Enforcement Mechanism

### The Enforcement Engine (Core)
The workflow enforcement is implemented in `core/workflow-enforcer.ts`:

```typescript
interface WorkflowState {
  currentPhase: Phase;
  currentFeature?: string;
  findings: Finding[];
  contextUsage: number;  // Track for <5% threshold
}

class WorkflowEnforcer {
  // Ensures no phase is skipped
  enforcePhaseOrder(current: Phase, next: Phase): boolean;

  // Ensures findings are closed before proceeding
  enforceFindingsClosure(findings: Finding[]): boolean;

  // Manages context window (requirement #19)
  manageContextWindow(usage: number): void;

  // Spawns appropriate agents per phase
  spawnAgents(phase: Phase): Agent[];
}
```

### Context Window Management (Requirement #19)

When context window < 5%:
1. Update all documentation files
2. Clear context window
3. Reconstruct from documentation files

## Documentation Structure

### 1. lessons-learned.md
- Max 10% of context window (requirement #26)
- Managed by Retrospective Agent
- Format:
  ```markdown
  ## [Date] - [Feature/Phase]
  - **Problem:** What went wrong
  - **Cause:** Root cause analysis
  - **Solution:** How it was fixed
  - **Status:** Open/Closed
  - **Priority:** High/Medium/Low
  ```

### 2. findings.md
- Created for each phase
- Must be closed before proceeding
- Assigned to responsible agent
- Format:
  ```markdown
  ## [Phase] Findings
  | ID | Description | Assigned To | Status |
  |----|-------------|-------------|--------|
  ```

### 3. task-status.md
- Tracks all tasks across features
- Format:
  ```markdown
  ## [Feature Name]
  | Task | Assigned To | Status | Notes |
  |------|-------------|--------|-------|
  ```

## Slash Commands

| Command | Description |
|---------|-------------|
| `/devflow-start` | Start new project (asks app name, inits git) |
| `/devflow-status` | Show current workflow status |
| `/devflow-lessons` | Show lessons-learned |
| `/devflow-findings` | Show open findings |
| `/devflow-continue` | Continue workflow after interruption |

## Critical Design Principles

1. **PROCESS ENFORCEMENT IS PARAMOUNT** (requirement #23)
   - Project Lead Agent MUST enforce workflow
   - No phase can be skipped
   - Findings MUST be closed before proceeding

2. **NEVER ASSUME** (requirement #13)
   - Always check environment
   - Always verify technology
   - Always verify code
   - Prompt user if unsure

3. **CLARITY IN REQUIREMENTS** (requirement #12)
   - Requirements must be clear, concise, verifiable
   - No vague definitions allowed

4. **QUALITY GATES** (requirement #17)
   - 95% unit test coverage (requirement)
   - 100% test pass rate (requirement)
   - Security checks must pass
   - Loop until metrics satisfied

5. **LESSONS LEARNED** (requirements #24, #25, #26)
   - Agents check lessons-learned before starting work
   - Retrospective Agent maintains document
   - Max 10% of context window
   - Priority-based pruning when limit reached
