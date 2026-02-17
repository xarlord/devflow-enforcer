---
description: Run Android unit and instrumentation tests
argument-hint: Optional: module name or "unit" or "instrumentation"
---

# Android Test

You are the Android Testing system. Your job is to run and manage Android tests including unit tests and instrumentation tests.

## Purpose

Ensure Android code quality through comprehensive testing:
- Unit tests with JUnit and MockK
- Instrumentation tests with Espresso
- Compose UI testing
- Coverage analysis

## When to Use

- During development (TDD)
- Before code review
- Before creating release builds
- In CI/CD pipelines

## Execution Flow

```
1. DETERMINE test scope (unit, instrumentation, or all)
2. CHECK prerequisites (emulator for instrumentation)
3. RUN tests via Gradle
4. COLLECT results and coverage
5. ANALYZE failures
6. REPORT findings
```

## Test Types

### Unit Tests
- Run on JVM (no device needed)
- Fast execution
- Test ViewModels, UseCases, Repositories
- Use MockK for mocking

### Instrumentation Tests
- Run on device/emulator
- Test UI, database, integration
- Slower execution
- Use Espresso/Compose Testing

## Example Session

```
USER: /android-test

SYSTEM: Running Android tests...

**Scope:** All modules
**Types:** Unit + Instrumentation

## Unit Tests

Running unit tests...
./gradlew test

✅ 48/48 unit tests passed

| Module | Tests | Coverage |
|--------|-------|----------|
| :app | 15 | 82% |
| :feature:auth | 18 | 88% |
| :core:domain | 10 | 92% |
| :core:data | 5 | 75% |

## Instrumentation Tests

Checking for connected devices...
✅ Emulator found: Pixel_7_API_34

Running instrumentation tests...
./gradlew connectedAndroidTest

✅ 12/12 instrumentation tests passed

| Test Class | Tests | Status |
|------------|-------|--------|
| LoginScreenTest | 4 | ✅ Pass |
| HomeScreenTest | 3 | ✅ Pass |
| UserDaoTest | 5 | ✅ Pass |

---

## Test Summary

**Total:** 60 tests
**Passed:** 60 ✅
**Failed:** 0
**Skipped:** 0
**Duration:** 1m 23s

## Coverage Report

**Overall Coverage:** 85%

| Type | Coverage | Target |
|------|----------|--------|
| Line | 85% | 80% ✅ |
| Branch | 79% | 75% ✅ |
| Method | 88% | 85% ✅ |

Coverage report generated:
- HTML: app/build/reports/coverage/test/index.html
- XML: app/build/reports/coverage/test/coverage.xml

All tests passed! Ready for code review.
```

## Commands

### Run All Tests
```bash
./gradlew test connectedAndroidTest
```

### Run Unit Tests Only
```bash
./gradlew test
```

### Run Instrumentation Tests Only
```bash
./gradlew connectedAndroidTest
```

### Run Specific Module
```bash
./gradlew :feature:auth:test
```

### Run Specific Test Class
```bash
./gradlew test --tests "com.example.app.LoginViewModelTest"
```

### Run with Coverage
```bash
./gradlew testDebugUnitTestCoverage
```

## Test Report

When tests fail, a detailed report is provided:

```
USER: /android-test

SYSTEM: Running Android tests...

## Unit Tests

❌ 47/48 unit tests passed (1 failed)

### Failed Test: LoginViewModelTest.onLoginClick_showsError_onNetworkFailure

**File:** LoginViewModelTest.kt:89
**Error:**
```
java.lang.AssertionError:
Expected: "Network error"
Actual: "Unknown error"
```

**Test Code:**
```kotlin
@Test
fun `onLoginClick showsError onNetworkFailure`() = runTest {
    coEvery { loginUseCase(any(), any()) } returns Result.failure(IOException())

    viewModel.onLoginClick()
    advanceUntilIdle()

    assertEquals("Network error", viewModel.uiState.value.error) // FAILS
}
```

**Suggested Fix:**
```kotlin
// In UserRepositoryImpl.kt
override suspend fun login(email: String, password: String): Result<User> {
    return try {
        api.login(email, password)
    } catch (e: IOException) {
        Result.failure(Exception("Network error")) // Add specific message
    } catch (e: Exception) {
        Result.failure(Exception("Unknown error"))
    }
}
```

**After fix, re-run:**
```bash
./gradlew test --tests "LoginViewModelTest.onLoginClick_showsError_onNetworkFailure"
```
```

## Coverage Thresholds

| Metric | Target | Action if Below |
|--------|--------|-----------------|
| Line Coverage | 80% | Add more tests |
| Branch Coverage | 75% | Test edge cases |
| New Code | 90% | Required for PR |

## CI/CD Integration

```yaml
# .github/workflows/test.yml
name: Android Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-java@v4
        with:
          java-version: '17'
      - run: ./gradlew test
      - run: ./gradlew connectedAndroidTest
        if: always()
```

## Prerequisites

| Requirement | Check |
|-------------|-------|
| JDK 17+ | `java -version` |
| Android SDK | `sdkmanager --list` |
| Emulator (for instrumentation) | `adb devices` |

## Integration

This command uses:
- `android-testing` skill for detailed test execution
- `coverage-analysis` skill for coverage reports
- Creates findings for test failures
