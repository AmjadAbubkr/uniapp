# Technology Stack
**Analysis Date:** 2026-06-03

## Languages

**Primary:**
- TypeScript (strict mode enabled)

**Secondary:**
- None

## Runtime

**Environment:**
- React Native with Expo managed workflow (~52.0.0)
- React 18.3.1, React Native 0.76.6

**Package Manager:**
- npm (package.json)
- Lockfile: package-lock.json

## Frameworks

**Core:**
- Expo SDK ~52 (managed workflow with development builds)
- React Navigation v6 (native stack navigator)
- Zustand v5 (client state management)

**Testing:**
- Not yet configured

**Build/Dev:**
- Expo CLI (`expo start`, `expo run:android`, `expo run:ios`)

## Key Dependencies

**Critical:**
- `@react-native-firebase/app` ^21.0.0 — Firebase core initialization
- `@react-native-firebase/auth` ^21.0.0 — Email/password authentication
- `@react-native-firebase/firestore` ^21.0.0 — Primary database

**Navigation:**
- `@react-navigation/native` ^7.0.0
- `@react-navigation/native-stack` ^7.0.0
- `react-native-screens` ^4.0.0
- `react-native-safe-area-context` ^5.0.0

**State:**
- `zustand` ^5.0.0

## Configuration

**Environment:**
- `EXPO_PUBLIC_FIREBASE_API_KEY`
- `EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `EXPO_PUBLIC_FIREBASE_PROJECT_ID`
- `EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `EXPO_PUBLIC_FIREBASE_APP_ID`

**Build:**
- `tsconfig.json` — React Native TypeScript config with `@/*` path alias
- `app.json` — Expo config with Firebase plugins

## Platform Requirements

**Development:**
- Node.js 18+
- Expo CLI
- Android Studio / Xcode for native builds

**Production:**
- Android (google-services.json required)
- iOS (GoogleService-Info.plist required)

---
*Stack analysis: 2026-06-03*
