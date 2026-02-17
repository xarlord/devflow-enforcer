---
name: play-store-deploy
description: Deploy Android apps to Google Play Store. Handles version management, release tracks, rollout configuration, and release notes.
user-invocable: true
---

# Skill: Play Store Deploy

## Overview

This skill manages Google Play Store deployments including:
- AAB/APK upload
- Release track management
- Version management
- Rollout configuration
- Release notes generation

## Purpose

Deploy Android apps to production or testing tracks. Use this skill:
- When releasing new versions
- For staged rollouts
- Managing release tracks
- Updating app listings

## Execution Flow

```
1. VALIDATE AAB/APK artifact
2. CHECK version requirements
3. CONFIGURE release track
4. PREPARE release notes
5. UPLOAD to Play Console
6. CONFIGURE rollout
7. SUBMIT for review
```

## Input Parameters

| Parameter | Type | Description | Required |
|-----------|------|-------------|----------|
| artifact | string | Path to AAB/APK | Yes |
| track | string | internal, alpha, beta, production | Yes |
| rollout | number | Rollout percentage (1-100) | No |
| releaseNotes | object | Per-language release notes | No |

## Release Tracks

| Track | Purpose | Audience |
|-------|---------|----------|
| internal | Quick testing | Up to 100 testers |
| alpha | Early access | Closed testing group |
| beta | Pre-release | Open/closed testing |
| production | Public release | All users |

## Play Console API Setup

### Service Account
```json
{
    "type": "service_account",
    "project_id": "your-project-id",
    "private_key_id": "...",
    "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----",
    "client_email": "play-console@your-project.iam.gserviceaccount.com"
}
```

### Gradle Plugin
```kotlin
// build.gradle.kts (app level)
plugins {
    id("com.github.triplet.play") version "3.8.4"
}

play {
    serviceAccountCredentials.set(file("play-console-key.json"))
    track.set("internal")
    defaultToAppBundles.set(true)
}
```

## Deployment Commands

### Upload to Internal Track
```bash
./gradlew publishBundle
```

### Upload to Production with Staged Rollout
```bash
./gradlew publishBundle -Ptrack=production -Promanout=10
```

### Promote Between Tracks
```bash
./gradlew promoteArtifact --from-track=beta --to-track=production
```

## Version Management

### Automatic Version
```kotlin
// app/build.gradle.kts
android {
    defaultConfig {
        versionCode = (System.getenv("BUILD_NUMBER") ?: "1").toInt()
        versionName = "1.0.${versionCode}"
    }
}
```

### Manual Version
```kotlin
android {
    defaultConfig {
        versionCode = 100 // Increment for each release
        versionName = "1.0.0"
    }
}
```

## Release Notes

### Template
```markdown
## What's New

### Features
- [Feature 1]
- [Feature 2]

### Improvements
- [Improvement 1]

### Bug Fixes
- [Bug fix 1]

### Known Issues
- [Issue 1]

---

**Full Changelog:** https://github.com/.../compare/v1.0.0...v1.1.0
```

### Multi-language
```json
{
    "en-US": "## What's New\n\n- Feature 1\n- Feature 2",
    "es-ES": "## Novedades\n\n- Función 1\n- Función 2",
    "de-DE": "## Was ist neu\n\n- Funktion 1\n- Funktion 2"
}
```

## Output Format

```markdown
# Play Store Deployment Report

**Date:** [timestamp]
**App:** [app name]
**Version:** [version name] ([version code])

## Deployment Summary

| Field | Value |
|-------|-------|
| Track | production |
| Rollout | 10% |
| Status | Submitted for review |
| Artifacts | app-release.aab (18.5 MB) |

## Review Status

| Check | Status |
|-------|--------|
| Content Rating | ✅ Passed |
| Target Audience | ✅ Passed |
| Privacy Policy | ✅ Passed |
| App Signing | ✅ Verified |

## Rollout Schedule

| Stage | Percentage | Status |
|-------|------------|--------|
| Stage 1 | 10% | ⏳ Pending review |
| Stage 2 | 25% | Scheduled |
| Stage 3 | 50% | Scheduled |
| Stage 4 | 100% | Scheduled |

## Release Notes

### English (US)
- Added dark mode support
- Improved performance
- Fixed login crash

## Next Steps

1. Monitor review status in Play Console
2. Watch for crash reports after rollout
3. Increase rollout percentage if stable
```

## Example Usage

### Example 1: Deploy to Internal Track

```
USER: /play-store-deploy internal

SKILL INPUT:
{
    "artifact": "app/build/outputs/bundle/release/app-release.aab",
    "track": "internal"
}

SKILL OUTPUT:
# Play Store Deployment Report

**Date:** 2026-02-17
**App:** My App
**Version:** 1.1.0 (101)

## Deployment Summary

✅ Successfully uploaded to internal track

| Field | Value |
|-------|-------|
| Track | internal |
| Status | Available |
| Artifacts | app-release.aab (18.5 MB) |

## Available to Testers

Your app is now available to internal testers.

**Install Link:** https://play.google.com/store/apps/details?id=com.example.app

Internal testers can update via Play Store.
```

### Example 2: Staged Production Rollout

```
USER: /play-store-deploy production 10%

SKILL INPUT:
{
    "artifact": "app/build/outputs/bundle/release/app-release.aab",
    "track": "production",
    "rollout": 10,
    "releaseNotes": {
        "en-US": "## What's New\n\n- Dark mode support\n- Performance improvements"
    }
}

SKILL OUTPUT:
# Play Store Deployment Report

**Date:** 2026-02-17
**App:** My App
**Version:** 1.1.0 (101)

## Deployment Summary

✅ Submitted to production with 10% rollout

| Field | Value |
|-------|-------|
| Track | production |
| Rollout | 10% (staged) |
| Status | Under review |
| Review Time | ~2-7 days |

## Rollout Plan

| Day | Percentage | Action |
|-----|------------|--------|
| 1-3 | 10% | Monitor for crashes |
| 4-5 | 25% | Increase if stable |
| 6-7 | 50% | Continue monitoring |
| 8+ | 100% | Full rollout |

## Monitoring Checklist

- [ ] Check crash reports daily
- [ ] Monitor user ratings
- [ ] Review ANR reports
- [ ] Watch review feedback

## Rollback Command

If critical issues found:
```bash
./gradlew promoteArtifact --from-track=beta --to-track=production --rollout=0
```
```

### Example 3: Promote from Beta

```
USER: Promote beta to production

SKILL OUTPUT:
# Play Store Promotion Report

**Date:** 2026-02-17

## Promotion Summary

✅ Promoted from beta to production

| Field | Value |
|-------|-------|
| Source | beta |
| Target | production |
| Version | 1.1.0 (101) |
| Status | Under review |

## Beta Testing Results

| Metric | Value |
|--------|-------|
| Testers | 500 |
| Crashes | 2 (fixed) |
| ANRs | 0 |
| Average Rating | 4.5 |
```

## Staged Rollout Best Practices

1. **Start small (1-10%)** to catch critical issues
2. **Monitor for 24-48 hours** before increasing
3. **Watch crash rates** - should be < 0.5%
4. **Check user reviews** for feedback
5. **Have rollback plan** ready

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Upload failed | Check service account permissions |
| Version conflict | Increment version code |
| Review rejected | Fix policy violations |
| App not appearing | Wait for propagation (up to 24h) |

## Integration

This skill integrates with:
- `android-build`: Get built artifacts
- `android-testing`: Verify before deploy
- CI/CD pipelines for automated deployment
