# External Integrations
**Analysis Date:** 2026-06-03

## APIs & External Services

**Firebase Auth:**
- Provider: Email/password authentication
- SDK: @react-native-firebase/auth ^21.0.0 (native SDK)
- Purpose: User identity management, login, logout, auth state observation

## Data Storage

**Databases:**
- Firebase Firestore (primary database)
- 13 collections: users, students, teachers, deans, subjects, courses, enrollments, grades, announcements, faculties, departments, schedules, logs
- Offline persistence enabled via native SDK settings

**File Storage:**
- None configured

**Caching:**
- Firestore offline persistence (local cache)

## Authentication & Identity

**Auth Provider:**
- Firebase Auth (email/password)
- Native SDK reads google-services.json (Android) / GoogleService-Info.plist (iOS)

**Implementation:**
- @react-native-firebase/auth — native SDK
- Auth state managed via Zustand authStore

## Monitoring & Observability

**Error Tracking:**
- None

**Logs:**
- Console logging only (console.error, console.warn)
- Firestore-based audit trail (COLLECTIONS.LOGS) for business actions

## CI/CD & Deployment

**Hosting:**
- Not configured — Expo managed workflow with development builds

**CI Pipeline:**
- None

## Environment Configuration

**Required env vars:**
- EXPO_PUBLIC_FIREBASE_API_KEY
- EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN
- EXPO_PUBLIC_FIREBASE_PROJECT_ID
- EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET
- EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
- EXPO_PUBLIC_FIREBASE_APP_ID

**Platform config files:**
- android/app/google-services.json (Android)
- ios/GoogleService-Info.plist (iOS)

**Secrets location:**
- .env (gitignored); .env.example documents required vars

## Not Yet Integrated

- Email service (SendGrid, AWS SES) — for notifications
- File storage (Firebase Storage, S3) — for documents
- Payment gateway (Stripe) — for tuition/fees
- SSO/LDAP (SAML 2.0, OIDC) — for institutional identity
- Push notifications (FCM) — for alerts
- CI/CD (GitHub Actions, EAS Build) — for automated builds

---
*Integration audit: 2026-06-03*
