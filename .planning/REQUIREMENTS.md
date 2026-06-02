# Requirements

## FIX-01: Project Infrastructure
**Priority:** Critical  
**Description:** The project must have all essential configuration files to build, run, and develop.  
**Acceptance Criteria:**
- package.json exists with all required dependencies
- app.json exists with Expo configuration
- tsconfig.json exists with React Native TypeScript config
- .gitignore exists excluding node_modules, .env, build artifacts
- .env.example exists documenting all required Firebase env vars
- App.tsx entry point exists and renders the navigation root

## FIX-02: Firebase Native SDK Migration
**Priority:** Critical  
**Description:** Replace the Firebase Web SDK with the React Native Firebase SDK to fix "configuration not found" errors on native builds.  
**Acceptance Criteria:**
- @react-native-firebase/app, @react-native-firebase/auth, @react-native-firebase/firestore installed
- firebase.ts rewritten to use native SDK imports
- authStore.ts rewritten to use native SDK auth API
- All service files (userService, enrollmentService, gradeService, logService) rewritten to use native SDK Firestore API
- Persistence configured with native SDK settings

## FIX-03: Navigation Fixes
**Priority:** Critical  
**Description:** Fix broken navigation screens that crash the app.  
**Acceptance Criteria:**
- AdminNavigator has a real AdminHome component instead of React.Fragment
- TeacherNavigator has a real TeacherHome component instead of React.Fragment
- StudentNavigator has a real StudentHome component
- AppNavigator handles the Dean role (routes to AdminNavigator or dedicated stack)
- Auth state initialization happens on app mount

## FIX-04: Screen Functionality Fixes
**Priority:** High  
**Description:** Fix screens with missing or stubbed functionality.  
**Acceptance Criteria:**
- ManageDeansScreen renders a faculty picker (currently state exists but no UI)
- CreateAnnouncementScreen has a working AnnouncementService (not commented out)
- AnnouncementService created with Firestore CRUD operations
- EnrollmentService.logAction passes actual userId (not empty string)
- GradeService.logAction passes actual userId (not empty string)

## FIX-05: Audit Trail Fix
**Priority:** High  
**Description:** LogService calls in enrollment and grade services pass empty userId strings, making audit logs useless.  
**Acceptance Criteria:**
- EnrollmentService.createBatch accepts and logs the admin userId
- GradeService.publishBySubject accepts and logs the teacher userId
- All LogService.logAction calls include a real userId parameter

## FIX-06: Codebase Documentation Update
**Priority:** Medium  
**Description:** Update stale codebase analysis docs that say "no source code exists" when code now exists.  
**Acceptance Criteria:**
- STACK.md reflects actual React Native + Firebase stack
- CONCERNS.md updated with real issues (not greenfield placeholders)
- ARCHITECTURE.md updated for React Native mobile architecture (not web server)
