<!-- refreshed: 2026-05-04 -->
# Architecture
**Analysis Date:** 2026-05-04

## System Overview

**Status:** Greenfield — no source code exists yet. The architecture below defines the target design for a University Management System based on the project name and domain requirements identified in STACK.md and INTEGRATIONS.md.

```text
┌─────────────────────────────────────────────────────────────────────┐
│ Presentation Layer — Web UI / API Consumers                        │
├──────────────────┬──────────────────┬──────────────────────────────┤
│ Student Portal   │ Faculty Portal   │ Admin Dashboard              │
│ `src/app/        │ `src/app/        │ `src/app/                    │
│  student/`       │  faculty/`       │  admin/`                     │
└────────┬─────────┴────────┬─────────┴──────────┬───────────────────┘
         │                  │                    │
         ▼                  ▼                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│ API Layer — REST/GraphQL Endpoints                                 │
│ `src/server/routes/`                                                │
│  ┌────────────┐ ┌────────────┐ ┌─────────────┐ ┌────────────────┐  │
│  │ Auth Routes│ │ Student    │ │ Course      │ │ Department     │  │
│  │            │ │ Routes     │ │ Routes      │ │ Routes         │  │
│  └────────────┘ └────────────┘ └─────────────┘ └────────────────┘  │
└──────────────────────────┬──────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────────┐
│ Service / Business Logic Layer                                      │
│ `src/server/services/`                                              │
│  ┌────────────┐ ┌────────────┐ ┌─────────────┐ ┌────────────────┐  │
│  │ AuthService│ │ Enrollment │ │ Grading     │ │ Scheduling     │  │
│  │            │ │ Service    │ │ Service     │ │ Service        │  │
│  └────────────┘ └────────────┘ └─────────────┘ └────────────────┘  │
└──────────────────────────┬──────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────────┐
│ Data Access Layer                                                   │
│ `src/server/repositories/` + `src/server/models/`                  │
│  ┌────────────┐ ┌────────────┐ ┌─────────────┐ ┌────────────────┐  │
│  │ Student    │ │ Course     │ │ Enrollment  │ │ Department     │  │
│  │ Repository │ │ Repository │ │ Repository  │ │ Repository     │  │
│  └────────────┘ └────────────┘ └─────────────┘ └────────────────┘  │
└──────────────────────────┬──────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────────┐
│ Persistence Layer — PostgreSQL                                      │
│ `src/server/db/` — migrations, seed data, connection pool          │
└─────────────────────────────────────────────────────────────────────┘
```

## Component Responsibilities

| Component | Responsibility | File |
|-----------|----------------|------|
| Student Portal | Self-service views: enrollment, grades, schedule, profile | `src/app/student/` |
| Faculty Portal | Course management, grading, advising, office hours | `src/app/faculty/` |
| Admin Dashboard | User management, department configuration, reports, audit | `src/app/admin/` |
| Auth Routes | Login, registration, password reset, token refresh, SSO | `src/server/routes/auth.ts` |
| Student Routes | CRUD for student profiles, search, bulk import | `src/server/routes/students.ts` |
| Course Routes | Course catalog, scheduling, prerequisites, capacity | `src/server/routes/courses.ts` |
| Department Routes | Department CRUD, program configuration, faculty assignment | `src/server/routes/departments.ts` |
| Auth Service | Authentication logic, JWT issuance, session management, SSO | `src/server/services/auth.service.ts` |
| Enrollment Service | Enrollment workflow, waitlisting, prerequisite checks, drop/add | `src/server/services/enrollment.service.ts` |
| Grading Service | Grade submission, GPA calculation, transcript generation | `src/server/services/grading.service.ts` |
| Scheduling Service | Timetable generation, conflict detection, room assignment | `src/server/services/scheduling.service.ts` |
| Student Repository | Student data access, queries, pagination | `src/server/repositories/student.repository.ts` |
| Course Repository | Course data access, catalog queries | `src/server/repositories/course.repository.ts` |
| Enrollment Repository | Enrollment records, transactional operations | `src/server/repositories/enrollment.repository.ts` |
| Department Repository | Department and program data access | `src/server/repositories/department.repository.ts` |

## Pattern Overview

**Overall:** Layered architecture with separation of concerns across Presentation, API, Service, Data Access, and Persistence layers.

**Key Characteristics:**
- **Repository pattern** — Data access is encapsulated in repository classes; services never write raw queries
- **Service layer pattern** — Business logic lives in service classes, not in routes or controllers
- **Role-based access control** — Three distinct user roles (Student, Faculty, Admin) with separate portals and permission sets
- **Domain-driven design** — Core entities (Student, Course, Enrollment, Department, Grade) reflect university domain concepts
- **Stateless API** — RESTful API with JWT-based authentication; no server-side session state

## Layers

### Presentation Layer:
- Purpose: Render UI for each user role; handle client-side routing, forms, and validation
- Location: `src/app/`
- Contains: Page components, layout components, role-specific routes, client-side state management
- Depends on: API layer (via HTTP client in `src/lib/api-client.ts`)
- Used by: End users (students, faculty, administrators) via browser

### API Layer:
- Purpose: Expose HTTP endpoints, validate input, enforce auth/authorization, delegate to services
- Location: `src/server/routes/`
- Contains: Route definitions, request validation schemas, middleware registration
- Depends on: Service layer, auth middleware (`src/server/middleware/`)
- Used by: Presentation layer, external API consumers

### Service / Business Logic Layer:
- Purpose: Enforce business rules, orchestrate workflows, manage transactions
- Location: `src/server/services/`
- Contains: Service classes with business logic, cross-entity orchestration, domain validation
- Depends on: Repository layer, other services (via dependency injection)
- Used by: API layer (routes call services)

### Data Access Layer:
- Purpose: Abstract database operations, provide typed query interfaces, handle ORM mapping
- Location: `src/server/repositories/` and `src/server/models/`
- Contains: Repository classes, ORM model/entity definitions, query builders
- Depends on: Persistence layer (database connection, ORM client)
- Used by: Service layer (services call repositories)

### Persistence Layer:
- Purpose: Manage database connections, schema migrations, seed data
- Location: `src/server/db/`
- Contains: Migration files, seed scripts, connection pool configuration, ORM client initialization
- Depends on: PostgreSQL (external)
- Used by: Data access layer (repositories use the database client)

## Data Flow

### Primary Request Path (e.g., Student Enrolls in Course)
1. User clicks "Enroll" in Student Portal (`src/app/student/courses/enroll-button.tsx`)
2. Client-side validation and confirmation dialog
3. HTTP POST to `/api/enrollments` via API client (`src/lib/api-client.ts`)
4. Auth middleware validates JWT and extracts user identity (`src/server/middleware/auth.ts`)
5. Route handler validates request body against schema (`src/server/routes/enrollments.ts`)
6. Enrollment Service checks prerequisites, capacity, schedule conflicts (`src/server/services/enrollment.service.ts`)
7. If valid, Enrollment Repository creates record in transaction (`src/server/repositories/enrollment.repository.ts`)
8. Database writes enrollment row (PostgreSQL)
9. Response flows back: repository → service → route → HTTP response → UI update

### Authentication Flow
1. User submits credentials via login form (`src/app/login/page.tsx`)
2. HTTP POST to `/api/auth/login` (`src/server/routes/auth.ts`)
3. Auth Service validates credentials against stored hash (`src/server/services/auth.service.ts`)
4. On success, Auth Service issues JWT access token + refresh token
5. Client stores tokens (httpOnly cookie for refresh, memory/cookie for access)
6. Subsequent requests include access token in Authorization header
7. Auth middleware on protected routes validates token and attaches user context

### Grade Submission Flow
1. Faculty navigates to course roster, enters grades (`src/app/faculty/grades/page.tsx`)
2. HTTP POST to `/api/courses/:id/grades` (`src/server/routes/courses.ts`)
3. Authorization check: only assigned faculty can submit grades
4. Grading Service validates grade values, enrollment status, submission window (`src/server/services/grading.service.ts`)
5. Grade Repository persists grade records with audit metadata (who, when, previous value)
6. Audit log entry created for compliance (`src/server/services/audit.service.ts`)
7. Student GPA recalculated via Grading Service
8. Notification dispatched to student (email/push)

**State Management:**
- Server-side: Stateless — all state lives in PostgreSQL; JWT carries identity
- Client-side: Use lightweight state management (e.g., Zustand, React Context) for UI state; server state cached via query keys (e.g., TanStack Query)
- No global mutable server state — no in-memory caches that span requests

## Key Abstractions

**Repository:**
- Purpose: Encapsulate all database queries behind a typed interface; services never write raw SQL
- Examples: `src/server/repositories/student.repository.ts`, `src/server/repositories/course.repository.ts`
- Pattern: Each entity gets a repository class with standard CRUD + domain-specific query methods; repositories receive a database client via constructor injection

**Service:**
- Purpose: Contain business logic and workflow orchestration; the single source of truth for domain rules
- Examples: `src/server/services/enrollment.service.ts`, `src/server/services/grading.service.ts`
- Pattern: Service classes injected with required repositories; methods are transactional when touching multiple entities; services throw domain-specific errors that routes translate to HTTP status codes

**Middleware:**
- Purpose: Cross-cutting concerns applied to route groups — authentication, authorization, rate limiting, request logging
- Examples: `src/server/middleware/auth.ts`, `src/server/middleware/role-guard.ts`
- Pattern: Middleware functions composed into route groups; `auth.ts` validates JWT and attaches `user` to request context; `role-guard.ts` checks user role against required permission

**API Client:**
- Purpose: Centralize HTTP communication from frontend to backend; handle token refresh, error normalization, base URL configuration
- Examples: `src/lib/api-client.ts`
- Pattern: Singleton client instance wrapping fetch/axios; interceptors for auth headers and error handling; typed request/response generics

## Entry Points

**Web Application (Client):**
- Location: `src/app/layout.tsx` (root layout), `src/app/page.tsx` (landing)
- Triggers: Browser navigation
- Responsibilities: Render shell layout, route to role-specific portals, handle auth redirects

**API Server:**
- Location: `src/server/index.ts`
- Triggers: HTTP requests from clients or external systems
- Responsibilities: Start HTTP server, register middleware, mount route groups, initialize database connection

**Database Migrations:**
- Location: `src/server/db/migrations/`
- Triggers: CLI command during deployment or development
- Responsibilities: Apply schema changes sequentially, maintain migration history table

**Seed Scripts:**
- Location: `src/server/db/seed.ts`
- Triggers: CLI command for development/testing
- Responsibilities: Populate database with sample data for local development

## Architectural Constraints

- **Threading:** Single-threaded event loop (Node.js); CPU-intensive operations (GPA batch recalculation, transcript PDF generation) must be offloaded to worker threads or background job queues — never block the request loop
- **Global state:** No module-level mutable singletons except the database connection pool and ORM client instance (initialized once at startup in `src/server/db/client.ts`). All other state must be request-scoped or persisted to the database.
- **Circular imports:** Forbidden between service classes. If Service A needs Service B and Service B needs Service A, extract the shared logic into Service C. The repository → service → route dependency chain must be strictly unidirectional.
- **Database transactions:** Any operation that modifies more than one entity (e.g., enrollment + capacity update) must use a database transaction. Never rely on application-level orchestration for multi-entity writes.
- **Audit trail:** All mutations to grades, enrollments, and user records must create audit log entries. This is a compliance requirement, not optional.
- **Role isolation:** Student, Faculty, and Admin portals must not share route handlers or service logic where business rules differ. Shared utilities go in `src/lib/` or `src/server/shared/`, but portal-specific logic stays in its own module.

## Anti-Patterns

### Business Logic in Route Handlers
**What happens:** Writing validation rules, business checks, or database queries directly in route handler functions
**Why it's wrong:** Routes should only parse input, call a service, and format the response. Business logic in routes becomes untestable, unreusable, and duplicated across endpoints.
**Do this instead:** Route handlers in `src/server/routes/` should be 5-15 lines: validate input, call service method, return response. All logic goes in `src/server/services/`.

### Bypassing the Repository Layer
**What happens:** Writing raw SQL or ORM queries directly in service classes
**Why it's wrong:** Couples business logic to database implementation; makes swapping ORM or optimizing queries require touching service code; prevents centralized query logging/caching.
**Do this instead:** All database access goes through repository classes in `src/server/repositories/`. Services call repository methods; repositories encapsulate query details.

### Client-Side Business Rule Enforcement
**What happens:** Performing enrollment capacity checks, prerequisite validation, or GPA calculations only in the browser
**Why it's wrong:** Client-side validation is for UX only — it can be bypassed. All business rules must be enforced server-side.
**Do this instead:** Validate in the UI for immediate feedback (`src/app/` form validation), but always re-validate in the service layer (`src/server/services/`). The service layer is the source of truth.

### Storing Sensitive Data in Client-State
**What happens:** Storing JWT tokens in localStorage, keeping full user objects with PII in client-side global state
**Why it's wrong:** XSS attacks can exfiltrate localStorage tokens; PII in client state increases breach surface.
**Do this instead:** Store refresh tokens in httpOnly cookies only; access tokens in memory (not localStorage); fetch user details on demand from the API rather than caching full profiles client-side.

## Error Handling

**Strategy:** Layered error handling with domain-specific error classes that translate to HTTP status codes at the API boundary.

**Patterns:**
- **Service layer:** Throw domain-specific error classes (e.g., `EnrollmentError`, `PrerequisiteNotMetError`, `CapacityExceededError`, `AuthenticationError`, `AuthorizationError`) defined in `src/server/errors/`
- **API layer:** Route handlers catch service errors and map them to HTTP responses using a centralized error-to-status mapper in `src/server/middleware/error-handler.ts`
- **Client layer:** API client normalizes server error responses into typed error objects; UI components use error boundaries for unexpected errors and toast/notification for expected business errors
- **Database layer:** Repository methods wrap database-specific errors (e.g., unique constraint violations) into domain errors before re-throwing
- **Logging:** All unhandled errors logged with context (request ID, user ID, endpoint) via structured logging; never log raw passwords or token values

## Cross-Cutting Concerns

**Logging:**
- Use structured JSON logging (e.g., pino or winston) configured in `src/server/lib/logger.ts`
- Log levels: ERROR for failures, WARN for business rule violations, INFO for request lifecycle, DEBUG for development tracing
- Include request ID in all log entries for traceability
- Never log PII (student IDs, grades, emails) at INFO level or above

**Validation:**
- Input validation at API boundary using schema validation (e.g., Zod schemas in `src/server/schemas/`)
- Schemas are shared between client and server via `src/shared/schemas/` to avoid duplication
- Validate types at compile time with TypeScript; validate shapes at runtime with schema validators

**Authentication:**
- JWT-based with access token (short-lived, ~15min) and refresh token (longer-lived, stored in httpOnly cookie)
- Role-based access control with three tiers: Student, Faculty, Admin
- Middleware `src/server/middleware/auth.ts` validates token and attaches user context
- Role guard `src/server/middleware/role-guard.ts` enforces role requirements per route group
- SSO integration point for institutional identity federation (SAML 2.0 / OIDC) via `src/server/services/sso.service.ts`

**Audit Logging:**
- Separate audit table for compliance-sensitive mutations (grades, enrollments, user changes)
- Audit entries include: who (user ID), what (entity + action), when (timestamp), previous value, new value
- Audit logs are append-only — never deleted or modified
- Implemented as a service `src/server/services/audit.service.ts` called from other services after successful mutations

---
*Architecture analysis: 2026-05-04*
