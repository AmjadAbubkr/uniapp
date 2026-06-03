<!-- refreshed: 2026-06-03 -->
# Architecture
**Analysis Date:** 2026-06-03

## System Overview

React Native mobile app with Firebase BaaS (Backend as a Service). No server-side code — all data access is direct from client to Firebase.

```text
┌─────────────────────────────────────────────────────────────────────┐
│ Mobile App — React Native + Expo                                    │
├──────────────┬──────────────┬──────────────┬────────────────────────┤
│ Student      │ Teacher      │ Admin/Dean   │ Auth                   │
│ Navigator    │ Navigator    │ Navigator    │ Navigator              │
│ HomeScreen   │ HomeScreen   │ HomeScreen   │ LoginScreen            │
│              │ CreateAnnoun │ ManageDeans  │                        │
│              │ -cementScreen│ Screen       │                        │
└──────┬───────┴──────┬───────┴──────┬───────┴────────┬───────────────┘
       │              │              │                │
       ▼              ▼              ▼                ▼
┌─────────────────────────────────────────────────────────────────────┐
│ Data Layer — Zustand Stores + Service Objects                       │
│ ┌────────────┐ ┌────────────┐ ┌─────────────┐ ┌────────────────┐   │
│ │ authStore  │ │ User       │ │ Enrollment  │ │ Grade          │   │
│ │ (Zustand)  │ │ Service    │ │ Service     │ │ Service        │   │
│ └────────────┘ └────────────┘ └─────────────┘ └────────────────┘   │
│ ┌────────────┐ ┌────────────┐ ┌─────────────┐                      │
│ │ Log        │ │ Announce-  │ │ firebase.ts │                      │
│ │ Service    │ │ ment Svc   │ │ (singletons)│                      │
│ └────────────┘ └────────────┘ └─────────────┘                      │
└──────────────────────────┬──────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────────┐
│ Firebase BaaS                                                       │
│ ┌────────────────────┐  ┌──────────────────────────────────────┐   │
│ │ Firebase Auth      │  │ Firestore                            │   │
│ │ Email/Password     │  │ Collections: users, students,        │   │
│ │ Native SDK         │  │ teachers, deans, subjects, courses,  │   │
│ │                    │  │ enrollments, grades, announcements,  │   │
│ │                    │  │ faculties, departments, schedules,   │   │
│ │                    │  │ logs                                 │   │
│ └────────────────────┘  └──────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
```

## Component Responsibilities

| Component | Responsibility | Location |
|-----------|----------------|----------|
| Screens | Role-specific UI components (forms, lists, navigation) | `src/screens/` |
| Navigators | React Navigation v6 stacks per role | `src/navigation/` |
| Services | Firestore CRUD wrappers with audit logging | `src/data/services/` |
| Models | TypeScript interfaces for Firestore documents | `src/data/models/` |
| Stores | Zustand stores for client-side state | `src/data/stores/` |
| Theme | Material Design 3 color and typography tokens | `src/theme/` |
| Firebase | SDK initialization and singleton exports | `src/data/firebase.ts` |

## Data Flow

**User action → Screen component → Service → Firestore (direct client access)**

### Authentication Flow
1. User enters credentials on LoginScreen
2. authStore.login() calls auth().signInWithEmailAndPassword()
3. Firebase Auth validates credentials
4. On success, fetch user profile from Firestore (COLLECTIONS.USERS)
5. Set user in Zustand store
6. AppNavigator switches to role-based navigator

### Announcement Creation Flow
1. Teacher fills form on CreateAnnouncementScreen
2. Screen calls AnnouncementService.create()
3. Service writes to Firestore (COLLECTIONS.ANNOUNCEMENTS)
4. Service logs action via LogService (COLLECTIONS.LOGS)
5. Screen shows success alert

### Dean Creation Flow
1. Admin picks faculty, fills form on ManageDeansScreen
2. Screen calls UserService.createPendingUser()
3. Service writes pending user to Firestore (COLLECTIONS.USERS, isActive: false)
4. Screen shows success alert

## Key Abstractions

**Service Objects (not classes):**
- Purpose: Encapsulate Firestore operations and audit logging
- Pattern: Named export objects with async methods
- Examples: UserService, EnrollmentService, GradeService, LogService, AnnouncementService

**Zustand Stores:**
- Purpose: Client-side reactive state
- Pattern: create() with actions; selectors for component subscriptions
- Example: authStore (user, loading, error, login, logout, initialize)

**Firebase Singletons:**
- Purpose: Centralized SDK instances; all services import from firebase.ts
- Pattern: `export const firebaseAuth = auth; export const db = firestore;`
- Example: Services use `db.collection(...)` instead of `firestore().collection(...)`

**Collection Constants:**
- Purpose: Single source of truth for Firestore collection names
- Pattern: `const COLLECTIONS = { USERS: 'users', ... } as const;`

## Constraints

- **No server-side logic:** All business rules enforced client-side; Firestore security rules must provide server-side enforcement
- **Firebase Auth handles identity:** No custom JWT; auth UID is the user identifier
- **Offline persistence:** Enabled via native SDK; Firestore cache available when offline
- **13 Firestore collections:** users, students, teachers, deans, subjects, courses, enrollments, grades, announcements, faculties, departments, schedules, logs

---
*Architecture analysis: 2026-06-03*
