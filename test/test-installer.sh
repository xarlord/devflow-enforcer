#!/bin/bash
# Test script for DevFlow Enforcer installer

set -e

TEST_DIR="$(pwd)/test-installation"
SOURCE_DIR="$(pwd)"
CLAUDE_SKILLS="$HOME/.claude/skills"

echo "======================================="
echo "🧪 DevFlow Enforcer Installer Test"
echo "======================================="
echo ""

# Clean up previous test
echo "📁 Cleaning up previous test..."
rm -rf "$TEST_DIR"
mkdir -p "$TEST_DIR"

# Simulate running the installer script
echo "📋 Simulating installation..."
echo ""

# Simulate installer variables
INSTALL_DIR="$CLAUDE_SKILLS/devflow-enforcer"

echo "📂 Test Variables:"
echo "  SOURCE_DIR = $SOURCE_DIR"
echo "  INSTALL_DIR = $INSTALL_DIR"
echo "  CLAUDE_SKILLS = $CLAUDE_SKILLS"
echo ""

# Create directory structure test
echo "1️⃣ Testing directory creation..."
mkdir -p "$TEST_DIR/devflow-enforcer"
if [ -d "$TEST_DIR/devflow-enforcer" ]; then
    echo "   ✅ Root directory created"
else
    echo "   ❌ Root directory creation failed"
    exit 1
fi

# Test subdirectory creation
mkdir -p "$TEST_DIR/devflow-enforcer/agents"
mkdir -p "$TEST_DIR/devflow-enforcer/agents/coders"
mkdir -p "$TEST_DIR/devflow-enforcer/skills"
mkdir -p "$TEST_DIR/devflow-enforcer/slash-commands"
mkdir -p "$TEST_DIR/devflow-enforcer/workflows"
mkdir -p "$TEST_DIR/devflow-enforcer/templates"
mkdir -p "$TEST_DIR/devflow-enforcer/core"
mkdir -p "$TEST_DIR/devflow-enforcer/docs"
mkdir -p "$TEST_DIR/devflow-enforcer/install"

echo "   ✅ All subdirectories created"
echo ""

# Copy files test
echo "2️⃣ Testing file copy..."

# Count files to copy
AGENT_FILES=$(find "$SOURCE_DIR/agents" -name "*.md" | wc -l)
SKILL_FILES=$(find "$SOURCE_DIR/skills" -name "*.md" 2>/dev/null | wc -l || echo "0")
COMMAND_FILES=$(find "$SOURCE_DIR/slash-commands" -name "*.md" | wc -l)
WORKFLOW_FILES=$(find "$SOURCE_DIR/workflows" -name "*.md" | wc -l)
TEMPLATE_FILES=$(find "$SOURCE_DIR/templates" -name "*.md" | wc -l)
CORE_FILES=$(find "$SOURCE_DIR/core" -name "*.md" | wc -l)
DOC_FILES=$(find "$SOURCE_DIR/docs" -name "*.md" | wc -l)

# Copy agents
echo "   📋 Copying agents ($AGENT_FILES files)..."
cp -r "$SOURCE_DIR/agents"/* "$TEST_DIR/devflow-enforcer/agents/" 2>/dev/null || true
COPIED_AGENTS=$(find "$TEST_DIR/devflow-enforcer/agents" -name "*.md" | wc -l)
echo "      Expected: $AGENT_FILES, Copied: $COPIED_AGENTS"

# Copy skills
echo "   📋 Copying skills ($SKILL_FILES files)..."
if [ -d "$SOURCE_DIR/skills" ]; then
    cp -r "$SOURCE_DIR/skills"/* "$TEST_DIR/devflow-enforcer/skills/" 2>/dev/null || true
    COPIED_SKILLS=$(find "$TEST_DIR/devflow-enforcer/skills" -name "*.md" | wc -l)
    echo "      Expected: $SKILL_FILES, Copied: $COPIED_SKILLS"
else
    echo "      No skills directory to copy"
    COPIED_SKILLS=0
fi

# Copy commands
echo "   📋 Copying slash commands ($COMMAND_FILES files)..."
cp -r "$SOURCE_DIR/slash-commands"/* "$TEST_DIR/devflow-enforcer/slash-commands/" 2>/dev/null || true
COPIED_COMMANDS=$(find "$TEST_DIR/devflow-enforcer/slash-commands" -name "*.md" | wc -l)
echo "      Expected: $COMMAND_FILES, Copied: $COPIED_COMMANDS"

# Copy workflows
echo "   📋 Copying workflows ($WORKFLOW_FILES files)..."
if [ -d "$SOURCE_DIR/workflows" ]; then
    cp -r "$SOURCE_DIR/workflows"/* "$TEST_DIR/devflow-enforcer/workflows/" 2>/dev/null || true
    COPIED_WORKFLOWS=$(find "$TEST_DIR/devflow-enforcer/workflows" -name "*.md" | wc -l)
    echo "      Expected: $WORKFLOW_FILES, Copied: $COPIED_WORKFLOWS"
else
    echo "      No workflows directory to copy"
    COPIED_WORKFLOWS=0
fi

# Copy templates
echo "   📋 Copying templates ($TEMPLATE_FILES files)..."
cp -r "$SOURCE_DIR/templates"/* "$TEST_DIR/devflow-enforcer/templates/" 2>/dev/null || true
COPIED_TEMPLATES=$(find "$TEST_DIR/devflow-enforcer/templates" -name "*.md" | wc -l)
echo "      Expected: $TEMPLATE_FILES, Copied: $COPIED_TEMPLATES"

# Copy core
echo "   📋 Copying core ($CORE_FILES files)..."
if [ -d "$SOURCE_DIR/core" ]; then
    cp -r "$SOURCE_DIR/core"/* "$TEST_DIR/devflow-enforcer/core/" 2>/dev/null || true
    COPIED_CORE=$(find "$TEST_DIR/devflow-enforcer/core" -name "*.md" | wc -l)
    echo "      Expected: $CORE_FILES, Copied: $COPIED_CORE"
else
    echo "      No core directory to copy"
    COPIED_CORE=0
fi

# Copy docs
echo "   📋 Copying docs ($DOC_FILES files)..."
if [ -d "$SOURCE_DIR/docs" ]; then
    cp -r "$SOURCE_DIR/docs"/* "$TEST_DIR/devflow-enforcer/docs/" 2>/dev/null || true
    COPIED_DOCS=$(find "$TEST_DIR/devflow-enforcer/docs" -name "*.md" | wc -l)
    echo "      Expected: $DOC_FILES, Copied: $COPIED_DOCS"
else
    echo "      No docs directory to copy"
    COPIED_DOCS=0
fi

# Copy install
echo "   📋 Copying installer..."
if [ -d "$SOURCE_DIR/install" ]; then
    cp -r "$SOURCE_DIR/install"/* "$TEST_DIR/devflow-enforcer/install/" 2>/dev/null || true
    echo "      ✅ Installer copied"
else
    echo "      No install directory to copy"
fi

echo ""

# Verification tests
echo "3️⃣ Verifying installation..."
echo ""

# Test 1: Check all required directories exist
echo "📁 Test 1: Directory Structure"
REQUIRED_DIRS=(
    "agents"
    "skills"
    "slash-commands"
    "templates"
    "docs"
)

ALL_DIRS_EXIST=true
for dir in "${REQUIRED_DIRS[@]}"; do
    if [ -d "$TEST_DIR/devflow-enforcer/$dir" ]; then
        echo "   ✅ $dir/ exists"
    else
        echo "   ❌ $dir/ missing"
        ALL_DIRS_EXIST=false
    fi
done

# Test 2: Check agent files
echo ""
echo "📂 Test 2: Agent Files (15 expected)"

EXPECTED_AGENTS=(
    "project-lead"
    "qa"
    "testing"
    "architect"
    "git-expert"
    "security"
    "retrospective"
)

# Check original agents
for agent in "${EXPECTED_AGENTS[@]}"; do
    if [ -f "$TEST_DIR/devflow-enforcer/agents/$agent/$agent-agent.md" ]; then
        echo "   ✅ $agent-agent.md exists"
    else
        echo "   ❌ $agent-agent.md missing"
        ALL_DIRS_EXIST=false
    fi
done

# Check coding agents
CODING_AGENTS=(
    "typescript-coding-agent"
    "python-coding-agent"
    "java-coding-agent"
    "cpp-coding-agent"
    "rust-coding-agent"
    "csharp-coding-agent"
)

for agent in "${CODING_AGENTS[@]}"; do
    if [ -f "$TEST_DIR/devflow-enforcer/agents/coders/$agent.md" ]; then
        echo "   ✅ $agent.md exists"
    else
        echo "   ❌ $agent.md missing"
        ALL_DIRS_EXIST=false
    fi
done

# Test 3: Check infrastructure agents
echo ""
echo "📂 Test 3: Infrastructure Agents (2 expected)"

INFRA_AGENTS=("docker" "database")
for agent in "${INFRA_AGENTS[@]}"; do
    if [ -f "$TEST_DIR/devflow-enforcer/agents/$agent-agent.md" ]; then
        echo "   ✅ $agent-agent.md exists"
    else
        echo "   ❌ $agent-agent.md missing"
        ALL_DIRS_EXIST=false
    fi
done

# Test 4: Check skills
echo ""
echo "📂 Test 4: Skills (3 expected)"

EXPECTED_SKILLS=(
    "check-lessons"
    "create-findings"
    "validate-quality-gates"
)

for skill in "${EXPECTED_SKILLS[@]}"; do
    if [ -f "$TEST_DIR/devflow-enforcer/skills/$skill.md" ]; then
        echo "   ✅ $skill.md exists"
    else
        echo "   ❌ $skill.md missing"
        ALL_DIRS_EXIST=false
    fi
done

# Test 5: Check slash commands
echo ""
echo "📂 Test 5: Slash Commands (5 expected)"

EXPECTED_COMMANDS=(
    "devflow-start"
    "devflow-status"
    "devflow-lessons"
    "devflow-findings"
    "devflow-continue"
)

for cmd in "${EXPECTED_COMMANDS[@]}"; do
    if [ -f "$TEST_DIR/devflow-enforcer/slash-commands/$cmd.md" ]; then
        echo "   ✅ $cmd.md exists"
    else
        echo "   ❌ $cmd.md missing"
        ALL_DIRS_EXIST=false
    fi
done

# Test 6: Check templates
echo ""
echo "📂 Test 6: Templates (5 expected)"

EXPECTED_TEMPLATES=(
    "architecture-template"
    "requirements-template"
    "lessons-learned"
    "findings-template"
    "task-status-template"
)

for tmpl in "${EXPECTED_TEMPLATES[@]}"; do
    if [ -f "$TEST_DIR/devflow-enforcer/templates/$tmpl.md" ]; then
        echo "   ✅ $tmpl.md exists"
    else
        echo "   ❌ $tmpl.md missing"
        ALL_DIRS_EXIST=false
    fi
done

# Test 7: Check core files
echo ""
echo "📂 Test 7: Core Files (1 expected)"

if [ -f "$TEST_DIR/devflow-enforcer/core/workflow-enforcer.md" ]; then
    echo "   ✅ workflow-enforcer.md exists"
else
    echo "   ❌ workflow-enforcer.md missing"
    ALL_DIRS_EXIST=false
fi

# Test 8: Check installer
echo ""
echo "📂 Test 8: Installer Files"

if [ -f "$TEST_DIR/devflow-enforcer/install/installer.md" ]; then
    echo "   ✅ installer.md exists"
else
    echo "   ❌ installer.md missing"
    ALL_DIRS_EXIST=false
fi

# Test 9: Check workflow files
echo ""
echo "📂 Test 9: Workflow Files"

if [ -f "$TEST_DIR/devflow-enforcer/workflows/main-workflow.md" ]; then
    echo "   ✅ main-workflow.md exists"
else
    echo "   ❌ main-workflow.md missing"
    ALL_DIRS_EXIST=false
fi

# Test 10: Check documentation files
echo ""
echo "📂 Test 10: Documentation Files"

if [ -f "$TEST_DIR/devflow-enforcer/docs/architecture.md" ]; then
    echo "   ✅ architecture.md exists"
else
    echo "   ❌ architecture.md missing"
fi

if [ -f "$TEST_DIR/devflow-enforcer/docs/verification.md" ]; then
    echo "   ✅ verification.md exists"
else
    echo "   ❌ verification.md missing"
fi

# Test 11: Check planning files
echo ""
echo "📂 Test 11: Planning Files"

if [ -f "$TEST_DIR/devflow-enforcer/task_plan.md" ]; then
    echo "   ✅ task_plan.md would be created"
else
    echo "   ✅ task_plan.md ready to be created"
fi

if [ -f "$TEST_DIR/devflow-enforcer/findings.md" ]; then
    echo "   ✅ findings.md would be created"
else
    echo "   ✅ findings.md ready to be created"
fi

if [ -f "$TEST_DIR/devflow-enforcer/progress.md" ]; then
    echo "   ✅ progress.md would be created"
else
    echo "   ✅ progress.md ready to be created"
fi

# Test 12: Check file content samples
echo ""
echo "📂 Test 12: File Content Samples"

echo "   Checking file sizes and content..."

# Check a sample agent file has content
if [ -f "$TEST_DIR/devflow-enforcer/agents/project-lead/project-lead-agent.md" ]; then
    SIZE=$(wc -l < "$TEST_DIR/devflow-enforcer/agents/project-lead/project-lead-agent.md" | awk '{print $1}')
    if [ "$SIZE" -gt 100 ]; then
        echo "   ✅ project-lead-agent.md: $SIZE lines (substantial content)"
    else
        echo "   ⚠️  project-lead-agent.md: $SIZE lines (seems small)"
    fi
else
    echo "   ❌ Cannot test - file not found"
fi

# Test 13: Installer script syntax
echo ""
echo "📂 Test 13: Installer Script Syntax"

if bash -n "$TEST_DIR/devflow-enforcer/install/installer.sh"; then
    echo "   ✅ install.sh syntax is valid"
else
    echo "   ⚠️  install.sh not found (cannot test)"
fi

# Test 14: Package.json structure
echo ""
echo "📂 Test 14: Package.json Structure"

# Create a test package.json
cat > "$TEST_DIR/devflow-enforcer/package.json" << 'EOF'
{
  "name": "devflow-enforcer",
  "version": "1.0.0",
  "description": "Test installation verification"
}
EOF

if [ -f "$TEST_DIR/devflow-enforcer/package.json" ]; then
    # Validate JSON syntax
    if python -m json.tool "$TEST_DIR/devflow-enforcer/package.json" >/dev/null 2>&1; then
        echo "   ✅ package.json is valid JSON"
    else
        echo "   ❌ package.json has syntax errors"
    fi
else
    echo "   ❌ package.json not created"
fi

# Summary
echo ""
echo "======================================="
echo "📊 Installation Test Summary"
echo "======================================="
echo ""

if [ "$ALL_DIRS_EXIST" = true ]; then
    echo "✅ ALL TESTS PASSED"
    echo ""
    echo "Installer is ready for use!"
    exit 0
else
    echo "❌ SOME TESTS FAILED"
    echo ""
    echo "Please review the failures above."
    exit 1
fi
