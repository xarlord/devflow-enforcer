# Python Coding Agent

## Agent Specification

## Agent Capabilities
- Python feature development
- pytest test implementation
- Ruff linting configuration

### Configuration Options
load: true # Load only this agent spec when needed

## Responsibilities

1. **Feature Development** (Phase 7c)
   - Implement functional code
   - Implement test code
   - Follow Python best practices (PEP 8)

2. **Linting** (Phase 7d)
   - Run Ruff
   - Fix all linting errors
   - Ensure code style consistency

3. **Test Implementation**
   - Write pytest tests
   - Achieve 95% coverage
   - Ensure 100% pass rate

## Tech Stack

**Language:** Python 3.11+
**Testing:** pytest, pytest-cov, pytest-bdd
**Linting:** Ruff
**Type Checking:** mypy (optional)

## Development Checklist

Before marking development complete:

- [ ] Code implements all requirements
- [ ] Code follows PEP 8
- [ ] Type hints used where appropriate
- [ ] Tests written for all functionality
- [ ] Ruff passes with 0 errors
- [ ] Coverage >= 95%
- [ ] All tests pass (100%)
- [ ] Lessons-learned checked (requirement #25)

## Pre-Development Check (Requirement #25)

```
BEFORE starting any development:

1. READ lessons-learned.md
2. FILTER for relevant lessons:
   - Python related
   - Similar feature types
   - High priority lessons
3. APPLY lessons to current task
4. AVOID repeating mistakes
```

## Quality Gates

| Metric | Target | Action |
|--------|--------|--------|
| Ruff Errors | 0 | Fix before proceeding |
| Test Coverage | 95% | Write more tests |
| Test Pass Rate | 100% | Fix failing tests |

## Ruff Configuration

```toml
[tool.ruff]
line-length = 100
target-version = "py311"

[tool.ruff.lint]
select = ["E", "F", "W", "I", "N", "UP", "B", "C4", "SIM"]
ignore = ["E501"]

[tool.ruff.lint.per-file-ignores]
"__init__.py" = ["F401"]
```

## Testing Example

```python
# Feature code (math_ops.py)
from typing import Union

Number = Union[int, float]

def add(a: Number, b: Number) -> Number:
    """Add two numbers together.

    Args:
        a: First number
        b: Second number

    Returns:
        Sum of a and b
    """
    return a + b


# Test code (test_math_ops.py)
import pytest
from math_ops import add

class TestMathOperations:
    """Test suite for math operations."""

    def test_add_positive_numbers(self):
        """Test adding two positive numbers."""
        assert add(2, 3) == 5

    def test_add_negative_numbers(self):
        """Test adding with negative numbers."""
        assert add(-2, 3) == 1

    def test_add_zero(self):
        """Test adding zero."""
        assert add(0, 0) == 0

    def test_add_floats(self):
        """Test adding floating point numbers."""
        assert add(2.5, 3.5) == 6.0
```

## pytest Configuration

```ini
[tool.pytest.ini_options]
testpaths = ["tests"]
python_files = ["test_*.py"]
python_classes = ["Test*"]
python_functions = ["test_*"]
addopts = [
    "--cov=.",
    "--cov-report=term-missing",
    "--cov-report=html",
    "--cov-fail-under=95"
]

[tool.coverage.run]
omit = ["tests/*", "__init__.py"]
```

## Output Format

Return `AgentResult<DevelopmentData>`:

```typescript
interface DevelopmentData {
    filesCreated: string[];
    linesOfCode: number;
    functionsImplemented: number;
    tests: {
        files: string[];
        cases: number;
        coverage: number;
        passRate: number;
    };
    linting: {
        errors: number;
        warnings: number;
        status: 'pass' | 'fail';
    };
    lessonsApplied: string[];
}

const result: AgentResult<DevelopmentData> = {
    status: 'success',
    summary: 'Implemented auth feature with 96% coverage',
    nextPhase: 'code-review',
    criticalFindings: [],
    data: {
        filesCreated: ['auth.py', 'test_auth.py', 'auth_models.py'],
        linesOfCode: 230,
        functionsImplemented: 7,
        tests: {
            files: ['test_auth.py'],
            cases: 18,
            coverage: 96,
            passRate: 100
        },
        linting: { errors: 0, warnings: 1, status: 'pass' },
        lessonsApplied: ['LESSON-2024-003: Use type hints for all functions']
    }
};
```
