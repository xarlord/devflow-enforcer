---
name: capture-lesson
description: Capture a lesson learned when closing a finding. MANDATORY skill - cannot close findings without capturing lessons. Use when resolving issues, bugs, or findings to prevent repeated mistakes.
user-invocable: true
---

# Skill: Capture Lesson Learned

## Overview

This skill captures a lesson learned when closing a finding. It is MANDATORY - you cannot close findings without capturing what was learned.

**CRITICAL ENFORCEMENT:** This skill enforces knowledge retention. Every closed finding MUST have an associated lesson.

## Purpose

Per workflow requirement: "When a finding is closed, the workflow must enforce documenting what was learned."

This prevents:
- Knowledge loss when team members leave
- Repeated mistakes across features
- Loss of problem-solving context

## When to Use

- When closing any finding
- When resolving a bug or issue
- When completing a phase with findings
- When user explicitly requests lesson capture

## Execution Flow

```
1. VALIDATE required fields
2. CREATE LessonLearned object
3. SAVE to templates/lessons-learned.md
4. LINK to finding
5. CONFIRM capture complete
```

## Required Parameters

| Parameter | Type | Description | Required |
|-----------|------|-------------|----------|
| findingId | string | ID of the finding being closed | Yes |
| category | enum | Technical, Process, Communication, Tooling | Yes |
| title | string | Brief title of the lesson (max 80 chars) | Yes |
| description | string | What was the issue? | Yes |
| rootCause | string | Why did this happen? | Yes |
| solution | string | How was it resolved? | Yes |
| preventionSteps | string[] | Steps to prevent recurrence | Yes |
| tags | string[] | Tags for categorization | No |
| priority | enum | Critical, High, Medium, Low | No (default: High) |

## Lesson Categories

| Category | Description | Example |
|----------|-------------|---------|
| Technical | Code, architecture, infrastructure | "Always validate API responses" |
| Process | Workflow, methodology, procedures | "Review PRs before merging" |
| Communication | Documentation, collaboration | "Document API changes in changelog" |
| Tooling | Build tools, CI/CD, frameworks | "Pin dependency versions" |

## Output Format

```markdown
## Lesson Captured: [Title]

- **ID:** LESSON-[timestamp]-[random]
- **Finding:** [findingId]
- **Category:** [category]
- **Priority:** [priority]
- **Captured:** [timestamp]

### Problem
[description]

### Root Cause
[rootCause]

### Solution
[solution]

### Prevention Steps
1. [step 1]
2. [step 2]
...

### Tags
[tag1], [tag2], ...

---
*This lesson has been saved to templates/lessons-learned.md*
```

## Example Usage

### Example 1: Capturing a Technical Lesson

```
USER: I fixed the SQL injection vulnerability in the user search feature.

[Agent captures lesson]

SKILL INPUT:
{
  "findingId": "FIND-2026-0217-001",
  "category": "Technical",
  "title": "SQL Injection in User Search",
  "description": "User search feature was vulnerable to SQL injection attacks through the name parameter",
  "rootCause": "Direct string concatenation in SQL query instead of parameterized queries",
  "solution": "Replaced string concatenation with parameterized queries using the ORM",
  "preventionSteps": [
    "Always use parameterized queries for database operations",
    "Never trust user input - always sanitize",
    "Run SQL injection scans in CI/CD pipeline"
  ],
  "tags": ["security", "sql", "injection", "database"],
  "priority": "Critical"
}

SKILL OUTPUT:
## Lesson Captured: SQL Injection in User Search

- **ID:** LESSON-20260217-a1b2c3d4
- **Finding:** FIND-2026-0217-001
- **Category:** Technical
- **Priority:** Critical
- **Captured:** 2026-02-17T11:30:00Z

### Problem
User search feature was vulnerable to SQL injection attacks through the name parameter

### Root Cause
Direct string concatenation in SQL query instead of parameterized queries

### Solution
Replaced string concatenation with parameterized queries using the ORM

### Prevention Steps
1. Always use parameterized queries for database operations
2. Never trust user input - always sanitize
3. Run SQL injection scans in CI/CD pipeline

### Tags
security, sql, injection, database

---
*This lesson has been saved to templates/lessons-learned.md*
```

### Example 2: Capturing a Process Lesson

```
USER: The build failed because we forgot to update the lock file.

SKILL INPUT:
{
  "findingId": "FIND-2026-0217-002",
  "category": "Process",
  "title": "Package Lock File Not Updated",
  "description": "Build failed because package-lock.json was not updated after adding new dependency",
  "rootCause": "Developer added dependency but did not commit lock file changes",
  "solution": "Added pre-commit hook to verify lock file is updated when package.json changes",
  "preventionSteps": [
    "Always commit lock file when changing package.json",
    "Run npm ci instead of npm install in CI",
    "Add pre-commit hook to check for lock file sync"
  ],
  "tags": ["build", "npm", "dependencies", "ci"],
  "priority": "Medium"
}
```

## Enforcement Rules

1. **MANDATORY:** All findings must have lessons captured before closing
2. **BLOCKING:** Phase transition is blocked if findings closed without lessons
3. **PERSISTENCE:** Lessons are saved to `templates/lessons-learned.md`
4. **DISCOVERY:** Lessons are checked by `check-lessons` skill before agent work

## Integration with Workflow

```
FINDING CREATED → ASSIGNED → RESOLVED → [CAPTURE LESSON] → CLOSED
                                            ↑
                                    MANDATORY STEP
```

## Error Messages

| Error | Cause | Resolution |
|-------|-------|------------|
| "Finding ID required" | No findingId provided | Provide the finding ID |
| "Description required" | Empty description | Describe what the issue was |
| "Root cause required" | Empty rootCause | Explain why this happened |
| "Solution required" | Empty solution | Explain how it was fixed |
| "Prevention steps required" | Empty preventionSteps | List steps to prevent recurrence |
| "Invalid category" | Category not in enum | Use: Technical, Process, Communication, Tooling |

## Files Modified

- `templates/lessons-learned.md` - Lessons are appended here
- `findings.md` - Finding updated with lesson reference
- `.devflow/context-checkpoint.md` - Included in context checkpoints
