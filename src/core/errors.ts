/**
 * ErrorModule — centralizes domain error types, formatting, and recovery.
 *
 * All modules throw DomainError; this module handles formatting, logging,
 * and recovery strategies. Screens and services depend on its interface.
 */

export enum ErrorSeverity {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  CRITICAL = 'critical',
}

export class DomainError extends Error {
  public readonly code: string;
  public readonly severity: ErrorSeverity;
  public readonly context?: Record<string, any>;
  public readonly recoverable: boolean;

  constructor(
    message: string,
    code: string,
    severity: ErrorSeverity = ErrorSeverity.ERROR,
    context?: Record<string, any>,
    recoverable: boolean = true,
  ) {
    super(message);
    this.name = 'DomainError';
    this.code = code;
    this.severity = severity;
    this.context = context;
    this.recoverable = recoverable;
  }
}

// ─── Error Codes ─────────────────────────────────────────────────────────────

export const ErrorCodes = {
  // Auth
  AUTH_USER_NOT_FOUND: 'AUTH_USER_NOT_FOUND',
  AUTH_INVALID_CREDENTIALS: 'AUTH_INVALID_CREDENTIALS',
  AUTH_EMAIL_IN_USE: 'AUTH_EMAIL_IN_USE',
  AUTH_UNAUTHORIZED: 'AUTH_UNAUTHORIZED',
  AUTH_FORBIDDEN: 'AUTH_FORBIDDEN',

  // User
  USER_DUPLICATE_EMAIL: 'USER_DUPLICATE_EMAIL',
  USER_INVALID_ROLE: 'USER_INVALID_ROLE',
  USER_INACTIVE: 'USER_INACTIVE',
  USER_NOT_FOUND: 'USER_NOT_FOUND',

  // Enrollment
  ENROLLMENT_DUPLICATE: 'ENROLLMENT_DUPLICATE',
  ENROLLMENT_FULL: 'ENROLLMENT_FULL',
  ENROLLMENT_PREREQ_NOT_MET: 'ENROLLMENT_PREREQ_NOT_MET',
  ENROLLMENT_CONFLICT: 'ENROLLMENT_CONFLICT',
  ENROLLMENT_NOT_FOUND: 'ENROLLMENT_NOT_FOUND',

  // Grade
  GRADE_INVALID_SCORE: 'GRADE_INVALID_SCORE',
  GRADE_NOT_PUBLISHABLE: 'GRADE_NOT_PUBLISHABLE',
  GRADE_CONFLICT: 'GRADE_CONFLICT',
  GRADE_NOT_FOUND: 'GRADE_NOT_FOUND',

  // Subject
  SUBJECT_NOT_FOUND: 'SUBJECT_NOT_FOUND',
  SUBJECT_NO_TEACHER: 'SUBJECT_NO_TEACHER',

  // Generic
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
} as const;

// ─── Error Factory ───────────────────────────────────────────────────────────

export const Errors = {
  authUserNotFound: (context?: Record<string, any>) =>
    new DomainError('User profile not found', ErrorCodes.AUTH_USER_NOT_FOUND, ErrorSeverity.ERROR, context),

  authInvalidCredentials: (context?: Record<string, any>) =>
    new DomainError('Invalid email or password', ErrorCodes.AUTH_INVALID_CREDENTIALS, ErrorSeverity.WARNING, context),

  authUnauthorized: (context?: Record<string, any>) =>
    new DomainError('Authentication required', ErrorCodes.AUTH_UNAUTHORIZED, ErrorSeverity.WARNING, context, false),

  authForbidden: (requiredRole: string, context?: Record<string, any>) =>
    new DomainError(
      `Access denied: requires ${requiredRole} role`,
      ErrorCodes.AUTH_FORBIDDEN,
      ErrorSeverity.WARNING,
      { requiredRole, ...context },
      false,
    ),

  userDuplicateEmail: (email: string, context?: Record<string, any>) =>
    new DomainError(
      `A user with email ${email} already exists`,
      ErrorCodes.USER_DUPLICATE_EMAIL,
      ErrorSeverity.WARNING,
      { email, ...context },
    ),

  userInvalidRole: (role: string, context?: Record<string, any>) =>
    new DomainError(
      `Invalid user role: ${role}`,
      ErrorCodes.USER_INVALID_ROLE,
      ErrorSeverity.ERROR,
      { role, ...context },
      false,
    ),

  userNotFound: (uid: string, context?: Record<string, any>) =>
    new DomainError(`User not found: ${uid}`, ErrorCodes.USER_NOT_FOUND, ErrorSeverity.ERROR, { uid, ...context }),

  enrollmentDuplicate: (studentId: string, subjectId: string, context?: Record<string, any>) =>
    new DomainError(
      'Student is already enrolled in this subject',
      ErrorCodes.ENROLLMENT_DUPLICATE,
      ErrorSeverity.WARNING,
      { studentId, subjectId, ...context },
    ),

  enrollmentFull: (subjectId: string, capacity: number, context?: Record<string, any>) =>
    new DomainError(
      `Subject ${subjectId} has reached capacity of ${capacity}`,
      ErrorCodes.ENROLLMENT_FULL,
      ErrorSeverity.WARNING,
      { subjectId, capacity, ...context },
    ),

  enrollmentPrereqNotMet: (studentId: string, subjectId: string, missing: string[], context?: Record<string, any>) =>
    new DomainError(
      'Student has not completed required prerequisites',
      ErrorCodes.ENROLLMENT_PREREQ_NOT_MET,
      ErrorSeverity.WARNING,
      { studentId, subjectId, missing, ...context },
    ),

  gradeInvalidScore: (field: string, value: number, max: number, context?: Record<string, any>) =>
    new DomainError(
      `Invalid ${field}: ${value} (max ${max})`,
      ErrorCodes.GRADE_INVALID_SCORE,
      ErrorSeverity.WARNING,
      { field, value, max, ...context },
    ),

  gradeNotPublishable: (gradeId: string, reason: string, context?: Record<string, any>) =>
    new DomainError(
      `Grade cannot be published: ${reason}`,
      ErrorCodes.GRADE_NOT_PUBLISHABLE,
      ErrorSeverity.WARNING,
      { gradeId, reason, ...context },
    ),

  gradeConflict: (gradeId: string, context?: Record<string, any>) =>
    new DomainError(
      'Grade conflict detected — published grade being modified',
      ErrorCodes.GRADE_CONFLICT,
      ErrorSeverity.WARNING,
      { gradeId, ...context },
    ),

  validationError: (message: string, context?: Record<string, any>) =>
    new DomainError(message, ErrorCodes.VALIDATION_ERROR, ErrorSeverity.WARNING, context),

  notFound: (entity: string, id: string, context?: Record<string, any>) =>
    new DomainError(`${entity} not found: ${id}`, ErrorCodes.NOT_FOUND, ErrorSeverity.ERROR, { entity, id, ...context }),

  internalError: (message: string, context?: Record<string, any>) =>
    new DomainError(message, ErrorCodes.INTERNAL_ERROR, ErrorSeverity.CRITICAL, context, false),
};

// ─── Formatting ──────────────────────────────────────────────────────────────

export function formatErrorForUser(error: unknown): string {
  if (error instanceof DomainError) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred';
}

export function formatErrorForLog(error: unknown): Record<string, any> {
  if (error instanceof DomainError) {
    return {
      code: error.code,
      severity: error.severity,
      message: error.message,
      context: error.context,
      recoverable: error.recoverable,
    };
  }
  if (error instanceof Error) {
    return {
      code: 'UNKNOWN',
      severity: ErrorSeverity.ERROR,
      message: error.message,
      stack: error.stack,
    };
  }
  return {
    code: 'UNKNOWN',
    severity: ErrorSeverity.CRITICAL,
    message: String(error),
  };
}

// ─── Recovery ────────────────────────────────────────────────────────────────

export function isRecoverable(error: unknown): boolean {
  if (error instanceof DomainError) {
    return error.recoverable;
  }
  return true;
}

export function getSeverity(error: unknown): ErrorSeverity {
  if (error instanceof DomainError) {
    return error.severity;
  }
  return ErrorSeverity.ERROR;
}
