# DevFlow Enforcer

**Plugin Type:** Claude Code Plugin
**Version:** 2.1.0

## What is DevFlow Enforcer?

DevFlow Enforcer is a workflow enforcement plugin for Claude Code that ensures software development follows a rigorous 15-phase quality process with enhanced UI/UX, Android, and testing support.

### Key Features

- **15-Phase Workflow**: From requirements to deployment with post-review linting
- **Quality Gates**: 95% test coverage, 100% pass rate, WCAG 2.1 AA compliance
- **Agent System**: 25 specialized agents including UI/UX, Android, and testing
- **Context Optimized**: ~78% reduction in token usage through proactive management
- **Spec Traceability**: Requirement-to-test mapping and coverage analysis

## What's New in v2.1.0

### Critical Workflow Fixes
- **Lessons Enforcement**: Mandatory lesson capture when closing findings
- **Post-Review Linting**: Automatic lint check after code review (Phase 7e.1)
- **Proactive Context Management**: Checkpoints at 70% threshold (before auto-compact)

### New Capabilities

| Category | New Agents | New Skills | New Commands |
|----------|------------|------------|--------------|
| UI/UX | 3 | 3 | 2 |
| Android | 2 | 3 | 2 |
| UI Testing | 2 | 3 | 2 |
| Unit Testing | - | 3 | 2 |
| Spec Linking | 1 | 3 | 2 |

## Quick Start

### Installation

```bash
# Clone repository
git clone https://github.com/xarlord/devflow-enforcer.git
cd devflow-enforcer

# Copy to Claude Code plugins directory
# Windows: %USERPROFILE%\.claude\plugins\
# macOS/Linux: ~/.claude/plugins/
```

### Basic Usage

```
1. DevFlow automatically activates on software tasks
2. Project Lead Agent guides you through phases
3. Agents spawn only when needed (saves context)
4. Quality gates enforce standards
5. Structured output minimizes tokens
```

## Workflow Overview

```
Requirements → Design → Testing Spec → Features
                                       ↓
        Branch → Dev → Lint → Review → Post-Review Lint → Unit Test → PR → Deploy
                                                ↓
                                    Retrospective (lessons learned enforced)
```

## Agents (25 Total)

### Management
| Agent | Purpose |
|--------|----------|
| Project Lead | Orchestrates workflow |
| Architect | Requirements & design |

### Quality
| Agent | Purpose |
|--------|----------|
| QA | Validation & review |
| Testing | Test execution |
| Security | Security scans |

### Coding
| Agent | Purpose |
|--------|----------|
| TypeScript | TypeScript implementation |
| Python | Python implementation |
| Java | Java implementation |
| C++ | C++ implementation |
| Rust | Rust implementation |
| C# | C# implementation |

### Infrastructure
| Agent | Purpose |
|--------|----------|
| Docker | Containerization |
| Database | Schema & migrations |

### UI/UX (NEW)
| Agent | Purpose |
|--------|----------|
| UI/UX Designer | User interface design |
| Accessibility Expert | WCAG compliance |
| Frontend Developer | Frontend implementation |

### Mobile (NEW)
| Agent | Purpose |
|--------|----------|
| Android Developer | Android/Kotlin development |
| Android Architect | Android architecture |

### Testing (NEW)
| Agent | Purpose |
|--------|----------|
| UI Testing Agent | E2E automation |
| Visual Regression Agent | Visual testing |

### Specification (NEW)
| Agent | Purpose |
|--------|----------|
| Spec Linking Agent | Requirement traceability |

## Commands (15 Total)

### Core Commands
| Command | Description |
|---------|-------------|
| `/devflow-start` | Start new project |
| `/devflow-status` | Show workflow status |
| `/devflow-continue` | Resume workflow |
| `/devflow-lessons` | View lessons learned |
| `/devflow-findings` | View findings |
| `/context-checkpoint` | Manual context save |

### UI/UX Commands
| Command | Description |
|---------|-------------|
| `/ui-review` | Run UI/UX review |
| `/accessibility-check` | Run WCAG audit |

### Mobile Commands
| Command | Description |
|---------|-------------|
| `/android-test` | Run Android tests |
| `/android-build` | Build Android APK/AAB |

### Testing Commands
| Command | Description |
|---------|-------------|
| `/e2e-test` | Run E2E tests |
| `/visual-test` | Run visual regression |
| `/test-coverage` | Generate coverage report |
| `/mutation-test` | Run mutation testing |

### Specification Commands
| Command | Description |
|---------|-------------|
| `/spec-link` | Link tests to requirements |
| `/traceability` | Generate traceability matrix |

## Context Optimization

v2.1.0 achieves ~78% token savings through:

| Optimization | Savings |
|--------------|----------|
| Selective agent loading | ~75% (~6,000 tokens) |
| Structured output (`AgentResult<T>`) | ~71% (~2,100 tokens) |
| Documentation summaries | ~84% (~10,500 tokens) |
| Proactive checkpointing | Prevents auto-compact |
| **Total** | **~78% (~18,600+ tokens)** |

## Quality Standards

| Metric | Requirement |
|--------|-------------|
| Unit Test Coverage | 95% minimum |
| Test Pass Rate | 100% required |
| Linting | 0 errors (enforced post-review) |
| Security | 0 critical/high vulnerabilities |
| Accessibility | WCAG 2.1 AA (100%) |
| Spec Coverage | 90% minimum |

## Skills (19 Total)

### Workflow Skills
- `capture-lesson` - Mandatory lesson capture
- `context-checkpoint` - Context state management
- `check-lessons` - Lesson verification
- `create-findings` - Finding creation
- `validate-quality-gates` - Quality gate validation

### UI/UX Skills
- `ui-review` - UI/UX design review
- `accessibility-audit` - WCAG 2.1 AA audit
- `design-system` - Design system management

### Mobile Skills
- `android-build` - Android build configuration
- `android-testing` - Android instrumentation testing
- `play-store-deploy` - Play Store deployment

### Testing Skills
- `e2e-testing` - E2E testing (Playwright/Cypress)
- `visual-testing` - Visual regression (Percy/Chromatic)
- `mobile-ui-testing` - Mobile UI testing (Appium/Espresso)
- `mutation-testing` - Mutation testing (Stryker)
- `coverage-analysis` - Coverage analysis
- `test-generation` - AI-assisted test generation

### Specification Skills
- `spec-traceability` - Requirement traceability
- `spec-validation` - Specification validation
- `coverage-mapping` - Feature coverage mapping

## Documentation

- `docs/agents/SUMMARY.md` - Agent registry
- `docs/workflow/SUMMARY.md` - Phases overview
- `docs/IMPLEMENTATION_GUIDE.md` - Implementation details
- `INSTALL.md` - Installation guide

## Requirements Supported

All 26 customer requirements enforced, including:
- #5: Always start with application name and git init
- #9: 95% test coverage, 100% pass rate
- #13: Never assume - always verify
- #23: Workflow enforcement (MOST IMPORTANT)
- #24-26: Lessons learned management (now enforced)
- WCAG 2.1 AA accessibility compliance

## License

MIT License - See LICENSE file

## Contributing

See `CONTRIBUTING.md` for guidelines.

---

**Version:** 2.1.0
**Last Updated:** 2026-02-17
**Status:** Extended with UI/UX, Android, Testing, and Spec Linking
