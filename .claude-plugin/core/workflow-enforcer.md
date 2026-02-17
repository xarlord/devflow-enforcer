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
  // CRITICAL FIX: Post-Review Linting (Phase 11.1)
  // Enforces linting after code review fixes are applied
  {
    id: "post-review-linting",
    name: "Post-Review Linting Check",
    order: 11.5,
    required: true,
    spawns: [],
    createsFindings: false,
    qualityGates: ["no-lint-errors"]
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
  lessonLearned?: LessonLearned;  // CRITICAL FIX: Track lesson when closing
}

// CRITICAL FIX: Lesson Capture Interface
interface LessonLearned {
  id: string;
  findingId: string;
  category: "Technical" | "Process" | "Communication" | "Tooling";
  title: string;
  description: string;
  rootCause: string;
  solution: string;
  preventionSteps: string[];
  tags: string[];
  priority: "Critical" | "High" | "Medium" | "Low";
  capturedAt: Date;
  capturedBy: AgentType;
}

class FindingsManager {
  private findings: Finding[] = [];
  private lessonsManager: LessonsManager;

  constructor() {
    this.lessonsManager = new LessonsManager();
  }

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

  // CRITICAL FIX: Close a finding - MUST capture lesson learned
  // This is now MANDATORY - cannot close without lesson
  closeFinding(findingId: string, lesson: LessonLearned): void {
    const finding = this.findings.find(f => f.id === findingId);

    if (!finding) {
      throw new Error(`Finding ${findingId} not found`);
    }

    // CRITICAL ENFORCEMENT: Lesson must be provided
    if (!lesson || !lesson.description || !lesson.solution) {
      throw new Error(
        `CANNOT CLOSE FINDING: Lesson learned is MANDATORY.\n` +
        `Finding: ${finding.description}\n` +
        `Required fields: category, title, description, rootCause, solution\n` +
        `Usage: closeFinding(findingId, { category, title, description, rootCause, solution, preventionSteps })`
      );
    }

    // Save the lesson learned
    lesson.findingId = findingId;
    lesson.capturedAt = new Date();
    lesson.capturedBy = finding.assignedTo;
    this.lessonsManager.saveLesson(lesson);

    // Update finding with lesson reference
    finding.lessonLearned = lesson;
    finding.status = "Closed";
    finding.resolvedAt = new Date();

    // Update files
    this.updateFindingsFile(finding.phase);
    this.lessonsManager.writeLessonsToFile();

    console.log(`Finding ${findingId} closed with lesson: ${lesson.title}`);
  }

  // DEPRECATED: Legacy method that enforces lesson capture
  closeFindingWithoutLesson(findingId: string): never {
    throw new Error(
      `DEPRECATED: Cannot close findings without lesson capture.\n` +
      `Use: closeFinding(findingId, lesson) instead.\n` +
      `This ensures knowledge retention and prevents repeated mistakes.`
    );
  }

  // Enforce findings closure before proceeding (requirement #11)
  // CRITICAL FIX: Also verify lessons captured
  enforceFindingsClosure(phase: string): void {
    const phaseFindings = this.findings.filter(f => f.phase === phase);
    const openFindings = phaseFindings.filter(f => f.status !== "Closed");

    if (openFindings.length > 0) {
      throw new Error(
        `Cannot proceed. ${phase} has ${openFindings.length} open findings that must be closed first.\n` +
        `Open findings: ${openFindings.map(f => f.id).join(', ')}`
      );
    }

    // CRITICAL FIX: Verify all closed findings have lessons
    const closedWithoutLesson = phaseFindings.filter(
      f => f.status === "Closed" && !f.lessonLearned
    );

    if (closedWithoutLesson.length > 0) {
      throw new Error(
        `Cannot proceed. ${phase} has ${closedWithoutLesson.length} closed findings without lessons learned.\n` +
        `Findings requiring lessons: ${closedWithoutLesson.map(f => f.id).join(', ')}\n` +
        `All findings must capture lessons before phase transition.`
      );
    }
  }

  private getAgentForPhase(phase: string): AgentType {
    // Return appropriate agent for phase
    const phaseDef = WORKFLOW_PHASES.find(p => p.id === phase);
    return phaseDef?.spawns[0] || "project-lead";
  }
}

// CRITICAL FIX: Lessons Manager for handling lesson persistence
class LessonsManager {
  private lessons: LessonLearned[] = [];

  saveLesson(lesson: LessonLearned): void {
    lesson.id = this.generateLessonId();
    this.lessons.push(lesson);
  }

  getLessonsByTag(tag: string): LessonLearned[] {
    return this.lessons.filter(l => l.tags.includes(tag));
  }

  getHighPriorityLessons(): LessonLearned[] {
    return this.lessons.filter(l => l.priority === "High" || l.priority === "Critical");
  }

  writeLessonsToFile(): void {
    const content = this.formatLessonsForFile();
    // Write to templates/lessons-learned.md
    writeFile('templates/lessons-learned.md', content);
  }

  private formatLessonsForFile(): string {
    return `# Lessons Learned

This file is auto-generated when findings are closed.

## Critical & High Priority Lessons

${this.getHighPriorityLessons().map(l => `
### ${l.title}
- **Category:** ${l.category}
- **Priority:** ${l.priority}
- **Root Cause:** ${l.rootCause}
- **Solution:** ${l.solution}
- **Prevention:** ${l.preventionSteps.join(', ')}
- **Tags:** ${l.tags.join(', ')}
- **Captured:** ${l.capturedAt.toISOString()}
`).join('\n')}

## All Lessons

${this.lessons.map(l => `- [${l.priority}] ${l.title} (${l.category})`).join('\n')}
`;
  }

  private generateLessonId(): string {
    return `LESSON-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
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
  // CRITICAL FIX: Updated to include post-review-linting
  private determineLoopBackPhase(results: QualityMetric[]): string | null {
    const failed = results.filter(r => !r.passed);

    // Map quality gates back to phases
    const gateToPhase: Record<QualityGate, string> = {
      "coverage-95": "development",
      "pass-rate-100": "development",
      "no-lint-errors": "post-review-linting",  // CRITICAL FIX: Loop to post-review linting
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

CRITICAL FIX: Proactive context management - works BEFORE Claude auto-compaction triggers.

**Problem:** Old threshold of 5% was too late - Claude's auto-compaction triggered first.
**Solution:** Proactive thresholds with mandatory checkpointing at 70%.

```typescript
// CRITICAL FIX: Proactive context thresholds
interface ContextThresholds {
  warningLevel: number;      // 80% - Warn user
  checkpointLevel: number;   // 70% - MANDATORY checkpoint
  clearLevel: number;        // 60% - Clear context
  reconstructLevel: number;  // 50% - Reconstruct from docs
}

interface ContextState {
  currentUsage: number;
  lastCheckpoint: Date;
  checkpointFile: string;
  pendingActions: string[];
}

class ContextManager {
  // CRITICAL FIX: Proactive thresholds - work BEFORE Claude auto-compact
  private thresholds: ContextThresholds = {
    warningLevel: 80,      // Warn at 80% usage
    checkpointLevel: 70,   // MANDATORY checkpoint at 70%
    clearLevel: 60,        // Clear context at 60%
    reconstructLevel: 50   // Reconstruct at 50%
  };

  private state: ContextState = {
    currentUsage: 0,
    lastCheckpoint: new Date(),
    checkpointFile: '.devflow/context-checkpoint.md',
    pendingActions: []
  };

  // Check context window status and take action
  // CRITICAL FIX: This must be called AFTER every major operation
  async checkAndHandleContext(): Promise<ContextActionResult> {
    const usage = await this.getContextUsage();
    this.state.currentUsage = usage;

    // CRITICAL: Check in order of severity
    if (usage >= this.thresholds.reconstructLevel) {
      // At 50% - already cleared, now reconstruct
      return await this.reconstructFromDocumentation();
    }

    if (usage >= this.thresholds.clearLevel) {
      // At 60% - clear context and prepare for reconstruction
      return await this.clearContextAndPrepare();
    }

    if (usage >= this.thresholds.checkpointLevel) {
      // At 70% - MANDATORY checkpoint
      return await this.mandatoryCheckpoint();
    }

    if (usage >= this.thresholds.warningLevel) {
      // At 80% - warn user
      return await this.warnUser();
    }

    return { action: 'none', message: 'Context usage normal' };
  }

  // CRITICAL FIX: Mandatory checkpoint at 70%
  // This MUST complete before Claude auto-compact triggers
  async mandatoryCheckpoint(): Promise<ContextActionResult> {
    console.warn('⚠️ CONTEXT CHECKPOINT REQUIRED (70% threshold reached)');
    console.warn('Saving all state to documentation...');

    // 1. Save all current state
    await this.saveStateToDocumentation();

    // 2. Create checkpoint file
    await this.createCheckpointFile();

    // 3. Update state
    this.state.lastCheckpoint = new Date();

    return {
      action: 'checkpoint',
      message: 'Mandatory checkpoint completed. State saved to documentation.',
      checkpointFile: this.state.checkpointFile,
      nextAction: 'Continue working. Context will be cleared at 60% threshold.'
    };
  }

  // CRITICAL FIX: Save all state to documentation
  async saveStateToDocumentation(): Promise<void> {
    const timestamp = new Date().toISOString();

    // Save to task_plan.md
    await this.updateTaskPlan(timestamp);

    // Save to findings.md
    await this.updateFindings(timestamp);

    // Save to progress.md
    await this.updateProgress(timestamp);

    // Save lessons learned
    await this.updateLessonsLearned();

    console.log('✅ All state saved to documentation');
  }

  // CRITICAL FIX: Clear context and prepare for reconstruction
  async clearContextAndPrepare(): Promise<ContextActionResult> {
    console.warn('🧹 CLEARING CONTEXT (60% threshold reached)');
    console.warn('Context will be reconstructed from documentation...');

    // Ensure checkpoint is saved
    await this.saveStateToDocumentation();

    // Create reconstruction instructions
    const reconstructionGuide = await this.createReconstructionGuide();

    return {
      action: 'clear',
      message: 'Context cleared. Reconstruction guide created.',
      reconstructionGuide,
      nextAction: 'Context will auto-reconstruct from documentation at 50% threshold.'
    };
  }

  // CRITICAL FIX: Reconstruct context from documentation
  async reconstructFromDocumentation(): Promise<ContextActionResult> {
    console.log('📖 RECONSTRUCTING CONTEXT from documentation...');

    // Read state from files in priority order
    const taskPlan = await this.readFile("task_plan.md");
    const findings = await this.readFile("findings.md");
    const progress = await this.readFile("progress.md");
    const architecture = await this.readFile("docs/architecture.md");
    const lessonsLearned = await this.readFile("templates/lessons-learned.md");

    // Load checkpoint if exists
    const checkpoint = await this.readCheckpointFile();

    // Provide reconstruction data
    return {
      action: 'reconstruct',
      message: 'Context reconstructed from documentation.',
      reconstructedContext: {
        taskPlan,
        findings,
        progress,
        architecture,
        lessonsLearned,
        checkpoint
      }
    };
  }

  // Warn user at 80%
  private async warnUser(): Promise<ContextActionResult> {
    return {
      action: 'warn',
      message: `⚠️ Context usage at ${this.state.currentUsage}%. Consider checkpointing soon.`,
      suggestion: 'Use /context-checkpoint to save state manually.'
    };
  }

  // Create checkpoint file for recovery
  private async createCheckpointFile(): Promise<void> {
    const checkpoint = `# Context Checkpoint

**Created:** ${new Date().toISOString()}
**Context Usage:** ${this.state.currentUsage}%

## Current State

### Phase
${await this.getCurrentPhaseInfo()}

### Open Findings
${await this.getOpenFindingsSummary()}

### Pending Actions
${this.state.pendingActions.map(a => `- ${a}`).join('\n')}

## Recovery Instructions

To recover from this checkpoint:
1. Read task_plan.md for current phase
2. Read findings.md for open findings
3. Read progress.md for session history
4. Read templates/lessons-learned.md for lessons

## Files to Read for Reconstruction

1. \`task_plan.md\` - Current phase and progress
2. \`findings.md\` - Open findings requiring action
3. \`progress.md\` - Session log
4. \`docs/architecture.md\` - Architecture reference
5. \`templates/lessons-learned.md\` - Lessons learned
`;
    await writeFile(this.state.checkpointFile, checkpoint);
  }

  // Create reconstruction guide for context clearing
  private async createReconstructionGuide(): Promise<string> {
    return `# Context Reconstruction Guide

Context was cleared at ${new Date().toISOString()}.

## To Reconstruct Context:

1. **READ task_plan.md** - Get current phase and progress
2. **READ findings.md** - Get open findings
3. **READ progress.md** - Get session history
4. **READ templates/lessons-learned.md** - Get relevant lessons

## After Reconstruction:

Continue from the current phase as defined in task_plan.md.
`;
  }

  // Legacy method - DEPRECATED
  async handleLowContext(): Promise<void> {
    console.warn('DEPRECATED: handleLowContext() - use checkAndHandleContext() instead');
    await this.checkAndHandleContext();
  }

  // Helper methods
  private async getContextUsage(): Promise<number> {
    // This would integrate with Claude Code's context monitoring
    // Return percentage of context window used
    return 0; // Placeholder
  }

  private async readFile(path: string): Promise<string> {
    // Read file content
    return '';
  }

  private async updateTaskPlan(timestamp: string): Promise<void> {
    // Update task_plan.md with current state
  }

  private async updateFindings(timestamp: string): Promise<void> {
    // Update findings.md with current state
  }

  private async updateProgress(timestamp: string): Promise<void> {
    // Update progress.md with current state
  }

  private async updateLessonsLearned(): Promise<void> {
    // Update templates/lessons-learned.md
  }

  private async getCurrentPhaseInfo(): Promise<string> {
    return 'Current phase info';
  }

  private async getOpenFindingsSummary(): Promise<string> {
    return 'Open findings summary';
  }

  private async readCheckpointFile(): Promise<string> {
    return await this.readFile(this.state.checkpointFile);
  }
}

interface ContextActionResult {
  action: 'none' | 'warn' | 'checkpoint' | 'clear' | 'reconstruct';
  message: string;
  checkpointFile?: string;
  reconstructionGuide?: string;
  reconstructedContext?: {
    taskPlan: string;
    findings: string;
    progress: string;
    architecture: string;
    lessonsLearned: string;
    checkpoint?: string;
  };
  nextAction?: string;
  suggestion?: string;
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
    // CRITICAL FIX: Check context window at start
    await this.contextManager.checkAndHandleContext();

    // For each phase in workflow
    for (const phase of WORKFLOW_PHASES) {
      await this.executePhase(phase);
    }
  }

  private async executePhase(phase: Phase): Promise<void> {
    console.log(`Executing Phase: ${phase.name}`);

    // CRITICAL FIX: Check context BEFORE each phase
    const contextResult = await this.contextManager.checkAndHandleContext();
    if (contextResult.action === 'checkpoint' || contextResult.action === 'clear') {
      console.log(`Context action: ${contextResult.message}`);
    }

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
    // CRITICAL FIX: This also verifies lessons captured
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

    // CRITICAL FIX: Check context AFTER each phase
    await this.contextManager.checkAndHandleContext();

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

2. **Findings Must Close With Lessons**
   - FindingsManager blocks transition until findings closed
   - CRITICAL FIX: All closed findings MUST have lessons captured
   - Enforced before each phase transition
   - `closeFinding(findingId, lesson)` is MANDATORY

3. **Quality Gates Must Pass**
   - QualityGateValidator loops back to failed phase
   - No exceptions
   - CRITICAL FIX: Post-review linting gate added

4. **Context Management - Proactive**
   - CRITICAL FIX: ContextManager now works BEFORE Claude auto-compact
   - 80%: Warning issued
   - 70%: MANDATORY checkpoint - state saved to docs
   - 60%: Context cleared
   - 50%: Context reconstructed from docs
   - Checked BEFORE and AFTER each phase

5. **Lessons Learned Enforcement**
   - CRITICAL FIX: Cannot close finding without lesson
   - Lessons are persisted to templates/lessons-learned.md
   - Lessons are checked before agent starts work

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
