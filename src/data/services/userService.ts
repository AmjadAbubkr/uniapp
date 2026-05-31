/**
 * UserService — deep module for user management.
 *
 * Handles: validation, duplicate checks, role enforcement, audit logging.
 * All user operations go through this module. Screens depend on its interface.
 */

import { Repository } from '@data/repository';
import { COLLECTIONS } from '@core/constants/collections';
import { User, PendingUser, UserRole } from '@domain/types';
import { Errors } from '@core/errors';
import { AuditModule } from '@core/audit';

// ─── Validation ──────────────────────────────────────────────────────────────

function validateUser(data: { name?: string; email?: string; role?: UserRole }): void {
  if (data.name !== undefined && (!data.name || data.name.trim().length < 2)) {
    throw Errors.validationError('Name must be at least 2 characters');
  }
  if (data.email !== undefined) {
    if (!data.email || !data.email.includes('@')) {
      throw Errors.validationError('Invalid email address');
    }
  }
  if (data.role !== undefined && !Object.values(UserRole).includes(data.role)) {
    throw Errors.userInvalidRole(data.role);
  }
}

function generateInvitationCode(role: UserRole): string {
  const prefix = role === UserRole.STUDENT ? 'STU' : role === UserRole.TEACHER ? 'TCH' : role === UserRole.DEAN ? 'DEA' : 'ADM';
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 4; i++) code += chars.charAt(Math.floor(Math.random() * chars.length));
  return `${prefix}-${code}`;
}

// ─── User Module ─────────────────────────────────────────────────────────────

export const UserService = {
  // ─── Queries ───────────────────────────────────────────────────────────

  getUser: async (uid: string): Promise<User | null> => {
    return Repository.getDoc<User>(COLLECTIONS.USERS, uid);
  },

  getUserOrThrow: async (uid: string): Promise<User> => {
    const user = await UserService.getUser(uid);
    if (!user) throw Errors.userNotFound(uid);
    return user;
  },

  getAllUsers: async (): Promise<User[]> => {
    return Repository.query<User>(COLLECTIONS.USERS);
  },

  getAllDeans: async (): Promise<User[]> => {
    return Repository.query<User>(COLLECTIONS.USERS, {
      where: [{ field: 'role', op: '==', value: UserRole.DEAN }],
    });
  },

  getFacultyUsers: async (facultyId: string, role?: UserRole, activeOnly: boolean = true): Promise<User[]> => {
    const constraints: { field: string; op: '=='; value: any }[] = [
      { field: 'facultyId', op: '==', value: facultyId },
    ];
    if (activeOnly) {
      constraints.push({ field: 'isActive', op: '==', value: true });
    }
    if (role) {
      constraints.push({ field: 'role', op: '==', value: role });
    }
    return Repository.query<User>(COLLECTIONS.USERS, { where: constraints });
  },

  searchUsers: async (namePrefix: string, facultyId?: string): Promise<User[]> => {
    const nameLower = namePrefix.toLowerCase();
    const nameEnd = nameLower.slice(0, -1) + String.fromCharCode(nameLower.charCodeAt(nameLower.length - 1) + 1);
    const constraints: { field: string; op: '>=' | '<'; value: any }[] = [
      { field: 'nameLower', op: '>=', value: nameLower },
      { field: 'nameLower', op: '<', value: nameEnd },
    ];
    if (facultyId) {
      constraints.push({ field: 'facultyId', op: '==', value: facultyId });
    }
    return Repository.query<User>(COLLECTIONS.USERS, { where: constraints as any });
  },

  getUsersByIds: async (ids: string[]): Promise<Record<string, User>> => {
    if (ids.length === 0) return {};
    const uniqueIds = [...new Set(ids)];
    const result: Record<string, User> = {};
    const chunkSize = 30;
    for (let i = 0; i < uniqueIds.length; i += chunkSize) {
      const chunk = uniqueIds.slice(i, i + chunkSize);
      const users = await Repository.query<User>(COLLECTIONS.USERS, {
        where: [{ field: '__name__', op: 'in', value: chunk }],
      });
      users.forEach(u => { result[u.id] = u; });
    }
    return result;
  },

  // ─── Mutations ─────────────────────────────────────────────────────────

  toggleActive: async (uid: string, isActive: boolean, actorId: string): Promise<void> => {
    await Repository.updateDoc(COLLECTIONS.USERS, uid, { isActive });
    AuditModule.log(actorId, isActive ? 'USER_ACTIVATED' : 'USER_DEACTIVATED', uid);
  },

  createPendingUser: async (
    data: Omit<PendingUser, 'id' | 'isRegistered' | 'invitationCode'>,
    createdByUid: string,
  ): Promise<{ id: string; invitationCode: string }> => {
    // Validate
    validateUser({ name: data.name, email: data.email, role: data.role });

    // Check for duplicate email
    const existing = await Repository.queryOne<PendingUser>(COLLECTIONS.PENDING_USERS, {
      where: [{ field: 'email', op: '==', value: data.email }],
    });
    if (existing) {
      throw Errors.userDuplicateEmail(data.email);
    }

    // Create
    const invitationCode = generateInvitationCode(data.role);
    const id = await Repository.addDoc<PendingUser>(COLLECTIONS.PENDING_USERS, {
      ...data,
      invitationCode,
      isRegistered: false,
      createdBy: createdByUid,
    } as any);

    AuditModule.log(createdByUid, 'PENDING_USER_CREATED', id, { role: data.role, name: data.name });
    return { id, invitationCode };
  },

  getPendingUserByCode: async (code: string): Promise<PendingUser | null> => {
    return Repository.queryOne<PendingUser>(COLLECTIONS.PENDING_USERS, {
      where: [
        { field: 'invitationCode', op: '==', value: code.toUpperCase() },
        { field: 'isRegistered', op: '==', value: false },
      ],
      limit: 1,
    });
  },

  getPendingUsers: async (facultyId: string): Promise<PendingUser[]> => {
    return Repository.query<PendingUser>(COLLECTIONS.PENDING_USERS, {
      where: [
        { field: 'facultyId', op: '==', value: facultyId },
        { field: 'isRegistered', op: '==', value: false },
      ],
    });
  },

  getAllPendingUsers: async (): Promise<PendingUser[]> => {
    return Repository.query<PendingUser>(COLLECTIONS.PENDING_USERS, {
      where: [{ field: 'isRegistered', op: '==', value: false }],
    });
  },

  deletePendingUser: async (id: string, actorId?: string): Promise<void> => {
    await Repository.deleteDoc(COLLECTIONS.PENDING_USERS, id);
    AuditModule.log(actorId ?? '', 'PENDING_USER_DELETED', id);
  },
};
