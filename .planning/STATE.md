# Project State

**Updated:** 2026-06-02

## Current Phase
Phase 1: Fix All Issues

## Decisions
- D-01: Use @react-native-firebase/app + @react-native-firebase/auth + @react-native-firebase/firestore (native SDK) instead of firebase/web SDK
- D-02: Expo managed workflow with development build
- D-03: React Navigation v6 for navigation
- D-04: Zustand for client state management
- D-05: Material Design 3 color tokens (existing colors.ts)

## Blockers
- App cannot build or run (no package.json, no entry point)
- Firebase native SDK not configured (web SDK causes "configuration not found")
- Multiple screens crash or have stubbed functionality

## Completed Phases
None

## Pending Todos
- Fix all issues identified in codebase analysis
- Apply all recommended fixes from CONCERNS.md and debug report
