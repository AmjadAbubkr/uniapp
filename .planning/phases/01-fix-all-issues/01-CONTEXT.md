# Phase 1: Fix All Issues - Context

**Gathered:** 2026-06-02
**Status:** Ready for planning
**Source:** Codebase analysis + debug report + CONCERNS.md recommendations

<domain>
## Phase Boundary

This phase fixes all known issues in the University Management System to make it buildable, runnable, and functionally correct. No new features are added — only fixing what's broken or stubbed.

**In scope:**
- Project infrastructure (package.json, app.json, tsconfig.json, .gitignore, .env.example, App.tsx)
- Firebase Web SDK → React Native Firebase SDK migration
- Navigation crash fixes (React.Fragment placeholders → real components)
- Dean role routing
- Auth state initialization on mount
- ManageDeansScreen faculty picker
- CreateAnnouncementScreen working submission
- Audit trail userId fix
- Codebase documentation updates

**Out of scope:**
- New features (scheduling, reporting, file storage)
- UI/UX improvements beyond fixing broken screens
- Performance optimization
- Testing framework setup (separate phase)
- Deployment configuration
</domain>

<decisions>
## Implementation Decisions

### Firebase SDK (D-01)
- **Decision:** Use @react-native-firebase/app, @react-native-firebase/auth, @react-native-firebase/firestore (native SDK)
- **Rationale:** The current firebase (web SDK) package causes "configuration not found" errors on native Android/iOS builds because it doesn't read google-services.json/GoogleService-Info.plist. The React Native Firebase SDK uses the native Firebase SDKs which properly consume these config files.

### Expo Managed Workflow (D-02)
- **Decision:** Use Expo managed workflow with development builds
- **Rationale:** Project uses EXPO_PUBLIC_ env var prefix convention, indicating Expo setup. Managed workflow simplifies build/deploy.

### Navigation Architecture (D-03)
- **Decision:** Use React Navigation v6 native stack with role-based root switching
- **Rationale:** Already in use (AppNavigator pattern). Dean role should route to AdminNavigator since dean management screens are admin-adjacent.

### Home Screens (D-04)
- **Decision:** Create minimal functional home screens for each role with placeholder content and navigation links to existing screens
- **Rationale:** React.Fragment crashes. Home screens must exist as real components. They should be functional (show role label, provide navigation to sub-screens) rather than empty stubs.

### the agent's Discretion
- Exact layout/content of home screens
- Whether Dean gets a separate navigator or shares AdminNavigator
- AnnouncementService implementation details (Firestore structure)
</decisions>

<canonical_refs>
## Canonical References

### Debug History
- `.planning/debug/firebase-config-not-found-on-login.md` — Root cause analysis: Firebase Web SDK doesn't process google-services.json at build time

### Codebase Analysis
- `.planning/codebase/CONCERNS.md` — Known issues and recommended fixes
- `.planning/codebase/STACK.md` — Current stack analysis (stale, needs update)
- `.planning/codebase/ARCHITECTURE.md` — Architecture overview (stale, describes web server architecture)
- `.planning/codebase/INTEGRATIONS.md` — Integration audit
</canonical_refs>

<specifics>
## Specific Ideas

- The Firebase Web SDK → Native SDK migration is the highest priority fix (blocks login)
- AdminNavigator line 9 uses `React.Fragment` as a component — this crashes React Navigation
- TeacherNavigator line 9 uses `React.Fragment` as a component — same crash
- StudentNavigator line 8 uses `React.Fragment` as a component — same crash
- AppNavigator line 14 has dead code: `__DEV__ || !user || user.id !== 'dev-001' ? user : null` — this logic always returns user
- EnrollmentService line 32: `LogService.logAction('', ...)` — empty userId
- GradeService line 35: `LogService.logAction('', ...)` — empty userId
- ManageDeansScreen has `selectedFacultyId` state but no faculty picker rendered in JSX
- CreateAnnouncementScreen line 29: `// AnnouncementService.create(...)` — commented out
</specifics>

<deferred>
## Deferred Ideas

- Testing framework setup (Jest + React Native Testing Library)
- CI/CD pipeline
- Deployment configuration
- New features (scheduling, reporting, file storage)
- Email notifications
- Rate limiting
- SSO/LDAP integration
</deferred>

---
*Phase: 01-fix-all-issues*
*Context gathered: 2026-06-02 via codebase analysis*
