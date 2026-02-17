---
description: Build Android APK or AAB for distribution
argument-hint: Optional: "release" or "debug" (default: release) + "apk" or "aab"
---

# Android Build

You are the Android Build system. Your job is to build optimized Android packages for distribution.

## Purpose

Generate production-ready Android builds:
- Debug APK for testing
- Release APK for distribution
- Release AAB for Play Store
- Handle signing and optimization

## When to Use

- Creating release builds
- Preparing Play Store uploads
- Testing release configurations
- CI/CD pipeline builds

## Execution Flow

```
1. DETERMINE build type (debug/release)
2. DETERMINE output format (apk/aab)
3. CONFIGURE signing (if release)
4. CLEAN previous builds
5. RUN Gradle build
6. VERIFY output
7. REPORT build results
```

## Build Types

| Type | Use Case | Debuggable | Signed |
|------|----------|------------|--------|
| debug | Development | Yes | No |
| release | Production | No | Yes |

## Output Formats

| Format | Use Case | Size |
|--------|----------|------|
| APK | Direct distribution | Larger |
| AAB | Play Store | Smaller (optimized) |

## Example Session

### Example 1: Build Release APK

```
USER: /android-build release apk

SYSTEM: Building Android release APK...

**Configuration:**
- Build Type: release
- Output: APK
- Minification: R8 enabled
- Signing: Release keystore

## Build Steps

1. ✅ Cleaning previous builds...
2. ✅ Running lint checks...
3. ✅ Running unit tests...
4. ✅ Compiling Kotlin sources...
5. ✅ Running R8 optimization...
6. ✅ Signing with release key...

---

## Build Complete ✅

| Metric | Value |
|--------|-------|
| Build Time | 2m 15s |
| Output Size | 12.3 MB |
| Minified | Yes (R8) |
| Signed | Yes |

## Build Artifacts

| Artifact | Path | Size |
|----------|------|------|
| Release APK | app/build/outputs/apk/release/app-release.apk | 12.3 MB |
| Mapping File | app/build/outputs/mapping/release/mapping.txt | - |

## Size Optimization

| Phase | Size | Savings |
|-------|------|---------|
| Before R8 | 18.5 MB | - |
| After R8 | 13.2 MB | 29% |
| After Resources | 12.3 MB | 7% |
| **Total Savings** | - | **34%** |

## Next Steps

1. Install on device: `adb install app/build/outputs/apk/release/app-release.apk`
2. Upload to Play Store: Use `/play-store-deploy` command
3. Test release build: Verify ProGuard rules
```

### Example 2: Build for Play Store

```
USER: /android-build release aab

SYSTEM: Building Android release AAB...

**Configuration:**
- Build Type: release
- Output: AAB (Play Store format)
- Minification: R8 enabled
- Signing: Release keystore

## Build Steps

1. ✅ Cleaning previous builds...
2. ✅ Running lint checks...
3. ✅ Running unit tests...
4. ✅ Compiling Kotlin sources...
5. ✅ Bundling resources...
6. ✅ Running R8 optimization...
7. ✅ Signing with release key...

---

## Build Complete ✅

| Metric | Value |
|--------|-------|
| Build Time | 2m 45s |
| AAB Size | 18.5 MB |
| Download Size | ~8 MB |
| Installed Size | ~20 MB |
| Signed | Yes |

## Build Artifacts

| Artifact | Path |
|----------|------|
| Release AAB | app/build/outputs/bundle/release/app-release.aab |
| Mapping File | app/build/outputs/mapping/release/mapping.txt |

## Play Store Ready ✅

Your AAB is ready for upload to Google Play Console.

**Upload Instructions:**
1. Go to Play Console → Your App → Release
2. Create new release
3. Upload: `app/build/outputs/bundle/release/app-release.aab`

## Size Breakdown

| Component | Download | Installed |
|-----------|----------|-----------|
| Code (DEX) | 3.2 MB | 8.5 MB |
| Resources | 2.1 MB | 5.1 MB |
| Assets | 1.8 MB | 4.2 MB |
| Native Libs | 0.9 MB | 2.2 MB |
| **Total** | **~8 MB** | **~20 MB** |

## Device Compatibility

| ABI | Included |
|-----|----------|
| armeabi-v7a | ✅ |
| arm64-v8a | ✅ |
| x86 | ✅ |
| x86_64 | ✅ |

## Next Steps

Run `/play-store-deploy` to upload to Play Store.
```

### Example 3: Build Debug APK

```
USER: /android-build debug

SYSTEM: Building Android debug APK...

**Configuration:**
- Build Type: debug
- Output: APK
- Debuggable: Yes

## Build Steps

1. ✅ Compiling Kotlin sources...
2. ✅ Packaging resources...

---

## Build Complete ✅

| Metric | Value |
|--------|-------|
| Build Time | 45s |
| Output Size | 15.2 MB |
| Debuggable | Yes |

## Build Artifact

| Artifact | Path |
|----------|------|
| Debug APK | app/build/outputs/apk/debug/app-debug.apk |

## Install on Device

```bash
adb install -r app/build/outputs/apk/debug/app-debug.apk
```
```

## Build Commands

### Debug APK
```bash
./gradlew assembleDebug
```

### Release APK
```bash
./gradlew assembleRelease
```

### Release AAB
```bash
./gradlew bundleRelease
```

### Clean Build
```bash
./gradlew clean assembleRelease
```

## Signing Configuration

For release builds, ensure signing is configured:

```kotlin
// app/build.gradle.kts
android {
    signingConfigs {
        create("release") {
            storeFile = file(System.getenv("KEYSTORE_FILE") ?: "release.keystore")
            storePassword = System.getenv("KEYSTORE_PASSWORD") ?: ""
            keyAlias = System.getenv("KEY_ALIAS") ?: ""
            keyPassword = System.getenv("KEY_PASSWORD") ?: ""
        }
    }
}
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| OutOfMemoryError | Increase JVM heap in gradle.properties |
| Signing failed | Verify keystore path and credentials |
| R8 errors | Check ProGuard rules |
| Build timeout | Increase timeout or clean build |

## Build Performance

| Optimization | Effect |
|--------------|--------|
| Build Cache | 30-50% faster incremental |
| Parallel Execution | 20-40% faster |
| Configuration Cache | 10-20% faster |

## Integration

This command uses:
- `android-build` skill for detailed build process
- `android-testing` skill for test verification
- `play-store-deploy` command for upload
