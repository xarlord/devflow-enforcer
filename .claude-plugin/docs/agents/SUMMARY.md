# DevFlow Enforcer - Agent Registry

## Quick Reference

| Agent | Purpose | Spawned For |
|--------|---------|--------------|
| **Project Lead** | Workflow orchestration | Always active |
| **Architect** | Requirements & design | Phases 1, 3, 4, 6 |
| **QA** | Validation & review | Phases 2, 7e, 7m |
| **Testing** | Test execution | Phases 5, 7f, 7j, 7k |
| **Security** | Security reviews | Phase 7h |
| **Git Expert** | Version control | Phases 7a, 7g |
| **Retrospective** | Lessons learned | After each phase |
| **Coding Agents** | Feature implementation | Phase 7c |
| **Docker Agent** | Container orchestration | Deployment |
| **Database Agent** | Schema & migrations | Phases 4, 7i |

## Coding Agents

| Language | Agent | Framework | Testing |
|----------|---------|------------|----------|
| TypeScript | typescript-coding-agent | Node.js/Express | Jest |
| Python | python-coding-agent | FastAPI/Django | pytest |
| Java | java-coding-agent | Spring Boot | JUnit |
| C/C++ | cpp-coding-agent | None/Qt | Google Test |
| Rust | rust-coding-agent | Actix/Axum | Built-in |
| C# | csharp-coding-agent | ASP.NET Core | xUnit |

## Agent Capabilities

### Project Lead Agent
- Workflow orchestration (14 phases)
- Quality gate enforcement
- Agent spawning coordination
- Context window management

### System Architect Agent
- Requirements generation
- High-level architecture design
- Detailed design (interactions, data models)
- Feature allocation

### QA Agent
- Requirements validation (clear, concise, verifiable)
- Code review
- User acceptance testing

### Testing Agent
- Test specification
- Unit testing (95% coverage required)
- Integration testing
- BDD testing

### Security Expert Agent
- Dependency vulnerability scans
- Code security analysis
- Secrets detection
- OWASP Top 10 compliance

### Git Expert Agent
- Branch creation
- Pull request creation
- Merge/rebase operations

### Retrospective Agent
- Lessons learned collection
- Document maintenance (10% context limit)
- Priority scoring

### Coding Agents (all)
- Feature implementation
- Linting enforcement
- Test writing (95% coverage, 100% pass rate)
- Lessons-learned checks

### Docker Agent
- Multi-stage Dockerfiles
- Docker Compose orchestration
- Container security

### Database Agent
- Schema design
- Migration creation
- Query optimization

## For Detailed Specs

Each agent has a full specification file:
```
agents/<agent-name>/<agent-name>-agent.md
```

Load detailed specs only when spawning the agent.
