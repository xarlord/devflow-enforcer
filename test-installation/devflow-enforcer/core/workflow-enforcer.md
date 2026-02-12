# Workflow Enforcer Engine

## Overview

The Workflow Enforcer Engine is the core component that ensures the DevFlow Enforcer workflow is followed at all times. It implements the enforcement logic defined by the Project Lead Agent.

## Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                    Workflow Enforcer Engine                         │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐     │
│  │ Phase Manager    │  │ Agent Manager   │  │ Findings Manager│     │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘     │
│           │                    │                    │                │
│           └────────────────────┴────────────────────┘               │
│                           │                                          │
│                           ▼                                          │
│                  ┌─────────────────┐                                  │
│                  │ State Machine   │                                  │
│                  └─────────────────┘                                  │
│                           │                                          │
│                           ▼                                          │
│                  ┌─────────────────┐                                  │
│                  │ Quality Gate     │                                  │
│                  │ Validator       │                                  │
│                  └─────────────────┘                                  │
│                           │                                          │
│                           ▼                                          │
│                  ┌─────────────────┐                                  │
│                  │ Context         │                                  │
│                  │ Manager         │                                  │
│                  └─────────────────┘                                  │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
```

## Core Components

### 1. Phase Manager

Manages the 14-stage workflow phases.

```typescript
// Phase Definition
interface Phase {
  id: string;
  name: string;
  order: number;
  required: boolean;
  spawns: AgentType[];
  createsFindings: boolean;
  qualityGates: QualityGate[];
}

// All Workflow Phases
const WORKFLOW_PHASES: Phase[] = [
  {
    id: "requirements",
    name: "Requirements Generation",
    order: 1,
    required: true,
    spawns: ["system-architect"],
    createsFindings: true,
    qualityGates: []
  },
  {
    id: "validation",
    name: "Validation & Consistency Check",
    order: 2,
    required: true,
    spawns: ["qa"],
    createsFindings: true,
    qualityGates: ["requirements-clear", "requirements-concise", "requirements-verifiable"]
  },
  {
    id: "hla-design",
    name: "High Level Architecture Design",
    order: 3,
    required: true,
    spawns: ["system-architect"],
    createsFindings: true,
    qualityGates: []
  },
  {
    id: "detailed-design",
    name: "Detailed Design",
    order: 4,
    required: true,
    spawns: ["system-architect"],
    createsFindings: true,
    qualityGates: []
  },
  {
    id: "testing-spec",
    name: "Testing Specification",
    order: 5,
    required: true,
    spawns: ["testing"],
    createsFindings: true,
    qualityGates: []
  },
  {
    id: "feature-allocation",
    name: "Feature Creation & Allocation",
    order: 6,
    required: true,
    spawns: ["system-architect"],
    createsFindings: true,
    qualityGates: []
  },
  // Feature phases (7a-7m) are handled per feature
  {
    id: "branch-creation",
    name: "Create Branch",
    order: 7,
    required: true,
    spawns: ["git-expert"],
    createsFindings: false,
    qualityGates: []
  },
  {
    id: "task-list",
    name: "Create Task List & Docs",
    order: 8,
    required: true,
    spawns: [],
    createsFindings: false,
    qualityGates: []
  },
  {
    id: "development",
    name: "Development",
    order: 9,
    required: true,
    spawns: ["coding-agent"],
    createsFindings: true,
    qualityGates: []
  },
  {
    id: "linting",
    name: "Linting Check",
    order: 10,
    required: true,
    spawns: [],
    createsFindings: false,
    qualityGates: ["no-lint-errors"]
  },
  {
    id: "code-review",
    name: "Code Review",
    order: 11,
    required: true,
    spawns: ["qa"],
    createsFindings: true,
    qualityGates: []
  },
  {
    id: "unit-testing",
    name: "Unit Testing",
    order: 12,
    required: true,
    spawns: ["testing", "coding-agent"],
    createsFindings: true,
    qualityGates: ["coverage-95", "pass-rate-100"]
  },
  {
    id: "pull-request",
    name: "Create Pull Request",
    order: 13,
    required: true,
    spawns: ["git-expert"],
    createsFindings: false,
    qualityGates: []
  },
  {
    id: "static-security",
    name: "Static Analysis & Security Check",
    order: 14,
    required: true,
    spawns: ["security"],
    createsFindings: true,
    qualityGates: ["no-critical-vulnerabilities"]
  },
  {
    id: "build-integrate",
    name: "Build/Integrate Code",
    order: 15,
    required: true,
    spawns: ["coding-agent", "git-expert"],
    createsFindings: false,
    qualityGates: []
  },
  {
    id: "integration-testing",
    name: "Integration Testing",
    order: 16,
    required: true,
    spawns: ["testing"],
    createsFindings: true,
    qualityGates: ["integration-pass"]
  },
  {
    id: "bdd-testing",
    name: "BDD Testing",
    order: 17,
    required: true,
    spawns: ["testing", "qa"],
    createsFindings: true,
    qualityGates: ["bdd-pass"]
  },
  {
    id: "artifacts-docs",
    name: "Build Artifacts & Update Docs",
    order: 18,
    required: true,
    spawns: [],
    createsFindings: false,
    qualityGates: []
  },
  {
    id: "user-acceptance",
    name: "User Acceptance Testing",
    order: 19,
    required: true,
    spawns: ["qa"],
    createsFindings: true,
    qualityGates: ["user-satisfied"]
  }
];

class PhaseManager {
  private currentPhase: Phase;
  private phaseHistory: Phase[];

  constructor() {
    this.currentPhase = WORKFLOW_PHASES[0];
    this.phaseHistory = [];
  }

  // Enforce phase order - cannot skip phases
  canTransitionTo(phaseId: string): boolean {
    const targetPhase = WORKFLOW_PHASES.find(p => p.id === phaseId);
    if (!targetPhase) return false;

    // Must be next phase or a previous phase (for corrections)
    const currentOrder = this.currentPhase.order;
    const targetOrder = targetPhase.order;

    return targetOrder === currentOrder + 1 || targetOrder <= currentOrder;
  }

  transitionTo(phaseId: string): void {
    if (!this.canTransitionTo(phaseId)) {
      throw new Error(`Cannot transition to ${phaseId} from ${this.currentPhase.id}. Workflow enforcement violated.`);
    }

    this.phaseHistory.push(this.currentPhase);
    this.currentPhase = WORKFLOW_PHASES.find(p => p.id === phaseId)!;
  }

  getCurrentPhase(): Phase {
    return this.currentPhase;
  }

  getRequiredAgents(): AgentType[] {
    return this.currentPhase.spawns;
  }

  createsFindings(): boolean {
    return this.currentPhase.createsFindings;
  }

  getQualityGates(): QualityGate[] {
    return this.currentPhase.qualityGates;
  }
}
```

### 2. Agent Manager

Spawns and manages specialized agents.

```typescript
type AgentType =
  | "project-lead"
  | "qa"
  | "testing"
  | "system-architect"
  | "git-expert"
  | "security"
  | "retrospective"
  | "coding-typescript"
  | "coding-python";

interface AgentSpawnRequest {
  agentType: AgentType;
  task: string;
  context: Record<string, any>;
}

class AgentManager {
  // Spawn appropriate agent for the task
  async spawnAgent(request: AgentSpawnRequest): Promise<AgentResult> {
    // Check lessons-learned before spawning (requirement #25)
    await this.checkLessonsLearned(request.agentType);

    // Spawn the agent
    const agent = this.getAgent(request.agentType);
    const result = await agent.execute(request.task, request.context);

    return result;
  }

  // All agents must check lessons-learned before starting work
  private async checkLessonsLearned(agentType: AgentType): Promise<void> {
    const lessonsLearned = await this.readLessonsLearned();

    // Filter relevant lessons for this agent type
    const relevantLessons = lessonsLearned.filter(
      lesson => lesson.tags.includes(agentType) || lesson.priority === "High"
    );

    // Provide to agent before execution
    return relevantLessons;
  }

  private getAgent(type: AgentType): Agent {
    switch (type) {
      case "project-lead":
        return new ProjectLeadAgent();
      case "qa":
        return new QAAgent();
      case "testing":
        return new TestingAgent();
      case "system-architect":
        return new SystemArchitectAgent();
      case "git-expert":
        return new GitExpertAgent();
      case "security":
        return new SecurityExpertAgent();
      case "retrospective":
        return new RetrospectiveAgent();
      case "coding-typescript":
        return new TypeScriptCodingAgent();
      case "coding-python":
        return new PythonCodingAgent();
      default:
        throw new Error(`Unknown agent type: ${type}`);
    }
  }
}
```

### 3. Findings Manager

Creates and manages findings for each phase.

```typescript
interface Finding {
  id: string;
  phase: string;
  description: string;
  severity: "Critical" | "High" | "Medium" | "Low";
  assignedTo: AgentType;
  status: "Open" | "In Progress" | "Closed";
  createdAt: Date;
  resolvedAt?: Date;
}

class FindingsManager {
  private findings: Finding[] = [];

  // Create findings for a phase
  createFindings(phase: string): void {
    const findings: Finding[] = [
      {
        id: this.generateId(),
        phase,
        description: `${phase} phase completion`,
        severity: "High",
        assignedTo: this.getAgentForPhase(phase),
        status: "Open",
        createdAt: new Date()
      }
    ];

    this.findings.push(...findings);
    this.writeFindingsToFile(phase, findings);
  }

  // Check if all findings for a phase are closed
  areFindingsClosed(phase: string): boolean {
    const phaseFindings = this.findings.filter(f => f.phase === phase);
    return phaseFindings.every(f => f.status === "Closed");
  }

  // Close a finding
  closeFinding(findingId: string): void {
    const finding = this.findings.find(f => f.id === findingId);
    if (finding) {
      finding.status = "Closed";
      finding.resolvedAt = new Date();
      this.updateFindingsFile(finding.phase);
    }
  }

  // Enforce findings closure before proceeding (requirement #11)
  enforceFindingsClosure(phase: string): void {
    if (!this.areFindingsClosed(phase)) {
      throw new Error(
        `Cannot proceed. ${phase} has open findings that must be closed first.`
      );
    }
  }

  private getAgentForPhase(phase: string): AgentType {
    // Return appropriate agent for phase
    const phaseDef = WORKFLOW_PHASES.find(p => p.id === phase);
    return phaseDef?.spawns[0] || "project-lead";
  }
}
```

### 4. Quality Gate Validator

Validates quality metrics before allowing phase transitions.

```typescript
type QualityGate =
  | "requirements-clear"
  | "requirements-concise"
  | "requirements-verifiable"
  | "no-lint-errors"
  | "coverage-95"
  | "pass-rate-100"
  | "no-critical-vulnerabilities"
  | "integration-pass"
  | "bdd-pass"
  | "user-satisfied";

interface QualityMetric {
  gate: QualityGate;
  target: string | number;
  actual: string | number;
  passed: boolean;
}

class QualityGateValidator {
  // Validate all quality gates for current phase
  async validateGates(gates: QualityGate[]): Promise<QualityResult> {
    const results: QualityMetric[] = [];

    for (const gate of gates) {
      const result = await this.validateGate(gate);
      results.push(result);
    }

    const allPassed = results.every(r => r.passed);

    return {
      passed: allPassed,
      metrics: results,
      // If not all passed, indicate which phase to loop back to
      loopBackTo: allPassed ? null : this.determineLoopBackPhase(results)
    };
  }

  private async validateGate(gate: QualityGate): Promise<QualityMetric> {
    switch (gate) {
      case "coverage-95":
        return await this.validateCoverage(95);

      case "pass-rate-100":
        return await this.validatePassRate(100);

      case "no-lint-errors":
        return await this.validateLinting();

      case "no-critical-vulnerabilities":
        return await this.validateSecurity();

      default:
        return { gate, target: "N/A", actual: "N/A", passed: true };
    }
  }

  private async validateCoverage(target: number): Promise<QualityMetric> {
    // Run coverage check
    const coverage = await this.runCoverageCheck();

    return {
      gate: "coverage-95",
      target: `${target}%`,
      actual: `${coverage}%`,
      passed: coverage >= target
    };
  }

  private async validatePassRate(target: number): Promise<QualityMetric> {
    // Run tests and check pass rate
    const passRate = await this.runTests();

    return {
      gate: "pass-rate-100",
      target: `${target}%`,
      actual: `${passRate}%`,
      passed: passRate >= target
    };
  }

  // Determine which phase to loop back to if gates fail
  private determineLoopBackPhase(results: QualityMetric[]): string | null {
    const failed = results.filter(r => !r.passed);

    // Map quality gates back to phases
    const gateToPhase: Record<QualityGate, string> = {
      "coverage-95": "development",
      "pass-rate-100": "development",
      "no-lint-errors": "linting",
      "no-critical-vulnerabilities": "static-security",
      "integration-pass": "integration-testing",
      "bdd-pass": "bdd-testing",
      "user-satisfied": "user-acceptance",
      "requirements-clear": "validation",
      "requirements-concise": "validation",
      "requirements-verifiable": "validation"
    };

    // Return the earliest phase that needs to be revisited
    for (const f of failed) {
      const phase = gateToPhase[f.gate];
      if (phase) return phase;
    }

    return null;
  }
}
```

### 5. Context Manager

Manages context window and handles reconstruction when < 5%.

```typescript
class ContextManager {
  private CONTEXT_THRESHOLD = 0.05; // 5%

  // Check if context window is running low
  async checkContextWindow(): Promise<boolean> {
    const usage = await this.getContextUsage();
    return usage < this.CONTEXT_THRESHOLD;
  }

  // Handle low context (requirement #19)
  async handleLowContext(): Promise<void> {
    if (await this.checkContextWindow()) {
      // Update all documentation
      await this.updateAllDocumentation();

      // Clear context
      await this.clearContext();

      // Reconstruct from documentation
      await this.reconstructContext();
    }
  }

  private async updateAllDocumentation(): Promise<void> {
    // Save current state to files
    await this.saveCurrentPhase();
    await this.saveFindings();
    await this.saveTaskStatus();
    await this.saveDecisions();
  }

  private async reconstructContext(): Promise<void> {
    // Read state from files
    const taskPlan = await this.readFile("task_plan.md");
    const findings = await this.readFile("findings.md");
    const progress = await this.readFile("progress.md");
    const architecture = await this.readFile("docs/architecture.md");
    const lessonsLearned = await this.readFile("templates/lessons-learned.md");

    // Provide to agent for reconstruction
    return { taskPlan, findings, progress, architecture, lessonsLearned };
  }
}
```

## Main Workflow Orchestrator

```typescript
class WorkflowOrchestrator {
  private phaseManager: PhaseManager;
  private agentManager: AgentManager;
  private findingsManager: FindingsManager;
  private qualityValidator: QualityGateValidator;
  private contextManager: ContextManager;

  async executeWorkflow(): Promise<void> {
    // Check context window at start
    await this.contextManager.handleLowContext();

    // For each phase in workflow
    for (const phase of WORKFLOW_PHASES) {
      await this.executePhase(phase);
    }
  }

  private async executePhase(phase: Phase): Promise<void> {
    console.log(`Executing Phase: ${phase.name}`);

    // Create findings if required
    if (phase.createsFindings) {
      this.findingsManager.createFindings(phase.id);
    }

    // Spawn required agents
    for (const agentType of phase.spawns) {
      await this.agentManager.spawnAgent({
        agentType,
        task: phase.name,
        context: { phase: phase.id }
      });
    }

    // Enforce findings closure before proceeding
    if (phase.createsFindings) {
      this.findingsManager.enforceFindingsClosure(phase.id);
    }

    // Validate quality gates
    if (phase.qualityGates.length > 0) {
      const result = await this.qualityValidator.validateGates(phase.qualityGates);

      if (!result.passed) {
        // Loop back to failed phase
        console.log(`Quality gates failed. Looping back to: ${result.loopBackTo}`);
        await this.loopBackTo(result.loopBackTo!);
        return;
      }
    }

    // Move to next phase
    this.phaseManager.transitionTo(phase.id);
  }

  private async loopBackTo(phaseId: string): Promise<void> {
    // Find the phase and reset to it
    const targetPhase = WORKFLOW_PHASES.find(p => p.id === phaseId)!;
    this.phaseManager.transitionTo(phaseId);

    // Re-execute from that phase
    await this.executePhase(targetPhase);
  }
}
```

## Integration with Claude Code

The Workflow Enforcer integrates with Claude Code via:

1. **Hooks:** Session start, command execution, context changes
2. **Skills:** Reusable workflow actions
3. **Slash Commands:** User-invocable workflow controls

### Slash Commands

```typescript
// /devflow-start - Start new project
{
  name: "devflow-start",
  handler: async () => {
    const orchestrator = new WorkflowOrchestrator();
    await orchestrator.executeWorkflow();
  }
}

// /devflow-status - Show current status
{
  name: "devflow-status",
  handler: async () => {
    const phase = phaseManager.getCurrentPhase();
    const findings = findingsManager.getOpenFindings();
    return { phase, findings };
  }
}

// /devflow-continue - Continue after interruption
{
  name: "devflow-continue",
  handler: async () => {
    const orchestrator = new WorkflowOrchestrator();
    await orchestrator.resumeWorkflow();
  }
}
```

## Enforcement Policies

### Non-negotiable Rules

1. **No Phase Skipping**
   - PhaseManager enforces strict order
   - Throws error if attempting to skip

2. **Findings Must Close**
   - FindingsManager blocks transition until findings closed
   - Enforced before each phase transition

3. **Quality Gates Must Pass**
   - QualityGateValidator loops back to failed phase
   - No exceptions

4. **Context Management**
   - ContextManager proactively manages window
   - Auto-saves and reconstructs when < 5%

### Error Handling Strategy

When errors occur:

```
ERROR → Log to Findings → Assign to Agent → Fix → Retries
              ↓
         If retries exhausted
              ↓
         Ask user for direction (requirement #13)
```

## State Persistence

All workflow state is persisted to disk:

- `task_plan.md` - Current phase, progress
- `findings.md` - Open findings, assignments
- `progress.md` - Session log, actions taken
- `templates/lessons-learned.md` - Lessons learned

This enables workflow recovery after interruptions.
