# Installing DevFlow Enforcer v2.0

## Claude Code Marketplace Installation (Recommended)

DevFlow Enforcer is available as a **Claude Code marketplace plugin** that can be installed directly from Claude Code settings.

### Installation Steps

1. **Open Claude Code**
2. Go to **Settings** → **Plugins**
3. Click **Browse Marketplace**
4. Search for **"DevFlow Enforcer"**
5. Click **Install**

The plugin will be automatically installed to your local plugins directory:
```
~/.claude/plugins/devflow-enforcer/
```

### After Installation

Once installed, DevFlow Enforcer will automatically:
- Activate on software development tasks
- Enforce the 14-phase workflow
- Spawn specialized agents as needed
- Maintain quality gates (95% coverage, 100% pass rate)
- Optimize context window usage (~78% savings)

---

## Troubleshooting

**Plugin doesn't appear in marketplace?**

1. Check your internet connection
2. Refresh the marketplace in Claude Code settings
3. Try restarting Claude Code completely

**Alternative: Manual Installation**

If you prefer manual installation or need to troubleshoot:

```bash
# Clone repository
git clone https://github.com/xarlord/devflow-enforcer.git
cd devflow-enforcer

# The plugin files will be in the root of the cloned repository
# No additional installation steps needed
```

---

## What is DevFlow Enforcer?

A **Claude Code marketplace plugin** that enforces a rigorous 14-phase software development workflow with **~78% context window savings**.

### Key Features

- **14-Phase Workflow**: Requirements → Design → Development → Testing → Deployment
- **15 Specialized Agents**: Auto-spawned when needed
- **Quality Gates**: 95% test coverage, 100% pass rate (enforced)
- **Context Optimization**: Structured output, lazy loading, smart pruning

### Workflow Phases

1. Requirements Generation
2. Validation & Consistency Check
3. High Level Architecture Design
4. Detailed Design (Interactions/Data Models/Specs)
5. Testing Specification
6. Feature Creation & Allocation
7a. Create Branch
7b. Create Task List & Reference Docs
7c. Development
7d. Linting Check
7e. Code Review
7f. Unit Testing (95% coverage required)
7g. Create Pull Request
7h. Static Analysis & Security Check
7i. Build/Integrate Code
7j. Integration Testing
7k. BDD Testing
7l. Build Artifacts & Update Docs
7m. User Acceptance Testing

---

## Repository Information

- **Repository:** https://github.com/xarlord/devflow-enforcer
- **Issues:** https://github.com/xarlord/devflow-enforcer/issues
- **License:** MIT

---

## Support

For issues, questions, or contributions, please visit the GitHub repository.
