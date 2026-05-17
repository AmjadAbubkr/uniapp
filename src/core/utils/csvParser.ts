import { UserRole } from '@domain/types';
import { UserService } from '@data/services';

export interface CSVRow {
  name: string;
  email: string;
  role: 'student' | 'teacher';
  subjectCode?: string;
}

export const parseCSV = (content: string): CSVRow[] => {
  const lines = content.trim().split('\n');
  if (lines.length < 2) return [];

  const headers = lines[0]
    .toLowerCase()
    .split(',')
    .map(h => h.trim());
  const nameIdx = headers.indexOf('name');
  const emailIdx = headers.indexOf('email');
  const roleIdx = headers.indexOf('role');
  const subjectIdx = headers.indexOf('subjectcode');

  if (nameIdx === -1 || emailIdx === -1 || roleIdx === -1) {
    throw new Error('CSV must have: name, email, role columns');
  }

  const rows: CSVRow[] = [];
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim());
    if (values.length >= 3) {
      rows.push({
        name: values[nameIdx],
        email: values[emailIdx],
        role: values[roleIdx] as 'student' | 'teacher',
        subjectCode: subjectIdx !== -1 ? values[subjectIdx] : undefined,
      });
    }
  }
  return rows;
};

export const importUsersFromCSV = async (
  rows: CSVRow[],
  facultyId: string,
  createdBy: string,
): Promise<{ success: number; failed: number }> => {
  let success = 0;
  let failed = 0;

  for (const row of rows) {
    try {
      const role = row.role === 'teacher' ? UserRole.TEACHER : UserRole.STUDENT;
      await UserService.createPendingUser({
        name: row.name,
        email: row.email,
        role,
        facultyId,
        createdBy,
      }, createdBy);
      success++;
    } catch {
      failed++;
    }
  }

  return { success, failed };
};
