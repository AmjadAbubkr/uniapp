import {
  getFirestore,
  collection,
  doc,
  addDoc,
  updateDoc,
  getDocs,
  query,
  orderBy,
  limit,
  serverTimestamp,
} from '@data/firebase';
import { COLLECTIONS } from '@core/constants/collections';
import { mapDoc } from '@core/utils/firestore';

export interface BackupMetadata {
  id: string;
  createdAt: number;
  collections: string[];
  status: 'pending' | 'completed' | 'failed';
}

export const BackupService = {
  create: async () => {
    const db = getFirestore();
    const backupId = `backup_${Date.now()}`;
    const ref = await addDoc(collection(db, 'backups'), {
      id: backupId,
      createdAt: serverTimestamp(),
      collections: Object.values(COLLECTIONS),
      status: 'pending',
    });

    try {
      const collectionNames = Object.values(COLLECTIONS);
      const backupData: Record<string, unknown[]> = {};

      for (const col of collectionNames) {
        const snap = await getDocs(collection(db, col));
        backupData[col] = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      }

      await updateDoc(doc(db, 'backups', ref.id), { status: 'completed', data: backupData });
      return backupId;
    } catch {
      await updateDoc(doc(db, 'backups', ref.id), { status: 'failed' });
      throw new Error('Backup failed');
    }
  },

  getAll: async () => {
    const db = getFirestore();
    const q = query(
      collection(db, 'backups'),
      orderBy('createdAt', 'desc'),
      limit(20),
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => mapDoc<BackupMetadata>(d.id, d.data()));
  },
};
