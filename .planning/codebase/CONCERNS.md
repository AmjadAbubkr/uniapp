# Codebase Concerns
**Analysis Date:** 2026-06-03

## Tech Debt

**No Testing Framework:**
- Issue: No unit, integration, or E2E tests exist
- Files: N/A
- Impact: Unknown code quality; regressions will go undetected
- Fix approach: Set up Jest + React Native Testing Library; write tests for services and screens

**No Error Boundary Components:**
- Issue: No React error boundaries; unhandled errors crash the entire app
- Files: N/A
- Impact: Poor UX on errors; no graceful recovery
- Fix approach: Add error boundary wrapper in App.tsx

**Firestore Lacks Composite Indexes:**
- Issue: Complex queries (e.g., announcements by type + date) may require composite indexes
- Files: N/A
- Impact: Queries may fail in production with index-required errors
- Fix approach: Add indexes via Firebase Console or firestore.indexes.json

## Known Bugs

None remaining — all known bugs fixed in Phase 1.

## Security Considerations

**Firestore Security Rules Not Configured:**
- Risk: All data is readable/writable by any authenticated user without server-side rules
- Files: Firebase Console (not in codebase)
- Current mitigation: None
- Recommendations: Configure Firestore security rules in Firebase Console to enforce role-based access control

**No Input Validation Library:**
- Risk: Form inputs validated only with basic trim checks
- Files: All screen files
- Current mitigation: Basic client-side validation in form handlers
- Recommendations: Adopt Zod for schema validation on form inputs and service parameters

**No Rate Limiting on Auth Attempts:**
- Risk: Unlimited login attempts enable brute-force attacks
- Files: N/A
- Current mitigation: Firebase Auth has built-in account-level protection
- Recommendations: Firebase Auth provides some protection; consider adding exponential backoff on client

**Role-Based Access is Client-Side Only:**
- Risk: UI routing is role-based but Firestore operations have no server-side role checks
- Files: AppNavigator.tsx, all service files
- Current mitigation: Role comes from verified Firestore profile
- Recommendations: Firestore security rules must enforce role-based document access

## Performance Bottlenecks

**No Caching Strategy for Reference Data:**
- Problem: Faculty/department lists fetched fresh on every mount
- Files: ManageDeansScreen.tsx
- Improvement path: Cache reference data in Zustand store with TTL

**No Pagination on List Screens:**
- Problem: All queries return complete result sets
- Files: All service files
- Improvement path: Implement Firestore cursor-based pagination for list queries

**Firestore Queries May Need Composite Indexes:**
- Problem: Queries with multiple where clauses require composite indexes
- Files: AnnouncementService.getByType (type + orderBy createdAt)
- Improvement path: Create required indexes in Firebase Console

## Fragile Areas

**Auth Store Profile Mapping:**
- Files: src/data/stores/authStore.ts
- Why fragile: Profile-to-state mapping runs in both login and initialize; any Firestore schema change breaks both
- Safe modification: Use toAuthUser() helper for single point of change
- Test coverage: None

**Service Files Directly Access Firestore:**
- Files: src/data/services/*.ts
- Why fragile: No abstraction layer between services and Firestore; changing Firestore client requires touching every service
- Safe modification: All services import db from firebase.ts singleton
- Test coverage: None

## Missing Critical Features

| Feature | Priority | Risk if Missing |
|---------|----------|-----------------|
| Testing framework | Critical | Regressions undetected |
| Firestore security rules | Critical | Unauthorized data access |
| Error boundary components | High | App crashes on unhandled errors |
| File storage for documents | High | No transcripts, assignments, or syllabi |
| Email notifications | Medium | No enrollment confirmations or alerts |
| Reporting / analytics | Medium | No institutional insights |
| Scheduling | Medium | No course timetable management |
| CI/CD pipeline | Medium | Manual deployment, no quality gates |

---
*Concerns audit: 2026-06-03*
