# /devflow-lessons

## Slash Command

**Name:** /devflow-lessons
**Description:** Show lessons learned from previous implementations

## Behavior

Displays the lessons-learned document, filtered by relevance if specified.

## Output Format

```
## Lessons Learned

### Summary
- Total lessons: [count]
- High priority: [count]
- Medium priority: [count]
- Low priority: [count]
- Document size: [current]/[max] tokens

### Recent Lessons

#### [YYYY-MM-DD] - [Feature/Phase]
**Priority:** High | Medium | Low

**Problem:**
[What went wrong]

**Cause:**
[Root cause]

**Solution:**
[How it was fixed]

**Status:** Open | Closed

**Tags:** [tags]

---

[More lessons...]

### All Tags
[Unique list of tags for filtering]
```

## Optional Arguments

| Argument | Description |
|----------|-------------|
| `--tag [tag]` | Filter by tag |
| `--priority high` | Show only high priority |
| `--recent [N]` | Show last N lessons |

## Examples

```
USER: /devflow-lessons
[Shows all lessons]

USER: /devflow-lessons --tag security
[Shows only security-related lessons]

USER: /devflow-lessons --priority high
[Shows only high priority lessons]
```

## Implementation Notes

- Read from templates/lessons-learned.md
- Support filtering by tag, priority, and recency
- This command is useful for agents checking lessons before work (requirement #25)
