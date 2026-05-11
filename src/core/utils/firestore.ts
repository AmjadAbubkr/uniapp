type TimestampLike = { toMillis: () => number; seconds: number; nanoseconds: number };

/**
 * Convert various timestamp-like inputs into a millisecond numeric timestamp.
 *
 * @param value - A value that may be a millisecond number or an object exposing a `toMillis` method; other values are unsupported.
 * @returns The millisecond timestamp represented by `value` if it can be interpreted, `0` otherwise.
 */
function toMillis(value: unknown): number {
  if (typeof value === 'number') return value;
  if (value && typeof value === 'object' && typeof (value as TimestampLike).toMillis === 'function') {
    return (value as TimestampLike).toMillis();
  }
  return 0;
}

const TIMESTAMP_KEYS = new Set(['createdAt', 'updatedAt', 'startDate', 'endDate', 'expiresAt']);

/**
 * Shallow-clones `raw` and converts known timestamp-like fields to millisecond numbers.
 *
 * The function preserves the input type `T` while replacing any of the keys
 * `createdAt`, `updatedAt`, `startDate`, `endDate`, and `expiresAt` (when present
 * and not null/undefined) with their millisecond representation.
 *
 * @param raw - The value to normalize; returned as a shallow-cloned `T`
 * @returns The input object typed as `T` with the listed timestamp fields converted to milliseconds; unsupported timestamp shapes become `0`
 */
export function normalizeDoc<T>(raw: T): T {
  const out = { ...raw } as Record<string, unknown>;
  for (const key of TIMESTAMP_KEYS) {
    if (key in out && out[key] != null) {
      out[key] = toMillis(out[key]);
    }
  }
  return out as T;
}

/**
 * Constructs an object with the provided `id` and the properties of `data`, converting known timestamp-like fields to millisecond numbers.
 *
 * @param id - The identifier to include on the resulting object
 * @param data - Optional source object whose properties will be copied; may be `undefined`
 * @returns An object containing `id` plus the properties from `data`, where any of the keys `createdAt`, `updatedAt`, `startDate`, `endDate`, and `expiresAt` present with non-null values are replaced by their millisecond representation
 */
export function mapDoc<T>(id: string, data: Record<string, any> | undefined): T {
  const out = { id, ...data } as Record<string, unknown>;
  for (const key of TIMESTAMP_KEYS) {
    if (key in out && out[key] != null) {
      out[key] = toMillis(out[key]);
    }
  }
  return out as T;
}
