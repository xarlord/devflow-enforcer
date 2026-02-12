# TypeScript/JavaScript Coding Agent

## Agent Specification

## Agent Capabilities
- TypeScript/JavaScript feature development
- Jest test implementation
- ESLint configuration and enforcement

### Configuration Options
load: true # Load only this agent spec when needed

## Responsibilities

1. **Feature Development** (Phase 7c)
   - Implement functional code
   - Implement test code
   - Follow TypeScript/JavaScript best practices

2. **Linting** (Phase 7d)
   - Run ESLint
   - Fix all linting errors
   - Ensure code style consistency

3. **Test Implementation**
   - Write Jest tests
   - Achieve 95% coverage
   - Ensure 100% pass rate

## Tech Stack

**Languages:** TypeScript, JavaScript
**Framework:** Node.js
**Testing:** Jest, @jest/globals
**Linting:** ESLint, Prettier
**BDD:** @cucumber/cucumber

## Development Checklist

Before marking development complete:

- [ ] Code implements all requirements
- [ ] Code follows TypeScript/JavaScript best practices
- [ ] Tests written for all functionality
- [ ] ESLint passes with 0 errors
- [ ] Coverage >= 95%
- [ ] All tests pass (100%)
- [ ] Lessons-learned checked (requirement #25)

## Pre-Development Check (Requirement #25)

```
BEFORE starting any development:

1. READ lessons-learned.md
2. FILTER for relevant lessons:
   - TypeScript/JavaScript related
   - Similar feature types
   - High priority lessons
3. APPLY lessons to current task
4. AVOID repeating mistakes
```

## Quality Gates

| Metric | Target | Action |
|--------|--------|--------|
| ESLint Errors | 0 | Fix before proceeding |
| Test Coverage | 95% | Write more tests |
| Test Pass Rate | 100% | Fix failing tests |

## Linting Configuration

```json
{
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:security/recommended"
  ],
  "rules": {
    "no-unused-vars": "error",
    "no-console": "warn",
    "security/detect-object-injection": "warn"
  }
}
```

## Testing Example

```typescript
// Feature code
export function add(a: number, b: number): number {
  return a + b;
}

// Test code
import { add } from './math';

describe('Math Functions', () => {
  describe('add', () => {
    it('should add two positive numbers', () => {
      expect(add(2, 3)).toBe(5);
    });

    it('should handle negative numbers', () => {
      expect(add(-2, 3)).toBe(1);
    });

    it('should handle zero', () => {
      expect(add(0, 0)).toBe(0);
    });
  });
});
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
    summary: 'Implemented auth feature with 95% coverage',
    nextPhase: 'code-review',
    criticalFindings: [],
    data: {
        filesCreated: ['auth.ts', 'auth.test.ts', 'auth.types.ts'],
        linesOfCode: 250,
        functionsImplemented: 8,
        tests: {
            files: ['auth.test.ts'],
            cases: 15,
            coverage: 95,
            passRate: 100
        },
        linting: { errors: 0, warnings: 2, status: 'pass' },
        lessonsApplied: ['LESSON-2024-001: Always validate inputs']
    }
};
```
