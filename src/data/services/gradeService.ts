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
  limit,
  writeBatch,
  serverTimestamp,
} from '@data/firebase';
import { COLLECTIONS } from '@core/constants/collections';
import { Grade } from '@domain/types';
import { mapDoc } from '@core/utils/firestore';
import { LogService } from './logService';

export const GradeService = {
  getBySubject: async (subjectId: string) => {
    const db = getFirestore();
    const q = query(
      collection(db, COLLECTIONS.GRADES),
      where('subjectId', '==', subjectId),
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => mapDoc<Grade>(d.id, d.data()));
  },

  getByStudent: async (studentId: string) => {
    const db = getFirestore();
    const q = query(
      collection(db, COLLECTIONS.GRADES),
      where('studentId', '==', studentId),
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => mapDoc<Grade>(d.id, d.data()));
  },

  getById: async (id: string) => {
    const db = getFirestore();
    const d = await getDoc(doc(db, COLLECTIONS.GRADES, id));
    if (!d.exists()) return null;
    return mapDoc<Grade>(d.id, d.data());
  },

  save: async (data: Omit<Grade, 'id' | 'createdAt' | 'updatedAt' | 'conflictFlag' | 'updatedBy'>, teacherId: string) => {
    const db = getFirestore();
    const existing = await getDocs(query(
      collection(db, COLLECTIONS.GRADES),
      where('studentId', '==', data.studentId),
      where('subjectId', '==', data.subjectId),
      limit(1),
    ));

    if (!existing.empty) {
      const existingDoc = existing.docs[0];
      const existingData = existingDoc.data() as Grade;
      const conflictFlag = existingData.isPublished;

      await updateDoc(doc(db, COLLECTIONS.GRADES, existingDoc.id), {
        testScore: data.testScore,
        examScore: data.examScore,
        isPublished: data.isPublished,
        conflictFlag,
        updatedBy: teacherId,
        updatedAt: serverTimestamp(),
      });
      LogService.logAction(teacherId, 'GRADE_UPDATED', existingDoc.id, { studentId: data.studentId, subjectId: data.subjectId });
      return existingDoc.id;
    }

    const ref = await addDoc(collection(db, COLLECTIONS.GRADES), {
      ...data,
      conflictFlag: false,
      updatedBy: teacherId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    LogService.logAction(teacherId, 'GRADE_CREATED', ref.id, { studentId: data.studentId, subjectId: data.subjectId });
    return ref.id;
  },

  publishBySubject: async (subjectId: string) => {
    const db = getFirestore();
    const q = query(
      collection(db, COLLECTIONS.GRADES),
      where('subjectId', '==', subjectId),
    );
    const snap = await getDocs(q);
    const batch = writeBatch(db);
    snap.docs.forEach(d => {
      batch.update(doc(db, COLLECTIONS.GRADES, d.id), { isPublished: true, updatedAt: serverTimestamp() });
    });
    await batch.commit();
    LogService.logAction('', 'GRADES_PUBLISHED', subjectId, { count: snap.size });
  },

  resolveConflict: async (gradeId: string, teacherId: string) => {
    const db = getFirestore();
    await updateDoc(doc(db, COLLECTIONS.GRADES, gradeId), {
      conflictFlag: false,
      updatedBy: teacherId,
      updatedAt: serverTimestamp(),
    });
    LogService.logAction(teacherId, 'GRADE_CONFLICT_RESOLVED', gradeId);
  },
};
