import { db } from './firebase';
import {
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  collection,
  query,
} from '@react-native-firebase/firestore';
import { COLLECTIONS } from '@core/constants/collections';
import { AuditLog } from '@domain/types';

// ============ Audit Log Service ============
export const auditLogService = {
  log: async (
    userId: string,
    action: string,
    targetId: string,
    metadata: Record<string, any> = {},
  ): Promise<void> => {
    const ref = doc(collection(db, COLLECTIONS.LOGS));
    const log: AuditLog = {
      id: ref.id,
      userId,
      action,
      targetId,
      metadata,
      createdAt: Date.now(),
    };
    await setDoc(ref, log);
  },

  getByUser: async (
    userId: string,
    limit: number = 50,
  ): Promise<AuditLog[]> => {
    const q = query(collection(db, COLLECTIONS.LOGS));
    const snapshot = await getDocs(q);
    const logs = snapshot.docs
      .map((d: any) => ({ id: d.id, ...d.data() }) as AuditLog)
      .filter(l => l.userId === userId)
      .slice(0, limit);
    return logs;
  },

  getAll: async (limit: number = 100): Promise<AuditLog[]> => {
    const snapshot = await getDocs(collection(db, COLLECTIONS.LOGS));
    return snapshot.docs
      .map((d: any) => ({ id: d.id, ...d.data() }) as AuditLog)
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, limit);
  },
};

// ============ Backup Service ============
export const backupService = {
  createBackup: async (): Promise<{ id: string; createdAt: number }> => {
    const ref = doc(collection(db, 'backups'));
    const backup = {
      id: ref.id,
      createdAt: Date.now(),
      // In production, you'd export all collections to JSON and store
    };
    await setDoc(ref, backup);
    return backup;
  },

  getBackups: async (): Promise<any[]> => {
    const snapshot = await getDocs(collection(db, 'backups'));
    return snapshot.docs.map((d: any) => ({ id: d.id, ...d.data() }));
  },

  restoreBackup: async (backupId: string): Promise<void> => {
    // In production, implement restore logic
  },
};
