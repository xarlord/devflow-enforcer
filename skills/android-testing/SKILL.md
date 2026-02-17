---
name: android-testing
description: Run Android unit and instrumentation tests. Supports JUnit, MockK, Espresso, and Compose UI testing with coverage reporting.
user-invocable: true
---

# Skill: Android Testing

## Overview

This skill manages Android testing including:
- Unit tests with JUnit and MockK
- Instrumentation tests with Espresso
- Compose UI testing
- Coverage reporting
- Test optimization

## Purpose

Ensure Android code quality through comprehensive testing. Use this skill:
- During development for TDD
- Before code review
- In CI/CD pipelines
- For coverage analysis

## Execution Flow

```
1. IDENTIFY test scope
2. RUN unit tests
3. RUN instrumentation tests (if emulator available)
4. GENERATE coverage report
5. ANALYZE results
6. REPORT findings
```

## Input Parameters

| Parameter | Type | Description | Required |
|-----------|------|-------------|----------|
| type | string | Unit, instrumentation, or all | No (default: all) |
| module | string | Specific module to test | No |
| coverage | boolean | Generate coverage report | No (default: true) |
| flavor | string | Build flavor to test | No |

## Test Commands

### Unit Tests
```bash
# Run all unit tests
./gradlew test

# Run specific module
./gradlew :feature:auth:test

# Run with coverage
./gradlew testDebugUnitTestCoverage

# Run specific test class
./gradlew test --tests "com.example.app.LoginViewModelTest"
```

### Instrumentation Tests
```bash
# Run all instrumentation tests
./gradlew connectedAndroidTest

# Run specific test
./gradlew connectedAndroidTest -Pandroid.testInstrumentationRunnerArguments.class=com.example.app.LoginScreenTest
```

### Compose UI Tests
```bash
# Run Compose tests
./gradlew :app:connectedAndroidTest -Pandroid.testInstrumentationRunnerArguments.class=com.example.app.ui.LoginScreenTest
```

## Test Structure

```
app/src/
├── test/                          # Unit tests
│   └── java/com/example/app/
│       ├── viewmodel/
│       │   └── LoginViewModelTest.kt
│       ├── usecase/
│       │   └── LoginUseCaseTest.kt
│       └── repository/
│           └── UserRepositoryTest.kt
│
└── androidTest/                   # Instrumentation tests
    └── java/com/example/app/
        ├── ui/
        │   └── LoginScreenTest.kt
        └── database/
            └── UserDaoTest.kt
```

## Unit Test Examples

### ViewModel Test
```kotlin
@OptIn(ExperimentalCoroutinesApi::class)
class LoginViewModelTest {
    @get:Rule
    val dispatcherRule = StandardTestDispatcher()

    private lateinit var loginUseCase: LoginUseCase
    private lateinit var viewModel: LoginViewModel

    @Before
    fun setup() {
        loginUseCase = mockk()
        viewModel = LoginViewModel(loginUseCase)
    }

    @Test
    fun `initial state is correct`() = runTest {
        // Given
        val expectedState = LoginUiState()

        // When
        val state = viewModel.uiState.value

        // Then
        assertEquals(expectedState, state)
    }

    @Test
    fun `onLoginClick success updates state`() = runTest {
        // Given
        val user = User(id = "1", email = "test@example.com")
        coEvery { loginUseCase(any(), any()) } returns Result.success(user)

        viewModel.onEmailChange("test@example.com")
        viewModel.onPasswordChange("password123")

        // When
        viewModel.onLoginClick()
        advanceUntilIdle()

        // Then
        assertTrue(viewModel.uiState.value.isSuccess)
        coVerify { loginUseCase("test@example.com", "password123") }
    }
}
```

### Use Case Test
```kotlin
class LoginUseCaseTest {
    private lateinit var repository: UserRepository
    private lateinit var useCase: LoginUseCase

    @Before
    fun setup() {
        repository = mockk()
        useCase = LoginUseCase(repository)
    }

    @Test
    fun `invoke returns user on success`() = runTest {
        // Given
        val user = User(id = "1", email = "test@example.com")
        coEvery { repository.login(any(), any()) } returns Result.success(user)

        // When
        val result = useCase("test@example.com", "password")

        // Then
        assertTrue(result.isSuccess)
        assertEquals(user, result.getOrNull())
    }

    @Test
    fun `invoke returns error on failure`() = runTest {
        // Given
        val error = Exception("Invalid credentials")
        coEvery { repository.login(any(), any()) } returns Result.failure(error)

        // When
        val result = useCase("test@example.com", "wrong")

        // Then
        assertTrue(result.isFailure)
        assertEquals("Invalid credentials", result.exceptionOrNull()?.message)
    }
}
```

## Compose UI Test Examples

```kotlin
@RunWith(AndroidJUnit4::class)
class LoginScreenTest {

    @get:Rule
    val composeTestRule = createComposeRule()

    @Test
    fun loginScreen_displaysEmailField() {
        // Given
        composeTestRule.setContent {
            LoginScreen(onNavigateToHome = {})
        }

        // Then
        composeTestRule
            .onNodeWithText("Email")
            .assertIsDisplayed()
    }

    @Test
    fun loginScreen_showsError_onInvalidEmail() {
        // Given
        composeTestRule.setContent {
            LoginScreen(onNavigateToHome = {})
        }

        // When
        composeTestRule
            .onNodeWithText("Email")
            .performTextInput("invalid-email")
        composeTestRule
            .onNodeWithText("Login")
            .performClick()

        // Then
        composeTestRule
            .onNodeWithText("Invalid email format")
            .assertIsDisplayed()
    }

    @Test
    fun loginScreen_navigates_onSuccess() {
        // Given
        var navigated = false
        composeTestRule.setContent {
            LoginScreen(
                viewModel = LoginViewModel(FakeLoginUseCase()),
                onNavigateToHome = { navigated = true }
            )
        }

        // When
        composeTestRule
            .onNodeWithText("Email")
            .performTextInput("test@example.com")
        composeTestRule
            .onNodeWithText("Password")
            .performTextInput("password123")
        composeTestRule
            .onNodeWithText("Login")
            .performClick()
        composeTestRule.waitForIdle()

        // Then
        assertTrue(navigated)
    }
}
```

## Coverage Configuration

```kotlin
// app/build.gradle.kts
android {
    buildTypes {
        debug {
            enableUnitTestCoverage = true
            enableAndroidTestCoverage = true
        }
    }
}

tasks.withType<Test> {
    finalizedBy(tasks.named("jacocoTestReport"))
}
```

## Output Format

```markdown
# Android Test Report

**Date:** [timestamp]
**Duration:** 45 seconds

## Test Summary

| Type | Total | Passed | Failed | Skipped |
|------|-------|--------|--------|---------|
| Unit | 48 | 47 | 1 | 0 |
| Instrumentation | 12 | 12 | 0 | 0 |
| **Total** | **60** | **59** | **1** | **0** |

## Coverage Report

| Module | Line Coverage | Branch Coverage |
|--------|---------------|-----------------|
| :app | 82% | 75% |
| :feature:auth | 88% | 80% |
| :core:domain | 92% | 88% |
| **Average** | **85%** | **79%** |

## Failed Tests

### LoginViewModelTest.onLoginClick_showsError_onNetworkFailure

**Error:**
```
java.lang.AssertionError: Expected error message to be "Network error" but was "Unknown error"
```

**Location:** LoginViewModelTest.kt:89

**Fix:**
```kotlin
// Update error handling in repository
override suspend fun login(email: String, password: String): Result<User> {
    return try {
        // ...
    } catch (e: IOException) {
        Result.failure(Exception("Network error"))
    }
}
```
```

## Example Usage

### Example 1: Run All Tests

```
USER: /android-test

SKILL OUTPUT:
# Android Test Report

**Date:** 2026-02-17
**Duration:** 1m 23s

## Test Summary

✅ 59/60 tests passed (98%)

| Type | Total | Passed | Failed |
|------|-------|--------|--------|
| Unit | 48 | 47 | 1 |
| Instrumentation | 12 | 12 | 0 |

## Coverage: 85%

| Module | Coverage |
|--------|----------|
| :app | 82% |
| :feature:auth | 88% |
| :core:domain | 92% |

## 1 Failed Test

LoginViewModelTest.onLoginClick_showsError_onNetworkFailure
- Expected: "Network error"
- Actual: "Unknown error"
```

### Example 2: Run Specific Module

```
USER: /android-test auth module

SKILL INPUT:
{
    "module": "feature:auth",
    "type": "unit"
}

SKILL OUTPUT:
# Test Report: feature:auth

**Date:** 2026-02-17
**Duration:** 12 seconds

## Unit Tests

✅ 15/15 tests passed

| Class | Tests | Status |
|-------|-------|--------|
| LoginViewModelTest | 8 | ✅ Pass |
| RegisterViewModelTest | 5 | ✅ Pass |
| AuthUseCaseTest | 2 | ✅ Pass |

## Coverage: 88%
```

## Best Practices

1. **Use Test Dispatchers** for coroutines
2. **Mock external dependencies** (network, database)
3. **Test edge cases** (empty input, errors)
4. **Keep tests isolated** (no shared state)
5. **Use meaningful test names** (describe behavior)

## Integration

This skill integrates with:
- `android-build`: Test before build
- `coverage-analysis`: Detailed coverage reports
- CI/CD pipelines for automated testing
