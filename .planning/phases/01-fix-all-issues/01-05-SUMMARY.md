# Plan 01-05 Summary: Code quality fixes — type contracts, boundary validation, structural simplification

**Status:** ✓ Complete
**Wave:** 4
**Requirements:** FIX-07, FIX-08

## What was done

### Task 1: Fix type contracts — models, authStore, userService, error utility
- **user.ts** — Replaced `any` with `Timestamp` on createdAt/updatedAt, removed `createdBy` from PendingUser, added `AuthUser = Pick<User, ...>` derived type
- **enrollment.ts** — Replaced `any` with `Timestamp` on createdAt/updatedAt
- **utils/error.ts** — NEW: `getErrorMessage(error: unknown)` utility to eliminate `error: any` catch blocks
- **authStore.ts** — Deleted local `interface AuthUser`, extracted `toAuthUser()` pure function with role validation via `Object.values(UserRole).includes()`, replaced `as UserRole` cast with validation, replaced direct `auth()`/`firestore()` with `firebaseAuth`/`db` singletons, replaced `error: any` with `getErrorMessage()`
- **userService.ts** — Replaced `firestore()` with `db` singleton, replaced `error: any` with `getErrorMessage()`, explicit `User | null` return type on findUserByEmail
- **ManageDeansScreen.tsx** — Replaced `firestore()` with `db` singleton, replaced `(d.data() as any)` with `(d.data() as { name?: string })`

### Task 2: Structural simplification — navigation, services, theme
- **AppNavigator.tsx** — Replaced `getRoleStack()` switch statement with static `ROLE_STACKS` record lookup
- **logService.ts** — Replaced `firestore()` with `db` singleton, changed `Record<string, any>` to `Record<string, unknown>`, changed `metadata || {}` to `metadata ?? {}`
- **enrollmentService.ts** — Replaced all `firestore()` calls with `db` singleton
- **gradeService.ts** — Replaced all `firestore()` calls with `db` singleton
- **announcementService.ts** — Replaced `firestore()` with `db` singleton, replaced `createdAt?: any` with `Timestamp`, replaced `error: any` with `getErrorMessage()`
- **theme/forms.ts** — NEW: Shared form styles extracted from all screen files
- **AdminHomeScreen.tsx** — Refactored to use formStyles (no local StyleSheet)
- **TeacherHomeScreen.tsx** — Refactored to use formStyles (no local StyleSheet)
- **StudentHomeScreen.tsx** — Refactored to use formStyles (no local StyleSheet)
- **ManageDeansScreen.tsx** — Refactored to use formStyles (no local StyleSheet)
- **CreateAnnouncementScreen.tsx** — Refactored to use formStyles (no local StyleSheet)
- **AuthNavigator.tsx** — Refactored to use formStyles, replaced `error: any` with `getErrorMessage()`

## Verification
- No `interface AuthUser` in authStore.ts (uses Pick<User, ...> from models) ✓
- `toAuthUser` function exists with role validation ✓
- No `any` in user.ts or enrollment.ts timestamp fields ✓
- No `as UserRole` cast anywhere ✓
- No `error: any` in any catch block ✓
- PendingUser has no createdBy field ✓
- findUserByEmail has explicit User | null return type ✓
- No getRoleStack function (uses ROLE_STACKS map) ✓
- All services import db/firebaseAuth from firebase.ts ✓
- formStyles imported by all screen files ✓
- LogService metadata uses unknown not any ✓
- No direct firestore() or auth() calls outside firebase.ts ✓
