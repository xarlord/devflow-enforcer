# Findings & Decisions

<!--
  WHAT: Your knowledge base for the task. Stores everything you discover and decide.
  WHY: Context windows are limited. This file is your "external memory" - persistent and unlimited.
  WHEN: Update after ANY discovery, especially after 2 view/browser/search operations (2-Action Rule).
-->

## Requirements
<!-- Captured from Customer_requirements.txt -->
**Application Name:** DevFlow Enforcer
- Documentation-driven software development workflow
- Integratable as Claude Code plugin
- Contains agents, skills, slash commands, workflows
- Workflows enforced by Project Lead Agent
- Always start with asking user for application name and initiate git
- Main workflow pipeline:
  1. Generate requirements
  2. Validate and make consistency check based on user input
  3. Design High Level Architecture
  4. Design Interactions / Data Models / Functional Specifications
  5. Create Testing Specification
  6. Create Features and Allocate requirements to features
  7. For each feature:
     - Create branch
     - Create detailed task list and reference docs
     - Develop functional and testing code
     - Check Linting
     - Review Code
     - Execute Unit Testing (95% coverage, 100% pass rate)
     - Create Pull Request
     - Make Static analysis and Security Check
     - Build/Integrate Code
     - Run integration Testing
     - Stage code to real world scenario and execute BDD testing
     - Build Artifacts & Update Docs
     - Pass Rate Reached - User test request
- For each phase create findings and enforce responsible agent to close findings
- Requirements must be clear, concise, verifiable - avoid vague definitions
- System should not assume about environment, technology, or code - always check
- If agent is unsure which way to go, prompt user how to handle
- New features require documentation update + main workflow enforcement
- Always spawn QA Agent and Testing Agent for testing phases
- Always spawn System/Software Architect for requirement/Design phases
- Enforce process until quality metrics satisfied (development loop)
- Document progress, fixes, task status, findings in separate docs
- If context window < 5%, update documentation and clear context, reconstruct
- Git expert for push/merge/PR/rebase operations
- Security expert for security reviews
- Separate coding agents for different tech stacks
- **MOST IMPORTANT**: Process must always be enforced
- Retrospective agent for lessons-learned document
- Agents check lessons-learned logs before starting work
- Lessons-learned doc max 10% of context window (agent manages priority)

## Research Findings
<!-- Key discoveries during exploration -->
- Planning-with-files skill provides framework for persistent documentation
- Claude Code plugin system supports: agents, skills, slash commands, workflows
- Current working directory: C:\Users\sefa.ocakli\PluginTrials\sw-dev-workflow
- Git repository initialized
- Application name: DevFlow Enforcer
- Plugin type: Claude Code Plugin (not MCP)
- Tech stacks: TypeScript/JavaScript, Python
- Architecture designed with 8 specialized agents
- Workflow defined with 13 steps per feature
- Documentation structure designed

## Technical Decisions
| Decision | Rationale |
|----------|-----------|
| Use planning-with-files approach | Complex multi-step task requiring persistent tracking |
| Customer requirements as primary spec | All requirements must be enforced |
| Application Name: DevFlow Enforcer | User selected |
| Claude Code Plugin (not MCP) | Native integration with Claude Code |
| Tech Stacks: TypeScript/JavaScript, Python | User selected as primary targets |

## Issues Encountered
| Issue | Resolution |
|-------|------------|
| | |

## Resources
<!-- URLs, file paths, API references -->
- Customer requirements: C:\Users\sefa.ocakli\PluginTrials\sw-dev-workflow\Customer_requirements.txt
- Planning files templates: C:\Users\sefa.ocakli\.claude\plugins\cache\planning-with-files\planning-with-files\2.11.0\templates\

## Visual/Browser Findings
<!-- CRITICAL: Update after every 2 view/browser operations -->
<!-- Multimodal content must be captured as text immediately -->
-

---
*Update this file after every 2 view/browser/search operations*
*This prevents visual information from being lost*
