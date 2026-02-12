# Installing DevFlow Enforcer v2.0

## Claude Code Marketplace Installation

### Quick Install (Recommended)

**Step 1:** Clone the repository

```bash
git clone https://github.com/xarlord/devflow-enforcer.git
cd devflow-enforcer
```

**Step 2:** The plugin will be auto-activated by Claude Code

**Done!** Restart Claude Code and start a software development task.

---

## Manual Installation

If auto-installation doesn't work, you can manually copy the plugin files:

### Windows

```powershell
# Navigate to Claude plugins directory
cd $env:USERPROFILE%\.claude\plugins

# Create plugin directory (if needed)
mkdir devflow-enforcer

# Copy all plugin files
Copy-Item -Path "devflow-enforcer\agents" -Destination ".\claude\plugins\devflow-enforcer\agents" -Recurse -Force
Copy-Item -Path "devflow-enforcer\core" -Destination ".\claude\plugins\devflow-enforcer\core" -Recurse -Force
Copy-Item -Path "devflow-enforcer\docs" -Destination ".\claude\plugins\devflow-enforcer\docs" -Recurse -Force
Copy-Item -Path "devflow-enforcer\claude.json" -Destination ".\claude\plugins\devflow-enforcer\claude.json" -Recurse -Force
Copy-Item -Path "devflow-enforcer\index.js" -Destination ".\claude\plugins\devflow-enforcer\index.js" -Recurse -Force
```

### macOS/Linux

```bash
# Navigate to Claude plugins directory
cd ~/.claude/plugins

# Create plugin directory (if needed)
mkdir -p devflow-enforcer

# Copy all plugin files
cp -r devflow-enforcer/* ~/.claude/plugins/devflow-enforcer/
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

## Installation Directory Structure

```
~/.claude/plugins/devflow-enforcer/
├── claude.json          # Plugin manifest for marketplace
├── index.js               # Main entry point
├── agents/                # 15 agent specifications
│   ├── project-lead/
│   ├── architect/
│   ├── qa/
│   ├── testing/
│   ├── coders/
│   │   ├── typescript-coding-agent.md
│   │   ├── python-coding-agent.md
│   │   ├── java-coding-agent.md
│   │   ├── cpp-coding-agent.md
│   │   ├── rust-coding-agent.md
│   │   └── csharp-coding-agent.md
│   ├── git-expert/
│   ├── security/
│   ├── retrospective/
│   ├── docker-agent.md
│   └── database-agent.md
├── core/                   # Plugin infrastructure
│   ├── types/agent-result.ts
│   ├── agent-loader-v2.md
│   ├── context-pruner.md
│   └── workflow-loader.md
└── docs/                    # Documentation
    ├── agents/SUMMARY.md
    ├── workflow/SUMMARY.md
    └── [implementation guides]
```

---

## Version Information

- **Current Version**: 2.0.0
- **Release Date**: 2026-02-12
- **Claude Code Compatibility**: 2024-11-05 API
- **License**: MIT

---

## Getting Started

Once installed, simply start a software development task in Claude Code:

```
You: I want to add user authentication

Claude: I'll enforce the DevFlow workflow for this feature.
[Current Phase: 1 - Requirements Generation]
[Spawning: System/Software Architect]

Let me generate requirements...
```

---

## Support

- **GitHub Issues**: https://github.com/xarlord/devflow-enforcer/issues
- **Documentation**: See `docs/` folder
- **Repository**: https://github.com/xarlord/devflow-enforcer

## GitHub Repository

**Repository:** https://github.com/xarlord/devflow-enforcer.git

---

## Option 1: Quick Install from GitHub

### Windows (PowerShell)

```powershell
# Clone the repository
git clone https://github.com/xarlord/devflow-enforcer.git
cd devflow-enforcer

# Run the installer
powershell -ExecutionPolicy Bypass -File install/install.ps1
```

### Linux/macOS (Bash)

```bash
# Clone the repository
git clone https://github.com/xarlord/devflow-enforcer.git
cd devflow-enforcer

# Run the installer
bash install/install.sh
```

### After Installation

The plugin will be installed to: `~/.claude/skills/devflow-enforcer/`

Restart Claude Code to auto-discover the plugin.

**Quick Start:**
```
/devflow-start
```

---

## Option 2: Manual Install from Local Files

### Step 1: Navigate to Claude Code Skills Directory

**Windows:**
```powershell
cd $env:USERPROFILE\.claude\skills
```

**Linux/macOS:**
```bash
cd ~/.claude/skills
```

### Step 2: Create Plugin Directory

**Windows:**
```powershell
mkdir devflow-enforcer
```

**Linux/macOS:**
```bash
mkdir -p devflow-enforcer
```

### Step 3: Copy All Files

**From your project directory (sw-dev-workflow):**

**Windows (PowerShell):**
```powershell
Copy-Item -Recurse -Path agents, skills, slash-commands, workflows, templates, core, docs, install -Destination devflow-enforcer
```

**Linux/macOS (Bash):**
```bash
cp -r agents/* skills/* slash-commands/* workflows/* templates/* core/* docs/* install/* devflow-enforcer/
```

### Step 4: Create Symbolic Links (Optional)

**Windows:**
```powershell
# Link commands to Claude Code commands folder
Copy-Item devflow-enforcer\slash-commands\*.md -Destination "$env:USERPROFILE\.claude\commands\" -Force
```

**Linux/macOS:**
```bash
# Link commands to Claude Code commands folder
mkdir -p ~/.claude/commands
ln -sf devflow-enforcer/slash-commands/*.md ~/.claude/commands/ 2>/dev/null || true
```

### Step 5: Verify Installation

Run the test script to verify:

```bash
cd devflow-enforcer/test
bash test-installer.sh
```

Expected output: `✅ ALL TESTS PASSED`

---

## Option 3: Install via Installer Script

The `install/installer.md` contains scripts that automate installation:

### Linux/macOS
```bash
cd install
bash install.sh
```

### Windows
```powershell
cd install
powershell -ExecutionPolicy Bypass -File install.ps1
```

---

## Testing the Plugin

### 1. Test Plugin Discovery

After restarting Claude Code, verify plugin is discovered:

```bash
claude-code --list-skills | grep devflow-enforcer
```

### 2. Test Commands

```bash
# Should show available devflow commands
claude-code --list-commands | grep devflow
```

### 3. Start New Project

```
/devflow-start
```

### 4. View Status

```
/devflow-status
```

### 5. View Lessons Learned

```
/devflow-lessons
```

---

## File Structure Verification

After installation, verify this structure exists:

```
~/.claude/skills/devflow-enforcer/
├── agents/
│   ├── project-lead/project-lead-agent.md
│   ├── qa/qa-agent.md
│   ├── testing/testing-agent.md
│   ├── architect/system-architect-agent.md
│   ├── git-expert/git-expert-agent.md
│   ├── security/security-expert-agent.md
│   ├── retrospective/retrospective-agent.md
│   └── coders/
│       ├── typescript-coding-agent.md
│       ├── python-coding-agent.md
│       ├── java-coding-agent.md
│       ├── cpp-coding-agent.md
│       ├── rust-coding-agent.md
│       └── csharp-coding-agent.md
├── skills/
│   ├── check-lessons.md
│   ├── create-findings.md
│   └── validate-quality-gates.md
├── slash-commands/
│   ├── devflow-start.md
│   ├── devflow-status.md
│   ├── devflow-lessons.md
│   ├── devflow-findings.md
│   └── devflow-continue.md
├── workflows/
│   └── main-workflow.md
├── templates/
│   ├── architecture-template.md
│   ├── requirements-template.md
│   ├── lessons-learned.md
│   ├── findings-template.md
│   └── task-status-template.md
├── core/
│   └── workflow-enforcer.md
├── docs/
│   ├── architecture.md
│   └── verification.md
└── package.json
```

---

## Quick Reference

| Command | Description |
|---------|-------------|
| `/devflow-start` | Start new DevFlow Enforcer project |
| `/devflow-status` | Show current workflow status |
| `/devflow-lessons` | Show lessons learned |
| `/devflow-findings` | Show open findings |
| `/devflow-continue` | Resume workflow after interruption |

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Plugin not discovered | Check `~/.claude/skills/devflow-enforcer/` exists |
| Commands not working | Verify files in `slash-commands/` folder |
| Agent not spawning | Check agent files exist in `agents/` |

---

## Contributing

After testing and verifying the plugin works:

1. Report issues on GitHub
2. Submit pull requests for improvements

---

**Last Updated:** 2026-02-12
**Repository:** https://github.com/xarlord/devflow-enforcer.git
