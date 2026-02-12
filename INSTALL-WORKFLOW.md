# Installing DevFlow Enforcer v2.0 for Claude Code

## Quick Install

### Step 1: Clone Repository

```bash
# Clone the repository
git clone https://github.com/xarlord/devflow-enforcer.git
cd devflow-enforcer
```

### Step 2: Copy to Claude Code Plugins

```bash
# Windows PowerShell
Copy-Item -Path "$env:USERPROFILE\.claude\plugins\devflow-enforcer" -Recurse -Force

# macOS/Linux
cp -r ~/devflow-enforcer ~/.claude/plugins/devflow-enforcer

# Verify installation
ls ~/.claude/plugins/devflow-enforcer
```

### Step 3: Restart Claude Code

Close and restart Claude Code for the plugin to be recognized.

---

## Verifying Installation

After installation, verify the plugin is loaded:

```bash
# Check plugin directory exists
ls ~/.claude/plugins/devflow-enforcer

# Should show:
# README.md
# agents/
# core/
# docs/
# tests/
```

---

## Usage

### Starting a New Session

When you start a new software development task in Claude Code:

1. **Claude automatically activates DevFlow Enforcer**
2. **Project Lead Agent loads** (always active)
3. **Agent specs load on-demand** (lazy loading)
4. **Workflow phases guide you** through the process

### Example Session

```
You: I want to add user authentication

Claude (DevFlow Enforcer):
I'll enforce the DevFlow workflow for this feature.

[Checks lessons-learned.md]
Current Phase: 1 - Requirements Generation
[Spawns System/Software Architect]

Let me generate requirements for user authentication...
```

### Key Features

- **14-Phase Workflow**: From requirements to deployment
- **15 Specialized Agents**: Auto-spawned when needed
- **Quality Gates**: 95% coverage, 100% pass rate
- **Context Optimization**: ~78% token savings
- **Structured Output**: AgentResult<T> format for efficiency

---

## What Changed in v2.0

| Feature | v1.x | v2.0 |
|---------|-------|-------|
| Agent Loading | All at start | Lazy (on-demand) |
| Agent Output | Verbose text | Structured JSON |
| Documentation | Full docs loaded | Summaries + JIT |
| Context Management | Manual | Auto-pruning at 80% |
| Token Efficiency | Baseline | ~78% savings |

---

## Configuration

### Agent Loading Configuration

Edit `agent-loader.config.json` (optional):

```json
{
    "loadStrategy": "lazy",
    "cacheEnabled": true,
    "preloadAgents": ["project-lead"]
}
```

### Context Pruning Configuration

Edit `context-pruner.config.json` (optional):

```json
{
    "threshold": 80,
    "emergencyThreshold": 90,
    "keepRecentMessages": 10,
    "archivePath": "context-archive.md"
}
```

---

## Running Tests

After installation, verify everything works:

```bash
# From project directory
node tests/test-optimization.js

# Expected output: 49/49 tests passed (100%)
```

---

## Troubleshooting

### Plugin Not Loading

1. Check Claude Code plugins directory
2. Verify file permissions
3. Restart Claude Code
4. Check Claude Code logs

### Context Still Full

1. Verify context-pruner.config.json
2. Check documentation summaries are being used
3. Run tests to verify optimization

### Agents Not Spawning

1. Check agent spec files have `load: true`
2. Verify agent loader configuration
3. Check Project Lead agent is active

---

## Uninstallation

```bash
# Remove plugin directory
rm -rf ~/.claude/plugins/devflow-enforcer

# Restart Claude Code
```

---

## Getting Help

- **GitHub Issues**: https://github.com/xarlord/devflow-enforcer/issues
- **Documentation**: See `docs/` folder
- **Test Results**: Run `node tests/test-optimization.js`

---

**Version:** 2.0.0
**Last Updated:** 2026-02-12
**Status:** Production Ready
