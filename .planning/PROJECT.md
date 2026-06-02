# University Management System

**Created:** 2026-06-02
**Status:** In Development
**Stack:** React Native (Expo) + Firebase (Firestore + Auth)
**Platform:** Mobile (iOS/Android)

## Vision

A mobile-first university management system supporting four user roles: Student, Teacher, Dean, and Admin. The system handles enrollment, grading, announcements, and faculty/department management with Firebase as the backend.

## Current State

The project has partial source code in `src/` but lacks critical infrastructure files (package.json, app.json, tsconfig.json, .gitignore, App.tsx entry point). Existing code uses the Firebase Web SDK instead of the React Native Firebase SDK, causing "configuration not found" errors on native builds. Multiple screens have stubbed or broken functionality.

## Architecture

- **Frontend:** React Native with Expo (managed workflow)
- **Navigation:** React Navigation v6 (native stack)
- **State Management:** Zustand
- **Backend:** Firebase (Auth + Firestore)
- **Styling:** React Native StyleSheet with Material Design 3 theme tokens
- **Persistence:** Firestore with offline persistence (IndexedDB)
