# Skill: Create Findings

## Skill

**Name:** create-findings
**Description:** Create findings document for a phase (requirement #11)

## Purpose

Per requirement #11: "For each phase create finding and enforce responsible agent to close the finding."

## Behavior

```
1. CREATE findings document for phase
2. INITIALIZE findings table
3. ASSIGN findings to appropriate agent
4. NOTIFY Project Lead Agent of findings
```

## Input Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| phase | string | Name of the phase |
| phaseId | string | ID of the phase |
| agentType | string | Agent type to assign findings to |
| findings | array | Initial findings to create (optional) |

## Output Format

Creates a findings document:

```markdown
# [Phase Name] - Findings

## Phase Information
**Phase:** [Phase Name]
**Started:** [YYYY-MM-DD]
**Assigned Agent:** [Agent Name]
**Status:** In Progress

## Findings Table
| ID | Finding | Severity | Assigned To | Status |
|----|---------|----------|-------------|--------|
| F001 | [Description] | Critical | High | Medium | Low | [Agent] | Open |
```

## Example Usage

```
PROJECT LEAD: Starting Phase: Requirements Generation

[Project Lead calls create-findings skill]
{
  "phase": "Requirements Generation",
  "phaseId": "requirements",
  "agentType": "system-architect",
  "findings": [
    {
      "description": "Complete requirements generation with clear, concise, verifiable requirements",
      "severity": "High"
    }
  ]
}

SKILL OUTPUT:
Findings document created: findings/requirements-findings.md
Assigned to: System/Software Architect Agent
F001 assigned
```

## Enforcement

Findings MUST be closed before proceeding to next phase. The Project Lead Agent enforces this by:

1. Calling `create-findings` at phase start
2. Assigning to appropriate agent
3. Checking findings status before phase transition
4. Blocking transition if findings are open
5. Looping back to phase if needed
