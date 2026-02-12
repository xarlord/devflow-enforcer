# Skill: Validate Quality Gates

## Skill

**Name:** validate-quality-gates
**Description:** Validate quality metrics (coverage, pass rate, security, etc.)

## Purpose

Enforce quality gates before allowing phase transitions.

## Quality Gates

| Gate | Target | Action if Failed |
|------|--------|------------------|
| coverage-95 | 95% unit test coverage | Loop back to Development |
| pass-rate-100 | 100% test pass rate | Loop back to Development |
| no-lint-errors | 0 linting errors | Block until fixed |
| no-critical-vulnerabilities | 0 critical/high security issues | Block until fixed |
| requirements-clear | All requirements clear | Loop back to Requirements |
| requirements-concise | All requirements concise | Loop back to Requirements |
| requirements-verifiable | All requirements verifiable | Loop back to Requirements |

## Behavior

```
1. RUN quality checks for specified gates
2. COLLECT results
3. VALIDATE against targets
4. IF all gates pass:
      RETURN success
   ELSE:
      RETURN failure with loop-back phase
```

## Input Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| gates | array | Array of quality gates to validate |
| context | object | Context for running checks (paths, etc.) |

## Output Format

```
## Quality Gate Validation

### Results
| Gate | Target | Actual | Status |
|------|--------|---------|--------|
| coverage-95 | 95% | 97% | PASS |
| pass-rate-100 | 100% | 100% | PASS |

### Overall Status: PASS

[or]

## Quality Gate Validation

### Results
| Gate | Target | Actual | Status |
|------|--------|---------|--------|
| coverage-95 | 95% | 82% | FAIL |
| pass-rate-100 | 100% | 95% | FAIL |

### Overall Status: FAIL

### Action Required
Loop back to: Development phase

Test coverage is below 95% threshold.
Pass rate is below 100% threshold.

Please add more tests and fix failing tests.
```

## Example Usage

```
TESTING AGENT: Running unit tests...

[Testing Agent calls validate-quality-gates]
{
  "gates": ["coverage-95", "pass-rate-100"],
  "context": {
    "testPath": "tests/",
    "sourcePath": "src/"
  }
}

SKILL OUTPUT:
## Quality Gate Validation

### Results
| Gate | Target | Actual | Status |
|------|--------|---------|--------|
| coverage-95 | 95% | 82% | FAIL |
| pass-rate-100 | 100% | 95% | FAIL |

### Overall Status: FAIL

### Action Required
Loop back to: Development phase

TESTING AGENT: Quality gates failed. Notifying Project Lead Agent...
```

## Implementation

Per-gate implementation:

### coverage-95
```bash
# Python
pytest --cov=src --cov-report=term-missing

# TypeScript
jest --coverage
```

### pass-rate-100
```bash
# Python
pytest

# TypeScript
jest
```

### no-lint-errors
```bash
# Python
ruff check src/

# TypeScript
eslint src/
```

### no-critical-vulnerabilities
```bash
# Python
pip-audit
safety check

# TypeScript
npm audit
```
