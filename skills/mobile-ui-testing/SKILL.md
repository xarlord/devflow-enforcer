---
name: mobile-ui-testing
description: Run mobile UI tests with Appium, Espresso, or XCUITest. Supports Android and iOS native and hybrid apps.
user-invocable: true
---

# Skill: Mobile UI Testing

## Overview

This skill manages mobile UI testing for:
- Native Android apps (Espresso)
- Native iOS apps (XCUITest)
- Cross-platform apps (Appium)
- Hybrid apps (Appium + WebView)

## Purpose

Ensure mobile apps work correctly across devices. Use this skill:
- During mobile development
- Before mobile releases
- For device compatibility testing
- In mobile CI/CD pipelines

## Execution Flow

```
1. DETECT mobile platform (Android/iOS)
2. CONFIGURE device/emulator
3. INSTALL app under test
4. RUN test suite
5. COLLECT results and artifacts
6. GENERATE report
```

## Input Parameters

| Parameter | Type | Description | Required |
|-----------|------|-------------|----------|
| platform | string | android, ios, both | Yes |
| device | string | Device name or ID | No |
| testType | string | ui, e2e, smoke | No |

## Supported Frameworks

| Framework | Platform | Best For |
|-----------|----------|----------|
| Espresso | Android | Native Android apps |
| XCUITest | iOS | Native iOS apps |
| Appium | Both | Cross-platform, hybrid |
| Detox | Both | React Native |
| Maestro | Both | Simple flows, CI |

## Code Examples

### Espresso (Android)
```kotlin
// androidTest/java/com/example/LoginTest.kt
@RunWith(AndroidJUnit4::class)
class LoginTest {

    @get:Rule
    val activityRule = ActivityScenarioRule(MainActivity::class.java)

    @Test
    fun successfulLogin() {
        // Given
        onView(withId(R.id.email_input))
            .perform(typeText("user@example.com"))
        onView(withId(R.id.password_input))
            .perform(typeText("password123"))

        // When
        onView(withId(R.id.login_button))
            .perform(click())

        // Then
        onView(withId(R.id.dashboard_header))
            .check(matches(isDisplayed()))
    }

    @Test
    fun showErrorMessage_onInvalidCredentials() {
        onView(withId(R.id.email_input))
            .perform(typeText("user@example.com"))
        onView(withId(R.id.password_input))
            .perform(typeText("wrongpassword"))
        onView(withId(R.id.login_button))
            .perform(click())

        onView(withId(R.id.error_message))
            .check(matches(withText("Invalid credentials")))
    }
}
```

### XCUITest (iOS)
```swift
// LoginTests.swift
import XCTest

final class LoginTests: XCTestCase {
    var app: XCUIApplication!

    override func setUpWithError() throws {
        continueAfterFailure = false
        app = XCUIApplication()
        app.launch()
    }

    func testSuccessfulLogin() throws {
        // Given
        let emailField = app.textFields["email"]
        let passwordField = app.secureTextFields["password"]
        let loginButton = app.buttons["Login"]

        // When
        emailField.tap()
        emailField.typeText("user@example.com")

        passwordField.tap()
        passwordField.typeText("password123")

        loginButton.tap()

        // Then
        let dashboardHeader = app.staticTexts["Dashboard"]
        XCTAssertTrue(dashboardHeader.waitForExistence(timeout: 5))
    }

    func testShowErrorMessageOnInvalidCredentials() throws {
        let emailField = app.textFields["email"]
        let passwordField = app.secureTextFields["password"]
        let loginButton = app.buttons["Login"]

        emailField.tap()
        emailField.typeText("user@example.com")

        passwordField.tap()
        passwordField.typeText("wrongpassword")

        loginButton.tap()

        let errorMessage = app.staticTexts["error_message"]
        XCTAssertTrue(errorMessage.waitForExistence(timeout: 3))
        XCTAssertEqual(errorMessage.label, "Invalid credentials")
    }
}
```

### Appium (Cross-platform)
```typescript
// tests/mobile/login.spec.ts
import { remote } from 'webdriverio';

describe('Login', () => {
    let driver: WebdriverIO.Browser;

    before(async () => {
        driver = await remote({
            capabilities: {
                platformName: 'Android',
                'appium:deviceName': 'Pixel_7_API_34',
                'appium:app': './app/build/outputs/apk/debug/app-debug.apk',
                'appium:automationName': 'UiAutomator2',
            },
        });
    });

    after(async () => {
        await driver.deleteSession();
    });

    it('should login successfully', async () => {
        const emailInput = await driver.$('~email-input');
        const passwordInput = await driver.$('~password-input');
        const loginButton = await driver.$('~login-button');

        await emailInput.setValue('user@example.com');
        await passwordInput.setValue('password123');
        await loginButton.click();

        const dashboardHeader = await driver.$('~dashboard-header');
        await expect(dashboardHeader).toBeDisplayed();
    });
});
```

### Detox (React Native)
```typescript
// e2e/login.test.ts
describe('Login', () => {
    beforeAll(async () => {
        await device.launchApp();
    });

    beforeEach(async () => {
        await device.reloadReactNative();
    });

    it('should login successfully', async () => {
        await element(by.id('email-input')).typeText('user@example.com');
        await element(by.id('password-input')).typeText('password123');
        await element(by.id('login-button')).tap();

        await expect(element(by.id('dashboard-header'))).toBeVisible();
    });

    it('should show error for invalid credentials', async () => {
        await element(by.id('email-input')).typeText('user@example.com');
        await element(by.id('password-input')).typeText('wrongpassword');
        await element(by.id('login-button')).tap();

        await expect(element(by.id('error-message'))).toHaveText('Invalid credentials');
    });
});
```

## Output Format

```markdown
# Mobile UI Test Report

**Date:** [timestamp]
**Platform:** Android
**Device:** Pixel 7 (API 34)
**Duration:** 3m 45s

## Test Summary

| Status | Count |
|--------|-------|
| ✅ Passed | 25 |
| ❌ Failed | 2 |
| ⏭️ Skipped | 0 |
| **Total** | **27** |

## Failed Tests

### 1. PaymentTest.testPaymentFlow

**Error:**
```
androidx.test.espresso.NoMatchingViewException: No views in hierarchy found matching: with id: com.example.app:id/payment_success
```

**Device Log:** artifacts/payment_test_log.txt
**Screenshot:** artifacts/payment_failure.png

### 2. ProfileTest.testUpdateProfile

**Error:**
```
java.lang.AssertionError: Expected: 'John Doe' Actual: ''
```

## Device Coverage

| Device | API Level | Passed | Failed |
|--------|-----------|--------|--------|
| Pixel 7 | 34 | 25 | 2 |
| Pixel 5 | 30 | 25 | 2 |
| Galaxy S21 | 31 | 24 | 3 |

## Screen Coverage

| Screen | Tests | Coverage |
|--------|-------|----------|
| Login | 5 | 100% |
| Dashboard | 8 | 95% |
| Profile | 6 | 90% |
| Settings | 8 | 100% |
```

## Example Usage

### Example 1: Run Android Tests

```
USER: /mobile-ui-test android

SKILL OUTPUT:
# Mobile UI Test Report

**Date:** 2026-02-17
**Platform:** Android
**Devices:** 3

## Test Summary

✅ 25/27 tests passed

| Device | API | Passed | Failed |
|--------|-----|--------|--------|
| Pixel 7 | 34 | 25 | 2 |
| Pixel 5 | 30 | 25 | 2 |

## 2 Failed Tests

### PaymentTest.testPaymentFlow
- Device: Pixel 7
- Error: payment_success view not found

**Suggested Fix:**
```kotlin
// Wait for async payment processing
onView(withId(R.id.payment_success))
    .check(matches(isDisplayed())) // Fails immediately

// Fix: Add IdlingResource or wait
onView(withId(R.id.payment_success))
    .check(matches(isDisplayed())) // Works with IdlingResource
```
```

### Example 2: Run on Specific Device

```
USER: /mobile-ui-test ios --device "iPhone 15 Pro"

SKILL OUTPUT:
# Mobile UI Test Report

**Date:** 2026-02-17
**Platform:** iOS
**Device:** iPhone 15 Pro (iOS 17.2)

## Test Summary

✅ 28/28 tests passed

| Test Suite | Tests | Status |
|------------|-------|--------|
| LoginTests | 5 | ✅ |
| DashboardTests | 10 | ✅ |
| ProfileTests | 8 | ✅ |
| SettingsTests | 5 | ✅ |

## Screenshots

Artifacts saved:
- Screenshots: artifacts/screenshots/
- Video: artifacts/video/
- Logs: artifacts/logs/
```

## Device Configuration

### Android Emulator
```bash
# Create emulator
avdmanager create avd \
    --name "Pixel_7_API_34" \
    --package "system-images;android-34;google_apis;x86_64"

# Start emulator
emulator -avd Pixel_7_API_34 -no-snapshot-load
```

### iOS Simulator
```bash
# List simulators
xcrun simctl list devices

# Boot simulator
xcrun simctl boot "iPhone 15 Pro"

# Run tests
xcodebuild test \
    -scheme MyApp \
    -destination 'platform=iOS Simulator,name=iPhone 15 Pro'
```

## CI/CD Integration

### Android (GitHub Actions)
```yaml
name: Android UI Tests

on: [push, pull_request]

jobs:
    android-test:
        runs-on: macos-latest
        steps:
            - uses: actions/checkout@v4
            - uses: actions/setup-java@v4
              with:
                  java-version: '17'
            - uses: gradle/gradle-build-action@v2
            - run: ./gradlew connectedAndroidTest
```

### iOS (GitHub Actions)
```yaml
name: iOS UI Tests

on: [push, pull_request]

jobs:
    ios-test:
        runs-on: macos-latest
        steps:
            - uses: actions/checkout@v4
            - uses: maxim-lobanov/setup-xcode@v1
              with:
                  xcode-version: '15.0'
            - run: |
                  xcodebuild test \
                    -scheme MyApp \
                    -destination 'platform=iOS Simulator,name=iPhone 15 Pro'
```

## Integration

This skill integrates with:
- `android-testing`: Android-specific tests
- `e2e-testing`: Cross-platform E2E
- `android-build`: Get APK for testing
