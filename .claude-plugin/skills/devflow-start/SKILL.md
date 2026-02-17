---
name: devflow-start
description: Start a new DevFlow Enforcer project - asks for application name and initializes git repository. Use when beginning a new software development project or when the user wants to start the DevFlow 14-phase workflow.
user-invocable: true
---

# DevFlow Start

## Overview

Starts a new DevFlow Enforcer project. This slash command initiates the 14-phase software development workflow with context optimization.

## Execution Flow

1. **Ask for application name** - "What is the name of the application?"
2. **Verify/Initialize git repository** - Ensure git is properly set up
3. **Create planning files**:
   - `task_plan.md` - Overall project plan
   - `findings.md` - Issues and findings tracker
   - `progress.md` - Progress log
4. **Spawn Project Lead Agent** - Begin Phase 1: Requirements Generation

## Example Session

**USER:** `/devflow-start`

**DEVFLOW:** Welcome to DevFlow Enforcer v2.0!

Before we begin, I need some information.

**What is the name of the application?**

Once you provide the application name, I will:
1. Initialize/verify git repository
2. Create planning files (task_plan.md, findings.md, progress.md)
3. Spawn the Project Lead Agent
4. Begin Phase 1: Requirements Generation

## Implementation Notes

- Check if git repo already exists before proceeding
- Create `.devflow/` directory for project metadata if needed
- Set up initial planning files with application name
- Pass control to Project Lead Agent for requirements gathering
