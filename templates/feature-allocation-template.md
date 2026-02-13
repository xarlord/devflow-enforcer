# Feature Allocation Template

<!--
  WHAT: Template for allocating requirements to features with sprint planning
  USE: Phase 6 - Feature Creation & Allocation
  REQUIREMENT: All requirements must be allocated to features before development
-->

## [Application Name] - Feature Allocation

**Version:** 1.0.0
**Created:** [YYYY-MM-DD]
**Architect:** System/Software Architect Agent
**Sprint:** [Sprint Number/Name]
**Status:** [Draft | Under Review | Approved]

---

## 1. Allocation Summary

| Metric | Value |
|--------|-------|
| Total Requirements | [count] |
| Total Features | [count] |
| Allocated Requirements | [count] |
| Unallocated Requirements | [count] |
| Allocation Coverage | [%] |

---

## 2. Feature Breakdown

### Feature Matrix

| Feature ID | Feature Name | Requirements | Priority | Complexity | Story Points | Sprint | Status |
|------------|--------------|--------------|----------|------------|--------------|--------|--------|
| FEAT-001 | [Feature Name] | FR-001, FR-002 | High | Medium | 8 | Sprint 1 | Pending |
| FEAT-002 | [Feature Name] | FR-003, FR-004 | Medium | Low | 5 | Sprint 1 | Pending |
| FEAT-003 | [Feature Name] | FR-005 | High | High | 13 | Sprint 2 | Pending |

### Feature Details

#### FEAT-001: [Feature Name]

**Description:** [Brief description of what this feature does]

**Business Value:** [Why this feature matters to users/business]

**Allocated Requirements:**

| Requirement ID | Description | Priority | Status |
|---------------|-------------|----------|--------|
| FR-001 | [requirement description] | High | Pending |
| FR-002 | [requirement description] | High | Pending |

**Dependencies:**
- [Dependency 1] - [description]
- [Dependency 2] - [description]

**Technical Considerations:**
- [Consideration 1]
- [Consideration 2]

**Acceptance Criteria:**
- [ ] [Criterion 1]
- [ ] [Criterion 2]
- [ ] [Criterion 3]

**Definition of Done:**
- [ ] Code complete and reviewed
- [ ] Unit tests with 95%+ coverage
- [ ] Integration tests passing
- [ ] BDD scenarios passing
- [ ] Documentation updated
- [ ] Security scan clean

**Estimated Effort:**

| Activity | Hours | Owner |
|----------|-------|-------|
| Development | [time] | [developer] |
| Testing | [time] | [QA] |
| Code Review | [time] | [reviewer] |
| Documentation | [time] | [technical writer] |
| **Total** | **[total]** | |

---

## 3. Priority Allocation

### Must-Have Features (MVP)

| Feature ID | Feature Name | Requirements | Sprint | Blocker |
|------------|--------------|--------------|--------|---------|
| FEAT-001 | [Feature] | FR-001, FR-002 | Sprint 1 | Blocks [feature] |
| FEAT-003 | [Feature] | FR-005 | Sprint 1 | None |

### Should-Have Features

| Feature ID | Feature Name | Requirements | Sprint | Notes |
|------------|--------------|--------------|--------|-------|
| FEAT-004 | [Feature] | FR-006 | Sprint 2 | [notes] |

### Could-Have Features

| Feature ID | Feature Name | Requirements | Sprint | Notes |
|------------|--------------|--------------|--------|-------|
| FEAT-005 | [Feature] | FR-007 | Sprint 3 | If time permits |

### Won't-Have Features (Future)

| Feature ID | Feature Name | Requirements | Notes |
|------------|--------------|--------------|-------|
| FEAT-006 | [Feature] | FR-008 | Post-MVP |

---

## 4. Sprint Allocation

### Sprint 1

**Goal:** [Sprint goal description]

**Features:**

| Feature ID | Feature Name | Story Points | Priority | Status |
|------------|--------------|--------------|----------|--------|
| FEAT-001 | [Feature] | 8 | High | Not Started |
| FEAT-003 | [Feature] | 5 | High | Not Started |

**Capacity:** [total] story points
**Team Velocity:** [velocity] story points/sprint

### Sprint 2

**Goal:** [Sprint goal description]

**Features:**

| Feature ID | Feature Name | Story Points | Priority | Status |
|------------|--------------|--------------|----------|--------|
| FEAT-002 | [Feature] | 13 | Medium | Not Started |
| FEAT-004 | [Feature] | 8 | Medium | Not Started |

---

## 5. Dependency Graph

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  FEAT-001   │ ──→ │  FEAT-002   │ ──→ │  FEAT-004   │
│ (Auth)      │     │ (User Mgmt) │     │ (Profile)   │
└─────────────┘     └─────────────┘     └─────────────┘
                            │
                            ▼
                     ┌─────────────┐
                     │  FEAT-003   │
                     │ (Dashboard) │
                     └─────────────┘
```

### Dependency Table

| Feature | Depends On | Blocks | Type |
|---------|------------|--------|------|
| FEAT-002 | FEAT-001 | FEAT-004 | Hard |
| FEAT-003 | FEAT-002 | None | Hard |
| FEAT-004 | FEAT-002 | None | Soft |

---

## 6. Resource Allocation

### Team Capacity

| Team Member | Role | Hours/Sprint | Allocation |
|-------------|------|--------------|------------|
| [Name] | Developer | [hours] | [features] |
| [Name] | QA | [hours] | [features] |
| [Name] | DevOps | [hours] | [infrastructure] |

### Skill Requirements

| Feature | Skills Required | Assigned To |
|---------|----------------|-------------|
| FEAT-001 | [skill 1], [skill 2] | [person] |
| FEAT-002 | [skill 1], [skill 3] | [person] |

---

## 7. Risk Assessment

| Feature | Risk | Impact | Mitigation |
|---------|------|--------|------------|
| FEAT-001 | [risk description] | High | [mitigation plan] |
| FEAT-002 | [risk description] | Medium | [mitigation plan] |

---

## 8. Traceability Matrix

### Requirement to Feature Mapping

| Requirement ID | Feature ID | Feature Name | Status |
|---------------|------------|--------------|--------|
| FR-001 | FEAT-001 | [Feature] | Pending |
| FR-002 | FEAT-001 | [Feature] | Pending |
| FR-003 | FEAT-002 | [Feature] | Pending |

### Unallocated Requirements

| Requirement ID | Description | Priority | Action |
|---------------|-------------|----------|--------|
| FR-999 | [description] | High | Create new feature or assign to existing |

---

## 9. Release Planning

### MVP Release

**Target Date:** [date]

**Features:**

| Feature ID | Feature Name | Status |
|------------|--------------|--------|
| FEAT-001 | [Feature] | Must Have |
| FEAT-003 | [Feature] | Must Have |

**Success Criteria:**
- [ ] All MVP features complete
- [ ] Quality gates passed (95% coverage, 100% pass rate)
- [ ] User acceptance completed
- [ ] Documentation complete

### Future Releases

| Release | Target Date | Features | Status |
|---------|-------------|----------|--------|
| v1.1 | [date] | FEAT-002, FEAT-004 | Planned |
| v2.0 | [date] | FEAT-005, FEAT-006 | Roadmap |

---

## 10. Feature Workflow Integration

### DevFlow Phases per Feature

Each feature will go through the following DevFlow Enforcer phases:

| Phase | Agent | Output | Quality Gate |
|-------|-------|--------|--------------|
| 7a | Git Expert | Feature branch | Branch created |
| 7b | Project Lead | Task list | Tasks defined |
| 7c | Coding Agent | Code + Tests | 95% coverage, 100% pass |
| 7d | - | Linting clean | 0 errors |
| 7e | QA Agent | Code review | Review approved |
| 7f | Testing Agent | Test results | Tests pass |
| 7g | Git Expert | Pull request | PR created |
| 7h | Security Expert | Security scan | 0 critical/high |
| 7i | Git Expert + Coding | Integration | Code integrated |
| 7j | Testing Agent | Integration tests | Tests pass |
| 7k | Testing + QA | BDD tests | Scenarios pass |
| 7l | - | Artifacts | Build complete |
| 7m | QA Agent | UAT | User satisfied |

---

## 11. Monitoring & Tracking

### Feature Status Dashboard

| Feature | Phase | Assignee | Progress | Blockers |
|---------|-------|----------|----------|----------|
| FEAT-001 | 7c | [developer] | 60% | None |
| FEAT-002 | Planning | - | 0% | Waiting for FEAT-001 |

### Burndown Chart

**Sprint [X] Burndown:**

```
100% │
     │  ╱
 75% │ ╱  ╲
     │╱     ╲
 50% │       ╲___
     │          ╲___
 25% │             ╲___
     │                ╲___
  0% │___________________╲___
     Day 1  2  3  4  5  6  7
```

---

## 12. Allocation Review Checklist

- [ ] All requirements allocated to features
- [ ] No orphan requirements
- [ ] Dependencies documented
- [ ] Story points estimated
- [ ] Sprint capacity planned
- [ ] Resource assignment complete
- [ ] Risks assessed
- [ ] Release targets defined
- [ ] Definition of Done established

---

**Feature Allocation Status:** [Draft | Under Review | Approved]
**Approved By:** [Product Owner / Project Lead]
**Approved Date:** [YYYY-MM-DD]

---

## Change History

| Date | Version | Changes | Author |
|------|---------|---------|--------|
| [YYYY-MM-DD] | 1.0.0 | Initial allocation | [Author] |
