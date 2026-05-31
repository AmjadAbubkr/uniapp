/**
 * FirestoreRepository — single seam for all Firestore access.
 *
 * All data access goes through this module. Services depend on its interface,
 * not on Firebase directly. This enables:
 * - One seam to test (mock the repository)
 * - Backend swap (replace Firebase with emulator or different provider)
 * - Concentrated query logic and error handling
 */

import {
  getFirestore,
  collection as fbCollection,
  doc as fbDoc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query as fbQuery,
  where as fbWhere,
  orderBy as fbOrderBy,
  limit as fbLimit,
  writeBatch as fbWriteBatch,
  serverTimestamp,
} from '@data/firebase';
import { COLLECTIONS } from '@core/constants/collections';
import { mapDoc } from '@core/utils/firestore';

// ─── Types ───────────────────────────────────────────────────────────────────

export type WhereConstraint = {
  field: string;
  op: '==' | '!=' | '<' | '<=' | '>' | '>=' | 'in' | 'array-contains';
  value: any;
};

export type OrderByConstraint = {
  field: string;
  direction: 'asc' | 'desc';
};

export type QueryOptions = {
  where?: WhereConstraint[];
  orderBy?: OrderByConstraint[];
  limit?: number;
};

export type BatchOperation = {
  type: 'set' | 'update' | 'delete';
  collection: COLLECTIONS;
  id?: string;
  data?: Record<string, any>;
  options?: { merge?: boolean };
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getCollectionPath(col: COLLECTIONS): string {
  return col as unknown as string;
}

function buildQuery(collectionPath: string, options?: QueryOptions) {
  const db = getFirestore();
  let q: any = fbCollection(db, collectionPath);

  if (options?.where) {
    const constraints = options.where.map(c => fbWhere(c.field, c.op, c.value));
    q = fbQuery(q, ...constraints);
  }

  if (options?.orderBy) {
    const orders = options.orderBy.map(o => fbOrderBy(o.field, o.direction));
    q = fbQuery(q, ...orders);
  }

  if (options?.limit) {
    q = fbQuery(q, fbLimit(options.limit));
  }

  return q;
}

// ─── Repository ──────────────────────────────────────────────────────────────

export const Repository = {
  // ─── Single Document ─────────────────────────────────────────────────────

  getDoc: async <T>(collection: COLLECTIONS, id: string): Promise<T | null> => {
    const db = getFirestore();
    const snap = await getDoc(fbDoc(db, getCollectionPath(collection), id));
    if (!snap.exists()) return null;
    return mapDoc<T>(snap.id, snap.data() as Record<string, any>);
  },

  addDoc: async <T extends { id: string }>(
    collection: COLLECTIONS,
    data: Omit<T, 'id'>,
  ): Promise<string> => {
    const db = getFirestore();
    const ref = await addDoc(fbCollection(db, getCollectionPath(collection)), {
      ...data,
      createdAt: serverTimestamp(),
    });
    return ref.id;
  },

  setDoc: async (
    collection: COLLECTIONS,
    id: string,
    data: Record<string, any>,
    options?: { merge?: boolean },
  ): Promise<void> => {
    const db = getFirestore();
    const ref = fbDoc(db, getCollectionPath(collection), id);
    if (options?.merge) {
      await ref.set(data, { merge: true });
    } else {
      await ref.set(data);
    }
  },

  updateDoc: async (
    collection: COLLECTIONS,
    id: string,
    data: Record<string, any>,
  ): Promise<void> => {
    const db = getFirestore();
    await updateDoc(fbDoc(db, getCollectionPath(collection), id), data);
  },

  deleteDoc: async (collection: COLLECTIONS, id: string): Promise<void> => {
    const db = getFirestore();
    await deleteDoc(fbDoc(db, getCollectionPath(collection), id));
  },

  // ─── Queries ─────────────────────────────────────────────────────────────

  query: async <T>(
    collection: COLLECTIONS,
    options?: QueryOptions,
  ): Promise<T[]> => {
    const collectionPath = getCollectionPath(collection);
    const q = buildQuery(collectionPath, options);
    const snap = await getDocs(q);
    return snap.docs.map(d => mapDoc<T>(d.id, d.data() as Record<string, any>));
  },

  queryOne: async <T>(
    collection: COLLECTIONS,
    options?: QueryOptions,
  ): Promise<T | null> => {
    const results = await Repository.query<T>(collection, {
      ...options,
      limit: 1,
    });
    return results[0] ?? null;
  },

  exists: async (
    collection: COLLECTIONS,
    options?: QueryOptions,
  ): Promise<boolean> => {
    const result = await Repository.queryOne(collection, options);
    return result !== null;
  },

  count: async (
    collection: COLLECTIONS,
    options?: QueryOptions,
  ): Promise<number> => {
    const collectionPath = getCollectionPath(collection);
    const q = buildQuery(collectionPath, options);
    const snap = await getDocs(q);
    return snap.size;
  },

  // ─── Batch Operations ────────────────────────────────────────────────────

  batch: async (operations: BatchOperation[]): Promise<void> => {
    const db = getFirestore();
    const batch = fbWriteBatch();

    for (const op of operations) {
      const ref = op.id
        ? fbDoc(db, getCollectionPath(op.collection), op.id)
        : fbDoc(fbCollection(db, getCollectionPath(op.collection)));

      switch (op.type) {
        case 'set':
          if (op.options?.merge) {
            batch.set(ref, op.data ?? {}, { merge: true });
          } else {
            batch.set(ref, op.data ?? {});
          }
          break;
        case 'update':
          batch.update(ref, op.data ?? {});
          break;
        case 'delete':
          batch.delete(ref);
          break;
      }
    }

    await batch.commit();
  },

  batchChunked: async (operations: BatchOperation[], chunkSize: number = 500): Promise<void> => {
    for (let i = 0; i < operations.length; i += chunkSize) {
      const chunk = operations.slice(i, i + chunkSize);
      await Repository.batch(chunk);
    }
  },

  // ─── Helpers ─────────────────────────────────────────────────────────────

  collection: (collection: COLLECTIONS) => {
    const db = getFirestore();
    return fbCollection(db, getCollectionPath(collection));
  },

  doc: (collection: COLLECTIONS, id?: string) => {
    const db = getFirestore();
    return fbDoc(db, getCollectionPath(collection), id);
  },

  serverTimestamp: () => serverTimestamp(),
};
