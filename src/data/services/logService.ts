/**
 * LogService — backward-compatible wrapper around AuditModule.
 *
 * Existing code can continue using LogService while new code uses AuditModule directly.
 * This maintains backward compatibility while the codebase transitions.
 */

import { AuditModule, AuditEntry, AuditQueryOptions } from '@core/audit';
import { AuditLog } from '@domain/types';

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

  getByAction: async (action: string, limit: number = 50): Promise<AuditEntry[]> => {
    return AuditModule.getByAction(action, limit);
  },

  getRecent: async (limit: number = 50): Promise<AuditEntry[]> => {
    return AuditModule.getRecent(limit);
  },

  getErrors: async (limit: number = 50): Promise<AuditEntry[]> => {
    return AuditModule.getErrors(limit);
  },

  query: async (options: AuditQueryOptions): Promise<AuditEntry[]> => {
    return AuditModule.query(options);
  },

  exportCSV: async (options?: AuditQueryOptions): Promise<string> => {
    return AuditModule.exportCSV(options);
  },

  count: async (options?: AuditQueryOptions): Promise<number> => {
    return AuditModule.count(options);
  },
};
