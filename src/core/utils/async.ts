export type TimeoutResult<T> =
  | { ok: true; value: T }
  | { ok: false; reason: 'timeout' | 'error'; error?: Error };

/**
 * Race a promise against a timeout and return a normalized `TimeoutResult`.
 *
 * @param promise - The promise to await.
 * @param ms - Timeout in milliseconds (default: 8000).
 * @returns A `TimeoutResult<T>`: `{ ok: true; value: T }` on fulfillment; `{ ok: false; reason: 'timeout' }` if the timeout elapses; `{ ok: false; reason: 'error', error?: Error }` if the promise rejects.
 */
export function withTimeout<T>(promise: Promise<T>, ms: number = 8000): Promise<TimeoutResult<T>> {
  let timer: ReturnType<typeof setTimeout>;
  return new Promise<TimeoutResult<T>>((resolve) => {
    timer = setTimeout(() => resolve({ ok: false, reason: 'timeout' }), ms);
    promise
      .then((value) => {
        clearTimeout(timer);
        resolve({ ok: true, value });
      })
      .catch((error) => {
        clearTimeout(timer);
        resolve({ ok: false, reason: 'error', error });
      });
  });
}

/**
 * Extracts the contained value when a TimeoutResult represents success.
 *
 * @param result - The TimeoutResult to unwrap
 * @returns `T` if `result.ok` is `true`, `null` otherwise
 */
export function unwrapResult<T>(result: TimeoutResult<T>): T | null {
  if (result.ok) return result.value;
  return null;
}
