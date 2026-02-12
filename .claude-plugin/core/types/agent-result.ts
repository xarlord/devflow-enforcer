# Agent Result Type

## Purpose

Structured output interface for all agent responses to minimize token usage while maintaining clarity.

## Interface Definition

```typescript
interface AgentResult<T = object> {
    status: 'success' | 'failure' | 'blocked';
    summary: string;
    nextPhase?: string;
    criticalFindings: string[];
    data?: T;
}
```

## Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| status | enum | Yes | Overall result status |
| summary | string | Yes | One-line summary of what was done |
| nextPhase | string | No | Suggested next workflow phase |
| criticalFindings | string[] | Yes | List of issues that must be addressed |
| data | T | No | Type-specific additional data |

## Status Values

| Status | Meaning | Action |
|--------|---------|--------|
| success | Agent completed task successfully | Proceed to next phase |
| failure | Agent encountered errors | Review and retry |
| blocked | Agent cannot proceed without input | Request clarification |

## Usage Examples

### QA Agent Result

```typescript
interface CodeReviewData {
    issuesReviewed: number;
    criticalIssues: number;
    filesChecked: string[];
}

const result: AgentResult<CodeReviewData> = {
    status: 'success',
    summary: 'Reviewed 15 files, found 3 issues',
    nextPhase: 'unit-testing',
    criticalFindings: [
        'Missing input validation in auth.ts:45',
        'SQL injection risk in query.ts:12'
    ],
    data: {
        issuesReviewed: 15,
        criticalIssues: 2,
        filesChecked: ['auth.ts', 'query.ts', 'user.ts']
    }
};
```

### Testing Agent Result

```typescript
interface TestData {
    testsRun: number;
    testsPassed: number;
    coverage: number;
}

const result: AgentResult<TestData> = {
    status: 'failure',
    summary: 'Test coverage at 87%, below 95% threshold',
    criticalFindings: [
        'Coverage: 87% (required: 95%)',
        '2 tests failing in auth module'
    ],
    data: {
        testsRun: 150,
        testsPassed: 148,
        coverage: 87
    }
};
```

### Coding Agent Result

```typescript
interface DevelopmentData {
    filesCreated: string[];
    linesOfCode: number;
    testsCreated: number;
}

const result: AgentResult<DevelopmentData> = {
    status: 'success',
    summary: 'Implemented user authentication feature',
    nextPhase: 'linting',
    criticalFindings: [],
    data: {
        filesCreated: ['auth.ts', 'auth.test.ts'],
        linesOfCode: 250,
        testsCreated: 15
    }
};
```

## Benefits

1. **Token Savings**: Structured JSON uses ~60% fewer tokens than verbose text output
2. **Parseability**: LLM can easily parse and extract relevant information
3. **Consistency**: All agents return the same format
4. **Debugging**: Clear status and findings for troubleshooting

## Migration from Verbose Output

### Before (Verbose)
```markdown
## Code Review Report

I have completed the code review for the authentication module. Here are my findings:

After reviewing 15 files, I discovered several issues that need to be addressed:

1. Critical Issue: In the auth.ts file at line 45, there is missing input validation for user passwords. This could lead to security vulnerabilities.

2. Critical Issue: In query.ts at line 12, there is a potential SQL injection vulnerability where user input is directly concatenated into SQL queries.

3. Medium Issue: Some functions lack proper error handling.

Overall, I recommend proceeding to unit testing after fixing the critical issues.
```

### After (Structured)
```json
{
  "status": "success",
  "summary": "Reviewed 15 files, found 3 issues",
  "nextPhase": "unit-testing",
  "criticalFindings": [
    "Missing input validation in auth.ts:45",
    "SQL injection risk in query.ts:12"
  ],
  "data": {
    "issuesReviewed": 15,
    "criticalIssues": 2,
    "filesChecked": ["auth.ts", "query.ts", "user.ts"]
  }
}
```

**Token Savings**: ~150 tokens → ~40 tokens (~73% reduction)
