# Main Workflow

## Workflow Definition

**Name:** DevFlow Enforcer Main Workflow
**Description:** Complete software development workflow with quality gates and enforcement

## Workflow Stages

```
START
  │
  ▼
┌─────────────────────────────────────────────────────────────────────┐
│ STAGE 1: Requirements Generation                                   │
│ - Spawn: System/Software Architect                                 │
│ - Creates findings                                                │
│ - Output: Clear, concise, verifiable requirements                 │
└─────────────────────────────────────────────────────────────────────┘
  │
  ▼
┌─────────────────────────────────────────────────────────────────────┐
│ STAGE 2: Validation & Consistency Check                           │
│ - Spawn: QA Agent                                                 │
│ - Quality Gates: requirements-clear, concise, verifiable          │
│ - Output: Validated requirements                                   │
└─────────────────────────────────────────────────────────────────────┘
  │
  ▼
┌─────────────────────────────────────────────────────────────────────┐
│ STAGE 3: High Level Architecture Design                            │
│ - Spawn: System/Software Architect                                │
│ - Creates findings                                                │
│ - Output: Architecture design document                             │
└─────────────────────────────────────────────────────────────────────┘
  │
  ▼
┌─────────────────────────────────────────────────────────────────────┐
│ STAGE 4: Detailed Design                                           │
│ - Spawn: System/Software Architect                                │
│ - Creates findings                                                │
│ - Output: Detailed design (interactions, data models, specs)       │
└─────────────────────────────────────────────────────────────────────┘
  │
  ▼
┌─────────────────────────────────────────────────────────────────────┐
│ STAGE 5: Testing Specification                                     │
│ - Spawn: Testing Agent                                            │
│ - Creates findings                                                │
│ - Output: Testing specification document                           │
└─────────────────────────────────────────────────────────────────────┘
  │
  ▼
┌─────────────────────────────────────────────────────────────────────┐
│ STAGE 6: Feature Creation & Allocation                            │
│ - Spawn: System/Software Architect                                │
│ - Creates findings                                                │
│ - Output: Features with allocated requirements                    │
└─────────────────────────────────────────────────────────────────────┘
  │
  ▼
┌─────────────────────────────────────────────────────────────────────┐
│ FOR EACH FEATURE (Loop through stages 7a-7m)                       │
└─────────────────────────────────────────────────────────────────────┘
  │
  ▼
┌─────────────────────────────────────────────────────────────────────┐
│ STAGE 7a: Branch Creation                                        │
│ - Spawn: Git Expert                                               │
│ - Output: Feature branch created                                  │
└─────────────────────────────────────────────────────────────────────┘
  │
  ▼
┌─────────────────────────────────────────────────────────────────────┐
│ STAGE 7b: Task List & Reference Docs                              │
│ - Output: Task list and reference documentation                   │
└─────────────────────────────────────────────────────────────────────┘
  │
  ▼
┌─────────────────────────────────────────────────────────────────────┐
│ STAGE 7c: Development                                            │
│ - Spawn: Tech Stack Coding Agent                                  │
│ - Creates findings                                                │
│ - Checks lessons-learned FIRST (requirement #25)                  │
│ - Output: Functional code and test code                          │
└─────────────────────────────────────────────────────────────────────┘
  │
  ▼
┌─────────────────────────────────────────────────────────────────────┐
│ STAGE 7d: Linting Check                                          │
│ - Quality Gate: no-lint-errors                                    │
│ - Output: Clean code (0 linting errors)                          │
│ - Loop back to 7c if fails                                       │
└─────────────────────────────────────────────────────────────────────┘
  │
  ▼
┌─────────────────────────────────────────────────────────────────────┐
│ STAGE 7e: Code Review                                            │
│ - Spawn: QA Agent                                                 │
│ - Creates findings                                                │
│ - Output: Code review report                                      │
└─────────────────────────────────────────────────────────────────────┘
  │
  ▼
┌─────────────────────────────────────────────────────────────────────┐
│ STAGE 7f: Unit Testing                                           │
│ - Spawn: Testing Agent + Coding Agent                             │
│ - Creates findings                                                │
│ - Quality Gates: coverage-95, pass-rate-100                      │
│ - Output: Test results                                            │
│ - Loop back to 7c until gates pass                               │
└─────────────────────────────────────────────────────────────────────┘
  │
  ▼
┌─────────────────────────────────────────────────────────────────────┐
│ STAGE 7g: Pull Request Creation                                   │
│ - Spawn: Git Expert                                               │
│ - Output: Pull request created                                    │
└─────────────────────────────────────────────────────────────────────┘
  │
  ▼
┌─────────────────────────────────────────────────────────────────────┐
│ STAGE 7h: Static Analysis & Security Check                        │
│ - Spawn: Security Expert                                          │
│ - Creates findings                                                │
│ - Quality Gate: no-critical-vulnerabilities                       │
│ - Output: Security report                                         │
│ - Loop back to 7c if critical issues found                       │
└─────────────────────────────────────────────────────────────────────┘
  │
  ▼
┌─────────────────────────────────────────────────────────────────────┐
│ STAGE 7i: Build/Integrate Code                                   │
│ - Spawn: Coding Agent + Git Expert                                │
│ - Output: Built and integrated code                               │
└─────────────────────────────────────────────────────────────────────┘
  │
  ▼
┌─────────────────────────────────────────────────────────────────────┐
│ STAGE 7j: Integration Testing                                     │
│ - Spawn: Testing Agent                                            │
│ - Creates findings                                                │
│ - Quality Gate: integration-pass                                  │
│ - Output: Integration test results                                │
└─────────────────────────────────────────────────────────────────────┘
  │
  ▼
┌─────────────────────────────────────────────────────────────────────┐
│ STAGE 7k: BDD Testing                                            │
│ - Spawn: Testing Agent + QA Agent                                 │
│ - Creates findings                                                │
│ - Quality Gate: bdd-pass                                          │
│ - Output: BDD test results                                        │
└─────────────────────────────────────────────────────────────────────┘
  │
  ▼
┌─────────────────────────────────────────────────────────────────────┐
│ STAGE 7l: Build Artifacts & Update Docs                           │
│ - Output: Build artifacts and updated documentation                │
└─────────────────────────────────────────────────────────────────────┘
  │
  ▼
┌─────────────────────────────────────────────────────────────────────┐
│ STAGE 7m: User Acceptance Testing                                 │
│ - Spawn: QA Agent                                                 │
│ - Creates findings                                                │
│ - Quality Gate: user-satisfied                                    │
│ - Output: User acceptance result                                  │
│ - Loop back to appropriate stage if not satisfied                 │
└─────────────────────────────────────────────────────────────────────┘
  │
  ▼
┌─────────────────────────────────────────────────────────────────────┐
│ RETROSPECTIVE                                                      │
│ - Spawn: Retrospective Agent                                      │
│ - Output: Lessons learned updated                                │
└─────────────────────────────────────────────────────────────────────┘
  │
  ▼
NEXT FEATURE (back to stage 7a)
```

## Enforcement Rules

### 1. No Skipping Stages
All stages must be completed in order. Cannot skip from Stage 1 to Stage 5.

### 2. Findings Must Close
Any stage that creates findings must have those findings closed before proceeding.

### 3. Quality Gates Must Pass
Quality gates that fail trigger a loop back to the appropriate stage.

### 4. Agents Must Check Lessons
All agents must check lessons-learned before starting work (Stage 7c).

### 5. Context Management
When context window < 5%, save state to files and reconstruct.

## Quality Metrics Summary

| Metric | Target | Failing Action |
|--------|--------|----------------|
| Requirements Clarity | Clear | Loop to Stage 1 |
| Requirements Conciseness | Concise | Loop to Stage 1 |
| Requirements Verifiability | Verifiable | Loop to Stage 1 |
| Linting | 0 errors | Loop to Stage 7c |
| Unit Test Coverage | 95% | Loop to Stage 7c |
| Unit Test Pass Rate | 100% | Loop to Stage 7c |
| Security Vulnerabilities | 0 critical/high | Loop to Stage 7c |
| Integration Tests | Pass | Block |
| BDD Tests | Pass | Block |
| User Satisfaction | Satisfied | Loop to appropriate stage |

## Workflow Triggers

| Trigger | Action |
|---------|--------|
| /devflow-start | Start new project workflow |
| /devflow-continue | Resume workflow from current stage |
| New feature request | Start Stage 7a loop for feature |
| Context window < 5% | Save and reconstruct context |

## Completion Criteria

Workflow is complete when:

1. All features complete (all 19 stages for each feature)
2. All quality gates passed
3. All findings closed
4. User acceptance received for all features
5. Documentation updated
6. Build artifacts created
7. Lessons learned documented
