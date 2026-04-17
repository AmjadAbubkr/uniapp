export enum UserRole {
  ROOT_ADMIN = 'root_admin',
  DEAN = 'dean',
  TEACHER = 'teacher',
  STUDENT = 'student',
}

export const ROLE_DISPLAY_NAMES = {
  [UserRole.ROOT_ADMIN]: { ar: 'مشرف النظام', fr: 'Administrateur', en: 'Root Admin' },
  [UserRole.DEAN]: { ar: 'عميد', fr: 'Doyen', en: 'Dean' },
  [UserRole.TEACHER]: { ar: 'أستاذ', fr: 'Professeur', en: 'Teacher' },
  [UserRole.STUDENT]: { ar: 'طالب', fr: 'Étudiant', en: 'Student' },
};

export const ROLE_COLORS = {
  [UserRole.ROOT_ADMIN]: '#FF5755', // Crimson
  [UserRole.DEAN]: '#2A9BD4', // Sky Blue
  [UserRole.TEACHER]: '#F6BE39', // Amber Gold
  [UserRole.STUDENT]: '#4CAF50', // Green
};
