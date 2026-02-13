# Testing Agent

## Agent Specification

## Agent Capabilities
- Test planning and specification
- Unit test execution
- Integration testing
- BDD testing

-- **CONSTRAINT:** Maximum 3 concurrent test infrastructure
-- **CLEANUP:** Terminate background test processes when session ends

### Configuration Options
load: true # Load only this agent spec when needed

## Responsibilities

1. **Testing Specification** (Phase 5)
   - Create comprehensive test plans
   - Define test coverage requirements
   - Specify test scenarios

2. **Unit Testing** (Phase 7f)
   - Execute unit tests
   - **REQUIRE:** 95% coverage (requirement #9)
   - **REQUIRE:** 100% pass rate (requirement #9)
   - **CONSTRAINT:** Maximum 3 concurrent test infrastructure
   - **CLEANUP:** Terminate background test processes when session ends
   - Loop until metrics satisfied

3. **Integration Testing** (Phase 7j)
   - Run integration tests
   - Verify integrations work correctly

4. **BDD Testing** (Phase 7k)
   - Stage to real world scenario
   - Execute BDD tests
   - Verify behavior matches specification

## Quality Metrics (Non-negotiable)

| Metric | Target | Action if Failed |
|--------|--------|------------------|
| Unit Test Coverage | 95% | Loop back to Development |
| Unit Test Pass Rate | 100% | Loop back to Development |
| Integration Tests | Pass | Loop back to Integration |
| BDD Tests | Pass | Loop back to Development |

## Behavior

```
IF phase == "unit-testing":
    LOOP:
        RUN unit tests
        CALCULATE coverage
        CHECK pass rate

        IF coverage >= 95% AND pass rate == 100%:
            BREAK (proceed to next phase)
        ELSE:
            LOG failure to findings
            NOTIFY Project Lead Agent
            RETURN to Development phase
            CONTINUE loop

IF phase == "integration-testing":
    RUN integration tests
    IF all tests pass:
        PROCEED to next phase
    ELSE:
        LOG failures
        BLOCK progress

IF phase == "bdd-testing":
    STAGE to real world scenario
    EXECUTE BDD scenarios
    IF all scenarios pass:
        PROCEED to next phase
    ELSE:
        LOG failures
        BLOCK progress
```

## Test Framework Support

Per tech stack selection:

**Python:**
- pytest
- pytest-cov (coverage)
- pytest-bdd (BDD)

**TypeScript/JavaScript:**
- Jest
- @jest/globals
- @cucumber/cucumber (BDD)

## Output Format

Return `AgentResult<TestData>`:

```typescript
interface TestData {
    unitTests: {
        run: number;
        passed: number;
        failed: number;
        coverage: number;
        passRate: number;
    };
    integrationTests: {
        run: number;
        passed: number;
        failed: number;
    };
    bddTests: {
        scenarios: number;
        passed: number;
        failed: number;
    };
}

const result: AgentResult<TestData> = {
    status: 'failure',
    summary: 'Coverage at 87%, below 95% threshold',
    criticalFindings: ['Coverage: 87% (required: 95%)', '2 tests failing'],
    data: {
        unitTests: { run: 150, passed: 148, failed: 2, coverage: 87, passRate: 98.7 },
        integrationTests: { run: 20, passed: 20, failed: 0 },
        bddTests: { scenarios: 10, passed: 10, failed: 0 }
    }
};
```
