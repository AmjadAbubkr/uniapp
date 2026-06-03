# Plan 01-03 Summary: Screen functionality fixes and audit trail repair

**Status:** ✓ Complete
**Wave:** 2
**Requirements:** FIX-04, FIX-05

## What was done

### Task 1: Create AnnouncementService and fix CreateAnnouncementScreen
- **announcementService.ts** — New service with create, getByType, deleteAnnouncement methods using native Firestore SDK
- **CreateAnnouncementScreen.tsx** — Wired up AnnouncementService.create() with user.id, removed commented-out stub

### Task 2: Fix ManageDeansScreen faculty picker and audit trail userId
- **ManageDeansScreen.tsx** — Added faculty picker UI (horizontal scrollable), fetches from COLLECTIONS.FACULTIES, uses user.id from hook (not getState())
- **enrollmentService.ts** — Added `createdBy` parameter to createBatch, passes to LogService.logAction
- **gradeService.ts** — Added `publishedBy` parameter to publishBySubject, passes to LogService.logAction

## Verification
- AnnouncementService.ts exists with create method ✓
- CreateAnnouncementScreen.tsx calls AnnouncementService.create (not commented out) ✓
- ManageDeansScreen.tsx has faculty picker UI ✓
- No empty string userId in any LogService.logAction call ✓
