# DevFlow Enforcer - Installer

## Claude Code Plugin Installation

This installer sets up DevFlow Enforcer as a Claude Code plugin.

## Installation Options

Choose installation method:

1. **Local Development** - Install from local directory
2. **Git Clone** - Install from repository
3. **NPM Package** - Install from published package (future)

## Quick Install

```bash
# Navigate to Claude Code skills directory
cd ~/.claude/skills/

# Create devflow-enforcer directory
mkdir -p devflow-enforcer

# Copy all plugin files
cp -r [path-to]/sw-dev-workflow/* devflow-enforcer/

# Restart Claude Code
# Plugin will be auto-discovered
```

## Directory Structure After Installation

```
~/.claude/skills/devflow-enforcer/
├── agents/                    # All agent specifications
│   ├── project-lead/
│   ├── qa/
│   ├── testing/
│   ├── architect/
│   ├── git-expert/
│   ├── security/
│   ├── retrospective/
│   └── coders/
│       ├── typescript-coding-agent.md
│       ├── python-coding-agent.md
│       ├── java-coding-agent.md
│       ├── cpp-coding-agent.md
│       ├── rust-coding-agent.md
│       └── csharp-coding-agent.md
├── skills/                    # Callable skills
│   ├── check-lessons.md
│   ├── create-findings.md
│   └── validate-quality-gates.md
├── slash-commands/             # User commands
│   ├── devflow-start.md
│   ├── devflow-status.md
│   ├── devflow-lessons.md
│   ├── devflow-findings.md
│   └── devflow-continue.md
├── workflows/                  # Workflow definitions
│   └── main-workflow.md
├── templates/                  # Documentation templates
│   ├── architecture-template.md
│   ├── requirements-template.md
│   ├── findings-template.md
│   ├── task-status-template.md
│   └── lessons-learned.md
├── core/                      # Engine code
│   └── workflow-enforcer.md
├── docs/                       # Documentation
│   ├── architecture.md
│   └── verification.md
├── task_plan.md               # Current project plan
├── findings.md                 # Current findings
├── progress.md                 # Session progress
└── package.json               # Plugin manifest
```

## Plugin Manifest (package.json)

```json
{
  "name": "devflow-enforcer",
  "version": "1.0.0",
  "description": "Software development workflow enforcer for Claude Code with 14-stage quality-gated pipeline",
  "author": "DevFlow Team",
  "license": "MIT",
  "claude": {
    "skills": [
      {
        "name": "check-lessons",
        "description": "Check lessons-learned before starting work (requirement #25)",
        "file": "skills/check-lessons.md"
      },
      {
        "name": "create-findings",
        "description": "Create findings document for a phase (requirement #11)",
        "file": "skills/create-findings.md"
      },
      {
        "name": "validate-quality-gates",
        "description": "Validate quality metrics (coverage, pass rate, security)",
        "file": "skills/validate-quality-gates.md"
      }
    ],
    "slashCommands": [
      {
        "name": "devflow-start",
        "description": "Start new DevFlow Enforcer project (requirement #5)",
        "file": "slash-commands/devflow-start.md"
      },
      {
        "name": "devflow-status",
        "description": "Show current workflow status and open findings",
        "file": "slash-commands/devflow-status.md"
      },
      {
        "name": "devflow-lessons",
        "description": "Show lessons learned from previous implementations",
        "file": "slash-commands/devflow-lessons.md"
      },
      {
        "name": "devflow-findings",
        "description": "Show open findings blocking progress",
        "file": "slash-commands/devflow-findings.md"
      },
      {
        "name": "devflow-continue",
        "description": "Resume workflow after interruption or context reset",
        "file": "slash-commands/devflow-continue.md"
      }
    ],
    "agents": [
      {
        "name": "project-lead",
        "description": "Orchestrates entire workflow, enforces process (requirement #23)",
        "type": "orchestrator",
        "file": "agents/project-lead/project-lead-agent.md"
      },
      {
        "name": "qa",
        "description": "Quality assurance, requirements validation, code review",
        "type": "quality",
        "file": "agents/qa/qa-agent.md"
      },
      {
        "name": "testing",
        "description": "Test execution, enforces 95% coverage, 100% pass rate",
        "type": "testing",
        "file": "agents/testing/testing-agent.md"
      },
      {
        "name": "architect",
        "description": "System/Software architecture, requirements engineering",
        "type": "architect",
        "file": "agents/architect/system-architect-agent.md"
      },
      {
        "name": "git-expert",
        "description": "Git operations: branch, PR, merge, rebase",
        "type": "git",
        "file": "agents/git-expert/git-expert-agent.md"
      },
      {
        "name": "security",
        "description": "Security reviews, vulnerability scanning, OWASP Top 10",
        "type": "security",
        "file": "agents/security/security-expert-agent.md"
      },
      {
        "name": "retrospective",
        "description": "Lessons-learned management, max 10% context window (requirement #26)",
        "type": "quality",
        "file": "agents/retrospective/retrospective-agent.md"
      },
      {
        "name": "coding-typescript",
        "description": "TypeScript/JavaScript feature implementation",
        "type": "coder",
        "languages": ["typescript", "javascript"],
        "file": "agents/coders/typescript-coding-agent.md"
      },
      {
        "name": "coding-python",
        "description": "Python feature implementation",
        "type": "coder",
        "languages": ["python"],
        "file": "agents/coders/python-coding-agent.md"
      },
      {
        "name": "coding-java",
        "description": "Java feature implementation",
        "type": "coder",
        "languages": ["java"],
        "file": "agents/coders/java-coding-agent.md"
      },
      {
        "name": "coding-cpp",
        "description": "C/C++ feature implementation with RAII, memory management",
        "type": "coder",
        "languages": ["c", "cpp", "c++"],
        "file": "agents/coders/cpp-coding-agent.md"
      },
      {
        "name": "coding-rust",
        "description": "Rust feature implementation with ownership, error handling",
        "type": "coder",
        "languages": ["rust"],
        "file": "agents/coders/rust-coding-agent.md"
      },
      {
        "name": "coding-csharp",
        "description": "C#/.NET feature implementation",
        "type": "coder",
        "languages": ["csharp", "csharp", "dotnet"],
        "file": "agents/coders/csharp-coding-agent.md"
      },
      {
        "name": "docker",
        "description": "Container configuration, Docker Compose orchestration",
        "type": "devops",
        "file": "agents/docker-agent.md"
      },
      {
        "name": "database",
        "description": "Schema design, migrations, query optimization",
        "type": "database",
        "file": "agents/database-agent.md"
      }
    ],
    "workflows": [
      {
        "name": "main-workflow",
        "description": "Complete 14-stage workflow with quality gates",
        "file": "workflows/main-workflow.md"
      }
    ]
  }
}
```

## Setup Script (install.sh)

```bash
#!/bin/bash
set -e

INSTALL_DIR="$HOME/.claude/skills/devflow-enforcer"
SOURCE_DIR="$(pwd)"

echo "🚀 Installing DevFlow Enforcer..."

# Create installation directory
echo "📁 Creating plugin directory..."
mkdir -p "$INSTALL_DIR"

# Copy files
echo "📋 Copying plugin files..."
cp -r "$SOURCE_DIR"/* "$INSTALL_DIR/"

# Set permissions
echo "🔐 Setting permissions..."
chmod -R 755 "$INSTALL_DIR/skills"
chmod -R 755 "$INSTALL_DIR/slash-commands"

# Create symlink for easy access (optional)
echo "🔗 Creating command symlink..."
mkdir -p "$HOME/.claude/commands"
ln -sf "$INSTALL_DIR/slash-commands"/*.md "$HOME/.claude/commands/" 2>/dev/null || true

echo ""
echo "✅ DevFlow Enforcer installed successfully!"
echo ""
echo "📋 Plugin location: $INSTALL_DIR"
echo "📋 Skills: $(ls -1 "$INSTALL_DIR/skills"/*.md | wc -l)"
echo "📋 Commands: $(ls -1 "$INSTALL_DIR/slash-commands"/*.md | wc -l)"
echo "📋 Agents: $(ls -1 "$INSTALL_DIR/agents" -R | grep -c "\.md$" | wc -l)"
echo ""
echo "🚀 Restart Claude Code to activate the plugin."
echo ""
echo "Quick start: /devflow-start"
```

## PowerShell Setup Script (install.ps1)

```powershell
# Install script for Windows
$ErrorActionPreference = "Stop"

$InstallDir = "$env:USERPROFILE\.claude\skills\devflow-enforcer"
$SourceDir = (Get-Location).Path

Write-Host "🚀 Installing DevFlow Enforcer..." -ForegroundColor Green

# Create installation directory
Write-Host "📁 Creating plugin directory..." -ForegroundColor Yellow
New-Item -ItemType Directory -Force -Path $InstallDir | Out-Null

# Copy files
Write-Host "📋 Copying plugin files..." -ForegroundColor Yellow
Copy-Item -Recurse -Force "$SourceDir\*" -Destination $InstallDir

Write-Host ""
Write-Host "✅ DevFlow Enforcer installed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Plugin location: $InstallDir" -ForegroundColor Cyan
Write-Host "🚀 Restart Claude Code to activate the plugin." -ForegroundColor Yellow
Write-Host ""
Write-Host "Quick start: /devflow-start" -ForegroundColor Cyan
```

## Verification

After installation, verify with:

```bash
# Check installation
ls -la ~/.claude/skills/devflow-enforcer/

# Test plugin discovery
claude-code --list-skills | grep devflow-enforcer

# Test commands
claude-code --list-commands | grep devflow
```

## Usage Examples

### Start New Project

```
User: /devflow-start

DevFlow: Welcome to DevFlow Enforcer!

         Before we begin, I need some information.

         What is the name of your application?

User: My Awesome App

DevFlow: Great! Initializing "My Awesome App" project...

         [Initializing git repository]
         [Creating planning files]
         [Spawning Project Lead Agent]

         Let's begin with Phase 1: Requirements Generation.
```

### Check Status

```
User: /devflow-status

DevFlow: ## DevFlow Enforcer Status

         ### Project Information
         - Application: My Awesome App
         - Started: 2026-02-12
         - Current Phase: Development

         ### Current Phase Details
         - Phase: Unit Testing
         - Status: Quality Gates Pending

         ### Quality Metrics
         | Metric | Target | Current | Status |
         |--------|--------|---------|--------|
         | Coverage | 95% | 87% | FAIL |
         | Pass Rate | 100% | 95% | FAIL |

         ⚠️ Quality gates failed. Looping back to Development phase.
```

### View Lessons

```
User: /devflow-lessons

DevFlow: ## Lessons Learned

         ### High Priority Lessons (Must Apply)
         1. 2026-02-12 - User Authentication
            Problem: Password hashing was not implemented
            Solution: Always use bcrypt for password hashing
```

## Configuration

Create `~/.claude/skills/devflow-enforcer/config.json`:

```json
{
  "defaultTechStack": "typescript",
  "coverageTarget": 95,
  "passRateTarget": 100,
  "autoBranchNaming": true,
  "enforceProcess": true
}
```

## Update & Uninstall

### Update

```bash
cd [path-to]/sw-dev-workflow
git pull
cp -r * ~/.claude/skills/devflow-enforcer/
```

### Uninstall

```bash
rm -rf ~/.claude/skills/devflow-enforcer
rm -f ~/.claude/commands/devflow-*
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Plugin not discovered | Check installation path, restart Claude Code |
| Commands not working | Verify files in slash-commands/ folder |
| Agents not spawning | Check agents/ directory structure |
| Context errors | Verify planning files exist |

---

**Installer Version:** 1.0.0
**Supported Claude Code Versions:** 1.0+
**Last Updated:** 2026-02-12
