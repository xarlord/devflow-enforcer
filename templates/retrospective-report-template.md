# Retrospective Report Template

<!--
  WHAT: Template for documenting lessons learned from feature development
  USE: Phase 7m Retrospective & Requirement #25 (check lessons before work)
  REQUIREMENT: Document lessons learned to prevent repeating mistakes
-->

## [Feature Name] - Retrospective Report

**Feature ID:** FEAT-[XXX]
**Sprint:** [Sprint Number]
**Dates:** [Start Date] - [End Date]
**Team:** [Team Members]
**Retrospective Date:** [YYYY-MM-DD]
**Facilitator:** Retrospective Agent

---

## 1. Executive Summary

| Metric | Value |
|--------|-------|
| Feature | [Feature Name] |
| Status | [Completed | Delayed | Cancelled] |
| Planned Duration | [time] |
| Actual Duration | [time] |
| Variance | [+/- time] |
| Story Points | [points] |
| Team Size | [count] |

---

## 2. What Went Well

### Successes

| ID | What Went Well | Impact | Category |
|----|----------------|--------|----------|
| W-001 | [description] | [positive impact] | [Process/Technical/Team] |
| W-002 | [description] | [positive impact] | [Process/Technical/Team] |

**Details:**

#### W-001: [Success Title]

**Description:** [Detailed description of what went well]

**Why it worked:**
- [Reason 1]
- [Reason 2]

**Impact:** [Quantitative or qualitative impact]

**Action:** [Should we continue doing this? How?]

---

## 3. What Didn't Go Well

### Issues & Challenges

| ID | Issue | Impact | Severity | Category |
|----|-------|--------|----------|----------|
| D-001 | [description] | [negative impact] | High/Medium/Low | [Process/Technical/Team] |
| D-002 | [description] | [negative impact] | High/Medium/Low | [Process/Technical/Team] |

**Details:**

#### D-001: [Issue Title]

**Description:** [Detailed description of the issue]

**Root Cause Analysis:**

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Symptom   │ ──→ │  Problem    │ ──→ │  Root Cause │
│  (visible)  │     │ (identified)│     │  (underlying)│
└─────────────┘     └─────────────┘     └─────────────┘
```

**5 Whys Analysis:**
1. Why did this happen? [answer]
2. Why? [answer]
3. Why? [answer]
4. Why? [answer]
5. Why? [root cause]

**Timeline:**
| Date | Event | Impact |
|------|-------|--------|
| [date] | [event] | [impact] |

**Impact:**
- Time lost: [amount]
- Rework: [amount]
- Team morale: [effect]

---

## 4. Lessons Learned

### Technical Lessons

| ID | Lesson | Priority | Context | Action |
|----|--------|----------|---------|--------|
| TL-001 | [what we learned] | High/Medium/Low | [when this applies] | [what to do] |

**Example:**
| ID | Lesson | Priority | Context | Action |
|----|--------|----------|---------|--------|
| TL-001 | Always mock external API calls in unit tests | High | Writing unit tests for services depending on external APIs | Use MSW (Mock Service Worker) for all API mocking |

### Process Lessons

| ID | Lesson | Priority | Context | Action |
|----|--------|----------|---------|--------|
| PL-001 | [what we learned] | High/Medium/Low | [when this applies] | [what to do] |

**Example:**
| ID | Lesson | Priority | Context | Action |
|----|--------|----------|---------|--------|
| PL-001 | Code review must happen before QA testing | Medium | Feature development workflow | Update DevFlow workflow: Code Review → QA Testing |

### Team Lessons

| ID | Lesson | Priority | Context | Action |
|----|--------|----------|---------|--------|
| TL-002 | [what we learned] | High/Medium/Low | [when this applies] | [what to do] |

---

## 5. Action Items

### Immediate Actions (This Sprint)

| ID | Action | Owner | Due Date | Status |
|----|--------|-------|----------|--------|
| AI-001 | [action description] | [person] | [date] | Open/In Progress/Done |

### Short-term Actions (Next Sprint)

| ID | Action | Owner | Due Date | Status |
|----|--------|-------|----------|--------|
| AI-002 | [action description] | [person] | [date] | Open/In Progress/Done |

### Long-term Actions (Future)

| ID | Action | Owner | Target | Status |
|----|--------|-------|--------|--------|
| AI-003 | [action description] | [person] | [timeframe] | Open/In Progress/Done |

---

## 6. Metrics & Analysis

### Quality Metrics

| Metric | Target | Actual | Status | Notes |
|--------|--------|--------|--------|-------|
| Unit Test Coverage | 95% | [%] | ✅/❌ | [notes] |
| Unit Test Pass Rate | 100% | [%] | ✅/❌ | [notes] |
| Integration Tests | Pass | ✅/❌ | ✅/❌ | [notes] |
| BDD Scenarios | Pass | ✅/❌ | ✅/❌ | [notes] |
| Linting Errors | 0 | [count] | ✅/❌ | [notes] |
| Security Issues | 0 critical/high | [count] | ✅/❌ | [notes] |

### Velocity Analysis

| Sprint | Planned | Completed | Velocity | Notes |
|--------|---------|-----------|----------|-------|
| [N-2] | [points] | [points] | [points] | [notes] |
| [N-1] | [points] | [points] | [points] | [notes] |
| [N] | [points] | [points] | [points] | [notes] |

### Cycle Time Analysis

| Feature | Start | End | Duration | Target | Status |
|---------|-------|-----|----------|--------|--------|
| FEAT-001 | [date] | [date] | [days] | [days] | ✅/❌ |

---

## 7. Risk Register Update

### New Risks Identified

| Risk ID | Risk | Probability | Impact | Mitigation | Owner |
|---------|------|-------------|--------|------------|-------|
| R-001 | [description] | High/Medium/Low | High/Medium/Low | [mitigation] | [person] |

### Retired Risks

| Risk ID | Risk | Outcome | Notes |
|---------|------|---------|-------|
| R-XXX | [description] | Materialized/Avoided | [what happened] |

---

## 8. Process Improvements

### Workflow Changes

| Change | Before | After | Reason |
|--------|--------|-------|--------|
| [change] | [old process] | [new process] | [justification] |

### Tool Updates

| Tool | Change | Reason |
|------|--------|--------|
| [tool] | [what changed] | [why] |

### Documentation Updates

| Document | Update | Status |
|----------|--------|--------|
| [doc] | [what changed] | Updated/Pending |

---

## 9. Team Feedback

### Positive Feedback

| From | Feedback | Category |
|------|----------|----------|
| [person] | [positive comment] | [Process/Technical/Team] |

### Areas for Improvement

| From | Feedback | Category | Priority |
|------|----------|----------|----------|
| [person] | [constructive feedback] | [Process/Technical/Team] | High/Medium/Low |

### Action Taken on Feedback

| Feedback | Action | Outcome |
|----------|--------|---------|
| [feedback summary] | [what we did] | [result] |

---

## 10. Celebration & Recognition

| Person | Contribution | Recognition |
|--------|---------------|--------------|
| [name] | [what they did] | [thank you/award] |

---

## 11. Next Steps

### Upcoming Features

| Feature | Start Date | Notes |
|---------|------------|-------|
| FEAT-XXX | [date] | [prep needed] |

### Preparation Actions

| Action | Owner | Due Date |
|--------|-------|----------|
| [action] | [person] | [date] |

---

## 12. Lessons Learned Database Entry

### Summary for Quick Reference

**Feature:** [Feature Name]
**Sprint:** [Sprint Number]
**Date:** [YYYY-MM-DD]

**Top 3 Lessons:**
1. [Most important lesson]
2. [Second most important]
3. [Third most important]

**Tags:** [tag1, tag2, tag3]

**Full Report:** [Link to this document]

---

## 13. Retrospective Assessment

### Meeting Evaluation

| Aspect | Rating (1-5) | Notes |
|--------|--------------|-------|
| Participation | [1-5] | [notes] |
| Psychological Safety | [1-5] | [notes] |
| Actionable Outcomes | [1-5] | [notes] |
| Time Management | [1-5] | [notes] |

### Improvement for Next Retrospective

| Aspect | Improvement | Owner |
|--------|-------------|-------|
| [aspect] | [what to improve] | [who] |

---

**Retrospective Status:** [Draft | Final | Archived]
**Facilitator:** [Name]
**Next Retrospective:** [YYYY-MM-DD]

---

## Appendix A: Raw Notes

[Unfiltered notes from the retrospective meeting]

---

## Appendix B: Action Item Tracking

| ID | Action | Created | Completed | Days Open |
|----|--------|---------|-----------|-----------|
| AI-001 | [action] | [date] | [date] | [days] |

---

## Appendix C: Related Documents

- [Requirements Document]
- [Test Specification]
- [Detailed Design]
- [Feature Allocation]
- [Progress Tracking]
