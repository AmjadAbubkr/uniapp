type TimestampLike = { toMillis: () => number; seconds: number; nanoseconds: number };

function toMillis(value: unknown): number {
  if (typeof value === 'number') return value;
  if (value && typeof value === 'object' && typeof (value as TimestampLike).toMillis === 'function') {
    return (value as TimestampLike).toMillis();
  }
  return 0;
}

const TIMESTAMP_KEYS = new Set(['createdAt', 'updatedAt', 'startDate', 'endDate', 'expiresAt']);

export function normalizeDoc<T>(raw: T): T {
  const out = { ...raw } as Record<string, unknown>;
  for (const key of TIMESTAMP_KEYS) {
    if (key in out && out[key] != null) {
      out[key] = toMillis(out[key]);
    }
  }
  return out as T;
}

export function mapDoc<T>(id: string, data: Record<string, any>): T {
  const out = { id, ...data } as Record<string, unknown>;
  for (const key of TIMESTAMP_KEYS) {
    if (key in out && out[key] != null) {
      out[key] = toMillis(out[key]);
    }
  }
  return out as T;
}
