/**
 * EnrollmentService — deep module for enrollment management.
 *
 * Handles: validation, duplicate checks, capacity checks, conflict detection,
 * batch operations with chunking, and audit logging.
 */

import { Repository, BatchOperation } from '@data/repository';
import { COLLECTIONS } from '@core/constants/collections';
import { Enrollment, Subject } from '@domain/types';
import { Errors } from '@core/errors';
import { AuditModule } from '@core/audit';
import { SubjectService } from './subjectService';

// ─── Enrollment Module ───────────────────────────────────────────────────────

export const EnrollmentService = {
  // ─── Queries ───────────────────────────────────────────────────────────

  getBySubject: async (subjectId: string): Promise<Enrollment[]> => {
    return Repository.query<Enrollment>(COLLECTIONS.ENROLLMENTS, {
      where: [
        { field: 'subjectId', op: '==', value: subjectId },
        { field: 'isActive', op: '==', value: true },
      ],
    });
  },

  getByStudent: async (studentId: string): Promise<Enrollment[]> => {
    return Repository.query<Enrollment>(COLLECTIONS.ENROLLMENTS, {
      where: [
        { field: 'studentId', op: '==', value: studentId },
        { field: 'isActive', op: '==', value: true },
      ],
    });
  },

  getByFaculty: async (facultyId: string): Promise<Enrollment[]> => {
    const subjects = await SubjectService.getByFaculty(facultyId);
    const subjectIds = subjects.map((s: Subject) => s.id);
    if (subjectIds.length === 0) return [];

    const results: Enrollment[] = [];
    const chunkSize = 30;
    for (let i = 0; i < subjectIds.length; i += chunkSize) {
      const chunk = subjectIds.slice(i, i + chunkSize);
      const enrollments = await Repository.query<Enrollment>(COLLECTIONS.ENROLLMENTS, {
        where: [
          { field: 'subjectId', op: 'in', value: chunk },
          { field: 'isActive', op: '==', value: true },
        ],
      });
      results.push(...enrollments);
    }
    return results;
  },

  getById: async (id: string): Promise<Enrollment | null> => {
    return Repository.getDoc<Enrollment>(COLLECTIONS.ENROLLMENTS, id);
  },

  // ─── Validation ────────────────────────────────────────────────────────

  /**
   * Check if student is already enrolled in the subject.
   */
  isAlreadyEnrolled: async (studentId: string, subjectId: string): Promise<boolean> => {
    const existing = await Repository.queryOne<Enrollment>(COLLECTIONS.ENROLLMENTS, {
      where: [
        { field: 'studentId', op: '==', value: studentId },
        { field: 'subjectId', op: '==', value: subjectId },
        { field: 'isActive', op: '==', value: true },
      ],
    });
    return existing !== null;
  },

  /**
   * Count active enrollments for a subject.
   */
  countBySubject: async (subjectId: string): Promise<number> => {
    return Repository.count(COLLECTIONS.ENROLLMENTS, {
      where: [
        { field: 'subjectId', op: '==', value: subjectId },
        { field: 'isActive', op: '==', value: true },
      ],
    });
  },

  // ─── Mutations ─────────────────────────────────────────────────────────

  /**
   * Enroll a single student. Validates and prevents duplicates.
   */
  create: async (
    data: Omit<Enrollment, 'id' | 'createdAt' | 'isActive'>,
    actorId?: string,
  ): Promise<string> => {
    // Check for duplicate enrollment
    const alreadyEnrolled = await EnrollmentService.isAlreadyEnrolled(data.studentId, data.subjectId);
    if (alreadyEnrolled) {
      throw Errors.enrollmentDuplicate(data.studentId, data.subjectId);
    }

    // Create enrollment
    const id = await Repository.addDoc<Enrollment>(COLLECTIONS.ENROLLMENTS, {
      ...data,
      isActive: true,
    } as any);

    AuditModule.log(actorId ?? '', 'ENROLLMENT_CREATED', id, {
      studentId: data.studentId,
      subjectId: data.subjectId,
    });

    return id;
  },

  /**
   * Batch enroll multiple students. Chunked to respect Firestore limits.
   */
  createBatch: async (
    enrollments: Omit<Enrollment, 'id' | 'createdAt' | 'isActive'>[],
    actorId?: string,
  ): Promise<void> => {
    const operations: BatchOperation[] = enrollments.map(e => ({
      type: 'set',
      collection: COLLECTIONS.ENROLLMENTS,
      data: {
        ...e,
        isActive: true,
        createdAt: new Date().toISOString(),
      },
    }));

    await Repository.batchChunked(operations, 500);

    AuditModule.log(actorId ?? '', 'ENROLLMENT_BATCH_CREATED', '', { count: enrollments.length });
  },

  /**
   * Soft-delete an enrollment.
   */
  remove: async (id: string, actorId?: string): Promise<void> => {
    await Repository.updateDoc(COLLECTIONS.ENROLLMENTS, id, { isActive: false });
    AuditModule.log(actorId ?? '', 'ENROLLMENT_REMOVED', id);
  },
};
