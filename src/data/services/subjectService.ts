import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  query,
  where,
  serverTimestamp,
} from '@data/firebase';
import { COLLECTIONS } from '@core/constants/collections';
import { Subject } from '@domain/types';
import { mapDoc } from '@core/utils/firestore';
import { LogService } from './logService';

export const SubjectService = {
  getByFaculty: async (facultyId: string) => {
    const db = getFirestore();
    const q = query(
      collection(db, COLLECTIONS.SUBJECTS),
      where('facultyId', '==', facultyId),
      where('isActive', '==', true),
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => mapDoc<Subject>(d.id, d.data()));
  },

  getByTeacher: async (teacherId: string) => {
    const db = getFirestore();
    const q = query(
      collection(db, COLLECTIONS.SUBJECTS),
      where('teacherId', '==', teacherId),
      where('isActive', '==', true),
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => mapDoc<Subject>(d.id, d.data()));
  },

  getById: async (id: string) => {
    const db = getFirestore();
    const d = await getDoc(doc(db, COLLECTIONS.SUBJECTS, id));
    if (!d.exists()) return null;
    return mapDoc<Subject>(d.id, d.data());
  },

  create: async (data: Omit<Subject, 'id' | 'createdAt'>) => {
    const db = getFirestore();
    const ref = await addDoc(collection(db, COLLECTIONS.SUBJECTS), {
      ...data,
      createdAt: serverTimestamp(),
    });
    LogService.logAction(data.teacherId ?? '', 'SUBJECT_CREATED', ref.id, { title: data.title });
    return ref.id;
  },

  update: async (id: string, data: Partial<Subject>) => {
    const db = getFirestore();
    await updateDoc(doc(db, COLLECTIONS.SUBJECTS, id), data);
    LogService.logAction('', 'SUBJECT_UPDATED', id);
  },

  delete: async (id: string) => {
    const db = getFirestore();
    await updateDoc(doc(db, COLLECTIONS.SUBJECTS, id), { isActive: false });
    LogService.logAction('', 'SUBJECT_DELETED', id);
  },

  getSubjectsByIds: async (ids: string[]): Promise<Record<string, Subject>> => {
    if (ids.length === 0) return {};
    const db = getFirestore();
    const uniqueIds = [...new Set(ids)];
    const result: Record<string, Subject> = {};
    const chunkSize = 30;
    for (let i = 0; i < uniqueIds.length; i += chunkSize) {
      const chunk = uniqueIds.slice(i, i + chunkSize);
      const q = query(collection(db, COLLECTIONS.SUBJECTS), where('__name__', 'in', chunk));
      const snap = await getDocs(q);
      snap.docs.forEach(d => { result[d.id] = mapDoc<Subject>(d.id, d.data()); });
    }
    return result;
  },
};
