#!/bin/bash

# DevFlow Enforcer v2.0 - Installer
# Works on macOS and Linux

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m' # No Color

echo -e "${NC}"
echo -e "${BOLD}============================================================${NC}"
echo -e "${CYAN}DevFlow Enforcer v2.0 - Installation${NC}"
echo -e "${BOLD}============================================================${NC}"
echo -e ""

# Get platform and paths
PLATFORM="$(uname -s)"
HOME_DIR="$HOME"
CLAUDE_PLUGINS="$HOME_DIR/.claude/plugins"
PLUGIN_NAME="devflow-enforcer"
DEST_DIR="$CLAUDE_PLUGINS/$PLUGIN_NAME"
PROJECT_ROOT="$(cd "$(dirname "$0")" && pwd)"

echo -e "${BLUE}Platform:${NC}     $PLATFORM"
echo -e "${BLUE}Claude Plugins:${NC} $CLAUDE_PLUGINS"
echo -e "${BLUE}Project Root:${NC}    $PROJECT_ROOT"
echo -e "${BLUE}Destination:${NC}    $DEST_DIR"
echo -e ""

# Check if already installed
if [ -d "$DEST_DIR" ]; then
    echo -e "${YELLOW}[!] Plugin already installed. Removing old version...${NC}"
    rm -rf "$DEST_DIR"
    echo -e "${GREEN}✓ Old version removed${NC}"
fi

# Create destination directory
echo -e "${CYAN}[*] Creating plugin directory...${NC}"
mkdir -p "$DEST_DIR"
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Created: $DEST_DIR${NC}"
else
    echo -e "${RED}[X] Failed to create directory${NC}"
    exit 1
fi

# Copy files function
copy_item() {
    local src="$1"
    local dest="$2"
    local desc="$3"

    if [ -e "$src" ]; then
        cp -r "$src" "$dest"
        echo -e "${GREEN}  ✓ Copied: $desc${NC}"
    else
        echo -e "${YELLOW}  ⚠ Skipped (not found): $src${NC}"
    fi
}

echo -e ""
echo -e "${CYAN}[*] Copying files...${NC}"
echo ""

# Copy all items
copy_item "agents" "Agent specifications"
copy_item "core" "Core infrastructure"
copy_item "docs" "Documentation"
copy_item "README.md" "Main readme"
copy_item "LICENSE" "License file"

echo -e ""
echo -e "${BOLD}============================================================${NC}"
echo -e "${GREEN}Installation Complete!${NC}"
echo -e "${BOLD}============================================================${NC}"
echo -e ""
echo -e "${CYAN}DevFlow Enforcer has been installed to:${NC}"
echo -e "${BLUE}  $DEST_DIR${NC}"
echo -e ""
echo -e "${CYAN}Next steps:${NC}"
echo -e "  1. Restart Claude Code"
echo -e "  2. Plugin will auto-activate on software tasks"
echo ""
