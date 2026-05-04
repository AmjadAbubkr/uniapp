import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
} from '@data/firebase';
import { COLLECTIONS } from '@core/constants/collections';
import { AuditLog } from '@domain/types';
import { mapDoc } from '@core/utils/firestore';

export const LogService = {
  create: async (data: Omit<AuditLog, 'id' | 'createdAt'>) => {
    const db = getFirestore();
    await addDoc(collection(db, COLLECTIONS.LOGS), {
      ...data,
      createdAt: serverTimestamp(),
    });
  },

  logAction: (userId: string, action: string, targetId: string, metadata?: Record<string, any>) => {
    LogService.create({ userId, action, targetId, metadata: metadata ?? {} }).catch(() => {});
  },

  getAll: async (maxLimit = 50) => {
    const db = getFirestore();
    const q = query(
      collection(db, COLLECTIONS.LOGS),
      orderBy('createdAt', 'desc'),
      limit(maxLimit),
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => mapDoc<AuditLog>(d.id, d.data()));
  },

  getByUser: async (userId: string) => {
    const db = getFirestore();
    const q = query(
      collection(db, COLLECTIONS.LOGS),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => mapDoc<AuditLog>(d.id, d.data()));
  },
};
