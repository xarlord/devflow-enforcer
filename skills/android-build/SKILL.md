---
name: android-build
description: Build Android APK/AAB with Gradle. Handles build variants, signing configurations, ProGuard/R8 optimization, and build caching.
user-invocable: true
---

# Skill: Android Build

## Overview

This skill manages Android build processes including:
- APK and AAB generation
- Build variants (debug, release, staging)
- Signing configurations
- ProGuard/R8 optimization
- Build caching and performance

## Purpose

Build optimized Android packages for distribution. Use this skill:
- When creating release builds
- For CI/CD pipeline integration
- When troubleshooting build issues
- For build performance optimization

## Execution Flow

```
1. ANALYZE build requirements
2. CONFIGURE build variant
3. SETUP signing (if release)
4. RUN Gradle build
5. APPLY ProGuard/R8 (if release)
6. VERIFY output
7. GENERATE build report
```

## Input Parameters

| Parameter | Type | Description | Required |
|-----------|------|-------------|----------|
| variant | string | Build variant (debug, release) | Yes |
| output | string | Output format (apk, aab) | No (default: apk) |
| signing | object | Signing configuration | For release |
| proguard | boolean | Enable ProGuard/R8 | No |

## Build Commands

### Debug APK
```bash
./gradlew assembleDebug

# Output: app/build/outputs/apk/debug/app-debug.apk
```

### Release APK
```bash
./gradlew assembleRelease

# Output: app/build/outputs/apk/release/app-release.apk
```

### Release AAB (Play Store)
```bash
./gradlew bundleRelease

# Output: app/build/outputs/bundle/release/app-release.aab
```

### Clean Build
```bash
./gradlew clean assembleRelease
```

## Gradle Configuration

### Build Variants
```kotlin
// app/build.gradle.kts
android {
    defaultConfig {
        applicationId = "com.example.app"
        minSdk = 24
        targetSdk = 34
        versionCode = 1
        versionName = "1.0.0"
    }

    buildTypes {
        debug {
            isDebuggable = true
            applicationIdSuffix = ".debug"
            versionNameSuffix = "-DEBUG"
        }

        release {
            isMinifyEnabled = true
            isShrinkResources = true
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }

    flavorDimensions += "environment"
    productFlavors {
        create("staging") {
            dimension = "environment"
            applicationIdSuffix = ".staging"
        }
        create("production") {
            dimension = "environment"
        }
    }
}
```

### Signing Configuration
```kotlin
// app/build.gradle.kts
android {
    signingConfigs {
        create("release") {
            storeFile = file(System.getenv("KEYSTORE_FILE") ?: "keystore.jks")
            storePassword = System.getenv("KEYSTORE_PASSWORD") ?: ""
            keyAlias = System.getenv("KEY_ALIAS") ?: ""
            keyPassword = System.getenv("KEY_PASSWORD") ?: ""
        }
    }

    buildTypes {
        release {
            signingConfig = signingConfigs.getByName("release")
        }
    }
}
```

## ProGuard/R8 Rules

### Basic Rules
```proguard
# proguard-rules.pro

# Keep application classes
-keep class com.example.app.** { *; }

# Keep data classes for serialization
-keep class com.example.app.data.model.** { *; }

# Keep Compose functions
-keep class * extends androidx.compose.runtime.Composer { *; }

# Retrofit
-keepattributes Signature
-keepattributes *Annotation*
-keep class retrofit2.** { *; }

# OkHttp
-dontwarn okhttp3.**
-dontwarn okio.**

# Coroutines
-keepnames class kotlinx.coroutines.internal.MainDispatcherFactory {}
-keepnames class kotlinx.coroutines.CoroutineExceptionHandler {}
```

## Build Performance

### Gradle Properties
```properties
# gradle.properties
org.gradle.jvmargs=-Xmx4g -XX:+UseParallelGC
org.gradle.parallel=true
org.gradle.caching=true
org.gradle.configuration-cache=true
kotlin.incremental=true
android.enableBuildCache=true
```

### Build Scan
```bash
./gradlew assembleRelease --scan
```

## Output Format

```markdown
# Android Build Report

**Date:** [timestamp]
**Variant:** release
**Output:** AAB

## Build Summary

| Metric | Value |
|--------|-------|
| Build Time | 2m 34s |
| Output Size | 18.5 MB |
| Minified | Yes (R8) |
| Signed | Yes |

## Build Artifacts

| Artifact | Path | Size |
|----------|------|------|
| Release AAB | app/build/outputs/bundle/release/app-release.aab | 18.5 MB |
| Mapping File | app/build/outputs/mapping/release/mapping.txt | - |

## Size Breakdown

| Component | Size | Percentage |
|-----------|------|------------|
| DEX Files | 8.2 MB | 44% |
| Resources | 5.1 MB | 28% |
| Assets | 3.2 MB | 17% |
| Native Libs | 2.0 MB | 11% |

## Warnings

- 3 unused resources detected
- 2 lint warnings (non-critical)

## Next Steps

1. Upload AAB to Play Console
2. Run instrumentation tests on release build
3. Verify ProGuard rules for crash reporting
```

## Example Usage

### Example 1: Build Release APK

```
USER: /android-build release

SKILL OUTPUT:
# Android Build Report

**Date:** 2026-02-17
**Variant:** release
**Output:** APK

## Build Summary

✅ Build Successful

| Metric | Value |
|--------|-------|
| Build Time | 2m 15s |
| Output Size | 12.3 MB |
| Minified | Yes (R8) |
| Signed | Yes |

## Build Artifacts

| Artifact | Path |
|----------|------|
| Release APK | app/build/outputs/apk/release/app-release.apk |

## Size Optimization

| Optimization | Before | After | Savings |
|--------------|--------|-------|---------|
| R8 Minification | 18.5 MB | 12.3 MB | 33% |
| Resource Shrinking | 13.8 MB | 12.3 MB | 11% |
```

### Example 2: Build for Play Store

```
USER: /android-build release aab

SKILL INPUT:
{
    "variant": "release",
    "output": "aab",
    "signing": {
        "keystore": "release.keystore",
        "alias": "release"
    }
}

SKILL OUTPUT:
# Android Build Report

**Date:** 2026-02-17
**Variant:** release
**Output:** AAB (Play Store)

## Build Summary

✅ Build Successful

| Metric | Value |
|--------|-------|
| Build Time | 2m 45s |
| Download Size | ~8 MB |
| Installed Size | ~18 MB |
| Signed | Yes |

## Play Store Ready

The AAB is ready for upload to Google Play Console.

**Upload Path:** app/build/outputs/bundle/release/app-release.aab

## Next Steps

1. Upload to Play Console
2. Configure release track (internal/alpha/beta/production)
3. Submit for review
```

## Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| Out of memory | Increase JVM heap: `-Xmx4g` |
| Slow builds | Enable build cache and parallel execution |
| Signing failed | Verify keystore path and credentials |
| ProGuard errors | Add keep rules for reflection usage |

## Integration

This skill integrates with:
- `play-store-deploy`: Upload built artifacts
- `android-testing`: Run tests on build
- CI/CD pipelines for automated builds
