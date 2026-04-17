import { db } from './firebase';
import { doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, collection, query, where } from '@react-native-firebase/firestore';
import { COLLECTIONS } from '@core/constants/collections';
import { User, Faculty, Subject, Enrollment, UserRole } from '@domain/types';

// ============ Faculty Service ============
export const facultyService = {
  create: async (name: string, deanId: string): Promise<Faculty> => {
    const ref = doc(collection(db, COLLECTIONS.FACULTIES));
    const faculty: Faculty = {
      id: ref.id,
      name,
      deanId,
      createdAt: Date.now(),
    };
    await setDoc(ref, faculty);
    return faculty;
  },

  getAll: async (): Promise<Faculty[]> => {
    const snapshot = await getDocs(collection(db, COLLECTIONS.FACULTIES));
    return snapshot.docs.map((d: any) => ({ id: d.id, ...d.data() } as Faculty));
  },

  getById: async (id: string): Promise<Faculty | null> => {
    const docSnap = await getDoc(doc(db, COLLECTIONS.FACULTIES, id));
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } as Faculty : null;
  },

  update: async (id: string, data: Partial<Faculty>): Promise<void> => {
    await updateDoc(doc(db, COLLECTIONS.FACULTIES, id), data);
  },

  delete: async (id: string): Promise<void> => {
    await deleteDoc(doc(db, COLLECTIONS.FACULTIES, id));
  },
};

// ============ Subject Service ============
export const subjectService = {
  create: async (data: Omit<Subject, 'id' | 'createdAt'>): Promise<Subject> => {
    const ref = doc(collection(db, COLLECTIONS.SUBJECTS));
    const subject: Subject = {
      id: ref.id,
      ...data,
      createdAt: Date.now(),
    };
    await setDoc(ref, subject);
    return subject;
  },

  getByFaculty: async (facultyId: string): Promise<Subject[]> => {
    const q = query(collection(db, COLLECTIONS.SUBJECTS), where('facultyId', '==', facultyId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d: any) => ({ id: d.id, ...d.data() } as Subject));
  },

  getById: async (id: string): Promise<Subject | null> => {
    const docSnap = await getDoc(doc(db, COLLECTIONS.SUBJECTS, id));
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } as Subject : null;
  },

  assignTeacher: async (subjectId: string, teacherId: string): Promise<void> => {
    await updateDoc(doc(db, COLLECTIONS.SUBJECTS, subjectId), { teacherId });
  },

  delete: async (id: string): Promise<void> => {
    await deleteDoc(doc(db, COLLECTIONS.SUBJECTS, id);
  },
};

// ============ User Management (for Dean) ============
export const userManagementService = {
  createPendingUser: async (
    name: string,
    role: UserRole,
    facultyId: string,
    createdBy: string
  ): Promise<string> => {
    const ref = doc(collection(db, COLLECTIONS.PENDING_USERS));
    const pendingId = ref.id;
    await setDoc(ref, {
      id: pendingId,
      name,
      role,
      facultyId,
      createdBy,
      isRegistered: false,
      createdAt: Date.now(),
    });
    return pendingId;
  },

  getPendingUsers: async (facultyId: string): Promise<any[]> => {
    const q = query(
      collection(db, COLLECTIONS.PENDING_USERS), 
      where('facultyId', '==', facultyId)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d: any) => ({ id: d.id, ...d.data() }));
  },

  getTeachers: async (facultyId: string): Promise<User[]> => {
    const q = query(
      collection(db, COLLECTIONS.USERS), 
      where('role', '==', 'teacher'),
      where('facultyId', '==', facultyId)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d: any) => ({ id: d.id, ...d.data() } as User));
  },

  getStudents: async (facultyId: string): Promise<User[]> => {
    const q = query(
      collection(db, COLLECTIONS.USERS), 
      where('role', '==', 'student'),
      where('facultyId', '==', facultyId)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d: any) => ({ id: d.id, ...d.data() } as User));
  },
};

// ============ Enrollment Service ============
export const enrollmentService = {
  enroll: async (studentId: string, subjectId: string, academicYearId: string, semesterId: string): Promise<Enrollment> => {
    const ref = doc(collection(db, COLLECTIONS.ENROLLMENTS));
    const enrollment: Enrollment = {
      id: ref.id,
      studentId,
      subjectId,
      academicYearId,
      semesterId,
      isActive: true,
      createdAt: Date.now(),
    };
    await setDoc(ref, enrollment);
    return enrollment;
  },

  enrollBulk: async (enrollments: Omit<Enrollment, 'id' | 'createdAt'>[]): Promise<void> => {
    for (const e of enrollments) {
      const ref = doc(collection(db, COLLECTIONS.ENROLLMENTS));
      await setDoc(ref, { id: ref.id, ...e, createdAt: Date.now() });
    }
  },

  getBySubject: async (subjectId: string): Promise<Enrollment[]> => {
    const q = query(collection(db, COLLECTIONS.ENROLLMENTS), where('subjectId', '==', subjectId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d: any) => ({ id: d.id, ...d.data() } as Enrollment));
  },

  getByStudent: async (studentId: string): Promise<Enrollment[]> => {
    const q = query(collection(db, COLLECTIONS.ENROLLMENTS), where('studentId', '==', studentId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d: any) => ({ id: d.id, ...d.data() } as Enrollment));
  },

  // Create pending user for CSV import
  enrollStudent: async (
    email: string,
    name: string,
    facultyId: string,
    createdBy: string
  ): Promise<void> => {
    const ref = doc(collection(db, COLLECTIONS.PENDING_USERS));
    await setDoc(ref, {
      id: ref.id,
      email,
      name,
      role: 'student',
      facultyId,
      createdBy,
      isRegistered: false,
      createdAt: Date.now(),
    });
  },
};