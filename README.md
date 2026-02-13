# DevFlow Enforcer

**Plugin Type:** Claude Code Plugin
**Version:** 2.0.0

## What is DevFlow Enforcer?

DevFlow Enforcer is a workflow enforcement plugin for Claude Code that ensures software development follows a rigorous 14-phase quality process.

### Key Features

- **14-Phase Workflow**: From requirements to deployment
- **Quality Gates**: 95% test coverage, 100% pass rate
- **Agent System**: 15 specialized agents for different tasks
- **Context Optimized**: ~73% reduction in token usage through:
  - Selective agent loading
  - Structured output format
  - Documentation summarization

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
        Branch → Dev → Test → Review → PR → Deploy
                                       ↓
                            Retrospective (lessons learned)
```

## Agents

| Agent | Purpose |
|--------|----------|
| Project Lead | Orchestrates workflow |
| Architect | Requirements & design |
| QA | Validation & review |
| Testing | Test execution |
| Security | Security scans |
| Git Expert | Version control |
| Coding (TS/Py/Java/etc) | Implementation |
| Docker | Containerization |
| Database | Schema & migrations |

See `docs/agents/SUMMARY.md` for complete agent registry.

## Context Optimization

v2.0 achieves ~73% token savings through:

| Optimization | Savings |
|--------------|----------|
| Selective agent loading | ~75% (~6,000 tokens) |
| Structured output (`AgentResult<T>`) | ~71% (~2,100 tokens) |
| Documentation summaries | ~84% (~10,500 tokens) |
| **Total** | **~73% (~18,600 tokens)** |

## Quality Standards

| Metric | Requirement |
|--------|-------------|
| Unit Test Coverage | 95% minimum |
| Test Pass Rate | 100% required |
| Linting | 0 errors |
| Security | 0 critical/high vulnerabilities |

## Documentation

- `docs/agents/SUMMARY.md` - Agent registry
- `docs/workflow/SUMMARY.md` - Phases overview
- `docs/IMPLEMENTATION_GUIDE.md` - Implementation details
- `INSTALL.md` - Installation guide

## Requirements Supported

All 26 customer requirements enforced, including:
- #23: Workflow enforcement (MOST IMPORTANT)
- #9: 95% test coverage, 100% pass rate
- #13: Never assume - always verify
- #24-26: Lessons learned management

## License

MIT License - See LICENSE file

## Contributing

See `CONTRIBUTING.md` for guidelines.

---

**Version:** 2.0.0
**Last Updated:** 2026-02-12
**Status:** Context Window Optimization Complete
