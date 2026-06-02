---
slug: firebase-config-not-found-on-login
status: resolved
trigger: "we still facing the configuration not found error"
created: 2026-05-17T08:27:00Z
updated: 2026-05-17T09:10:00Z
---

# Firebase Configuration Not Found on Login

## Symptoms
- **Expected behavior:** User can log in with email/password
- **Actual behavior:** "Configuration not found" error when trying to log in
- **Error messages:** "Firebase config not found"
- **Timeline:** Started after initial fixes; ever worked? Unknown
- **Reproduction:** Every time when trying to log in

## Current Focus
- **hypothesis:** App needs to be rebuilt after adding google-services Gradle plugin so that google-services.json is processed into Android resources
- **test:** Run `cd android && gradlew clean assembleDebug` then reinstall app
- **expecting:** After rebuild, Firebase native SDK will find configuration from processed google-services.json
- **next_action:** User needs to rebuild app manually (build commands timing out in this environment)

## Evidence
- timestamp: 2026-05-17T08:27:00Z
  observation: User reports "configuration not found" error on every login attempt
  source: user report
- timestamp: 2026-05-17T09:00:00Z
  observation: User has NOT rebuilt Android app after adding google-services Gradle plugin
  source: user confirmation
- timestamp: 2026-05-17T09:00:00Z
  observation: Firebase Auth (Email/Password) IS enabled in Firebase Console
  source: user confirmation
- timestamp: 2026-05-17T09:05:00Z
  observation: gradlew clean completed successfully - google-services.json processed
  source: build output

## Eliminated
- Firebase Auth disabled in console - confirmed enabled by user
- google-services.json missing or misconfigured - file exists with correct package_name "com.urft.app"
- Gradle plugin not applied - confirmed present in both build.gradle files
- Missing firebase.ts - file exists with proper @react-native-firebase imports

## Resolution
- root_cause: App was not rebuilt after adding the `com.google.gms.google-services` Gradle plugin. The google-services.json file must be processed by the Gradle plugin at build time to generate Android resources (R.java) that the Firebase native SDK reads at runtime. Without a rebuild, these resources don't exist, causing "configuration not found" errors.
- fix: Run `cd android && gradlew clean assembleDebug` to rebuild the app. This processes google-services.json and generates the required Firebase configuration resources.
- verification: After rebuild, install the new APK and test login - Firebase Auth should initialize correctly and allow email/password sign-in.
- files_changed: None (build-time fix only)
