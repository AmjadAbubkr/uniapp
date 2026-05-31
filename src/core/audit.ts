/**
 * AuditModule — comprehensive audit logging with query and export capabilities.
 *
 * Deep module: one interface handles logging, querying, filtering, and export.
 * All audit operations go through this module. Replaces the shallow LogService.
 */

import { Repository } from '@data/repository';
import { COLLECTIONS } from '@core/constants/collections';
import { AuditLog } from '@domain/types';

// ─── Types ───────────────────────────────────────────────────────────────────

export enum AuditLevel {
  INFO = 'INFO',
  WARNING = 'WARNING',
  ERROR = 'ERROR',
  CRITICAL = 'CRITICAL',
}

export type AuditAction =
  | 'USER_CREATED'
  | 'USER_UPDATED'
  | 'USER_DELETED'
  | 'USER_ACTIVATED'
  | 'USER_DEACTIVATED'
  | 'PENDING_USER_CREATED'
  | 'PENDING_USER_DELETED'
  | 'ENROLLMENT_CREATED'
  | 'ENROLLMENT_BATCH_CREATED'
  | 'ENROLLMENT_REMOVED'
  | 'GRADE_CREATED'
  | 'GRADE_UPDATED'
  | 'GRADES_PUBLISHED'
  | 'GRADE_CONFLICT_RESOLVED'
  | 'SUBJECT_CREATED'
  | 'SUBJECT_UPDATED'
  | 'SUBJECT_DELETED'
  | 'ANNOUNCEMENT_CREATED'
  | 'ANNOUNCEMENT_DELETED'
  | 'FACULTY_CREATED'
  | 'FACULTY_UPDATED'
  | 'FACULTY_DELETED'
  | 'LOGIN_SUCCESS'
  | 'LOGIN_FAILED'
  | 'LOGOUT'
  | 'ROLE_CHECK_FAILED'
  | string;

export type AuditQueryOptions = {
  userId?: string;
  action?: AuditAction;
  targetId?: string;
  level?: AuditLevel;
  startDate?: number;
  endDate?: number;
  limit?: number;
  offset?: number;
};

export type AuditEntry = {
  id: string;
  userId: string;
  action: AuditAction;
  targetId: string;
  level: AuditLevel;
  metadata: Record<string, any>;
  timestamp: number;
};

// ─── Audit Module ────────────────────────────────────────────────────────────

export const AuditModule = {
  /**
   * Log an audit event.
   * Fire-and-forget: returns immediately, does not block the caller.
   */
  log: (
    userId: string,
    action: AuditAction,
    targetId: string,
    metadata?: Record<string, any>,
    level: AuditLevel = AuditLevel.INFO,
  ): void => {
    Repository.addDoc<AuditLog>(COLLECTIONS.LOGS, {
      userId,
      action,
      targetId,
      level,
      metadata: metadata ?? {},
      createdAt: Date.now(),
    }).catch(() => {});
  },

  /**
   * Log with explicit level.
   */
  logWithLevel: (
    userId: string,
    action: AuditAction,
    targetId: string,
    level: AuditLevel,
    metadata?: Record<string, any>,
  ): void => {
    AuditModule.log(userId, action, targetId, metadata, level);
  },

  /**
   * Query audit logs with filters.
   */
  query: async (options: AuditQueryOptions): Promise<AuditEntry[]> => {
    const whereConstraints: { field: string; op: '==' | '>=' | '<='; value: any }[] = [];

    if (options.userId) {
      whereConstraints.push({ field: 'userId', op: '==', value: options.userId });
    }
    if (options.action) {
      whereConstraints.push({ field: 'action', op: '==', value: options.action });
    }
    if (options.targetId) {
      whereConstraints.push({ field: 'targetId', op: '==', value: options.targetId });
    }
    if (options.level) {
      whereConstraints.push({ field: 'level', op: '==', value: options.level });
    }
    if (options.startDate) {
      whereConstraints.push({ field: 'createdAt', op: '>=', value: options.startDate });
    }
    if (options.endDate) {
      whereConstraints.push({ field: 'createdAt', op: '<=', value: options.endDate });
    }

    return Repository.query<AuditEntry>(COLLECTIONS.LOGS, {
      where: whereConstraints.length > 0 ? whereConstraints : undefined,
      orderBy: [{ field: 'createdAt', direction: 'desc' }],
      limit: options.limit ?? 50,
    });
  },

  /**
   * Get all logs for a specific user.
   */
  getByUser: async (userId: string, limit: number = 50): Promise<AuditEntry[]> => {
    return AuditModule.query({ userId, limit });
  },

  /**
   * Get all logs for a specific action type.
   */
  getByAction: async (action: AuditAction, limit: number = 50): Promise<AuditEntry[]> => {
    return AuditModule.query({ action, limit });
  },

  /**
   * Get logs for a specific entity (target).
   */
  getByTarget: async (targetId: string, limit: number = 50): Promise<AuditEntry[]> => {
    return AuditModule.query({ targetId, limit });
  },

  /**
   * Get recent logs.
   */
  getRecent: async (limit: number = 50): Promise<AuditEntry[]> => {
    return AuditModule.query({ limit });
  },

  /**
   * Get error and critical logs.
   */
  getErrors: async (limit: number = 50): Promise<AuditEntry[]> => {
    const errors = await AuditModule.query({ level: AuditLevel.ERROR, limit });
    const criticals = await AuditModule.query({ level: AuditLevel.CRITICAL, limit });
    return [...errors, ...criticals].sort((a, b) => b.timestamp - a.timestamp).slice(0, limit);
  },

  /**
   * Export logs as CSV string.
   */
  exportCSV: async (options?: AuditQueryOptions): Promise<string> => {
    const logs = await AuditModule.query({ ...options, limit: 10000 });
    const header = 'Timestamp,User ID,Action,Target ID,Level,Metadata\n';
    const rows = logs.map(log => {
      const date = new Date(log.timestamp).toISOString();
      const metadata = JSON.stringify(log.metadata).replace(/"/g, '""');
      return `${date},${log.userId},${log.action},${log.targetId},${log.level},"${metadata}"`;
    }).join('\n');
    return header + rows;
  },

  /**
   * Count logs matching a query.
   */
  count: async (options?: AuditQueryOptions): Promise<number> => {
    const whereConstraints: { field: string; op: '==' | '>=' | '<='; value: any }[] = [];

    if (options?.userId) {
      whereConstraints.push({ field: 'userId', op: '==', value: options.userId });
    }
    if (options?.action) {
      whereConstraints.push({ field: 'action', op: '==', value: options.action });
    }

    return Repository.count(COLLECTIONS.LOGS, {
      where: whereConstraints.length > 0 ? whereConstraints : undefined,
    });
  },
};

// ─── Backward Compatibility ──────────────────────────────────────────────────

/**
 * LogService — backward-compatible wrapper around AuditModule.
 * Existing code can continue using LogService while new code uses AuditModule directly.
 */
export const LogService = {
  logAction: (
    userId: string,
    action: string,
    targetId: string,
    metadata?: Record<string, any>,
  ): void => {
    AuditModule.log(userId, action, targetId, metadata);
  },

  create: async (data: Omit<AuditLog, 'id' | 'createdAt'>): Promise<void> => {
    AuditModule.log(data.userId, data.action, data.targetId, data.metadata);
  },

  getAll: async (maxLimit = 50): Promise<AuditEntry[]> => {
    return AuditModule.getRecent(maxLimit);
  },

  getByUser: async (userId: string): Promise<AuditEntry[]> => {
    return AuditModule.getByUser(userId);
  },
};
