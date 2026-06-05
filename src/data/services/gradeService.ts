/**
 * GradeService — deep module for grade management.
 *
 * Handles: score validation, conflict detection, publish workflow,
 * batch operations, and audit logging.
 */

import { Repository, BatchOperation } from '@data/repository';
import { COLLECTIONS } from '@core/constants/collections';
import { Grade } from '@domain/types';
import { Errors } from '@core/errors';
import { AuditModule } from '@core/audit';

// ─── Constants ───────────────────────────────────────────────────────────────

const MAX_TEST_SCORE = 20;
const MAX_EXAM_SCORE = 20;

// ─── Validation ──────────────────────────────────────────────────────────────

function validateScore(value: number, max: number, field: string): void {
  if (value < 0 || value > max) {
    throw Errors.gradeInvalidScore(field, value, max);
  }
}

function validateGradeData(data: { testScore: number; examScore: number }): void {
  validateScore(data.testScore, MAX_TEST_SCORE, 'testScore');
  validateScore(data.examScore, MAX_EXAM_SCORE, 'examScore');
}

// ─── Grade Module ────────────────────────────────────────────────────────────

export const GradeService = {
  // ─── Queries ───────────────────────────────────────────────────────────

  getBySubject: async (subjectId: string): Promise<Grade[]> => {
    return Repository.query<Grade>(COLLECTIONS.GRADES, {
      where: [{ field: 'subjectId', op: '==', value: subjectId }],
    });
  },

  getByStudent: async (studentId: string): Promise<Grade[]> => {
    return Repository.query<Grade>(COLLECTIONS.GRADES, {
      where: [{ field: 'studentId', op: '==', value: studentId }],
    });
  },

  getById: async (id: string): Promise<Grade | null> => {
    return Repository.getDoc<Grade>(COLLECTIONS.GRADES, id);
  },

  getGradeOrThrow: async (id: string): Promise<Grade> => {
    const grade = await GradeService.getById(id);
    if (!grade) throw Errors.notFound('Grade', id);
    return grade;
  },

  // ─── Mutations ─────────────────────────────────────────────────────────

  /**
   * Save (create or update) a grade for a student in a subject.
   * Detects conflicts when updating published grades.
   */
  save: async (
    data: Omit<Grade, 'id' | 'createdAt' | 'updatedAt' | 'conflictFlag' | 'updatedBy'>,
    teacherId: string,
  ): Promise<string> => {
    // Validate scores
    validateGradeData(data);

    // Check for existing grade
    const existing = await Repository.queryOne<Grade>(COLLECTIONS.GRADES, {
      where: [
        { field: 'studentId', op: '==', value: data.studentId },
        { field: 'subjectId', op: '==', value: data.subjectId },
      ],
      limit: 1,
    });

    if (existing) {
      // Detect conflict: updating a published grade
      const conflictFlag = existing.isPublished;

      await Repository.updateDoc(COLLECTIONS.GRADES, existing.id, {
        testScore: data.testScore,
        examScore: data.examScore,
        isPublished: data.isPublished,
        conflictFlag,
        updatedBy: teacherId,
        updatedAt: new Date().toISOString(),
      });

      AuditModule.log(teacherId, 'GRADE_UPDATED', existing.id, {
        studentId: data.studentId,
        subjectId: data.subjectId,
        conflict: conflictFlag,
      });

      return existing.id;
    }

    // Create new grade
    const id = await Repository.addDoc<Grade>(COLLECTIONS.GRADES, {
      ...data,
      conflictFlag: false,
      updatedBy: teacherId,
    } as any);

    AuditModule.log(teacherId, 'GRADE_CREATED', id, {
      studentId: data.studentId,
      subjectId: data.subjectId,
    });

    return id;
  },

  /**
   * Publish all grades for a subject.
   * Validates all grades exist and have scores before publishing.
   */
  publishBySubject: async (subjectId: string, actorId?: string): Promise<number> => {
    const grades = await GradeService.getBySubject(subjectId);

    if (grades.length === 0) {
      throw Errors.gradeNotPublishable(subjectId, 'No grades found for subject');
    }

    // Batch update all grades
    const operations: BatchOperation[] = grades.map(g => ({
      type: 'update',
      collection: COLLECTIONS.GRADES,
      id: g.id,
      data: {
        isPublished: true,
        updatedAt: new Date().toISOString(),
      },
    }));

    await Repository.batchChunked(operations, 500);

    AuditModule.log(actorId ?? '', 'GRADES_PUBLISHED', subjectId, { count: grades.length });
    return grades.length;
  },

  /**
   * Resolve a conflict flag on a grade.
   */
  resolveConflict: async (gradeId: string, teacherId: string): Promise<void> => {
    await Repository.updateDoc(COLLECTIONS.GRADES, gradeId, {
      conflictFlag: false,
      updatedBy: teacherId,
      updatedAt: new Date().toISOString(),
    });

    AuditModule.log(teacherId, 'GRADE_CONFLICT_RESOLVED', gradeId);
  },

  /**
   * Calculate total score for a grade.
   */
  getTotalScore: (grade: Grade): number => {
    return grade.testScore + grade.examScore;
  },

  /**
   * Calculate percentage score.
   */
  getPercentage: (grade: Grade): number => {
    const total = grade.testScore + grade.examScore;
    const maxTotal = MAX_TEST_SCORE + MAX_EXAM_SCORE;
    return Math.round((total / maxTotal) * 100);
  },
};
