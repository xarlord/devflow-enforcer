# Task Plan: Extend devflow-enforcer Plugin with New Agents, Tools, Skills & Scripts

## Project Overview
**Plugin:** devflow-enforcer
**Repository:** xarlord/devflow-enforcer
**Branch:** feature/extend-agents-tools-skills
**Target:** Merge to main via PR

## Goal
Extend the devflow-enforcer plugin to:
1. **[PRIORITY] Fix critical workflow enforcement issues**
2. Add new agents, tools, skills, and scripts for:
   - UI/UX Development
   - Android Development
   - UI Testing
   - Enhanced Unit Testing
   - Test Specification with Product Specification Linking

---

## PRIORITY PHASE: Critical Workflow Fixes

### Issue 1: Lessons Learned Not Enforced When Issue Fixed
**Problem:** When a finding/issue is closed, the workflow does not enforce documenting what was learned.

**Current Behavior:**
```
closeFinding(findingId) → status = "Closed" → DONE
```

**Required Behavior:**
```
closeFinding(findingId) → PROMPT for lesson learned → SAVE to lessons-learned.md → status = "Closed"
```

**Fix Required:**
- [ ] Update `FindingsManager.closeFinding()` to require lesson documentation
- [ ] Add `LessonCapture` interface to findings closure
- [ ] Create `capture-lesson` skill for mandatory lesson capture
- [ ] Update all agents to prompt for lessons when closing findings
- [ ] Block phase transition if lessons not captured for closed findings

### Issue 2: Linting Not Enforced After Code Review
**Problem:** Linting only runs before code review. If code changes are made during review fixes, linting is not re-run.

**Current Flow:**
```
Development → Linting (7d) → Code Review (7e) → Unit Testing (7f)
```

**Required Flow:**
```
Development → Linting (7d) → Code Review (7e) → Post-Review Linting (7e.1) → Unit Testing (7f)
```

**Fix Required:**
- [ ] Add post-review linting phase (7e.1) after code review
- [ ] Update workflow phases to include `post-review-linting`
- [ ] Quality gate: `no-lint-errors` must pass after code review
- [ ] Loop back to code review if linting fails (code changes introduced lint errors)

### Issue 3: Context Window Management Not Proactive
**Problem:** Context management triggers at 5% (too late). Claude's auto-compaction triggers before documentation is saved.

**Current Behavior:**
```
Context < 5% → handleLowContext() → (often too late, auto-compact already triggered)
```

**Required Behavior:**
```
Context < 80% → WARN and suggest checkpoint
Context < 70% → MANDATORY checkpoint - save all state to docs
Context < 60% → Clear context proactively
Context < 50% → Reconstruct from documentation
```

**Fix Required:**
- [ ] Change threshold from 5% to 80% for warning, 70% for mandatory checkpoint
- [ ] Add `saveStateToDocumentation()` method called at 70%
- [ ] Add `clearContextAndReconstruct()` method at 60%
- [ ] Create `context-checkpoint` command for manual checkpointing
- [ ] Update ContextManager to work BEFORE Claude auto-compaction
- [ ] Document reconstruction priority order

---

## Current Plugin State (v2.0.1)

### Existing Agents (15 total)
| Category | Agents |
|----------|--------|
| Management | project-lead, architect |
| Quality | qa, testing, security |
| Coding | typescript, python, java, cpp, rust, csharp |
| Infrastructure | docker, database |
| Process | git-expert, retrospective |

### Existing Commands (5 total)
- `/devflow-start` - Start new project
- `/devflow-status` - Show workflow status
- `/devflow-continue` - Resume workflow
- `/devflow-lessons` - View lessons learned
- `/devflow-findings` - View findings

### Existing Skills (4 total)
- `devflow-start` - Project initialization
- `check-lessons` - Lesson verification
- `create-findings` - Finding creation
- `validate-quality-gates` - Quality gate validation

---

## Extension Plan

### Phase 1: UI/UX Agents & Skills

#### 1.1 New Agents
| Agent | Description | Location |
|-------|-------------|----------|
| `ui-ux-designer` | User interface and experience design specialist | `agents/ui-ux/ui-ux-designer-agent.md` |
| `accessibility-expert` | WCAG compliance and accessibility testing | `agents/ui-ux/accessibility-expert-agent.md` |
| `frontend-developer` | Frontend implementation specialist | `agents/ui-ux/frontend-developer-agent.md` |

#### 1.2 New Skills
| Skill | Description |
|-------|-------------|
| `ui-review` | UI/UX design review and feedback |
| `accessibility-audit` | WCAG 2.1 AA compliance audit |
| `design-system` | Design system creation and maintenance |

#### 1.3 New Commands
| Command | Description |
|---------|-------------|
| `/ui-review` | Trigger UI/UX review |
| `/accessibility-check` | Run accessibility audit |

---

### Phase 2: Android Development Agents & Skills

#### 2.1 New Agents
| Agent | Description | Location |
|-------|-------------|----------|
| `android-developer` | Native Android/Kotlin development | `agents/mobile/android-developer-agent.md` |
| `android-architect` | Android architecture specialist | `agents/mobile/android-architect-agent.md` |

#### 2.2 New Skills
| Skill | Description |
|-------|-------------|
| `android-build` | Android build and Gradle configuration |
| `android-testing` | Android instrumentation testing |
| `play-store-deploy` | Play Store deployment workflow |

#### 2.3 New Commands
| Command | Description |
|---------|-------------|
| `/android-test` | Run Android tests |
| `/android-build` | Build Android APK/AAB |

---

### Phase 3: UI Testing Agents & Skills

#### 3.1 New Agents
| Agent | Description | Location |
|-------|-------------|----------|
| `ui-testing-agent` | UI automation testing specialist | `agents/testing/ui-testing-agent.md` |
| `visual-regression-agent` | Visual regression testing | `agents/testing/visual-regression-agent.md` |

#### 3.2 New Skills
| Skill | Description |
|-------|-------------|
| `e2e-testing` | End-to-end testing with Cypress/Playwright |
| `visual-testing` | Visual regression with Percy/Chromatic |
| `mobile-ui-testing` | Mobile UI testing with Appium/Espresso |

#### 3.3 New Commands
| Command | Description |
|---------|-------------|
| `/e2e-test` | Run E2E tests |
| `/visual-test` | Run visual regression tests |

---

### Phase 4: Enhanced Unit Testing

#### 4.1 Enhanced Testing Agent
| Enhancement | Description |
|-------------|-------------|
| Multi-framework support | Jest, Vitest, pytest, JUnit, XCTest |
| Coverage reporting | Istanbul, Coverage.py, JaCoCo |
| Mutation testing | Stryker integration |
| Parallel execution | Distributed test execution |

#### 4.2 New Skills
| Skill | Description |
|-------|-------------|
| `mutation-testing` | Mutation testing with Stryker |
| `test-generation` | AI-assisted test generation |
| `coverage-analysis` | Deep coverage analysis |

#### 4.3 New Commands
| Command | Description |
|---------|-------------|
| `/test-coverage` | Generate coverage report |
| `/mutation-test` | Run mutation testing |

---

### Phase 5: Test Specification & Product Specification Linking

#### 5.1 New Agent
| Agent | Description | Location |
|-------|-------------|----------|
| `spec-linking-agent` | Links test specs to product requirements | `agents/specification/spec-linking-agent.md` |

#### 5.2 New Skills
| Skill | Description |
|-------|-------------|
| `spec-traceability` | Requirement to test traceability matrix |
| `coverage-mapping` | Map product features to test coverage |
| `spec-validation` | Validate specs against requirements |

#### 5.3 New Templates
| Template | Description |
|----------|-------------|
| `test-spec-template.md` | Test specification template |
| `traceability-matrix.md` | Requirement-to-test mapping |
| `spec-link-report.md` | Specification linking report |

#### 5.4 New Commands
| Command | Description |
|---------|-------------|
| `/spec-link` | Link test to product specification |
| `/traceability` | Generate traceability matrix |

---

## Implementation Phases

### Phase 0: Critical Workflow Fixes (PRIORITY)
- [ ] **Issue 1: Lessons Learned Enforcement**
  - [ ] Update FindingsManager.closeFinding() to require lesson
  - [ ] Create LessonCapture interface
  - [ ] Create capture-lesson skill
  - [ ] Update all agents for lesson capture
  - [ ] Block phase transition without lessons

- [ ] **Issue 2: Post-Review Linting**
  - [ ] Add post-review-linting phase (7e.1)
  - [ ] Update workflow phases
  - [ ] Add quality gate enforcement
  - [ ] Update main-workflow.md

- [ ] **Issue 3: Proactive Context Management**
  - [ ] Change thresholds (80% warn, 70% checkpoint, 60% clear)
  - [ ] Implement saveStateToDocumentation()
  - [ ] Implement clearContextAndReconstruct()
  - [ ] Create /context-checkpoint command
  - [ ] Update ContextManager and ContextPruner

### Phase 1: Foundation Setup
- [ ] Create directory structure for new agent categories
- [ ] Update plugin.json with new capabilities
- [ ] Update claude.json with new agent/skill metadata
- [ ] Create base templates for new agent types

### Phase 2: UI/UX Implementation
- [ ] Create UI/UX designer agent
- [ ] Create accessibility expert agent
- [ ] Create frontend developer agent
- [ ] Create UI/UX skills
- [ ] Create UI/UX commands
- [ ] Update workflow to include UI/UX stages

### Phase 3: Android Development Implementation
- [ ] Create Android developer agent
- [ ] Create Android architect agent
- [ ] Create Android skills
- [ ] Create Android commands
- [ ] Update workflow for mobile development

### Phase 4: UI Testing Implementation
- [ ] Create UI testing agent
- [ ] Create visual regression agent
- [ ] Create UI testing skills
- [ ] Create UI testing commands
- [ ] Integrate with existing testing workflow

### Phase 5: Enhanced Unit Testing
- [x] Enhance existing testing agent
- [x] Add mutation testing skill (skills/mutation-testing/SKILL.md)
- [x] Add test generation skill (skills/test-generation/SKILL.md)
- [x] Add coverage analysis skill (skills/coverage-analysis/SKILL.md)
- [x] Create new testing commands (commands/test-coverage.md, commands/mutation-test.md)

### Phase 6: Spec Linking Implementation
- [x] Create spec linking agent (agents/specification/spec-linking-agent.md)
- [x] Create spec traceability skill (skills/spec-traceability/SKILL.md)
- [x] Create spec validation skill (skills/spec-validation/SKILL.md)
- [x] Create coverage mapping skill (skills/coverage-mapping/SKILL.md)
- [x] Create spec commands (commands/spec-link.md, commands/traceability.md)

### Phase 7: Integration & Testing
- [ ] Update main workflow
- [ ] Integration testing
- [ ] Documentation update
- [ ] Version bump to 2.1.0

### Phase 8: PR Creation
- [ ] Final review
- [ ] Create pull request
- [ ] Merge to main

---

## Quality Gates

| Gate | Criteria |
|------|----------|
| All agents have proper structure | SKILL.md format with frontmatter |
| All skills are user-invocable | user-invocable: true in frontmatter |
| All commands registered | Proper command registration |
| Documentation updated | README.md reflects new capabilities |
| Version updated | package.json version bumped |

---

## Decisions Made
| Decision | Rationale |
|----------|-----------|
| Use modular agent structure | Easy to extend and maintain |
| Create separate mobile category | Android has unique requirements |
| Enhance existing testing agent | Avoid duplication |
| Add spec linking as new capability | Product requirement traceability |

---

## Risks & Mitigations
| Risk | Mitigation |
|------|------------|
| Token bloat with new agents | Use selective loading |
| Workflow complexity | Keep optional stages |
| Skill registration issues | Follow existing patterns |

---

## Success Criteria
1. All new agents load correctly
2. All new commands work as slash commands
3. All new skills are invocable
4. Workflow supports new phases
5. PR merges successfully to main
