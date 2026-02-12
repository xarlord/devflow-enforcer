# Skill: Check Lessons Learned

## Skill

**Name:** check-lessons
**Description:** Check lessons-learned before starting work (requirement #25)

## Purpose

Per requirement #25: "When an agent start to work it will always first check the lessons-learned logs."

This skill should be called by ALL agents before starting any work.

## Behavior

```
1. READ lessons-learned.md
2. FILTER relevant lessons:
   - Lessons tagged with agent type
   - Lessons tagged with current technology
   - All High priority lessons
3. RETURN relevant lessons to agent
4. AGENT applies lessons to current task
```

## Input Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| agentType | string | Type of agent calling this skill |
| technology | string | Current technology (e.g., "python", "typescript") |
| featureType | string | Type of feature being implemented (optional) |

## Output Format

```
## Relevant Lessons for [Agent Type]

### High Priority Lessons (Must Apply)
1. [Date] - [Feature/Phase]
   Problem: [What went wrong]
   Solution: [How to avoid]

2. ...

### Relevant Technology Lessons
1. [Date] - [Feature/Phase]
   Problem: [What went wrong]
   Solution: [How to avoid]

### Related Feature Lessons
1. [Date] - [Feature/Phase]
   Problem: [What went wrong]
   Solution: [How to avoid]

### Summary
- Total relevant lessons: [count]
- Must apply: [count]
- Recommended to apply: [count]
```

## Example Usage

```
AGENT: I'm about to start implementing user authentication.

[Agent calls check-lessons skill]
{
  "agentType": "python-coding",
  "technology": "python",
  "featureType": "authentication"
}

SKILL OUTPUT:
## Relevant Lessons for Python Coding Agent

### High Priority Lessons (Must Apply)
1. 2026-02-12 - User Authentication Feature
   Problem: Password hashing was not implemented
   Solution: Always use bcrypt for password hashing

2. 2026-01-20 - Security Review
   Problem: SQL injection vulnerability
   Solution: Always use parameterized queries

AGENT: Thank you. I will apply these lessons:
- Use bcrypt for password hashing
- Use parameterized queries for database access
```

## Enforcement

This is a MANDATORY skill per requirement #25. All agents MUST call this skill before starting work.

The Project Lead Agent should enforce this by:
1. Spawning agents with instruction to check lessons
2. Verifying agent acknowledges lessons
3. Logging failures to lessons-learned (meta-lesson!)
